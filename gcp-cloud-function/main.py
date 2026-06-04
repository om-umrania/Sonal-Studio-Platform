import os
import tempfile
import mimetypes
from pathlib import Path
from cloudevents.http import CloudEvent
import functions_framework
from google.cloud import storage
from PIL import Image
import numpy as np
from rembg import remove

# Set U2NET_HOME to a writable location in Cloud Functions before loading rembg/onnx
os.environ["U2NET_HOME"] = "/tmp/.u2net"

# Constants & Configurations
DEST_BUCKET_NAME = os.environ.get("DEST_BUCKET", "sonal-studio-catalog-ready")
GCP_LOCATION = os.environ.get("GCP_LOCATION", "us-central1")
TARGET_MODEL = os.environ.get("TARGET_MODEL", "imagen-3.0-capability-001")
BASE_SEED = int(os.environ.get("SEED", "42"))

# Prompt matrix definitions
DEMOGRAPHIC_PROMPT = (
    "A 25-year-old South Asian female fashion model with sharp cheekbones, olive skin, "
    "traditional styling, dark brown hair pulled back into a sleek, clean bun. "
    "Neutral, elegant facial expression. The model is wearing the provided garment cleanly."
)

STYLE_PRESETS = {
    "clean": {
        "action": "Standing gracefully facing the camera, hands relaxed at sides, showcasing the full front design of the garment.",
        "bg": "High-end editorial studio background with grey neutral tones, soft professional octobox lighting, highly detailed, photorealistic 4k resolution."
    },
    "festive": {
        "action": "Standing at a three-quarter angle, showing an elegant side profile and detailed sleeve drape.",
        "bg": "Soft warm tones, subtle traditional Indian decor elements in the blurred background, festive lights, highly detailed, photorealistic 4k resolution."
    },
    "bridal": {
        "action": "Focusing closely on the fine hand-embroidery, mirror work, and neckline details of the garment, capturing textures in rich detail.",
        "bg": "Soft morning light, aesthetic indoor bridal preparation setting, traditional gold mirrors, warm ambient glow, highly detailed, photorealistic 4k resolution."
    }
}

def generate_binary_mask(input_path: str, fg_path: str, mask_path: str):
    """
    Runs background removal using rembg and exports a binary mask (Black=Garment, White=Background).
    """
    print(f"Opening input image: {input_path}")
    input_img = Image.open(input_path)
    
    print("Running background removal (rembg)...")
    fg_img = remove(input_img)
    fg_img.save(fg_path)
    print(f"Foreground saved to {fg_path}")
    
    # Generate binary mask
    fg_np = np.array(fg_img)
    if fg_np.shape[2] == 4:
        alpha = fg_np[:, :, 3]
    else:
        # Fallback if no alpha channel
        alpha = np.zeros(fg_np.shape[:2], dtype=np.uint8)
        
    mask = np.ones_like(alpha) * 255
    mask[alpha > 0] = 0
    
    mask_img = Image.fromarray(mask.astype(np.uint8), mode='L')
    mask_img.save(mask_path)
    print(f"Binary mask saved to {mask_path}")

def run_inpainting_for_style(client, base_img_path: str, mask_img_path: str, output_path: str, prompt: str, seed: int):
    """
    Calls Vertex AI Imagen model using google-genai client for image inpainting.
    """
    from google.genai import types

    print(f"Loading reference images for prompt: {prompt[:60]}...")
    base_img = types.Image.from_file(location=base_img_path)
    mask_img = types.Image.from_file(location=mask_img_path)
    
    raw_ref = types.RawReferenceImage(
        reference_id=1,
        reference_image=base_img
    )
    mask_ref = types.MaskReferenceImage(
        reference_id=2,
        reference_image=mask_img,
        config=types.MaskReferenceConfig(mask_mode="MASK_MODE_USER_PROVIDED")
    )
    
    config = types.EditImageConfig(
        edit_mode="EDIT_MODE_INPAINT_INSERTION",
        number_of_images=1,
        output_mime_type="image/jpeg",
        seed=seed
    )
    
    print(f"Sending inpainting request to Vertex AI (Model: {TARGET_MODEL}, Seed: {seed})...")
    response = client.models.edit_image(
        model=TARGET_MODEL,
        prompt=prompt,
        reference_images=[raw_ref, mask_ref],
        config=config
    )
    
    if response.generated_images:
        response.generated_images[0].image.save(output_path)
        print(f"Generated image successfully saved to {output_path}")
        return True
    else:
        raise RuntimeError("No images returned by Vertex AI EditImage API")

@functions_framework.cloud_event
def run_catalog_pipeline(cloudevent: CloudEvent):
    """
    Cloud Function entrypoint triggered by Cloud Storage Object Finalized.
    """
    # Import google-genai late to prevent loading overhead if not strictly executing
    from google import genai

    data = cloudevent.data
    bucket_name = data.get("bucket")
    file_name = data.get("name")
    
    if not bucket_name or not file_name:
        print("Invalid CloudEvent: Missing bucket or name metadata.")
        return
        
    print(f"Processing upload: gs://{bucket_name}/{file_name}")
    
    # 1. Skip non-image files
    mime_type, _ = mimetypes.guess_type(file_name)
    if not mime_type or not mime_type.startswith("image/"):
        print(f"Skipping non-image file '{file_name}' (Mime: {mime_type})")
        return
        
    storage_client = storage.Client()
    source_bucket = storage_client.bucket(bucket_name)
    blob = source_bucket.blob(file_name)
    
    # Create temp directory for local files
    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, "input_" + Path(file_name).name)
        fg_path = os.path.join(tmpdir, "fg_" + Path(file_name).name)
        mask_path = os.path.join(tmpdir, "mask_" + Path(file_name).name)
        
        # Download input image
        print(f"Downloading gs://{bucket_name}/{file_name} to {input_path}...")
        blob.download_to_filename(input_path)
        
        # 2. Run background removal and masking (Task A)
        try:
            generate_binary_mask(input_path, fg_path, mask_path)
        except Exception as e:
            print(f"Failed to generate mask: {e}")
            return
            
        # 3. Initialize Google GenAI client in Vertex AI mode
        # GCP Project will be auto-detected from metadata or environment
        project_id = os.environ.get("GCP_PROJECT") or os.environ.get("GOOGLE_CLOUD_PROJECT")
        print(f"Initializing GenAI client for Project: '{project_id}' in Location: '{GCP_LOCATION}'")
        
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location=GCP_LOCATION
        )
        
        # 4. Generate catalog variations (Task B - Prompt Matrix)
        dest_bucket = storage_client.bucket(DEST_BUCKET_NAME)
        file_stem = Path(file_name).stem
        
        for style_key, style_cfg in STYLE_PRESETS.items():
            style_output_name = f"{file_stem}_{style_key}.jpg"
            local_output_path = os.path.join(tmpdir, style_output_name)
            
            # Build full prompt
            full_prompt = f"{DEMOGRAPHIC_PROMPT} The model is {style_cfg['action']} {style_cfg['bg']}"
            
            # Vary seed per style slightly but consistently (e.g. clean = seed, festive = seed+1, bridal = seed+2)
            style_offset = list(STYLE_PRESETS.keys()).index(style_key)
            current_seed = BASE_SEED + style_offset
            
            try:
                print(f"Generating style: {style_key}")
                run_inpainting_for_style(
                    client=client,
                    base_img_path=fg_path,
                    mask_img_path=mask_path,
                    output_path=local_output_path,
                    prompt=full_prompt,
                    seed=current_seed
                )
                
                # 5. Upload generated catalog image to destination bucket
                dest_blob_path = f"catalog/{style_output_name}"
                print(f"Uploading output to gs://{DEST_BUCKET_NAME}/{dest_blob_path}...")
                dest_blob = dest_bucket.blob(dest_blob_path)
                dest_blob.upload_from_filename(local_output_path)
                print(f"Successfully uploaded: gs://{DEST_BUCKET_NAME}/{dest_blob_path}")
                
            except Exception as e:
                print(f"Error generating style '{style_key}': {e}")
                continue
                
    print("Catalog generation pipeline completed successfully.")

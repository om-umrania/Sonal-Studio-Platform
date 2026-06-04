import os
import sys
from pathlib import Path

# Add the cloud function directory to the system path so we can import main
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import generate_binary_mask, run_inpainting_for_style, STYLE_PRESETS, DEMOGRAPHIC_PROMPT

def run_test():
    print("==========================================================")
    print("Running Local Test for GCP Cloud Function Code")
    print("==========================================================")
    
    # 1. Locate sample input image
    sample_dir = Path("/Users/omumrania/Documents/GitHub/Sonal-Studio-Platform/Sonal Studio Platform Resources/Sonal-Photo")
    sample_images = list(sample_dir.glob("*.jpeg")) + list(sample_dir.glob("*.jpg")) + list(sample_dir.glob("*.png"))
    
    if not sample_images:
        print("Error: No sample images found in raw photo library.")
        return
        
    input_path = str(sample_images[0])
    print(f"Using sample image: {input_path}")
    
    # Set up output paths in temp/test
    out_dir = Path("/Users/omumrania/Documents/GitHub/Sonal-Studio-Platform/tmp/test")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    fg_path = str(out_dir / "test_fg.png")
    mask_path = str(out_dir / "test_mask.png")
    
    # 2. Test Mask Generation (Task A)
    print("\n--- Testing Mask Generation ---")
    try:
        generate_binary_mask(input_path, fg_path, mask_path)
        print(f"SUCCESS: Mask generated. Output files saved in {out_dir}")
        print(f"  Foreground: {fg_path}")
        print(f"  Mask:       {mask_path}")
    except Exception as e:
        print(f"FAILED: Mask generation failed: {e}")
        return

    # 3. Test Vertex AI Client Initialization & API Call (Task B)
    print("\n--- Testing Vertex AI / Imagen Integration ---")
    
    # Check if Google application credentials or project ID are available
    project_id = os.environ.get("GCP_PROJECT") or os.environ.get("GOOGLE_CLOUD_PROJECT")
    
    # We can also attempt to read active gcloud config
    if not project_id:
        try:
            import subprocess
            project_id = subprocess.check_output(
                ["gcloud", "config", "get-value", "project"], 
                stderr=subprocess.DEVNULL
            ).decode("utf-8").strip()
            os.environ["GCP_PROJECT"] = project_id
        except Exception:
            pass

    if not project_id:
        print("SKIP: GCP Project ID not set in environment or gcloud config. Skipping real API generation test.")
        print("To run the API generation test, run:")
        print("  export GCP_PROJECT=your-project-id")
        print("  python3 gcp-cloud-function/test_local.py")
        return
        
    print(f"Using GCP Project ID: {project_id}")
    
    try:
        from google import genai
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location="us-central1"
        )
        
        # Run a test for just the 'clean' style
        style_key = "clean"
        style_cfg = STYLE_PRESETS[style_key]
        full_prompt = f"{DEMOGRAPHIC_PROMPT} The model is {style_cfg['action']} {style_cfg['bg']}"
        output_path = str(out_dir / f"test_out_{style_key}.jpg")
        
        print(f"Running generation for style: {style_key}...")
        success = run_inpainting_for_style(
            client=client,
            base_img_path=fg_path,
            mask_img_path=mask_path,
            output_path=output_path,
            prompt=full_prompt,
            seed=42
        )
        
        if success and os.path.exists(output_path):
            print(f"SUCCESS: Generated inpainting output saved to {output_path}")
        else:
            print("FAILED: API executed but output file was not created.")
            
    except ImportError:
        print("FAILED: 'google-genai' package is not installed in the current environment.")
    except Exception as e:
        print(f"FAILED: Vertex AI image generation failed: {e}")

if __name__ == "__main__":
    run_test()

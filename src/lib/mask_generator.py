import argparse
import os
import numpy as np
from PIL import Image
from rembg import remove

def main():
    parser = argparse.ArgumentParser(description="Generate binary mask from raw garment image using rembg")
    parser.add_argument("--input", required=True, help="Path to input raw photo")
    parser.add_argument("--output_fg", required=True, help="Path to save isolated foreground image (RGBA)")
    parser.add_argument("--output_mask", required=True, help="Path to save binary mask (L)")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"Error: Input file {args.input} does not exist")
        return
        
    try:
        # Create output directories if they don't exist
        if os.path.dirname(args.output_fg):
            os.makedirs(os.path.dirname(args.output_fg), exist_ok=True)
        if os.path.dirname(args.output_mask):
            os.makedirs(os.path.dirname(args.output_mask), exist_ok=True)
        
        print(f"Opening input image: {args.input}")
        input_img = Image.open(args.input)
        
        print("Running background removal...")
        fg_img = remove(input_img)
        fg_img.save(args.output_fg)
        print(f"Foreground saved to {args.output_fg}")
        
        # Create binary mask: alpha channel = 0 -> white (255), alpha > 0 -> black (0)
        fg_np = np.array(fg_img)
        if fg_np.shape[2] == 4:
            alpha = fg_np[:, :, 3]
        else:
            # If no alpha channel, background removal failed to output RGBA, default mask to white
            alpha = np.zeros(fg_np.shape[:2], dtype=np.uint8)
            
        mask = np.ones_like(alpha) * 255
        mask[alpha > 0] = 0
        
        mask_img = Image.fromarray(mask.astype(np.uint8), mode='L')
        mask_img.save(args.output_mask)
        print(f"Binary mask saved to {args.output_mask}")
        print("SUCCESS")
        
    except Exception as e:
        print(f"Error executing masking: {e}")
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()

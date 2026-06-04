import { NextRequest, NextResponse } from 'next/server';
import { exec, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const PHOTO_DIR = path.join(process.cwd(), 'Sonal Studio Platform Resources/Sonal-Photo');
const HEIC_CACHE_DIR = path.join(process.cwd(), 'tmp/heic_cache');
const TEMP_DIR = path.join(process.cwd(), 'public/images/temp');

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    let inputPath = path.join(PHOTO_DIR, filename);
    if (!fs.existsSync(inputPath)) {
      return NextResponse.json({ error: 'Source file not found' }, { status: 404 });
    }

    // If it's a HEIC, we use the converted JPEG path
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.heic') {
      const cachedJpg = path.join(HEIC_CACHE_DIR, `${filename}.jpg`);
      if (fs.existsSync(cachedJpg)) {
        inputPath = cachedJpg;
      } else {
        // If not cached, convert first
        fs.mkdirSync(HEIC_CACHE_DIR, { recursive: true });
        try {
          execSync(`sips -s format jpeg "${inputPath}" --out "${cachedJpg}"`);
          inputPath = cachedJpg;
        } catch (e: any) {
          return NextResponse.json({ error: `HEIC conversion failed: ${e.message}` }, { status: 500 });
        }
      }
    }

    // Set up temp paths
    const baseName = path.basename(filename, ext).replace(/\s+/g, '_');
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const fgPath = path.join(TEMP_DIR, `${baseName}_fg.png`);
    const maskPath = path.join(TEMP_DIR, `${baseName}_mask.png`);

    // Run python script
    const scriptPath = path.join(process.cwd(), 'src/lib/mask_generator.py');
    const cmd = `python3 "${scriptPath}" --input "${inputPath}" --output_fg "${fgPath}" --output_mask "${maskPath}"`;
    
    console.log(`Running mask command: ${cmd}`);
    const { stdout, stderr } = await execPromise(cmd);
    console.log('Mask generator stdout:', stdout);
    
    if (stderr && stderr.includes('Error') && !stdout.includes('SUCCESS')) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    // Return relative URLs for public directory (add cache-busting timestamp)
    return NextResponse.json({
      success: true,
      fgUrl: `/images/temp/${baseName}_fg.png?t=${Date.now()}`,
      maskUrl: `/images/temp/${baseName}_mask.png?t=${Date.now()}`,
      fgPath,
      maskPath,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const PHOTO_DIR = path.join(process.cwd(), 'Sonal Studio Platform Resources/Sonal-Photo');
const HEIC_CACHE_DIR = path.join(process.cwd(), 'tmp/heic_cache');
const TEMP_DIR = path.join(process.cwd(), 'public/images/temp');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      filename,
      maskDataUrl,
      prompt,
      style,
      seed,
      apiKey,
      vertexAi,
      project,
      location,
      model,
      mock,
    } = body;

    if (!filename || !maskDataUrl || !prompt) {
      return NextResponse.json(
        { error: 'Filename, maskDataUrl, and prompt are required' },
        { status: 400 }
      );
    }

    // Get input path
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
      }
    }

    const baseName = path.basename(filename, ext).replace(/\s+/g, '_');
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    // Save edited mask from base64 data URL or copy original mask if unchanged
    const editedMaskPath = path.join(TEMP_DIR, `${baseName}_mask_edited.png`);
    if (maskDataUrl.startsWith('data:image/')) {
      const maskBase64 = maskDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const maskBuffer = Buffer.from(maskBase64, 'base64');
      fs.writeFileSync(editedMaskPath, maskBuffer);
    } else {
      const cleanUrl = maskDataUrl.split('?')[0];
      const cleanPath = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
      const sourceMaskPath = path.join(process.cwd(), 'public', cleanPath);
      if (fs.existsSync(sourceMaskPath)) {
        fs.copyFileSync(sourceMaskPath, editedMaskPath);
      } else {
        return NextResponse.json({ error: `Mask file not found at ${sourceMaskPath}` }, { status: 404 });
      }
    }

    // Prepare output path
    const generationId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const outputFilename = `${baseName}_gen_${generationId}.jpg`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    // Call python script
    const scriptPath = path.join(process.cwd(), 'src/lib/image_inpainter.py');
    let cmd = `python3 "${scriptPath}" --image "${inputPath}" --mask "${editedMaskPath}" --output "${outputPath}" --prompt "${prompt.replace(/"/g, '\\"')}" --style "${style || 'clean'}"`;

    if (seed !== undefined && seed !== null && seed !== '') {
      cmd += ` --seed ${seed}`;
    }

    if (mock) {
      cmd += ' --mock';
    } else {
      // Configure real generation keys
      if (apiKey) {
        cmd += ` --api_key "${apiKey}"`;
      }
      if (vertexAi) {
        cmd += ' --vertex_ai';
        if (project) cmd += ` --project "${project}"`;
        if (location) cmd += ` --location "${location}"`;
      }
      if (model) {
        cmd += ` --model "${model}"`;
      }
    }

    console.log(`Running inpainting command: ${cmd}`);
    const { stdout, stderr } = await execPromise(cmd);
    console.log('Inpainter stdout:', stdout);

    if (stderr && stderr.includes('Error') && !stdout.includes('SUCCESS')) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    if (stdout.includes('FAILED')) {
      return NextResponse.json({ error: 'Generation failed: ' + stdout }, { status: 500 });
    }

    // Return the relative URL of the generated image
    return NextResponse.json({
      success: true,
      imageUrl: `/images/temp/${outputFilename}`,
      filename: outputFilename,
      seedUsed: seed || null,
      promptUsed: prompt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

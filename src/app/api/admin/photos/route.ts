import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PHOTO_DIR = path.join(process.cwd(), 'Sonal Studio Platform Resources/Sonal-Photo');
const CACHE_DIR = path.join(process.cwd(), 'tmp/heic_cache');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    // List photos
    try {
      if (!fs.existsSync(PHOTO_DIR)) {
        return NextResponse.json({ error: 'Photo directory not found' }, { status: 404 });
      }

      const files = fs.readdirSync(PHOTO_DIR);
      // Filter image files (png, jpg, jpeg, heic) and ignore hidden files
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return !file.startsWith('.') && ['.png', '.jpg', '.jpeg', '.heic'].includes(ext);
      });

      return NextResponse.json({ photos: images });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // Serve a specific photo
  try {
    const filePath = path.join(PHOTO_DIR, name);

    // Security check: ensure path is inside PHOTO_DIR
    if (!filePath.startsWith(PHOTO_DIR)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = path.extname(name).toLowerCase();
    
    if (ext === '.heic') {
      // Create cache directory if it doesn't exist
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      const cachedPath = path.join(CACHE_DIR, `${name}.jpg`);

      // Convert if not already cached
      if (!fs.existsSync(cachedPath)) {
        try {
          execSync(`sips -s format jpeg "${filePath}" --out "${cachedPath}"`);
        } catch (e: any) {
          return NextResponse.json({ error: `HEIC conversion failed: ${e.message}` }, { status: 500 });
        }
      }

      const fileBuffer = fs.readFileSync(cachedPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Serve standard files (png, jpg, jpeg)
    const fileBuffer = fs.readFileSync(filePath);
    let mimeType = 'image/jpeg';
    if (ext === '.png') {
      mimeType = 'image/png';
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

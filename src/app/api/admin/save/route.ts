import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const GALLERY_FILE = path.join(process.cwd(), 'src/data/gallery.ts');
const CATALOG_DIR = path.join(process.cwd(), 'public/images/catalog');
const TEMP_DIR = path.join(process.cwd(), 'public/images/temp');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      category,
      description,
      tags,
      occasions,
      mainImage,
      alternateImages,
    } = body;

    if (!id || !title || !category || !mainImage) {
      return NextResponse.json(
        { error: 'id, title, category, and mainImage are required' },
        { status: 400 }
      );
    }

    fs.mkdirSync(CATALOG_DIR, { recursive: true });

    // Helper to move file and get new relative path
    const moveImage = (tempUrl: string): string => {
      const cleanUrl = tempUrl.split('?')[0];
      const filename = path.basename(cleanUrl);
      const srcPath = path.join(TEMP_DIR, filename);
      const destPath = path.join(CATALOG_DIR, filename);

      if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
      }
      return `/images/catalog/${filename}`;
    };

    // Move main image
    const finalMainImage = moveImage(mainImage);

    // Move alternate images
    const finalAlternates: string[] = [];
    if (alternateImages && Array.isArray(alternateImages)) {
      for (const imgUrl of alternateImages) {
        if (imgUrl) {
          finalAlternates.push(moveImage(imgUrl));
        }
      }
    }

    // Read and update src/data/gallery.ts
    if (fs.existsSync(GALLERY_FILE)) {
      let fileContent = fs.readFileSync(GALLERY_FILE, 'utf8');
      const targetStr = 'export const GALLERY_ITEMS: GalleryItem[] = [';
      const index = fileContent.indexOf(targetStr);

      if (index !== -1) {
        const insertIndex = index + targetStr.length;

        // Construct formatting for alternateImages
        const altStr = finalAlternates.length > 0 
          ? `\n    alternateImages: ${JSON.stringify(finalAlternates)},`
          : '';

        const newItemCode = `\n  {
    id: "${id}",
    title: "${title}",
    category: "${category}",
    occasion: ${JSON.stringify(occasions || ["Celebration"])},
    description: "${description.replace(/"/g, '\\"')}",
    image: "${finalMainImage}",${altStr}
    tags: ${JSON.stringify(tags || [])},
    whatsappMessage: WA.galleryInquiry("${title}"),
  },`;

        const newContent =
          fileContent.slice(0, insertIndex) + newItemCode + fileContent.slice(insertIndex);

        fs.writeFileSync(GALLERY_FILE, newContent, 'utf8');
      } else {
        console.warn('Could not locate GALLERY_ITEMS array in gallery.ts');
      }
    } else {
      return NextResponse.json({ error: 'gallery.ts file not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: {
        id,
        title,
        category,
        image: finalMainImage,
        alternateImages: finalAlternates,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

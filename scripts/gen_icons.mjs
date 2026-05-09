import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

// Source icon — the user's uploaded icon saved in Downloads
// We'll read directly from the existing AppIcon-512@2x.png or from Downloads
const SOURCE = 'C:\\Users\\Joshan\\Downloads\\wasafi_icon.png';
const FALLBACK = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png';

const iconSrc = existsSync(SOURCE) ? SOURCE : FALLBACK;
const OUT_DIR = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';

// All required iOS icon sizes (filename → size in px)
const SIZES = [
  { name: 'Icon-20.png',      size: 20   },
  { name: 'Icon-20@2x.png',   size: 40   },
  { name: 'Icon-20@3x.png',   size: 60   },
  { name: 'Icon-29.png',      size: 29   },
  { name: 'Icon-29@2x.png',   size: 58   },
  { name: 'Icon-29@3x.png',   size: 87   },
  { name: 'Icon-40.png',      size: 40   },
  { name: 'Icon-40@2x.png',   size: 80   },
  { name: 'Icon-40@3x.png',   size: 120  },
  { name: 'Icon-60@2x.png',   size: 120  },
  { name: 'Icon-60@3x.png',   size: 180  },
  { name: 'Icon-76.png',      size: 76   },
  { name: 'Icon-76@2x.png',   size: 152  },
  { name: 'Icon-83.5@2x.png', size: 167  },
  { name: 'AppIcon-512@2x.png', size: 1024 },
];

async function generate() {
  console.log(`📱 Generating iOS icons from: ${iconSrc}\n`);

  // Load the source image
  // Trim white/light border and extend to full bleed on dark background
  const src = sharp(iconSrc);
  const meta = await src.metadata();
  console.log(`   Source size: ${meta.width}x${meta.height}`);

  for (const { name, size } of SIZES) {
    const outPath = join(OUT_DIR, name);

    await sharp(iconSrc)
      // Trim any white border padding automatically
      .trim({ background: '#ffffff', threshold: 30 })
      // Resize to fill (cover) - no white space
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
        background: { r: 13, g: 13, b: 13, alpha: 1 }
      })
      .png()
      .toFile(outPath);

    console.log(`✅  ${name} → ${size}x${size}px`);
  }

  console.log('\n🎉 All iOS icon sizes generated!');
}

generate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

const { Jimp, ResizeStrategy, BlendMode } = require('jimp');
const path = require('path');

const SRC = path.join(__dirname, 'icono.png');
const OUT = path.join(__dirname, 'wwwroot', 'icons');

// Orange brand color for maskable background: #FD7304FF
const MASKABLE_BG = 0x182A6EFF;

async function generateIcon(size, outputPath, { maskable = false } = {}) {
  const logo = await Jimp.read(SRC);

  // For maskable: logo occupies 60% of canvas (safe zone = 20% each side)
  // For any: logo occupies 80% of canvas (10% padding each side)
  const fillRatio = maskable ? 0.80 : 0.92;
  const maxLogoSize = Math.round(size * fillRatio);

  // Scale logo preserving aspect ratio
  const logoW = logo.width;
  const logoH = logo.height;
  const scale = Math.min(maxLogoSize / logoW, maxLogoSize / logoH);
  const newW = Math.round(logoW * scale);
  const newH = Math.round(logoH * scale);

  logo.resize({ w: newW, h: newH, mode: ResizeStrategy.BICUBIC });

  // Create canvas: transparent for "any", solid brand color for maskable
  const canvas = new Jimp({ width: size, height: size, color: maskable ? MASKABLE_BG : 0x00000000 });

  // Center logo
  const x = Math.round((size - newW) / 2);
  const y = Math.round((size - newH) / 2);

  canvas.composite(logo, x, y, { mode: BlendMode.SRC_OVER });

  await canvas.write(outputPath);
  console.log(`Generated: ${outputPath}`);
}

(async () => {
  try {
    await generateIcon(192, path.join(OUT, 'icon-192.png'));
    await generateIcon(512, path.join(OUT, 'icon-512.png'));
    await generateIcon(192, path.join(OUT, 'icon-192-maskable.png'), { maskable: true });
    await generateIcon(512, path.join(OUT, 'icon-512-maskable.png'), { maskable: true });
    console.log('All icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
})();

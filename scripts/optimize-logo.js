const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const INPUT = path.join(PUBLIC, 'NavaPools_logo.png');

if (!fs.existsSync(INPUT)) {
  console.error('Input logo not found at', INPUT);
  process.exit(1);
}

const sizes = [360, 720, 1200];

(async () => {
  try {
    for (const w of sizes) {
      const base = `NavaPools_logo-${w}`;
      const outAvif = path.join(PUBLIC, `${base}.avif`);
      const outWebp = path.join(PUBLIC, `${base}.webp`);
      const outPng = path.join(PUBLIC, `${base}.png`);

      await sharp(INPUT)
        .resize({ width: w })
        .avif({ quality: 60 })
        .toFile(outAvif);

      await sharp(INPUT)
        .resize({ width: w })
        .webp({ quality: 70 })
        .toFile(outWebp);

      await sharp(INPUT)
        .resize({ width: w })
        .png({ compressionLevel: 9 })
        .toFile(outPng);

      console.log('Generated', outAvif, outWebp, outPng);
    }

    // Also generate a reasonably compressed full-width fallback PNG (1200)
    const outMain = path.join(PUBLIC, 'NavaPools_logo-optimized.png');
    await sharp(INPUT).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(outMain);
    console.log('Generated', outMain);

    console.log('Done optimizing NavaPools_logo.png — check public/ for outputs.');
  } catch (err) {
    console.error('Error optimizing logo:', err);
    process.exit(1);
  }
})();

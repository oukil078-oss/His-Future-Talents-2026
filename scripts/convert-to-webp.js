const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      await convertDir(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
      const parsed = path.parse(fullPath);
      const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

      try {
        const metadata = await sharp(fullPath).metadata();
        let pipeline = sharp(fullPath);
        
        // Resize ultra high-res photos to max 1920px width to save megabytes
        if (metadata.width && metadata.width > 1920) {
          pipeline = pipeline.resize(1920, null, { fit: 'inside', withoutEnlargement: true });
        }

        await pipeline.webp({ quality: 82 }).toFile(webpPath);
        const oldSize = (fs.statSync(fullPath).size / 1024).toFixed(1);
        const newSize = (fs.statSync(webpPath).size / 1024).toFixed(1);
        console.log(`Converted: ${parsed.name}${parsed.ext} (${oldSize}KB) -> ${parsed.name}.webp (${newSize}KB)`);
      } catch (err) {
        console.error(`Error converting ${fullPath}:`, err.message);
      }
    }
  }
}

async function main() {
  const dirsToConvert = [
    path.join(__dirname, '../public/brand/gallery'),
    path.join(__dirname, '../public/brand/event2'),
    path.join(__dirname, '../public/images/hero'),
    path.join(__dirname, '../public/images'),
    path.join(__dirname, '../public/brand'),
  ];

  for (const dir of dirsToConvert) {
    console.log(`Processing: ${dir}`);
    await convertDir(dir);
  }
  console.log('Conversion complete!');
}

main();

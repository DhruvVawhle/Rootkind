const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../public/images/about");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".jpg"));

async function optimize() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tempPath = path.join(dir, "temp_" + file);
    const origSize = fs.statSync(filePath).size;
    
    await sharp(filePath)
      .resize({ width: 1040, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(tempPath);
      
    const newSize = fs.statSync(tempPath).size;
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    console.log(`${file}: ${(origSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${((1 - newSize/origSize)*100).toFixed(0)}%)`);
  }
}

optimize().catch(console.error);

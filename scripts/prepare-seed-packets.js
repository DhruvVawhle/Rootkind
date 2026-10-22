const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\09fc74b6-35c4-4937-8547-e9ad4aa1c681';
const outDir = path.join(__dirname, '..', 'public', 'images', 'seeds');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const mappings = [
  { src: 'tamatar_seed_packet_1792693418749.jpg', dest: 'tamatar-packet.jpg' },
  { src: 'mirch_seed_packet_1792693446191.jpg', dest: 'mirch-packet.jpg' },
  { src: 'bhindi_seed_packet_1792693488241.jpg', dest: 'bhindi-packet.jpg' },
  { src: 'dhaniya_seed_packet_1792693511473.jpg', dest: 'dhaniya-packet.jpg' },
  { src: 'methi_seed_packet_1792693530930.jpg', dest: 'methi-packet.jpg' },
  { src: 'tulsi_seed_packet_1792693550422.jpg', dest: 'tulsi-packet.jpg' },
  { src: 'palak_seed_packet_1792693629750.jpg', dest: 'palak-packet.jpg' },
  { src: 'mooli_microgreens_packet_1792693647492.jpg', dest: 'mooli-packet.jpg' },
];

async function run() {
  for (const m of mappings) {
    const srcPath = path.join(brainDir, m.src);
    const destPath = path.join(outDir, m.dest);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`);
      continue;
    }
    await sharp(srcPath)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 86, progressive: true })
      .toFile(destPath);
    const stat = fs.statSync(destPath);
    console.log(`Optimized ${m.dest}: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

run().catch(console.error);

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const https = require("https");
const sharp = require("sharp");

const db = new PrismaClient();
const catalogDir = path.join(__dirname, "../public/images/catalog");

if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const data = [];
      res.on("data", chunk => data.push(chunk));
      res.on("end", async () => {
        try {
          const buffer = Buffer.concat(data);
          await sharp(buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true })
            .toFile(dest);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

async function main() {
  console.log("Caching all remote category and product images locally...");

  // 1. Categories
  const categories = await db.category.findMany();
  for (const cat of categories) {
    if (cat.image && cat.image.startsWith("http")) {
      const filename = `cat-${cat.slug}.jpg`;
      const dest = path.join(catalogDir, filename);
      try {
        console.log(`Downloading category image for ${cat.slug}...`);
        await downloadImage(cat.image, dest);
        await db.category.update({
          where: { id: cat.id },
          data: { image: `/images/catalog/${filename}` },
        });
        console.log(`✓ Updated category ${cat.slug} -> /images/catalog/${filename}`);
      } catch (err) {
        console.warn(`Failed downloading ${cat.slug}, falling back to local /images/about/heirloom-seeds.jpg:`, err.message);
        await db.category.update({
          where: { id: cat.id },
          data: { image: `/images/about/heirloom-seeds.jpg` },
        });
      }
    }
  }

  // 2. Articles
  const articles = await db.article.findMany();
  for (const art of articles) {
    if (art.coverImage && art.coverImage.startsWith("http")) {
      const filename = `art-${art.slug}.jpg`;
      const dest = path.join(catalogDir, filename);
      try {
        console.log(`Downloading article image for ${art.slug}...`);
        await downloadImage(art.coverImage, dest);
        await db.article.update({
          where: { id: art.id },
          data: { coverImage: `/images/catalog/${filename}` },
        });
        console.log(`✓ Updated article ${art.slug} -> /images/catalog/${filename}`);
      } catch (err) {
        console.warn(`Failed downloading article ${art.slug}:`, err.message);
        await db.article.update({
          where: { id: art.id },
          data: { coverImage: `/images/about/balcony-sanctuary.jpg` },
        });
      }
    }
  }

  // 3. Featured Products
  const products = await db.product.findMany({ where: { isFeatured: true } });
  for (const prod of products) {
    const newImages = [];
    let updated = false;
    for (let i = 0; i < prod.images.length; i++) {
      const img = prod.images[i];
      if (img && img.startsWith("http")) {
        const filename = `prod-${prod.slug}-${i}.jpg`;
        const dest = path.join(catalogDir, filename);
        try {
          console.log(`Downloading product image for ${prod.slug}...`);
          await downloadImage(img, dest);
          newImages.push(`/images/catalog/${filename}`);
          updated = true;
        } catch (err) {
          console.warn(`Failed downloading product image for ${prod.slug}:`, err.message);
          newImages.push(`/images/about/harvest-basket.jpg`);
          updated = true;
        }
      } else {
        newImages.push(img);
      }
    }
    if (updated) {
      await db.product.update({
        where: { id: prod.id },
        data: { images: newImages },
      });
      console.log(`✓ Updated product ${prod.slug}`);
    }
  }

  console.log("\nAll images successfully cached locally!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());

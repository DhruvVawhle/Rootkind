const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const search = "photo-1592417817098-8f3d6910a908";
  
  // Categories
  const cats = await db.category.findMany();
  const badCats = cats.filter(c => c.image && c.image.includes(search));
  console.log("Bad categories:", badCats.map(c => ({ slug: c.slug, image: c.image })));
  
  // Products
  const prods = await db.product.findMany();
  const badProds = prods.filter(p => p.images && p.images.some(img => img.includes(search)));
  console.log("Bad products:", badProds.map(p => ({ slug: p.slug, images: p.images })));

  // Articles
  const arts = await db.article.findMany();
  const badArts = arts.filter(a => a.coverImage && a.coverImage.includes(search));
  console.log("Bad articles:", badArts.map(a => ({ slug: a.slug, coverImage: a.coverImage })));

  // Update them if found
  for (const c of badCats) {
    await db.category.update({
      where: { id: c.id },
      data: { image: "/images/about/heirloom-seeds.jpg" }
    });
    console.log(`Updated category ${c.slug}`);
  }

  for (const p of badProds) {
    const fixedImages = p.images.map(img => img.includes(search) ? "/images/about/harvest-basket.jpg" : img);
    await db.product.update({
      where: { id: p.id },
      data: { images: fixedImages }
    });
    console.log(`Updated product ${p.slug}`);
  }

  for (const a of badArts) {
    await db.article.update({
      where: { id: a.id },
      data: { coverImage: "/images/about/balcony-sanctuary.jpg" }
    });
    console.log(`Updated article ${a.slug}`);
  }
}

main().catch(console.error).finally(() => db.$disconnect());

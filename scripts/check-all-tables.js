const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function checkAll() {
  const cartItems = await db.cartItem.findMany();
  console.log("Cart items:", cartItems.length);
  for (const ci of cartItems) {
    if (ci.productImage && ci.productImage.includes("photo-1592417817098")) {
      console.log("Found in cartItem:", ci.id, ci.productImage);
      await db.cartItem.update({
        where: { id: ci.id },
        data: { productImage: "/images/about/heirloom-seeds.jpg" }
      });
    }
  }

  const orderItems = await db.orderItem.findMany();
  console.log("Order items:", orderItems.length);
  for (const oi of orderItems) {
    if (oi.productImage && oi.productImage.includes("photo-1592417817098")) {
      console.log("Found in orderItem:", oi.id, oi.productImage);
      await db.orderItem.update({
        where: { id: oi.id },
        data: { productImage: "/images/about/heirloom-seeds.jpg" }
      });
    }
  }

  const categories = await db.category.findMany();
  for (const c of categories) {
    if (c.image && c.image.includes("photo-1592417817098")) {
      console.log("Found in category:", c.slug, c.image);
      await db.category.update({
        where: { id: c.id },
        data: { image: "/images/about/heirloom-seeds.jpg" }
      });
    }
  }

  const products = await db.product.findMany();
  for (const p of products) {
    if (p.images.some(img => img.includes("photo-1592417817098"))) {
      console.log("Found in product:", p.slug, p.images);
      const fixed = p.images.map(img => img.includes("photo-1592417817098") ? "/images/about/harvest-basket.jpg" : img);
      await db.product.update({
        where: { id: p.id },
        data: { images: fixed }
      });
    }
  }
}

checkAll().catch(console.error).finally(() => db.$disconnect());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Current Categories:", categories.map(c => ({ slug: c.slug, image: c.image })));

  // Update categories to use local reliable images or working images
  const localMap = {
    "vegetable-seeds": "/images/about/heirloom-seeds.jpg",
    "herb-seeds": "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80",
    "fruit-seeds": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "microgreen-seeds": "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=800&q=80",
    "flower-seeds": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
    "potting-mixes": "/images/about/living-soil.jpg",
    "cocopeat-compost": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    "planters": "/images/about/balcony-sanctuary.jpg",
    "tools": "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80",
    "watering": "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80",
    "plant-nutrition": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    "starter-kits": "/images/about/balcony-sanctuary.jpg",
    "balcony-terrace-kits": "/images/about/balcony-sanctuary.jpg",
  };

  for (const [slug, img] of Object.entries(localMap)) {
    await prisma.category.updateMany({
      where: { slug },
      data: { image: img },
    });
  }

  // Also update product images if pointing to photo-1592417817098-8f3d6910a908
  const brokenProducts = await prisma.product.findMany({
    where: {
      images: {
        has: "https://images.unsplash.com/photo-1592417817098-8f3d6910a908?auto=format&fit=crop&w=1000&q=80",
      },
    },
  });

  for (const prod of brokenProducts) {
    const updatedImages = prod.images.map(img => 
      img.includes("photo-1592417817098-8f3d6910a908") ? "/images/about/harvest-basket.jpg" : img
    );
    await prisma.product.update({
      where: { id: prod.id },
      data: { images: updatedImages },
    });
  }

  console.log("✓ Categories and Products updated with reliable, valid images!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

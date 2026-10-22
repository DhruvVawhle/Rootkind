const { PrismaClient, SunlightLevel, GrowingDifficulty, WateringNeed } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🇮🇳 Updating Rootkind Seed Catalog to Authentic Indian Botanical Names & Seed Packet Packaging...");

  const vegCategory = await prisma.category.findUnique({ where: { slug: "vegetable-seeds" } });
  const herbCategory = await prisma.category.findUnique({ where: { slug: "herb-seeds" } });
  const microCategory = await prisma.category.findUnique({ where: { slug: "microgreen-seeds" } });

  if (!vegCategory || !herbCategory || !microCategory) {
    throw new Error("Categories not found, ensure db is initialized.");
  }

  // 1. Tomato: Pusa Ruby -> Desi Tamatar (Pusa Ruby Tomato) Seeds
  const tomato = await prisma.product.findFirst({
    where: { OR: [{ slug: "pusa-ruby-heirloom-tomato" }, { slug: "desi-tamatar-pusa-ruby" }] },
  });
  if (tomato) {
    await prisma.product.update({
      where: { id: tomato.id },
      data: {
        name: "Desi Tamatar (Pusa Ruby Tomato) Seeds",
        slug: "desi-tamatar-pusa-ruby",
        description: "An Indian heritage determinate tomato variety celebrated for its rich, tangy flavor and heavy yields in container gardening. Thrives in warm balcony sun.",
        images: [
          "/images/seeds/tamatar-packet.jpg",
          "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Solanum lycopersicum (Desi Tamatar)",
        seedCount: "50+ seeds",
      },
    });
    console.log("✓ Updated Desi Tamatar (Pusa Ruby Tomato)");
  }

  // 2. Chili: Pusa Jwala -> Tikha Hari Mirch (Pusa Jwala Chili) Seeds
  const chili = await prisma.product.findFirst({
    where: { OR: [{ slug: "pusa-jwala-hot-pepper" }, { slug: "tikha-hari-mirch-pusa-jwala" }] },
  });
  if (chili) {
    await prisma.product.update({
      where: { id: chili.id },
      data: {
        name: "Tikha Hari Mirch (Pusa Jwala Chili) Seeds",
        slug: "tikha-hari-mirch-pusa-jwala",
        description: "The gold standard of pungent Indian green chilies. Prolific branching, compact bush habit, and exceptional disease resistance for terrace and balcony containers.",
        images: [
          "/images/seeds/mirch-packet.jpg",
          "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Capsicum annuum (Tikha Hari Mirch)",
        seedCount: "40+ seeds",
      },
    });
    console.log("✓ Updated Tikha Hari Mirch (Pusa Jwala Chili)");
  }

  // 3. Okra: Heritage Emerald Okra -> Pusa Sawani Bhindi (Indian Okra) Seeds
  const okra = await prisma.product.findFirst({
    where: { OR: [{ slug: "heritage-emerald-okra" }, { slug: "pusa-sawani-bhindi-okra" }] },
  });
  if (okra) {
    await prisma.product.update({
      where: { id: okra.id },
      data: {
        name: "Pusa Sawani Bhindi (Indian Okra) Seeds",
        slug: "pusa-sawani-bhindi-okra",
        description: "Tender, spineless dark-green pods on vigorous Indian heirloom stems. Beautiful hibiscus-like yellow flowers make this both edible and ornamental on your balcony.",
        images: [
          "/images/seeds/bhindi-packet.jpg",
          "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Abelmoschus esculentus (Pusa Sawani Bhindi)",
        seedCount: "35 seeds",
      },
    });
    console.log("✓ Updated Pusa Sawani Bhindi (Indian Okra)");
  }

  // 4. Basil -> Pavitra Krishna Tulsi (Holy Basil) Seeds
  const basil = await prisma.product.findFirst({
    where: { OR: [{ slug: "genovese-sweet-basil" }, { slug: "pavitra-krishna-tulsi-holy-basil" }] },
  });
  if (basil) {
    await prisma.product.update({
      where: { id: basil.id },
      data: {
        name: "Pavitra Krishna Tulsi (Holy Basil) Seeds",
        slug: "pavitra-krishna-tulsi-holy-basil",
        description: "Sacred Indian Krishna Tulsi with deep purple-tinted aromatic foliage and revered medicinal vitality. Essential for ayurvedic herbal teas and sunny balconies.",
        images: [
          "/images/seeds/tulsi-packet.jpg",
          "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Ocimum sanctum (Krishna Tulsi)",
        seedCount: "100+ seeds",
      },
    });
    console.log("✓ Updated Pavitra Krishna Tulsi (Holy Basil)");
  }

  // 5. Coriander -> Desi Khushboo Dhaniya (Indian Coriander) Seeds
  const coriander = await prisma.product.findFirst({
    where: { OR: [{ slug: "aroma-slow-bolt-coriander" }, { slug: "desi-khushboo-dhaniya-coriander" }] },
  });
  if (coriander) {
    await prisma.product.update({
      where: { id: coriander.id },
      data: {
        name: "Desi Khushboo Dhaniya (Indian Coriander) Seeds",
        slug: "desi-khushboo-dhaniya-coriander",
        description: "Native slow-bolting Indian coriander variety with intense citrus-peppery aroma and tender feathery stems. Ideal for frequent fresh kitchen garnishes.",
        images: [
          "/images/seeds/dhaniya-packet.jpg",
          "https://images.unsplash.com/photo-1589135233689-d54b8d781b49?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Coriandrum sativum (Desi Dhaniya)",
        seedCount: "120 seeds",
      },
    });
    console.log("✓ Updated Desi Khushboo Dhaniya (Indian Coriander)");
  }

  // 6. Microgreens -> Pusa Chetki Lal Mooli (Radish Microgreen) Seeds
  const radish = await prisma.product.findFirst({
    where: { OR: [{ slug: "spicy-salad-radish-microgreens" }, { slug: "pusa-chetki-lal-mooli-microgreens" }] },
  });
  if (radish) {
    await prisma.product.update({
      where: { id: radish.id },
      data: {
        name: "Pusa Chetki Lal Mooli (Radish Microgreen) Seeds",
        slug: "pusa-chetki-lal-mooli-microgreens",
        description: "Vibrant pink stems and crisp peppery Indian radish cotyledons. Ready to harvest in just 6 to 8 days with zero chemicals or fertilizers required.",
        images: [
          "/images/seeds/mooli-packet.jpg",
          "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=1000&q=80",
        ],
        plantType: "Raphanus sativus (Lal Mooli Microgreens)",
      },
    });
    console.log("✓ Updated Pusa Chetki Lal Mooli (Radish Microgreens)");
  }

  // 7. Add Desi Palak (All Green Spinach) Seeds
  const palak = await prisma.product.upsert({
    where: { slug: "desi-palak-all-green-spinach" },
    update: {
      name: "Desi Palak (All Green Spinach) Seeds",
      description: "Classic Indian broad-leaf all-green spinach with succulent, iron-rich leaves. Rapid regrowth allows multiple cuttings every 12 to 15 days.",
      categoryId: vegCategory.id,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/palak-packet.jpg",
        "/images/about/heirloom-seeds.jpg",
      ],
      plantType: "Spinacia oleracea (Desi Palak)",
      seedCount: "200+ seeds",
      sowingSeason: "September to February (Winter) & June to July (Monsoon)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Rich compost potting mix with high nitrogen content",
      recommendedPotSize: "Wide shallow container or 10-inch trough (6-8 inches deep)",
      daysToHarvest: "30-35 days for first harvest, continuous cutting",
      careInstructions: "Cut outer leaves 1 inch above soil line to stimulate rapid new center growth.",
      storageInstructions: "Store sealed in cool dry conditions.",
    },
    create: {
      name: "Desi Palak (All Green Spinach) Seeds",
      slug: "desi-palak-all-green-spinach",
      description: "Classic Indian broad-leaf all-green spinach with succulent, iron-rich leaves. Rapid regrowth allows multiple cuttings every 12 to 15 days.",
      categoryId: vegCategory.id,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/palak-packet.jpg",
        "/images/about/heirloom-seeds.jpg",
      ],
      plantType: "Spinacia oleracea (Desi Palak)",
      seedCount: "200+ seeds",
      sowingSeason: "September to February (Winter) & June to July (Monsoon)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Rich compost potting mix with high nitrogen content",
      recommendedPotSize: "Wide shallow container or 10-inch trough (6-8 inches deep)",
      daysToHarvest: "30-35 days for first harvest, continuous cutting",
      careInstructions: "Cut outer leaves 1 inch above soil line to stimulate rapid new center growth.",
      storageInstructions: "Store sealed in cool dry conditions.",
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: "SEED-PAL-01" },
    update: {
      productId: palak.id,
      title: "Seed Packet (200+ Seeds)",
      pricePaise: 11900,
      compareAtPricePaise: 15900,
      stock: 100,
      weightGrams: 15,
    },
    create: {
      productId: palak.id,
      sku: "SEED-PAL-01",
      title: "Seed Packet (200+ Seeds)",
      pricePaise: 11900,
      compareAtPricePaise: 15900,
      stock: 100,
      weightGrams: 15,
    },
  });
  console.log("✓ Added/Updated Desi Palak (All Green Spinach)");

  // 8. Add Kasoori Methi (Fragrant Fenugreek) Seeds
  const methi = await prisma.product.upsert({
    where: { slug: "kasoori-methi-fragrant-fenugreek" },
    update: {
      name: "Kasoori Methi (Fragrant Fenugreek) Seeds",
      description: "Small-leaf aromatic Nagaur Kasoori Methi with prized musky fragrance. Harvest tender young micro-leaves for parathas, dals, and drying into fragrant herbs.",
      categoryId: herbCategory.id,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/methi-packet.jpg",
        "/images/about/harvest-basket.jpg",
      ],
      plantType: "Trigonella corniculata (Kasoori Methi)",
      seedCount: "150+ seeds",
      sowingSeason: "October to February (Winter crop)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Well-draining potting compost with 20% coarse sand",
      recommendedPotSize: "Wide rectangular shallow planter (6 inches deep)",
      daysToHarvest: "21-28 days",
      careInstructions: "Broadcast seeds evenly and cover with 1/4 inch fine compost. Keep soil surface consistently moist.",
      storageInstructions: "Store in an airtight container below 20°C.",
    },
    create: {
      name: "Kasoori Methi (Fragrant Fenugreek) Seeds",
      slug: "kasoori-methi-fragrant-fenugreek",
      description: "Small-leaf aromatic Nagaur Kasoori Methi with prized musky fragrance. Harvest tender young micro-leaves for parathas, dals, and drying into fragrant herbs.",
      categoryId: herbCategory.id,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/methi-packet.jpg",
        "/images/about/harvest-basket.jpg",
      ],
      plantType: "Trigonella corniculata (Kasoori Methi)",
      seedCount: "150+ seeds",
      sowingSeason: "October to February (Winter crop)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Well-draining potting compost with 20% coarse sand",
      recommendedPotSize: "Wide rectangular shallow planter (6 inches deep)",
      daysToHarvest: "21-28 days",
      careInstructions: "Broadcast seeds evenly and cover with 1/4 inch fine compost. Keep soil surface consistently moist.",
      storageInstructions: "Store in an airtight container below 20°C.",
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: "SEED-MET-01" },
    update: {
      productId: methi.id,
      title: "Seed Packet (150+ Seeds)",
      pricePaise: 11900,
      compareAtPricePaise: 15900,
      stock: 90,
      weightGrams: 20,
    },
    create: {
      productId: methi.id,
      sku: "SEED-MET-01",
      title: "Seed Packet (150+ Seeds)",
      pricePaise: 11900,
      compareAtPricePaise: 15900,
      stock: 90,
      weightGrams: 20,
    },
  });
  console.log("✓ Added/Updated Kasoori Methi (Fragrant Fenugreek)");

  // 9. Update Starter Kits descriptions to Indianized crops
  const vegKit = await prisma.product.findUnique({
    where: { slug: "first-harvest-balcony-vegetable-kit" },
  });
  if (vegKit) {
    await prisma.product.update({
      where: { id: vegKit.id },
      data: {
        description: "The complete starter set for new urban gardeners. Contains 4 authentic Indian heirloom seed varieties (Desi Tamatar, Tikha Hari Mirch, Desi Palak, Desi Khushboo Dhaniya), 4 breathable fabric grow bags, 4 expanding cocopeat discs, plant markers, and an illustrated Hindi & English growing booklet.",
      },
    });
    console.log("✓ Updated The First Harvest Balcony Vegetable Kit description");
  }

  const herbKit = await prisma.product.findUnique({
    where: { slug: "windowsill-kitchen-culinary-herb-kit" },
  });
  if (herbKit) {
    await prisma.product.update({
      where: { id: herbKit.id },
      data: {
        description: "Fresh culinary herbs within arm's reach of your kitchen counter. Includes Pavitra Krishna Tulsi, Desi Khushboo Dhaniya, and Kasoori Methi, 3 biodegradable coconut coir pots, organic seed-starting mix, and chalk labels.",
      },
    });
    console.log("✓ Updated Windowsill Kitchen Culinary Herb Kit description");
  }

  // 10. Update Heirloom Kitchen Garden collection description
  const kitchenCollection = await prisma.collection.findUnique({
    where: { slug: "kitchen-garden" },
  });
  if (kitchenCollection) {
    await prisma.collection.update({
      where: { id: kitchenCollection.id },
      data: {
        description: "Classic Indian culinary companions: Desi Pusa Ruby tomatoes, Pavitra Krishna Tulsi, Tikha Hari Mirch, and Desi Khushboo Dhaniya.",
      },
    });
    console.log("✓ Updated Heirloom Kitchen Garden collection description");
  }

  console.log("🎉 Complete Seed Catalog and Indianized Varieties Updated Successfully!");
}

main()
  .catch((e) => {
    console.error("Error updating catalog:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

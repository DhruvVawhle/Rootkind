const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Sanitizing all product and category images to 100% local static assets...");

  const updates = [
    {
      slug: "desi-tamatar-pusa-ruby",
      images: [
        "/images/seeds/tamatar-packet.jpg",
        "/images/catalog/prod-pusa-ruby-heirloom-tomato-0.jpg",
      ],
    },
    {
      slug: "tikha-hari-mirch-pusa-jwala",
      images: [
        "/images/seeds/mirch-packet.jpg",
        "/images/catalog/prod-pusa-jwala-hot-pepper-0.jpg",
      ],
    },
    {
      slug: "pusa-sawani-bhindi-okra",
      images: [
        "/images/seeds/bhindi-packet.jpg",
        "/images/about/heirloom-seeds.jpg",
      ],
    },
    {
      slug: "desi-palak-all-green-spinach",
      images: [
        "/images/seeds/palak-packet.jpg",
        "/images/about/heirloom-seeds.jpg",
      ],
    },
    {
      slug: "pavitra-krishna-tulsi-holy-basil",
      images: [
        "/images/seeds/tulsi-packet.jpg",
        "/images/catalog/prod-genovese-sweet-basil-0.jpg",
      ],
    },
    {
      slug: "desi-khushboo-dhaniya-coriander",
      images: [
        "/images/seeds/dhaniya-packet.jpg",
        "/images/catalog/cat-herb-seeds.jpg",
      ],
    },
    {
      slug: "kasoori-methi-fragrant-fenugreek",
      images: [
        "/images/seeds/methi-packet.jpg",
        "/images/about/harvest-basket.jpg",
      ],
    },
    {
      slug: "pusa-chetki-lal-mooli-microgreens",
      images: [
        "/images/seeds/mooli-packet.jpg",
        "/images/catalog/prod-spicy-salad-radish-microgreens-0.jpg",
      ],
    },
    {
      slug: "living-potting-mix",
      images: [
        "/images/catalog/prod-living-potting-mix-0.jpg",
        "/images/about/living-soil.jpg",
      ],
    },
    {
      slug: "organic-vermicompost-active-microbes",
      images: [
        "/images/catalog/cat-cocopeat-compost.jpg",
      ],
    },
    {
      slug: "fabric-grow-bags-set-of-5",
      images: [
        "/images/catalog/prod-fabric-grow-bags-set-of-5-0.jpg",
      ],
    },
    {
      slug: "artisan-stainless-steel-hand-trowel",
      images: [
        "/images/catalog/prod-artisan-stainless-steel-hand-trowel-0.jpg",
      ],
    },
    {
      slug: "botanical-brass-rose-watering-can",
      images: [
        "/images/catalog/prod-botanical-brass-rose-watering-can-0.jpg",
      ],
    },
    {
      slug: "first-harvest-balcony-vegetable-kit",
      images: [
        "/images/catalog/prod-first-harvest-balcony-vegetable-kit-0.jpg",
      ],
    },
    {
      slug: "windowsill-kitchen-culinary-herb-kit",
      images: [
        "/images/catalog/prod-windowsill-kitchen-culinary-herb-kit-0.jpg",
      ],
    },
    {
      slug: "cold-pressed-liquid-seaweed",
      images: [
        "/images/catalog/cat-plant-nutrition.jpg",
      ],
    },
    {
      slug: "organic-neem-oil-concentrate",
      images: [
        "/images/catalog/prod-organic-neem-oil-concentrate-0.jpg",
      ],
    },
  ];

  for (const item of updates) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      await prisma.product.update({
        where: { slug: item.slug },
        data: { images: item.images },
      });
      console.log(`✓ Set local images for ${item.slug}`);
    }
  }

  // Also clean articles
  const articles = [
    {
      slug: "balcony-gardening-beginners-guide",
      coverImage: "/images/catalog/art-balcony-gardening-beginners-guide.jpg",
    },
    {
      slug: "india-seasonal-sowing-calendar",
      coverImage: "/images/about/balcony-sanctuary.jpg",
    },
    {
      slug: "organic-pest-control-neem-guide",
      coverImage: "/images/catalog/art-organic-pest-control-neem-guide.jpg",
    },
  ];
  for (const art of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: art.slug } });
    if (existing) {
      await prisma.article.update({
        where: { slug: art.slug },
        data: { coverImage: art.coverImage },
      });
      console.log(`✓ Set local coverImage for ${art.slug}`);
    }
  }

  console.log("✨ All products & articles updated to 100% local static assets!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

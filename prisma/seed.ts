import { PrismaClient, Role, SunlightLevel, GrowingDifficulty, WateringNeed } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Rootkind Botanical Database Seed...");

  // 1. Initial Administrator
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@rootkind.in";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "RootkindAdmin2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: process.env.ADMIN_INITIAL_NAME || "Rootkind Store Administrator",
      passwordHash,
      role: Role.ADMIN,
      phone: "+91 98765 43210",
    },
  });
  console.log(`👤 Admin provisioned: ${admin.email}`);

  // 2. Categories
  const categoriesData = [
    {
      name: "Vegetable Seeds",
      slug: "vegetable-seeds",
      description: "Heirloom, open-pollinated vegetable seeds selected for exceptional flavor and home container success.",
      image: "/images/about/heirloom-seeds.jpg",
      sortOrder: 1,
    },
    {
      name: "Herb Seeds",
      slug: "herb-seeds",
      description: "Aromatic culinary herbs for sunny windowsills, balconies, and vibrant kitchen cooking.",
      image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      name: "Fruit Seeds & Plants",
      slug: "fruit-seeds",
      description: "Dwarf fruit varieties, berry seeds, and companion plants thriving in home planters.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
    {
      name: "Microgreen Seeds",
      slug: "microgreen-seeds",
      description: "Fast-harvesting, nutrient-dense greens ready to cut in just 7 to 12 days.",
      image: "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
    {
      name: "Flower Seeds",
      slug: "flower-seeds",
      description: "Pollinator-attracting blooms, edible petals, and fragrant balcony blossoms.",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
      sortOrder: 5,
    },
    {
      name: "Potting Mixes & Soil",
      slug: "potting-mixes",
      description: "Peat-free, microbe-inoculated potting soils formulated for aeration and root vitality.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      sortOrder: 6,
    },
    {
      name: "Cocopeat & Compost",
      slug: "cocopeat-compost",
      description: "Washed low-EC cocopeat blocks and aged microbial vermicompost.",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      sortOrder: 7,
    },
    {
      name: "Grow Bags & Planters",
      slug: "planters",
      description: "Breathable fabric grow bags and terracotta pottery ensuring root air-pruning.",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      sortOrder: 8,
    },
    {
      name: "Gardening Tools",
      slug: "tools",
      description: "Ergonomic rust-resistant stainless steel trowels, pruners, and soil scoops.",
      image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80",
      sortOrder: 9,
    },
    {
      name: "Watering Accessories",
      slug: "watering",
      description: "Precision brass-rose watering cans and gentle mister sprays for delicate seedlings.",
      image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80",
      sortOrder: 10,
    },
    {
      name: "Plant Nutrition & Care",
      slug: "plant-nutrition",
      description: "Cold-pressed seaweed extracts, organic bio-enzymes, and cold-pressed neem oils.",
      image: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80",
      sortOrder: 11,
    },
    {
      name: "Beginner Starter Kits",
      slug: "starter-kits",
      description: "All-in-one growing systems containing curated seeds, compressed discs, tags, and guides.",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
      sortOrder: 12,
    },
    {
      name: "Balcony & Terrace Kits",
      slug: "balcony-kits",
      description: "Space-optimized vertical and railing growing systems tailored for apartments.",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      sortOrder: 13,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`📁 Seeded ${categoriesData.length} categories`);

  // 3. Collections
  const collectionsData = [
    {
      name: "Balcony Garden Essentials",
      slug: "balcony-essentials",
      description: "Compact crops, non-stretching dwarf plants, and aeration planters specifically selected for sunny apartment balconies.",
      isFeatured: true,
    },
    {
      name: "Heirloom Kitchen Garden",
      slug: "kitchen-garden",
      description: "Classic Indian culinary companions: Desi Pusa Ruby tomatoes, Pavitra Krishna Tulsi, Tikha Hari Mirch, and Desi Khushboo Dhaniya.",
      isFeatured: true,
    },
    {
      name: "Beginner Growing Kits",
      slug: "beginner-kits",
      description: "Zero guesswork kits designed for first-time growers to enjoy their initial harvest within weeks.",
      isFeatured: true,
    },
    {
      name: "Soil & Plant Care",
      slug: "soil-care",
      description: "Living potting blends, aged organic vermicompost, washed coir substrates, and natural soil nourishment.",
      image: "/images/catalog/prod-living-potting-mix-0.jpg",
      isFeatured: true,
    },
    {
      name: "Heirloom Seeds",
      slug: "seeds",
      description: "100% non-GMO open-pollinated heirloom vegetable, culinary herb, flower, and microgreen seed varieties.",
      image: "/images/about/heirloom-seeds.jpg",
      isFeatured: true,
    },
  ];

  const collectionMap = new Map<string, string>();
  for (const col of collectionsData) {
    const created = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
    collectionMap.set(col.slug, created.id);
  }
  console.log(`🏷️  Seeded ${collectionsData.length} curated collections`);

  // 4. Products & Variants (with realistic botanical attributes & integer paise)
  const productsData = [
    // Vegetable Seeds
    {
      name: "Desi Tamatar (Pusa Ruby Tomato) Seeds",
      slug: "desi-tamatar-pusa-ruby",
      description: "An Indian heritage determinate tomato variety celebrated for its rich, tangy flavor and heavy yields in container gardening. Thrives in warm balcony sun.",
      categoryId: categoryMap.get("vegetable-seeds")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/tamatar-packet.jpg",
        "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Solanum lycopersicum (Desi Tamatar)",
      seedCount: "50+ seeds",
      sowingSeason: "August to November (Winter crop) & January to February (Summer crop)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Well-draining, rich loamy soil with 30% compost",
      recommendedPotSize: "12-14 inch container or 15-liter grow bag",
      daysToHarvest: "65-75 days from transplanting",
      careInstructions: "Provide bamboo stake support once fruiting clusters emerge. Water consistently at root level without wetting foliage.",
      storageInstructions: "Store unplanted seeds in cool, dry conditions below 20°C in an airtight container.",
      variants: [
        { sku: "SEED-TOM-01", title: "Seed Packet (50 Seeds)", pricePaise: 14900, compareAtPricePaise: 19900, stock: 120, weightGrams: 10 },
        { sku: "SEED-TOM-02", title: "Grower Value Pack (150 Seeds)", pricePaise: 34900, compareAtPricePaise: 49900, stock: 65, weightGrams: 25 },
      ],
    },
    {
      name: "Tikha Hari Mirch (Pusa Jwala Chili) Seeds",
      slug: "tikha-hari-mirch-pusa-jwala",
      description: "The gold standard of pungent Indian green chilies. Prolific branching, compact bush habit, and exceptional disease resistance for terrace and balcony containers.",
      categoryId: categoryMap.get("vegetable-seeds")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/mirch-packet.jpg",
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Capsicum annuum (Tikha Hari Mirch)",
      seedCount: "40+ seeds",
      sowingSeason: "Year-round in tropical climates; best sown Feb-Mar or Jun-Jul",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.LOW,
      soilSuitability: "Well-aerated potting mix with perlite or coarse river sand",
      recommendedPotSize: "10-12 inch container",
      daysToHarvest: "70-80 days",
      careInstructions: "Pinch early flower buds to encourage bushier branch architecture. Allow soil surface to dry between waterings.",
      storageInstructions: "Keep in a dark, desiccated packet.",
      variants: [
        { sku: "SEED-CHIL-01", title: "Seed Packet (40 Seeds)", pricePaise: 12900, compareAtPricePaise: 17900, stock: 95, weightGrams: 8 },
      ],
    },
    {
      name: "Pusa Sawani Bhindi (Indian Okra) Seeds",
      slug: "pusa-sawani-bhindi-okra",
      description: "Tender, spineless dark-green pods on vigorous Indian heirloom stems. Beautiful hibiscus-like yellow flowers make this both edible and ornamental on your balcony.",
      categoryId: categoryMap.get("vegetable-seeds")!,
      isPublished: true,
      isFeatured: false,
      images: [
        "/images/seeds/bhindi-packet.jpg",
        "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Abelmoschus esculentus (Pusa Sawani Bhindi)",
      seedCount: "35 seeds",
      sowingSeason: "February to March (Spring) & June to July (Monsoon)",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Loose organic garden soil with compost",
      recommendedPotSize: "12-14 inch pot",
      daysToHarvest: "50-60 days",
      careInstructions: "Harvest pods frequently at 3-4 inches to stimulate non-stop yield.",
      storageInstructions: "Cool dry ambient storage.",
      variants: [
        { sku: "SEED-OKRA-01", title: "Seed Packet (35 Seeds)", pricePaise: 13900, compareAtPricePaise: 18900, stock: 80, weightGrams: 15 },
      ],
    },
    {
      name: "Desi Palak (All Green Spinach) Seeds",
      slug: "desi-palak-all-green-spinach",
      description: "Classic Indian broad-leaf all-green spinach with succulent, iron-rich leaves. Rapid regrowth allows multiple cuttings every 12 to 15 days.",
      categoryId: categoryMap.get("vegetable-seeds")!,
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
      variants: [
        { sku: "SEED-PAL-01", title: "Seed Packet (200+ Seeds)", pricePaise: 11900, compareAtPricePaise: 15900, stock: 100, weightGrams: 15 },
      ],
    },

    // Herb Seeds
    {
      name: "Pavitra Krishna Tulsi (Holy Basil) Seeds",
      slug: "pavitra-krishna-tulsi-holy-basil",
      description: "Sacred Indian Krishna Tulsi with deep purple-tinted aromatic foliage and revered medicinal vitality. Essential for ayurvedic herbal teas and sunny balconies.",
      categoryId: categoryMap.get("herb-seeds")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/tulsi-packet.jpg",
        "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Ocimum sanctum (Krishna Tulsi)",
      seedCount: "100+ seeds",
      sowingSeason: "Spring, summer, and monsoon. Indoors year-round.",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Moist, humus-rich soil with good drainage",
      recommendedPotSize: "8-10 inch pot or windowsill trough",
      daysToHarvest: "30-40 days for leaf picking",
      careInstructions: "Pinch top flowering spikes regularly to promote bushy branching and lush foliage.",
      storageInstructions: "Airtight packet in dry dark drawer.",
      variants: [
        { sku: "SEED-TUL-01", title: "Seed Packet (100 Seeds)", pricePaise: 12900, compareAtPricePaise: 17900, stock: 110, weightGrams: 5 },
      ],
    },
    {
      name: "Desi Khushboo Dhaniya (Indian Coriander) Seeds",
      slug: "desi-khushboo-dhaniya-coriander",
      description: "Native slow-bolting Indian coriander variety with intense citrus-peppery aroma and tender feathery stems. Ideal for frequent fresh kitchen garnishes.",
      categoryId: categoryMap.get("herb-seeds")!,
      isPublished: true,
      isFeatured: false,
      images: [
        "/images/seeds/dhaniya-packet.jpg",
        "https://images.unsplash.com/photo-1589135233689-d54b8d781b49?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Coriandrum sativum (Desi Dhaniya)",
      seedCount: "120 seeds",
      sowingSeason: "October to March; partial shade during high summer",
      sunlight: SunlightLevel.PARTIAL_SHADE,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Well-aerated container mix",
      recommendedPotSize: "Wide shallow planter (6-8 inches deep)",
      daysToHarvest: "35-45 days",
      careInstructions: "Gently split the seed husks into two halves before sowing for 2x faster germination.",
      storageInstructions: "Store sealed in cool dry conditions.",
      variants: [
        { sku: "SEED-COR-01", title: "Seed Packet (120 Seeds)", pricePaise: 11900, compareAtPricePaise: 15900, stock: 140, weightGrams: 20 },
      ],
    },
    {
      name: "Kasoori Methi (Fragrant Fenugreek) Seeds",
      slug: "kasoori-methi-fragrant-fenugreek",
      description: "Small-leaf aromatic Nagaur Kasoori Methi with prized musky fragrance. Harvest tender young micro-leaves for parathas, dals, and drying into fragrant herbs.",
      categoryId: categoryMap.get("herb-seeds")!,
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
      variants: [
        { sku: "SEED-MET-01", title: "Seed Packet (150+ Seeds)", pricePaise: 11900, compareAtPricePaise: 15900, stock: 90, weightGrams: 20 },
      ],
    },

    // Microgreen Seeds
    {
      name: "Pusa Chetki Lal Mooli (Radish Microgreen) Seeds",
      slug: "pusa-chetki-lal-mooli-microgreens",
      description: "Vibrant pink stems and crisp peppery Indian radish cotyledons. Ready to harvest in just 6 to 8 days with zero chemicals or fertilizers required.",
      categoryId: categoryMap.get("microgreen-seeds")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "/images/seeds/mooli-packet.jpg",
        "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Raphanus sativus (Lal Mooli Microgreens)",
      seedCount: "100g pack (~8,000 seeds)",
      sowingSeason: "Year-round indoors",
      sunlight: SunlightLevel.BRIGHT_INDOORS,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      soilSuitability: "Coir peat mat or thin layer of fine cocopeat",
      recommendedPotSize: "Shallow microgreen tray (2 inches deep)",
      daysToHarvest: "6-8 days",
      careInstructions: "Keep in blackout for the first 3 days after sowing, then expose to bright windowsill light.",
      storageInstructions: "Keep bag tightly zipped in dry conditions.",
      variants: [
        { sku: "MICRO-RAD-100", title: "100g Seed Pack (approx. 5 trays)", pricePaise: 19900, compareAtPricePaise: 27900, stock: 75, weightGrams: 100 },
        { sku: "MICRO-RAD-250", title: "250g Value Pack", pricePaise: 44900, compareAtPricePaise: 59900, stock: 40, weightGrams: 250 },
      ],
    },

    // Potting Mixes & Soil
    {
      name: "Rootkind Botanical Living Potting Mix",
      slug: "living-potting-mix",
      description: "Our signature blend of washed low-EC cocopeat, composted cow manure, perlite, vermiculite, neem cake, and beneficial mycorrhizal fungi. Ready to use straight out of the bag.",
      categoryId: categoryMap.get("potting-mixes")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Organic Substrate",
      soilSuitability: "Ideal for all balcony vegetables, herbs, flowering annuals, and indoor houseplants",
      careInstructions: "Lightly moisten before planting. Feed with organic liquid seaweed every 3 weeks after seedling establishment.",
      variants: [
        { sku: "SOIL-MIX-5KG", title: "5 kg Breathable Kraft Bag", pricePaise: 39900, compareAtPricePaise: 49900, stock: 50, weightGrams: 5000 },
        { sku: "SOIL-MIX-10KG", title: "10 kg Master Bag", pricePaise: 69900, compareAtPricePaise: 89900, stock: 35, weightGrams: 10000 },
      ],
    },
    {
      name: "Organic Vermicompost with Active Microbes",
      slug: "organic-vermicompost-active-microbes",
      description: "Pure, slow-cured earthworm humus enriched with humic acid and beneficial soil flora. Enriches soil structure and unlocks micro-nutrients.",
      categoryId: categoryMap.get("cocopeat-compost")!,
      isPublished: true,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Soil Conditioner",
      careInstructions: "Top-dress 2-3 tablespoons per pot once every month, lightly scratching into the upper layer.",
      variants: [
        { sku: "COMP-VERM-5KG", title: "5 kg Bag", pricePaise: 29900, compareAtPricePaise: 39900, stock: 60, weightGrams: 5000 },
      ],
    },

    // Grow Bags & Planters
    {
      name: "Aerated Geotextile Fabric Grow Bags (Set of 5)",
      slug: "fabric-grow-bags-set-of-5",
      description: "Heavy-duty 350 GSM UV-stabilized breathable fabric planters with reinforced webbing handles. Prevents root circling through natural air-pruning.",
      categoryId: categoryMap.get("planters")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Planter Accessory",
      careInstructions: "Wash with mild water and air dry between seasons. Fold flat for effortless off-season storage.",
      variants: [
        { sku: "BAG-FAB-10IN", title: "Set of 5 (10-inch diameter / 12L)", pricePaise: 54900, compareAtPricePaise: 74900, stock: 45, weightGrams: 600 },
        { sku: "BAG-FAB-12IN", title: "Set of 5 (12-inch diameter / 20L)", pricePaise: 69900, compareAtPricePaise: 94900, stock: 30, weightGrams: 850 },
      ],
    },

    // Gardening Tools
    {
      name: "Artisan Stainless Steel Hand Trowel & Weeder",
      slug: "artisan-stainless-steel-hand-trowel",
      description: "Forged Japanese-grade stainless steel blade etched with depth markings in centimeters, paired with an ergonomic oiled beechwood handle. Built for a lifetime of planting.",
      categoryId: categoryMap.get("tools")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=1000&q=80",
      ],
      careInstructions: "Wipe clean after use and occasionally apply natural mineral oil to the wooden handle.",
      variants: [
        { sku: "TOOL-TRW-01", title: "Classic Trowel (Beechwood Handle)", pricePaise: 64900, compareAtPricePaise: 84900, stock: 40, weightGrams: 280 },
      ],
    },

    // Watering Accessories
    {
      name: "Botanical Heritage Brass-Rose Watering Can (1.8L)",
      slug: "botanical-brass-rose-watering-can",
      description: "Balanced powder-coated galvanized steel with a removable fine-spray brass rose head. Emits a soft, gentle shower that won't dislodge fragile seedlings.",
      categoryId: categoryMap.get("watering")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=1000&q=80",
      ],
      careInstructions: "Empty standing water after use. Rinse brass rose occasionally to clear mineral sediment.",
      variants: [
        { sku: "WAT-CAN-18L-MOSS", title: "Moss Green (1.8 Liter)", pricePaise: 129900, compareAtPricePaise: 169900, stock: 25, weightGrams: 750 },
        { sku: "WAT-CAN-18L-TERRA", title: "Terracotta Bronze (1.8 Liter)", pricePaise: 129900, compareAtPricePaise: 169900, stock: 20, weightGrams: 750 },
      ],
    },

    // Beginner Starter Kits
    {
      name: "The First Harvest Balcony Vegetable Kit",
      slug: "first-harvest-balcony-vegetable-kit",
      description: "The complete starter set for new urban gardeners. Contains 4 authentic Indian heirloom seed varieties (Desi Tamatar, Tikha Hari Mirch, Desi Palak, Desi Khushboo Dhaniya), 4 breathable fabric grow bags, 4 expanding cocopeat discs, plant identification markers, and an illustrated step-by-step growing booklet.",
      categoryId: categoryMap.get("starter-kits")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Complete Growing System",
      sowingSeason: "Ideal for any season with 4+ hours of daily sun",
      sunlight: SunlightLevel.FULL_SUN,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      careInstructions: "Hydrate cocopeat discs with warm water in bags, sow seeds at marked depths, and follow week-by-week guide included in the box.",
      variants: [
        { sku: "KIT-START-BALC", title: "Complete Starter Box (4 Crops + Pots + Soil)", pricePaise: 149900, compareAtPricePaise: 199900, stock: 35, weightGrams: 2200 },
      ],
    },
    {
      name: "Windowsill Kitchen Culinary Herb Kit",
      slug: "windowsill-kitchen-culinary-herb-kit",
      description: "Fresh herbs within arm's reach of your kitchen counter. Includes Pavitra Krishna Tulsi, Desi Khushboo Dhaniya, and Kasoori Methi, 3 biodegradable coconut coir pots, organic seed-starting mix, and chalk labels.",
      categoryId: categoryMap.get("starter-kits")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
      ],
      plantType: "Herb Growing Kit",
      sunlight: SunlightLevel.BRIGHT_INDOORS,
      difficulty: GrowingDifficulty.EASY,
      watering: WateringNeed.MODERATE,
      daysToHarvest: "25-35 days",
      variants: [
        { sku: "KIT-HERB-WIN", title: "Culinary Herb Trio Set", pricePaise: 99900, compareAtPricePaise: 139900, stock: 50, weightGrams: 1100 },
      ],
    },

    // Plant Nutrition
    {
      name: "Cold-Pressed Liquid Seaweed Bio-Stimulant (500ml)",
      slug: "cold-pressed-liquid-seaweed",
      description: "100% natural Ascophyllum nodosum marine extract rich in trace minerals, auxins, and cytokinins. Boosts root expansion, flowering set, and drought tolerance.",
      categoryId: categoryMap.get("plant-nutrition")!,
      isPublished: true,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80",
      ],
      careInstructions: "Dilute 3ml in 1 liter of water and apply as foliar mist or soil drench once every 14 days.",
      variants: [
        { sku: "NUT-SEA-500ML", title: "500ml Concentrated Bottle", pricePaise: 38900, compareAtPricePaise: 49900, stock: 65, weightGrams: 550 },
      ],
    },
    {
      name: "Cold-Pressed Organic Neem Oil Spray (Concentrate)",
      slug: "organic-neem-oil-concentrate",
      description: "High-azadirachtin cold-pressed neem kernel oil with natural biodegradable emulsifier. Safe, non-toxic protection against whiteflies, aphids, and powdery mildew.",
      categoryId: categoryMap.get("plant-nutrition")!,
      isPublished: true,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80",
      ],
      careInstructions: "Mix 5ml with 1 liter of lukewarm water. Spray late in the evening on upper and lower leaf surfaces.",
      variants: [
        { sku: "CARE-NEEM-250ML", title: "250ml Emulsified Concentrate", pricePaise: 32900, compareAtPricePaise: 44900, stock: 70, weightGrams: 300 },
      ],
    },
  ];

  for (const item of productsData) {
    const { variants, ...prodData } = item;
    const product = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {
        ...prodData,
      },
      create: {
        ...prodData,
      },
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          productId: product.id,
          title: v.title,
          pricePaise: v.pricePaise,
          compareAtPricePaise: v.compareAtPricePaise,
          stock: v.stock,
          weightGrams: v.weightGrams,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          title: v.title,
          pricePaise: v.pricePaise,
          compareAtPricePaise: v.compareAtPricePaise,
          stock: v.stock,
          weightGrams: v.weightGrams,
        },
      });
    }
  }
  console.log(`📦 Seeded ${productsData.length} botanical products with variants`);

  // 5. Gardening Journal Articles
  const articlesData = [
    {
      title: "Balcony Gardening 101: How to Start in Compact Urban Spaces",
      slug: "balcony-gardening-beginners-guide",
      excerpt: "Turn six square feet of concrete into a lush edible sanctuary. Learn sun mapping, weight distribution, and selecting high-yield container crops.",
      authorName: "Kavita Rao, Botanical Horticulturist",
      category: "Beginner Guides",
      readingTimeMinutes: 6,
      coverImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
      content: `Urban apartments often come with limited outdoor space, but a 4x6 foot balcony can produce a remarkable bounty of fresh herbs, salad greens, and sun-ripened tomatoes. The secret lies in vertical utilization, choosing dwarf indeterminate varieties, and using lightweight aerated soils rather than dense garden red mud.

### 1. Map Your Balcony Sun
Before purchasing seeds, observe your balcony across three distinct times of day:
- **Direct Full Sun (5-6+ hours)**: Perfect for tomatoes, chilies, eggplants, and sweet basil.
- **Dappled / Morning Sun (3-4 hours)**: Ideal for mint, coriander, spinach, bok choy, and strawberries.
- **Indirect Bright Light**: Best suited for windowsill microgreens and leafy Asian greens.

### 2. Ditch Heavy Clay Soil
Never pack urban containers with heavy field clay—it compacts quickly, suffocates root respiration, and adds unnecessary deadweight to your balcony slab. Instead, adopt a 40-40-20 ratio: 40% washed low-EC cocopeat for moisture retention, 40% living vermicompost for biology, and 20% coarse perlite or river sand for root aeration.`,
    },
    {
      title: "The India Seasonal Sowing Calendar: When to Plant Vegetables & Herbs",
      slug: "india-seasonal-sowing-calendar",
      excerpt: "A comprehensive regional sowing timetable aligning Indian monsoon, winter, and summer cycles for maximum harvest success.",
      authorName: "Anand Verma, Agronomist",
      category: "Seasonal Guides",
      readingTimeMinutes: 8,
      coverImage: "/images/about/balcony-sanctuary.jpg",
      content: `Unlike temperate zones with distinct spring/autumn freezes, peninsular and northern India follow tropical and subtropical cycles governed by the monsoon and winter dips. Sowing at the exact right moment ensures your seedlings develop deep root systems before extreme heat or heavy rains hit.

### Kharif (Monsoon Season / June - July)
- **Top crops**: Okra (Bhindi), Gourds (Ridge, Bitter, Bottle), Green Chilies, Eggplant.
- **Tip**: Ensure drainage holes in grow bags are completely clear so monsoon deluges do not pool around root crowns.

### Rabi (Winter Season / September - November)
- **Top crops**: Heirloom Tomatoes, Carrots, Radish, Spinach, Peas, Beetroot, Fenugreek (Methi).
- **Tip**: The golden window for Indian container gardeners. Pests are minimal, and germination rates are at their annual peak.`,
    },
    {
      title: "Organic Pest Control: Harnessing Cold-Pressed Neem and Beneficial Predators",
      slug: "organic-pest-control-neem-guide",
      excerpt: "Control aphids, whiteflies, and spider mites naturally without synthetic neurotoxins or chemical residue on your home harvest.",
      authorName: "Dr. Maya Swaminathan",
      category: "Plant Care",
      readingTimeMinutes: 5,
      coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
      content: `When growing food on your balcony, synthetic systemic insecticides have no place near your family's dinner plate. Fortunately, nature provides powerful deterrents that manage garden pests while leaving pollinators and beneficial soil bacteria unharmed.

### The Power of Azadirachtin
Pure cold-pressed neem kernel oil contains azadirachtin, a biological compound that disrupts the hormonal moulting cycle of soft-bodied insects like aphids, mealybugs, and thrips. Because it acts on feeding mechanisms rather than contact poisoning, beneficial ladybugs and bees that visit flower blossoms remain safe when applied in the evening.`,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }
  console.log(`📰 Seeded ${articlesData.length} educational gardening articles`);

  // 6. FAQs
  const faqsData = [
    {
      category: "Seeds & Germination",
      question: "What is Rootkind's Germination Guarantee?",
      answer: "Every batch of Rootkind seeds is laboratory-tested for an 85%+ germination rate. If your seeds fail to sprout after following our included guide within 14 days, send a photo of your setup to hello@rootkind.in and we will ship a replacement packet completely free of charge.",
      sortOrder: 1,
    },
    {
      category: "Seeds & Germination",
      question: "Are your seeds genetically modified (GMO)?",
      answer: "Never. Rootkind exclusively sources 100% open-pollinated, non-hybrid heritage and heirloom seeds from ethical growers across India. You can safely save and replant seeds from your own harvest.",
      sortOrder: 2,
    },
    {
      category: "Shipping & Delivery",
      question: "How long does delivery take across India?",
      answer: "Orders are dispatched from our Bengaluru botanical nursery within 24-48 business hours. Metro deliveries typically arrive in 2-4 days, while non-metro and regional locations take 4-6 days via reliable surface couriers.",
      sortOrder: 3,
    },
    {
      category: "Shipping & Delivery",
      question: "What is your shipping fee policy?",
      answer: "We offer Free Express Shipping on all orders above Rs. 999 anywhere in India. For orders below Rs. 999, a flat standard shipping fee of Rs. 99 applies.",
      sortOrder: 4,
    },
    {
      category: "Growing & Care",
      question: "I have never grown a plant before. Which kit should I pick?",
      answer: "We recommend starting with 'The First Harvest Balcony Vegetable Kit' or the 'Windowsill Kitchen Culinary Herb Kit'. Both contain pre-measured expanding coir discs and foolproof instructions designed specifically for absolute beginners.",
      sortOrder: 5,
    },
  ];

  for (const f of faqsData) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: f.question },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: f });
    }
  }
  console.log(`❓ Seeded ${faqsData.length} FAQs`);

  console.log("✅ Rootkind Botanical Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

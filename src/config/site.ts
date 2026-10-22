export const siteConfig = {
  name: "Rootkind",
  legalName: "Rootkind Botanical Goods Private Limited",
  tagline: "Grow good things at home.",
  description:
    "Everything you need to grow your own vegetables, herbs and fruits, from your first seed to your first harvest. Direct-to-consumer premium seeds, organic soils, handcrafted planters, and guided growing kits for balconies, terraces, and home gardens.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og-rootkind.jpg",
  supportEmail: "hello@rootkind.in",
  supportPhone: "+91 (080) 4123-7890",
  address: "Rootkind Botanical Nursery & Labs, 4th Block Koramangala, Bengaluru, Karnataka 560034",
  
  // Financial & Shipping Rules (stored in integer paise)
  freeShippingThresholdPaise: 99900, // Free shipping on orders over ₹999
  standardShippingFeePaise: 9900,    // Standard shipping ₹99
  currency: "INR",
  currencySymbol: "₹",

  // Centralized Navigation
  mainNav: [
    { title: "Shop all", href: "/shop" },
    { title: "Seeds", href: "/collections/seeds" },
    { title: "Soil and care", href: "/collections/soil-care" },
    { title: "Growing kits", href: "/collections/starter-kits" },
    { title: "Growing guides", href: "/journal" },
    { title: "Our story", href: "/about" },
  ],

  announcement: {
    enabled: true,
    text: "Seasonal botanical collections for home growers across India",
    linkText: "Browse seeds & care",
    href: "/shop",
  },

  trustBadges: [
    {
      title: "100% Non-GMO Seeds",
      description: "Open-pollinated, high-germination heirloom varieties",
      icon: "Sprout",
    },
    {
      title: "Organic Potting Blends",
      description: "Microbial-rich, peat-free, aerated substrates",
      icon: "Leaf",
    },
    {
      title: "Germination Support",
      description: "Free replacement if seeds fail to germinate with guide",
      icon: "ShieldCheck",
    },
    {
      title: "Eco-Conscious Packaging",
      description: "Zero single-use plastics, recyclable botanical pouches",
      icon: "PackageCheck",
    },
  ],

  footerNav: {
    shop: [
      { title: "Vegetable Seeds", href: "/collections/vegetable-seeds" },
      { title: "Herb Garden", href: "/collections/herb-seeds" },
      { title: "Balcony Grow Kits", href: "/collections/starter-kits" },
      { title: "Organic Potting Mix", href: "/collections/potting-mixes" },
      { title: "Handcrafted Planters", href: "/collections/planters" },
      { title: "Gardening Tools", href: "/collections/tools" },
    ],
    learn: [
      { title: "Growing Journal", href: "/journal" },
      { title: "Balcony Gardening 101", href: "/journal/balcony-gardening-beginners-guide" },
      { title: "Sowing Calendar", href: "/journal/india-seasonal-sowing-calendar" },
      { title: "Natural Pest Control", href: "/journal/organic-pest-control-neem-guide" },
      { title: "Microgreens at Home", href: "/journal/growing-microgreens-on-windowsill" },
    ],
    company: [
      { title: "About Rootkind", href: "/about" },
      { title: "Sustainability Pledge", href: "/about#sustainability" },
      { title: "Contact Us", href: "/contact" },
      { title: "FAQs", href: "/faq" },
      { title: "Track Order", href: "/track-order" },
    ],
    legal: [
      { title: "Shipping Policy", href: "/shipping-policy" },
      { title: "Returns & Refunds", href: "/returns-refunds" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms of Service", href: "/terms" },
    ],
  },
};

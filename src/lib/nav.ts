export interface NavItem {
  title: string;
  href: string;
  isExistingRoute: boolean;
}

export interface NavColumn {
  title: string;
  ariaLabel: string;
  items: NavItem[];
}

export interface BottomBarLink {
  title: string;
  href: string;
  isExistingRoute: boolean;
}

export const FOOTER_NAV_COLUMNS: NavColumn[] = [
  {
    title: "Shop",
    ariaLabel: "Shop navigation",
    items: [
      {
        title: "Vegetable Seeds",
        href: "/collections/vegetable-seeds",
        isExistingRoute: true,
      },
      {
        title: "Herb Garden",
        href: "/collections/herb-seeds",
        isExistingRoute: true,
      },
      {
        title: "Balcony Grow Kits",
        href: "/collections/starter-kits",
        isExistingRoute: true,
      },
      {
        title: "Organic Potting Mix",
        href: "/collections/potting-mixes",
        isExistingRoute: true,
      },
      {
        title: "Handcrafted Planters",
        href: "/collections/planters",
        isExistingRoute: true,
      },
      {
        title: "Gardening Tools",
        href: "/collections/tools",
        isExistingRoute: true,
      },
    ],
  },
  {
    title: "Learn",
    ariaLabel: "Learn navigation",
    items: [
      {
        title: "Growing Journal",
        href: "/journal",
        isExistingRoute: true,
      },
      {
        title: "Balcony Gardening 101",
        href: "/journal/balcony-gardening-beginners-guide",
        isExistingRoute: true,
      },
      {
        title: "Sowing Calendar",
        href: "/journal/india-seasonal-sowing-calendar",
        isExistingRoute: true,
      },
      {
        title: "Natural Pest Control",
        href: "/journal/organic-pest-control-neem-guide",
        isExistingRoute: true,
      },
      {
        // Missing route: article "growing-microgreens-on-windowsill" does not exist in DB or route tree
        title: "Microgreens at Home",
        href: "/journal/growing-microgreens-on-windowsill",
        isExistingRoute: false,
      },
    ],
  },
  {
    title: "Help",
    ariaLabel: "Help navigation",
    items: [
      {
        title: "Track Order",
        href: "/track-order",
        isExistingRoute: true,
      },
      {
        title: "Shipping Policy",
        href: "/shipping-policy",
        isExistingRoute: true,
      },
      {
        title: "Returns & Refunds",
        href: "/returns-refunds",
        isExistingRoute: true,
      },
      {
        title: "FAQs",
        href: "/faq",
        isExistingRoute: true,
      },
      {
        title: "Contact Us",
        href: "/contact",
        isExistingRoute: true,
      },
    ],
  },
];

export const BOTTOM_BAR_LINKS: BottomBarLink[] = [
  {
    title: "About Rootkind",
    href: "/about",
    isExistingRoute: true,
  },
  {
    // Anchor on /about page
    title: "Sustainability Pledge",
    href: "/about#sustainability",
    isExistingRoute: true,
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    isExistingRoute: true,
  },
  {
    title: "Terms of Service",
    href: "/terms",
    isExistingRoute: true,
  },
];

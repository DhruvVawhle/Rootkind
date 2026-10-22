/**
 * Starter Kits Data
 * All prices in integer paise. Formatted with Intl.NumberFormat("en-IN", INR).
 * Placeholders are marked with isPlaceholder: true so UI renders dashed chips.
 */

export interface KitItem {
  id: string;
  slug: string;
  name: string;
  pricePaise: number;
  place: string;
  level: string;
  description: string;
  image?: string;
  imageAlt?: string;
  variantId?: string;
  seeds: {
    name: string;
    isPlaceholder?: boolean;
  }[];
  extras: {
    name: string;
    isPlaceholder?: boolean;
  }[];
}

export const STARTER_KITS_DATA: KitItem[] = [
  {
    id: "kit-1",
    slug: "first-harvest-balcony-vegetable-kit",
    variantId: "cmvjp9jmh0022vlc4a9bl9emx",
    name: "The First Harvest Balcony Vegetable Kit",
    pricePaise: 149900,
    place: "Balcony",
    level: "Beginner",
    description:
      "The complete starter set for new urban gardeners. Contains 4 heirloom seed varieties.",
    image: "/images/catalog/prod-first-harvest-balcony-vegetable-kit-0.jpg",
    imageAlt: "The First Harvest Balcony Vegetable Kit with heirloom seeds, fabric grow bags, cocopeat discs, and garden guide",
    seeds: [
      { name: "Cherry Tomato" },
      { name: "Pusa Chili" },
      { name: "[3rd variety]", isPlaceholder: true },
      { name: "[4th variety]", isPlaceholder: true },
    ],
    extras: [
      { name: "Cocopeat discs" },
      { name: "Fabric planters" },
      { name: "Plant markers" },
      { name: "Care guide" },
    ],
  },
  {
    id: "kit-2",
    slug: "windowsill-kitchen-culinary-herb-kit",
    variantId: "cmvjp9jmt0026vlc4woi3xp0w",
    name: "Windowsill Kitchen Culinary Herb Kit",
    pricePaise: 99900,
    place: "Windowsill",
    level: "Beginner",
    description: "Fresh herbs within arm's reach of your kitchen counter.",
    image: "/images/catalog/prod-windowsill-kitchen-culinary-herb-kit-0.jpg",
    imageAlt: "Windowsill Kitchen Culinary Herb Kit with sweet basil, oregano, coriander seeds, pots, and markers",
    seeds: [
      { name: "Genovese Basil" },
      { name: "Italian Oregano" },
      { name: "Coriander" },
      { name: "[rest of list]", isPlaceholder: true },
    ],
    extras: [
      { name: "Cocopeat discs" },
      { name: "Fabric planters" },
      { name: "Plant markers" },
      { name: "Care guide" },
    ],
  },
];

/**
 * Format paise into Indian Rupee currency string without floats
 */
export function formatKitPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

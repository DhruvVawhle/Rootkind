// NEEDS BUSINESS CONFIRMATION
export interface TrustClaim {
  id: string;
  title: string;
  description: string;
  icon: "Sprout" | "Leaf" | "ShieldCheck" | "PackageCheck";
}

export const TRUST_CLAIMS: TrustClaim[] = [
  {
    id: "claim-non-gmo",
    title: "100% Non-GMO Seeds",
    description:
      "Open-pollinated, high-germination heirloom varieties grown by ethical Indian farmers.",
    icon: "Sprout",
  },
  {
    id: "claim-living-soils",
    title: "Living Microbial Soils",
    description:
      "Peat-free, aged vermicompost and washed coir substrates aerated for container vitality.",
    icon: "Leaf",
  },
  {
    id: "claim-germination-guarantee",
    title: "Germination Guarantee",
    description:
      "Free seed replacement if your packet fails to sprout with our guided instructions.",
    icon: "ShieldCheck",
  },
  {
    id: "claim-plastic-free",
    title: "Plastic-Free Packaging",
    description:
      "Delivered in biodegradable kraft bags and recycled corrugated fiber containers.",
    icon: "PackageCheck",
  },
];

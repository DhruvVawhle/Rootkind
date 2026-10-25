"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface FilterChipsProps {
  categories: CategoryItem[];
  activeCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

// 14 Category Chips in required canonical order
export const CANONICAL_CATEGORIES = [
  { name: "All Products", slug: null },
  { name: "Vegetable Seeds", slug: "vegetable-seeds" },
  { name: "Herb Seeds", slug: "herb-seeds" },
  { name: "Fruit Seeds & Plants", slug: "fruit-seeds" },
  { name: "Microgreen Seeds", slug: "microgreen-seeds" },
  { name: "Flower Seeds", slug: "flower-seeds" },
  { name: "Potting Mixes & Soil", slug: "potting-mixes" },
  { name: "Cocopeat & Compost", slug: "cocopeat-compost" },
  { name: "Grow Bags & Planters", slug: "planters" },
  { name: "Gardening Tools", slug: "tools" },
  { name: "Watering Accessories", slug: "watering" },
  { name: "Plant Nutrition & Care", slug: "plant-nutrition" },
  { name: "Beginner Starter Kits", slug: "starter-kits" },
  { name: "Balcony & Terrace Kits", slug: "balcony-kits" },
];

export function FilterChips({
  categories,
  activeCategory,
  onSelectCategory,
}: FilterChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Stagger pop in on load
  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const chips = container.querySelectorAll(".filter-chip-item");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chips,
        { scale: 0.75, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.035,
          ease: "back.out(1.5)",
          delay: 0.2,
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  // Merge canonical list with any database categories
  const chipList = CANONICAL_CATEGORIES;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto pb-2 scrollbar-none snap-x flex max-[600px]:flex-nowrap flex-wrap items-center gap-2"
      role="region"
      aria-label="Category filters"
    >
      {chipList.map((chip) => {
        const isActive =
          chip.slug === null
            ? !activeCategory
            : activeCategory === chip.slug;

        return (
          <button
            key={chip.slug || "all"}
            type="button"
            onClick={() => onSelectCategory(chip.slug)}
            aria-pressed={isActive}
            className={`filter-chip-item snap-start shrink-0 min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] ${
              isActive
                ? "bg-[#153F2D] text-[#F7F4EA] shadow-sm scale-100"
                : "bg-white text-[#282B25] border border-[#DCD5C1] hover:bg-[#EDE7D8] active:scale-95"
            }`}
          >
            {chip.name}
          </button>
        );
      })}
    </div>
  );
}

export default FilterChips;

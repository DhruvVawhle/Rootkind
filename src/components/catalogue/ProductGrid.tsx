"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { FilterChips, CategoryItem } from "@/components/catalogue/FilterChips";
import { SortSelect } from "@/components/catalogue/SortSelect";
import { gsap, Flip, isReducedMotion } from "@/lib/gsap";
import { Sprout, RotateCcw } from "lucide-react";

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  plantType?: string | null;
  sunlight?: string | null;
  difficulty?: string | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: {
    id: string;
    sku: string;
    title: string;
    pricePaise: number;
    compareAtPricePaise?: number | null;
    stock: number;
  }[];
  createdAt: string | Date;
}

interface ProductGridProps {
  initialProducts: SerializedProduct[];
  categories: CategoryItem[];
  initialCategory?: string | null;
  initialSort?: string;
}

export function ProductGrid({
  initialProducts,
  categories,
  initialCategory = null,
  initialSort = "featured",
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory || searchParams?.get("category") || null
  );
  const [activeSort, setActiveSort] = useState<string>(
    initialSort || searchParams?.get("sort") || "featured"
  );

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<any>(null);
  const isInitialMount = useRef(true);

  // Sync state if searchParams change externally (e.g. back/forward button)
  useEffect(() => {
    const cat = searchParams?.get("category") || null;
    const srt = searchParams?.get("sort") || "featured";
    if (cat !== activeCategory) setActiveCategory(cat);
    if (srt !== activeSort) setActiveSort(srt);
  }, [searchParams]);

  // Compute filtered & sorted products
  const filteredProducts = initialProducts.filter((prod) => {
    if (!activeCategory) return true;
    return prod.category?.slug === activeCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants[0]?.pricePaise || 0;
    const priceB = b.variants[0]?.pricePaise || 0;
    const compareA = a.variants[0]?.compareAtPricePaise || priceA;
    const compareB = b.variants[0]?.compareAtPricePaise || priceB;
    const savingsA = compareA - priceA;
    const savingsB = compareB - priceB;

    if (activeSort === "price-asc") return priceA - priceB;
    if (activeSort === "price-desc") return priceB - priceA;
    if (activeSort === "savings") return savingsB - savingsA;
    // default: "featured" -> order by createdAt desc
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handle Category Selection with GSAP Flip
  const handleSelectCategory = (catSlug: string | null) => {
    if (catSlug === activeCategory) return;

    if (typeof window !== "undefined" && !isReducedMotion()) {
      flipStateRef.current = Flip.getState(".flip-card-wrapper");
    }

    setActiveCategory(catSlug);

    // Update URL query state
    const params = new URLSearchParams(window.location.search);
    if (catSlug) {
      params.set("category", catSlug);
    } else {
      params.delete("category");
    }
    const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    window.history.pushState(null, "", newUrl);
  };

  // Handle Sort Selection with GSAP Flip
  const handleSortChange = (newSort: string) => {
    if (newSort === activeSort) return;

    if (typeof window !== "undefined" && !isReducedMotion()) {
      flipStateRef.current = Flip.getState(".flip-card-wrapper");
    }

    setActiveSort(newSort);

    // Update URL query state
    const params = new URLSearchParams(window.location.search);
    if (newSort && newSort !== "featured") {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }
    const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    window.history.pushState(null, "", newUrl);
  };

  // Run GSAP Flip animation when filtered/sorted products change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (
      typeof window === "undefined" ||
      isReducedMotion() ||
      !flipStateRef.current
    ) {
      return;
    }

    // Flip animation on wrapper element so scroll reveal inside card doesn't clash
    Flip.from(flipStateRef.current, {
      targets: ".flip-card-wrapper",
      duration: 0.5,
      ease: "power2.inOut",
      scale: true,
      stagger: 0.02,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.82,
          duration: 0.3,
          ease: "power2.in",
        }),
    });

    flipStateRef.current = null;
  }, [activeCategory, activeSort]);

  return (
    <div className="space-y-6">
      {/* 1. Filter Chips & Sort Controls */}
      <div className="space-y-4">
        <FilterChips
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-[#DCD5C1] pb-4">
          {/* Live aria region for result counts */}
          <p
            aria-live="polite"
            className="text-xs sm:text-sm font-medium text-[#5A5E53]"
          >
            Showing <strong className="text-[#153F2D]">{sortedProducts.length}</strong> of{" "}
            {initialProducts.length} products
            {activeCategory && (
              <span className="ml-1 text-[#7D9565]">
                (filtered by {activeCategory.replace(/-/g, " ")})
              </span>
            )}
          </p>

          <div className="w-full sm:w-auto">
            <SortSelect
              currentSort={activeSort}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      {/* 2. Product Grid or Empty State */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#DCD5C1] p-8 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#EDE7D8] text-[#7D9565] flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#153F2D] mb-2">
            No botanical items match this collection
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5E53] max-w-sm mx-auto mb-6">
            We are preparing the next seasonal harvest for this category. Explore our complete catalogue or reset your filters.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory(null)}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#153F2D] text-[#F7F4EA] font-semibold text-xs hover:bg-[#1C523B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to All Products</span>
          </button>
        </div>
      ) : (
        <div
          ref={gridContainerRef}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 [grid-template-columns:repeat(2,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))]"
        >
          {sortedProducts.map((prod, idx) => (
            <div
              key={prod.id}
              className="flip-card-wrapper will-change-transform flex flex-col"
              data-flip-id={prod.id}
            >
              <ProductCard
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                description={prod.description}
                plantType={prod.plantType}
                sunlight={prod.sunlight}
                difficulty={prod.difficulty}
                images={prod.images}
                defaultVariant={
                  prod.variants[0] || {
                    id: `${prod.id}-default`,
                    sku: prod.slug,
                    title: "Standard Packet",
                    pricePaise: 18000,
                    stock: 50,
                  }
                }
                index={idx % 4}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;

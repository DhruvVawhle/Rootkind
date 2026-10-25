"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

interface CatalogueHeaderProps {
  productCount: number;
}

export function CatalogueHeader({ productCount }: { productCount: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const el = containerRef.current;
    if (!el) return;

    const heading = el.querySelector(".catalogue-heading-inner");
    const intro = el.querySelector(".catalogue-intro");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );
      gsap.fromTo(
        intro,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="border-b border-[#DCD5C1] pb-6 mb-6">
      <div className="overflow-hidden py-1">
        <h1 className="catalogue-heading-inner font-serif text-3xl sm:text-5xl font-bold text-[#153F2D] will-change-transform">
          Botanical Catalogue
        </h1>
      </div>
      <p className="catalogue-intro text-xs sm:text-sm text-[#5A5E53] mt-1.5 max-w-xl">
        Explore {productCount} home-growing essentials. Non-GMO seeds, living potting soils, and balcony gardening tools.
      </p>
    </div>
  );
}

export default CatalogueHeader;

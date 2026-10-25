"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatPaise } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "@/components/AddToCart";
import { useLiquidHover } from "@/components/LiquidFilter";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  plantType?: string | null;
  sunlight?: string | null;
  difficulty?: string | null;
  images: string[];
  defaultVariant: {
    id: string;
    sku: string;
    title: string;
    pricePaise: number;
    compareAtPricePaise?: number | null;
    stock: number;
  };
  index?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  plantType,
  difficulty,
  images,
  defaultVariant,
  index = 0,
}: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  useLiquidHover(imageContainerRef);

  const primaryImage = images[0] || "/images/about/heirloom-seeds.jpg";
  // Secondary "fully grown" plant harvest image
  const secondaryImage = images[1] || "/images/about/balcony-sanctuary.jpg";

  const discountPercent =
    defaultVariant.compareAtPricePaise && defaultVariant.compareAtPricePaise > defaultVariant.pricePaise
      ? Math.round(
          ((defaultVariant.compareAtPricePaise - defaultVariant.pricePaise) /
            defaultVariant.compareAtPricePaise) *
            100
        )
      : null;

  return (
    <motion.div
      id={`product-card-${slug}`}
      tabIndex={0}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.21, 0.47, 0.32, 0.98], // power3.out
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white rounded-xl border border-[#DCD5C1] overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:border-[#153F2D]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
    >
      {/* Product Image Area with Liquid Filter & Motion layoutId */}
      <Link
        href={`/products/${slug}`}
        data-cursor="view"
        data-product-image="true"
        className="relative aspect-4/3 w-full bg-[#EDE7D8]/50 overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
        aria-label={`View details for ${name}`}
      >
        <div ref={imageContainerRef} className="relative w-full h-full will-change-[filter]">
          <motion.div
            layoutId={`product-image-${slug}`}
            className="relative w-full h-full"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Primary Seed/Packet Image */}
            <Image
              src={primaryImage}
              alt={`${name} seed packet`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0 group-focus-within:opacity-0"
            />
            {/* "Fully Grown" Harvest Plant Image (fades in on hover or focus) */}
            <Image
              src={secondaryImage}
              alt={`${name} fully grown botanical harvest`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-105 group-focus-within:scale-105 transition-all duration-500 ease-out"
            />
          </motion.div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {discountPercent && (
            <Badge variant="terracotta" className="text-[10px] px-2 py-0.5">
              Save {discountPercent}%
            </Badge>
          )}
          {difficulty && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 capitalize bg-white/95 text-[#153F2D] shadow-xs">
              {difficulty.toLowerCase()}
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {defaultVariant.stock <= 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-10 pointer-events-none">
            <span className="font-serif font-semibold text-xs tracking-wider uppercase text-[#B83A2E] bg-white px-3 py-1.5 rounded-md border border-[#DCD5C1]">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Card Information */}
      <div className="p-4 max-[600px]:p-3 flex flex-col flex-1 justify-between bg-white">
        <div>
          {plantType && (
            <p className="text-[11px] font-serif italic text-[#5A5E53] tracking-wide mb-1">
              {plantType}
            </p>
          )}
          <Link
            href={`/products/${slug}`}
            className="focus-visible:outline-none focus-visible:underline rounded"
          >
            <h3 className="font-serif font-bold text-base text-[#153F2D] group-hover:text-[#7D9565] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-[#5A5E53] mt-0.5">{defaultVariant.title}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#DCD5C1]/50 flex max-[600px]:flex-col items-center max-[600px]:items-stretch justify-between gap-3">
          <div className="max-[600px]:flex max-[600px]:items-baseline max-[600px]:justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-[#153F2D]">
                {formatPaise(defaultVariant.pricePaise)}
              </span>
              {defaultVariant.compareAtPricePaise && (
                <span className="text-xs text-[#5F6456] line-through">
                  {formatPaise(defaultVariant.compareAtPricePaise)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#153F2D] font-medium">Taxes included</p>
          </div>

          {/* Add button expands from "+ Add" to "+ Add to cart" - full width on <=600px */}
          <AddToCart
            productId={id}
            variantId={defaultVariant.id}
            productName={name}
            disabled={defaultVariant.stock <= 0}
            variant="expandable"
            size="sm"
            className="max-[600px]:w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;

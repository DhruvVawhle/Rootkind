"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPaise } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { Sun, Sparkles, Check, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

export function ProductCard({
  name,
  slug,
  plantType,
  difficulty,
  images,
  defaultVariant,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = images[0] || "/images/about/heirloom-seeds.jpg";
  const secondaryImage = images[1];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || defaultVariant.stock <= 0) return;

    setIsAdding(true);
    try {
      await addItem(defaultVariant.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercent =
    defaultVariant.compareAtPricePaise && defaultVariant.compareAtPricePaise > defaultVariant.pricePaise
      ? Math.round(
          ((defaultVariant.compareAtPricePaise - defaultVariant.pricePaise) /
            defaultVariant.compareAtPricePaise) *
            100
        )
      : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-[#DCD5C1] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#153F2D]/40">
      {/* Product Image Area */}
      <Link href={`/products/${slug}`} className="relative aspect-4/3 w-full bg-[#EDE7D8]/40 overflow-hidden block">
        <Image
          src={primaryImage}
          alt={`${name} seed packet`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-all duration-500 ease-out ${
            secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} botanical harvest`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {discountPercent && (
            <Badge variant="terracotta" className="text-[10px] px-2 py-0.5">
              Save {discountPercent}%
            </Badge>
          )}
          {difficulty && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 capitalize bg-white/90 text-[#153F2D] shadow-2xs">
              {difficulty.toLowerCase()}
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {defaultVariant.stock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
            <span className="font-serif font-semibold text-xs tracking-wider uppercase text-[#B83A2E] bg-white px-3 py-1.5 rounded-md border border-[#DCD5C1]">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Card Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {plantType && (
            <p className="text-[11px] font-serif italic text-[#5A5E53] tracking-wide mb-1">
              {plantType}
            </p>
          )}
          <Link href={`/products/${slug}`}>
            <h3 className="font-serif font-bold text-base text-[#153F2D] group-hover:text-[#7D9565] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-[#5A5E53] mt-0.5">{defaultVariant.title}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#DCD5C1]/50 flex items-center justify-between">
          <div>
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

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || defaultVariant.stock <= 0}
            aria-label={`Add ${name} to basket`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#153F2D] text-[#F7F4EA] hover:bg-[#1C523B] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#7D9565]" />
                <span>Added</span>
              </>
            ) : isAdding ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

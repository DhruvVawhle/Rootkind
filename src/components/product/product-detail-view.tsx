"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatPaise } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Droplet,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ShoppingBag,
} from "lucide-react";

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    plantType?: string | null;
    seedCount?: string | null;
    sowingSeason?: string | null;
    sunlight?: string | null;
    difficulty?: string | null;
    watering?: string | null;
    soilSuitability?: string | null;
    recommendedPotSize?: string | null;
    daysToHarvest?: string | null;
    careInstructions?: string | null;
    storageInstructions?: string | null;
    category: {
      name: string;
      slug: string;
    };
    variants: Array<{
      id: string;
      sku: string;
      title: string;
      pricePaise: number;
      compareAtPricePaise?: number | null;
      stock: number;
      weightGrams?: number | null;
    }>;
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "care" | "delivery">("specs");

  const images = product.images.length > 0
    ? product.images
    : ["/images/about/heirloom-seeds.jpg"];

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stock <= 0 || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = selectedVariant.stock <= 0;
  const discountPercent =
    selectedVariant.compareAtPricePaise &&
    selectedVariant.compareAtPricePaise > selectedVariant.pricePaise
      ? Math.round(
          ((selectedVariant.compareAtPricePaise - selectedVariant.pricePaise) /
            selectedVariant.compareAtPricePaise) *
            100
        )
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* LEFT: Image Gallery with Thumbnails */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-[#DCD5C1] shadow-xs">
          <Image
            src={images[selectedImageIndex]}
            alt={`${product.name} botanical view`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          {discountPercent && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="terracotta" className="text-xs font-bold px-3 py-1">
                Save {discountPercent}%
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx
                    ? "border-[#153F2D] ring-2 ring-[#153F2D]/20 shadow-sm"
                    : "border-[#DCD5C1] opacity-70 hover:opacity-100"
                }`}
                aria-label={`View product image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Botanical Highlights Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-6 border-t border-[#DCD5C1]">
          {product.sunlight && (
            <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-[#DCD5C1] flex items-center gap-2 sm:gap-2.5">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#C87855] shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C9083] block truncate">
                  Sunlight
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#153F2D] capitalize truncate block">
                  {product.sunlight.replace(/_/g, " ").toLowerCase()}
                </span>
              </div>
            </div>
          )}

          {product.difficulty && (
            <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-[#DCD5C1] flex items-center gap-2 sm:gap-2.5">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#7D9565] shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C9083] block truncate">
                  Difficulty
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#153F2D] capitalize truncate block">
                  {product.difficulty.toLowerCase()}
                </span>
              </div>
            </div>
          )}

          {product.watering && (
            <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-[#DCD5C1] flex items-center gap-2 sm:gap-2.5">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6] shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C9083] block truncate">
                  Watering
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#153F2D] capitalize truncate block">
                  {product.watering.toLowerCase()}
                </span>
              </div>
            </div>
          )}

          {product.daysToHarvest && (
            <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-[#DCD5C1] flex items-center gap-2 sm:gap-2.5">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#153F2D] shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C9083] block truncate">
                  Harvest In
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#153F2D] truncate block">
                  {product.daysToHarvest.split(" ")[0]} Days
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Buy Box & Product Info */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          {product.plantType && (
            <p className="font-serif italic text-sm text-[#7D9565] mb-1">
              {product.plantType}
            </p>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D] leading-tight">
            {product.name}
          </h1>
          <p className="text-xs text-[#8C9083] mt-1.5">SKU: {selectedVariant.sku}</p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 pb-4 border-b border-[#DCD5C1]">
          <span className="font-serif text-3xl font-bold text-[#153F2D]">
            {formatPaise(selectedVariant.pricePaise)}
          </span>
          {selectedVariant.compareAtPricePaise && (
            <span className="text-base text-[#8C9083] line-through">
              {formatPaise(selectedVariant.compareAtPricePaise)}
            </span>
          )}
          <span className="text-xs font-semibold text-[#7D9565] ml-auto">
            {isOutOfStock ? "Out of Stock" : "In Stock • Ships in 24h"}
          </span>
        </div>

        <p className="text-sm text-[#5A5E53] leading-relaxed">
          {product.description}
        </p>

        {/* Variant Selectors */}
        {product.variants.length > 1 && (
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#153F2D]">
              Choose Pack Size / Option:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 rounded-md text-xs font-semibold border transition-all text-left ${
                    selectedVariant.id === v.id
                      ? "border-[#153F2D] bg-[#153F2D] text-[#F7F4EA] shadow-xs"
                      : "border-[#DCD5C1] bg-white text-[#282B25] hover:bg-[#EDE7D8]"
                  }`}
                >
                  <div>{v.title}</div>
                  <div className="text-[11px] opacity-80">{formatPaise(v.pricePaise)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Add to Cart Row */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between sm:justify-start border border-[#DCD5C1] rounded-md bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
                className="p-2.5 sm:p-3 text-[#153F2D] hover:bg-[#EDE7D8] disabled:opacity-40 transition-colors rounded-l-md"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-[#282B25]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                disabled={quantity >= selectedVariant.stock || isOutOfStock}
                aria-label="Increase quantity"
                className="p-2.5 sm:p-3 text-[#153F2D] hover:bg-[#EDE7D8] disabled:opacity-40 transition-colors rounded-r-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <Button
              variant="default"
              size="lg"
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className="w-full sm:flex-1 text-sm sm:text-base font-semibold shadow-md"
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5 text-[#7D9565] mr-2" />
                  <span>Added to Basket</span>
                </>
              ) : isAdding ? (
                <span>Adding to Basket...</span>
              ) : isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  <span>Add to Basket • {formatPaise(selectedVariant.pricePaise * quantity)}</span>
                </>
              )}
            </Button>
          </div>

          {/* Value Assurances */}
          <div className="bg-[#EDE7D8]/60 rounded-xl p-4 border border-[#DCD5C1] space-y-2 text-xs text-[#5A5E53]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7D9565] shrink-0" />
              <span>
                <strong>85%+ Germination Guarantee:</strong> Free replacement if seeds fail to sprout.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#7D9565] shrink-0" />
              <span>Free Express Delivery across India on orders over ₹999.</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#7D9565] shrink-0" />
              <span>7-Day hassle-free returns on non-perishable garden accessories.</span>
            </div>
          </div>
        </div>

        {/* Tabbed Botanical & Growing Information */}
        <div className="pt-6 border-t border-[#DCD5C1]">
          <div className="flex border-b border-[#DCD5C1] text-xs font-bold uppercase tracking-wider mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === "specs"
                  ? "border-[#153F2D] text-[#153F2D]"
                  : "border-transparent text-[#8C9083] hover:text-[#282B25]"
              }`}
            >
              Growing Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("care")}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === "care"
                  ? "border-[#153F2D] text-[#153F2D]"
                  : "border-transparent text-[#8C9083] hover:text-[#282B25]"
              }`}
            >
              Care &amp; Storage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("delivery")}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === "delivery"
                  ? "border-[#153F2D] text-[#153F2D]"
                  : "border-transparent text-[#8C9083] hover:text-[#282B25]"
              }`}
            >
              Shipping &amp; Returns
            </button>
          </div>

          <div className="text-xs text-[#5A5E53] leading-relaxed">
            {activeTab === "specs" && (
              <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                {product.seedCount && (
                  <div>
                    <dt className="text-[#8C9083] uppercase tracking-wider text-[10px]">Pack Seed Count</dt>
                    <dd className="font-semibold text-[#153F2D] mt-0.5">{product.seedCount}</dd>
                  </div>
                )}
                {product.sowingSeason && (
                  <div>
                    <dt className="text-[#8C9083] uppercase tracking-wider text-[10px]">Sowing Season</dt>
                    <dd className="font-semibold text-[#153F2D] mt-0.5">{product.sowingSeason}</dd>
                  </div>
                )}
                {product.recommendedPotSize && (
                  <div>
                    <dt className="text-[#8C9083] uppercase tracking-wider text-[10px]">Recommended Pot Size</dt>
                    <dd className="font-semibold text-[#153F2D] mt-0.5">{product.recommendedPotSize}</dd>
                  </div>
                )}
                {product.soilSuitability && (
                  <div>
                    <dt className="text-[#8C9083] uppercase tracking-wider text-[10px]">Soil Suitability</dt>
                    <dd className="font-semibold text-[#153F2D] mt-0.5">{product.soilSuitability}</dd>
                  </div>
                )}
              </dl>
            )}

            {activeTab === "care" && (
              <div className="space-y-3">
                {product.careInstructions && (
                  <div>
                    <p className="font-bold text-[#153F2D] mb-1">Care Guidelines:</p>
                    <p>{product.careInstructions}</p>
                  </div>
                )}
                {product.storageInstructions && (
                  <div>
                    <p className="font-bold text-[#153F2D] mb-1">Seed Storage:</p>
                    <p>{product.storageInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-2">
                <p>
                  <strong>Metro Deliveries:</strong> 2-4 business days via Bluedart/Delhivery.
                </p>
                <p>
                  <strong>Regional/Non-Metro:</strong> 4-6 business days via Speed Post/surface courier.
                </p>
                <p>
                  <strong>Eco Packaging:</strong> Zero single-use plastic. Packed in recyclable kraft botanical packets.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Sprout, Sun, Droplets } from "lucide-react";
import { formatPaise } from "@/lib/utils";
import { AddToCart } from "@/components/AddToCart";
import { Badge } from "@/components/ui/badge";

export interface ProductDetailItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  plantType?: string | null;
  sunlight?: string | null;
  difficulty?: string | null;
  category?: {
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
  }>;
}

interface ProductDetailProps {
  product: ProductDetailItem;
  isModal?: boolean;
}

export function ProductDetail({ product, isModal = false }: ProductDetailProps) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const primaryImage = product.images[0] || "/images/about/heirloom-seeds.jpg";
  const defaultVariant = product.variants[0] || {
    id: product.id,
    sku: "ROOT-001",
    title: "Standard Packet",
    pricePaise: 29900,
    stock: 50,
  };

  const handleClose = () => {
    if (isModal) {
      router.back();
      // Restore focus to original card after back navigation
      setTimeout(() => {
        const originCard = document.getElementById(`product-card-${product.slug}`);
        originCard?.focus();
      }, 50);
    }
  };

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Initial focus on close button
    closeButtonRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModal]);

  return (
    <div
      role={isModal ? "dialog" : undefined}
      aria-modal={isModal ? "true" : undefined}
      aria-labelledby="modal-product-title"
      className={
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          : "w-full max-w-5xl mx-auto py-8"
      }
      onClick={(e) => {
        if (isModal && e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={isModal ? { opacity: 0, scale: 0.96 } : false}
        animate={isModal ? { opacity: 1, scale: 1 } : undefined}
        exit={isModal ? { opacity: 0, scale: 0.96 } : undefined}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#DCD5C1] overflow-hidden my-auto"
      >
        {/* Close Button (×) */}
        {isModal && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close product view"
            className="absolute top-4 right-4 z-20 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-[#153F2D] hover:bg-[#EDE7D8] border border-[#DCD5C1] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Shared Element Image: flies from card to detail view */}
          <div className="md:col-span-6 relative aspect-square bg-[#EDE7D8] overflow-hidden">
            <motion.div
              layoutId={`product-image-${product.slug}`}
              className="relative w-full h-full"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            {product.difficulty && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary" className="capitalize bg-white/95 text-[#153F2D] shadow-sm">
                  {product.difficulty.toLowerCase()}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info Fades Up Beside Image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
            className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              {product.plantType && (
                <span className="text-xs uppercase tracking-wider font-semibold text-[#7D9565] block mb-1">
                  {product.plantType}
                </span>
              )}
              <h2
                id="modal-product-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] leading-tight"
              >
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-bold text-xl sm:text-2xl text-[#153F2D]">
                  {formatPaise(defaultVariant.pricePaise)}
                </span>
                {defaultVariant.compareAtPricePaise && (
                  <span className="text-sm text-[#5F6456] line-through">
                    {formatPaise(defaultVariant.compareAtPricePaise)}
                  </span>
                )}
                <span className="text-xs text-[#7D9565] font-medium ml-2">Taxes included</span>
              </div>

              <p className="mt-4 text-sm text-[#464A40] leading-relaxed">
                {product.description}
              </p>

              {/* Botanical specifications pills */}
              <div className="mt-6 pt-5 border-t border-[#DCD5C1] grid grid-cols-2 gap-3 text-xs text-[#282B25]">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#7D9565]" />
                  <span>85%+ Germination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#C87855]" />
                  <span>{product.sunlight || "Balcony Sun"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#7D9565]" />
                  <span>Moderate moisture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#153F2D]" />
                  <span>Certified Heirloom</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-[#DCD5C1] flex items-center justify-between gap-4">
              <AddToCart
                productId={product.id}
                variantId={defaultVariant.id}
                productName={product.name}
                disabled={defaultVariant.stock <= 0}
                variant="default"
                size="lg"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetail;

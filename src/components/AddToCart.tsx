"use client";

import React, { useState, useRef } from "react";
import { Plus, Check, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { triggerLeafBurst } from "@/components/LeafBurst";

interface AddToCartProps {
  productId: string;
  variantId?: string;
  productName?: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "pill" | "expandable";
  size?: "sm" | "md" | "lg";
}

export function AddToCart({
  productId,
  variantId,
  productName = "item",
  disabled = false,
  className = "",
  variant = "expandable",
  size = "md",
}: AddToCartProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const addItemOptimistic = useCartStore((s) => s.addItemOptimistic);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    const btn = buttonRef.current;
    if (btn) {
      // 1. Spawn seven leaf particles flying to cart
      triggerLeafBurst(btn);
    }

    setIsLoading(true);

    // 2. Optimistically add to store and call background API
    const success = await addItemOptimistic(productId, 1, variantId);

    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1800);
    }
  };

  // Sizing definitions: ensure 44px minimum touch target
  const isSm = size === "sm";
  const heightClass = isSm ? "h-10 min-h-[44px]" : "h-11 min-h-[44px]";
  const paddingClass = isSm ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      disabled={disabled || isLoading}
      aria-label={`Add ${productName} to cart`}
      className={`btn relative inline-flex items-center justify-center font-semibold rounded-lg bg-[#153F2D] text-[#F7F4EA] hover:bg-[#1C523B] active:scale-95 transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden ${heightClass} ${paddingClass} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Adding...</span>
        </span>
      ) : isSuccess ? (
        <span className="flex items-center gap-1.5 text-[#A5C28C]">
          <Check className="w-3.5 h-3.5" />
          <span>Added!</span>
        </span>
      ) : variant === "expandable" ? (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <Plus className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-90" />
          <span>Add</span>
          <span
            className={`inline-block transition-all duration-300 overflow-hidden ${
              isHovered ? "max-w-[80px] opacity-100 ml-0.5" : "max-w-0 opacity-0"
            }`}
          >
            to cart
          </span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to cart</span>
        </span>
      )}
    </button>
  );
}

export default AddToCart;

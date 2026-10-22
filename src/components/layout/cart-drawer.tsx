"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPaise } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItemQuantity, removeItem } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const freeShippingThreshold = cart?.freeShippingThresholdPaise || 99900;
  const subtotal = cart?.subtotalPaise || 0;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#282B25]/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#F7F4EA] h-full shadow-2xl flex flex-col z-10 border-l border-[#DCD5C1] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCD5C1] bg-white/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#153F2D]" />
            <h2 className="font-serif text-lg font-bold text-[#153F2D]">
              Your Basket ({cart?.itemCount || 0})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 rounded-full text-[#5A5E53] hover:text-[#153F2D] hover:bg-[#EDE7D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-[#EDE7D8]/60 border-b border-[#DCD5C1]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#153F2D] mb-1.5">
            <Truck className="w-4 h-4 text-[#7D9565] shrink-0" />
            {cart?.isFreeShippingEligible ? (
              <span className="font-semibold text-[#153F2D]">
                🎉 You have unlocked Free Express Shipping!
              </span>
            ) : (
              <span>
                Add{" "}
                <strong>
                  {formatPaise(cart?.amountNeededForFreeShippingPaise || 0)}
                </strong>{" "}
                more for <strong>Free Express Shipping</strong>
              </span>
            )}
          </div>
          <div className="w-full bg-[#DCD5C1] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#7D9565] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#DCD5C1]/60">
          {!cart || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#EDE7D8] flex items-center justify-center text-[#7D9565] mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg font-medium text-[#153F2D] mb-1">
                Your basket is empty
              </p>
              <p className="text-sm text-[#5A5E53] max-w-xs mb-6">
                Discover our non-GMO heirloom seeds, living organic soils, and balcony kits to begin your garden.
              </p>
              <Button
                variant="default"
                onClick={closeCart}
                asChild
              >
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-white shrink-0 border border-[#DCD5C1]">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-serif font-semibold text-sm text-[#153F2D] hover:underline line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.productName}`}
                        className="text-[#8C9083] hover:text-[#B83A2E] transition-colors p-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#5A5E53] mt-0.5">{item.variantTitle}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#DCD5C1] rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-1 hover:bg-[#EDE7D8] text-[#153F2D] rounded-l-md transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-[#282B25]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-1 hover:bg-[#EDE7D8] text-[#153F2D] rounded-r-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-sm text-[#153F2D]">
                        {formatPaise(item.itemTotalPaise)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-[#DCD5C1] bg-white/80 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5A5E53]">
                <span>Subtotal</span>
                <span className="font-medium text-[#282B25]">
                  {formatPaise(cart.subtotalPaise)}
                </span>
              </div>
              <div className="flex justify-between text-[#5A5E53]">
                <span>Shipping</span>
                <span>
                  {cart.shippingPaise === 0 ? (
                    <span className="font-semibold text-[#7D9565]">FREE</span>
                  ) : (
                    formatPaise(cart.shippingPaise)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold text-[#153F2D] pt-2 border-t border-[#DCD5C1]">
                <span>Estimated Total</span>
                <span>{formatPaise(cart.totalPaise)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="default"
                size="lg"
                className="w-full justify-between"
                onClick={closeCart}
                asChild
              >
                <Link href="/checkout">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full"
                onClick={closeCart}
                asChild
              >
                <Link href="/cart">View Full Cart Details</Link>
              </Button>
            </div>
            <p className="text-[11px] text-center text-[#8C9083]">
              Taxes calculated at checkout. Guaranteed 85%+ seed germination support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

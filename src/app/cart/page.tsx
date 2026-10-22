"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPaise } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function CartPage() {
  const { cart, updateItemQuantity, removeItem } = useCart();

  const freeShippingThreshold = cart?.freeShippingThresholdPaise || 99900;
  const subtotal = cart?.subtotalPaise || 0;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
      <AnnouncementBar />
      <Header />
      <CartDrawer />

      <main id="main-content" className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#5A5E53]">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-[#153F2D]">Home</Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-[#153F2D]">Shopping Basket</li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D] mb-8">
            Your Botanical Basket ({cart?.itemCount || 0})
          </h1>

          {!cart || cart.items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#EDE7D8] text-[#7D9565] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#153F2D] mb-2">
                Your basket is currently empty
              </h2>
              <p className="text-xs text-[#5A5E53] mb-6 leading-relaxed">
                Explore our fresh heirloom vegetable seeds, aromatic culinary herbs, living organic potting soils, and balcony gardening kits.
              </p>
              <Button variant="default" size="lg" asChild>
                <Link href="/shop">Start Shopping &rarr;</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free Shipping Alert Box */}
                <div className="bg-[#EDE7D8]/70 rounded-xl p-4 border border-[#DCD5C1]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#153F2D] mb-1.5">
                    <Truck className="w-4 h-4 text-[#7D9565] shrink-0" />
                    {cart.isFreeShippingEligible ? (
                      <span>🎉 Congratulations! You have unlocked Free Express Shipping!</span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong>{formatPaise(cart.amountNeededForFreeShippingPaise)}</strong>{" "}
                        more to qualify for <strong>Free Express Shipping</strong>.
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-[#DCD5C1] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#7D9565] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-xl border border-[#DCD5C1] divide-y divide-[#DCD5C1] shadow-2xs overflow-hidden">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#EDE7D8] shrink-0 border border-[#DCD5C1]">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.productSlug}`}
                            className="font-serif font-bold text-base text-[#153F2D] hover:underline"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs text-[#5A5E53] mt-0.5">
                            {item.variantTitle} • SKU: {item.sku}
                          </p>
                          <p className="text-xs font-semibold text-[#153F2D] sm:hidden mt-1">
                            {formatPaise(item.unitPricePaise)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#DCD5C1] rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 hover:bg-[#EDE7D8] text-[#153F2D] rounded-l-md transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#282B25]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 hover:bg-[#EDE7D8] text-[#153F2D] rounded-r-md transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right min-w-[90px]">
                          <span className="font-bold text-base text-[#153F2D]">
                            {formatPaise(item.itemTotalPaise)}
                          </span>
                          <p className="text-[10px] text-[#8C9083] hidden sm:block">
                            {formatPaise(item.unitPricePaise)} / unit
                          </p>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.productName}`}
                          className="text-[#8C9083] hover:text-[#B83A2E] p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-[#153F2D] hover:underline"
                  >
                    &larr; Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#153F2D] pb-3 border-b border-[#DCD5C1]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#282B25]">
                      {formatPaise(cart.subtotalPaise)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Express Shipping</span>
                    <span>
                      {cart.shippingPaise === 0 ? (
                        <span className="font-bold text-[#7D9565]">FREE</span>
                      ) : (
                        formatPaise(cart.shippingPaise)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold font-serif text-[#153F2D] pt-3 border-t border-[#DCD5C1]">
                    <span>Estimated Total</span>
                    <span>{formatPaise(cart.totalPaise)}</span>
                  </div>
                  <p className="text-[10px] text-[#8C9083]">
                    All taxes and GST included. Shipping calculated at checkout.
                  </p>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full text-base font-semibold shadow-md gap-2"
                  asChild
                >
                  <Link href="/checkout">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                {/* Trust Pillar Assurances */}
                <div className="space-y-2 text-[11px] text-[#5A5E53] pt-4 border-t border-[#DCD5C1]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7D9565] shrink-0" />
                    <span>85%+ Tested Germination Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" />
                    <span>Safe &amp; Secure 256-bit Encrypted Payments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

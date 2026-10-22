import Link from "next/link";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order — Rootkind Botanical Dispatches",
  description: "Check the real-time shipping and delivery status of your Rootkind parcel.",
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string }>;
}) {
  const { ref, email } = await searchParams;
  const orderRef = ref?.trim().toUpperCase();

  let order = null;
  if (orderRef) {
    order = await db.order.findUnique({
      where: { orderReference: orderRef },
      include: {
        items: true,
        shipments: true,
      },
    });
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] block mb-1">
                Real-Time Tracking
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D]">
                Track Your Parcel
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1.5">
                Enter your Rootkind order reference (e.g. RK-2026-XXXX) to view current fulfillment stage and courier tracking.
              </p>
            </div>

            {/* Tracking Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs mb-10">
              <form method="GET" action="/track-order" className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    name="ref"
                    defaultValue={orderRef || ""}
                    required
                    placeholder="Enter Order Reference (e.g. RK-2026-1001)"
                    className="uppercase"
                  />
                </div>
                <Button type="submit" variant="default" className="shrink-0 font-semibold">
                  Track Parcel
                </Button>
              </form>
            </div>

            {/* Order Tracking Timeline Display */}
            {orderRef && (
              <>
                {!order ? (
                  <div className="bg-white p-8 rounded-2xl border border-[#DCD5C1] text-center text-xs text-[#5A5E53] shadow-xs">
                    <AlertCircle className="w-8 h-8 text-[#B83A2E] mx-auto mb-2" />
                    <p className="font-bold text-[#282B25] text-sm">No order found with reference &ldquo;{orderRef}&rdquo;</p>
                    <p className="mt-1">Please double-check your order reference from your email confirmation.</p>
                  </div>
                ) : (
                  <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-8">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between border-b border-[#DCD5C1] pb-6 gap-4">
                      <div>
                        <span className="text-xs text-[#8C9083]">Order Reference</span>
                        <h2 className="font-serif text-2xl font-bold text-[#153F2D]">
                          {order.orderReference}
                        </h2>
                        <span className="text-xs text-[#5A5E53]">
                          Placed on {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="sage" className="text-xs font-bold">
                          {order.paymentStatus}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-bold capitalize">
                          {order.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="relative border-l-2 border-[#DCD5C1] ml-4 pl-6 space-y-6 text-xs">
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#153F2D] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-[#7D9565]" />
                        </div>
                        <p className="font-bold text-sm text-[#153F2D]">Order Confirmed</p>
                        <p className="text-[#5A5E53]">Payment verified via Razorpay.</p>
                      </div>

                      <div className="relative">
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          order.fulfillmentStatus !== "UNFULFILLED"
                            ? "bg-[#153F2D]"
                            : "bg-[#DCD5C1]"
                        }`}>
                          <Package className="w-2.5 h-2.5 text-white" />
                        </div>
                        <p className="font-bold text-sm text-[#153F2D]">Packaging at Nursery</p>
                        <p className="text-[#5A5E53]">Heirloom seeds and soils prepared in plastic-free kraft packaging.</p>
                      </div>

                      <div className="relative">
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED"
                            ? "bg-[#153F2D]"
                            : "bg-[#DCD5C1]"
                        }`}>
                          <Truck className="w-2.5 h-2.5 text-white" />
                        </div>
                        <p className="font-bold text-sm text-[#153F2D]">Dispatched &amp; In Transit</p>
                        <p className="text-[#5A5E53]">
                          {order.shipments[0]
                            ? `Handed to ${order.shipments[0].carrier} (Airway Bill: ${order.shipments[0].trackingNumber})`
                            : "Estimated parcel handover within 24-48 business hours."}
                        </p>
                      </div>
                    </div>

                    {/* Items List Summary */}
                    <div className="border-t border-[#DCD5C1] pt-6">
                      <h3 className="font-serif font-bold text-sm text-[#153F2D] mb-3">
                        Items in Parcel ({order.items.length})
                      </h3>
                      <div className="space-y-2 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between py-1 border-b border-[#DCD5C1]/40 last:border-0">
                            <span>{item.productTitle} ({item.variantTitle}) × {item.quantity}</span>
                            <span className="font-semibold text-[#153F2D]">{formatPaise(item.totalPaise)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

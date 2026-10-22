import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Thank You | Rootkind",
  description: "Your botanical order has been confirmed and is being packed with care.",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddr = order.shippingAddressSnapshot as any;

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-8 sm:p-12 shadow-sm text-center">
              {/* Green Success Badge */}
              <div className="w-16 h-16 rounded-full bg-[#153F2D] text-[#F7F4EA] flex items-center justify-center mx-auto mb-5 shadow-md">
                <CheckCircle2 className="w-10 h-10 text-[#7D9565]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#7D9565] block mb-1">
                Order Successfully Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D] mb-2">
                Thank you, {order.customerName}!
              </h1>
              <p className="text-sm text-[#5A5E53] max-w-md mx-auto mb-6">
                Your botanical parcel is now scheduled for packaging at our nursery.
                A confirmation has been sent to <strong>{order.customerEmail}</strong>.
              </p>

              {/* Order Reference Box */}
              <div className="bg-[#EDE7D8]/60 rounded-xl p-4 border border-[#DCD5C1] inline-flex flex-wrap items-center justify-center gap-6 text-xs text-[#282B25] mb-8">
                <div>
                  <span className="text-[#8C9083] block">Order Reference:</span>
                  <span className="font-bold text-sm text-[#153F2D]">
                    {order.orderReference}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C9083] block">Payment Status:</span>
                  <span className="font-bold text-sm text-[#7D9565]">
                    {order.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C9083] block">Estimated Dispatch:</span>
                  <span className="font-semibold text-sm text-[#282B25]">
                    Within 24-48 Hours
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="text-left border-t border-[#DCD5C1] pt-6 mb-8">
                <h2 className="font-serif font-bold text-base text-[#153F2D] mb-4">
                  Package Contents ({order.items.length})
                </h2>
                <div className="divide-y divide-[#DCD5C1]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-serif font-bold text-sm text-[#153F2D] block">
                          {item.productTitle}
                        </span>
                        <span className="text-[#5A5E53]">
                          {item.variantTitle} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-sm text-[#153F2D]">
                        {formatPaise(item.totalPaise)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#DCD5C1] pt-4 mt-4 flex justify-between text-base font-bold font-serif text-[#153F2D]">
                  <span>Total Amount Paid</span>
                  <span>{formatPaise(order.totalPaise)}</span>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="text-left bg-[#F7F4EA] p-5 rounded-xl border border-[#DCD5C1] mb-8 text-xs text-[#5A5E53] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#153F2D] mb-1">
                  <MapPin className="w-4 h-4 text-[#7D9565]" />
                  <span>Delivering To:</span>
                </div>
                <p className="font-semibold text-[#282B25]">{shippingAddr?.recipientName}</p>
                <p>{shippingAddr?.street}{shippingAddr?.apartment ? `, ${shippingAddr.apartment}` : ""}</p>
                <p>{shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.postalCode}</p>
                <p>Phone: {shippingAddr?.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="default" asChild>
                  <Link href={`/track-order?ref=${order.orderReference}`}>
                    <span>Track Live Dispatch Status</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

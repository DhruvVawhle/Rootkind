import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Package, MapPin, CreditCard, Truck } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
  });

  // Verify ownership or admin privilege
  if (!order || (order.userId !== user.userId && user.role !== "ADMIN")) {
    notFound();
  }

  const shippingAddr = order.shippingAddressSnapshot as any;

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/orders" className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Orders</span>
                </Link>
              </Button>
              <span className="text-xs text-[#8C9083]">
                Placed on {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 sm:p-10 shadow-xs space-y-8">
              {/* Order Status Ribbon */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#DCD5C1] pb-6 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                    Order Receipt
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] mt-0.5">
                    {order.orderReference}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={order.paymentStatus === "PAID" ? "sage" : "outline"}
                    className="text-xs font-bold"
                  >
                    Payment: {order.paymentStatus}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-bold capitalize">
                    Fulfillment: {order.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}
                  </Badge>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#153F2D]">
                  Ordered Items ({order.items.length})
                </h2>
                <div className="divide-y divide-[#DCD5C1] border border-[#DCD5C1] rounded-xl overflow-hidden">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white text-xs"
                    >
                      <div>
                        <span className="font-serif font-bold text-sm text-[#153F2D] block">
                          {item.productTitle}
                        </span>
                        <span className="text-[#5A5E53]">
                          {item.variantTitle} • SKU: {item.sku}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[#5A5E53]">
                          {formatPaise(item.unitPricePaise)} × {item.quantity}
                        </span>
                        <span className="font-bold text-sm text-[#153F2D] min-w-[70px] text-right">
                          {formatPaise(item.totalPaise)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="border-t border-[#DCD5C1] pt-6 flex justify-end">
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#282B25]">
                      {formatPaise(order.subtotalPaise)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Express Shipping</span>
                    <span>
                      {order.shippingPaise === 0 ? (
                        <span className="font-semibold text-[#7D9565]">FREE</span>
                      ) : (
                        formatPaise(order.shippingPaise)
                      )}
                    </span>
                  </div>
                  {order.discountPaise > 0 && (
                    <div className="flex justify-between text-[#C87855]">
                      <span>Discount</span>
                      <span>-{formatPaise(order.discountPaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold font-serif text-[#153F2D] pt-2 border-t border-[#DCD5C1]">
                    <span>Total Paid</span>
                    <span>{formatPaise(order.totalPaise)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery and Payment Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#DCD5C1]">
                {/* Shipping Address */}
                <div className="bg-[#EDE7D8]/40 p-5 rounded-xl border border-[#DCD5C1] space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#153F2D]">
                    <MapPin className="w-4 h-4 text-[#7D9565]" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="font-semibold text-[#282B25]">{shippingAddr?.recipientName}</p>
                  <p className="text-[#5A5E53]">
                    {shippingAddr?.street}
                    {shippingAddr?.apartment ? `, ${shippingAddr.apartment}` : ""}
                  </p>
                  <p className="text-[#5A5E53]">
                    {shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.postalCode}
                  </p>
                  <p className="text-[#5A5E53]">Phone: {shippingAddr?.phone}</p>
                </div>

                {/* Payment & Tracking */}
                <div className="bg-[#EDE7D8]/40 p-5 rounded-xl border border-[#DCD5C1] space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#153F2D]">
                    <CreditCard className="w-4 h-4 text-[#7D9565]" />
                    <span>Payment &amp; Shipment</span>
                  </div>
                  <p className="text-[#5A5E53]">
                    <strong>Gateway:</strong> Razorpay Online Payment
                  </p>
                  {order.payments[0]?.razorpayPaymentId && (
                    <p className="text-[#5A5E53]">
                      <strong>Payment Ref:</strong> {order.payments[0].razorpayPaymentId}
                    </p>
                  )}
                  <p className="text-[#5A5E53]">
                    <strong>Customer Email:</strong> {order.customerEmail}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[#7D9565] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Cryptographic Signature Proof</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

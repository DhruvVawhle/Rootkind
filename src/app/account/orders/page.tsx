import Link from "next/link";
import { redirect } from "next/navigation";
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
import { Package, ArrowLeft, Truck } from "lucide-react";

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const orders = await db.order.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shipments: true,
    },
  });

  return (
    <CartProvider>
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
                <li>
                  <Link href="/account" className="hover:text-[#153F2D]">Account</Link>
                </li>
                <li>/</li>
                <li className="font-semibold text-[#153F2D]">Orders</li>
              </ol>
            </nav>

            <div className="flex items-center justify-between mb-8 border-b border-[#DCD5C1] pb-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#153F2D]">
                  Your Order History
                </h1>
                <p className="text-xs text-[#5A5E53] mt-1">
                  Manage your past purchases, download invoices, and track live parcel deliveries.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account" className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#DCD5C1] p-8 max-w-md mx-auto">
                <Package className="w-12 h-12 text-[#DCD5C1] mx-auto mb-3" />
                <h2 className="font-serif text-xl font-bold text-[#153F2D] mb-1">
                  No orders found
                </h2>
                <p className="text-xs text-[#5A5E53] mb-6">
                  You haven&apos;t placed any orders yet. Explore our fresh non-GMO seeds and urban growing kits.
                </p>
                <Button variant="default" asChild>
                  <Link href="/shop">Browse Store</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-[#DCD5C1] overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="bg-[#EDE7D8]/40 px-6 py-4 border-b border-[#DCD5C1] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div>
                          <span className="text-[#8C9083] block">Order Placed</span>
                          <span className="font-semibold text-[#282B25]">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C9083] block">Reference</span>
                          <span className="font-semibold text-[#153F2D]">
                            {order.orderReference}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C9083] block">Total Amount</span>
                          <span className="font-bold text-[#153F2D]">
                            {formatPaise(order.totalPaise)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={order.paymentStatus === "PAID" ? "sage" : "outline"}
                          className="text-[10px]"
                        >
                          Payment: {order.paymentStatus}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          Status: {order.orderStatus.toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 divide-y divide-[#DCD5C1]/60">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0"
                        >
                          <div>
                            <span className="font-serif font-bold text-sm text-[#153F2D] block">
                              {item.productTitle}
                            </span>
                            <span className="text-[#5A5E53]">
                              {item.variantTitle} • SKU: {item.sku} • Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-semibold text-sm text-[#282B25]">
                            {formatPaise(item.totalPaise)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Actions */}
                    <div className="bg-[#F7F4EA]/50 px-6 py-3 border-t border-[#DCD5C1] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#5A5E53]">
                        <Truck className="w-4 h-4 text-[#7D9565]" />
                        <span>
                          {order.shipments[0]
                            ? `Carrier: ${order.shipments[0].carrier} (Track: ${order.shipments[0].trackingNumber})`
                            : "Standard Express Courier • Dispatch in 24h"}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          View Order Details &amp; Receipt &rarr;
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

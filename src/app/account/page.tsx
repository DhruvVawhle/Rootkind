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
import {
  Package,
  MapPin,
  User as UserIcon,
  LogOut,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function AccountDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/account/login");
  }

  // Fetch recent orders and default address
  const [orders, addresses] = await Promise.all([
    db.order.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        items: true,
      },
    }),
    db.address.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  const defaultAddress = addresses[0];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Greeting & Role Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCD5C1] pb-6 mb-8 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                  Botanical Customer Portal
                </span>
                <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs text-[#5A5E53] mt-1">{user.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {user.role === "ADMIN" && (
                  <Button variant="default" size="sm" asChild>
                    <Link href="/admin">
                      <span>Admin Console &rarr;</span>
                    </Link>
                  </Button>
                )}
                <form action="/api/auth/logout" method="POST">
                  <Button variant="outline" size="sm" type="submit" className="gap-1.5 text-xs">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Button>
                </form>
              </div>
            </div>

            {/* Dashboard Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <Link
                href="/account/orders"
                className="bg-white p-6 rounded-xl border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="p-3 rounded-lg bg-[#153F2D]/10 text-[#153F2D] w-fit mb-4">
                    <Package className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif font-bold text-base text-[#153F2D] group-hover:text-[#7D9565] transition-colors">
                    Order History
                  </h2>
                  <p className="text-xs text-[#5A5E53] mt-1">
                    {orders.length} total orders recorded
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DCD5C1] group-hover:text-[#153F2D] transition-colors" />
              </Link>

              <Link
                href="/account/addresses"
                className="bg-white p-6 rounded-xl border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="p-3 rounded-lg bg-[#7D9565]/15 text-[#7D9565] w-fit mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif font-bold text-base text-[#153F2D] group-hover:text-[#7D9565] transition-colors">
                    Address Book
                  </h2>
                  <p className="text-xs text-[#5A5E53] mt-1">
                    {addresses.length} saved delivery destinations
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DCD5C1] group-hover:text-[#153F2D] transition-colors" />
              </Link>

              <Link
                href="/account/profile"
                className="bg-white p-6 rounded-xl border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="p-3 rounded-lg bg-[#C87855]/15 text-[#C87855] w-fit mb-4">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif font-bold text-base text-[#153F2D] group-hover:text-[#7D9565] transition-colors">
                    Personal Profile
                  </h2>
                  <p className="text-xs text-[#5A5E53] mt-1">
                    Manage name, contact details &amp; password
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DCD5C1] group-hover:text-[#153F2D] transition-colors" />
              </Link>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DCD5C1]">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#153F2D]">
                    Recent Orders
                  </h2>
                  <p className="text-xs text-[#5A5E53] mt-0.5">
                    Track your botanical dispatches and view itemized receipts.
                  </p>
                </div>
                {orders.length > 0 && (
                  <Link
                    href="/account/orders"
                    className="text-xs font-bold text-[#153F2D] hover:underline"
                  >
                    View All Orders &rarr;
                  </Link>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-[#DCD5C1] mx-auto mb-3" />
                  <p className="font-serif font-bold text-base text-[#153F2D] mb-1">
                    You haven&apos;t placed any orders yet
                  </p>
                  <p className="text-xs text-[#5A5E53] max-w-sm mx-auto mb-6">
                    Start your home garden journey with our heirloom seeds, living organic soils, and balcony kits.
                  </p>
                  <Button variant="default" asChild>
                    <Link href="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-[#DCD5C1]">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[#153F2D]">
                            {order.orderReference}
                          </span>
                          <Badge
                            variant={
                              order.paymentStatus === "PAID"
                                ? "sage"
                                : order.paymentStatus === "FAILED"
                                ? "outline"
                                : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {order.paymentStatus}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {order.orderStatus.toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#5A5E53]">
                          Placed on {formatDate(order.createdAt)} • {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-bold text-base text-[#153F2D]">
                          {formatPaise(order.totalPaise)}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/orders/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

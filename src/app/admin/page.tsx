import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/account/login");
  }

  // Derive real analytics from database
  const [orders, products, variants, customersCount] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    db.product.count(),
    db.productVariant.findMany(),
    db.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  // Financial calculations
  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenuePaise = paidOrders.reduce((sum, o) => sum + o.totalPaise, 0);
  const lowStockVariants = variants.filter((v) => v.stock <= 5);

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                Store Administration
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Executive Overview
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Real-time sales analytics, stock velocity, and order fulfillment states.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="sage" className="text-xs font-bold py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Admin: {user.name}
              </Badge>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-xl border border-[#DCD5C1] shadow-2xs">
              <div className="flex items-center justify-between text-[#7D9565] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Verified Revenue
                </span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#153F2D]">
                {formatPaise(totalRevenuePaise)}
              </p>
              <p className="text-[11px] text-[#8C9083] mt-1">
                From {paidOrders.length} captured payments
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-white p-6 rounded-xl border border-[#DCD5C1] shadow-2xs">
              <div className="flex items-center justify-between text-[#153F2D] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Orders Placed
                </span>
                <ShoppingCart className="w-5 h-5" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#153F2D]">
                {orders.length}
              </p>
              <p className="text-[11px] text-[#8C9083] mt-1">
                {orders.filter((o) => o.orderStatus === "PENDING").length} awaiting fulfillment
              </p>
            </div>

            {/* Catalogue Count */}
            <div className="bg-white p-6 rounded-xl border border-[#DCD5C1] shadow-2xs">
              <div className="flex items-center justify-between text-[#153F2D] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Published Products
                </span>
                <Package className="w-5 h-5" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#153F2D]">
                {products}
              </p>
              <p className="text-[11px] text-[#8C9083] mt-1">
                Across {variants.length} active SKUs
              </p>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white p-6 rounded-xl border border-[#DCD5C1] shadow-2xs">
              <div className="flex items-center justify-between text-[#C87855] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Low-Stock Warnings
                </span>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#C87855]">
                {lowStockVariants.length}
              </p>
              <p className="text-[11px] text-[#8C9083] mt-1">
                Variants with ≤ 5 units in nursery
              </p>
            </div>
          </div>

          {/* Low Stock Notification Banner (if any) */}
          {lowStockVariants.length > 0 && (
            <div className="bg-[#C87855]/10 border border-[#C87855]/30 rounded-xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#C87855]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Inventory Alert:</strong> {lowStockVariants.length} items require restocking soon to prevent order bottlenecks.
                </span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/inventory">Manage Stock &rarr;</Link>
              </Button>
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
            <div className="p-6 border-b border-[#DCD5C1] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#153F2D]">
                  Recent Customer Orders
                </h2>
                <p className="text-xs text-[#5A5E53] mt-0.5">
                  Latest transactional dispatches from verified shoppers.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">View All Orders &rarr;</Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#5A5E53]">
                No customer orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE7D8]/60 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1]">
                    <tr>
                      <th className="px-6 py-3.5">Reference</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Total</th>
                      <th className="px-6 py-3.5">Payment</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD5C1]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F7F4EA]/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#153F2D]">
                          {ord.orderReference}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#282B25] block">{ord.customerName}</span>
                          <span className="text-[#8C9083] text-[11px]">{ord.customerEmail}</span>
                        </td>
                        <td className="px-6 py-4 text-[#5A5E53]">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#153F2D]">
                          {formatPaise(ord.totalPaise)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={ord.paymentStatus === "PAID" ? "sage" : "outline"}
                            className="text-[10px]"
                          >
                            {ord.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {ord.orderStatus.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${ord.id}`}>Inspect</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

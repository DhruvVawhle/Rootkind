import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const { status, payment } = await searchParams;

  const where: any = {};
  if (status) where.orderStatus = status;
  if (payment) where.paymentStatus = payment;

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shipments: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                Order Processing
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Orders &amp; Fulfillment
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Manage order fulfillment, print pick lists, and record airway bill tracking codes.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/orders"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                !status && !payment
                  ? "bg-[#153F2D] text-[#F7F4EA]"
                  : "bg-white text-[#282B25] border border-[#DCD5C1]"
              }`}
            >
              All Orders ({orders.length})
            </Link>
            <Link
              href="/admin/orders?payment=PAID"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                payment === "PAID"
                  ? "bg-[#153F2D] text-[#F7F4EA]"
                  : "bg-white text-[#282B25] border border-[#DCD5C1]"
              }`}
            >
              Paid Only
            </Link>
            <Link
              href="/admin/orders?status=PENDING"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                status === "PENDING"
                  ? "bg-[#153F2D] text-[#F7F4EA]"
                  : "bg-white text-[#282B25] border border-[#DCD5C1]"
              }`}
            >
              Pending Dispatch
            </Link>
            <Link
              href="/admin/orders?status=SHIPPED"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                status === "SHIPPED"
                  ? "bg-[#153F2D] text-[#F7F4EA]"
                  : "bg-white text-[#282B25] border border-[#DCD5C1]"
              }`}
            >
              In Transit (Shipped)
            </Link>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#5A5E53]">
                No orders match the selected criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE7D8]/60 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1]">
                    <tr>
                      <th className="px-5 py-3.5">Order Ref</th>
                      <th className="px-5 py-3.5">Customer &amp; Phone</th>
                      <th className="px-5 py-3.5">Placed On</th>
                      <th className="px-5 py-3.5">Items</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Payment</th>
                      <th className="px-5 py-3.5">Fulfillment</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD5C1]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F7F4EA]/40 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#153F2D]">
                          {ord.orderReference}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#282B25] block">{ord.customerName}</span>
                          <span className="text-[#8C9083] text-[11px]">{ord.customerPhone}</span>
                        </td>
                        <td className="px-5 py-3.5 text-[#5A5E53]">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="px-5 py-3.5 text-[#5A5E53]">
                          {ord.items.length} item(s)
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#153F2D]">
                          {formatPaise(ord.totalPaise)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={ord.paymentStatus === "PAID" ? "sage" : "outline"}
                            className="text-[10px]"
                          >
                            {ord.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {ord.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${ord.id}`} className="gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Manage</span>
                            </Link>
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

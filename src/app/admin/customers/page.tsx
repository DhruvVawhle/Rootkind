import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, ShoppingCart } from "lucide-react";

export default async function AdminCustomersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const customers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        where: { paymentStatus: "PAID" },
      },
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
                Customer Insights
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Customer Directory
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                View registered growers, order frequency, and aggregate lifetime spend.
              </p>
            </div>
            <span className="text-xs font-bold text-[#153F2D] bg-white border border-[#DCD5C1] px-3.5 py-1.5 rounded-full">
              {customers.length} Registered Accounts
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EDE7D8]/60 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1]">
                  <tr>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5">Email &amp; Phone</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5">Account Role</th>
                    <th className="px-6 py-3.5">Paid Orders</th>
                    <th className="px-6 py-3.5 text-right">Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD5C1]">
                  {customers.map((c) => {
                    const totalSpendPaise = c.orders.reduce((sum, o) => sum + o.totalPaise, 0);
                    return (
                      <tr key={c.id} className="hover:bg-[#F7F4EA]/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#153F2D]">
                          {c.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#282B25] block">{c.email}</span>
                          <span className="text-[#8C9083] text-[11px]">{c.phone || "No phone saved"}</span>
                        </td>
                        <td className="px-6 py-4 text-[#5A5E53]">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={c.role === "ADMIN" ? "sage" : "outline"}
                            className="text-[10px]"
                          >
                            {c.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#282B25]">
                          {c.orders.length} order(s)
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#153F2D]">
                          {formatPaise(totalSpendPaise)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Archive, Plus, Minus, AlertTriangle, History } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminInventoryPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const [variants, adjustments] = await Promise.all([
    db.productVariant.findMany({
      orderBy: { stock: "asc" },
      include: { product: true },
    }),
    db.inventoryAdjustment.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        variant: {
          include: { product: true },
        },
      },
    }),
  ]);

  // Server action to adjust inventory
  async function adjustStockAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const variantId = formData.get("variantId") as string;
    const quantityChange = parseInt(formData.get("quantityChange") as string);
    const action = (formData.get("action") as any) || "RESTOCK";
    const reason = (formData.get("reason") as string) || "Manual inventory adjustment by admin";

    if (!variantId || isNaN(quantityChange) || quantityChange === 0) return;

    await db.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) return;

      const newStock = Math.max(0, variant.stock + quantityChange);

      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });

      await tx.inventoryAdjustment.create({
        data: {
          variantId,
          action,
          quantityChange,
          previousStock: variant.stock,
          newStock,
          reason,
          referenceId: `ADMIN-${Date.now()}`,
        },
      });
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                Stock &amp; Fulfillment
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Inventory Control
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Monitor variant stock counts, perform audit-logged adjustments, and prevent overselling.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Stock Table (2 Columns) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
              <div className="p-5 border-b border-[#DCD5C1] flex items-center justify-between">
                <h2 className="font-serif font-bold text-base text-[#153F2D]">
                  Current Stock Levels ({variants.length} SKUs)
                </h2>
                <span className="text-xs text-[#C87855] font-semibold">
                  {variants.filter((v) => v.stock <= 5).length} Low Stock
                </span>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE7D8]/60 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1] sticky top-0">
                    <tr>
                      <th className="px-5 py-3">Product / SKU</th>
                      <th className="px-5 py-3">Variant</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3 text-right">Available Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD5C1]">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F7F4EA]/40">
                        <td className="px-5 py-3">
                          <span className="font-bold text-[#153F2D] block">{v.product.name}</span>
                          <span className="text-[11px] text-[#8C9083]">SKU: {v.sku}</span>
                        </td>
                        <td className="px-5 py-3 text-[#5A5E53]">{v.title}</td>
                        <td className="px-5 py-3 font-semibold text-[#153F2D]">
                          {formatPaise(v.pricePaise)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                              v.stock <= 5
                                ? "bg-[#C87855]/15 text-[#C87855]"
                                : "bg-[#7D9565]/15 text-[#153F2D]"
                            }`}
                          >
                            {v.stock} in stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Adjustment Form (1 Column) */}
            <div className="bg-white p-6 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#153F2D]">
                Perform Stock Adjustment
              </h2>
              <form action={adjustStockAction} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="variantId">Target SKU / Product Variant</Label>
                  <select
                    id="variantId"
                    name="variantId"
                    required
                    className="w-full bg-white border border-[#DCD5C1] rounded-md px-3 py-2 text-xs text-[#282B25] focus:ring-1 focus:ring-[#153F2D]"
                  >
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.product.name} — {v.sku} (Current: {v.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="action">Adjustment Type</Label>
                  <select
                    id="action"
                    name="action"
                    required
                    className="w-full bg-white border border-[#DCD5C1] rounded-md px-3 py-2 text-xs text-[#282B25] focus:ring-1 focus:ring-[#153F2D]"
                  >
                    <option value="RESTOCK">Restock Received (+)</option>
                    <option value="MANUAL_CORRECTION">Manual Inventory Count Correction</option>
                    <option value="DAMAGED_WRITE_OFF">Damaged / Expired Write-off (-)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="quantityChange">
                    Quantity Change (e.g. +20 to add, -5 to reduce)
                  </Label>
                  <Input
                    id="quantityChange"
                    name="quantityChange"
                    type="number"
                    required
                    placeholder="+10 or -5"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reason">Adjustment Reason &amp; Reference</Label>
                  <Input
                    id="reason"
                    name="reason"
                    required
                    placeholder="e.g. New nursery harvest batch arrived"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full font-semibold">
                  Commit Inventory Adjustment
                </Button>
              </form>
            </div>
          </div>

          {/* Audit Trail Section */}
          <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#DCD5C1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#7D9565]" />
                <h2 className="font-serif font-bold text-base text-[#153F2D]">
                  Recent Inventory Adjustments Audit Log
                </h2>
              </div>
              <span className="text-xs text-[#8C9083]">Immutable system ledger</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EDE7D8]/50 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1]">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Product / SKU</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Change</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD5C1]">
                  {adjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-[#F7F4EA]/40">
                      <td className="px-5 py-3 text-[#5A5E53]">
                        {formatDate(adj.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[#153F2D] block">
                          {adj.variant.product.name}
                        </span>
                        <span className="text-[#8C9083] text-[11px]">{adj.variant.sku}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {adj.action}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 font-bold">
                        <span className={adj.quantityChange > 0 ? "text-[#7D9565]" : "text-[#B83A2E]"}>
                          {adj.quantityChange > 0 ? `+${adj.quantityChange}` : adj.quantityChange}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#5A5E53]">
                        {adj.previousStock} &rarr; <strong>{adj.newStock}</strong>
                      </td>
                      <td className="px-5 py-3 text-[#5A5E53] max-w-xs truncate">
                        {adj.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

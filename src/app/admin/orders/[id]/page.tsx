import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise, formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Truck, Package, CreditCard, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
  });

  if (!order) notFound();

  // Server action to update order status
  async function updateOrderStatusAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const orderId = formData.get("orderId") as string;
    const orderStatus = formData.get("orderStatus") as any;
    const paymentStatus = formData.get("paymentStatus") as any;

    await db.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        paymentStatus,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
  }

  // Server action to add/update tracking shipment
  async function updateShipmentAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const orderId = formData.get("orderId") as string;
    const carrier = formData.get("carrier") as string;
    const trackingNumber = formData.get("trackingNumber") as string;

    await db.$transaction([
      db.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "SHIPPED",
          fulfillmentStatus: "FULFILLED",
        },
      }),
      db.shipment.create({
        data: {
          orderId,
          carrier,
          trackingNumber,
          status: "FULFILLED",
          shippedAt: new Date(),
        },
      }),
    ]);

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
  }

  const shippingAddr = order.shippingAddressSnapshot as any;

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-[#DCD5C1]">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders" className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Orders</span>
                </Link>
              </Button>
              <h1 className="font-serif text-2xl font-bold text-[#153F2D]">
                Order {order.orderReference}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={order.paymentStatus === "PAID" ? "sage" : "outline"}>
                {order.paymentStatus}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {order.orderStatus.toLowerCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Items & Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs">
                <h2 className="font-serif font-bold text-base text-[#153F2D] mb-4">
                  Line Items ({order.items.length})
                </h2>
                <div className="divide-y divide-[#DCD5C1] border border-[#DCD5C1] rounded-xl overflow-hidden text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between items-center bg-white">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#153F2D] block">
                          {item.productTitle}
                        </span>
                        <span className="text-[#5A5E53]">
                          {item.variantTitle} • SKU: {item.sku}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-[#153F2D]">
                          {formatPaise(item.totalPaise)}
                        </span>
                        <span className="text-[#8C9083] block text-[11px]">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#5A5E53]">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPaise(order.subtotalPaise)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A5E53]">
                      <span>Shipping</span>
                      <span>{order.shippingPaise === 0 ? "FREE" : formatPaise(order.shippingPaise)}</span>
                    </div>
                    <div className="flex justify-between font-serif text-base font-bold text-[#153F2D] pt-2 border-t border-[#DCD5C1]">
                      <span>Total Paid</span>
                      <span>{formatPaise(order.totalPaise)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs text-xs space-y-2">
                <h2 className="font-serif font-bold text-base text-[#153F2D] mb-2">
                  Customer &amp; Delivery Destination
                </h2>
                <p className="font-bold text-[#282B25] text-sm">{order.customerName}</p>
                <p className="text-[#5A5E53]">{order.customerEmail} • {order.customerPhone}</p>
                <div className="p-3 bg-[#EDE7D8]/50 rounded-lg border border-[#DCD5C1] text-[#282B25] mt-2">
                  <p>{shippingAddr?.street}{shippingAddr?.apartment ? `, ${shippingAddr.apartment}` : ""}</p>
                  <p>{shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Right 1 Column: Fulfillment Actions */}
            <div className="space-y-6">
              {/* Order Status Control */}
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-[#153F2D]">
                  Update Status
                </h3>
                <form action={updateOrderStatusAction} className="space-y-3">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div className="space-y-1">
                    <Label htmlFor="orderStatus">Order State</Label>
                    <select
                      id="orderStatus"
                      name="orderStatus"
                      defaultValue={order.orderStatus}
                      className="w-full bg-white border border-[#DCD5C1] rounded-md px-3 py-2 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="paymentStatus">Payment State</Label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      defaultValue={order.paymentStatus}
                      className="w-full bg-white border border-[#DCD5C1] rounded-md px-3 py-2 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>

                  <Button type="submit" variant="default" size="sm" className="w-full font-semibold">
                    Update Order State
                  </Button>
                </form>
              </div>

              {/* Carrier Tracking Form */}
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#7D9565]" />
                  <h3 className="font-serif font-bold text-base text-[#153F2D]">
                    Dispatch Parcel
                  </h3>
                </div>
                <form action={updateShipmentAction} className="space-y-3">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div className="space-y-1">
                    <Label htmlFor="carrier">Courier Partner</Label>
                    <Input id="carrier" name="carrier" required defaultValue="Bluedart Express" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="trackingNumber">Airway Bill / Tracking Code</Label>
                    <Input id="trackingNumber" name="trackingNumber" required placeholder="e.g. BD98712345" />
                  </div>

                  <Button type="submit" variant="terracotta" size="sm" className="w-full font-semibold">
                    Mark Shipped &amp; Record Tracking
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

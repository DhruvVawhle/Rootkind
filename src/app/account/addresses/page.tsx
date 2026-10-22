import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const addresses = await db.address.findMany({
    where: { userId: user.userId },
    orderBy: { isDefault: "desc" },
  });

  // Server action to add address
  async function addAddressAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) return;

    const recipientName = formData.get("recipientName") as string;
    const phone = formData.get("phone") as string;
    const street = formData.get("street") as string;
    const apartment = formData.get("apartment") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;
    const isDefault = formData.get("isDefault") === "on";

    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    await db.address.create({
      data: {
        userId: user.userId,
        recipientName,
        phone,
        street,
        apartment: apartment || null,
        city,
        state,
        postalCode,
        isDefault,
      },
    });

    revalidatePath("/account/addresses");
  }

  // Server action to delete address
  async function deleteAddressAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) return;

    const addressId = formData.get("addressId") as string;
    await db.address.deleteMany({
      where: { id: addressId, userId: user.userId },
    });

    revalidatePath("/account/addresses");
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-b border-[#DCD5C1] pb-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#153F2D]">
                  Saved Addresses
                </h1>
                <p className="text-xs text-[#5A5E53] mt-1">
                  Manage your preferred shipping destinations for fast one-click botanical checkout.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account" className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Existing Addresses */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#153F2D]">
                  Address Book ({addresses.length})
                </h2>

                {addresses.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-[#DCD5C1] text-center text-xs text-[#5A5E53]">
                    <MapPin className="w-8 h-8 text-[#DCD5C1] mx-auto mb-2" />
                    <p className="font-medium text-[#282B25]">No saved addresses</p>
                    <p className="mt-1">Add your primary delivery destination using the form.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-5 rounded-xl border border-[#DCD5C1] relative shadow-2xs space-y-2 text-xs"
                    >
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7D9565] uppercase tracking-wider bg-[#7D9565]/10 px-2.5 py-0.5 rounded-full mb-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Default Delivery Address
                        </span>
                      )}
                      <p className="font-bold text-sm text-[#153F2D]">{addr.recipientName}</p>
                      <p className="text-[#5A5E53]">
                        {addr.street}
                        {addr.apartment ? `, ${addr.apartment}` : ""}
                      </p>
                      <p className="text-[#5A5E53]">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[#5A5E53]">Phone: {addr.phone}</p>

                      <div className="pt-3 border-t border-[#DCD5C1]/60 flex justify-end">
                        <form action={deleteAddressAction}>
                          <input type="hidden" name="addressId" value={addr.id} />
                          <button
                            type="submit"
                            className="text-xs text-[#B83A2E] hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Address Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs">
                <h2 className="font-serif text-lg font-bold text-[#153F2D] mb-4">
                  Add New Delivery Address
                </h2>
                <form action={addAddressAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input id="recipientName" name="recipientName" required placeholder="Full Name" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">10-Digit Mobile Number</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="9876543210" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" name="street" required placeholder="Flat / House No., Street, Area" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="apartment">Apartment / Landmark (Optional)</Label>
                    <Input id="apartment" name="apartment" placeholder="e.g. Near Community Park" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required placeholder="Bengaluru" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" required placeholder="Karnataka" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">6-Digit PIN Code</Label>
                    <Input id="postalCode" name="postalCode" required pattern="[0-9]{6}" placeholder="560034" />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      className="rounded border-[#DCD5C1] text-[#153F2D] focus:ring-[#153F2D]"
                    />
                    <label htmlFor="isDefault" className="text-xs text-[#5A5E53] cursor-pointer">
                      Set as default shipping address
                    </label>
                  </div>

                  <Button type="submit" variant="default" className="w-full">
                    Save Address
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

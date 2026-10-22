import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, hashPassword, setSessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const dbUser = await db.user.findUnique({
    where: { id: user.userId },
  });

  if (!dbUser) redirect("/account/login");

  // Server action for profile update
  async function updateProfileAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) return;

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    const updated = await db.user.update({
      where: { id: user.userId },
      data: { name, phone: phone || null },
    });

    await setSessionCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/account/profile");
  }

  // Server action for password change
  async function updatePasswordAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user) return;

    const newPassword = formData.get("newPassword") as string;
    if (!newPassword || newPassword.length < 8) return;

    const passwordHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.userId },
      data: { passwordHash },
    });

    revalidatePath("/account/profile");
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
                  Personal Profile
                </h1>
                <p className="text-xs text-[#5A5E53] mt-1">
                  Update your contact details and manage your account security credentials.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account" className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Details Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#DCD5C1]">
                  <div className="w-10 h-10 rounded-full bg-[#153F2D] text-[#F7F4EA] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#7D9565]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#153F2D]">
                      Contact Details
                    </h2>
                    <p className="text-xs text-[#5A5E53]">{dbUser.email}</p>
                  </div>
                </div>

                <form action={updateProfileAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={dbUser.name} required />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address (Immutable)</Label>
                    <Input id="email" defaultValue={dbUser.email} disabled className="bg-[#EDE7D8]/40" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={dbUser.phone || ""} placeholder="+91 98765 43210" />
                  </div>

                  <Button type="submit" variant="default" className="w-full">
                    Update Profile
                  </Button>
                </form>
              </div>

              {/* Password Security Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#DCD5C1]">
                  <div className="w-10 h-10 rounded-full bg-[#EDE7D8] text-[#153F2D] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#7D9565]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#153F2D]">
                      Account Security
                    </h2>
                    <p className="text-xs text-[#5A5E53]">Change your login password</p>
                  </div>
                </div>

                <form action={updatePasswordAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <p className="text-[11px] text-[#8C9083]">
                    Choose a strong, unique passphrase with numbers and special symbols.
                  </p>

                  <Button type="submit" variant="outline" className="w-full">
                    Change Password
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

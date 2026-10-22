import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { Heart, Sprout } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Saved Botanical Wishlist — Rootkind",
  description: "Keep track of heirloom seeds, organic mixes, and planters for your next growing season.",
};

export default async function WishlistPage() {
  const user = await getCurrentUser();

  const wishlistItems = user
    ? await db.wishlistItem.findMany({
        where: { userId: user.userId },
        include: {
          product: {
            include: {
              variants: { orderBy: { pricePaise: "asc" } },
            },
          },
        },
      })
    : [];

  // Fallback recommended products if wishlist is empty
  const recommended = await db.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      variants: { orderBy: { pricePaise: "asc" } },
    },
    take: 4,
  });

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 pb-6 border-b border-[#DCD5C1]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7D9565] mb-1">
                <Heart className="w-4 h-4 fill-current text-[#C87855]" />
                <span>Saved For Next Sowing</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D]">
                Your Botanical Wishlist
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1.5">
                Save heirloom seeds and garden tools to plan your upcoming seasonal crops.
              </p>
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <ProductCard
                    key={item.product.id}
                    id={item.product.id}
                    name={item.product.name}
                    slug={item.product.slug}
                    description={item.product.description}
                    plantType={item.product.plantType}
                    sunlight={item.product.sunlight}
                    difficulty={item.product.difficulty}
                    images={item.product.images}
                    defaultVariant={item.product.variants[0]}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                <div className="text-center py-16 bg-white rounded-2xl border border-[#DCD5C1] p-8 max-w-md mx-auto shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-[#EDE7D8] text-[#C87855] flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#153F2D] mb-1">
                    Your wishlist is empty
                  </h2>
                  <p className="text-xs text-[#5A5E53] mb-6">
                    Browse our catalogue to save your favorite heirloom varieties for your next container planting.
                  </p>
                  <Button variant="default" asChild>
                    <Link href="/shop">Explore Seeds</Link>
                  </Button>
                </div>

                {/* Recommended Seeds */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#153F2D] mb-6">
                    Popular Growing Choices This Season
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {recommended.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        id={prod.id}
                        name={prod.name}
                        slug={prod.slug}
                        description={prod.description}
                        plantType={prod.plantType}
                        sunlight={prod.sunlight}
                        difficulty={prod.difficulty}
                        images={prod.images}
                        defaultVariant={prod.variants[0]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

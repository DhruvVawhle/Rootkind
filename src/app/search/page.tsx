import Link from "next/link";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { ProductCard } from "@/components/storefront/product-card";
import { Search, Sprout } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Botanical Products — Rootkind",
  description: "Search for heirloom seeds, organic soils, planters, and starter kits.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await db.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { plantType: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          variants: { orderBy: { pricePaise: "asc" } },
        },
      })
    : [];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D] mb-4">
                Search the Botanical Nursery
              </h1>
              <form method="GET" action="/search" className="relative flex items-center">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search tomatoes, basil, potting mix, grow bags..."
                  className="w-full bg-white border border-[#DCD5C1] rounded-full px-6 py-3.5 pl-12 text-sm text-[#282B25] placeholder:text-[#8C9083] focus:outline-none focus:ring-2 focus:ring-[#153F2D] shadow-sm"
                />
                <Search className="w-5 h-5 text-[#8C9083] absolute left-4 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 rounded-full bg-[#153F2D] text-[#F7F4EA] text-xs font-semibold hover:bg-[#1C523B]"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Results Output */}
            {query && (
              <div className="mb-8 flex items-center justify-between border-b border-[#DCD5C1] pb-4">
                <p className="text-sm text-[#5A5E53]">
                  Found <strong>{products.length}</strong> {products.length === 1 ? "result" : "results"} for{" "}
                  <span className="text-[#153F2D] font-bold">&ldquo;{query}&rdquo;</span>
                </p>
                {products.length > 0 && (
                  <Link href="/shop" className="text-xs font-semibold text-[#153F2D] hover:underline">
                    View All Products &rarr;
                  </Link>
                )}
              </div>
            )}

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((prod) => (
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
            ) : query ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#DCD5C1] p-8 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#EDE7D8] text-[#7D9565] flex items-center justify-center mx-auto mb-3">
                  <Sprout className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-xl font-bold text-[#153F2D] mb-1">
                  No matching botanical varieties
                </h2>
                <p className="text-xs text-[#5A5E53] mb-6">
                  We couldn&apos;t find any seeds or tools matching &ldquo;{query}&rdquo;. Check spelling or explore our popular categories.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    href="/collections/vegetable-seeds"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EDE7D8] text-[#153F2D] hover:bg-[#DCD5C1]"
                  >
                    Vegetable Seeds
                  </Link>
                  <Link
                    href="/collections/starter-kits"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EDE7D8] text-[#153F2D] hover:bg-[#DCD5C1]"
                  >
                    Starter Kits
                  </Link>
                  <Link
                    href="/collections/potting-mixes"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EDE7D8] text-[#153F2D] hover:bg-[#DCD5C1]"
                  >
                    Living Soils
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

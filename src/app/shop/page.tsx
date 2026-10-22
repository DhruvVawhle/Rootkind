import Link from "next/link";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopSortSelect } from "@/components/storefront/shop-sort-select";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Botanical Products — Heirloom Seeds, Soils & Kits",
  description:
    "Browse our complete catalog of certified non-GMO heirloom seeds, living organic soils, fabric grow bags, and urban beginner kits.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    sunlight?: string;
    sort?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, difficulty, sunlight, sort, q } = params;

  // Build Prisma where query
  const where: any = { isPublished: true };

  if (category) {
    where.category = { slug: category };
  }

  if (difficulty) {
    where.difficulty = difficulty.toUpperCase();
  }

  if (sunlight) {
    where.sunlight = sunlight.toUpperCase();
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { plantType: { contains: q, mode: "insensitive" } },
    ];
  }

  // Determine sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };
  if (sort === "name-desc") orderBy = { name: "desc" };

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          orderBy: { pricePaise: "asc" },
        },
      },
      orderBy,
    }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // Handle client/in-memory price sorting if requested
  const sortedProducts = [...products];
  if (sort === "price-asc") {
    sortedProducts.sort(
      (a, b) => (a.variants[0]?.pricePaise || 0) - (b.variants[0]?.pricePaise || 0)
    );
  } else if (sort === "price-desc") {
    sortedProducts.sort(
      (a, b) => (b.variants[0]?.pricePaise || 0) - (a.variants[0]?.pricePaise || 0)
    );
  }

  const hasActiveFilters = Boolean(category || difficulty || sunlight || q);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[#5A5E53]">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-[#153F2D]">Home</Link>
                </li>
                <li>/</li>
                <li className="font-semibold text-[#153F2D]">Shop All</li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DCD5C1] pb-8 mb-8 gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D]">
                  Botanical Catalogue
                </h1>
                <p className="text-sm text-[#5A5E53] mt-1.5 max-w-xl">
                  Explore {products.length} home-growing essentials. Non-GMO seeds, living potting soils, and balcony gardening tools.
                </p>
              </div>

              {/* Sorting Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#5A5E53]">Sort by:</span>
                <ShopSortSelect currentSort={sort} />
              </div>
            </div>

            {/* Filter Pills / Navigation */}
            <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
              <Link
                href="/shop"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  !category
                    ? "bg-[#153F2D] text-[#F7F4EA]"
                    : "bg-white text-[#282B25] border border-[#DCD5C1] hover:bg-[#EDE7D8]"
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                    category === cat.slug
                      ? "bg-[#153F2D] text-[#F7F4EA]"
                      : "bg-white text-[#282B25] border border-[#DCD5C1] hover:bg-[#EDE7D8]"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Active Filters Clear Bar */}
            {hasActiveFilters && (
              <div className="mb-6 flex items-center gap-2 text-xs text-[#5A5E53]">
                <span>Active filters:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 bg-[#EDE7D8] text-[#153F2D] px-2.5 py-1 rounded-md font-medium">
                    Category: {category}
                  </span>
                )}
                {q && (
                  <span className="inline-flex items-center gap-1 bg-[#EDE7D8] text-[#153F2D] px-2.5 py-1 rounded-md font-medium">
                    Search: &ldquo;{q}&rdquo;
                  </span>
                )}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-[#9A4F2E] hover:underline font-semibold ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </Link>
              </div>
            )}

            {/* Product Grid or Empty State */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#DCD5C1] p-8">
                <div className="w-16 h-16 rounded-full bg-[#EDE7D8] text-[#7D9565] flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#153F2D] mb-2">
                  No botanical items match your filter
                </h2>
                <p className="text-sm text-[#5A5E53] max-w-md mx-auto mb-6">
                  Try clearing your search filters or browse our complete collection of heirloom seeds and living soils.
                </p>
                <Button variant="default" asChild>
                  <Link href="/shop">Reset All Filters</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((prod) => (
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
            )}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

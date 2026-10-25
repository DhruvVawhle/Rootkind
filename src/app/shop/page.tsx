import Link from "next/link";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { CatalogueHeader } from "@/components/catalogue/CatalogueHeader";
import { ProductGrid, SerializedProduct } from "@/components/catalogue/ProductGrid";
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
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, sort } = params;

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      db.product.findMany({
        where: { isPublished: true },
        include: {
          category: true,
          variants: {
            orderBy: { pricePaise: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    products = fetchedProducts;
    categories = fetchedCategories;
  } catch (error) {
    console.error("[ShopPage] Error fetching catalogue data:", error);
  }

  // Serialize to plain JSON objects for client component
  const serializedProducts: SerializedProduct[] = products.map((prod) => ({
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    description: prod.description || "",
    plantType: prod.plantType || null,
    sunlight: prod.sunlight || null,
    difficulty: prod.difficulty || null,
    images: prod.images || [],
    category: {
      id: prod.category?.id || "cat-default",
      name: prod.category?.name || "Botanical",
      slug: prod.category?.slug || "general",
    },
    variants: (prod.variants || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      title: v.title,
      pricePaise: v.pricePaise,
      compareAtPricePaise: v.compareAtPricePaise || null,
      stock: v.stock,
    })),
    createdAt: prod.createdAt instanceof Date ? prod.createdAt.toISOString() : String(prod.createdAt),
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-8 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[#5A5E53]">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-[#153F2D] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-[#153F2D]">Shop All</li>
              </ol>
            </nav>

            {/* Masked Headline & Intro */}
            <CatalogueHeader productCount={serializedProducts.length} />

            {/* Filter Chips + GSAP Flip Product Grid */}
            <ProductGrid
              initialProducts={serializedProducts}
              categories={serializedCategories}
              initialCategory={category}
              initialSort={sort}
            />
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

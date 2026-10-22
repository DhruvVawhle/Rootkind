import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { ProductCard } from "@/components/storefront/product-card";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (category) {
    return {
      title: `${category.name} — Rootkind Heirloom Catalogue`,
      description: category.description || `Shop ${category.name} at Rootkind.`,
    };
  }

  const collection = await db.collection.findUnique({ where: { slug } });
  if (collection) {
    return {
      title: `${collection.name} — Curated Growing Essentials`,
      description: collection.description || `Explore ${collection.name} at Rootkind.`,
    };
  }

  return { title: "Collection | Rootkind" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check Category first
  const category = await db.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: {
          variants: { orderBy: { pricePaise: "asc" } },
        },
      },
    },
  });

  let collection = null;
  if (!category) {
    collection = await db.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          include: {
            variants: { orderBy: { pricePaise: "asc" } },
          },
        },
      },
    });
  }

  if (!category && !collection) {
    notFound();
  }

  const title = category ? category.name : collection?.name;
  const description = category ? category.description : collection?.description;
  const image = category?.image || collection?.image;
  const products = category ? category.products : collection?.products || [];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#5A5E53]">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-[#153F2D]">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/shop" className="hover:text-[#153F2D]">Collections</Link>
                </li>
                <li>/</li>
                <li className="font-semibold text-[#153F2D]">{title}</li>
              </ol>
            </nav>

            {/* Collection Editorial Banner */}
            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-8 sm:p-12 mb-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] mb-2 block">
                  Curated Collection
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D] mb-3">
                  {title}
                </h1>
                <p className="text-sm text-[#5A5E53] leading-relaxed">
                  {description}
                </p>
                <p className="text-xs text-[#8C9083] mt-4">
                  Showing {products.length} products • 100% Non-GMO Botanical Selection
                </p>
              </div>

              {image && (
                <div className="relative w-full md:w-72 aspect-4/3 rounded-xl overflow-hidden shrink-0 border border-[#DCD5C1]">
                  <Image
                    src={image}
                    alt={title || "Collection banner"}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-[#DCD5C1] p-8">
                <p className="font-serif text-xl font-bold text-[#153F2D] mb-2">
                  New varieties coming soon
                </p>
                <p className="text-sm text-[#5A5E53] mb-6">
                  Our botanical nursery is currently cultivating new stock for this category.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#153F2D] text-[#F7F4EA] text-sm font-semibold hover:bg-[#1C523B]"
                >
                  Explore All Seeds
                </Link>
              </div>
            ) : (
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
            )}
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { ProductCard } from "@/components/storefront/product-card";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { variants: true },
  });

  if (!product) return { title: "Product Not Found | Rootkind" };

  const lowestPrice = product.variants[0]?.pricePaise ? product.variants[0].pricePaise / 100 : 0;

  return {
    title: `${product.name} — Organic Seeds & Care`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Rootkind`,
      description: product.description,
      images: [
        {
          url: product.images[0] || siteConfig.ogImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        orderBy: { pricePaise: "asc" },
      },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    include: {
      variants: {
        orderBy: { pricePaise: "asc" },
      },
    },
    take: 4,
  });

  // Schema.org JSON-LD for rich product snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: (product.variants[0]?.pricePaise / 100).toFixed(2),
      highPrice: (
        (product.variants[product.variants.length - 1]?.pricePaise ||
          product.variants[0]?.pricePaise) / 100
      ).toFixed(2),
      offerCount: product.variants.length,
      availability:
        product.variants.some((v) => v.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[#5A5E53]">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-[#153F2D]">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/shop" className="hover:text-[#153F2D]">Shop</Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href={`/collections/${product.category.slug}`}
                    className="hover:text-[#153F2D]"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li>/</li>
                <li className="font-semibold text-[#153F2D] truncate max-w-xs sm:max-w-md">
                  {product.name}
                </li>
              </ol>
            </nav>

            {/* Interactive Product Detail Box */}
            <ProductDetailView product={product} />

            {/* Related Botanical Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-24 pt-12 border-t border-[#DCD5C1]">
                <ScrollReveal animation="fade-up" delay={0.05} distance={18}>
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] block mb-1">
                        Companion Planting
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D]">
                        Pairs Well In The Garden
                      </h2>
                    </div>
                    <Link
                      href={`/collections/${product.category.slug}`}
                      className="text-xs font-bold text-[#153F2D] hover:underline"
                    >
                      More from {product.category.name} &rarr;
                    </Link>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((rel, idx) => (
                    <ProductCard
                      key={rel.id}
                      id={rel.id}
                      name={rel.name}
                      slug={rel.slug}
                      description={rel.description}
                      plantType={rel.plantType}
                      sunlight={rel.sunlight}
                      difficulty={rel.difficulty}
                      images={rel.images}
                      defaultVariant={rel.variants[0]}
                      index={idx}
                    />
                  ))}
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

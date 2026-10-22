import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustRowAndFooter } from "@/components/layout/trust-row-and-footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { ProductCard } from "@/components/storefront/product-card";
import { StarterKitsSection } from "@/components/storefront/starter-kits-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sprout,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  // 1. Fetch real categories (ordered by sortOrder)
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  // 2. Fetch featured beginner kit from database for hero caption
  const featuredKit = await db.product.findFirst({
    where: {
      category: { slug: "starter-kits" },
      isPublished: true,
    },
    include: {
      category: true,
      variants: {
        orderBy: { pricePaise: "asc" },
      },
    },
  });

  // 3. Fetch bestselling products from catalogue
  const featuredProducts = await db.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      variants: {
        orderBy: { pricePaise: "asc" },
      },
    },
    take: 8,
  });


  // 5. Fetch recent gardening articles
  const recentArticles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1">
          
          {/* 1. HERO SECTION */}
          <section className="relative overflow-hidden bg-[#F7F4EA] border-b border-[#DCD5C1] py-12 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                
                {/* Left Column: Heading, Supporting text, CTAs, Trust List */}
                <div className="lg:col-span-7 space-y-6">
                  

                  {/* Responsive H1 Headline */}
                  <h1 className="font-serif text-3.5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#153F2D] leading-[1.12]">
                    Grow good things <br className="hidden sm:inline" />
                    at home.
                  </h1>

                  {/* Supporting paragraph with inline link to beginner kits */}
                  <p className="text-base sm:text-lg text-[#464A40] max-w-xl leading-relaxed">
                    Everything you need to grow your own vegetables, herbs and fruits,
                    from your first seed to your first harvest. Certified organic seeds, living soils, and thoughtfully designed{" "}
                    <Link
                      href="/collections/starter-kits"
                      className="underline underline-offset-4 font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                    >
                      beginner kits
                    </Link>{" "}
                    crafted for compact balconies and home windowsills.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-[#153F2D] text-[#F7F4EA] hover:bg-[#1C523B] font-semibold px-7 py-3 min-h-[48px] rounded-md shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2"
                      asChild
                    >
                      <Link href="/shop" className="gap-2">
                        <span>Explore the catalogue</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-[#153F2D] text-[#153F2D] bg-transparent hover:bg-[#153F2D] hover:text-[#F7F4EA] font-semibold px-7 py-3 min-h-[48px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2"
                      asChild
                    >
                      <Link href="/collections/starter-kits">
                        View beginner kits
                      </Link>
                    </Button>
                  </div>

                  {/* Trust List */}
                  <ul className="pt-6 border-t border-[#DCD5C1] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm text-[#282B25] font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                      <span>85%+ Tested Germination</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                      <span>Kits Sized for Balconies</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                      <span>Free Delivery &gt; ₹999</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column: Aspect 4/5 visual with floating frosted glass card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/4.5] sm:aspect-[4/5] w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8] group">
                    <Image
                      src="/images/about/balcony-sanctuary.jpg"
                      alt="Sunlit urban home balcony garden featuring heirloom tomatoes, fragrant sweet basil, and terracotta planters on a wooden deck"
                      fill
                      priority
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 500px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Subtle ambient bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Floating Frosted Glass Label */}
                    <Link
                      href={`/products/${featuredKit?.slug || "first-harvest-balcony-vegetable-kit"}`}
                      className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-black/45 backdrop-blur-md border border-white/25 text-white p-4 sm:p-5 rounded-xl shadow-lg hover:bg-black/60 transition-all flex items-center justify-between gap-3 group/kit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#7D9565] block font-semibold">
                          Featured Growing Kit
                        </span>
                        <p className="font-serif text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                          {featuredKit?.name || "The First Harvest Balcony Vegetable Kit"}
                        </p>
                        <p className="text-xs text-white/80 mt-0.5 hidden sm:block">
                          Complete 4-crop heirloom setup with expanding coir planters
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/90 shrink-0 group-hover/kit:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 2. SHOP BY CATEGORY SECTION */}
          <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] block mb-1">
                  Curated Botanical Categories
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] rounded-md py-1"
              >
                <span>View All 13 Categories</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Empty State */}
            {(!categories || categories.length === 0) ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#DCD5C1]">
                <Sprout className="w-10 h-10 text-[#7D9565] mx-auto mb-3" aria-hidden="true" />
                <p className="text-base font-serif font-bold text-[#153F2D]">No categories available</p>
                <p className="text-xs text-[#464A40] mt-1">Please check back shortly or browse all products in our catalogue.</p>
              </div>
            ) : (
              /* Botanical Circular Category Grid: Responsive 2 cols (mobile) -> 3 cols (tablet) -> 6 cols (desktop) */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-[#EDE7D8]/30 border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                  >
                    {/* Circular Botanical Avatar Thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#EDE7D8] mb-3.5 border-2 border-[#DCD5C1] group-hover:border-[#153F2D] group-hover:scale-105 transition-all duration-300 shadow-xs shrink-0">
                      <Image
                        src={cat.image || "/images/about/heirloom-seeds.jpg"}
                        alt={`${cat.name} category`}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                      />
                    </div>

                    {/* Category Title & Descriptor */}
                    <div className="w-full">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#153F2D] group-hover:text-[#9A4F2E] transition-colors leading-tight line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#464A40] mt-1 line-clamp-1 leading-normal">
                        {cat.description || "Explore curated varieties"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 3. BESTSELLING BOTANICAL CATALOGUE */}
          <section className="py-16 bg-white border-y border-[#DCD5C1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                    Bestselling Seeds &amp; Care
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors"
                >
                  <span>Browse Full Catalogue</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((prod) => (
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
          </section>

          {/* 4. STARTER KITS SECTION */}
          <StarterKitsSection />

          {/* 5. EDUCATIONAL GARDENING ARTICLES */}
          <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                  From the Gardening Journal
                </h2>
              </div>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors"
              >
                <span>Read All Guides</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/journal/${art.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#EDE7D8]">
                    <Image
                      src={art.coverImage || "/images/about/heirloom-seeds.jpg"}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#153F2D] group-hover:text-[#9A4F2E] transition-colors leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#464A40] mt-2 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#DCD5C1]/70 flex items-center justify-between text-xs text-[#464A40]">
                      <span>{art.authorName}</span>
                      <span>{art.readingTimeMinutes} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </main>

        {/* SECTION B: TRUST ROW + FOOTER */}
        <TrustRowAndFooter />
      </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustRowAndFooter } from "@/components/layout/trust-row-and-footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { ProductCard } from "@/components/storefront/product-card";
import { ArrowRight, Sprout } from "lucide-react";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import dynamic from "next/dynamic";
import { StaggerContainer, StaggerItem } from "@/components/animation/stagger-container";
import { ParallaxContainer } from "@/components/animation/parallax-container";
import { HeroAnimated } from "@/components/HeroAnimated";

const GrowVideo = dynamic(
  () => import("@/components/GrowVideo").then((m) => m.GrowVideo),
  {
    loading: () => <div className="h-[100svh] w-full bg-[#153F2D]" />,
  }
);

const HorizontalSteps = dynamic(
  () => import("@/components/HorizontalSteps").then((m) => m.HorizontalSteps)
);

const StarterKitsSection = dynamic(
  () => import("@/components/storefront/starter-kits-section").then((m) => m.StarterKitsSection),
  {
    loading: () => <div className="min-h-[500px] w-full bg-[#7D9565]" />,
  }
);

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

  // 4. Fetch recent gardening articles
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
        {/* 1. HERO SECTION WITH SPLIT TEXT REVEAL & DUAL LEAF PARALLAX */}
        <HeroAnimated
          featuredKitSlug={featuredKit?.slug || "first-harvest-balcony-vegetable-kit"}
          featuredKitName={featuredKit?.name || "The First Harvest Balcony Vegetable Kit"}
        />

        {/* 2. SCROLL-SCRUBBED BOTANICAL GROWTH VIDEO */}
        <GrowVideo />

        {/* 3. HORIZONTAL PINNED SECTION: FOUR STEPS TO FIRST HARVEST */}
        <HorizontalSteps />

        {/* 4. SHOP BY CATEGORY SECTION */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={0.05} distance={18}>
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
                className="btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] rounded-md py-1"
              >
                <span>View All 13 Categories</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Empty State */}
          {(!categories || categories.length === 0) ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#DCD5C1]">
              <Sprout className="w-10 h-10 text-[#7D9565] mx-auto mb-3" aria-hidden="true" />
              <p className="text-base font-serif font-bold text-[#153F2D]">No categories available</p>
              <p className="text-xs text-[#464A40] mt-1">Please check back shortly or browse all products in our catalogue.</p>
            </div>
          ) : (
            /* Botanical Circular Category Grid with micro-interactions: spring up, light green tint, leaf wobble */
            <StaggerContainer
              as="div"
              staggerDelay={0.07}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
            >
              {categories.map((cat) => (
                <StaggerItem key={cat.id} yOffset={48}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-[#EDE7D8]/30 border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] h-full"
                  >
                    {/* Circular Botanical Avatar: springs up, tints light green, leaf icon wobbles */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#EDE7D8] mb-3.5 border-2 border-[#DCD5C1] group-hover:border-[#7D9565] group-hover:-translate-y-2 group-hover:scale-105 group-hover:bg-[#E3EBDC] transition-all duration-300 ease-out shadow-xs shrink-0">
                      <Image
                        src={cat.image || "/images/about/heirloom-seeds.jpg"}
                        alt={`${cat.name} category`}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Light green tint overlay on hover */}
                      <div className="absolute inset-0 bg-[#7D9565]/0 group-hover:bg-[#7D9565]/20 transition-colors duration-300 pointer-events-none" />

                      {/* Wobbling Leaf Icon Badge */}
                      <div
                        className="leaf-wobble-icon absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white/95 border border-[#7D9565] flex items-center justify-center text-[#153F2D] shadow-xs"
                        aria-hidden="true"
                      >
                        <Sprout className="w-3.5 h-3.5 text-[#153F2D]" />
                      </div>
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* 5. BESTSELLING BOTANICAL CATALOGUE */}
        <section className="py-16 bg-white border-y border-[#DCD5C1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" delay={0.05} distance={18}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                    Bestselling Seeds &amp; Care
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors"
                >
                  <span>Browse Full Catalogue</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod, idx) => (
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
                  index={idx}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 6. STARTER KITS SECTION (Morphing background, card tilts, image wipes, DustCanvas) */}
        <StarterKitsSection />

        {/* 7. EDUCATIONAL GARDENING ARTICLES WITH INNER PARALLAX */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={0.05} distance={18}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                  From the Gardening Journal
                </h2>
              </div>
              <Link
                href="/journal"
                className="btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors"
              >
                <span>Read All Guides</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer
            as="div"
            staggerDelay={0.08}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {recentArticles.map((art) => (
              <StaggerItem key={art.id} yOffset={48}>
                <Link
                  href={`/journal/${art.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#DCD5C1] hover:border-[#153F2D] hover:shadow-md transition-all h-full"
                >
                  {/* Journal Image with Inner Parallax */}
                  <div className="relative aspect-16/10 w-full bg-[#EDE7D8] overflow-hidden">
                    <ParallaxContainer offset={12} className="w-full h-full">
                      <div className="relative w-full h-full scale-105">
                        <Image
                          src={art.coverImage || "/images/about/heirloom-seeds.jpg"}
                          alt={art.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    </ParallaxContainer>
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
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>

      {/* SECTION B: TRUST ROW + FOOTER */}
      <TrustRowAndFooter />
    </div>
  );
}

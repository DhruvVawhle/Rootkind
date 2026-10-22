import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Calendar, Sprout, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article Not Found | Rootkind" };

  return {
    title: `${article.title} — Rootkind Growing Guide`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.authorName],
      images: [
        {
          url: article.coverImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  // Schema.org Article structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : [siteConfig.ogImage],
    datePublished: article.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
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
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Breadcrumb & Back */}
            <div className="flex items-center justify-between text-xs text-[#5A5E53]">
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 font-semibold text-[#153F2D] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Journal</span>
              </Link>
              <span className="font-semibold uppercase tracking-wider text-[#7D9565]">
                {article.category}
              </span>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#153F2D] leading-[1.15]">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A5E53] pt-2 border-y border-[#DCD5C1] py-3">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#7D9565]" />
                  <span>{article.authorName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#7D9565]" />
                  <span>{formatDate(article.publishedAt)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#7D9565]" />
                  <span>{article.readingTimeMinutes} min read</span>
                </span>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-md bg-[#EDE7D8]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-stone max-w-none text-[#282B25] text-sm sm:text-base leading-relaxed space-y-6">
              <p className="font-serif text-lg sm:text-xl font-medium text-[#153F2D] italic leading-relaxed border-l-2 border-[#7D9565] pl-4">
                {article.excerpt}
              </p>

              <div className="whitespace-pre-line text-sm leading-relaxed space-y-4">
                {article.content}
              </div>
            </div>

            {/* Companion Planting CTA Box */}
            <div className="bg-[#153F2D] text-[#F7F4EA] rounded-2xl p-8 sm:p-10 border border-[#1C523B] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-md">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7D9565]">
                  <Sprout className="w-4 h-4" />
                  <span>Put Theory into Soil</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Grow These Varieties At Home
                </h3>
                <p className="text-xs text-[#E8E2D1]/80">
                  Explore our certified heirloom seeds and living organic soils designed for balconies.
                </p>
              </div>

              <Button variant="terracotta" size="lg" asChild className="shrink-0 shadow-md">
                <Link href="/shop" className="gap-2">
                  <span>Explore Seeds</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

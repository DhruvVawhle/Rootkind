import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Growing Journal — Urban Gardening Articles & Sowing Guides",
  description: "Expert advice on balcony container gardening, India seasonal sowing calendars, and organic pest care.",
};

export default async function JournalIndexPage() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] block mb-1">
                Rootkind Knowledge Base
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#153F2D]">
                The Growing Journal
              </h1>
              <p className="text-sm text-[#5A5E53] mt-2 leading-relaxed">
                Clear, science-backed botanical guides designed for apartment balconies, sunny terraces, and mindful home growers across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden flex flex-col group hover:shadow-lg transition-all"
                >
                  <Link href={`/journal/${art.slug}`} className="relative aspect-16/10 w-full overflow-hidden block bg-[#EDE7D8]">
                    <Image
                      src={art.coverImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#7D9565] mb-2">
                        <span>{art.category}</span>
                        <span>•</span>
                        <span>{art.readingTimeMinutes} min read</span>
                      </div>
                      <Link href={`/journal/${art.slug}`}>
                        <h2 className="font-serif font-bold text-xl text-[#153F2D] group-hover:text-[#7D9565] transition-colors leading-snug">
                          {art.title}
                        </h2>
                      </Link>
                      <p className="text-xs text-[#5A5E53] mt-2.5 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#DCD5C1]/60 flex items-center justify-between text-xs">
                      <span className="text-[#8C9083]">{formatDate(art.publishedAt)}</span>
                      <Link
                        href={`/journal/${art.slug}`}
                        className="font-bold text-[#153F2D] group-hover:text-[#7D9565] inline-flex items-center gap-1"
                      >
                        <span>Read Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

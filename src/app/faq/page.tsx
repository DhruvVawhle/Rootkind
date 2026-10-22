import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { db } from "@/lib/db";
import { HelpCircle, ChevronDown, Sparkles, Sprout, Truck, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Rootkind Home Growing",
  description:
    "Find answers to common questions about seed germination, growing kits, balcony gardening, delivery across India, and our seed viability guarantee.",
};

export default async function FAQPage() {
  const faqs = await db.fAQ.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA] text-[#282B25]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#153F2D] text-[#F7F4EA] py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#7D9565]/30 text-[#F7F4EA] mb-4 border border-[#7D9565]/30">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Botanical Knowledge
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4">
              Answers for Home Growers
            </h1>
            <p className="text-sm sm:text-base text-[#F7F4EA]/80 leading-relaxed font-sans max-w-2xl mx-auto">
              Whether you are planting your first balcony heirloom tomato or troubleshooting container drainage,
              we are here with tested answers from seed to harvest.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {faqs.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#153F2D]/10 p-8">
              <Sprout className="w-12 h-12 text-[#7D9565] mx-auto mb-4" />
              <h2 className="font-serif text-xl font-medium mb-2">Our knowledge base is being refreshed</h2>
              <p className="text-sm text-[#282B25]/70 mb-6">
                Have an urgent growing question? Reach out directly to our gardening support specialists.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#153F2D] text-[#F7F4EA] text-sm font-medium hover:bg-[#153F2D]/90 transition"
              >
                Contact Support
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const categoryFaqs = faqs.filter((f) => f.category === category);
                return (
                  <div key={category} className="space-y-4">
                    <h2 className="font-serif text-xl sm:text-2xl font-light text-[#153F2D] border-b border-[#153F2D]/15 pb-2">
                      {category}
                    </h2>
                    <div className="space-y-3">
                      {categoryFaqs.map((faq) => (
                        <details
                          key={faq.id}
                          className="group bg-white rounded-xl border border-[#153F2D]/10 overflow-hidden shadow-xs hover:border-[#7D9565]/40 transition"
                        >
                          <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-[#282B25] text-sm sm:text-base list-none select-none">
                            <span className="pr-4">{faq.question}</span>
                            <ChevronDown className="w-4 h-4 text-[#7D9565] transition-transform duration-200 group-open:rotate-180 shrink-0" />
                          </summary>
                          <div className="px-5 pb-5 pt-1 text-sm text-[#282B25]/80 leading-relaxed border-t border-[#153F2D]/5 font-sans">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Help Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#153F2D]/10 text-center">
              <Truck className="w-8 h-8 text-[#153F2D] mx-auto mb-3" />
              <h3 className="font-serif text-base font-medium mb-1">Track an Order</h3>
              <p className="text-xs text-[#282B25]/70 mb-4">
                Check live courier transit status using your order number.
              </p>
              <Link
                href="/track-order"
                className="text-xs font-semibold text-[#153F2D] underline underline-offset-4 hover:text-[#C87855]"
              >
                Go to Order Tracking &rarr;
              </Link>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#153F2D]/10 text-center">
              <ShieldCheck className="w-8 h-8 text-[#7D9565] mx-auto mb-3" />
              <h3 className="font-serif text-base font-medium mb-1">Germination Guarantee</h3>
              <p className="text-xs text-[#282B25]/70 mb-4">
                Learn how our 30-day seed viability replacement policy works.
              </p>
              <Link
                href="/returns-refunds"
                className="text-xs font-semibold text-[#153F2D] underline underline-offset-4 hover:text-[#C87855]"
              >
                View Guarantee Terms &rarr;
              </Link>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#153F2D]/10 text-center">
              <Mail className="w-8 h-8 text-[#C87855] mx-auto mb-3" />
              <h3 className="font-serif text-base font-medium mb-1">Botanist Consultation</h3>
              <p className="text-xs text-[#282B25]/70 mb-4">
                Need help diagnosing pests, wilting, or potting issues?
              </p>
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#153F2D] underline underline-offset-4 hover:text-[#C87855]"
              >
                Talk to an Expert &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { ShieldCheck, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refund Policy | Rootkind",
  description:
    "Review our 30-Day Seed Germination Guarantee, return protocols for pots and tools, and simple refund procedures.",
};

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA] text-[#282B25]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#153F2D] text-[#F7F4EA] py-14 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#7D9565] font-semibold mb-2 block">
              The Rootkind Promise
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-3">
              Returns, Refunds & Germination Guarantee
            </h1>
            <p className="text-sm text-[#F7F4EA]/80 font-sans max-w-xl mx-auto">
              We stand behind every seed packet, planter, and bag of soil we curate. If your plants don&apos;t thrive under proper care, we make it right.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#153F2D] mb-2" />
              <h3 className="font-serif text-sm font-semibold text-[#153F2D]">30-Day Germination Promise</h3>
              <p className="text-xs text-[#282B25]/70 mt-1">
                Zero-sprout replacement or store credit if sown within our climate guidelines.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs">
              <RotateCcw className="w-6 h-6 text-[#7D9565] mb-2" />
              <h3 className="font-serif text-sm font-semibold text-[#153F2D]">7-Day Damaged Transit Window</h3>
              <p className="text-xs text-[#282B25]/70 mt-1">
                Immediate replacement for chipped planters, bent trowels, or damaged parcels.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#C87855] mb-2" />
              <h3 className="font-serif text-sm font-semibold text-[#153F2D]">5 - 7 Day Direct Refunds</h3>
              <p className="text-xs text-[#282B25]/70 mt-1">
                Processed via Razorpay directly back to your source card, UPI, or bank account.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-sm leading-relaxed text-[#282B25]/85">
          <div className="bg-white p-8 rounded-2xl border border-[#153F2D]/10 space-y-6">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">
                1. 30-Day Seed Germination Guarantee
              </h2>
              <p>
                Every seed lot at Rootkind undergoes vigorous laboratory germination tests (minimum 85%+ verified rate) before batch packaging. However, living biological organisms can occasionally be temperamental. If you sow your seeds according to the instructions on our packet and observe zero germination within 21 days:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li>Send a photo of your seedling tray/pot with your Order Number to <strong>care@rootkind.in</strong>.</li>
                <li>Our horticulture team will review the conditions and dispatch a fresh replacement packet free of charge, or issue full store credit.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">
                2. Pots, Planters & Hardware Returns
              </h2>
              <p>
                We accept returns on unused gardening tools, ceramic/terracotta planters, grow bags, and watering equipment within <strong>7 days of delivery</strong> under the following conditions:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li>The item is completely unused, unsoiled, and in its original retail packaging.</li>
                <li>Transit Damage: If an item arrives broken or cracked, please notify us within 48 hours of delivery with unboxing photos. We dispatch a replacement immediately with zero reverse shipping fees.</li>
                <li>Discretionary Returns: If you change your mind regarding size or colour, reverse pickup can be arranged for a standard logistics deduction of Rs. 120 per box.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">
                3. Non-Returnable Products
              </h2>
              <p>Due to biosecurity and biological contamination risks, the following items are strictly non-returnable once the protective packaging seal is broken:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li>Opened bags of potting soil, vermicompost, neem cake, and cocopeat blocks.</li>
                <li>Opened bottles of liquid bio-fertilizers and organic pest control sprays.</li>
                <li>Customized seed gift hampers and beginner kits once individual seed envelopes are torn open.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">
                4. Refund Processing & Timelines
              </h2>
              <p>
                Approved refunds are initiated within <strong>24 business hours</strong> of receiving the return parcel or claim approval. Payments are routed back to the original source method via Razorpay:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li><strong>UPI / Instant NetBanking:</strong> Typically reflects in 24 to 48 hours.</li>
                <li><strong>Credit / Debit Cards:</strong> Typically reflects in 5 to 7 business days, subject to your card issuer&apos;s settlement schedule.</li>
                <li><strong>Store Credit:</strong> Issued instantly as a digital code valid for 12 months on all Rootkind products.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#153F2D]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#153F2D]">Need to file a return or germination inquiry?</p>
                <p className="text-xs text-[#282B25]/70">Our gardening support team is on standby 6 days a week.</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#153F2D] text-[#F7F4EA] text-xs font-semibold hover:bg-[#153F2D]/90 transition"
              >
                Initiate a Request &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

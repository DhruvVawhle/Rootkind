import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { FileText, Scale, ShieldAlert, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Rootkind Home Growing",
  description:
    "Review the legal terms governing purchases, botanical representations, guarantees, and website use on Rootkind.in.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA] text-[#282B25]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#153F2D] text-[#F7F4EA] py-14 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#7D9565] font-semibold mb-2 block">
              Legal Agreement
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-3">
              Terms & Conditions
            </h1>
            <p className="text-sm text-[#F7F4EA]/80 font-sans max-w-xl mx-auto">
              Please read these terms carefully before placing an order on Rootkind.in.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#153F2D] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Fair Commerce</p>
                <p className="text-[11px] text-[#282B25]/70">Transparent pricing</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <Award className="w-5 h-5 text-[#7D9565] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Viability Standards</p>
                <p className="text-[11px] text-[#282B25]/70">Tested seed lots</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#C87855] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Living Biology</p>
                <p className="text-[11px] text-[#282B25]/70">Growth disclaimers</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#153F2D] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Bengaluru Courts</p>
                <p className="text-[11px] text-[#282B25]/70">Governing jurisdiction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-sm leading-relaxed text-[#282B25]/85">
          <div className="bg-white p-8 rounded-2xl border border-[#153F2D]/10 space-y-6">
            <div>
              <p className="text-xs text-[#282B25]/60 mb-4">Last Modified: October 2026</p>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">1. Overview and Acceptance</h2>
              <p>
                This website is operated by <strong>Rootkind</strong>. Throughout the site, the terms &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer to Rootkind. By visiting our storefront and/or purchasing from us, you engage in our &quot;Service&quot; and agree to be bound by the following terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">2. Biological Growth Disclaimer</h2>
              <p>
                Seeds, potting mixtures, and organic growing media are living biological substances. While Rootkind guarantees lab-tested germination viability rates (85%+) at the time of dispatch:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li>Actual plant maturity, harvest yield, and foliage growth are subject to environmental variables beyond our direct control, including ambient humidity, adequate sunlight hours, watering consistency, potting container drainage, local pest pressure, and seasonal sowing windows.</li>
                <li>Product photographs represent mature, thriving specimens grown under ideal horticultural conditions and should serve as an editorial guide.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">3. Pricing, Payments & Invoices</h2>
              <p>
                All prices listed on Rootkind.in are denominated in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). Delivery charges are clearly itemized during checkout prior to payment authorization. We reserve the right to correct typographical pricing errors before shipment.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">4. Order Modification & Cancellation</h2>
              <p>
                Orders may be cancelled free of charge if the request is submitted prior to dispatch (typically within 4 hours of order placement). Once an order has been assigned an Air Waybill (AWB) and handed over to logistics partners, standard return policies apply.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">5. Intellectual Property</h2>
              <p>
                All editorial texts, planting calendars, journal articles, imagery, graphical logos, branding motifs, and interface designs are the intellectual property of Rootkind. Unauthorized reproduction, scraping, or commercial exploitation is strictly prohibited without prior written consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">6. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

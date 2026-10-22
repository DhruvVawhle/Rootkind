import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Rootkind",
  description:
    "Learn about our shipping timelines across India, packaging protocols for seed viability and heavy soil mixes, and tracking your order.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA] text-[#282B25]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#153F2D] text-[#F7F4EA] py-14 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#7D9565] font-semibold mb-2 block">
              Transparent Logistics
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-3">
              Shipping & Delivery Policy
            </h1>
            <p className="text-sm text-[#F7F4EA]/80 font-sans max-w-xl mx-auto">
              Delivering premium botanical seeds, living potting media, and garden essentials safely across India.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#153F2D] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Free Shipping</p>
                <p className="text-xs text-[#282B25]/70">On all orders above Rs. 999</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#7D9565] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">24-48h Dispatch</p>
                <p className="text-xs text-[#282B25]/70">Hand-packed from Bengaluru</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C87855] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Pan-India Reach</p>
                <p className="text-xs text-[#282B25]/70">Over 19,000+ PIN codes served</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#153F2D] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Weather-Safe Pack</p>
                <p className="text-xs text-[#282B25]/70">Moisture-sealed seeds</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-sm leading-relaxed text-[#282B25]/85">
          <div className="bg-white p-8 rounded-2xl border border-[#153F2D]/10 space-y-6">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">1. Order Processing & Dispatch</h2>
              <p>
                All orders placed on <strong>Rootkind.in</strong> are hand-inspected and processed from our central nursery fulfillment center in Bengaluru, Karnataka. Orders are dispatched Monday through Saturday, excluding gazetted national holidays.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li>Orders received before 1:00 PM IST are typically dispatched within 24 hours.</li>
                <li>Standard dispatch turnaround for orders containing heavy soil blends or planters is 24 to 48 hours.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">2. Delivery Timelines Across India</h2>
              <p className="mb-3">
                We partner with tier-1 national logistics providers (including BlueDart, Delhivery, Xpressbees, and India Post for remote PIN codes) to guarantee swift and careful transit:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#153F2D]/10 rounded-lg overflow-hidden">
                  <thead className="bg-[#153F2D]/5 text-[#153F2D] uppercase font-semibold">
                    <tr>
                      <th className="p-3">Destination Region</th>
                      <th className="p-3">Estimated Transit Window</th>
                      <th className="p-3">Courier Partners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#153F2D]/10">
                    <tr>
                      <td className="p-3 font-medium">Bengaluru & South Metro Hubs</td>
                      <td className="p-3">1 - 2 business days</td>
                      <td className="p-3">Delhivery Air / Direct Courier</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Major Metros (Delhi NCR, Mumbai, Pune, Hyderabad, Kolkata, Chennai)</td>
                      <td className="p-3">2 - 4 business days</td>
                      <td className="p-3">BlueDart Express / Delhivery</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Tier-2 & Tier-3 Cities</td>
                      <td className="p-3">4 - 6 business days</td>
                      <td className="p-3">Delhivery / Xpressbees Ground</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">North-East, J&K, Island Territories & Remote Areas</td>
                      <td className="p-3">6 - 9 business days</td>
                      <td className="p-3">India Post Speed Post / Delhivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">3. Shipping Rates & Thresholds</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Orders above Rs. 999:</strong> Free Standard Shipping across India.</li>
                <li><strong>Orders under Rs. 999:</strong> A nominal flat fee of Rs. 99 is charged to offset safe botanical packaging and temperature-stable freight.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">4. Specialized Botanical Packaging</h2>
              <p>
                Live seeds are susceptible to moisture fluctuations and excessive heat during transport. We package all heirloom seeds in 3-layer, moisture-barrier, light-blocking pouches with desiccant protection. Heavy soils, cocopeat, and compost are double-bagged in heavy-duty recyclable woven poly to prevent punctures or leakages.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">5. Real-Time Tracking</h2>
              <p>
                As soon as your package is scanned into the courier hub, you will receive an SMS and email notification with your Air Waybill (AWB) number and direct tracking link. You can also monitor real-time milestones via our <a href="/track-order" className="text-[#153F2D] underline font-medium hover:text-[#C87855]">Order Tracking page</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

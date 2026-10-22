import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Sprout, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Botanical Support — Rootkind Nursery",
  description: "Get in touch with our botanical horticulture team for seed guidance, order assistance, and nursery queries.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  async function handleContactAction(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    console.log(`[Contact Inquiry]: From ${name} (${email}): ${message}`);
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565] block mb-1">
                Rootkind Care Desk
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D]">
                Get in Touch
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5E53] mt-2 leading-relaxed">
                Whether you have a question about seed germination, soil ratios, or tracking an existing parcel, our team of horticulturists is here to help.
              </p>
            </div>

            {sent && (
              <div className="p-4 rounded-xl bg-[#7D9565]/15 border border-[#7D9565]/30 text-[#153F2D] text-xs flex items-center gap-2.5 max-w-lg mx-auto">
                <CheckCircle2 className="w-5 h-5 text-[#7D9565] shrink-0" />
                <span>Thank you! Your message has been sent to our botanical team. We will reply within 24 hours.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              {/* Left Column: Direct Info */}
              <div className="bg-white p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-6 text-xs text-[#5A5E53]">
                <h2 className="font-serif text-xl font-bold text-[#153F2D]">
                  Botanical Nursery &amp; Labs
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#7D9565] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#282B25] block text-sm">Nursery Location</strong>
                      <p>{siteConfig.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#7D9565] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#282B25] block text-sm">Direct Email</strong>
                      <a href={`mailto:${siteConfig.supportEmail}`} className="text-[#153F2D] hover:underline">
                        {siteConfig.supportEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#7D9565] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#282B25] block text-sm">Phone Inquiries</strong>
                      <p>{siteConfig.supportPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#7D9565] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#282B25] block text-sm">Consultation Hours</strong>
                      <p>Monday to Saturday: 9:00 AM – 6:00 PM IST</p>
                      <p className="text-[11px] text-[#8C9083]">Closed on Indian national holidays</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="bg-white p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
                <h2 className="font-serif text-xl font-bold text-[#153F2D]">
                  Send a Botanical Inquiry
                </h2>
                <form action="/contact?sent=true" method="POST" className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input id="contactName" name="name" required placeholder="Full Name" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input id="contactEmail" name="email" type="email" required placeholder="name@example.com" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="topic">Topic</Label>
                    <select
                      id="topic"
                      name="topic"
                      className="w-full bg-white border border-[#DCD5C1] rounded-md px-3.5 py-2 text-xs text-[#282B25] focus:ring-1 focus:ring-[#153F2D]"
                    >
                      <option>Seed Germination Support</option>
                      <option>Order &amp; Delivery Tracking</option>
                      <option>Living Soil &amp; Kit Advice</option>
                      <option>Bulk &amp; Community Gardening</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contactMessage">Your Message</Label>
                    <textarea
                      id="contactMessage"
                      name="message"
                      rows={4}
                      required
                      placeholder="Describe your question or garden setup..."
                      className="w-full bg-white border border-[#DCD5C1] rounded-md p-3 text-xs text-[#282B25] focus:outline-none focus:ring-1 focus:ring-[#153F2D]"
                    />
                  </div>

                  <Button type="submit" variant="default" className="w-full font-semibold">
                    Submit Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

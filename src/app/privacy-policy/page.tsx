import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Lock, Shield, EyeOff, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rootkind",
  description:
    "Understand how Rootkind collects, protects, and handles your personal data, shipping details, and payment privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA] text-[#282B25]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#153F2D] text-[#F7F4EA] py-14 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#7D9565] font-semibold mb-2 block">
              Data Privacy & Security
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-3">
              Rootkind Privacy Policy
            </h1>
            <p className="text-sm text-[#F7F4EA]/80 font-sans max-w-xl mx-auto">
              Your trust is our cornerstone. We collect only what is strictly necessary to deliver plants and seeds to your doorstep.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#153F2D] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Zero Card Storage</p>
                <p className="text-[11px] text-[#282B25]/70">PCI-DSS Tokenized</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#7D9565] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">Bcrypt Passwords</p>
                <p className="text-[11px] text-[#282B25]/70">Cost factor 12 salt</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-[#C87855] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">No Data Selling</p>
                <p className="text-[11px] text-[#282B25]/70">Strict zero-resale policy</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#153F2D]/10 shadow-xs flex items-center gap-3">
              <Server className="w-5 h-5 text-[#153F2D] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#153F2D]">HTTP-Only JWT</p>
                <p className="text-[11px] text-[#282B25]/70">Encrypted sessions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-sm leading-relaxed text-[#282B25]/85">
          <div className="bg-white p-8 rounded-2xl border border-[#153F2D]/10 space-y-6">
            <div>
              <p className="text-xs text-[#282B25]/60 mb-4">Effective Date: October 2026 | Last Updated: October 2026</p>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">1. Information We Collect</h2>
              <p>When you visit, register, or make a purchase on Rootkind, we collect the following categories of data:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
                <li><strong>Identity & Contact Details:</strong> Full name, email address, mobile phone number.</li>
                <li><strong>Shipping & Delivery Addresses:</strong> Street address, apartment/house number, city, state, postal code, and delivery notes.</li>
                <li><strong>Transactional Details:</strong> Order items, quantities, transaction timestamps, payment reference IDs, and fulfillment status.</li>
                <li><strong>Device & Network Data:</strong> Anonymized IP addresses, browser user-agents, and session cookies to ensure shopping cart persistence.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">2. How Your Information Is Used</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>To dispatch, track, and fulfill your orders of seeds, soil blends, and garden tools.</li>
                <li>To transmit automated tracking notifications via SMS and email regarding your shipment milestones.</li>
                <li>To authenticate customer accounts and secure administrative privileges.</li>
                <li>To deliver our botanical newsletter and seasonal planting advisories (only if explicitly opted-in).</li>
                <li>To comply with statutory financial audits, GST invoices, and Indian commercial tax laws.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">3. Payment Information & Security</h2>
              <p>
                <strong>Rootkind never stores your credit card numbers, debit card details, CVVs, or UPI MPINs on our servers.</strong> All electronic payments are routed via Razorpay, a certified PCI-DSS Level 1 payment gateway provider. Communication between your browser, our server, and the payment gateway is encrypted with TLS 1.3 protocol.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">4. Cookies and Session State</h2>
              <p>
                We use strictly functional, essential cookies (such as <code>rootkind_session</code> and <code>cart_token</code>) to preserve your shopping bag and authenticated customer session across page reloads. We do not use third-party data tracking brokers or behavioral retargeting pixels without consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">5. Data Sharing and Logistics Partners</h2>
              <p>
                We only share your delivery details (name, address, and contact number) with verified logistics partners (such as Delhivery, BlueDart, and India Post) exclusively for delivering your parcel. We do not license, sell, or rent your personal contact information to third-party telemarketers or external entities.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-[#153F2D] mb-3">6. Your Rights & Grievance Redressal</h2>
              <p>
                You have the right to request a copy of your stored account data, update your delivery addresses, or request the closure and anonymization of your account. In compliance with the Information Technology Act, 2000 and Indian Digital Personal Data Protection Act (DPDPA), inquiries may be addressed to:
              </p>
              <div className="p-4 bg-[#F7F4EA] rounded-xl border border-[#153F2D]/10 mt-3 text-xs space-y-1">
                <p><strong>Grievance Officer:</strong> Data Protection Cell, Rootkind Technologies</p>
                <p><strong>Address:</strong> 42 Botanical Lane, Indiranagar, Bengaluru, Karnataka 560038, India</p>
                <p><strong>Email:</strong> privacy@rootkind.in</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

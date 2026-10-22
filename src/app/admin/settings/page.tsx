import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, ShieldCheck, CreditCard, Truck, Globe } from "lucide-react";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const isRazorpayConfigured = Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  );

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                System Configuration
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Store Settings
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Centralized brand parameters, shipping thresholds, and payment gateway health.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Brand Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#DCD5C1]">
                <Globe className="w-5 h-5 text-[#153F2D]" />
                <h2 className="font-serif font-bold text-base text-[#153F2D]">
                  Brand Identity &amp; Meta
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <Label>Brand Name</Label>
                  <Input defaultValue={siteConfig.name} readOnly className="bg-[#EDE7D8]/30 font-bold" />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input defaultValue={siteConfig.tagline} readOnly className="bg-[#EDE7D8]/30 italic" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Core Promise</Label>
                  <Input defaultValue="Everything you need to grow your own vegetables, herbs and fruits, from your first seed to your first harvest." readOnly className="bg-[#EDE7D8]/30" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Support Email</Label>
                  <Input defaultValue={siteConfig.supportEmail} readOnly className="bg-[#EDE7D8]/30" />
                </div>
              </div>
            </div>

            {/* Shipping & Thresholds */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#DCD5C1]">
                <Truck className="w-5 h-5 text-[#7D9565]" />
                <h2 className="font-serif font-bold text-base text-[#153F2D]">
                  Shipping Rules (Integer Paise)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <Label>Free Shipping Threshold</Label>
                  <Input defaultValue="₹999 (99,900 Paise)" readOnly className="bg-[#EDE7D8]/30 font-semibold text-[#153F2D]" />
                </div>
                <div>
                  <Label>Standard Flat Shipping Fee</Label>
                  <Input defaultValue="₹99 (9,900 Paise)" readOnly className="bg-[#EDE7D8]/30 font-semibold text-[#153F2D]" />
                </div>
              </div>
            </div>

            {/* Gateway Health */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCD5C1]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#153F2D]" />
                  <h2 className="font-serif font-bold text-base text-[#153F2D]">
                    Razorpay Gateway Integration Status
                  </h2>
                </div>
                <Badge variant={isRazorpayConfigured ? "sage" : "outline"} className="text-xs">
                  {isRazorpayConfigured ? "Active (Test/Live Configured)" : "Unconfigured"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-[#5A5E53] leading-relaxed">
                <p>
                  <strong>Key ID:</strong> {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "Not set (using test simulation)"}
                </p>
                <p>
                  <strong>HMAC Webhook Verification:</strong> Active with replay deduplication.
                </p>
                <p>
                  <strong>Currency Mode:</strong> INR (Integer Paise Precision).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

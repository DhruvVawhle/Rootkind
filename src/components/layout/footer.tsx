import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sprout, Mail, ShieldCheck, Leaf, PackageCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#153F2D] text-[#F7F4EA] border-t border-[#1C523B]">
      {/* Botanical Value Pillars Bar */}
      <div className="border-b border-[#1C523B]/80 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-[#7D9565]/20 text-[#7D9565] shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-white">
                100% Non-GMO Seeds
              </h3>
              <p className="text-xs text-[#E8E2D1]/80 mt-1 leading-relaxed">
                Open-pollinated, high-germination heirloom varieties grown by ethical Indian farmers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-[#7D9565]/20 text-[#7D9565] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-white">
                Living Microbial Soils
              </h3>
              <p className="text-xs text-[#E8E2D1]/80 mt-1 leading-relaxed">
                Peat-free, aged vermicompost and washed coir substrates aerated for container vitality.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-[#7D9565]/20 text-[#7D9565] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-white">
                Germination Guarantee
              </h3>
              <p className="text-xs text-[#E8E2D1]/80 mt-1 leading-relaxed">
                Free seed replacement if your packet fails to sprout with our guided instructions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-[#7D9565]/20 text-[#7D9565] shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-white">
                Plastic-Free Packaging
              </h3>
              <p className="text-xs text-[#E8E2D1]/80 mt-1 leading-relaxed">
                Delivered in biodegradable kraft bags and recycled corrugated fiber containers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#7D9565] text-[#153F2D] flex items-center justify-center">
                <Sprout className="w-4 h-4 text-[#153F2D]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-[#E8E2D1]/85 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-[#E8E2D1]/70 space-y-1">
              <p>🌱 {siteConfig.address}</p>
              <p>💌 {siteConfig.supportEmail} | 📞 {siteConfig.supportPhone}</p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8E2D1]/80">
              {siteConfig.footerNav.shop.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Growing Journal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8E2D1]/80">
              {siteConfig.footerNav.learn.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Care & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8E2D1]/80">
              {siteConfig.footerNav.company.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              {siteConfig.footerNav.legal.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1C523B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F4EA]/90 gap-4">
          <p>© 2026 {siteConfig.legalName}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for mindful home growers with <Heart className="w-3.5 h-3.5 text-[#C87855] fill-current" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

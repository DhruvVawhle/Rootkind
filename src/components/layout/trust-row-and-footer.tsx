import React from "react";
import Link from "next/link";
import { TRUST_CLAIMS } from "@/content/claims";
import { FOOTER_NAV_COLUMNS, BOTTOM_BAR_LINKS } from "@/lib/nav";
import { siteConfig } from "@/config/site";
import {
  Sprout,
  Leaf,
  ShieldCheck,
  PackageCheck,
  MapPin,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animation/stagger-container";

export function TrustRowAndFooter() {
  const currentYear = new Date().getFullYear();

  const getClaimIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return Leaf;
      case "ShieldCheck":
        return ShieldCheck;
      case "PackageCheck":
        return PackageCheck;
      case "Sprout":
      default:
        return Sprout;
    }
  };

  return (
    <footer className="w-full bg-[#153F2D] text-[#D5DFD2] border-t border-[#1E523A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. TRUST ROW: 4 items, icon circle + h3 + one line each */}
        <section
          aria-labelledby="trust-row-heading"
          className="py-12 sm:py-16 border-b border-[#1E523A]"
        >
          <h2 id="trust-row-heading" className="sr-only">
            Rootkind Botanical Standards and Guarantees
          </h2>

          <StaggerContainer
            as="div"
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
          >
            {TRUST_CLAIMS.map((claim) => {
              const IconComp = getClaimIcon(claim.icon);
              return (
                <StaggerItem key={claim.id} yOffset={20}>
                  <div className="flex flex-col items-start gap-3.5">
                    {/* Icon circle */}
                    <div
                      className="w-12 h-12 rounded-full bg-[#1A4533] border border-[#2B684F] text-[#F0C4A0] flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* h3 Heading */}
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug">
                      {claim.title}
                    </h3>

                    {/* One line description */}
                    <p className="text-xs sm:text-sm text-[#D5DFD2] leading-relaxed">
                      {claim.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* 2. MAIN FOOTER CONTENT */}
        <div className="py-14 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12">
          
          {/* Brand block (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Brand "Rootkind" */}
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Rootkind
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-[#D5DFD2] max-w-sm leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* <address> with map-pin, mail and phone icons */}
            <address className="not-italic text-xs sm:text-sm text-[#B7C6B5] space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F0C4A0] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">
                  Rootkind Botanical Nursery &amp; Labs, 4th Block Koramangala, Bengaluru, Karnataka 560034
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F0C4A0] shrink-0" aria-hidden="true" />
                <a
                  href="mailto:hello@rootkind.in"
                  className="hover:text-white transition-colors underline-offset-4 hover:underline min-h-[44px] inline-flex items-center rounded-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D]"
                >
                  hello@rootkind.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F0C4A0] shrink-0" aria-hidden="true" />
                <a
                  href="tel:+9108041237890"
                  className="hover:text-white transition-colors underline-offset-4 hover:underline min-h-[44px] inline-flex items-center rounded-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D]"
                >
                  +91 (080) 4123-7890
                </a>
              </div>
            </address>
          </div>

          {/* Three nav columns, driven by data (lib/nav.ts) (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {FOOTER_NAV_COLUMNS.map((column) => (
              <nav
                key={column.title}
                aria-label={column.ariaLabel}
                className="flex flex-col"
              >
                <h3 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-white mb-4">
                  {column.title}
                </h3>

                <ul className="space-y-1.5" role="list">
                  {column.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="min-h-[44px] py-2 px-1 text-xs sm:text-sm text-[#D5DFD2] hover:text-white transition-colors inline-flex items-center rounded-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D]"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

        </div>

        {/* 3. BOTTOM BAR */}
        <div className="py-6 border-t border-[#1E523A] flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#B7C6B5]">
          {/* Copyright */}
          <div className="shrink-0">
            <p>
              &copy; {currentYear} Rootkind Botanical Goods Private Limited. All rights reserved.
            </p>
          </div>

          {/* Policy Links */}
          <nav aria-label="Legal and company policies" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {BOTTOM_BAR_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="min-h-[44px] py-1 px-1.5 hover:text-white transition-colors inline-flex items-center rounded-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D] whitespace-nowrap"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Designed for mindful home growers with heart icon in India */}
          <div className="flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap">
            <span>Designed for mindful home growers with</span>
            <Heart
              className="w-3.5 h-3.5 text-[#F0C4A0] fill-[#F0C4A0] inline-block shrink-0"
              aria-label="love"
              role="img"
            />
            <span>in India.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

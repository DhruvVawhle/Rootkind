import React from "react";
import Link from "next/link";
import { STARTER_KITS_DATA, formatKitPrice } from "@/lib/kits";
import { KitArt } from "@/components/storefront/kit-art";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { MotionRevealCard } from "@/components/storefront/motion-reveal-card";
import {
  ArrowRight,
  Sprout,
  CircleDot,
  ShoppingBag,
  Tag,
  BookOpen,
} from "lucide-react";

export function StarterKitsSection() {
  const inEveryBoxItems = [
    { title: "Certified heirloom seeds", icon: Sprout },
    { title: "Expanding organic cocopeat discs", icon: CircleDot },
    { title: "Breathable fabric planters", icon: ShoppingBag },
    { title: "Plant markers", icon: Tag },
    { title: "Day-by-day care guide", icon: BookOpen },
  ];

  return (
    <section
      id="starter-kits"
      aria-labelledby="starter-kits-heading"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
    >
      {/* Outer rounded forest container (24px radius, #153F2D background) */}
      <div className="bg-[#153F2D] text-[#D5DFD2] rounded-[24px] p-6 sm:p-10 lg:p-12 shadow-xl border border-[#1E523A] overflow-hidden">
        
        {/* 1. Header row, wraps on small screens */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#1E523A]">
          
          {/* Left Column */}
          <div className="max-w-2xl">
            {/* Eyebrow in peach */}
            <span className="text-[#F0C4A0] text-xs sm:text-sm font-semibold uppercase tracking-wider block mb-2">
              Starter kits
            </span>

            {/* h2 in two lines (Fraunces 700, clamp 32px to 52px) */}
            <h2
              id="starter-kits-heading"
              className="font-serif font-bold text-white leading-[1.12] mb-4 text-[clamp(2rem,4.5vw,3.25rem)]"
            >
              Everything in one box. <br />
              From seed to harvest.
            </h2>

            {/* Paragraph */}
            <p className="text-[#D5DFD2] text-base sm:text-lg leading-relaxed max-w-xl mb-6">
              Each guided kit is made for beginners and compact urban balconies, with a day-by-day care guide so you always know the next step.
            </p>

            {/* CTA link "Shop all starter kits" with arrow icon (min 44px hit target) */}
            <div>
              <Link
                href="/collections/starter-kits"
                className="inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base hover:text-[#F0C4A0] transition-colors py-3 px-1 min-h-[44px] rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D]"
              >
                <span>Shop all starter kits</span>
                <ArrowRight className="w-4 h-4 text-[#F0C4A0]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Panel "In every box" with 5 icon rows */}
          <div className="lg:w-[360px] shrink-0 bg-[#1A4533] p-5 sm:p-6 rounded-[20px] border border-[#235841]">
            <h3 className="font-serif font-bold text-base sm:text-lg text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8FAE7E]" aria-hidden="true" />
              <span>In every box</span>
            </h3>

            <ul className="space-y-3.5" role="list">
              {inEveryBoxItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.title} className="flex items-center gap-3 text-sm text-[#D5DFD2]">
                    <div className="w-8 h-8 rounded-full bg-[#153F2D] border border-[#2B684F] flex items-center justify-center shrink-0 text-[#F0C4A0]">
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-[13.5px] leading-snug">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 2. Card row: 2 cards, centered, max width constrained for balanced sizing */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {STARTER_KITS_DATA.map((kit, index) => (
            <MotionRevealCard
              key={kit.id}
              index={index}
              className="bg-white text-[#1E2B24] rounded-[20px] border border-[#DCD5C1] shadow-lg flex flex-col justify-between overflow-hidden group max-w-[440px] mx-auto w-full"
            >
              <div>
                {/* Art area with 3:2 ratio / image and pills (place, level) */}
                <div className="relative">
                  <KitArt
                    slug={kit.slug}
                    image={kit.image}
                    imageAlt={kit.imageAlt}
                  />

                  {/* Pills overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#153F2D]/90 text-white backdrop-blur-xs border border-white/20 shadow-xs">
                      {kit.place}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#F6F3E8] text-[#1E2B24] border border-[#DCD5C1] shadow-xs">
                      {kit.level}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6">
                  {/* Name (h3) */}
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E2B24] leading-snug">
                    {kit.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#46544B] mt-2 leading-relaxed">
                    {kit.description}
                  </p>

                  {/* "Inside the kit" chips (seed chips first, then extras) */}
                  <div className="mt-4 pt-3.5 border-t border-[#E8E2D1]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#46544B] block mb-2">
                      Inside the kit
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {/* Seed chips */}
                      {kit.seeds.map((seed) =>
                        seed.isPlaceholder ? (
                          <span
                            key={seed.name}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 border-dashed border-[#8FAE7E] bg-transparent text-[#1B4A35]"
                            title="Placeholder variety (Pending catalog confirmation)"
                          >
                            {seed.name}
                          </span>
                        ) : (
                          <span
                            key={seed.name}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E4EEDD] text-[#1B4A35]"
                          >
                            {seed.name}
                          </span>
                        )
                      )}

                      {/* Extras chips */}
                      {kit.extras.map((extra) =>
                        extra.isPlaceholder ? (
                          <span
                            key={extra.name}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 border-dashed border-[#B7C6B5] bg-transparent text-[#3C4A41]"
                          >
                            {extra.name}
                          </span>
                        ) : (
                          <span
                            key={extra.name}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F1EFE6] text-[#3C4A41]"
                          >
                            {extra.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Divider, price with "per kit", then "Add to cart" button and "View kit details" link */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="pt-3.5 border-t border-[#E8E2D1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Price with "per kit" */}
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E2B24]">
                        {formatKitPrice(kit.pricePaise)}
                      </span>
                      <span className="text-xs text-[#46544B] font-medium">per kit</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <AddToCartButton
                      kitId={kit.variantId || kit.slug}
                      kitName={kit.name}
                      pricePaise={kit.pricePaise}
                    />

                    <Link
                      href={`/products/${kit.slug}`}
                      className="min-h-[44px] px-2.5 inline-flex items-center text-xs sm:text-sm font-semibold text-[#1E2B24] hover:text-[#A65A3A] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#153F2D] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#FFFFFF]"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </MotionRevealCard>
          ))}
        </div>

      </div>
    </section>
  );
}

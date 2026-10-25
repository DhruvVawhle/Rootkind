"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { STARTER_KITS_DATA, formatKitPrice } from "@/lib/kits";
import { KitArt } from "@/components/storefront/kit-art";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { DustCanvas } from "@/components/DustCanvas";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import {
  ArrowRight,
  Sprout,
  CircleDot,
  ShoppingBag,
  Tag,
  BookOpen,
} from "lucide-react";

export function StarterKitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(isReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;

    const ctx = gsap.context(() => {
      // 1. Panel background morphs from sage to forest & scales up with rounded corners
      gsap.fromTo(
        panel,
        {
          backgroundColor: "#7D9565",
          scale: 0.94,
          borderRadius: "16px",
        },
        {
          backgroundColor: "#153F2D",
          scale: 1,
          borderRadius: "28px",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.5,
          },
        }
      );

      // 2. The two kit cards rise with slight tilt
      const cards = [card0Ref.current, card1Ref.current].filter(Boolean);
      cards.forEach((card, i) => {
        const tilt = i === 0 ? -2.2 : 2.2;
        gsap.fromTo(
          card,
          {
            y: 48,
            rotation: tilt,
            opacity: 0,
          },
          {
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // 3. Kit images wipe in with clip-path
        const imgContainer = card?.querySelector(".kit-image-wrapper");
        if (imgContainer) {
          gsap.fromTo(
            imgContainer,
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.0,
              ease: "power3.inOut",
              delay: 0.2 + i * 0.15,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const inEveryBoxItems = [
    { title: "Certified heirloom seeds", icon: Sprout },
    { title: "Expanding organic cocopeat discs", icon: CircleDot },
    { title: "Breathable fabric planters", icon: ShoppingBag },
    { title: "Plant markers", icon: Tag },
    { title: "Day-by-day care guide", icon: BookOpen },
  ];

  return (
    <section
      ref={sectionRef}
      id="starter-kits"
      aria-labelledby="starter-kits-heading"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 overflow-hidden"
    >
      {/* Outer morphing forest container with DustCanvas */}
      <div
        ref={panelRef}
        className="relative bg-[#153F2D] text-[#D5DFD2] rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 lg:p-12 shadow-xl border border-[#1E523A] overflow-hidden will-change-transform will-change-[background-color]"
      >
        {/* Dust Canvas: 34 specks + mouse ripple rings */}
        <DustCanvas className="z-0" />

        {/* 1. Header row */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#1E523A]">
          {/* Left Column */}
          <div className="max-w-2xl">
            <span className="text-[#F0C4A0] text-xs sm:text-sm font-semibold uppercase tracking-wider block mb-2">
              Starter kits
            </span>

            <h2
              id="starter-kits-heading"
              className="font-serif font-bold text-white leading-[1.12] mb-4 text-[clamp(2rem,4.5vw,3.25rem)]"
            >
              Everything in one box. <br />
              From seed to harvest.
            </h2>

            <p className="text-[#D5DFD2] text-base sm:text-lg leading-relaxed max-w-xl mb-6">
              Each guided kit is made for beginners and compact urban balconies, with a day-by-day care guide so you always know the next step.
            </p>

            <div>
              <Link
                href="/collections/starter-kits"
                className="btn inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base hover:text-[#F0C4A0] transition-colors py-3 px-1 min-h-[44px] rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0C4A0] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#153F2D]"
              >
                <span>Shop all starter kits</span>
                <ArrowRight className="w-4 h-4 text-[#F0C4A0]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Panel "In every box" */}
          <div className="lg:w-[360px] shrink-0 bg-[#1A4533]/90 backdrop-blur-xs p-5 sm:p-6 rounded-[20px] border border-[#235841]">
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

        {/* 2. Card row: 2 cards with tilt and wipe-in images */}
        <div className="relative z-10 mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {STARTER_KITS_DATA.map((kit, index) => (
            <div
              key={kit.id}
              ref={index === 0 ? card0Ref : card1Ref}
              className="bg-white text-[#1E2B24] rounded-[20px] border border-[#DCD5C1] shadow-lg flex flex-col justify-between overflow-hidden group max-w-[440px] mx-auto w-full will-change-transform"
            >
              <div>
                {/* Art area with clip-path wipe animation */}
                <div className="relative kit-image-wrapper will-change-[clip-path]">
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
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E2B24] leading-snug">
                    {kit.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#46544B] mt-2 leading-relaxed">
                    {kit.description}
                  </p>

                  {/* Inside the kit chips */}
                  <div className="mt-4 pt-3.5 border-t border-[#E8E2D1]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#46544B] block mb-2">
                      Inside the kit
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {kit.seeds.map((seed) => (
                        <span
                          key={seed.name}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E4EEDD] text-[#1B4A35]"
                        >
                          {seed.name}
                        </span>
                      ))}

                      {kit.extras.map((extra) => (
                        <span
                          key={extra.name}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F1EFE6] text-[#3C4A41]"
                        >
                          {extra.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="pt-3.5 border-t border-[#E8E2D1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E2B24]">
                        {formatKitPrice(kit.pricePaise)}
                      </span>
                      <span className="text-xs text-[#46544B] font-medium">per kit</span>
                    </div>
                  </div>

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

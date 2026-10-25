import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Vine } from "@/components/motion/Vine";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import {
  EditorialHero,
  SeedPhilosophySection,
  SoilSection,
  HarvestPromiseSection,
  BotanicalCommitmentsSection,
  AboutCtaSection,
} from "@/components/about/AboutAnimatedSections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Rootkind Botanical Heritage",
  description:
    "Rootkind was founded with a single mission: to empower urban families to grow their own organic vegetables, herbs, and fruits at home.",
};

export default function AboutPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA] relative">
        {/* Vine drawing on scroll (wide screens >=1280px) */}
        <Vine />

        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-20 overflow-x-clip">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
            
            {/* 1. EDITORIAL HERO (WordReveal headline + faded intro) */}
            <EditorialHero />

            {/* 2. HERO FEATURE PHOTOGRAPHY: BALCONY SANCTUARY */}
            <div className="relative rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8]">
              <ParallaxImage
                src="/images/about/balcony-sanctuary.jpg"
                alt="Sunlit Indian apartment balcony garden with terracotta pots growing heirloom tomatoes, basil, mint, and a brass watering can"
                containerClassName="w-full h-[360px] sm:h-[500px]"
                priority
                clipDirection="left"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white p-4 sm:p-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
                <div>
                  <p className="font-serif text-sm sm:text-base font-semibold text-[#F7F4EA]">
                    The Urban Balcony Sanctuary — Indiranagar, Bengaluru
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">
                    Grown entirely with Rootkind non-GMO heirloom seeds, living organic soil, and aerated planters.
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-[#7D9565] bg-white/10 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
                  Spring Trial 2026
                </span>
              </div>
            </div>

            {/* 3. STORY SECTION 1: THE SEED REVOLUTION */}
            <SeedPhilosophySection />

            {/* 4. STORY SECTION 2: LIVING SOILS, NEVER PEAT MOSS */}
            <SoilSection />

            {/* 5. THE HARVEST PROMISE: HARVEST BASKET SHOWCASE (88% -> 100% scale scrub) */}
            <HarvestPromiseSection />

            {/* 6. THE 4 BOTANICAL COMMITMENTS (Staggered rise + icon spring pop) */}
            <BotanicalCommitmentsSection />

            {/* 7. BOTTOM CALL TO ACTION (Magnetic buttons + arrow nudge) */}
            <AboutCtaSection />

          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}

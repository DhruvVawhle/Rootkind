"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { WordReveal } from "@/components/motion/WordReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CountUp } from "@/components/motion/CountUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import {
  Sprout,
  Heart,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Sparkles,
  Sun,
  Droplet,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* 1. Editorial Hero                                                          */
/* -------------------------------------------------------------------------- */
export function EditorialHero() {
  const introRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const el = introRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.5,
          ease: "power3.out",
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="text-center max-w-3xl mx-auto space-y-5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#153F2D]/10 text-[#153F2D] text-xs font-semibold uppercase tracking-wider">
        <Sprout className="w-3.5 h-3.5 text-[#7D9565]" />
        Rootkind Heritage &amp; Nursery — Bengaluru
      </span>

      <WordReveal
        text="Reconnecting Indian homes with the living earth."
        as="h1"
        className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#153F2D] leading-[1.15] tracking-tight justify-center text-center"
        delay={0.1}
      />

      <p
        ref={introRef}
        className="text-base sm:text-lg text-[#5A5E53] leading-relaxed max-w-2xl mx-auto font-normal will-change-[opacity,transform]"
      >
        We believe that growing food at home is one of the most rewarding acts of
        everyday mindfulness. From compact apartment balconies to sunlit
        terraces, our botanical goods ensure your first seed becomes your first
        delicious harvest.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Seed Philosophy Section                                                 */
/* -------------------------------------------------------------------------- */
export function SeedPhilosophySection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const el = textRef.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 860;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: isMobile ? 0 : 48,
          y: isMobile ? 36 : 0,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
      {/* Image on left (or first on mobile) */}
      <div className="md:col-span-6 w-full">
        <ParallaxImage
          src="/images/about/heirloom-seeds.jpg"
          alt="Hands of a botanist carefully sorting diverse non-GMO heirloom seeds into a kraft paper envelope on a wooden potting bench"
          containerClassName="w-full h-[320px] sm:h-[400px] border border-[#DCD5C1] shadow-md bg-[#EDE7D8]"
          clipDirection="left"
        />
      </div>

      {/* Text slides in from the right on desktop, rises on mobile */}
      <div
        ref={textRef}
        className="md:col-span-6 space-y-4 text-xs sm:text-sm text-[#5A5E53] leading-relaxed will-change-transform"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
          Our Seed Philosophy
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] leading-snug">
          Saving Flavor and Genetic Diversity, One Seed at a Time
        </h2>
        <p>
          Most commercial seed packets sold in garden centers are bred for
          industrial monoculture—prioritizing mechanical harvest and extended
          supermarket shelf life over true aroma, nutritional density, and home
          container adaptability.
        </p>
        <p>
          Rootkind was founded to preserve authentic heirloom lineages. We
          partner directly with organic seed keepers across Karnataka,
          Maharashtra, and Himachal Pradesh to preserve open-pollinated seeds that
          have naturally adapted over generations to thrive in warm balconies and
          variable Indian weather.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#153F2D]">
          <span className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#C87855]" />
            Full Sun Tolerance
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#7D9565]" />
            <CountUp end={85} suffix="%+ Verified Germination" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Soil Section                                                            */
/* -------------------------------------------------------------------------- */
export function SoilSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const el = textRef.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 860;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: isMobile ? 0 : -48,
          y: isMobile ? 36 : 0,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
      {/* On mobile <=860px: image comes first (order-1), text comes second (order-2) */}
      <div className="md:col-span-6 order-1 md:order-2 w-full">
        <ParallaxImage
          src="/images/about/living-soil.jpg"
          alt="Cupped hands holding rich dark organic living potting mix with emerging healthy green seedlings"
          containerClassName="w-full h-[320px] sm:h-[400px] border border-[#DCD5C1] shadow-md bg-[#EDE7D8]"
          clipDirection="bottom"
        />
      </div>

      {/* Text on left on desktop, rises on mobile */}
      <div
        ref={textRef}
        className="md:col-span-6 order-2 md:order-1 space-y-4 text-xs sm:text-sm text-[#5A5E53] leading-relaxed will-change-transform"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
          Microbial Soil Health
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] leading-snug">
          Living Organic Earth, Zero Peat Moss
        </h2>
        <p>
          Plants do not feed directly on synthetic chemical salts; they feed on
          the rich symbiotic relationships between roots, beneficial mycorrhizal
          fungi, and organic humus.
        </p>
        <p>
          Unlike mass-market potting soils that strip ancient carbon-storing peat
          bogs, our living potting mixes are formulated with washed coconut coir,
          double-sieved organic vermicompost, neem seed meal, and active
          endo-mycorrhizae. The result is a featherlight, highly aerated growing
          medium that never compacts in containers.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#153F2D]">
          <span className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-[#7D9565]" />
            100% Peat-Free Formula
          </span>
          <span className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-[#153F2D]" />
            Optimal Water Retention
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Harvest Promise Section (Scale 88% -> 100%, Radius 28px -> 14px)       */
/* -------------------------------------------------------------------------- */
export function HarvestPromiseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const container = containerRef.current;
    const frame = imageFrameRef.current;
    const text = textRef.current;
    if (!container || !frame || !text) return;

    const ctx = gsap.context(() => {
      // Scrub image scale 88% -> 100% and border-radius 28px -> 14px
      gsap.fromTo(
        frame,
        { scale: 0.88, borderRadius: "28px" },
        {
          scale: 1,
          borderRadius: "14px",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "center center",
            scrub: true,
          },
        }
      );

      // Text rises and fades in
      gsap.fromTo(
        text,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full py-4 overflow-hidden">
      {/* Never combine aspect-ratio with min-height */}
      <div
        ref={imageFrameRef}
        className="relative w-full min-h-[460px] sm:min-h-[520px] overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8] will-change-[transform,border-radius]"
        style={{ borderRadius: "28px" }}
      >
        <Image
          src="/images/about/harvest-basket.jpg"
          alt="Handwoven wicker harvest basket overflowing with fresh homegrown tomatoes, emerald okra, radishes, and mint in warm evening light"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div
          ref={textRef}
          className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white max-w-xl will-change-transform"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D9565] mb-2 block">
            The Harvest Promise
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            From your first seed to your first fresh harvest.
          </h3>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            There is no taste in the world quite like a sun-ripened Desi Pusa
            Ruby tomato or tender Indian bhindi plucked directly from your
            balcony thirty seconds before dinner.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Botanical Commitments Card                                              */
/* -------------------------------------------------------------------------- */
export function BotanicalCommitmentsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".commitment-item");
    const icons = container.querySelectorAll(".commitment-icon");

    const ctx = gsap.context(() => {
      // Four items rise in with a stagger
      gsap.fromTo(
        items,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Each icon pops with a spring
      gsap.fromTo(
        icons,
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(2)",
          delay: 0.15,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border border-[#DCD5C1] p-6 sm:p-12 shadow-sm space-y-8"
    >
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
          Our Standards
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#153F2D] mt-1">
          Our Botanical Commitments
        </h2>
        <p className="text-xs sm:text-sm text-[#5A5E53] mt-2">
          Every product bearing the Rootkind name adheres to our four core
          quality pillars.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
        <div className="commitment-item flex gap-4 will-change-transform">
          <div className="commitment-icon w-10 h-10 rounded-full bg-[#153F2D] text-[#7D9565] flex items-center justify-center shrink-0 will-change-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
              100% Non-GMO &amp; Open Pollinated
            </h3>
            <p className="text-[#5A5E53] leading-relaxed">
              You can save seeds from your own harvest and replant them next
              season. We never touch genetically modified or terminator seed
              lines.
            </p>
          </div>
        </div>

        <div className="commitment-item flex gap-4 will-change-transform">
          <div className="commitment-icon w-10 h-10 rounded-full bg-[#7D9565]/20 text-[#7D9565] flex items-center justify-center shrink-0 will-change-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
              Living Soil, Zero Peat Moss
            </h3>
            <p className="text-[#5A5E53] leading-relaxed">
              We never harvest ancient carbon-storing peat bogs. Our potting
              mixes utilize washed coconut coir, aged vermicompost, and beneficial
              mycorrhizae.
            </p>
          </div>
        </div>

        <div className="commitment-item flex gap-4 will-change-transform">
          <div className="commitment-icon w-10 h-10 rounded-full bg-[#C87855]/20 text-[#C87855] flex items-center justify-center shrink-0 will-change-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
              Guaranteed Germination Support
            </h3>
            <p className="text-[#5A5E53] leading-relaxed">
              Growing for the first time can feel uncertain. If your seeds fail to
              sprout with our guide, we send replacement packets free of charge.
            </p>
          </div>
        </div>

        <div className="commitment-item flex gap-4 will-change-transform">
          <div className="commitment-icon w-10 h-10 rounded-full bg-[#153F2D]/10 text-[#153F2D] flex items-center justify-center shrink-0 will-change-transform">
            <Heart className="w-5 h-5 text-[#C87855]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
              Plastic-Free Deliveries
            </h3>
            <p className="text-[#5A5E53] leading-relaxed">
              All parcels leave our nursery in 100% recyclable, compostable paper
              and corrugated cardboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Final CTA with Magnetic Buttons and Arrow Nudge                         */
/* -------------------------------------------------------------------------- */
export function AboutCtaSection() {
  return (
    <div className="text-center pt-4 sm:pt-8 space-y-4">
      <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
        Ready to plant your first seed?
      </h2>
      <p className="text-sm text-[#5A5E53] max-w-md mx-auto">
        Explore our curated collection of heirloom seeds, organic potting soils,
        and guided balcony kits.
      </p>

      {/* Full-width stacked buttons on mobile */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
        <MagneticButton className="w-full sm:w-auto" strength={0.35}>
          <Link
            href="/shop"
            className="group btn inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-lg bg-[#153F2D] text-[#F7F4EA] font-semibold text-sm hover:bg-[#1C523B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
          >
            <span>Explore the Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </MagneticButton>

        <MagneticButton className="w-full sm:w-auto" strength={0.35}>
          <Link
            href="/collections/starter-kits"
            className="group btn inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-lg bg-white border border-[#153F2D] text-[#153F2D] font-semibold text-sm hover:bg-[#EDE7D8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
          >
            <span>View Beginner Kits</span>
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}

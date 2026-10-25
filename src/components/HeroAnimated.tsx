"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface HeroAnimatedProps {
  featuredKitSlug: string;
  featuredKitName: string;
}

export function HeroAnimated({
  featuredKitSlug,
  featuredKitName,
}: HeroAnimatedProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLUListElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      // 1. Split text reveal & stagger fade
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        [headlineLine1Ref.current, headlineLine2Ref.current],
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.12, delay: 0.05 }
      )
        .fromTo(
          copyRef.current,
          { y: 20 },
          { y: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          buttonsRef.current,
          { y: 20 },
          { y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          trustRef.current,
          { y: 20 },
          { y: 0, duration: 0.5 },
          "-=0.3"
        );

      // 2. Clip-path reveal on hero image
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.inOut",
            delay: 0.2,
          }
        );
      }

      // 3. Scroll-triggered parallax: Leaf 1 (-9%), Leaf 2 (-20%), Image (+14%)
      if (leaf1Ref.current) {
        gsap.to(leaf1Ref.current, {
          yPercent: -9,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (leaf2Ref.current) {
        gsap.to(leaf2Ref.current, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (imageElementRef.current) {
        gsap.to(imageElementRef.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, hero);

    // 4. Mouse movement parallax shift for foreground leaves
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / innerHeight - 0.5) * 2;

      if (leaf1Ref.current) {
        gsap.to(leaf1Ref.current, {
          x: mouseX * 18,
          y: mouseY * 14,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (leaf2Ref.current) {
        gsap.to(leaf2Ref.current, {
          x: mouseX * -24,
          y: mouseY * -18,
          duration: 1.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#F7F4EA] border-b border-[#DCD5C1] py-12 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Supporting text, CTAs, Trust List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Split Text Revealed Headline */}
            <h1 className="font-serif text-3.5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#153F2D] leading-[1.12]">
              <span className="block overflow-hidden py-1">
                <span
                  ref={headlineLine1Ref}
                  className="block will-change-transform"
                >
                  Grow good things
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span
                  ref={headlineLine2Ref}
                  className="block will-change-transform"
                >
                  at home.
                </span>
              </span>
            </h1>

            {/* Supporting paragraph with inline link to beginner kits */}
            <div ref={copyRef} className="will-change-transform">
              <p className="text-base sm:text-lg text-[#464A40] max-w-xl leading-relaxed">
                Everything you need to grow your own vegetables, herbs and fruits,
                from your first seed to your first harvest. Certified organic seeds, living soils, and thoughtfully designed{" "}
                <Link
                  href="/collections/starter-kits"
                  className="underline underline-offset-4 font-semibold text-[#153F2D] hover:text-[#9A4F2E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                >
                  beginner kits
                </Link>{" "}
                crafted for compact balconies and home windowsills.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center gap-4 pt-2 will-change-transform"
            >
              <Button
                variant="default"
                size="lg"
                className="btn bg-[#153F2D] text-[#F7F4EA] hover:bg-[#1C523B] font-semibold px-7 py-3 min-h-[48px] rounded-md shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/shop" className="gap-2">
                  <span>Explore the catalogue</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="btn border-2 border-[#153F2D] text-[#153F2D] bg-transparent hover:bg-[#153F2D] hover:text-[#F7F4EA] font-semibold px-7 py-3 min-h-[48px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/collections/starter-kits">
                  View beginner kits
                </Link>
              </Button>
            </div>

            {/* Trust List */}
            <ul
              ref={trustRef}
              className="pt-6 border-t border-[#DCD5C1] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm text-[#282B25] font-medium will-change-transform"
            >
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                <span>85%+ Tested Germination</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                <span>Kits Sized for Balconies</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7D9565] shrink-0" aria-hidden="true" />
                <span>Free Delivery &gt; ₹999</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Hero Visual with clip-path reveal and 2 leaf parallax layers */}
          <div className="lg:col-span-5 relative">
            <div
              ref={imageWrapperRef}
              className="relative aspect-[4/4.5] sm:aspect-[4/5] w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8] group will-change-[clip-path]"
            >
              {/* Scalable and parallax-shifting inner image */}
              <div
                ref={imageElementRef}
                className="absolute inset-0 w-full h-full scale-110 will-change-transform"
              >
                <Image
                  src="/images/about/balcony-sanctuary.jpg"
                  alt="Sunlit urban home balcony garden featuring heirloom tomatoes, fragrant sweet basil, and terracotta planters on a wooden deck"
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* Foreground Leaf Layer 1: Top-Right Monstera Leaf (-9% scroll speed + mouse shift) */}
              <div
                ref={leaf1Ref}
                className="absolute -top-6 -right-6 w-32 h-32 sm:w-40 sm:h-40 pointer-events-none z-20 drop-shadow-2xl will-change-transform opacity-95"
                aria-hidden="true"
              >
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path
                    d="M20,80 C30,50 60,30 90,10 C85,35 70,65 40,85 C32,88 25,85 20,80 Z"
                    fill="#153F2D"
                    fillOpacity="0.88"
                  />
                  <path
                    d="M35,65 C45,45 65,30 85,20 C80,38 68,55 48,70 Z"
                    fill="#7D9565"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M20,80 Q55,48 90,10"
                    stroke="#F7F4EA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M45,55 Q60,52 70,60"
                    stroke="#F7F4EA"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                  <path
                    d="M58,42 Q72,38 80,45"
                    stroke="#F7F4EA"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>

              {/* Foreground Leaf Layer 2: Bottom-Left Sage Vine Leaf (-20% scroll speed + mouse shift) */}
              <div
                ref={leaf2Ref}
                className="absolute -bottom-8 -left-8 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none z-20 drop-shadow-2xl will-change-transform opacity-95"
                aria-hidden="true"
              >
                <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                  <path
                    d="M85,20 C60,40 30,70 15,105 C35,95 65,80 95,50 C100,40 95,28 85,20 Z"
                    fill="#1E523A"
                    fillOpacity="0.9"
                  />
                  <path
                    d="M70,35 C50,52 32,75 22,95 C38,85 58,70 78,50 Z"
                    fill="#7D9565"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M85,20 Q48,65 15,105"
                    stroke="#F7F4EA"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M55,55 Q42,58 35,70"
                    stroke="#F7F4EA"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                  <path
                    d="M40,72 Q30,76 25,88"
                    stroke="#F7F4EA"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>

              {/* Subtle ambient bottom gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10"
                aria-hidden="true"
              />

              {/* Floating Frosted Glass Label */}
              <Link
                href={`/products/${featuredKitSlug}`}
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-black/45 backdrop-blur-md border border-white/25 text-white p-4 sm:p-5 rounded-xl shadow-lg hover:bg-black/60 transition-all flex items-center justify-between gap-3 group/kit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-20"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7D9565] block font-semibold">
                    Featured Growing Kit
                  </span>
                  <p className="font-serif text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                    {featuredKitName}
                  </p>
                  <p className="text-xs text-white/80 mt-0.5 hidden sm:block">
                    Complete 4-crop heirloom setup with expanding coir planters
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-white/90 shrink-0 group-hover/kit:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

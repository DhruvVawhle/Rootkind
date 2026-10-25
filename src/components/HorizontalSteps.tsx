"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Sprout, Droplets, Sun, Scissors, Sparkles } from "lucide-react";

interface StepPanel {
  step: string;
  title: string;
  text: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
}

const STEPS: StepPanel[] = [
  {
    step: "01",
    title: "Sow",
    text: "Tuck your organic heirloom seeds into damp, aerated coir at twice their diameter.",
    icon: Sprout,
    gradient: "from-[#153F2D]/95 via-[#1F543C]/90 to-[#153F2D]",
    badge: "Day 1–3",
  },
  {
    step: "02",
    title: "Water",
    text: "Mist gently each morning, keeping moisture steady while the deep taproot awakens.",
    icon: Droplets,
    gradient: "from-[#1C4E3A]/95 via-[#276B50]/90 to-[#153F2D]",
    badge: "Daily Ritual",
  },
  {
    step: "03",
    title: "Sun",
    text: "Provide five to six hours of gentle balcony sunlight as green shoots reach outward.",
    icon: Sun,
    gradient: "from-[#354B2A]/95 via-[#506C3E]/90 to-[#1E3E2B]",
    badge: "5+ Hours Light",
  },
  {
    step: "04",
    title: "Harvest",
    text: "Snip tender leaves and vine-ripened fruit at peak flavor right onto your kitchen plate.",
    icon: Scissors,
    gradient: "from-[#4A3025]/95 via-[#684333]/90 to-[#241A15]",
    badge: "First Harvest",
  },
];

export function HorizontalSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

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

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Use gsap.context for complete cleanup and zero memory/trigger leaks
    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        const scrollWidth = track.scrollWidth;
        const clientWidth = window.innerWidth;
        return Math.max(scrollWidth - clientWidth, 0);
      };

      const xDist = getScrollDistance();
      if (xDist <= 0) return;

      const panels = track.querySelectorAll<HTMLElement>(".step-panel");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: "top top",
          end: () => `+=${Math.max(getScrollDistance() + 400, 1500)}`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${p})`;
            }

            // Approximate which card is centered (0 is intro, 1-4 are steps)
            const stepIdx = Math.min(Math.floor(p * 4.99), 4);
            setActiveStepIndex(stepIdx);
          },
        },
      });

      // Smooth horizontal travel
      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      // Subtle scale and depth enhancement as cards pass
      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { scale: 0.94, opacity: 0.75 },
          {
            scale: 1,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: "left 85%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    }, container);

    // Ensure layout and all preceding pin heights are calculated
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isReducedMotion]);

  return (
    <div className="relative w-full">
      <section
        ref={containerRef}
      className={`relative w-full bg-[#153F2D] text-[#F7F4EA] overflow-hidden ${
        isReducedMotion ? "py-16 sm:py-24" : "h-screen h-[100svh]"
      }`}
      aria-label="Four steps to your first harvest"
    >
      {/* Ambient botanical background lighting */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7D9565]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C87855]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {isReducedMotion ? (
        /* Reduced motion: native scroll-snap cards */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-[#C87855] font-semibold">
              The Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 text-[#F7F4EA]">
              Four steps to your first harvest
            </h2>
            <p className="text-sm sm:text-base text-[#D5DFD2] mt-3 max-w-xl">
              From day one in living soil to your kitchen plate. Follow our guided process.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 focus:outline-none">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className={`snap-center shrink-0 w-[85vw] max-w-sm rounded-3xl p-8 border border-white/15 bg-gradient-to-br ${s.gradient} relative shadow-xl`}
              >
                <span className="text-6xl font-serif font-black text-white/10 absolute top-4 right-6 select-none">
                  {s.step}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C87855] bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  {s.badge}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-6">{s.title}</h3>
                <p className="text-sm text-white/85 mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Animated GSAP Horizontal Pinned Showcase */
        <div className="h-full flex flex-col justify-center">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-10 lg:gap-12 pl-6 sm:pl-16 lg:pl-24 pr-16 sm:pr-32 lg:pr-48 will-change-transform"
          >
            {/* Intro Lead Card */}
            <div className="shrink-0 w-[88vw] sm:w-[480px] lg:w-[520px] h-[480px] sm:h-[530px] rounded-3xl p-8 sm:p-12 border border-white/20 bg-white/[0.06] backdrop-blur-md flex flex-col justify-between shadow-2xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C87855]/20 border border-[#C87855]/40 text-[#C87855] text-xs font-semibold tracking-wider uppercase mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Botanical Ritual</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[#F7F4EA]">
                  Four steps to your first harvest
                </h2>
                <p className="text-sm sm:text-base text-[#D5DFD2] mt-4 leading-relaxed">
                  Cultivating clean food at home is a simple, rhythmic practice. We design each kit so beginners never have to guess.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#F7F4EA]/80">
                <span className="inline-block w-8 h-[2px] bg-[#C87855]" />
                <span className="tracking-wide">Scroll to follow the process</span>
              </div>
            </div>

            {/* 4 Large Editorial Step Panels */}
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`step-panel shrink-0 w-[88vw] sm:w-[460px] lg:w-[500px] h-[480px] sm:h-[530px] rounded-3xl p-8 sm:p-12 border border-white/20 bg-gradient-to-br ${step.gradient} flex flex-col justify-between relative shadow-2xl overflow-hidden backdrop-blur-sm`}
                >
                  {/* Large Faded Step Number in Background */}
                  <span
                    className="absolute -right-3 -bottom-5 font-serif font-black text-[130px] sm:text-[180px] leading-none text-white/10 pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {step.step}
                  </span>

                  {/* Top Bar: Icon and Badge */}
                  <div className="flex items-center justify-between z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center text-[#F7F4EA] shadow-lg">
                      <Icon className="w-7 h-7 text-[#C87855]" />
                    </div>
                    <span className="text-xs uppercase font-semibold tracking-wider text-[#F7F4EA] bg-black/40 px-4 py-1.5 rounded-full border border-white/15 shadow">
                      {step.badge}
                    </span>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="z-10 mt-auto">
                    <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C87855] block mb-2">
                      Step {step.step}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-sm">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Progress Bar & Step Dots Indicator */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-16 sm:right-16 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((idx) => (
                <span
                  key={idx}
                  className={`block rounded-full transition-all duration-300 ${
                    activeStepIndex === idx
                      ? "w-6 h-1.5 bg-[#C87855]"
                      : "w-1.5 h-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <div className="w-36 sm:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full w-full bg-[#C87855] origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  </div>
  );
}

export default HorizontalSteps;

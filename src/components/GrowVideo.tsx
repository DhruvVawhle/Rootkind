"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface CaptionItem {
  id: string;
  stage: string;
  title: string;
  fullCaption: string;
  description: string;
}

const CAPTIONS: CaptionItem[] = [
  {
    id: "stage-1",
    stage: "Day 1",
    title: "The seed",
    fullCaption: "Day 1 · The seed",
    description: "Sown in living organic soil, waiting for the first touch of moisture and warmth.",
  },
  {
    id: "stage-2",
    stage: "Week 2",
    title: "Roots take hold",
    fullCaption: "Week 2 · Roots take hold",
    description: "Delicate taproots anchor deep, drawing essential minerals and mycorrhizal life.",
  },
  {
    id: "stage-3",
    stage: "Week 6",
    title: "Reaching for light",
    fullCaption: "Week 6 · Reaching for light",
    description: "Vibrant foliage unfolds toward the sun, thriving in balcony and windowsill spaces.",
  },
  {
    id: "stage-4",
    stage: "Day 90",
    title: "First harvest",
    fullCaption: "Day 90 · First harvest",
    description: "Sun-ripened, organic produce harvested straight from seed to your kitchen table.",
  },
];

export function GrowVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let targetTime = 0;
    let curTime = 0;
    let lastTimestamp = performance.now();
    let rafId: number | null = null;
    let isCleanedUp = false;
    let isSeeking = false;
    let pendingTime: number | null = null;

    // Helper to calculate active caption stage from progress (0 to 1)
    const getStageFromProgress = (progress: number): number => {
      if (progress < 0.25) return 0;
      if (progress < 0.55) return 1;
      if (progress < 0.85) return 2;
      return 3;
    };

    // Non-blocking seek handler: prevents decoder stalls / pause feeling during scroll
    const seekVideo = (time: number) => {
      if (!video || !video.duration || isCleanedUp) return;
      const clamped = Math.max(0, Math.min(time, video.duration));

      if (isSeeking || video.seeking) {
        pendingTime = clamped;
      } else {
        isSeeking = true;
        try {
          if ("fastSeek" in video && typeof (video as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek === "function") {
            (video as HTMLVideoElement & { fastSeek: (t: number) => void }).fastSeek(clamped);
          } else {
            video.currentTime = clamped;
          }
        } catch {
          video.currentTime = clamped;
        }
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null && !isCleanedUp) {
        const nextTime = pendingTime;
        pendingTime = null;
        seekVideo(nextTime);
      }
    };

    video.addEventListener("seeked", handleSeeked);

    // Responsive animation frame loop with snappy damping (~20)
    const animate = (timestamp: number) => {
      if (isCleanedUp) return;

      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      const diff = targetTime - curTime;
      if (Math.abs(diff) > 0.001) {
        curTime += diff * (1 - Math.exp(-dt * 20));
        seekVideo(curTime);
      }

      rafId = requestAnimationFrame(animate);
    };

    let trigger: ScrollTrigger | null = null;

    const initScrollTrigger = () => {
      if (isCleanedUp) return;
      const duration = video.duration;
      if (!duration || isNaN(duration) || duration <= 0) return;

      lastTimestamp = performance.now();
      rafId = requestAnimationFrame(animate);

      trigger = ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: "top top",
        end: "+=300%",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          targetTime = progress * duration;

          if (progress > 0.02) {
            setHasScrolled(true);
          }

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }

          const stageIndex = getStageFromProgress(progress);
          setActiveStage((prev) => (prev !== stageIndex ? stageIndex : prev));
        },
      });

      // Refresh ScrollTrigger so all elements down the page get updated positions
      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) {
      initScrollTrigger();
    } else {
      video.addEventListener("loadedmetadata", initScrollTrigger, { once: true });
    }

    return () => {
      isCleanedUp = true;
      if (video) {
        video.removeEventListener("loadedmetadata", initScrollTrigger);
        video.removeEventListener("seeked", handleSeeked);
      }
      if (trigger) {
        trigger.kill(true);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isReducedMotion]);

  return (
    <div className="relative w-full">
      <section
        ref={containerRef}
        className="relative w-full h-screen h-[100svh] overflow-hidden bg-black select-none"
        aria-label="Botanical Growth Journey Video"
      >
      {/* Video element or Poster for reduced motion */}
      {isReducedMotion ? (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/rootkind-grow.jpg"
            alt="Rootkind growth journey from seed to harvest"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src="/rootkind-grow.mp4"
          poster="/rootkind-grow.jpg"
          muted
          playsInline
          preload="auto"
          autoPlay={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Cinematic Soft Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Subtle vignette radial gradient */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Stage indicators at top */}
      <div className="absolute top-6 sm:top-10 left-0 right-0 z-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#C87855]">
            Growth Cycle
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            {CAPTIONS.map((cap, idx) => (
              <div
                key={cap.id}
                className="flex items-center gap-1.5"
                aria-label={`Stage ${idx + 1}: ${cap.stage}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    activeStage === idx
                      ? "w-6 sm:w-8 h-1.5 bg-[#C87855]"
                      : activeStage > idx
                      ? "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#F7F4EA]/70"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Captions Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-8 text-center pointer-events-none">
        <div className="relative w-full max-w-3xl min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
          {CAPTIONS.map((caption, index) => {
            const isActive = activeStage === index;
            return (
              <div
                key={caption.id}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
                  isActive
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                {/* Stage Tag */}
                <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#C87855] mb-2 sm:mb-3 drop-shadow">
                  {caption.stage}
                </span>

                {/* Main Caption */}
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F7F4EA] tracking-tight leading-[1.15] drop-shadow-lg">
                  {caption.fullCaption}
                </h2>

                {/* Supporting descriptor */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#F7F4EA]/80 max-w-xl mx-auto font-sans leading-relaxed drop-shadow">
                  {caption.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Scroll to play" hint */}
      <div
        className={`absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-all duration-500 ease-out ${
          hasScrolled || isReducedMotion
            ? "opacity-0 translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        aria-hidden={hasScrolled || isReducedMotion}
      >
        <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#F7F4EA] shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#C87855] animate-ping" />
          <span>Scroll to play</span>
        </div>
      </div>

      {/* Terracotta progress bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-white/15 z-30 overflow-hidden"
        role="progressbar"
        aria-label="Video playback progress"
        aria-valuenow={Math.round((activeStage / 3) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          ref={progressBarRef}
          className="h-full w-full bg-[#C87855] origin-left will-change-transform shadow-[0_0_8px_rgba(200,120,85,0.7)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  </div>
  );
}

export default GrowVideo;

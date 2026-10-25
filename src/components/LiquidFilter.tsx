"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function LiquidFilterDefs() {
  return (
    <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none -z-50" aria-hidden="true">
      <defs>
        <filter id="liquid-hover-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            id="liquid-turbulence-el"
            type="fractalNoise"
            baseFrequency="0.035 0.035"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            id="liquid-displacement-el"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Hook to apply liquid turbulence displacement hover animation to a ref.
 */
export function useLiquidHover(targetRef: React.RefObject<HTMLElement | null>) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
    const target = targetRef.current;
    if (!target) return;

    const dispMap = document.getElementById("liquid-displacement-el");
    if (!dispMap) return;

    let tween: gsap.core.Tween | null = null;

    const handleMouseEnter = () => {
      // Apply the SVG filter
      target.style.filter = "url(#liquid-hover-filter)";
      // Animate displacement scale from 0 to ~28
      tween = gsap.to(dispMap, {
        attr: { scale: 28 },
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      tween = gsap.to(dispMap, {
        attr: { scale: 0 },
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          target.style.filter = "none";
        },
      });
    };

    target.addEventListener("mouseenter", handleMouseEnter);
    target.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      target.removeEventListener("mouseenter", handleMouseEnter);
      target.removeEventListener("mouseleave", handleMouseLeave);
      target.style.filter = "none";
      if (tween) tween.kill();
    };
  }, [targetRef, isReducedMotion]);
}

interface LiquidFilterProps {
  children: React.ReactNode;
  className?: string;
}

export function LiquidFilter({ children, className = "" }: LiquidFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLiquidHover(containerRef);

  return (
    <div ref={containerRef} className={`relative will-change-[filter] ${className}`}>
      {children}
    </div>
  );
}

export default LiquidFilter;

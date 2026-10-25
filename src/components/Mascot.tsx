"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { useCartStore } from "@/store/cart";

export function Mascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const potRef = useRef<SVGGElement>(null);

  const lastAddedTimestamp = useCartStore((s) => s.lastAddedTimestamp);
  const [isLookingDown, setIsLookingDown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(isReducedMotion());
  }, []);

  // Handle Add to Cart bounce and look down for ~900ms
  useEffect(() => {
    if (!lastAddedTimestamp || reduced) return;

    setIsLookingDown(true);

    const pot = potRef.current;
    if (pot) {
      // Bounce animation
      gsap.timeline()
        .to(pot, { y: -16, duration: 0.18, ease: "power2.out" })
        .to(pot, { y: 0, duration: 0.72, ease: "bounce.out" });
    }

    // Force pupils to look straight down
    if (leftPupilRef.current && rightPupilRef.current) {
      gsap.to([leftPupilRef.current, rightPupilRef.current], {
        x: 0,
        y: 3.2,
        duration: 0.2,
        overwrite: "auto",
      });
    }

    const timer = setTimeout(() => {
      setIsLookingDown(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [lastAddedTimestamp, reduced]);

  // Track cursor and move pupils capped at ~3 units
  useEffect(() => {
    if (reduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isLookingDown) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance < 1) return;

      const angle = Math.atan2(dy, dx);
      // Cap at 3 units
      const pupilDistance = Math.min(3.0, distance / 50);

      const targetPupilX = Math.cos(angle) * pupilDistance;
      const targetPupilY = Math.sin(angle) * pupilDistance;

      if (leftPupilRef.current && rightPupilRef.current) {
        gsap.to([leftPupilRef.current, rightPupilRef.current], {
          x: targetPupilX,
          y: targetPupilY,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLookingDown, reduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 pointer-events-none select-none drop-shadow-xl"
    >
      <svg
        width="68"
        height="76"
        viewBox="0 0 68 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Soft shadow under pot */}
        <ellipse cx="34" cy="72" rx="22" ry="4" fill="#000000" fillOpacity="0.18" />

        <g ref={potRef} className="will-change-transform">
          {/* Sprout Leaves on Top */}
          {/* Left Sprout Leaf */}
          <path
            d="M34 26 C26 12 14 18 18 28 C22 34 31 30 34 26 Z"
            fill="#7D9565"
          />
          <path
            d="M20 25 C25 22 28 25 33 27"
            stroke="#F7F4EA"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Right Sprout Leaf */}
          <path
            d="M34 26 C42 10 54 16 50 26 C46 32 37 30 34 26 Z"
            fill="#153F2D"
          />
          <path
            d="M48 23 C43 21 40 24 35 27"
            stroke="#7D9565"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Center tiny budding leaf */}
          <circle cx="34" cy="24" r="3.2" fill="#98B87B" />

          {/* Soil Layer */}
          <ellipse cx="34" cy="32" rx="20" ry="4.5" fill="#2E2018" />

          {/* Terracotta Pot Rim */}
          <rect
            x="12"
            y="29"
            width="44"
            height="7"
            rx="3.5"
            fill="#DF8E6D"
          />
          <rect
            x="13"
            y="30"
            width="42"
            height="5"
            rx="2.5"
            fill="#C87855"
          />

          {/* Terracotta Pot Body */}
          <path
            d="M15 35 L19 66 C19.5 68.5 21.5 70 24 70 L44 70 C46.5 70 48.5 68.5 49 66 L53 35 Z"
            fill="#C87855"
          />

          {/* Pot Highlight and Shadow Texture */}
          <path
            d="M19 35 L22 66 C22.5 68.5 24.5 70 27 70 L24 70 C21.5 70 19.5 68.5 19 66 L15 35 Z"
            fill="#DF8E6D"
            fillOpacity="0.45"
          />
          <path
            d="M49 66 L53 35 L47 35 L44 66 C46.5 66 48.5 67 49 66 Z"
            fill="#9C5234"
            fillOpacity="0.3"
          />

          {/* Cute Face */}
          {/* Left Eye Sclera */}
          <ellipse cx="27" cy="48" rx="4.5" ry="5.5" fill="#FFFFFF" />
          {/* Right Eye Sclera */}
          <ellipse cx="41" cy="48" rx="4.5" ry="5.5" fill="#FFFFFF" />

          {/* Left Pupil (Animated Ref) */}
          <circle
            ref={leftPupilRef}
            cx="27"
            cy="48"
            r="2.6"
            fill="#153F2D"
            className="will-change-transform"
          />
          {/* Right Pupil (Animated Ref) */}
          <circle
            ref={rightPupilRef}
            cx="41"
            cy="48"
            r="2.6"
            fill="#153F2D"
            className="will-change-transform"
          />

          {/* Cute Rosy Cheeks */}
          <circle cx="21" cy="53" r="2.5" fill="#E89679" fillOpacity="0.6" />
          <circle cx="47" cy="53" r="2.5" fill="#E89679" fillOpacity="0.6" />

          {/* Cheerful Smile */}
          <path
            d="M31 53 Q34 56.5 37 53"
            stroke="#153F2D"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default Mascot;

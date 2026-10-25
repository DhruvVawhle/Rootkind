"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

export function Vine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(isReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-3 top-0 bottom-0 w-8 pointer-events-none z-[40] hidden xl:block opacity-60"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 32 1200"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          ref={pathRef}
          d="M 16,0 
             C 24,100 8,200 16,300 
             C 24,400 8,500 16,600 
             C 24,700 8,800 16,900 
             C 24,1000 8,1100 16,1200
             M 16,150 C 26,140 28,125 24,120 C 20,115 16,135 16,150
             M 16,350 C 6,340 4,325 8,320 C 12,315 16,335 16,350
             M 16,550 C 26,540 28,525 24,520 C 20,515 16,535 16,550
             M 16,750 C 6,740 4,725 8,720 C 12,715 16,735 16,750
             M 16,950 C 26,940 28,925 24,920 C 20,915 16,935 16,950
             M 16,1100 C 6,1090 4,1075 8,1070 C 12,1065 16,1085 16,1100"
          stroke="#7D9565"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default Vine;

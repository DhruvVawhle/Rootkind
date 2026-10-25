"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

interface WordRevealProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  stagger?: number;
}

export function WordReveal({
  text,
  className = "",
  as: Component = "h1",
  delay = 0.1,
  stagger = 0.045,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(isReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".word-reveal-inner");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          yPercent: 115,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, stagger]);

  const words = text.split(" ");

  if (reduced) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component ref={containerRef as any} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.28em] py-0.5">
          <span className="word-reveal-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}

export default WordReveal;

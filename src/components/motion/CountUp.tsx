"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isReduced = isReducedMotion();
    setReduced(isReduced);
    if (isReduced) {
      setCount(end);
    }
  }, [end]);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: end,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              setCount(Math.round(obj.val));
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [end, duration, reduced]);

  if (reduced) {
    return (
      <span className={className}>
        {prefix}
        {end}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default CountUp;

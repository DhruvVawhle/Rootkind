"use client";

import React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 h-[3.5px] z-[9999] pointer-events-none bg-transparent ${className}`}
    >
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="h-full w-full bg-[#C87855] shadow-[0_1px_6px_rgba(200,120,85,0.4)]"
      />
    </div>
  );
}

export default ScrollProgress;

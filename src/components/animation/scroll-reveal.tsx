"use client";

import React, { ElementType } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export type RevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  as?: ElementType;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  staggerIndex?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  as = "div",
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
  staggerIndex = 0,
  distance = 24,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const effectiveDelay = delay + staggerIndex * 0.08;

  const getInitialAndTarget = () => {
    switch (animation) {
      case "fade-up":
        return {
          initial: { opacity: 0, y: distance },
          whileInView: { opacity: 1, y: 0 },
        };
      case "fade-down":
        return {
          initial: { opacity: 0, y: -distance },
          whileInView: { opacity: 1, y: 0 },
        };
      case "fade-left":
        return {
          initial: { opacity: 0, x: -distance },
          whileInView: { opacity: 1, x: 0 },
        };
      case "fade-right":
        return {
          initial: { opacity: 0, x: distance },
          whileInView: { opacity: 1, x: 0 },
        };
      case "zoom-in":
        return {
          initial: { opacity: 0, scale: 0.94 },
          whileInView: { opacity: 1, scale: 1 },
        };
      case "fade":
      default:
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
        };
    }
  };

  const { initial, whileInView } = getInitialAndTarget();
  const tagKey = typeof as === "string" ? as : "div";
  const MotionComponent = (motion as Record<string, any>)[tagKey] || motion.div;

  return (
    <MotionComponent
      initial={initial}
      whileInView={whileInView}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay: effectiveDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

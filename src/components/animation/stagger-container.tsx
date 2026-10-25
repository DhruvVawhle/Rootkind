"use client";

import React, { ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";

interface StaggerContainerProps {
  children: React.ReactNode;
  as?: ElementType;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  as = "div",
  staggerDelay = 0.07,
  className = "",
  once = true,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  const tagKey = typeof as === "string" ? as : "div";
  const MotionComponent = (motion as Record<string, any>)[tagKey] || motion.div;

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  yOffset?: number;
}

export function StaggerItem({
  children,
  as = "div",
  className = "",
  yOffset = 48,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const itemTagKey = typeof as === "string" ? as : "div";
  const MotionComponent = (motion as Record<string, any>)[itemTagKey] || motion.div;

  return (
    <MotionComponent variants={itemVariants} className={className}>
      {children}
    </MotionComponent>
  );
}

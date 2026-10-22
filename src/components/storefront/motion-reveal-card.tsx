"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface MotionRevealCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

export function MotionRevealCard({
  children,
  index,
  className = "",
}: MotionRevealCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -3,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

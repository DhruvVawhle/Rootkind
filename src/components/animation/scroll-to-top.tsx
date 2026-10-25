"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgress(Math.min(100, Math.max(0, latest * 100)));
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#153F2D] text-[#F7F4EA] shadow-lg shadow-[#153F2D]/25 hover:bg-[#1C523B] hover:shadow-xl hover:shadow-[#153F2D]/35 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D9565] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA]"
          >
            {/* SVG Circular Progress Ring */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
              viewBox="0 0 44 44"
              aria-hidden="true"
            >
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#1E523A]"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#7D9565] transition-all duration-75"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Arrow Icon with hover lift */}
            <ArrowUp
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-[#F7F4EA]"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

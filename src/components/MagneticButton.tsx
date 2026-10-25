"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 to 1, default 0.35
  distanceThresholdFactor?: number; // default 0.9x size
  as?: React.ElementType;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  distanceThresholdFactor = 0.9,
  as: Component = "div",
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLElement>(null);
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
    const el = elementRef.current;
    if (!el) return;

    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      const maxDim = Math.max(rect.width, rect.height);
      const threshold = maxDim * distanceThresholdFactor;

      if (distance < threshold) {
        isHovering = true;
        const targetX = distX * strength;
        const targetY = distY * strength;
        gsap.to(el, {
          x: targetX,
          y: targetY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (isHovering) {
        isHovering = false;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [isReducedMotion, strength, distanceThresholdFactor]);

  return (
    <Component
      ref={elementRef as any}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </Component>
  );
}

/**
 * Global hook / manager that automatically binds magnetic physics to all `.btn` elements
 * and `#header-cart-btn`.
 */
export function GlobalMagneticWatcher() {
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

    const watchedElements = new Set<HTMLElement>();

    const updateWatched = () => {
      const elements = document.querySelectorAll<HTMLElement>(".btn, #header-cart-btn");
      elements.forEach((el) => watchedElements.add(el));
    };

    updateWatched();
    const interval = setInterval(updateWatched, 2000);

    const handleMouseMove = (e: MouseEvent) => {
      watchedElements.forEach((el) => {
        if (!document.body.contains(el)) {
          watchedElements.delete(el);
          return;
        }

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.hypot(distX, distY);
        const threshold = Math.max(rect.width, rect.height) * 0.9;

        if (distance < threshold) {
          (el as any).__isMagnetic = true;
          gsap.to(el, {
            x: distX * 0.28,
            y: distY * 0.28,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else if ((el as any).__isMagnetic) {
          (el as any).__isMagnetic = false;
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
      watchedElements.forEach((el) => gsap.killTweensOf(el));
    };
  }, [isReducedMotion]);

  return null;
}

export default MagneticButton;

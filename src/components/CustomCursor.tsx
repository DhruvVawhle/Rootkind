"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type CursorMode = "default" | "pointer" | "view";

export function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);

  // Custom cursor active on Home ("/") and Catalogue ("/shop" or "/shop/...") only
  const isAllowedRoute = pathname === "/" || pathname.startsWith("/shop");

  useEffect(() => {
    if (typeof window === "undefined" || !isAllowedRoute) {
      setIsEnabled(false);
      return;
    }

    // Check pointer fine, hover capability, and prefers-reduced-motion
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Check hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isViewTarget = target.closest('[data-cursor="view"], .product-image-target, [data-product-image]');
      const isInteractiveTarget = target.closest("a, button, input, select, textarea, [role='button'], .btn");

      if (isViewTarget) {
        setCursorMode("view");
      } else if (isInteractiveTarget) {
        setCursorMode("pointer");
      } else {
        setCursorMode("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp follow in rAF
    const animate = () => {
      // 0.2 lerp factor for responsive yet fluid trailing
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isAllowedRoute]);

  if (!isEnabled) return null;

  // Determine size and style based on cursorMode
  let sizeClasses = "w-3 h-3 bg-white rounded-full";
  if (cursorMode === "pointer") {
    // 36px ring over links and buttons
    sizeClasses = "w-9 h-9 rounded-full bg-white/20 border border-white backdrop-blur-[0.5px]";
  } else if (cursorMode === "view") {
    // 84px "View" bubble over product images
    sizeClasses = "w-[84px] h-[84px] rounded-full bg-white text-[#153F2D] flex items-center justify-center font-serif text-sm font-bold tracking-wider shadow-2xl";
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        mixBlendMode: cursorMode === "view" ? "normal" : "difference",
        opacity: isVisible ? 1 : 0,
      }}
      className={`fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,background-color,border-color,opacity] duration-200 ease-out will-change-transform ${sizeClasses}`}
    >
      {cursorMode === "view" && (
        <span
          ref={textRef}
          className="select-none uppercase text-xs tracking-widest text-[#153F2D]"
        >
          View
        </span>
      )}
    </div>
  );
}

export default CustomCursor;

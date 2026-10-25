"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  clipDirection?: "left" | "bottom";
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 1024px",
  clipDirection = "left",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(isReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) return;

    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    const ctx = gsap.context(() => {
      // 1. Clip-path wipe on enter
      const initialClip =
        clipDirection === "left"
          ? "inset(0% 100% 0% 0%)"
          : "inset(100% 0% 0% 0%)";

      gsap.fromTo(
        container,
        { clipPath: initialClip },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Inner Parallax drift (scale 1.06)
      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.06 },
        {
          yPercent: 8,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [reduced, clipDirection]);

  if (reduced) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${containerClassName}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${className}`}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl will-change-[clip-path] ${containerClassName}`}
    >
      <div
        ref={imageRef}
        className="relative w-full h-[116%] -top-[8%] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${className}`}
        />
      </div>
    </div>
  );
}

export default ParallaxImage;

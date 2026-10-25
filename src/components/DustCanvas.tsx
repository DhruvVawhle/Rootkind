"use client";

import React, { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/gsap";

interface Speck {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  baseOpacity: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function DustCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = isReducedMotion();
    let isVisible = false;
    let rafId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Initialize 34 specks
    const speckCount = 34;
    const specks: Speck[] = [];
    const ripples: Ripple[] = [];

    const initSpecks = () => {
      specks.length = 0;
      for (let i = 0; i < speckCount; i++) {
        const baseOpacity = 0.15 + Math.random() * 0.45;
        specks.push({
          x: Math.random() * (width || 800),
          y: Math.random() * (height || 600),
          radius: 0.8 + Math.random() * 1.8,
          speedY: 0.18 + Math.random() * 0.45,
          speedX: (Math.random() - 0.5) * 0.22,
          opacity: baseOpacity,
          baseOpacity,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = entry.contentRect.width;
        height = entry.contentRect.height;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (specks.length === 0) {
          initSpecks();
        }
      }
    });

    resizeObserver.observe(container);

    // Mouse Ripple tracking
    let lastRippleTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (reduced) return;
      const now = performance.now();
      if (now - lastRippleTime < 90) return; // limit frequency
      lastRippleTime = now;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        ripples.push({
          x: mouseX,
          y: mouseY,
          radius: 2,
          maxRadius: 55 + Math.random() * 20,
          opacity: 0.38,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Render loop
    const render = () => {
      if (!isVisible || width <= 0 || height <= 0) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update rising specks
      for (let i = 0; i < specks.length; i++) {
        const s = specks[i];

        if (!reduced) {
          s.y -= s.speedY;
          s.phase += 0.02;
          s.x += s.speedX + Math.sin(s.phase) * 0.15;

          // Wrap around top to bottom
          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
          }
          if (s.x < -10) s.x = width + 10;
          if (s.x > width + 10) s.x = -10;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 244, 234, ${s.opacity})`;
        ctx.fill();
      }

      // 2. Draw and update ripple rings
      if (!reduced) {
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 1.1;
          r.opacity *= 0.94;

          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200, 120, 85, ${r.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          if (r.opacity < 0.02 || r.radius > r.maxRadius) {
            ripples.splice(i, 1);
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause when off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const isEntryVisible = entries[0].isIntersecting;
        isVisible = isEntryVisible;
      },
      { threshold: 0.05 }
    );

    intersectionObserver.observe(container);
    rafId = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default DustCanvas;

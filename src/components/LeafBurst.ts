"use client";

import { gsap, isReducedMotion } from "@/lib/gsap";

const LEAF_SVGS = [
  // Leaf shape 1
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5 15 5 21C11 21 16 18 18 9C18.5 6.5 17.5 7 17 8Z"/></svg>`,
  // Leaf shape 2
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93Z"/></svg>`,
  // Leaf shape 3 (sprout)
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C8 3 4 7 4 12C4 17 8 21 12 21C16 21 20 17 20 12C20 7 16 3 12 3ZM12 19C8.7 19 6 16.3 6 13C6 11 7 9.5 8.5 8.5C9.5 11.5 11.5 13.5 14.5 14.5C13.5 16 12 19 12 19Z"/></svg>`,
];

const LEAF_COLORS = [
  "#7D9565", // Sage
  "#153F2D", // Forest
  "#96AF7C", // Light green
  "#557945", // Olive sage
  "#C87855", // Terracotta
  "#62814F", // Botanical green
  "#3A674B", // Rich forest
];

export function triggerLeafBurst(originEl: HTMLElement) {
  if (typeof window === "undefined" || isReducedMotion()) {
    // If reduced motion, trigger cart bounce directly without particles
    const cartBtn = document.getElementById("header-cart-btn");
    if (cartBtn) {
      cartBtn.classList.remove("scale-125");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("scale-125");
      setTimeout(() => cartBtn.classList.remove("scale-125"), 250);
    }
    return;
  }

  const originRect = originEl.getBoundingClientRect();
  const startX = originRect.left + originRect.width / 2;
  const startY = originRect.top + originRect.height / 2;

  // Target cart button in header
  const cartBtn = document.getElementById("header-cart-btn");
  let targetX = window.innerWidth - 60;
  let targetY = 32;

  if (cartBtn) {
    const targetRect = cartBtn.getBoundingClientRect();
    targetX = targetRect.left + targetRect.width / 2;
    targetY = targetRect.top + targetRect.height / 2;
  }

  // Create 7 leaf particles
  const particleCount = 7;
  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement("div");
    el.className = "fixed pointer-events-none z-[10000]";
    el.style.width = "18px";
    el.style.height = "18px";
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.color = LEAF_COLORS[i % LEAF_COLORS.length];
    el.innerHTML = LEAF_SVGS[i % LEAF_SVGS.length];
    document.body.appendChild(el);
    particles.push(el);

    // Initial positioning
    gsap.set(el, {
      x: startX - 9,
      y: startY - 9,
      scale: 0.2,
      opacity: 0,
      rotation: Math.random() * 360,
    });

    // Unique arc apex for each leaf
    const angleSpread = ((i - 3) / 3) * 0.9; // spread factor
    const burstDistanceX = angleSpread * 55 + (Math.random() - 0.5) * 20;
    const burstApexY = -60 - Math.random() * 45;

    const tl = gsap.timeline({
      delay: i * 0.03,
      onComplete: () => {
        el.remove();
        if (i === particleCount - 1 && cartBtn) {
          // Trigger cart icon pop on final particle arrival
          gsap.timeline()
            .to(cartBtn, { scale: 1.25, duration: 0.15, ease: "power2.out" })
            .to(cartBtn, { scale: 1, duration: 0.35, ease: "elastic.out(1.2, 0.4)" });
        }
      },
    });

    // Arc up & out
    tl.to(el, {
      x: startX + burstDistanceX,
      y: startY + burstApexY,
      scale: 1.1,
      opacity: 1,
      rotation: `+=${Math.random() * 180 - 90}`,
      duration: 0.32,
      ease: "power2.out",
    });

    // Swoop into cart icon
    tl.to(el, {
      x: targetX,
      y: targetY,
      scale: 0.25,
      opacity: 0.8,
      rotation: `+=${Math.random() * 360}`,
      duration: 0.45,
      ease: "power2.in",
    });
  }
}

export default triggerLeafBurst;

"use client";

import { create } from "zustand";

export interface CartToast {
  id: string;
  type: "error" | "success" | "info";
  message: string;
}

interface CartStoreState {
  count: number;
  isCartOpen: boolean;
  isAdding: boolean;
  toast: CartToast | null;
  lastAddedTimestamp: number | null;
  setCount: (count: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearToast: () => void;
  triggerMascotAdd: () => void;
  addItemOptimistic: (productId: string, qty?: number, variantId?: string) => Promise<boolean>;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  count: 0,
  isCartOpen: false,
  isAdding: false,
  toast: null,
  lastAddedTimestamp: null,

  setCount: (count: number) => set({ count: Math.max(0, count) }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  clearToast: () => set({ toast: null }),
  triggerMascotAdd: () => set({ lastAddedTimestamp: Date.now() }),

  addItemOptimistic: async (productId: string, qty = 1, variantId?: string) => {
    const prevCount = get().count;
    const newCount = prevCount + qty;

    // 1. Optimistically increment count and trigger mascot bounce
    set({
      count: newCount,
      isAdding: true,
      lastAddedTimestamp: Date.now(),
    });

    // Animate cart badge pop in header
    if (typeof window !== "undefined") {
      const cartBtn = document.getElementById("header-cart-btn");
      if (cartBtn) {
        cartBtn.classList.remove("scale-125");
        // Force reflow
        void cartBtn.offsetWidth;
        cartBtn.classList.add("scale-125");
        setTimeout(() => {
          cartBtn.classList.remove("scale-125");
        }, 300);
      }
    }

    // 2. Call background API
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          qty,
          variantId: variantId || productId,
          quantity: qty,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.itemCount === "number") {
        set({ count: data.itemCount, isAdding: false });
      } else {
        set({ isAdding: false });
      }
      return true;
    } catch (error) {
      console.error("[Cart] Failed to add item, rolling back:", error);
      // Roll back count
      set({
        count: prevCount,
        isAdding: false,
        toast: {
          id: String(Date.now()),
          type: "error",
          message: "Unable to update cart. Changes reverted.",
        },
      });

      // Auto dismiss toast after 4 seconds
      setTimeout(() => {
        get().clearToast();
      }, 4000);

      return false;
    }
  },
}));

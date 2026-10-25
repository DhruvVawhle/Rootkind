"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface CartItemType {
  id: string;
  variantId: string;
  quantity: number;
  unitPricePaise: number;
  itemTotalPaise: number;
  variantTitle: string;
  sku: string;
  stock: number;
  weightGrams?: number | null;
  productName: string;
  productSlug: string;
  productImage: string;
}

export interface CartSummaryType {
  id: string;
  items: CartItemType[];
  itemCount: number;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  isFreeShippingEligible: boolean;
  freeShippingThresholdPaise: number;
  amountNeededForFreeShippingPaise: number;
}

interface CartContextType {
  cart: CartSummaryType | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummaryType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pendingRequestsRef = useRef<Map<string, AbortController>>(new Map());

  const refreshCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error("Failed to fetch cart:", e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = (window as any).requestIdleCallback(() => {
          refreshCart();
        });
        return () => (window as any).cancelIdleCallback?.(id);
      } else {
        const timer = setTimeout(refreshCart, 400);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        setIsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    // 1. Optimistic UI update
    setCart((prev) => {
      if (!prev) return prev;
      let newItems = [...prev.items];
      if (quantity <= 0) {
        newItems = newItems.filter((i) => i.id !== itemId);
      } else {
        newItems = newItems.map((i) => {
          if (i.id === itemId) {
            return {
              ...i,
              quantity,
              itemTotalPaise: i.unitPricePaise * quantity,
            };
          }
          return i;
        });
      }

      let subtotalPaise = 0;
      let itemCount = 0;
      newItems.forEach((i) => {
        subtotalPaise += i.itemTotalPaise;
        itemCount += i.quantity;
      });

      const threshold = prev.freeShippingThresholdPaise || 99900;
      const isFreeShipping = subtotalPaise >= threshold;
      const shippingPaise = isFreeShipping || itemCount === 0 ? 0 : prev.shippingPaise || 9900;
      const totalPaise = subtotalPaise + shippingPaise;

      return {
        ...prev,
        items: newItems,
        itemCount,
        subtotalPaise,
        shippingPaise,
        totalPaise,
        isFreeShippingEligible: isFreeShipping,
        amountNeededForFreeShippingPaise: Math.max(0, threshold - subtotalPaise),
      };
    });

    // 2. Cancel any pending in-flight request for the same item to prevent queue congestion
    const prevCtrl = pendingRequestsRef.current.get(itemId);
    if (prevCtrl) {
      prevCtrl.abort();
    }
    const controller = new AbortController();
    pendingRequestsRef.current.set(itemId, controller);

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        // Re-sync with server state on non-200
        refreshCart();
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("Failed to update item quantity:", e);
        refreshCart();
      }
    } finally {
      if (pendingRequestsRef.current.get(itemId) === controller) {
        pendingRequestsRef.current.delete(itemId);
      }
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistic removal
    setCart((prev) => {
      if (!prev) return prev;
      const newItems = prev.items.filter((i) => i.id !== itemId);
      let subtotalPaise = 0;
      let itemCount = 0;
      newItems.forEach((i) => {
        subtotalPaise += i.itemTotalPaise;
        itemCount += i.quantity;
      });
      const threshold = prev.freeShippingThresholdPaise || 99900;
      const isFreeShipping = subtotalPaise >= threshold;
      const shippingPaise = isFreeShipping || itemCount === 0 ? 0 : prev.shippingPaise || 9900;

      return {
        ...prev,
        items: newItems,
        itemCount,
        subtotalPaise,
        shippingPaise,
        totalPaise: subtotalPaise + shippingPaise,
        isFreeShippingEligible: isFreeShipping,
        amountNeededForFreeShippingPaise: Math.max(0, threshold - subtotalPaise),
      };
    });

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error("Failed to remove item:", e);
      refreshCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
        addItem,
        updateItemQuantity,
        removeItem,
        refreshCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

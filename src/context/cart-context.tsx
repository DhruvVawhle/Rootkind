"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error("Failed to update item quantity:", e);
    }
  };

  const removeItem = async (itemId: string) => {
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

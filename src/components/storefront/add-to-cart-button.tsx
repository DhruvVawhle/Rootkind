"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface AddToCartButtonProps {
  kitId: string;
  kitName: string;
  pricePaise: number;
}

export function AddToCartButton({ kitId, kitName, pricePaise: _pricePaise }: AddToCartButtonProps) {
  const { cart, addItem, removeItem, closeCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with cart items
  React.useEffect(() => {
    if (cart?.items) {
      const exists = cart.items.some(
        (item) => item.variantId === kitId || item.id === kitId || item.sku === kitId
      );
      setIsAdded(exists);
    }
  }, [cart?.items, kitId]);

  const handleToggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const nextState = !isAdded;
    setIsAdded(nextState);

    try {
      if (!nextState) {
        // Find item in cart to remove
        const itemToRemove = cart?.items.find(
          (item) => item.variantId === kitId || item.id === kitId || item.sku === kitId
        );
        if (itemToRemove) {
          await removeItem(itemToRemove.id);
        }
      } else {
        await addItem(kitId, 1);
        closeCart();
      }
    } catch (e) {
      console.error("Cart toggle error:", e);
      setIsAdded(!nextState);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      onClick={handleToggle}
      disabled={isProcessing}
      aria-pressed={isAdded}
      aria-label={
        isAdded
          ? `Remove ${kitName} from shopping cart`
          : `Add ${kitName} to shopping cart`
      }
      className={`min-h-[44px] h-[44px] px-6 rounded-[12px] font-semibold text-sm transition-all duration-200 cursor-pointer select-none border-0 text-white ${
        isAdded
          ? "bg-[#1E523A] hover:bg-[#153F2D] text-[#D5DFD2]"
          : "bg-[#A65A3A] hover:bg-[#8C4A2F]"
      } focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#153F2D] focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#FFFFFF]`}
    >
      {isAdded ? (
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-4 h-4 text-[#8FAE7E] stroke-[2.5]" aria-hidden="true" />
          <span>Added</span>
        </span>
      ) : (
        <span>Add to cart</span>
      )}
    </Button>
  );
}

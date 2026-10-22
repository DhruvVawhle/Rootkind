"use client";

import React, { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

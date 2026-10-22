import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Secure Checkout | Rootkind",
  description: "Complete your home-gardening order with encrypted Razorpay payments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

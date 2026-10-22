import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Order Confirmation | Rootkind",
  description: "Your botanical order details and confirmation.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderConfirmationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

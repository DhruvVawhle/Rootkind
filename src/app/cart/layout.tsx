import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shopping Cart | Rootkind",
  description: "View and manage seeds, planters, and soil blends in your Rootkind shopping bag.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

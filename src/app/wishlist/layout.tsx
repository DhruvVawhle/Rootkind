import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Wishlist | Rootkind",
  description: "Saved botanical seeds, planters, and starter kits.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

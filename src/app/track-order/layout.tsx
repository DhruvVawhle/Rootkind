import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Track Your Order | Rootkind",
  description: "Track shipment milestones and courier dispatch status for your Rootkind order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

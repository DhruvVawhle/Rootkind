import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Portal | Rootkind",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

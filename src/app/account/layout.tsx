import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Customer Account | Rootkind",
  description: "Manage your profile, delivery addresses, and track seed orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Archive,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  ArrowLeft,
  Sprout,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { title: "Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Collections", href: "/admin/collections", icon: Layers },
    { title: "Inventory", href: "/admin/inventory", icon: Archive },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Customers", href: "/admin/customers", icon: Users },
    { title: "Content & FAQs", href: "/admin/content", icon: FileText },
    { title: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#153F2D] text-[#F7F4EA] flex flex-col shrink-0 min-h-[auto] lg:min-h-screen border-r border-[#1C523B]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1C523B]">
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-full bg-[#7D9565] text-[#153F2D] flex items-center justify-center">
            <Sprout className="w-4 h-4 text-[#153F2D]" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg leading-tight block">
              Rootkind Admin
            </span>
            <span className="text-[10px] text-[#7D9565] tracking-widest uppercase block">
              Commerce Control
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#7D9565] text-white shadow-xs"
                  : "text-[#E8E2D1]/80 hover:bg-[#1C523B] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Storefront */}
      <div className="p-4 border-t border-[#1C523B]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#E8E2D1]/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Storefront</span>
        </Link>
      </div>
    </aside>
  );
}

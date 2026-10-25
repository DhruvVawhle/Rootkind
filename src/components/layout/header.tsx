"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/cart-context";
import { useCartStore } from "@/store/cart";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MobileMenu } from "@/components/layout/MobileMenu";
import {
  ShoppingBag,
  User,
  Search,
  X,
  ArrowRight,
  Sprout,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Context cart fallback & Zustand store optimistic cart count
  const { cart: contextCart, openCart } = useCart();
  const optimisticCount = useCartStore((s) => s.count);
  const cartCount = optimisticCount > 0 ? optimisticCount : contextCart?.itemCount || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);

  // Height shrinks 68px -> 54px and gains shadow after 20px of scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const isNavActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <ScrollProgress />

      <header
        style={{ top: "env(safe-area-inset-top, 0px)" }}
        className={`sticky top-0 z-40 bg-[#F7F4EA]/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? "shadow-md border-b border-[#DCD5C1]"
            : "border-b border-[#DCD5C1]/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-[54px]" : "h-[68px]"
            }`}
          >
            {/* 1. Mobile Menu Burger Button (Screens <= 820px) */}
            <div className="flex items-center min-[821px]:hidden">
              <button
                ref={burgerBtnRef}
                id="mobile-menu-burger-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] cursor-pointer"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu-panel"
              >
                {/* 3-line burger animates to X */}
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-[#153F2D] rounded-full transition-transform duration-300 origin-left ${
                      mobileMenuOpen ? "rotate-45 translate-x-0.5 -translate-y-0.5" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-[#153F2D] rounded-full transition-opacity duration-200 ${
                      mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-[#153F2D] rounded-full transition-transform duration-300 origin-left ${
                      mobileMenuOpen ? "-rotate-45 translate-x-0.5 translate-y-0.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 2. Brand Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-[#153F2D] hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] rounded-md py-1"
                aria-label={`${siteConfig.name} Home`}
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#153F2D] leading-none">
                  {siteConfig.name}
                </span>
              </Link>
            </div>

            {/* 3. Desktop Navigation (Screens >= 821px) */}
            <nav
              aria-label="Primary navigation"
              className="hidden min-[821px]:flex items-center space-x-1 lg:space-x-1.5"
            >
              {siteConfig.mainNav.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] ${
                      active
                        ? "bg-[#153F2D] text-[#F7F4EA] shadow-xs font-bold"
                        : "text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* 4. Action Icons: Search, Account, "Shop kits", Cart */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Hide "Shop kits" button below 560px */}
              <Link
                href="/collections/starter-kits"
                className="hidden min-[560px]:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EDE7D8] text-[#153F2D] hover:bg-[#DCD5C1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
              >
                <Sprout className="w-3.5 h-3.5 text-[#7D9565]" aria-hidden="true" />
                <span>Shop kits</span>
              </Link>

              {/* Search Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] cursor-pointer"
                  aria-label={searchOpen ? "Close search bar" : "Search products"}
                  aria-expanded={searchOpen}
                >
                  {searchOpen ? (
                    <X className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Search className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>

                {searchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-14 w-72 sm:w-80 bg-white rounded-xl border border-[#DCD5C1] shadow-xl p-2 z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150"
                    role="search"
                  >
                    <label htmlFor="header-search-input" className="sr-only">
                      Search seeds, soils and kits
                    </label>
                    <input
                      id="header-search-input"
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search seeds, soils, kits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs sm:text-sm text-[#282B25] placeholder:text-[#8C9083] px-2 py-1.5 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 p-2 bg-[#153F2D] text-[#F7F4EA] rounded-lg hover:bg-[#1C523B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] cursor-pointer"
                      aria-label="Submit search query"
                    >
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </form>
                )}
              </div>

              {/* Account Link */}
              <Link
                href="/account"
                prefetch={false}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                aria-label="Customer account"
              >
                <User className="w-5 h-5" aria-hidden="true" />
              </Link>

              {/* Cart Trigger with Pop Animation and Leaf Burst destination */}
              <button
                id="header-cart-btn"
                type="button"
                onClick={openCart}
                className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] cursor-pointer will-change-transform"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 bg-[#C87855] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs pointer-events-none"
                    aria-hidden="true"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Screens <= 820px) */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentPath={pathname}
          links={siteConfig.mainNav}
        />
      </header>
    </>
  );
}

export default Header;

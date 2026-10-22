"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

export function Header() {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart?.itemCount || 0;

  // Active navigation helper
  const isNavActive = (href: string) => {
    if (href === "/shop") {
      return pathname === "/shop";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Close mobile menu and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Focus management for search toggle
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Focus trap and escape key listener for accessible mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on first element in mobile menu
    setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'button, [href], input'
      );
      firstFocusable?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EA]/95 backdrop-blur-md border-b border-[#DCD5C1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Menu Trigger (Visible on screens < lg) */}
          <div className="flex items-center lg:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA]"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Brand Logo: Clean typography only, no icon, no subtext */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-[#153F2D] hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA] rounded-md py-1"
              aria-label={`${siteConfig.name} Home`}
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#153F2D] leading-none">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Visible on screens >= lg) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center space-x-1 xl:space-x-2"
          >
            {siteConfig.mainNav.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA] ${
                    active
                      ? "bg-[#153F2D] text-[#F7F4EA] shadow-xs font-semibold"
                      : "text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons: Search, Account, Cart (44px touch targets & visible focus rings) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Search Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA]"
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
                    className="shrink-0 p-2 bg-[#153F2D] text-[#F7F4EA] rounded-lg hover:bg-[#1C523B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                    aria-label="Submit search query"
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>

            {/* Account Icon Button */}
            <Link
              href="/account"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA]"
              aria-label="Customer account"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Cart Trigger Button (Badge is strictly hidden when count is 0) */}
            <button
              type="button"
              onClick={openCart}
              className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EA]"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className="absolute top-1 right-1 bg-[#153F2D] text-[#F7F4EA] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Menu Sheet (Screens < lg) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#F7F4EA] border-r border-[#DCD5C1] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCD5C1]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-bold tracking-tight text-[#153F2D]"
                >
                  <span id="mobile-nav-title">{siteConfig.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#282B25] hover:text-[#153F2D] hover:bg-[#EDE7D8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D]"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav aria-label="Mobile navigation" className="space-y-1">
                {siteConfig.mainNav.map((item) => {
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        active
                          ? "bg-[#153F2D] text-[#F7F4EA] font-semibold"
                          : "text-[#282B25] hover:bg-[#EDE7D8]/80 hover:text-[#153F2D]"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-70" aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Account & Cart Actions */}
            <div className="pt-6 border-t border-[#DCD5C1] space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#153F2D] bg-white border border-[#DCD5C1]"
              >
                <User className="w-4 h-4 text-[#7D9565]" aria-hidden="true" />
                <span>Your Account</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#F7F4EA] bg-[#153F2D]"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#7D9565]" aria-hidden="true" />
                  <span>View Cart</span>
                </div>
                <span>({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

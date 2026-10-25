"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

interface NavLink {
  title: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  links: NavLink[];
}

export function MobileMenu({ isOpen, onClose, currentPath, links }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on resize above 820px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  // Close on Escape & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus first link on open
    const timer = setTimeout(() => {
      const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  // Outside click listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Only trigger if click wasn't on the toggle burger itself
        const burgerBtn = document.getElementById("mobile-menu-burger-btn");
        if (burgerBtn && burgerBtn.contains(e.target as Node)) {
          return;
        }
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onClose]);

  const isNavActive = (href: string) => {
    if (href === "/shop") return currentPath === "/shop";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu-panel"
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:hidden absolute top-full left-0 right-0 bg-[#F7F4EA]/98 backdrop-blur-xl border-b border-[#DCD5C1] shadow-2xl px-4 py-4 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-1">
            {links.map((link, index) => {
              const active = isNavActive(link.href);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: index * 0.04,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 h-12 min-h-[48px] rounded-xl text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] ${
                      active
                        ? "bg-[#153F2D] text-[#F7F4EA] font-semibold shadow-xs"
                        : "text-[#282B25] hover:bg-[#EDE7D8]/80 hover:text-[#153F2D]"
                    }`}
                    aria-current={active ? "page" : undefined}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <span>{link.title}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        active ? "text-[#C87855]" : "text-[#7D9565] opacity-60"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;

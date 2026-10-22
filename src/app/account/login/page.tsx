"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, AlertCircle, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isCheckoutRedirect = callbackUrl === "/checkout" || callbackUrl.startsWith("/checkout");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
      } else {
        if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
          router.push(callbackUrl);
        } else if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCD5C1] shadow-xl p-8 sm:p-10">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#153F2D] text-[#F7F4EA] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Sprout className="w-6 h-6 text-[#7D9565]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D]">
          {isCheckoutRedirect ? "Sign In to Checkout" : "Welcome Back"}
        </h1>
        <p className="text-xs text-[#5A5E53] mt-1.5">
          {isCheckoutRedirect
            ? "Please sign in to securely save your delivery address and complete your purchase."
            : "Sign in to view your orders, saved addresses, and growing guides."}
        </p>
      </div>

      {isCheckoutRedirect && (
        <div className="mb-6 p-3 rounded-lg bg-[#EDE7D8] border border-[#DCD5C1] text-[#153F2D] text-xs flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#7D9565] shrink-0" />
          <span>Your cart is reserved. Sign in to proceed straight to delivery &amp; payment.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-md bg-[#B83A2E]/10 border border-[#B83A2E]/20 text-[#B83A2E] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/contact"
              className="text-[11px] text-[#7D9565] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full mt-2 font-semibold"
          isLoading={isLoading}
        >
          {isCheckoutRedirect ? "Sign In & Continue to Checkout" : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#DCD5C1] text-center text-xs text-[#5A5E53]">
        Don&apos;t have a Rootkind account yet?{" "}
        <Link
          href={callbackUrl ? `/account/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/account/register"}
          className="font-bold text-[#153F2D] hover:underline"
        >
          Create Account &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
          <Suspense fallback={<div className="text-sm text-[#153F2D]">Loading sign-in...</div>}>
            <LoginForm />
          </Suspense>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}


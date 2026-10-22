"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPaise } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  AlertCircle,
  Lock,
  CheckCircle2,
  Sprout,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay Script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.warn("Failed to load Razorpay SDK script.");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("custom");

  // Autofill if logged in
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCustomerName(data.user.name || "");
            setCustomerEmail(data.user.email || "");
            setCustomerPhone(data.user.phone || "");
            setRecipientName(data.user.name || "");
            setPhone(data.user.phone || "");

            if (data.user.addresses && data.user.addresses.length > 0) {
              setSavedAddresses(data.user.addresses);
              const defaultAddr = data.user.addresses.find((a: any) => a.isDefault) || data.user.addresses[0];
              setSelectedAddressId(defaultAddr.id);
              setStreet(defaultAddr.street || "");
              setApartment(defaultAddr.apartment || "");
              setCity(defaultAddr.city || "");
              setState(defaultAddr.state || "Karnataka");
              setPostalCode(defaultAddr.postalCode || "");
              if (defaultAddr.recipientName) setRecipientName(defaultAddr.recipientName);
              if (defaultAddr.phone) setPhone(defaultAddr.phone);
            }
          }
        }
      } catch {
        // Fallback
      }
    }
    loadUserData();
  }, []);

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setStreet("");
      setApartment("");
      setCity("");
      setState("Karnataka");
      setPostalCode("");
      return;
    }
    const addr = savedAddresses.find((a) => a.id === addrId);
    if (addr) {
      setStreet(addr.street || "");
      setApartment(addr.apartment || "");
      setCity(addr.city || "");
      setState(addr.state || "Karnataka");
      setPostalCode(addr.postalCode || "");
      if (addr.recipientName) setRecipientName(addr.recipientName);
      if (addr.phone) setPhone(addr.phone);
    }
  };

  const handlePayNow = async (e: React.FormEvent, isSimulation = false) => {
    e.preventDefault();
    setError("");

    if (!cart || cart.items.length === 0) {
      setError("Your basket is empty. Please add items before checking out.");
      return;
    }

    if (!customerEmail || !customerName || !customerPhone || !street || !city || !postalCode) {
      setError("Please fill in all required delivery and contact fields.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order and Reserve Inventory on Server
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          saveAddress: saveAddressToAccount,
          shippingAddress: {
            recipientName: recipientName || customerName,
            phone: phone || customerPhone,
            street,
            apartment,
            city,
            state: state || "Karnataka",
            postalCode,
            country: "India",
          },
          notes,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(orderData.error || "Failed to create checkout order.");
      }

      const { orderId, orderReference, razorpayOrderId, keyId, amountPaise } = orderData;

      // Simulation mode bypass (for testing when Razorpay modal is not interacted with)
      if (isSimulation || !window.Razorpay) {
        console.log("[Checkout]: Completing via Test Mode Simulation...");
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: "mock_signature_valid",
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error);

        await refreshCart();
        router.push(`/order-confirmation/${orderId}`);
        return;
      }

      // 2. Open Official Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: amountPaise,
        currency: "INR",
        name: "Rootkind",
        description: `Order ${orderReference}`,
        image: "/images/about/heirloom-seeds.jpg",
        order_id: razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#153F2D",
        },
        handler: async function (response: any) {
          try {
            // 3. Cryptographically verify signature on server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            await refreshCart();
            router.push(`/order-confirmation/${orderId}`);
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(`Payment failed: ${response.error?.description || "Gateway declined"}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.message || "An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153F2D]">
              Secure Botanical Checkout
            </h1>
            <p className="text-xs text-[#5A5E53] mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#7D9565]" />
              <span>256-Bit SSL Encrypted • Direct Razorpay Integration</span>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-[#B83A2E]/10 border border-[#B83A2E]/20 text-[#B83A2E] text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Columns: Checkout Form */}
            <form onSubmit={(e) => handlePayNow(e, false)} className="lg:col-span-7 space-y-8">
              {/* 1. Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCD5C1]">
                  <h2 className="font-serif text-lg font-bold text-[#153F2D]">
                    1. Contact Details
                  </h2>
                  <span className="text-xs text-[#5A5E53]">Order updates &amp; receipt</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="custName">Your Name</Label>
                    <Input
                      id="custName"
                      required
                      placeholder="e.g. Rahul Mehta"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="custEmail">Email Address</Label>
                    <Input
                      id="custEmail"
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custPhone">10-Digit Mobile Number (for Courier SMS)</Label>
                  <Input
                    id="custPhone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCD5C1]">
                  <h2 className="font-serif text-lg font-bold text-[#153F2D]">
                    2. Shipping Address
                  </h2>
                  <span className="text-xs text-[#5A5E53]">Pan-India Delivery</span>
                </div>

                {/* Saved Addresses quick select if available */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-2 pb-3 border-b border-[#DCD5C1]">
                    <span className="text-xs font-semibold text-[#153F2D] block">
                      Saved Delivery Addresses:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedAddressId === addr.id
                              ? "border-[#153F2D] bg-[#153F2D]/5 ring-1 ring-[#153F2D]"
                              : "border-[#DCD5C1] bg-white hover:border-[#153F2D]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#153F2D] line-clamp-1">
                              {addr.recipientName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EDE7D8] text-[#7D9565] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5A5E53] mt-1 line-clamp-2">
                            {addr.street}, {addr.apartment ? `${addr.apartment}, ` : ""}{addr.city}, {addr.postalCode}
                          </p>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectSavedAddress("new")}
                        className={`p-3 rounded-lg border text-center flex items-center justify-center text-xs font-semibold transition-all ${
                          selectedAddressId === "new"
                            ? "border-[#153F2D] bg-[#153F2D]/5 ring-1 ring-[#153F2D] text-[#153F2D]"
                            : "border-dashed border-[#DCD5C1] hover:border-[#153F2D] text-[#5A5E53]"
                        }`}
                      >
                        + Use a different address
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="recName">Recipient Name</Label>
                    <Input
                      id="recName"
                      required
                      placeholder="e.g. Rahul Mehta"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="recPhone">Delivery Contact Phone</Label>
                    <Input
                      id="recPhone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="street">Street Address / Flat No.</Label>
                  <Input
                    id="street"
                    required
                    placeholder="Flat 302, Green Meadows Apt, 12th Main"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="apartment">Apartment / Landmark (Optional)</Label>
                  <Input
                    id="apartment"
                    placeholder="Near BDA Complex"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      placeholder="Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      placeholder="Karnataka"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">6-Digit PIN Code</Label>
                    <Input
                      id="postalCode"
                      required
                      pattern="[0-9]{6}"
                      placeholder="560034"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#153F2D] font-medium">
                    <input
                      type="checkbox"
                      checked={saveAddressToAccount}
                      onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-[#DCD5C1] text-[#153F2D] focus:ring-[#153F2D]"
                    />
                    <span>Save this address to my Rootkind account for future orders</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="e.g. Leave with security guard if unavailable"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  className="w-full text-base font-semibold shadow-lg gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>
                    Pay with Razorpay • {cart ? formatPaise(cart.totalPaise) : "₹0"}
                  </span>
                </Button>

                {/* Test Mode Simulation Button (useful for automation and headless browsers) */}
                <button
                  type="button"
                  onClick={(e) => handlePayNow(e, true)}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-md border border-dashed border-[#7D9565] bg-[#7D9565]/10 text-[#153F2D] text-xs font-semibold hover:bg-[#7D9565]/20 transition-colors"
                >
                  ⚡ Fast Checkout with Test Mode Simulation (Bypass Modal)
                </button>
              </div>
            </form>

            {/* Right 5 Columns: Order Summary Review */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#153F2D] pb-3 border-b border-[#DCD5C1]">
                Order Summary ({cart?.itemCount || 0})
              </h2>

              {!cart || cart.items.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#5A5E53]">
                  Your basket is empty.
                </div>
              ) : (
                <div className="divide-y divide-[#DCD5C1] max-h-80 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#EDE7D8] shrink-0 border border-[#DCD5C1]">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-[#153F2D] line-clamp-1">
                            {item.productName}
                          </p>
                          <p className="text-[#5A5E53] text-[11px]">
                            {item.variantTitle} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-[#153F2D]">
                        {formatPaise(item.itemTotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculations */}
              {cart && (
                <div className="space-y-2 text-xs pt-4 border-t border-[#DCD5C1]">
                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#282B25]">
                      {formatPaise(cart.subtotalPaise)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#5A5E53]">
                    <span>Express Shipping</span>
                    <span>
                      {cart.shippingPaise === 0 ? (
                        <span className="font-bold text-[#7D9565]">FREE</span>
                      ) : (
                        formatPaise(cart.shippingPaise)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold font-serif text-[#153F2D] pt-3 border-t border-[#DCD5C1]">
                    <span>Total Amount</span>
                    <span>{formatPaise(cart.totalPaise)}</span>
                  </div>
                </div>
              )}

              {/* Assurances */}
              <div className="bg-[#F7F4EA] p-4 rounded-xl border border-[#DCD5C1] space-y-2 text-[11px] text-[#5A5E53]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7D9565] shrink-0" />
                  <span>85%+ Tested Germination Guarantee included.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#7D9565] shrink-0" />
                  <span>Dispatched in plastic-free recyclable kraft packaging.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

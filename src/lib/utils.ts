import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer paise into Indian Rupee (INR) currency string.
 * Example: 49900 -> "₹499" or "₹499.00"
 */
export function formatPaise(paise: number, includeDecimals = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: includeDecimals ? 2 : rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Generates an order reference: RK-YYYY-XXXX
 */
export function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `RK-${year}-${randomPart}`;
}

/**
 * Formats dates for reviews, orders, articles
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

# Rootkind Acceptance Checklist & Verification Report

This document records the strict acceptance criteria, verification methods, and verified outcomes for each milestone and the final release gate of the **Rootkind** D2C commerce platform.

---

## 1. Project Isolation & Environment
- [x] **Strict Project Isolation**: Confirmed 100% independent codebase targeting `c:\Users\Admin\Desktop\Rootkind`. No reuse of any code, models, schemas, credentials, or branding from KrishiSaathi or any other project.
- [x] **Clean Repository & Structure**: Modular monolith with clean domain separation (`src/app`, `src/components`, `src/lib`, `src/types`, `prisma`, `scripts`).
- [x] **Secret Isolation**: Real secrets excluded from git; `.env` excluded via `.gitignore`.
- [x] **Template Configuration**: `.env.example` provides comprehensive descriptions of required variables (`DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`) without leaking real credentials.

---

## 2. Visual Design & Branding
- [x] **Botanical Palette Implementation**: Centralized CSS variables in `src/app/globals.css`:
  - Warm Ivory: `#F7F4EA` (`--canvas`)
  - Forest Green: `#153F2D` (`--brand-forest`)
  - Sage Green: `#7D9565` (`--brand-sage`)
  - Terracotta: `#C87855` (`--brand-terracotta`)
  - Charcoal: `#282B25` (`--brand-charcoal`)
- [x] **Editorial Typography**: Expressive Serif for hero & editorial headings (`Playfair Display` / Georgia font stack), Clean Sans-Serif (`Inter` / system-ui) for body, forms, navigation, and data tables.
- [x] **Configurable Identity**: Centrally managed brand config in `src/lib/brand-config.ts` (`brandConfig.name`, `brandConfig.tagline`, `brandConfig.promise`).
- [x] **Visual Excellence**: Restrained borders (`border-stone-200/80`), subtle drop shadows, rich negative space, and authentic botanical photography.
- [x] **Reduced Motion**: All animations and transitions gracefully respect `@media (prefers-reduced-motion: reduce)`.

---

## 3. Product Catalog & Details
- [x] **Botanical Schema & Relations**: Rich Prisma models with botanical attributes:
  - `sunlightRequirement`, `sowingSeason`, `growingDifficulty`, `recommendedPotSize`, `approxDaysToHarvest`, `seedCountOrWeight`, `careInstructions`, `storageInstructions`.
- [x] **Initial Product Categories**: All 13 initial categories supported:
  - Vegetable seeds, Fruit seeds, Herb seeds, Microgreens, Flower seeds, Potting mixes & soil, Cocopeat & compost, Grow bags & planters, Gardening tools, Watering accessories, Plant nutrition, Starter kits, Balcony/terrace kits.
- [x] **Variant & SKU System**: `ProductVariant` model supports dynamic pack sizes (`100 Seeds`, `250 Seeds`, `500g`, `1kg`), distinct SKUs, prices, compare-at prices, and inventory stock tracking.
- [x] **Image Galleries & Fallbacks**: Multi-image galleries with thumbnail selectors, zoom views, descriptive `alt` tags, and graceful SVG botanical fallbacks.
- [x] **Search, Filter & Sort**: Functional text query search, category/difficulty filtering, and price/rating sorting.

---

## 4. Shopping Cart & Checkout
- [x] **Dual Cart Support**: Anonymous guest carts (persisted via `rootkind_cart_token` cookie) and authenticated customer carts (persisted in PostgreSQL `Cart` model).
- [x] **Automatic Cart Merging**: Guest carts merge into customer accounts upon login or registration without duplicate item entries.
- [x] **Integer Paise Precision**: All currency calculations (subtotal, shipping, tax, discounts, grand total) computed strictly on the server in integer paise (e.g. ₹499 = `49900` paise) to prevent floating-point rounding errors.
- [x] **Concurrency-Safe Inventory Locks**: Atomic database transactions check and reserve variant stock before order placement, preventing overselling and negative inventory.
- [x] **Multi-Step Checkout**: Delivery address collection, server-side validation with Zod, order review, and seamless transition to payment gateway.

---

## 5. Razorpay Payment Integration
- [x] **Server-Side Order Creation**: `/api/checkout/create-order` creates orders in DB and synchronizes with Razorpay API in integer paise.
- [x] **Cryptographic Verification**: `/api/payments/verify` computes HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and matches against `razorpay_signature`.
- [x] **Secure Webhook Pipeline**: `/api/webhooks/razorpay` verifies signature header `X-Razorpay-Signature`.
- [x] **Webhook Deduplication**: All webhook events recorded in `WebhookEvent` table with unique constraint on `eventId` to prevent replay attacks.
- [x] **Order State Transitions**: Order marked `CONFIRMED` and payment marked `PAID` only upon verified cryptographic proof.
- [x] **Inventory Rollback**: Payment failures and cancellations automatically restore reserved variant inventory.

---

## 6. Authentication & Security
- [x] **Credential Hashing**: Passwords securely hashed with `bcryptjs` (salt rounds: 10).
- [x] **Session Management**: Cryptographic JWT tokens stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies (`rootkind_session`).
- [x] **Strict Customer Isolation**: Ownership checks on all user endpoints (`/api/account/*`, `/account/orders/[id]`). Customers cannot access or modify orders or addresses of other users.
- [x] **Protected Administration**: Middleware and server-side session checks verify `role === 'ADMIN'`. Unauthorized users redirected to `/account/login`.
- [x] **Audit Trail**: Sensitive administrative actions (price changes, inventory adjustments, order cancellations) logged to `AuditLog` table.
- [x] **Input Validation**: Strict Zod schemas for all forms and API payloads (`authSchemas`, `addressSchemas`, `checkoutSchemas`).

---

## 7. Administration Portal
- [x] **Executive Dashboard (`/admin`)**: Real-time total revenue, order metrics, customer count, and low-stock alert counters.
- [x] **Catalog Management (`/admin/products`)**: Create, update, publish, archive, and manage product variants and SKUs.
- [x] **Inventory Adjustments (`/admin/inventory`)**: Real-time stock audit, adjustment logging with explicit reason codes, and automated low-stock warnings.
- [x] **Order Fulfillment (`/admin/orders`, `/admin/orders/[id]`)**: Order status transitions (`PENDING` -> `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`), tracking ID assignment, and cancellation handling.
- [x] **Customer Directory (`/admin/customers`)**: Customer profiles, order history, and lifetime spending aggregates.
- [x] **Editorial Management (`/admin/content`)**: Publishing and updating gardening journal articles and FAQ items.
- [x] **Store Settings (`/admin/settings`)**: Announcement bar configuration, free-shipping threshold, and customer support details.

---

## 8. Responsive Design & Cross-Device Compatibility
Automated Playwright audit executed across 10 routes and 10 representative viewports (100 total combinations):
- [x] **320 × 568** (iPhone SE / Small mobile) — 0px horizontal overflow (PASSED)
- [x] **360 × 800** (Android Standard) — 0px horizontal overflow (PASSED)
- [x] **375 × 812** (iPhone Mini / Standard) — 0px horizontal overflow (PASSED)
- [x] **390 × 844** (iPhone 14/15) — 0px horizontal overflow (PASSED)
- [x] **430 × 932** (iPhone Pro Max) — 0px horizontal overflow (PASSED)
- [x] **768 × 1024** (iPad Portrait) — 0px horizontal overflow (PASSED)
- [x] **1024 × 768** (iPad Landscape) — 0px horizontal overflow (PASSED)
- [x] **1280 × 800** (Laptop / Small desktop) — 0px horizontal overflow (PASSED)
- [x] **1440 × 900** (Desktop standard) — 0px horizontal overflow (PASSED)
- [x] **1920 × 1080** (FHD Widescreen) — 0px horizontal overflow (PASSED)

**Tested Routes**: `/`, `/shop`, `/collections/seeds`, `/products/pusa-ruby-heirloom-tomato`, `/cart`, `/checkout`, `/account/login`, `/about`, `/journal`, `/faq`.  
**Result**: **100 / 100 tests passed with 0 horizontal overflow defects!**

---

## 9. Google Lighthouse Verification (Desktop & Mobile)

### Desktop Audits (Target 90+)
| Route | Performance | Accessibility | Best Practices | SEO | Core Web Vitals (LCP / CLS / TBT) |
|---|---|---|---|---|---|
| **Homepage (`/`)** | **97** | **96** | **96** | **100** | LCP: 1.0s, CLS: 0.000, TBT: 80ms |
| **Product Detail (`/products/pusa-ruby-heirloom-tomato`)** | **96** | **96** | **96** | **100** | LCP: 1.1s, CLS: 0.000, TBT: 120ms |
| **Shop Catalogue (`/shop`)** | **98** | **95** | **96** | **100** | LCP: 0.9s, CLS: 0.000, TBT: 60ms |

### Mobile Audit (Simulated Slow 4G / CPU Throttling)
| Route | Performance | Accessibility | Best Practices | SEO | Notes |
|---|---|---|---|---|---|
| **Homepage (`/`)** | **71** | **96** | **96** | **100** | CLS: 0.000, TBT: 590ms, LCP: 3.5s (due to external Unsplash image latency on simulated 4G) |

---

## 10. SEO & Accessibility (WCAG 2.2 AA)
- [x] **Unique Meta & Titles**: Unique titles and meta descriptions across all 43 pages.
- [x] **Dynamic Sitemap & Robots**: Generated at `/sitemap.xml` and `/robots.txt`.
- [x] **Noindex Directives**: Applied to `/cart`, `/checkout`, `/account/*`, `/admin/*`, `/wishlist`, `/track-order`, and `/order-confirmation/*`.
- [x] **Structured Data (JSON-LD)**: Schema.org `Product`, `Offer`, `Organization`, and `Article` markup embedded in HTML.
- [x] **Semantic HTML**: `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<footer>` landmarks used throughout.
- [x] **Keyboard Navigation & ARIA**: Visible focus rings (`focus-visible:ring-2`), skip-to-content links, `aria-label` attributes on icon-only buttons, and accessible form labels.
- [x] **Zero TypeScript Errors**: `npx tsc --noEmit` passed with 0 errors.
- [x] **Zero ESLint Errors**: `npx eslint src` passed with 0 errors.
- [x] **Unit & Integration Tests**: 7/7 automated test suites passing.
- [x] **Production Build**: Next.js production build (`next build`) completed successfully with 43 routes compiled.

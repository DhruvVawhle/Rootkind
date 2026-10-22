# Rootkind Implementation Plan

## Overview
This roadmap guides the end-to-end development, testing, and production verification of **Rootkind**, a premium D2C home-gardening e-commerce application.

---

## Milestone 0: Project Inspection, Isolation & Documentation (Current)
- [x] Inspect workspace environment (`c:\Users\Admin\Desktop\Rootkind`).
- [x] Verify project isolation (zero code/credentials/assets from previous projects).
- [x] Initialize Git repository and Next.js 16 with TypeScript, Tailwind CSS, ESLint, App Router.
- [x] Document system architecture (`docs/architecture.md`).
- [x] Document implementation roadmap (`docs/implementation-plan.md`).
- [x] Document acceptance checklist (`docs/acceptance-checklist.md`).
- [x] Provide clean `.env.example` template with descriptive comments.

## Milestone 1: Foundation & Design System
- [ ] Install essential production libraries:
  - `clsx`, `tailwind-merge`, `lucide-react`, `motion` (or `framer-motion`), `zod`, `bcryptjs`, `@types/bcryptjs`, `jose`, `razorpay`.
- [ ] Configure database engine and Prisma ORM:
  - Initialize Prisma schema with 20 models and explicit enums.
  - Implement integer paise currency convention.
  - Configure PostgreSQL database connectivity with robust embedded/local and connection string fallback.
  - Generate initial Prisma migration and client.
- [ ] Establish botanical design system in `src/app/globals.css`:
  - Palette: Warm ivory (`#F7F4EA`), Forest green (`#153F2D`), Sage green (`#7D9565`), Terracotta (`#C87855`), Charcoal (`#282B25`).
  - Google Fonts integration: Expressive serif (`Fraunces` / `Playfair Display`) & Clean sans (`Plus Jakarta Sans`).
  - Base shadcn/ui primitives (`Button`, `Card`, `Badge`, `Dialog`, `Input`, `Label`, `Select`, `DropdownMenu`, `Sheet`, `Tabs`, `Toast`).
- [ ] Setup testing suite:
  - Unit/integration testing setup with Vitest/Node test runner.
  - Playwright browser test configuration for desktop and mobile viewports.

## Milestone 2: Botanical Storefront & Product Discovery
- [ ] Build global navigation & shell:
  - Announcement bar with configurable business messaging.
  - Responsive header with brand logo, Shop, Growing Guides, Our Story, Search trigger, Account trigger, and Cart counter with slide-out drawer.
  - Comprehensive botanical footer with shop categories, care guides, trust badges, policies, and newsletter form.
- [ ] Build high-converting editorial Homepage (`/`):
  - Editorial hero with botanical photography, value proposition, and shopping CTAs.
  - Shop by botanical category (Vegetables, Fruits, Herbs, Microgreens, Tools, Potting Mixes, Kits).
  - Bestselling products directly from database.
  - Featured balcony & terrace growing kits.
  - "Grow in 4 Steps" illustrated guide section.
  - Featured gardening journal articles.
  - Authentic customer testimonials and trust markers.
  - Consent-aware newsletter subscription with server validation.
- [ ] Build Product Catalog & Discovery:
  - `/shop`: Grid layout with category filters, difficulty filters, sunlight filters, sorting, and pagination.
  - `/collections/[slug]`: Curated collections with editorial introduction and targeted products.
  - `/search`: Instant server-side search across product titles, descriptions, categories, and tags.
- [ ] Build Product Detail Page (`/products/[slug]`):
  - Multi-image gallery with thumbnail selection and zoom.
  - Dynamic variant selector (pack sizes, weights, colors) and real-time stock status.
  - Interactive quantity stepper and instant Add-to-Cart.
  - Botanical Growing Guide tabs (Sunlight, Sowing Season, Pot Size, Days to Harvest, Care & Watering, Soil Suitability).
  - Delivery timelines and hassle-free returns information.
  - Real customer reviews and related botanical recommendations.

## Milestone 3: Authentication & Customer Identity
- [ ] Registration (`/account/register`) with name, email, phone, and password with Zod validation.
- [ ] Login (`/account/login`) with credential verification, bcryptjs comparison, and secure HTTP-only cookie session.
- [ ] Customer Account Dashboard (`/account`):
  - Overview with recent orders, default address, and saved wishlist items.
  - Profile editing (`/account/profile`).
  - Address book management (`/account/addresses`) with create, edit, delete, and set default actions.
  - Order history (`/account/orders`) and detailed order tracking (`/account/orders/[id]`).
- [ ] Route protection middleware enforcing session validation and customer-order ownership.

## Milestone 4: Commerce Engine (Cart, Checkout & Inventory)
- [ ] Cart system supporting anonymous guests and authenticated customers:
  - Client-side store synced with server-side cart state.
  - Automatic guest-to-customer cart merge on login.
  - Add, update quantity, remove, and clear operations.
  - Server-calculated subtotals, shipping thresholds (e.g., free shipping above ₹999), and promotions.
- [ ] Server-Side Checkout (`/checkout`):
  - Step 1: Delivery address selection or new address entry with PIN code validation.
  - Step 2: Shipping method and coupon application.
  - Step 3: Order review with server-verified prices and concurrency-safe stock reservation.
- [ ] Order Creation:
  - Atomic database transaction creating Order and immutable OrderItem snapshots.
  - State machine initialization: `orderStatus = PENDING`, `paymentStatus = PENDING`.

## Milestone 5: Razorpay Payment Integration
- [ ] Server-side Razorpay order generation (`amount = totalPaise`, `currency = INR`, `receipt = orderReference`).
- [ ] Client-side Razorpay modal integration with custom botanical styling.
- [ ] Payment verification route (`/api/payments/verify`):
  - Server HMAC-SHA256 signature verification (`razorpay_order_id|razorpay_payment_id`).
  - Update Order status to `CONFIRMED` and Payment status to `PAID`.
  - Finalize inventory reservation.
- [ ] Razorpay Webhook endpoint (`/api/webhooks/razorpay`):
  - Signature validation using webhook secret.
  - Idempotent deduplication via `WebhookEvent` table.
  - Handle `payment.captured`, `payment.failed`, `refund.processed`.
- [ ] Payment failure and retry flows:
  - Graceful error states with inventory release after reservation timeout.
- [ ] Order Confirmation Page (`/order-confirmation/[id]`):
  - Full receipt, estimated dispatch date, items ordered, and link to track order.
- [ ] Standalone Track Order (`/track-order`) via Order Reference and Phone/Email.

## Milestone 6: Protected Administration Dashboard
- [ ] Admin authentication and role verification (`user.role === 'ADMIN'`).
- [ ] Dashboard overview (`/admin`):
  - Real-time revenue metrics, order counts, low-stock warnings, and recent activity.
- [ ] Product & Variant Management (`/admin/products`):
  - Create, update, publish/draft, and archive products with full botanical specifications.
  - Variant management (SKU, price, stock, pack size).
- [ ] Category & Collection Management (`/admin/collections`).
- [ ] Inventory Control (`/admin/inventory`):
  - Manual stock adjustments with reason logging (restock, damaged, returned).
  - Low-stock visual alerts and audit log trail.
- [ ] Order Management (`/admin/orders`):
  - Filter by order status and payment status.
  - Order fulfillment workflow (dispatch, tracking number assignment, status transition to `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - Refund status recording.
- [ ] Customer Management (`/admin/customers`):
  - Customer directory with lifetime order count and total spend.
- [ ] Content & Settings (`/admin/content`, `/admin/settings`):
  - Gardening journal article publishing and FAQ management.
  - Business details, announcement banner text, shipping fees, free shipping threshold.

## Milestone 7: Content, Policies, SEO & Accessibility
- [ ] Educational Gardening Journal:
  - `/journal`: Articles categorized by beginner guides, seasonal calendars, pest care.
  - `/journal/[slug]`: Rich editorial article with linked botanical products and author info.
- [ ] Store Information & Legal Pages:
  - `/about`: Rootkind brand philosophy, soil health focus, seed purity commitment.
  - `/contact`: Customer support inquiries form with server action handling.
  - `/faq`: Accordion-based FAQs (Germination guarantee, Shipping, Care tips).
  - `/shipping-policy`, `/returns-refunds`, `/privacy-policy`, `/terms`.
- [ ] SEO Infrastructure:
  - Dynamic `sitemap.xml` and `robots.txt`.
  - Schema.org JSON-LD structured data (Product, Organization, BreadcrumbList, Article).
  - OpenGraph / Twitter metadata with canonical URLs.
- [ ] Accessibility Conformance (WCAG 2.2 AA):
  - Semantic HTML landmarks, Skip-to-content link, accessible icon buttons with `aria-label`, visible focus rings, color contrast compliance.

## Milestone 8: Comprehensive Verification, Testing & QA Gate
- [ ] Database seeding: 25+ realistic botanical products with diverse variants, kits, soil mixes, and guides.
- [ ] TypeScript `tsc --noEmit` and ESLint checks.
- [ ] Unit & integration test execution.
- [ ] Playwright cross-device end-to-end tests across 10 required viewports:
  - 320x568, 360x800, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080.
- [ ] Lighthouse audit on mobile and desktop:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+
- [ ] Production build verification (`npm run build`).
- [ ] Complete QA report and release documentation.

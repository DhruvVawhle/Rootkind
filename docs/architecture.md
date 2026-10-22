# Rootkind Architecture Documentation

## 1. Executive Summary & Brand Identity

**Rootkind** is a premium direct-to-consumer (D2C) home-gardening platform designed for urban and suburban growers cultivating vegetables, herbs, fruits, microgreens, and flowers at home.

- **Brand Name**: Rootkind (Centrally configurable)
- **Tagline**: *"Grow good things at home."*
- **Core Promise**: *"Everything you need to grow your own vegetables, herbs and fruits, from your first seed to your first harvest."*
- **Visual Personality**: High-end botanical editorial, tactile natural tones, refined typography, and purposeful motion.

---

## 2. Project Isolation Guarantee

- Rootkind is a brand-new, completely independent project.
- **Strict Isolation**: No code, assets, schemas, credentials, product lines, or business logic from KrishiSaathi or any other prior project are reused.
- Rootkind operates with its own repository, database schema, environment variables, authentication realm, and Razorpay merchant credentials.

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router, Server Components by default, Client Components where interactive)
- **Language**: TypeScript with `strict` mode
- **Styling**: Tailwind CSS with CSS Variables for semantic tokens
- **Component Primitives**: shadcn/ui & Radix UI primitives
- **Motion Engine**: Motion (framer-motion) with `prefers-reduced-motion` compliance
- **Iconography**: Lucide React
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: Secure password hashing (bcryptjs) with tamper-proof HTTP-only JWT sessions and role-based access control (RBAC)
- **Payment Gateway**: Razorpay (Server-created orders, frontend Checkout, HMAC-SHA256 signature verification, idempotent webhook processing)
- **Testing**: Vitest / Node test runner for unit & integration, Playwright for cross-device end-to-end browser testing
- **Auditing**: Lighthouse CI for Performance, Accessibility, Best Practices, and SEO

---

## 4. Modular Monolith Architecture

The application is structured into decoupled domain modules under `src/`:

```
src/
├── app/                        # Next.js App Router (Public, Shopping, Account, Admin, API)
│   ├── (storefront)/           # Public customer routes (/, /shop, /products, /journal, etc.)
│   ├── (auth)/                 # Login, Register, Password flows
│   ├── (account)/              # Protected customer portal (/account, /account/orders, etc.)
│   ├── (checkout)/             # Cart, Checkout, Order Confirmation
│   ├── (admin)/                # Protected admin portal (/admin/*)
│   ├── api/                    # Webhooks, payment verification, cart synchronization
│   ├── layout.tsx              # Root HTML shell, fonts, semantic tags
│   └── globals.css             # Design tokens, variables, typography
├── components/                 # Reusable UI & domain components
│   ├── ui/                     # shadcn/ui primitives (Button, Dialog, Input, etc.)
│   ├── layout/                 # Navbar, AnnouncementBar, Footer, CartDrawer
│   ├── storefront/             # ProductCard, Hero, CategoryGrid, KitShowcase
│   ├── product/                # ImageGallery, VariantSelector, BotanicalSpecs
│   ├── checkout/               # AddressForm, RazorpayButton, PriceBreakdown
│   └── admin/                  # AdminNav, MetricCards, DataTable, StatusBadge
├── lib/                        # Core infrastructure & shared utilities
│   ├── db.ts                   # Prisma client singleton with connection pooling
│   ├── auth.ts                 # Session verification, password hashing, JWT signing
│   ├── razorpay.ts             # Razorpay API client & HMAC signature validation
│   ├── cart.ts                 # Cart operations, guest-to-customer merging
│   ├── inventory.ts            # Atomic inventory reservation and release
│   ├── validation.ts           # Zod schemas for all forms & API payloads
│   └── utils.ts                # Currency formatting (Paise to INR), cn helper
├── types/                      # Shared TypeScript interfaces and enums
└── config/                     # Centralized site metadata, navigation, brand config
    ├── site.ts                 # Brand name, tagline, navigation menus, social links
    └── botanical.ts            # Botanical categories, difficulty levels, seasons
```

---

## 5. Domain Models & Database Schema

All monetary values are stored as **integer paise** (e.g. ₹499.00 = `49900`) to eliminate floating-point rounding errors.

### Core Entity Relationships:
1. **User & Session**:
   - Roles: `CUSTOMER`, `ADMIN`
   - Fields: `id`, `email`, `passwordHash`, `name`, `phone`, `role`, `createdAt`
2. **Address**:
   - Linked to `User`, supports billing and shipping designations with recipient name, street, city, state, postal code, phone.
3. **Category & Collection**:
   - Hierarchical category tree (Vegetable seeds, Microgreens, Potting mixes, etc.)
   - Curated collections (e.g., "Beginner Balcony Garden", "High-Yield Containers")
4. **Product & ProductVariant**:
   - `Product`: Name, slug, description, categoryId, botanical attributes (sunlight, sow season, harvest days, watering, difficulty, seed count), publishing status.
   - `ProductVariant`: SKU, variant name (e.g. "Pack of 50 Seeds", "5kg Bag", "Terrecotta 8-inch"), pricePaise, compareAtPricePaise, weightGrams, stock.
5. **Inventory & InventoryAdjustment**:
   - Real-time `stock` counter with concurrency checks.
   - `InventoryAdjustment`: Immutable log tracking every increment, decrement, reservation, and cancellation reason.
6. **Cart & CartItem**:
   - Guest carts (via persistent secure cookie UUID) and authenticated customer carts.
   - Automatic merge upon login with stock re-validation.
7. **Order & OrderItem**:
   - `Order`: Unique reference (e.g., `RK-2026-1001`), userId (optional for guest checkout), orderStatus (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), paymentStatus (`PENDING`, `PAID`, `FAILED`, `REFUNDED`), subtotalPaise, shippingPaise, discountPaise, totalPaise, shippingAddress snapshot.
   - `OrderItem`: Immutable snapshot of product title, SKU, variant title, unit price, quantity.
8. **Payment & WebhookEvent**:
   - `Payment`: Razorpay order ID, payment ID, signature, method, amountPaise, currency (`INR`), status.
   - `WebhookEvent`: Deduplication table recording processed webhook `event_id` to enforce idempotency.
9. **Content (Article, FAQ, Review, Promotion)**:
   - Articles for the gardening journal with linked products.
   - Verified customer reviews with rating, title, body, status (`APPROVED`, `PENDING`).
   - Promotions with discount type (`PERCENTAGE`, `FIXED`), code, validity dates, minimum order value.
10. **AuditLog**:
    - Complete record of sensitive administrative actions (price changes, inventory adjustments, order cancellations).

---

## 6. Financial & Inventory State Machines

### Order & Payment Lifecycle
```
[Cart] -> [Checkout Submission]
             │
             ▼ (Server validates cart & reserves inventory)
     [Create Razorpay Order]
             │
             ├── Customer completes payment modal
             │     │
             │     ▼
             │  [POST /api/payments/verify]
             │     ├─ Server verifies HMAC-SHA256 signature
             │     ├─ Verifies amount against database order
             │     ├─ Order status: CONFIRMED, Payment: PAID
             │     └─ Inventory reservation finalized
             │
             ├── Webhook received (payment.captured)
             │     ├─ Checks WebhookEvent deduplication
             │     ├─ Idempotently marks Order PAID if not already marked
             │     └─ Records Payment record
             │
             └── Customer cancels or payment fails
                   ├─ Order status: CANCELLED / FAILED
                   └─ Inventory released back to stock pool
```

---

## 7. Visual Design System & Palette

- **Warm Ivory (`--color-ivory`)**: `#F7F4EA` — Primary background canvas, evoking organic paper.
- **Forest Green (`--color-forest`)**: `#153F2D` — Primary brand color, headers, key buttons.
- **Sage Green (`--color-sage`)**: `#7D9565` — Secondary botanical accents, tags, highlights.
- **Restrained Terracotta (`--color-terracotta`)**: `#C87855` — Warm earthen accents, CTAs, sale badges.
- **Charcoal (`--color-charcoal`)**: `#282B25` — High-contrast, readable typography and borders.

### Typography
- **Headlines & Editorial**: Serif (`Fraunces` / `Playfair Display`), warm, distinctive, authoritative.
- **Body & Navigation**: Modern Sans (`Plus Jakarta Sans` / `Inter`), clean, legible, high clarity.

---

## 8. Security & Compliance Architecture

1. **Zero Client Trust**: All totals, discounts, inventory levels, and prices are strictly computed server-side.
2. **Payment Verification**: No order is marked `PAID` based on client redirects. Verification requires server HMAC-SHA256 check of `razorpay_order_id|razorpay_payment_id` against `RAZORPAY_KEY_SECRET`.
3. **Webhook Idempotency**: Webhook events are cryptographically verified and recorded in `WebhookEvent` table to prevent replay attacks and double-processing.
4. **Data Isolation**: Customer account endpoints enforce strict session ownership checks (`order.userId === session.user.id`).
5. **Admin Authorization**: Middleware and server functions verify `user.role === 'ADMIN'`. Non-admins are redirected to `/account/login` or returned `403 Forbidden`.
6. **Input Sanitation**: All user submissions are validated using strict Zod schemas.

---

## 9. Performance & SEO Architecture

1. **Next.js Server Components**: Minimal client JavaScript footprint, instant initial rendering.
2. **Next/Image Optimization**: WebP/AVIF delivery, correct aspect ratio bounding to eliminate Cumulative Layout Shift (CLS).
3. **Structured Data (Schema.org)**:
   - `Organization` & `WebSite` on home route.
   - `Product` with `Offer` and botanical attributes on `/products/[slug]`.
   - `BreadcrumbList` on catalog and product pages.
   - `Article` on journal guides.
4. **Metadata & Crawlability**:
   - Dynamic `sitemap.xml` and `robots.txt` configuration.
   - `noindex, nofollow` on private paths (`/cart`, `/checkout`, `/account/*`, `/admin/*`).
   - OpenGraph and Twitter card metadata for social sharing.

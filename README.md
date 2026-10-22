# Rootkind — Direct-to-Consumer Home-Growing E-Commerce Platform

> **"Grow good things at home."**  
> *Everything you need to grow your own vegetables, herbs and fruits, from your first seed to your first harvest.*

**Rootkind** is a high-performance, direct-to-consumer (D2C) botanical commerce platform engineered for urban balconies, terraces, windowsills, and home gardens. Designed with an editorial aesthetic inspired by premium botanical publications, the application provides an end-to-end commerce experience with real product data, customer authentication, shopping cart persistence, multi-step checkout, Razorpay payment verification, concurrency-safe inventory management, and a protected administration portal.

---

## Brand & Visual System

- **Warm Ivory (`#F7F4EA`)**: Foundation canvas evoking organic parchment paper.
- **Forest Green (`#153F2D`)**: Botanical brand anchor for navigation, headers, and primary conversion buttons.
- **Sage Green (`#7D9565`)**: Subdued botanical accents, badges, and tag highlights.
- **Terracotta (`#C87855`)**: Warm earthen pot tones for badges, highlights, and conversion triggers.
- **Charcoal (`#282B25`)**: High-contrast, WCAG-compliant body text.
- **Typography**: Expressive Serif (`Playfair Display` / Georgia) for editorial headlines, and clean Sans-Serif (`Inter` / system-ui) for body copy, product specs, navigation, and data tables.

---

## Technology Stack

- **Core**: Next.js App Router (React 19, Server Components by default)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS & CSS Variables design tokens
- **Component Primitives**: shadcn/ui & Radix UI
- **Icons**: Lucide React
- **Animations**: Motion (with full `prefers-reduced-motion` compliance)
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT sessions stored in secure, `HttpOnly` cookies with `bcryptjs` password hashing
- **Payments**: Razorpay Node SDK with HMAC-SHA256 signature verification & idempotent webhook processing
- **Validation**: Zod schema validation for all client and server boundaries
- **Testing**: Jest, Playwright end-to-end testing, and Google Lighthouse CI

---

## Route Overview

### Public Storefront
- `/` — Editorial homepage with announcement bar, hero, shop-by-category, bestsellers, starter kits, growing guide, journal articles, and footer.
- `/shop` — Complete product catalogue with category filters, difficulty filters, and price/rating sorting.
- `/collections/[slug]` — Filtered collection pages (e.g. `/collections/seeds`, `/collections/pots-planters`).
- `/products/[slug]` — Product details with multi-image gallery, variant pack size selector, stock indicator, growing specifications, and verified reviews.
- `/search` — Live product discovery search.
- `/about` — Editorial brand story, philosophy, and urban growing commitments.
- `/contact` — Customer care inquiry form and contact channels.
- `/journal` — Gardening guides and editorial articles.
- `/journal/[slug]` — Full-length gardening article.
- `/faq` — Searchable frequently asked questions accordion.

### Shopping & Checkout
- `/cart` — Full shopping cart view with quantity adjustments, subtotal breakdown, free-shipping threshold bar, and guest-to-customer persistence.
- `/checkout` — Secure multi-step checkout with delivery address selection, order review, server-side pricing recalculation, and Razorpay integration.
- `/order-confirmation/[id]` — Order receipt with itemized breakdown and delivery address.
- `/track-order` — Live order status tracker by order reference code.
- `/wishlist` — Customer saved items.

### Customer Account
- `/account/login` — Customer and administrator sign-in.
- `/account/register` — Customer registration with instant cart merging.
- `/account` — Account dashboard with recent orders and profile shortcuts.
- `/account/orders` — Complete customer order history.
- `/account/orders/[id]` — Detailed individual order receipt and status.
- `/account/addresses` — Saved shipping address management.
- `/account/profile` — Personal profile and security settings.

### Protected Administration (`/admin/*`)
- `/admin` — Executive dashboard with live revenue metrics, total orders, active customer counts, and low-stock alerts.
- `/admin/products` — Product catalog management (create, edit, publish, archive, manage variants and SKUs).
- `/admin/collections` — Category and collection taxonomy manager.
- `/admin/inventory` — Real-time stock audit and inventory adjustment logging.
- `/admin/orders` & `/admin/orders/[id]` — Order fulfillment workflow, status transitions (`CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`), and tracking ID assignment.
- `/admin/customers` — Customer directory with lifetime spend aggregates.
- `/admin/content` — Journal article and FAQ content manager.
- `/admin/settings` — Store configuration (announcement text, shipping fee threshold).

### Information & Policies
- `/shipping-policy` — Domestic delivery timeframes, rates, and courier partners.
- `/returns-refunds` — 7-day seed germination guarantee and replacement terms.
- `/privacy-policy` — Data handling, cookie policy, and user privacy rights.
- `/terms` — Commercial terms and conditions.

---

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL database (running locally or via Docker / cloud)

### 2. Installation
```bash
git clone <repository-url>
cd Rootkind
npm install
```

### 3. Environment Setup
Copy the `.env.example` file to create `.env`:
```bash
cp .env.example .env
```
Ensure your database connection string and secret keys are configured:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/rootkind?schema=public"
JWT_SECRET="your-secure-jwt-secret-at-least-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="rzp_secret_placeholder"
RAZORPAY_WEBHOOK_SECRET="rzp_webhook_placeholder"
```

### 4. Database Migration & Seeding
```bash
# Push schema to database
npx prisma db push

# Populate initial categories, products, articles, FAQs, and default admin
npm run db:seed
```

#### Default Administrator Credentials
- **Email**: `admin@rootkind.in`
- **Password**: `RootkindAdmin2026!`

---

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Production Build & Server
```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## Testing & Verification

### 1. TypeScript Strict Typecheck
```bash
npx tsc --noEmit
```
*Result: Zero errors.*

### 2. Code Quality & Linting
```bash
npx eslint src
```
*Result: Zero errors.*

### 3. Unit & Integration Tests
```bash
npm test
```
*Result: 7/7 test suites passing.*

### 4. Responsive Viewport Audit
```bash
npx ts-node scripts/test-responsive.ts
```
*Result: 100/100 tests passed with 0 horizontal overflow defects across viewports 320px to 1920px.*

### 5. Google Lighthouse Audits
```bash
# Desktop Homepage Audit
npx lighthouse http://localhost:3000 --preset=desktop --output=json --output-path=./lighthouse-desktop.json

# Desktop Product Detail Audit
npx lighthouse http://localhost:3000/products/pusa-ruby-heirloom-tomato --preset=desktop --output=json --output-path=./lighthouse-product.json

# Desktop Shop Audit
npx lighthouse http://localhost:3000/shop --preset=desktop --output=json --output-path=./lighthouse-shop.json
```

**Verified Desktop Scores (Target 90+)**:
- **Homepage**: Performance: **97** | Accessibility: **96** | Best Practices: **96** | SEO: **100**
- **Product Detail**: Performance: **96** | Accessibility: **96** | Best Practices: **96** | SEO: **100**
- **Shop Catalogue**: Performance: **98** | Accessibility: **95** | Best Practices: **96** | SEO: **100**

---

## Architecture & Documentation

- [System Architecture](docs/architecture.md) — Detailed domain boundaries, security model, and payment state machines.
- [Implementation Plan](docs/implementation-plan.md) — Step-by-step milestone delivery breakdown.
- [Acceptance Checklist](docs/acceptance-checklist.md) — Complete release gate acceptance record and audit metrics.

---

## License
Proprietary. All rights reserved by Rootkind.

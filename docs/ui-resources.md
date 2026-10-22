# Approved UI Resources & Design Architecture

**Project:** Rootkind Home-Growing Commerce  
**Version:** 1.0.0  
**Compliance Target:** WCAG 2.2 AA, < 30 KB gzipped effect bundle, zero render blocking  

---

## 1. Rule & Core Philosophy
**One component foundation, one animation engine, and a small set of copy-in effects. Everything else is inspiration only and is never installed.**

All visual styling adheres strictly to Rootkind design tokens defined via CSS variables:
- **Ivory (`#F7F4EA`)**: Warm, botanical surface background
- **Forest (`#153F2D`)**: Deep evergreen branding, primary buttons, header
- **Sage (`#7D9565`)**: Secondary botanical accent, leaf markers, subtle tints
- **Terracotta Decorative (`#C87855`)**: Warm ceramic accent (non-text/decorative only)
- **Terracotta Text (`#9A4F2E`)**: Darkened terracotta meeting WCAG AA 4.5:1 contrast
- **Charcoal (`#282B25`)**: High-contrast text & deep borders
- **Muted text (`#464A40`)**: Meets > 7:1 contrast on ivory backgrounds
- **Typography**: `Fraunces` for headlines (loaded via `next/font`), `Inter` for interface and body copy.

---

## 2. Production Foundation (Installed)

| Resource | Version | Role in Architecture | Licence | Rationale |
|---|---|---|---|---|
| **shadcn/ui** | Latest CLI / primitives | Core base component system (Button, Sheet, Dialog, Select, Tabs, Accordion, Table, Badge) | MIT | Zero-runtime CSS variables, fully accessible ARIA semantics, full local ownership of component code. |
| **Tailwind CSS** | 4.x (`@tailwindcss/turbopack`) | Utility and design token styling | MIT | Zero-runtime utility classes mapped directly to design tokens in `globals.css`. |
| **Lucide Icons** | `^1.61.0` | Storefront icon system | ISC | Crisp 24/20/16px vector botanical and commerce icons, tree-shakable. |
| **Motion** | `^14.6.0` | Animation engine | MIT | The only motion engine across the project. Used for accessible reveals, mobile drawer sliding, cart feedback, and accordion spring physics. |

---

## 3. Selective Copy-In Effects (Max 3 Allowed Across Entire Site)

No whole effect libraries are installed. Only 3 isolated, copy-in effects are utilized:

### Effect 1: Botanical Trust & Growing Tips Marquee
- **Source:** Inspired by Magic UI Marquee primitive (re-implemented in vanilla Tailwind/CSS tokens)
- **Licence:** MIT
- **Location:** Storefront announcement & value pillars
- **Why Chosen:** Provides continuous ambient reassurance (germination, seasonal sowing calendar, delivery terms) without layout jumping or heavy JS.
- **Accessibility & Guardrails:**
  - Fully accessible to screen readers using static DOM list structure.
  - Automatically pauses on hover, focus-visible, and respects `prefers-reduced-motion: reduce`.
  - Zero external JavaScript overhead (pure CSS keyframe animation).

### Effect 2: Product Card Botanical Hover Elevation & Quick Add Feedback
- **Source:** Custom micro-interaction inspired by Aceternity UI card hover
- **Licence:** MIT
- **Location:** `src/components/storefront/product-card.tsx`
- **Why Chosen:** Delivers tactile tactile elevation (`-translate-y-1` with shadow elevation) and affirmative button state change ("Added" badge) for instant customer confidence.
- **Accessibility & Guardrails:**
  - Works with keyboard focus (`focus-visible:ring-2 focus-visible:ring-[#153F2D]`) and mobile touch tap.
  - Animation duration: 200ms ease-out, disabled on `prefers-reduced-motion`.
  - Added JS impact: 0 KB (uses Tailwind transition utilities).

### Effect 3: Accessible Mobile Navigation Sheet Drawer
- **Source:** shadcn/ui Sheet (Radix/Dialog pattern)
- **Licence:** MIT
- **Location:** `src/components/layout/header.tsx`
- **Why Chosen:** Fluid slide-in drawer for screen widths `< 860px`, replacing congested mobile navbars with a structured botanical menu.
- **Accessibility & Guardrails:**
  - Full focus trapping via keyboard `Tab` loop.
  - `Escape` key dismissal.
  - `role="dialog"`, `aria-modal="true"`, body scroll locking.
  - Added JS impact: < 2 KB.

---

## 4. Excluded by Default

| Resource | Status | Technical Reason for Exclusion |
|---|---|---|
| **HeroUI** | **Excluded** | Competes with shadcn/ui; introduces duplicate component styles, proprietary theme wrappers, and bundle bloat. |
| **Lenis (Smooth Scroll)** | **Excluded** | Intercepts native browser scroll physics, degrades assistive-tech screen reading, disrupts keyboard PageUp/PageDown, and fails WCAG 2.2 smooth-scroll guidelines. |
| **Three.js & WebGL Shaders** | **Excluded on Storefront** | Massive runtime footprint (> 500 KB), drains mobile battery, and drastically hurts mobile LCP and INP metrics. |
| **Webflow / GetLayers / AI Template Tools** | **Reference Only** | Generates bloated, unmaintainable, non-semantic HTML with vendor lock-in. Never used as source code. |

---

## 5. Inspiration Only (Never Imported or Copied)

The following resources serve strictly for studying visual hierarchy, white space, typography rhythm, and interaction patterns:
- **Galleries:** Godly, Awwwards-style galleries, Dribbble, Inspo, Curated Design, Cuberto, Palmo, Pinterest botanical boards.
- **Design Prompts:** Used solely to explore art direction during early research.

### Guardrails
1. **Zero Asset Theft:** Never copy layouts, proprietary imagery, text copy, or branding from external references. All product images are custom-curated and stored locally.
2. **Bundle Budget:** Total added JavaScript for all UI effects remains strictly **under 30 KB gzipped**.
3. **Motion Restrictions on Commerce Flows:** Checkout, cart drawer, and payment verification utilize only simple, instantaneous feedback transitions (no lengthy or blocking animations).
4. **Reduced Motion:** Every animation includes `@media (prefers-reduced-motion: reduce)` fallbacks disabling transitions.

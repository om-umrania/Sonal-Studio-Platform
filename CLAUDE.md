# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

**V1 is built.** Next.js 16.2.7 app at repo root, fully static. All 5 pages built and passing production build.

The `Sonal Studio Platform Resources/` directory contains the full specification — consult it for copy, brand decisions, and future phases:
- `Sonal Studio Platform Resources/SONAL_STUDIO_AGENT_BUILD_PROMPT.md` — master build instructions and phase plan
- `Sonal Studio Platform Resources/SONAL_STUDIO_INFORMATION_ARCHITECTURE.md` — page structure and user journeys
- `Sonal Studio Platform Resources/SONAL_STUDIO_UI_DESIGN_SYSTEM.md` — colors, typography, motion, components
- `Sonal Studio Platform Resources/SONAL_STUDIO_COPY_DECK.md` — all website copy and CTA text

---

## Stack

- **Next.js** (App Router, TypeScript, static generation)
- **Tailwind CSS** for utility styling
- **Framer Motion** for all animations
- **No backend, CMS, auth, or payments in V1**

---

## Commands

```bash
npm run dev       # start dev server (use port 3003 — 3001/3002 often occupied)
npm run build     # production build
```

---

## Project Structure

```
src/
  app/
    layout.tsx          # fonts: Italiana, Cormorant Garamond, Manrope + root metadata
    globals.css         # Tailwind v4 @theme tokens — all brand tokens defined here
    page.tsx            # homepage: assembles all section components
    services/page.tsx
    gallery/page.tsx    # wraps GalleryClient (client component with filters + drawer)
    about/page.tsx
    contact/page.tsx
    sitemap.ts
    robots.ts
  components/
    layout/             # Navbar.tsx (sticky + mobile drawer), Footer.tsx
    sections/           # one file per homepage section
    gallery/            # GalleryClient.tsx — filter bar + grid + QuickViewDrawer
    ui/                 # Button, WhatsAppButton, Badge, SectionHeader, MotionReveal, DiamondDivider
  data/
    site.ts             # SITE constant — brand name, phone, Instagram, SEO keywords
    services.ts         # SERVICES array — four pillars with typed Service objects
    gallery.ts          # GALLERY_ITEMS + GALLERY_CATEGORIES
    faqs.ts             # FAQS array
  lib/
    whatsapp.ts         # WA object + whatsappLink() — single source for all wa.me links
    utils.ts            # cn() class helper
public/
  images/               # 56 sanitised photos (lowercase, hyphen-separated filenames)
```

---

## Architecture Rules

**Data flow:** `structured data file → reusable component → page composition`. Never hardcode repeated card content across pages.

**WhatsApp:** All WhatsApp URLs must be generated through `src/lib/whatsapp.ts`. Never hardcode `wa.me` links in components. Each service, gallery item, and contact prompt has a distinct pre-filled message.

**Pages in V1:** Only `/`, `/services`, `/gallery`, `/about`, `/contact`. Do not create per-product or per-category pages.

**Static generation:** Use `generateStaticParams` and avoid server-side data fetching unless strictly necessary.

---

## Design System

### Tailwind v4 — canonical class names
Tokens are in `globals.css` `@theme {}` and resolve to Tailwind utilities directly. **Always use canonical names:**
- `text-maroon` / `bg-maroon` (not `text-[var(--color-maroon)]`)
- `text-gold` / `border-gold` / `bg-gold`
- `bg-ivory`, `bg-cream`, `text-ink`, `text-muted`, `bg-whatsapp`
- `font-display` (Italiana), `font-editorial` (Cormorant italic), `font-body` (Manrope)
- `rounded-tag` / `rounded-btn` / `rounded-card` / `rounded-hero` / `rounded-pill`
- `shadow-soft` / `shadow-card` / `shadow-luxury` — always maroon-tinted, never `shadow-black`

| Token | Hex | Use |
|---|---|---|
| `--color-maroon` | `#6B1626` | Logo, headings, CTA, nav |
| `--color-wine` | `#4A0F1B` | Hero overlays, footer bg |
| `--color-gold` | `#B8893A` | Dividers, borders, icons |
| `--color-ivory` | `#F7F0E4` | Page background |
| `--color-cream` | `#FFF9EF` | Cards, drawers, modals |
| `--color-ink` | `#2A2118` | Body text |
| `--color-muted` | `#7A6A5A` | Captions, secondary text |
| `--color-whatsapp` | `#1F7A4D` | WhatsApp CTA |

No emojis anywhere — use Unicode symbols (✦ ✉ ✂) or SVG icons.

### Typography
- **Display:** Italiana / Cormorant Garamond / Playfair Display
- **Body/UI:** Manrope / Inter
- **Editorial accent:** Cormorant Garamond italic

### Motion (Framer Motion)
- Section reveal: 500–800ms fade-up
- Hero reveal: 900–1200ms
- Card hover: 250–350ms
- Modal/drawer: 300–450ms
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Desktop gallery/service cards: 3D tilt (rotateX/Y from cursor), translateY −6 to −10px, image scale 1.04–1.08, gold border glow
- Mobile: no cursor tilt; tap opens quick-view bottom sheet
- Always respect `prefers-reduced-motion`

---

## Content Rules

1. Use copy **only** from `SONAL_STUDIO_COPY_DECK.md` — do not invent UI text.
2. **Never invent pricing, testimonials, or reviews.**
3. Do not claim full wedding planning — use "wedding consultation" and "celebration styling guidance."
4. Every WhatsApp CTA must have a pre-filled message specific to its context.
5. Gallery items need category chip, occasion tag, and short description.
6. FAQ content must be in semantic HTML (not hidden in images) for SEO.

---

## SEO / Metadata

Each page needs its own `metadata` export. Target phrases:
- `Sonal Studio Nagpur`, `celebration styling Nagpur`, `wedding consultation Nagpur`, `custom blouse Nagpur`, `pooja thali handmade Nagpur`, `kalash decor Nagpur`

Include `sitemap.ts` and `robots.ts` in the app root.

---

## Phase Status

- **Phases 1–4 complete** — foundation, homepage, supporting pages, animations, SEO
- **Phase 5 pending** — curate real photos per gallery item, add proper `alternateImages`, add testimonials when real. The `alternateImages` field is commented out in `gallery.ts` (`GalleryItem` type) — uncomment and populate when ready.

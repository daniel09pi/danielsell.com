# Portfolio 2.0 — Design & Build Plan

---

## Concept

**"Black Editorial"**

Where the current site leans into retro Apple warmth (cream, serif, rounded),
this version goes the opposite direction: stark, dark, typographic, confident.
Think high-end design studio meets editorial magazine. The kind of portfolio
a creative director at a top agency would have. Clean to the point of being
almost uncomfortable — but with small moments of personality that make it memorable.

No gimmicks. Just strong typography, good spacing, and intentional motion.

---

## Visual Identity

### Colors
- Background: `#0C0C0C` (near-black, not pure black — warmer)
- Surface: `#141414` (slightly lifted panels)
- Text primary: `#F0EDE6` (warm off-white, not harsh)
- Text secondary: `#6B6B6B` (muted for labels/metadata)
- Accent: `#D4A853` (warm gold — one single accent color, used sparingly)
- Border: `#222222`

### Typography
- Display / Headings: **"Space Grotesk"** (Google Fonts — free, geometric grotesque
  with slightly quirky details that feel designed, not generic)
- Body: **"EB Garamond"** (keep the existing font — it creates a nice contrast
  between the cold grotesque headings and the warm serif body text)
- Sizes: Go big. Hero name should be massive (clamp between 80px–180px).
  Labels small. Contrast between sizes is the design.

### Motion
- Scroll-driven reveals: text lines slide up (translateY + opacity) on enter
- No auto-playing carousels — user-controlled
- Cursor: custom small dot cursor that scales up on hover over interactive elements
- Transitions between sections: smooth fade + subtle upward shift (no snap-scroll —
  free scroll with sticky section headings)
- Project image hover: slight scale + a color overlay fade

### Texture
- Subtle noise/grain overlay on the background (CSS SVG filter or static PNG at 3% opacity)
  — makes dark backgrounds feel premium, not flat

---

## Layout & Sections

### Navigation
- Fixed top bar, extremely minimal
- Left: small "DS" monogram
- Right: text links (about / work / skills / contact), no active underline —
  just opacity shift on active
- On scroll down: bar compresses slightly (font-size shrinks via CSS transition)

---

### 01 — Hero
- Full viewport
- Giant name split across two lines:
  ```
  DANIEL
  SELL
  ```
  Each word a different weight — "DANIEL" light (300), "SELL" bold (700)
- Below: one line of roles in small caps, muted:
  `Graphic Designer  ·  Brand Identity  ·  Web Developer`
- Bottom-left: scroll indicator (small arrow + "scroll" text, fades out after first scroll)
- Bottom-right: availability status badge — small pill: `● Available for projects`
- NO typewriter effect — the name just sits there, heavy. Maybe a single entrance animation
  on load (letters animate in from below, staggered).

---

### 02 — Work (Design Portfolio)
- Section label: small all-caps `02 — SELECTED WORK` pinned top-left
- Layout: asymmetric CSS grid — 2 columns but mixed heights
  ```
  [ large ]  [ small ]
  [ small ]  [ large ]
  [ wide spanning two cols ]
  ```
- Each project card:
  - Image fills card (object-fit: cover), slight border-radius (4px — barely there)
  - On hover: image darkens, project name + one-line description fades in over it
  - On click: full-screen overlay with image carousel + project info sidebar
- Projects: alukeku, landeshut, stooney, project500, bookcover (same as before)
- No thumbnail sidebar — the grid IS the navigation

#### Project Overlay (replaces current carousel)
- Covers full screen with dark overlay
- Left 65%: image carousel, arrow keys / click to navigate
- Right 35%: project title, description, close button (×)
- Image dots at bottom of carousel area
- ESC or click outside to close

---

### 03 — About
- Two columns, 50/50
- Left: the photo of Daniel with the lama — full height, object-fit cover, slight rounded corners
  - Small caption underneath
- Right: text content, scrollable if needed
  - "about me", "about this site", "about designing" — keep the same personal, honest voice
  - No h3 headings per block — just a leading bold line in the paragraph itself
- Section number + label top-right

---

### 04 — Skills
- Clean typographic list — NO rotating orbit logos
- Two columns side by side:
  - Left: Design Skills
  - Right: Dev Skills
- Each skill is just text, large-ish (20px), with a small `—` dash prefix
- On hover over a skill: the matching logo PNG appears as a ghost image
  (position: absolute, low opacity, follows the hovered item) — subtle, fun
- Section number + label top-left

---

### 05 — Contact / Hire Me
- Left side: the big pitch text (large, editorial)
  ```
  Let's
  work.
  ```
  Below: short paragraph (same pricing/availability info, tightened up)
- Right side: the contact form (same fields: message + contact method + send)
- Below the form: other contact options as simple text links
- The lottie dog animation: keep it, place it small somewhere playful
  (maybe bottom-right corner of this section, or peeking in from the right edge)

---

## Technical Stack

- **Vanilla HTML / CSS / JS** — no build system, no frameworks (same as v1)
- **No Bootstrap** — custom grid using CSS Grid and Flexbox only
- **CSS Custom Properties** for the entire design token system (colors, spacing, type)
- **Google Fonts**: Space Grotesk (loaded via `<link>`) + EB Garamond already local
- **Intersection Observer API** for scroll-triggered animations (no library)
- **No jQuery** — plain JS only
- **PHP contact form** (`send.php`) — reuse as-is
- File/asset structure stays identical (`portfolio_files/...`)

---

## File Structure

```
portfolio2.0/
├── index.html
├── styles.css
├── script.js
├── send.php          (reuse unchanged)
├── portfolio_files/  (reuse unchanged — all images/assets)
├── files/            (reuse unchanged)
└── newportfolio-plan.md
```

---

## What Makes This Good

| Quality | How it's achieved |
|---|---|
| **Unique** | Dark editorial aesthetic is completely opposite to v1; asymmetric project grid; ghost logo hover |
| **Taste** | Restrained color palette (1 accent only); EB Garamond + Space Grotesk pairing; generous whitespace |
| **Fun** | Custom cursor; lottie dog stays; ghost logo hover on skills; big type contrast |
| **Professional** | No decorative clutter; clear hierarchy; project overlays feel like a real studio site |
| **Minimalist** | No borders everywhere, no stroke box, no gradient overlays, no nav sidebar nav buttons; content speaks for itself |

---

## Things Deliberately Removed from v1

- The cream/navy stroke box that frames everything
- The snap-scroll with up/down nav buttons
- The custom scrollbar on text panels
- The typewriter hero
- The orbiting logo animation (replaced with ghost hover)
- Bootstrap dependency
- The mobile "too ugly" warning (will actually make it responsive)

---

## Open Questions / Decisions

- [ ] Mobile: proper responsive layout (stack everything, hamburger or just stacked nav)
- [ ] Decide final accent color (gold `#D4A853` vs cool electric blue `#4F7FFF`)
- [ ] Project overlay: should it push content or layer over it?
- [ ] Add "code projects" section alongside design? (flowinsync, etc.)


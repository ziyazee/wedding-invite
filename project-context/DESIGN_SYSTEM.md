# Design System

## Color Palette

### Landing Page
- Background: warm ivory `#F8F6F1` with textured background
- Accent: gold
- Card finish: glossy template covers
- Phone surround: textured ivory/gold botanical

### Client Dashboard Theme
Centralized tokens in `src/pages/ClientDashboard.css`:

| Token | Color | Usage |
|-------|-------|-------|
| Primary (sage) | `#354C43` | Primary actions, active states |
| Background (ivory) | `#F8F6F1` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Accent (champagne) | `#D5BD91` | Premium badges, decorative |
| Text | Charcoal | Body text |
| Border | Warm neutral | Borders, dividers |

**Badge exceptions:**
- Discount badges: yellow `#FFDA63` with dark text
- Premium badges: purple `#64349A` with white text

### Invitation Themes
Each template has its own palette. Key colors from `api/og.tsx`:
- Royal Grace: warm ivory `#f5f0e8`, sage `#8b9274`
- Majestic: deep champagne `#30200c`, gold `#d4a843`
- A Timeless Union: deep navy `#1a2744`, gold `#d4a843`
- Mandap at Dusk: terracotta `#2d1810`, `#e8985a`
- Secret Garden: deep sage `#2d4a3e`, `#c8b87a`

### Public Invitation Shell
- Background: `#fffaf2` (warm ivory)
- Text: `#75664c` (warm brown)
- Loading state: `#fffaf2` background

## Typography

### Font Loading Strategy
- `SiteFonts.tsx` loads Google Fonts for site pages and legacy templates
- Native templates (Royal Grace, Majestic) use their own fonts from CSS
- Font set: Cormorant Garamond, Playfair Display, Lora, Inter, Space Grotesk, Great Vibes, Quicksand

### Text Reveal Animation
Shared visual direction across all 8 catalog designs: **fade in while rising from below**, with no character or line stagger. Each template preserves its own opening sequence and reduced-motion behavior.

## Spacing and Layout

### Dashboard Phone Preview
- Preview dimensions: 402 × 874 (9:16-like ratio)
- Scaled by ResizeObserver
- Bottom-right resize handle
- Desktop phone width calculated from viewport height

### Invitation Viewport (Desktop)
- Portrait frame: `min(100vw, 56.25svh)` × `min(100svh, 177.7778vw)`
- Background: `#f7f4ee`
- Shadow: `0 0 32px #40352512`

### Responsive Approach
- Mobile-first design
- Landing CSS uses successive responsive overrides
- Templates define their own breakpoints
- Phone preview preserves 402:874 viewport across resize

## Component Styling Conventions

### CSS Approach
- **Tailwind CSS 4** for new application styles
- **Scoped CSS files** (`.css`) for template-specific styles
- **CSS variables** for text overrides (size, position, font, color)
- Template CSS uses namespaced prefixes: `d18-` for Mandap at Dusk, `atelier-*` for personalized sections

### Animation Principles
- Opening interactions: tap-to-start (music, scroll unlock)
- Parallax: cached measurements + requestAnimationFrame
- Carousel: duplicate edge slides for smooth looping
- Reduced motion: respected per template
- No per-scroll layout reads competing with scroll transforms
- Video: metadata preload by default, explicit poster for opening

### Text Fitting Rules
Templates use standardized fitting rules (documented in `PROJECT_CONTEXT.md`):
- **Names Fit**: Character threshold → linear size reduction → width check → wrap at words
- **Safe Text Area**: Keep text inside artwork plain areas
- **Card Content Fit**: Character limits (40/60/100 for title/venue/address), font reduction, card growth
- Each template defines its own thresholds and minimums

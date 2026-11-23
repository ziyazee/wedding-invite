# Taj Template — Asset Manifest

> Complete catalog of all visual assets required for the Taj Muslim wedding invitation template.
> Status: EXISTS = already built, NEEDED = must be created, UPDATE = exists but needs changes.
> Source of truth: `design-bible.md` and `section-blueprints.md`.

---

## SVG Assets

### 1. MughalArch

| Field | Value |
|-------|-------|
| **File** | `assets/MughalArch.tsx` |
| **Status** | UPDATE |
| **Used in** | Couple (photo frame), Celebrations (event card headers), Gallery (alternate arch frames) |
| **Description** | Pointed Mughal arch (iwan shape). Two quadratic bezier curves meeting at a pointed apex at ~1.3x the width. Double-stroke: outer frame at 2px, inner at 1px. Keystone ornament at apex. Side filigree lines in the straight portions. |
| **Props** | `className?: string` |
| **CSS variables** | `--tj-gold` (strokes, keystone fills) |
| **Implementation notes** | The current version uses a rounded quadratic curve (`Q40 20 200 20`) which produces a semicircular dome rather than a *pointed* arch. The design bible specifies a pointed arch: the two curves should meet at a slight point at center-top, not a smooth dome. **Update needed**: Change the bezier control points so the apex is pointed (two curves meeting at ~y=15-20 with a visible angle). Also: the component needs a `variant` or `size` prop to support three distinct use cases: (1) **couple-frame** — 320x420px, 2px outer stroke, clip-path generation for photo masking; (2) **event-card-header** — 354x60px wide/short arch spanning the top of event cards; (3) **gallery-frame** — 171x228px for portrait gallery images. Consider splitting into separate components if the shapes diverge too much, or use a `variant` prop. The current viewBox (0 0 400 500) works for the couple frame but not for the wide event card header arch. |

### 2. CrescentMoon

| Field | Value |
|-------|-------|
| **File** | `assets/CrescentStar.tsx` |
| **Status** | UPDATE |
| **Used in** | Opening (upper-right, animated glow pulse), Closing (centered, small, with 3 stars), Dua/Countdown divider (tiny 12px center motif) |
| **Description** | A crescent moon formed by two overlapping circles (one clipped). The current version includes a single 5-pointed star. Design bible calls for: (a) the crescent with an optional glow filter (`feGaussianBlur`), (b) variable number of companion stars (0, 1, or 3), and (c) size variation from 12px (divider motif) to 80px+ (Opening section). |
| **Props** | `className?: string`, `size?: number` |
| **CSS variables** | `--tj-gold` (crescent fill, star fill) |
| **Implementation notes** | **Updates needed**: (1) Add an optional SVG `<filter>` for the glow effect (used in Opening — `--tj-glow-moon: 0 0 40px rgba(232, 228, 216, 0.12)`). The filter should be toggleable via a `glow?: boolean` prop. (2) Add a `stars?: number` prop (0, 1, or 3) to control companion stars. When `stars=3`, position them scattered around the crescent. (3) The crescent shape itself is fine. (4) Rename to `CrescentMoon` for clarity (the star is optional, not guaranteed). Export both names from index.ts for backward compat. |

### 3. FourPointStar

| Field | Value |
|-------|-------|
| **File** | `assets/FourPointStar.tsx` |
| **Status** | NEEDED |
| **Used in** | Opening (4-6 sparkles, twinkle animation), Countdown (centered decorative sparkle), section dividers (center motif between Couple/Dua) |
| **Description** | A simple 4-pointed star sparkle. Four elongated diamond points radiating from a center point, like a light sparkle or compass rose. NOT a 4-pointed polygon (square rotated 45deg) — the points should be narrow and elongated like a light flare. |
| **Props** | `className?: string`, `size?: number` (default 16) |
| **CSS variables** | `--tj-gold` (fill), `--tj-highlight` (optional bright center for sparkle effect) |
| **Implementation notes** | Simple SVG: 4 elongated triangular points meeting at center. Add a tiny bright circle at the center (`--tj-highlight`). Should work at sizes from 8px (divider motif) to 24px (countdown decoration). Keep the path count minimal — this will be instantiated 4-6 times in the Opening for the twinkle animation (`opacity` cycling 0.3-1.0 on 2-5s staggered intervals). Use `currentColor` or CSS variable for easy color overrides. |

### 4. JaliPattern

| Field | Value |
|-------|-------|
| **File** | `assets/JaliPattern.tsx` |
| **Status** | NEEDED |
| **Used in** | Dua (background overlay at 4% opacity), Celebrations (background overlay at 3% opacity) |
| **Description** | An 8-pointed star interlocking geometric lattice pattern. The tile unit is a single 8-pointed star inscribed in a 40x40px square. Thin gold strokes on transparent background. Rendered as an SVG `<pattern>` element that tiles infinitely. The 8-pointed star is formed by overlaying two squares rotated 45 degrees, with interconnecting lines forming the characteristic Islamic geometric lattice. |
| **Props** | `className?: string`, `opacity?: number` (default 0.04), `tileSize?: number` (default 40) |
| **CSS variables** | `--tj-gold` (pattern strokes) |
| **Implementation notes** | Must use `<svg>` with a `<defs><pattern>` containing the tile geometry, then a `<rect>` filling the full area with that pattern. Use `patternUnits="userSpaceOnUse"` for efficient tiling (per performance guidelines). The pattern tile: draw an 8-pointed star using two overlapping squares (one axis-aligned, one rotated 45deg) with connecting lines at the intersection points. Stroke width: 0.5-0.75px at 40px tile size. The component should render a full-bleed SVG that covers its parent container (width/height 100%, `position: absolute`). The parent section applies the opacity. Keep total path complexity low — this repeats across large areas. |

### 5. OrnamentalDivider

| Field | Value |
|-------|-------|
| **File** | `assets/OrnamentalDivider.tsx` |
| **Status** | NEEDED |
| **Used in** | Every section heading (30% width, small center node), between all sections as transition dividers, Opening (40% width below names) |
| **Description** | A horizontal gold line with a central decorative node. The design bible specifies 5 distinct divider variations used between sections, plus a simpler version under each section heading. The central motif varies: 4-pointed star, tiny crescent, dome silhouette, diamond, or rose. |
| **Props** | `className?: string`, `motif?: 'star' \| 'crescent' \| 'dome' \| 'diamond' \| 'rose' \| 'none'` (default `'diamond'`), `width?: string` (CSS width, default `'40%'`) |
| **CSS variables** | `--tj-gold` (line stroke, motif stroke/fill) |
| **Implementation notes** | The divider is a single SVG with a horizontal line and a centered motif element. The line should be 1px stroke. The motif sits at the horizontal center, interrupting the line (the line has a gap where the motif sits). Motif sizes: star=12px, crescent=12px, dome=20px wide, diamond=8px, rose=12px. `none` gives just the line. The viewBox should be wide (e.g., `0 0 200 20`) with `preserveAspectRatio="xMidYMid meet"` so the component scales to the CSS width. The 5 between-section variations per the blueprints: (1) Couple/Dua: star, 50% width; (2) Dua/Countdown: crescent, 40%; (3) Countdown/Celebrations: dome, 60%; (4) Celebrations/RSVP: diamond, 40%; (5) Gallery/Closing: rose, 40%. The section-heading version: diamond or none, 30%. The Opening divider below names: none (plain line), 40%. |

### 6. GeometricBorder

| Field | Value |
|-------|-------|
| **File** | `assets/GeometricBorder.tsx` |
| **Status** | EXISTS — review for relevance |
| **Used in** | Not directly specified in blueprints |
| **Description** | Currently: a repeating diamond pattern in a horizontal band with top/bottom hairlines. 15 diamond units across a 600-wide viewBox. |
| **Props** | `className?: string` |
| **CSS variables** | `--tj-gold` (diamond strokes, center dots, hairlines) |
| **Implementation notes** | The design bible does not call for this specific pattern. The section blueprints use `OrnamentalDivider` (simple line + center motif) rather than a full geometric border band. This component may be useful as an optional decorative element (e.g., framing the Couple section or as a bottom border on the Opening overlay), but it is not in the core blueprint. **Keep but deprioritize** — the React Engineer can use it if a section needs extra ornamentation. No updates needed to the SVG itself. |

### 7. Arabesque

| Field | Value |
|-------|-------|
| **File** | `assets/Arabesque.tsx` |
| **Status** | UPDATE |
| **Used in** | Design bible lists "Arabesque scroll — short vine segment for corner ornaments." Couple section (corner ornaments around arch frame), RSVP (decorative framing around form panel) |
| **Description** | A flowing vertical vine with paired leaves and small rosette dots. Currently a tall format (200x300 viewBox) with S-curve vine and 3 pairs of leaves fading in opacity. |
| **Props** | `className?: string`, `flip?: boolean` |
| **CSS variables** | `--tj-gold` (vine stroke, leaf fills, rosette dots) |
| **Implementation notes** | The current implementation is a reasonable vine/scroll but may be too tall/narrow for corner ornament use. **Updates needed**: (1) Consider adding a `variant` prop: `'corner'` for a short L-shaped vine fitting into a corner (e.g., 80x80 viewBox), and `'vertical'` for the current tall format. (2) The corner variant should curve from bottom to right (or use `flip`/`rotate` to place in any corner). (3) Leaf opacity should be slightly higher for the corner variant (the current 0.15-0.25 range may be too faint at small sizes). (4) The `flip` prop currently uses `scaleX(-1)` which works for horizontal mirroring but corners also need `scaleY(-1)` — consider a `rotation?: 0 \| 90 \| 180 \| 270` prop instead. |

### 8. RoseMotif

| Field | Value |
|-------|-------|
| **File** | `assets/RoseMotif.tsx` |
| **Status** | UPDATE |
| **Used in** | Couple (mirrored pair at arch frame corners, 48px each), RSVP (mirrored pair below form panel), Gallery/Closing divider (center motif at ~12px) |
| **Description** | Currently: a symmetrical rosette made of 8 overlapping ellipses (4 outer + 4 inner) with a gold center dot. Fills use `--tj-rose`. |
| **Props** | `className?: string`, `size?: number` (default 60) |
| **CSS variables** | `--tj-rose` (petal fills), `--tj-gold` (center) |
| **Implementation notes** | The current version is a top-down rosette. The design bible specifies **"Stylized single roses drawn in gold stroke (no fill or muted --tj-rose fill)"** in the style of Mughal miniature painting gul (rose). **Updates needed**: (1) The design bible says "gold stroke" as the primary treatment, with optional muted rose fill. The current version uses filled ellipses with no visible stroke — needs stroke-first approach. (2) Should look like a side-view stylized rose (like a Mughal miniature rose), not a top-down geometric rosette. The current shape reads more as a mandala than a rose. (3) Add a `flip?: boolean` prop for horizontal mirroring (the Couple section uses mirrored pairs flanking the arch). (4) The `size` prop is good. (5) The divider motif variant needs to work at 12px — at that size, simplify to just a small stylized 3-petal bud shape. Consider a `variant?: 'full' \| 'bud'` prop. |

### 9. DomeSilhouette

| Field | Value |
|-------|-------|
| **File** | `assets/DomeSilhouette.tsx` |
| **Status** | NEEDED |
| **Used in** | Closing (200x160px watermark at 8% opacity, centered behind text), Countdown/Celebrations divider (tiny 20px center motif) |
| **Description** | A simplified Taj Mahal dome profile: bulbous onion dome sitting on a cylindrical drum, topped by a lotus finial and crescent-tipped spire. Just the dome silhouette — not the full building. The shape should be recognizably "Taj dome" in a single glance. |
| **Props** | `className?: string`, `size?: number` (default 200) |
| **CSS variables** | `--tj-gold` (fill/stroke) |
| **Implementation notes** | The profile from bottom to top: (1) a horizontal base line (the drum platform), (2) a short cylindrical drum, (3) the bulbous onion dome curving up and in, (4) a narrow neck, (5) a lotus finial (small inverted bulb), (6) a thin spire, (7) a tiny crescent at the very top. Draw as a single filled path or a stroked outline. For the Closing section watermark, it renders at 200px wide and 8% opacity — so it must read clearly even when very faint. For the divider motif, it renders at ~20px wide — simplify to just dome + spire + crescent (drop the drum detail). Consider a `simplified?: boolean` prop, or just make the SVG clean enough that it reads at both sizes. The existing `MinaretSilhouette` has a dome top section that could inform this, but the DomeSilhouette is specifically the Taj's main dome, which is rounder and more ornate. |

### 10. ScrollIndicator

| Field | Value |
|-------|-------|
| **File** | `assets/ScrollIndicator.tsx` |
| **Status** | NEEDED |
| **Used in** | Opening (bottom 5%, gentle opacity pulse) |
| **Description** | A thin downward-pointing chevron. Minimal: just two angled lines forming a "V" or small down-arrow. Gold, 1px stroke. |
| **Props** | `className?: string`, `size?: number` (default 24) |
| **CSS variables** | `--tj-gold` (stroke) |
| **Implementation notes** | Very simple SVG: two lines forming a chevron/V pointing down. Stroke: 1px, `--tj-gold`. The animation (gentle opacity pulse) is handled in CSS, not in the SVG itself. Hidden in edit mode. Keep it dead simple — this is a UI hint, not a decorative element. Could even be a pure CSS element, but SVG keeps it consistent with the asset system. |

### 11. MinaretSilhouette

| Field | Value |
|-------|-------|
| **File** | `assets/MinaretSilhouette.tsx` |
| **Status** | EXISTS — low priority |
| **Used in** | Not directly specified in section blueprints |
| **Description** | A vertical minaret tower with dome top, finial, tower body, three balcony rings, and a wider base. Very faint (opacity 0.08-0.15). |
| **Props** | `className?: string` |
| **CSS variables** | `--tj-gold` (all elements) |
| **Implementation notes** | The reference analysis mentions minarets as "vertical border elements, section pillars" but the section blueprints do not place minarets in any specific section. **Keep as-is** — may be used as optional vertical framing for the desktop viewport wrapper or as subtle side decorations. No updates needed. Low priority for the initial build. |

### 12. EventCardArch

| Field | Value |
|-------|-------|
| **File** | `assets/EventCardArch.tsx` |
| **Status** | NEEDED |
| **Used in** | Celebrations (top of each event card, 354x60px) |
| **Description** | A wide, shallow pointed arch shape spanning the top of an event card. This is NOT the same proportions as the couple photo arch — it is wide and short (card-width, ~60px tall) with the event name text positioned inside the arch area. The arch serves as a decorative header cap for the card. |
| **Props** | `className?: string`, `highlight?: boolean` (for Nikah card gold-gradient treatment) |
| **CSS variables** | `--tj-gold` (stroke), `--tj-gold-gradient` (fill when `highlight=true`), `--tj-navy-mid` (fill area inside arch when not highlighted) |
| **Implementation notes** | This is distinct enough from `MughalArch` to warrant its own component. The couple arch is tall and narrow (320x420); the event card arch is wide and shallow (354x60). The arch sits at the top of a card, so the bottom edge is open (it transitions seamlessly into the card body below). Draw the arch as two curves meeting at a pointed center-top, with vertical sides extending down to the card edge. Fill inside the arch with a slightly darker shade or `--tj-navy-mid`. When `highlight=true` (Nikah card), apply the `--tj-gold-gradient` as the stroke and increase stroke width to 2px. SVG viewBox: approximately `0 0 354 60`. |

---

## Raster Assets

### 1. Video Poster

| Field | Value |
|-------|-------|
| **File** | `public/templates/tajmahal/assets/poster.webp` (or similar path) |
| **Status** | NEEDED (check if already exists in template assets) |
| **Format** | WebP |
| **Target size** | < 100KB |
| **Dimensions** | 1080x1920 (9:16 portrait, matching video) |
| **Description** | Final frame of the opening video (`opening.mp4`). This is the static fallback when video cannot play and the background image for edit mode. Shows the Taj Mahal at night with the crescent moon and reflecting pool. |
| **Notes** | Per project rules: background videos must provide a poster. Extract from the final frame of the existing video file. Optimize to WebP with quality ~80. |

### 2. Marble Texture Tile (Optional)

| Field | Value |
|-------|-------|
| **File** | `public/templates/tajmahal/assets/marble-grain.webp` |
| **Status** | NEEDED (optional, can defer) |
| **Format** | WebP |
| **Target size** | < 50KB |
| **Dimensions** | 200x200px, seamlessly tileable |
| **Description** | Subtle marble grain texture. Applied globally at 3% opacity (`--tj-texture-opacity`) as a fixed pseudo-element on the invitation container. Adds tactile depth to the flat navy backgrounds. |
| **Notes** | This is a "nice to have" enhancement. The template works without it. If included, test that it does not cause visible tiling seams and that the 3% opacity keeps it subliminal. Keep under 50KB. |

---

## Google Fonts

Three font families are required, loaded by the template itself (not via SiteFonts, per project performance rules for native templates):

| Font | Weights | Role | Load string |
|------|---------|------|-------------|
| **Cormorant Garamond** | 300, 300i, 400, 500, 600 | Display, couple names, section headings, English translation | `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300` |
| **Amiri** | 400, 700 | Arabic text (Bismillah, Dua) | `Amiri:wght@400;700` |
| **Outfit** | 300, 400, 500 | Body text, labels, event details, form elements | `Outfit:wght@300;400;500` |

**Load strategy**: Construct a single Google Fonts URL combining all three families. Use `font-display: swap` for all. The template manages its own font loading (does not use `SiteFonts`).

**Combined URL**:
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Amiri:wght@400;700&family=Outfit:wght@300;400;500&display=swap
```

---

## Assets That Need Updates (Summary)

| Asset | What to change | Priority |
|-------|---------------|----------|
| **MughalArch** | (1) Make the arch *pointed* instead of rounded dome. (2) Add `variant` prop or split into separate components for couple-frame (320x420), event-card-header (354x60), and gallery-frame (171x228) use cases. | HIGH |
| **CrescentStar** | (1) Add `glow?: boolean` prop with SVG filter. (2) Add `stars?: number` prop (0/1/3). (3) Consider rename to `CrescentMoon`. | MEDIUM |
| **RoseMotif** | (1) Redesign from top-down rosette to side-view stylized Mughal rose with gold stroke treatment. (2) Add `flip?: boolean`. (3) Add `variant?: 'full' \| 'bud'` for divider use. | HIGH |
| **Arabesque** | (1) Add `variant?: 'corner' \| 'vertical'` for corner ornament use case (80x80). (2) Consider rotation prop for all four corners. | LOW |

---

## New Assets Needed (Summary)

| Asset | Priority | Complexity |
|-------|----------|------------|
| **FourPointStar** | HIGH | Low — simple 4-point sparkle shape |
| **JaliPattern** | HIGH | Medium — requires correct 8-pointed star geometry in `<pattern>` |
| **OrnamentalDivider** | HIGH | Medium — 6 motif variations, line-gap-motif-gap-line layout |
| **DomeSilhouette** | MEDIUM | Medium — recognizable Taj dome profile path |
| **EventCardArch** | MEDIUM | Low — wide shallow arch, simpler than MughalArch |
| **ScrollIndicator** | LOW | Trivial — two lines forming a chevron |

---

## Full Asset Checklist

| # | Component | File | Status | Priority |
|---|-----------|------|--------|----------|
| 1 | MughalArch | `assets/MughalArch.tsx` | UPDATE | HIGH |
| 2 | CrescentMoon | `assets/CrescentStar.tsx` | UPDATE | MEDIUM |
| 3 | FourPointStar | `assets/FourPointStar.tsx` | NEEDED | HIGH |
| 4 | JaliPattern | `assets/JaliPattern.tsx` | NEEDED | HIGH |
| 5 | OrnamentalDivider | `assets/OrnamentalDivider.tsx` | NEEDED | HIGH |
| 6 | GeometricBorder | `assets/GeometricBorder.tsx` | EXISTS | LOW (keep, deprioritize) |
| 7 | Arabesque | `assets/Arabesque.tsx` | UPDATE | LOW |
| 8 | RoseMotif | `assets/RoseMotif.tsx` | UPDATE | HIGH |
| 9 | DomeSilhouette | `assets/DomeSilhouette.tsx` | NEEDED | MEDIUM |
| 10 | EventCardArch | `assets/EventCardArch.tsx` | NEEDED | MEDIUM |
| 11 | ScrollIndicator | `assets/ScrollIndicator.tsx` | NEEDED | LOW |
| 12 | MinaretSilhouette | `assets/MinaretSilhouette.tsx` | EXISTS | LOW (keep as-is) |

**Total**: 12 SVG assets (6 exist, 4 updates needed, 6 new to create)

---

## Updated `index.ts` Exports (after all assets built)

```ts
export { default as MughalArch } from './MughalArch'
export { default as CrescentMoon } from './CrescentMoon'
export { default as CrescentStar } from './CrescentMoon'  // backward compat alias
export { default as FourPointStar } from './FourPointStar'
export { default as JaliPattern } from './JaliPattern'
export { default as OrnamentalDivider } from './OrnamentalDivider'
export { default as GeometricBorder } from './GeometricBorder'
export { default as Arabesque } from './Arabesque'
export { default as RoseMotif } from './RoseMotif'
export { default as DomeSilhouette } from './DomeSilhouette'
export { default as EventCardArch } from './EventCardArch'
export { default as ScrollIndicator } from './ScrollIndicator'
export { default as MinaretSilhouette } from './MinaretSilhouette'
```

---

*This manifest is the implementation guide for building all Taj template visual assets. The React Engineer should build/update assets in priority order (HIGH first), using the design bible tokens and the descriptions above as the spec.*

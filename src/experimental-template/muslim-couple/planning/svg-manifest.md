# Muslim Couple Template -- SVG Asset Manifest

Complete catalog of all inline SVG React components produced for the template.

---

## Directory Structure

```
src/experimental-template/muslim-couple/assets/svg/
  index.ts                 -- Barrel export
  MughalArch.tsx           -- Pointed Mughal arch silhouette
  IslamicGeometricStar.tsx -- 8-pointed star tessellation tile
  JaliLattice.tsx          -- Jali lattice screen tile
  JaliLatticeStrip.tsx     -- Horizontal jali strip divider
  ArabesqueScrollwork.tsx  -- Corner arabesque ornament
  ArabesqueFlourish.tsx    -- Horizontal flourish (wide + small variants)
  Bismillah.tsx            -- Bismillah calligraphic text
  Lantern.tsx              -- Mughal lantern (large + small variants)
  RosePetal.tsx            -- Rose petal (4 shape variants)
  CrescentMoon.tsx         -- Slim waxing crescent
  BirdSilhouette.tsx       -- Bird in flight (2 variants)
  MosqueSilhouette.tsx     -- Mosque with dome and minarets
  FourPointStar.tsx        -- Sparkle star (white + gold variants)
  ScrollIndicator.tsx      -- Scroll chevron
  GoldDivider.tsx          -- Gold line and dot dividers
  IconCalendar.tsx         -- Calendar icon
  IconClock.tsx            -- Clock icon
  IconMapPin.tsx           -- Map pin icon
  IconMaps.tsx             -- Maps link icon
  IconCalendarAdd.tsx      -- Add-to-calendar icon
  IconMusic.tsx            -- Music note / pause icon
  IconCheck.tsx            -- Checkmark icon
```

---

## Asset Catalog

### 1. MughalArch

| Property | Value |
|----------|-------|
| **File** | `MughalArch.tsx` |
| **Purpose** | Decorative arch silhouette above Family section cards |
| **viewBox** | `0 0 80 50` |
| **Colors** | `currentColor` (apply `--mc-gold` at 15% opacity via CSS) |
| **Animated** | No (static) |
| **Used in** | Family section (above each family card) |
| **Props** | `className`, `style` |
| **Notes** | Characteristic Mughal ogee profile with cusped interior and finial. Designed at full opacity; apply 15% via CSS `opacity`. |

### 2. IslamicGeometricStar

| Property | Value |
|----------|-------|
| **File** | `IslamicGeometricStar.tsx` |
| **Purpose** | Background texture tile (8-pointed star / Rub el Hizb tessellation) |
| **viewBox** | `0 0 80 80` |
| **Colors** | `currentColor` (apply `--mc-gold` at 5% opacity for Family, `--mc-cream` at 3% for Celebrations) |
| **Animated** | No (static, slight parallax at 0.95x) |
| **Used in** | Family section background (80x80 tile), Celebrations section background (scale to 100x100) |
| **Props** | `className`, `style` |
| **Notes** | Two overlapping rotated squares creating 8-pointed star with inner octagon. Corner quarter-stars for seamless tiling. Use as `background-image` via inline SVG data URL or as a positioned pattern layer. |

### 3. JaliLattice

| Property | Value |
|----------|-------|
| **File** | `JaliLattice.tsx` |
| **Purpose** | Jali lattice screen pattern tile for section backgrounds |
| **viewBox** | `0 0 60 60` |
| **Colors** | `currentColor` (apply `--mc-gold` at 4% opacity) |
| **Animated** | No (static, slight parallax at 0.95x) |
| **Used in** | Countdown section background (60x60 tile) |
| **Props** | `className`, `style` |
| **Notes** | Star-based cutout pattern inspired by Mughal jali screens. Central star with connecting lines to edges for seamless tiling. |

### 4. JaliLatticeStrip

| Property | Value |
|----------|-------|
| **File** | `JaliLatticeStrip.tsx` |
| **Purpose** | Horizontal lattice divider strip between sections |
| **viewBox** | `0 0 402 40` |
| **Colors** | `currentColor` (apply `--mc-cream` for tone-on-tone) |
| **Animated** | No (static) |
| **Used in** | Family/Countdown section transition boundary |
| **Props** | `className`, `style` |
| **Notes** | Full-width strip with `preserveAspectRatio="none"`. Uses SVG `<pattern>` for seamless repeat. Rendered at 100% width x 40px height. |

### 5. ArabesqueScrollwork

| Property | Value |
|----------|-------|
| **File** | `ArabesqueScrollwork.tsx` |
| **Purpose** | Corner ornament with vine tendrils and split palmette leaves |
| **viewBox** | `0 0 60 60` |
| **Colors** | `currentColor` (apply `--mc-gold-light` at 15-20% opacity) |
| **Animated** | No (static, slight parallax at 0.95x) |
| **Used in** | Family section (TL, BR corners), RSVP section (TL, BR corners) |
| **Props** | `className`, `style` |
| **Notes** | Designed for top-left placement. Mirror with `transform: rotate(180deg)` for bottom-right. Features curving vine, palmette leaves, spiral tendril tip, and decorative dot at origin. |

### 6. ArabesqueFlourish

| Property | Value |
|----------|-------|
| **File** | `ArabesqueFlourish.tsx` |
| **Purpose** | Horizontal ornamental flourish below section titles and flanking Bismillah |
| **viewBox** | Wide: `0 0 120 20`, Small: `0 0 40 20` |
| **Colors** | `currentColor` (apply `--mc-gold` or `--mc-gold-light`) |
| **Animated** | No (entry: clip-path center-outward reveal) |
| **Used in** | Family (Bismillah flanks, small), Countdown (below title, wide; bottom pair, small), Celebrations (below title, wide), RSVP (below title, wide) |
| **Props** | `className`, `style`, `variant` (`'wide'` or `'small'`) |
| **Notes** | Wide variant has central diamond accent with mirrored vine scrollwork. Small variant is compact with terminal dots. Both have palmette leaf fills at 12-15% opacity. |

### 7. Bismillah

| Property | Value |
|----------|-------|
| **File** | `Bismillah.tsx` |
| **Purpose** | Arabic calligraphic text of Bismillah |
| **viewBox** | `0 0 300 60` |
| **Colors** | `currentColor` (apply `--mc-text-gold`) |
| **Animated** | No (entry: opacity + scale reveal) |
| **Used in** | Family section (top, spiritual anchor) |
| **Props** | `className`, `style` |
| **Notes** | Renders Arabic text via `<text>` element using Amiri font (must be loaded). Includes `role="img"` and `aria-label` for accessibility. RTL direction. NOT purely decorative -- spiritual necessity per cultural direction. |

### 8. Lantern

| Property | Value |
|----------|-------|
| **File** | `Lantern.tsx` |
| **Purpose** | Mughal/Moroccan box lantern with amber glass panels |
| **viewBox** | Large: `0 0 24 40`, Small: `0 0 24 24` |
| **Colors** | Frame: `#8B6838` (--mc-bronze), Glass: `#D4A050` at 35% opacity |
| **Animated** | Large: glow pulse behind it (CSS glow element, not the SVG itself) |
| **Used in** | Countdown section (large, flanking card), Celebrations section (small, card header icon) |
| **Props** | `className`, `style`, `variant` (`'large'` or `'small'`) |
| **Notes** | Large variant has hanging chain, ornamental cap, pointed Mughal body shape with glass panel divisions, inner glow, and bottom finial. Small variant is simplified. Fixed colors (not currentColor) for the bronze/gold specificity. |

### 9. RosePetal

| Property | Value |
|----------|-------|
| **File** | `RosePetal.tsx` |
| **Purpose** | Individual rose petal shapes for ambient floating animation and static scatter |
| **viewBox** | `0 0 14 10` |
| **Colors** | `currentColor` (apply rose tones: `#C87890`, `#D4A0A8`, `#E0A0B0`, `#F0B0C0`) |
| **Animated** | Yes -- curved S-path drift via GSAP MotionPathPlugin, continuous rotation, opacity fade |
| **Used in** | All sections (ambient floating), Family (petal cluster ornament between cards), RSVP (scattered static) |
| **Props** | `className`, `style`, `variant` (`'a'`, `'b'`, `'c'`, `'d'`) |
| **Notes** | 4 shape variants for visual variety: (a) curled from above, (b) elongated side view, (c) wide partially open, (d) tight curl. Each includes a subtle vein line. Randomize color per instance. |

### 10. CrescentMoon

| Property | Value |
|----------|-------|
| **File** | `CrescentMoon.tsx` |
| **Purpose** | Slim waxing crescent moon in the closing sky |
| **viewBox** | `0 0 28 28` |
| **Colors** | `currentColor` (apply `--mc-gold` at 25% opacity) |
| **Animated** | No (glow element behind it pulses, but moon itself is static) |
| **Used in** | Closing section (upper right area of sky) |
| **Props** | `className`, `style` |
| **Notes** | Standalone crescent -- no star. Per cultural direction: crescent-and-star combined is a political symbol (Ottoman/Turkish/Pakistani flag), not inherently Islamic. The crescent alone is acceptable as a decorative sky element. |

### 11. BirdSilhouette

| Property | Value |
|----------|-------|
| **File** | `BirdSilhouette.tsx` |
| **Purpose** | Simple bird in flight for closing sky animation |
| **viewBox** | `0 0 20 10` |
| **Colors** | `currentColor` (apply `--mc-text-primary` at 15% opacity) |
| **Animated** | Yes -- gentle arc flight path via GSAP MotionPathPlugin, wing flap via scaleY oscillation |
| **Used in** | Closing section (2 birds in upper third of sky) |
| **Props** | `className`, `style`, `variant` (`1` or `2`) |
| **Notes** | Two variants for visual variety: (1) wings angled upward V-shape, (2) softer spread wings. Bird 1 enters left, exits right. Bird 2 enters right, exits left. Stagger start by 3000-6000ms. |

### 12. MosqueSilhouette

| Property | Value |
|----------|-------|
| **File** | `MosqueSilhouette.tsx` |
| **Purpose** | Large background architectural anchor in closing section |
| **viewBox** | `0 0 320 200` |
| **Colors** | `currentColor` (apply `--mc-gold-light` at 10% opacity) |
| **Animated** | No (parallax at 0.9x scroll speed) |
| **Used in** | Closing section (centered, 80% viewport width) |
| **Props** | `className`, `style` |
| **Notes** | Simplified Indo-Islamic mosque: central large bulbous dome on drum, two tall flanking minarets with balconies and cupolas, two smaller side domes, central iwan entrance arch, small side arches, chatris at roofline. All finials with spires and crescents. Clean geometric outline with no interior detail. |

### 13. FourPointStar

| Property | Value |
|----------|-------|
| **File** | `FourPointStar.tsx` |
| **Purpose** | Sparkle accent for ambient animation and countdown flash |
| **viewBox** | White: `0 0 16 16`, Gold: `0 0 12 12` |
| **Colors** | White variant: `#FFFFFF` at 70% opacity. Gold variant: `#D4A050` |
| **Animated** | Yes -- opacity + scale pulse (appear, hold, fade, dormant cycle) |
| **Used in** | Family (2), Countdown (3 + number flash), Celebrations (1), RSVP (1), Closing (3) |
| **Props** | `className`, `style`, `variant` (`'white'` or `'gold'`) |
| **Notes** | Four elongated diamond arms radiating from center with a center glow dot. Dimensions scale via variant. Gold variant used for countdown number change flash (400ms total). |

### 14. ScrollIndicator

| Property | Value |
|----------|-------|
| **File** | `ScrollIndicator.tsx` |
| **Purpose** | Downward-pointing scroll prompt at bottom of Entry screen |
| **viewBox** | `0 0 24 12` |
| **Colors** | `#D4A050` (fixed gold stroke) |
| **Animated** | Yes -- vertical bounce (translateY 0 -> 6px -> 0, 1500ms cycle), fades on scroll |
| **Used in** | Entry section (bottom center, 32px from bottom) |
| **Props** | `className`, `style` |
| **Notes** | Appears after all name/date words finish fade-in. Fades to opacity 0 when scrollY > 50px, then removed from DOM. |

### 15. GoldDivider

| Property | Value |
|----------|-------|
| **File** | `GoldDivider.tsx` |
| **Purpose** | Gold decorative dividers (line and dot variants) |
| **viewBox** | Line: `0 0 200 1`, Dots: `0 0 28 4` |
| **Colors** | `#D4A050` (fixed gold) |
| **Animated** | Line: entry via clip-path center-outward reveal. Dots: static. |
| **Used in** | Family (line below Bismillah), Countdown (dots below date), Celebrations (dots between cards), Closing (line between Dua and sign-off) |
| **Props** | `className`, `style`, `variant` (`'line'` or `'dots'`) |
| **Notes** | Line variant uses SVG linearGradient (transparent -> gold -> gold -> transparent). Rendered at 60% width. Dots variant is 3 circles spaced 8px apart. |

### 16. IconCalendar

| Property | Value |
|----------|-------|
| **File** | `IconCalendar.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-gold`) |
| **Used in** | Celebrations section (event card date row) |

### 17. IconClock

| Property | Value |
|----------|-------|
| **File** | `IconClock.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-gold`) |
| **Used in** | Celebrations section (event card time row) |

### 18. IconMapPin

| Property | Value |
|----------|-------|
| **File** | `IconMapPin.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-gold`) |
| **Used in** | Celebrations section (event card venue row) |

### 19. IconMaps

| Property | Value |
|----------|-------|
| **File** | `IconMaps.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-gold`) |
| **Used in** | Celebrations section (event card action row -- maps link) |

### 20. IconCalendarAdd

| Property | Value |
|----------|-------|
| **File** | `IconCalendarAdd.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-gold`) |
| **Used in** | Celebrations section (event card action row -- add to calendar) |

### 21. IconMusic

| Property | Value |
|----------|-------|
| **File** | `IconMusic.tsx` |
| **viewBox** | `0 0 20 20` |
| **Colors** | `currentColor` |
| **Used in** | Persistent music button (all sections) |
| **Props** | `className`, `style`, `variant` (`'note'` or `'pause'`) |
| **Notes** | Toggles between musical note (playing) and pause bars (paused). |

### 22. IconCheck

| Property | Value |
|----------|-------|
| **File** | `IconCheck.tsx` |
| **viewBox** | `0 0 18 18` |
| **Colors** | `currentColor` (apply `--mc-green`) |
| **Used in** | RSVP section (submit success state) |

---

## Usage Quick Reference

### Import Pattern
```tsx
import {
  MughalArch,
  IslamicGeometricStar,
  JaliLattice,
  JaliLatticeStrip,
  ArabesqueScrollwork,
  ArabesqueFlourish,
  Bismillah,
  Lantern,
  RosePetal,
  CrescentMoon,
  BirdSilhouette,
  MosqueSilhouette,
  FourPointStar,
  ScrollIndicator,
  GoldDivider,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconMaps,
  IconCalendarAdd,
  IconMusic,
  IconCheck,
} from '../assets/svg';
```

### Color Application
Most SVGs use `currentColor` so color is controlled via CSS `color` property on the parent or the SVG element itself:
```tsx
<MughalArch style={{ color: '#D4A050', opacity: 0.15 }} />
<RosePetal variant="a" style={{ color: '#C87890' }} />
<FourPointStar variant="white" /> {/* Uses fixed #FFFFFF */}
<Lantern variant="large" /> {/* Uses fixed #8B6838 and #D4A050 */}
```

### Variant Components
| Component | Variants | Default |
|-----------|----------|---------|
| ArabesqueFlourish | `'wide'`, `'small'` | `'wide'` |
| Lantern | `'large'`, `'small'` | `'large'` |
| RosePetal | `'a'`, `'b'`, `'c'`, `'d'` | `'a'` |
| BirdSilhouette | `1`, `2` | `1` |
| FourPointStar | `'white'`, `'gold'` | `'white'` |
| GoldDivider | `'line'`, `'dots'` | `'line'` |
| IconMusic | `'note'`, `'pause'` | `'note'` |

---

## Section-to-SVG Mapping

### Entry (Welcome)
- ScrollIndicator (1)

### Family
- Bismillah (1)
- ArabesqueFlourish small (2, flanking Bismillah)
- GoldDivider line (1, below Bismillah)
- MughalArch (2, above each family card)
- ArabesqueScrollwork (2, corners TL + BR)
- RosePetal (3, cluster ornament between cards)
- IslamicGeometricStar (background tile)
- JaliLatticeStrip (1, section bottom transition)
- FourPointStar white (2, ambient near card borders)
- RosePetal (3, ambient floating)

### Countdown
- ArabesqueFlourish wide (1, below title)
- Lantern large (2, flanking countdown card)
- ArabesqueFlourish small (2, bottom mirrored pair)
- GoldDivider dots (1, below date)
- JaliLattice (background tile)
- FourPointStar white (3, ambient sparkles)
- FourPointStar gold (up to 4, number change flash)
- RosePetal (4, ambient floating)

### Celebrations
- ArabesqueFlourish wide (1, below title)
- Lantern small (1 per event card)
- IconCalendar (1 per event card)
- IconClock (1 per event card)
- IconMapPin (1 per event card)
- IconMaps (1 per event card)
- IconCalendarAdd (1 per event card)
- GoldDivider dots (1 per card separator)
- IslamicGeometricStar (background tile, scaled to 100x100)
- FourPointStar white (1, ambient)
- RosePetal (2, ambient floating)

### RSVP
- ArabesqueFlourish wide (1, below title)
- ArabesqueScrollwork (2, corners TL + BR)
- RosePetal (2-3, scattered static; 3 ambient floating)
- FourPointStar white (1, ambient near submit)
- IconCheck (1, submit success state)

### Closing
- MosqueSilhouette (1, large centered background)
- CrescentMoon (1, upper right sky)
- BirdSilhouette (2, variants 1 + 2)
- FourPointStar white (3, sky sparkles)
- GoldDivider line (1, between Dua and sign-off)
- RosePetal (6, ambient floating -- highest count)

### Persistent UI
- IconMusic (1, music button -- note/pause toggle)
- ScrollIndicator (1, entry screen only)

---

## WebP Assets (NOT in this manifest -- separate raster production)

The following assets are WebP raster images with transparency, NOT inline SVGs:

| Asset | Dimensions | Used in |
|-------|-----------|---------|
| `mc-garland-corner-left.webp` | 160x200 | Entry (TL) |
| `mc-garland-bottom.webp` | full-width x 200 | Closing (bottom edge) |
| `mc-garland-drape.webp` | full-width x 40 | Celebrations/RSVP transition |
| `muslim-couple-poster.webp` | 720x1280 | Entry (video poster) |

These require raster asset production and are not part of the SVG component set.

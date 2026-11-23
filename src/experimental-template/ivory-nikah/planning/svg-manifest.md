# Ivory Nikah — SVG Asset Manifest

All SVG components live in `src/experimental-template/ivory-nikah/assets/svg/`.
Barrel-exported from `index.ts`.

---

## Component Inventory

### 1. GoldDividerA

| Property | Value |
|----------|-------|
| File | `GoldDividerA.tsx` |
| ViewBox | `0 0 280 24` |
| Description | Tapered horizontal gold rule with a diamond/floral motif at center. Two small flanking dots add flourish. |
| Colors | `#C9A84C` (gold), `#D5BD91` (champagne), `#E0CFA0` (light gold) |
| Gradients | `goldTaperA-left`, `goldTaperA-right` (tapered opacity), `goldMotifA` (vertical gold-to-champagne) |
| Sections used | Between Opening and Couple (Divider A), between RSVP and Closing (Divider A) |

### 2. GoldDividerB

| Property | Value |
|----------|-------|
| File | `GoldDividerB.tsx` |
| ViewBox | `0 0 200 16` |
| Description | Three gold dots (6px diameter) horizontally spaced with tapered rules extending left and right. Subtle highlight dots for depth. |
| Colors | `#C9A84C` (gold), `#D5BD91` (champagne), `#E0CFA0` (light gold) |
| Gradients | `goldTaperB-left`, `goldTaperB-right` (tapered opacity), `goldDotB` (vertical gold gradient) |
| Sections used | Between Couple and Dua, between Dua and Celebrations, inside celebration event cards, below section titles |

### 3. GoldDividerC

| Property | Value |
|----------|-------|
| File | `GoldDividerC.tsx` |
| ViewBox | `0 0 180 40` |
| Description | Horizontal vine snippet with leaves and tendrils. A gentle S-curve stem with pairs of gold and sage-tinted leaves, tiny buds, and tendrils. |
| Colors | `#C9A84C` (gold), `#D5BD91` (champagne), `#8A9A7B` (sage), `#E0CFA0` (light gold) |
| Gradients | `vineGoldC-stem` (tapered stem), `vineGoldC-leaf` (gold leaf fill), `vineGoldC-sage` (sage-to-gold leaf) |
| Sections used | Between Celebrations and Countdown (Divider C), between Countdown and RSVP (Divider C) |

### 4. IslamicBorder

| Property | Value |
|----------|-------|
| File | `IslamicBorder.tsx` |
| ViewBox | `0 0 300 60` |
| Description | Horizontal border strip with 5 repeating 8-pointed star (octagram) tiles. Each star is programmatically generated from two overlapping rotated squares. Connecting diamond shapes between tiles. Inner octagon fills and center dots. |
| Colors | `#C9A84C` (gold), `#E0CFA0` (light gold) |
| Gradients | `islamicBorderGold` (edge-fading horizontal) |
| Sections used | Decorative accent band; can be placed between any sections or as a background element |

### 5. GoldDiamond

| Property | Value |
|----------|-------|
| File | `GoldDiamond.tsx` |
| ViewBox | Dynamic based on `size` prop (default `0 0 10 10`) |
| Description | Small rotated square (diamond marker). Minimal punctuation element. Accepts `size` prop. |
| Colors | `#C9A84C` (gold), `#D5BD91` (champagne) |
| Gradients | `goldDiamondGrad` (vertical gold-to-champagne) |
| Sections used | Dua section full-stop, between celebration cards, general section punctuation |

### 6. CountdownSeparator

| Property | Value |
|----------|-------|
| File | `CountdownSeparator.tsx` |
| ViewBox | `0 0 4 32` |
| Description | Thin vertical gold line (1px) with faded top and bottom. 32px tall. Used between countdown number units. |
| Colors | `#C9A84C` (gold) |
| Gradients | `countdownSepGrad` (vertical fade-in/fade-out) |
| Sections used | Countdown section, between Days/Hours/Minutes/Seconds units |

### 7. RsvpAccent

| Property | Value |
|----------|-------|
| File | `RsvpAccent.tsx` |
| ViewBox | `0 0 80 32` |
| Description | A pair of interlinked crescents (Islamic motif) with a small 8-pointed star between them. Connecting arc flourishes. |
| Colors | `#C9A84C` (gold), `#D5BD91` (champagne), `#E0CFA0` (light gold) |
| Gradients | `rsvpCrescentL`, `rsvpCrescentR` (directional gold), `rsvpStarGrad` (vertical gold-to-light) |
| Sections used | RSVP section header accent |

### 8. SectionLabelRule

| Property | Value |
|----------|-------|
| File | `SectionLabel.tsx` |
| ViewBox | `0 0 48 6` |
| Description | Short tapered gold line used to flank a section label (e.g., "Blessing"). Accepts `side` prop ('left' or 'right'). Right side mirrors via scaleX(-1). |
| Colors | `#C9A84C` (gold) |
| Gradients | `sectionLabelRule-left`, `sectionLabelRule-right` (tapered opacity) |
| Sections used | Dua section "Blessing" label flanking decoration |

---

## Usage Pattern

All components accept `className` and `style` props. They use inline SVG with `viewBox` for responsive sizing. Width is controlled externally via CSS.

```tsx
import { GoldDividerA, GoldDividerB, GoldDividerC } from './assets/svg';

// In a section:
<GoldDividerA style={{ maxWidth: 280, margin: '0 auto' }} />
<GoldDividerB style={{ maxWidth: 200, margin: '0 auto' }} />
<GoldDividerC style={{ maxWidth: 180, margin: '0 auto', opacity: 0.4 }} />
```

---

## Color Palette Reference

| Token | Hex | Role in SVGs |
|-------|-----|-------------|
| `--in-gold` | `#C9A84C` | Primary stroke/fill |
| `--in-champagne` | `#D5BD91` | Gradient endpoints, warmth |
| `--in-gold-light` | `#E0CFA0` | Highlight dots, subtle fills |
| `--in-sage` | `#8A9A7B` | Botanical leaf accents (Divider C only) |

# Amrit Glow — SVG Asset Manifest

All SVG components live in `src/experimental-template/amrit-glow/assets/svg/`.
Barrel export: `index.ts`.

---

## Dividers and Rules

### OrnateRule
- **File**: `OrnateRule.tsx`
- **Description**: Ornamental rule with a diamond center and tapered gold lines with decorative end-curls. Formal separator between content groups.
- **Size**: 200 x 24 (default, scalable via `width` prop)
- **Used in**: Section 2 (Couple) — between couple names and family info. Section 4 (Celebrations) — below "Celebrations" heading. Any standard-weight content divider.
- **Props**: `className`, `width`

### ThinGoldRule
- **File**: `ThinGoldRule.tsx`
- **Description**: Thin horizontal gold gradient line that brightens at center and fades at edges. Minimal separator for closely related content.
- **Size**: 120 x 6 (default, scalable via `width` prop)
- **Used in**: Section 2 to 3 transition. Between closely related events in Section 4. Section 4 to 5 transition. Section 5 to 6 transition.
- **Props**: `className`, `width`

### DiyaRuleComposition
- **File**: `DiyaRuleComposition.tsx`
- **Description**: Two stylized diya (oil lamp) silhouettes flanking a thin gold rule with diamond center. Complete decorative composition — flame, vessel, and connecting rule.
- **Size**: 200 x 32 (default, scalable via `width` prop)
- **Used in**: Section 3 (Countdown) — decorative close below timer. Section 5 (RSVP) — decorative close below form. Section 7 (Closing) — above DesignedByFooter.
- **Props**: `className`, `width`

---

## Section Ornaments

### SectionHeadingOrnament
- **File**: `SectionHeadingOrnament.tsx`
- **Description**: Cusped Mughal arch motif at center flanked by scrollwork tendrils with leaf/petal details. Placed below section heading text.
- **Size**: 160 x 28 (default, scalable via `width` prop)
- **Used in**: Below "Celebrations" heading (Section 4). Below "RSVP" heading (Section 5). Any section heading that needs ornamental emphasis.
- **Props**: `className`, `width`

### GoldCornerOrnament
- **File**: `GoldCornerOrnament.tsx`
- **Description**: Mughal-inspired L-shaped filigree corner piece with scrollwork along both arms, cusped flourish at vertex, and leaf/dot details. Auto-rotates via `position` prop.
- **Size**: 80 x 80 (default, scalable via `size` prop)
- **Used in**: Section 2 (Couple) — four corners framing the content area. Section 4 Layout B events — four corners around open-frame events. Section 6 (Personal Notes) — two diagonal corners (TL, BR).
- **Props**: `className`, `size`, `position` (`'top-left'` | `'top-right'` | `'bottom-right'` | `'bottom-left'`)

### DiamondAccent
- **File**: `DiamondAccent.tsx`
- **Description**: Standalone rotated-square diamond with inner fill and bright highlight dot. Compact versatile accent mark.
- **Size**: 12 x 12 (default, scalable via `size` prop)
- **Used in**: Any context needing a focal decorative mark — bullet alternatives, standalone accents between text blocks, or as part of custom divider compositions.
- **Props**: `className`, `size`

---

## Architectural Elements

### ArchBorderSvg
- **File**: `ArchBorderSvg.tsx`
- **Description**: Full-width ornamental arch border band with a central grand cusped arch flanked by repeating smaller arches, connecting bands, and diamond accents. The architectural "gateway" from hero to content.
- **Size**: 402 x 80 (default, scalable via `width` prop)
- **Used in**: Section 1 (Hero) — flush at bottom of the hero section. Used exactly once.
- **Props**: `className`, `width`

### MughalArchPattern
- **File**: `MughalArchPattern.tsx`
- **Description**: Repeating cusped arch tile pattern with internal filigree details (medallion, cusp scallops, pilaster lines). Used as a very low-opacity background texture via SVG `<pattern>`.
- **Size**: 402 x 300 (default, adjustable via `width`/`height` props). Tile unit: 80 x 100.
- **Used in**: Behind Section 2 (Couple) or Section 4 (Celebrations) content at 3-8% opacity. Provides subtle architectural depth to flat backgrounds.
- **Props**: `className`, `width`, `height`, `patternOpacity` (default 0.05)

---

## Botanical / Floral

### FloralScrollwork
- **File**: `FloralScrollwork.tsx`
- **Description**: Single flowing vine tendril with lotus buds, pointed leaves, and dot accents. Mughal illuminated manuscript border style. Supports horizontal mirroring for paired placement.
- **Size**: 100 x 60 (default, scalable via `width` prop)
- **Used in**: Flanking content blocks, beside section headings as accent, or as standalone decorative mark. Use paired (mirror left + normal right) for symmetric compositions.
- **Props**: `className`, `width`, `mirror` (boolean)

---

## Countdown

### TimerUnitFrame
- **File**: `TimerUnitFrame.tsx`
- **Description**: Subtle cusped arch top with thin vertical side strokes and a delicate curved base line. Frames a single countdown number + label without being heavy.
- **Size**: 72 x 72 (default, scalable via `size` prop)
- **Used in**: Section 3 (Countdown) — one frame behind each of the 4 timer units (Days, Hours, Minutes, Seconds). The number and label text are overlaid via CSS positioning.
- **Props**: `className`, `size`

---

## Texture

### NoiseTexture
- **File**: `NoiseTexture.tsx`
- **Description**: Inline SVG fractal noise tile using `feTurbulence` filter. Prevents gradient banding on AMOLED screens when overlaid at 1-2% opacity.
- **Size**: 100 x 100 (default tile, adjustable)
- **Used in**: Overlaid on all section backgrounds as a full-coverage texture at very low opacity. Can be used as an inline SVG element or via the exported `noiseTextureDataUri()` function as a CSS `background-image` data URI.
- **Props**: `className`, `width`, `height`, `opacity` (default 0.015)
- **Also exports**: `noiseTextureDataUri()` — returns a CSS-ready `url("data:image/svg+xml,...")` string for use in style attributes or CSS-in-JS.

---

## Usage Summary by Section

| Section | SVG Components Used |
|---------|-------------------|
| 1. Hero | `ArchBorderSvg`, `NoiseTexture` |
| 2. Couple & Family | `GoldCornerOrnament` x4, `OrnateRule`, `NoiseTexture`, `MughalArchPattern` (optional) |
| 2→3 Transition | `ThinGoldRule` |
| 3. Countdown | `TimerUnitFrame` x4, `DiyaRuleComposition`, `NoiseTexture` |
| 3→4 Transition | (marigold garland PNG — not SVG) |
| 4. Celebrations | `SectionHeadingOrnament`, `OrnateRule`, `GoldCornerOrnament` (Layout B events), `ThinGoldRule` (between events), `NoiseTexture` |
| 4→5 Transition | `ThinGoldRule` |
| 5. RSVP | `SectionHeadingOrnament`, `DiyaRuleComposition`, `NoiseTexture` |
| 5→6 Transition | `ThinGoldRule` |
| 6. Personal Notes | `GoldCornerOrnament` x2 (TL, BR), `NoiseTexture` |
| 7. Closing | `DiyaRuleComposition`, `OrnateRule`, `NoiseTexture` |

---

## Color Dependencies

All components use these CSS custom properties (with hardcoded fallbacks):

| Property | Fallback | Usage |
|----------|----------|-------|
| `--ag-gold` | `#D4A843` | Primary stroke and fill color |
| `--ag-gold-bright` | `#E8C65A` | Highlight accents, bright details |
| `--ag-accent` | `#8B6914` | Dark gold for gradient endpoints |
| `--ag-lamp` | `#FFE4A0` | Diya flame color |

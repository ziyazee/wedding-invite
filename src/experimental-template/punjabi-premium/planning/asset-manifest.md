# Punjabi Premium -- Asset Manifest

> Complete inventory of every visual asset required across all 7 sections.
> Priority: Critical = blocks layout, High = visible on first load, Medium = above fold secondary, Low = lazy-loaded or minor.

---

## 1. SVG Assets (Programmatic -- Created as React Components)

### 1.1 MughalArch (`assets/MughalArch.tsx`)
- **Purpose**: Full Mughal arch with pillars and scalloped inner edge (5-7 cusps). The structural backbone of the opening section.
- **Format**: SVG React component
- **Dimensions**: Scales to container. Default viewBox designed for ~85% container width, arch top at ~15%, bottom at ~75% of container height.
- **Colors**: Arch body `--pp-arch-beige` (#E8D5C0), pillars `--pp-arch-pillar` (#DBBFA8), subtle inner shadow on scallops
- **Sections**: S1 (Opening) -- primary structural element
- **Priority**: Critical
- **Notes**: Must have smooth bezier cusps. Inner shadow on scalloped edge via 1px rgba(139,107,61,0.15).

### 1.2 ToranOrnaments (`assets/ToranOrnaments.tsx`)
- **Purpose**: 5 hanging ornaments (golden bell/kalash + pearl strand + mauve teardrop terminal). Traditional toran / bandhanwar motif.
- **Format**: SVG React component
- **Dimensions**: Spans ~60% of arch width. Each ornament is a separate `<g>` for individual animation.
- **Colors**: Kalash `--pp-gold` (#C9A84C), pearls `--pp-bg-cream` (#F5E6D3), teardrop `--pp-purple-mauve` (#8B5E8B)
- **Sections**: S1 (Opening) only -- per design bible, do not repeat in other sections
- **Priority**: High
- **Notes**: Outer two ornaments slightly longer. Transform-origin at top-center per ornament for CSS pendulum sway.

### 1.3 ScallopedBorder (`assets/ScallopedBorder.tsx`)
- **Purpose**: The cusped arch edge extracted as a horizontal decorative border. Configurable cusp count.
- **Format**: SVG React component
- **Dimensions**: Full width, height ~40px. Configurable via props: `cusps` (3, 5, or 7), `width`, `color`.
- **Colors**: Default `--pp-arch-beige` (#E8D5C0)
- **Sections**: S2 (arch crown borders), S3 (countdown frame top), S4 (card scalloped headers), S6 (photo frame clip-path)
- **Priority**: High
- **Notes**: Used in 4 sections with different cusp counts. Must export both as a rendered border and as a clip-path definition.

### 1.4 LotusFlower (`assets/LotusFlower.tsx`)
- **Purpose**: Stylized lotus with layered pink petals and green base leaves. Symbol of purity and new beginnings.
- **Format**: SVG React component
- **Dimensions**: Configurable size via props. Default 48px. Used from 24px (divider) to 48px (standalone).
- **Colors**: Outer petals `--pp-pink-lotus` (#E8A0A8), inner petals `--pp-pink-rose` (#D4708A), leaves `--pp-green-sage` (#7A9A6A)
- **Sections**: S1 (base arrangement), S2 (bud divider), S3 (below date), S5 (thank-you state), S6 (transition), S7 (closing motif)
- **Priority**: High
- **Notes**: Most reused decorative element. Keep the path simple but elegant -- painterly, not geometric.

### 1.5 GoldFlourish (`assets/GoldFlourish.tsx`)
- **Purpose**: Thin horizontal gold line with a small diamond or leaf ornament at center. Elegant section divider.
- **Format**: SVG React component
- **Dimensions**: Configurable width (default 200px max). Height ~16px.
- **Colors**: `--pp-gold-muted` (#B59A5A) at 50-70% opacity
- **Sections**: S2 (above section), S3 (internal dividers), S4 (between event details)
- **Priority**: Medium
- **Notes**: The `.pp-flourish` CSS utility class uses this. Lines should be hairline (1px).

### 1.6 RoseCluster (`assets/RoseCluster.tsx`)
- **Purpose**: 2-3 stylized roses with leaves. Mid-level floral accent.
- **Format**: SVG React component
- **Dimensions**: ~48-64px wide. Two variants via `mirror` prop: default (left-facing) and mirrored (right-facing).
- **Colors**: Roses `--pp-pink-rose` (#D4708A), leaves `--pp-green-sage` (#7A9A6A), dark leaves `--pp-green-deep` (#3D6B4A)
- **Sections**: S1 (flanking monogram), S2 (corner sprays), S5 (flanking heading)
- **Priority**: Medium
- **Notes**: Per design bible, mirrored in placement but not identical -- the mirror prop flips via CSS transform, which is acceptable for SVG components.

### 1.7 ArchSilhouette (`assets/ArchSilhouette.tsx`)
- **Purpose**: Simplified outline version of the full Mughal arch. Thin stroke only, no fill. Used as a closing bookend.
- **Format**: SVG React component
- **Dimensions**: Width ~78% of container (max 314px). Height content-driven (min 420px).
- **Colors**: Configurable stroke color, default `--pp-divider` (#D5C4A8) at 60% opacity. Stroke width 1.5px.
- **Sections**: S5 (RSVP form frame, open bottom), S7 (closing section, full silhouette)
- **Priority**: Medium
- **Notes**: S5 variant is open at bottom (form flows out). S7 variant shows the full shape. Use a `variant` or `openBottom` prop. Must support stroke-dashoffset animation for draw-in effect.

### 1.8 VineBorder (`assets/VineBorder.tsx`)
- **Purpose**: Vertical vine with small leaves every ~40px. Frame side decoration.
- **Format**: SVG React component
- **Dimensions**: Vertical, configurable height. Width ~12px.
- **Colors**: `--pp-green-sage` (#7A9A6A) at 20% opacity
- **Sections**: S3 (countdown frame sides), S5 (arch outline inner edges)
- **Priority**: Low
- **Notes**: Simple single stem with alternating small leaves. Low opacity -- purely ambient.

---

## 2. Raster Assets (Require Illustration)

### 2.1 Couple Illustration
- **Purpose**: The central hero element. Couple in traditional Punjabi wedding attire (groom in pagri + sherwani, bride in lehenga + dupatta) walking away through the arch.
- **Format**: WebP (primary) + PNG fallback, transparent background
- **Dimensions**: Mobile 1x: 560px wide, 2x: 1120px wide. Height proportional (~35-40% of viewport).
- **Colors**: Groom dusty rose (#D4A0A0) sherwani, saffron/gold (#C9A84C) pagri. Bride magenta (#C43068) lehenga with gold embroidery. Painterly/watercolor style.
- **Sections**: S1 (Opening) -- positioned at 60-95% vertical, 70% container width
- **Priority**: Critical
- **Status**: REQUIRES ILLUSTRATION -- placeholder needed
- **Placeholder**: CSS gradient silhouette in warm pinks/golds suggesting two figures, ~70% container width, bottom-anchored.
- **Estimated file size**: 150-300 KB (WebP), 400-600 KB (PNG fallback)

### 2.2 Floral Canopy (Top)
- **Purpose**: Dense bougainvillea and foliage cluster cascading over and around the arch crown. Creates the lush garden entrance.
- **Format**: WebP, transparent background
- **Dimensions**: Mobile 1x: 800px wide (bleeds past edges), 2x: 1600px wide. Height ~20% of container.
- **Colors**: Bright pink (#E84080), soft pink (#D4708A), sage green (#7A9A6A), deep green (#3D6B4A). Watercolor style with soft edges.
- **Sections**: S1 (Opening) -- z-index 8, highest decorative layer
- **Priority**: Critical
- **Status**: REQUIRES ILLUSTRATION -- placeholder needed
- **Placeholder**: CSS gradient with pink-to-green radial blobs suggesting cascading floral mass, full width + overflow.
- **Estimated file size**: 80-150 KB (WebP)

### 2.3 Bottom Botanicals
- **Purpose**: Lotus flowers, large tropical leaves, and layered petals framing the couple from below. Dense botanical vignette at base.
- **Format**: WebP, transparent background
- **Dimensions**: Mobile 1x: 800px wide, 2x: 1600px wide. Height ~25% of container.
- **Colors**: Lotus pink (#E8A0A8), deep green (#3D6B4A), sage green (#7A9A6A). Watercolor style.
- **Sections**: S1 (Opening) -- z-index 4
- **Priority**: Critical
- **Status**: REQUIRES ILLUSTRATION -- placeholder needed
- **Placeholder**: CSS gradient with green/pink organic shapes at bottom, fading to transparent at top.
- **Estimated file size**: 60-100 KB (WebP)

### 2.4 Rose Cluster Watercolor (Left)
- **Purpose**: Watercolor-style rose cluster for the opening section mid-level floral. Flanks the monogram area at the arch-pillar junction.
- **Format**: WebP, transparent background
- **Dimensions**: Mobile 1x: 200px wide, 2x: 400px wide
- **Colors**: Roses #D4708A, leaves #7A9A6A
- **Sections**: S1 (flanking monogram), S2 (corner accents)
- **Priority**: Medium
- **Status**: REQUIRES ILLUSTRATION -- placeholder needed (SVG RoseCluster component serves as simplified version)
- **Estimated file size**: 30-60 KB (WebP)

### 2.5 Rose Cluster Watercolor (Right)
- **Purpose**: Mirrored version of 2.4 for the opposite side. Not an exact mirror -- organic variation.
- **Format**: WebP, transparent background
- **Dimensions**: Same as 2.4
- **Colors**: Same as 2.4
- **Sections**: S1, S2
- **Priority**: Medium
- **Status**: REQUIRES ILLUSTRATION -- placeholder needed (mirror of SVG RoseCluster serves as fallback)
- **Estimated file size**: 30-60 KB (WebP)

### 2.6 Paper Grain Texture
- **Purpose**: Subtle tiling noise overlay simulating cotton card stock. Warm-tinted grain.
- **Format**: WebP or PNG, tiling (seamless edges)
- **Dimensions**: 256x256 tile
- **Colors**: Warm beige noise, applied at 3-5% opacity
- **Sections**: All sections as background overlay
- **Priority**: Low
- **Status**: Can be generated as CSS noise pattern (no illustration needed). A tiling image is a nice-to-have upgrade.
- **Placeholder**: CSS pseudo-element with `filter: url()` SVG noise, or skip entirely -- the gradient alone reads well.
- **Estimated file size**: 10-20 KB

### 2.7 Small Floral Corner (Event Cards)
- **Purpose**: Tiny rose-and-leaf motif for event card top-right corners.
- **Format**: WebP or SVG, transparent background
- **Dimensions**: ~20-24px
- **Colors**: #D4708A rose, #7A9A6A leaf, at 40% opacity
- **Sections**: S4 (event card corners)
- **Priority**: Low
- **Status**: The SVG RoseCluster at small size can substitute. Full watercolor version is a nice-to-have.
- **Estimated file size**: 5-10 KB

---

## 3. CSS-Only Assets (No File Needed)

### 3.1 Background Gradient
- **Purpose**: The radial gradient creating the warm vignette effect.
- **Format**: CSS `radial-gradient()`
- **Spec**: `radial-gradient(ellipse at 50% 45%, #FAF3EB 0%, #F5E6D3 40%, #F0D5C0 85%, #E8CCAE 100%)`
- **Sections**: S1 (full vignette), S3 (linear cream-to-blush), S7 (subtle vignette)
- **Priority**: Critical

### 3.2 Dark Surface Backgrounds
- **Purpose**: High-contrast surfaces for featured event cards and footer.
- **Format**: CSS solid colors
- **Spec**: `--pp-dark-surface` (#3E2218), `--pp-dark-surface-warm` (#5C3529)
- **Sections**: S4 (main event highlight card), S7 (footer variant if needed)
- **Priority**: Medium

### 3.3 Warm Shadows
- **Purpose**: Depth and elevation for cards and frames.
- **Format**: CSS `box-shadow` / `drop-shadow()`
- **Spec**: See design bible section 5.4. Base color: rgba(92, 58, 46, opacity).
- **Sections**: All sections with cards or elevated elements
- **Priority**: Medium

### 3.4 Couple Illustration Placeholder
- **Purpose**: Stand-in gradient while awaiting actual illustration.
- **Format**: CSS gradient in a container
- **Spec**: Elliptical gradient blending dusty rose, gold, and magenta to suggest two silhouette figures.
- **Sections**: S1
- **Priority**: Critical (needed immediately for layout development)

### 3.5 Floral Canopy Placeholder
- **Purpose**: Stand-in for top floral canopy during development.
- **Format**: CSS gradient
- **Spec**: Multiple radial gradients blending bright pink and sage green, positioned at top of container, bleeding past edges.
- **Sections**: S1
- **Priority**: Critical (needed immediately for layout development)

### 3.6 Bottom Botanicals Placeholder
- **Purpose**: Stand-in for bottom botanical arrangement during development.
- **Format**: CSS gradient
- **Spec**: Radial gradients blending lotus pink, deep green, and sage at bottom of container.
- **Sections**: S1
- **Priority**: Critical (needed immediately for layout development)

---

## 4. Font Assets

### 4.1 Cormorant Garamond
- **Source**: Google Fonts
- **Weights**: 400, 500, 600, 700
- **Role**: Display headings, monogram, body serif, labels
- **Priority**: Critical
- **Estimated size**: ~80 KB (woff2, 4 weights)

### 4.2 Pinyon Script
- **Source**: Google Fonts
- **Weights**: 400
- **Role**: Couple names, romantic script accents, closing phrase
- **Priority**: Critical
- **Notes**: Replaces Great Vibes (used in other templates) to give Punjabi Premium its own voice. Finer hairlines, more formal calligraphic quality.
- **Estimated size**: ~30 KB (woff2)

---

## 5. Asset-to-Section Map

| Asset | S1 | S2 | S3 | S4 | S5 | S6 | S7 | Priority |
|-------|----|----|----|----|----|----|----|----|
| MughalArch | X | | | | | | | Critical |
| ToranOrnaments | X | | | | | | | High |
| ScallopedBorder | | X | X | X | | X | | High |
| LotusFlower | X | X | X | | X | X | X | High |
| GoldFlourish | | X | X | X | | | | Medium |
| RoseCluster | X | X | | | X | | | Medium |
| ArchSilhouette | | | | | X | | X | Medium |
| VineBorder | | | X | | X | | | Low |
| Couple Illust. | X | | | | | | | Critical |
| Floral Canopy | X | | | | | | | Critical |
| Bottom Botanicals | X | | | | | | | Critical |
| Rose WC (L) | X | X | | | | | | Medium |
| Rose WC (R) | X | X | | | | | | Medium |
| Paper Grain | X | X | X | X | X | X | X | Low |
| BG Gradient | X | | X | | | | X | Critical |

---

## 6. Loading Strategy

### Priority Load (Opening Section -- First Paint)
1. Fonts: Cormorant Garamond 700, Pinyon Script 400 (preload)
2. MughalArch SVG (inline, ~4 KB)
3. Couple illustration WebP (fetchpriority="high")
4. Floral canopy WebP (fetchpriority="high")
5. Bottom botanicals WebP (fetchpriority="high")
6. ToranOrnaments SVG (inline, ~4 KB)

### Deferred Load (Below Fold)
7. Remaining Cormorant Garamond weights (400, 500, 600)
8. ScallopedBorder, LotusFlower, GoldFlourish (inline SVGs, tiny)
9. Rose cluster WebPs (lazy)
10. Paper grain texture (lazy, lowest priority)
11. Gallery photos (lazy, intersection observer)

### Estimated Total Bundle
- SVG components (all 8): ~25-35 KB (gzipped React + SVG paths)
- Raster illustrations: 350-600 KB (WebP, 1x mobile)
- Fonts: ~110 KB (woff2)
- CSS: ~15-20 KB
- **Total first-paint**: ~200-300 KB (SVGs + fonts + JS, before raster images)
- **Total full load**: ~500-950 KB (including all images)

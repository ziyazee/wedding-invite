# Muslim Couple Template — Visual Asset Audit

Catalog of all visual assets, patterns, textures, decorative elements, typography styles, and color swatches observed in the reference video. This document serves as the asset production checklist for template development.

---

## 1. Architectural Elements

### 1.1 Mughal Pointed Arch (Ogee Arch)
- **Description**: A large pointed arch with a distinctive ogee (S-curve) profile, characteristic of Mughal architecture. White marble appearance with ornate carved relief on the pillar face.
- **Location in video**: Left side of frame, dominant foreground element
- **Dimensions (relative)**: Spans approximately 30% of frame width, full height
- **Detail level**: High — carved geometric Islamic patterns visible on the pillar surface
- **Template usage**: Section frame/divider, opening hero element, decorative border motif
- **Asset needed**: SVG arch silhouette (clean vector), plus optionally a detailed textured version (WebP)

### 1.2 Marble Columns
- **Description**: Smooth or subtly faceted white marble columns supporting the arches
- **Color**: Warm white `#F5F0E8` to cream `#EDE5D5`
- **Template usage**: Vertical dividers, section borders
- **Asset needed**: Can be achieved with CSS gradients; no raster asset required unless high-detail ornamental version desired

### 1.3 Stone Balustrade with Islamic Cutouts
- **Description**: Low decorative railing along the terrace edge. Features carved geometric cutout patterns — appears to be star-and-hexagon or interlocking geometric motifs.
- **Color**: Warm cream stone `#EDE5D5`
- **Location in video**: Right side of frame, mid-ground
- **Template usage**: Horizontal decorative divider, section separator
- **Asset needed**: SVG repeating pattern tile for the cutout design; could also serve as a decorative border

### 1.4 Carved Stone Planters
- **Description**: Rectangular stone planters with simple carved geometric borders, housing rose bushes
- **Color**: Light stone `#E8E0D0`
- **Template usage**: Decorative accent, container element styling reference
- **Asset needed**: Optional — can be suggested with CSS box styling

### 1.5 Mosque Silhouette (Dome + Twin Minarets)
- **Description**: A mosque with a large central dome and two flanking tall minarets. The structure appears golden-lit from within. Classical Indo-Islamic mosque design with multiple smaller domes visible.
- **Colors**: Golden sandstone `#D4B478`, warm illuminated `#C8A878`, dome highlight `#E8C888`
- **Location in video**: Center-right background, focal point of the entire scene
- **Template usage**: **Critical cultural anchor** — hero background element, section background, footer motif
- **Asset needed**: SVG mosque silhouette (simplified clean outline), plus optionally a detailed raster version with glow effect

### 1.6 Multi-Tiered Fountain
- **Description**: Classical tiered fountain in the mid-ground garden, with water cascading down multiple levels
- **Color**: Warm white marble with water reflections
- **Template usage**: Optional decorative element, mid-section accent
- **Asset needed**: Optional SVG or CSS illustration

---

## 2. Floral Elements

### 2.1 Cascading Floral Garland (Top Frame)
- **Description**: Dense arrangement of pink roses, white flowers, and bougainvillea-like blooms cascading down from above, intertwined with green foliage. Forms a natural floral arch/canopy across the top of the frame.
- **Colors**: Soft pink `#F0B0C0`, deep pink `#E88BA0`, white `#FFFFFF`, green leaves `#6B8E50`
- **Location**: Top edge of frame, draping down on both sides
- **Template usage**: **Primary decorative frame** — top-of-section borders, hero section framing, transition overlays
- **Asset needed**: PNG/WebP with transparency — left corner, right corner, and top-center variants. Consider separate layered assets for parallax.

### 2.2 Climbing Vine + Flower Garland (Column)
- **Description**: Pink and white flowers with green vines climbing vertically along the arch column
- **Colors**: Mixed pink and white blooms, sage-green vine tendrils
- **Location**: Left column, full height
- **Template usage**: Vertical section border accent, sidebar decoration
- **Asset needed**: Tall vertical PNG/WebP with transparency; or tileable section

### 2.3 Rose Bushes (Ground Level)
- **Description**: Low-growing pink rose bushes lining both sides of the walkway at ground level
- **Colors**: Soft pink `#F0B0C0`, medium rose `#E88BA0`, dark rose `#C87890`, green foliage `#5A7840`
- **Template usage**: Bottom-of-section decoration, footer accent
- **Asset needed**: PNG/WebP strip for section bottoms

### 2.4 Scattered Rose Petals
- **Description**: Individual rose petals scattered across the white marble floor. Various stages of curl and orientation. Deep pink to dusty rose colors.
- **Colors**: Deep pink `#C87890`, dusty rose `#D4A0A8`, medium rose `#E0A0B0`
- **Location**: Across the entire marble floor surface
- **Template usage**: **Recurring texture/atmosphere element** — background scatter, section dividers, animated floating particles
- **Asset needed**: Set of 4-6 individual petal SVGs or PNGs at different rotations. Also consider a repeating scatter pattern tile.

---

## 3. Lighting Elements

### 3.1 Mughal/Moroccan Lanterns
- **Description**: Ornamental box-shaped lanterns with glass panels and metallic (bronze/brass) frames. They sit on the balustrade caps and on the floor along the walkway. Each emits a warm amber glow.
- **Colors**: Bronze frame `#8B6838`, amber glow `#D4A050`, glass panel warm `#F5D0A0`
- **Size**: Medium — roughly 1/10 of frame height
- **Count visible**: 6-8 throughout the scene
- **Template usage**: **Key decorative motif** — repeated accent element, section markers, footer decoration, event card accents
- **Asset needed**: SVG lantern illustration (simplified/stylized); glow effect can be CSS (radial gradient or box-shadow). Consider both a line-art version and a filled/detailed version.

### 3.2 Warm Ambient Glow / Lens Bloom
- **Description**: Soft diffusion across the entire image, with bloom effects around the sun and lanterns. Creates a dreamy, slightly hazy quality.
- **Template usage**: Apply via CSS filter or overlay — a subtle warm tint + slight blur on background layers
- **Asset needed**: No raster asset — achieve with CSS `backdrop-filter: blur()` or a semi-transparent warm overlay gradient

### 3.3 Four-Pointed Star Sparkle
- **Description**: A small, white, four-pointed star/sparkle that appears intermittently. Clean geometric shape with soft glow.
- **Color**: White `#FFFFFF` with soft bloom
- **Size**: Small — approximately 20-30px equivalent
- **Template usage**: Magical accent element, animated subtly (scale in/out, opacity pulse)
- **Asset needed**: SVG four-pointed star. Very simple geometry — four elongated diamond points from a center. Can also be done purely in CSS.

---

## 4. Natural / Environmental Elements

### 4.1 Sunset Sky Gradient
- **Description**: Multi-stop gradient from periwinkle-blue at zenith through salmon-pink and peach to deep gold at horizon. Scattered clouds in soft pink and peach tones.
- **Gradient stops (top to bottom)**:
  - `#7090B8` — Soft blue (zenith)
  - `#9BA8C0` — Blue-grey
  - `#C0A0B0` — Dusty mauve
  - `#E0A0A0` — Salmon pink
  - `#F0B888` — Warm peach
  - `#E8A050` — Deep amber
  - `#E8A84C` — Golden (horizon)
- **Template usage**: **Primary background gradient** for hero sections, full-bleed backgrounds
- **Asset needed**: CSS gradient. For a more photorealistic version, a sky texture WebP.

### 4.2 Clouds
- **Description**: Soft, wispy clouds in pink and peach tones, spread across the upper-middle sky
- **Colors**: `#E8A0A0` to `#F0B8A8` with soft edges
- **Template usage**: Subtle background texture, parallax layer
- **Asset needed**: Optional — could be part of a sky background image, or soft CSS shapes

### 4.3 Mountain Silhouette
- **Description**: Low mountain range on the horizon, rendered in muted purple-blue atmospheric perspective
- **Color**: `#9888A0` to `#A090A8` (blue-purple muted)
- **Template usage**: Far-background parallax layer
- **Asset needed**: SVG mountain silhouette line or a simple raster strip

### 4.4 Trees (Palm + Cypress)
- **Description**: Palm trees and tall narrow cypress trees scattered through the garden landscape
- **Colors**: Dark green `#3A5228` (cypress), green `#5A7840` (palms)
- **Template usage**: Mid-ground environmental detail
- **Asset needed**: Optional SVG tree silhouettes for parallax

### 4.5 Reflecting Pool / Water
- **Description**: Still water surface reflecting the sky and surrounding elements
- **Color**: Soft teal-blue `#7BB5C0` with warm reflections
- **Template usage**: Optional section background, subtle reflective effect
- **Asset needed**: Can be achieved with CSS (semi-transparent overlay with slight blur)

### 4.6 Birds in Flight
- **Description**: 1-2 small bird silhouettes visible in the sky during the final seconds
- **Color**: Dark against sunset `#4A3828`
- **Template usage**: Subtle animated accent, floating across hero sections
- **Asset needed**: Small SVG bird silhouette (simple shape — two curved wings)

---

## 5. Couple / Figure Elements

### 5.1 Groom Figure (from behind)
- **Attire**: Cream/ivory sherwani over white churidar
- **Colors**: Sherwani `#F5F0E0`, trousers `#EDE8D8`, shoes `#3A2818` (dark brown)
- **Hair**: Dark `#1A1008`
- **Template usage**: The template will not use the couple figure — this is reference video only. The couple represents the target aesthetic for placeholder/illustration style if any illustrated couple is ever needed.

### 5.2 Bride Figure (from behind)
- **Attire**: Blush-champagne lehenga with matching embroidered dupatta worn as hijab
- **Colors**: Main fabric `#E8D5C0`, embroidery `#C8B8A0`, sheer overlay `#D8C0B0`
- **Dupatta detail**: Semi-transparent, with scattered floral embroidery motifs and delicate border work
- **Template usage**: Same as groom — reference for aesthetic direction only

---

## 6. Patterns & Textures

### 6.1 Islamic Geometric Carved Relief
- **Description**: Carved geometric pattern on the arch column face. Appears to be a repeating star-and-polygon pattern typical of Islamic geometric art — possibly an 8-pointed star (octagram) tessellation.
- **Colors**: Carved into cream stone `#EDE5D5`, with shadow definition `#C8C0B0`
- **Template usage**: Background pattern fill, section overlay texture, card border decoration
- **Asset needed**: SVG repeating tile of Islamic geometric pattern. Consider 2-3 density levels (fine for backgrounds, medium for accents, bold for borders).

### 6.2 Balustrade Cutout Pattern
- **Description**: Geometric cutout pattern in the stone balustrade — interlocking stars or hexagonal grid
- **Colors**: Stone `#EDE5D5` with cut-through revealing darker background
- **Template usage**: Decorative horizontal divider, section separator
- **Asset needed**: SVG repeating tile

### 6.3 Marble Floor Texture
- **Description**: Polished white marble with subtle warm veining and reflective surface. Rose petals scattered on top.
- **Colors**: Base `#F0E8E0`, veining `#E0D8D0`, warm reflections from sunset
- **Template usage**: Section background texture, card surface
- **Asset needed**: Optional subtle marble texture tile (WebP), or CSS gradient approximation

### 6.4 Floral Embroidery Pattern (Bride's Outfit)
- **Description**: Delicate floral embroidery scattered across the bride's garment — small floral motifs (possibly jasmine or rose buds) with curved vine connections. Appears in muted gold/champagne on blush fabric.
- **Colors**: Gold thread `#C8B8A0` on blush `#E8D5C0`
- **Template usage**: Subtle background pattern for text sections, card borders, invitation frame overlays
- **Asset needed**: SVG repeating floral embroidery pattern — light, delicate, not dense. Could also serve as a mask or watermark.

---

## 7. Color Swatches — Complete Palette

### Primary Colors (use most frequently)
| Name | Hex | Usage |
|------|-----|-------|
| Warm Ivory | `#F5F0E8` | Primary background, architecture, surfaces |
| Blush Champagne | `#E8D5C0` | Secondary background, card surfaces, text containers |
| Sunset Gold | `#D4A050` | Accents, borders, headings, lantern glow |
| Soft Rose | `#F0B0C0` | Floral accents, decorative elements |
| Sage Green | `#6B8E50` | Foliage, subtle accents (use sparingly) |

### Secondary Colors (supporting)
| Name | Hex | Usage |
|------|-----|-------|
| Sky Blue | `#8BA6C7` | Upper backgrounds, text highlights |
| Sunset Peach | `#F5B78A` | Gradient stops, warm overlays |
| Deep Pink Rose | `#E88BA0` | Floral details, hover states |
| Dusty Rose Petal | `#C87890` | Petal accents, small decorative details |
| Golden Amber | `#E8A84C` | Horizon glow, warm highlights |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Cream Stone | `#EDE5D5` | Borders, dividers, subtle backgrounds |
| Warm Off-White | `#FAF5EB` | Lightest surfaces, card backgrounds |
| Dusty Rose Beige | `#D8C0B0` | Muted text backgrounds, disabled states |
| Bronze | `#8B6838` | Metallic accents, lantern frames |
| Dark Brown | `#3A2818` | Darkest text, shadow accents |

### Gradient Definitions
| Name | Stops | Usage |
|------|-------|-------|
| Sunset Sky | `#7090B8` -> `#C0A0B0` -> `#F0B888` -> `#E8A050` | Hero background |
| Golden Glow | `#F5F0E8` -> `#E8D5C0` -> `#D4A050` @ 0% opacity | Overlay / vignette |
| Rose Fade | `#F0B0C0` @ 30% -> transparent | Floral section tint |
| Warm Marble | `#F5F0E8` -> `#F0E8E0` -> `#EDE5D5` | Surface texture |

---

## 8. Typography Styles (Recommended — not from video)

Since the video contains no text, these are recommendations based on the visual mood:

### Display / Heading Font
- **Style**: Elegant high-contrast serif with slight calligraphic quality
- **Candidates**: Cormorant Garamond, Playfair Display, Cinzel, Noto Serif Display
- **Weight**: 300-400 for names, 600 for section headings
- **Color**: Sunset Gold `#D4A050` or Dark Brown `#3A2818` depending on background
- **Size**: Large — 32-48px for names, 20-28px for section titles

### Body / Detail Font
- **Style**: Clean, refined sans-serif with good readability at small sizes
- **Candidates**: Montserrat, Lato, Jost, Inter
- **Weight**: 300-400
- **Color**: `#5A4838` (warm dark brown) or `#3A2818` (darkest brown)
- **Size**: 14-16px

### Script / Arabic Calligraphy Font
- **Style**: Naskh or Nastaliq for Bismillah / Quranic verse sections
- **Candidates**: Amiri, Scheherazade New, Noto Naskh Arabic
- **Weight**: 400
- **Color**: Sunset Gold `#D4A050`
- **Size**: 24-32px

### Monogram / Initial Font
- **Style**: Decorative, possibly with Islamic geometric influence
- **Candidates**: Could be custom SVG letter-forms incorporating geometric Islamic motifs
- **Color**: Gold with subtle shadow

---

## 9. Asset Production Priority

### Must-Have (P0) — Required for MVP
| Asset | Format | Notes |
|-------|--------|-------|
| Floral corner (top-left) | WebP/PNG with alpha | From the arch + flower garland |
| Floral corner (top-right) | WebP/PNG with alpha | Mirror or variant |
| Floral top-center drape | WebP/PNG with alpha | Connecting garland |
| Mosque silhouette | SVG | Clean outline for backgrounds |
| Lantern illustration | SVG | Stylized, simple |
| Rose petal set (4-6) | SVG or small PNG | For scatter decoration |
| Islamic geometric pattern tile | SVG | Repeating background texture |
| Four-pointed sparkle | SVG | Animated accent |
| Sunset sky gradient | CSS | Multi-stop gradient definition |

### Nice-to-Have (P1) — For enhanced version
| Asset | Format | Notes |
|-------|--------|-------|
| Arch silhouette frame | SVG | Full arch for section framing |
| Balustrade divider strip | SVG | Horizontal section separator |
| Bird silhouette | SVG | 1-2 simple shapes |
| Marble texture tile | WebP | Subtle surface texture |
| Mountain silhouette | SVG | Far background parallax |
| Detailed mosque with glow | WebP | Raster for hero background |
| Floral embroidery pattern | SVG | Delicate repeating pattern |
| Vine + flower vertical strip | WebP/PNG | Column decoration |

### Optional (P2) — For premium polish
| Asset | Format | Notes |
|-------|--------|-------|
| Full background scene composite | WebP | For static fallback |
| Fountain illustration | SVG | Mid-ground decoration |
| Tree silhouettes (palm, cypress) | SVG | Environmental detail |
| Animated petal particle system | JS/CSS | Floating petal animation |
| Cloud wisps | SVG or CSS | Sky detail |
| Water reflection effect | CSS | Subtle shimmer |

---

## 10. Video as Background Asset

The video itself (5.9MB at 720x1280) could potentially be used as a background element for the opening/hero section of the invitation:

| Consideration | Assessment |
|---------------|------------|
| File size | 5.9MB is borderline for mobile — needs compression/optimization |
| Resolution | 720x1280 is good for mobile portrait |
| Duration | 10s is appropriate for a looping hero background |
| Looping | Does NOT loop seamlessly — the end state (couple close-up) differs from start (empty terrace). Would need either: a) play once then hold last frame, or b) video editing to create a loop |
| Performance | Should use `preload="metadata"`, poster image, and `canplay` event listener |
| Optimization target | Compress to under 3MB ideally; consider WebM format for modern browsers with MP4 fallback |

# Taj Template — Reference Image Analysis

> Source: `/tmp/taj-reference-frame.jpg` (final frame of `public/templates/tajmahal/assets/opening.mp4`)
> Analyzed: 2026-11-11

---

## 1. Overall Design Identity

The Taj template draws its visual language from Mughal imperial architecture rendered in a cinematic night scene. The dominant impression is **midnight luxury** — a deep navy-black sky, warm gold uplighting on white marble, and a perfectly symmetrical composition centered on the Taj Mahal. The mood is reverent, romantic, and grand. The color story (navy + gold + cream/white) maps directly to a Muslim wedding invitation palette that feels both culturally rooted and contemporary. The reflecting pool creates a mirror-world effect that doubles the visual weight of the architecture, suggesting depth and eternity — an appropriate metaphor for a Nikah invitation.

---

## 2. Composition & Layout

### Structure
- **Aspect ratio**: Portrait, approximately 9:16 (mobile-native, ~1080 x 1920 or similar)
- **Symmetry**: Perfect bilateral symmetry along the vertical center axis. The Taj dome, central iwan (arched entrance), reflecting pool channel, and cypress rows all align on this axis.
- **Vertical thirds**:
  - **Top third (~0–33%)**: Deep navy sky with crescent moon (upper-right quadrant, ~25% from top, ~70% from left). Scattered faint stars. This zone is predominantly negative space — ideal for overlay text (couple names, Bismillah).
  - **Middle third (~33–66%)**: The Taj Mahal structure. Dome apex sits at ~28% from top. The building base sits at ~58% from top. Four minarets frame the edges at ~15% and ~85% horizontal.
  - **Bottom third (~66–100%)**: Reflecting pool and its mirror image of the building. The pool channel runs center. A four-pointed star sparkle sits at ~90% from top, ~60% from left.

### Visual Hierarchy
1. **Primary focal point**: Taj Mahal dome and central iwan (brightest, most detailed)
2. **Secondary**: Crescent moon (high contrast against dark sky, cultural marker)
3. **Tertiary**: Reflecting pool mirror (reinforces the primary)
4. **Ambient**: Cypress trees, minarets, stars (framing elements)

### Proportions & Spacing
- Taj structure occupies approximately **60% of frame width** and **30% of frame height**
- Minarets extend to ~85% frame width edge-to-edge
- Sky occupies ~30% of frame height above the dome
- Reflection zone occupies ~35% of frame height below the building base
- Cypress trees form a dark band at ~55–62% from top, roughly 7% of frame height

---

## 3. Architecture & Decorative Elements

### Taj Mahal Structure (observed)
- **Central dome (onion dome)**: Large bulbous dome with a lotus finial and crescent-topped spire. Warm gold lighting from below accentuates the curvature. Marble block lines faintly visible.
- **Central iwan (pishtaq)**: The large pointed arch on the front facade, with an inset rectangular frame containing a jali (lattice screen) pattern. This is the brightest zone on the building.
- **Flanking iwans**: Smaller pointed arches on either side of the central iwan, two-story, with similar inset arches.
- **Chattris (small domed kiosks)**: Visible at the corners of the main platform, flanking the central dome.
- **Minarets**: Four cylindrical towers with octagonal balconies and small domed caps. Each is ~3% of frame width. Warm light hits the upper portions.
- **Plinth/platform**: Visible as a horizontal white band with a row of small arched niches, sitting above the garden level.

### Decorative Patterns (inferred from Mughal vocabulary)
The image resolution shows these at a distance, but Mughal architecture features:
- **Pietra dura** (inlaid semi-precious stone floral patterns) — not individually visible but implied in the iwan decoration zones
- **Jali screens** (geometric lattice) — visible as the lighter panels within the central iwan
- **Arabesque scrollwork** — present in the spandrels above arches
- **Geometric interlace (girih)** — border patterns on arch frames
- **Calligraphy panels** — historically present on the Taj; not individually legible in this image

### Cultural Context
The Taj Mahal is Shah Jahan's monument of love for Mumtaz Mahal — making it the quintessential symbol for a Muslim wedding invitation. The architectural elements (pointed arches, domes, minarets) are directly associated with Islamic architectural tradition.

---

## 4. Color Analysis

### Extracted Palette

| Role | Hex | Description | Where observed |
|------|-----|-------------|----------------|
| **Sky / Background** | `#0B1628` | Midnight navy, near-black | Top 30% of frame, dominant background |
| **Sky mid-tone** | `#101D33` | Slightly lighter navy | Sky gradient near horizon |
| **Gold highlight (warm)** | `#D4A24E` | Rich warm gold | Uplighting on dome, iwan, minarets |
| **Gold bright** | `#E8C676` | Bright gold-cream | Hottest spots: central arch, dome apex |
| **Cream / Marble white** | `#F2E8D0` | Warm off-white | Lit marble surfaces, dome center |
| **Pure highlight** | `#FFFBE6` | Near-white warm | Brightest marble highlights |
| **Cypress / Foliage dark** | `#1A2A1A` | Very dark green-black | Cypress trees silhouettes |
| **Water / Reflection dark** | `#0D1520` | Near-black with blue cast | Reflecting pool surface |
| **Water reflection gold** | `#8B6B30` | Muted gold | Reflection of building in water |
| **Star sparkle** | `#E0E0E0` | Cool white | Four-pointed star on water |
| **Moon** | `#C8C8C0` | Cool grey-white | Crescent moon, unlit portion slightly visible |
| **Moon lit edge** | `#E8E4D8` | Warm off-white | Illuminated crescent edge |

### Palette Roles for Template
- **Primary background**: `#0B1628` (midnight navy) — all section backgrounds
- **Primary accent**: `#D4A24E` (gold) — borders, ornaments, decorative lines, icons
- **Text primary**: `#F2E8D0` (cream) — headings, couple names
- **Text secondary**: `#E8C676` (light gold) — subheadings, labels
- **Text body**: `#C8BFA8` (muted cream) — paragraph text, details
- **Decorative highlight**: `#FFFBE6` — sparkle effects, hover states
- **Subtle divider**: `#1E2D45` — section separators (navy slightly lighter than bg)

---

## 5. Typography Analysis

No text is present in the reference image. The following are **recommendations** based on the Mughal aesthetic and the midnight-gold palette:

### Display / Couple Names
- **Style**: Elegant serif with high contrast strokes, or a decorative script
- **Candidates**: Cormorant Garamond (Google Fonts), Playfair Display, or a Nastaliq-inspired display face
- **Weight**: Light to Regular (400–500) — thick strokes would compete with the ornamental surroundings
- **Size estimate**: 48–64px for names on a 402px-wide viewport
- **Color**: `#F2E8D0` (cream) or `#E8C676` (gold) for emphasis
- **Letter-spacing**: +0.05em to +0.1em for elegance

### Arabic / Dua Section
- **Style**: Authentic Arabic calligraphic font
- **Candidates**: Amiri (Google Fonts — Naskh style), Scheherazade New, or Noto Naskh Arabic
- **Weight**: Regular (400)
- **Size estimate**: 28–36px for Bismillah, 20–24px for Dua body
- **Color**: `#E8C676` (gold) — traditional for Quranic text on dark backgrounds

### Section Headings
- **Style**: Uppercase serif with generous tracking
- **Candidates**: Cormorant SC, Cinzel
- **Weight**: 500–600
- **Size estimate**: 18–24px
- **Letter-spacing**: +0.15em to +0.2em
- **Color**: `#D4A24E` (gold)

### Body Text (Event Details, RSVP)
- **Style**: Clean sans-serif for legibility
- **Candidates**: Outfit, Inter, or Lato
- **Weight**: 300–400
- **Size estimate**: 14–16px
- **Color**: `#C8BFA8` (muted cream)

---

## 6. Floral & Botanical Elements

### Observed in Image
- **Cypress trees**: ~12–14 dark conical silhouettes flanking the reflecting pool, arranged symmetrically. They form a dark green-black band between the building and the water. Heights vary (tallest ~5% frame height).
- **Garden strip**: A narrow horizontal band of green (~1% frame height) between the building platform and the cypress row, faintly visible.

### Inferred / Recommended for Template
The user brief specifies **roses and soft lighting**. These are not in the reference frame (which is pure architecture) but should be integrated into section design:
- **Rose motifs**: Gold-stroked line-art roses as section dividers or corner ornaments. Mughal miniature painting often features stylized roses (gul) in borders.
- **Vine scrollwork**: Trailing vine patterns inspired by pietra dura inlay — thin gold lines on navy.
- **Lotus motifs**: The Taj dome finial is a lotus. Stylized lotus can appear as decorative caps on section dividers.

---

## 7. Cultural Markers & Symbolism

| Element | Location in Image | Symbolism | Template Usage |
|---------|-------------------|-----------|----------------|
| **Crescent moon** | Upper-right, ~25% from top | Islamic symbol; night beauty | Opening section, possible section icon |
| **Taj Mahal dome** | Center, dominant | Eternal love (Shah Jahan + Mumtaz) | Video/opening hero, silhouette in section backgrounds |
| **Onion dome shape** | Throughout (main + chattris + minarets) | Mughal architecture, paradise imagery | Arch frames for section cards, SVG decorative headers |
| **Pointed arch (iwan)** | Central facade | Islamic architectural motif | Frame shape for couple photo, event cards |
| **Reflecting pool** | Bottom 35% | Symmetry, paradise garden (Char Bagh) | Subtle reflection CSS effects on key elements |
| **Four-pointed star** | Water surface, lower-right | Divine light, celestial | Sparkle animation, decorative scatter |
| **Minarets** | Four corners | Call to prayer, spiritual orientation | Vertical border elements, section pillars |
| **Jali lattice** | Central arch panels | Geometric Islamic art | Background patterns, overlay textures |
| **Cypress trees** | Flanking the pool | Eternity, mourning/remembrance in Islamic gardens | Silhouette decorative borders |
| **Char Bagh garden** | Implied by the layout | Paradise garden (Quran), quadrilateral symmetry | Section layout rhythm |

---

## 8. Technical Implementation Notes

### SVG-Buildable Elements (recommended)
These can be drawn as inline SVG for crisp rendering at any scale:
- **Pointed arch frames** (iwan shape) — simple bezier curves, reusable as section card frames
- **Crescent moon** — two overlapping circles, one clipped
- **Four-pointed star sparkle** — rotated squares or a star polygon
- **Jali / geometric lattice patterns** — repeating tile SVGs for background overlays (use `<pattern>`)
- **Dome silhouette** — for section dividers or footer decoration
- **Minaret silhouette** — vertical border decorations
- **Rose / floral line art** — stylized gold-stroke botanicals for section dividers
- **Arabesque scrollwork** — border ornaments, can be mirrored for symmetry
- **Ornamental divider lines** — horizontal rules with center medallion or floral node

### Raster Assets Needed
- **Opening video**: Already exists (`opening.mp4`) — 10s cinematic, final frame matches this reference
- **Video poster**: Extract from final frame or use the reference image as poster
- **Textured backgrounds** (optional): Subtle marble-grain or paper texture overlays at very low opacity (~3–5%) on the navy background to add depth. Can be a small tileable webp (~50KB).
- **Photo frames**: If the couple photo or gallery uses ornamental borders that are too complex for SVG, export as webp with transparency.

### Animation Opportunities
| Element | Animation | Technique |
|---------|-----------|-----------|
| Video-to-static transition | Video plays, fades to show couple names over final frame | `<video>` with `ended` event, opacity transition |
| Gold text reveal | Names fade in and rise | CSS `@keyframes` (translateY + opacity) |
| Crescent moon glow | Soft pulsing glow around the moon | CSS `box-shadow` animation or SVG filter `feGaussianBlur` |
| Star sparkle | Intermittent twinkle on stars | CSS `@keyframes` scale + opacity on SVG elements |
| Arch frame draw-on | SVG stroke-dashoffset animation for arch outlines | `stroke-dasharray` + `stroke-dashoffset` transition on scroll |
| Section entry | Sections fade up on scroll | IntersectionObserver + CSS transform (note: no fade-up in edit mode) |
| Reflecting pool shimmer | Subtle horizontal distortion on reflected elements | CSS `@keyframes` with slight translateX oscillation |
| Countdown flip | Number flip animation for days/hours/mins/secs | CSS 3D transforms or simple digit transition |
| Rose petal drift | Occasional floating petal particles | CSS `@keyframes` with random delays (limit to 5–8 petals for perf) |

### Z-Index Stack (front to back)
1. **z-50**: Overlay text (couple names, Bismillah) during opening
2. **z-40**: Navigation / sticky header (if any)
3. **z-30**: Modal overlays (RSVP form, gallery lightbox)
4. **z-20**: Floating decorative elements (sparkles, petals)
5. **z-10**: Section content (text, cards, images)
6. **z-5**: Decorative arch frames, border ornaments (SVG)
7. **z-1**: Background textures, lattice overlays
8. **z-0**: Section background (solid navy `#0B1628`)
9. **z-neg**: Video layer during opening sequence

### Performance Considerations
- SVG lattice patterns should use `<pattern>` with `patternUnits="userSpaceOnUse"` for efficient tiling — avoid duplicating geometry
- Limit particle animations (sparkles, petals) to `will-change: transform, opacity` and cap at 8–10 elements
- Video: `preload="metadata"`, poster image required, `canplay` event for play retry (per project rule)
- Gold gradient effects: use CSS `linear-gradient` or `radial-gradient` rather than image assets
- All decorative SVGs should be inline (not `<img>`) for theme-ability and animation access
- Background textures: lazy-load, keep under 80KB each

### Section Background Strategy
All 8 sections share the midnight navy (`#0B1628`) base. Differentiation comes from:
- **Decorative borders**: Gold arch frames or horizontal ornamental dividers between sections
- **Subtle gradient shifts**: Very slight gradient overlays (e.g., `#0B1628` to `#0F1E35` vertical) to create depth
- **Pattern overlays**: Jali lattice at 3–5% opacity on select sections (Dua, Celebrations)
- **Accent panels**: Certain content cards (event details, RSVP) could use a slightly lighter navy (`#12223D`) or a translucent gold-tinted panel

---

*This analysis is based on the reference frame image. Design decisions for individual sections should be documented in section-specific planning files.*

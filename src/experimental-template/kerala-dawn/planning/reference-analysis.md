# Kerala Dawn -- Reference Video Analysis

**Source:** `src/experimental-template/public/kerala.mp4` (720x1280, 10s, 24fps)
**Frames analyzed:** 10 evenly-spaced keyframes (`/tmp/kerala-frames/frame_001.jpg` -- `frame_010.jpg`)

---

## 1. Overall Design Identity

The reference depicts a cinematic pre-dawn Kerala landscape rendered in a painterly 3D style. A lamp-lit mandapam (wedding pavilion) sits beside a winding river, flanked by terraced paddy fields and coconut palms, with a Dravidian temple gopuram in the mid-ground and the Western Ghats silhouetted in the distance. The entire sequence is a lighting progression: the scene begins in near-total darkness (frame 1) and unfolds as oil lamps are progressively lit inside and around the mandapam (frames 2--5), ultimately reaching a steady, warm glow against the cool pre-dawn sky (frames 6--10). The mood is devotional, intimate, and quietly cinematic -- wedding-morning anticipation conveyed through the interplay of warm lamplight and cool ambient blue.

---

## 2. Composition & Layout

### Vertical structure (720x1280 portrait)

| Zone | Y range (approx %) | Content |
|------|-------------------|---------|
| Sky | 0--40% | Deep teal-black sky, subtle gradient toward blue at horizon |
| Mountains | 38--48% | Western Ghats silhouette, 2--3 layered ridgelines |
| Mid-ground | 45--60% | Temple gopuram, coconut palm treeline, traditional Kerala-style buildings with tiled roofs |
| Focal point | 48--70% | Mandapam (wedding pavilion) with oil lamps, jasmine garlands, wooden steps descending to river |
| River | 55--75% | S-curved waterway flowing from upper-left toward lower-right, reflecting lamp glow |
| Paddy fields | 60--95% | Terraced rice paddies flanking both sides of the river, vivid green |
| Foreground | 85--100% | Close paddy grass, slightly soft/blurred for depth |

### Horizontal structure

- The mandapam is positioned at roughly **55--75% from left**, in the right-center of the frame.
- The river follows an S-curve from upper-left (~30%) to lower-right (~65%).
- The gopuram sits at roughly **45--55% from left**, centered behind and left of the mandapam.
- Coconut palms are scattered across the **20--80%** horizontal range, with clusters near the temple.

### Visual hierarchy

1. **Primary focal point:** The mandapam and its oil lamp glow (highest contrast, warmest color in the frame).
2. **Secondary:** The gopuram (subtly lit, catches light in later frames).
3. **Tertiary:** River reflections (echoing the lamp glow, adding depth).
4. **Background:** Mountains and sky (lowest contrast, establishing scale and atmosphere).

### Depth planes (front to back)

1. Foreground paddy grass (soft focus, ~0--100px from bottom)
2. Near paddy terraces and river banks
3. Mandapam with steps and floating lamps
4. River surface (reflections)
5. Far paddy terraces
6. Temple gopuram and traditional buildings
7. Coconut palm treeline
8. Mountain ridgelines (2--3 layers)
9. Sky

### Interactive element

A **four-pointed star icon** is visible at bottom-center (~50% x, ~93% y) in all frames -- approximately 30x30px, light gray/white (#C8C8C8). This is the touch-to-start interaction target referenced in the brief.

---

## 3. Architecture & Decorative Elements

### Mandapam (wedding pavilion)

- **Structure:** Open-sided pavilion with 4 visible wooden pillars supporting a pitched tiled roof (traditional Kerala clay tile style). The roof has a pyramidal hip-roof profile.
- **Roof:** Dark brown clay/terracotta tiles (#4A3528). By frame 5+, the roofline is outlined with a string of golden oil lamps (~30--40 individual lights along the eaves).
- **Pillars:** Carved wooden columns, approximately square cross-section, painted/aged to a warm brown-gold (#8B6914 in lamplight). Visible carved details at the top (brackets/capitals).
- **Base:** Raised stone or laterite platform approximately 1m above water level, with wooden steps descending into the river (4--5 steps visible).
- **Garlands:** White jasmine/flower garlands (thoranam) draped between pillars in scalloped curves. Visible as white arcs with green leaf backing (#FFFFFF over #2D5A27).
- **Interior:** A central nilavilakku (traditional brass oil lamp) is the first element to illuminate (frame 2). Multiple smaller lamps (vilakku) line the platform perimeter.
- **Scale estimate:** ~12--15% of frame width, ~10--12% of frame height.

### Temple Gopuram

- **Position:** Behind and left of mandapam, ~20% smaller in apparent size.
- **Style:** Multi-tiered Dravidian gopuram, 5--6 tiers visible, tapering to a point. Cream/sandstone colored (#E8D5A3 to #D4C99A).
- **Detail level:** Moderate -- individual tier separations visible, carved figures suggested but not individually rendered. The gopuram catches warm light starting around frame 6, becoming more luminous by frame 8+.
- **Surrounding structures:** Low Kerala-style buildings with red/brown tiled roofs flanking the temple, partially obscured by palms.

### Traditional buildings

- Low-rise structures with sloped tiled roofs, white-washed walls glimpsed between trees. Typical Kerala nalukettu (courtyard house) proportions.

---

## 4. Color Analysis

### Sampled hex values by role

| Role | Hex | RGB | Where sampled |
|------|-----|-----|---------------|
| **Sky -- darkest** | `#0A1A1A` | 10, 26, 26 | Top of frame 1 |
| **Sky -- pre-dawn zenith** | `#0F2832` | 15, 40, 50 | Top of frame 8 |
| **Sky -- horizon gradient** | `#1E3845` | 30, 56, 69 | Horizon line, frame 8 |
| **Mountain silhouette -- near** | `#1A3328` | 26, 51, 40 | Nearest ridge |
| **Mountain silhouette -- far** | `#2A4552` | 42, 69, 82 | Farthest ridge (atmospheric perspective) |
| **Paddy field -- dark** | `#1B3A1A` | 27, 58, 26 | Paddy in shadow, frame 1 |
| **Paddy field -- lit** | `#2D5A27` | 45, 90, 39 | Paddy catching ambient, frame 5+ |
| **Paddy field -- bright** | `#3A7030` | 58, 112, 48 | Nearest paddy terrace, frame 8+ |
| **River -- dark** | `#1A2E38` | 26, 46, 56 | River in shadow |
| **River -- reflection** | `#8B7030` | 139, 112, 48 | Lamp reflection on water |
| **Mandapam roof** | `#4A3528` | 74, 53, 40 | Tile roof |
| **Mandapam pillars** | `#8B6914` | 139, 105, 20 | Pillar in lamplight |
| **Lamp flame -- core** | `#FFD080` | 255, 208, 128 | Brightest lamp flame |
| **Lamp flame -- hot** | `#FFEECC` | 255, 238, 204 | Overexposed lamp center |
| **Lamp glow -- mid** | `#D4A236` | 212, 162, 54 | Warm glow on surfaces |
| **Lamp glow -- outer** | `#A07820` | 160, 120, 32 | Glow falloff |
| **Gopuram stone** | `#D4C99A` | 212, 201, 154 | Gopuram facade, frame 8 |
| **Garland white** | `#E8E0D0` | 232, 224, 208 | Jasmine garland |
| **Star icon** | `#C8C8C8` | 200, 200, 200 | Touch-to-start element |
| **Coconut palm** | `#1D3D1A` | 29, 61, 26 | Palm frond silhouette |

### Palette mapping to brief

| Brief color | Brief hex | Closest sampled | Match quality |
|-------------|-----------|-----------------|---------------|
| Deep teal-black | `#0A1F1C` | `#0A1A1A` (sky darkest) | Very close; video sky is slightly cooler/bluer |
| Paddy green | `#2D5A27` | `#2D5A27` (paddy lit) | Exact match |
| Lamp gold | `#D4A236` | `#D4A236` (lamp glow mid) | Exact match |
| Kasavu cream-gold | `#E8D5A3` | `#D4C99A` (gopuram) | Close; video stone is slightly more muted/olive |
| Cool slate blue | `#2A3D4E` | `#2A4552` (far mountain) | Close; video has slightly more teal |
| Warm ivory | `#F5EFE0` | `#FFEECC` (lamp hot center) | Nearby; video ivory only appears in overexposed lamp cores |

### Color temperature distribution

- **Cool dominant:** ~85% of frame area is cool teal-blue-green (sky, mountains, paddy, river).
- **Warm accent:** ~15% is warm gold-amber, concentrated entirely in the mandapam region and its water reflections.
- This ratio shifts from ~98% cool / 2% warm in frame 1 to ~80% cool / 20% warm by frame 5+.

---

## 5. Typography Analysis

No text appears in the reference video except the star interaction icon. Based on the visual mood, the following font recommendations align with the cultural and atmospheric identity:

### Recommended primary (names/titles)

- **Style:** High-contrast transitional serif with fine hairlines, evoking traditional Kerala brass/copper inscriptions.
- **Closest Google Fonts:** Cormorant Garamond (Light/Regular), Playfair Display (Regular), or EB Garamond.
- **Weight:** 300--400 for elegance; avoid heavy weights that would clash with the ethereal dawn mood.
- **Color:** Kasavu cream-gold `#E8D5A3` or warm ivory `#F5EFE0` against the dark sky.
- **Size estimate for names:** 36--48px at 720px width (5--6.7% of viewport width).

### Recommended secondary (event details)

- **Style:** Clean sans-serif or a light humanist serif for readability.
- **Closest Google Fonts:** Lato (Light), Source Sans 3 (Light), or Noto Sans (Light).
- **Weight:** 300.
- **Color:** Muted ivory `#E8D5A3` at 80% opacity for hierarchy.
- **Size estimate:** 14--18px at 720px width.

### Malayalam script consideration

- If Malayalam text is needed: Noto Sans Malayalam or Noto Serif Malayalam from Google Fonts.
- The decorative serif should only be used for English/Latin script names.

### Text placement zones (inferred from composition)

- **Names:** Upper sky region (5--30% Y) where the frame is nearly pure dark teal -- maximum contrast with light text.
- **Event details:** Either overlaid at 0--35% Y below names, or in a dedicated section below the video.

---

## 6. Floral & Botanical Elements

### Jasmine garlands (thoranam / mala)

- **SEEN:** White scalloped garlands draped between mandapam pillars. Approximately 4--5 arcs visible across the front face.
- **Form:** Each arc sags ~15--20px at center, with visible leaf-green backing strip.
- **Color:** Off-white `#E8E0D0` (petals) over `#4A6B3A` (leaf backing).
- **Implementation:** SVG path for scalloped curve, or raster strip if detail is needed. The garlands are relatively small in frame and could be simplified to a decorative line pattern.

### Coconut palms

- **SEEN:** 10--15 coconut palms scattered across the mid-ground, concentrated near the temple. Heights vary, creating a natural uneven skyline.
- **Form:** Classic tall trunk (slightly curved) with a crown of 6--8 fronds radiating from the top.
- **Color:** Trunks are dark gray-brown `#2A2A20`; fronds are dark green `#1D3D1A`, barely distinguishable from the surrounding darkness in early frames.
- **Implementation:** These are mid-ground silhouettes -- SVG silhouette paths would work. No need for detailed leaf rendering.

### Paddy rice

- **SEEN:** Terraced rice paddies filling the entire lower 40% of the frame. Individual rice stalks are visible in the nearest foreground terrace.
- **Form:** Flooded paddy with raised bund (earthen borders) separating terraces. The bunds follow the river's S-curve.
- **Color:** Deep green `#1B3A1A` (shadow) to vibrant green `#3A7030` (ambient lit). The terracing creates natural striped patterns.
- **Implementation:** This is part of the video background, not a separate overlay. For static sections, a gradient or texture could approximate it.

### Foliage clusters

- **SEEN:** Low tropical vegetation along the riverbank (bottom-left, around 80% Y, 10--25% X). Fern-like or banana-leaf plants.
- **Form:** Dark clusters, not individually detailed.
- **Color:** `#1A3518` to `#254A20`.

### Floating flowers / lamps

- **SEEN:** Small glowing points on the river surface near the mandapam steps (frames 3+). These appear to be floating oil lamps (thoni vilakku) or flower offerings.
- **Count:** 4--6 floating elements visible.
- **Color:** Warm gold `#D4A236` point lights with soft glow.
- **Implementation:** CSS radial-gradient circles with animation for gentle drift. Very small (~4--6px).

---

## 7. Cultural Markers & Symbolism

### Nilavilakku (traditional brass oil lamp)

- **SEEN:** Central lamp inside the mandapam, the first light to appear (frame 2). This is the primary ceremonial element.
- **Form:** Traditional standing brass lamp with a wide base, fluted column, and flower-shaped oil reservoir at the top. The flame is the brightest single point in the frame.
- **Cultural significance:** The nilavilakku is lit at the start of all auspicious Kerala Hindu ceremonies. Its ignition is the symbolic beginning of the wedding.
- **Implementation note:** This is the touch-to-start interaction target. The lamp lighting sequence (frames 1--3) directly maps to the user interaction: tap the star, the lamp ignites, the mandapam illuminates.

### Additional oil lamps (vilakku)

- **SEEN:** 6--8 standing lamps on the mandapam platform perimeter, plus ~30--40 small lamps lining the roofline (visible from frame 4 onward).
- **Form:** Smaller versions of the nilavilakku on the platform; tiny individual flames along the roof edge.

### Mandapam (wedding pavilion)

- **SEEN:** Open-sided pavilion structure, the setting for the wedding ceremony.
- **Cultural significance:** The mandapam is where the thali (mangalsutra) tying ceremony takes place. Its riverside setting evokes the purification rituals associated with temple ponds (kulam).

### Temple gopuram

- **SEEN:** Multi-tiered Dravidian temple tower in the mid-ground.
- **Cultural significance:** Signals a temple-adjacent wedding, common in traditional Kerala Hindu weddings. The gopuram style is South Indian Dravidian (not Kerala Kovil style, which typically has a simpler tower -- this may be an artistic liberty blending Tamil gopuram aesthetics with the Kerala landscape).

### Kasavu reference

- **INFERRED (not directly seen):** The cream-gold color palette of the gopuram and lamp glow evokes the kasavu (gold border) of the traditional Kerala mundu/sari. The brief explicitly calls for kasavu border motifs in overlays.

### River / water

- **SEEN:** S-curved river with lamp reflections.
- **Cultural significance:** Water purification is central to Hindu wedding rituals. The river setting suggests proximity to a temple pond or sacred waterway.

### Paddy fields

- **SEEN:** Prominent terraced rice paddies.
- **Cultural significance:** Rice paddies are iconic Kerala landscape markers and symbolize prosperity and fertility in wedding contexts.

### Banana plant

- **INFERRED:** A plant at the far-right edge (~85% X, 70% Y) in frames 5+ resembles a banana plant. Banana plants are traditionally placed at wedding venue entrances as auspicious markers (kalpavriksha).

### Elements NOT seen but in brief

The following elements from the creative brief are NOT visible in the reference video and would need to be added as SVG/CSS overlays in the template:
- **Kasavu border pattern** (gold-bordered textile motif)
- **Elephant motifs** (none visible)
- **Banana leaf** (as decorative element, not the plant)
- **Jasmine garland** close-up detail (garlands are visible but small-scale)

---

## 8. Lighting & Atmosphere Progression

### Frame-by-frame analysis

| Frame | Time (est.) | Sky luminance | Mandapam state | Key change |
|-------|-------------|---------------|----------------|------------|
| **1** | 0.0s | Very dark, near-black `#0A1A1A` | Almost invisible; 1--2 faint lamp glints on pillars | Scene establishing shot; only the faintest suggestion of structure. Star icon visible at bottom. Paddy barely distinguishable from river. |
| **2** | ~1.1s | Same dark `#0A1A1A` | Central nilavilakku ignites; warm glow `#D4A236` illuminates the mandapam interior and reflects in river | **KEY TRANSITION:** The lamp lighting is the inciting event. The mandapam structure becomes readable. Jasmine garlands first visible. Floating lamps appear on water. River reflections begin. Gopuram faintly visible. |
| **3** | ~2.2s | Marginally lighter `#0E2028` | All platform lamps lit; roofline lamps beginning | Light intensity ~3x frame 2. Pillar details and garland scallops now clear. Water reflections are strong. Palm tree silhouettes become distinct against the slightly lighter sky. Paddy fields transition from black to dark green. |
| **4** | ~3.3s | Slightly lighter `#0F2530` | Roofline lamps fully lit; total mandapam illumination | **PEAK ILLUMINATION REACHED.** The mandapam is now a warm beacon. All structural details visible: roof tiles, pillar capitals, garland loops, floating lamps. Mountains emerge as layered silhouettes. Gopuram structure is readable. |
| **5** | ~4.4s | Pre-dawn blue emerging `#102A35` | Stable; same as frame 4 | Sky begins blue-shift at horizon. Mountain layers gain atmospheric perspective (nearer = darker green-black, farther = blue-gray). Paddy fields are clearly vibrant green. Scene is now fully established. |
| **6** | ~5.5s | Subtle brightening `#132D3A` | Stable | Gopuram catches more light, facade detail emerging. Very slight star visible in upper sky (~20% X, ~5% Y). The cool-warm contrast is at its most dramatic. |
| **7** | ~6.6s | Same as 6 | Stable | Nearly identical to frame 6. The animation is at steady-state for the latter half. Minor water surface ripple variation (the reflections shimmer slightly). |
| **8** | ~7.7s | Same as 6--7 | Stable | Gopuram is slightly brighter/more cream-toned `#D4C99A`. The scene has reached its final lighting state. |
| **9** | ~8.8s | Same | Stable | Continuation of steady state. Stars faintly visible. |
| **10** | ~9.9s | Same | Stable | Final frame. No further progression. |

### Lighting transition summary

- **Phase 1 (0--1s, frame 1):** Total darkness. The scene is a mystery.
- **Phase 2 (1--2.5s, frames 2--3):** Lamp ignition. Rapid illumination of the mandapam. This is the dramatic reveal.
- **Phase 3 (2.5--4.5s, frames 3--5):** Full illumination achieved. The roofline lights up, paddy fields and mountains become visible.
- **Phase 4 (4.5--10s, frames 5--10):** Steady state. Subtle pre-dawn sky lightening. The video loops or holds this frame for text overlays.

### Light source characteristics

- **Primary:** Nilavilakku central flame -- point source, warm `#FFD080`, soft circular falloff.
- **Secondary:** Platform perimeter lamps -- ~8 point sources, `#D4A236`, each with ~50px glow radius.
- **Tertiary:** Roofline lamp string -- continuous warm line light along roof edges, `#C89828`.
- **Ambient:** Pre-dawn sky -- very low, cool blue `#0F2832`, provides fill light on paddy fields and mountain faces.
- **Reflected:** River surface mirrors all warm sources, approximately 60% intensity with horizontal smearing (ripple distortion).

### Color temperature arc

- Frame 1: ~3000K warm spots in ~2500K ambient (near-monochrome dark)
- Frames 2--4: Warm pool expands, ~3200K mandapam region, ~5500K cool ambient contrast
- Frames 5--10: Settled at strong warm-cool bimodal: `#D4A236` (warm, ~3000K) vs `#1E3845` (cool, ~8000K equivalent)

---

## 9. Technical Implementation Notes

### Video background approach

The reference video is the **opening section's background**. It should be used as a `<video>` element with the following properties:
- `preload="metadata"`, poster image from frame 5 or 8 (the fully-lit steady state)
- `playsinline`, `muted`, `loop` (or controlled playback tied to the lamp interaction)
- The video handles the entire dawn-lighting progression; no need to replicate the lamp-lighting animation in code

### SVG vs. Raster decision matrix

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| Video background (mandapam, river, fields, mountains) | **Raster (video)** | Complex 3D-rendered scene with lighting, reflections, textures -- cannot be reproduced in SVG |
| Kasavu border pattern | **SVG** | Geometric repeating pattern (gold stripes with paisley/leaf motifs). Clean scalability. |
| Nilavilakku icon (for touch target) | **SVG** | Clean silhouette shape; needs to be crisp at small sizes. |
| Elephant motifs | **SVG** | Stylized decorative silhouettes. Can be drawn as clean paths. |
| Jasmine garland border | **SVG or CSS** | Scalloped curve with circle clusters. SVG path with repeated circle elements. |
| Banana leaf | **SVG** | Simple elongated leaf shape with central vein. |
| Floating lamp glow | **CSS** | `radial-gradient` circles with CSS animation for drift/flicker. |
| Star interaction icon | **SVG** | Simple 4-pointed star. Already in the video but needs to be an interactive overlay. |
| Section dividers | **SVG** | Kasavu-inspired horizontal rules with gold color. |
| Text overlays (names, dates) | **HTML/CSS** | Standard text rendering with text-shadow for glow effect. |

### Animation opportunities

1. **Lamp interaction (opening):** User taps the star icon at bottom-center. Video plays from frame 1 to frame 5 (~4.5s). Names fade in against the sky during frames 3--5. This is the hero interaction.
2. **Floating lamp drift:** CSS `@keyframes` for gentle horizontal sway (translateX +/- 3px) and opacity pulse (0.7--1.0) on floating lamp elements, if added as overlays.
3. **Text reveal:** Names and subtitle text fade-in with slight upward translate (per project convention: fade in while rising from below). Triggered when video reaches steady state (~frame 4).
4. **Kasavu border shimmer:** Subtle CSS animation on SVG kasavu border overlays -- a traveling highlight (linear-gradient mask moving left-to-right at ~4s interval) to evoke silk sheen.
5. **Scroll-triggered sections:** Below the opening video, subsequent sections (event details, venue, etc.) can use the standard scroll-reveal pattern.

### Z-index stack (opening section)

| Z-index | Layer | Content |
|---------|-------|---------|
| 0 | Video background | `kerala.mp4` playing or paused at poster frame |
| 1 | Gradient overlay | Top `linear-gradient(to bottom, rgba(10,26,26,0.3), transparent 40%)` for text legibility |
| 2 | Kasavu border overlays | SVG decorative borders at top/bottom edges of viewport |
| 3 | Text layer | Names, subtitle, date -- positioned in upper 35% of viewport |
| 4 | Floating elements | Optional: SVG jasmine petals or lamp glow particles |
| 5 | Interaction layer | Touch-to-start star icon and its tap target area |

### Poster frame recommendation

- **Ideal poster:** Frame 8 (fully lit mandapam, pre-dawn sky, all details visible). This gives the best static preview while the video loads.
- **Alternative:** Frame 5 (first frame at steady state) for a slightly darker, more dramatic initial impression.

### Performance considerations

- Video file at 720x1280 is appropriately sized for mobile-first delivery.
- A WebP poster image extracted from frame 8 should be ~50--80KB.
- The lamp-lighting sequence is front-loaded (first 4 seconds), so the critical visual payoff happens quickly even on slow connections.
- All SVG decorative overlays should be inlined (no external SVG file loads) for the opening section.
- Kasavu border SVGs should be kept under 5KB each.

### Aspect ratio notes

- Reference: 720x1280 = 9:16 portrait (standard mobile video).
- InvitationViewport phone preview: 402x874 = ~1:2.17 (slightly wider than 9:16). The video will need slight horizontal crop or letterboxing.
- Recommendation: Use `object-fit: cover` on the video element to fill the viewport, accepting minor crop on left/right edges.

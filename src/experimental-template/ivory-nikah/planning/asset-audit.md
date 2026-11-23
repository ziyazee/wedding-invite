# Ivory Nikah — PNG Asset Audit

## Summary

| Category | Files | Total Size | Style Consistency |
|----------|-------|-----------|-------------------|
| Animated (petals) | 5 | 5.9 MB | CONSISTENT |
| Backgrounds | 1 | 1.8 MB | CONSISTENT |
| Decorative | 5 | 8.2 MB | CONSISTENT |
| **Total** | **11** | **15.9 MB** | **All assets match template direction** |

---

## Animated Assets

### petal-1.png
- **Path:** `assets/images/animated/petal-1.png`
- **Size:** 1,095,466 bytes (1.04 MB)
- **Content:** Single elongated jasmine petal, teardrop shape tapering to a point at the base. Oriented diagonally (upper-right to lower-left). Transparent background (PNG alpha). The petal is warm ivory-white with visible veining radiating from the base. Slight golden-cream tint along the outer edge.
- **Style assessment:** MATCH. The warm ivory tone aligns with the reference palette. The petal has a photorealistic quality with soft shading that will look natural floating over the marble background. The veining detail adds naturalism appropriate for the bas-relief aesthetic.
- **Quality:** High resolution, clean alpha cutout. Minor observation: a very small yellow artifact pixel visible near the base tip — negligible at animation scale.
- **Recommended usage:** Floating petal particle animation. This elongated shape suits a tumbling/spiraling fall trajectory. Use with CSS rotation keyframes for variety.
- **Issues:** File size is large for a particle element. Recommend serving at reduced dimensions (e.g., 80-120px wide) and consider WebP conversion for production (~60-70% size reduction expected).

### petal-2.png
- **Path:** `assets/images/animated/petal-2.png`
- **Size:** 1,580,552 bytes (1.51 MB)
- **Content:** Broad, rounded jasmine petal — wider and more circular than petal-1. Fan-shaped with radiating veins from a yellow-green base point. Nearly symmetrical. Transparent background.
- **Style assessment:** MATCH. Slightly warmer/creamier tone than petal-1, which provides natural variety (real jasmine petals vary in tone). The broader shape will read differently in animation — more floating/drifting than spiraling.
- **Quality:** High resolution, clean cutout. Alpha edges are slightly rougher than petal-1 (minor fringing visible at full zoom) but imperceptible at animation scale.
- **Recommended usage:** Floating petal animation, alternating with petal-1 for shape variety. The broader profile catches more "air" visually — use with slower, gentler drift animations.
- **Issues:** Largest petal file at 1.51 MB. Same size/format optimization recommendation as petal-1.

### petal-3.png
- **Path:** `assets/images/animated/petal-3.png`
- **Size:** 681,741 bytes (666 KB)
- **Content:** Narrow, elongated crescent/curved petal shape. This is the most dynamic shape in the set — it curls slightly along its length axis, suggesting a petal caught mid-fall or a petal that has naturally curled as it dried. Transparent background.
- **Style assessment:** MATCH. Pure ivory-white, slightly cooler tone than petals 1-2 but within the palette range. The curved form adds motion energy to the set.
- **Quality:** Good resolution, clean alpha. Smallest and best-optimized of the petal set.
- **Recommended usage:** Fast-falling petal animation. The curved aerodynamic shape suggests quick, decisive movement — use with rotation and faster descent speed than the broader petals.
- **Issues:** None. This is the most efficiently sized petal asset.

### petal-4.png
- **Path:** `assets/images/animated/petal-4.png`
- **Size:** 1,431,733 bytes (1.37 MB)
- **Content:** Medium-wide petal with an asymmetric teardrop shape. Slight concave curl visible (the petal cups slightly toward the viewer). Radiating veins from a yellow-green base. The upper edge has a gentle wavy contour. Transparent background.
- **Style assessment:** MATCH. Warm ivory with subtle warm-edge tinting. The cupped shape adds 3D character. Visible yellow-green artifact pixels along the upper edge — more prominent than on other petals.
- **Quality:** High resolution. The alpha cutout shows yellow/green fringing artifacts along portions of the edge, particularly the upper-left contour. These are likely remnants of the original background removal process.
- **Recommended usage:** Floating petal animation at medium speed. The cupped shape provides visual weight.
- **Issues:** MINOR — Yellow-green fringe artifacts along edges are more visible than on other petals. At small animation sizes (80-120px) these will not be perceptible, but if any petal is displayed larger (e.g., as a decorative element), petal-4 should be avoided or the edges should be cleaned.

### petal-5.png
- **Path:** `assets/images/animated/petal-5.png`
- **Size:** 1,236,665 bytes (1.18 MB)
- **Content:** Broad, heart-shaped petal with a slightly pointed base. The most symmetrical and "iconic" petal shape in the set. Flat presentation (no curl). Soft veining visible. The upper edge has a subtle yellow fringe similar to petal-4. Transparent background.
- **Style assessment:** MATCH. Clean ivory-white, very close to the reference marble tone. This is the most "neutral" petal — least dynamic shape but most recognizable as a flower petal.
- **Quality:** High resolution, decent alpha cutout. Some yellow artifact fringing along upper edge (same issue as petal-4, slightly less pronounced).
- **Recommended usage:** Gentle floating animation. The symmetric shape suits slow, leaf-like drifting motion. Also suitable as a static decorative scatter element.
- **Issues:** MINOR — Same yellow-edge fringing as petal-4, slightly less severe. Negligible at animation scale.

### Petal Set Overall Assessment
- **Variety:** Good. Five distinct shapes provide sufficient visual diversity for a natural-looking petal rain/scatter animation. Shapes range from narrow/curved (petal-3) to broad/round (petal-2, petal-5).
- **Color consistency:** All petals are within the warm ivory-white range. The slight tone variation between petals is a positive — it simulates natural petal color variation.
- **Size concern:** Total petal set is 5.9 MB. For a floating animation that may display 10-20 petals simultaneously, this is excessive. Recommendation: resize to 120px max dimension and convert to WebP. Expected optimized total: ~200-400 KB.
- **Alpha quality:** Petals 1-3 have clean edges. Petals 4-5 have minor yellow-green fringing. All are acceptable at intended animation scale.

---

## Background Assets

### marble-texture.jpg
- **Path:** `assets/images/backgrounds/marble-texture.jpg`
- **Size:** 1,852,610 bytes (1.77 MB)
- **Content:** Warm ivory marble texture — a seamless-looking surface with natural veining in golden-tan tones against a cream/ivory base. The veining follows organic diagonal patterns typical of onyx or travertine marble. No seams or tiling artifacts visible.
- **Style assessment:** STRONG MATCH. This is an excellent translation of the reference's carved marble surface. The warm ivory base matches `#F5EDD6` closely. The golden veining echoes the gold accent palette. The texture has the right warmth — it reads as "Mughal palace marble" rather than cold modern marble.
- **Quality:** High resolution, good detail. JPEG compression artifacts are minimal. The texture appears tileable (edges look like they could repeat), which is useful for full-page backgrounds.
- **Recommended usage:** Primary page background texture. Apply at 15-25% opacity over the `#FAF7F0` soft cream base color. Can also be used at full opacity for section divider bands or card surfaces, with a subtle CSS `background-blend-mode: soft-light` to warm it further.
- **Issues:** At 1.77 MB, this is appropriate for a background image but should be served responsively — provide a 600px-wide version for mobile and the full resolution for desktop. Consider WebP conversion (~40% savings expected).

---

## Decorative Assets

### door-left.png
- **Path:** `assets/images/decorative/door-left.png`
- **Size:** 2,208,759 bytes (2.11 MB)
- **Content:** Left half of the Mughal palace double doors. Portrait orientation (approximately 1:2 aspect ratio). Shows the full left door panel from the scalloped arch top through to the base. Includes: partial scalloped arch (3-4 lobes visible on the left side), carved jasmine vine bas-relief on the upper panel, a gold lotus door knocker with ring centered on the panel, dense floral arabesque on the lower panel, gold bead trim along the right (meeting) edge, partial pilaster column on the far left, and dappled natural light shadows on the upper portion. Transparent background (right side is alpha-transparent where the other door would be).
- **Style assessment:** DIRECT REFERENCE MATCH. This is a high-fidelity cutout of the left door from the reference image itself. Every detail — the arch lobes, the knocker placement, the vine patterns, the gold trim — matches exactly.
- **Quality:** Excellent. Clean alpha cutout along the right door edge. The carved relief detail is sharp and well-preserved. The natural lighting and shadow detail from the reference is intact, giving the asset photographic dimensionality.
- **Recommended usage:** Opening animation — the cinematic door-reveal. This door slides/rotates left to "open," revealing the invitation content behind it. The right door would be this same asset mirrored horizontally (CSS `transform: scaleX(-1)`).
- **Issues:** 
  - Only the left door is provided. The right door must be created by CSS horizontal flip. This works visually because the reference doors are near-symmetric, but the natural light shadows (upper-left origin) will appear reversed on the right door. At animation speed, this is unlikely to be noticed.
  - At 2.11 MB, this is heavy for a UI element. Consider WebP conversion and progressive loading — show the marble background first, then load doors for the opening animation.

### arch-frame.png
- **Path:** `assets/images/decorative/arch-frame.png`
- **Size:** 1,348,642 bytes (1.29 MB)
- **Content:** Complete Mughal mehrab arch frame, full width, with transparent interior opening. The arch shows a 7-lobed scalloped cusped profile with gold inner-edge trim. Above the arch, jasmine flower sprays (white 5-petal blooms with sage green leaves) fill the spandrel/tympanum area on both sides. Two slender columns with carved jali lattice panels flank the arch opening. The columns have carved acanthus-leaf capitals and square bases. The entire interior of the arch (the doorway area) is transparent alpha.
- **Style assessment:** DIRECT REFERENCE MATCH. The arch frame isolates the architectural framing element from the reference. The scalloped profile, gold trim, floral tympanum, and jali pillar details are all faithful to the original.
- **Quality:** Excellent. The alpha cutout of the arch interior is clean, allowing content to show through. The floral details in the spandrels are sharp. The jali lattice on the pillars is well-rendered with visible depth.
- **Recommended usage:** Primary framing element for the opening/hero section. Content (Bismillah, couple names, date) sits within the arch opening. The arch-frame overlays the content layer. Can also be used as a recurring section header frame (scaled down) for ceremony cards.
- **Issues:** None significant. The aspect ratio is close to the phone viewport (slightly wider than 9:16), which will need careful CSS fitting. Recommend `object-fit: contain` or responsive scaling to ensure the arch does not crop on narrow screens.

### floral-vine-border.png
- **Path:** `assets/images/decorative/floral-vine-border.png`
- **Size:** 582,796 bytes (569 KB)
- **Content:** Vertical jasmine vine border element — a tall, narrow composition (~1:5 aspect ratio) showing a continuous sinuous vine with 5 open jasmine flowers (5-petal, ivory-white, gold center dots), multiple buds, and sage-green pointed-oval leaves arranged along a curved golden-tan stem. The vine flows from bottom to top with an organic S-curve rhythm. Transparent background.
- **Style assessment:** STRONG MATCH. The carved bas-relief style of the flowers and leaves matches the door panel carvings from the reference. The color palette (ivory flowers, sage leaves, gold-tan stems) is consistent. The 3D relief quality is maintained — these look like carved marble elements, not flat illustrations.
- **Quality:** Good resolution with clean alpha cutout. Some minor yellow artifact pixels visible along the vine edges (similar to the petal fringing issue), but these are small and will not be visible at typical usage sizes.
- **Recommended usage:** Vertical section dividers (left/right border decoration), flanking content areas to create the "within carved doors" feeling. Mirror horizontally for the opposite side. Can also be tiled vertically for longer sections if the top/bottom ends are faded with CSS masking.
- **Issues:** MINOR — The top and bottom ends of the vine are abrupt (no fade-out or natural termination). This will need CSS gradient masking at the endpoints to blend seamlessly into the background. Yellow edge artifacts are present but minor.

### floral-corner.png
- **Path:** `assets/images/decorative/floral-corner.png`
- **Size:** 1,378,875 bytes (1.32 MB)
- **Content:** Corner ornament cluster showing 3 large open jasmine flowers (5-petal, ivory-cream, gold bead centers) surrounded by sage-green leaves, set within an ornate ivory scroll/acanthus frame with gold-edged curving tendrils. The composition is designed for a top-left corner placement, with the decorative mass concentrated in the lower-left and tendrils extending upward and to the right. A fleur-de-lis / palmette motif terminates the upper-right scroll. Transparent background.
- **Style assessment:** STRONG MATCH. The carved relief quality is consistent with the door panel aesthetic. The gold-edged scrollwork matches the door trim style. The jasmine flowers use the same visual language (5-petal, gold center) as the vine border and arch frame.
- **Quality:** Excellent. High detail, clean alpha cutout. The dimensional quality of the carved relief is very convincing — light and shadow on the scroll forms create depth. Some yellow and red artifact pixels visible in the transparency between scroll elements, but these are behind the solid forms and only visible at extreme zoom.
- **Recommended usage:** Section corner decorations — place at top-left and mirror/rotate for other corners. Use to frame celebration event cards, the couple photo area, or the RSVP section. Can be paired with the floral-vine-border for a complete framing system.
- **Issues:** MINOR — At 1.32 MB, this is heavy for a decorative element that may appear 4-8 times (rotated) on a page. Recommend resizing to a maximum of 300px on the longest edge and WebP conversion for production. Color artifact pixels in transparent areas are negligible.

### jali-lattice.png
- **Path:** `assets/images/decorative/jali-lattice.png`
- **Size:** 2,673,748 bytes (2.55 MB)
- **Content:** Square tile of Islamic geometric jali (carved screen) pattern. The pattern consists of interlocking 8-pointed stars and cross shapes formed by overlapping carved ivory bands with gold inner-edge trim. The voids between the lattice bands are transparent (alpha), creating a see-through screen effect. The pattern is a classic Islamic geometric design found in Mughal architecture (Fatehpur Sikri, Humayun's Tomb).
- **Style assessment:** STRONG MATCH. The jali pattern directly corresponds to the pillar lattice panels visible in the reference image. The ivory-and-gold material treatment is consistent. The geometric precision matches Mughal architectural tradition.
- **Quality:** High resolution with clean alpha transparency in the lattice voids. The carved-stone dimensionality is well-rendered — each lattice band has subtle light/shadow that gives it thickness. The gold inner trim is consistent.
- **Recommended usage:** 
  1. Background texture overlay at very low opacity (5-10%) to add subtle geometric pattern to section backgrounds.
  2. Decorative panel element (scaled and masked) flanking content areas, echoing the reference's pillar panels.
  3. Transition/reveal mask — animate content appearing through the lattice voids for a jali-screen reveal effect.
  4. Section divider bands — a horizontal strip of the lattice pattern between content sections.
- **Issues:** 
  - Largest decorative asset at 2.55 MB. For an overlay/texture use, this is excessive. Recommend: create a smaller (400x400px) WebP version for background tiling, and keep the full resolution only if used as a hero-scale decorative element.
  - The pattern tile may not be perfectly seamless at the edges — verify tiling behavior before using as a repeating `background-image`. If tiling is needed, CSS `background-size` and positioning may need adjustment.

---

## Cross-Asset Style Consistency Check

### Color palette consistency
| Asset | Ivory tone | Gold tone | Sage green | Verdict |
|-------|-----------|-----------|------------|---------|
| Petals 1-5 | Warm ivory-white | N/A | N/A | CONSISTENT |
| marble-texture.jpg | Warm ivory `~#F5EDD6` | Golden veining | N/A | CONSISTENT |
| door-left.png | Ivory marble | Antique gold trim & knocker | Sage carved leaves | REFERENCE SOURCE |
| arch-frame.png | Ivory marble | Gold arch trim | Sage jasmine sprays | CONSISTENT |
| floral-vine-border.png | Ivory flowers | Gold-tan stem | Sage leaves | CONSISTENT |
| floral-corner.png | Ivory flowers & scrollwork | Gold edge trim & centers | Sage leaves | CONSISTENT |
| jali-lattice.png | Ivory lattice bands | Gold inner trim | N/A | CONSISTENT |

**Verdict: All 11 assets are stylistically consistent with each other and with the approved creative brief palette.**

### Material/rendering consistency
All decorative assets share the same "carved marble bas-relief" rendering style — 3D dimensional quality with consistent upper-left lighting, subtle shadow play, and the same ivory marble material. No flat illustration or vector-style assets are present. This means the template will have a unified material language throughout.

### Alpha quality consistency
- **Clean:** marble-texture.jpg (no alpha needed), door-left.png, arch-frame.png
- **Good with minor artifacts:** floral-vine-border.png, floral-corner.png, petal-1.png through petal-3.png
- **Minor fringing:** petal-4.png, petal-5.png (yellow-green edge artifacts)

No asset has alpha quality issues severe enough to block usage. All artifacts are imperceptible at intended display sizes.

---

## Optimization Recommendations

| Priority | Asset(s) | Current | Recommended | Expected savings |
|----------|----------|---------|-------------|-----------------|
| HIGH | All petals (5) | 5.9 MB total PNG | Resize to 120px max, WebP | ~5.5 MB saved |
| HIGH | jali-lattice.png | 2.55 MB PNG | 400px tile WebP for bg use; keep full for hero | ~2.0 MB saved |
| MEDIUM | door-left.png | 2.11 MB PNG | WebP conversion | ~0.8 MB saved |
| MEDIUM | marble-texture.jpg | 1.77 MB JPG | Responsive sizes (600px mobile, full desktop), WebP | ~0.7 MB saved |
| MEDIUM | floral-corner.png | 1.32 MB PNG | Resize to 300px max, WebP | ~1.0 MB saved |
| LOW | arch-frame.png | 1.29 MB PNG | WebP conversion | ~0.5 MB saved |
| LOW | floral-vine-border.png | 569 KB PNG | WebP conversion | ~0.2 MB saved |

**Total current:** 15.9 MB
**Estimated optimized:** ~5.2 MB
**Potential savings:** ~67%

---

## Missing Assets (Not provided, may be needed)

1. **door-right.png** — Can be generated by CSS-mirroring `door-left.png` (acceptable trade-off).
2. **Gold divider/rule** — A horizontal ornamental line (e.g., a thin gold filigree bar) for section separations. Currently no dedicated divider asset exists; this can be created with CSS borders + gradient or derived by cropping from the floral-vine-border.
3. **Bismillah calligraphy** — If a pre-rendered Arabic calligraphy asset for the Bismillah is desired rather than live text via the Amiri font. May not be needed if the font approach works well.
4. **Audio icon / play button** — If the template will include nasheed or recitation audio, a styled play button matching the aesthetic may be needed. Can be built with CSS.

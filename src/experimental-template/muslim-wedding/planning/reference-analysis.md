# Muslim Wedding — Opening Style Analysis & Asset Plan

Sources: Opening stills `f-0.8 / f-2.5 / f-4.5 / f-6.5` (576×1024, 9:16); current build `rm-02/04/06`; Tamil reference build `m-02/04/06/09`.
Hex values are visual estimates from the stills (not pixel-picked); treat them as ±4% tolerance.

---

## 1. Rendering language (what the Opening looks like)

**Identity (seen):** soft-focus "luxury set photograph" rendering, somewhere between a 3D render and a styled film still. A carved alabaster Mughal/Deccani wall with a cusped (multifoil) arch, white garden roses with olive-sage foliage, brass lanterns, a strand curtain inside a rose arch, a marble dais. Everything is tonal: cream on ivory, warmed by brass.

**Palette (sampled by eye)**

| Role | Hex | Where |
|---|---|---|
| Ground / wall plaster | `#EFE6D8` | arch interior, upper wall |
| Light ivory highlight | `#F7F1E7` | arch interior centre, dais top |
| Carved relief mid-tone | `#DCCDB8` | jali carving, column faces |
| Relief shadow | `#B9A68C` | carving recesses, column flutes |
| Marble floor | `#E8DFD2` with veins `#CFC2B0` | foreground tiles |
| Rose white | `#F8F5EE`, shade `#E2DCCD` | rose heads |
| Foliage sage | `#7E8A5A`, deep `#4F5A33` | trailing vines, arch greenery |
| Brass / gilt | `#C9A35E`, highlight `#E6CB8C`, shadow `#8A6A35` | lantern cages, jali inlay panels |
| Candle glow | `#F3C77A` | lantern interiors |
| Garment gold-olive (accent only) | `#A88E5A` | couple's attire |
| Wood (stools) | `#4A3426` | stool legs — darkest value in frame |

No saturated colour anywhere. Darkest value is wood `#4A3426`; text colour should come from this family (`#3D2E22`), never pure black.

**Light:** soft high-key daylight from upper-left/front, diffuse (overcast-window / softbox). Shadows are short, warm (`#B9A68C`), low contrast (~1.5 stops). Brass picks up small specular highlights; candles are the only point lights and read as warm bloom, not flare.

**Texture:** smooth matte plaster with crisp relief carving (arabesque scroll, interlaced star jali); polished marble with faint veining; velvety rose petals. No paper grain, no noise, no painterly brush marks.

**Line quality:** no outlines. Form is described by tone and soft shadow. Carving edges are sharp but shallow; foliage edges are fine and slightly soft (depth-of-field).

**Finish:** photoreal-soft, slightly hazy (lifted blacks, gentle bloom), warm white balance (~4800K). Feels "styled editorial", not illustration, not glossy CG.

**Depth / layering (5 planes):** (1) back carved wall + cusped arch; (2) side columns with gilt jali panels and lanterns; (3) centre rose arch + strand curtain; (4) couple + stools on dais; (5) foreground rose clusters at bottom corners, plus falling petals (f-6.5) as the nearest layer. Trailing vines frame the top corners.

**Negative space:** the inner cusped arch (plain ivory plaster) is the big calm field; everything heavy sits on the left/right thirds and the lower half. Symmetry is strict except the couple.

---

## 2. Opening — quiet bands vs heavy areas (390×844 viewport)

Video is 9:16; on 390×844 with `object-fit: cover` it scales ×0.824 and crops ~42 px off each side (≈9% of source width per side). Percentages below are of the **viewport**.

**Quiet bands (safe for text / seal / hint)**
- **A — Arch field (primary):** y **8%–36%**, x **30%–70%**. Plain ivory plaster inside the cusped arch. Best for names/monogram seal. From ~5.5 s, falling petals cross this band — keep text on a soft ivory scrim (`rgba(247,241,231,0.55)`, 24 px blur) or rely on dark ink `#3D2E22`.
- **B — Arch field upper-wide:** y **8%–20%**, x **22%–78%** (above the hanging bouquets, below the carved spandrel). Good for a small eyebrow ("Bismillah" line / date).
- **C — Floor strip:** y **91%–99%**, x **25%–75%**. Plain marble between the corner rose clusters. Use for scroll hint / "tap to open" only (small, ≤ 14 px type).

**Heavy areas (avoid)**
- Top corners y 0%–40%, x 0%–25% and 75%–100%: trailing vines + bouquets.
- Carved spandrel y 0%–8%, x 20%–80%: busy relief.
- Centre rose arch y **38%–80%**, x **35%–68%**: highest detail density.
- Couple zones y **48%–82%**, x 0%–40% (bride) and 70%–100% (groom).
- Bottom corners y 82%–95%, x 0%–22% and 80%–100%: foreground roses.
- Dais step edge y **84%–90%**: horizontal geometric inlay — don't put type across it.

---

## 3. Gap analysis — current muslim-wedding vs Tamil build

| Element | Tamil build (bar) | Current muslim-wedding | Gap |
|---|---|---|---|
| Signature top-edge piece | Full-bleed toran (mango leaves + jasmine + marigold) spans the section top, overlaps edges | Thin line-art arch icon only | Needs a full-bleed, photographic **rose-and-jasmine valance / carved arch crest** at Couple top |
| Hero object over family card | Brass kalash with peacocks sits *on* the card edge, breaks the frame | Small carved crest sits on card top — good idea but too small, flat, low contrast | Make crest larger (≈80% card width), deeper relief, brass inlay, rose sprays |
| Card corners | Floral corners at all 4 corners + red zigzag band | Bottom-only corners with brass urns, faint | Add a full family-corner set; stronger value contrast |
| Dividers | Coloured zigzag band, red diamond rule | Hairline + small sun glyph | Need one ornamental divider (jali/star strip) — can be CSS/SVG, not an asset |
| Date plaque | Red temple-shaped plaques with gilt border, depth | Line-art octagram with text — flat | Needs a raised **alabaster-and-brass 8-point star plaque** asset |
| Countdown units | Deep red bevelled plaques, gilt frames, sparkles | Outlined arch tiles, empty cream | Needs a **cusped-arch unit plaque** (carved alabaster + brass rim) |
| Countdown backdrop | Carved wooden pillars framing a textured field | Photographic jali room sits *below* the units, disconnected | Backdrop must be a **framing scene** with quiet centre that the units sit inside |
| Celebrations | Toran on every card + corners + timeline plaques | One toran (good), corners present; ghost watermark | Add per-event motif variation (Nikah/Walima/Mehndi) + corner set consistent with toran |
| RSVP header | Big composed tableau (lamps, garland, offering) | Not yet built | Needs a **composed still-life** header |
| Particles | Petals + sparkles drift across sections | None | Reuse Opening's white rose petal (1 small asset) + CSS gold motes |
| Background | Subtle paper texture | Flat gradient | Optional: very low-contrast plaster texture (CSS noise is fine) |

Main lesson: Tamil pieces are *objects with depth that break card edges*; the current build uses *line-art icons inside cards*. Every new asset should be a photographic object in the Opening's tonality.

---

## 4. Asset manifest (10 assets)

Shared prompt suffix (append to every prompt):
> *Rendering: soft high-key photographic still from a luxury wedding film, warm 4800K daylight from upper-left, diffuse soft shadows, low contrast, lifted blacks, gentle bloom. Palette: ivory plaster #EFE6D8, carved relief #DCCDB8 with shadow #B9A68C, white garden roses #F8F5EE, sage foliage #7E8A5A, antique brass #C9A35E with highlights #E6CB8C. Matte carved alabaster, polished pale marble. No people, no figures, no text, no letters, no calligraphy, no logos, no watermark. Strictly symmetrical, centred.*

Transparent assets: generate on **flat solid #0057FF** background, no shadow cast on the background, no blue spill on edges; key out afterwards. Export WebP; transparent ≤ 200 KB, opaque ≤ 450 KB.

### 1. `couple-valance.webp` — Couple, signature top edge
- Role: full-bleed top-edge piece, overlaps section top like the Tamil toran.
- Composition: horizontal carved alabaster cusped-arch lintel across full width; heavy white rose + jasmine garland draped in 3 swags beneath it; sage vines and small rose clusters trailing down at both ends (ends hang ~2× deeper than centre). Centre swag stays shallow so the eyebrow text sits beneath.
- Size: 780×300 (2.6:1), transparent.
- Prompt: *Wide horizontal decorative valance: a carved ivory alabaster Mughal lintel with fine arabesque relief and a shallow multifoil arch profile, inset with thin antique brass jali bands; below it a lush garland of white garden roses, jasmine strands and sage-green eucalyptus draped in three soft swags, with longer trailing rose-and-vine sprays hanging at the far left and right ends. Front view, isolated on a flat solid #0057FF background.* + suffix

### 2. `family-crest.webp` — Couple, hero object on family card top
- Role: sits on top edge of each family card, breaking the frame (replaces current small crest).
- Composition: carved alabaster cusped-arch crest (mihrab-shaped finial), brass inlaid 8-point star at centre, a rose spray spreading out left and right along its base; base edge flat so it seats on the card border.
- Size: 640×340 (1.9:1), transparent. Renders ≈ 82% of card width.
- Prompt: *A carved ivory alabaster arch crest shaped like an ornate multifoil Mughal arch, deep arabesque and interlaced-star relief, a small antique brass eight-pointed star inlaid at the apex, the flat base flanked by horizontal sprays of white garden roses, jasmine buds and sage leaves extending outward to both sides. Front view, isolated on a flat solid #0057FF background.* + suffix

### 3. `family-corner.webp` — Couple, card corners (mirror for 4 corners)
- Role: top-left corner of family card; CSS-mirror to the other three.
- Composition: L-shaped; small brass lantern-finial urn in the corner, white roses and sage sprays running along both edges, tapering to fine tendrils; inner quadrant empty.
- Size: 360×360 (1:1), transparent.
- Prompt: *Corner ornament in an L shape for the top-left corner of a card: a small antique brass Moroccan-style urn at the corner point, with white garden roses, rosebuds, jasmine and fine sage-green eucalyptus sprays extending along the top edge and down the left edge, tapering into delicate tendrils; the inner area completely empty. Isolated on a flat solid #0057FF background.* + suffix

### 4. `countdown-hall.webp` — Countdown backdrop scene
- Role: full section background; units sit inside the quiet centre.
- Composition: interior of a carved alabaster hall; tall pillars with gilt jali panels framing left and right (each ≤ 18% width); brass lanterns at pillar bases; low rose clusters on the marble floor at bottom corners; centre is a large plain ivory wall with a faint, very soft cusped arch outline. **Quiet band: y 22%–70%, x 18%–82%** — must be near-flat tone (`#EFE6D8`–`#F7F1E7`).
- Size: 780×1688 (9:19.5), opaque.
- Prompt: *Vertical interior view of a serene carved ivory alabaster Mughal hall: tall fluted pillars at the far left and right edges with antique brass jali lattice panels, glowing brass lanterns at their bases, small clusters of white roses and sage leaves on the pale polished marble floor at the bottom corners. The centre of the image is a large, calm, plain ivory plaster wall with only a faint, soft multifoil arch recess, almost no detail, occupying the middle half of the frame.* + suffix

### 5. `countdown-unit.webp` — Countdown unit plaque
- Role: frame behind each of the 4 numbers (scale to ~80 px CSS width).
- Composition: standing cusped-arch plaque of carved alabaster, smooth flat inner panel (number area ≥ 70% of face), thin brass rim, tiny brass star at the apex, soft drop shadow baked in below only.
- Size: 220×280 (11:14), transparent.
- Prompt: *A single small upright plaque shaped like a pointed multifoil Mughal arch, carved from ivory alabaster with a thin raised antique brass rim and a tiny brass eight-pointed star at the apex; the inner face is a perfectly smooth, flat, plain ivory panel with no carving. Front view, isolated on a flat solid #0057FF background.* + suffix

### 6. `celebration-toran.webp` — Celebrations, card top edge
- Role: top edge of every event card (replaces current toran for consistency with valance).
- Composition: horizontal rose-and-jasmine garland on a slim brass rod, evenly spaced hanging strands of pearl-like jasmine buds ending in small brass bells, sage leaves along the top. Ends drop slightly lower.
- Size: 760×240 (3.2:1), transparent.
- Prompt: *Horizontal hanging garland: a slim antique brass rod densely wrapped with white garden roses, jasmine and sage-green leaves, with evenly spaced vertical strands of white jasmine buds hanging below, each ending in a small antique brass bell; the ends of the garland curve slightly downward. Front view, isolated on a flat solid #0057FF background.* + suffix

### 7. `celebration-corner.webp` — Celebrations, card bottom corners
- Role: bottom-left card corner (mirror for right). Lighter than family corner.
- Composition: low rose cluster with an ivory silk ribbon tied in a bow, sage sprays rising up the edge.
- Size: 300×300 (1:1), transparent.
- Prompt: *Bottom-left corner ornament: a low cluster of three white garden roses and rosebuds tied with a soft ivory silk ribbon bow, sage-green eucalyptus and jasmine sprays rising upward along the left edge and extending along the bottom edge; inner area empty. Isolated on a flat solid #0057FF background.* + suffix

### 8. `event-motifs.webp` — Celebrations, per-event motif sheet (3 cells)
- Role: one small object per event card header (Nikah / Mehndi / Walima), sliced from a 3-cell sheet.
- Composition: three objects on one row, equal spacing: (a) brass Moroccan lantern with a single white rose; (b) brass bowl of henna paste with a henna cone and marigold-free white jasmine; (c) brass covered dish (thaal) with dates and rose petals.
- Size: 900×320 (3 × 300×320 cells), transparent.
- Prompt: *Three separate small still-life objects in a row with generous empty space between them, same scale: left, an antique brass pierced Moroccan lantern with a single white rose at its base; centre, a small brass bowl of green henna paste with a henna cone and a few jasmine buds; right, an ornate domed brass serving dish with dates and scattered white rose petals. Front three-quarter view, isolated on a flat solid #0057FF background.* + suffix

### 9. `rsvp-tableau.webp` — RSVP header
- Role: composed header still-life above "Will you join us?" (Tamil `m-09` equivalent).
- Composition: symmetrical: two tall brass lanterns left and right; between them a draped rose-and-jasmine garland swag; centre front a brass attar (perfume) bottle and a small brass dish of rose petals on a carved alabaster ledge. Bottom 15% empty for the "RSVP" eyebrow.
- Size: 780×560 (1.4:1), transparent.
- Prompt: *Symmetrical still life: two tall antique brass pierced lanterns with glowing candles stand at the left and right; a soft swag of white roses and jasmine is draped between them; in the centre front, on a low carved ivory alabaster ledge, an ornate brass attar perfume bottle beside a small brass dish of white rose petals. Front view, isolated on a flat solid #0057FF background.* + suffix

### 10. `closing-arch.webp` — Closing scene
- Role: full-bleed final scene behind the thank-you text.
- Composition: the Opening's world at dusk-gold: carved alabaster cusped arch centred, rose garlands framing the upper corners, two lit lanterns on the marble floor at lower thirds, scattered petals on the floor. **Explicit quiet band: y 18%–55%, x 22%–78%** (plain arch interior, smooth gradient `#F7F1E7` → `#EFE6D8`) for closing text; secondary quiet strip y 88%–98% centre for signature/footer.
- Size: 780×1688 (9:19.5), opaque.
- Prompt: *Vertical view of a carved ivory alabaster Mughal multifoil arch, centred, with lush white rose and sage garlands framing the upper left and upper right corners; two antique brass lanterns with glowing candles stand on the pale polished marble floor at the lower left and lower right; a few white rose petals scattered on the floor. The interior of the arch is a very large, smooth, plain ivory plaster surface with no detail, filling the upper-middle of the frame. Warmer late-afternoon light, slightly more golden than daytime.* + suffix

### 11. `date-plaque.webp` — Celebrations date plaque
- Role: raised plaque behind each event's day/month (replaces flat line-art octagram).
- Composition: 8-point star (two overlapping squares) of carved alabaster, brass rim, smooth flat centre disc ≥ 60% of width for the date.
- Size: 200×200 (1:1), transparent.
- Prompt: *A single eight-pointed star plaque formed by two overlapping squares, carved from ivory alabaster with a thin raised antique brass rim and fine arabesque relief only on the star points; the centre is a smooth, flat, plain ivory disc. Front view, isolated on a flat solid #0057FF background.* + suffix

### Not assets (do in CSS/SVG)
Petal particles: reuse a crop of the Opening's falling petals (f-6.5) or a 3-petal 288×96 transparent sheet if generation budget allows.
Ornamental divider (interlaced-star jali strip, brass `#C9A35E` stroke 1 px), section hairlines, gold motes, plaster noise.

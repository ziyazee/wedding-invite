# punjabi-heritage — Reference analysis, style DNA & asset manifest

Template: `punjabi-heritage` · route `/experimental/punjabi-heritage` · built on `_golden` sections (`opening`, `couple`, `countdown`, `celebrations`, `rsvp`, `closing`).
Tradition: culture-led Punjabi (`blend`). **No religious symbols**: no Ik Onkar, Khanda, Guru Granth Sahib, palki, Ganesh, Om, deities, havan/sacred fire, temple spires or saffron pennants.
Opening media: generated painterly still (`opening-haveli-dusk.jpg`, 9:16, image mode with slow push).

Sources read: `src/pages/a-timeless-union/Design14Scenes.tsx`, `TimelessRules.css`, ATU artwork (sky `1Zg49…`, gate `ELOlTg…`, ghats `nMi6Q…`, framed ghats `B5f8H…`, `end-scene.webp`), `tamil-wedding/planning/reference-analysis.md`, `muslim-wedding/planning/reference-analysis.md`, `punjabi-wedding/core/theme.ts`.

Conventions: all positions are % of the **390×844 viewport** (y from top, x from left) unless marked "source". Hexes marked *(seen)* were estimated from downscaled stills (±4%); hexes marked *(target)* are design decisions for the new template.

---

## 0. What A Timeless Union actually is (seen)

An honest correction to the brief before translating it: ATU's sky is **not** golden-amber. It is a cerulean watercolour-paper gradient. The warmth comes from the sandstone gateway and the pale-gold type.

**How ATU stages a scene (from `Design14Scenes.tsx`):**
- Each "page" stacks four planes, back to front: **SKY** (one 4092×6148 texture, rendered wider than the viewport, `100vw + 686px`, so it can pan) → **CLOUDS** (2–3 separate 1536×1024 cut-outs, `will-change: transform`, drifting) → **LANDSCAPE** (painted ghats/temple, 1872×2607, cover) → **GATE** (a carved sandstone cusped-arch frame with a transparent interior, 3072×5504, cover or contain).
- The gate and landscape fade in (`opacity: 0.001` → 1) after the sky. The names sit on the **sky plane**, behind the gate.
- Opening text (`.d14-rules-opening`): `top: 8%`, `height: 11%`, centred, width `min(72vw, 44%)`. Names are bold 700 serif at `clamp(36px, 9vw, 102px)` in pale gold `#FFE6B3`; the date is `#FFF0CD`; the "WEDS" separator is white Jost. **Light text on a mid-saturated blue sky**, no scrim.
- Page 2 reuses the sky with **GATE 2**: the same cusped arch, now with the landscape painted inside it (palms and river on the left, temple spires on the right, open sky in the upper 55% of the arch). Content (Ganesh, Sanskrit invocation, names, family lines) sits over it in a 64% centre column.
- Cards (`.d14-rules-card`) are full illustrated card artworks (962×1634) with text in an inset of `left/right 20%`. The fallback card is `#FFF3D9` with a 12px double `#A87932` border and `#59351F` ink.
- The finale is a sandstone temple cut-out (`end-scene.webp`) against white.

**ATU rendering (seen):**
- Semi-realistic Indian "matte painting" illustration: crisp, highly detailed, saturated. Not loose gouache.
- Carvings use **fine dark-umber pigment linework**, about 1px at 700w, `#5E4A30`, over tonal modelling. It is never a black comic outline.
- Sky: visible cold-press paper tooth over a vertical gradient, `#3D8FD9` (top) → `#BCDDF5` (bottom).
- Sandstone gate: light `#E3CFA6`, mid `#C9B084`, shadow `#8C7350`, deep recess `#5E4A30`. Warm, slightly greyed.
- Landscape: river `#2E6FA8` / `#5BA3D0`, foliage `#4E7A3A` / `#7FA457`, saffron flags `#E8692A`, crowd accents `#B8432A`.
- Light: clear late-morning to early-afternoon sun from the right. Short warm shadows, high clarity, no haze.

**The "magic" worth keeping:** (1) a big, calm, textured sky that carries the names; (2) a **carved architectural frame you look *through***, which gives instant grandeur and depth; (3) a deep landscape receding inside that frame; (4) layered planes that can move independently; (5) warm sandstone and gold type that reads as heritage.

**What we must not take:** shikhara spires, ghats, river boats, saffron pennants, Ganesh, Om or Sanskrit invocations, palms, Nagara/Dravidian vocabulary, the cerulean sky, and the cool river palette.

---

## 1. Translating A Timeless Union into a Punjabi heritage world

| ATU device | `punjabi-heritage` equivalent | Why |
|---|---|---|
| Cerulean watercolour sky | **Luminous amber-to-cream winter-dusk sky** (*siyaal di shaam*) on the same paper tooth. Warm apricot at the zenith, palest cream-gold at the text band, peach near the horizon. | It keeps the "big calm sky" idea and removes all blue. Blue would clash with the `#0057FF` chroma pipeline, and it would read as ATU. |
| Sandstone cusped temple arch | **Nanakshahi brick deorhi** (thin, flat, terracotta-red Lakhori/Nanakshahi bricks, lime-pointed) with a **pointed four-centred brick arch** and **carved tahli (sheesham) double doors** with brass bosses | The Punjabi haveli gateway is the secular, regional answer to a temple torana. Brick and walnut wood are distinctive and clearly not South Indian. |
| Ghats and spires inside the frame | **Golden sarhon fields with a lone kikar/tahli tree and a mud-brick village line** at the horizon, seen through the open deorhi doors | It gives the same "look through the frame into depth" effect, and the subject comes from harvest and land instead of religion. |
| Floating clouds | **Warm dusk haze bands and a few drifting sarhon petals / dust motes** (CSS). Optional: 2 tiny Basant kites in the upper corners only. | Movement without clutter. Kites are folk winter imagery with no religious content. |
| Pale-gold text on blue | **Deep suha maroon and tahli-walnut ink on luminous cream-gold sky** | Highest legibility on a warm sky, with no scrim. See §2.3. |
| Illustrated card art | Overhanging **phulkari valance, deorhi crest, toran and corners** that break the card edges | The lesson from both prior builds: objects with depth that break frames beat line-art inside cards. |
| Sandstone temple finale | **Haveli archway opening onto sarhon fields at sunset**, diyas on the sill | It closes the story at the same threshold where it opened. |

**Contrast with `punjabi-wedding` (Bagh-e-Anand).** That template uses a pale blush-ivory ground (`#FDF6F4`), rosewater pink (`#E47A93`), photoreal garden pavilion rendering, Cormorant Infant with Plus Jakarta Sans, and a Gurmukhi Ik Onkar invocation. `punjabi-heritage` must read as its opposite:
- Rendering: **painted gouache/tempera illustration**, not photoreal.
- Value structure: **saturated earth and harvest colours** (suha red, mustard, brick, walnut, brass), not pastels.
- Ground: warm parchment-sandstone `#F3E4C6`, never pink-white.
- No Gurmukhi script, and no pink as a primary colour. Pink appears only as rose accents inside florals.

**Punjabi markers to use:** Nanakshahi brick, tahli doors with brass *phulle* (bosses), lattice *jaali* in wood (not marble), *aala* wall niches, *vehra* courtyard, *phulkari / vari-da-bagh* (golden-yellow silk darning on suha red khaddar), sarhon and kanak, brass *gaagar*, clay diyas, *kalire*, *paranda*, *charkha*, *peerhi*, *dholki*, *shagun thaal*, *tilla jutti*, *chooda*.

**Markers to use sparingly or avoid:**
- *Mor* (peacock): only as a golden-ochre embroidered or carved motif, and never naturalistic blue. Never on transparent cut-outs, because peacock blue breaks the key. More than one mor per scene reads Rajasthani.
- Chhatris, jharokhas with sandstone domes, and mirror-work *sheesh mahal*: these read Rajasthani.
- Mango-leaf toran and brass kalash: acceptable as household décor. Show the kalash as a plain brass ***gadvi*/lota**, with no coconut or mango-leaf crown, so it does not read as a puja kalash.
- Red *mauli/kalava* thread has a Hindu ritual connotation. In the shagun motif, substitute **red-and-gold gota ribbon**. This is flagged against the brief's wording.
- Diyas are **decorative household lamps** (Jaago, courtyard). Never show a havan, agni kund or a fire being circled.

---

## 2. Opening scene specification (`opening-haveli-dusk.jpg`)

### 2.1 Crop math
- Generate at **1152×2048** (9:16). Export **1080×1920 JPG**, quality about 80, ≤ 450 KB.
- On 390×844 with `object-fit: cover`, the scale is 844/1920 = 0.44, so the rendered width is 475px. That crops about **42px per side, or 8.9% of source width per side**. Viewport x 0% equals source x 8.9%; viewport x 100% equals source x 91.1%.
- The slow push (scale 1.00 → 1.06 over about 12s) removes another ~3% per edge at the end. **All meaningful content must sit within source x 12–88% and y 3–97%.** Prompts below describe positions in viewport terms. The generator should be told to keep the side frame elements "slightly inside the left and right edges".

### 2.2 Viewport bands (390×844)

| Band | y range | Content (what must be painted) | Text? |
|---|---|---|---|
| **A. Top frame** | 0–14% | We stand under the shaded inner verandah of the haveli. Its **brick arch spandrels** fill the top-left and top-right corners (x 0–30% and 70–100%), with carved tahli wooden bracket ends. A **marigold-and-rose toran** crosses the full width: dense golden gainda, crimson desi gulab and fresh green *siris* foliage strands. It swags lowest at x 25% and 75% (y ≈ 12–14%). At dead centre it rises to y ≈ 8%, showing a sliver of sky. Short marigold strands hang to y ≈ 20% at x ≤ 10% and x ≥ 90% only. | No |
| **B. Sky quiet zone** | 15–46% (x 14–86%) | Open **winter-dusk sky**, a smooth vertical gradient on paper tooth: `#F2CF95` at y 15% → `#F7E6C4` at y 25–40% (the brightest band, behind the names) → `#F3D3A4` at y 46%. Allowed: very faint warm haze streaks (≤ 4% luminance variation). Not allowed: birds, kites, sun disc, clouds with dark edges, flowers or architecture inside x 14–86%. A soft sun glow sits low and off-frame behind the deorhi (y ≈ 55%), so the sky is lit from below and behind. | **Yes**: names, WEDS, date |
| (gutter) | 46–48% | The sky meets the **deorhi parapet**: a crisp horizontal brick cornice. | No |
| **C. Gateway world** | 48–88% | Mid-ground: the inner **vehra** courtyard floor (warm lime-washed brick paving) leads to the **deorhi** gateway, a two-storey Nanakshahi brick mass spanning x 18–82%. Its roofline and small carved wooden *jharokha* balcony sit at y 48–56%, centred. The **arched opening** (pointed four-centred brick arch with a cusped inner profile) runs y 58–84% and x 34–66%. Its **tahli double doors are swung fully open inward**, showing carved panels and brass bosses at x 28–36% and 64–72%. Through the opening: **blooming yellow sarhon (mustard) fields bordered by young olive-green winter kanak (wheat)** receding to a low horizon at y ≈ 70%, one silhouetted kikar tree, and a faint mud-brick village line in warm haze. Courtyard sides (x 0–18% and 82–100%): carved tahli pillars of the verandah we stand in, a hanging brass lantern on each side at y ≈ 52%, and brick *aala* niches with lit diyas. **Diya-lit steps**: three low brick steps at y 80–88% with 5–7 clay diyas on each step edge, warm flame glow. Optional single accent: a phulkari bagh (gold-on-red) draped over the left verandah railing at y 60–70%. | No |
| **D. Threshold** | 88–98% (x 25–75%) | A **plain smooth sandstone threshold slab** (`#E6CFA4` → `#D7B985`), low detail, lit warmly from the diyas above. A few scattered marigold petals only at x < 20% and x > 80%. | **Yes**: scroll hint |
| (edge) | 98–100% | Darker brick floor edge. | No |

**Heavy zones (never place type):** y 0–14% (toran); x 0–14% and 86–100% for y 0–88% (verandah pillars and hanging strands); y 48–58% centre (jharokha); y 58–84% x 34–66% (the bright field view, the highest-detail area); y 80–88% (diya rows).

**Text layout inside band B** (centre aligned, max width 72% = 281px):
- Eyebrow (optional): y 16–19%, Marcellus SC 12–13px, tracking 0.18em.
- Groom name: y 20–28%, display 44–56px.
- WEDS: y 29–31%, 12px small caps with hairline rules either side.
- Bride name: y 32–40%.
- Date: y 41–45%, 15–17px.
- Scroll hint: centred in band D at y ≈ 93%.

**Motion:**
- Slow push 1.00 → 1.06, `transform-origin: 50% 38%`, so the quiet band stays centred while the gateway grows.
- CSS layers on top: 6–10 warm motes or sarhon petals drifting upward from the diyas (y 80% → 40%) at ≤ 0.5 opacity, behind the text layer; plus a subtle flicker on two radial glows positioned over the step diyas.
- The poster is the same JPG, so the image cannot jump on load.

### 2.3 Text contrast plan

**Decision: dark ink on the luminous sky.** ATU-style pale gold would need a deep twilight sky. That would kill the golden harvest identity, and in the gradient's lower half it would read muddy. Dark ink on `#F7E6C4` gives strong contrast with zero scrim.

| Role | Hex | Contrast vs `#F7E6C4` (approx.) |
|---|---|---|
| Names (display) | **suha maroon `#5A1A14`** | ≈ 11 : 1 |
| WEDS, date, eyebrow | **tahli walnut `#4A2E1A`** | ≈ 11 : 1 |
| Secondary small text (≥ 14px) | warm umber `#6B4426` | ≈ 7.5 : 1 |
| Hairlines and ornaments only | antique brass `#9A6B2A` | ≈ 3.8 : 1 (decoration only, never text) |
| Optional name emphasis glow | `text-shadow: 0 0 18px rgba(250, 238, 212, 0.75)` | Lifts letters off the haze; it is not a scrim |
| Scroll hint on threshold `#E6CFA4` | `#4A2E1A` text, `#9A6B2A` chevron | ≈ 9 : 1 |

**Scrim policy:** no full-screen scrim. If a generated sky comes out uneven, apply a radial lift confined to band B only: `radial-gradient(60% 22% at 50% 31%, rgba(250, 238, 212, 0.35), transparent 70%)`.

**Fonts (target, inferred; not taken from ATU):**
- Names: **Rozha One** 400. Its high-contrast, poster-like weight echoes Punjabi signboard lettering and is distinct from `punjabi-wedding`'s Cormorant Infant.
- Eyebrows, WEDS, date: **Marcellus SC**.
- Body: **Spectral** 400 / italic.
- No Gurmukhi script anywhere, to keep the template culture-led.

---

## 3. Rendering style DNA

### 3.1 Surface
- **Hand-toned cotton-rag paper** with visible cold-press tooth. This is the same tooth idea as ATU's sky, about ±5% luminance mottle, warm toned. The paper shows mostly in the sky and the plaster walls.
- No vignette in the quiet zones. A gentle warm falloff is allowed only in the bottom and side heavy zones.

### 3.2 Line and pigment edges
- **Fine tonal pigment edges.** Where lines exist (brick coursing, wood carving, phulkari stitches, petal veins), they are a darker tone of the local colour, about 1px at 1080w: brick `#7A2E1E`, wood `#3A2214`, brass `#6E4A1C`, marigold `#B85A10`. **Never black, never a uniform keyline.**
- Gouache/tempera body: opaque, matte, flat colour planes modelled with 2–3 tonal steps and a soft dry-brush texture on foliage, wood grain and fabric.
- Balance: about **55% flat opaque gouache / 45% painterly modelling**. This is more painterly than Tamil (65/35) and less detailed than ATU's matte painting.
- Brass gets small, warm, chalky highlights (`#F4D58A`), never chrome specular.

### 3.3 Lighting
- **Punjabi winter golden hour, about 4:30–5:30 pm.** Low warm sun from behind and slightly to one side of the deorhi, so the field view glows and the foreground verandah sits in a warm, luminous half-shade.
- Secondary warm point lights come from diyas and lanterns, shown as soft round blooms. **No lens flare, no god-ray spikes, no bloom over the text band.**
- Shadows are warm (`#8A4E2C` to `#5A3220`) with gentle contrast, about 2 stops. The darkest value is walnut `#2E1A10`, never pure black.

### 3.4 Palette (target)

| Role | Hexes |
|---|---|
| Sky (zenith / text band / horizon) | `#F2CF95` / `#F7E6C4` / `#F3D3A4` |
| Parchment-sandstone ground | `#F3E4C6`, deep `#E6CFA4`, shadow `#C9A776` |
| Nanakshahi brick (light / mid / shadow / pointing) | `#C8673F` / `#A84A2C` / `#7A2E1E` / lime `#EADBC0` |
| Lime-washed plaster wall | `#F1E2C3`, shade `#DCC49A` |
| Tahli walnut wood (light / mid / deep) | `#8A5A34` / `#5E3A22` / `#3A2214` |
| Antique brass (highlight / mid / shadow) | `#F4D58A` / `#C9973F` / `#6E4A1C` |
| Suha red silk (main / deep) | `#A3191E` / `#6E0F14` |
| Phulkari gold silk thread (bright / mid) | `#F2B92E` / `#D9921A` |
| Sarhon mustard (flower / light / field shadow) | `#F2C21C` / `#F8DD5A` / `#B88A14` |
| Kanak wheat | `#E4B65A`, awn shadow `#A87A2E` |
| Marigold gainda (yellow / orange) | `#F4B21E` / `#E8761A` |
| Desi gulab rose (crimson / deep) | `#B5172E` / `#7A0E1E` |
| Leaf (mango / sarhon stem), olive-yellow only | `#5E7A2A` / `#8FA33A` |
| Diya flame / glow | `#FFE6A0` / `#F6A84A` |
| Ink (names / body) | `#5A1A14` / `#4A2E1A` |

**Banned hues for every asset:** blue, cyan, teal, indigo, violet and cool grey. Opaque scenes avoid them too, for world consistency; the sky is warm. Greens stay olive or yellow-green, with hue ≤ 95°.

### 3.5 Shared Generate Image style block (append to every prompt)

> **Style:** Rich painterly Punjabi heritage illustration in opaque gouache and egg tempera on warm hand-toned cotton-rag paper with fine cold-press tooth. Matte flat colour planes modelled with soft two-to-three-step tonal shading and gentle dry-brush texture; fine tonal pigment edges in darker shades of each local colour; no black outlines, no comic linework, no 3D render, no plastic CG gloss, no photorealism, no lens flare, no god rays, no bloom haze. Warm Punjabi winter golden-hour light, low sun, soft warm shadows (#8A4E2C), darkest tone deep walnut #2E1A10, never pure black. Palette: Nanakshahi brick #A84A2C and #C8673F with lime pointing #EADBC0, tahli walnut wood #5E3A22, antique brass #C9973F with chalky highlights #F4D58A, suha red silk #A3191E, phulkari golden silk #F2B92E, sarhon mustard yellow #F2C21C, marigold #F4B21E and #E8761A, crimson desi rose #B5172E, olive leaf green #5E7A2A, parchment cream #F3E4C6, diya glow #FFE6A0. Strictly no blue, cyan, teal, indigo or purple anywhere. Culturally Punjabi and secular: no religious symbols, no deities, no Ik Onkar, no Khanda, no Om, no temple spires, no flags. No people, no faces, no hands, no text, no letters, no numbers, no watermark, no signature, no border.

### 3.6 Chroma-key rule (all transparent cut-outs)

Append this block **in addition to** the style block for every transparent asset:

> **Background:** isolated on a perfectly flat, uniform, solid pure blue background, hex #0057FF, edge to edge, with no gradient, no texture, no vignette, no floor, no horizon, no cast shadow and no reflection on the blue. Clean, crisp silhouette edges with no blue fringe or spill on the subject. The subject contains absolutely no blue, cyan, teal, indigo or purple colours. Leave at least 6% empty blue margin on every side; nothing touches or crosses the image edge.

**Rules:**
- Keep subjects free of any hue within ±40° of 220°.
- No glass, water or mirror-work, which reflect the blue.
- Diya flames must stay warm yellow-white with no cool core.
- Avoid white highlights larger than a few px; they key unpredictably. Use cream `#FFF3D6`.

**Post-processing:**
- Key at a hue tolerance of about 25° plus a saturation gate.
- Defringe by contracting 1px and despilling blue toward warm brass.
- Trim to content bounds plus 2px, then export **WebP with alpha**: quality about 82, ≤ 200 KB per transparent asset (≤ 260 KB for the 1200px-wide sprite and valance).
- Verify on both `#F3E4C6` and `#2E1A10` backgrounds that no blue halo remains.

**Opaque scenes:** export as JPG (or WebP), quality about 80, ≤ 450 KB.

---

## 4. Lessons carried over from Tamil and Muslim builds
1. **Objects with depth that break card edges** beat line icons inside cards. Every card gets an overhanging top piece and corners.
2. **Backdrop scenes must frame a quiet centre** where the UI sits. They must not sit beside or below it. Countdown and Closing quiet bands are specified explicitly.
3. **Specify quiet bands numerically in the prompt**, and reject any generation that paints detail into them.
4. **Dark ink on a light ground** avoids scrims (Tamil `#7A1F1A`, Muslim `#3D2E22`). The equivalent here is `#5A1A14` / `#4A2E1A`.
5. One coherent world: every asset shares the style block, the palette and the brass/brick/silk materials, so the set looks like it came from one painter.
6. Not assets (CSS/SVG): phulkari-stitch geometric divider (stepped diamond in `#D9921A` and `#A3191E`), hairlines, rising diya motes and petals, paper-tooth noise, and the brick-coursing pattern for section edges.

---

## 5. Asset manifest (12 generated assets)

Every prompt below ends with **+ STYLE** (§3.5). Transparent assets also end with **+ KEY** (§3.6).

| # | File | Section | Type | Target px (export) |
|---|---|---|---|---|
| 1 | `opening-haveli-dusk.jpg` | Opening | opaque 9:16 | 1080×1920 |
| 2 | `couple-phulkari-valance.webp` | Couple | transparent | 1200×420 |
| 3 | `family-deorhi-crest.webp` | Couple | transparent | 720×380 |
| 4 | `family-sarhon-corner.webp` | Couple | transparent | 400×400 |
| 5 | `countdown-vehra-dusk.jpg` | Countdown | opaque 9:16 | 1080×1920 |
| 6 | `countdown-aala-plaque.webp` | Countdown | transparent | 240×320 |
| 7 | `celebration-toran.webp` | Celebrations | transparent | 960×280 |
| 8 | `celebration-corner.webp` | Celebrations | transparent | 340×340 |
| 9 | `event-motifs.webp` | Celebrations | transparent sprite | 1200×320 (4 × 300×320) |
| 10 | `date-plaque.webp` | Celebrations | transparent | 240×240 |
| 11 | `rsvp-tableau.webp` | RSVP | transparent | 900×640 |
| 12 | `closing-sarhon-dusk.jpg` | Closing | opaque 9:16 | 1080×1920 |

Generate transparent assets at a larger canvas (at least 2× the export size) in the closest supported aspect ratio, then key and trim.

---

### 1. `opening-haveli-dusk.jpg` — Opening, full scene
- **Role:** Opening media (image mode, slow push). It also serves as the poster.
- **Aspect / size:** 9:16, generate 1152×2048, export 1080×1920 JPG ≤ 450 KB. Opaque.
- **Quiet bands:** sky y 15–46% x 14–86%; threshold y 88–98% x 25–75% (see §2.2).
- **Prompt:**
> Vertical 9:16 painted scene looking out from the shaded inner verandah of a grand old Punjabi haveli at winter dusk. At the very top, the dark warm brick arch spandrels of the verandah fill the top-left and top-right corners with carved tahli wood bracket ends, and a lush garland toran of golden marigolds, crimson desi roses and fresh olive-green siris foliage crosses the full width, swagging to about 13% of the image height near the quarter points and rising higher at the centre; a few short marigold strands hang only at the far left and right edges. Directly below, from about 15% to 46% of the image height, a large, completely empty, calm, luminous winter-dusk sky: a smooth gradient from warm apricot-gold at the top to the palest cream-gold in the middle and soft peach lower down, with only the faintest warm haze, and no birds, clouds, sun, kites or objects of any kind in the central 70% of the width. At about 47% height, the crisp brick cornice of a two-storey Nanakshahi thin-brick deorhi gateway with lime pointing and a small carved wooden jharokha balcony at its centre. Below it, a tall pointed four-centred brick arch with a cusped inner edge, its carved dark tahli wood double doors with round brass bosses swung fully open, revealing blooming yellow mustard (sarhon) fields bordered by young olive-green winter wheat stretching to a low horizon, a single silhouetted kikar tree and a faint mud-brick village in warm golden haze, lit by the low sun behind. The warm lime-washed brick courtyard leads to three low brick steps lined with small lit clay diyas with soft warm glows. At the left and right edges, slightly inside the frame, carved tahli wood verandah pillars, a hanging antique brass lantern on each side, and small brick wall niches holding lit diyas; a golden-yellow phulkari bagh shawl on suha red cloth draped over the left railing. At the bottom, a plain smooth warm sandstone threshold slab with only a few marigold petals at its far corners. Strictly symmetrical composition, deep atmospheric perspective, the brightest light in the doorway view and the sky band. + STYLE

### 2. `couple-phulkari-valance.webp` — Couple, signature top edge
- **Role:** full-bleed piece that overhangs the top of the Couple section. It replaces the Tamil toran and Muslim valance equivalent. The eyebrow and title sit below its shallow centre.
- **Composition:** a horizontal **vari-da-bagh phulkari** textile (dense golden silk geometric darning on suha red khaddar) draped in three soft swags from a slim brass rod. Over it runs a garland of golden gainda marigolds and crimson desi roses, swagging with the fabric. At each outer end, a cluster of **hanging golden kalire domes** with tiny brass bells and a crimson-gold *paranda* tassel. The ends hang about 2.2× deeper than the centre; the centre drop is ≤ 28% of the asset height.
- **Aspect / size:** about 2.86:1; generate 2400×840 (or the closest 21:9 and trim), export 1200×420 WebP alpha ≤ 260 KB.
- **Prompt:**
> Wide horizontal decorative valance for the top edge of a page: a slim antique brass rod across the full width from which a Punjabi vari-da-bagh phulkari textile is draped in three soft, shallow swags, the cloth a deep suha red khaddar almost completely covered with dense golden-yellow silk geometric darning in stepped diamond and lozenge patterns, with a narrow scalloped edge; a lush garland of golden marigolds and crimson desi roses follows the swags along the fabric; at the far left and far right ends, longer clusters of hanging golden filigree kalire domes with tiny brass bells and a crimson-and-gold silk paranda tassel hang about twice as deep as the centre. The centre swag stays shallow. Front view, perfectly symmetrical. + STYLE + KEY

### 3. `family-deorhi-crest.webp` — Couple, family card top crest
- **Role:** hero object that sits on the top edge of each family card and breaks the frame. Renders at about 80% of card width; its flat base aligns with the card's top border.
- **Composition:** a miniature **haveli lintel**: carved dark tahli wood frieze with a shallow cusped Nanakshahi arch profile set in a thin-brick surround with lime pointing. Three round brass bosses (centre largest), geometric eight-point phulkari-star carving (no lotus), and a tiny brass finial at the apex. Horizontal **sprays of golden kanak ears and yellow sarhon flowers** extend outward from the base on both sides. The base edge is perfectly straight.
- **Aspect / size:** about 1.9:1; generate 1440×760, export 720×380 WebP alpha ≤ 200 KB.
- **Prompt:**
> A carved Punjabi haveli gateway lintel crest in miniature: a horizontal frieze of dark tahli walnut wood with a shallow cusped arch profile in its upper edge, framed by a narrow band of thin red Nanakshahi bricks with lime pointing, decorated with deep geometric eight-point star carving and three round antique brass bosses, the central boss largest, and a tiny brass finial at the apex; the bottom edge is perfectly straight and flat. From both lower ends, horizontal sprays of golden wheat ears and bright yellow mustard flowers with olive-green stems extend outward along the base line. Front view, symmetrical. + STYLE + KEY

### 4. `family-sarhon-corner.webp` — Couple, family card L-corner
- **Role:** top-left corner of each family card. CSS mirrors it (`scaleX(-1)`, `scaleY(-1)`, or both) to make all four corners.
- **Composition:** a small plain **brass gadvi/lota** (no coconut, no leaves) as the corner boss. **Sarhon mustard blossoms**, kanak ears and olive leaves run along the top arm and down the left arm, tapering to fine tips. A crimson *pat*-silk tassel with a gold cap hangs from the corner. The arms reach about 85% of the asset width/height; the inner quadrant (x > 30%, y > 30%) is empty.
- **Aspect / size:** 1:1; generate 1024×1024, export 400×400 WebP alpha ≤ 140 KB.
- **Prompt:**
> L-shaped corner ornament for the top-left corner of a card: at the corner point, a small plain hammered antique brass lota water pot lying on its side, with no coconut and no leaves; from it, sprays of bright yellow mustard blossoms, golden wheat ears and slender olive-green leaves run along the top edge to the right and down the left edge, tapering into fine tips; a short crimson silk tassel with a small gold cap hangs from the corner. The inner area of the square is completely empty. + STYLE + KEY

### 5. `countdown-vehra-dusk.jpg` — Countdown backdrop scene
- **Role:** full-section background. The four countdown plaques sit **inside** its quiet centre.
- **Composition:**
  - Edges: inside a Punjabi haveli *vehra* courtyard. At the far left and right (each ≤ 18% width), carved tahli wood pillars with bracket capitals rise full height. Between pillar and edge, Nanakshahi brick walls with stacked *aalas* (arched niches) hold glowing clay diyas.
  - Top (y 0–14%): a carved wooden beam and a short marigold string.
  - Bottom (y 80–100%): a brick floor with a low row of diyas, a brass gaagar and a folded phulkari at the corners only.
  - **Centre:** a calm warm **lime-washed plaster wall**, nearly flat, with a soft warm glow from the diyas.
- **Quiet band:** **y 20–74%, x 18–82%**, near-flat `#F1E2C3` → `#E8D3AC` with only paper tooth (≤ 4% variation). The four plaques at 2×2 or 1×4 sit there.
- **Aspect / size:** 9:16; generate 1152×2048, export 1080×1920 JPG ≤ 450 KB. Opaque.
- **Prompt:**
> Vertical 9:16 painted interior of a warm Punjabi haveli courtyard at dusk. At the far left and far right edges, each taking no more than one fifth of the width, tall carved dark tahli wood pillars with bracket capitals, and beside them old red Nanakshahi thin-brick walls with small arched wall niches stacked vertically, each holding a lit clay diya with a soft warm glow. Across the very top, a carved wooden ceiling beam with a short string of golden marigolds. Along the very bottom, a warm brick floor with a low row of lit clay diyas, a hammered brass water pot in the lower left corner and a folded golden-on-red phulkari cloth in the lower right corner. The entire centre of the image, from about 20% to 74% of the height and across the middle 64% of the width, is one large, calm, smooth, plain warm lime-washed plaster wall in cream and soft sandstone tones, with no niches, no carving, no objects and no pattern, only a gentle warm glow and fine paper texture. Symmetrical, quiet, intimate. + STYLE

### 6. `countdown-aala-plaque.webp` — Countdown unit plaque
- **Role:** frame behind each of the four numbers (days / hours / minutes / seconds). Scaled to about 76–84px CSS width.
- **Composition:** a single upright **haveli aala niche** plaque: a pointed cusped Nanakshahi arch outline built of a thin terracotta brick border with lime pointing, a thin antique brass rim inside it, and a tiny brass diya finial (an unlit, closed brass lamp shape) at the apex. The **smooth, flat, plain cream limewash inner face occupies ≥ 70%** of the plaque area, with no shading gradient stronger than 3%. A soft contact shadow is painted only inside the niche's top lip; nothing is cast outside.
- **Aspect / size:** 3:4; generate 768×1024, export 240×320 WebP alpha ≤ 60 KB.
- **Prompt:**
> A single small upright plaque shaped like a Punjabi haveli wall niche: a pointed arch with a gently cusped top, outlined by a narrow border of thin red terracotta bricks with cream lime pointing, a thin raised antique brass rim just inside the brick border, and a tiny closed brass lamp finial at the apex; the inner face is a perfectly smooth, flat, plain warm cream limewash panel with no pattern, no carving and no objects, filling most of the plaque. Front view, symmetrical. + STYLE + KEY

### 7. `celebration-toran.webp` — Celebrations, event card top edge
- **Role:** overhangs the top edge of every event card.
- **Composition:** a slim antique brass rod densely wrapped with a **braided garland of crimson desi roses, golden marigolds, and fresh olive-green siris foliage**. Evenly spaced short vertical strands of marigold and rosebud hang below it (7–9 strands), each ending in a **small brass bell**. A crimson-gold **paranda tassel** hangs at each end, slightly lower. The centre strands are shortest.
- **Aspect / size:** about 3.4:1; generate 1920×560, export 960×280 WebP alpha ≤ 180 KB.
- **Prompt:**
> Horizontal hanging garland toran: a slim antique brass rod densely wrapped with a braided garland of crimson desi roses, golden marigolds and fresh olive-green siris leaves; below it, seven to nine evenly spaced short vertical strands of marigolds and crimson rosebuds, each ending in a small antique brass bell, the centre strands shortest; at both ends a crimson-and-gold silk paranda tassel hangs a little lower. Front view, symmetrical. + STYLE + KEY

### 8. `celebration-corner.webp` — Celebrations, event card bottom-left corner
- **Role:** bottom-left corner of event cards; CSS-mirrored for bottom-right. Lighter than the family corner.
- **Composition:** a low cluster of three **crimson desi roses**, a marigold and **sarhon sprigs**, tied with a **golden gota ribbon bow** (flat metallic-gold lace ribbon with tails). Sprays taper up the left edge and along the bottom edge; the interior (x > 32%, y < 68%) is empty.
- **Aspect / size:** 1:1; generate 1024×1024, export 340×340 WebP alpha ≤ 110 KB.
- **Prompt:**
> Bottom-left corner ornament: a low cluster of three crimson desi roses, one golden marigold and sprigs of bright yellow mustard flowers, tied with a bow of flat shimmering golden gota lace ribbon with two trailing tails; olive-green leaves and mustard sprigs taper upward along the left edge and outward along the bottom edge. The rest of the square is completely empty. + STYLE + KEY

### 9. `event-motifs.webp` — Celebrations, 4-cell event-type sprite
- **Role:** one motif per event card, chosen by the event-type matcher. CSS `background-position` steps of 25%.
- **Cells (300×320 each, subject centred, ≥ 24px margin, same scale and baseline):**
  1. **Roka / Shagun:** hammered brass *shagun thaal* (plate) with chhuare (dry dates), almonds, a red-and-gold gota ribbon bundle (replaces mauli, see §1), and a few rose petals.
  2. **Maiyan / Vatna / Mehndi:** a small woven-seat wooden *peerhi* stool holding a brass bowl of golden-yellow vatna paste, with two mehndi cones and a few marigolds.
  3. **Jaago / Sangeet:** a hammered copper-brass *jaago gaagar* pot crowned with a ring of small lit clay diyas, beside a *dholki* drum with ochre rope lacing and a red-gold cloth band.
  4. **Wedding / Milni / Reception:** a stack of red-and-ivory *chooda* bangles with golden *kalire* domes hanging from them, beside two neatly folded embroidered crimson-and-cream *milni* shawls and a thick round marigold-and-crimson-rose *milni haar* garland.
- **Aspect / size:** 15:4; generate 2400×640 (or 4 separate 1:1 renders composed onto a 1200×320 sheet; this is preferred for consistent scale), export 1200×320 WebP alpha ≤ 260 KB.
- **Prompt (sheet):**
> Four separate small Punjabi wedding still-life objects in a single horizontal row, evenly spaced in four equal cells with generous empty space between them, all at the same scale, standing on the same invisible baseline, front three-quarter view: (1) a round hammered antique brass plate holding dry dates, almonds, a small bundle of red-and-gold ribbon and a few crimson rose petals; (2) a low wooden stool with a woven jute seat holding a brass bowl of golden-yellow turmeric paste, two henna cones and three marigolds; (3) a hammered copper and brass water pot crowned with a ring of small lit clay oil lamps, beside a small barrel-shaped dholki drum with ochre rope lacing and a red-gold cloth band; (4) a stack of red and ivory bridal bangles with golden filigree dome-shaped kalire hanging from them, beside two folded embroidered crimson-and-cream woollen shawls and a thick round marigold and crimson rose garland. No people, no hands. + STYLE + KEY
- **Single-cell variant** (if composing): use the same text with only one object, "centred in a square frame".

### 10. `date-plaque.webp` — Celebrations date plaque
- **Role:** raised plaque behind each event's day and month.
- **Composition:** an **octagonal medallion**. Outer ring: terracotta with a thin brass rim. Inner border: a stepped geometric **bagh** pattern of golden silk-darning diamonds on suha red, embroidered texture. A **smooth flat warm-ivory centre** (`#F6E8CC`) takes ≥ 62% of the width, with no pattern.
- **Aspect / size:** 1:1; generate 1024×1024, export 240×240 WebP alpha ≤ 70 KB.
- **Prompt:**
> A single octagonal medallion plaque: an outer ring of warm terracotta with a thin raised antique brass rim, an inner border band of suha red cloth covered in golden-yellow silk darning in stepped geometric diamond patterns like Punjabi bagh phulkari embroidery, and a large smooth, flat, plain warm ivory centre with no pattern or texture, filling most of the medallion. Front view, symmetrical. + STYLE + KEY

### 11. `rsvp-tableau.webp` — RSVP header still life
- **Role:** composed header above the RSVP form (the equivalent of Tamil `m-09` and the Muslim tableau). The bottom 15% is empty for the eyebrow.
- **Composition (strictly symmetrical):** a low **brass-bound tahli wood heirloom sandook** chest forms the ledge across the lower centre. On it: a pair of **embroidered tilla jutti** (gold zari on crimson) at centre left, and a **brass gulabdani** (rosewater sprinkler, slender long-necked) at centre right. A small **brass bowl of phulian (puffed rice) and almonds** sits at the exact centre front. A small wooden **charkha** spinning wheel sits at the far right of the ledge. Two **tall brass deepdan/diya stands with lit flames** stand at far left and far right. A soft **marigold-and-rose swag** drapes between the stands across the top. Objects occupy y 5–85%; y 85–100% stays empty.
- **Aspect / size:** about 1.4:1; generate 1800×1280, export 900×640 WebP alpha ≤ 220 KB.
- **Prompt:**
> Symmetrical Punjabi welcome still life: a low carved dark tahli wood heirloom trunk chest with antique brass corner bindings and brass studs forms a ledge across the lower centre; on it, at centre left, a pair of crimson velvet tilla jutti shoes with dense gold zari embroidery; at centre right, a slender long-necked antique brass rosewater sprinkler; at the exact centre front, a small brass bowl of white puffed rice and almonds; a small wooden spinning wheel charkha at the far right end of the chest; two tall antique brass lamp stands with small lit oil-lamp flames stand at the far left and far right; a soft swag of golden marigolds and crimson roses drapes between the two lamp stands across the top. The bottom sixth of the image is empty. Front view. + STYLE + KEY

### 12. `closing-sarhon-dusk.jpg` — Closing scene
- **Role:** full-bleed final scene behind the elders' *aseesan* (blessings), the couple names and the date.
- **Composition:**
  - Framing: we look **outward through an open haveli brick archway**, the same Nanakshahi brick and tahli as the Opening, now seen from inside looking out at sunset. The arch jambs fill x 0–16% and 84–100%, and the arch crown and spandrels fill y 0–14%. A **crimson phulkari** is draped over the arch top, and marigold strings hang down the jambs.
  - Through the arch: **blooming yellow sarhon fields bordered by olive-green winter kanak** fill y 56–76%, with the setting sun low and soft-edged at the horizon (y ≈ 58%, x 50%), warm and diffused, not flared.
  - Bottom (y 72–100%): a low **brick sill** with a row of **lit earthen diyas**, a folded phulkari and a brass lota at the corners.
- **Quiet band:** **y 16–56%, x 16–84%**. Large, calm golden-cream sky, `#F4D9A6` → `#F8E8C8` → `#F2C88E` near the horizon, with paper tooth only. Text ink is `#5A1A14` / `#4A2E1A` as in the Opening.
- **Aspect / size:** 9:16; generate 1152×2048, export 1080×1920 JPG ≤ 450 KB. Opaque.
- **Prompt:**
> Vertical 9:16 painted view looking outward through a large open Punjabi haveli archway of thin red Nanakshahi bricks with lime pointing at sunset. The arch jambs frame the far left and far right edges, each about one sixth of the width, with strings of golden marigolds hanging down them, and the pointed arch crown with carved dark tahli wood trim spans the very top with a deep suha red phulkari shawl embroidered in golden silk draped over it. Through the archway, from about 16% to 56% of the image height and across the middle two thirds of the width, a vast, completely empty, calm, luminous golden-cream evening sky with only the faintest warm haze, and no birds, clouds, kites or objects. Below it, endless blooming yellow mustard fields bordered by young olive-green winter wheat stretch to a low horizon, where a soft, large, warm setting sun rests diffused in golden haze with no flare. In the foreground at the bottom, a low brick window sill lined with a row of small lit earthen diyas with warm glows, a folded golden-on-red phulkari at the lower left and a hammered brass water pot at the lower right. Symmetrical, serene, nostalgic. + STYLE

---

## 6. Acceptance checks per generation
- **Quiet bands:** sample a 9×9 grid inside each band. Luminance must vary by ≤ 6% and there must be no hard edges. Otherwise regenerate. A radial lift (§2.3) is allowed only as a last resort.
- **No blue:** check the hue histogram of every transparent asset. There must be zero pixels within hue 190–260° at saturation > 25% after keying.
- **Religious-symbol audit:** no Ik Onkar, Khanda, Om, swastika, deities, shikhara, flags, havan, or coconut-topped kalash.
- **Mor:** at most one, golden-ochre, opaque scenes only.
- **Style match:** place each cut-out on the Opening JPG. Edge softness, brass highlight colour (`#F4D58A`) and shadow warmth must match.
- **File size:** transparent ≤ 200 KB (valance and sprite ≤ 260 KB); opaque ≤ 450 KB.

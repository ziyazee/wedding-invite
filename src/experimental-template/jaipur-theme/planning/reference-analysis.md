# Jaipur Theme — Reference Analysis

## Source Material

| Property | Value |
|----------|-------|
| File | `src/experimental-template/public/Hawa Mahal.mp4` |
| Resolution | 1080 × 1920 (9:16 portrait) |
| Duration | ~10 seconds |
| Codec | H.264 High, 24 fps, ~5 Mbps |
| File size | 6.1 MB |
| Subject | Hawa Mahal ("Palace of Winds"), Jaipur, at night |

---

## 1. Video Narrative Arc

The video tells a three-act story in 10 seconds:

### Act 1 — Darkness & Anticipation (0 s – 3 s)
- The Hawa Mahal facade is almost entirely in shadow against a deep navy-black sky.
- Only the faintest ambient light picks out the silhouette of the upper cupolas and the rhythmic arches.
- A single four-pointed star/sparkle element sits at the bottom-right — a branded watermark, but its placement reinforces "waiting for something."
- **Mood**: Quiet, reverent, like the hush before a ceremony.

### Act 2 — Illumination & Celebration (3 s – 7 s)
- Warm golden uplights begin flooding the facade from the base upward.
- Individual jharokha windows glow from within, creating a honeycomb of warm light.
- At the peak moment: **fireworks** erupt above the roofline — at least 5 distinct bursts, warm white/gold toned, radiating outward.
- Firework trails shoot upward from behind the palace, creating vertical energy against the horizontal layering of the architecture.
- The lower stories illuminate first, then light crawls upward to the crown, giving a "rising" sensation.
- **Mood**: Joyous reveal, akin to the baraat arrival or the mandap unveiling.

### Act 3 — Radiant Warmth (7 s – 10 s)
- Fireworks have dissipated; the palace stands in full, steady illumination.
- Every jharokha, lattice panel, and architectural detail is now visible and warm.
- The sky remains deep navy, providing maximum contrast.
- Ground-level spotlights create a bright wash at the base that fades upward.
- The star watermark is still visible, now lit by the ambient glow.
- **Mood**: Settled warmth, confidence, "the celebration has begun."

**Design implication**: The video's arc maps perfectly to the invitation flow:
- Dark opening = tap-to-start anticipation
- Illumination = name reveal (names appear as the palace lights up)
- Steady warmth = scrolling through the invitation content

---

## 2. Color Extraction

### Sky / Background
| Swatch | Hex | Where |
|--------|-----|-------|
| Night sky (deep) | `#0B1026` | Top of frame, all acts |
| Sky near horizon | `#121A30` | Just above the roofline |
| Dark vignette | `#060914` | Corners in Act 1 |

### Sandstone / Architecture (unlit)
| Swatch | Hex | Where |
|--------|-----|-------|
| Shadow sandstone | `#5A3D2E` | Unlit facade, Act 1 |
| Mid sandstone | `#8B6B52` | Partially lit arches |
| Pink sandstone (natural) | `#B8876D` | Daylight-equivalent base tone |

### Sandstone / Architecture (lit)
| Swatch | Hex | Where |
|--------|-----|-------|
| Warm lit facade | `#C4956A` | Average lit surface, Acts 2–3 |
| Golden highlight | `#D4A853` | Direct uplight on pilasters |
| Hot gold (brightest) | `#E8C078` | Spotlight focal points |
| Blush-pink wash | `#D4A5A5` | Upper stories where warm light meets pink stone |
| Rose sandstone glow | `#C2806B` | Mid-tones where terracotta shows |

### Accent / Fireworks
| Swatch | Hex | Where |
|--------|-----|-------|
| Firework white-gold | `#F5E6C8` | Burst center |
| Firework trail | `#D4B88C` | Streaks |
| Firework halo | `#B89870` | Diffused glow around burst |

### Greens (jharokha interiors)
| Swatch | Hex | Where |
|--------|-----|-------|
| Teal-green glass | `#2E5E56` | Interior of latticed windows |
| Dark green depth | `#1A3B35` | Recessed window interiors |

### User-requested palette shift: Warmer & Rosier
The raw video leans amber-gold. To honor the user's "warmer & rosier" direction, shift the template palette toward:
- **Rose gold** `#B76E79` as the primary accent instead of pure gold
- **Blush sandstone** `#D4A5A5` as the secondary warm tone
- **Terracotta** `#C67B5C` for depth instead of dark brown
- Keep `#0B1026` navy as the dark anchor — it's already perfect
- Use `#D4A853` gold sparingly for highlights only, not as the dominant warm

---

## 3. Architectural Elements

### Jharokha Windows (Overhanging Balconies)
- The dominant visual motif: **5 stories of projecting oriel windows** in a pyramidal composition (5-wide at base, 3 at top).
- Each jharokha has:
  - A multi-cusped arch (typically 5–7 cusps)
  - An outer frame with engaged mini-columns
  - Interior lattice (jali) screens — hexagonal honeycomb pattern visible in the lit frames
  - A small dome or cupola above
- **SVG opportunity**: A simplified jharokha outline as a section frame or decorative element.

### Arched Forms
Three distinct arch types visible:
1. **Pointed cusped arch (top tier)**: Multi-lobed, most ornate, crown of the building
2. **Ogee arch (middle tiers)**: S-curved profile, the "classic Rajput arch"
3. **Simple pointed arch (base tier)**: More structural, broader proportions

**SVG opportunity**: Use the ogee arch as the primary arch motif for section dividers and event card frames.

### Jali (Lattice) Screens
- Visible in the lit jharokhas: **hexagonal honeycomb** pattern, tight and geometric.
- Also visible: rectangular grid lattice on the lower-story windows.
- The jali serves a dual role: decorative AND functional (historically for airflow + privacy).
- **SVG opportunity**: A tileable jali pattern as a subtle background texture at 3–5% opacity.

### Cupolas & Finials
- Each major jharokha is crowned with a small **chatri** (umbrella-shaped dome).
- The roofline has a series of bulbous finials creating a scalloped silhouette.
- **SVG opportunity**: The cupola silhouette could work as a small ornament between text elements.

### Pilasters & Cornices
- Engaged columns divide the facade into bays.
- Horizontal cornices with decorative molding mark each story.
- Strong horizontal banding alternates with vertical pilasters = a grid rhythm.
- **Design implication**: The template's section layout should echo this horizontal layering with clear, rhythmic divisions.

### Pyramidal Massing
- The facade steps inward as it rises: widest at the base, narrowest at the crown.
- This creates a natural visual hierarchy — the eye is drawn upward.
- **Design implication**: The opening section should feel expansive/wide, with content narrowing as the user scrolls deeper.

---

## 4. Lighting Qualities

### Act 1 — Ambient/Dark
- Almost no direct light; the stone reads as a desaturated warm brown.
- The sky is not pure black — it's a rich navy `#0B1026` with very subtle gradient to `#121A30` near the horizon.
- Minimal light scatter around the base suggests distant street lighting.
- **Template translation**: Use `#0B1026` → `#060914` gradients for deep backgrounds. Never pure `#000`.

### Act 2 — Uplighting + Fireworks
- **Ground-mounted uplights** flood the lower facade in warm gold (~3000K color temperature).
- Light intensity is strongest at the base and attenuates upward, creating a natural bottom-to-top gradient on the stone.
- Individual jharokha windows **glow from within** — this is the most magical quality. The lattice screens become glowing honeycomb patterns.
- Firework light is **momentary and bright**: white-gold bursts that cast brief illumination across the upper facade and sky.
- Firework trails create **vertical energy** that contrasts with the horizontal architecture.
- **Template translation**: Use warm radial gradients or `box-shadow` glows on interactive elements (event cards, RSVP buttons) to recreate the "lit from within" feeling. Reserve bright white-gold for accent moments (hover states, active elements).

### Act 3 — Full Illumination
- Even, warm illumination across the entire facade.
- The stone's natural pink-terracotta tone is most visible here — the lit surface is clearly *warmer* and *pinker* than raw gold.
- Shadows are soft but present in the recesses between jharokhas.
- The teal-green glass in the jharokha interiors provides the only cool accent.
- **Template translation**: Section backgrounds should feel "warmly lit" not "glowing." Use subtle warm gradients rather than flat colors. The teal-green `#2E5E56` could appear as a very restrained accent (map pin icon, a single decorative element).

---

## 5. Emotional Progression → Invitation Flow Mapping

| Video Moment | Emotion | Invitation Section | Treatment |
|---|---|---|---|
| Dark facade, silence | Anticipation, reverence | **Opening** (tap-to-start) | Dark background, minimal text, "Touch to begin" pulse |
| First lights rising | Unveiling, excitement | **Name reveal** (during video at ~70%) | Names fade in with warm glow, synced to the light bloom |
| Fireworks burst | Joy, celebration | **Transition to Couple** | The name reveal climaxes as fireworks peak |
| Steady warm glow | Warmth, intimacy | **Couple + Shloka** | Warm backgrounds, rose gold accents, intimate typography |
| Full illumination | Confidence, grandeur | **Countdown + Celebrations** | Richer backgrounds, event cards that glow from within |
| Sustained beauty | Contentment, welcome | **RSVP + Gallery + Closing** | Settled warmth, inviting forms, graceful sign-off |

---

## 6. Typography Recommendations

### Display Font (Couple Names)
**Cormorant Garamond** (Light 300 or Regular 400)
- High-contrast serif with elegant thin strokes — mirrors the delicate filigree of the jali screens.
- The tall ascenders and refined proportions feel palatial without being stuffy.
- At large sizes (clamp 2.4rem–3.6rem), the thin/thick contrast creates the same light-and-shadow interplay visible on the stone.

### Body / Labels
**Josefin Sans** (Light 300)
- Geometric sans with a slightly Art Deco quality — echoes the geometric precision of the lattice patterns.
- Reads cleanly at small sizes for labels, addresses, timing details.
- The light weight maintains the airy, spacious feel of the architecture.

### Sanskrit / Devanagari
**Noto Serif Devanagari** (Medium 500 or SemiBold 600)
- Clean, well-proportioned Devanagari with appropriate gravitas for a shloka.
- Slightly heavier weight than the Latin body text to maintain visual balance (Devanagari's horizontal bar and dense glyphs need more weight to feel matched).

### Typography Rules
- Names: ALL CAPS is optional but letter-spacing should be wide (0.06–0.1em) to echo the spacious window bays.
- Section labels: UPPERCASE, very light weight, generous letter-spacing (0.25–0.3em) — like carved inscriptions.
- Body text: sentence case, light weight, comfortable line-height (1.6–1.8).
- The Devanagari shloka should be displayed at a slightly larger size than surrounding English text, centered, with generous line-height (2.0+) so each line breathes like an inscription.

---

## 7. Cultural Motif Opportunities

### Primary Motif: Jharokha Window Frame
- Use a simplified jharokha outline (ogee arch + side columns + base shelf) as a framing device for:
  - The couple section (names inside the arch)
  - Event cards (each event framed in a miniature jharokha)
  - The shloka section (verse inside an arch)

### Secondary Motif: Jali Lattice Pattern
- Tileable hexagonal or star-shaped lattice at very low opacity (3–5%) as a background texture.
- Apply to alternating sections to create subtle visual differentiation.
- Can also be used as a decorative border on the RSVP form or gallery section.

### Tertiary Motif: Arch Divider
- A horizontal ornamental line based on the ogee arch profile.
- Use as a section separator — alternate between the arch divider and a simple glowing line.
- The arch should be rendered with thin strokes (0.5–0.8px) and low opacity (15–30%) to feel engraved, not illustrated.

### Accent Motif: Cupola Silhouette
- The chatri/cupola profile works as a small ornament:
  - Flanking the ampersand between names
  - As bullet markers in the celebration list
  - As a tiny flourish in the closing section

### Potential Motif: Honeycomb Glow
- The lit jali screens create a distinctive "glowing honeycomb" effect.
- This could be recreated as a decorative background element behind the countdown timer or RSVP section — a grid of softly glowing hexagons at very low opacity.

### Cultural Authenticity Notes
- Hawa Mahal is specifically **Rajput** architecture (built 1799 by Maharaja Sawai Pratap Singh).
- The pyramidal facade is unique to this building — don't try to replicate the full building shape, but do use its vocabulary (jharokhas, jali, ogee arches, chatri).
- The pink sandstone is the defining material of Jaipur ("Pink City") — honor this with the blush/rose palette.
- The five-story structure represents the five forms of Lord Krishna's crown — a subtle nod that can inform the "five-tiered" visual rhythm of the invitation sections.

---

## Summary: Key Decisions for Creative Direction

1. **Dark navy anchors everything** — `#0B1026` as the dominant background.
2. **Rose gold over pure gold** — `#B76E79` is the hero accent, `#D4A853` is reserved for highlights.
3. **Blush-pink sandstone** — `#D4A5A5` and `#C67B5C` terracotta provide warmth without going orange.
4. **Jharokha arch is the signature shape** — use it for framing, not just decoration.
5. **Jali lattice is the subtle texture** — never dominant, always whispered.
6. **Light rises from below** — gradients, glows, and reveals should move bottom-to-top.
7. **Typography is refined and spacious** — wide letter-spacing, light weights, no condensed faces.
8. **Names sync to the video's 70% mark** — the name reveal begins as the palace illuminates.

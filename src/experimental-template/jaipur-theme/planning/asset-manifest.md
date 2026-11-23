# Jaipur Theme — SVG Asset Manifest

## Assessment of Existing Assets

### JaliPattern.tsx — NEEDS ENHANCEMENT
Current: 4-pointed star + 4 quadratic arcs + corner dots. Reads as generic, not Rajasthani.
Problem: Real jali screens have interlocking geometric stars with 6–8 points, hexagonal tessellation, and fine filigree connecting lines. The current version is too sparse at 3–5% opacity to register as a jali.

**Enhancement plan:**
- Replace the 4-pointed star with an 8-pointed Islamic star (octagram) formed by two overlapping squares
- Add a secondary ring of small circles at the intersection points
- Add thin radial spokes connecting the star tips to the cell boundary
- Increase base opacity to 0.04–0.06 for strokes, 0.03 for fills
- Add a second pattern variant (denser) for the Shloka section background

### ArchDivider.tsx — NEEDS ENHANCEMENT
Current: Two concentric arches + keystone dot + flanking mini-arches + side lines. Functional but flat.
Problem: Real Mughal mehrab arches have cusped (multifoil) inner edges, spandrel decorations, and finial details.

**Enhancement plan:**
- Add cusped inner arch (5-lobe multifoil profile inside the smooth outer arch)
- Add small lotus bud finial at the apex instead of a plain dot
- Add teardrop spandrel fills in the space between outer and inner arches
- Add tiny decorative dots along the baseline at regular intervals
- Increase line weight variation: outer arch 1.0, inner 0.6, cusps 0.4

---

## New Assets Needed (12 total: 2 enhanced + 10 new)

### Priority 1 — Core Structural (build first)

#### 1. `MehrabFrame.tsx` — Ornamental Section Header Frame
**Purpose:** Wraps section titles (Couple, Countdown, Celebrations, RSVP, Gallery) in a decorative arch frame
**Used in:** All non-Opening, non-Closing sections as title decoration
**Complexity:** Detailed
**Palette:** `--jt-rose-gold` strokes, `--jt-gold` fills for finial
**Opacity:** Strokes 0.25–0.35, fills 0.15–0.20

**SVG specification:**
- viewBox: `0 0 300 80`
- Outer cusped mehrab arch: 5-lobe multifoil, stroke 0.8
- Inner smooth pointed arch, stroke 0.5
- Lotus bud finial at apex: 3 petals, ~8px tall
- Small kalash (pot) base below finial: ellipse + neck
- Baseline with alternating dot-dash pattern
- Corner flourish: pair of inward-curling tendrils at each end
- Children rendered inside the arch (title text goes in the gap)

#### 2. `LotusMotif.tsx` — Sacred Lotus for Shloka Section
**Purpose:** Centerpiece motif above the Sanskrit text
**Used in:** Shloka section, centered above text
**Complexity:** Detailed
**Palette:** `--jt-rose-gold` petals, `--jt-gold` center, `--jt-blush` outer glow
**Opacity:** Outer petals 0.3, inner petals 0.5, center 0.6, glow halo 0.06

**SVG specification:**
- viewBox: `0 0 80 80`, centered composition
- 8 outer petals: teardrop shapes radiating from center, each slightly rotated (45° increments)
- 8 inner petals: smaller teardrops at 22.5° offset from outer
- Central circle with concentric rings (seed pod pattern)
- Fine stamens: thin lines from center to petal base, opacity 0.15
- Subtle radial glow: circle r=38, fill with gradient from gold-center to transparent

#### 3. `FloralCorner.tsx` — Event Card Corner Ornament
**Purpose:** Decorative corners for celebration event cards
**Used in:** Celebrations section, positioned at top-left and mirrored to top-right of each event card
**Complexity:** Medium
**Palette:** `--jt-rose-gold` lines, `--jt-sandstone` leaf fills
**Opacity:** Lines 0.2–0.3, fills 0.1–0.15

**SVG specification:**
- viewBox: `0 0 60 60`, designed for top-left corner (mirror via CSS `scaleX(-1)`)
- Main element: curving vine starting from corner (0,0) arcing inward
- 3 small leaves along the vine: pointed oval shapes
- 1 small 5-petal flower at the vine's end
- Fine tendrils: 2–3 thin spiral curls branching from the vine
- All paths use quadratic curves for organic feel

### Priority 2 — Atmosphere (build second)

#### 4. `PeacockFeather.tsx` — Decorative Accent
**Purpose:** Rajasthani peacock eye feather motif, used as floating decorative elements
**Used in:** Couple section background (2–3 feathers, large, very low opacity), Gallery section
**Complexity:** Detailed
**Palette:** `--jt-rose-gold` barbs, `--jt-gold` eye center, `--jt-sandstone` shaft
**Opacity:** Overall 0.04–0.08 when used as background, 0.2–0.3 when used as accent

**SVG specification:**
- viewBox: `0 0 40 120`
- Central rachis (shaft): thin line, slight curve
- Eye spot: concentric ovals (3 layers) at top third — inner gold, mid rose-gold, outer sandstone
- Barb lines: fine parallel strokes radiating from rachis, slight wave
- Tip: barbs fan outward at the top above the eye

#### 5. `KalashFinial.tsx` — Sacred Pot Motif
**Purpose:** Traditional kalash (sacred water vessel) with coconut and mango leaves — auspicious symbol
**Used in:** Top of Closing section, bottom of Couple section
**Complexity:** Medium
**Palette:** `--jt-gold` vessel, `--jt-sandstone` leaves, `--jt-rose-gold` coconut
**Opacity:** 0.2–0.35

**SVG specification:**
- viewBox: `0 0 48 72`
- Vessel body: rounded pot shape (wide belly, narrow neck)
- Decorative band around belly: zigzag or wave pattern
- 5 mango leaves fanning from the mouth
- Coconut atop the leaves (circle)
- Base: small pedestal ring

#### 6. `OrnamentalBorder.tsx` — Couple Section Frame
**Purpose:** Decorative border frame surrounding the couple names block
**Used in:** Couple section, wrapping the names and parent details
**Complexity:** Detailed
**Palette:** `--jt-rose-gold` main border, `--jt-gold` corner pieces
**Opacity:** Border lines 0.15–0.25, corner fills 0.12

**SVG specification:**
- viewBox: `0 0 400 500` (responsive, rendered as background)
- Outer rectangle with slightly rounded corners (2px radius)
- Inner rectangle inset by 8px, dashed stroke
- 4 corner ornaments: small mehrab arch motif at each corner, rotated to face inward
- Top center: small lotus bud pointing up
- Bottom center: small inverted lotus bud
- Side centers: small diamond/dot accent

### Priority 3 — Polish (build last)

#### 7. `DiwaLamp.tsx` — Small Oil Lamp
**Purpose:** Tiny oil lamp icon used near the countdown or as inline decoration
**Used in:** Countdown section (pair flanking the timer), Closing section
**Complexity:** Simple
**Palette:** `--jt-gold` body, `--jt-rose-gold-light` flame
**Opacity:** 0.3–0.4

**SVG specification:**
- viewBox: `0 0 24 32`
- Oval oil bowl
- Small triangular flame (teardrop)
- Flame glow: circle, opacity 0.08
- Simple pedestal base

#### 8. `RajputShield.tsx` — Decorative Shield/Crest
**Purpose:** Heraldic ornament evoking Rajput warrior heritage, used as a standalone accent
**Used in:** Between Couple and Shloka sections (optional divider variant)
**Complexity:** Medium
**Palette:** `--jt-sandstone` shield body, `--jt-gold` border, `--jt-rose-gold` inner details
**Opacity:** 0.15–0.25

**SVG specification:**
- viewBox: `0 0 48 56`
- Shield shape: pointed bottom, curved top
- Inner field: diagonal cross pattern or sun motif (Rajput sun symbol)
- Border: double-line with corner dots
- Top: small crown/finial shape

#### 9. `StarIcon.tsx` — 4-Point Star
**Purpose:** Small decorative star for CTA button and inline accents
**Used in:** Opening CTA, section spacers
**Complexity:** Simple
**Palette:** `currentColor` (inherits)
**Opacity:** Controlled by parent

**SVG specification:**
- viewBox: `0 0 24 24`
- 4-pointed star: two overlapping diamonds rotated 45°
- Center dot

#### 10. `MandalaRing.tsx` — Circular Mandala Border
**Purpose:** Circular decorative ring used behind the countdown timer numbers
**Used in:** Countdown section as background element
**Complexity:** Medium-Detailed
**Palette:** `--jt-rose-gold` rings, `--jt-gold` dots
**Opacity:** 0.05–0.10 (very subtle background)

**SVG specification:**
- viewBox: `0 0 200 200`, centered circle composition
- Outer ring: circle with scalloped edge (small arcs along circumference)
- Middle ring: circle with evenly spaced dots (24 dots)
- Inner ring: plain circle
- Between rings: tiny petal shapes at cardinal and ordinal points (8 total)
- All strokes very fine (0.3–0.5) since this is atmospheric

---

## Implementation Priority Order

1. **JaliPattern.tsx** — enhance (used on every section as background texture)
2. **ArchDivider.tsx** — enhance (used 4× between sections)
3. **MehrabFrame.tsx** — new (used in 5 section headers)
4. **LotusMotif.tsx** — new (Shloka section centerpiece)
5. **FloralCorner.tsx** — new (4 event cards × 2 corners = 8 instances)
6. **StarIcon.tsx** — new (simple, needed for Opening CTA)
7. **OrnamentalBorder.tsx** — new (Couple section frame)
8. **PeacockFeather.tsx** — new (atmospheric, Couple + Gallery backgrounds)
9. **DiwaLamp.tsx** — new (Countdown flanking lamps)
10. **KalashFinial.tsx** — new (Couple bottom + Closing top)
11. **MandalaRing.tsx** — new (Countdown background)
12. **RajputShield.tsx** — new (optional accent between sections)

---

## Color Token Usage Summary

| Token | SVG Usage |
|-------|-----------|
| `--jt-rose-gold` (#B76E79) | Primary stroke color for most ornaments |
| `--jt-rose-gold-light` (#D4929B) | Flame accents, lighter petal fills |
| `--jt-gold` (#D4A853) | Finials, centers, vessel bodies, secondary fills |
| `--jt-gold-warm` (#C5964A) | Kalash body, warm accents |
| `--jt-sandstone` (#C4956A) | Leaf fills, shield bodies, secondary strokes |
| `--jt-sandstone-light` (#D4B08C) | Light ornamental fills |
| `--jt-blush` (#E8C4B8) | Glow halos, subtle outer petals |
| `--jt-cream` (#FAF0E6) | Star/dot highlights at very low opacity |

## Blending & Opacity Rules

- **Background textures** (jali, mandala, feathers): 0.03–0.08 opacity max — felt, not seen
- **Structural dividers** (arches, borders): 0.15–0.35 opacity — present but not heavy
- **Decorative accents** (lotus, corners, lamps): 0.2–0.4 opacity — visible but refined
- **All SVGs** use `currentColor` as default so the parent can control color via CSS `color` property, except when multiple colors are needed (then use CSS custom properties directly)
- **No hard edges**: all closed shapes should have slight opacity variation between stroke and fill
- **Glow halos**: radial gradient circles at 0.04–0.08 behind flame/light sources

# Hawa Mahal — Scroll Storyboard

> This document is the single source of truth for every visual, spatial, and behavioral detail across all 6 sections. The React Engineer builds directly from this. If a measurement, color, or behavior is not specified here, it does not exist.

---

## Global Constants

```
Viewport width (mobile base):  402px
Content max-width:              354px  (402 - 24*2 gutter)
Side gutters:                   24px
Section vertical padding:       64px top and bottom
Transition zone:                48px gradient bleed between sections
Cornice height:                 16-20px
CSS prefix:                     hm-
Root isolation:                 isolation: isolate
Root background:                --hm-night (#0B1620)
Root font:                      Cormorant Garamond, Georgia, serif
Root font-size:                 16px
Root line-height:               1.6
```

### Color Tokens (repeated for inline reference)

| Token | Hex |
|-------|-----|
| `--hm-night` | `#0B1620` |
| `--hm-night-deep` | `#060E15` |
| `--hm-sandstone` | `#C4836A` |
| `--hm-sandstone-light` | `#D4A07A` |
| `--hm-sandstone-pale` | `#F0DDD0` |
| `--hm-sandstone-shadow` | `#6E4A3A` |
| `--hm-gold` | `#D4A055` |
| `--hm-gold-bright` | `#E8B86D` |
| `--hm-gold-deep` | `#B8892E` |
| `--hm-teal` | `#2A4540` |
| `--hm-teal-light` | `#3D5C52` |
| `--hm-ivory` | `#F5EDE0` |
| `--hm-marble` | `#FAF7F2` |
| `--hm-deep-brown` | `#2A1F1A` |
| `--hm-ember` | `#C4956A` |

### Gradients

```
--hm-gradient-sky:              linear-gradient(180deg, #060E15 0%, #0B1620 100%)
--hm-gradient-sky-to-sandstone: linear-gradient(180deg, #0B1620 0%, #2A1F1A 40%, #6E4A3A 100%)
--hm-gradient-sandstone-warmth: linear-gradient(180deg, #F0DDD0 0%, #F5EDE0 100%)
--hm-gradient-night-vignette:   radial-gradient(ellipse at 50% 30%, #0B1620 0%, #060E15 100%)
```

---

## Section 1: Welcome Message

### 1. Purpose

The gateway into the invitation. The guest arrives at the palace at nightfall, watches it illuminate in golden light with fireworks, and then reads the couple's names and welcome message for the first time. This is the moment of grandeur -- the equivalent of receiving a summons to a royal celebration.

### 2. Visual Concept

Night falls on the Hawa Mahal. The palace facade is barely visible in darkness. Golden uplighting sweeps floor by floor, fireworks erupt, and the building settles into a serene glow under twinkling stars. That illuminated frame becomes the backdrop over which the couple's names are revealed inside a carved mehrab arch, as if inscribed in stone above the palace entrance. The mood is dramatic, warm, and unhurried.

### 3. Layout and Composition

The section occupies the full viewport height on initial load (min-height: 100vh, or 100svh where supported). After the video ends and content appears, the section's natural height is determined by its content.

```
Container: position: relative; overflow: hidden; min-height: 100vh;
           width: 100%; background: var(--hm-gradient-night-vignette);

Content wrapper: position: relative; z-index: 10;
                 display: flex; flex-direction: column; align-items: center;
                 padding: 40px 24px 24px 24px;
                 text-align: center;

Vertical flow (top to bottom):
  [40px top padding]
  [Lotus Medallion — 28px diameter]
  [16px gap]
  [Gold cornice line — 1px tall, 80% width centered]
  [24px gap]
  [Welcome label text]
  [12px gap]
  [Mehrab Arch Frame wrapping:]
    [Groom's Name]
    [8px gap]
    [Ampersand]
    [8px gap]
    [Bride's Name]
  [32px gap]
  [Welcome message text — max-width: 320px]
  [40px gap]
  [Wedding date line]
  [64px gap]
  [Lotus Scroll Indicator — 32px diameter]
  [24px bottom padding]
```

### 4. Background Artwork

**During video playback:**
- The `<video>` element fills the entire section. `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1`.
- The video source is the Hawa Mahal illumination MP4 (1080x1920, 9:16, ~10s, ~6.3MB).
- `poster` attribute: a WebP/JPEG still frame extracted from video at ~9.5s (fully illuminated palace under stars). Max 200KB.
- Video attributes: `muted`, `playsInline`, `preload="auto"`, `aria-hidden="true"`. No `loop`.

**After video ends (post-video static state):**
- The video element fades out (opacity 1 to 0, 1200ms) revealing the layers beneath.
- **Layer 1 (bottom):** The poster frame image used as a CSS `background-image` on the section container. `background-size: cover; background-position: center;`. This is the fully illuminated Hawa Mahal under a starry sky.
- **Layer 2:** Content overlay gradient for text readability: `linear-gradient(180deg, rgba(6,14,21,0.65) 0%, rgba(6,14,21,0.85) 100%)`. Full section coverage. `position: absolute; inset: 0; z-index: 2`.
- **Layer 3:** Jali honeycomb pattern overlay at 4% opacity in `--hm-gold` (#D4A055). Rendered as inline SVG `<pattern>` tile (40px hexagons, 1px stroke, no fill). `position: absolute; inset: 0; z-index: 3; opacity: 0.04`.

### 5. Foreground Artwork

1. **Lotus medallion (top):** Centered, 28px diameter SVG. Color: `--hm-gold` (#D4A055). Static after initial fade-in.
2. **Thin gold cornice line:** Horizontal rule, 1px tall, width: 80% of content area (approx 283px), centered. Color: `--hm-gold` at 40% opacity. No shimmer.
3. **Mehrab arch frame:** SVG path, 320px wide x 180px tall, 5 cusps, pointed apex. Stroke: `--hm-gold` (#D4A055) at 1.5px. Optional fill: `--hm-gold` at 3% opacity. The arch wraps only the couple's names and ampersand.
4. **Scalloped cornice border (bottom):** Full-width SVG strip, 18px tall. Repeating semicircular scallops ~24px wide with optional 3px finial dots at scallop peaks. Stroke: `--hm-gold` (#D4A055). This marks the boundary to Section 2.
5. **Lotus scroll indicator (bottom):** Centered, 32px diameter SVG. Color: `--hm-gold` (#D4A055). Positioned 24px from the bottom edge of the content area. Animated with gentle horizontal float.

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height | Extra |
|---------|------|------|--------|-------|----------------|-----------|-------------|-------|
| Welcome label | Cormorant SC | 13px | 600 | `--hm-gold-bright` (#E8B86D) | 0.1em | none (inherent small-caps) | 1.4 | — |
| Groom's name | Cinzel Decorative | 32px | 700 | `--hm-marble` (#FAF7F2) | 0.08em | uppercase | 1.2 | — |
| Ampersand | Cormorant Garamond | 20px | 400 | `--hm-gold-bright` (#E8B86D) | 0 | none | 1.3 | italic |
| Bride's name | Cinzel Decorative | 32px | 700 | `--hm-marble` (#FAF7F2) | 0.08em | uppercase | 1.2 | — |
| Welcome message | Cormorant Garamond | 18px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | italic, max-width: 320px |
| Wedding date | Cormorant SC | 13px | 600 | `--hm-gold-bright` (#E8B86D) | 0.1em | none | 1.4 | — |

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmMehrabArch` | Multi-cusped pointed arch (5 cusps, pointed apex). Scalloped inner edge. | 320px wide x 180px tall | 1.5px `--hm-gold` | `--hm-gold` at 3% opacity (optional) |
| `HmLotusmedallion` | Stylized lotus viewed from above — concentric rings of pointed petals radiating from a center dot. 3 rings of petals (8 inner, 12 middle, 16 outer). | 28px and 32px diameter variants | 1px `--hm-gold` | none |
| `HmScallopedCornice` | Repeating semicircular scallop strip. 1px straight line at top, semicircular arcs below (~24px wide each). Optional 3px finial dot at each scallop apex. | full-width x 18px tall | 1px `--hm-gold` | none |
| `HmJaliPattern` | Hexagonal honeycomb lattice as SVG `<pattern>` tile. Each hexagon ~40px across, 1px stroke, no fill. | tile: 40px x 46px | 1px `--hm-gold` | none |

### 8. PNG/Image Assets and Placement

| Asset | Description | Placement | Size | Loading |
|-------|-------------|-----------|------|---------|
| `hawa-mahal-poster.webp` | Final frame of the entry video (~9.5s). Fully illuminated Hawa Mahal under starry sky. | Section background-image, `background-size: cover; background-position: center`. Behind all layers. | 1080x1920 source, < 200KB | `priority` (it's the opening visual) |
| Entry video MP4 | Hawa Mahal illumination sequence, 10s | Fills section viewport as `<video>` element, `object-fit: cover` | 1080x1920, ~6.3MB | `preload="auto"` |

### 9. Decorative Elements

- **Twinkling stars:** 15 small circular `<div>` elements, 3-4px diameter. Color: `--hm-ember` (#C4956A). Positioned randomly in the upper 40% of the section (the sky area above the palace). Each star uses CSS animation to pulse opacity between 0.1 and 0.7, with randomized duration (2.5s-5s) and delay (0s-4s) set via CSS custom properties on mount. Stars are created as a fixed pool on mount -- no spawning.
- **Gold shimmer on cornice:** The bottom scalloped cornice receives a single-pass gold shimmer when it enters the viewport for the first time (GSAP tween, `background-position` 100% 0 to -100% 0, 1.5s ease-in-out, runs once). After that, static `--hm-gold`.

### 10. Element Positions (z-index and CSS positioning)

All content elements use `position: relative` inside the flex column content wrapper. The absolute layers behind them:

| Layer | Element | z-index | Position |
|-------|---------|---------|----------|
| 1 | Poster background image (CSS background on section) | auto (base) | — |
| 2 | Video element | 1 | `position: absolute; inset: 0` |
| 3 | Content overlay gradient | 2 | `position: absolute; inset: 0` |
| 4 | Jali pattern overlay | 3 | `position: absolute; inset: 0` |
| 5 | Stars container | 4 | `position: absolute; inset: 0; pointer-events: none` |
| 6 | Content wrapper (all text, arch, lotus, cornice) | 10 | `position: relative` (flex column) |
| 7 | Scroll indicator | 11 | `position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%)` |

### 11. Layering Order (z-index)

```
z-auto  Poster image (background-image on section)
z-1     Video element
z-2     Content overlay gradient
z-3     Jali pattern overlay
z-4     Stars container
z-10    Content wrapper (lotus, cornice line, label, arch, names, message, date)
z-11    Scroll indicator
```

### 12. Entry Animation

**Video plays first.** On component mount, `video.play()` is called. If it fails, listen for `canplay` and retry. If the video cannot play at all, show the poster frame and skip to post-video state after 1.5s.

**After video ends (the `ended` event fires), the content reveal timeline begins:**

| Delay (from video end) | Element | Animation | Duration | Easing |
|------------------------|---------|-----------|----------|--------|
| 0ms | Video element | opacity: 1 to 0 | 1200ms | ease-out |
| 0ms | Content overlay gradient | opacity: 0 to 1 | 800ms | ease-out |
| 400ms | Lotus medallion (top) | opacity: 0 to 1 | 600ms | ease-out |
| 600ms | Gold cornice line | opacity: 0 to 1 | 400ms | ease-out |
| 800ms | Welcome label | opacity: 0 to 1 | 400ms | ease-out |
| 1000ms | Mehrab arch frame | `stroke-dashoffset`: full path length to 0 (draws on) | 800ms | ease-out |
| 1200ms | Couple names (both + ampersand) | opacity: 0 to 1 | 600ms | ease-out |
| 1600ms | Welcome message | opacity: 0 to 1 | 500ms | ease-out |
| 2000ms | Wedding date | opacity: 0 to 1 | 400ms | ease-out |
| 2400ms | Scroll indicator | opacity: 0 to 0.6 | 500ms | ease-out |
| ~3000ms | Transition complete | — | — | — |

All elements start at `opacity: 0; visibility: hidden`. The GSAP timeline is created on mount but only plays when the video `ended` event fires.

**NO translateY motion.** All reveals are pure opacity. The mehrab arch uses SVG stroke-dashoffset (stroke draws from left to right).

**`prefers-reduced-motion: reduce`:** Skip entire stagger. All content visible immediately when video ends. No opacity animation, no stroke-dashoffset animation. Arch is pre-drawn.

### 13. Scroll Behavior

- **Scroll indicator fade-on-scroll:** A GSAP ScrollTrigger on `.hm-welcome-section` fades the scroll indicator from `opacity: 0.8` to `0` within the first 5% of scroll (scrub). This makes the indicator disappear as soon as scrolling begins.
- **Scroll indicator float:** CSS animation — `translateX(0)` to `translateX(4px)` and back, 3s ease-in-out infinite. Opacity oscillates between 0.6 and 1.0. This is purely horizontal — no vertical translateY.
- **Stars pause off-viewport:** When the section scrolls out of the viewport, a data attribute (`data-hm-paused`) is set on the section, and all star CSS animations receive `animation-play-state: paused`.
- **Parallax:** None. The content scrolls naturally with the page.

### 14. Exit Transition

At the bottom of the Welcome section:
1. **Scalloped cornice border** in `--hm-gold` (#D4A055), 18px tall, full width.
2. **48px gradient bleed zone** below the cornice. The gradient transitions from `--hm-night` (#0B1620) to `--hm-sandstone-pale` (#F0DDD0). This zone belongs to neither section visually — it is a seam where the two chambers connect.

The cornice receives a single-pass gold shimmer on first viewport entry (detailed in section 9).

### 15. Mobile Composition

This IS the mobile composition (402px base). No layout changes needed. On desktop, the `InvitationViewport` wraps the template in a 402x874 portrait frame, so the mobile layout IS the desktop layout. The type scale remains identical. Video `object-fit: cover` ensures full coverage regardless of slight viewport ratio differences.

---

## Section 2: Family Details

### 1. Purpose

Introduces the families of the bride and groom. This is a section of respect and warmth — the names of the elders who raised the couple and made this celebration possible. The tone is intimate, clear, and dignified.

### 2. Visual Concept

Stepping from the night sky into a warm sandstone chamber. The walls are the pale pink of the Hawa Mahal's interior corridors — clean, bright, and quiet. A lotus medallion sits as a carved stone divider between the two families, like a relief sculpture on a palace wall. Gold appears only as a subtle heading rule and the bottom cornice. This section breathes.

### 3. Layout and Composition

```
Container: width: 100%; background: var(--hm-sandstone-pale);
           padding: 64px 24px;
           display: flex; flex-direction: column; align-items: center;
           text-align: center;

Vertical flow:
  [64px top padding]
  [Section heading: "The Families" or user-customized]
  [8px gap]
  [Short gold rule — 80px wide, 1px, centered]
  [40px gap]
  [Groom's Side block:]
    [Side label: "Groom's Family"]
    [12px gap]
    [Father's name]
    [4px gap]
    [Father's description]
    [16px gap]
    [Mother's name]
    [4px gap]
    [Mother's description]
    [16px gap per additional family member]
  [32px gap]
  [Lotus Medallion — 24px diameter, centered]
  [32px gap]
  [Bride's Side block:]
    [Side label: "Bride's Family"]
    [12px gap]
    [Father's name]
    [4px gap]
    [Father's description]
    [16px gap]
    [Mother's name]
    [4px gap]
    [Mother's description]
    [16px gap per additional family member]
  [64px bottom padding]
```

Content max-width: 354px (full gutter-to-gutter).

### 4. Background Artwork

- Solid `--hm-sandstone-pale` (#F0DDD0). No gradient.
- **No jali overlay.** This section is clean. The warm color is the only texture.
- **Optional:** A barely-perceptible sandstone grain at 2% opacity via an inline SVG noise filter. Remove if it competes with text legibility.

### 5. Foreground Artwork

1. **Short gold rule:** 80px wide, 1px tall, centered below the heading. Color: `--hm-gold` (#D4A055).
2. **Lotus medallion (divider):** Centered between groom's and bride's family blocks. 24px diameter. Color: `--hm-gold-deep` (#B8892E). Static — no animation. This is a carved relief, not a living element.
3. **Scalloped cornice border (bottom):** Full-width SVG strip, 18px tall. Color: `--hm-sandstone` (#C4836A) at 50% opacity. Lighter and warmer than the gold cornices used on dark sections.

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height |
|---------|------|------|--------|-------|----------------|-----------|-------------|
| Section heading | Cinzel Decorative | 22px | 700 | `--hm-deep-brown` (#2A1F1A) | 0.06em | uppercase | 1.25 |
| Side labels | Cormorant SC | 13px | 600 | `--hm-sandstone-shadow` (#6E4A3A) | 0.1em | none | 1.4 |
| Family member names | Cormorant Garamond | 18px | 500 | `--hm-deep-brown` (#2A1F1A) | 0.01em | none | 1.6 |
| Descriptions/titles | Cormorant Garamond | 14px | 400 | `--hm-sandstone-shadow` (#6E4A3A) | 0.02em | none | 1.5 |

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmLotusmedallion` | Same lotus as Section 1, 24px variant | 24px diameter | 1px `--hm-gold-deep` | none |
| `HmScallopedCornice` | Same cornice as Section 1 but in sandstone tone | full-width x 18px | 1px `--hm-sandstone` at 50% opacity | none |

(Reuses the same SVG components as Section 1 with different color props.)

### 8. PNG/Image Assets and Placement

None. This section uses no raster images.

### 9. Decorative Elements

- The short gold rule below the heading.
- The lotus medallion between families.
- The bottom scalloped cornice.
- That is all. Restraint is the decorative choice. The warmth comes from the sandstone background color and the elegant typography.

### 10. Element Positions

All elements are in normal flow (no absolute positioning). The section is a simple flex column, centered.

```
Section container:  position: relative; (for the cornice at the bottom)
Content:            position: relative; in flex flow
Bottom cornice:     position: absolute; bottom: 0; left: 0; width: 100%;
```

### 11. Layering Order (z-index)

```
z-auto  Section background (solid --hm-sandstone-pale)
z-1     Content (all text elements, lotus, gold rule) — normal flow
z-2     Bottom scalloped cornice (positioned at the section's bottom edge)
```

No complex layering. Simple stacking.

### 12. Entry Animation

**None.** This section has no animations. It is static by design. The family names are a place of reverence — movement here would be distracting. Content is visible as soon as it scrolls into view.

The bottom cornice receives a single-pass gold shimmer when it first enters the viewport (GSAP tween, background-position shift, 1.5s, once). This is the only animated moment, and it is on the border, not the content.

### 13. Scroll Behavior

None. Content scrolls naturally. No parallax, no scroll-linked transforms.

### 14. Exit Transition

1. **Scalloped cornice border** at the bottom in `--hm-sandstone` (#C4836A) at 50% opacity, 18px tall, full width.
2. **48px gradient bleed zone** below the cornice. Gradient transitions from `--hm-sandstone-pale` (#F0DDD0) through `--hm-sandstone-shadow` (#6E4A3A) into `--hm-night` (#0B1620). This is the "stepping out of a warm chamber into the night courtyard" transition.

### 15. Mobile Composition

Same as desktop. No adjustments needed. The 402px width comfortably accommodates all family name content within the 354px content area.

---

## Section 3: Countdown

### 1. Purpose

The heart of anticipation. Displays the wedding date, time, and a live countdown timer. This is the dramatic pause between warm chambers — a night-sky vault overhead, time ticking toward the celebration. It communicates: the moment is approaching.

### 2. Visual Concept

The guest steps out of the warm family chamber into an open courtyard beneath the night sky. A deep dark vault stretches overhead, textured with a barely-visible honeycomb jali pattern — as if looking up through a lattice screen at the stars. A teal-tinged jali band pulses faintly behind the countdown digits, referencing the backlit jali windows of the Hawa Mahal. The golden countdown numbers glow like illuminated numerals on a palace clock tower.

### 3. Layout and Composition

```
Container: width: 100%; background: var(--hm-gradient-sky);
           padding: 64px 24px;
           display: flex; flex-direction: column; align-items: center;
           text-align: center;
           position: relative;

Vertical flow:
  [64px top padding]
  [Lotus Medallion — 28px diameter]
  [24px gap]
  [Countdown label]
  [16px gap]
  [Timer area (with jali band behind):]
    [Countdown digits row — 4 columns]
    [Unit labels row — 4 columns aligned below digits]
  [32px gap]
  [Full wedding date text]
  [8px gap]
  [Day of week]
  [8px gap]
  [Time]
  [64px bottom padding]
```

**Timer area detail:**
```
Timer container: max-width: 320px; width: 100%; margin: 0 auto;
                 display: flex; justify-content: center; gap: 0;
                 position: relative;

Four columns, each ~72px wide, 12px gap between columns.
Each column: display: flex; flex-direction: column; align-items: center;
  [Digit — 40px Cinzel Decorative]
  [4px gap]
  [Unit label — 11px Cormorant SC]

Between columns 1-2, 2-3, 3-4:
  Gold separator dot, 3px diameter, vertically centered at the digit's midline.
```

### 4. Background Artwork

- **Background gradient:** `--hm-gradient-sky` — `linear-gradient(180deg, #060E15 0%, #0B1620 100%)`.
- **Jali pattern overlay (full section):** Inline SVG `<pattern>` tile (40px hexagons, 1px stroke, no fill) in `--hm-gold` (#D4A055) at 4% opacity. `position: absolute; inset: 0; z-index: 1; opacity: 0.04; pointer-events: none`.
- **Jali band (behind timer):** A horizontal band, 32px tall, full content width (354px), centered vertically on the timer area. Color: `--hm-teal` (#2A4540) at 6% opacity. Same hexagonal jali pattern but tinted teal. Horizontal fade edges: a CSS mask-image gradient that fades the band from 0% opacity at the left edge to 100% at 48px, then 100% through the middle, then 0% at the right edge. This creates soft "lit window" edges.

### 5. Foreground Artwork

1. **Lotus medallion (top):** 28px diameter, `--hm-gold-bright` (#E8B86D). Static.
2. **Gold separator dots:** Three 3px-diameter circles between the four digit columns. Color: `--hm-gold` (#D4A055) at 40% opacity. Vertically centered at the digit baseline.
3. **Scalloped cornice border (bottom):** Full-width SVG strip, 18px tall, `--hm-gold` (#D4A055).

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height | Extra |
|---------|------|------|--------|-------|----------------|-----------|-------------|-------|
| Countdown label | Cormorant SC | 13px | 600 | `--hm-gold-bright` (#E8B86D) | 0.1em | none | 1.4 | e.g. "counting down to" |
| Countdown digits | Cinzel Decorative | 40px | 700 | `--hm-gold-bright` (#E8B86D) | 0.04em | none | 1.0 | `font-variant-numeric: tabular-nums` |
| Unit labels | Cormorant SC | 11px | 500 | `--hm-ivory` (#F5EDE0) at 70% opacity | 0.12em | none | 1.3 | days / hours / mins / secs |
| Full date | Cormorant Garamond | 18px | 500 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | e.g. "Saturday, 14th February 2026" |
| Day of week | Cormorant SC | 13px | 600 | `--hm-gold-bright` (#E8B86D) | 0.1em | none | 1.4 | — |
| Time | Cormorant Garamond | 16px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | e.g. "Seven in the evening" |

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmLotusmedallion` | Reuse, 28px variant | 28px diameter | 1px `--hm-gold-bright` | none |
| `HmScallopedCornice` | Reuse, gold variant | full-width x 18px | 1px `--hm-gold` | none |
| `HmJaliPattern` | Reuse — same tile as Welcome | tile: 40px x 46px | 1px `--hm-gold` (section overlay) and 1px `--hm-teal` (timer band) | none |

### 8. PNG/Image Assets and Placement

None. This section uses no raster images. All visuals are CSS + SVG.

### 9. Decorative Elements

- **Jali glow pulse:** The teal jali band behind the timer has a slow CSS opacity pulse: oscillates between `opacity: 0.04` and `opacity: 0.08` over a 6s ease-in-out infinite cycle. This references the backlit jali windows "breathing" with interior light.
- **Gold separator dots** between timer columns.
- The bottom scalloped cornice with single-pass shimmer on first viewport entry.

### 10. Element Positions

```
Section container:  position: relative;
Jali full overlay:  position: absolute; inset: 0; z-index: 1;
Jali timer band:    position: absolute; centered vertically on timer area;
                    left: 24px; right: 24px; height: 32px; z-index: 2;
Content wrapper:    position: relative; z-index: 5; (flex column)
Bottom cornice:     position: absolute; bottom: 0; left: 0; width: 100%; z-index: 6;
```

### 11. Layering Order (z-index)

```
z-auto  Background gradient (CSS on section)
z-1     Jali pattern overlay (full section, 4% gold)
z-2     Jali timer band (teal-tinted, 6%, with horizontal fade mask)
z-5     Content (lotus, label, timer digits, date text)
z-6     Bottom scalloped cornice
```

### 12. Entry Animation

**Countdown digit transitions (ongoing):** When the countdown updates each second, only the digits that actually change animate:
- Old digit: `opacity: 1` to `0`, 300ms ease-out.
- New digit: `opacity: 0` to `1`, 300ms ease-in.
- GSAP tween per update, inside `gsap.context()`.

**Section content appears without animation.** The text elements are visible as soon as they scroll into view. No entry stagger.

**`prefers-reduced-motion: reduce`:** Digits swap instantly (no opacity transition). Jali glow pulse is static at `opacity: 0.06`.

### 13. Scroll Behavior

None. Content scrolls naturally. The jali band and digits remain in their positions in the flow.

### 14. Exit Transition

1. **Scalloped cornice border** in `--hm-gold` (#D4A055), 18px tall, full width.
2. **48px gradient bleed zone** below the cornice, transitioning from `--hm-night` (#0B1620) into `--hm-ivory` (#F5EDE0) — the Celebrations section's background.

### 15. Mobile Composition

Same as desktop. The 320px timer container fits comfortably within the 354px content area. The four 72px columns with 12px gaps total 312px, well within bounds.

---

## Section 4: Celebrations

### 1. Purpose

Lists all wedding events. This is the most information-dense section. It must handle any number of events (1 to 10+) gracefully. Each event is a self-contained card. The mood is joyful and organized — the practical heart of the invitation.

### 2. Visual Concept

Entering a grand hall. The walls are warm ivory — the brightest, lightest chamber in the palace. Event cards are stacked like royal proclamation plaques mounted on the wall, each topped with a carved mehrab arch. The gold is deeper here (antique brass rather than bright gold) because it sits on a light background. The section is clean and information-focused. No background texture. No ambient animation. The cards themselves are the ornamentation.

### 3. Layout and Composition

```
Container: width: 100%; background: var(--hm-ivory);
           padding: 64px 24px;
           display: flex; flex-direction: column; align-items: center;
           text-align: center;

Vertical flow:
  [64px top padding — or 96px if only 1 event]
  [Section heading: "Celebrations"]
  [8px gap]
  [Short gold rule — 80px wide, 1px]
  [40px gap]
  [Event Card 1]
  [24px gap]
  [Event Card 2]
  [24px gap]
  [...repeat for each event...]
  [64px bottom padding — or 96px if only 1 event]
```

**Event card structure (each card):**
```
Card container: width: 354px (or 338px with 8px inset each side);
                background: var(--hm-sandstone-pale);
                border: 1px solid rgba(212,160,85,0.20) on left, right, bottom;
                border-top: none (defined by the arch);
                box-shadow: 0 2px 12px rgba(42,31,26,0.08);
                padding: 20px 24px;
                position: relative;

  [Mehrab arch — 120px wide x 36px tall, centered at top edge]
  [20px top padding inside card (below arch)]
  [Event type label — e.g. "ceremony", "reception"]
  [8px gap]
  [Event name — e.g. "Sangeet Night"]
  [16px gap]
  [Calendar icon + Date — inline]
  [8px gap]
  [Clock icon + Time — inline]
  [16px gap]
  [Venue name]
  [4px gap]
  [Address line 1]
  [Address line 2 (if present)]
  [16px gap]
  [Action buttons row: "View Map" + "Add to Calendar"]
  [16px bottom padding]
```

### 4. Background Artwork

- Solid `--hm-ivory` (#F5EDE0). No gradient. No jali overlay. This is the cleanest section.
- Event cards: `--hm-sandstone-pale` (#F0DDD0) background.

### 5. Foreground Artwork

1. **Short gold rule:** 80px wide, 1px tall, centered below heading. Color: `--hm-gold-deep` (#B8892E) — deeper gold on light background.
2. **Mehrab arch per card:** Smaller variant, 120px wide x 36px tall. Centered at the top edge of each card, sitting ON the card border. Stroke: `--hm-gold-deep` (#B8892E) at 1px.
3. **Calendar and clock icons:** Inline SVGs, 12px, stroke-only. Color: `--hm-gold-deep` (#B8892E). Calendar: simple rectangle with 2 vertical pins and a horizontal date grid. Clock: circle with two hands.
4. **Action buttons:** Outlined style — 1px solid `--hm-gold-deep` (#B8892E), no background fill, text color `--hm-gold-deep`. `border-radius: 2px`. Min height: 44px. Padding: 10px 16px. Side by side with 8px gap.
5. **Scalloped cornice border (bottom):** Full-width, 18px, `--hm-gold` (#D4A055).
6. **Lotus medallion in transition zone:** A 24px lotus centered in the 48px gradient bleed zone below the cornice. Color: `--hm-gold` (#D4A055). This marks the transition from warm to dark.

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height |
|---------|------|------|--------|-------|----------------|-----------|-------------|
| Section heading | Cinzel Decorative | 22px | 700 | `--hm-deep-brown` (#2A1F1A) | 0.06em | uppercase | 1.25 |
| Event type label | Cormorant SC | 13px | 600 | `--hm-sandstone-shadow` (#6E4A3A) | 0.1em | none | 1.4 |
| Event name | Cinzel Decorative | 20px | 700 | `--hm-deep-brown` (#2A1F1A) | 0.04em | none | 1.25 |
| Date and time | Cormorant Garamond | 16px | 400 | `--hm-deep-brown` (#2A1F1A) | 0.01em | none | 1.6 |
| Venue name | Cormorant Garamond | 16px | 500 | `--hm-deep-brown` (#2A1F1A) | 0.01em | none | 1.6 |
| Address | Cormorant Garamond | 14px | 400 | `--hm-sandstone-shadow` (#6E4A3A) | 0.02em | none | 1.5 |
| Button text | Cormorant SC | 13px | 600 | `--hm-gold-deep` (#B8892E) | 0.06em | none | 1.4 |

**Address alignment:** Left-aligned within its container. The container itself is centered in the card.

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmMehrabArchSmall` | Smaller mehrab variant for card headers. 3 cusps, pointed apex. | 120px wide x 36px tall | 1px `--hm-gold-deep` | none |
| `HmCalendarIcon` | Simple calendar outline: rectangle with 2 top pins, horizontal divider | 12px x 12px | 1.5px `--hm-gold-deep` | none |
| `HmClockIcon` | Circle with two hands (hour + minute) | 12px x 12px | 1.5px `--hm-gold-deep` | none |
| `HmScallopedCornice` | Reuse, gold variant | full-width x 18px | 1px `--hm-gold` | none |
| `HmLotusmedallion` | Reuse, 24px variant for transition zone | 24px diameter | 1px `--hm-gold` | none |

### 8. PNG/Image Assets and Placement

None. This section uses no raster images.

### 9. Decorative Elements

- **Card arch shimmer:** Each event card's mehrab arch has the gold shimmer CSS animation (background-position sweep, 5s ease-in-out infinite). Only active while the card is in the viewport. Paused when out of view.
- **Optional visual rest rule:** If 7+ events, a subtle gold rule (1px, 60px wide, centered) between every 3rd and 4th card as a visual rest point.
- Bottom scalloped cornice with single-pass shimmer on first viewport entry.
- Lotus medallion in the transition zone (static).

### 10. Element Positions

All elements in normal flow. No absolute positioning inside event cards (the arch sits on the card border via a small negative margin-top).

```
Section container:  position: relative;
Content (heading, rule, cards):  position: relative; normal flex flow.
Card arch:          position: relative; margin-top: -18px; (arch overlaps top border)
Bottom cornice:     position: absolute; bottom: 0; left: 0; width: 100%;
Transition lotus:   position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%);
                    (sits in the gradient bleed zone)
```

### 11. Layering Order (z-index)

```
z-auto  Section background (solid --hm-ivory)
z-1     Content (heading, rule, cards in flex flow)
z-2     Card arch (sits on top of card border)
z-3     Bottom scalloped cornice
z-4     Transition lotus (in the bleed zone)
```

### 12. Entry Animation

**Card arch shimmer only.** No content entry animations. Cards are visible as soon as they scroll into view. The shimmer on each card's arch is the only motion:
- CSS animation: `background-position` 100% 0 to -100% 0, 5s ease-in-out infinite.
- Applied to the arch SVG stroke (or a gradient mask over it).
- Paused when the card is out of viewport (IntersectionObserver, `animation-play-state`).

**`prefers-reduced-motion: reduce`:** No shimmer. Static `--hm-gold-deep` arch stroke.

### 13. Scroll Behavior

None. Cards scroll naturally as a vertical stack. No parallax, no sticky elements, no scroll-linked transforms.

**Dynamic event count behavior:**
- 1 event: extra 96px vertical padding (top and bottom) so the section has presence.
- 2-3 events: standard 64px padding, 24px between cards.
- 4-6 events: same as 2-3. Section simply grows taller.
- 7-10+: same vertical stack. Optional 60px gold rule between every 3rd and 4th card.
- NEVER a horizontal carousel, grid, or tabbed interface. Always a vertical stack.

### 14. Exit Transition

1. **Scalloped cornice border** in `--hm-gold` (#D4A055), 18px tall, full width.
2. **Lotus medallion** centered at 12px below the cornice, 24px diameter, `--hm-gold` (#D4A055). Static.
3. **48px gradient bleed zone** below the cornice (and around the lotus). Gradient transitions from `--hm-ivory` (#F5EDE0) into `--hm-night` (#0B1620) — the RSVP section's dark background.

### 15. Mobile Composition

Same as desktop. Event cards at 354px (or 338px with 8px inset) fit cleanly within the 402px viewport. Action buttons are side-by-side at 44px min height each. If button text is very long, they may stack vertically with 8px gap — use `flex-wrap: wrap` on the button container.

---

## Section 5: RSVP

### 1. Purpose

The guest confirms their attendance. This is the action section — focused, minimal, and direct. The dark background creates intimacy, as if the host is personally asking the guest to come. One clear question: will you be there?

### 2. Visual Concept

A quiet, dark antechamber. The night sky returns, barely textured with the faintest jali pattern. A mehrab arch frames the form like a palace doorway — the guest steps through it to confirm their place at the celebration. The form inputs are clean underlines (no boxes), referencing the scored lines on carved stone. Gold appears in the submit button and form focus states. The section is visually quiet to keep attention on the form.

### 3. Layout and Composition

```
Container: width: 100%; background: var(--hm-gradient-sky);
           padding: 64px 24px;
           display: flex; flex-direction: column; align-items: center;
           text-align: center;
           position: relative;

Vertical flow:
  [64px top padding]
  [Section heading: "RSVP"]
  [8px gap]
  [Short gold rule — 80px wide, 1px, centered]
  [16px gap]
  [Invitation message — 1-2 lines, italic]
  [40px gap]
  [Form container (mehrab-framed):]
    [Mehrab arch at top — 200px wide x 48px tall, centered]
    [Form fields inside:]
      [Guest Name input]
      [24px gap]
      [Number of Guests input]
      [24px gap]
      [Attendance toggle: "Joyfully Accept" / "Respectfully Decline"]
      [24px gap]
      [Message textarea (optional)]
      [32px gap]
      [Submit button — full width]
    [24px bottom padding inside form]
    [Form container bottom border]
  [64px bottom padding]
```

**Form container:**
```
Width: 338px (content max minus 8px each side)
Padding: 32px horizontal, 28px vertical (below the arch)
Background: rgba(11,22,32,0.60) — slightly lighter than section bg
Border: 1px solid rgba(212,160,85,0.15) on left, right, bottom
Border-top: none (defined by the arch)
Mehrab arch: centered at the top, sitting on the container's top edge
```

### 4. Background Artwork

- **Background gradient:** `--hm-gradient-sky` — `linear-gradient(180deg, #060E15 0%, #0B1620 100%)`.
- **Jali pattern overlay:** 3% opacity, `--hm-gold` (#D4A055). Very subtle — barely perceptible. Adds atmospheric depth without competing with form content.

### 5. Foreground Artwork

1. **Short gold rule:** 80px wide, 1px tall, centered below heading. Color: `--hm-gold` (#D4A055).
2. **Mehrab arch (form frame):** 200px wide x 48px tall, centered at top of form container. Stroke: `--hm-gold` (#D4A055) at 1.5px.
3. **Form container border:** 1px solid `--hm-gold` (#D4A055) at 15% opacity on left, right, and bottom edges.
4. **Scalloped cornice border (bottom):** Full-width, 18px, `--hm-gold` (#D4A055).

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height | Extra |
|---------|------|------|--------|-------|----------------|-----------|-------------|-------|
| Section heading | Cinzel Decorative | 22px | 700 | `--hm-marble` (#FAF7F2) | 0.06em | uppercase | 1.25 | — |
| Invitation message | Cormorant Garamond | 16px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | italic |
| Form labels | Cormorant SC | 13px | 500 | `--hm-ember` (#C4956A) | 0.06em | none | 1.4 | Above each input, 4px gap |
| Input text | Cormorant Garamond | 16px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | — |
| Placeholder text | Cormorant Garamond | 16px | 400 | `--hm-ember` (#C4956A) at 60% opacity | 0.01em | none | 1.6 | — |
| Toggle text (unselected) | Cormorant SC | 13px | 600 | `--hm-ivory` (#F5EDE0) | 0.06em | none | 1.4 | — |
| Toggle text (selected) | Cormorant SC | 13px | 600 | `--hm-deep-brown` (#2A1F1A) | 0.06em | none | 1.4 | — |
| Submit button | Cormorant SC | 14px | 600 | `--hm-deep-brown` (#2A1F1A) | 0.08em | none | 1.4 | — |
| Confirmation heading | Cinzel Decorative | 20px | 700 | `--hm-gold-bright` (#E8B86D) | 0.04em | none | 1.25 | e.g. "Thank You" |
| Confirmation text | Cormorant Garamond | 16px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | italic |

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmMehrabArch` | Reuse, medium variant for form frame | 200px wide x 48px tall | 1.5px `--hm-gold` | none |
| `HmLotusmedallion` | For confirmation state, 24px variant | 24px diameter | 1px `--hm-gold-bright` | none |
| `HmScallopedCornice` | Reuse, gold variant | full-width x 18px | 1px `--hm-gold` | none |
| `HmJaliPattern` | Reuse, 3% opacity | tile: 40px x 46px | 1px `--hm-gold` | none |

### 8. PNG/Image Assets and Placement

None.

### 9. Decorative Elements

- The jali pattern overlay at 3% opacity.
- The mehrab arch framing the form.
- The subtle form container border.
- The bottom scalloped cornice with single-pass shimmer on first viewport entry.

### 10. Element Positions

```
Section container:      position: relative;
Jali overlay:           position: absolute; inset: 0; z-index: 1; opacity: 0.03;
Content wrapper:        position: relative; z-index: 5; (flex column)
Form container:         position: relative; (contains arch, inputs, button)
Form arch:              position: relative; margin-top: -24px; (overlaps container top)
Bottom cornice:         position: absolute; bottom: 0; left: 0; width: 100%; z-index: 6;
```

### 11. Layering Order (z-index)

```
z-auto  Background gradient (CSS on section)
z-1     Jali pattern overlay (full section, 3% gold)
z-5     Content wrapper (heading, message, form container)
z-6     Bottom scalloped cornice
```

### 12. Entry Animation

**Mehrab arch draw-on:** When the RSVP section first enters the viewport (IntersectionObserver, threshold 0.3), the form's mehrab arch animates its `stroke-dashoffset` from full path length to 0 over 800ms ease-out. Runs once. GSAP inside `gsap.context()`.

**Form focus transitions (CSS only, not entry animation per se):**
- Input bottom border: `transition: border-color 200ms ease`.
- Unfocused: 1px solid `--hm-gold` (#D4A055) at 40%.
- Focused: 1px solid `--hm-gold-bright` (#E8B86D) at 100%.
- Label above focused input: `transition: color 200ms ease` to `--hm-gold-bright`.

**Attendance toggle:** When selected, background `transition: background-color 200ms ease` from transparent to `--hm-gold` (#D4A055), text `transition: color 200ms ease` from `--hm-ivory` to `--hm-deep-brown`.

**Submit button states:**
- Default: background `--hm-gold` (#D4A055), text `--hm-deep-brown` (#2A1F1A).
- Hover: background `--hm-gold-bright` (#E8B86D).
- Active: background `--hm-gold-deep` (#B8892E).
- Focus ring: 2px solid `--hm-marble` (#FAF7F2), 2px offset.
- Height: 48px. Full width of form container. Border-radius: 2px.

**Confirmation animation (GSAP, after successful submit):**
1. Form fields: `opacity: 1` to `0`, 400ms, stagger 50ms between fields. GSAP timeline.
2. After fields hidden: confirmation content fades in `opacity: 0` to `1`, 500ms. Contains:
   - Lotus medallion (24px, `--hm-gold-bright`)
   - 16px gap
   - "Thank You" in Cinzel Decorative 20px, `--hm-gold-bright`
   - 8px gap
   - Confirmation text in Cormorant Garamond 16px italic, `--hm-ivory`

**`prefers-reduced-motion: reduce`:** Arch is pre-drawn. CSS transitions set to `transition: none`. Confirmation is an instant swap (opacity toggles immediately, no stagger).

### 13. Scroll Behavior

None. The form scrolls naturally with the page. No sticky form, no scroll-linked transforms.

### 14. Exit Transition

1. **Scalloped cornice border** in `--hm-gold` (#D4A055), 18px tall, full width.
2. **No gradient bleed.** Both RSVP and Closing sections are dark. The transition is a continuous dark sky with only the cornice marking the boundary. The Closing section's jali overlay is slightly denser (4% vs 3%) and the background switches from `--hm-gradient-sky` to `--hm-gradient-night-vignette` — a subtle shift in the radial gradient that the guest feels but does not consciously notice.

### 15. Mobile Composition

Same as desktop. The form container at 338px fits within the 402px viewport. Attendance toggle options are side-by-side, each getting roughly half the container width minus gaps (approximately 145px each). If text is long, the toggles can wrap to a stacked layout using `flex-wrap: wrap`.

---

## Section 6: Closing

### 1. Purpose

The farewell. The guest returns to the palace under the stars. A closing message of warmth and gratitude, a quieter echo of the couple's names, and a final lotus medallion. This completes the circle that opened with the Welcome section. The mood is reflective, quiet, and grateful.

### 2. Visual Concept

Stepping back out through the final palace doorway into the night. The same deep sky from the Welcome section returns, with the same twinkling stars (but fewer — the night is quieter now). A mehrab arch frames the closing message, softer than the Welcome arch (60% opacity instead of full). The couple's names appear again but smaller — a whispered echo of the hero introduction. A final lotus sits like a carved finial at the top, marking the culmination. Then silence. The `DesignedByFooter` sits at the very bottom, barely visible.

### 3. Layout and Composition

```
Container: width: 100%; background: var(--hm-gradient-night-vignette);
           padding: 64px 24px 24px 24px;
           display: flex; flex-direction: column; align-items: center;
           text-align: center;
           position: relative;

Vertical flow:
  [64px top padding]
  [Lotus Medallion — 32px diameter]
  [24px gap]
  [Gold cornice line — 1px, 100px wide, centered]
  [24px gap]
  [Mehrab Arch Frame (softer) wrapping:]
    [Closing message text — 3-5 lines, italic]
  [40px gap]
  [Couple names block:]
    [Groom's Name — smaller than Welcome]
    [8px gap]
    [Ampersand]
    [8px gap]
    [Bride's Name — smaller than Welcome]
  [40px gap]
  [Hashtag / tagline]
  [64px gap]
  [DesignedByFooter component — 60% opacity]
  [24px bottom padding]
```

### 4. Background Artwork

- **Background gradient:** `--hm-gradient-night-vignette` — `radial-gradient(ellipse at 50% 30%, #0B1620 0%, #060E15 100%)`. Same vignette as the Welcome section.
- **Jali pattern overlay:** 4% opacity, `--hm-gold` (#D4A055). Slightly denser than RSVP (3%) to signal a new space.
- **Optional ghost palace:** If performance allows, the video poster frame (illuminated palace) can appear at 8-10% opacity as a CSS background-image behind the vignette gradient. This creates a faint ghost of the palace — a bookend to the Welcome. If this adds more than 50KB or causes repaint issues, omit it. The gradient and jali alone are sufficient.

### 5. Foreground Artwork

1. **Lotus medallion (top):** 32px diameter — the largest lotus in the template. Color: `--hm-gold-bright` (#E8B86D). Static. This is the culminating punctuation mark.
2. **Gold cornice line:** 100px wide, 1px tall, centered. Color: `--hm-gold` (#D4A055) at 40% opacity. Shorter and lighter than other section rules — this is a whisper, not a declaration.
3. **Mehrab arch frame (soft):** 300px wide x 160px tall, `--hm-gold` (#D4A055) at 60% opacity (softer than the Welcome arch at 100%). 1.5px stroke. Frames only the closing message text.
4. **No bottom cornice.** This is the terminal section. The scroll ends here. No divider needed at the bottom.

### 6. Typography

| Element | Font | Size | Weight | Color | Letter-Spacing | Transform | Line-Height | Extra |
|---------|------|------|--------|-------|----------------|-----------|-------------|-------|
| Closing message | Cormorant Garamond | 18px | 400 | `--hm-ivory` (#F5EDE0) | 0.01em | none | 1.6 | italic, max-width: 300px |
| Groom's name | Cinzel Decorative | 24px | 700 | `--hm-marble` (#FAF7F2) | 0.08em | uppercase | 1.2 | Smaller than Welcome (24px vs 32px) |
| Ampersand | Cormorant Garamond | 18px | 400 | `--hm-gold-bright` (#E8B86D) | 0 | none | 1.3 | italic |
| Bride's name | Cinzel Decorative | 24px | 700 | `--hm-marble` (#FAF7F2) | 0.08em | uppercase | 1.2 | Smaller than Welcome (24px vs 32px) |
| Hashtag/tagline | Cormorant SC | 13px | 500 | `--hm-gold` (#D4A055) | 0.08em | none | 1.4 | e.g. "#ForeverTogether" |
| DesignedByFooter | (component's own styles) | — | — | — | — | — | — | Container at 60% opacity |

### 7. SVG Elements Needed

| SVG | Description | Dimensions | Stroke | Fill |
|-----|-------------|------------|--------|------|
| `HmLotusmedallion` | Reuse, 32px variant (largest) | 32px diameter | 1px `--hm-gold-bright` | none |
| `HmMehrabArch` | Reuse, large variant at reduced opacity | 300px wide x 160px tall | 1.5px `--hm-gold` at 60% opacity | `--hm-gold` at 2% opacity (optional faint fill) |
| `HmJaliPattern` | Reuse, 4% opacity | tile: 40px x 46px | 1px `--hm-gold` | none |

### 8. PNG/Image Assets and Placement

| Asset | Description | Placement | Size | Loading |
|-------|-------------|-----------|------|---------|
| `hawa-mahal-poster.webp` (optional) | Same poster from Welcome section, reused | CSS background-image at 8-10% opacity, behind the gradient vignette | Already loaded (if cached from Welcome) | `loading="lazy"` |

### 9. Decorative Elements

- **Twinkling stars (reprise):** 12 small circular `<div>` elements, 3-4px diameter. Color: `--hm-ember` (#C4956A). Positioned randomly in the upper 50% of the section (wider distribution than Welcome because this section is shorter). Same CSS twinkle animation as Welcome — opacity between 0.1 and 0.7, randomized 2.5-5s duration and 0-4s delay. Fewer stars than Welcome (12 vs 15) for a quieter mood.
- **Gold cornice line** (described above).
- The larger 32px lotus at the top.

### 10. Element Positions

```
Section container:      position: relative; overflow: hidden;
Jali overlay:           position: absolute; inset: 0; z-index: 1; opacity: 0.04;
Optional ghost palace:  position: absolute; inset: 0; z-index: 0; opacity: 0.08-0.10;
                        background-image: url(poster); background-size: cover;
Stars container:        position: absolute; inset: 0; z-index: 2; pointer-events: none;
Content wrapper:        position: relative; z-index: 5; (flex column)
DesignedByFooter:       position: relative; z-index: 5; opacity: 0.6;
```

### 11. Layering Order (z-index)

```
z-0     Ghost palace image (optional, 8-10% opacity)
z-auto  Background gradient (CSS on section)
z-1     Jali pattern overlay (4% gold)
z-2     Stars container
z-5     Content wrapper (lotus, cornice line, arch, message, names, hashtag, footer)
```

### 12. Entry Animation

**Mehrab arch draw-on:** When the Closing section first enters the viewport (IntersectionObserver, threshold 0.3), the arch animates its `stroke-dashoffset` from full path length to 0 over 800ms ease-out. Runs once. GSAP inside `gsap.context()`.

**Stars:** Begin their CSS twinkle animation as soon as the section is in the viewport (managed by `animation-play-state` via the IntersectionObserver data attribute system).

**`prefers-reduced-motion: reduce`:** Arch is pre-drawn. Stars are static at `opacity: 0.4`. No animation.

### 13. Scroll Behavior

- **Stars pause off-viewport:** Same mechanism as Welcome section. `data-hm-paused` attribute toggles `animation-play-state`.
- No other scroll-linked behavior. Content scrolls naturally to the end.

### 14. Exit Transition

**None.** This is the terminal section. The scroll ends here. There is no section after it. The `DesignedByFooter` sits at the very bottom with 24px padding below it. The background simply extends to the bottom of the section. No cornice, no gradient bleed.

### 15. Mobile Composition

Same as desktop. The 300px max-width on the closing message and the 24px names fit comfortably within the 354px content area.

---

## Section Transitions — Summary Table

| From | To | Cornice Color | Gradient Bleed | Lotus in Zone | Bleed Colors |
|------|----|---------------|----------------|---------------|--------------|
| Welcome | Family | `--hm-gold` 100% | Yes, 48px | No | `#0B1620` to `#F0DDD0` |
| Family | Countdown | `--hm-sandstone` 50% | Yes, 48px | No | `#F0DDD0` to `#0B1620` |
| Countdown | Celebrations | `--hm-gold` 100% | Yes, 48px | No | `#0B1620` to `#F5EDE0` |
| Celebrations | RSVP | `--hm-gold` 100% | Yes, 48px | Yes, 24px `--hm-gold` | `#F5EDE0` to `#0B1620` |
| RSVP | Closing | `--hm-gold` 100% | No (same dark tone) | No | Both dark — subtle shift only |
| Closing | (end) | None | None | None | Terminal |

### Transition Implementation

Each 48px gradient bleed zone is implemented as a pseudo-element (or separate `<div>`) at the bottom of the outgoing section:

```css
.hm-section-bleed {
  position: absolute;
  bottom: -48px; /* extends past the section boundary */
  left: 0;
  width: 100%;
  height: 48px;
  background: linear-gradient(180deg, {outgoing-color} 0%, {incoming-color} 100%);
  z-index: 0;
  pointer-events: none;
}
```

The scalloped cornice sits at `bottom: 0` of the outgoing section, at the top of the bleed zone. The bleed zone extends 48px below the section into the space where the next section begins.

---

## Animation Inventory — Complete

| # | Element | Section | Type | Engine | Duration | Repeat | Reduced Motion |
|---|---------|---------|------|--------|----------|--------|----------------|
| 1 | Video playback | Welcome | Video | Native | 10s | Once | Plays (or poster) |
| 2 | Video fade-out | Welcome | Opacity | GSAP | 1200ms | Once | Instant |
| 3 | Content overlay fade-in | Welcome | Opacity | GSAP | 800ms | Once | Instant |
| 4 | Lotus fade-in | Welcome | Opacity | GSAP | 600ms | Once | Instant |
| 5 | Cornice line fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 6 | Welcome label fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 7 | Mehrab arch draw-on | Welcome | stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 8 | Couple names fade-in | Welcome | Opacity | GSAP | 600ms | Once | Instant |
| 9 | Welcome text fade-in | Welcome | Opacity | GSAP | 500ms | Once | Instant |
| 10 | Date fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 11 | Scroll indicator fade-in | Welcome | Opacity | GSAP | 500ms | Once | Instant |
| 12 | Scroll indicator float | Welcome | translateX + opacity | CSS | 3s | Infinite | Static opacity 0.8 |
| 13 | Scroll indicator fade-on-scroll | Welcome | Opacity (scrub) | GSAP ScrollTrigger | 5% scroll | Continuous | None |
| 14 | Twinkling stars (Welcome) | Welcome | Opacity | CSS | 2.5-5s each | Infinite | Static 0.4 |
| 15 | Countdown digit swap | Countdown | Opacity | GSAP | 300ms | Per update | Instant swap |
| 16 | Jali glow pulse | Countdown | Opacity | CSS | 6s | Infinite | Static 0.06 |
| 17 | Card arch shimmer | Celebrations | background-position | CSS | 5s | Infinite | Static gold |
| 18 | Cornice enter shimmer (x5) | All dividers | background-position | GSAP | 1.5s | Once each | Static gold |
| 19 | RSVP arch draw-on | RSVP | stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 20 | RSVP confirmation | RSVP | Opacity (stagger) | GSAP | 400-500ms | Once | Instant swap |
| 21 | Closing arch draw-on | Closing | stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 22 | Twinkling stars (Closing) | Closing | Opacity | CSS | 2.5-5s each | Infinite | Static 0.4 |

**Max concurrent animated elements per viewport:**
- Welcome: 15 stars + 1 scroll indicator = 16 (stars at limit; reduce to 14 if strict)
- Countdown: 1 jali band + up to 4 digit transitions = 5
- Celebrations: 1-2 visible card shimmers = 2
- RSVP: 0 ambient (only CSS transitions on interaction)
- Closing: 12 stars = 12

---

## SVG Component Inventory

| Component Name | Variants | Used In | Parametric |
|---------------|----------|---------|------------|
| `HmMehrabArch` | Large (320x180), Medium (200x48), Small (120x36), Closing (300x160) | Welcome, Celebrations, RSVP, Closing | Width, height, cusp count, stroke color, stroke opacity, fill opacity |
| `HmLotusmedallion` | 24px, 28px, 32px | Welcome, Family, Countdown, Celebrations, Closing | Size, stroke color |
| `HmScallopedCornice` | Gold full, Gold 50%, Sandstone 50% | All section boundaries | Width (full), stroke color, stroke opacity |
| `HmJaliPattern` | Gold tile, Teal tile | Welcome, Countdown, RSVP, Closing | Stroke color (gold or teal) |
| `HmCalendarIcon` | Single | Celebrations | — |
| `HmClockIcon` | Single | Celebrations | — |

All SVGs are inline (no external files loaded at runtime). Total SVG payload: approximately 5-8KB across all components.

---

## Scroll Journey — Emotional Arc

```
Section 1: Welcome .......... GRANDEUR
  Night falls. The palace lights up. Fireworks celebrate. The couple's
  names are revealed in carved stone. This is the invitation arriving.

    [Gold cornice + gradient bleed: night to warm sandstone]

Section 2: Family ........... WARMTH
  A warm sandstone chamber. The families are introduced with quiet
  dignity. Lotus divider between the two sides. Clean, still, respectful.

    [Sandstone cornice + gradient bleed: warm to night]

Section 3: Countdown ........ ANTICIPATION
  A night-sky vault overhead. The countdown ticks in golden numerals
  behind a teal-glow jali screen. The wedding date glows below.
  Time is moving toward the celebration.

    [Gold cornice + gradient bleed: night to ivory]

Section 4: Celebrations ..... JOY
  The brightest chamber. Warm ivory walls, event cards mounted like
  royal proclamation plaques. Each event is a carved arch with
  practical details. The section grows to hold any number of events.

    [Gold cornice + lotus + gradient bleed: ivory to night]

Section 5: RSVP ............. INVITATION
  A quiet dark antechamber. A mehrab doorway frames the question:
  will you be there? Clean underline inputs on the dark surface.
  Gold submit button waits.

    [Gold cornice only — same dark tone continues]

Section 6: Closing .......... GRATITUDE
  Back under the stars. Fewer stars, quieter names, softer arch.
  A final lotus crowns the farewell. The night sky extends to the
  bottom of the scroll. The palace celebration is complete.
```

---

## Design Decisions Resolved in This Storyboard

1. **Scroll indicator uses horizontal float (translateX), not vertical (translateY)** — to comply with the no-fade-up/translateY rule.
2. **Section 2 (Family) has zero animations** — intentional restraint for a section of dignity.
3. **Stars count: 15 in Welcome, 12 in Closing** — Welcome is the grand reveal, Closing is the quiet goodbye.
4. **Card arch shimmer cycle is 5s** (not the 4s from the design bible) — slowed to reduce visual noise when multiple cards are visible.
5. **Ghost palace image in Closing is optional** — implemented only if it adds no more than 50KB and causes no repaint issues.
6. **Only the Celebrations-to-RSVP transition has a lotus in the gradient bleed zone** — not every transition gets one. 2-3 was the guidance; 1 is used for restraint.
7. **RSVP-to-Closing has no gradient bleed** — both sections are dark. Only a cornice and a subtle jali density shift differentiate them.
8. **Event cards use 354px width (full content area)** rather than the 338px inset option — for maximum information space.
9. **Closing names are 24px** (Welcome is 32px) — the closing echo is quieter, 75% the size.
10. **The closing arch is at 60% opacity** — softer than the Welcome arch at 100%. This creates the "fading memory" quality of the farewell.

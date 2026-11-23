# Hawa Mahal — Design Bible

## Overall Concept

**One-line:** An invitation that arrives at nightfall and unveils a palace celebration in golden light.

**Experience description:** The Hawa Mahal template recreates the experience of approaching a Rajasthani palace as evening falls. The guest opens the invitation and sees the palace facade in near-darkness — then watches it come alive: golden uplighting sweeps floor by floor, fireworks burst overhead, and the building settles into a serene glow under twinkling stars. That final illuminated frame becomes the threshold into the invitation proper. From here, each scroll section is a different chamber of the palace — warm sandstone interiors alternating with deep night-sky vaults — until the guest has traversed the entire celebration and arrives back under the open sky at the closing. Gold is the continuous thread: it lines every border, marks every heading, and connects each space to the next. The palette never touches cold white or pure black. Every surface carries the warmth of fired sandstone and hand-polished brass.

This is a premium Rajasthani Royal wedding invitation. It should feel like receiving a summons to a palace celebration — dignified, warm, and unhurried.

---

## Color System

### Foundation Palette

All colors are derived from the reference video's observed values and the authentic Hawa Mahal sandstone / meenakari craft tradition.

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--hm-night` | `#0B1620` | Dark primary | Night sky backgrounds, deep sections |
| `--hm-night-deep` | `#060E15` | Darkest tone | Top-of-sky gradient terminus, deepest shadows |
| `--hm-sandstone` | `#C4836A` | Identity color | The lit Hawa Mahal facade — section backgrounds, warm surfaces |
| `--hm-sandstone-light` | `#D4A07A` | Light sandstone | Lighter surface areas, hover states, highlighted cards |
| `--hm-sandstone-pale` | `#F0DDD0` | Pale wash | Very light backgrounds, card surfaces on dark sections |
| `--hm-sandstone-shadow` | `#6E4A3A` | Shadow sandstone | Muted recessed areas, inactive text on warm backgrounds |
| `--hm-gold` | `#D4A055` | Primary gold | Borders, dividers, decorative lines, accent elements |
| `--hm-gold-bright` | `#E8B86D` | Bright gold | Active highlights, headings on dark backgrounds, icons |
| `--hm-gold-deep` | `#B8892E` | Deep gold | Text on light backgrounds, pressed states, mature accents |
| `--hm-teal` | `#2A4540` | Accent teal | Jali-glow accents, interactive states, links |
| `--hm-teal-light` | `#3D5C52` | Light teal | Hover state for teal elements, secondary accent |
| `--hm-ivory` | `#F5EDE0` | Warm white | Body text on dark backgrounds, card surfaces |
| `--hm-marble` | `#FAF7F2` | Lightest warm | Emphasis text on the darkest backgrounds |
| `--hm-deep-brown` | `#2A1F1A` | Near-black | Body text on light backgrounds, shadows |
| `--hm-ember` | `#C4956A` | Warm mid-tone | Subdued accents, meta text, secondary decorative elements |

### Section Color Assignments

| Section | Background | Text Primary | Text Secondary | Accents | Decorative |
|---------|-----------|--------------|----------------|---------|------------|
| Welcome (post-video) | `--hm-night` | `--hm-marble` | `--hm-ivory` | `--hm-gold-bright` | `--hm-gold` borders |
| Family Details | `--hm-sandstone-pale` | `--hm-deep-brown` | `--hm-sandstone-shadow` | `--hm-gold` | `--hm-sandstone` borders |
| Countdown | `--hm-night` | `--hm-gold-bright` | `--hm-ivory` | `--hm-gold` | `--hm-teal` glow accents |
| Celebrations | `--hm-ivory` | `--hm-deep-brown` | `--hm-sandstone-shadow` | `--hm-gold-deep` | `--hm-sandstone` card borders |
| RSVP | `--hm-night-deep` to `--hm-night` gradient | `--hm-ivory` | `--hm-ember` | `--hm-gold` | `--hm-teal` form focus |
| Closing | `--hm-night` | `--hm-marble` | `--hm-ivory` | `--hm-gold-bright` | `--hm-gold` borders |

### Gradient Definitions

These are the only gradients permitted. No generic radial glows or "AI-looking" ambient washes.

```
--hm-gradient-sky: linear-gradient(180deg, #060E15 0%, #0B1620 100%);
--hm-gradient-sky-to-sandstone: linear-gradient(180deg, #0B1620 0%, #2A1F1A 40%, #6E4A3A 100%);
--hm-gradient-sandstone-warmth: linear-gradient(180deg, #F0DDD0 0%, #F5EDE0 100%);
--hm-gradient-night-vignette: radial-gradient(ellipse at 50% 30%, #0B1620 0%, #060E15 100%);
```

### Color Rules

1. **No `#FFFFFF`** — use `--hm-marble` (`#FAF7F2`) or `--hm-ivory` (`#F5EDE0`).
2. **No `#000000`** — use `--hm-deep-brown` (`#2A1F1A`) or `--hm-night-deep` (`#060E15`).
3. **Gold must appear in every section** — as borders, text accents, dividers, or decorative elements. It is the unifying thread.
4. **Dark sections use warm near-blacks**, never cool/blue-tinted blacks.
5. **Light sections use warm off-whites**, never clinical cool whites.
6. **Teal is reserved** — it appears only as jali-glow accents, link states, and form focus rings. Never as a background or large surface.
7. **No meenakari red, green, or blue** as surface colors. These are documented in the cultural research but this template's identity is sandstone + gold + night sky. The meenakari colors belong to a different template direction.
8. **Contrast minimums** — all text/background combinations must achieve WCAG AA (4.5:1 for body, 3:1 for large text). The warm palette requires careful checking:
   - `--hm-marble` on `--hm-night`: 13.8:1 (passes)
   - `--hm-ivory` on `--hm-night`: 11.9:1 (passes)
   - `--hm-gold-bright` on `--hm-night`: 7.4:1 (passes)
   - `--hm-deep-brown` on `--hm-ivory`: 10.2:1 (passes)
   - `--hm-deep-brown` on `--hm-sandstone-pale`: 8.1:1 (passes)
   - `--hm-gold-deep` on `--hm-ivory`: 4.6:1 (passes AA)

---

## Typography System

### Typeface Selection

| Role | Font | Google Fonts Name | Weights | Rationale |
|------|------|-------------------|---------|-----------|
| Display | Cinzel Decorative | `Cinzel+Decorative` | 700 (Bold) | Inscriptional Roman capitals with decorative flourishes that echo carved-stone epigraphy on Rajasthani palace facades. The decorative variant is distinctive — it avoids the default plain Cinzel seen on generic "elegant" templates. |
| Body | Cormorant Garamond | `Cormorant+Garamond` | 400 (Regular), 500 (Medium), 600 (SemiBold) | High-contrast oldstyle serif whose thin strokes reference the delicacy of jali lattice carving. Calligraphic structure pairs naturally with Cinzel's Roman formality. |
| Accent | Cormorant SC | `Cormorant+SC` | 500 (Medium), 600 (SemiBold) | Small-caps variant of the body face. Used for labels, section tags, and metadata. Keeps the type system to one family plus the display face — no third wheel. |

### Font Loading

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+SC:wght@500;600&display=swap');
```

The template manages its own fonts. It does NOT use the shared `SiteFonts` wrapper.

### Type Scale (Mobile — 402px base)

| Element | Font | Size | Weight | Line-Height | Letter-Spacing | Transform |
|---------|------|------|--------|-------------|----------------|-----------|
| Couple names (hero) | Cinzel Decorative | 32px | 700 | 1.2 | 0.08em | uppercase |
| Section heading | Cinzel Decorative | 22px | 700 | 1.25 | 0.06em | uppercase |
| Sub-heading | Cormorant Garamond | 20px | 600 | 1.3 | 0.02em | none |
| Body large | Cormorant Garamond | 18px | 400 | 1.6 | 0.01em | none |
| Body | Cormorant Garamond | 16px | 400 | 1.6 | 0.01em | none |
| Label / tag | Cormorant SC | 13px | 600 | 1.4 | 0.1em | none (already small-caps) |
| Meta / caption | Cormorant Garamond | 14px | 400 | 1.5 | 0.02em | none |
| Countdown digits | Cinzel Decorative | 40px | 700 | 1.0 | 0.04em | none |
| Countdown unit label | Cormorant SC | 11px | 500 | 1.3 | 0.12em | none |

### Type Scale Adjustments (Desktop / Large)

On viewports 768px+, the template is displayed inside the `InvitationViewport` portrait frame (402 x 874). The type scale remains identical — the viewport constrains the width, so sizes do not need desktop scaling.

### Typography Rules

1. **Cinzel Decorative is for names and section headings only.** Never for body text, labels, or long passages. It is the carved-stone voice.
2. **Cormorant Garamond is the workhorse.** All descriptions, details, addresses, messages.
3. **Cormorant SC is for metadata and categorization.** Event types, date labels, section tags. Never for body copy.
4. **No italic Cinzel Decorative** — the font does not have an italic variant. Do not fake-italicize it.
5. **Italic Cormorant Garamond** (weight 400) is permitted for emphasis within body text and for the welcome/closing messages.
6. **All text is center-aligned** unless it is an address block or multi-line event details (those are left-aligned within their container, but the container is centered).
7. **Line length**: body text containers should not exceed 340px on mobile (402px base minus gutters). This keeps lines under 70 characters at 16px.
8. **No text-shadow for readability** — if text needs legibility over an image, use a semi-transparent overlay behind the text, not text-shadow.

---

## Materials & Textures

### Sandstone Texture

The lit sandstone of Hawa Mahal is the template's defining surface treatment. It appears as:

- **Section backgrounds** on warm sections (Family, Celebrations): a flat warm tone (`--hm-sandstone-pale` or `--hm-ivory`) — NOT a photographic sandstone texture. The warmth comes from the color choice, not from a noisy image overlay.
- **Subtle grain** (optional): a CSS noise pattern at 2-3% opacity over warm section backgrounds, if the flat color feels too clinical. This uses a tiny inline SVG filter, not an image asset.

```css
.hm-sandstone-surface {
  background-color: var(--hm-sandstone-pale);
  /* Optional subtle grain — remove if too much */
  filter: url("data:image/svg+xml,...#noise");
}
```

The sandstone feeling comes primarily from the warm color temperature, not from literal texture. Restraint here.

### Gold Treatment

Gold is the connective thread through the entire invitation. It appears in three forms:

1. **Solid gold lines** — borders, dividers, decorative rules. 1px solid `--hm-gold` or 2px for emphasis.
2. **Gold text** — headings and accent text on dark backgrounds use `--hm-gold-bright`. Labels on light backgrounds use `--hm-gold-deep`.
3. **Gold shimmer** (CSS only) — a subtle horizontal shimmer effect on key decorative gold lines, implemented as a CSS animation on a linear-gradient background. Applied sparingly: only on the primary section divider lines, not on every gold element.

```css
.hm-gold-shimmer {
  background: linear-gradient(
    90deg,
    var(--hm-gold) 0%,
    var(--hm-gold-bright) 45%,
    #F5E0B5 50%,
    var(--hm-gold-bright) 55%,
    var(--hm-gold) 100%
  );
  background-size: 200% 100%;
  animation: hm-shimmer 4s ease-in-out infinite;
}

@keyframes hm-shimmer {
  0%, 100% { background-position: 100% 0; }
  50% { background-position: -100% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hm-gold-shimmer {
    animation: none;
    background: var(--hm-gold);
    background-size: 100% 100%;
  }
}
```

**Rules for gold:**
- Gold borders are 1px. Never heavier than 2px. Thick gold borders look cheap.
- Gold text is only for headings and emphasis. Never for body copy.
- The shimmer effect runs on at most 3 elements visible at any time.
- No gold gradients as section backgrounds. Gold is a line, a word, a border — never a surface.

### Jali Pattern

The honeycomb jali lattice screen is Hawa Mahal's signature pattern. It is used as:

1. **Low-opacity overlay** on dark sections — the hexagonal grid at 4-6% opacity over `--hm-night` backgrounds creates depth without distraction. The pattern is rendered as an inline SVG `<pattern>` tile.
2. **Section border accent** — a narrow band (24-32px tall) of the jali pattern at 10-15% opacity placed at the top or bottom edge of a section, functioning as an architectural cornice.
3. **Decorative strip behind the countdown** — the countdown section uses a horizontal band of the jali pattern behind the timer digits, tinted with `--hm-teal` at low opacity to reference the backlit window glow from the video.

**Jali pattern rules:**
- Never higher than 15% opacity. The pattern is atmospheric, not prominent.
- On dark backgrounds, the jali pattern is rendered in `--hm-gold` at 4-6% opacity.
- On light backgrounds, the jali pattern is rendered in `--hm-sandstone` at 5-8% opacity.
- The tile size is 40px hexagons on mobile. Each hexagon has a 1px stroke, no fill.
- The pattern must not interfere with text readability. Text areas may have a solid-color backing over the pattern.

### Depth and Layering

The template uses a restrained depth system to create the feeling of architectural space:

1. **Base layer**: solid section background color.
2. **Texture layer**: jali pattern overlay (where specified) at low opacity.
3. **Content layer**: text and interactive elements on a clear reading surface.
4. **Decorative layer**: architectural frames (arches, borders) at the edges and transitions.

No drop shadows. No box-shadow blur effects. Depth is communicated through color value changes (dark behind light) and overlapping architectural frames, the way real Rajasthani architecture creates depth through projection and recession — jharokhas projecting forward, walls receding behind.

The one exception: event cards in the Celebrations section may use a very subtle `box-shadow: 0 2px 12px rgba(42, 31, 26, 0.08)` to lift cards from the surface. This is the only permitted shadow in the entire template.

---

## Decorative Language

### Primary Motifs

The template uses exactly four architectural motifs. Each has a defined role and placement. No other motifs are introduced.

#### 1. Mehrab Arch (Primary Frame)

The multi-cusped pointed arch — the characteristic arch form of Rajasthani palace architecture. Scalloped inner edge with 5-7 cusps and a pointed apex.

**Usage:**
- Frames the couple's names on the Welcome section
- Frames each celebration event card header
- Used as the top edge of the RSVP form container
- Available as a standalone SVG component: `HmMehrabArch.svg`

**Rules:**
- The arch stroke is 1.5px in `--hm-gold`.
- The arch may optionally have a very faint fill of `--hm-gold` at 3% opacity.
- The arch always points upward. Never inverted.
- Never more than 2 visible arch frames per viewport height.

#### 2. Jali Honeycomb (Texture Pattern)

The hexagonal lattice screen pattern, as described in the Materials section.

**Usage:**
- Background texture overlay on dark sections
- Narrow cornice bands at section boundaries
- Accent strip behind the countdown timer

**Rules:**
- See the Jali Pattern section above for opacity and sizing rules.
- The pattern is always geometric and regular. No organic distortion.

#### 3. Scalloped Cornice Border (Section Divider)

A repeating horizontal band of scalloped arcs — the decorative cornice ledge that separates each tier of the Hawa Mahal.

**Usage:**
- Primary section divider between all sections
- Rendered as a horizontal SVG strip, 16-20px tall
- Stroke color: `--hm-gold` at full opacity for dark-to-light transitions, `--hm-sandstone` at 60% for light-to-light transitions

**Rules:**
- Each scallop is a semicircle, approximately 24px wide.
- The cornice has a 1px straight line at its top edge and the scalloped curve below.
- Scallops are evenly spaced to fill the container width. Partial scallops are allowed at edges (clipped).
- Optionally, a tiny finial dot (3px circle) sits at the apex of each scallop.

#### 4. Lotus Medallion (Punctuation Element)

A stylized lotus flower viewed from above — concentric rings of pointed petals radiating from a center dot.

**Usage:**
- Scroll indicator on the Welcome section (animated gentle pulse)
- Section spacer between the section heading and its content (static)
- Closing section: centered above the final message

**Rules:**
- The lotus is always centered horizontally.
- Size: 28-36px diameter on mobile.
- Color: `--hm-gold` on dark backgrounds, `--hm-gold-deep` on light backgrounds.
- The lotus is the scroll indicator motif — it replaces a generic "scroll down" arrow.
- When used as the scroll indicator, it has a gentle vertical oscillation (CSS animation, 3s ease-in-out infinite) and fades out when the user begins scrolling.

### Motifs NOT Used

These motifs were identified in the cultural research but are deliberately excluded from this template to maintain restraint:

- **Peacock**: Too illustrative and busy for this architectural-focused template.
- **Paisley**: Too associated with generic "Indian" design. This template's identity is architectural, not textile.
- **Elephant/camel**: Figurative elements would clash with the geometric architectural language.
- **Marigold garland**: Too orange/bright for the nighttime palette.
- **Gota patti border**: The gold border treatment references this craft implicitly, but literal gota patti patterns are too textile-focused.

The decorative restraint is intentional: the Hawa Mahal facade in the video is the star. The template's ornament language extends the palace's own decorative vocabulary (arches, lattice, cornices, lotus finials) rather than importing unrelated Rajasthani motifs.

---

## Section Continuity

### Visual Rhythm

The scroll journey alternates between dark (night sky) and warm (sandstone/ivory) sections in a deliberate rhythm:

```
DARK  — Welcome (night sky + palace)
WARM  — Family (sandstone pale / ivory)
DARK  — Countdown (night sky vault)
WARM  — Celebrations (ivory + sandstone cards)
DARK  — RSVP (night sky, focused)
DARK  — Closing (night sky + return to palace)
```

This alternation creates a visual rhythm that resembles moving through a palace: open courtyard (sky above) → enclosed chamber (warm stone walls) → courtyard → chamber → courtyard → final threshold.

### Transition Approach

Sections do NOT hard-cut from one color to the next. Each transition uses one of two approaches:

**1. Architectural cornice transition** — a scalloped cornice SVG border in `--hm-gold` marks the boundary between sections. The background color change happens at the cornice line. The cornice is the "floor/ceiling" of the architectural space.

**2. Gradient bleed** — for dark-to-warm transitions, the dark background `--hm-night` bleeds via gradient into `--hm-sandstone-shadow`, then the warm section begins. This creates a 40-60px zone where the colors merge, like light spilling from one room into a corridor. This uses `--hm-gradient-sky-to-sandstone` (or its reverse).

Every transition includes:
- A scalloped cornice border at the boundary (always present).
- A lotus medallion centered below the cornice on the entering section's side (optional, used on 2-3 transitions, not all).

### Background Treatment Progression

| Section | Background Treatment |
|---------|---------------------|
| Welcome | `--hm-gradient-night-vignette` + video final frame as poster image behind. Jali pattern overlay at 4% opacity. |
| Family | Solid `--hm-sandstone-pale` with optional subtle grain. Clean, bright reading surface. |
| Countdown | `--hm-gradient-sky` (deep night). Jali pattern overlay at 6% with `--hm-teal` tint behind the timer. |
| Celebrations | Solid `--hm-ivory`. Event cards have `--hm-sandstone-pale` surface. Cleanest section for information density. |
| RSVP | `--hm-gradient-sky` (night). Form container has `--hm-sandstone-pale` at 6% opacity border. Focused, minimal. |
| Closing | `--hm-gradient-night-vignette`. Returns to the opening mood. Jali overlay at 4%. |

---

## Interactive States

### Links and Tappable Elements

- Default: `--hm-teal-light` text
- Hover/focus: `--hm-gold-bright` text
- Active/pressed: `--hm-gold-deep` text
- Focus ring: 2px solid `--hm-teal-light`, 2px offset

### Buttons (RSVP submit, map links, calendar links)

- Background: `--hm-gold`
- Text: `--hm-deep-brown`
- Hover: `--hm-gold-bright` background
- Active: `--hm-gold-deep` background
- Focus: 2px solid `--hm-marble`, 2px offset
- Border-radius: 2px (barely rounded — echoing carved stone, not soft modern UI)
- Min height: 44px
- Min touch target: 44x44px

### Form Inputs (RSVP)

- Background: transparent
- Border-bottom: 1px solid `--hm-gold` at 40% opacity
- Focus border-bottom: 1px solid `--hm-gold-bright` at 100%
- Text: `--hm-ivory`
- Placeholder: `--hm-ember` at 60% opacity
- No border-radius. Underline-only inputs reference the clean lines of stone carving.

---

## Spacing System

Mobile base (402px viewport):

```
--hm-space-xs: 4px;
--hm-space-sm: 8px;
--hm-space-md: 16px;
--hm-space-lg: 24px;
--hm-space-xl: 40px;
--hm-space-2xl: 64px;
--hm-space-3xl: 96px;
--hm-gutter: 24px;        /* side padding on all sections */
--hm-section-pad: 64px;   /* vertical padding top/bottom of each section */
--hm-content-max: 354px;  /* 402 - 24*2 gutter */
```

### Spacing Rules

1. **Side gutters are always 24px** on mobile. Content never touches the screen edge.
2. **Section vertical padding is 64px** top and bottom. This creates breathing room between the cornice divider and the section content.
3. **Between major elements within a section**: 40px (`--hm-space-xl`).
4. **Between related elements** (heading and its description): 16px (`--hm-space-md`).
5. **Between tightly coupled elements** (label and its value): 8px (`--hm-space-sm`).
6. **No spacing value smaller than 4px** in the template.

---

## Root Element

```css
.hm-root {
  isolation: isolate;
  overflow-x: hidden;
  background-color: var(--hm-night);
  color: var(--hm-ivory);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

All template CSS is scoped under `.hm-root` or uses `hm-` prefixed class names. No global selectors, no `:root`, no `body`, no `html`, no `*` selectors.

# Muslim Couple Template -- Design Bible

## 1. Overall Concept

### Emotional Direction
A **romantic dream set in a Mughal paradise garden at golden hour**. The scroll experience feels like walking through an impossibly beautiful world where warm light touches everything, rose petals drift on marble, and the horizon glows with promise. This is not a formal announcement -- it is an intimate love letter wrapped in palatial grandeur.

### Narrative Metaphor
**"Walking toward the horizon together."** The reference video shows a couple walking away from the viewer through a Mughal terrace toward a sunset mosque. The invitation reverses this -- the guest scrolls *into* the scene, moving through the couple's world. Each section is a deeper threshold: the garden gate, the family gathering, the ticking anticipation, the celebration halls, the response, and the final blessing under an open sky.

### Narrative Arc of the Scroll
1. **Threshold** (Entry): A still garden awaits. Tap to enter. The world comes alive.
2. **Belonging** (Family): You meet the families who raised these two people.
3. **Anticipation** (Countdown): Time itself holds its breath before the sacred moment.
4. **Celebration** (Events): The many gatherings that weave this union together.
5. **Participation** (RSVP): Your presence completes the picture.
6. **Blessing** (Closing): A prayer lifts skyward. The garden stretches to infinity.

### Register
Sophisticated, warm, intimate. Never flashy or exuberant. The restraint of the blush-ivory palette and the slowness of every motion say: *this is precious, handle with care*. The cultural grounding is Indian Muslim -- Mughal, Lucknowi, Hyderabadi -- not generic Middle Eastern or pan-Islamic.

---

## 2. Color Palette

### Design Tokens (CSS Custom Properties)

All colors are defined as `--mc-*` variables on the template root element.

#### Primary Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--mc-ivory` | Warm Ivory | `#F5F0E8` | Primary background, marble surfaces, text containers |
| `--mc-champagne` | Blush Champagne | `#E8D5C0` | Secondary background, card surfaces, event cards |
| `--mc-gold` | Sunset Gold | `#D4A050` | Primary accent -- borders, headings, lantern glow, metallic details |
| `--mc-rose` | Soft Rose | `#F0B0C0` | Floral accents, decorative elements, section tints |
| `--mc-green` | Mughal Sage | `#5A7D5A` | Islamic identity accent -- Bismillah, subtle botanical marks |

#### Secondary Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--mc-gold-light` | Light Gold | `#E0CFA0` | Decorative lines, geometric pattern fills at low opacity |
| `--mc-gold-deep` | Deep Gold | `#C8A050` | Active states, focused elements, richer metallic moments |
| `--mc-rose-deep` | Dusty Rose | `#C87890` | Petal accents, small decorative marks, pressed states |
| `--mc-peach` | Sunset Peach | `#F5B78A` | Warm gradient stops, glow overlays |
| `--mc-amber` | Golden Amber | `#E8A84C` | Horizon glow, countdown number accents |
| `--mc-mauve` | Dusty Mauve | `#C0A0B0` | Mid-sky gradient, muted text on dark backgrounds |
| `--mc-sky` | Soft Sky | `#8BA6C7` | Upper gradient stop, water reflections, subtle cool contrast |

#### Neutral Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--mc-cream` | Cream Stone | `#EDE5D5` | Borders, dividers, subtle background variation |
| `--mc-offwhite` | Warm Off-White | `#FAF5EB` | Lightest surface, card backgrounds, text panel base |
| `--mc-beige` | Rose Beige | `#D8C0B0` | Muted surfaces, disabled states, secondary containers |
| `--mc-bronze` | Aged Bronze | `#8B6838` | Metallic accents, lantern frames, icon strokes |
| `--mc-marble` | Marble Floor | `#F0E8E0` | Textured surface backgrounds |

#### Text Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--mc-text-primary` | Deep Walnut | `#3A2818` | Primary body text, headings on light backgrounds |
| `--mc-text-secondary` | Warm Brown | `#6B5B4E` | Captions, secondary information, metadata |
| `--mc-text-muted` | Dusty Brown | `#8A7B6E` | Tertiary text, placeholder text, disabled labels |
| `--mc-text-on-dark` | Pearl Ivory | `#F5EDD6` | Text on dark/video overlays |
| `--mc-text-gold` | Gold Text | `#D4A050` | Headings on ivory, display text, accent labels |

#### Overlay & Shadow Colors
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--mc-shadow` | Warm Shadow | `rgba(58, 40, 24, 0.12)` | Card shadows, elevated surface shadows |
| `--mc-shadow-strong` | Deep Shadow | `rgba(58, 40, 24, 0.25)` | Overlay panels, modal backdrops |
| `--mc-overlay-warm` | Golden Veil | `rgba(212, 160, 80, 0.08)` | Warm tint overlay on sections |
| `--mc-overlay-dark` | Dark Scrim | `rgba(42, 30, 18, 0.40)` | Video overlay for text readability |

### Gradient Definitions

```css
/* Sunset Sky -- hero/entry background behind video, also closing section */
--mc-gradient-sky: linear-gradient(
  180deg,
  #7090B8 0%,      /* Soft blue zenith */
  #9BA8C0 18%,     /* Blue-grey */
  #C0A0B0 36%,     /* Dusty mauve */
  #E0A0A0 52%,     /* Salmon pink */
  #F0B888 70%,     /* Warm peach */
  #E8A050 88%,     /* Deep amber */
  #E8A84C 100%     /* Golden horizon */
);

/* Golden Glow -- warm vignette overlay on sections */
--mc-gradient-glow: radial-gradient(
  ellipse at 50% 30%,
  rgba(245, 240, 232, 0) 0%,
  rgba(232, 213, 192, 0.15) 50%,
  rgba(212, 160, 80, 0.08) 100%
);

/* Rose Tint -- floral section backgrounds */
--mc-gradient-rose: linear-gradient(
  180deg,
  rgba(240, 176, 192, 0.12) 0%,
  rgba(240, 176, 192, 0) 100%
);

/* Marble Surface -- section base with warm stone feel */
--mc-gradient-marble: linear-gradient(
  170deg,
  #FAF5EB 0%,
  #F5F0E8 40%,
  #F0E8E0 70%,
  #EDE5D5 100%
);

/* Frosted Glass -- buttons, music toggle, RSVP card */
--mc-glass: rgba(245, 240, 232, 0.65);
--mc-glass-blur: 12px;
--mc-glass-border: rgba(212, 160, 80, 0.25);
```

### Section-Specific Tone Map

| Section | Background | Dominant Tone | Notes |
|---------|-----------|---------------|-------|
| Entry (Welcome) | Video fills viewport; sunset sky gradient behind poster | Warm amber, blush | Video dictates; overlay is `--mc-overlay-dark` at 35% |
| Family | `--mc-gradient-marble` | Ivory, cream, gold | Clean marble feel; gold borders frame family blocks |
| Countdown | `--mc-champagne` base with `--mc-gradient-glow` overlay | Champagne, amber | Warmest section -- golden hour peak |
| Celebrations | `--mc-offwhite` base | Off-white, gold, rose | Cleanest section; individual cards carry color |
| RSVP | `--mc-ivory` with rose tint overlay | Ivory, soft rose | Gentle, inviting warmth |
| Closing | `--mc-gradient-sky` (full sunset) | Sky blue to gold | Returns to the entry's atmospheric grandeur |

---

## 3. Typography System

### Font Stack

| Role | Font Family | Google Fonts | Weights | Fallback |
|------|-----------|-------------|---------|----------|
| **Display** (couple names) | Cormorant Garamond | `Cormorant+Garamond:wght@300;400;500;600` | 300, 400 | Georgia, 'Times New Roman', serif |
| **Heading** (section titles) | Cormorant Garamond | (same load) | 400, 500 | Georgia, 'Times New Roman', serif |
| **Body** (details, descriptions) | Lato | `Lato:wght@300;400;700` | 300, 400 | -apple-system, 'Segoe UI', sans-serif |
| **Arabic/Urdu** (Bismillah, Quranic verse) | Amiri | `Amiri:wght@400;700` | 400, 700 | 'Times New Roman', serif |
| **Accent script** (romantic labels, sparingly) | Great Vibes | `Great+Vibes` | 400 | cursive |

### Why These Fonts

- **Cormorant Garamond** at light weight has the high-contrast, calligraphic terminals that echo the flowing elegance of Nastaliq calligraphy without being a script font. Its vertical proportions feel tall and stately, matching the pointed Mughal arches in the reference video. At 300 weight it is airy and romantic; at 500 it is authoritative for headings.
- **Lato** at 300-400 is warm, humanist, and excellent at small sizes. Its rounded terminals complement Cormorant's sharp ones without competing.
- **Amiri** is a high-quality Naskh typeface with classical beauty, appropriate for the Bismillah and any Quranic verse. It renders cleanly at display sizes.
- **Great Vibes** is used only for 1-2 accent moments (e.g., "Together with their families" or an "&" between names). Never for body text.

### Type Scale

Base: `16px` on body. All sizes in rem for accessibility scaling.

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--mc-font-display` | `2.5rem` (40px) | 300 | 1.15 | `0.02em` | Couple names on entry screen |
| `--mc-font-h1` | `1.75rem` (28px) | 400 | 1.25 | `0.015em` | Section titles |
| `--mc-font-h2` | `1.375rem` (22px) | 500 | 1.3 | `0.01em` | Subsection headings, event names |
| `--mc-font-h3` | `1.125rem` (18px) | 500 | 1.35 | `0.01em` | Card titles, family member roles |
| `--mc-font-body` | `0.9375rem` (15px) | 400 | 1.6 | `0` | Body text, descriptions, venue details |
| `--mc-font-body-light` | `0.9375rem` (15px) | 300 | 1.6 | `0.005em` | Secondary body text, lighter feel |
| `--mc-font-caption` | `0.8125rem` (13px) | 400 | 1.5 | `0.01em` | Captions, timestamps, metadata |
| `--mc-font-small` | `0.75rem` (12px) | 400 | 1.5 | `0.015em` | Fine print, "Maps" / "Calendar" links |
| `--mc-font-arabic` | `1.5rem` (24px) | 400 | 1.7 | `0` | Bismillah, Quranic verse |
| `--mc-font-arabic-lg` | `1.875rem` (30px) | 400 | 1.6 | `0` | Large Bismillah at top of invitation |
| `--mc-font-accent` | `1.25rem` (20px) | 400 | 1.4 | `0` | Great Vibes accent labels |
| `--mc-font-countdown` | `3rem` (48px) | 300 | 1 | `-0.02em` | Countdown numbers (Cormorant Garamond) |

### Typography Rules

1. **Couple names** always use Cormorant Garamond 300. Names are the largest text element on the entire invitation.
2. **Bismillah** is always Amiri, always `--mc-text-gold` on light backgrounds or `--mc-text-on-dark` on dark backgrounds. It sits at the top of the content flow (first element after the entry screen) with generous vertical breathing room.
3. **Section titles** are Cormorant Garamond 400, centered, with a gold decorative rule or ornament below them (never above).
4. **Body text** is left-aligned within its container (not centered) for readability, unless the text block is a single line or label.
5. **Gold text** (`--mc-text-gold`) is used only for display text (names, section titles, Bismillah, accent labels) -- never for body text. Body text uses `--mc-text-primary` or `--mc-text-secondary`.
6. **Line length**: body text containers max out at `38ch` (approximately 65 characters for Lato at 15px). Section titles can span wider.
7. **Arabic text** is always `direction: rtl; text-align: center`. The Amiri font is loaded only when the section containing it enters the viewport (lazy font strategy).
8. **No all-caps anywhere** in the invitation. This is a formal, intimate document -- all-caps reads as shouting.

---

## 4. Materials & Textures

### Marble
The dominant surface. Warm ivory-to-cream marble with the faintest veining (no bold grey-black veins). Achieved with CSS:
```css
/* Marble base */
background: var(--mc-ivory);
/* Optional subtle veining via repeating linear gradient at very low opacity */
background-image:
  repeating-linear-gradient(
    137deg,
    transparent,
    transparent 180px,
    rgba(224, 216, 208, 0.3) 180px,
    rgba(224, 216, 208, 0.3) 181px,
    transparent 181px,
    transparent 400px
  );
```
Used for: section backgrounds (Family, RSVP), card surfaces, container panels.

### Gold Leaf
Flat gold color (not a metallic gradient) for borders, lines, and text. The gold feels like burnished metal leaf, not shiny chrome. It is warm, slightly matte, with depth coming from contrast with surrounding ivory rather than from the gold itself.

- Borders: `1px solid var(--mc-gold)` with occasional `2px` for emphasis
- Decorative lines: `height: 1px; background: linear-gradient(90deg, transparent 0%, var(--mc-gold) 20%, var(--mc-gold) 80%, transparent 100%)`
- Text: `color: var(--mc-text-gold)` -- never a gradient or shimmer on text

### Frosted Glass
For interactive elements (tap-to-open button, music toggle, RSVP submit button) and floating UI:
```css
background: var(--mc-glass);
backdrop-filter: blur(var(--mc-glass-blur));
-webkit-backdrop-filter: blur(var(--mc-glass-blur));
border: 1px solid var(--mc-glass-border);
border-radius: 12px;
```
The frosted glass should feel like looking through a carved marble jali screen -- warm, not cold/tech.

### Silk / Fabric
Not a literal texture. The *feeling* of silk comes from generous padding, smooth transitions, and the way text breathes inside containers. Event cards and family containers have `padding: 24px 20px` minimum, rounded corners (`border-radius: 16px`), and soft shadows (`box-shadow: 0 4px 20px var(--mc-shadow)`). The overall impression is of cream silk laid over marble.

### Warm Haze
The golden-hour atmosphere is a persistent warm tint that prevents any section from feeling cold. Every section has either:
- A warm background color (ivory, champagne, cream), or
- A `--mc-gradient-glow` overlay that adds subtle warmth to the center of the viewport

---

## 5. Decorative Language

### Primary Vocabulary

These are the ornamental elements that repeat throughout the invitation, creating a cohesive visual language. Each is an SVG asset produced during asset production.

#### 1. Mughal Pointed Arch (Ogee Arch)
The signature framing element. A pointed arch with the distinctive S-curve (ogee) profile of Mughal architecture. Used as:
- Section header frame (arch crowns the section title)
- Card container shape (arch silhouette behind event cards)
- Border corner ornament (quarter-arch in corners)

Drawn in `--mc-gold` stroke (`1.5px`) or `--mc-gold-light` fill at 15% opacity for backgrounds.

#### 2. Islamic Geometric Star Pattern
An 8-pointed star (octagram) tessellation -- the Rub el Hizb pattern. Used as:
- Background texture at 5-8% opacity on section backgrounds
- Decorative band/strip as a horizontal section divider (a single row of stars)
- Fill pattern inside arch spandrels (the triangular spaces beside an arch)

Drawn as SVG tile, repeating via `background-image` with `background-size: 80px 80px`.

#### 3. Jali Lattice Screen
Interlocking geometric cutout pattern inspired by the balustrade in the reference video. Used as:
- Horizontal divider between sections (a narrow band of jali pattern)
- Background overlay on the Countdown section (faint, 4-6% opacity)
- Decorative edge along the top or bottom of cards

Drawn in `--mc-cream` on `--mc-ivory` backgrounds (tone-on-tone subtlety).

#### 4. Arabesque Scrollwork
Flowing vine tendrils with split palmette leaves -- the organic counterpart to the geometric patterns. Used as:
- Corner ornaments on the Family and RSVP sections (top-left and bottom-right mirrored)
- Decorative flourish under section titles (small, centered, horizontal)
- Frame embellishment around the Bismillah

Drawn in `--mc-gold` or `--mc-gold-light`.

#### 5. Floral Garlands
Dense arrangements of roses (pink, white) with green foliage, directly from the video's cascading flower canopy. Used as:
- Top-of-section decoration (curved garland draping from corners or center)
- Corner frames on the Entry screen (framing the video)
- Transition overlays between sections (partial garland fading at edges)

Produced as WebP/PNG assets with transparency. Colors: `--mc-rose`, white, `--mc-green`.

#### 6. Lanterns
Mughal/Moroccan box-shaped lanterns with amber glow. The most whimsical recurring element. Used as:
- Section markers (small lantern icon beside section titles)
- Celebration card accents (lantern at top-right corner of event cards)
- Ambient floating elements (gentle sway animation in Countdown and Closing sections)
- Footer decoration (row of lanterns)

Drawn as SVG: bronze frame `--mc-bronze`, amber glow `--mc-gold`, with a CSS `radial-gradient` glow behind them (`--mc-gold` at 20% opacity, 40px spread).

#### 7. Rose Petals
Individual petals in dusty rose, deep pink, and soft blush. The ground texture of the marble terrace. Used as:
- Scattered decoration on section backgrounds (SVG elements positioned pseudo-randomly)
- Ambient floating particles (max 8-10 per section, slow drift)
- Section transition accents (a few petals at the boundary between sections)

4-6 distinct petal shapes as SVGs, each rotated differently. Colors: `--mc-rose-deep`, `--mc-rose`, `#D4A0A8`.

#### 8. Crescent Moon (Standalone)
A slim waxing crescent -- not combined with a star (per cultural direction: crescent-and-star is political). Used sparingly:
- Once in the Closing section (crescent in the sky above the mosque silhouette)
- Optionally as a section marker accent

Drawn in `--mc-gold`.

#### 9. Mosque Silhouette
A simplified outline of a mosque with a central dome and two minarets, referencing the video's background focal point. Used as:
- Closing section background element (large, centered, `--mc-gold-light` at 10% opacity)
- Possibly as a small icon beside the Nikah event in Celebrations

Drawn as clean SVG silhouette.

#### 10. Bismillah Calligraphy
Arabic calligraphy of "Bismillahir Rahmanir Rahim" in the Amiri font. This is the spiritual anchor, not a decorative element. It sits:
- At the very top of the scrollable content (first thing after entry screen transitions out)
- Centered, with arabesque ornaments flanking it
- `--mc-text-gold` color
- Generous whitespace above and below (min `40px` top, `32px` bottom)

### Ornament Hierarchy
| Level | Where | What |
|-------|-------|------|
| **Hero ornament** | Entry screen corners, Closing background | Full floral garlands, mosque silhouette |
| **Section ornament** | Section titles, transitions | Arch frame, arabesque flourish, jali divider |
| **Card ornament** | Event cards, family containers | Corner arabesques, lantern icon, gold border |
| **Ambient ornament** | Floating in sections | Rose petals, sparkles, lantern glow |
| **Micro ornament** | Inline with text | Gold dot separators, small petal marks |

---

## 6. Depth & Lighting

### Layering System

The template uses a consistent 4-layer depth system, inspired by the reference video's foreground-to-background layering:

| Layer | Z-Index Range | Contents | Scroll Speed |
|-------|--------------|----------|--------------|
| **Foreground** | 30-40 | Floral garland overlays, floating petals, entry screen UI | Fastest (1.0x) |
| **Content** | 10-20 | All text, cards, forms, interactive elements | Normal (1.0x, no parallax) |
| **Mid-ground** | 5-9 | Decorative ornaments (arabesque corners, lanterns, jali patterns) | Slight offset (0.95x) |
| **Background** | 1-4 | Section backgrounds, geometric pattern textures, mosque silhouette | Slowest (0.9x) |

Note: parallax multipliers are subtle (0.02-0.05 difference from content). Content never moves at a different speed than the scroll -- only decorative layers shift.

### Shadow Treatment

Shadows are always warm-toned, never blue-grey.

```css
/* Elevation 1: Subtle lift (cards, containers) */
box-shadow: 0 2px 12px var(--mc-shadow);

/* Elevation 2: Medium lift (floating elements, modals) */
box-shadow: 0 4px 24px var(--mc-shadow), 0 1px 4px var(--mc-shadow);

/* Elevation 3: High lift (entry screen button, active states) */
box-shadow: 0 8px 32px var(--mc-shadow-strong), 0 2px 8px var(--mc-shadow);
```

No `filter: drop-shadow()` on SVG ornaments -- they should feel flat and graphic, not photo-realistic.

### Glow Effects

Glow is used sparingly to suggest lantern light and golden-hour warmth.

```css
/* Lantern glow: applied behind lantern SVGs */
.mc-lantern-glow {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(212, 160, 80, 0.25) 0%,
    rgba(212, 160, 80, 0.08) 50%,
    transparent 70%
  );
  pointer-events: none;
}

/* Sparkle glow: applied to four-pointed star SVGs */
.mc-sparkle {
  filter: blur(0.5px);
  opacity: 0.7;
}
```

### Golden Hour Lighting Philosophy

Every visual decision reinforces the warm golden-hour atmosphere:
1. **No cool whites**: The lightest color is `#FAF5EB` (warm off-white), never `#FFFFFF`.
2. **Warm shadows**: All shadows use brown-based RGBA, not black-based.
3. **Gold connectors**: Every section has at least one gold element (border, text, ornament) that ties it to the warm palette.
4. **Gradient direction**: Vertical gradients go warm-at-bottom (ground/horizon) to cooler-at-top (sky). This mimics sunset lighting where warmth rises from the horizon.
5. **Atmospheric perspective**: Background decorative elements are more muted/lower opacity than foreground ones, creating depth through desaturation (matching the video's atmospheric haze on the distant mosque).

---

## 7. Section Continuity

### How Sections Flow

The invitation is one continuous vertical scroll with no hard breaks between sections. Sections blend into each other through these techniques:

#### Technique 1: Gradient Bleed
Each section's background color subtly transitions into the next. The bottom 60px of one section and the top 60px of the next share a blended gradient:
```css
/* Applied to the bottom of a section */
.mc-section-fade-out::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, [next-section-bg-color]);
  pointer-events: none;
}
```

#### Technique 2: Ornamental Bridge
Between certain sections, a decorative element spans the boundary -- a jali lattice strip, a horizontal garland, or a pair of arabesque flourishes that mirror across the section divide. This element belongs to neither section but bridges them.

#### Technique 3: Shared Ground Motif
Rose petals and geometric patterns can begin in the bottom of one section and continue into the top of the next, creating visual continuity. A few scattered petals near the bottom of the Family section appear to have "drifted" into the top of the Countdown section.

### Section Transition Map

| From | To | Transition Device |
|------|-----|-------------------|
| Entry (video) | Family | Hard transition: video fades to white, scroll begins on ivory. A horizontal gold line + Bismillah marks the true beginning. |
| Family | Countdown | Gradient bleed from ivory to champagne. A horizontal jali lattice strip spans the boundary. |
| Countdown | Celebrations | Gradient bleed from champagne to off-white. A pair of mirrored arabesque flourishes. |
| Celebrations | RSVP | Gradient bleed from off-white to ivory+rose-tint. A thin garland drape across the divide. |
| RSVP | Closing | Gradient bleed from rose-tinted ivory to full sunset sky gradient. A mosque silhouette begins to emerge in the background as the sky gradient takes over. |

### Vertical Rhythm

Consistent vertical spacing creates the "breathing" rhythm of the scroll:

| Token | Value | Usage |
|-------|-------|-------|
| `--mc-section-pad-top` | `56px` | Top padding of each section |
| `--mc-section-pad-bottom` | `64px` | Bottom padding (slightly more to accommodate fade overlap) |
| `--mc-block-gap` | `32px` | Space between major content blocks within a section |
| `--mc-element-gap` | `16px` | Space between related elements (label + value, icon + text) |
| `--mc-card-gap` | `24px` | Space between cards in a list |
| `--mc-ornament-margin` | `24px` | Space between ornamental dividers and adjacent content |

---

## 8. Spacing & Layout Tokens

### Base Grid

Mobile-first at `402px` base width (phone preview). All layout math works within this constraint.

| Token | Value | Usage |
|-------|-------|-------|
| `--mc-gutter` | `24px` | Left/right page gutter (safe text area) |
| `--mc-content-width` | `calc(100% - 48px)` | Effective content width = 354px at 402px viewport |
| `--mc-card-radius` | `16px` | Border radius for cards, containers, images |
| `--mc-button-radius` | `12px` | Border radius for buttons |
| `--mc-pill-radius` | `24px` | Border radius for pill-shaped elements (tags, badges) |
| `--mc-icon-size` | `24px` | Default icon size |
| `--mc-icon-size-sm` | `18px` | Small icons (inline with text) |
| `--mc-touch-target` | `44px` | Minimum touch target size per accessibility |

### Z-Index Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--mc-z-bg` | `1` | Background patterns, textures |
| `--mc-z-decor` | `5` | Decorative ornaments, mid-ground elements |
| `--mc-z-content` | `10` | Text, cards, interactive elements |
| `--mc-z-overlay` | `30` | Floating petals, garland overlays |
| `--mc-z-ui` | `40` | Music button, scroll indicator, sticky UI |
| `--mc-z-modal` | `50` | Modal overlays, entry screen |

---

## 9. CSS Architecture

### Root Scoping

```css
.mc-root {
  isolation: isolate;
  /* All custom properties defined here */
  --mc-ivory: #F5F0E8;
  --mc-champagne: #E8D5C0;
  /* ... all tokens from sections above ... */
}
```

### Class Naming Convention

All classes prefixed `mc-`:
- `mc-section-*` -- section wrappers (e.g., `mc-section-family`, `mc-section-countdown`)
- `mc-card-*` -- card components (e.g., `mc-card-event`, `mc-card-family`)
- `mc-text-*` -- text elements (e.g., `mc-text-names`, `mc-text-bismillah`)
- `mc-decor-*` -- decorative elements (e.g., `mc-decor-arch`, `mc-decor-petal`)
- `mc-anim-*` -- animation-specific classes (e.g., `mc-anim-float`, `mc-anim-glow`)
- `mc-ui-*` -- interactive UI elements (e.g., `mc-ui-music-btn`, `mc-ui-scroll-indicator`)
- `mc-layout-*` -- layout helpers (e.g., `mc-layout-center`, `mc-layout-stack`)

### Forbidden Selectors
- No `body`, `html`, `*`, `:root` selectors
- No `!important` on properties that could leak
- No global `@import` statements
- No bare element selectors (`p`, `h1`, `button`) -- always scoped under `.mc-root`

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .mc-root * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
  .mc-decor-petal,
  .mc-decor-sparkle,
  .mc-anim-float {
    display: none;
  }
  /* Show static layout with all content visible */
}
```

---

## 10. Interaction & Motion Principles

### Animation Timing

All animations use slow, gentle timing:

| Context | Duration | Easing |
|---------|----------|--------|
| Text appearance (stagger) | `1000ms` per element | `power2.out` |
| UI element appearance | `600-800ms` | `power2.out` |
| Card entrance | `800ms` | `power2.out` |
| Ambient float (petals, lanterns) | `4000-8000ms` per cycle | `sine.inOut` |
| Sparkle pulse | `2000-3000ms` per cycle | `sine.inOut` |
| Section background transition | `1200ms` | `power1.inOut` |
| Button press feedback | `150ms` | `power2.out` |
| Scroll indicator fade | `400ms` | `power1.out` |

### Prohibited Animations (per Master Rules)
- No `translateY` reveal animations (breaks drag-and-drop in editor)
- No animation on `width`, `height`, `top`, `left`, `margin`, `padding`
- No continuous `requestAnimationFrame` loops for static content
- No `setInterval` for animation timing
- No uncontrolled animations (all must be killable on unmount)

### Permitted Animations
- `opacity` changes (fade in/out)
- `transform: scale()` changes (grow/shrink)
- `transform: translateX()` for horizontal movement (e.g., petals drifting)
- `transform: rotate()` for gentle rotation (e.g., petals tumbling)
- CSS `background-position` animation for shimmer effects
- GSAP-controlled scroll-triggered appearances (using `opacity` and `scale` only)
- GSAP `MotionPathPlugin` for curved floating paths

### Entry Screen Text Overlay
Per Master Rules, the couple names + date fade in **per-word** on top of the still-playing video:
- Stagger: `0.35s` between words
- Duration: `1s` per word
- Motion: `y: 20 -> 0` (this specific translateY is allowed per the Entry Screen Pattern in Master Rules)
- The last word finishes `1 second` before video ends
- Triggered via `timeupdate` event on the video element

---

## 11. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG AA 4.5:1 on its background. Gold text on ivory: `#D4A050` on `#F5F0E8` = 3.1:1 (use at display size only, where WCAG large text threshold applies at 18.66px bold or 24px regular -- our display text qualifies). Body text uses `--mc-text-primary` (#3A2818) which passes 4.5:1 on all light backgrounds. |
| Touch targets | All interactive elements minimum 44x44px per `--mc-touch-target` |
| Keyboard navigation | All interactive elements focusable with visible focus ring: `outline: 2px solid var(--mc-gold); outline-offset: 2px` |
| Reduced motion | Full static layout per reduced-motion media query |
| Screen reader | Decorative elements have `aria-hidden="true"`. Structural headings form a logical hierarchy. Bismillah has `lang="ar"` attribute. |
| Font scaling | All sizes in rem. Layout does not break at 200% zoom. |

---

## 12. Brand Mark

There is no brand logo for this template. The "brand" is the combination of:
- Cormorant Garamond display type
- Sunset Gold accent color
- Mughal arch silhouette framing
- Scattered rose petals

These four elements together create instant recognition across all sections.

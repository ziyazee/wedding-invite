# Ivory Nikah — Design Bible

Complete visual identity specification for the Ivory Nikah template. Every value in this document is the single source of truth for implementation. No value should be assumed or improvised.

---

## 1. CSS Custom Property Tokens

All tokens are prefixed `--in-` (ivory-nikah). Declare on `.ivory-nikah` root container.

### 1.1 Color Tokens

```css
/* --- Palette Core --- */
--in-ivory:              #F5EDD6;   /* Primary surface — marble, cards, doors */
--in-cream:              #FAF7F0;   /* Page background — soft warm white */
--in-gold:               #C9A84C;   /* Metallic accent — trim, knockers, dividers */
--in-sage:               #8A9A7B;   /* Botanical — leaves, subtle accents */
--in-brown-deep:         #3D2B1F;   /* Text primary — headings, names, body */
--in-brown-warm:         #6B5B4E;   /* Text secondary — dates, descriptions, captions */
--in-gold-light:         #E0CFA0;   /* Decorative borders — subtle framing lines */

/* --- Extended Palette --- */
--in-champagne:          #D5BD91;   /* Gold-adjacent warm tone — gradient endpoints */
--in-cream-bright:       #FFFDF7;   /* Highlight — raised carved surface catch-light */
--in-petal-white:        #EDE5D5;   /* Jasmine petal tone — warmer than marble */
--in-shadow:             #2A1D14;   /* Deep recess shadow — arch interior, depth */
--in-gold-gradient-start:#C9A84C;   /* Burnished gold gradient — left/top */
--in-gold-gradient-end:  #D5BD91;   /* Burnished gold gradient — right/bottom */

/* --- Functional Aliases --- */
--in-bg-page:            var(--in-cream);
--in-bg-section:         var(--in-ivory);
--in-bg-card:            var(--in-cream-bright);
--in-text-primary:       var(--in-brown-deep);
--in-text-secondary:     var(--in-brown-warm);
--in-accent:             var(--in-gold);
--in-border:             var(--in-gold-light);
--in-border-subtle:      rgba(192, 168, 76, 0.15);  /* Gold at 15% for hairlines */
```

### 1.2 Typography Tokens

```css
/* --- Font Families --- */
--in-font-display:       'Playfair Display', Georgia, 'Times New Roman', serif;
--in-font-heading:       'Cormorant Garamond', Garamond, 'Times New Roman', serif;
--in-font-body:          'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
--in-font-arabic:        'Amiri', 'Traditional Arabic', 'Noto Naskh Arabic', serif;

/* --- Font Sizes (clamp for fluid scaling: 402px min → 768px max) --- */
--in-size-names:         clamp(2.25rem, 5.5vw, 3.25rem);    /* 36px → 52px */
--in-size-bismillah:     clamp(1.75rem, 4.2vw, 2.5rem);     /* 28px → 40px */
--in-size-section-title: clamp(1.5rem, 3.5vw, 2rem);        /* 24px → 32px */
--in-size-subtitle:      clamp(1.125rem, 2.5vw, 1.375rem);  /* 18px → 22px */
--in-size-body:          clamp(0.9375rem, 2vw, 1.0625rem);   /* 15px → 17px */
--in-size-small:         clamp(0.8125rem, 1.8vw, 0.9375rem); /* 13px → 15px */
--in-size-label:         clamp(0.6875rem, 1.5vw, 0.8125rem); /* 11px → 13px */
--in-size-arabic-verse:  clamp(1.625rem, 4vw, 2.25rem);      /* 26px → 36px */
--in-size-arabic-small:  clamp(1.125rem, 2.8vw, 1.5rem);     /* 18px → 24px */

/* --- Font Weights --- */
--in-weight-display:     700;
--in-weight-heading:     600;
--in-weight-body:        400;
--in-weight-body-light:  300;
--in-weight-arabic:      400;

/* --- Letter Spacing --- */
--in-tracking-display:   0.06em;   /* Generous — matches carved stone spaciousness */
--in-tracking-heading:   0.04em;   /* Slightly open for elegance */
--in-tracking-body:      0.01em;   /* Near-normal for readability */
--in-tracking-label:     0.08em;   /* Wider for small text legibility */
--in-tracking-arabic:    0;        /* Arabic script: no added tracking */

/* --- Line Heights --- */
--in-leading-display:    1.15;     /* Tight for large names */
--in-leading-heading:    1.3;      /* Comfortable for section titles */
--in-leading-body:       1.65;     /* Generous for serif-adjacent body text */
--in-leading-arabic:     1.8;      /* Arabic needs more vertical space */
--in-leading-label:      1.4;      /* Compact for metadata */
```

### 1.3 Spacing Tokens

```css
/* --- Spacing Scale (8px base unit) --- */
--in-space-2xs:          4px;
--in-space-xs:           8px;
--in-space-sm:           12px;
--in-space-md:           16px;
--in-space-lg:           24px;
--in-space-xl:           32px;
--in-space-2xl:          48px;
--in-space-3xl:          64px;
--in-space-4xl:          80px;
--in-space-5xl:          96px;
--in-space-6xl:          120px;

/* --- Section Spacing --- */
--in-section-gap:        clamp(80px, 12vw, 120px);  /* Between sections */
--in-section-padding-y:  clamp(48px, 8vw, 80px);    /* Vertical padding within section */
--in-section-padding-x:  clamp(24px, 5vw, 40px);    /* Horizontal padding within section */

/* --- Content Layout --- */
--in-content-max-width:  420px;    /* Narrow column for elegant reading */
--in-content-wide-max:   520px;    /* For celebration cards row */
--in-container-max:      600px;    /* Outer container ceiling */
```

### 1.4 Effect Tokens

```css
/* --- Border Radii --- */
--in-radius-none:        0;
--in-radius-sm:          4px;
--in-radius-md:          8px;
--in-radius-lg:          16px;
--in-radius-arch:        50% 50% 0 0;   /* Mehrab arch top shape */

/* --- Shadows --- */
--in-shadow-carved:      inset 0 1px 3px rgba(61, 43, 31, 0.08);  /* Carved recess */
--in-shadow-raised:      0 2px 8px rgba(61, 43, 31, 0.06);        /* Raised surface */
--in-shadow-gold-glow:   0 0 20px rgba(201, 168, 76, 0.15);       /* Warm gold ambient */
--in-shadow-deep:        0 4px 24px rgba(42, 29, 20, 0.12);       /* Deep elevation */

/* --- Transitions --- */
--in-ease-elegant:       cubic-bezier(0.25, 0.1, 0.25, 1);
--in-ease-door-open:     cubic-bezier(0.16, 1, 0.3, 1);     /* Dramatic deceleration */
--in-duration-fast:      200ms;
--in-duration-normal:    400ms;
--in-duration-slow:      800ms;
--in-duration-cinematic: 2000ms;   /* Door-open sequence */

/* --- Opacity Levels --- */
--in-opacity-jali-bg:    0.04;     /* Jali lattice as background texture */
--in-opacity-marble-bg:  0.18;     /* Marble texture on content areas */
--in-opacity-vine-border:0.5;      /* Vine border decorative elements */
--in-opacity-petal:      0.7;      /* Floating petal peak opacity */
```

---

## 2. Typography System

### 2.1 Font Loading

Google Fonts import (display=swap for performance):

```
Playfair Display:wght@700
Cormorant Garamond:wght@400;600
Lato:wght@300;400
Amiri:wght@400
```

Four families, five weight variants total. Minimal payload.

### 2.2 Type Scale Application

| Element | Font | Size Token | Weight | Tracking | Leading | Color | Transform |
|---------|------|-----------|--------|----------|---------|-------|-----------|
| Couple names | Playfair Display | `--in-size-names` | 700 | 0.06em | 1.15 | `--in-brown-deep` | none |
| Bismillah | Amiri | `--in-size-bismillah` | 400 | 0 | 1.8 | `--in-brown-deep` | none |
| Section title | Cormorant Garamond | `--in-size-section-title` | 600 | 0.04em | 1.3 | `--in-brown-deep` | none |
| Subtitle / event name | Cormorant Garamond | `--in-size-subtitle` | 600 | 0.04em | 1.3 | `--in-brown-deep` | none |
| Body text | Lato | `--in-size-body` | 400 | 0.01em | 1.65 | `--in-brown-warm` | none |
| Light body / description | Lato | `--in-size-body` | 300 | 0.01em | 1.65 | `--in-brown-warm` | none |
| Small label | Lato | `--in-size-label` | 400 | 0.08em | 1.4 | `--in-brown-warm` | uppercase |
| Arabic verse | Amiri | `--in-size-arabic-verse` | 400 | 0 | 1.8 | `--in-brown-deep` | none |
| Arabic translation | Lato | `--in-size-small` | 300 | 0.01em | 1.65 | `--in-brown-warm` | italic |
| Countdown number | Playfair Display | clamp(2.5rem, 6vw, 3.5rem) | 700 | 0.02em | 1.1 | `--in-gold` | none |
| Countdown label | Lato | `--in-size-label` | 400 | 0.1em | 1.4 | `--in-brown-warm` | uppercase |

### 2.3 Text Alignment

All text is center-aligned, following the bilateral symmetry of the Mughal reference. No exceptions except:
- Event detail lines within celebration cards (date, time, venue) may be left-aligned within a centered card if the card width exceeds 300px.
- Arabic text is always center-aligned (not RTL-justified) because it serves as a decorative/spiritual element, not running prose.

### 2.4 Text Color Rules

- **Gold (`#C9A84C`) is never used for body text.** It fails WCAG contrast on both ivory and cream backgrounds. Gold is reserved for: divider lines, small decorative labels under 4 words (e.g., a date formatted as "12 . 06 . 2027"), icon accents, and border/trim elements.
- **Deep brown (`#3D2B1F`) for all primary readable text.** Contrast ratio on cream (#FAF7F0): 12.3:1. On ivory (#F5EDD6): 10.8:1. Both exceed AAA.
- **Warm brown (`#6B5B4E`) for secondary text.** Contrast on cream: 5.7:1. On ivory: 5.1:1. Exceeds AA for normal text, AA for large text.

---

## 3. Spacing & Rhythm

### 3.1 Vertical Rhythm

The template uses a flowing vertical scroll. Generous breathing room between sections is essential to the "palace walk" metaphor — the viewer is moving through grand rooms, not scanning a dense page.

| Between... | Spacing |
|-----------|---------|
| Sections | `--in-section-gap` (80-120px) |
| Section title and first content | `--in-space-xl` (32px) |
| Content paragraphs | `--in-space-lg` (24px) |
| Related content lines (e.g., date + time) | `--in-space-sm` (12px) |
| Decorative divider and surrounding content | `--in-space-2xl` (48px) above, `--in-space-2xl` (48px) below |
| Couple names and subtitle text below | `--in-space-md` (16px) |
| Arabic verse and its translation | `--in-space-md` (16px) |

### 3.2 Horizontal Layout

```
Container max:     600px (--in-container-max)
Content column:    420px (--in-content-max-width), centered
Side padding:      24px minimum (--in-section-padding-x on mobile)
```

Content sits in a narrow centered column within the container. Decorative elements (vine borders, corner ornaments, jali overlay) extend to the full container width or beyond, creating layers of visual depth around the narrow text column.

---

## 4. Background Treatments

### 4.1 Page Background

```css
.in-page {
  background-color: var(--in-cream);           /* #FAF7F0 base */
  background-image: url('marble-texture.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: soft-light;
  background-attachment: scroll;                /* Not fixed — performance */
}
```

The marble texture at 18% opacity over the cream base provides warmth without competing with content. `soft-light` blend mode pulls the golden veining through subtly.

### 4.2 Section Backgrounds (by type)

**Type A — Ivory Surface (Opening, Couple, Closing)**
```css
background: linear-gradient(
  180deg,
  rgba(245, 237, 214, 0.0) 0%,      /* Transparent at top edge */
  rgba(245, 237, 214, 0.6) 8%,       /* Fade in */
  rgba(245, 237, 214, 0.6) 92%,      /* Hold */
  rgba(245, 237, 214, 0.0) 100%      /* Fade out at bottom edge */
);
```
A semi-transparent ivory wash that floats over the marble page background, creating a "carved panel" feel without hard edges.

**Type B — Warm Glow (Dua/Blessing, RSVP)**
```css
background: radial-gradient(
  ellipse 80% 60% at 50% 40%,
  rgba(213, 189, 145, 0.12) 0%,       /* Champagne center glow */
  rgba(245, 237, 214, 0.4) 50%,       /* Ivory mid */
  rgba(250, 247, 240, 0.0) 100%       /* Transparent edge */
);
```
A subtle warm radial glow that draws the eye inward. Used for spiritually significant and action-oriented sections.

**Type C — Clear (Celebrations, Countdown)**
```css
background: transparent;
```
These sections rely on their card/element backgrounds for visual structure. The page marble texture shows through completely, grounding the content in the architectural space.

### 4.3 Jali Lattice Overlay

Applied as a pseudo-element on sections that benefit from geometric texture:

```css
.in-section--jali::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('jali-lattice.png');
  background-size: 200px 200px;          /* Tile size — small enough to read as texture */
  background-repeat: repeat;
  opacity: var(--in-opacity-jali-bg);     /* 0.04 — barely visible */
  pointer-events: none;
  z-index: 0;
}
```

Sections that receive jali overlay: Dua/Blessing, Countdown, RSVP. These are the sections where the Mughal architectural identity reinforces the moment (prayer, anticipation, response).

Sections that do NOT receive jali: Opening (doors dominate), Couple (clean for readability), Celebrations (cards provide structure), Closing (minimal, restful).

### 4.4 Gold Gradient Treatment

For decorative horizontal rules and card top-borders:

```css
.in-gold-rule {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(201, 168, 76, 0) 0%,
    rgba(201, 168, 76, 0.6) 20%,
    var(--in-gold) 50%,
    rgba(201, 168, 76, 0.6) 80%,
    rgba(201, 168, 76, 0) 100%
  );
  max-width: 280px;
  margin: 0 auto;
}
```

This tapered gold line echoes the burnished gold inlay from the reference — strongest at center, fading at edges.

---

## 5. Decorative Element Specifications

### 5.1 Arch Frame (`arch-frame.png`)

- **Usage:** Hero section framing element only. Appears once.
- **Sizing:** `width: 100%; max-width: var(--in-container-max); height: auto;`
- **Fit:** `object-fit: contain` within the viewport. On mobile (402px), the arch scales to fill width with side padding of 0. On desktop, it centers within the container.
- **Z-index:** Behind content text (`z-index: 1`), above page background (`z-index: 0`).
- **The arch interior (transparent alpha) is where couple names and Bismillah sit.** Content is absolutely positioned within the arch opening area.

### 5.2 Door Panels (`door-left.png` + CSS mirror)

- **Usage:** Opening animation only. Both doors visible at load, then animate apart.
- **Right door:** `door-left.png` with `transform: scaleX(-1)`.
- **Sizing:** Each door is 50% of the container width. Combined they cover the full arch opening.
- **Z-index:** Above all opening section content (`z-index: 10`) during closed state. Drop to `z-index: -1` or `display: none` after opening completes.
- **Will-change:** `transform` during animation, remove after.

### 5.3 Floral Vine Border (`floral-vine-border.png`)

- **Usage:** Vertical decorative borders flanking content in the Couple, Dua, and Closing sections.
- **Placement:** Left edge and right edge of the content area. Right side is CSS-mirrored (`transform: scaleX(-1)`).
- **Sizing:** `width: clamp(40px, 8vw, 60px); height: auto;`
- **Opacity:** `var(--in-opacity-vine-border)` (0.5) — visible but not competing with text.
- **Edge masking:** Apply CSS gradient mask at top and bottom to fade vine endpoints:
  ```css
  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
  ```
- **Position:** `position: absolute;` pinned to section edges, vertically centered.

### 5.4 Floral Corner (`floral-corner.png`)

- **Usage:** Corner ornaments on celebration event cards and the RSVP section frame.
- **Four corners from one asset:**
  - Top-left: original orientation
  - Top-right: `transform: scaleX(-1)`
  - Bottom-left: `transform: scaleY(-1)`
  - Bottom-right: `transform: scale(-1, -1)`
- **Sizing:** `width: clamp(80px, 18vw, 120px); height: auto;`
- **Opacity:** 0.35 — ornamental, not dominant.
- **Z-index:** Behind card content (`z-index: 0`), cards use `z-index: 1` for text.

### 5.5 Jali Lattice (`jali-lattice.png`)

- **As background texture:** 200x200px tile, repeat, 4% opacity. See Section 4.3.
- **As decorative band:** Horizontal strip between sections. Height: 40px. Full container width. Opacity: 0.08. Masked top and bottom with gradient fade (same approach as vine border).

### 5.6 Ornamental Dividers

Three distinct divider treatments to avoid repetition:

**Divider A — Gold tapered rule:**
Single gold line, 1px, tapered at edges (see Section 4.4). Width: 280px max. Used between Opening and Couple sections.

**Divider B — Dot-and-rule:**
Three small gold circles (6px diameter, `border-radius: 50%`, `background: var(--in-gold)`) horizontally spaced 12px apart, with tapered gold rules extending left and right from the outer dots. Total width: 200px max. Used between Couple and Dua sections, and between Dua and Celebrations.

**Divider C — Floral vine horizontal:**
The `floral-vine-border.png` rotated 90 degrees (`transform: rotate(90deg)`), scaled to 180px wide, opacity 0.4, centered. Masked at both ends with gradient fade. Used between Celebrations and Countdown, and between Countdown and RSVP.

---

## 6. Color Usage Rules

### 6.1 When to Use Each Color

| Color | Token | Use For | Never Use For |
|-------|-------|---------|---------------|
| Ivory `#F5EDD6` | `--in-ivory` | Section backgrounds, card surfaces, surface overlays | Text color |
| Cream `#FAF7F0` | `--in-cream` | Page background, input field backgrounds | Text, borders |
| Gold `#C9A84C` | `--in-gold` | Dividers, trim lines, decorative dots, countdown numbers, small accent labels (under 4 words), button borders | Body text, paragraph text, any text block over 4 words |
| Sage `#8A9A7B` | `--in-sage` | Leaf/botanical accents on decorative assets, very small ornamental dots, icon tints | Text, backgrounds, borders (too weak) |
| Deep Brown `#3D2B1F` | `--in-brown-deep` | All primary text: names, headings, body, Arabic | Backgrounds, large fill areas |
| Warm Brown `#6B5B4E` | `--in-brown-warm` | Secondary text: dates, times, venues, captions, descriptions | Primary headings, names |
| Light Gold `#E0CFA0` | `--in-gold-light` | Card borders, framing lines, subtle outlines | Text, fill areas |
| Champagne `#D5BD91` | `--in-champagne` | Gradient endpoints with gold, warm glow centers, hover states | Standalone — always paired |

### 6.2 Gold Hierarchy

Gold appears at three intensity levels, maintaining the reference's "gold at every scale" principle:

1. **Bold gold** (`#C9A84C`, 100% opacity): Door knocker, arch trim, primary divider lines, countdown digits.
2. **Medium gold** (`#C9A84C`, 50-60% opacity OR `#E0CFA0` at full): Card borders, secondary dividers, decorative dots.
3. **Whisper gold** (`#C9A84C`, 15% opacity OR `#E0CFA0` at 40%): Background washes, hairline rules, input field borders.

### 6.3 Gradient Rules

- All gradients stay within the warm spectrum. No cool-toned gradients anywhere.
- Background gradients use ivory-to-transparent or champagne-to-transparent (never solid-to-solid).
- Gold element gradients: `#C9A84C` to `#D5BD91` (left-to-right or top-to-bottom). This simulates the burnished satin finish from the reference.
- No gradients on text (except the gold countdown numbers, which may use a subtle gold gradient via `background-clip: text` if rendering allows).

---

## 7. Layout System

### 7.1 Viewport Structure

```
InvitationViewport (system wrapper — portrait frame on desktop)
  └── .in-page (full scrollable invitation)
       ├── .in-section--opening
       ├── .in-section--couple
       ├── .in-section--dua
       ├── .in-section--celebrations
       ├── .in-section--countdown
       ├── .in-section--rsvp
       └── .in-section--closing
```

### 7.2 Section Container Pattern

Every section follows this structure:

```css
.in-section {
  position: relative;
  width: 100%;
  max-width: var(--in-container-max);    /* 600px */
  margin-left: auto;
  margin-right: auto;
  padding: var(--in-section-padding-y) var(--in-section-padding-x);
  overflow: hidden;                       /* Contain decorative overflow */
}

.in-section__content {
  position: relative;
  max-width: var(--in-content-max-width); /* 420px */
  margin-left: auto;
  margin-right: auto;
  z-index: 2;                             /* Above decorative pseudo-elements */
}
```

### 7.3 Responsive Behavior

**Mobile (402px — phone preview):**
- Container fills viewport width
- Side padding: 24px
- Content max-width: constrained by padding, effectively ~354px
- Decorative vine borders hidden (not enough room)
- Floral corners scaled to 80px
- Section gap: 80px

**Tablet (768px):**
- Container max: 600px, centered
- Decorative vine borders visible at 40px width
- Floral corners at 100px
- Section gap: 100px

**Desktop (1024px+):**
- Same 600px container (InvitationViewport wraps in portrait frame)
- All decorative elements at full specified size
- Section gap: 120px

### 7.4 Z-Index Scale

| Layer | Z-Index | Contents |
|-------|---------|----------|
| Page background | 0 | Marble texture, page color |
| Jali overlay | 1 | Background lattice pattern |
| Decorative assets | 2 | Vine borders, corners, arch frame |
| Section content | 3 | Text, cards, forms |
| Floating petals | 5 | Animated jasmine petals |
| Door panels (closed) | 10 | Opening animation doors |
| Door panels (open) | -1 | After animation completes |

---

## 8. Component Specifications

### 8.1 Celebration Event Card

```
┌─────────────────────────────┐
│  [corner-TL]     [corner-TR]│   Border: 1px solid var(--in-gold-light)
│                              │   Border-radius: var(--in-radius-md) (8px)
│     MEHNDI                   │   Background: var(--in-cream-bright)
│  ──── ● ● ● ────            │   Box-shadow: var(--in-shadow-raised)
│  Saturday, June 12           │   Padding: 32px 24px
│  4:00 PM                     │   Width: 100% (single column on mobile)
│  The Grand Pavilion           │   Max-width: 340px
│  123 Palace Road             │
│                              │
│  [corner-BL]     [corner-BR]│
└─────────────────────────────┘
```

- Event name: Cormorant Garamond, 600, `--in-size-subtitle` (18-22px), `--in-brown-deep`
- Divider below name: Divider B (dot-and-rule), scaled to 140px
- Date: Lato 400, `--in-size-body`, `--in-brown-deep`
- Time: Lato 300, `--in-size-body`, `--in-brown-warm`
- Venue: Lato 400, `--in-size-body`, `--in-brown-deep`
- Address: Lato 300, `--in-size-small`, `--in-brown-warm`
- Corner ornaments: 80px at 0.25 opacity

### 8.2 Countdown Unit

```
┌──────────┐
│    42     │   Number: Playfair Display 700, clamp(2.5rem, 6vw, 3.5rem), gold
│   DAYS    │   Label: Lato 400, --in-size-label, uppercase, 0.1em tracking, warm brown
└──────────┘
```

- Four units in a row: Days, Hours, Minutes, Seconds
- Unit width: `calc(25% - 12px)` with 16px gap
- Separator between units: a thin gold vertical line, 1px wide, 32px tall, 0.3 opacity
- Numbers use gold gradient text: `background: linear-gradient(180deg, #C9A84C, #D5BD91); -webkit-background-clip: text;`

### 8.3 RSVP Form

- Input fields: border `1px solid var(--in-gold-light)`, border-radius 4px, padding 12px 16px, background `var(--in-cream-bright)`, font Lato 400 `--in-size-body`
- Input focus: border-color transitions to `var(--in-gold)`, box-shadow `0 0 0 3px rgba(201, 168, 76, 0.12)`
- Labels: Lato 400, `--in-size-small`, `--in-brown-warm`, margin-bottom 8px
- Submit button: background `var(--in-gold)`, color `var(--in-cream-bright)`, font Cormorant Garamond 600, `--in-size-subtitle`, letter-spacing 0.06em, padding 14px 40px, border-radius 4px, border none
- Button hover: background darkens to `#B8953F`, box-shadow `var(--in-shadow-gold-glow)`
- Field spacing: 20px between fields

### 8.4 Designed-By Footer

- Font: Lato 300, `--in-size-label`, `--in-brown-warm` at 0.6 opacity
- Margin-top: `--in-space-3xl` (64px) from last section
- Centered, no decorative elements

---

## 9. Motion Rules

### 9.1 Allowed Motion Types

| Motion | Where | Trigger |
|--------|-------|---------|
| Door open | Opening section | Page load (one-time) |
| Petal float | Multiple sections | Continuous ambient (GSAP) |
| Section reveal | All sections | Scroll into viewport (GSAP ScrollTrigger) |
| Countdown tick | Countdown | Timer interval |
| Warm light shift | Backgrounds | Slow continuous (CSS animation or GSAP) |

### 9.2 Section Reveal

Sections reveal via **opacity fade only** (0 to 1) as they enter the viewport. Duration: 800ms. Easing: `--in-ease-elegant`. Trigger: element 20% visible. **No translateY. No translateX. No scale. Opacity only.** This is a hard rule — translateY breaks drag in edit mode.

### 9.3 Warm Light Shift

A slow, subtle brightness variation simulating passage of sunlight through the palace:

```css
@keyframes in-warm-light {
  0%   { filter: brightness(1.0); }
  50%  { filter: brightness(1.02); }
  100% { filter: brightness(1.0); }
}
```

Duration: 12s. Applied to background/decorative layers only, never text. Iteration: infinite. This is so subtle it is felt, not seen.

### 9.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .in-page * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .in-petal { display: none; }
  .in-door { /* Skip to open state immediately */ }
}
```

All floating petals hidden. All transitions instant. Door starts in open position. Content fully visible.

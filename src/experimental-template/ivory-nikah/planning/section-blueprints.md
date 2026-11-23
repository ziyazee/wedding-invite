# Ivory Nikah — Section Blueprints

Detailed visual design for each of the 7 template sections. Every measurement, color, and placement decision is final and implementation-ready. Each section is designed to feel distinct — no two sections share the same layout structure.

---

## Section 1: Opening

**Purpose:** The cinematic threshold. Two Mughal palace doors swing open to reveal the Bismillah and the couple's names. This is the emotional first impression — sacred, grand, inviting.

### Layout Structure

```
┌──────────────────────────────────────┐
│                                      │
│        ┌─── ARCH FRAME ───┐         │  ← arch-frame.png, full width
│        │                    │         │
│        │  ┌──DOOR─┐┌──DOOR─┐│        │  ← door-left.png + mirrored
│        │  │       ││       ││        │
│        │  │       ││       ││        │
│        │  │       ││       ││        │
│        │  │       ││       ││        │
│        │  │       ││       ││        │
│        │  └───────┘└───────┘│        │
│        │                    │         │
│        │   بِسْمِ ٱللَّهِ     │         │  ← Bismillah (revealed after doors open)
│        │                    │         │
│        │      ─── ● ───     │         │  ← Gold divider A
│        │                    │         │
│        │    Bride Name      │         │  ← Display names
│        │         &          │         │
│        │    Groom Name      │         │
│        │                    │         │
│        │   June 12, 2027    │         │  ← Wedding date
│        │                    │         │
│        └────────────────────┘         │
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity | Z-Index |
|-------|----------|------|---------|---------|
| `arch-frame.png` | Centered, top of section | `width: 100%; max-width: 600px; height: auto` | 1.0 | 2 |
| `door-left.png` | Left half of arch opening | `width: 50% of arch opening; height: matched to arch interior` | 1.0 | 10 (closed), -1 (open) |
| `door-left.png` (mirrored) | Right half of arch opening | Same as left, `transform: scaleX(-1)` | 1.0 | 10 (closed), -1 (open) |

### Typography Specs

| Element | Font | Size | Weight | Tracking | Color | Notes |
|---------|------|------|--------|----------|-------|-------|
| Bismillah | Amiri | `--in-size-bismillah` (28-40px) | 400 | 0 | `--in-brown-deep` | `direction: rtl;` Arabic text |
| Bride name | Playfair Display | `--in-size-names` (36-52px) | 700 | 0.06em | `--in-brown-deep` | Largest text on entire page |
| Ampersand | Cormorant Garamond | `--in-size-section-title` (24-32px) | 400 | 0.04em | `--in-gold` | Decorative connector |
| Groom name | Playfair Display | `--in-size-names` (36-52px) | 700 | 0.06em | `--in-brown-deep` | Same as bride name |
| Wedding date | Lato | `--in-size-small` (13-15px) | 400 | 0.08em | `--in-brown-warm` | Uppercase, below names |

### Spacing

| Between | Value |
|---------|-------|
| Top of section to arch top | 0 (arch touches top) |
| Bismillah to gold divider | 32px |
| Gold divider to bride name | 32px |
| Bride name to ampersand | 8px |
| Ampersand to groom name | 8px |
| Groom name to date | 24px |
| Date to bottom of arch | 40px |
| Bottom of arch to section end | 48px |

### Background Treatment

- Type A (Ivory Surface) gradient behind content, within the arch opening.
- No jali overlay — the arch frame and doors provide all architectural texture.
- Marble page background visible through the arch frame's transparent alpha.

### Animation Behavior

1. **Initial state:** Doors closed, covering the arch interior. All text behind doors is `opacity: 0`.
2. **Door animation:** After page load (300ms delay), both doors rotate outward along their hinge edges over 2000ms with `--in-ease-door-open` easing. Left door rotates around its left edge (transform-origin: left center), right door around its right edge.
3. **Content reveal:** As doors reach ~40% open (800ms in), Bismillah fades in (opacity 0 to 1, 600ms). Names fade in at ~60% open (1200ms). Date fades in at ~80% (1600ms). Each element: opacity-only transition, no translate.
4. **Final state:** Doors at 90 degrees (hidden by perspective or `opacity: 0`). All content visible.

### Responsive Behavior

- **402px:** Arch fills viewport width. Names may need to scale down if they exceed the arch interior width (~320px effective). Bismillah scales proportionally.
- **768px+:** Arch centered in 600px container. Names have ample room.
- If names are very long (approaching 40-character limit), `--in-size-names` should clamp lower. The Names Fit rule applies.

---

## Section 2: Couple & Family

**Purpose:** Introduce the families. This section transitions from the grandeur of the opening into intimate, readable information. The layout is vertically stacked text with floral vine borders framing both sides.

### Layout Structure

```
┌──────────────────────────────────────┐
│                                      │
│  ┌vine┐                    ┌vine┐   │  ← floral-vine-border.png, left & right
│  │    │                    │    │   │
│  │    │  Together with     │    │   │
│  │    │  their families    │    │   │
│  │    │                    │    │   │
│  │    │  ──── ● ● ● ────  │    │   │  ← Divider B
│  │    │                    │    │   │
│  │    │  Mr. & Mrs.        │    │   │
│  │    │  Parent Name       │    │   │
│  │    │                    │    │   │
│  │    │  request the honour │    │   │
│  │    │  of your presence  │    │   │
│  │    │  at the marriage   │    │   │
│  │    │  of their daughter │    │   │
│  │    │                    │    │   │
│  │    │  Bride Full Name   │    │   │
│  │    │                    │    │   │
│  │    │  to                │    │   │
│  │    │                    │    │   │
│  │    │  Groom Full Name   │    │   │
│  │    │                    │    │   │
│  │    │  son of            │    │   │
│  │    │  Mr. & Mrs.        │    │   │
│  │    │  Parent Name       │    │   │
│  │    │                    │    │   │
│  └vine┘                    └vine┘   │
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity | Z-Index |
|-------|----------|------|---------|---------|
| `floral-vine-border.png` (left) | Left edge of section, vertically centered | `width: clamp(40px, 8vw, 60px); height: auto` | 0.5 | 2 |
| `floral-vine-border.png` (right, mirrored) | Right edge, vertically centered | Same, `transform: scaleX(-1)` | 0.5 | 2 |

Both vine borders have gradient masks fading top and bottom 15%.

### Typography Specs

| Element | Font | Size | Weight | Tracking | Color |
|---------|------|------|--------|----------|-------|
| "Together with their families" | Lato | `--in-size-body` (15-17px) | 300 | 0.01em | `--in-brown-warm` |
| Parent names | Cormorant Garamond | `--in-size-subtitle` (18-22px) | 600 | 0.04em | `--in-brown-deep` |
| Invitation text ("request the honour...") | Lato | `--in-size-body` | 300 | 0.01em | `--in-brown-warm` |
| Bride full name | Playfair Display | clamp(1.5rem, 3.8vw, 2.25rem) | 700 | 0.06em | `--in-brown-deep` |
| "to" connector | Cormorant Garamond | `--in-size-body` | 400 | 0.04em | `--in-gold` |
| Groom full name | Playfair Display | clamp(1.5rem, 3.8vw, 2.25rem) | 700 | 0.06em | `--in-brown-deep` |
| "son/daughter of" | Lato | `--in-size-body` | 300 | 0.01em | `--in-brown-warm` |

### Spacing

| Between | Value |
|---------|-------|
| Section padding top | `--in-section-padding-y` (48-80px) |
| "Together with" to divider | 24px |
| Divider to parent names | 32px |
| Parent names to invitation text | 24px |
| Invitation text to bride name | 32px |
| Bride name to "to" | 12px |
| "to" to groom name | 12px |
| Groom name to "son of" | 24px |
| "son of" to parent names | 8px |
| Section padding bottom | `--in-section-padding-y` |

### Background Treatment

Type A (Ivory Surface) — semi-transparent ivory gradient.

### Responsive

- **402px:** Vine borders hidden (insufficient room). Content has 24px side padding. Names scale down if needed.
- **768px+:** Vine borders visible, creating the "carved door panel" framing effect.

---

## Section 3: Dua / Blessing

**Purpose:** A moment of spiritual gravity. A Quranic verse in Arabic with its English translation. This section should feel contemplative and quiet — the most reverent point in the invitation.

### Layout Structure

```
┌──────────────────────────────────────┐
│             ░░ jali bg ░░            │  ← jali-lattice.png at 4% opacity
│                                      │
│          ── Blessing ──              │  ← Small label + tapered rules
│                                      │
│    رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا    │  ← Arabic verse, Amiri
│    وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ         │
│    وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا      │
│                                      │
│         ─── ● ─── ● ───             │  ← Divider B, small
│                                      │
│   "Our Lord, grant us from among    │  ← English translation
│    our wives and offspring comfort   │
│    to our eyes and make us a        │
│    leader for the righteous"        │
│                                      │
│         — Surah Al-Furqan 25:74     │  ← Attribution
│                                      │
│               ◆                      │  ← Small gold diamond marker
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity | Notes |
|-------|----------|------|---------|-------|
| `jali-lattice.png` | Full section background, tiled | 200x200px tile, repeat | 0.04 | Pseudo-element, `pointer-events: none` |

No photographic decorative assets in this section — the visual texture comes entirely from the jali lattice and the Arabic calligraphy itself. This keeps the section quiet and sacred.

### Typography Specs

| Element | Font | Size | Weight | Tracking | Color | Notes |
|---------|------|------|--------|----------|-------|-------|
| "Blessing" label | Lato | `--in-size-label` (11-13px) | 400 | 0.08em | `--in-brown-warm` | Uppercase, flanked by short gold rules |
| Arabic verse | Amiri | `--in-size-arabic-verse` (26-36px) | 400 | 0 | `--in-brown-deep` | `direction: rtl; text-align: center; line-height: 1.8` |
| English translation | Lato | `--in-size-body` (15-17px) | 300 | 0.01em | `--in-brown-warm` | Italic, `max-width: 340px`, centered |
| Surah attribution | Lato | `--in-size-small` (13-15px) | 400 | 0.02em | `--in-brown-warm` | Em dash prefix |

### Spacing

| Between | Value |
|---------|-------|
| Section padding top | `--in-section-padding-y` |
| "Blessing" label to Arabic verse | 40px |
| Arabic verse to divider | 32px |
| Divider to English translation | 32px |
| Translation to attribution | 20px |
| Attribution to gold diamond | 32px |
| Gold diamond to section end | `--in-section-padding-y` |

### Background Treatment

Type B (Warm Glow) — radial gradient with champagne center. Plus jali lattice overlay at 4%.

The combination of warm glow and geometric jali creates a luminous, mosque-like quality. The glow's center aligns with the Arabic verse, drawing the eye to the spiritual text.

### Decorative Details

- **"Blessing" label flanking rules:** Two short gold lines (40px each, 1px, tapered) extending left and right from the word with 12px gap.
- **Gold diamond marker at bottom:** A 6px rotated square (`width: 6px; height: 6px; transform: rotate(45deg); background: var(--in-gold);`). A minimal full-stop for the section.
- **No floral elements in this section.** The restraint is deliberate — flowers return in the next section, making their reappearance more impactful.

### Responsive

- Layout is identical across breakpoints. The narrow content column ensures Arabic text reflows gracefully. The `max-width: 340px` on the translation prevents overly long lines at wider viewports.

---

## Section 4: Celebrations

**Purpose:** Practical event information presented beautifully. Each ceremony (Mehndi, Nikah, Walima) gets its own distinct card. The layout shifts from the centered-text flow to structured cards.

### Layout Structure

```
┌──────────────────────────────────────┐
│                                      │
│         Celebrations                 │  ← Section title
│       ──── ● ● ● ────               │  ← Divider B
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [corner-TL]      [corner-TR] │    │  ← Card 1: Mehndi
│  │                               │    │
│  │          MEHNDI               │    │
│  │       ── ● ● ● ──            │    │
│  │   Saturday, June 10           │    │
│  │   6:00 PM                     │    │
│  │   The Rose Garden             │    │
│  │   456 Blossom Lane            │    │
│  │                               │    │
│  │ [corner-BL]      [corner-BR] │    │
│  └──────────────────────────────┘    │
│                                      │
│            ◆                         │  ← Small gold diamond separator
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [corner-TL]      [corner-TR] │    │  ← Card 2: Nikah
│  │                               │    │
│  │          NIKAH                │    │
│  │       ── ● ● ● ──            │    │
│  │   Sunday, June 11             │    │
│  │   2:00 PM                     │    │
│  │   Central Mosque              │    │
│  │   789 Faith Avenue            │    │
│  │                               │    │
│  │ [corner-BL]      [corner-BR] │    │
│  └──────────────────────────────┘    │
│                                      │
│            ◆                         │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [corner-TL]      [corner-TR] │    │  ← Card 3: Walima
│  │                               │    │
│  │          WALIMA               │    │
│  │       ── ● ● ● ──            │    │
│  │   Monday, June 12             │    │
│  │   7:00 PM                     │    │
│  │   The Grand Pavilion          │    │
│  │   123 Palace Road             │    │
│  │                               │    │
│  │ [corner-BL]      [corner-BR] │    │
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity | Notes |
|-------|----------|------|---------|-------|
| `floral-corner.png` (x4 per card) | Four corners of each card | `width: clamp(80px, 18vw, 120px)` | 0.25 | Rotated/mirrored for each corner |

### Card Design Specs

```css
.in-celebration-card {
  background: var(--in-cream-bright);          /* #FFFDF7 */
  border: 1px solid var(--in-gold-light);      /* #E0CFA0 */
  border-radius: var(--in-radius-md);          /* 8px */
  box-shadow: var(--in-shadow-raised);         /* 0 2px 8px rgba(61,43,31,0.06) */
  padding: 40px 28px;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
  overflow: visible;                           /* Corners extend slightly */
}
```

### Typography Specs (within cards)

| Element | Font | Size | Weight | Tracking | Color |
|---------|------|------|--------|----------|-------|
| Section title "Celebrations" | Cormorant Garamond | `--in-size-section-title` (24-32px) | 600 | 0.04em | `--in-brown-deep` |
| Event name (Mehndi/Nikah/Walima) | Cormorant Garamond | `--in-size-subtitle` (18-22px) | 600 | 0.04em | `--in-brown-deep` |
| Day and date | Lato | `--in-size-body` (15-17px) | 400 | 0.01em | `--in-brown-deep` |
| Time | Lato | `--in-size-body` | 300 | 0.01em | `--in-brown-warm` |
| Venue name | Lato | `--in-size-body` | 400 | 0.01em | `--in-brown-deep` |
| Address | Lato | `--in-size-small` (13-15px) | 300 | 0.01em | `--in-brown-warm` |

### Spacing

| Between | Value |
|---------|-------|
| Section title to divider | 16px |
| Divider to first card | 40px |
| Between cards (with diamond separator) | 32px (16px + diamond + 16px) |
| Card internal: event name to mini-divider | 16px |
| Card internal: mini-divider to date | 20px |
| Card internal: date to time | 6px |
| Card internal: time to venue | 16px |
| Card internal: venue to address | 4px |

### Background Treatment

Type C (Clear/transparent). The marble page texture shows through. Cards provide their own surfaces. This contrast between the clear background and the bright card surfaces creates a "floating panel" effect.

### Responsive

- **402px:** Cards stack vertically, full width minus 24px padding per side. Corner ornaments at 80px.
- **768px+:** Cards max at 380px, centered. Corner ornaments at 120px, extending slightly beyond card edges (overflow visible).

### Card-to-Card Distinction

All three cards share the same layout structure but the corner ornaments and the consistent card design unify them as a series. If the template needs visual variety between ceremonies, the gold border can shift intensity:
- Mehndi card: `border-color: var(--in-gold-light)` (standard)
- Nikah card: `border-color: var(--in-gold)` (emphasized — this is the main event)
- Walima card: `border-color: var(--in-gold-light)` (standard)

---

## Section 5: Countdown

**Purpose:** Anticipation and excitement. A live countdown to the wedding day. The layout is horizontal — the only section that breaks from the vertical stacking pattern, providing rhythm change.

### Layout Structure

```
┌──────────────────────────────────────┐
│             ░░ jali bg ░░            │  ← jali overlay at 4%
│                                      │
│        The celebration begins in     │  ← Intro text
│                                      │
│    ┌────┐   ┌────┐   ┌────┐   ┌────┐│
│    │ 42 │ │ │ 08 │ │ │ 35 │ │ │ 12 ││  ← Countdown numbers + gold separators
│    │DAYS│   │HRS │   │MIN │   │SEC ││
│    └────┘   └────┘   └────┘   └────┘│
│                                      │
│          June 12, 2027               │  ← Target date
│                                      │
│         ── ● ── ● ──                │  ← Divider B, small
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity |
|-------|----------|------|---------|
| `jali-lattice.png` | Full section background, tiled | 200x200px tile | 0.04 |

No photographic decorative assets. The horizontal number display is the visual feature.

### Typography Specs

| Element | Font | Size | Weight | Tracking | Color |
|---------|------|------|--------|----------|-------|
| Intro text | Cormorant Garamond | `--in-size-subtitle` (18-22px) | 600 | 0.04em | `--in-brown-warm` |
| Countdown numbers | Playfair Display | clamp(2.5rem, 6vw, 3.5rem) | 700 | 0.02em | `--in-gold` (gradient text) |
| Countdown labels | Lato | `--in-size-label` (11-13px) | 400 | 0.1em | `--in-brown-warm` | Uppercase |
| Target date | Lato | `--in-size-body` (15-17px) | 400 | 0.04em | `--in-brown-deep` |

### Countdown Number Treatment

The numbers use gold gradient text for a burnished metallic feel:

```css
.in-countdown__number {
  background: linear-gradient(180deg, #C9A84C 0%, #D5BD91 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Spacing

| Between | Value |
|---------|-------|
| Section padding top | `--in-section-padding-y` |
| Intro text to countdown units | 36px |
| Between countdown units | 16px gap (flexbox) |
| Gold separator lines: centered in the gap | `width: 1px; height: 32px; background: var(--in-gold); opacity: 0.3` |
| Number to label (within unit) | 4px |
| Countdown units to target date | 32px |
| Target date to divider | 24px |
| Divider to section end | `--in-section-padding-y` |

### Countdown Unit Container

```css
.in-countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
}
```

The four units sit in a row with `display: flex; justify-content: center; gap: 16px; max-width: 360px; margin: 0 auto;`

### Background Treatment

Type C (Clear) with jali lattice overlay at 4%. The geometric background pattern behind the numbers creates visual harmony — mathematical precision (countdown) meets mathematical beauty (Islamic geometry).

### Responsive

- **402px:** Numbers scale down via clamp. Labels stay readable at 11px. The four-across layout holds even at 402px (each unit ~75px including gap).
- **768px+:** Numbers at full 3.5rem size. Generous spacing between units.

---

## Section 6: RSVP

**Purpose:** The response form. Practical, clear, but still beautiful. This section must balance aesthetic integrity with form usability.

### Layout Structure

```
┌──────────────────────────────────────┐
│             ░░ jali bg ░░            │
│                                      │
│           Kindly Respond             │  ← Section title
│          ──── ● ● ● ────            │  ← Divider B
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [corner-TL]      [corner-TR] │    │
│  │                               │    │  ← RSVP card / form area
│  │  Your Name                    │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │                         │  │    │
│  │  └─────────────────────────┘  │    │
│  │                               │    │
│  │  Number of Guests             │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │                         │  │    │
│  │  └─────────────────────────┘  │    │
│  │                               │    │
│  │  ┌─ Attending ──┐ ┌─ Unable ─┐│   │  ← Toggle / radio
│  │                               │    │
│  │  Message (optional)           │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │                         │  │    │
│  │  │                         │  │    │
│  │  └─────────────────────────┘  │    │
│  │                               │    │
│  │      [ Send Response ]        │    │  ← Submit button
│  │                               │    │
│  │ [corner-BL]      [corner-BR] │    │
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity |
|-------|----------|------|---------|
| `jali-lattice.png` | Section background, tiled | 200x200px | 0.04 |
| `floral-corner.png` (x4) | Corners of the form card | `width: clamp(60px, 14vw, 90px)` | 0.2 |

### Form Card Specs

```css
.in-rsvp-card {
  background: rgba(255, 253, 247, 0.85);       /* Cream-bright, semi-transparent */
  border: 1px solid var(--in-gold-light);
  border-radius: var(--in-radius-md);
  box-shadow: var(--in-shadow-deep);
  padding: 40px 28px;
  max-width: 400px;
  margin: 0 auto;
  backdrop-filter: blur(4px);                   /* Softens jali pattern beneath */
}
```

### Input Field Specs

```css
.in-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--in-gold-light);
  border-radius: var(--in-radius-sm);           /* 4px */
  background: var(--in-cream-bright);
  font-family: var(--in-font-body);
  font-size: var(--in-size-body);
  font-weight: 400;
  color: var(--in-brown-deep);
  transition: border-color var(--in-duration-fast) var(--in-ease-elegant),
              box-shadow var(--in-duration-fast) var(--in-ease-elegant);
}

.in-input:focus {
  outline: none;
  border-color: var(--in-gold);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
}

.in-input::placeholder {
  color: rgba(107, 91, 78, 0.5);               /* Warm brown at 50% */
}
```

### Button Spec

```css
.in-button {
  display: inline-block;
  padding: 14px 40px;
  background: var(--in-gold);
  color: var(--in-cream-bright);
  font-family: var(--in-font-heading);
  font-size: var(--in-size-subtitle);
  font-weight: 600;
  letter-spacing: 0.06em;
  border: none;
  border-radius: var(--in-radius-sm);
  cursor: pointer;
  transition: background var(--in-duration-fast) var(--in-ease-elegant),
              box-shadow var(--in-duration-fast) var(--in-ease-elegant);
  min-height: 48px;                             /* Touch target */
  min-width: 180px;
}

.in-button:hover {
  background: #B8953F;
  box-shadow: var(--in-shadow-gold-glow);
}

.in-button:active {
  background: #A88535;
}
```

### Attendance Toggle

Two options side by side: "Joyfully Accept" and "Regretfully Decline"

```css
.in-toggle-option {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--in-gold-light);
  background: transparent;
  font-family: var(--in-font-body);
  font-size: var(--in-size-small);
  font-weight: 400;
  color: var(--in-brown-warm);
  cursor: pointer;
  transition: all var(--in-duration-fast) var(--in-ease-elegant);
  min-height: 44px;                             /* Touch target */
}

.in-toggle-option--selected {
  background: var(--in-gold);
  color: var(--in-cream-bright);
  border-color: var(--in-gold);
}
```

Left option: `border-radius: 4px 0 0 4px`. Right option: `border-radius: 0 4px 4px 0`. They sit flush against each other.

### Typography Specs

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section title | Cormorant Garamond | `--in-size-section-title` | 600 | `--in-brown-deep` |
| Field labels | Lato | `--in-size-small` (13-15px) | 400 | `--in-brown-warm` |
| Input text | Lato | `--in-size-body` | 400 | `--in-brown-deep` |
| Button text | Cormorant Garamond | `--in-size-subtitle` | 600 | `--in-cream-bright` |

### Spacing

| Between | Value |
|---------|-------|
| Section title to divider | 16px |
| Divider to form card | 40px |
| Card padding | 40px top/bottom, 28px sides |
| Label to input | 8px |
| Between form fields | 20px |
| Attendance toggle to message field | 24px |
| Message field to button | 32px |

### Background Treatment

Type B (Warm Glow) plus jali lattice overlay. The glow centers on the form card, making it feel warmly lit.

### Responsive

- **402px:** Form card fills width minus 24px padding. Button is full width. Toggle options stack if text overflows (but "Joyfully Accept" / "Regretfully Decline" should fit side by side at 402px).
- **768px+:** Form card at 400px max, centered. Button at natural width (min 180px).

---

## Section 7: Closing

**Purpose:** A gracious farewell. Simple, warm, final. This section is the quietest — the visual equivalent of a gentle bow.

### Layout Structure

```
┌──────────────────────────────────────┐
│                                      │
│  ┌vine┐                    ┌vine┐   │  ← Vine borders return
│  │    │                    │    │   │
│  │    │  With love & prayers│   │   │
│  │    │                    │    │   │
│  │    │  Bride & Groom     │    │   │  ← Couple names, smaller than opening
│  │    │                    │    │   │
│  │    │  ──── ● ────       │    │   │  ← Divider A, small
│  │    │                    │    │   │
│  │    │  We look forward   │    │   │
│  │    │  to celebrating    │    │   │
│  │    │  with you          │    │   │
│  │    │                    │    │   │
│  │    │  #CoupleHashtag    │    │   │  ← Optional hashtag
│  │    │                    │    │   │
│  └vine┘                    └vine┘   │
│                                      │
│                                      │
│         Designed by Shaadi           │  ← Footer, subdued
│                                      │
└──────────────────────────────────────┘
```

### Asset Placement

| Asset | Position | Size | Opacity |
|-------|----------|------|---------|
| `floral-vine-border.png` (left) | Left edge, vertically centered | `width: clamp(40px, 8vw, 60px)` | 0.4 |
| `floral-vine-border.png` (right, mirrored) | Right edge, vertically centered | Same, mirrored | 0.4 |

Vine borders at slightly lower opacity than Section 2 (0.4 vs 0.5) — the closing is quieter.

### Typography Specs

| Element | Font | Size | Weight | Tracking | Color |
|---------|------|------|--------|----------|-------|
| "With love & prayers" | Cormorant Garamond | `--in-size-subtitle` (18-22px) | 600 | 0.04em | `--in-brown-warm` |
| Couple names | Playfair Display | clamp(1.375rem, 3.2vw, 1.75rem) | 700 | 0.06em | `--in-brown-deep` |
| Closing message | Lato | `--in-size-body` | 300 | 0.01em | `--in-brown-warm` |
| Hashtag | Lato | `--in-size-small` | 400 | 0.02em | `--in-gold` |
| Footer | Lato | `--in-size-label` | 300 | 0.02em | `--in-brown-warm` at 0.6 opacity |

### Spacing

| Between | Value |
|---------|-------|
| Section padding top | `--in-section-padding-y` |
| "With love" to couple names | 20px |
| Couple names to divider | 24px |
| Divider to closing message | 24px |
| Closing message to hashtag | 20px |
| Hashtag to section padding bottom | `--in-section-padding-y` |
| Section end to footer | 64px (`--in-space-3xl`) |
| Footer to page bottom | 32px |

### Background Treatment

Type A (Ivory Surface) — same as Opening and Couple sections. The return of the ivory wash bookends the invitation, creating a sense of arrival and departure through the same palace.

### Responsive

- **402px:** Vine borders hidden. Content centered with 24px padding.
- **768px+:** Vine borders visible, matching Section 2 placement.

---

## Section Transition Summary

| From → To | Divider Type | Gap |
|-----------|-------------|-----|
| Opening → Couple | Divider A (gold tapered rule) | `--in-section-gap` (80-120px) |
| Couple → Dua | Divider B (dot-and-rule) | `--in-section-gap` |
| Dua → Celebrations | Divider B (dot-and-rule) | `--in-section-gap` |
| Celebrations → Countdown | Divider C (rotated vine) | `--in-section-gap` |
| Countdown → RSVP | Divider C (rotated vine) | `--in-section-gap` |
| RSVP → Closing | Divider A (gold tapered rule) | `--in-section-gap` |

The divider types alternate across the page: A, B, B, C, C, A. This creates a subtle ABA pattern that bookends the experience without exact repetition.

---

## Background Treatment Summary

| Section | Type | Jali Overlay | Vine Borders | Floral Corners |
|---------|------|-------------|-------------|----------------|
| 1. Opening | A (Ivory) | No | No | No |
| 2. Couple | A (Ivory) | No | Yes | No |
| 3. Dua | B (Warm Glow) | Yes (4%) | No | No |
| 4. Celebrations | C (Clear) | No | No | Yes (on cards) |
| 5. Countdown | C (Clear) | Yes (4%) | No | No |
| 6. RSVP | B (Warm Glow) | Yes (4%) | No | Yes (on form) |
| 7. Closing | A (Ivory) | No | Yes | No |

Each section has a unique combination of background treatment and decorative elements. No two adjacent sections share the same treatment.

# Amrit Glow — Section Blueprints

Seven sections, each with a **distinct layout**, progressing through a narrative arc that mirrors the reference video's three-act structure: anticipation (hero), revelation (couple, countdown), celebration (events, RSVP), and resolution (personal notes, closing).

All measurements target 402px mobile viewport. All spacing tokens and color tokens reference `design-bible.md`.

---

## Section 1: Video Opening (Hero)

### Emotional Intent
Anticipation. Darkness. The viewer arrives in stillness and witnesses the gradual illumination. This is the cinematic hook.

### Layout Structure

```
┌──────────────────────────────────┐
│                          ( Moon  │  crescent-moon.png
│                                  │  position: absolute
│                                  │  top: 12%, right: 8%
│                                  │
│         [ VIDEO FILLS            │  Reference video covers
│           ENTIRE VIEWPORT ]      │  full section (100svh)
│                                  │
│                                  │
│        A M R I T                 │  Cinzel Decorative 700
│             &                    │  --ag-type-hero
│        P R E E T                 │  color: --ag-gold-bright
│                                  │  text-shadow: --ag-shadow-text-lg
│       12  .  03  .  2027        │  Lato 400, --ag-type-label
│                                  │  color: --ag-text-muted
│                                  │
│  ┌──────────────────────────────┐│
│  │       arch-border.png        ││  width: 100%
│  │  (ornate Mughal arch band)   ││  z-index: --ag-z-decor
│  └──────────────────────────────┘│
└──────────────────────────────────┘
    Height: 100svh (full viewport)
```

### Layout Details
- **Display**: flex column, `justify-content: center`, `align-items: center`
- **Min-height**: `100svh` (small viewport height for mobile browser chrome)
- **Position**: relative (container for absolute moon and arch)
- **Text alignment**: center
- **Content container**: no max-width constraint — text is short and naturally centered

### Content Hierarchy
1. **Video background** — plays once, covers viewport via `object-fit: cover`. Poster frame as fallback.
2. **Crescent moon** — atmospheric, top-right corner. Static (no animation, just positioned).
3. **Couple names** — the primary reveal. Cinzel Decorative 700, `--ag-type-hero`. Color `--ag-gold-bright` with `--ag-shadow-text-lg` for legibility on video. Uppercase.
4. **Ampersand** — Cormorant Garamond 400 italic, `--ag-type-detail`, `--ag-text-secondary`. Centered between names. Optionally replace with an ornamental "and" in Cormorant.
5. **Wedding date** — Lato 400, `--ag-type-label`, `--ag-text-muted`. Dot-separated format: `12 . 03 . 2027`.
6. **Arch border** — `arch-border.png` flush with section bottom. Full width. The ornamental "gate" from the immersive hero into the informational sections.

### Background Treatment
- Video element: `position: absolute; inset: 0; object-fit: cover; z-index: 0`
- Dark overlay on video: `::after` pseudo-element with `background: rgba(15, 22, 35, 0.3)` for text contrast
- After video completes (or `prefers-reduced-motion`): background transitions to `--ag-gradient-bg`
- On `canplay` failure or poster fallback: show `--ag-gradient-bg` with the moon as the primary visual element

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `crescent-moon.png` | `clamp(80px, 20vw, 120px)` | `top: 12%; right: 8%` | `screen` | 0.75 |
| `arch-border.png` | `width: 100%` | bottom of section, flush | none (dark bg) | 1.0 |
| Sparkle particles (3–4) | 16–28px | margins, see choreography | `screen` | 0.15–0.40 |
| Gold leaf particles (2–3) | 8–14px | margins, see choreography | `screen` | 0.45–0.80 |

### Spacing
- Names cluster: `gap: var(--ag-space-xs)` (8px) between name lines
- Ampersand: inherits the gap
- Date: `margin-top: var(--ag-space-md)` (16px) below names
- Arch border: flush at bottom, no margin

### Animation Sequence
1. Video plays (0–10s)
2. At video end (or after 10s), text reveals begin:
   - Names fade up: `--ag-hero-text-duration` (1.2s), `--ag-hero-text-easing`
   - Date fades up: delayed by 0.3s after names
3. Particles begin after text is revealed (stagger-spawned over 2s)
4. Moon is visible throughout (no entrance animation)

### Responsive
- Moon: `right: 5%` on viewports below 375px
- Names: `clamp()` handles scaling automatically
- Video poster: displayed on `prefers-reduced-motion: reduce` devices

### Transition to Section 2
The arch border at the hero's bottom serves as the architectural gateway. Below it: `var(--ag-space-3xl)` (64px) of dark space before the Couple section begins. The darkness between acts as a "curtain drop."

---

## Section 2: Couple & Family

### Emotional Intent
Formality and intimacy. This is the engraved invitation — names and families presented with gravity and grace. The centered vertical axis and balanced typography echo a physical printed card.

### Layout Structure

```
┌──────────────────────────────────┐
│                                  │
│  ┌─corner─┐            ┌─corner─┐│  gold-corner.png (TL, TR)
│  │        │            │        ││  60–80px each
│  │                              ││
│  │        BRIDE'S NAME          ││  Cinzel Decorative 700
│  │              &               ││  --ag-type-names
│  │        GROOM'S NAME          ││  color: --ag-gold
│  │                              ││
│  │      ──── ◇ ────            ││  .ag-rule-ornate divider
│  │                              ││
│  │      daughter of             ││  Lato 300, --ag-text-muted
│  │      Mother & Father         ││  Cormorant Garamond 600
│  │                              ││  --ag-text-secondary
│  │                              ││
│  │      son of                  ││  Lato 300, --ag-text-muted
│  │      Mother & Father         ││  Cormorant Garamond 600
│  │                              ││
│  │        │            │        ││
│  └─corner─┘            └─corner─┘│  gold-corner.png (BL, BR)
│                                  │
└──────────────────────────────────┘
```

### Layout Details
- **Display**: flex column, `align-items: center`
- **Padding**: `80px var(--ag-space-md)` — extra vertical height for gravitas
- **Content container**: `max-width: var(--ag-content-width)` (370px), centered
- **Text alignment**: center
- **Gold corners**: `position: absolute` within the content container, inset by 16px from edges

### Content Hierarchy
1. **Couple names** — Cinzel Decorative 700, `--ag-type-names`, `--ag-gold`, `--ag-shadow-text-md`. Uppercase. Each name on its own line.
2. **Ampersand** — Cormorant Garamond 400 italic, `--ag-type-detail`, `--ag-text-secondary`. Smaller than names, centered.
3. **Ornamental divider** — `.ag-rule-ornate` with diamond center. Separates couple from family.
4. **Relation label** — Lato 300, `--ag-type-small`, `--ag-text-muted`, lowercase: "daughter of", "son of"
5. **Parent names** — Cormorant Garamond 600, `--ag-type-detail`, `--ag-text-secondary`

### Background Treatment
- `--ag-gradient-bg` as base
- `--ag-glow-gold` centered behind the couple names (positioned via pseudo-element, `width: 200px`, `height: 200px`, centered)
- No image backgrounds. This section is clean and typographic.

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `gold-corner.png` x4 | 80px | 16px inset from content edges | `screen` | 0.60 |

Corner rotation: TL = `rotate(0)`, TR = `rotate(90deg)`, BR = `rotate(180deg)`, BL = `rotate(270deg)`.

No other ornamental images. The gold corners and typographic hierarchy carry the section.

### Spacing
- Between name lines: `var(--ag-space-xs)` (8px)
- Ornamental rule: `margin: var(--ag-space-2xl) auto` (48px above and below)
- Between "daughter of" block and "son of" block: `var(--ag-space-xl)` (32px)
- Relation label to parent names: `var(--ag-space-2xs)` (4px)
- Gold corners: inset 16px from content container edges

### Responsive
- Gold corners scale to 60px on viewports below 375px
- Names scale via `clamp()` — no additional breakpoint logic needed

### Transition to Section 3
A `.ag-rule` thin gold line (120px wide) centered below the section. Below the rule: `var(--ag-space-2xl)` (48px) before the Countdown section. The quiet divider signals a shift from the formal introduction to the anticipatory countdown.

---

## Section 3: Countdown

### Emotional Intent
Anticipation made tangible. A real-time connection between the viewer and the wedding day. Compact and functional — a quiet "breath" section between the formal opening and the celebratory events.

### Layout Structure

```
┌──────────────────────────────────┐
│                                  │
│       Together, we begin         │  Cormorant Garamond 400 italic
│                                  │  --ag-type-detail
│                                  │  --ag-text-muted
│   ┌────┐  ┌────┐  ┌────┐  ┌────┐│
│   │ 42 │  │ 08 │  │ 23 │  │ 15 ││  Cinzel Decorative 700
│   │DAYS│  │HRS │  │MIN │  │SEC ││  --ag-type-timer-num / timer-label
│   └────┘  └────┘  └────┘  └────┘│  color: --ag-gold-bright / --ag-text-muted
│                                  │
│      🪔     ── ◇ ──     🪔       │  2 diyas flanking thin rule
│                                  │
└──────────────────────────────────┘
    Compact height — NOT full viewport
```

### Layout Details
- **Display**: flex column, `align-items: center`
- **Padding**: `var(--ag-space-2xl) var(--ag-space-md)` (48px 16px) — compact section
- **Timer row**: flex row, `justify-content: center`, `gap: var(--ag-space-md)` (16px)
- **Each timer unit**: flex column, `align-items: center`, `gap: var(--ag-space-2xs)` (4px)
- **Text alignment**: center throughout

### Content Hierarchy
1. **Poetic line** (optional) — Cormorant Garamond 400 italic, `--ag-type-detail`, `--ag-text-muted`. A single short line: "Together, we begin" or similar. Understated.
2. **Timer units** — 4 units in a row:
   - Number: Cinzel Decorative 700, `--ag-type-timer-num`, `--ag-gold-bright`
   - Label: Lato 400, `--ag-type-timer-label`, `--ag-text-muted`, uppercase
3. **Decorative close** — 2 diya PNGs flanking a thin gold rule with diamond center

### Background Treatment
- Base: `--ag-bg` (slightly simpler than the radial gradient — this section is quiet)
- `--ag-glow-lamp` centered behind the timer row (a very faint warm glow, ~120px radius)
- No image backgrounds

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `diya-1.png` | 40px | Left of center rule | `screen` | 0.45 |
| `diya-2.png` | 40px | Right of center rule | `screen` | 0.45 |
| `.ag-rule` (thin gold) | 80px wide | Between the diyas | N/A | 0.6 |

The diyas and rule form a horizontal flex row: `diya — rule — diya`, centered. The diyas are decorative markers, not animated in this section (they are small enough to be static icons here).

### Spacing
- Poetic line: `margin-bottom: var(--ag-space-lg)` (24px)
- Timer row to diya row: `margin-top: var(--ag-space-xl)` (32px)
- Between timer units: `gap: var(--ag-space-md)` (16px)

### Responsive
- Timer numbers scale via `clamp()` — 28px minimum
- At very narrow widths (<340px): reduce timer gap to 12px
- Timer units ALWAYS remain in a horizontal row — never stack

### Transition to Section 4
**Marigold garland divider.** This is the first major ornamental divider in the template. `marigold-garland.png`, `max-width: 340px`, centered, `mix-blend-mode: screen`, `opacity: 0.70`. Spaced `var(--ag-space-3xl)` (64px) below the countdown and `var(--ag-space-3xl)` (64px) above the first event. The garland marks the narrative shift from preamble to the wedding program.

---

## Section 4: Celebrations / Events

### Emotional Intent
Joyful narrative. Each event is a chapter in the wedding story. Layout varies across events to maintain visual interest and give each celebration its own personality while belonging to a unified system.

### Section Heading

```
         Celebrations
         ──── ◇ ────
```

- Cormorant Garamond 600, `--ag-type-section`, `--ag-gold`, center-aligned
- `.ag-rule-ornate` divider below
- `margin-bottom: var(--ag-space-2xl)` (48px) before first event

### Event Layout System

Three layout types rotate across events in a palindrome pattern (B-A-C-A-B) to create visual rhythm:

| Event | Layout | Why |
|-------|--------|-----|
| Roka | **B** — Open Frame | Quiet beginning, intimate |
| Mehndi | **A** — Ornamental Card | Celebratory, contained |
| Jaggo | **C** — Feature (firework) | Night celebration climax |
| Anand Karaj | **A** — Ornamental Card (hero-sized) | Main ceremony, maximum gravity |
| Reception | **B** — Open Frame | Mirrors Roka for narrative bookend |

If the order has fewer or more events, the pattern cycles: B, A, B, A, B for 5 events; B, A, B for 3 events; A, B for 2 events; A for 1 event. Layout C (feature) applies to the event with the most celebratory character (night event, sangeet, or the event closest to the middle of the list).

---

### Layout A — Ornamental Card

Used for: **Mehndi, Anand Karaj** (and every 2nd event in the cycle)

```
         ┌─────────────────────────┐
         │ ╭ event-card-bg.png ──╮ │
         │ │                     │ │  640x400 native
         │ │                     │ │  rendered at --ag-event-card-width
         │ │      Mehndi         │ │  Cormorant Garamond 600
         │ │                     │ │  --ag-type-event, --ag-gold
         │ │  Saturday, 10 March │ │  Lato 300, --ag-type-body
         │ │      5:00 PM        │ │  --ag-text-primary
         │ │                     │ │
         │ │  The Grand Ballroom │ │  Cormorant Garamond 400
         │ │  123 Venue Address  │ │  --ag-type-detail, --ag-text-secondary
         │ │  City, State        │ │  Lato 300, --ag-type-small
         │ │                     │ │  --ag-text-muted
         │ ╰─────────────────────╯ │
         └─────────────────────────┘
```

#### Details
- **Container**: `event-card-bg.png` as CSS `background-image`, `background-size: contain`, `background-repeat: no-repeat`, `background-position: center`
- **Card width**: `var(--ag-event-card-width)` (340px), centered with `margin: 0 auto`
- **Card padding**: `48px 32px` — enough interior space for the PNG frame's border to clear the text
- **Text alignment**: center
- **For Anand Karaj (hero event)**: card width `360px`, padding `56px 36px`. The slightly larger card signals importance.

#### Content Stack
1. Event name: Cormorant Garamond 600, `--ag-type-event`, `--ag-gold`
2. Date and time: Lato 300, `--ag-type-body`, `--ag-text-primary`
3. Venue name: Cormorant Garamond 400, `--ag-type-detail`, `--ag-text-secondary`
4. Address: Lato 300, `--ag-type-small`, `--ag-text-muted`

#### Internal Spacing
- Event name to date: `var(--ag-space-md)` (16px)
- Date to venue name: `var(--ag-space-md)` (16px)
- Venue name to address: `var(--ag-space-2xs)` (4px)

---

### Layout B — Open Frame

Used for: **Roka, Reception** (and every 1st/3rd event in the cycle)

```
         ╔═══╗                ╔═══╗
         ║   ║                ║   ║  gold-corner.png x4
         ║   ║                ║   ║  60px each
         ║   ║                ║   ║
         ║   ║     Roka       ║   ║  Same content hierarchy
         ║   ║                ║   ║  as Layout A, but no
         ║   ║  Date & Time   ║   ║  card background image.
         ║   ║  Venue         ║   ║  Text sits directly on
         ║   ║  Address       ║   ║  --ag-gradient-bg.
         ║   ║                ║   ║
         ║   ║                ║   ║
         ╚═══╝                ╚═══╝
```

#### Details
- **No background image** — text on the dark `--ag-gradient-bg`
- **Gold corners**: `gold-corner.png` x4, each `60px`, `position: absolute` at content area corners
- **Content area**: `320px` wide, centered, `padding: 40px 24px`
- **Gold corners**: `mix-blend-mode: screen`, `opacity: 0.55`, inset 0 from content area edges
- **Text alignment**: center
- **Content hierarchy**: identical to Layout A (same fonts, sizes, colors)

The open frame feels lighter and more airy than the ornamental card, providing visual contrast.

---

### Layout C — Feature Event

Used for: **Jaggo** (or the most celebratory night event)

```
         ┌─────────────────────────┐
         │    * firework-burst *   │  firework-burst.png
         │      (behind all)       │  centered, 250px wide
         │  ╔═══╗          ╔═══╗   │  mix-blend-mode: screen
         │  ║   ║          ║   ║   │  opacity: 0.40
         │  ║   ║  Jaggo   ║   ║   │
         │  ║   ║          ║   ║   │  Same open-frame structure
         │  ║   ║  Night   ║   ║   │  as Layout B, with
         │  ║   ║  Party   ║   ║   │  firework-burst.png
         │  ║   ║          ║   ║   │  behind at z-0
         │  ╚═══╝          ╚═══╝   │
         │                         │
         └─────────────────────────┘
```

#### Details
- Same structure as Layout B (open frame with gold corners)
- **Additionally**: `firework-burst.png` centered behind the event content
- Firework: `width: clamp(200px, 55vw, 280px)`, `position: absolute`, `top: 50%; left: 50%; transform: translate(-50%, -50%)`
- Firework blend: `mix-blend-mode: screen`, `opacity: 0.40`, `z-index: var(--ag-z-bg)`
- The firework creates a warm golden radiance behind the Jaggo event, reinforcing its nighttime celebration character
- Used exactly ONCE in the template

---

### Dividers Between Events

| Transition | Divider | Spacing |
|------------|---------|---------|
| Roka to Mehndi | `.ag-rule` (thin gold, 120px) | 48px above and below |
| Mehndi to Jaggo | `marigold-garland.png` (screen blend, 340px) | 64px above and below |
| Jaggo to Anand Karaj | `marigold-garland.png` (screen blend, 340px) | 64px above and below |
| Anand Karaj to Reception | `.ag-rule` (thin gold, 120px) | 48px above and below |

The two marigold garland placements frame the central Jaggo event, creating a visual "stage" for the celebration climax.

### Animated Particles in Celebrations
Marigold petals fall slowly through this section (5–8 instances across the full height). Sparkles appear in the margins (1–2 per visible event area). See `png-choreography.md` for full specifications. Particles live at `z-index: var(--ag-z-particles-bg)` — behind all text.

### Responsive
- Event cards (Layout A): on viewports below 340px, reduce card width to 300px and padding to `40px 24px`
- Open frames (Layout B/C): corner ornaments reduce to 50px below 340px
- All text scales via fixed sizes (not clamp) — the event type scale is already sized for mobile

### Transition to Section 5
`var(--ag-space-3xl)` (64px) spacing below the final event. A `.ag-rule` thin gold line provides a quiet boundary before the RSVP section. No heavy divider — the viewer moves from reading event details to acting on them.

---

## Section 5: RSVP

### Emotional Intent
Warm invitation to respond. The form is simple, approachable, and gold-accented. The water reflection texture introduces the sacred-water motif that will carry through to the closing.

### Layout Structure

```
┌──────────────────────────────────┐
│                                  │
│  ~~~~~~~~ water-reflection ~~~~~  │  Background: water-reflection.png
│  ~~~~~~~~ at 20% opacity ~~~~~~  │  opacity: 0.20, background-size: cover
│                                  │
│            R S V P               │  Cormorant Garamond 600
│                                  │  --ag-type-section, --ag-gold
│       We would be honoured       │
│       by your presence           │  Lato 300, --ag-type-body
│                                  │  --ag-text-secondary
│                                  │
│      ┌──────────────────┐        │
│      │ Guest Name        │        │  Underline-style inputs
│      │ ────────────────  │        │  max-width: --ag-content-narrow
│      │                   │        │  (300px)
│      │ Number of Guests  │        │
│      │ ────────────────  │        │
│      │                   │        │
│      │ [Joyfully Accept] │        │  Gold-fill button (primary)
│      │                   │        │
│      │ [  With Regrets ] │        │  Ghost button (secondary)
│      │                   │        │
│      └──────────────────┘        │
│                                  │
│        🪔   ── ◇ ──   🪔         │  Diyas + ornamental rule
│                                  │
└──────────────────────────────────┘
```

### Layout Details
- **Display**: flex column, `align-items: center`
- **Padding**: `var(--ag-space-3xl) var(--ag-space-md)` (64px 16px)
- **Form column**: `max-width: var(--ag-content-narrow)` (300px), centered
- **Text alignment**: center for heading and invitation text; form inputs left-aligned within the narrow column

### Content Hierarchy
1. **Section heading** — Cormorant Garamond 600, `--ag-type-section`, `--ag-gold`, centered. Letter-spaced (0.05em).
2. **Invitation text** — Lato 300, `--ag-type-body`, `--ag-text-secondary`, centered. 1–2 lines maximum.
3. **Form fields** — Underline-style inputs (transparent background, gold bottom border on focus). Labels use Lato 400, `--ag-type-small`, `--ag-text-muted`.
4. **Buttons** — Primary: `--ag-gradient-gold` background, `--ag-bg` text. Secondary: transparent with `--ag-divider` border, `--ag-cream` text.
5. **Decorative close** — 2 diyas flanking an ornamental rule, same treatment as Countdown section

### Form Field Styling

```css
/* Underline input — not boxed */
.ag-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ag-divider);
  color: var(--ag-text);
  font-family: var(--ag-font-body);
  font-weight: 300;
  font-size: 16px;                 /* Prevents iOS zoom */
  padding: var(--ag-space-sm) 0;   /* 12px 0 */
  width: 100%;
  transition: border-color 0.3s ease;
}
.ag-input:focus {
  outline: none;
  border-bottom-color: var(--ag-gold);
  box-shadow: 0 1px 0 0 var(--ag-gold);
}
.ag-input::placeholder {
  color: var(--ag-text-dim);
  font-weight: 300;
}

/* Primary button */
.ag-btn-primary {
  background: var(--ag-gradient-gold);
  color: var(--ag-bg);
  font-family: var(--ag-font-body);
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding: 14px 32px;
  border: none;
  min-height: 48px;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

/* Ghost button */
.ag-btn-ghost {
  background: transparent;
  color: var(--ag-cream);
  font-family: var(--ag-font-body);
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding: 14px 32px;
  border: 1px solid var(--ag-divider);
  min-height: 48px;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
```

### Background Treatment
- Base: `--ag-bg`
- `water-reflection.png` overlay at `opacity: 0.20`, `background-size: cover`, `z-index: var(--ag-z-bg)`
- The water shimmer is barely perceptible — enough to add texture without competing with form readability
- Behind the heading: a subtle `--ag-glow-gold` at ~10% for warmth

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `diya-3.png` | 36px | Left of center rule (below form) | `screen` | 0.40 |
| `diya-4.png` | 36px | Right of center rule (below form) | `screen` | 0.40 |
| `.ag-rule` with diamond | 80px | Centered between diyas | N/A | 0.6 |

### Spacing
- Heading to invitation text: `var(--ag-space-lg)` (24px)
- Text to form: `var(--ag-space-xl)` (32px)
- Between form fields: `var(--ag-space-lg)` (24px)
- Between buttons: `var(--ag-space-sm)` (12px)
- Form to diya row: `var(--ag-space-2xl)` (48px)

### Responsive
- Form: full width with 16px gutters on narrow viewports (max-width still 300px)
- Buttons: always full width within form column
- Input `font-size: 16px` mandatory (prevents iOS auto-zoom)
- All touch targets: min 48px tall

### Transition to Section 6
A `.ag-rule` thin gold line (120px), followed by `var(--ag-space-3xl)` (64px) spacing. The transition is quiet — moving from the interactive form to the contemplative personal notes.

---

## Section 6: Personal Notes

### Emotional Intent
Stillness. Reverence. This is the couple's personal blessing or message — the most intimate moment. The design recedes to let the words breathe. Maximum negative space. Minimum decoration.

### Layout Structure

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│  ┌─corner─┐                      │  gold-corner.png (TL only)
│  │        │                      │  70px, opacity 0.50
│  │                               │
│  │  "With love and blessings,    │  Cormorant Garamond 400 italic
│  │   we invite you to share      │  --ag-type-detail (18px)
│  │   in our joy as two           │  color: --ag-cream
│  │   families become one."       │  LEFT-ALIGNED
│  │                               │  max-width: 280px
│  │                               │
│  │          — Amrit & Preet      │  Lato 400, --ag-type-small
│  │                               │  --ag-text-muted
│  │                               │  right-aligned within block
│  │                               │
│  │                 └─corner─┘    │  gold-corner.png (BR only)
│  │                               │  70px, opacity 0.50
│  │                               │
│  │                               │
└──────────────────────────────────┘
```

### Layout Details
- **Display**: flex column
- **Padding**: `var(--ag-space-4xl) var(--ag-space-lg)` (96px 24px) — tallest non-hero section padding, wider gutters
- **Content block**: `max-width: 280px`, `margin-left: 32px` from section's left content edge
- **Text alignment**: LEFT-ALIGNED (deliberately breaking the center pattern)
- **Attribution line**: right-aligned within the content block's max-width

### Why Left-Aligned

After five centered event cards and a centered RSVP form, the left-aligned quote reads like a personal letter — intimate, handwritten, conversational. The asymmetry signals a shift in voice from formal announcement to personal warmth. The diagonal gold corners (top-left, bottom-right) reinforce this compositional tension.

### Content Hierarchy
1. **Quote/blessing text** — Cormorant Garamond 400 italic, `--ag-type-detail` (18px), `--ag-cream`. No quotation marks in the typography — the italic and the diagonal framing communicate "quote."
2. **Attribution** — Lato 400, `--ag-type-small`, `--ag-text-muted`. Preceded by an em dash. Right-aligned within the text block.

### Background Treatment
- `--ag-bg-deep` (#0A0E16) — the darkest background in the entire template
- A `--ag-glow-gold` positioned behind the text block at approximately 8% opacity, `width: 240px`, `height: 240px`. A whisper of warmth in the darkness.
- No image backgrounds. No water. Pure darkness.

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `gold-corner.png` (TL) | 70px | Top-left of content area, 0 inset | `screen` | 0.50 |
| `gold-corner.png` (BR) | 70px | Bottom-right of content area, 0 inset | `screen` | 0.50 |

Only TWO corners, not four. The diagonal placement creates visual tension and frames the text without enclosing it. The top-left corner anchors the start of reading; the bottom-right closes the quote.

No dividers, no rules, no garlands within the section. Pure negative space around the text.

### Spacing
- Content block offset: `margin-left: 32px` from the section's left padding edge
- Quote text to attribution: `margin-top: var(--ag-space-lg)` (24px)
- Total section height: determined by content + 96px top/bottom padding

### Responsive
- On viewports below 375px: `margin-left: 24px`, max-width reduces to 260px
- Gold corners: 55px on viewports below 375px
- Text remains left-aligned at all widths

### Transition to Section 7
No explicit divider. The `--ag-bg-deep` darkness of Personal Notes transitions to the water-reflection Closing via a `--ag-gradient-fade-down` pseudo-element (48px tall) at the section's bottom edge, then `var(--ag-space-2xl)` (48px) of space before the Closing section.

---

## Section 7: Closing

### Emotional Intent
Warmth and gratitude. The water reflection returns as the template's closing visual signature — golden light on dark water, mirroring the reference video's final moments. The viewer leaves with a sense of beauty and completeness.

### Layout Structure

```
┌──────────────────────────────────┐
│                                  │
│  ~~~~~~~~ water-reflection ~~~~~  │  water-reflection.png
│  ~~~~~~~~ at 40% opacity ~~~~~~  │  opacity: 0.35–0.40
│                                  │  background-size: cover
│         A M R I T                │
│              &                   │  Cinzel Decorative 700
│         P R E E T                │  --ag-type-names (smaller than hero)
│                                  │  color: --ag-gold
│        12 . 03 . 2027           │  Lato 400, --ag-type-label
│                                  │  --ag-text-muted
│       #AmritWedsPreet            │  Lato 400, --ag-type-body
│                                  │  color: --ag-gold
│                                  │
│     🪔       🪔       🪔         │  3 diyas in a row
│                                  │  32px each, screen blend
│         ──── ◇ ────              │  .ag-rule-ornate
│                                  │
│        Designed by               │  DesignedByFooter component
│       Shaadi Invites             │  (shared, unchanged)
│                                  │
└──────────────────────────────────┘
```

### Layout Details
- **Display**: flex column, `align-items: center`
- **Padding**: `var(--ag-space-2xl) var(--ag-space-md) var(--ag-space-xl)` (48px 16px 32px)
- **Content container**: centered, no max-width (content is short)
- **Text alignment**: center

### Content Hierarchy
1. **Couple names** — Cinzel Decorative 700, `--ag-type-names`, `--ag-gold`. Smaller than hero. Uppercase.
2. **Ampersand** — Cormorant Garamond 400 italic, `--ag-text-secondary`
3. **Date** — Lato 400, `--ag-type-label`, `--ag-text-muted`, dot-separated
4. **Hashtag** — Lato 400, `--ag-type-body`, `--ag-gold`. No `#` styling beyond the text itself.
5. **Diya row** — 3 diya PNGs, horizontal flex
6. **Ornamental rule** — `.ag-rule-ornate` with diamond
7. **DesignedByFooter** — shared component, renders last

### Background Treatment
- Base: `--ag-bg`
- `water-reflection.png` at `opacity: 0.35–0.40`, `background-size: cover`, `z-index: var(--ag-z-bg)`
- At the top edge of this section: a `--ag-gradient-fade-up` pseudo-element (64px tall) that transitions from the Personal Notes darkness into the water texture
- The water reflection is the strongest it appears anywhere (highest opacity) — this is the resolution of the water motif

### Decorative Elements
| Element | Size | Position | Blend | Opacity |
|---------|------|----------|-------|---------|
| `diya-1.png` | 32px | Left in diya row | `screen` | 0.50 |
| `diya-2.png` | 32px | Center in diya row | `screen` | 0.50 |
| `diya-3.png` | 32px | Right in diya row | `screen` | 0.50 |

Diya row: flex, `gap: var(--ag-space-xl)` (32px), centered.

### Spacing
- Name lines: `gap: var(--ag-space-xs)` (8px)
- Names to date: `margin-top: var(--ag-space-sm)` (12px)
- Date to hashtag: `margin-top: var(--ag-space-md)` (16px)
- Hashtag to diya row: `margin-top: var(--ag-space-2xl)` (48px)
- Diya row to ornamental rule: `margin-top: var(--ag-space-lg)` (24px)
- Ornamental rule to footer: `margin-top: var(--ag-space-lg)` (24px)

### Responsive
- Names scale via `clamp()` on `--ag-type-names`
- Diya row: reduce gap to 24px on viewports below 375px

### Section End
This is the final section. No transition needed. The template ends with the DesignedByFooter component and the water reflection texture fading into darkness at the edges.

---

## Complete Scroll Sequence Summary

| # | Section | Layout Signature | Framing | Height |
|---|---------|-----------------|---------|--------|
| 1 | Hero | Full-viewport immersive video | Arch border bottom | 100svh |
| 2 | Couple | Centered vertical axis, formal | Gold corners x4 | Content-driven (~500px) |
| 3 | Countdown | Compact horizontal strip | Diyas flanking rule | Compact (~200px) |
| 4 | Celebrations | Staggered B-A-C-A-B cards | Per-event (card/frame/feature) | Tall (~2000px for 5 events) |
| 5 | RSVP | Narrow centered form | Water reflection bg | Content-driven (~600px) |
| 6 | Personal Notes | Left-aligned quote, diagonal corners | Gold corners x2 (TL, BR) | Content-driven (~400px) |
| 7 | Closing | Centered footer with water | Diya row + rule | Compact (~350px) |

Each section has a distinct compositional strategy. No two sections share the same framing approach or the same text alignment pattern.

# Kerala Dawn -- Section Blueprints

> Detailed layout and element specifications for each of the 6 sections.
> All measurements target the 402px phone viewport. Desktop renders inside InvitationViewport at the same dimensions.
> References to styles (e.g., `kd-names`) map to the Design Bible typography table.
> References to colors (e.g., `--kd-lamp-gold`) map to the Design Bible CSS custom properties.

---

## Section 1: Opening

### Concept
The guest opens to a dark, nearly black screen. A cinematic video of the Kerala mandapam scene plays in the background. A pulsing four-pointed star invites interaction. On tap, the video plays showing oil lamps progressively illuminating the mandapam. Before the video ends, the couple's names and wedding date materialize in the sky area of the video. After the reveal, the view auto-scrolls to the next section.

### Layout

```
+------------------------------------------+
|                                          |
|        (Full-bleed video background)     |  100svh
|                                          |
|                                          |
|         [Groom Name]                     |  Appears after video ~80%
|              &                           |
|         [Bride Name]                     |
|                                          |
|         [Wedding Date]                   |
|                                          |
|                                          |
|              *                           |  Pulsing star CTA (before tap)
|                                          |
+------------------------------------------+
```

### Dimensions
- Width: 100%
- Height: 100svh (full screen)
- Padding: 0 (full bleed)
- `overflow: hidden`

### Background Layers (bottom to top)
1. **Solid fallback**: `background-color: #050D0B`
2. **Poster image**: `kerala-poster.webp` -- a still from approximately frame 5 of the video (fully lit mandapam). `object-fit: cover`, `object-position: center 60%`
3. **Video element**: `kerala.mp4`, `preload="metadata"`, muted, `playsinline`, `poster` set to the poster image. Absolutely positioned to fill section. `object-fit: cover`, `object-position: center 60%`
4. **Gradient overlay** (always present): Linear gradient top-to-bottom:
   - `rgba(5,13,11, 0.3)` at 0%
   - `transparent` at 30%
   - `transparent` at 70%
   - `rgba(5,13,11, 0.5)` at 100%
   This darkens the sky and ground areas to ensure text legibility.
5. **Vignette overlay**: Radial gradient, `transparent` at center 40%, `rgba(5,13,11, 0.6)` at edges.

### Elements

#### Video (`<video>`)
- Position: `absolute`, inset 0
- Sizing: `width: 100%; height: 100%; object-fit: cover`
- `object-position: center 60%` (keeps mandapam visible, not cut off)
- Initially paused. `canplay` event listener to retry `play()` with poster fallback
- `z-index: 1`

#### Touch CTA Container
- Position: `absolute`, bottom 60px, left 50%, transform translateX(-50%)
- `z-index: 10`
- Visible only before tap (hidden after video starts playing)
- `display: flex; flex-direction: column; align-items: center; gap: 12px`

#### Four-Pointed Star Icon
- SVG, 24x24px
- Fill: `--kd-kasavu-light`
- Animation: `kd-pulse-glow` -- 3s infinite ease-in-out
  - Opacity oscillates 0.7 to 1.0
  - Box-shadow pulses from subtle to bright (see Design Bible glow specs)
- `cursor: pointer`

#### "Touch to Begin" Text
- Style: `kd-cta-glow` (Outfit 300, 13px, 0.16em spacing, uppercase)
- Color: `--kd-kasavu-light`
- Same pulse animation as the star (synced)

#### Name Reveal Container
- Position: `absolute`, top 18%, left 0, right 0
- `z-index: 10`
- `text-align: center`
- `padding: 0 var(--kd-space-8)` (32px sides)
- Hidden until video reaches approximately 80% duration

#### Groom Name
- Style: `kd-names` (Cormorant Garamond 300, 52px, `--kd-kasavu`)
- `text-shadow: var(--kd-glow-text)` -- the warm glow makes names float above the dark video
- Reveal: fade-up animation, 800ms, `--kd-ease-reveal`
- Appears first

#### Ampersand "&"
- Style: `kd-names-ampersand` (Cormorant Garamond 300 italic, 36px, `--kd-lamp-gold`)
- `margin: 8px 0`
- Reveal: fade-up, 800ms, delayed 400ms after groom name

#### Bride Name
- Style: `kd-names` (same as groom)
- `text-shadow: var(--kd-glow-text)`
- Reveal: fade-up, 800ms, delayed 800ms after groom name

#### Wedding Date
- Style: `kd-hero-date` (Outfit 300, 16px, 0.20em spacing, uppercase, `--kd-kasavu-light`)
- `margin-top: 20px`
- `opacity: 0.85`
- Reveal: fade-up, 800ms, delayed 1200ms after groom name

### Interactive States

- **Before tap**: Star pulses, video shows poster (or first frame if loaded). Touch CTA visible.
- **On tap**: CTA fades out (200ms). Video begins playing. Star disappears.
- **Video ~80%**: Name reveal sequence begins. Names appear with staggered fade-up.
- **Video end / Name reveal complete**: 1.5s pause, then auto-scroll to Section 2. If user scrolls manually before auto-scroll, cancel auto-scroll.

### Connection to Next Section
- The bottom of the Opening section has a 40px `kd-water-transition` zone: a gradient from transparent to `--kd-teal-black`. This creates a visual "reflection in water" dissolve into the Couple section.
- The Section 2 background begins at `--kd-teal-black`, creating a seamless transition.

---

## Section 2: Couple & Family

### Concept
The first "lit" section. The kasavu border frames the entire section like a formal invitation card. Inside, a temple gopuram silhouette watermark hovers behind the heading. The groom's family and bride's family are presented in two blocks separated by a nilavilakku divider. Elephant corner motifs reinforce the Kerala identity. The background is dark teal-green with a warm gold haze at center.

### Layout

```
+==========================================+
||  [elephant]                  [elephant] ||  Kasavu frame with corner elephants
||                                         ||
||        ~ jasmine garland ~              ||
||                                         ||
||      THE FAMILIES INVITE YOU            ||  Section subtitle
||             TO THE                      ||
||      WEDDING CELEBRATION OF             ||
||                                         ||
||    ----[gopuram watermark]----          ||
||                                         ||
||          Son of                         ||
||     [Father Name]                       ||
||              &                          ||
||     [Mother Name]                       ||
||                                         ||
||       [GROOM FULL NAME]                 ||
||                                         ||
||    ---[nilavilakku divider]---          ||
||                                         ||
||          Daughter of                    ||
||     [Father Name]                       ||
||              &                          ||
||     [Mother Name]                       ||
||                                         ||
||       [BRIDE FULL NAME]                 ||
||                                         ||
||        ~ jasmine garland ~              ||
||                                         ||
||  [elephant]                  [elephant] ||
+==========================================+
```

### Dimensions
- Width: 100%
- Height: auto (content-driven)
- Padding: `64px 32px`
- Content max-width: `340px`, centered

### Background Layers
1. **Base gradient**: `linear-gradient(180deg, #0A1F1C 0%, #0F2A24 40%, #142E1F 80%, #1A3418 100%)`
2. **Gold haze**: `radial-gradient(ellipse 100% 60% at 50% 20%, rgba(212,162,54,0.04) 0%, transparent 70%)`
3. **Film grain overlay**: `::after` pseudo-element with noise SVG at 0.03 opacity
4. **Section transition shadow**: `box-shadow: 0 -20px 40px rgba(0,0,0,0.3)` (shadow falling from this section onto the one above, visible during scroll)

### Kasavu Frame
- Position: `relative` on the main content container
- Outer border: `1px solid rgba(212,162,54, 0.30)`
- Inner border (via `::before`): `1px solid rgba(212,162,54, 0.50)`, inset 8px
- Pattern zone: An SVG `<rect>` with the kasavu diamond pattern fill, positioned between outer and inner borders. Height: 12px, running along all four sides.
- Corner ornaments: 28x28px lotus-bud SVGs at each corner intersection
- The frame has `padding: 40px 24px` inside the inner border
- **Elephant corner motifs**: 40x48px elephant silhouettes, positioned in each corner of the frame, overlapping the kasavu border by about 8px. `opacity: 0.15`. Top-left and bottom-left face right; top-right and bottom-right face left (mirrored).

### Elements

#### Jasmine Garland (Top)
- Positioned just inside the kasavu frame top
- Width: 200px, centered
- SVG path: gentle catenary arc with 12 flower circles
- Color: `--kd-kasavu-light` at 0.3 opacity
- `margin-bottom: 24px`

#### Section Heading
- Text: "The Families Invite You to the Wedding Celebration of"
- Split into lines for styling control:
  - "The Families Invite You" -- `kd-section-subtitle` style (Outfit 300, 13px, 0.18em, uppercase, `--kd-kasavu-light`)
  - "to the" -- same style, `margin: 4px 0`
  - "Wedding Celebration of" -- same style
- `text-align: center`
- `margin-bottom: 40px`
- Reveal: single fade-up as a block

#### Gopuram Watermark
- Position: `absolute`, centered behind the heading text
- Temple gopuram SVG, 48x96px
- `opacity: 0.05`
- `--kd-lamp-gold`
- `z-index: 0` (behind text)

#### Groom's Family Block
- `text-align: center`
- `margin-bottom: 12px`

  **"Son of"**:
  - Style: `kd-family-label` (Outfit 500, 11px, 0.14em, uppercase, `--kd-gold-pale`)
  - `margin-bottom: 8px`

  **Father's Name**:
  - Style: `kd-family-name` (Cormorant Garamond 500, 22px, `--kd-kasavu`)

  **"&"**:
  - Cormorant Garamond 400 italic, 18px, `--kd-gold-pale`
  - `margin: 4px 0`

  **Mother's Name**:
  - Style: `kd-family-name`

  **Groom Full Name**:
  - Style: `kd-person-name` (Cormorant Garamond 600, 28px, `--kd-kasavu`)
  - `margin-top: 16px`
  - `text-shadow: var(--kd-glow-text)` (subtle, since background is dark)

#### Nilavilakku Divider
- Centered. Total width: 200px
- Left line: 80px wide, 1px, `--kd-lamp-gold` at 0.3, vertically centered
- Center: `kd-lamp-icon` SVG, 24px height, `--kd-lamp-gold`
- Right line: same as left
- Gap between line and lamp: 8px
- `margin: 32px auto`
- Reveal: fade-up, separate from family blocks

#### Bride's Family Block
- Identical structure to Groom's block but with "Daughter of"
- `margin-top: 12px`

#### Jasmine Garland (Bottom)
- Same as top garland
- `margin-top: 24px`

### Interactive States
- All elements reveal on scroll-into-view
- Reveal order: Garland top (0ms) -> Heading (120ms) -> Groom block (240ms) -> Divider (360ms) -> Bride block (480ms) -> Garland bottom (600ms)
- Kasavu frame border fades in from 0 to target opacity over 800ms as section enters viewport

### Connection to Next Section
- The bottom of this section's gradient ends at `#1A3418` (paddy dark)
- Section 3 (Countdown) opens with a `radial-gradient` centered on `#0F1A14`, creating a slight darkening that feels like stepping into a quieter room. The color shift is subtle (green-dark to a neutral dark) -- a breath between decorated sections.

---

## Section 3: Countdown

### Concept
A minimal, contemplative pause. The background is the darkest since the Opening -- a deep, still void with a single nilavilakku at center casting a warm glow. Below the lamp, a live countdown ticks in golden numerals. This section is deliberately sparse: the lamp and the numbers, nothing more. It represents the quiet anticipation before the celebration begins.

### Layout

```
+------------------------------------------+
|                                          |
|          [kasavu strip - top]            |
|                                          |
|                                          |
|                                          |
|            [Nilavilakku SVG]             |  48px, centered, with glow
|                                          |
|          COUNTING THE MOMENTS            |  Subtitle
|                                          |
|       [DD]  [HH]  [MM]  [SS]            |  Countdown grid
|       Days  Hours  Mins  Secs            |
|                                          |
|                                          |
|          [kasavu strip - bottom]         |
|                                          |
+------------------------------------------+
```

### Dimensions
- Width: 100%
- Height: auto, min-height 70svh (shorter than Opening, but substantial)
- Padding: `80px 32px`
- Content: centered, max-width 340px
- `display: flex; flex-direction: column; align-items: center; justify-content: center`

### Background Layers
1. **Base**: `radial-gradient(ellipse 80% 80% at 50% 50%, #0F1A14 0%, #0A1510 100%)` -- dark, warm-neutral
2. **Lamp glow**: `radial-gradient(ellipse 50% 40% at 50% 35%, rgba(212,162,54,0.05) 0%, transparent 60%)` -- warm center glow behind the lamp
3. **Vignette**: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(5,13,11,0.5) 100%)`
4. **Film grain**: same as other sections, 0.03 opacity

### Elements

#### Kasavu Strip (Top)
- Width: 240px, centered
- Height: 12px
- The kasavu diamond pattern SVG rendered as a horizontal band
- Outer lines: 1px `--kd-lamp-gold` at 0.25
- `margin-bottom: 48px`

#### Nilavilakku SVG (Hero)
- `kd-lamp-hero` variant: 48px height
- Color: `--kd-lamp-gold`
- `filter: drop-shadow(0 0 16px rgba(212,162,54,0.3))` -- the warm lamp glow
- Centered
- `margin-bottom: 24px`
- Behind it: a `kd-lamp-silhouette` at 64px, 0.08 opacity, slightly offset down, creating a "light pool" shadow effect

#### Section Subtitle
- Text: "Counting the Moments"
- Style: `kd-section-subtitle` (Outfit 300, 13px, 0.18em, uppercase, `--kd-kasavu-light`)
- `margin-bottom: 40px`

#### Countdown Grid
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px`
- Total width: approximately 280px
- Each cell: `text-align: center`

  **Number**:
  - Style: `kd-countdown-number` (Cormorant Garamond 300, 48px, `--kd-lamp-gold`)
  - `text-shadow: var(--kd-glow-text)`
  - Tabular nums: `font-variant-numeric: tabular-nums` (prevents layout shift)
  - Updates every second via JS interval

  **Label**:
  - Style: `kd-countdown-label` (Outfit 400, 10px, 0.16em, uppercase, `--kd-gold-pale`)
  - `margin-top: 4px`

  **Separator**: Between each number cell, a subtle vertical line:
  - `1px solid rgba(212,162,54, 0.12)`
  - Height: 36px, vertically centered within the number area
  - Achieved via `border-right` on cells 1-3

#### Kasavu Strip (Bottom)
- Same as top strip
- `margin-top: 48px`

### Interactive States
- Countdown numbers update live. On reaching 0, display "The Celebration Has Begun" in `kd-blessing` style, replacing the countdown grid.
- Reveal: Lamp (0ms) -> Subtitle (120ms) -> Countdown grid (240ms) -> Kasavu strips (simultaneous with lamp)

### Connection to Next Section
- Bottom background color: `#0A1510` (deep dark)
- Section 4 (Celebrations) begins with `#1A3418` and warms into `#2D5A27`. The jump from dark neutral to dark green is noticeable -- the dawn is progressing. A thin 1px `--kd-lamp-gold` at 0.1 line spans the full width at the transition point, acting as a threshold marker.

---

## Section 4: Celebrations

### Concept
The liveliest section. The background has warmed to deep paddy green, suggesting dawn light reaching the rice fields. Each event (Mehendi, Haldi, Wedding, Reception, etc.) is presented on a banana-leaf-shaped card. Between cards, elephant dividers reinforce the Kerala festive spirit. The number of events is variable (1-6). Coconut palm silhouettes flank the section edges as atmospheric background elements.

### Layout

```
+------------------------------------------+
|  [palm]                          [palm]  |  Background watermarks
|                                          |
|          [kasavu strip]                  |
|                                          |
|            CELEBRATIONS                  |  Section title
|       Join us for the festivities        |  Subtitle
|                                          |
|     +--[banana leaf card 1]--+           |
|     |                        |           |
|     |    [Event Title]       |           |
|     |    [Date]              |           |
|     |    [Time]              |           |
|     |    [Venue]             |           |
|     |    [Address]           |           |
|     |  [lotus]        [lotus]|           |
|     +------------------------+           |
|                                          |
|      [elephant] <> [elephant]            |  Elephant divider
|                                          |
|     +--[banana leaf card 2]--+           |
|     |         ...            |           |
|     +------------------------+           |
|                                          |
|      [elephant] <> [elephant]            |
|                                          |
|     +--[banana leaf card N]--+           |
|     |         ...            |           |
|     +------------------------+           |
|                                          |
|          [kasavu strip]                  |
|                                          |
+------------------------------------------+
```

### Dimensions
- Width: 100%
- Height: auto (variable based on event count)
- Padding: `64px 32px`
- Content max-width: `340px`, centered

### Background Layers
1. **Base gradient**: `linear-gradient(180deg, #1A3418 0%, #1E4A2A 35%, #245A2E 65%, #2D5A27 100%)`
2. **Gold haze**: `radial-gradient(ellipse 100% 50% at 50% 30%, rgba(212,162,54,0.07) 0%, transparent 70%)`
3. **Film grain**: 0.03 opacity

### Background Watermarks: Coconut Palms
- Two coconut palm SVGs, one at left edge, one at right edge
- Left palm: `position: absolute; left: -20px; top: 15%`, 140px tall, `opacity: 0.06`, `--kd-paddy-dark`
- Right palm: `position: absolute; right: -15px; top: 55%`, 120px tall, `opacity: 0.06`, mirrored horizontally
- `pointer-events: none; z-index: 0`
- These are subtle atmospheric elements, barely visible but adding organic depth

### Elements

#### Kasavu Strip (Top)
- Same as Countdown strips: 240px wide, 12px tall, centered
- `margin-bottom: 32px`

#### Section Title
- Text: "Celebrations"
- Style: `kd-section-title` (Cormorant Garamond 600, 32px, 0.03em, `--kd-lamp-gold`)
- `text-align: center`
- `text-shadow: var(--kd-glow-text)`
- `margin-bottom: 8px`

#### Section Subtitle
- Text: "Join us for the festivities"
- Style: `kd-section-subtitle` (Outfit 300, 13px, 0.18em, uppercase, `--kd-kasavu-light`)
- `text-align: center`
- `margin-bottom: 40px`

#### Banana Leaf Event Card
- **Container**: `position: relative; width: 100%; max-width: 300px; margin: 0 auto`
- **Leaf SVG (background)**: The banana leaf shape as a clipping/background element
  - Fill: `--kd-deep-moss` (`#0D2318`)
  - Central vein: `--kd-paddy` at 0.15
  - Side veins (6-8): angled lines from central vein to edge, `--kd-paddy` at 0.10
  - Outer stroke: 1px `--kd-lamp-gold` at 0.15
  - `border-radius: 50% / 8%` as a CSS approximation, or use `clip-path` from the SVG
- **Card shadow**: `var(--kd-shadow-card)` applied to the container
- **Inner padding**: `48px 28px 40px 28px` (more top for leaf tip area, generous sides)

  **Lotus Corner (top-left)**:
  - 16x16px lotus SVG, `--kd-lamp-gold` at 0.2
  - Positioned `top: 32px; left: 20px` (inside the leaf safe area)

  **Lotus Corner (bottom-right)**:
  - Same, positioned `bottom: 28px; right: 20px`

  **Event Date**:
  - Style: `kd-event-date` (Outfit 300, 12px, 0.12em, uppercase, `--kd-gold-pale`)
  - `text-align: center`
  - `margin-bottom: 8px`

  **Event Title**:
  - Style: `kd-event-title` (Cormorant Garamond 600, 22px, `--kd-lamp-gold`)
  - `text-align: center`
  - Max 40 characters, same scaling logic as names
  - `margin-bottom: 16px`

  **Thin gold line divider**:
  - 40px wide, 1px, `--kd-lamp-gold` at 0.25, centered
  - `margin-bottom: 16px`

  **Time**:
  - Style: `kd-event-detail` (Outfit 400, 14px, `--kd-kasavu-light`)
  - `text-align: center`
  - Icon: small clock SVG (12px) inline before text, `--kd-gold-pale` at 0.5

  **Venue Name**:
  - Style: `kd-event-detail`
  - Max 60 characters
  - `margin-top: 8px`

  **Address**:
  - Style: `kd-body-small` (Outfit 300, 13px, `--kd-kasavu-light` at 0.7)
  - Max 100 characters
  - `margin-top: 4px`

#### Elephant Divider (Between Cards)
- Centered between cards
- `margin: 24px auto`
- Two mirrored elephant SVGs (`kd-elephant-divider`, 20x24px each)
- Left elephant faces right, right elephant faces left
- Between them: a 4px diamond shape in `--kd-lamp-gold` at 0.2
- Gap between each elephant and diamond: 6px
- Total width: approximately 56px

#### Kasavu Strip (Bottom)
- Same as top strip
- `margin-top: 32px`

### Responsive: Variable Event Count
- **1 event**: Single card, no elephant divider
- **2-3 events**: Cards stack with elephant dividers between each
- **4-6 events**: Same stacking. Section height grows naturally. Palm watermarks maintain their percentage positions, so they always frame the visible portion.

### Interactive States
- Cards reveal on scroll: each card fade-up individually, staggered by 200ms
- Elephant dividers fade in simultaneously with the card below them
- Hover (desktop only, inside InvitationViewport): Card gently lifts -- `transform: translateY(-2px)`, `box-shadow` increases to `0 8px 32px rgba(0,0,0,0.50)`

### Connection to Next Section
- Bottom gradient ends at `#2D5A27` (fullest green)
- Section 5 (RSVP) returns to a darker `#0D1B16`, creating a deliberate cooling -- the practical RSVP form needs a calmer, more focused background. The transition feels like stepping from the festive outdoor space into a quieter indoor room.

---

## Section 5: RSVP

### Concept
A clean, focused form on a dark background. The festive energy of Celebrations settles into composed quietness. Kasavu accents (strips at top and bottom) maintain continuity. The form itself is minimal: name, attendance count, dietary preference (optional), and a submit button. The dark background with warm accents makes the gold button feel inviting rather than formal.

### Layout

```
+------------------------------------------+
|                                          |
|          [kasavu strip]                  |
|                                          |
|          KINDLY RESPOND                  |  Section title
|       We would love to hear              |  Subtitle
|            from you                      |
|                                          |
|     +----------------------------+       |
|     |  Your Name                 |       |  Input field
|     +----------------------------+       |
|                                          |
|     +----------------------------+       |
|     |  Number of Guests    [-][+]|       |  Stepper input
|     +----------------------------+       |
|                                          |
|     +----------------------------+       |
|     |  Dietary Requirements      |       |  Optional textarea
|     |  (optional)                |       |
|     +----------------------------+       |
|                                          |
|     [   Will Attend   ] [  Regret  ]     |  Two buttons
|                                          |
|          [kasavu strip]                  |
|                                          |
+------------------------------------------+
```

### Dimensions
- Width: 100%
- Height: auto
- Padding: `64px 32px`
- Content max-width: `340px`, centered

### Background Layers
1. **Base gradient**: `linear-gradient(180deg, #0D1B16 0%, #0F2218 50%, #142E1F 100%)`
2. **Subtle haze**: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,162,54,0.06) 0%, transparent 70%)`
3. **Film grain**: 0.03 opacity

### Elements

#### Kasavu Strip (Top)
- 240px, 12px, centered
- `margin-bottom: 32px`

#### Section Title
- Text: "Kindly Respond"
- Style: `kd-section-title` (Cormorant Garamond 600, 32px, `--kd-lamp-gold`)
- `text-align: center`
- `margin-bottom: 8px`

#### Section Subtitle
- Text: "We would love to hear from you"
- Style: `kd-section-subtitle` (Outfit 300, 13px, 0.18em, uppercase, `--kd-kasavu-light`)
- `text-align: center`
- `margin-bottom: 40px`

#### Form Container
- `display: flex; flex-direction: column; gap: 20px`
- `width: 100%`

#### Input: Your Name
- **Label**: "Your Name" -- `kd-input-label` (Outfit 500, 12px, 0.08em, uppercase, `--kd-gold-pale`)
- **Label position**: Above input, `margin-bottom: 6px`
- **Input field**:
  - `width: 100%; height: 48px`
  - `background: rgba(42, 42, 42, 0.50)` (semi-transparent charcoal)
  - `border: 1px solid rgba(212,162,54, 0.20)`
  - `border-radius: 4px`
  - `padding: 0 16px`
  - Text: `kd-input-value` style
  - Placeholder: `kd-input-placeholder` style
  - `box-shadow: var(--kd-shadow-inset)`
  - `transition: border-color 200ms ease`

#### Input: Number of Guests
- **Label**: "Number of Guests" -- same label style
- **Stepper container**: `display: flex; align-items: center; height: 48px`
  - Same background and border as name input
  - **Minus button**: `width: 48px; height: 100%`, `--kd-kasavu-light` text, left side
  - **Number display**: `flex: 1; text-align: center`, `kd-input-value` style
  - **Plus button**: same as minus, right side
  - Buttons have `border-left` / `border-right` of `1px solid rgba(212,162,54, 0.15)`

#### Input: Dietary Requirements
- **Label**: "Dietary Requirements" with "(optional)" in `--kd-gold-pale` at 0.5
- **Textarea**:
  - `width: 100%; min-height: 80px; resize: vertical`
  - Same background, border, shadow as text input
  - `padding: 12px 16px`
  - Placeholder: "Any dietary restrictions or preferences"

#### Button Row
- `display: flex; gap: 12px; margin-top: 8px`
- Two buttons, each `flex: 1`

  **"Will Attend" (Primary)**:
  - `height: 48px; border-radius: 4px`
  - `background: var(--kd-lamp-gold)`
  - `color: var(--kd-teal-black)` -- dark text on gold
  - Style: `kd-button` (Outfit 500, 14px, 0.10em, uppercase)
  - `box-shadow: var(--kd-glow-button)`
  - `border: none`
  - `cursor: pointer`

  **"Regret" (Secondary)**:
  - Same dimensions
  - `background: transparent`
  - `border: 1px solid rgba(212,162,54, 0.30)`
  - `color: var(--kd-kasavu-light)`
  - Same typography

### Interactive States

**Input Focus**:
- `border-color: var(--kd-lamp-gold)` at 0.5
- `box-shadow: 0 0 0 2px rgba(212,162,54, 0.10)` (subtle focus ring)

**Primary Button Hover**:
- `background: var(--kd-gold-bright)` (`#E8B84A`)
- `box-shadow: 0 0 16px rgba(212,162,54,0.30), 0 2px 8px rgba(0,0,0,0.30)`
- `transform: translateY(-1px)`

**Primary Button Active**:
- `background: var(--kd-gold-dim)` (`#A67E28`)
- `transform: translateY(0)`

**Secondary Button Hover**:
- `border-color: var(--kd-lamp-gold)` at 0.5
- `background: rgba(212,162,54, 0.06)`

**Stepper Buttons Hover**:
- Background tints to `rgba(212,162,54, 0.08)`

**Submit Success**:
- Button text changes to "Thank You" with a check icon
- Button background becomes `--kd-paddy` (`#2D5A27`)
- 2s display, then revert (or stay if no further interaction)

### Connection to Next Section
- Bottom gradient ends at `#142E1F`
- Section 6 (Closing) begins at `#2D5A27` and warms dramatically. This is the most significant color jump in the template -- from a restrained dark green to a warm, golden-washed green. It signals that dawn has arrived.

---

## Section 6: Closing

### Concept
Dawn has arrived. This is the warmest, most luminous section. The background is the lightest green suffused with golden radiance -- as if the first rays of sun are hitting the paddy fields. A large lotus motif glows behind the blessing text. The section conveys completion, warmth, and blessing. Lotus dividers replace elephants. The kasavu frame returns but rendered warmer. The overall feeling: the night journey is complete, the lamp has done its work, and the day -- and the marriage -- begins.

### Layout

```
+==========================================+
||                                         ||  Kasavu frame (warm variant)
||                                         ||
||        ~ lotus divider ~                ||
||                                         ||
||       WITH LOVE AND BLESSINGS           ||  Section subtitle
||                                         ||
||     [lotus watermark - large]           ||  80px, 0.08 opacity
||                                         ||
||     "May the light that brought         ||  Blessing text (editable)
||      us together continue to            ||
||      guide your journey as one."        ||
||                                         ||
||        ~ lotus divider ~                ||
||                                         ||
||        [Groom] & [Bride]                ||  Couple names, smaller
||        [Wedding Date]                   ||
||                                         ||
||                                         ||
||        [Nilavilakku icon]               ||  Final lamp, golden glow
||                                         ||
||                                         ||
||  Made with love by Shaadi Invites       ||  Attribution (tiny)
||                                         ||
+==========================================+
```

### Dimensions
- Width: 100%
- Height: auto, min-height: 80svh (generous to feel like a breath)
- Padding: `80px 32px`
- Content: centered, max-width 340px
- `display: flex; flex-direction: column; align-items: center; justify-content: center`

### Background Layers
1. **Base gradient**: `linear-gradient(180deg, #2D5A27 0%, #3A6830 40%, #4A7838 70%, #3A6830 100%)`
2. **Dawn warm wash**: `radial-gradient(ellipse 90% 50% at 50% 20%, rgba(212,162,54,0.20) 0%, rgba(212,118,58,0.06) 50%, transparent 100%)`
3. **Dawn pink tint**: `radial-gradient(ellipse 60% 30% at 50% 10%, rgba(232,160,118,0.08) 0%, transparent 100%)` -- a hint of pink-peach in the upper portion, like the sky at dawn
4. **Film grain**: 0.03 opacity (consistent across all sections)

### Kasavu Frame (Warm Variant)
- Same structural specification as Section 2's kasavu frame
- Color shift: outer border `--kd-lamp-gold` at **0.40** (warmer/brighter than Section 2's 0.30)
- Inner border: `--kd-lamp-gold` at **0.60**
- Pattern diamonds: `--kd-lamp-gold` at **0.15** (more visible)
- Corner ornaments: lotus-bud (same 28x28px) but at `--kd-lamp-gold` full color at 0.3
- No elephant corners -- the Closing section uses only floral motifs
- Frame padding: `48px 28px`

### Elements

#### Lotus Divider (Top)
- Centered lotus SVG (`kd-lotus-divider`, 32px)
- Flanking lines: 60px each side, 1px, `--kd-lamp-gold` at 0.3
- `margin-bottom: 24px`

#### Section Subtitle
- Text: "With Love and Blessings"
- Style: `kd-section-subtitle` (Outfit 300, 13px, 0.18em, uppercase, `--kd-kasavu-light`)
- `text-align: center`
- `margin-bottom: 32px`

#### Lotus Watermark
- Position: `absolute`, centered behind blessing text
- `kd-lotus-hero` variant: 80px
- `opacity: 0.08`, `--kd-lamp-gold`
- `z-index: 0`

#### Blessing Text
- Text: "May the light that brought us together continue to guide your journey as one." (editable via textOverrides)
- Style: `kd-blessing` (Cormorant Garamond 400 italic, 20px, 1.5 line-height, `--kd-kasavu`)
- `text-align: center`
- `max-width: 280px`
- `position: relative; z-index: 1` (above lotus watermark)
- `text-shadow: 0 0 40px rgba(212,162,54,0.12)` (faintest glow)
- `margin-bottom: 32px`

#### Lotus Divider (Bottom)
- Same as top divider
- `margin-bottom: 32px`

#### Couple Names (Reprise)
- `text-align: center`
- Groom & Bride names: Cormorant Garamond 500, 20px, `--kd-kasavu`
- "&" between: Cormorant Garamond 400 italic, 16px, `--kd-lamp-gold`
- Smaller than Opening names -- this is a gentle echo, not a headline
- `margin-bottom: 8px`

#### Wedding Date (Reprise)
- Style: `kd-hero-date` but at 14px (slightly smaller)
- `--kd-kasavu-light` at 0.8
- `margin-bottom: 40px`

#### Final Nilavilakku
- `kd-lamp-hero` variant: 48px, centered
- `--kd-lamp-gold`
- `filter: drop-shadow(0 0 20px rgba(212,162,54,0.35))` -- the strongest glow of any lamp in the template, signifying full dawn
- `margin-bottom: 40px`
- Behind it: a large radial gradient spot, 120px diameter, `rgba(212,162,54,0.10)` to transparent -- like the lamp is casting light into the environment

#### Attribution
- Text: "Made with love by Shaadi Invites"
- Style: Outfit 300, 10px, `--kd-gold-pale` at 0.4
- `text-align: center`
- `letter-spacing: 0.06em`
- Not part of the kasavu frame -- positioned below it with `margin-top: 24px`

### Interactive States
- All elements reveal on scroll with standard fade-up
- Reveal order: Lotus top (0ms) -> Subtitle (120ms) -> Blessing (240ms) -> Lotus bottom (360ms) -> Names (480ms) -> Date (600ms) -> Lamp (720ms)
- The lamp's glow has a very slow, gentle pulse (6s period, subtle -- opacity 0.30 to 0.40). This is the only animation in the section. It feels like a real oil lamp's flame gently flickering. Under reduced-motion, static.

### Connection (Terminal Section)
- This is the final section. No transition to the next.
- The bottom of the kasavu frame sits at least 40px from the viewport bottom edge (plus safe area padding).
- Background extends to the bottom of the viewport with the same gradient, giving a natural resting point.

---

## Cross-Section Visual Flow Summary

| From | To | Transition Mechanism |
|------|----|---------------------|
| Opening -> Couple | 40px water-transition gradient dissolve. Teal-black to teal-black. Seamless. |
| Couple -> Countdown | Gradient shifts green-dark to neutral-dark. Subtle cooling. 1px hairline at boundary optional. |
| Countdown -> Celebrations | Darkest to medium-green. Noticeable warmth increase. 1px gold hairline at `0.1` opacity. |
| Celebrations -> RSVP | Medium-green to dark. Deliberate cooling for form focus. Clean gradient merge. |
| RSVP -> Closing | Dark to warm golden-green. The biggest shift. Signals dawn arrival. No separator needed -- the color speaks. |

---

## Editable Text Map (Text IDs)

All editable text fields use the template's text ID format. Template ID for Kerala Dawn is TBD (assigned at registration). Placeholder: `t{id}`.

| Text ID | Section | Field | Default Text |
|---------|---------|-------|-------------|
| `t{id}.opening.groomName` | Opening | Groom name | "Arjun" |
| `t{id}.opening.brideName` | Opening | Bride name | "Devika" |
| `t{id}.opening.date` | Opening | Date display | "December 15, 2027" |
| `t{id}.couple.heading` | Couple | Section heading | "The Families Invite You to the Wedding Celebration of" |
| `t{id}.couple.groomParentLabel` | Couple | Groom parent label | "Son of" |
| `t{id}.couple.groomFather` | Couple | Groom father | "Mr. Krishnan Nair" |
| `t{id}.couple.groomMother` | Couple | Groom mother | "Mrs. Lakshmi Nair" |
| `t{id}.couple.groomName` | Couple | Groom full name | "Arjun Krishnan Nair" |
| `t{id}.couple.brideParentLabel` | Couple | Bride parent label | "Daughter of" |
| `t{id}.couple.brideFather` | Couple | Bride father | "Mr. Raghavan Menon" |
| `t{id}.couple.brideMother` | Couple | Bride mother | "Mrs. Priya Menon" |
| `t{id}.couple.brideName` | Couple | Bride full name | "Devika Raghavan Menon" |
| `t{id}.countdown.subtitle` | Countdown | Subtitle text | "Counting the Moments" |
| `t{id}.celebrations.title` | Celebrations | Section title | "Celebrations" |
| `t{id}.celebrations.subtitle` | Celebrations | Section subtitle | "Join us for the festivities" |
| `t{id}.rsvp.title` | RSVP | Section title | "Kindly Respond" |
| `t{id}.rsvp.subtitle` | RSVP | Section subtitle | "We would love to hear from you" |
| `t{id}.closing.subtitle` | Closing | Section subtitle | "With Love and Blessings" |
| `t{id}.closing.blessing` | Closing | Blessing text | "May the light that brought us together continue to guide your journey as one." |
| `t{id}.closing.attribution` | Closing | Attribution | "Made with love by Shaadi Invites" |

Event-specific text (title, time, venue, address) is driven by the celebrations data array, not static text IDs.

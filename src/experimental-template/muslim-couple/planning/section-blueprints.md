# Muslim Couple Template -- Section Blueprints

All layouts are mobile-first at `402px` base width. Content area = `354px` (402 - 48px gutter). All measurements reference the Design Bible tokens. CSS prefix: `mc-`.

---

## Section 1: Welcome / Entry Screen

### Visual Concept
A full-viewport cinematic moment. The reference video (`muslim-couple.mp4`) fills the screen -- a slow dolly through a Mughal palace garden at golden hour with the couple walking toward a sunset mosque. The screen is initially still (poster frame), with a frosted-glass "Tap to Open" button beckoning the guest. On tap, the video plays. As the video nears its end, the couple's names and date fade in word-by-word over the footage. After the video, a scroll indicator invites the guest downward.

### Layout (402px)

```
+------------------------------------------+
|  [Floral garland WebP - top edge]        |
|                                          |
|           (video fills 100vh)            |
|         muslim-couple.mp4                |
|         object-fit: cover                |
|         poster: first-frame.webp         |
|                                          |
|     -- Names overlay (top-center) --     |
|     ~100px from top                      |
|                                          |
|     AISHA                                |
|        &                                 |
|     FAIZAN                               |
|     December 20, 2025                    |
|                                          |
|                                          |
|                                          |
|                                          |
|     +------------------------------+    |
|     |    Tap to Open               |    |
|     |    (frosted glass pill)      |    |
|     +------------------------------+    |
|     positioned at 70% from top           |
|                                          |
|                            [Music btn]   |
|                            bottom-right  |
|                                          |
|     [Scroll indicator chevron]           |
|     bottom-center, animated              |
+------------------------------------------+
```

### Background Treatment
- The video IS the background. It covers 100% of the viewport (`object-fit: cover`).
- Behind the video (visible if video fails): `--mc-gradient-sky` (sunset sky gradient).
- Over the video: a subtle gradient overlay for text readability:
  ```css
  /* Top overlay for names */
  background: linear-gradient(
    180deg,
    rgba(42, 30, 18, 0.45) 0%,
    rgba(42, 30, 18, 0.15) 40%,
    transparent 60%
  );
  ```
  This gradient sits in a `position: absolute` overlay div, only covering the top half of the video.

### Foreground Decorative Elements
- **Floral garland corners**: Two WebP assets with transparency positioned at top-left and top-right of the viewport. These mirror the cascading floral canopy from the reference video. They are fixed during the entry sequence and do not scroll. Each approximately `160px` wide by `200px` tall. Colors: blush pink, white, sage green.
- **No other decorative elements on entry**: the video provides all visual richness.

### Typography
- **Couple names**: `--mc-font-display` (Cormorant Garamond 300, 40px). Color: `--mc-text-on-dark` (`#F5EDD6`). Centered. Each name on its own line.
- **Ampersand "&"**: Great Vibes `--mc-font-accent` (20px), `--mc-text-gold`. Centered between names.
- **Date**: `--mc-font-body` (Lato 400, 15px). Color: `--mc-text-on-dark`. Centered below names. Letter-spacing `0.08em` for elegance.
- Names + date appear via per-word stagger animation triggered by video `timeupdate`:
  - Stagger: `0.35s`
  - Duration: `1s`
  - Motion: `opacity: 0 -> 1`, `y: 20 -> 0` (per Master Rules Entry Screen Pattern)
  - Last word finishes `1 second` before video ends

### Tap to Open Button
- Position: centered horizontally, `70%` from viewport top
- Size: `auto` width (text-determined), `48px` height, `24px` border-radius (pill)
- Style: frosted glass (`--mc-glass` background, `backdrop-filter: blur(12px)`, `1px solid --mc-glass-border`)
- Text: "Tap to Open" in Lato 400, 15px, `--mc-text-on-dark`
- Shadow: `0 4px 20px rgba(42, 30, 18, 0.25)`
- Behavior: fades out on tap (300ms opacity to 0), then video begins playing
- Includes a subtle breathing scale animation: `scale(1) -> scale(1.03) -> scale(1)` at 2s cycle, `sine.inOut`

### Music Button
- Position: `right: calc(3% + 24px); bottom: calc(7.2% - 5px)` (per Master Rules)
- Size: `46px` circle
- Style: frosted glass, same as Tap to Open
- Icon: Musical note glyph, toggles to pause bars
- `<audio loop preload="auto">` element
- Persists across all sections (fixed position within the invitation viewport)

### Scroll Indicator
- Position: bottom-center, `32px` from bottom
- Design: a thin gold chevron (`--mc-gold`) pointing down, `24px` wide
- Animation: gentle vertical bounce, `translateY(0) -> translateY(6px) -> translateY(0)` at 1.5s cycle, `sine.inOut`
- Behavior: appears after all names/date text has faded in; fades to `opacity: 0` when user scrolls (triggered at 50px scroll, 400ms fade)
- `aria-hidden="true"` -- purely decorative

### Connection to Next Section
The entry screen is a hard boundary. When the user scrolls past it, the video section scrolls away normally (no pinning or parallax). The next section begins with ivory marble background and the Bismillah.

### Fallback Behavior
- Poster image: first frame of the video, extracted as WebP
- If video fails to load or exceeds 15 seconds: force text reveal (opacity + y animation triggers regardless)
- `canplay` event listener retries `play()` on the video

---

## Section 2: Family Details

### Visual Concept
An elegant formal presentation of both families, set on warm marble. The Bismillah sits at the very top of this section -- the spiritual opening of the invitation proper. Below it, the families are presented in two stacked blocks (Groom's family first, then Bride's family), each framed by a Mughal arch motif and gold borders. The section feels like opening a hand-lettered nikahnama -- formal, beautiful, personal.

### Layout (402px)

```
+------------------------------------------+
|                                          |
|  ~ ~ Bismillah (Arabic, Amiri) ~ ~      |
|  centered, --mc-text-gold                |
|  flanked by small arabesque ornaments    |
|                                          |
|  - - - gold divider line - - -           |
|                                          |
|  "Together with their families"          |
|  (Great Vibes, 20px, centered)           |
|                                          |
|  +------------------------------------+ |
|  |   [Small arch SVG frame - top]     | |
|  |                                    | |
|  |   "Son of"                         | |
|  |   (Lato caption, centered)         | |
|  |                                    | |
|  |   MR. AHMED KHAN                   | |
|  |   &                                | |
|  |   MRS. FATIMA KHAN                 | |
|  |   (Cormorant 400, gold text)       | |
|  |                                    | |
|  |   "request the honour of your      | |
|  |    presence at the wedding of      | |
|  |    their beloved son"              | |
|  |   (Lato 300, body text)            | |
|  |                                    | |
|  +------------------------------------+ |
|  gold 1px border, 16px border-radius    |
|                                          |
|  - - - small petal ornament - - -        |
|                                          |
|  +------------------------------------+ |
|  |   [Small arch SVG frame - top]     | |
|  |                                    | |
|  |   "Daughter of"                    | |
|  |                                    | |
|  |   MR. HASSAN ALI                   | |
|  |   &                                | |
|  |   MRS. NADIA ALI                   | |
|  |                                    | |
|  |   "request the honour of your      | |
|  |    presence at the wedding of      | |
|  |    their beloved daughter"         | |
|  |                                    | |
|  +------------------------------------+ |
|                                          |
|  - - - jali lattice divider strip - - -  |
+------------------------------------------+
```

### Background Treatment
- Base: `--mc-gradient-marble` (ivory to cream warmth)
- Overlay: `--mc-gradient-glow` (subtle warm radial vignette)
- A faint (`5%` opacity) 8-pointed star geometric pattern tile fills the full background behind the cards

### Foreground Decorative Elements
- **Bismillah frame**: Two small mirrored arabesque flourishes (SVG, `--mc-gold-light`) flanking the Bismillah text, approximately `40px` wide each
- **Arch motifs**: A simplified arch silhouette (SVG, `--mc-gold` at 15% opacity) centered above each family card, approximately `80px` wide by `50px` tall
- **Gold divider line**: Horizontal line between Bismillah and family content: `1px height`, `60%` width, centered, gradient from transparent to gold to transparent
- **Petal ornament**: Between the two family cards, 3 small rose petal SVGs arranged in a gentle cluster, centered, `--mc-rose` at 40% opacity
- **Corner arabesques**: Small arabesque scrollwork in the top-left and bottom-right corners of the section, each approximately `60px` square, `--mc-gold-light` at 20% opacity

### Family Cards
- Container: `width: 100%` (within gutter), `padding: 28px 20px`, `border: 1px solid var(--mc-gold)`, `border-radius: var(--mc-card-radius)`, `background: var(--mc-offwhite)`
- Shadow: Elevation 1 (`0 2px 12px var(--mc-shadow)`)
- Gap between cards: `--mc-card-gap` (24px), plus the petal ornament adds `16px` on each side

### Typography for This Section
- **Bismillah**: Amiri 400, `--mc-font-arabic-lg` (30px), `--mc-text-gold`, centered, `direction: rtl`, `lang="ar"`
- **"Together with their families"**: Great Vibes 400, 20px, `--mc-text-secondary`, centered
- **"Son of" / "Daughter of"**: Lato 400, `--mc-font-caption` (13px), `--mc-text-muted`, centered, letter-spacing `0.06em`
- **Parent names**: Cormorant Garamond 400, `--mc-font-h2` (22px), `--mc-text-gold`, centered
- **Ampersand between parents**: Lato 300, 15px, `--mc-text-secondary`
- **Invitation message**: Lato 300, `--mc-font-body-light` (15px), `--mc-text-secondary`, centered, max-width `30ch`

### Connection to Previous Section
Hard transition from entry video. The first visible element on scroll is a comfortable `56px` of ivory marble before the Bismillah appears.

### Connection to Next Section
Gradient bleed: bottom `60px` transitions from marble ivory to champagne. A horizontal jali lattice strip (SVG, `--mc-cream` on ivory, approximately `40px` tall, full width) bridges the two sections.

---

## Section 3: Countdown

### Visual Concept
The warmest section -- a champagne-toned panel that feels like the golden hour has concentrated here. A large animated countdown ticks toward the wedding date. The numbers are the star, displayed in large Cormorant Garamond display type with gold accents. Below the countdown, the exact date and time are stated plainly. The section has a meditative, anticipatory quality -- time itself is holding its breath.

### Layout (402px)

```
+------------------------------------------+
|                                          |
|  background: --mc-champagne              |
|  with --mc-gradient-glow overlay         |
|  and faint jali pattern at 4% opacity    |
|                                          |
|  "Counting the Days"                     |
|  (Cormorant 400, section title, gold)    |
|                                          |
|  [gold arabesque flourish, centered]     |
|                                          |
|  +------------------------------------+ |
|  |                                    | |
|  |   42    12    36    08             | |
|  |  Days   Hrs   Min   Sec           | |
|  |                                    | |
|  |  (Cormorant 300, 48px numbers)    | |
|  |  (Lato 400, 13px labels)          | |
|  |                                    | |
|  +------------------------------------+ |
|  frosted glass card, centered            |
|                                          |
|  "Saturday, December 20, 2025"           |
|  (Cormorant 400, 22px, gold)             |
|                                          |
|  "at half past four in the evening"      |
|  (Lato 300, 15px, secondary)             |
|                                          |
|  [pair of mirrored arabesque flourishes] |
|                                          |
+------------------------------------------+
```

### Background Treatment
- Base: `--mc-champagne` (`#E8D5C0`) solid fill
- Overlay: `--mc-gradient-glow` (warm radial gradient adding golden warmth to center)
- Texture: Jali lattice pattern SVG tile at `4%` opacity, `--mc-gold`, `background-size: 60px 60px`
- A very faint (`3%`) vignette of `--mc-gold` at edges darkens the periphery slightly

### Foreground Decorative Elements
- **Arabesque flourish**: Below the section title, a horizontal arabesque ornament (SVG, `--mc-gold`, approximately `120px` wide by `20px` tall, centered)
- **Lantern pair**: Two small lantern SVGs (`40px` tall) positioned at left and right edges of the countdown card, each with a subtle amber glow behind them (radial gradient, `--mc-gold` at 15% opacity)
- **Floating petals**: 3-4 rose petal SVGs scattered in the background at various rotations, `--mc-rose` at 20% opacity, with slow drift animation
- **Bottom flourishes**: A mirrored pair of arabesque ornaments below the date/time text, same style as the one below the title but smaller (`80px` wide)

### Countdown Card
- Container: `width: calc(100% - 16px)`, centered, `padding: 32px 16px`
- Style: frosted glass (`--mc-glass`, `backdrop-filter: blur(12px)`, `border: 1px solid var(--mc-glass-border)`, `border-radius: var(--mc-card-radius)`)
- Shadow: Elevation 2
- Layout: 4 columns (flexbox, `justify-content: space-around`)
- Each column: number on top, label below, centered

### Number Animation
- Numbers use `--mc-font-countdown` (Cormorant Garamond 300, 48px)
- Color: `--mc-text-primary` (`#3A2818`)
- Label text: Lato 400, 13px, `--mc-text-muted`, letter-spacing `0.04em`
- When a number changes, the outgoing digit scales down and fades (`scale(1) -> scale(0.8)`, `opacity: 1 -> 0`, 300ms) while the incoming digit scales up and fades in (`scale(1.2) -> scale(1)`, `opacity: 0 -> 1`, 300ms). This uses GSAP, transforming only `scale` and `opacity`.
- A small gold sparkle appears briefly at the changing number's position (4-pointed star SVG, 200ms flash)

### Typography for This Section
- **"Counting the Days"**: Cormorant Garamond 400, `--mc-font-h1` (28px), `--mc-text-gold`, centered
- **Countdown numbers**: Cormorant Garamond 300, `--mc-font-countdown` (48px), `--mc-text-primary`
- **Countdown labels**: Lato 400, `--mc-font-caption` (13px), `--mc-text-muted`, centered, letter-spacing `0.04em`
- **Date**: Cormorant Garamond 400, `--mc-font-h2` (22px), `--mc-text-gold`, centered
- **Time**: Lato 300, `--mc-font-body-light` (15px), `--mc-text-secondary`, centered

### Connection to Previous Section
Gradient bleed from ivory to champagne. Jali lattice strip from Family section bridges into the top of this section.

### Connection to Next Section
Gradient bleed from champagne to off-white. A pair of mirrored arabesque flourishes marks the boundary, centered, `--mc-gold` at 30% opacity.

---

## Section 4: Celebrations

### Visual Concept
A clean, organized presentation of all wedding events. Each event is a card with its own personality but unified by the same design language. The section has the most structured layout -- it is practical and informational, but still beautiful. Think of it as the pages of a guest's itinerary, each one a miniature composition. The background is the cleanest in the invitation (off-white) so the cards themselves carry the visual interest.

### Layout (402px)

```
+------------------------------------------+
|                                          |
|  background: --mc-offwhite               |
|                                          |
|  "Our Celebrations"                      |
|  (Cormorant 400, section title, gold)    |
|                                          |
|  [gold arabesque flourish, centered]     |
|                                          |
|  +------------------------------------+ |
|  |  [Lantern icon]  NIKAH             | |
|  |                                    | |
|  |  Saturday, December 20, 2025       | |
|  |  4:30 PM                           | |
|  |                                    | |
|  |  Grand Masjid Hall                 | |
|  |  123 Heritage Lane, Lucknow        | |
|  |                                    | |
|  |  [Maps]    [Calendar]              | |
|  |  (icon+text links, gold)           | |
|  +------------------------------------+ |
|                                          |
|  +------------------------------------+ |
|  |  [Lantern icon]  WALIMA            | |
|  |  ...                               | |
|  +------------------------------------+ |
|                                          |
|  +------------------------------------+ |
|  |  [Lantern icon]  MEHENDI           | |
|  |  ...                               | |
|  +------------------------------------+ |
|                                          |
|  (more cards as events dictate)          |
|                                          |
+------------------------------------------+
```

### Background Treatment
- Base: `--mc-offwhite` (`#FAF5EB`) solid fill
- Texture: Very faint (`3%` opacity) Islamic geometric star pattern tile, `--mc-cream`, `background-size: 100px 100px`
- No overlay gradient -- this section should feel clean and airy to let the cards breathe

### Event Card Design

Each event card:
- Container: `width: 100%` (within gutter), `padding: 24px 20px`, `border-radius: var(--mc-card-radius)`, `background: var(--mc-ivory)`
- Border: `1px solid var(--mc-gold)` at `30%` opacity (softer than Family cards)
- Shadow: Elevation 1
- Gap between cards: `--mc-card-gap` (24px)

#### Card Internal Layout
```
+------------------------------------------+
| [Lantern SVG 24px]  EVENT NAME           |  <-- Header row
|                     Cormorant 500, 18px  |
+------------------------------------------+
|                                          |
|  [Calendar icon 18px]  Date              |  <-- Date row
|                         Lato 400, 15px   |
|  [Clock icon 18px]     Time              |  <-- Time row
|                         Lato 400, 15px   |
|                                          |
|  [Pin icon 18px]  Venue Name             |  <-- Venue block
|                   Lato 400, 15px, bold   |
|                   Address line            |
|                   Lato 300, 13px          |
+------------------------------------------+
|  [Maps icon+label]    [Calendar+label]   |  <-- Action row
|  gold text, 13px      gold text, 13px    |
+------------------------------------------+
```

- Header row: flexbox, `align-items: center`, `gap: 10px`. Lantern SVG is `24px` square. Event name is Cormorant Garamond 500, `--mc-font-h3` (18px), `--mc-text-primary`.
- Date/time rows: flexbox, `align-items: center`, `gap: 8px`. Icons are `18px`, `--mc-gold`. Text is Lato 400, 15px, `--mc-text-primary`.
- Venue block: flexbox column under a pin icon. Venue name is Lato 400, 15px, `font-weight: 700`, `--mc-text-primary`. Address is Lato 300, 13px, `--mc-text-secondary`.
- Action row: flexbox, `justify-content: center`, `gap: 32px`. Each action is an icon (`18px`) + label (Lato 400, 13px, `--mc-text-gold`). Touch target: full `44px` height. Separated from content above by a `1px` gold line at 15% opacity.

### Foreground Decorative Elements
- **Arabesque flourish**: Below section title, same as Countdown section
- **Lantern icons**: Each card header has a small lantern SVG (`24px`), `--mc-gold`
- **Card separator ornament**: Between each card, a small centered ornament -- either 3 gold dots (`4px` circles, `--mc-gold`, spaced `8px` apart) or a tiny arabesque flourish (`40px` wide)

### Dynamic Event Count
The section renders an array of event objects. There is no hardcoded count. Layout stacks vertically. If there is 1 event, there is 1 card. If there are 8, there are 8 cards.

### Typography for This Section
- **"Our Celebrations"**: Cormorant Garamond 400, `--mc-font-h1` (28px), `--mc-text-gold`, centered
- **Event name**: Cormorant Garamond 500, `--mc-font-h3` (18px), `--mc-text-primary`, left-aligned
- **Date, time**: Lato 400, `--mc-font-body` (15px), `--mc-text-primary`, left-aligned
- **Venue name**: Lato 700, `--mc-font-body` (15px), `--mc-text-primary`, left-aligned
- **Address**: Lato 300, `--mc-font-caption` (13px), `--mc-text-secondary`, left-aligned
- **Action labels**: Lato 400, `--mc-font-small` (12px), `--mc-text-gold`, centered under icon

### Connection to Previous Section
Gradient bleed from champagne to off-white. Mirrored arabesque pair from Countdown boundary.

### Connection to Next Section
Gradient bleed from off-white to ivory with rose tint. A thin garland drape (WebP, approximately `100%` width by `40px` tall, soft blush flowers with transparency) spans the boundary.

---

## Section 5: RSVP

### Visual Concept
An intimate, inviting space that asks the guest to participate. The section has a slightly warmer, rosier tone than the rest of the invitation -- like stepping into a private chamber where you are personally welcomed. The form is minimal: just what is needed, beautifully presented. The design makes the guest feel that their response truly matters.

### Layout (402px)

```
+------------------------------------------+
|                                          |
|  background: --mc-ivory                  |
|  with --mc-gradient-rose overlay         |
|                                          |
|  "Will You Join Us?"                     |
|  (Cormorant 400, section title, gold)    |
|                                          |
|  [gold arabesque flourish, centered]     |
|                                          |
|  "Your presence would make our           |
|   celebration complete"                  |
|  (Lato 300, centered, secondary text)    |
|                                          |
|  +------------------------------------+ |
|  |  RSVP Form Card                    | |
|  |                                    | |
|  |  Name ___________________________  | |
|  |  label + input                     | |
|  |                                    | |
|  |  Number of Guests  [ - ] 2 [ + ]  | |
|  |  label + stepper                   | |
|  |                                    | |
|  |  ( ) Joyfully Accept               | |
|  |  ( ) Regretfully Decline            | |
|  |  radio buttons                     | |
|  |                                    | |
|  |  Message (optional)                | |
|  |  ________________________________  | |
|  |  textarea                          | |
|  |                                    | |
|  |  +------------------------------+ | |
|  |  |     Send Response            | | |
|  |  +------------------------------+ | |
|  |  submit button, frosted glass     | |
|  |                                    | |
|  +------------------------------------+ |
|                                          |
|  [Small arabesque corner ornaments]      |
|                                          |
+------------------------------------------+
```

### Background Treatment
- Base: `--mc-ivory` (`#F5F0E8`)
- Overlay: `--mc-gradient-rose` (top: `rgba(240, 176, 192, 0.12)`, fading to transparent)
- This gives the section a faint warm blush without being pink

### RSVP Form Card
- Container: `width: 100%` (within gutter), `padding: 28px 20px`, `border-radius: var(--mc-card-radius)`, `background: var(--mc-offwhite)`, `border: 1px solid var(--mc-gold)` at `25%` opacity
- Shadow: Elevation 1

#### Form Fields

**Name Input**:
- Label: Lato 400, `--mc-font-caption` (13px), `--mc-text-secondary`, letter-spacing `0.04em`
- Input: `height: 44px`, `padding: 0 12px`, `border: none`, `border-bottom: 1px solid var(--mc-cream)`, `background: transparent`
- Input text: Lato 400, 15px, `--mc-text-primary`
- Focus state: border-bottom color transitions to `--mc-gold` (300ms ease)
- No outline ring -- the gold underline IS the focus indicator

**Guest Count Stepper**:
- Label: Same as Name
- Stepper: horizontal flexbox, centered. Minus button (`-`), count display, plus button (`+`)
- Buttons: `44px` square, `border-radius: 50%`, `border: 1px solid var(--mc-cream)`, `background: transparent`
- Button text: Lato 400, 18px, `--mc-text-secondary`
- Count: Cormorant Garamond 400, 22px, `--mc-text-primary`, centered, `min-width: 40px`
- Active/pressed state: background transitions to `--mc-champagne` (150ms)

**Radio Buttons (Accept/Decline)**:
- Custom radio: `20px` circle, `border: 1.5px solid var(--mc-gold)` at `50%` opacity
- Selected state: inner circle `12px`, fill `--mc-gold`, with a 200ms scale-in animation
- Label: Lato 400, 15px, `--mc-text-primary`, `margin-left: 12px`
- Touch target: full row is tappable, `44px` minimum height

**Message Textarea**:
- Label: Same as Name
- Textarea: `min-height: 80px`, same styling as name input but with border on all sides (1px `--mc-cream`), `border-radius: 8px`, `padding: 12px`
- Focus: border color transitions to `--mc-gold`

**Submit Button**:
- Full width of card content, `height: 48px`, `border-radius: var(--mc-button-radius)` (12px)
- Style: frosted glass (`--mc-glass`, blur, gold border)
- Text: Lato 400, 15px, `--mc-text-gold`, centered
- Active state: background shifts to `--mc-champagne`, `transform: scale(0.98)` (150ms)
- Success state: background transitions to `rgba(90, 125, 90, 0.15)` (Mughal sage tint), text changes to "Response Sent" with a subtle check mark, `--mc-green`

### Foreground Decorative Elements
- **Corner arabesques**: Small arabesque ornaments in top-left and bottom-right of the section (outside the card), `60px` square, `--mc-gold-light` at 15% opacity
- **Scattered petals**: 2-3 rose petal SVGs near the bottom corners of the section, `--mc-rose` at 20% opacity

### Typography for This Section
- **"Will You Join Us?"**: Cormorant Garamond 400, `--mc-font-h1` (28px), `--mc-text-gold`, centered
- **Subtitle**: Lato 300, `--mc-font-body-light` (15px), `--mc-text-secondary`, centered, max-width `28ch`
- **Form labels**: Lato 400, `--mc-font-caption` (13px), `--mc-text-secondary`
- **Form input text**: Lato 400, `--mc-font-body` (15px), `--mc-text-primary`
- **Button text**: Lato 400, `--mc-font-body` (15px), `--mc-text-gold`

### Connection to Previous Section
Gradient bleed from off-white to rose-tinted ivory. Thin garland drape WebP from Celebrations boundary.

### Connection to Next Section
Gradient bleed from rose-tinted ivory to sunset sky gradient. The sky gradient begins faintly at the very bottom of the RSVP section, then takes over fully in the Closing section. The mosque silhouette begins to emerge in the background during this transition.

---

## Section 6: Closing

### Visual Concept
A return to the grandeur of the entry, but now viewed from the other side. Where the entry showed the couple walking *into* the garden, the closing section is the garden opening up to the infinite sky. The full sunset gradient returns, and a large mosque silhouette glows in the background. A Dua (prayer) for the couple is the textual focus. The section ends with a "Designed by" footer and the feeling that the invitation is a portal to something blessed and eternal.

### Layout (402px)

```
+------------------------------------------+
|                                          |
|  background: --mc-gradient-sky           |
|  (full sunset gradient)                  |
|                                          |
|  [Mosque silhouette SVG, centered]       |
|  large, background layer                 |
|  --mc-gold-light at 10% opacity          |
|                                          |
|  [Crescent moon SVG]                     |
|  upper-right area, --mc-gold at 25%      |
|                                          |
|  [Bird silhouettes, 2-3]                 |
|  scattered in sky area                   |
|                                          |
|                                          |
|  Arabic Dua text                         |
|  (Amiri, --mc-text-on-dark)              |
|                                          |
|  English translation                     |
|  "May Allah bless you both               |
|   and unite you in goodness"             |
|  (Lato 300, --mc-text-on-dark)           |
|                                          |
|  [gold divider line]                     |
|                                          |
|  "With love and duas,"                   |
|  (Great Vibes, accent)                   |
|                                          |
|  "The Khan & Ali Families"               |
|  (Cormorant 400, pearl ivory)            |
|                                          |
|                                          |
|  [Floral garland bottom edge]            |
|  mirrored from entry top garland         |
|                                          |
|  --- Designed by Shaadi Invites ---      |
|  (footer, small text)                    |
|                                          |
+------------------------------------------+
```

### Background Treatment
- Full `--mc-gradient-sky` (the same sunset gradient used as the video fallback on the entry screen)
- This creates a visual bookend: the invitation begins and ends with the same sky

### Foreground Decorative Elements
- **Mosque silhouette**: Large SVG, centered, `width: 80%` of viewport width, positioned vertically so the dome sits at approximately `30%` from section top. Color: `--mc-gold-light` at `10%` opacity. This is a background element -- text overlays it.
- **Crescent moon**: Small SVG (`30px`), positioned at `right: 25%; top: 15%` of section. Color: `--mc-gold` at `25%` opacity. Subtle slow glow pulse (CSS animation: opacity `0.2 -> 0.3 -> 0.2`, 4s cycle, `ease-in-out`)
- **Bird silhouettes**: 2-3 small SVG birds (`15-20px` wingspan), positioned in the upper portion of the section. Color: `--mc-text-primary` at `15%` opacity. One bird has a very slow drift animation (GSAP MotionPath, 10s cycle, curved arc, pauses off-viewport).
- **Bottom garland**: A floral garland WebP (mirror of the entry top garland), positioned at the very bottom of the section, flipped vertically. Creates a frame that mirrors the entry screen's top framing, completing the visual circle.
- **Floating petals**: 4-6 rose petal SVGs with slow drift and rotation animations (per PNG Choreography doc). These are the most visible ambient elements in this section.
- **Sparkle accents**: 2-3 four-pointed star SVGs scattered in the upper area, with slow opacity pulse animation (2-3s cycle, `opacity: 0 -> 0.7 -> 0`)

### Typography for This Section
- **Arabic Dua**: Amiri 400, `--mc-font-arabic` (24px), `--mc-text-on-dark`, centered, `direction: rtl`, `lang="ar"`
- **English translation**: Lato 300, `--mc-font-body-light` (15px), `--mc-text-on-dark` at `85%` opacity, centered, max-width `30ch`, `margin-top: 12px`
- **Gold divider**: Same gradient line as Family section, but in `--mc-gold-light` (lighter for dark background), `60%` width
- **"With love and duas,"**: Great Vibes 400, `--mc-font-accent` (20px), `--mc-gold-light`, centered
- **Family names**: Cormorant Garamond 400, `--mc-font-h3` (18px), `--mc-text-on-dark`, centered
- **Footer**: Lato 400, `--mc-font-small` (12px), `--mc-text-on-dark` at `50%` opacity, centered

### Connection to Previous Section
Gradient bleed from rose-tinted ivory to the sunset sky. The mosque silhouette begins fading in during the last `80px` of the RSVP section (at very low opacity, maybe `3%`, visible only as a hint that the sky is coming).

### Section End
The Closing section has `padding-bottom: 80px` to give breathing room after the footer. The very last element is the "Designed by" footer mark, which anchors the bottom of the invitation.

---

## Summary: Section Flow

```
ENTRY (100vh)
  |  video fills viewport, tap-to-open, names + date
  |  poster: first-frame.webp
  |
  V  [hard break: scroll into ivory marble]
  
FAMILY (variable height)
  |  Bismillah -> family cards on marble
  |  Mughal arches frame each family
  |
  V  [gradient bleed ivory->champagne + jali strip]
  
COUNTDOWN (variable height)
  |  Live countdown on champagne + frosted glass
  |  Lanterns flanking, gold warmth peaks
  |
  V  [gradient bleed champagne->off-white + arabesque pair]
  
CELEBRATIONS (variable height, dynamic card count)
  |  Event cards stacked vertically on clean off-white
  |  Each card: lantern, date, venue, action links
  |
  V  [gradient bleed off-white->rose-ivory + garland drape]
  
RSVP (variable height)
  |  Form on rose-tinted ivory
  |  Frosted glass submit button
  |
  V  [gradient bleed rose-ivory->sunset sky + mosque emergence]
  
CLOSING (variable height, min ~500px)
  |  Sunset sky gradient, mosque silhouette
  |  Dua/blessing, family sign-off, footer
  |  Crescent moon, birds, sparkles, floating petals
  |
  [END]
```

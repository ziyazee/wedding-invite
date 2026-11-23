# Hawa Mahal — Section Blueprints

All layouts are mobile-first (402px base viewport). Desktop renders the same layout inside the `InvitationViewport` portrait frame (402 x 874). All measurements are in CSS pixels. See `design-bible.md` for the full color, type, and spacing systems referenced here.

---

## Section 1: Welcome Message

**Purpose:** The gateway. The entry video plays, the palace is revealed, and the guest reads the couple's names and welcome message for the first time.

### Layout

```
+------------------------------------------+
|                                          |  <- 0px (video fills viewport)
|          [ENTRY VIDEO - 9:16]            |
|       Hawa Mahal illumination            |
|          sequence plays                  |
|                                          |
|  After video ends, content fades in:     |
|                                          |
|               ~40px top pad              |
|                                          |
|          [ Lotus Medallion ]             |  <- 28px, --hm-gold
|               16px                       |
|      ---- gold cornice line ----         |  <- 1px, --hm-gold at 40%
|               24px                       |
|          WELCOME LABEL                   |  <- Cormorant SC 13px
|               12px                       |
|     .............................        |
|     :                           :        |
|     :  [ Mehrab Arch Frame ]    :        |  <- SVG arch, --hm-gold
|     :                           :        |
|     :     GROOM'S NAME          :        |  <- Cinzel Decorative 32px
|     :          &                :        |  <- Cormorant Garamond 20px italic
|     :     BRIDE'S NAME          :        |  <- Cinzel Decorative 32px
|     :                           :        |
|     :...........................:        |
|               32px                       |
|       Welcome message text               |  <- Cormorant Garamond 18px italic
|       (2-4 lines, centered)              |
|               40px                       |
|       [Wedding date - single line]       |  <- Cormorant SC 13px, --hm-gold-bright
|               64px                       |
|                                          |
|          [ Lotus Scroll Indicator ]      |  <- 32px, animated pulse + float
|               24px from bottom           |
|                                          |
+------ Scalloped Cornice Border ----------+
```

### Background

- During video: the `<video>` element fills the entire section viewport.
- After video: `--hm-gradient-night-vignette` as the background. The video's final frame (fully illuminated palace under stars) is the `poster` image and persists as a CSS background-image behind the content overlay.
- Content overlay: a gradient overlay from `rgba(6, 14, 21, 0.65)` at the top to `rgba(6, 14, 21, 0.85)` at the bottom, ensuring text readability over the palace image.
- Jali pattern: 4% opacity `--hm-gold` honeycomb overlay across the full section.

### Decorative Elements

1. **Lotus medallion** at top, centered — 28px, `--hm-gold`.
2. **Thin gold cornice line** below the lotus — 1px, `--hm-gold` at 40% opacity, 80% width centered.
3. **Mehrab arch frame** around the couple's names — SVG, `--hm-gold` 1.5px stroke. The arch is approximately 320px wide and 180px tall, with 5 cusps. It frames only the names, not the welcome message.
4. **Scalloped cornice border** at the section bottom — full-width, `--hm-gold`, transitioning into the next section.
5. **Lotus scroll indicator** at the bottom — 32px, `--hm-gold`, gently pulsing (opacity 0.6 to 1.0) and floating (translateX 0 to 4px and back, 3s cycle). Scrolls away naturally with the section content.

### Typography

- Welcome label: `Cormorant SC` 13px/600, `--hm-gold-bright`, letter-spacing 0.1em.
- Couple names: `Cinzel Decorative` 32px/700, `--hm-marble`, letter-spacing 0.08em, uppercase.
- Ampersand: `Cormorant Garamond` 20px/400 italic, `--hm-gold-bright`.
- Welcome message: `Cormorant Garamond` 18px/400 italic, `--hm-ivory`, max-width 320px, centered.
- Wedding date: `Cormorant SC` 13px/600, `--hm-gold-bright`, letter-spacing 0.1em.

### Connection to Next Section

Scalloped cornice in `--hm-gold` at the bottom edge. Below the cornice, a 48px gradient bleed zone transitions from `--hm-night` to `--hm-sandstone-pale` (the Family section's background).

---

## Section 2: Family Details

**Purpose:** Introduces the families of the bride and groom. Warm, respectful, and clearly structured.

### Layout

```
+------------------------------------------+
|               64px top pad               |
|                                          |
|          FAMILIES HEADING                |  <- Cinzel Decorative 22px
|               8px                        |
|     ---- short gold rule (80px) ----     |  <- 1px, --hm-gold
|               40px                       |
|                                          |
|   +----------------------------------+   |
|   |      GROOM'S SIDE LABEL          |   |  <- Cormorant SC 13px
|   |           12px                    |   |
|   |    Groom's Father Name            |   |  <- Cormorant Garamond 18px/500
|   |           4px                     |   |
|   |    Father's description           |   |  <- Cormorant Garamond 14px, muted
|   |           16px                    |   |
|   |    Groom's Mother Name            |   |  <- Cormorant Garamond 18px/500
|   |           4px                     |   |
|   |    Mother's description           |   |  <- Cormorant Garamond 14px, muted
|   |           16px                    |   |
|   |    Additional family members...   |   |
|   +----------------------------------+   |
|               32px                       |
|          [ Lotus Medallion ]             |  <- 24px, --hm-gold-deep
|               32px                       |
|   +----------------------------------+   |
|   |      BRIDE'S SIDE LABEL          |   |  <- Cormorant SC 13px
|   |           12px                    |   |
|   |    Bride's Father Name            |   |  <- Cormorant Garamond 18px/500
|   |           4px                     |   |
|   |    Father's description           |   |  <- Cormorant Garamond 14px, muted
|   |           16px                    |   |
|   |    Bride's Mother Name            |   |  <- Cormorant Garamond 18px/500
|   |           4px                     |   |
|   |    Mother's description           |   |  <- Cormorant Garamond 14px, muted
|   |           16px                    |   |
|   |    Additional family members...   |   |
|   +----------------------------------+   |
|               64px bottom pad            |
+------ Scalloped Cornice Border ----------+
```

### Background

- Solid `--hm-sandstone-pale` (`#F0DDD0`).
- No jali overlay on this section — the warm, clean surface lets the family information breathe.
- Optional: the very faintest sandstone grain (2% opacity SVG noise filter) for tactile warmth. Remove if it competes with text.

### Decorative Elements

1. **Short gold rule** below the section heading — 80px wide, 1px, `--hm-gold`, centered.
2. **Lotus medallion** between groom's and bride's family blocks — 24px, `--hm-gold-deep`, static (no animation).
3. **Scalloped cornice border** at the bottom — `--hm-sandstone` at 50% opacity (lighter than the gold cornices on dark sections), transitioning into the dark Countdown section.

### Typography

- Section heading: `Cinzel Decorative` 22px/700, `--hm-deep-brown`, uppercase, letter-spacing 0.06em.
- Side labels (Groom's Family / Bride's Family): `Cormorant SC` 13px/600, `--hm-sandstone-shadow`, letter-spacing 0.1em.
- Family member names: `Cormorant Garamond` 18px/500, `--hm-deep-brown`.
- Descriptions/titles: `Cormorant Garamond` 14px/400, `--hm-sandstone-shadow`.

### Connection to Next Section

Scalloped cornice in `--hm-sandstone` at 50% transitions into a 48px gradient zone from `--hm-sandstone-pale` darkening through `--hm-sandstone-shadow` into `--hm-night` (the Countdown section).

---

## Section 3: Countdown

**Purpose:** The heart of anticipation. Displays the wedding date and a live countdown timer. This section is a dramatic dark vault — a pause between the warm family section and the warm celebrations section.

### Layout

```
+------------------------------------------+
|               64px top pad               |
|                                          |
|         [ Lotus Medallion ]              |  <- 28px, --hm-gold-bright
|               24px                       |
|          COUNTDOWN LABEL                 |  <- Cormorant SC 13px
|               16px                       |
|                                          |
|    .--------------------------------.    |
|    | Jali pattern band (32px tall)  |    |  <- 6% opacity, --hm-teal tint
|    | behind the timer area          |    |
|    |                                |    |
|    |   DD    HH    MM    SS        |    |  <- Cinzel Decorative 40px
|    |  days  hours  mins  secs      |    |  <- Cormorant SC 11px
|    |                                |    |
|    '--------------------------------'    |
|               32px                       |
|                                          |
|     Full wedding date (written out)      |  <- Cormorant Garamond 18px/500
|               8px                        |
|     Wedding day of week                  |  <- Cormorant SC 13px, gold
|               8px                        |
|     Time                                 |  <- Cormorant Garamond 16px
|                                          |
|               64px bottom pad            |
+------ Scalloped Cornice Border ----------+
```

### Background

- `--hm-gradient-sky` — deep night gradient from `--hm-night-deep` at the top to `--hm-night` at the bottom.
- Jali pattern overlay across the full section at 4% opacity, `--hm-gold`.
- Behind the countdown timer area: a horizontal jali band (32px tall, full width) at 6% opacity tinted with `--hm-teal` — referencing the backlit jali windows in the video. This band has soft horizontal fade edges (gradient mask).

### Decorative Elements

1. **Lotus medallion** at top — 28px, `--hm-gold-bright`, static.
2. **Jali band** behind timer — 32px tall, full width with 48px horizontal padding fade. `--hm-teal` at 6% opacity.
3. **Gold separator dots** between countdown units — 3px circles, `--hm-gold` at 40%, vertically centered between the digit columns.
4. **Scalloped cornice** at the bottom — `--hm-gold`, transitioning into the warm Celebrations section.

### Countdown Timer Layout

The four timer units (days, hours, minutes, seconds) are arranged in a horizontal row, evenly spaced within a max-width container of 320px.

Each unit:
- Digit: `Cinzel Decorative` 40px/700, `--hm-gold-bright`.
- Label: `Cormorant SC` 11px/500, `--hm-ivory` at 70%, letter-spacing 0.12em. Placed directly below the digit with 4px gap.
- Column width: ~72px each, with 12px between columns.
- Between each column, a small gold separator dot (3px, centered vertically at the digit's midline).

### Typography

- Countdown label: `Cormorant SC` 13px/600, `--hm-gold-bright`, letter-spacing 0.1em.
- Digits: `Cinzel Decorative` 40px/700, `--hm-gold-bright`, tabular-nums if available (use `font-variant-numeric: tabular-nums`).
- Unit labels: `Cormorant SC` 11px/500, `--hm-ivory` at 70%, letter-spacing 0.12em.
- Full date: `Cormorant Garamond` 18px/500, `--hm-ivory`.
- Day of week: `Cormorant SC` 13px/600, `--hm-gold-bright`, letter-spacing 0.1em.
- Time: `Cormorant Garamond` 16px/400, `--hm-ivory`.

### Connection to Next Section

Gold scalloped cornice at bottom transitions via 48px gradient bleed from `--hm-night` into `--hm-ivory` (the Celebrations section).

---

## Section 4: Celebrations

**Purpose:** Lists all wedding events. This is the most information-dense section. It must handle any number of events (1 to 10+) gracefully. Each event is a self-contained card.

### Layout

```
+------------------------------------------+
|               64px top pad               |
|                                          |
|          CELEBRATIONS HEADING            |  <- Cinzel Decorative 22px
|               8px                        |
|     ---- short gold rule (80px) ----     |  <- 1px, --hm-gold-deep
|               40px                       |
|                                          |
|   +----------------------------------+   |
|   |  .----------------------------. |   |
|   |  | Mehrab arch (top edge)      | |   |  <- SVG, --hm-gold-deep
|   |  |                            | |   |
|   |  |  EVENT TYPE LABEL          | |   |  <- Cormorant SC 13px
|   |  |         8px                | |   |
|   |  |  Event Name                | |   |  <- Cinzel Decorative 20px
|   |  |         16px               | |   |
|   |  |  [date icon] Date          | |   |  <- Cormorant Garamond 16px
|   |  |         8px                | |   |
|   |  |  [clock icon] Time         | |   |  <- Cormorant Garamond 16px
|   |  |         16px               | |   |
|   |  |  Venue Name                | |   |  <- Cormorant Garamond 16px/500
|   |  |         4px                | |   |
|   |  |  Address line 1            | |   |  <- Cormorant Garamond 14px
|   |  |  Address line 2            | |   |
|   |  |         16px               | |   |
|   |  |  [ View Map ]  [ Add to    | |   |  <- action buttons, 44px min height
|   |  |                 Calendar ] | |   |
|   |  |         16px pad bottom    | |   |
|   |  '----------------------------' |   |
|   +----------------------------------+   |
|               24px between cards         |
|   +----------------------------------+   |
|   |  (next event card, same layout)  |   |
|   +----------------------------------+   |
|               24px                       |
|   ... (repeats for each event) ...       |
|                                          |
|               64px bottom pad            |
+------ Scalloped Cornice Border ----------+
```

### Background

- Section background: solid `--hm-ivory` (`#F5EDE0`).
- Event cards: `--hm-sandstone-pale` (`#F0DDD0`) with the subtle box-shadow (`0 2px 12px rgba(42, 31, 26, 0.08)`).
- Jali pattern: NOT present on this section. The information density needs a clean surface.

### Event Card Design

Each event card:
- Width: fills the content area (354px minus 0px card margins = 354px, or optionally inset by 8px each side = 338px).
- Padding: 24px horizontal, 20px vertical (below the arch).
- Top edge: a small mehrab arch SVG (approximately 120px wide, 36px tall) centered at the top of the card, sitting on the card's top edge. Stroke: `--hm-gold-deep` 1px.
- Background: `--hm-sandstone-pale`.
- Border: 1px solid `--hm-gold` at 20% opacity on left, right, and bottom edges. The top edge is defined by the arch.
- Border-radius: 0. Sharp edges. Stone is not rounded.

### Action Buttons (Map + Calendar)

- Arranged horizontally, side by side, with 8px gap.
- Style: outlined — 1px solid `--hm-gold-deep`, no background fill, `--hm-gold-deep` text.
- Font: `Cormorant SC` 13px/600, letter-spacing 0.06em.
- Min height: 44px, min width: 44px.
- Padding: 10px 16px.
- Hover: `--hm-gold` at 8% opacity background fill.
- Border-radius: 2px.

### Dynamic Event Count Handling

- 1 event: single card, centered. Extra vertical padding above/below (96px instead of 64px) so the section doesn't feel empty.
- 2-3 events: standard layout with 24px between cards.
- 4-6 events: same layout. The section simply gets taller. No pagination, no carousel.
- 7-10+ events: same vertical stack. Consider adding a subtle gold rule (1px, 60px wide, centered) between every 3rd and 4th card as a visual rest point, but this is optional.

The layout is ALWAYS a vertical stack of cards. Never a horizontal carousel, grid, or tabbed interface. Scrolling through celebration cards is part of the journey.

### Typography

- Section heading: `Cinzel Decorative` 22px/700, `--hm-deep-brown`, uppercase.
- Event type label: `Cormorant SC` 13px/600, `--hm-sandstone-shadow`, letter-spacing 0.1em.
- Event name: `Cinzel Decorative` 20px/700, `--hm-deep-brown`, letter-spacing 0.04em.
- Date and time: `Cormorant Garamond` 16px/400, `--hm-deep-brown`.
- Venue name: `Cormorant Garamond` 16px/500, `--hm-deep-brown`.
- Address: `Cormorant Garamond` 14px/400, `--hm-sandstone-shadow`. Left-aligned within its container (the container is centered).
- Button text: `Cormorant SC` 13px/600, `--hm-gold-deep`.

### Icons

Date and time lines use minimal inline icons (12px, stroke-only, `--hm-gold-deep`). These are simple SVG: a calendar outline for date, a clock outline for time. No filled icons. No emoji.

### Connection to Next Section

Gold scalloped cornice at bottom transitions via 48px gradient bleed from `--hm-ivory` into `--hm-night` (the RSVP section). A lotus medallion sits centered in the transition zone, 24px diameter, `--hm-gold`.

---

## Section 5: RSVP

**Purpose:** The guest confirms attendance. This section is focused and minimal — a dark, quiet space that asks one clear question.

### Layout

```
+------------------------------------------+
|               64px top pad               |
|                                          |
|          RSVP HEADING                    |  <- Cinzel Decorative 22px
|               8px                        |
|    ---- short gold rule (80px) ----      |  <- 1px, --hm-gold
|               16px                       |
|    Invitation message (1-2 lines)        |  <- Cormorant Garamond 16px italic
|               40px                       |
|                                          |
|   .------- Mehrab Arch Top ---------.    |  <- SVG arch frame
|   |                                  |   |
|   |  Guest Name                      |   |  <- input, underline style
|   |            24px                  |   |
|   |  Number of Guests                |   |  <- input, underline style
|   |            24px                  |   |
|   |  Attending?                      |   |
|   |  [ Yes, with joy ] [ Regrets ]   |   |  <- toggle/radio, 44px
|   |            24px                  |   |
|   |  Message (optional)              |   |  <- textarea, underline style
|   |            32px                  |   |
|   |  [    CONFIRM RSVP    ]          |   |  <- primary button
|   |            24px                  |   |
|   '------- bottom border -----------'    |
|                                          |
|               64px bottom pad            |
+------ Scalloped Cornice Border ----------+
```

### Background

- `--hm-gradient-sky` — the night sky returns.
- Jali overlay at 3% opacity, `--hm-gold` — very subtle, barely perceptible.

### Form Container

The RSVP form sits inside a contained area framed by a mehrab arch at the top and a simple 1px `--hm-gold` at 15% opacity border on the left, right, and bottom edges. This creates a "chamber" feel within the dark section.

- Container width: 338px (content max minus 8px each side).
- Container padding: 32px horizontal, 28px vertical.
- Container background: `--hm-night` at 60% opacity (slightly lighter than the section background, creating a subtle lifted plane).
- The mehrab arch at the top is approximately 200px wide, 48px tall, centered.

### Form Inputs

All inputs follow the underline style from the design bible:
- No border except bottom: 1px solid `--hm-gold` at 40%.
- Focus state: bottom border becomes `--hm-gold-bright` at 100%.
- Text: `Cormorant Garamond` 16px/400, `--hm-ivory`.
- Label: `Cormorant SC` 13px/500, `--hm-ember`, positioned above the input with 4px gap.
- Padding: 8px 0 (horizontal padding from container).

### Attendance Toggle

Two options side by side:
- Each option: 1px border `--hm-gold` at 30%, `--hm-ivory` text, 44px min height, equal width, 8px gap.
- Selected state: `--hm-gold` background, `--hm-deep-brown` text.
- Font: `Cormorant SC` 13px/600.
- Border-radius: 2px.

### Submit Button

- Full width of the form container.
- Background: `--hm-gold`.
- Text: `--hm-deep-brown`, `Cormorant SC` 14px/600, letter-spacing 0.08em.
- Height: 48px.
- Border-radius: 2px.
- Hover: `--hm-gold-bright`.
- Active: `--hm-gold-deep`.
- Focus ring: 2px solid `--hm-marble`, 2px offset.

### Confirmation Feedback

After successful submission, the form container transitions to a confirmation state:
- The form fields fade out (opacity to 0, 400ms).
- A centered confirmation message fades in:
  - Lotus medallion (24px, `--hm-gold-bright`)
  - 16px gap
  - "Thank you" in `Cinzel Decorative` 20px, `--hm-gold-bright`.
  - 8px gap
  - Confirmation text in `Cormorant Garamond` 16px/400 italic, `--hm-ivory`.

### Typography

- Section heading: `Cinzel Decorative` 22px/700, `--hm-marble`, uppercase.
- Invitation message: `Cormorant Garamond` 16px/400 italic, `--hm-ivory`.
- Form labels: `Cormorant SC` 13px/500, `--hm-ember`.
- Input text: `Cormorant Garamond` 16px/400, `--hm-ivory`.
- Toggle text: `Cormorant SC` 13px/600, `--hm-ivory` (unselected), `--hm-deep-brown` (selected).
- Button: `Cormorant SC` 14px/600, `--hm-deep-brown`, letter-spacing 0.08em.

### Connection to Next Section

Gold scalloped cornice at bottom. Below: `--hm-night` continues into the Closing section (no gradient transition needed — both sections are dark). A subtle shift in the jali overlay density (3% RSVP to 4% Closing) provides minimal differentiation.

---

## Section 6: Closing

**Purpose:** The farewell. Returns the guest to the palace under the stars with a final message of warmth and gratitude. Completes the circle that opened with the Welcome section.

### Layout

```
+------------------------------------------+
|               64px top pad               |
|                                          |
|          [ Lotus Medallion ]             |  <- 32px, --hm-gold-bright
|               24px                       |
|     ---- gold cornice line (100px) ----  |  <- 1px, --hm-gold at 40%
|               24px                       |
|                                          |
|     .............................        |
|     :                           :        |
|     :  [ Mehrab Arch Frame ]    :        |  <- SVG arch, --hm-gold
|     :                           :        |
|     :   Closing message text    :        |  <- Cormorant Garamond 18px italic
|     :   (3-5 lines, centered)   :        |
|     :                           :        |
|     :...........................:        |
|               40px                       |
|                                          |
|     .............................        |
|     :                           :        |
|     :     GROOM'S NAME          :        |  <- Cinzel Decorative 24px
|     :          &                :        |  <- Cormorant Garamond 18px italic
|     :     BRIDE'S NAME          :        |  <- Cinzel Decorative 24px
|     :                           :        |
|     :...........................:        |
|               40px                       |
|                                          |
|      #WithLove or hashtag                |  <- Cormorant SC 13px, --hm-gold
|               64px                       |
|                                          |
|    [ DesignedByFooter component ]        |
|               24px bottom pad            |
|                                          |
+------------------------------------------+
```

### Background

- `--hm-gradient-night-vignette` — the same vignette from the Welcome section.
- Jali pattern overlay at 4% opacity, `--hm-gold`.
- Optionally, if the video's final frame is lightweight enough, it can appear as a very low-opacity (8-10%) background image, placing the faintest ghost of the illuminated palace behind the closing message. This is a bookend to the Welcome section. If performance is a concern, omit it — the color and jali pattern alone are sufficient.

### Decorative Elements

1. **Lotus medallion** at top — 32px, `--hm-gold-bright`, static. Larger than in other sections (32px vs. 24-28px) to mark this as the culminating moment.
2. **Gold cornice line** — 100px wide, 1px, `--hm-gold` at 40%, centered. Shorter and lighter than section headings — this is punctuation, not structure.
3. **Mehrab arch frame** around the closing message — SVG, `--hm-gold` at 60% opacity (softer than the Welcome arch). Approximately 300px wide, 160px tall. This frames the closing words as a final proclamation.
4. **No bottom cornice** — the section simply ends. The template's scroll boundary is here. A bottom padding of 24px provides the final breathing room before the `DesignedByFooter`.

### Typography

- Closing message: `Cormorant Garamond` 18px/400 italic, `--hm-ivory`, max-width 300px, centered. The italic weight gives this text a personal, handwritten quality.
- Couple names: `Cinzel Decorative` 24px/700, `--hm-marble`, uppercase. Slightly smaller than the Welcome section (24px vs. 32px) — the closing is a quieter echo.
- Ampersand: `Cormorant Garamond` 18px/400 italic, `--hm-gold-bright`.
- Hashtag/tagline: `Cormorant SC` 13px/500, `--hm-gold`, letter-spacing 0.08em.
- DesignedByFooter: uses its own styling, but the container background is transparent, blending into the night sky.

### Connection to Previous Section

Arrives from the RSVP section's dark background. The scalloped cornice at the RSVP's bottom edge marks the entry. The Closing section slightly deepens the jali pattern (4% vs. 3%) and introduces the vignette radial gradient, creating a subtle shift that signals "final space."

### DesignedByFooter Integration

The `DesignedByFooter` component is placed at the very bottom of the Closing section. It is rendered at reduced opacity (60%) to keep it unobtrusive. No additional styling is applied to it — it uses its own internal styles. The gap between the couple names / hashtag and the footer is 64px.

---

## Cross-Section Summary Table

| # | Section | BG Type | BG Color/Gradient | Primary Motifs | Transition Out |
|---|---------|---------|-------------------|----------------|----------------|
| 1 | Welcome | Dark | Night vignette + palace poster | Mehrab arch, lotus, scalloped cornice | Cornice + gradient bleed to warm |
| 2 | Family | Warm | Sandstone pale solid | Lotus divider, scalloped cornice | Cornice + gradient bleed to dark |
| 3 | Countdown | Dark | Sky gradient | Jali band, lotus, scalloped cornice | Cornice + gradient bleed to warm |
| 4 | Celebrations | Warm | Ivory solid | Mehrab arch (cards), scalloped cornice, lotus | Cornice + lotus + gradient bleed to dark |
| 5 | RSVP | Dark | Sky gradient | Mehrab arch (form), scalloped cornice | Cornice (no gradient — same dark tone continues) |
| 6 | Closing | Dark | Night vignette | Mehrab arch, lotus | None (terminal section) |

### Scroll Journey Emotional Arc

```
Welcome .............. GRANDEUR    (dramatic reveal, palace, names)
  |
Family ............... WARMTH      (intimate, familial, grounded)
  |
Countdown ............ ANTICIPATION (dramatic pause, time ticking)
  |
Celebrations ......... JOY         (information-rich, celebratory)
  |
RSVP ................. INVITATION  (direct, personal, action)
  |
Closing .............. GRATITUDE   (quiet, reflective, return to night)
```

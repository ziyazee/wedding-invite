# Taj Template — Section Blueprints

> Detailed layout and content design for all 8 sections.
> All measurements target the 402px base viewport. Refer to `design-bible.md` for token values.

---

## Section 1: Opening

**Purpose**: Immersive entry. The guest's first impression — cinematic, reverent, grand. The 10-second Taj Mahal night video plays, then reveals the couple's names over the final frame.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- Full-bleed video (100vh)
|                                          |
|          [crescent moon glow]            |  <- Upper-right, matches reference
|                                          |
|                                          |
|         ----  Bismillah  ----            |  <- Arabic, Amiri, gold-light
|                                          |
|          Aisha                           |  <- Cormorant Garamond Light 56px
|            &                             |  <- Italic 24px, gold-light
|          Farhan                          |  <- Cormorant Garamond Light 56px
|                                          |
|     [ ornamental divider line ]          |  <- Gold, 40% width
|                                          |
|       Request your presence at           |  <- Outfit Light 15px, cream-soft
|         their Nikah ceremony             |
|                                          |
|          [ scroll indicator ]            |  <- Thin gold chevron, subtle pulse
+------------------------------------------+
```

### Sequence

1. **0-10s**: Video plays full-screen. No text visible. Dark overlay at 0% opacity.
2. **Video ends**: Overlay fades in (0 to 85% opacity over 800ms). Video freezes on final frame (poster fallback if video fails).
3. **Text reveal**: Bismillah fades in first (400ms delay), then names (800ms delay), then divider and invitation line (1200ms delay). Each element: opacity 0 to 1, no vertical movement (static position, fade only — avoids the generic "fade-up" feel).
4. **Idle state**: Crescent moon has a gentle glow pulse (4s cycle). 4-6 tiny star sparkles twinkle intermittently.

### Visual Hierarchy

1. **Couple names** — largest text, cream on dark overlay, center of attention
2. **Bismillah** — gold Arabic text above names, sets the spiritual tone
3. **Invitation line** — smaller, softer, supporting context
4. **Crescent moon** — ambient atmosphere, not competing with text

### Content Elements

- **Video**: `opening.mp4`, 10s, `preload="metadata"`, poster image required, `canplay` retry per project rule
- **Bismillah**: "Bismillah ir-Rahman ir-Rahim" in Amiri, 28px, `--tj-gold-light`, `dir="rtl"`, `lang="ar"`
- **Couple names**: Editable `EditableText` fields, Cormorant Garamond Light 56px, `--tj-cream`
- **Connector**: Italic ampersand or "weds" between names, 24px, `--tj-gold-light`
- **Invitation text**: Editable, Outfit Light 15px, `--tj-cream-soft`
- **Scroll indicator**: A thin downward chevron (gold, 1px stroke), positioned at bottom 5%, gentle opacity pulse

### Background Treatment

Full-bleed video with dark overlay (`--tj-overlay`). No section padding — content is absolutely positioned within the viewport-height container.

### Transition to Next Section

No decorative border between Opening and Couple. The scroll continues from the dark overlay into the midnight background seamlessly — the visual continuity is the dark palette itself. A small vertical gap (32px) of solid midnight separates the overlay content from the Couple section.

### Edit Mode

- Video does not autoplay in edit mode. Show the poster frame as a static background image.
- No fade animations. All text elements visible immediately at full opacity.
- Scroll indicator hidden.

---

## Section 2: Couple

**Purpose**: Introduce the bride and groom with warmth. A photo (or photos) framed in a Mughal pointed arch, with their names and a brief personal note.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- 64px top padding
|        [ section heading ]               |
|     "THE HAPPY COUPLE"                   |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |  <- Gold line, center medallion
|                                          |  <- 32px gap
|       +------------------------+         |
|      /                          \        |  <- Pointed arch SVG frame
|     /                            \       |     320px wide, gold stroke
|    |                              |      |
|    |      [ couple photo ]        |      |  <- Photo fills arch shape
|    |                              |      |     via clip-path
|    |                              |      |
|    +------------------------------+      |
|                                          |
|    [ rose ornament ]   [ rose ornament ] |  <- Mirrored gold line-art roses
|                                          |     at bottom-left and bottom-right
|                                          |     of the arch frame
|                                          |  <- 24px gap
|          Aisha & Farhan                  |  <- Cormorant Garamond 22px, cream
|                                          |
|    "Two souls brought together by        |  <- Outfit Light 15px, cream-soft
|     the will of Allah, united in         |     Max 300px wide, centered
|     love and faith."                     |
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Visual Hierarchy

1. **Couple photo in arch frame** — the dominant visual element, centered, large
2. **Couple names** — repeated below photo for clarity (names above in Opening were over video, may not be fully read)
3. **Personal note** — soft body text, intimate and warm
4. **Section heading and roses** — framing, not attention-competing

### Arch Frame Details

- SVG pointed arch outline: 2px gold stroke (`--tj-gold`), no fill
- Interior: `clip-path` on the photo matching the arch shape so the image conforms to the arch
- Outer dimensions: 320px wide, ~420px tall (ratio ~3:4 inside the arch)
- Rose ornaments: two mirrored line-art roses, 48px each, positioned at the lower-left and lower-right corners of the arch, overlapping the arch border by ~8px

### Background Treatment

Treatment A — Solid midnight. The arch frame and roses provide all the visual interest.

### Transition to Next Section

An ornamental divider (gold line with central 4-pointed star, 50% content width) sits between Couple and Dua sections, with 48px spacing above and below.

---

## Section 3: Dua (Arabic Blessing)

**Purpose**: A sacred moment in the invitation. Present a Quranic verse or Dua that blesses the marriage. This section has a distinctly reverent, contemplative tone — quieter visually than the sections around it.

### Layout Structure

```
+------------------------------------------+
|  [ jali lattice pattern at 4% opacity ]  |  <- Background treatment B
|                                          |  <- 64px top padding
|        [ section heading ]               |
|           "DUA"                          |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 32px gap
|                                          |
|     Arabic Dua text, right-to-left       |  <- Amiri 32px, gold-light
|     Two or three lines of the verse      |     Centered, RTL, lang="ar"
|     with full tashkeel diacritics        |     Line-height 1.7
|                                          |
|                                          |  <- 24px gap
|   [ thin gold horizontal rule, 30% ]    |
|                                          |  <- 16px gap
|                                          |
|     English translation in italics       |  <- Cormorant Garamond Italic 16px
|     "And among His signs is that He      |     cream-soft, max 300px
|      created for you mates from          |     Centered
|      among yourselves..."                |
|                                          |  <- 12px gap
|     — Surah Ar-Rum 30:21                |  <- Outfit 13px, gold, right-aligned
|                                          |
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Visual Hierarchy

1. **Arabic text** — the spiritual centerpiece, gold on dark, largest text in the section
2. **English translation** — secondary, italic serif for elegance, smaller and muted
3. **Reference** — attribution, smallest text

### Typography Notes

- Arabic Dua: Amiri Regular, 32px, `--tj-gold-light`, `line-height: 1.7`, `text-align: center`, `dir="rtl"`, `lang="ar"`
- The Arabic text must have sufficient vertical space for tashkeel (vowel marks above and below letters). The 1.7 line-height accommodates this.
- Translation: Cormorant Garamond Italic, 16px, `--tj-cream-soft` — the italic treatment differentiates it clearly from the Arabic original
- Surah reference: Outfit Regular, 13px, `--tj-gold`

### Background Treatment

Treatment B — Midnight with jali lattice overlay at 4% opacity. This is the only section (besides Celebrations) with the lattice, marking it as a spiritually significant space. The geometric pattern echoes the Islamic geometric tradition of sacred architecture.

### Transition to Next Section

Ornamental divider (gold line with central crescent moon motif, 40% width) separates Dua from Countdown. The crescent here is tiny (12px) — a punctuation mark, not a feature.

---

## Section 4: Countdown

**Purpose**: Build anticipation. A live countdown to the wedding date displayed in a dignified, structured format.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- 64px top padding
|        [ section heading ]               |
|       "COUNTING THE DAYS"               |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 32px gap
|                                          |
|   +------+  +------+  +------+  +------+|
|   | 127  |  |  04  |  |  32  |  |  18  ||  <- Cormorant Garamond 40px, cream
|   | days |  | hrs  |  | min  |  | sec  ||  <- Outfit 13px, gold, lowercase
|   +------+  +------+  +------+  +------+|
|                                          |
|    Four units evenly spaced across       |
|    content width (354px)                 |
|    Each unit: number above, label below  |
|    Separated by thin gold vertical       |
|    lines (1px, 60% of unit height)       |
|                                          |  <- 32px gap
|                                          |
|         Saturday, March 15               |  <- Cormorant Garamond 22px, cream
|           Two Thousand                   |  <- Outfit Light 15px, cream-soft
|          Twenty Seven                    |
|                                          |
|     [ 4-pointed star sparkle ]           |  <- Centered, gold, subtle twinkle
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Visual Hierarchy

1. **Countdown numbers** — large display numerals, the focal point
2. **Written date** — below countdown, human-readable for clarity
3. **Unit labels** — tiny, supporting, not distracting
4. **Star sparkle** — punctuation, atmosphere

### Countdown Unit Design

Each countdown unit is a vertical stack:
- Number: Cormorant Garamond Light (300), 40px, `--tj-cream`
- Label: Outfit Regular (400), 13px, `--tj-gold`, lowercase
- The four units are laid out in a flex row, `justify-content: space-between`, within a 300px-wide container
- Between each unit: a thin vertical gold line (1px wide, 32px tall, `--tj-gold` at 30% opacity)
- Number transitions: on digit change, the old digit slides up and fades out while the new digit slides in from below (simple `translateY` + `opacity`, 300ms). In edit mode: static display, no transitions.

### Date Display

Below the countdown, the wedding date written out in a poetic format — not "03/15/2027" but the spelled-out version. This uses a two-line treatment with the day-and-month line slightly larger than the year line, both centered.

### Background Treatment

Treatment C — Subtle vertical gradient from `--tj-midnight` to `--tj-deep`. This slight darkening gives the countdown a sense of depth, like looking into the night sky.

### Transition to Next Section

A wider ornamental divider (60% width, gold line with central dome silhouette at 20px wide) marks the transition to Celebrations. This is the most substantial divider between any two sections, signaling the shift from contemplative content to practical event details.

---

## Section 5: Celebrations

**Purpose**: The practical heart of the invitation. List all wedding events (Mehndi, Nikah, Walima, etc.) with dates, times, venues, and addresses. Must be scannable and clear.

### Layout Structure

```
+------------------------------------------+
|  [ jali lattice pattern at 3% opacity ]  |  <- Background treatment B
|                                          |  <- 64px top padding
|        [ section heading ]               |
|        "CELEBRATIONS"                    |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 32px gap
|                                          |
|   EVENT CARD 1 (e.g., Mehndi)           |
|   +--------------------------------------+
|   |  /\    /\                            |  <- Pointed arch top border (SVG)
|   | /  \  /  \   (arch shape header)     |
|   |/    \/    \                          |
|   |   MEHNDI                             |  <- Cormorant Garamond 18px, gold
|   |                                      |
|   |   Friday, March 14                   |  <- Outfit Medium 15px, cream
|   |   6:00 PM onwards                    |  <- Outfit Light 15px, cream-soft
|   |                                      |
|   |   The Grand Pavilion                 |  <- Outfit Regular 15px, cream
|   |   123 Garden Road, Lucknow           |  <- Outfit Light 13px, cream-soft
|   +--------------------------------------+
|                                          |  <- 24px gap
|   EVENT CARD 2 (e.g., Nikah)            |
|   +--------------------------------------+
|   |  Same arch-header structure          |
|   |  but the Nikah card has a slightly   |
|   |  more prominent gold border          |  <- 2px gold border vs 1px others
|   |  to signal it as the primary event   |
|   +--------------------------------------+
|                                          |  <- 24px gap
|   EVENT CARD 3 (e.g., Walima)           |
|   +--------------------------------------+
|   |  ...                                 |
|   +--------------------------------------+
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Event Card Design

Each event card is a vertical panel:
- Width: 100% of content area (354px)
- Background: `--tj-navy-mid` (elevated panel feel)
- Border: `--tj-border-glow` (1px gold at 25% opacity)
- Top decoration: A miniature pointed arch shape (SVG) spanning the top of the card, 60px tall, with the event name inside the arch
- Internal padding: 24px horizontal, 20px vertical (below the arch header)
- Content: event name, date line, time line, venue name, venue address — each on its own line, vertically stacked, left-aligned

**The Nikah card (primary ceremony)** gets a distinguishing treatment:
- 2px gold border instead of 1px
- Gold gradient top border (using `--tj-gold-gradient`)
- Event name in gold-light instead of standard gold

**Other events** (Mehndi, Walima, etc.) use the standard 1px border.

### Event Details Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Event name | Cormorant Garamond | 18px | 500 | `--tj-gold` |
| Date | Outfit | 15px | 500 | `--tj-cream` |
| Time | Outfit | 15px | 300 | `--tj-cream-soft` |
| Venue name | Outfit | 15px | 400 | `--tj-cream` |
| Address | Outfit | 13px | 300 | `--tj-cream-soft` |

### Visual Hierarchy

1. **Event names** — gold text inside arch headers, immediately scannable
2. **Dates and times** — cream text, the practical information guests need most
3. **Venue details** — secondary, but clearly readable

### Background Treatment

Treatment B — Midnight with jali lattice at 3% opacity (slightly less than Dua, so the cards are the clear foreground). The lattice ties this section to the Dua spiritually — these events are celebrations of the sacred union.

### Transition to Next Section

A simple ornamental divider (gold line with central diamond, 40% width). The shift from cards to the RSVP form is signaled by the change in background treatment below.

---

## Section 6: RSVP

**Purpose**: Collect guest responses. A form that feels like part of the invitation's aesthetic, not a SaaS form dropped into a wedding template.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- 64px top padding
|        [ section heading ]               |
|      "KINDLY RESPOND"                    |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 24px gap
|                                          |
|   A warm sentence inviting response      |  <- Outfit Light 15px, cream-soft
|   "We would be honored by your           |     Centered, max 300px
|    presence. Please let us know          |
|    if you can join us."                  |
|                                          |  <- 32px gap
|                                          |
|   +--------------------------------------+
|   |  RSVP FORM PANEL                    |  <- Treatment D (navy-mid, border)
|   |                                      |
|   |   Your name                          |  <- Label: Outfit 13px, gold
|   |   [ __________________________ ]     |  <- Input: navy bg, gold underline
|   |                                      |
|   |   Number of guests                   |
|   |   [ __________________________ ]     |
|   |                                      |
|   |   Attending                          |
|   |   ( ) Joyfully accept               |  <- Radio: gold circle, cream text
|   |   ( ) Regretfully decline            |
|   |                                      |
|   |   Message for the couple             |
|   |   [ __________________________ ]     |  <- Textarea, 3 rows
|   |   [ __________________________ ]     |
|   |   [ __________________________ ]     |
|   |                                      |
|   |   [ ---- SEND RESPONSE ---- ]       |  <- Button: gold border, cream text
|   |                                      |     On hover: gold fill, midnight text
|   +--------------------------------------+
|                                          |
|   [ rose line-art border ]              |  <- Mirrored roses below the form
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Form Design Language

The form should not break the invitation's aesthetic. Key design decisions:

**Input fields**: No visible box borders. Use a bottom-border-only style:
- Background: transparent
- Border: none except `border-bottom: 1px solid var(--tj-divider)`
- Focus state: `border-bottom-color: var(--tj-gold)`; subtle gold glow
- Text: Outfit Light 15px, `--tj-cream`
- Placeholder: `--tj-cream-soft` at 50% opacity

**Labels**: Outfit Regular 13px, `--tj-gold`, positioned above their input with 4px gap.

**Radio buttons**: Custom styled — gold circle outline (unfilled), gold filled circle when selected. Label text in `--tj-cream`, Outfit Light 15px.

**Submit button**:
- Default: transparent background, `--tj-gold` 1px border, `--tj-cream` text, Cormorant Garamond 16px, letter-spacing 0.12em
- Hover: `--tj-gold` background, `--tj-midnight` text
- Active: `--tj-gold-bright` background
- Disabled (submitting): opacity 0.6, "Sending..." text
- Width: 100% of form panel
- Height: 48px
- Transition: 200ms ease

**Form panel**: Treatment D — `--tj-navy-mid` background, `--tj-border-glow`, `border-radius: 2px`, padding 24px. This elevated surface visually contains the form.

### Visual Hierarchy

1. **Section heading and invitation text** — sets the emotional context
2. **Form inputs** — functional, clean, not competing with decoration
3. **Submit button** — clear call to action at the bottom
4. **Rose border below** — decorative closure of the interactive section

### Background Treatment

Section background: Treatment A (solid midnight). The form panel itself uses Treatment D (elevated navy-mid).

### Transition to Next Section

A minimal gap (48px) of solid midnight. No ornamental divider — the transition from the structured form to the gallery grid is marked by the visual shift from contained panel to open image grid.

---

## Section 7: Gallery

**Purpose**: A curated photo gallery of the couple. Visually rich, letting photographs speak with minimal text interference.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- 64px top padding
|        [ section heading ]               |
|        "OUR MOMENTS"                     |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 32px gap
|                                          |
|   GALLERY GRID                           |
|   +------------------+------------------+|
|   |                  |                  ||  <- Row 1: two equal images
|   |   [ photo 1 ]   |   [ photo 2 ]   ||     Each: 171px wide (354 / 2 - gap)
|   |                  |                  ||     Aspect: 3:4
|   +------------------+------------------+|     Gap: 12px
|   |                                     ||
|   |          [ photo 3 — wide ]         ||  <- Row 2: single full-width image
|   |                                     ||     354px wide, aspect 16:9
|   |                                     ||
|   +------------------+------------------+|
|   |                  |                  ||  <- Row 3: two equal images
|   |   [ photo 4 ]   |   [ photo 5 ]   ||     Same as row 1
|   |                  |                  ||
|   +------------------+------------------+|
|   |                                     ||
|   |          [ photo 6 — wide ]         ||  <- Row 4: full-width (optional)
|   |                                     ||
|   +-------------------------------------+|
|                                          |
|   Row gap: 12px throughout               |
|                                          |  <- 64px bottom padding
+------------------------------------------+
```

### Gallery Grid Design

A masonry-like alternating grid pattern:
- **Row pattern**: 2-up, 1-wide, 2-up, 1-wide (repeating)
- **2-up images**: Each 171px wide, 3:4 aspect ratio (171 x 228px), 12px gap between them
- **Wide images**: 354px full content width, 16:9 aspect ratio (354 x 199px)
- **Row gap**: 12px vertical
- **Total grid width**: 354px (full content area)

This alternating pattern creates visual rhythm and avoids the monotony of a uniform grid.

### Photo Treatment

- All photos have a subtle gold border: `--tj-border-glow` (1px gold at 25% opacity)
- `border-radius: 2px`
- Tap/click opens a full-screen lightbox (simple overlay with the image, close button, and swipe navigation)
- Photos lazy-load below the fold; the first two get `loading="eager"`
- `object-fit: cover` with `object-position: center`

### Arch Frame Option (alternate treatment)

If fewer photos are available (3-4), switch to a single-column layout where each photo sits inside a pointed arch clip-path, arranged vertically with 24px spacing. This works better for portrait-oriented couple photos.

### Visual Hierarchy

1. **Photos** — they are the content; everything else defers to them
2. **Section heading** — identifies the section, then gets out of the way
3. **Gold borders** — unify the photos with the template's design language

### Background Treatment

Treatment A — Solid midnight. The photos provide all the visual richness; no competing patterns.

### Transition to Next Section

An ornamental divider (gold line with central rose motif, 40% width) separates Gallery from Closing. This rose divider signals the approaching end of the invitation.

---

## Section 8: Closing

**Purpose**: A gracious farewell. Thank the guest, reinforce the couple's identity, and leave a lasting warm impression. This section is the emotional bookend to the Opening.

### Layout Structure

```
+------------------------------------------+
|                                          |  <- 80px top padding
|                                          |
|      [ dome silhouette, 8% opacity ]     |  <- Centered, 200px wide
|      [ behind all content ]              |     Taj dome profile as watermark
|                                          |
|        [ section heading ]               |
|     "WITH LOVE AND GRATITUDE"            |  <- Cormorant Garamond 28px, gold
|   [ ---- ornamental divider ---- ]       |
|                                          |  <- 32px gap
|                                          |
|     We thank you for being part          |  <- Outfit Light 15px, cream-soft
|     of our journey. Your presence        |     Centered, max 300px
|     and blessings mean the world         |
|     to us and our families.              |
|                                          |  <- 24px gap
|                                          |
|          Aisha & Farhan                  |  <- Cormorant Garamond 28px, cream
|                                          |  <- 8px gap
|   [ ---- short gold rule, 20% ---- ]    |
|                                          |  <- 8px gap
|          The Khan & Ahmed                |  <- Outfit Light 13px, cream-soft
|            Families                      |
|                                          |  <- 48px gap
|                                          |
|     [ crescent moon + 3 stars ]          |  <- Centered, gold, small (24px moon)
|                                          |     Echoes the opening section's
|                                          |     crescent, bringing the journey
|                                          |     full circle
|                                          |
|                                          |  <- 120px bottom padding
+------------------------------------------+
```

### Visual Hierarchy

1. **Couple names** — the final statement, centered and prominent
2. **Gratitude text** — warm, personal, the emotional content
3. **Family names** — supporting, acknowledging the families
4. **Crescent and stars** — visual closure, echoing the opening
5. **Dome silhouette** — ambient atmosphere, barely visible watermark

### Emotional Arc Closure

The Closing section mirrors the Opening in deliberate ways:
- Opening has a crescent moon in the upper portion; Closing has one at the bottom
- Opening reveals names from darkness; Closing presents them as the final word
- Opening uses the Taj video/photo; Closing uses the Taj dome as a ghostly silhouette
- Both use the midnight background with no competing patterns

This symmetry gives the invitation a sense of completeness — a journey that begins and ends with the same visual language.

### Background Treatment

Treatment C — Subtle vertical gradient from `--tj-midnight` to `--tj-deep`, matching the Countdown section. The slight darkening at the bottom signals finality.

The dome silhouette is rendered as an inline SVG, centered horizontally, positioned behind the text content, at 8% opacity in `--tj-gold`. It spans approximately 200px wide and 160px tall, showing just the dome-and-finial profile.

### Transition

This is the final section. No transition needed. The 120px bottom padding gives generous breathing room before the viewport edge.

---

## Cross-Section Design Patterns

### Ornamental Divider Variations

Five distinct dividers are used throughout to avoid repetition:

| Between | Center Motif | Width | Notes |
|---------|-------------|-------|-------|
| Couple / Dua | 4-pointed star | 50% | Standard |
| Dua / Countdown | Tiny crescent (12px) | 40% | Spiritual to temporal transition |
| Countdown / Celebrations | Dome silhouette (20px) | 60% | Widest divider, marks the major shift |
| Celebrations / RSVP | Diamond | 40% | Clean, functional |
| Gallery / Closing | Rose motif | 40% | Warm, approaching the farewell |

All dividers share: 1px gold stroke (`--tj-gold`), centered horizontally, with 48px vertical space above and below (except the Countdown/Celebrations divider which gets 56px).

### Section Heading Pattern

Every section (except Opening) uses the same heading treatment:
1. Heading text: Cormorant Garamond Medium (500), 28px, `--tj-gold`, uppercase, letter-spacing 0.12em, centered
2. Below (8px gap): ornamental divider at 30% width with a small center node

This consistency unifies the sections while the varying content and background treatments prevent monotony.

### Content Alignment

All text content is **center-aligned** throughout the invitation. This matches the bilateral symmetry established by the Taj Mahal reference and is appropriate for the ceremonial, formal tone of a wedding invitation. Left-alignment is used only within event cards for scannable details (date, time, venue).

### Vertical Rhythm Summary

```
Section  | Top pad | Bottom pad | Internal major gap | Internal minor gap
---------|---------|------------|-------------------|------------------
Opening  | 0       | 0          | —                 | —
Couple   | 64px    | 64px       | 32px              | 24px
Dua      | 64px    | 64px       | 32px              | 16px
Countdown| 64px    | 64px       | 32px              | 24px
Celebs   | 64px    | 64px       | 24px (card gap)   | 16px
RSVP     | 64px    | 64px       | 32px              | 24px
Gallery  | 64px    | 64px       | 12px (grid gap)   | —
Closing  | 80px    | 120px      | 24px              | 8px
```

---

## Layout Variation Strategy

To avoid the "card-after-card" monotony, the 8 sections use 6 distinct layout approaches:

| Section | Layout Type |
|---------|------------|
| Opening | Full-bleed media with text overlay |
| Couple | Central focal image with arch frame, text below |
| Dua | Pure typography, no images or cards |
| Countdown | Numeric display grid with written date |
| Celebrations | Stacked event cards with architectural headers |
| RSVP | Interactive form panel within narrative text |
| Gallery | Alternating photo grid (2-up / wide) |
| Closing | Typographic farewell with watermark illustration |

No two adjacent sections share the same layout type.

---

*These blueprints are the implementation guide for the Taj template's 8 sections. Refer to `design-bible.md` for all color, typography, spacing, and animation token values.*

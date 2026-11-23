# Jaipur Theme — Section Blueprints

Each section is designed to feel like a distinct room in a haveli, connected by architectural transitions (arch dividers and glow lines). The page reads as a vertical journey through the palace.

---

## 1. Opening

**Layout**: Full viewport, center-aligned overlay, video background
- Width: 100vw, Height: 100dvh
- Names positioned at bottom 12%, centered
- CTA at bottom 8%

**Background**: Hawa Mahal video (`preload="auto"`, `muted`, `playsInline`)
- Overlay gradient: 30% navy top → 10% clear middle → 45% navy bottom
- Subtle enough to let the palace architecture read clearly
- No SVG decorations over video — the architecture IS the decoration

**Typography**:
- Groom/bride names: Cormorant Garamond 300, `clamp(2.4rem, 8vw, 3.6rem)`, cream, `letter-spacing: 0.08em`
- Ampersand: Cormorant Garamond 300 italic, 1.6rem, rose-gold-light
- Date: Josefin Sans 300, 0.85rem, blush-light, `letter-spacing: 0.2em` uppercase
- CTA: Josefin Sans 300, 0.75rem, cream at 0.8 opacity, `letter-spacing: 0.25em` uppercase

**Decorative elements**: None on this section. The video provides all visual richness.

**Content structure**:
1. Video background (fullscreen)
2. Gradient overlay
3. CTA prompt ("Touch to begin")
4. Names block: Groom → Ampersand → Bride → Date

**Spacing**: Names container 90% width, max 420px. 4px margin on ampersand. 12px above date.

**Unique feature**: Names reveal triggered at 70% video progress, timed to match the palace's golden illumination peak. Names emerge from blur with staggered opacity, as if the warm light is revealing them.

**Animation**:
- CTA: 2s pulse (opacity 0.6 → 1.0)
- On tap: CTA fades out (0.2s), video plays
- At 70% video time: name reveal timeline fires — groom (1s, blur→clear), ampersand (0.7s), bride (1s, blur→clear), date (0.7s)
- After reveal: 1.8s pause then auto-scroll to Couple section

---

## 2. Couple

**Layout**: Centered, single column
- Max-width: 420px
- Element order: Heading → Names (Groom full name, ampersand, Bride full name) → Parents

**Background**: `--jt-navy` (flat)
- Enhancement opportunity: add jali pattern overlay at 2–3% opacity for subtle texture

**Typography**:
- Section heading: Josefin Sans 300, 0.7rem, sandstone-light, `letter-spacing: 0.3em` uppercase
- Full names: Cormorant Garamond 400, `clamp(2rem, 7vw, 3rem)`, cream, `letter-spacing: 0.06em`
- Ampersand: Cormorant Garamond 300 italic, 1.4rem, rose-gold
- Parent label: Josefin Sans 300, 0.65rem, sandstone, `letter-spacing: 0.25em` uppercase
- Parent names: Cormorant Garamond 400, 1rem, blush

**Decorative elements**:
- Optional jali lattice overlay (absolute positioned, 2–3% opacity, pointer-events: none)
- Arch divider above this section (between Opening and Couple)

**Content structure**:
1. Heading ("Together with Their Families...")
2. Names block with ampersand
3. Groom's parents (label + names)
4. Bride's parents (label + names)

**Spacing**: 40px heading-to-names, 32px names-to-parents, 24px between parent blocks, 100px section padding

**Unique feature**: This is the most typographically grand section after the opening. The full names in Cormorant Garamond at large size give it the weight of a formal royal proclamation.

**Animation**: Staggered opacity reveal (heading, then each name, then each parent block), 0.8s duration, 0.12s stagger, triggered at `top 75%`

---

## 3. Shloka (Sanskrit Blessing)

**Layout**: Centered, narrow column
- Max-width: 360px for Sanskrit, 340px for translation
- This section is intentionally tighter — a meditative pause

**Background**: Gradient — `--jt-navy` → `rgba(183, 110, 121, 0.08)` at center → `--jt-navy`
- The rose-gold tint at center creates a warm "sacred glow" zone — like light filtering through a temple doorway

**Typography**:
- Sanskrit: Noto Serif Devanagari 500, `clamp(1.1rem, 4vw, 1.5rem)`, gold, `line-height: 2.0`
- Translation: Cormorant Garamond 300 italic, 0.95rem, blush at 0.85 opacity, `line-height: 1.8`

**Decorative elements**:
- Glow line divider above (Couple → Shloka transition)
- Arch divider below (Shloka → Countdown transition)
- The gradient background IS the decoration — no additional SVGs needed

**Content structure**:
1. Sanskrit verse (Devanagari script)
2. English translation (italic serif)

**Spacing**: 80px vertical padding (tighter than standard), 20px between Sanskrit and translation

**Unique feature**: The only section using the Devanagari typeface and gold color. Framed by a warm gradient that sets it apart as sacred space. The wider line-height (2.0) on the Sanskrit text gives each syllable room to breathe — a typographic temple.

**Animation**: Sanskrit fades to opacity 1 (1s), then translation (1s, 0.3s stagger). Slower than other sections — unhurried, contemplative.

---

## 4. Countdown

**Layout**: Centered, horizontal timer
- Timer: flex row with 24px gap, max-width 420px
- Each unit: column (number above, label below)

**Background**: `--jt-navy-deep` (flat, clean)
- No texture — the numbers need stark clarity against the deepest background

**Typography**:
- Section label: Josefin Sans 300, 0.7rem, sandstone-light, `letter-spacing: 0.3em` uppercase
- Numbers: Cormorant Garamond 300, `clamp(2rem, 8vw, 3.2rem)`, cream, `line-height: 1`
- Unit labels: Josefin Sans 300, 0.6rem, sandstone, `letter-spacing: 0.2em` uppercase

**Decorative elements**:
- Arch divider above (Shloka → Countdown)
- Glow line below (Countdown → Celebrations)
- Each countdown unit could have a faint vertical separator between them (1px, rose-gold at 8% opacity) — enhancement opportunity

**Content structure**:
1. Label ("Counting Down To")
2. Timer row: Days | Hours | Minutes | Seconds

**Spacing**: 32px label-to-timer, 8px number-to-unit-label, 64px min-width per unit, 100px section padding

**Unique feature**: The Cormorant Garamond light weight at large size gives the numbers an almost calligraphic quality — they don't look like a digital clock, they look hand-lettered. The two-digit zero-padded format reinforces formality.

**Animation**: Label and then each unit fade in with 0.1s stagger, 0.7s duration. Numbers update every second via state (no animation on number changes — just swap).

---

## 5. Celebrations

**Layout**: Centered, vertical card stack
- Cards max-width: 420px
- Cards stacked vertically with 40px gap

**Background**: `--jt-navy` (flat)
- Optional enhancement: extremely faint jali at outer edges (not behind cards)

**Typography**:
- Section title: Josefin Sans 300, 0.7rem, sandstone-light, `letter-spacing: 0.3em` uppercase
- Event title: Cormorant Garamond 500, 1.5rem, rose-gold-light, `letter-spacing: 0.04em`
- Date: Josefin Sans 300, 0.8rem, cream, `letter-spacing: 0.15em`
- Time: Josefin Sans 300, 0.75rem, sandstone-light, `letter-spacing: 0.1em`
- Venue: Cormorant Garamond 500, 1.05rem, blush
- Address: Josefin Sans 300, 0.7rem, sandstone, `letter-spacing: 0.1em`

**Decorative elements**:
- Glow line divider above (Countdown → Celebrations)
- Arch divider below (Celebrations → RSVP)
- Event cards have rose-gold border at 15% opacity and rose-gold background at 4%
- Enhancement: small ornamental motif between event title and date (a tiny cusped arch, 20px wide, at 20% opacity)

**Content structure (per card)**:
1. Event title (Mehendi, Sangeet, etc.)
2. Date (full weekday + month + day + year)
3. Time
4. Venue name
5. Venue address

**Spacing**: 48px section-title-to-cards, 32px card padding, 16px between title→date and time→venue, 4px between venue→address and date→time

**Unique feature**: Each card is a miniature invitation within the invitation — the rose-gold-tinted containers against the dark navy read like lit doorways in the Hawa Mahal facade. The serif event title at medium weight gives each ceremony its own dignity.

**Animation**: Cards reveal one-by-one as they enter viewport, 0.8s opacity each, 0.15s stagger between cards, each triggered independently at `top 80%`.

---

## 6. RSVP

**Layout**: Centered form
- Form max-width: 360px
- Fields stacked vertically with 20px gap

**Background**: `--jt-navy-deep` (flat, clean)
- Functional section — no texture, no distraction from the form

**Typography**:
- Section title: Josefin Sans 300, 0.7rem, sandstone-light, `letter-spacing: 0.3em` uppercase
- Field labels: Josefin Sans 300, 0.65rem, sandstone, `letter-spacing: 0.2em` uppercase
- Input text: Josefin Sans 300, 0.85rem, cream
- Placeholder: cream at 30% opacity
- Button: Josefin Sans 400, 0.75rem, cream on rose-gold, `letter-spacing: 0.25em` uppercase
- Attendance buttons: Josefin Sans 300, 0.8rem, cream, `letter-spacing: 0.1em`
- Thank-you heading: Cormorant Garamond 400, 1.5rem, rose-gold-light
- Thank-you body: Josefin Sans 300, 0.85rem, blush

**Decorative elements**:
- Arch divider above (Celebrations → RSVP)
- Glow line below (RSVP → Gallery)
- Form inputs themselves are the decoration — the rose-gold focus border is the only color moment

**Content structure**:
1. Title ("Kindly Respond")
2. Name field
3. Attendance toggle (Joyfully Accept / Regretfully Decline)
4. Guest count select
5. Dietary field
6. Submit button
7. (After submit) Thank-you message

**Spacing**: 32px title-to-form, 20px between fields, 6px label-to-input, 8px above submit, 12px attendance gap

**Unique feature**: The attendance buttons use courtly language ("Joyfully Accept" / "Regretfully Decline") befitting a royal invitation. The form is deliberately minimal — this is a functional section that respects the user's time. The rose-gold focus states are the only animation-like moments.

**Animation**: Title, then each field, then submit button fade in with 0.1s stagger, 0.7s duration, triggered at `top 75%`.

---

## 7. Gallery

**Layout**: 2×2 grid
- Grid max-width: 420px
- Square aspect ratio items, 12px gap

**Background**: `--jt-navy` (flat)

**Typography**:
- Section title: Josefin Sans 300, 0.7rem, sandstone-light, `letter-spacing: 0.3em` uppercase
- Placeholder text: Josefin Sans 300, 0.6rem, sandstone at 50% opacity, `letter-spacing: 0.15em` uppercase

**Decorative elements**:
- Glow line divider above (RSVP → Gallery)
- Glow line below (Gallery → Closing)
- Gallery items have rose-gold tinted background (`rgba(183, 110, 121, 0.08)`)
- Enhancement: on the first item (hero photo), use 3:4 aspect ratio spanning full width; remaining 3 items in 2+1 layout below

**Content structure**:
1. Section title ("Our Moments")
2. Photo grid (4 placeholders, or actual images when provided)

**Spacing**: 40px title-to-grid, 12px grid gap, 100px section padding

**Unique feature**: The gallery is intentionally understated — in a template this ornate, a simple grid prevents visual fatigue. The rose-gold placeholder tint keeps even empty states on-brand. Future enhancement: Masonry layout with varied aspect ratios for a less rigid feel.

**Animation**: Grid items fade in together with 0.1s stagger, 0.6s duration, triggered at `top 75%`.

---

## 8. Closing

**Layout**: Centered, minimal
- Max-width: 340px for blessing, unconstrained for names/date
- Generous bottom padding (60px) to give the page a gentle ending

**Background**: `--jt-navy-deep` (flat)
- Enhancement opportunity: very faint radial gradient at center-bottom using rose-gold at 3% — a warm glow as if the candle from the Shloka section reaches here

**Typography**:
- Blessing: Cormorant Garamond 300 italic, 1.1rem, blush, `line-height: 1.8`
- Names: Cormorant Garamond 400, 1.6rem, cream, `letter-spacing: 0.06em`
- Date: Josefin Sans 300, 0.7rem, sandstone, `letter-spacing: 0.25em` uppercase

**Decorative elements**:
- Glow line divider above (Gallery → Closing)
- Optional: small ornamental flourish below the date — a single cusped arch motif, 40px wide, sandstone at 20% opacity
- No jali — end clean

**Content structure**:
1. Blessing text (italic, emotional)
2. Couple names (first names with ampersand)
3. Date

**Spacing**: 32px blessing-to-names, 8px names-to-date, 100px top padding, 60px bottom padding

**Unique feature**: This section is the quietest — after the richness of everything above, the closing is a breath out. Just a blessing, two names, and a date. The italic Cormorant Garamond blessing at blush color reads like a handwritten note tucked inside the invitation.

**Animation**: Blessing, then names, then date fade in with 0.2s stagger, 0.9s duration. The longest stagger on the page — the ending should feel slow and warm.

---

## Divider Sequence

The alternation between arch dividers and glow lines creates visual rhythm:

```
Opening
  ↓ [Arch Divider]
Couple
  ↓ [Glow Line]
Shloka
  ↓ [Arch Divider]
Countdown
  ↓ [Glow Line]
Celebrations
  ↓ [Arch Divider]
RSVP
  ↓ [Glow Line]
Gallery
  ↓ [Glow Line]
Closing
```

This A-B-A-B pattern prevents monotony. Arch dividers mark major structural transitions (after video, after sacred text, after the most content-heavy section). Glow lines are softer, connecting related sections.

---

## Enhancement Roadmap

These are not in the initial build but should be considered for polish:

1. **Jali overlay on Couple and Celebrations** — adds depth without implementation complexity
2. **Radial glow on Closing** — warm center-bottom glow at 3% rose-gold
3. **Ornamental micro-motif between event title and date** — tiny cusped arch, 20px
4. **Countdown separators** — 1px vertical lines between timer units at 8% opacity
5. **Gallery masonry** — hero image full-width, 3 smaller below
6. **Closing flourish** — small ornamental arch below the final date
7. **Page-level jali** — extremely faint (1–2%) repeating jali on the entire page container, visible only on close inspection

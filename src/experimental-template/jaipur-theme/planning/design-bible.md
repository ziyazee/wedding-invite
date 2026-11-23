# Jaipur Theme — Design Bible

## Identity

This template draws from the architecture of Jaipur's Hawa Mahal — the Palace of Winds — at night. The video opening shows the palace moving from darkness through warm illumination to golden radiance with fireworks. The rest of the invitation extends that emotional arc: dark stillness giving way to warm, rosy light, as if the palace's 953 jharokha windows are each glowing with celebration.

The palette leans warmer and rosier than a standard gold-and-navy "Indian luxury" template. The defining accent is rose gold, not yellow gold. The sandstone reads pink, not tan. The overall impression should be a desert night sky above a warm, lit haveli — intimate despite the grandeur.

### What makes this "Rajasthani royal" vs generic luxury
- **Architectural motifs**: Jali lattice patterns, cusped Mughal arches, jharokha (projecting window) silhouettes — all derived from Hawa Mahal's actual facade geometry
- **Warm-over-cool**: Rose gold and terracotta dominant over silver or platinum. Gold is supporting, not leading
- **Texture through opacity**: Layered jali patterns at 2–4% opacity create depth without visual noise — the way real jali screens filter light
- **Monumental verticality**: Tall section padding, stacked text, generous vertical breathing room — echoing the palace's five-storey stepped facade
- **Devanagari as design element**: The Sanskrit shloka section uses Noto Serif Devanagari not as a novelty font but as a sacred typographic moment — larger, gold, spaced wider than body text

---

## Color System

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `--jt-navy-deep` | `#060914` | Deepest background (Opening, Countdown, RSVP, Closing) |
| `--jt-navy` | `#0B1026` | Primary background (Couple, Celebrations, Gallery) |
| `--jt-rose-gold` | `#B76E79` | Primary accent — borders, active states, buttons, ampersand |
| `--jt-rose-gold-light` | `#D4929B` | Lighter accent — event titles, highlighted text, hover states |
| `--jt-sandstone` | `#C4956A` | Secondary accent — labels, muted text, address lines |
| `--jt-sandstone-light` | `#D4B08C` | Slightly brighter secondary — section headings |
| `--jt-blush` | `#E8C4B8` | Warm near-white — parent names, venue names, translation text |
| `--jt-blush-light` | `#F2DDD5` | Lightest warm tone — date on opening overlay |
| `--jt-cream` | `#FAF0E6` | Primary text color — names, body text on dark backgrounds |
| `--jt-cream-warm` | `#F5E6D3` | Slightly deeper cream — reserved for specific highlights |
| `--jt-terracotta` | `#C67B5C` | Warm earthy accent — sparing use for decorative elements |
| `--jt-terracotta-deep` | `#8B4513` | Deep earth — unused directly, available for SVG fills |
| `--jt-gold` | `#D4A853` | Gold accent — Sanskrit text, glow line centers, arch keystones |
| `--jt-gold-warm` | `#C5964A` | Deeper gold — reserved for metallic gradient endpoints |
| `--jt-pink-stone` | `#D4A5A5` | Muted pink — gallery placeholders, subtle tints |

### Usage Rules

**Backgrounds**: Alternate `--jt-navy-deep` and `--jt-navy` between sections. Never use the same background for adjacent sections. The alternation creates a subtle breathing rhythm.

**Text hierarchy**:
1. Names / hero text → `--jt-cream`
2. Event titles → `--jt-rose-gold-light`
3. Venue / parent names → `--jt-blush`
4. Section labels → `--jt-sandstone-light`
5. Small labels, addresses → `--jt-sandstone`

**Accents**: Rose gold (`--jt-rose-gold`) is the primary interactive/accent color. Gold (`--jt-gold`) is sacred — use only for the shloka, glow lines, and arch keystones. Never use gold for buttons or interactive elements.

**Borders**: Always use rose gold at low opacity: `rgba(183, 110, 121, 0.15)` for containers, `rgba(183, 110, 121, 0.2)` for form inputs. Never use solid white or gray borders.

**Glows**: Rose-gold-to-gold gradients for horizontal dividers. Vertical light bleeds use rose gold at 4–6% opacity as radial gradients.

---

## Typography

### Font Stack

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display | Cormorant Garamond | 300 (light) | Opening names, couple names |
| Display emphasis | Cormorant Garamond | 400 (regular) | Full names, closing names, venue names |
| Display medium | Cormorant Garamond | 500 | Event titles |
| Ampersand | Cormorant Garamond | 300 italic | The "&" between names |
| Body | Josefin Sans | 300 (light) | All body text, labels, CTAs |
| Body emphasis | Josefin Sans | 400 (regular) | Submit button, active states |
| Sacred | Noto Serif Devanagari | 500 | Sanskrit shloka text |

### Type Scale

| Element | Size | Weight | Spacing | Line-height | Family |
|---------|------|--------|---------|-------------|--------|
| Opening names | `clamp(2.4rem, 8vw, 3.6rem)` | 300 | 0.08em | 1.1 | Display |
| Couple full names | `clamp(2rem, 7vw, 3rem)` | 400 | 0.06em | 1.15 | Display |
| Closing names | 1.6rem | 400 | 0.06em | 1.2 | Display |
| Event titles | 1.5rem | 500 | 0.04em | 1.3 | Display |
| Thank-you heading | 1.5rem | 400 | — | 1.3 | Display |
| Blessing text | 1.1rem | 300 italic | — | 1.8 | Display |
| Shloka Sanskrit | `clamp(1.1rem, 4vw, 1.5rem)` | 500 | — | 2.0 | Devanagari |
| Shloka translation | 0.95rem | 300 italic | — | 1.8 | Display |
| Venue name | 1.05rem | 500 | — | 1.4 | Display |
| Parent names | 1rem | 400 | — | 1.5 | Display |
| Countdown numbers | `clamp(2rem, 8vw, 3.2rem)` | 300 | — | 1 | Display |
| Opening ampersand | 1.6rem | 300 italic | — | 1 | Display |
| Couple ampersand | 1.4rem | 300 italic | — | 1 | Display |
| Body / input text | 0.85rem | 300 | — | 1.6 | Body |
| Event date | 0.8rem | 300 | 0.15em | 1.5 | Body |
| CTA text | 0.75rem | 300 | 0.25em uppercase | 1 | Body |
| Submit button | 0.75rem | 400 | 0.25em uppercase | 1 | Body |
| Event time / address | 0.7–0.75rem | 300 | 0.1em | 1.5 | Body |
| Section labels | 0.7rem | 300 | 0.3em uppercase | 1 | Body |
| Small labels | 0.65rem | 300 | 0.2–0.25em uppercase | 1 | Body |
| Countdown unit label | 0.6rem | 300 | 0.2em uppercase | 1 | Body |
| Gallery placeholder | 0.6rem | 300 | 0.15em uppercase | 1 | Body |

### Text Shadows (Opening only)
- Names: `0 2px 20px rgba(0, 0, 0, 0.5)` — deep but diffuse
- Ampersand: `0 2px 16px rgba(0, 0, 0, 0.4)` — slightly less
- Date: `0 1px 12px rgba(0, 0, 0, 0.4)` — subtle

No text shadows on any section below the opening.

---

## Spacing

### Section Padding
- Standard sections: `100px` vertical, `24px` horizontal
- Shloka section: `80px` vertical (slightly tighter — it's a meditative pause, not a full section)
- Closing: `100px` top, `60px` bottom (ends the page gracefully)
- Content max-width: `420px` for most content, `360px` for intimate text (shloka, blessing, form)

### Element Spacing
- Section label to first content: `32–48px`
- Between name blocks (groom/bride): `8px` gap via the ampersand margin
- Between parent blocks: `24px`
- Between event cards: `40px`
- Form field gap: `20px`
- Countdown unit gap: `24px`
- Gallery grid gap: `12px`

### Dividers
- Divider container: `24px` vertical padding
- Glow line: `2px` height, `60%` width, `200px` max-width, `0.4` opacity
- Arch SVG: full width with `max-width: 360px`, auto height

---

## Background Treatments

### Section-by-section

| Section | Background | Overlay/Texture |
|---------|-----------|-----------------|
| **Opening** | Video (Hawa Mahal) | Linear gradient: 30% navy top → 10% clear middle → 45% navy bottom |
| **Couple** | `--jt-navy` flat | Optional: jali pattern at 2–3% opacity as repeating background |
| **Shloka** | Gradient: navy → rose-gold 8% at center → navy | The rose tint creates a warm "sacred glow" zone |
| **Countdown** | `--jt-navy-deep` flat | Clean — let the numbers breathe |
| **Celebrations** | `--jt-navy` flat | Optional: very faint jali at edges only |
| **RSVP** | `--jt-navy-deep` flat | Clean — functional section |
| **Gallery** | `--jt-navy` flat | Clean grid |
| **Closing** | `--jt-navy-deep` flat | Optional: very faint radial rose-gold glow at center bottom |

### Jali Overlay Rules
- Never exceed 4% opacity
- Use as `background-image` with `repeat` and `60px` size, or as an absolutely positioned SVG
- Position with `pointer-events: none` — never block interaction
- Best on Couple and Celebrations sections as a subtle depth layer
- Never on RSVP (distracts from form) or Opening (video is the visual)

---

## Decorative Elements

### Arch Dividers
- SVG-based, `currentColor` for theme adherence
- Central cusped arch (Mughal style) with optional flanking smaller arches
- Thin strokes: 0.4–0.8px
- Low opacity: 0.12–0.3 range
- Keystone dot at top center of main arch
- Horizontal lines extending from arch base to edges, fading out
- Place between: Opening→Couple, Shloka→Countdown, Celebrations→RSVP

### Glow Lines
- Horizontal gradient: `transparent → rose-gold → gold → rose-gold → transparent`
- 2px height, 0.4 opacity
- Place between: Couple→Shloka, Countdown→Celebrations, RSVP→Gallery, Gallery→Closing
- Alternate with arch dividers — never use the same type twice in a row

### Jali Pattern SVG
- Tiled geometric pattern inspired by Hawa Mahal's lattice screens
- Central 8-pointed star motif at each tile center
- Curved lattice arcs connecting tile edges
- Corner dots at grid intersections
- All strokes and fills use `currentColor` at very low opacity (3–8%)

---

## Event Card Containers

- Padding: `32px 20px`
- Border: `1px solid rgba(183, 110, 121, 0.15)` — rose gold at 15%
- Border-radius: `2px` — barely rounded, architecturally sharp
- Background: `rgba(183, 110, 121, 0.04)` — rose gold at 4%
- No shadow — depth comes from the border and background tint
- Content centered within

---

## Form Elements

- Input background: `rgba(255, 255, 255, 0.05)`
- Input border: `1px solid rgba(183, 110, 121, 0.2)`
- Focus border: `var(--jt-rose-gold)` solid
- Placeholder color: `rgba(250, 240, 230, 0.3)`
- Border-radius: `2px` throughout — sharp, consistent
- Transitions: `0.3s ease` for border-color
- Button: solid `--jt-rose-gold` background, cream text, hover to `--jt-rose-gold-light`
- Attendance toggle: transparent default, active gets rose-gold bg at 15% + rose-gold border

---

## Animation Principles

- **No translateY/fade-up**: Forbidden per project rules (breaks drag in edit mode)
- **Opacity-only reveals**: Elements fade from 0 to 1, with `stagger: 0.1–0.15`
- **Opening name reveal**: blur(3px) → blur(0) with opacity and slight y-shift (allowed on opening only since it's not editable)
- **Easing**: `power2.out` for scroll reveals, `power3.out` for opening timeline
- **Duration**: 0.7–1.0s for section reveals, 0.2s for micro-interactions
- **ScrollTrigger**: `start: 'top 75%'`, `once: true` — fire once, don't replay
- **Reduced motion**: All animation gated behind `prefers-reduced-motion` check; elements show at full opacity immediately

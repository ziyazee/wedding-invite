# Punjabi Premium -- Design Bible

> Authoritative creative direction for the entire invitation. All implementation agents must follow this document.

---

## 1. Creative Vision Statement

Punjabi Premium is a digital wedding invitation that channels the grandeur of Mughal architecture and the warmth of a Punjabi garden celebration into a painterly, illustration-led experience. The palette lives entirely in warm blush-gold territory -- cream backgrounds deepen into peachy gradients, magenta florals cascade over sandstone arches, and gold accents suggest auspicious metallic thread rather than flashy shimmer. Every section feels like a page from a hand-illustrated wedding storybook: soft watercolor textures, layered depth planes, and organic floral forms that break the strict symmetry of the architectural framing. Cultural markers -- the groom's pagri, the Mughal arch, the toran hangings, the lotus base -- are woven into the aesthetic naturally, never presented as isolated ethnic badges. The result is opulent without being heavy, romantic without being saccharine, and distinctly Punjabi without being a caricature.

---

## 2. Color System

### 2.1 Background Palette

| Token | Hex | Role |
|-------|-----|------|
| `--pp-bg-cream` | `#F5E6D3` | Primary background, paper-like base |
| `--pp-bg-blush` | `#F0D5C0` | Gradient warm center, peachy shift |
| `--pp-bg-ivory` | `#FAF3EB` | Lightest surface, card interiors |

### 2.2 Architectural / Surface Palette

| Token | Hex | Role |
|-------|-----|------|
| `--pp-arch-beige` | `#E8D5C0` | Arch stone, sandstone surfaces |
| `--pp-arch-pillar` | `#DBBFA8` | Pillar tint, slightly warmer |
| `--pp-surface-warm` | `#F2E4D4` | Elevated cards, event tiles |

### 2.3 Floral / Decorative Palette

| Token | Hex | Role |
|-------|-----|------|
| `--pp-pink-bright` | `#E84080` | Bougainvillea, bold floral accents |
| `--pp-pink-rose` | `#D4708A` | Roses, softer floral clusters |
| `--pp-pink-lotus` | `#E8A0A8` | Lotus petals, gentle pink |
| `--pp-pink-deep` | `#C43068` | Lehenga crimson, richest pink |
| `--pp-green-sage` | `#7A9A6A` | Leaves, topiary, garden foliage |
| `--pp-green-deep` | `#3D6B4A` | Dark foliage accents, depth |
| `--pp-purple-mauve` | `#8B5E8B` | Ornament terminals, small accents |

### 2.4 Gold / Metallic Palette

| Token | Hex | Role |
|-------|-----|------|
| `--pp-gold` | `#C9A84C` | Primary gold, ornaments, borders |
| `--pp-gold-dark` | `#8B6B3D` | Monogram, deep gold text |
| `--pp-gold-light` | `#DECC8A` | Hover highlights, gold tint |
| `--pp-gold-muted` | `#B59A5A` | Divider lines, subtle gold |

### 2.5 Text Colors

| Token | Hex | Role |
|-------|-----|------|
| `--pp-ink` | `#5C3A2E` | Primary body text (warm dark brown) |
| `--pp-ink-deep` | `#3E2218` | Headings, high-emphasis text |
| `--pp-text-names` | `#9B6878` | Couple names in script, muted rose |
| `--pp-text-muted` | `#8C7060` | Captions, secondary information |
| `--pp-text-on-dark` | `#FFF5E6` | Text on dark surfaces |

### 2.6 Dark Surface Variants

For sections needing contrast (photo overlays, event highlight cards, footer):

| Token | Hex | Role |
|-------|-----|------|
| `--pp-dark-surface` | `#3E2218` | Deep warm brown surface |
| `--pp-dark-surface-warm` | `#5C3529` | Burgundy-brown, slightly lighter |
| `--pp-dark-overlay` | `rgba(62, 34, 24, 0.85)` | Semi-transparent overlay |

### 2.7 Functional Colors

| Token | Hex | Role |
|-------|-----|------|
| `--pp-action` | `#C9A84C` | Primary buttons, CTAs |
| `--pp-action-hover` | `#B5933E` | Button hover state |
| `--pp-action-active` | `#9E7E34` | Button pressed state |
| `--pp-input-border` | `#D5C4A8` | Form input borders |
| `--pp-input-focus` | `#C9A84C` | Input focus ring |
| `--pp-input-bg` | `#FAF3EB` | Input background |
| `--pp-success` | `#5E8B5A` | Confirmation, RSVP accepted |
| `--pp-error` | `#C44040` | Validation errors |
| `--pp-divider` | `#D5C4A8` | Section dividers, hairlines |

### 2.8 Color Usage Rules

- The background is never flat. Always apply the cream-to-blush radial gradient for depth.
- Gold is auspicious, not decorative. Use it for meaningful elements: monograms, borders, action buttons, ornaments. Do not scatter gold indiscriminately.
- Pink values descend in saturation from top (bougainvillea) to bottom (lotus). The brightest pinks are for floral illustration, never for UI chrome.
- Dark surfaces are reserved for at most 1-2 sections that need high contrast (a main event card, the footer). The majority of the invitation stays on cream.
- The muted rose `--pp-text-names` is exclusively for couple names in script. Do not reuse it for general body text.
- Functional colors (success, error) use warm-shifted hues. Pure red and pure green would clash with the palette.

---

## 3. Typography System

### 3.1 Font Stack

Load from Google Fonts:

| Font | Weights | Role |
|------|---------|------|
| Cormorant Garamond | 400, 500, 600, 700 | Display headings, monogram, body serif |
| Pinyon Script | 400 | Couple names, romantic script accents |

**Why these fonts:**
- Cormorant Garamond has the high-contrast serif personality needed for the monogram and headings. Its tall x-height and elegant bracketed serifs evoke engraved stationery. Already used elsewhere in the project, ensuring font cache reuse.
- Pinyon Script replaces Great Vibes (used in other templates) to give Punjabi Premium its own voice. Pinyon Script has finer hairlines, more formal calligraphic quality, and better thick-thin contrast -- matching the "elegant thin strokes" observed in the reference.

### 3.2 CSS Font Families

```
--pp-font-display: 'Cormorant Garamond', Georgia, serif;
--pp-font-script: 'Pinyon Script', 'Great Vibes', cursive;
--pp-font-body: 'Cormorant Garamond', Georgia, serif;
```

### 3.3 Type Scale

| Element | Size | Weight | Line height | Letter spacing | Font |
|---------|------|--------|-------------|----------------|------|
| Monogram | `clamp(64px, 14vw, 112px)` | 700 | 1.0 | 0.02em | Display |
| Section heading | `clamp(36px, 8vw, 56px)` | 600 | 1.15 | 0.01em | Display |
| Couple names (script) | `clamp(28px, 6.5vw, 48px)` | 400 | 1.3 | 0.01em | Script |
| Event title | `clamp(28px, 6vw, 42px)` | 600 | 1.2 | 0.01em | Display |
| Body text | `clamp(17px, 2.8vw, 20px)` | 400 | 1.75 | 0.005em | Body |
| Caption / label | `clamp(11px, 1.8vw, 13px)` | 500 | 1.6 | 0.12em | Body |
| Date numerals | `clamp(42px, 9vw, 64px)` | 400 | 1.0 | 0 | Display |
| Button text | `14px` | 600 | 1.0 | 0.08em | Body |

### 3.4 Typography Rules

- **Monogram** is always Cormorant Garamond 700, colored `--pp-gold-dark`. It is the single largest typographic element. No background shape -- the letterforms stand alone.
- **Couple names** are always Pinyon Script at `--pp-text-names` color. They appear at moderate contrast against the background -- intentionally softer than headings.
- **Section headings** use Cormorant Garamond 600. Do not use all-caps for headings. Use sentence case or title case per the invitation's cultural convention.
- **Body text** uses Cormorant Garamond 400 with generous line height (1.75). The serif body text benefits from slightly more vertical breathing room. Line lengths stay under 45 characters for the narrow mobile format.
- **Captions and labels** are the only elements that may use uppercase. Keep them sparse: event category labels, small date annotations. Use `--pp-text-muted` color and moderate letter-spacing (0.12em).
- Do not mix in sans-serif fonts. The entire invitation stays within the serif/script pairing. The only exception is system fallbacks.
- **Ampersand** in "Name & Name" uses the same script font at the same size. Do not style the ampersand differently.

---

## 4. Spacing System

### 4.1 Base Unit

8px base unit. All spacing values are multiples of 8.

### 4.2 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--pp-space-xs` | `8px` | Tight gaps, inline spacing |
| `--pp-space-sm` | `16px` | Element margins, list gaps |
| `--pp-space-md` | `24px` | Component internal padding |
| `--pp-space-lg` | `40px` | Between components in a section |
| `--pp-space-xl` | `64px` | Section padding top/bottom (mobile) |
| `--pp-space-2xl` | `96px` | Section padding top/bottom (desktop) |
| `--pp-space-3xl` | `128px` | Hero section vertical padding |

### 4.3 Section Padding

| Breakpoint | Vertical padding | Horizontal padding |
|------------|-----------------|-------------------|
| Mobile (<480px) | `64px` top / `56px` bottom | `24px` (6% of 402px) |
| Tablet (480-767px) | `80px` top / `72px` bottom | `32px` |
| Desktop (768px+) | `96px` top / `88px` bottom | `48px` |

### 4.4 Container Widths

| Element | Max width |
|---------|-----------|
| Invitation container | `720px` |
| Content column | `540px` (75% of container) |
| Event cards | `470px` |
| Photo gallery grid | `680px` |
| Couple names text | `420px` |
| Body text measure | `380px` (~45 characters) |

### 4.5 Spacing Rules

- The opening/hero section uses the most generous spacing. Monogram to names: ~5% of viewport height. Names to couple illustration: ~8%.
- Between sections, spacing is created by section padding, not by adding margin between siblings.
- Floral decorative elements may bleed outside padding boundaries (negative margins or absolute positioning) but content text stays within the padded zone.
- Vertical rhythm matters more than horizontal alignment in this format. Every element centers on the vertical axis; horizontal freedom goes to decorative elements only.

---

## 5. Materials and Textures

### 5.1 Background Treatment

The background is a radial gradient with subtle paper grain:

```
Background gradient:
  radial-gradient(
    ellipse at 50% 45%,
    #FAF3EB 0%,        /* Lightest at center */
    #F5E6D3 40%,       /* Cream mid-zone */
    #F0D5C0 85%,       /* Blush at edges */
    #E8CCAE 100%       /* Deepest at corners */
  )
```

This creates a warm vignette -- the eye is drawn to the brighter center where the monogram and names sit.

### 5.2 Paper Grain Texture

Apply a subtle noise overlay at 3-5% opacity to simulate cotton card stock. This can be a small tiling PNG or a CSS noise pattern. The grain should be visible on close inspection but never compete with content. Warm-tinted grain (not neutral gray noise).

### 5.3 Surface Treatments

| Surface | Treatment |
|---------|-----------|
| Main background | Radial gradient + paper grain |
| Event cards | `--pp-surface-warm` solid fill, 1px `--pp-divider` border, subtle warm drop shadow |
| Main event card (highlight) | `--pp-dark-surface-warm` fill, `--pp-text-on-dark` text |
| Photo frames | Scalloped arch clip-path, 2px `--pp-gold` border |
| Input fields | `--pp-input-bg` fill, 1px `--pp-input-border` border |
| Footer | `--pp-dark-surface` fill with floral overlay at 15% opacity |

### 5.4 Shadow and Depth

Shadows are warm and diffused, never crisp or dark. They suggest layered paper rather than floating UI cards.

| Level | Shadow value |
|-------|-------------|
| Subtle (text elements) | `0 2px 16px rgba(92, 58, 46, 0.06)` |
| Card | `0 8px 24px rgba(92, 58, 46, 0.10)` |
| Elevated (photo frames) | `0 12px 32px rgba(92, 58, 46, 0.14)` |
| Drop shadow (floral assets) | `drop-shadow(0 4px 8px rgba(92, 58, 46, 0.12))` |

Never use pure black in shadows. All shadows use the warm brown base `rgb(92, 58, 46)` at low opacity.

### 5.5 Opacity Rules for Decorative Elements

| Element | Opacity |
|---------|---------|
| Background paper grain | 3-5% |
| Distant florals (depth layer) | 60-80% |
| Primary florals (foreground) | 100% |
| Arch structure | 100% |
| Decorative border overlays | 85-95% |
| Gold divider lines | 50-70% (use alpha on the gold hex) |

---

## 6. Decorative Language

### 6.1 Primary Motifs

| Motif | What it is | When to use |
|-------|-----------|-------------|
| **Mughal arch** | Pointed arch with multi-cusped (scalloped) inner edge, 5-7 cusps | Opening section primary frame. Simplified arch silhouette can appear as photo frames and section headers. The arch is the structural backbone of the design. |
| **Toran (hanging ornaments)** | Golden bell/kalash shapes with pearl strands and mauve teardrop terminals | Opening section only, hanging from arch crown. 5 elements in symmetrical arrangement. Do not repeat in other sections. |
| **Cascading florals** | Bougainvillea clusters (bright pink), roses (soft pink), mixed foliage | Top of opening section, as canopy spilling over the arch. Simplified floral clusters as section accents throughout. |
| **Lotus** | Large soft coral-pink petals | Base of opening section, framing couple from below. Small lotus icons for mehndi/spiritual events. Footer closing motif. |
| **Rose clusters** | 2-3 roses with leaves | Mid-level accents flanking monogram zone. Corner decorations on event cards and photo frames. |
| **Topiary / garden greenery** | Round stylized trees, soft sage green | Background depth behind couple illustration. Venue section garden references. |
| **Gold flourish dividers** | Thin gold line with small diamond or leaf at center | Between subsections. A lighter alternative to floral dividers. |

### 6.2 When NOT to Add Decoration

- Do not add florals to RSVP forms, input fields, or interactive UI. Keep functional areas clean.
- Do not repeat the full toran outside the opening section. It is a one-time entrance motif.
- Do not place decorative elements over or near text -- maintain clear reading zones.
- Do not use the arch motif at full complexity in every section. After the opening, simplify to just the scalloped curve shape as a subtle frame or header.
- Do not mix cultural motifs from different traditions. Stick to North Indian / Mughal / Punjabi vocabulary. No paisley, no kolam/rangoli (those are South Indian), no Chinese red.
- Do not add animation to decorative elements except the toran sway in the opening. Florals and botanical elements are static.

### 6.3 Border and Divider Treatments

| Treatment | Specification |
|-----------|---------------|
| Gold hairline divider | 1px solid, `--pp-gold-muted` at 50% opacity, max-width 200px, centered |
| Flourish divider | Gold hairline left + ornament center + gold hairline right. Ornament is a small diamond or leaf glyph. |
| Scalloped border | A simplified version of the arch's cusped edge, used as a decorative top-edge on event cards or photo frames. CSS clip-path or SVG. |
| Floral separator | A small horizontal arrangement of 1-2 rose buds with leaves. Used sparingly between major sections (max 2-3 times in the entire invitation). |

### 6.4 Symmetry Rules

- The overall composition is center-axis symmetrical.
- Florals and illustration break perfect symmetry with organic variation: mirrored in placement but not identical in shape.
- All text content is center-aligned.
- Decorative assets that flank the center axis should be placed as mirrored pairs with slight organic variation.

---

## 7. Responsive Strategy

### 7.1 Approach

Mobile-first. The invitation is a vertical format (approximately 9:16) that is native to phone screens. On wider viewports, the `InvitationViewport` wrapper constrains the invitation to a 402 x 874 phone frame.

### 7.2 Breakpoints

| Breakpoint | Target | Notes |
|------------|--------|-------|
| Default (no query) | Mobile, 320-479px | Primary design target |
| `min-width: 480px` | Large phone / small tablet | Slightly more generous spacing |
| `min-width: 768px` | Desktop (inside InvitationViewport) | Full spacing, largest type sizes |

Because the invitation is capped at 720px max-width, there is no need for breakpoints above 768px. The InvitationViewport handles the desktop frame.

### 7.3 How Sections Adapt

| Element | Mobile (default) | 480px+ | 768px+ |
|---------|-----------------|--------|--------|
| Section padding V | 64px / 56px | 80px / 72px | 96px / 88px |
| Section padding H | 24px | 32px | 48px |
| Monogram size | 64px | 88px | 112px |
| Script names | 28px | 38px | 48px |
| Section headings | 36px | 46px | 56px |
| Body text | 17px | 19px | 20px |
| Event cards | 100% width | 90% width | 470px fixed |
| Gallery columns | 2 columns | 2 columns | 2-3 columns |

### 7.4 Font Scaling

All type sizes use `clamp()` for fluid scaling. The clamp values in section 3.3 produce smooth interpolation between the mobile minimum and desktop maximum. No abrupt size jumps at breakpoints.

### 7.5 Image Sizing

| Asset type | Mobile | Desktop | Format |
|------------|--------|---------|--------|
| Couple illustration | Width: 70% of container | Width: 70% of container | WebP, priority load |
| Floral canopy | Width: 100%+ (bleeds) | Width: 100%+ (bleeds) | WebP, priority load |
| Lower botanicals | Width: 100% | Width: 100% | WebP, priority load |
| Arch SVG | Width: 85% of container | Width: 85% of container | Inline SVG |
| Event card backgrounds | 100% of card | 100% of card | WebP, lazy load |
| Gallery photos | Aspect-ratio constrained | Aspect-ratio constrained | WebP, lazy load |

All raster assets must have mobile (1x) and desktop (2x) variants. Opening section images get `priority` / `fetchpriority="high"`. Everything below the fold uses lazy loading with `loading="lazy"` and `decoding="async"`.

---

## 8. Accessibility

### 8.1 Color Contrast

| Combination | Ratio | Status |
|-------------|-------|--------|
| `--pp-ink` (#5C3A2E) on `--pp-bg-cream` (#F5E6D3) | ~5.2:1 | Passes AA |
| `--pp-ink-deep` (#3E2218) on `--pp-bg-cream` (#F5E6D3) | ~7.8:1 | Passes AAA |
| `--pp-text-on-dark` (#FFF5E6) on `--pp-dark-surface` (#3E2218) | ~10.5:1 | Passes AAA |
| `--pp-text-names` (#9B6878) on `--pp-bg-cream` (#F5E6D3) | ~3.2:1 | Decorative only* |
| `--pp-gold-dark` (#8B6B3D) on `--pp-bg-cream` (#F5E6D3) | ~3.6:1 | Large text only (monogram) |
| `--pp-text-muted` (#8C7060) on `--pp-bg-cream` (#F5E6D3) | ~3.5:1 | Large text / captions** |

*Couple names are decorative display text at large sizes. The names also appear elsewhere in the invitation at full contrast. The script rendering is not the only way a guest reads the names.

**Caption text at 11-13px with `--pp-text-muted` needs to be at least 14px bold to pass 3:1 large-text ratio. At smaller caption sizes, use `--pp-ink` instead.

### 8.2 Focus Indicators

All interactive elements (buttons, links, form inputs) must show a visible focus ring on `:focus-visible`:

```
outline: 2px solid var(--pp-gold);
outline-offset: 4px;
```

The gold focus ring is visible against both cream and dark surfaces.

### 8.3 Reduced Motion

Wrap all animations and transitions in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred:

- Opening sequence: skip entrance animations, show all elements immediately.
- Toran sway: disable pendulum animation, show ornaments static.
- Scroll-triggered reveals: show elements at full opacity without transition.
- Parallax effects: disable all transform-based scroll responses.
- Countdown timer: update digits without transition animation.

The invitation must be fully legible and functional with all motion disabled.

### 8.4 Screen Reader Considerations

- The couple illustration must have descriptive alt text including attire and cultural context (e.g., "Illustration of the couple in traditional Punjabi wedding attire walking through a Mughal garden arch").
- Decorative floral images use `alt=""` and `aria-hidden="true"`.
- The monogram is not the only place the couple's names appear. Ensure names are in real text (not just image).
- The arch SVG uses `role="img"` with an appropriate `aria-label`, or `aria-hidden="true"` if purely decorative.
- Section landmarks use semantic HTML (`<section>`, `<header>`, `<footer>`) with appropriate headings.
- Interactive elements (RSVP, navigation) are reachable via keyboard tab order.

---

## 9. Animation Guidelines

Animations are sparse and meaningful. This is an elegant invitation, not a motion showcase.

### 9.1 Opening Entrance Sequence

Staggered fade-in, consistent with the project's shared text reveal direction (fade in while rising from below):

| Step | Element | Delay | Duration | Easing |
|------|---------|-------|----------|--------|
| 1 | Background gradient | 0ms | 800ms | ease-out |
| 2 | Arch structure | 200ms | 700ms | ease-out |
| 3 | Floral canopy (top down) | 500ms | 800ms | ease-out |
| 4 | Toran ornaments (drop in) | 800ms | 600ms | ease-out with slight bounce |
| 5 | Monogram | 1100ms | 600ms | ease-out |
| 6 | Couple names | 1400ms | 600ms | ease-out |
| 7 | Couple illustration (fade up) | 1700ms | 800ms | ease-out |
| 8 | Lower botanicals | 1700ms | 800ms | ease-out |

Total sequence: approximately 2.5 seconds.

### 9.2 Toran Sway

The 5 hanging ornaments have a subtle CSS pendulum animation:
- Period: 3.5 seconds
- Amplitude: 2 degrees maximum
- Transform origin: top center of each ornament
- Each ornament has a slight phase offset (0.15s stagger) for organic feel
- Uses `transform: rotate()` only -- no layout-triggering properties
- `will-change: transform` applied during animation only

### 9.3 Scroll-Triggered Reveals

Sections below the opening fade in while rising, per the project standard:
- Translate Y: 24px to 0
- Opacity: 0 to 1
- Duration: 600ms
- Easing: ease-out
- Triggered via IntersectionObserver at 15% visibility threshold
- Each section animates once, not on every scroll pass

### 9.4 What NOT to Animate

- Do not animate florals (no swaying flowers, no particle effects).
- Do not add parallax to the opening section. The layered depth is achieved through static z-positioning.
- Do not animate text color, font-size, or letter-spacing.
- Do not add hover animations to non-interactive decorative elements.
- Do not use continuous animation-frame loops for any static content.
- Never add animation in the /edits preview -- it breaks drag interactions.

---

## 10. Section-by-Section Design Direction

### Section 1: Opening / Hero

The reference image directly. Full-viewport container with layered depth planes:

- Background: radial gradient (warm cream center, blush edges) + paper grain
- Arch: SVG with scalloped inner edge, sandstone coloring
- Toran: 5 hanging ornaments (gold kalash + pearl strands + mauve teardrop)
- Floral canopy: dense pink/green cluster cascading over arch crown
- Monogram: Cormorant Garamond 700, `--pp-gold-dark`, centered in arch upper third
- Couple names: Pinyon Script, `--pp-text-names`, centered below monogram
- Couple illustration: positioned lower-center, ~35-40% of height, backs to viewer
- Lower botanicals: lotus and leaf arrangement framing couple from below

### Section 2: Couple Introduction

- Warm cream background continues, no gradient shift
- Simplified floral accents at section top (small rose cluster pair)
- Gold flourish divider above
- Couple names repeated in Cormorant Garamond 600 (not script -- contrast from opening)
- Family names in body text, Cormorant Garamond 400
- Optional small couple portrait in a scalloped arch frame

### Section 3: Events / Celebrations

- Each event on a card with `--pp-surface-warm` background
- Main event (Anand Karaj) gets a special card: `--pp-dark-surface-warm` with `--pp-text-on-dark`
- Cards use scalloped top-edge border treatment
- Gold flourish divider between event details (date, time, venue)
- Small cultural icon per event type (lotus for mehndi, flame for havan)
- Stacked vertically, centered, with consistent spacing

### Section 4: Venue / Location

- Garden backdrop mood -- sage green accents increase here
- Venue name in Cormorant Garamond 600
- Address in body text
- If map included: warm-filtered, framed in scalloped arch shape
- Floral corner decorations on the venue card (rose clusters)

### Section 5: Gallery / Photos

- Photos framed with scalloped arch clip-path and 2px gold border
- 2-column grid on mobile, 2-3 on desktop
- Warm color overlay (multiply blend or warm filter) to keep photos cohesive with the illustration palette
- Small floral corner ornaments on frames

### Section 6: Gift / Message / RSVP

- Clean, minimal decoration. Small lotus motif as a standalone accent above the section
- Form inputs use `--pp-input-bg`, `--pp-input-border`, gold focus ring
- Primary action button: `--pp-action` gold background, `--pp-ink-deep` text, Cormorant Garamond 600
- Button hover: `--pp-action-hover`
- This section is functional-first. Do not crowd it with florals.

### Section 7: Footer / Closing

- `--pp-dark-surface` background
- Lotus and botanical spread mirroring the opening's bottom treatment
- Closing message in Pinyon Script, `--pp-text-on-dark`
- Small simplified arch silhouette as a closing motif
- Florals at reduced opacity (15-20%) as subtle background texture

---

## 11. Z-Index Scale

Consistent z-index scale across the invitation. All values scoped within the template container.

| Layer | Z-index | Contents |
|-------|---------|----------|
| Background | 0 | Gradient, paper grain texture |
| Architecture | 1 | Arch body, pillars |
| Garden depth | 2 | Topiary, distant foliage |
| Couple illustration | 3 | Couple PNG |
| Lower botanicals | 4 | Lotus, base leaves |
| Content text | 5 | Monogram, names, body text |
| Mid florals | 6 | Rose clusters flanking monogram |
| Toran ornaments | 7 | Hanging decorations |
| Top floral canopy | 8 | Bougainvillea cascade |
| Interactive UI | 10 | Buttons, music toggle, navigation |
| Overlay/modal | 20 | RSVP modal, image lightbox |

---

## 12. Asset Production Guidelines

### Required Assets

| Asset | Format | Approx. dimensions | Priority |
|-------|--------|-------------------|----------|
| Arch (scalloped) | SVG | Scales to container | High -- load immediately |
| Couple illustration | WebP + PNG fallback | 800px wide (2x: 1600px) | High -- priority load |
| Floral canopy (top) | WebP | 800px wide (2x: 1600px) | High -- priority load |
| Lower botanicals | WebP | 800px wide (2x: 1600px) | High -- priority load |
| Rose cluster (left) | WebP | 200px wide (2x: 400px) | Medium -- priority if visible |
| Rose cluster (right) | WebP | 200px wide (2x: 400px) | Medium -- priority if visible |
| Toran ornament set | SVG or WebP | 400px wide | Medium |
| Paper grain texture | PNG (tiling) | 256x256 | Low -- background layer |
| Event card BG texture | WebP | 470px wide | Low -- lazy load |
| Lotus standalone icon | SVG | 48px | Low |
| Gold flourish divider | SVG | 200px wide | Low |

### Asset Style Rules

- All illustration assets must match the painterly watercolor style of the reference: soft edges, subtle brush texture, warm color saturation.
- No photographic assets in the decorative system. Photos appear only in the gallery section, always with a warm filter to integrate.
- PNGs must have clean transparency (no white fringe).
- SVGs use the design token colors as fill/stroke values for easy theming.
- Floral assets should have organic, non-perfectly-symmetric shapes. Mirrored placement is fine; mirrored identical shapes are not.

---

## 13. CSS Architecture Notes

- All class names use the `pp-` prefix (e.g., `.pp-page`, `.pp-opening`, `.pp-script`).
- All custom properties use the `--pp-` prefix.
- The template CSS must be fully scoped -- no global style leaks.
- Declare custom properties on `.pp-page` (the template root), not on `:root`.
- Use `isolation: isolate` on the template root to contain z-index stacking.
- Box-sizing: `border-box` applied via `.pp-page *`.
- Tap highlight: `-webkit-tap-highlight-color: transparent` on interactive elements.
- Focus visible: apply gold focus ring to `.pp-page :focus-visible`.
- The `.pp-script` utility class applies the Pinyon Script font stack.
- The `.pp-flourish` utility creates the gold line + ornament divider pattern.

---

## Appendix: Color Token CSS Block

```css
.pp-page {
  /* Backgrounds */
  --pp-bg-cream: #F5E6D3;
  --pp-bg-blush: #F0D5C0;
  --pp-bg-ivory: #FAF3EB;

  /* Architecture */
  --pp-arch-beige: #E8D5C0;
  --pp-arch-pillar: #DBBFA8;
  --pp-surface-warm: #F2E4D4;

  /* Florals */
  --pp-pink-bright: #E84080;
  --pp-pink-rose: #D4708A;
  --pp-pink-lotus: #E8A0A8;
  --pp-pink-deep: #C43068;
  --pp-green-sage: #7A9A6A;
  --pp-green-deep: #3D6B4A;
  --pp-purple-mauve: #8B5E8B;

  /* Gold */
  --pp-gold: #C9A84C;
  --pp-gold-dark: #8B6B3D;
  --pp-gold-light: #DECC8A;
  --pp-gold-muted: #B59A5A;

  /* Text */
  --pp-ink: #5C3A2E;
  --pp-ink-deep: #3E2218;
  --pp-text-names: #9B6878;
  --pp-text-muted: #8C7060;
  --pp-text-on-dark: #FFF5E6;

  /* Dark surfaces */
  --pp-dark-surface: #3E2218;
  --pp-dark-surface-warm: #5C3529;

  /* Functional */
  --pp-action: #C9A84C;
  --pp-action-hover: #B5933E;
  --pp-action-active: #9E7E34;
  --pp-input-border: #D5C4A8;
  --pp-input-focus: #C9A84C;
  --pp-input-bg: #FAF3EB;
  --pp-success: #5E8B5A;
  --pp-error: #C44040;
  --pp-divider: #D5C4A8;

  /* Typography */
  --pp-font-display: 'Cormorant Garamond', Georgia, serif;
  --pp-font-script: 'Pinyon Script', 'Great Vibes', cursive;
  --pp-font-body: 'Cormorant Garamond', Georgia, serif;

  /* Spacing */
  --pp-space-xs: 8px;
  --pp-space-sm: 16px;
  --pp-space-md: 24px;
  --pp-space-lg: 40px;
  --pp-space-xl: 64px;
  --pp-space-2xl: 96px;
  --pp-space-3xl: 128px;

  /* Shadows (warm brown base) */
  --pp-shadow-subtle: 0 2px 16px rgba(92, 58, 46, 0.06);
  --pp-shadow-card: 0 8px 24px rgba(92, 58, 46, 0.10);
  --pp-shadow-elevated: 0 12px 32px rgba(92, 58, 46, 0.14);
}
```

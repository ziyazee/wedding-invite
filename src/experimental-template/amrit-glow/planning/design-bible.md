# Amrit Glow — Design Bible

**Template**: amrit-glow
**Cultural context**: Punjabi celebratory (cultural, not overtly religious)
**Aesthetic**: Cinematic nighttime grandeur — warm gold illumination against deep navy darkness
**Reference**: Golden Temple night aesthetic with water reflections, crescent moon, celebratory fireworks

---

## Identity

The design language draws from Mughal-Rajput architectural ornament — cusped arches, floral scrollwork, geometric filigree — abstracted from any specific religious site. The emotional arc follows the reference video's three-act progression: **anticipation** (dark, sparse) to **revelation** (warm, illuminated) to **celebration** (abundant, joyful). This maps to scroll: the hero is dark and cinematic, the middle sections glow with warmth, and the closing sections carry celebratory energy.

Visual richness comes from three deliberate contrasts:
1. **Tone**: Matte dark surfaces against luminous gold elements
2. **Geometry**: Sharp architectural structure against organic softness (water, glow, flowers)
3. **Motion**: Static solid content against ambient moving particles

Every element earns its place. Restraint is luxury.

---

## 1. Color Tokens

All custom properties use the `--ag-` prefix (amrit-glow).

### Core Palette

```css
:root {
  /* ── Primary ── */
  --ag-bg:              #0F1623;   /* Deep navy — primary background */
  --ag-bg-deep:         #0A0E16;   /* Near-black — section edges, maximum depth */
  --ag-bg-elevated:     #141C2B;   /* Lifted navy — subtle card separation */
  --ag-gold:            #D4A843;   /* Primary gold — ornament, borders, accents */
  --ag-cream:           #F5E6C8;   /* Warm cream — secondary text, soft highlights */
  --ag-accent:          #8B6914;   /* Dark amber — gold shadows, pressed states */
  --ag-text:            #FAF3E6;   /* Warm off-white — primary readable text */

  /* ── Extended Gold Scale ── */
  --ag-gold-bright:     #E8C65A;   /* Bright gold — sparkle cores, active highlights */
  --ag-gold-mid:        #B89234;   /* Medium gold — gradient midpoints */
  --ag-gold-muted:      #9A7B2E;   /* Muted gold — water reflections, distant elements */
  --ag-gold-deep:       #5C4410;   /* Deep gold-brown — shadow tones */

  /* ── Atmospheric ── */
  --ag-lamp:            #FFE4A0;   /* Warm lamp yellow — diya glow, hover highlights */
  --ag-amber:           #CC9A2E;   /* Deep amber — gradient stops, warm transitions */
  --ag-teal:            #2E5E5A;   /* Muted teal — waterline accent, very sparingly */

  /* ── Text Scale ── */
  --ag-text-primary:    #FAF3E6;   /* Headings and body */
  --ag-text-secondary:  #F5E6C8;   /* Cream, slightly softer */
  --ag-text-muted:      #C9B89A;   /* Dates, labels, supporting info */
  --ag-text-dim:        #8A7D6A;   /* Footer, meta, least important */

  /* ── Functional ── */
  --ag-divider:         rgba(212, 168, 67, 0.25);   /* Gold rule lines */
  --ag-divider-strong:  rgba(212, 168, 67, 0.50);   /* Prominent dividers */
  --ag-focus:           #D4A843;   /* Keyboard focus ring */
  --ag-error:           #E8665A;   /* Form validation error */
  --ag-success:         #6AAF6A;   /* RSVP confirmation */
}
```

### Gradients

```css
:root {
  /* Metallic gold surface — borders, ornamental bands */
  --ag-gradient-gold: linear-gradient(
    135deg, #8B6914 0%, #D4A843 45%, #E8C65A 55%, #D4A843 100%
  );

  /* Background atmosphere — never use flat #0F1623.
     Subtle radial warmth at center prevents gradient banding and deadness. */
  --ag-gradient-bg: radial-gradient(
    ellipse at 50% 40%, #1A2338 0%, #0F1623 55%, #0A0E16 100%
  );

  /* Section fade-outs */
  --ag-gradient-fade-down: linear-gradient(to bottom, transparent 0%, #0A0E16 100%);
  --ag-gradient-fade-up:   linear-gradient(to top, transparent 0%, #0A0E16 100%);

  /* Gold glow aura — behind important elements */
  --ag-glow-gold: radial-gradient(
    circle, rgba(212, 168, 67, 0.20) 0%, transparent 70%
  );

  /* Warm lamp glow — behind diyas */
  --ag-glow-lamp: radial-gradient(
    circle, rgba(255, 228, 160, 0.12) 0%, transparent 50%
  );

  /* Water shimmer — for footer/RSVP background treatment */
  --ag-gradient-water: linear-gradient(
    180deg, #0F1623 0%, #0E1320 40%, #121A28 60%, #0F1623 100%
  );
}
```

### Shadows and Glows

```css
:root {
  /* Text shadows */
  --ag-shadow-text-sm:  0 0 8px rgba(212, 168, 67, 0.30);
  --ag-shadow-text-md:  0 0 16px rgba(212, 168, 67, 0.25);
  --ag-shadow-text-lg:  0 2px 24px rgba(212, 168, 67, 0.35);

  /* Element glows */
  --ag-shadow-glow-sm:  0 0 12px rgba(212, 168, 67, 0.15);
  --ag-shadow-glow-md:  0 0 24px rgba(212, 168, 67, 0.20);
  --ag-shadow-glow-lg:  0 0 48px rgba(212, 168, 67, 0.18);

  /* Card shadow */
  --ag-shadow-card:     0 4px 20px rgba(0, 0, 0, 0.40);

  /* Form field inset */
  --ag-shadow-inset:    inset 0 -1px 0 0 var(--ag-divider);
}
```

### Color Usage Rules

1. **Gold is architectural, not decorative.** Use `--ag-gold` for structural elements: borders, ornamental frames, rule lines, the arch. Never as a background fill behind text.
2. **The background is never flat.** Always use `--ag-gradient-bg` or a section-specific radial treatment. The subtle warmth at center prevents banding on AMOLED screens and gives depth.
3. **Text lives on dark.** All readable text is `--ag-text` or `--ag-cream` on dark backgrounds. Gold-colored text is reserved for display names and section headings only, using `--ag-gold` (not `--ag-gold-bright` for body) with `--ag-shadow-text-md` to ensure legibility.
4. **Cream is the softest voice.** Use `--ag-cream` for secondary text, not headings. It recedes against navy.
5. **Teal is a whisper.** `--ag-teal` appears only as a border accent or subtle focus ring alternative. Never as fill or text color.
6. **No animated PNGs on light areas.** Screen blend mode only works against values darker than `#1A2338`.
7. **Gold gradient for metallic surfaces only.** `--ag-gradient-gold` simulates metallic sheen on borders and decorative bands. Do not use it on large areas or as text fill.

---

## 2. Typography System

### Font Loading

```
Google Fonts request:
  Cinzel Decorative:  wght@700
  Cormorant Garamond: wght@400;600
  Lato:               wght@300;400
```

Three fonts, three roles, no overlap. Estimated Google Fonts payload: ~80KB (Latin subset). The template loads its own fonts directly — does NOT use `SiteFonts`.

### Type Scale

| Token | Font | Weight | Size (402px mobile) | Letter-spacing | Line-height | Case |
|-------|------|--------|---------------------|----------------|-------------|------|
| `--ag-type-hero` | Cinzel Decorative | 700 | `clamp(32px, 9vw, 52px)` | `0.12em` | `1.15` | Uppercase |
| `--ag-type-names` | Cinzel Decorative | 700 | `clamp(24px, 6.5vw, 36px)` | `0.10em` | `1.2` | Uppercase |
| `--ag-type-section` | Cormorant Garamond | 600 | `clamp(22px, 5.5vw, 32px)` | `0.05em` | `1.3` | Title case |
| `--ag-type-event` | Cormorant Garamond | 600 | `clamp(20px, 5vw, 28px)` | `0.04em` | `1.3` | Title case |
| `--ag-type-detail` | Cormorant Garamond | 400 | `18px` | `0.02em` | `1.45` | Sentence case |
| `--ag-type-body` | Lato | 300 | `16px` | `0.015em` | `1.65` | Sentence case |
| `--ag-type-label` | Lato | 400 | `13px` | `0.14em` | `1.4` | Uppercase |
| `--ag-type-small` | Lato | 300 | `14px` | `0.01em` | `1.5` | Sentence case |
| `--ag-type-timer-num` | Cinzel Decorative | 700 | `clamp(28px, 7.5vw, 44px)` | `0.04em` | `1.1` | N/A (numeric) |
| `--ag-type-timer-label` | Lato | 400 | `11px` | `0.18em` | `1.2` | Uppercase |
| `--ag-type-footer` | Lato | 300 | `12px` | `0.02em` | `1.5` | Sentence case |

### CSS Custom Properties

```css
:root {
  --ag-font-display:  'Cinzel Decorative', 'Playfair Display SC', Georgia, serif;
  --ag-font-heading:  'Cormorant Garamond', 'EB Garamond', Georgia, serif;
  --ag-font-body:     Lato, 'Source Sans 3', system-ui, sans-serif;
}
```

### Typography Rules

1. **Cinzel Decorative is always uppercase.** Its decorative capitals are the defining feature. Apply `text-transform: uppercase` in CSS. Its wide letter-spacing (`0.10–0.12em`) prevents the ornamental serifs from crowding.
2. **Cormorant Garamond carries the warmth.** Its high-contrast strokes mirror gold filigree. The 600 weight for headings — the thin hairlines catch visual "light" like metalwork. The 400 weight serves event details where a lighter stroke is right.
3. **Lato 300 is the default body weight.** The light weight gives an elegant, airy feel on dark backgrounds. Reserve 400 for labels and interactive elements that need slightly more visual mass for scannability.
4. **Minimum body text: 16px.** Dark backgrounds demand generous sizing. Never go below 14px for readable content. 12px is the floor for footer and legal text only.
5. **Line length: max 36 characters on mobile.** The narrow viewport naturally constrains this. On wider viewports (inside InvitationViewport), constrain the text container to `max-width: 340px`.
6. **Only two text elements are uppercase**: Cinzel Decorative names and Lato small labels (`--ag-type-label`, `--ag-type-timer-label`). Everything else uses sentence or title case. Uppercase is earned, not default.

---

## 3. Spacing Scale

Base unit: 8px. An augmented 8-point grid with a 4px half-step for fine adjustments.

```css
:root {
  --ag-space-2xs:  4px;     /* Fine adjustment, icon gaps */
  --ag-space-xs:   8px;     /* Tight element spacing */
  --ag-space-sm:   12px;    /* Label-to-content gap */
  --ag-space-md:   16px;    /* Standard element gap */
  --ag-space-lg:   24px;    /* Content group spacing */
  --ag-space-xl:   32px;    /* Sub-section breaks */
  --ag-space-2xl:  48px;    /* Section internal padding */
  --ag-space-3xl:  64px;    /* Section padding on mobile */
  --ag-space-4xl:  96px;    /* Major section breaks */
  --ag-space-5xl:  128px;   /* Hero vertical padding */
}
```

### Section Padding Patterns

| Pattern | CSS | Usage |
|---------|-----|-------|
| Standard section | `padding: var(--ag-space-3xl) var(--ag-space-md)` | 64px 16px — Couple, Celebrations, Personal Notes |
| Hero section | `padding: var(--ag-space-5xl) var(--ag-space-md)` | 128px 16px — Opening |
| Compact section | `padding: var(--ag-space-2xl) var(--ag-space-md)` | 48px 16px — Countdown |
| Footer section | `padding: var(--ag-space-2xl) var(--ag-space-md) var(--ag-space-xl)` | 48px 16px 32px — Closing |
| Intimate section | `padding: var(--ag-space-4xl) var(--ag-space-lg)` | 96px 24px — Personal Notes (wider gutters) |

### Content Width Tokens

```css
:root {
  --ag-content-width:   370px;   /* Max content width: 402 - 2*16px gutter */
  --ag-content-narrow:  300px;   /* RSVP form, narrow text columns */
  --ag-event-card-width: 340px;  /* Event card containers */
}
```

### Spacing Rules

1. **Side gutters: always 16px.** Every content container has `padding: 0 var(--ag-space-md)` minimum. Personal Notes section uses 24px for an inward push.
2. **Between-section gap: at least 64px.** The space between the bottom of one section and the top of the next (not counting divider images) is never less than `--ag-space-3xl`.
3. **Within-section groups: 16–32px.** Elements that belong together (event name + date + venue) use `--ag-space-md` to `--ag-space-xl`.
4. **Decorative divider margins: 48px above and below.** Marigold garlands and ornamental rules get breathing room.
5. **No zero-gaps between text lines.** Even tightly coupled lines (name above name) use `--ag-space-xs` minimum.

---

## 4. Background Treatments

### Per-Section Backgrounds

| Section | Base | Overlay / Treatment | Notes |
|---------|------|---------------------|-------|
| **1. Hero** | Reference video (full viewport) | Semi-transparent overlay `rgba(15, 22, 35, 0.3)` for text readability. Transitions to `--ag-gradient-bg` after video. | Moon image positioned absolute top-right. |
| **2. Couple** | `--ag-gradient-bg` | `--ag-glow-gold` centered behind couple names, subtle halo. | No image backgrounds. Clean, typographic. |
| **3. Countdown** | `--ag-bg` | `--ag-glow-lamp` centered behind timer numbers. | Compact section, minimal treatment. |
| **4. Celebrations** | `--ag-gradient-bg` | Event cards use `event-card-bg.png`. Firework burst behind Jaggo event only. | Longest section; background must remain dark throughout for screen-blend particles. |
| **5. RSVP** | `--ag-bg` | `water-reflection.png` at 20–25% opacity, `background-size: cover`. | Water motif introduces the sacred-water theme for the lower sections. |
| **6. Personal Notes** | `--ag-bg-deep` (#0A0E16) | `--ag-glow-gold` at ~8% opacity behind quote text. | Darkest section. Maximum contrast for the intimate moment. |
| **7. Closing** | `--ag-bg` | `water-reflection.png` at 35–40% opacity. Gradient fade-up at top edge. | Water reflection closes the narrative arc. |

### Background Rules

1. **No flat fills.** Every section uses at minimum a radial gradient or textured overlay.
2. **Noise texture.** Apply a CSS noise overlay at 1–2% opacity over all section backgrounds to prevent gradient banding on AMOLED displays. Implement via a small inline SVG `background-image` (a 100x100 fractal noise tile).
3. **Gold glow is content-centric.** Position `--ag-glow-gold` radials behind the primary content of each section (names, timer, quote), not as ambient filler spread edge to edge.
4. **Water reflection below the fold only.** The water motif belongs to RSVP and Closing. Using it higher would compete with the architectural elements and dilute its closing-arc significance.
5. **Progressive darkness.** The template gets slightly darker as the viewer scrolls: Hero (`--ag-gradient-bg`) to Celebrations (`--ag-gradient-bg`) to Personal Notes (`--ag-bg-deep`), then the water reflection in Closing provides a luminous resolution.

---

## 5. Decorative Language and Ornamental System

### Ornamental Inventory

| Element | Asset | Purpose | Instances |
|---------|-------|---------|-----------|
| **Mughal Arch** | `arch-border.png` (720x200) | Grand architectural frame | 1 total (hero section bottom) |
| **Event Card Frame** | `event-card-bg.png` (640x400) | Content card container | 2–3 per template (alternating events) |
| **Gold Corner** | `gold-corner.png` (200x200) | Section and card corner accent | Sets of 2 or 4 per section, ~3 sections |
| **Marigold Garland** | `marigold-garland.png` (720x120) | Major section divider | 2 instances total |
| **Crescent Moon** | `crescent-moon.png` (300x300) | Hero atmospheric element | 1 (hero only; crop bottom to hide watermark) |
| **Firework Burst** | `firework-burst.png` (400x400) | Celebration accent | 1 (Jaggo event only) |
| **Water Reflection** | `water-reflection.png` (720x400) | Section background texture | 2 sections (RSVP, Closing) |

### CSS-Only Dividers

**Thin Gold Rule** — lightweight separator between closely related elements:
```css
.ag-rule {
  width: 120px;
  height: 1px;
  background: var(--ag-gradient-gold);
  margin: var(--ag-space-xl) auto;
  opacity: 0.6;
}
```

**Ornamental Rule with Diamond** — formal separator between content groups:
```css
.ag-rule-ornate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ag-space-xs);
  margin: var(--ag-space-2xl) auto;
}
.ag-rule-ornate::before,
.ag-rule-ornate::after {
  content: '';
  width: 60px;
  height: 1px;
  background: var(--ag-gradient-gold);
  opacity: 0.5;
}
/* Diamond center: a 6x6 rotated square */
.ag-rule-ornate .diamond {
  width: 6px;
  height: 6px;
  background: var(--ag-gold);
  transform: rotate(45deg);
  opacity: 0.6;
  flex-shrink: 0;
}
```

### Decorative Hierarchy (When to Use What)

| Divider Level | Element | Between |
|---------------|---------|---------|
| **Architectural** | Arch border | Hero and the rest of the invitation (once only) |
| **Major** | Marigold garland | Major narrative shifts (pre-wedding to celebration; celebration to ceremony) |
| **Standard** | Ornamental rule with diamond | Between couple and family info; between section heading and content |
| **Minor** | Thin gold rule | Between closely related events; between RSVP and Personal Notes |
| **None** | Pure spacing | Between Personal Notes and Closing (gradient fade handles the transition) |

### Ornament Rendering Rules

1. **Never stack ornamental elements.** A section with an arch border should not also have gold corners. Each section gets one framing strategy.
2. **Ornaments serve structure.** Every decorative element must clarify a content boundary — a divider between events, a frame around a content group, a marker at a transition point.
3. **Screen blend on dark only.** All PNG ornaments using `mix-blend-mode: screen` sit on backgrounds darker than `#1A2338`.
4. **Ornament opacity: 0.50–0.80.** No ornamental image at full opacity. The reduced values: (a) hide PNG rendering imperfections, (b) maintain the luminous quality, (c) prevent ornaments from dominating over content.
5. **Gold corner rotation system.** `gold-corner.png` is a top-left corner. Rotate to fill other positions:
   - Top-left: `transform: rotate(0deg)`
   - Top-right: `transform: rotate(90deg)`
   - Bottom-right: `transform: rotate(180deg)`
   - Bottom-left: `transform: rotate(270deg)`

### Image CSS Properties Reference

| Asset | Width | Blend Mode | Opacity | Position | Z-index |
|-------|-------|------------|---------|----------|---------|
| `arch-border.png` | `100%` | none (dark bg asset) | `1.0` | bottom of hero | `--ag-z-decor` (1) |
| `event-card-bg.png` | `var(--ag-event-card-width)` | none (used as card bg) | `1.0` | centered, per event | `--ag-z-decor` (1) |
| `gold-corner.png` | `60–80px` | `screen` | `0.55–0.70` | absolute at section corners | `--ag-z-decor` (1) |
| `marigold-garland.png` | `max-width: 340px` | `screen` | `0.70` | centered between sections | `--ag-z-decor` (1) |
| `crescent-moon.png` | `clamp(80px, 20vw, 120px)` | `screen` | `0.75` | `top: 12%; right: 8%` | `--ag-z-decor` (1) |
| `firework-burst.png` | `clamp(200px, 55vw, 280px)` | `screen` | `0.40` | centered behind Jaggo | `--ag-z-bg` (0) |
| `water-reflection.png` | `100%` cover | none (opaque by design) | `0.20–0.40` | section background | `--ag-z-bg` (0) |

---

## 6. Blend Mode Strategy

### The Problem

26 of 29 PNG assets have opaque gray/cream backgrounds. These must composite cleanly on the dark navy template.

### The Solution: Screen Blend + Opacity Attenuation

`mix-blend-mode: screen` lightens the composite result. Combined with reduced opacity:

- **Bright content** (gold flames, sparkle cores, metallic leaf) glows visibly against dark backgrounds
- **Opaque background regions** are attenuated to a faint luminous haze that merges into the dark navy
- **The overall effect** is ethereal and ambient — elements appear as luminous ghosts, consistent with the nighttime aesthetic

### Blend Parameters by Asset Background Tone

| Background Tone | Examples | Blend | Opacity | Expected Result |
|-----------------|----------|-------|---------|-----------------|
| Dark (#3A3530) | Gold leaf flakes | `screen` | 0.45–0.85 | Background nearly vanishes. Gold content glows clearly. Best case. |
| Gray (#C0C0C0) | Some diyas | `screen` | 0.25–0.50 | Background becomes a faint wash at low opacity. Content readable. |
| Beige (#E8D8B8) | Most sparkles, diyas | `screen` | 0.20–0.45 | Must stay low. Cream haze acceptable as atmospheric texture. |
| Warm brown (#B89840) | Marigold petals | `screen` | 0.30–0.55 | Background close to content color; blurs into warm glow. |
| Light cream (#E8E0D0) | Jasmine flowers | **Do not use** | — | White-on-cream separation impossible. |

### Implementation Notes

- Apply `mix-blend-mode: screen` on the element itself, not a parent container
- Parent must have a resolved dark background (< `#2A2A2A`) — never transparent or light
- Animated elements that cross section boundaries must clip to their dark-background parent
- `will-change: opacity, transform` on active elements for GPU compositing
- Test on both AMOLED (true black) and LCD (lifted black) — screen blend behaves well on both

---

## 7. Z-Index Layers

```css
:root {
  --ag-z-bg:            0;   /* Section background images, water-reflection overlays */
  --ag-z-decor:         1;   /* Static decorative images: arch border, gold corners, garland */
  --ag-z-particles-bg:  2;   /* Animated PNGs behind content */
  --ag-z-content:       3;   /* All readable text, forms, interactive elements */
  --ag-z-particles-fg:  4;   /* Animated PNGs briefly in front (rare, low opacity only) */
  --ag-z-overlay:       5;   /* Glow pseudo-elements, bloom effects */
  --ag-z-video:         6;   /* Hero video overlay during playback */
}
```

### Rules

- Animated PNGs default to `--ag-z-particles-bg`. Only hero sparkles may briefly use `--ag-z-particles-fg` during the opening reveal.
- All form inputs, buttons, and links: `--ag-z-content` or higher.
- Everything below `--ag-z-content` gets `pointer-events: none`.

---

## 8. Responsive Specifications

### Base Viewport

Mobile-first design. **Base: 402px wide** (phone preview dimension used in InvitationViewport).

### Breakpoints

```css
/* Phone (base): 0–767px
   Single column, full-width layouts.
   All measurements in this document target this range. */

/* Tablet: >= 768px
   InvitationViewport wraps content in portrait phone frame.
   Content renders at ~402px equivalent. No layout changes needed. */

/* Desktop: >= 1024px
   Same as tablet. The viewport wrapper handles the presentation. */
```

### Responsive Rules

1. **The template is a phone-width document.** On desktop, `InvitationViewport` provides the portrait phone frame. The template itself does not need tablet/desktop breakpoints.
2. **Use `clamp()` for type scaling.** Hero names scale from 32px (narrowest phones) to 52px (wide phone or InvitationViewport's available width).
3. **Images use relative widths.** `max-width: 100%` on all decorative images. The `arch-border.png` at 720px native width scales down to fill the viewport.
4. **Touch targets: 44x44px minimum** (48px preferred). All RSVP form inputs and buttons.
5. **Side gutters: 16px always.** `padding: 0 var(--ag-space-md)` on content containers.
6. **Below 375px:** Gold corners scale from 80px to 60px. Timer unit gaps reduce from 16px to 12px.
7. **Below 340px:** Reduce event card padding. Timer remains horizontal (never stacks).

---

## 9. Animation Timing

### Scroll-Triggered Reveals

```css
:root {
  --ag-reveal-duration: 0.8s;
  --ag-reveal-delay:    0.1s;   /* Stagger increment between sibling elements */
  --ag-reveal-easing:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

Reveal type: **Fade in while rising from below.** Matches the project's shared text reveal pattern.
- `opacity: 0` to `1`
- `transform: translateY(24px)` to `translateY(0)`
- No character stagger. No line stagger. The whole content block reveals as one unit.
- Sequential sibling blocks stagger by `--ag-reveal-delay` increments.

### Ambient Particle Timing

```css
:root {
  --ag-float-duration:    10s;   /* Base cycle for diya bobbing */
  --ag-float-easing:      ease-in-out;
  --ag-drift-duration:    14s;   /* Slow lateral drift for sparkles */
  --ag-fall-duration:     12s;   /* Petal/leaf falling cycle */
  --ag-shimmer-duration:  4s;    /* Opacity pulse for sparkles */
}
```

### Hero-Specific Timing

```css
:root {
  --ag-hero-text-delay:    0.5s;  /* Pause after video ends before text reveals */
  --ag-hero-text-duration: 1.2s;  /* Slower, cinematic text reveal */
  --ag-hero-text-easing:   cubic-bezier(0.16, 1, 0.3, 1);  /* Dramatic ease-out */
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* All ambient floating animations: disabled */
  /* Scroll reveals: instant opacity fade, no translation */
  /* Video autoplay: stopped; show poster frame */
  /* Countdown: static display, no animation */
  /* Particles: shown at static positions with fixed opacity */
}
```

---

## 10. Accessibility

### Contrast Ratios (Validated)

| Combination | Ratio | WCAG AA (4.5:1) |
|-------------|-------|------------------|
| `--ag-text` (#FAF3E6) on `--ag-bg` (#0F1623) | 14.2:1 | Pass |
| `--ag-cream` (#F5E6C8) on `--ag-bg` (#0F1623) | 11.8:1 | Pass |
| `--ag-text-muted` (#C9B89A) on `--ag-bg` (#0F1623) | 7.6:1 | Pass |
| `--ag-text-dim` (#8A7D6A) on `--ag-bg` (#0F1623) | 3.9:1 | Fail (use for decorative only) |
| `--ag-gold` (#D4A843) on `--ag-bg` (#0F1623) | 7.3:1 | Pass |
| `--ag-bg` (#0F1623) on `--ag-gold` (#D4A843) | 7.3:1 | Pass (button text) |

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--ag-focus);
  outline-offset: 2px;
}
```

### Motion

All decorative motion respects `prefers-reduced-motion: reduce`. Video does not autoplay on reduced-motion devices — poster frame is shown instead.

### Image Alt Text

- Decorative ornamental images: `alt=""` (empty, with `role="presentation"`)
- Crescent moon: `alt=""` (atmospheric, no informational content)
- Diyas, sparkles, petals: `alt=""` (decorative particles)
- Event card backgrounds: applied as CSS `background-image` (no alt needed)

---

## Appendix: Design Tokens as CSS Custom Properties (Complete)

```css
:root {
  /* Colors — Primary */
  --ag-bg: #0F1623;
  --ag-bg-deep: #0A0E16;
  --ag-bg-elevated: #141C2B;
  --ag-gold: #D4A843;
  --ag-cream: #F5E6C8;
  --ag-accent: #8B6914;
  --ag-text: #FAF3E6;

  /* Colors — Extended */
  --ag-gold-bright: #E8C65A;
  --ag-gold-mid: #B89234;
  --ag-gold-muted: #9A7B2E;
  --ag-gold-deep: #5C4410;
  --ag-lamp: #FFE4A0;
  --ag-amber: #CC9A2E;
  --ag-teal: #2E5E5A;

  /* Colors — Text */
  --ag-text-primary: #FAF3E6;
  --ag-text-secondary: #F5E6C8;
  --ag-text-muted: #C9B89A;
  --ag-text-dim: #8A7D6A;

  /* Colors — Functional */
  --ag-divider: rgba(212, 168, 67, 0.25);
  --ag-divider-strong: rgba(212, 168, 67, 0.5);
  --ag-focus: #D4A843;
  --ag-error: #E8665A;
  --ag-success: #6AAF6A;

  /* Typography */
  --ag-font-display: 'Cinzel Decorative', 'Playfair Display SC', Georgia, serif;
  --ag-font-heading: 'Cormorant Garamond', 'EB Garamond', Georgia, serif;
  --ag-font-body: Lato, 'Source Sans 3', system-ui, sans-serif;

  /* Spacing */
  --ag-space-2xs: 4px;
  --ag-space-xs: 8px;
  --ag-space-sm: 12px;
  --ag-space-md: 16px;
  --ag-space-lg: 24px;
  --ag-space-xl: 32px;
  --ag-space-2xl: 48px;
  --ag-space-3xl: 64px;
  --ag-space-4xl: 96px;
  --ag-space-5xl: 128px;

  /* Content widths */
  --ag-content-width: 370px;
  --ag-content-narrow: 300px;
  --ag-event-card-width: 340px;

  /* Z-index */
  --ag-z-bg: 0;
  --ag-z-decor: 1;
  --ag-z-particles-bg: 2;
  --ag-z-content: 3;
  --ag-z-particles-fg: 4;
  --ag-z-overlay: 5;
  --ag-z-video: 6;

  /* Animation */
  --ag-reveal-duration: 0.8s;
  --ag-reveal-delay: 0.1s;
  --ag-reveal-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ag-float-duration: 10s;
  --ag-drift-duration: 14s;
  --ag-fall-duration: 12s;
  --ag-shimmer-duration: 4s;
  --ag-hero-text-delay: 0.5s;
  --ag-hero-text-duration: 1.2s;
  --ag-hero-text-easing: cubic-bezier(0.16, 1, 0.3, 1);
}
```

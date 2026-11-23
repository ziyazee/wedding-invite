# Taj Template — Design Bible

> Visual identity system for a Muslim / Mughal-inspired wedding invitation.
> All values are implementation-ready. CSS prefix: `tj-` for classes, `--tj-` for custom properties.

---

## 1. Color System

### Core Palette

| Token | Hex | Role |
|-------|-----|------|
| `--tj-midnight` | `#0B1628` | Primary background, section base |
| `--tj-deep` | `#101D33` | Gradient target, secondary background |
| `--tj-navy-mid` | `#162440` | Card surfaces, elevated panels |
| `--tj-divider` | `#1E2D45` | Section separators, subtle borders |
| `--tj-gold` | `#D4A24E` | Primary accent — borders, ornaments, icons, section headings |
| `--tj-gold-light` | `#E8C676` | Secondary accent — subheadings, Arabic text, highlights |
| `--tj-gold-bright` | `#F5DFA0` | Hover states, active interactions |
| `--tj-cream` | `#F2E8D0` | Primary text — couple names, headings |
| `--tj-cream-soft` | `#C8BFA8` | Body text, secondary information |
| `--tj-highlight` | `#FFFBE6` | Sparkle effects, brightest decorative accents |
| `--tj-rose` | `#8B3A4A` | Rose motif fill, warm accent (muted burgundy) |
| `--tj-rose-gold` | `#C4876E` | Rose highlight, warm ornamental detail |

### Functional Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-bg` | `var(--tj-midnight)` | Page and section background |
| `--tj-text-primary` | `var(--tj-cream)` | Names, headings |
| `--tj-text-secondary` | `var(--tj-gold-light)` | Labels, subheadings |
| `--tj-text-body` | `var(--tj-cream-soft)` | Paragraphs, details, dates |
| `--tj-accent` | `var(--tj-gold)` | Borders, rules, ornamental strokes |
| `--tj-surface` | `var(--tj-navy-mid)` | Card/panel backgrounds |
| `--tj-overlay` | `rgba(11, 22, 40, 0.85)` | Overlay on video/image |

### Gold Gradient (for decorative borders and ornamental strokes)

```css
--tj-gold-gradient: linear-gradient(
  135deg,
  #8B6B30 0%,
  #D4A24E 35%,
  #F5DFA0 50%,
  #D4A24E 65%,
  #8B6B30 100%
);
```

### Opacity Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-lattice-opacity` | `0.04` | Jali pattern overlays |
| `--tj-texture-opacity` | `0.03` | Marble grain texture |
| `--tj-glow-opacity` | `0.15` | Gold glow behind decorative elements |
| `--tj-reflection-opacity` | `0.35` | Reflection effects on water/pool imagery |

---

## 2. Typography System

### Font Stack

| Role | Family | Google Fonts Load | Fallback |
|------|--------|-------------------|----------|
| **Display** | Cormorant Garamond | `Cormorant+Garamond:wght@300;400;500;600` | Georgia, serif |
| **Arabic** | Amiri | `Amiri:wght@400;700` | serif |
| **Body** | Outfit | `Outfit:wght@300;400;500` | system-ui, sans-serif |

**Why these three**: Cormorant Garamond's high-contrast strokes and delicate serifs echo the ornamental precision of Mughal carved marble — it reads as calligraphic without being decorative script. Amiri is a professional Naskh typeface appropriate for Quranic text and Arabic blessings. Outfit is a geometric sans-serif that stays legible at small sizes on navy backgrounds and provides clean contrast to the serif display.

### Type Scale (mobile-first, 402px base)

All sizes in CSS `px`. Scale ratio: ~1.25 (Major Third).

| Token | Size | Weight | Line-height | Letter-spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--tj-text-hero` | `56px` | 300 | 1.1 | `0.04em` | Couple names on opening |
| `--tj-text-display` | `40px` | 300 | 1.15 | `0.03em` | Section hero text (Dua heading) |
| `--tj-text-h1` | `28px` | 500 | 1.2 | `0.12em` | Section headings |
| `--tj-text-h2` | `22px` | 400 | 1.25 | `0.06em` | Sub-section headings |
| `--tj-text-h3` | `18px` | 500 | 1.3 | `0.04em` | Card headings, event titles |
| `--tj-text-body` | `15px` | 300 | 1.65 | `0.01em` | Body paragraphs, descriptions |
| `--tj-text-small` | `13px` | 400 | 1.5 | `0.02em` | Captions, timestamps, labels |
| `--tj-text-arabic-lg` | `32px` | 400 | 1.7 | `0` | Bismillah, primary Arabic |
| `--tj-text-arabic-md` | `22px` | 400 | 1.8 | `0` | Dua body text |
| `--tj-text-arabic-sm` | `16px` | 400 | 1.7 | `0` | Arabic transliteration |

### Type Treatments

**Couple Names (Opening)**
- Font: Cormorant Garamond Light (300)
- Size: `--tj-text-hero` (56px)
- Color: `--tj-cream`
- Letter-spacing: `0.04em`
- Text-align: center
- The ampersand or "weds" connector: Cormorant Garamond Italic 300, 24px, `--tj-gold-light`

**Section Headings**
- Font: Cormorant Garamond Medium (500)
- Size: `--tj-text-h1` (28px)
- Color: `--tj-gold`
- Letter-spacing: `0.12em`
- Text-transform: uppercase
- Flanked by a thin gold ornamental divider (horizontal line with central medallion SVG)

**Arabic Text**
- Font: Amiri Regular (400)
- Color: `--tj-gold-light`
- Direction: `rtl`
- Text-align: center
- Generous line-height (1.7-1.8) for diacritical marks

**Body Text**
- Font: Outfit Light (300)
- Color: `--tj-cream-soft`
- Line-height: 1.65
- Max-width: 340px (on 402px viewport) for comfortable reading (~55 characters per line)

---

## 3. Spacing System

Base unit: `4px`. Scale built on multiples.

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-space-1` | `4px` | Micro gaps (icon-to-label) |
| `--tj-space-2` | `8px` | Tight internal padding |
| `--tj-space-3` | `12px` | Default inline spacing |
| `--tj-space-4` | `16px` | Gutter, standard padding |
| `--tj-space-5` | `24px` | Card internal padding |
| `--tj-space-6` | `32px` | Between content blocks within a section |
| `--tj-space-7` | `48px` | Between major content groups |
| `--tj-space-8` | `64px` | Section top/bottom padding |
| `--tj-space-9` | `80px` | Large section padding (Opening, Closing) |
| `--tj-space-10` | `120px` | Hero section vertical spacing |

### Section Padding

- Standard section: `64px` top, `64px` bottom, `24px` left/right (402px viewport)
- Opening section: `0` (full-bleed video, text overlay positioned absolutely)
- Closing section: `80px` top, `120px` bottom (extra bottom for scroll end)

### Content Width

- Max content width: `354px` on a 402px viewport (24px padding each side)
- Narrow content (body text, Arabic): `320px` max
- Full bleed (backgrounds, video, gallery): `402px` (fills viewport)

---

## 4. Decorative Language

### Primary Motifs

**1. Pointed Arch (Iwan)**
The Mughal pointed arch is the template's signature frame shape. Used for:
- Couple photo frame
- Event detail cards (top border is an arch shape)
- Section header decoration (miniature arch above heading text)
- Gallery image frames

Arch construction: A pointed arch with the apex at roughly 1.3x the width. The two curves meet at a slight point, not a rounded dome. CSS/SVG: two quadratic bezier curves meeting at center-top.

**2. Crescent Moon**
Appears in the opening section (matching the reference frame) and as a subtle recurring motif:
- Opening: glowing crescent in upper portion, animated soft pulse
- Section dividers: tiny crescent as the center medallion
- Closing: crescent paired with stars

**3. Geometric Jali (Lattice)**
An 8-pointed star interlocking pattern, rendered as a repeating SVG `<pattern>`. Applied as a background overlay at 3-5% opacity on select sections (Dua, Celebrations, RSVP) for texture variation. The tile unit is a single 8-pointed star inscribed in a 40x40px square, with thin gold strokes on transparent background.

**4. Rose Line Art**
Stylized single roses drawn in gold stroke (no fill or muted `--tj-rose` fill). Mughal miniature painting features the gul (rose) prominently. Used as:
- Corner ornaments on the couple section
- Scattered along section transitions
- Paired symmetrically (mirrored left-right) flanking dividers

**5. Ornamental Divider**
A horizontal gold line with a central decorative node (small diamond, lotus bud, or 4-pointed star). Width: 40-60% of content area. Stroke: 1px `--tj-gold`. Used between major content blocks within a section and as section transitions.

**6. Dome Silhouette**
A simplified Taj dome profile (bulbous dome + lotus finial + crescent spire) used as:
- Section footer decoration (faint, at 8% opacity)
- Closing section background element
- Favicon / social preview mark

### Motif Usage by Section

| Section | Primary Motif | Secondary | Background Treatment |
|---------|--------------|-----------|---------------------|
| Opening | Crescent moon, stars | Dome silhouette (in video) | Full-bleed video |
| Couple | Pointed arch (photo frame) | Rose corner ornaments | Solid midnight |
| Dua | Jali lattice overlay | Ornamental divider | Midnight + jali at 4% |
| Countdown | 4-pointed star sparkles | Ornamental divider | Subtle gradient to `--tj-deep` |
| Celebrations | Pointed arch (event cards) | Jali lattice overlay | Midnight + jali at 3% |
| RSVP | Rose line art border | Ornamental divider | `--tj-navy-mid` panel |
| Gallery | Pointed arch (image frames) | None (content-forward) | Solid midnight |
| Closing | Dome silhouette | Crescent + stars | Gradient midnight to deep |

---

## 5. Background Treatments

All sections share `--tj-midnight` (#0B1628) as the base. Differentiation is achieved through layered treatments, not different base colors.

### Treatment A — Solid Midnight
Sections: Opening (behind video), Couple, Gallery
```css
background: var(--tj-midnight);
```

### Treatment B — Jali Lattice Overlay
Sections: Dua, Celebrations
```css
background: var(--tj-midnight);
/* SVG pattern overlay via pseudo-element */
/* ::before with jali-pattern.svg at opacity 0.04 */
```

### Treatment C — Subtle Vertical Gradient
Sections: Countdown, Closing
```css
background: linear-gradient(180deg, var(--tj-midnight) 0%, var(--tj-deep) 100%);
```

### Treatment D — Elevated Panel
Sections: RSVP (the form area)
```css
background: var(--tj-navy-mid);
border: 1px solid rgba(212, 162, 78, 0.15);
border-radius: 2px;
```

### Texture Layer (optional, all sections)
A tileable marble-grain texture at `--tj-texture-opacity` (3%) can be applied globally via a fixed pseudo-element on the invitation container. This adds tactile depth without affecting readability. Asset: small WebP tile, under 50KB.

---

## 6. Border & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-radius-none` | `0` | Arch-framed elements (top is arch SVG, sides are straight) |
| `--tj-radius-sm` | `2px` | Cards, panels, input fields |
| `--tj-radius-md` | `4px` | Buttons, tags |
| `--tj-radius-arch` | `50% 50% 0 0` | Simulated arch top on simple cards |
| `--tj-border-ornament` | `1px solid var(--tj-gold)` | Decorative borders |
| `--tj-border-subtle` | `1px solid var(--tj-divider)` | Structural borders |
| `--tj-border-glow` | `1px solid rgba(212, 162, 78, 0.25)` | Soft gold border with ambient feel |

Design note: Mughal architecture uses straight edges and pointed arches, not rounded corners. Keep border-radius minimal (2-4px for functional elements only). The arch shape is achieved with SVG clip-paths or pseudo-elements, not CSS border-radius.

---

## 7. Shadow & Glow

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.3)` | Card elevation |
| `--tj-shadow-arch` | `0 2px 16px rgba(0, 0, 0, 0.4)` | Arch-framed elements |
| `--tj-glow-gold` | `0 0 20px rgba(212, 162, 78, 0.15)` | Ambient gold glow behind ornaments |
| `--tj-glow-moon` | `0 0 40px rgba(232, 228, 216, 0.12)` | Moon glow effect |
| `--tj-glow-star` | `0 0 8px rgba(255, 251, 230, 0.6)` | Star sparkle glow |

---

## 8. Animation Tokens

All animations respect `prefers-reduced-motion: reduce` — reduced-motion users see static final states.

| Token | Value | Usage |
|-------|-------|-------|
| `--tj-duration-fast` | `200ms` | Hover, focus, micro-interactions |
| `--tj-duration-medium` | `400ms` | Content reveals, transitions |
| `--tj-duration-slow` | `800ms` | Section entry, decorative reveals |
| `--tj-duration-dramatic` | `1500ms` | Opening sequence, arch draw-on |
| `--tj-ease-reveal` | `cubic-bezier(0.16, 1, 0.3, 1)` | Content entry (ease-out with overshoot) |
| `--tj-ease-gentle` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `--tj-ease-glow` | `ease-in-out` | Pulsing glow loops |

### Animation Catalog

| Name | Technique | Constraint |
|------|-----------|------------|
| Video-to-names | Video ends, overlay fades in with names | No fade-up in edit mode |
| Moon glow pulse | `box-shadow` oscillation, 4s loop | `will-change: box-shadow` |
| Star twinkle | Opacity 0.3-1.0 cycle, staggered 2-5s | Max 6 star elements |
| Arch stroke reveal | `stroke-dashoffset` from full to 0 | Trigger on scroll (IntersectionObserver) |
| Countdown digit | CSS `translateY` transition on digit change | No 3D transforms (keep simple) |
| Rose petal drift | `translateY` + slight `rotate`, 8-12s loop | Max 5 petals, `will-change: transform` |
| Gold shimmer | `background-position` animation on gradient text | Applied only to couple names |
| Section entry | Opacity 0 to 1, translateY 20px to 0 | Disabled in edit/preview mode |

---

## 9. Responsive Strategy

### Viewport Tiers

| Tier | Width | Behavior |
|------|-------|----------|
| **Base (mobile)** | `402px` | Design target. All specs in this doc are for this width. |
| **Small mobile** | `360px` | Scale down: hero text to 48px, reduce spacing by ~15% |
| **Desktop wrapped** | `>=768px` | `InvitationViewport` wraps the invitation in a portrait phone frame. Internal layout stays at 402px. |

### Desktop Presentation

On screens 768px and wider, the entire invitation is rendered inside `InvitationViewport` — a centered portrait frame (402 x 874 aspect ratio) with a decorative border. The invitation CSS does not need desktop breakpoints for layout; it always renders at the 402px mobile width. The viewport wrapper handles the desktop presentation.

### Small-Screen Adjustments (360px)

```
--tj-text-hero: 48px (down from 56)
--tj-text-display: 34px (down from 40)
--tj-text-h1: 24px (down from 28)
--tj-space-8: 56px (down from 64)
--tj-space-9: 64px (down from 80)
Content side padding: 20px (down from 24)
```

### Safe Text Area

For editable text (couple names, event details), maintain a safe zone:
- Horizontal: 24px from each edge minimum
- Vertical: 16px from section decorative borders
- Names must fit within 354px width at the assigned font size (handled by the Names Fit rule in the template system)

---

## 10. Accessibility

### Color Contrast (WCAG AA)

| Combination | Ratio | Pass |
|-------------|-------|------|
| `--tj-cream` on `--tj-midnight` | 13.2:1 | AA, AAA |
| `--tj-gold` on `--tj-midnight` | 7.1:1 | AA, AAA |
| `--tj-gold-light` on `--tj-midnight` | 9.4:1 | AA, AAA |
| `--tj-cream-soft` on `--tj-midnight` | 8.6:1 | AA, AAA |
| `--tj-cream` on `--tj-navy-mid` | 10.1:1 | AA, AAA |
| `--tj-gold` on `--tj-navy-mid` | 5.5:1 | AA |

All text-on-background combinations meet WCAG AA. The midnight navy provides excellent contrast for both cream and gold text.

### Focus States

Interactive elements (RSVP inputs, gallery items, countdown) use:
```css
outline: 2px solid var(--tj-gold-light);
outline-offset: 2px;
```

### Reduced Motion

All animations wrapped in:
```css
@media (prefers-reduced-motion: no-preference) {
  /* animation rules */
}
```
Static fallback: all elements in their final position, full opacity, no transitions.

### Arabic Text

- `dir="rtl"` and `lang="ar"` attributes on Arabic content containers
- Amiri font loaded with Arabic character subset
- Line-height generous enough for full diacritical marks (tashkeel)

---

## 11. Z-Index Scale

| Layer | Z-index | Contents |
|-------|---------|----------|
| Overlay text (opening names) | `50` | Couple names, Bismillah over video |
| Modal (gallery lightbox, RSVP confirm) | `40` | Full-screen overlays |
| Floating decorations (petals, sparkles) | `20` | Particle animations |
| Section content | `10` | Text, cards, images, forms |
| Decorative frames (arch SVGs, borders) | `5` | Ornamental SVG elements |
| Background patterns (jali, texture) | `1` | Pattern overlays via pseudo-elements |
| Section background | `0` | Solid color / gradient |
| Video layer | `-1` | Opening video behind overlay |

---

## 12. Asset Requirements

### SVGs to Build (inline, theme-able)

1. **Pointed arch frame** — Reusable at multiple scales (couple photo, event cards, gallery)
2. **Crescent moon** — With optional glow filter
3. **4-pointed star** — For sparkle scatter
4. **8-pointed star jali tile** — 40x40 repeating pattern
5. **Ornamental divider** — Horizontal line with central lotus/diamond node
6. **Rose line art** — Single stylized rose, mirror-able
7. **Dome silhouette** — Taj dome profile for section footers
8. **Arabesque scroll** — Short vine segment for corner ornaments

### Raster Assets

| Asset | Format | Target Size | Notes |
|-------|--------|-------------|-------|
| Opening video | MP4 | Existing | 10s, `preload="metadata"`, poster required |
| Video poster | WebP | <100KB | Final frame of video, 1080x1920 |
| Marble texture tile | WebP | <50KB | Subtle grain, 200x200, tileable |

---

*This design bible is the source of truth for all Taj template visual decisions. Section-specific layouts are in `section-blueprints.md`.*

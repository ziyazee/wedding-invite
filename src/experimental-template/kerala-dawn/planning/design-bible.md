# Kerala Dawn -- Design Bible

> A cinematic Kerala Hindu wedding invitation that unfolds like dawn itself:
> darkness gives way to lamplight, lamplight yields to the golden hour,
> and the couple's story emerges with the sun.

---

## 1. Design Philosophy

### Emotional Arc

The invitation is a single continuous journey from **night to dawn**. The user opens to near-total darkness -- a pre-dawn Kerala landscape where only a distant mandapam is visible. A pulsing lamp invites them to touch. As the video plays, oil lamps and string lights progressively illuminate the scene, and the couple's names materialize in the sky like the first light of day.

From that point, each scroll-section represents a later moment in the morning:
- **Opening** (Section 1): Deep night. Mystery, anticipation. `#050D0B` to `#0A1F1C`.
- **Couple & Family** (Section 2): First lamplight. Warmth entering darkness. `#0A1F1C` to `#142E1F`.
- **Countdown** (Section 3): Pre-dawn stillness. The moment of waiting. `#0F1A14` with lamp glow.
- **Celebrations** (Section 4): The sky lightens. Activity begins. `#1A3418` to `#2D5A27`.
- **RSVP** (Section 5): Transition. Practical and grounded. `#0D1B16` with warm accents.
- **Closing** (Section 6): Full dawn. The golden hour. `#2D5A27` to warm `#D4A236` glow.

### Design Principles

1. **Atmospheric Depth** -- Every section has at least 3 visual layers: a deep background gradient, a texture/noise overlay, and foreground decorative elements. This creates the feeling of looking through humid tropical air.

2. **Cultural Authenticity** -- Every ornament is drawn from real Kerala tradition: kasavu borders from the mundu, nilavilakku from temple courtyards, elephants from Thrissur Pooram, banana leaves from sadya. Nothing is generic "Indian wedding."

3. **Cinematic Restraint** -- Ornate sections (Couple, Celebrations) are balanced by breathing-room sections (Countdown, RSVP). Gold is powerful because it is used sparingly. Darkness makes the light meaningful.

4. **Warmth Through Light** -- Gold is never flat. It always glows -- via radial gradients, box-shadows, and subtle animation. Every gold element should feel like it is producing light, not just colored gold.

---

## 2. Color System

### 2.1 Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--kd-night` | `#050D0B` | Deepest background, video overlay |
| `--kd-teal-black` | `#0A1F1C` | Primary dark background |
| `--kd-deep-teal` | `#0F2A24` | Section backgrounds, cards |
| `--kd-paddy` | `#2D5A27` | Mid-tone green, later sections |
| `--kd-paddy-dark` | `#1A3418` | Dark green transitional |
| `--kd-lamp-gold` | `#D4A236` | Primary gold, headings, borders |
| `--kd-kasavu` | `#E8D5A3` | Cream-gold, body text on dark |
| `--kd-kasavu-light` | `#F0E4C1` | Lighter cream, secondary text |
| `--kd-slate` | `#2A3D4E` | Cool accents, mountain silhouettes |
| `--kd-ivory` | `#F5EFE0` | Lightest text, closing section bg hint |
| `--kd-warm-white` | `#FFF8ED` | Pure-white equivalent for this palette |

### 2.2 Extended Shades

| Token | Hex | Usage |
|-------|-----|-------|
| `--kd-night-green` | `#071410` | Video overlay at 85% opacity |
| `--kd-moss` | `#1E4A2A` | Border accents, divider lines |
| `--kd-deep-moss` | `#0D2318` | Card backgrounds on dark sections |
| `--kd-gold-bright` | `#E8B84A` | Hover states, active gold |
| `--kd-gold-dim` | `#A67E28` | Muted gold, inactive states |
| `--kd-gold-pale` | `#C4A86C` | Subtle gold tints |
| `--kd-ember` | `#D4763A` | Warm accent for closing section |
| `--kd-dawn-pink` | `#E8A076` | Dawn sky accent |
| `--kd-water-blue` | `#1A3040` | Water reflection tint |
| `--kd-charcoal` | `#2A2A2A` | Form input backgrounds |

### 2.3 Opacity Scale

```
--kd-opacity-veil:      0.85    /* Video/photo overlays */
--kd-opacity-smoke:     0.60    /* Atmospheric haze layers */
--kd-opacity-mist:      0.40    /* Subtle tints and washes */
--kd-opacity-breath:    0.20    /* Ghost borders, faint lines */
--kd-opacity-whisper:   0.08    /* Noise texture, faintest hints */
```

### 2.4 Gradient Definitions

**Night Sky (Opening)**
```css
background: linear-gradient(
  180deg,
  #050D0B 0%,
  #071410 30%,
  #0A1F1C 60%,
  #0D2318 100%
);
```

**First Light (Couple & Family)**
```css
background: linear-gradient(
  180deg,
  #0A1F1C 0%,
  #0F2A24 25%,
  #142E1F 50%,
  #1A3418 80%,
  #1E3E20 100%
);
```

**Stillness (Countdown)**
```css
background: radial-gradient(
  ellipse 60% 40% at 50% 50%,
  #1A2A1C 0%,
  #0F1A14 40%,
  #0A1510 100%
);
```

**Awakening (Celebrations)**
```css
background: linear-gradient(
  180deg,
  #1A3418 0%,
  #1E4A2A 30%,
  #2D5A27 70%,
  #2D5A27 100%
);
```

**Grounded (RSVP)**
```css
background: linear-gradient(
  180deg,
  #0D1B16 0%,
  #0F2218 50%,
  #142E1F 100%
);
```

**Dawn Arrival (Closing)**
```css
background: linear-gradient(
  180deg,
  #1E4A2A 0%,
  #2D5A27 20%,
  #3A6830 50%,
  #4A7838 80%,
  #5A8840 100%
);
/* Plus a warm radial overlay: */
background: radial-gradient(
  ellipse 80% 60% at 50% 30%,
  rgba(212, 162, 54, 0.25) 0%,
  rgba(212, 162, 54, 0.08) 50%,
  transparent 100%
);
```

---

## 3. Typography

### 3.1 Font Stack

```css
--kd-font-display: 'Cormorant Garamond', 'Georgia', serif;
--kd-font-body: 'Outfit', 'system-ui', sans-serif;
```

**Google Fonts load:**
```
Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600
Outfit:wght@200;300;400;500;600
```

### 3.2 Type Scale

All sizes in CSS `px` for the 402px phone viewport. Desktop (within the InvitationViewport portrait frame) uses the same values since the frame constrains width.

#### Display / Ceremonial

| Style | Font | Weight | Size | Line Height | Letter Spacing | Color | Usage |
|-------|------|--------|------|-------------|----------------|-------|-------|
| `kd-names` | Cormorant Garamond | 300 | 52px | 1.1 | 0.04em | `--kd-kasavu` | Couple names on Opening |
| `kd-names-ampersand` | Cormorant Garamond | 300 italic | 36px | 1.0 | 0.06em | `--kd-lamp-gold` | "&" between names |
| `kd-hero-date` | Outfit | 300 | 16px | 1.4 | 0.20em | `--kd-kasavu-light` | Date on Opening, uppercase |
| `kd-section-title` | Cormorant Garamond | 600 | 32px | 1.15 | 0.03em | `--kd-lamp-gold` | Section headings |
| `kd-section-subtitle` | Outfit | 300 | 13px | 1.5 | 0.18em | `--kd-kasavu-light` | Section subtitles, uppercase |

#### Family / Content

| Style | Font | Weight | Size | Line Height | Letter Spacing | Color | Usage |
|-------|------|--------|------|-------------|----------------|-------|-------|
| `kd-family-label` | Outfit | 500 | 11px | 1.3 | 0.14em | `--kd-gold-pale` | "Son of" / "Daughter of", uppercase |
| `kd-family-name` | Cormorant Garamond | 500 | 22px | 1.25 | 0.02em | `--kd-kasavu` | Parent names |
| `kd-person-name` | Cormorant Garamond | 600 | 28px | 1.15 | 0.02em | `--kd-kasavu` | Bride/groom names in family section |
| `kd-body` | Outfit | 300 | 15px | 1.65 | 0.01em | `--kd-kasavu-light` | Body text, descriptions |
| `kd-body-small` | Outfit | 300 | 13px | 1.5 | 0.01em | `--kd-kasavu-light` at 0.7 | Captions, helper text |
| `kd-blessing` | Cormorant Garamond | 400 italic | 20px | 1.5 | 0.02em | `--kd-kasavu` | Blessing/quote text |

#### Countdown

| Style | Font | Weight | Size | Line Height | Letter Spacing | Color | Usage |
|-------|------|--------|------|-------------|----------------|-------|-------|
| `kd-countdown-number` | Cormorant Garamond | 300 | 48px | 1.0 | 0.02em | `--kd-lamp-gold` | Days/hours/mins/secs |
| `kd-countdown-label` | Outfit | 400 | 10px | 1.3 | 0.16em | `--kd-gold-pale` | "DAYS" / "HOURS", uppercase |

#### Event Cards

| Style | Font | Weight | Size | Line Height | Letter Spacing | Color | Usage |
|-------|------|--------|------|-------------|----------------|-------|-------|
| `kd-event-title` | Cormorant Garamond | 600 | 22px | 1.2 | 0.02em | `--kd-lamp-gold` | Event name |
| `kd-event-detail` | Outfit | 400 | 14px | 1.5 | 0.01em | `--kd-kasavu-light` | Time, venue, address |
| `kd-event-date` | Outfit | 300 | 12px | 1.3 | 0.12em | `--kd-gold-pale` | Event date, uppercase |

#### Form / Interactive

| Style | Font | Weight | Size | Line Height | Letter Spacing | Color | Usage |
|-------|------|--------|------|-------------|----------------|-------|-------|
| `kd-input-label` | Outfit | 500 | 12px | 1.3 | 0.08em | `--kd-gold-pale` | Form labels, uppercase |
| `kd-input-value` | Outfit | 400 | 16px | 1.4 | 0 | `--kd-kasavu` | Input text |
| `kd-input-placeholder` | Outfit | 300 | 15px | 1.4 | 0 | `--kd-kasavu` at 0.4 | Placeholder |
| `kd-button` | Outfit | 500 | 14px | 1.0 | 0.10em | `--kd-teal-black` | Button text, uppercase |
| `kd-cta-glow` | Outfit | 300 | 13px | 1.0 | 0.16em | `--kd-kasavu-light` | "Touch to begin", uppercase |

---

## 4. Spacing System

Base unit: `4px`. All spacing uses multiples of the base.

```
--kd-space-1:   4px
--kd-space-2:   8px
--kd-space-3:   12px
--kd-space-4:   16px     /* Standard gap, element padding */
--kd-space-5:   20px
--kd-space-6:   24px     /* Card padding, group spacing */
--kd-space-8:   32px     /* Section inner padding (sides) */
--kd-space-10:  40px     /* Between major content blocks */
--kd-space-12:  48px     /* Between decorated sections */
--kd-space-16:  64px     /* Section vertical padding (top/bottom) */
--kd-space-20:  80px     /* Large vertical breathing room */
--kd-space-24:  96px     /* Between section content and decorative borders */
```

### Section Padding

Each section uses `padding: var(--kd-space-16) var(--kd-space-8)` as default (64px top/bottom, 32px sides). The Opening section is `padding: 0` (full-bleed video). The Closing section uses `padding: var(--kd-space-20) var(--kd-space-8)` for extra breathing room.

### Content Width

Maximum content width within sections: `340px` centered (on the 402px phone viewport, this gives 31px margin on each side). This keeps text lines at a comfortable 55-65 character measure.

---

## 5. Border and Ornament System

### 5.1 Kasavu Border

The kasavu border is the signature decorative frame element, derived from the gold-edged border of the Kerala mundu (white garment). It consists of:

- **Outer line**: 1px solid `--kd-lamp-gold` at 0.3 opacity
- **Inner line**: 1px solid `--kd-lamp-gold` at 0.5 opacity
- **Gap between lines**: 4px
- **Woven pattern zone**: A 12px band between the two lines filled with a repeating SVG pattern of interlocking diamond shapes in `--kd-lamp-gold` at 0.2 opacity
- **Corner ornament**: At each corner, the pattern zone expands into a 28x28px square containing a stylized lotus-bud motif

The kasavu border is used as a full-section frame on Couple & Family and as accent strips (top and bottom only) on other sections.

```css
/* Simplified CSS structure for kasavu border */
.kd-kasavu-frame {
  position: relative;
  border: 1px solid rgba(212, 162, 54, 0.3);
  padding: 20px; /* Gap for pattern zone */
}
.kd-kasavu-frame::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(212, 162, 54, 0.5);
}
/* SVG pattern and corner ornaments are placed as positioned pseudo-elements or inline SVGs */
```

### 5.2 Divider Types

**Nilavilakku Divider** -- A centered brass oil lamp SVG (described in section 9) flanked by horizontal lines:
- Lines: 1px `--kd-lamp-gold` at 0.3, extending 80px from center on each side
- Lamp icon: 24px wide, `--kd-lamp-gold`
- Total divider height: 32px including vertical spacing
- Used between groom's and bride's family blocks

**Elephant Divider** -- Two mirrored elephant silhouettes facing each other:
- Each elephant: 20px wide, `--kd-lamp-gold` at 0.25
- Gap between them: 8px with a small diamond shape
- Used between celebration event cards

**Lotus Divider** -- A single open lotus SVG centered:
- Width: 32px, `--kd-lamp-gold` at 0.3
- Two thin horizontal lines extending 60px on each side
- Used in the Closing section

**Simple Line** -- 1px `--kd-lamp-gold` at 0.15, full content width:
- Used sparingly where decoration would be excessive

### 5.3 Corner Ornaments

**Elephant Corner Motif** -- A stylized Kerala caparisoned elephant (nettipattam-wearing) in profile, 40x48px, placed in each corner of the Couple section's kasavu frame. The elephant faces inward (mirrored for left/right). Rendered in `--kd-lamp-gold` at 0.15 opacity -- a ghost impression, not a bold illustration.

**Lotus Corner** -- Used on event cards. A small open lotus, 16x16px, placed at top-left and bottom-right corners. `--kd-lamp-gold` at 0.2.

---

## 6. Texture and Material Treatments

### 6.1 Film Grain Overlay

Every section except Opening has a subtle film grain texture overlay:

```css
.kd-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* 200x200 noise tile */
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

The noise SVG is a `<filter>` using `feTurbulence` with `baseFrequency="0.65"` and 1 octave, rendered into a small tile. This simulates the grainy quality of a pre-dawn photograph.

### 6.2 Atmospheric Haze

Sections 2-5 have a radial gradient "haze" layer between background and content:

```css
.kd-section-haze {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 120% 80% at 50% 60%,
    rgba(212, 162, 54, 0.04) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

This creates a warm center-weighted glow that makes text feel like it is illuminated by lamplight. The gold opacity increases with each section (0.04, 0.05, 0.07, 0.10) to support the dawn progression.

### 6.3 Vignette

The Opening section and Countdown section have a vignette overlay:

```css
.kd-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    transparent 40%,
    rgba(5, 13, 11, 0.6) 100%
  );
  pointer-events: none;
}
```

### 6.4 Water Reflection Effect

The transition zone between the Opening video section and the Couple section uses a CSS reflection treatment:

```css
.kd-water-transition {
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(26, 48, 64, 0.3) 50%,
    rgba(10, 31, 28, 1) 100%
  );
  backdrop-filter: blur(2px);
}
```

This creates a visual bridge that evokes the water reflections seen in the video reference.

---

## 7. Shadow and Glow System

### 7.1 Glow Effects

**Lamp Glow** -- The signature warm glow used on gold elements that should feel luminous:
```css
--kd-glow-lamp: 0 0 20px rgba(212, 162, 54, 0.25),
                0 0 40px rgba(212, 162, 54, 0.10),
                0 0 80px rgba(212, 162, 54, 0.05);
```

**Text Glow** -- For names and key text against dark backgrounds:
```css
--kd-glow-text: 0 0 30px rgba(212, 162, 54, 0.20),
                0 0 60px rgba(212, 162, 54, 0.08);
```

**Pulse Glow** -- Animated for the "Touch to begin" CTA:
```css
@keyframes kd-pulse-glow {
  0%, 100% {
    box-shadow: 0 0 16px rgba(212, 162, 54, 0.15),
                0 0 32px rgba(212, 162, 54, 0.06);
    opacity: 0.7;
  }
  50% {
    box-shadow: 0 0 24px rgba(212, 162, 54, 0.30),
                0 0 48px rgba(212, 162, 54, 0.12);
    opacity: 1;
  }
}
```

**Button Glow**:
```css
--kd-glow-button: 0 0 12px rgba(212, 162, 54, 0.20),
                  0 2px 8px rgba(0, 0, 0, 0.30);
```

### 7.2 Shadows

**Card Shadow** -- For event cards and elevated content:
```css
--kd-shadow-card: 0 4px 24px rgba(0, 0, 0, 0.40),
                  0 1px 4px rgba(0, 0, 0, 0.20);
```

**Inset Shadow** -- For form inputs:
```css
--kd-shadow-inset: inset 0 1px 3px rgba(0, 0, 0, 0.30);
```

**Section Transition Shadow** -- Between sections:
```css
--kd-shadow-section: 0 -20px 40px rgba(0, 0, 0, 0.30);
```

---

## 8. Dawn Progression -- Section-by-Section Color Map

The dawn effect is achieved through background gradients that progressively warm and lighten. Here is the exact CSS for each section's layered background treatment:

### Section 1: Opening
```css
.kd-opening {
  background: #050D0B;
  /* Video covers this entirely; bg is fallback */
}
.kd-opening-overlay {
  /* Applied over video during name reveal */
  background: linear-gradient(
    180deg,
    rgba(5, 13, 11, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(5, 13, 11, 0.5) 100%
  );
}
```

### Section 2: Couple & Family
```css
.kd-couple {
  background:
    /* Layer 3: Gold haze */
    radial-gradient(ellipse 100% 60% at 50% 20%, rgba(212,162,54,0.04) 0%, transparent 70%),
    /* Layer 2: Noise (via ::after) */
    /* Layer 1: Base gradient */
    linear-gradient(180deg, #0A1F1C 0%, #0F2A24 40%, #142E1F 80%, #1A3418 100%);
}
```

### Section 3: Countdown
```css
.kd-countdown {
  background:
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,162,54,0.05) 0%, transparent 60%),
    radial-gradient(ellipse 80% 80% at 50% 50%, #0F1A14 0%, #0A1510 100%);
}
```

### Section 4: Celebrations
```css
.kd-celebrations {
  background:
    radial-gradient(ellipse 100% 50% at 50% 30%, rgba(212,162,54,0.07) 0%, transparent 70%),
    linear-gradient(180deg, #1A3418 0%, #1E4A2A 35%, #245A2E 65%, #2D5A27 100%);
}
```

### Section 5: RSVP
```css
.kd-rsvp {
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,162,54,0.06) 0%, transparent 70%),
    linear-gradient(180deg, #0D1B16 0%, #0F2218 50%, #142E1F 100%);
}
```

### Section 6: Closing
```css
.kd-closing {
  background:
    /* Layer 3: Dawn warm wash */
    radial-gradient(ellipse 90% 50% at 50% 20%, rgba(212,162,54,0.20) 0%, rgba(212,118,58,0.06) 50%, transparent 100%),
    /* Layer 2: Slight pink in upper region */
    radial-gradient(ellipse 60% 30% at 50% 10%, rgba(232,160,118,0.08) 0%, transparent 100%),
    /* Layer 1: Green base, lighter than earlier sections */
    linear-gradient(180deg, #2D5A27 0%, #3A6830 40%, #4A7838 70%, #3A6830 100%);
}
```

---

## 9. SVG Asset Specifications

Each asset is an inline SVG rendered in component code. All use `currentColor` or explicit fills from the palette for easy theming.

### 9.1 Nilavilakku (Brass Oil Lamp)

**Description**: A traditional five-wick Kerala brass oil lamp on a tiered pedestal base. The lamp has:
- **Base**: Three stacked circular platforms, tapering wider at bottom (like an inverted wedding cake). Each tier has a thin line around its edge.
- **Stem**: A turned cylindrical stem rising from the top platform, with two decorative bulges (nodes).
- **Bowl**: A wide, shallow oil bowl at the top. The bowl has a gently scalloped or lotus-petal rim.
- **Wicks**: Five small flame shapes rising from the bowl rim at equal intervals (one center, two left, two right). Each flame is a simple teardrop.
- **Proportions**: Height-to-width ratio approximately 2.5:1. If drawn at 48px tall, width is approximately 20px at the base.
- **Style**: Single stroke weight (1.5px), filled with `--kd-lamp-gold`. Minimal detail -- this is an icon, not a photorealistic illustration. Clean lines with slight curves for elegance.

**Variants**:
- `kd-lamp-icon`: 24px height, used in dividers
- `kd-lamp-hero`: 48px height, used in Countdown section
- `kd-lamp-silhouette`: 64px height, filled at 0.08 opacity, used as watermark behind text

### 9.2 Kasavu Border Pattern

**Description**: A repeating horizontal band pattern based on the kasavu (gold border of a Kerala mundu):
- **Structure**: A 12px tall strip. Within it, a row of connected diamond shapes (lozenges), each 12x12px, sharing vertices. Each diamond has a smaller diamond (4x4px) nested inside it.
- **Between diamonds**: The connection points have a tiny dot (2px circle).
- **Color**: Stroke in `--kd-lamp-gold` at 0.25 opacity, 0.75px stroke. Inner diamonds filled at 0.08.
- **Repeat**: `pattern` element, `patternUnits="userSpaceOnUse"`, width 12px.
- **Usage**: Runs horizontally inside the kasavu frame between the two border lines. Also used as a standalone top/bottom border strip on sections.

### 9.3 Elephant Motif

**Description**: A simplified profile silhouette of a Kerala temple elephant (caparisoned):
- **Pose**: Walking profile, facing right. Trunk raised slightly upward (auspicious gesture). One front leg forward.
- **Decoration**: A triangular nettipattam (gold headpiece) on the forehead with three small circles suggesting bells. A rectangular back cloth (ambari base) on its back.
- **Proportions**: Roughly square bounding box. At 40px, the elephant body fills about 36px wide, 40px tall from foot to top of head.
- **Style**: Solid filled silhouette (no internal strokes). Color: `--kd-lamp-gold`. Very simplified -- about 15-20 path points. Think: stamp or woodblock print quality, not cartoon.

**Variants**:
- `kd-elephant-corner`: 40x48px, 0.15 opacity, for kasavu frame corners
- `kd-elephant-divider`: 20x24px, 0.25 opacity, mirrored pair for event dividers

### 9.4 Banana Leaf Shape

**Description**: Used as the container shape for event cards. A simplified banana leaf:
- **Shape**: A long oval with a pointed tip at top and a slightly narrower pointed base. The central vein runs full length. Edges have a very gentle wavy undulation (4-5 subtle waves per side).
- **Proportions**: Height-to-width ratio 2:1 approximately (taller than wide). At the card scale, roughly 300px tall by 160px wide.
- **Style**: Fill with `--kd-deep-moss` (or `--kd-deep-teal` with green tint). The central vein and 6-8 angled side veins in `--kd-paddy` at 0.15 opacity. Outer edge has a 1px stroke in `--kd-lamp-gold` at 0.15.
- **Usage**: Each event's content is placed inside this leaf shape. The leaf clips the background but text sits within a safe inner area (with 24px inset from edges).

### 9.5 Coconut Palm Silhouette

**Description**: A single coconut palm tree seen from below, trunk curving slightly:
- **Trunk**: A gentle S-curve, tapering from 6px wide at base to 3px at crown. Ring marks suggested by subtle horizontal lines every 20px.
- **Crown**: 6-8 fronds radiating from the top. Each frond is a gentle arc with a pointed tip. Fronds have a central rib.
- **Proportions**: Total height 120-160px. Crown diameter about 80px.
- **Style**: Solid silhouette fill. Used at very low opacity (0.06-0.10) as background watermark elements placed at left and right edges of sections.
- **Color**: `--kd-paddy-dark` or `--kd-teal-black` depending on section.

### 9.6 Lotus Motif

**Description**: An open lotus flower viewed from above (top-down, slightly angled):
- **Petals**: Three rows. Inner row: 5 narrow petals, slightly open. Middle row: 8 petals, wider, overlapping inner. Outer row: 8 petals, largest, tips gently curved outward.
- **Center**: A small circle of dots representing seeds.
- **Proportions**: Roughly circular. At 32px, petals extend to edges.
- **Style**: Outlined in `--kd-lamp-gold` at 1px stroke. Petals have very subtle fill gradient from transparent at base to gold at 0.05 at tips. This creates a ghost-like appearance.

**Variants**:
- `kd-lotus-divider`: 32px, used in Closing divider
- `kd-lotus-corner`: 16px, used on event card corners
- `kd-lotus-hero`: 80px, used behind closing blessing text at 0.08 opacity

### 9.7 Temple Gopuram Silhouette

**Description**: A simplified silhouette of a Kerala temple gopuram (entrance tower):
- **Shape**: Pyramidal, 5 tiers. Each tier is a horizontal rectangle, narrowing as they go up. Slight curves on each tier's edges (not straight rectangles). Top has a small kalasam (finial) -- a pointed dome shape.
- **Proportions**: 2:1 height to width. At 48px wide, 96px tall.
- **Style**: Solid silhouette. Used as a watermark at 0.05 opacity behind the Couple section heading.
- **Color**: `--kd-lamp-gold` at specified opacity.

### 9.8 Jasmine Garland (Mulla Mala)

**Description**: A decorative strand of jasmine flowers used as a horizontal divider or frame accent:
- **Structure**: A gently sagging arc (catenary curve). Along the arc, alternating larger (6px) and smaller (4px) circles representing full and bud jasmine flowers. Approximately 12-16 flowers per span.
- **Connecting thread**: A 0.5px line connecting the flowers.
- **Color**: `--kd-kasavu-light` at 0.3 opacity. This keeps it subtle and ivory-white, like real jasmine against the dark background.
- **Usage**: Horizontal accent below section titles, or draped between kasavu frame corners.

### 9.9 Four-Pointed Star (Interaction Cue)

**Description**: The "touch to begin" indicator seen in the video reference:
- **Shape**: A four-pointed star with slightly concave edges between points (like a compass rose or a sparkling star). Points are sharp.
- **Size**: 24px bounding box.
- **Style**: Filled `--kd-kasavu-light`, with the pulse glow animation applied.
- **Usage**: Centered at bottom of Opening section, approximately 60px from bottom edge.

---

## 10. Responsive Behavior

### 10.1 Viewport Strategy

Kerala Dawn renders within the `InvitationViewport` frame on desktop, which constrains it to a portrait phone-like aspect ratio. Therefore, the template is designed for a **single-column, 402px mobile layout** that works identically on phone and desktop-inside-frame.

### 10.2 Breakpoints

Since the template lives inside `InvitationViewport`, we primarily design for:
- **Phone width** (402px equivalent): The canonical design
- **Narrow phone** (< 360px): Reduce `--kd-space-8` to 24px (side padding). Reduce `kd-names` to 44px. Event cards stack vertically with less padding.
- **Very narrow** (< 320px): Further reduce name font to 38px. Countdown numbers to 40px.

No landscape or wide-screen layouts needed -- `InvitationViewport` prevents that.

### 10.3 Content Flexibility

- **Names**: Max 40 characters. Font scales down linearly from 52px starting at 16 characters: `size = 52 - (charCount - 16) * 0.8`, minimum 32px. If still overflowing, `word-break: break-word` with `hyphens: auto`.
- **Event cards**: Variable count (1-6 events). Cards stack vertically with 24px gap. Each card maintains the banana leaf shape regardless of content length. Content area expands vertically if text overflows, extending the leaf.
- **Family names**: Max 40 characters per parent name. Same scaling approach as couple names but from 22px base.

### 10.4 Safe Areas

- Top safe area: 48px (for status bar / notch)
- Bottom safe area: 34px (for home indicator)
- Applied using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` with fallbacks.

---

## 11. Motion Principles

(Detailed motion specs are the domain of the motion designer, but the design bible establishes these principles.)

### 11.1 Reveal Animation

All text and decorative elements use the shared project reveal: **fade in while rising from below**. No character or line stagger. Implementation:
```css
@keyframes kd-reveal {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Duration: 600ms. Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Elements within a section stagger by 120ms (first element, then second, etc.) -- but this is a per-element delay, not a per-character stagger.

### 11.2 Reduced Motion

Under `prefers-reduced-motion: reduce`:
- All `kd-reveal` animations become instant (0ms duration)
- Pulse glow becomes static glow (no animation)
- Opening video autoplays instead of requiring tap (with poster as fallback)
- Parallax palm silhouettes are static

### 11.3 Performance Guardrails

- No continuous `requestAnimationFrame` loops for static sections
- Parallax (palm silhouettes) uses cached measurements + rAF, only while scrolling
- Film grain is a CSS background (no JS), using `will-change: auto` (not `transform`)
- Glow animations use `will-change: box-shadow, opacity` only on the animated element

---

## 12. Accessibility

- All decorative SVGs have `aria-hidden="true"` and `role="presentation"`
- Gold on dark teal meets WCAG AA for large text (contrast ratio 5.2:1 for `#D4A236` on `#0A1F1C`)
- Kasavu cream on dark teal meets WCAG AA for body text (contrast ratio 8.1:1 for `#E8D5A3` on `#0A1F1C`)
- Interactive elements have visible focus rings: `outline: 2px solid var(--kd-lamp-gold); outline-offset: 4px`
- The "Touch to begin" CTA has `role="button"` and `aria-label="Play invitation video"`
- Form inputs have proper `<label>` associations
- Section landmarks use `<section>` with `aria-label` describing content

---

## 13. CSS Custom Properties -- Complete Reference

```css
:root {
  /* Core Palette */
  --kd-night: #050D0B;
  --kd-teal-black: #0A1F1C;
  --kd-deep-teal: #0F2A24;
  --kd-paddy: #2D5A27;
  --kd-paddy-dark: #1A3418;
  --kd-lamp-gold: #D4A236;
  --kd-kasavu: #E8D5A3;
  --kd-kasavu-light: #F0E4C1;
  --kd-slate: #2A3D4E;
  --kd-ivory: #F5EFE0;
  --kd-warm-white: #FFF8ED;

  /* Extended */
  --kd-night-green: #071410;
  --kd-moss: #1E4A2A;
  --kd-deep-moss: #0D2318;
  --kd-gold-bright: #E8B84A;
  --kd-gold-dim: #A67E28;
  --kd-gold-pale: #C4A86C;
  --kd-ember: #D4763A;
  --kd-dawn-pink: #E8A076;
  --kd-water-blue: #1A3040;
  --kd-charcoal: #2A2A2A;

  /* Typography */
  --kd-font-display: 'Cormorant Garamond', 'Georgia', serif;
  --kd-font-body: 'Outfit', 'system-ui', sans-serif;

  /* Spacing */
  --kd-space-1: 4px;
  --kd-space-2: 8px;
  --kd-space-3: 12px;
  --kd-space-4: 16px;
  --kd-space-5: 20px;
  --kd-space-6: 24px;
  --kd-space-8: 32px;
  --kd-space-10: 40px;
  --kd-space-12: 48px;
  --kd-space-16: 64px;
  --kd-space-20: 80px;
  --kd-space-24: 96px;

  /* Opacity */
  --kd-opacity-veil: 0.85;
  --kd-opacity-smoke: 0.60;
  --kd-opacity-mist: 0.40;
  --kd-opacity-breath: 0.20;
  --kd-opacity-whisper: 0.08;

  /* Glows */
  --kd-glow-lamp: 0 0 20px rgba(212,162,54,0.25), 0 0 40px rgba(212,162,54,0.10), 0 0 80px rgba(212,162,54,0.05);
  --kd-glow-text: 0 0 30px rgba(212,162,54,0.20), 0 0 60px rgba(212,162,54,0.08);
  --kd-glow-button: 0 0 12px rgba(212,162,54,0.20), 0 2px 8px rgba(0,0,0,0.30);

  /* Shadows */
  --kd-shadow-card: 0 4px 24px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.20);
  --kd-shadow-inset: inset 0 1px 3px rgba(0,0,0,0.30);

  /* Transitions */
  --kd-ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
  --kd-duration-reveal: 600ms;
  --kd-stagger-delay: 120ms;
}
```

# Amrit Glow — PNG Choreography

Animated PNG elements create an ambient particle layer throughout the invitation. They float, drift, shimmer, and fall with organic, naturalistic motion. They exist at the periphery of the viewer's attention — adding warmth and life without competing with content.

---

## Global Rules

1. **Maximum 15 animated instances per viewport.** More creates visual noise and hurts performance.
2. **Never obscure readable text.** All particles live behind content at `z-index: var(--ag-z-particles-bg)` (2), below content at z-index 3.
3. **Screen blend mode on all PNG particles.** `mix-blend-mode: screen` combined with reduced opacity handles the opaque backgrounds.
4. **Dark backgrounds only.** Particles must not drift into or spawn on section areas with backgrounds lighter than `#1A2338`.
5. **`pointer-events: none`** on all particle elements. Purely visual.
6. **`will-change: transform, opacity`** on actively animating elements. Remove when paused.
7. **Reduced motion: disable all particle animation.** Under `@media (prefers-reduced-motion: reduce)`, show particles at static midpoint positions with fixed opacity. No movement.
8. **Stagger spawn times.** Each instance gets a randomized `animation-delay` between 0 and 100% of its cycle duration. Elements must never begin in unison.
9. **Intersection Observer activation.** Particles initialize only when their section enters a 200px threshold below the viewport. Pause or destroy when the section exits 200px above the viewport.
10. **Position: absolute within section container.** All particles are absolutely positioned inside their section's `position: relative` container. No layout recalculations.
11. **Clip to section bounds.** `overflow: hidden` on each section container prevents particles from visually crossing into adjacent sections.

---

## Position Zones

Particles spawn within defined zones relative to their section's bounding box. Zones are specified as percentage ranges of the section's width and height.

```
 0%                                    100% (width)
  ┌───┬──────────────────────────┬───┐  0% (height)
  │   │       upper-field        │   │
  │ L │                          │ R │
  │ E │                          │ I │
  │ F │      (content zone —     │ G │
  │ T │       text lives here,   │ H │
  │   │       particles avoid)   │ T │
  │ M │                          │   │
  │ A │                          │ M │
  │ R │                          │ A │
  │ G │                          │ R │
  │ I │                          │ G │
  │ N │       lower-field        │ I │
  │   │                          │ N │
  └───┴──────────────────────────┴───┘ 100% (height)
```

| Zone Name | X Range | Y Range | Description |
|-----------|---------|---------|-------------|
| `left-margin` | 0–12% | 10–90% | Left gutter — primary spawn zone |
| `right-margin` | 88–100% | 10–90% | Right gutter — primary spawn zone |
| `full-margin` | 0–15% + 85–100% | 0–100% | Combined margins (both sides) |
| `upper-field` | 10–90% | 0–20% | Above content at section top |
| `lower-field` | 10–90% | 80–100% | Below content at section bottom |
| `center-top` | 30–70% | 0–12% | Section top center (rare use) |
| `behind-content` | 15–85% | 15–85% | Content overlap zone — only at z-2 with very low opacity |

On the 402px viewport, 12% = ~48px. Particles in margin zones may partially overlap text at edges — this is acceptable because they are behind content (z-2) and at low opacity (<0.5).

---

## Element Type 1: Diyas (Brass Oil Lamps)

**Assets used**: `diya-1.png`, `diya-2.png`, `diya-3.png`, `diya-4.png`
**Native size**: 120 x 120 px each (~24KB)
**Character**: Warm, grounding, stationary presence. Diyas are placed objects — they bob gently like lamps on water, never fly or drift across the screen.

### Specifications

| Property | Value |
|----------|-------|
| **Sections** | Countdown (2), RSVP (2), Closing (3 — decorative row) |
| **Quantity per section** | 2–3 instances |
| **Max on-screen** | 4 simultaneously (across visible sections) |
| **Position zone** | `left-margin` + `right-margin`, vertically centered on the nearest content element |
| **Rendered size** | 28–44px (scaled down from 120px native) |
| **Blend mode** | `mix-blend-mode: screen` |
| **Opacity range** | 0.30–0.50 |
| **Z-index** | `var(--ag-z-particles-bg)` (2) |

### Motion

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Float** — gentle vertical bobbing in place |
| **Axis** | Y only (no horizontal drift) |
| **Pattern** | Sinusoidal oscillation |
| **Amplitude** | 4–8px (small, not exaggerated) |
| **Duration** | 6–10s per cycle |
| **Easing** | `ease-in-out` |
| **Direction** | Up-down only — diyas are placed objects, not airborne |
| **Rotation** | +/-3 degrees, same sinusoidal period (as if tilting on water) |

### Keyframe Reference

```css
@keyframes ag-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(calc(var(--ag-float-amp, -6px)))
               rotate(var(--ag-float-tilt, 2deg));
  }
}
```

Per-instance custom properties:
- `--ag-float-amp`: random between `-4px` and `-8px`
- `--ag-float-tilt`: random between `1deg` and `3deg`
- `animation-duration`: random between `6s` and `10s`
- `animation-delay`: random between `0s` and `10s`

### Glow Enhancement

Each diya gets an optional CSS pseudo-element for a lamp-glow effect:

```css
.ag-diya::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 228, 160, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
```

This creates a subtle warm glow around the flame area that reinforces the lamp metaphor.

### Variant Assignment

- Always use two different variants in any visible pair (e.g., diya-1 left + diya-3 right)
- Cycle through diya-1 to diya-4 across sections to avoid repetition
- Suggested assignments:
  - Countdown: diya-1 (left) + diya-2 (right)
  - RSVP: diya-3 (left) + diya-4 (right)
  - Closing: diya-1, diya-2, diya-3 in the decorative row

### Behavioral Notes

- Diyas do NOT spawn, drift, or exit the viewport through motion. They are persistent elements that appear (via the section's scroll reveal) and remain.
- Their motion is a gentle bob, not a journey. They feel anchored.
- In the Countdown and RSVP sections, diyas flank an ornamental rule — they are inline flex elements, not floating particles. Their float animation is applied but they maintain their layout position.
- In the Closing section, the 3-diya row is similarly layout-positioned with float animation.

### Density
**Sparse.** Always in pairs or a fixed row (2–3). Never scattered randomly. Never more than one diya in the same margin.

---

## Element Type 2: Sparkles (Gold Bokeh / Star Shapes)

**Assets used**: `sparkle-2.png` (90x90), `sparkle-3.png` (110x110), `sparkle-4.png` (80x80), `sparkle-6.png` (150x150)
**Excluded**: `sparkle-1.png` (too indistinct at display sizes — a 16px rendering of a 60px soft blob is invisible), `sparkle-5.png` (multi-spot cluster doesn't match the single-element particle system)
**Character**: Twinkling points of light that drift slowly and pulse in brightness. They represent starlight and lamp reflections.

### Specifications

| Property | Value |
|----------|-------|
| **Sections** | Hero (3–4), Couple (2), Celebrations (4 total across events), Personal Notes (1–2) |
| **Quantity per section** | 1–4 instances |
| **Max on-screen** | 8 simultaneously |
| **Position zone** | `full-margin`, `upper-field`, `lower-field` |
| **Rendered size** | 16–36px (well below native size for subtlety) |
| **Blend mode** | `mix-blend-mode: screen` |
| **Opacity range** | 0.15–0.40 (the shimmer oscillates within this range) |
| **Z-index** | `var(--ag-z-particles-bg)` (2) default; `sparkle-6` hero instance may use `var(--ag-z-particles-fg)` (4) briefly during opening reveal |

### Motion — Shimmer (Opacity Pulse)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Shimmer** — sinusoidal opacity oscillation |
| **Range** | Between `0.15` (nearly invisible) and the instance's max opacity (0.30–0.40) |
| **Duration** | 3–5s per cycle |
| **Easing** | `ease-in-out` |
| **Phase offset** | Each instance gets a unique offset (0–100% of duration) so they twinkle independently like stars, never flash in unison |

### Motion — Drift (Position)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Drift** — slow, meandering positional change |
| **Direction** | Randomized per instance (any combination of X and Y) |
| **Speed** | 2–5 pixels per second |
| **Total travel** | 40–80px in any direction before loop point |
| **Duration** | 12–16s per full drift cycle |
| **Easing** | `ease-in-out` |
| **Path** | Irregular — use 4-point keyframe path for organic feel |

### Motion — Rotation

| Motion Property | Value |
|-----------------|-------|
| **Range** | +/-15 degrees over 8–12s |
| **Direction** | Alternating (clockwise then counterclockwise, randomized per instance) |
| **Easing** | `ease-in-out` |

### Keyframe Reference

```css
/* Shimmer — opacity pulse */
@keyframes ag-shimmer {
  0%, 100% { opacity: var(--ag-sparkle-min, 0.15); }
  50%      { opacity: var(--ag-sparkle-max, 0.35); }
}

/* Drift — positional wandering (4-point organic path) */
@keyframes ag-drift {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(var(--ag-dx1), var(--ag-dy1)) rotate(var(--ag-rot1)); }
  50%  { transform: translate(var(--ag-dx2), var(--ag-dy2)) rotate(var(--ag-rot2)); }
  75%  { transform: translate(var(--ag-dx3), var(--ag-dy3)) rotate(var(--ag-rot1)); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
```

Per-instance custom properties:
- `--ag-sparkle-min`: random between `0.12` and `0.18`
- `--ag-sparkle-max`: random between `0.28` and `0.42`
- `--ag-dx1` through `--ag-dx3`: random between `-30px` and `30px`
- `--ag-dy1` through `--ag-dy3`: random between `-25px` and `25px`
- `--ag-rot1`, `--ag-rot2`: random between `-12deg` and `12deg`

Both animations run simultaneously on the same element:
```css
animation:
  ag-shimmer var(--shimmer-dur) ease-in-out infinite,
  ag-drift var(--drift-dur) ease-in-out infinite;
```

### Variant Assignment

| Variant | Role | Sections | Max Size |
|---------|------|----------|----------|
| `sparkle-6.png` | **Hero sparkle** — largest and most detailed | Hero only | 36px |
| `sparkle-3.png` | **Primary sparkle** — strong starburst form | Couple, Celebrations, Personal Notes | 28px |
| `sparkle-2.png` | **Secondary sparkle** — medium four-point star | Hero, Celebrations | 22px |
| `sparkle-4.png` | **Ambient sparkle** — softest, least prominent | Any section as fill | 18px |

Use a mix of variants per section. No two adjacent sparkles should be the same variant.

### Behavioral Notes

- Sparkles shimmer independently. Their opacity pulse cycles are phase-staggered so the effect is twinkling, not synchronized blinking.
- Sparkles have no lifecycle (no spawn/die cycle). They persist in their section, drifting and shimmering continuously.
- The hero `sparkle-6` instance is special: it may briefly appear at `z-index: 4` (foreground) during the hero text reveal animation (first 2 seconds), then transition to `z-index: 2` (background). This creates a momentary "sparkle across the names" effect.
- Sparkles are omnidirectional — unlike petals and leaves, they have no gravity. Their drift direction is randomized.

### Density
**Scattered.** Irregular spacing, no grid pattern, no clustering. Each sparkle should feel like an independent point of light, not part of a group.

---

## Element Type 3: Marigold Petals (Orange-Gold Petals)

**Assets used**: `marigold-1.png` through `marigold-5.png`
**Native size**: 80 x 80 px each (~9KB)
**Character**: Falling petals from unseen garlands above. They drift downward with gentle lateral sway, like petals caught in a warm breeze. This is the most dynamic particle type — actual traversal across the screen.

### Specifications

| Property | Value |
|----------|-------|
| **Sections** | Celebrations (5–8 instances across the full section), Closing (2–3 instances) |
| **Quantity per section** | 5–8 in Celebrations, 2–3 in Closing |
| **Max on-screen** | 10 simultaneously (but spread across a tall section — typically 4–5 visible per viewport) |
| **Position zone** | Spawn: `upper-field` + top of `full-margin`. Fall to: `lower-field` |
| **Rendered size** | 14–24px (scaled down substantially — petals are small) |
| **Blend mode** | `mix-blend-mode: screen` |
| **Opacity range** | 0.30–0.55 |
| **Z-index** | `var(--ag-z-particles-bg)` (2) |

### Motion — Fall (Vertical)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Fall** — linear downward drift |
| **Direction** | Downward only (petals respect gravity) |
| **Speed** | 8–15 pixels per second |
| **Total fall distance** | 300–500px per cycle |
| **Easing** | `linear` (constant speed falling, not accelerating) |

### Motion — Sway (Horizontal)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Sway** — sinusoidal lateral oscillation overlaid on the fall |
| **Amplitude** | 20–40px (total lateral swing) |
| **Period** | 4–7s per complete left-right-left cycle |
| **Easing** | `ease-in-out` (smooth reversals at sway extremes) |

### Motion — Rotation (Tumble)

| Motion Property | Value |
|-----------------|-------|
| **Range** | +/-45 degrees over the full fall duration |
| **Pattern** | Continuous, direction randomized per instance |
| **Easing** | `linear` |

### Keyframe Reference

```css
@keyframes ag-petal-fall {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: var(--ag-petal-opacity);
  }
  10% {
    opacity: var(--ag-petal-opacity); /* Fully visible after brief fade-in */
  }
  85% {
    opacity: var(--ag-petal-opacity); /* Begin fade-out */
  }
  100% {
    transform: translate(var(--ag-petal-sway-end), var(--ag-petal-fall-dist))
               rotate(var(--ag-petal-rot-end));
    opacity: 0;
  }
}
```

The lateral sway is baked into intermediate keyframes:

```css
@keyframes ag-petal-fall-sway {
  0%   {
    transform: translate(0, 0) rotate(0deg);
    opacity: var(--ag-petal-opacity);
  }
  20%  {
    transform: translate(var(--ag-sway-a), 20%) rotate(12deg);
  }
  40%  {
    transform: translate(calc(var(--ag-sway-a) * -0.6), 40%) rotate(-8deg);
  }
  60%  {
    transform: translate(var(--ag-sway-b), 60%) rotate(18deg);
  }
  80%  {
    transform: translate(calc(var(--ag-sway-b) * -0.4), 80%) rotate(-5deg);
  }
  90%  {
    opacity: var(--ag-petal-opacity);
  }
  100% {
    transform: translate(var(--ag-sway-end), var(--ag-petal-fall-dist)) rotate(var(--ag-petal-rot-end));
    opacity: 0;
  }
}
```

Per-instance custom properties:
- `--ag-petal-opacity`: random between `0.30` and `0.55`
- `--ag-petal-fall-dist`: random between `300px` and `500px`
- `--ag-petal-rot-end`: random between `-45deg` and `45deg`
- `--ag-sway-a`, `--ag-sway-b`: random between `-30px` and `30px` (different per instance)
- `--ag-sway-end`: random between `-15px` and `15px`
- `animation-duration`: random between `10s` and `16s`
- `animation-delay`: random between `0s` and the full duration (staggered starts)

### Lifecycle

Petals have a spawn-fall-fade-respawn cycle:

1. **Spawn**: petal appears at the top of its position zone at full opacity (with a brief 0.5s fade-in)
2. **Fall**: petal drifts downward with sway over 10–16 seconds
3. **Fade**: over the last 15% of the fall, opacity transitions to 0
4. **Respawn delay**: after reaching 0 opacity, wait a random 2–6 seconds
5. **Respawn**: petal resets to the top of a (potentially different) spawn position within the zone, with a new random sway pattern, and begins falling again

The staggered delays mean there are always some petals mid-fall and some respawning, creating a continuous but sparse shower.

### Variant Assignment

Randomly assign `marigold-1` through `marigold-5` to each instance. Use the following constraint:
- `marigold-4.png` (the two-petal cluster) is used for max 1 instance per viewport — it has more visual weight than single petals
- Remaining variants are freely randomized

### Behavioral Notes

- Petals ALWAYS fall downward. They never float upward or sideways without descending. The sway is a lateral oscillation overlaid on a constant downward drift. Gravity is always respected.
- The fall speed is slow enough that individual petals are discernible (not a blizzard). On a typical viewport showing 400px of section height at a time, 2–3 petals might be visible simultaneously.
- Petals should not cluster — randomize X-spawn positions across the section width. If two petals would spawn within 40px of each other horizontally, offset one.
- Marigold petals are warm orange `#D88020`, slightly different from the template's gold `#D4A843`. With screen blend and reduced opacity, this reads as a warm golden tone against the navy background — an acceptable and natural contrast.

### Density
**Light shower.** 5–8 petals across a section that may be 2000+ px tall. Each petal is individually visible. The effect is a gentle, scattered drift of petals falling from imaginary garlands overhead.

---

## Element Type 4: Gold Leaf Flakes (Metallic Confetti)

**Assets used**: `leaf-1.png`, `leaf-2.png`, `leaf-3.png`, `leaf-4.png`
**Native size**: 50 x 40 px each (~3KB)
**Character**: Tiny flecks of gold leaf (varq) tumbling through the air. The most subtle particle type — barely-there metallic glints that add richness. Their dark backgrounds are the best-case scenario for screen blend mode.

### Specifications

| Property | Value |
|----------|-------|
| **Sections** | Hero (2–3), Couple (2), Celebrations (3–4), RSVP (1–2) |
| **Quantity per section** | 1–4 instances |
| **Max on-screen** | 6 simultaneously |
| **Position zone** | `full-margin`, `upper-field`, `lower-field` — can appear in any margin area |
| **Rendered size** | 8–16px (very small — confetti flecks) |
| **Blend mode** | `mix-blend-mode: screen` |
| **Opacity range** | 0.45–0.80 (higher than other elements — the dark asset backgrounds nearly vanish with screen blend, and the content is tiny) |
| **Z-index** | `var(--ag-z-particles-bg)` (2) |

### Motion — Fall (Vertical)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Fall** — very slow downward drift |
| **Direction** | Downward with slight lateral wander |
| **Speed** | 3–8 pixels per second (slower than petals — lighter, floatier) |
| **Total fall distance** | 200–400px per cycle |
| **Easing** | `linear` |

### Motion — Spiral (Rotation)

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Full rotation** — continuous tumbling |
| **Range** | 360 degrees per revolution |
| **Duration** | 8–14s per full revolution |
| **Direction** | Clockwise or counterclockwise (randomized per instance) |
| **Easing** | `linear` (constant rotation speed) |

### Motion — Lateral Wander

| Motion Property | Value |
|-----------------|-------|
| **Type** | **Sinusoidal drift** — very gentle side-to-side during fall |
| **Amplitude** | 10–20px |
| **Period** | 6–10s |
| **Easing** | `ease-in-out` |

### Keyframe Reference

```css
@keyframes ag-leaf-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: var(--ag-leaf-opacity);
  }
  25% {
    transform: translateY(25%) translateX(var(--ag-leaf-dx)) rotate(90deg);
  }
  50% {
    transform: translateY(50%) translateX(calc(var(--ag-leaf-dx) * -0.5)) rotate(180deg);
  }
  75% {
    transform: translateY(75%) translateX(var(--ag-leaf-dx2)) rotate(270deg);
  }
  85% {
    opacity: var(--ag-leaf-opacity);
  }
  100% {
    transform: translateY(var(--ag-leaf-fall-dist)) translateX(0) rotate(var(--ag-leaf-rot-dir));
    opacity: 0;
  }
}
```

Per-instance custom properties:
- `--ag-leaf-opacity`: random between `0.45` and `0.80`
- `--ag-leaf-fall-dist`: random between `200px` and `400px`
- `--ag-leaf-dx`, `--ag-leaf-dx2`: random between `-15px` and `15px`
- `--ag-leaf-rot-dir`: `360deg` (clockwise) or `-360deg` (counterclockwise)
- `animation-duration`: random between `12s` and `18s` (slowest element type)
- `animation-delay`: random between `0s` and the full duration

### Lifecycle

Same spawn-fall-fade-respawn pattern as marigold petals:
1. **Spawn** at top of zone
2. **Fall** with rotation over 12–18 seconds
3. **Fade** over last 15% of fall
4. **Respawn delay**: 3–8 seconds (longer than petals — gold leaf is sparser)
5. **Respawn** at new random position

### Variant Assignment

- Randomly assign `leaf-1` through `leaf-4`
- `leaf-3.png` (the pair of flakes) appears max once per section — it has slightly more visual weight
- All variants are appropriate for all sections

### Behavioral Notes

- Gold leaf tumbles — **rotation is the primary visual characteristic**, more prominent than translation. The flakes catch imaginary light as they turn, which the screen blend mode enhances (the gold surface alternates between bright and shadowed as it rotates).
- Gold leaf falls even more slowly than petals. These are the lightest, most ethereal elements.
- At 8–16px rendered size, individual flakes are barely noticeable. They register as ambient metallic glints, not as identifiable objects. This subtlety is correct — they add richness at the subconscious level.
- These assets work best with screen blend because their native backgrounds are dark gray/brown (~`#3A3530`). Against the template's navy background, screen blend nearly eliminates the background, leaving only the gold content. Higher opacity (0.45–0.80) is appropriate because the blend works cleanly.

### Density
**Very sparse.** Individual glints, never in groups or clusters. Each flake should feel like an isolated metallic reflection, barely noticed.

---

## Excluded Elements

### Jasmine Flowers (jasmine-1/2/3.png) — DO NOT USE

**Reason**: White-on-cream backgrounds are unrecoverable with screen blend. The jasmine flowers are nearly the same color as their opaque backgrounds (`#E8E0D0`). Screen blending on dark will make the entire PNG (flower + background) appear as a bright cream rectangle. No opacity reduction can separate the flower from its background.

**If white florals are needed**, replace with CSS:

```css
/* CSS jasmine substitute — 5-petal radial */
.ag-jasmine-css {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, white 30%, transparent 31%);
  border-radius: 50%;
  box-shadow:
    6px 0 0 -1px rgba(255, 255, 255, 0.7),
    -6px 0 0 -1px rgba(255, 255, 255, 0.7),
    0 6px 0 -1px rgba(255, 255, 255, 0.7),
    0 -6px 0 -1px rgba(255, 255, 255, 0.7);
  opacity: 0.25;
}
```

This creates a tiny 5-point floral dot. At 12px and 25% opacity, it reads as a faint white flower without any background contamination.

### sparkle-1.png — DO NOT USE

**Reason**: Too indistinct. At display sizes (16–28px), a 60px soft bokeh blob becomes invisible — no clear sparkle form is recognizable. Replace with additional `sparkle-4.png` instances or the CSS sparkle dot below.

### sparkle-5.png — DO NOT USE

**Reason**: Multi-spot bokeh cluster doesn't match the single-element particle system. Each particle should be one discrete point of light. The cluster would read as a smudge at display sizes.

### CSS Sparkle Replacement

```css
/* Replaces sparkle-1 and adds variety without additional PNGs */
.ag-sparkle-css {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ag-lamp);
  box-shadow: 0 0 6px 2px rgba(255, 228, 160, 0.35);
  animation: ag-shimmer var(--shimmer-dur) ease-in-out infinite;
}
```

These CSS sparkle dots can supplement the PNG sparkles for additional ambient density without any file-size cost or blend-mode concerns.

---

## Section-by-Section Particle Budget

| Section | Diyas | Sparkles | Petals | Gold Leaf | **Total** | Notes |
|---------|-------|----------|--------|-----------|-----------|-------|
| 1. Hero | 0 | 4 | 0 | 3 | **7** | Sparkles + gold leaf only. Cinematic restraint. |
| 2. Couple | 0 | 2 | 0 | 2 | **4** | Minimal. Typography carries this section. |
| 3. Countdown | 2 | 0 | 0 | 0 | **2** | Diyas as positioned decorative elements only. |
| 4. Celebrations | 0 | 4 | 7 | 3 | **14** | Peak density. Section is ~2000px tall. |
| 5. RSVP | 2 | 0 | 0 | 2 | **4** | Quiet. Diyas as decorative, gold leaf as ambient. |
| 6. Personal Notes | 0 | 2 | 0 | 0 | **2** | Near-empty. Maximum stillness. |
| 7. Closing | 3 | 0 | 3 | 0 | **6** | Diya row + sparse closing petals. |

### Peak Viewport Load

The Celebrations section has the highest particle count at 14. However, since the section is very tall (~2000px for 5 events), at most 6–8 elements are visible in any single viewport frame. The actual peak-viewport load across the entire template is approximately **8–10 concurrent animated elements**.

### Progressive Density Arc

The particle density follows the emotional arc:

```
Hero:     ▓▓░░░░░░░░  (7 elements — restrained, cinematic)
Couple:   ▓░░░░░░░░░  (4 — minimal, formal)
Countdown:▓░░░░░░░░░  (2 — near-empty, compact)
Events:   ▓▓▓▓▓▓▓░░░  (14 — highest, celebratory)
RSVP:     ▓▓░░░░░░░░  (4 — calming down)
Notes:    ▓░░░░░░░░░  (2 — stillness)
Closing:  ▓▓▓░░░░░░░  (6 — gentle resolution)
```

---

## Performance Budget

| Metric | Target |
|--------|--------|
| Max concurrent animated elements (per viewport frame) | 10 |
| Max concurrent animated elements (per section, including off-viewport) | 15 |
| Animation method | CSS animations (preferred). Use `requestAnimationFrame` only if dynamic randomized paths are generated at runtime. |
| GPU layers | `will-change: transform, opacity` on actively animating elements. Remove via JS when the section exits the Intersection Observer. |
| Intersection Observer | Threshold: activate at 200px before viewport entry. Deactivate at 200px after viewport exit. |
| Paint area | All particles are `position: absolute` — transforms only, no layout impact. |
| Image loading | All animated PNGs: `loading="lazy"`, `decoding="async"`. Preload only hero sparkles (3–4 images, ~60KB). |
| Total particle image payload | ~140KB (22 PNGs minus excluded). Only ~60KB loaded initially (hero assets). |
| Frame rate target | 60fps. If dropped frames detected (via `requestAnimationFrame` delta monitoring), reduce particle count by pausing lowest-opacity instances first. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)`: disable all keyframe animations. Show particles at static midpoint positions. No movement, no shimmer. |

### Degradation Strategy

If performance is poor (measured by consistent frame drops below 45fps):
1. **First**: pause all gold leaf flakes (least visually impactful)
2. **Second**: reduce sparkle count to 1 per visible section
3. **Third**: pause marigold petal animations (show static petals)
4. **Last resort**: hide all particles, keep only layout-positioned diyas as static images

---

## Asset Quality Notes

### Crescent Moon (crescent-moon.png) — STATIC ONLY

The crescent moon has a visible text watermark at the bottom of the image. Crop the bottom ~30px in CSS (`object-fit: cover` with reduced height, or `clip-path`) before using. It is NOT an animated particle — it is a static decorative element in the Hero section only. Position it at `top: 12%; right: 8%` and leave it there.

### Marigold Color Note

Marigold petals are orange (#D88020), noticeably warmer than the template's gold (#D4A843). With screen blend at 0.30–0.55 opacity against navy, the color reads as warm gold — acceptable and culturally authentic (real marigolds are orange). No CSS color correction needed.

### Event Card Background

`event-card-bg.png` is not a particle — it is a layout element used in section-blueprints.md. It does not receive particle animations, blend modes, or motion. It is included in the asset audit but excluded from choreography.

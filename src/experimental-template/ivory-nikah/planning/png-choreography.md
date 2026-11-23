# Ivory Nikah — PNG Choreography

Animation behavior specification for floating jasmine petals. This document defines every parameter needed to implement the petal particle system using GSAP motion paths.

---

## Overview

Floating jasmine petals create a gentle ambient layer that evokes the feeling of standing beneath a jasmine bower in a Mughal garden — petals detach from the vine and drift lazily downward. The effect is sparse and naturalistic, never a heavy "snowfall." Petals are decoration, never information — they must never interfere with reading or interaction.

**Total petal instances across the entire page: 13** (hard ceiling of 15, using 13 for a natural-feeling odd number).

**Performance budget:** Petals use GSAP `gsap.to()` with `motionPath` plugin for organic movement. No `requestAnimationFrame` loops outside GSAP. All petals use `will-change: transform` during animation, and petals outside the viewport are paused via GSAP's built-in ScrollTrigger integration.

---

## Petal Asset Assignment

Each of the 5 petal PNG variants has a distinct shape (from the asset audit) that maps to a specific motion personality:

| Asset | Shape Character | Motion Type | Assigned Instances |
|-------|----------------|-------------|-------------------|
| `petal-1.png` | Elongated teardrop | **Spiral descent** — tumbles as it falls, rotating along its long axis | 3 |
| `petal-2.png` | Broad, rounded | **Gentle drift** — slow, wide lateral sway, minimal rotation | 3 |
| `petal-3.png` | Narrow crescent/curved | **Quick flutter** — fastest fall, tight oscillation, dynamic rotation | 2 |
| `petal-4.png` | Cupped teardrop | **Weighted float** — steady descent with occasional pauses | 3 |
| `petal-5.png` | Broad heart-shaped | **Leaf drift** — slowest, rocking side-to-side like a leaf on still air | 2 |

---

## Section Distribution

| Section | Petal Count | Rationale |
|---------|-------------|-----------|
| 1. Opening | 0 | Doors and arch are the visual event. Zero petals during or after the door animation — the reveal must be clean. |
| 2. Couple & Family | 3 | First appearance of petals. Sparse, establishing the motif. Positioned toward section edges, away from text. |
| 3. Dua / Blessing | 0 | Sacred, contemplative section. No ambient decoration — the Arabic calligraphy is the visual. |
| 4. Celebrations | 4 | Peak density. The festive section gets the most petals, scattered across the vertical span of the three cards. |
| 5. Countdown | 2 | Light accent. Petals frame the countdown numbers without distracting from the ticking digits. |
| 6. RSVP | 2 | Gentle presence. Petals drift near the edges — never over the form inputs or button. |
| 7. Closing | 2 | Final whisper. Two slow petals as the invitation winds down. |

**Total: 13 petals.**

---

## Instance Specifications

Each petal instance is defined below with exact parameters for GSAP implementation.

### Section 2: Couple & Family — 3 petals

**Petal C-1**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-2.png` (broad, rounded) |
| Motion type | Gentle drift |
| Display size | `width: 48px; height: auto` |
| Spawn position | `top: 8%; left: 78%` (right side, above text) |
| End position | `top: 85%; left: 65%` (drifts left and down) |
| Motion path curvature | S-curve: 2 control points offset ±40px horizontally |
| Duration | 18s per cycle |
| Rotation | 0deg to -45deg (slow counter-clockwise) |
| Opacity | Entry: 0 → 0.65 over first 2s; hold 0.65; exit: 0.65 → 0 over last 2s |
| Delay | 0s (starts when section enters viewport) |
| Repeat | `repeat: -1` (infinite), `yoyo: false` |
| Z-index | 5 |

**Petal C-2**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-1.png` (elongated teardrop) |
| Motion type | Spiral descent |
| Display size | `width: 32px; height: auto` |
| Spawn position | `top: 15%; left: 12%` (left side) |
| End position | `top: 92%; left: 22%` (drifts right and down) |
| Motion path curvature | Sine wave: 3 control points, ±25px horizontal oscillation |
| Duration | 22s per cycle |
| Rotation | 0deg to 180deg (full rotation over cycle) |
| Opacity | Entry: 0 → 0.55 over first 3s; hold 0.55; exit: 0.55 → 0 over last 2s |
| Delay | 4s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal C-3**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-5.png` (broad heart) |
| Motion type | Leaf drift |
| Display size | `width: 40px; height: auto` |
| Spawn position | `top: 35%; left: 85%` (right edge, mid-section) |
| End position | `top: 95%; left: 72%` |
| Motion path curvature | Wide arc: 2 control points, ±55px horizontal |
| Duration | 26s per cycle |
| Rotation | -15deg to 15deg (gentle rock, `yoyo: true`) |
| Opacity | Entry: 0 → 0.5 over first 3s; hold 0.5; exit: 0.5 → 0 over last 3s |
| Delay | 8s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

---

### Section 4: Celebrations — 4 petals

**Petal E-1**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-3.png` (narrow crescent) |
| Motion type | Quick flutter |
| Display size | `width: 28px; height: auto` |
| Spawn position | `top: 3%; left: 70%` (above first card, right side) |
| End position | `top: 35%; left: 55%` (between card 1 and 2) |
| Motion path curvature | Zigzag: 4 control points, ±18px tight oscillation |
| Duration | 12s per cycle |
| Rotation | 0deg to 270deg (fast spin) |
| Opacity | Entry: 0 → 0.6 over 1.5s; hold 0.6; exit: 0.6 → 0 over 1.5s |
| Delay | 0s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal E-2**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-4.png` (cupped teardrop) |
| Motion type | Weighted float |
| Display size | `width: 44px; height: auto` |
| Spawn position | `top: 20%; left: 15%` (left side, near card 1-2 gap) |
| End position | `top: 60%; left: 28%` |
| Motion path curvature | Gentle arc: 2 control points, ±30px |
| Duration | 20s per cycle |
| Rotation | 10deg to -20deg (slow tilt) |
| Opacity | Entry: 0 → 0.7 over 2s; hold 0.7; exit: 0.7 → 0 over 2s |
| Delay | 3s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal E-3**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-1.png` (elongated teardrop) |
| Motion type | Spiral descent |
| Display size | `width: 36px; height: auto` |
| Spawn position | `top: 40%; left: 82%` (right side, near card 2) |
| End position | `top: 80%; left: 68%` |
| Motion path curvature | S-curve: 3 control points, ±35px |
| Duration | 16s per cycle |
| Rotation | 0deg to -120deg |
| Opacity | Entry: 0 → 0.6 over 2s; hold 0.6; exit: 0.6 → 0 over 2s |
| Delay | 7s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal E-4**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-2.png` (broad, rounded) |
| Motion type | Gentle drift |
| Display size | `width: 52px; height: auto` |
| Spawn position | `top: 65%; left: 8%` (left edge, near card 3) |
| End position | `top: 96%; left: 20%` |
| Motion path curvature | Wide arc: 2 control points, +45px rightward drift |
| Duration | 24s per cycle |
| Rotation | 0deg to -30deg |
| Opacity | Entry: 0 → 0.55 over 3s; hold 0.55; exit: 0.55 → 0 over 3s |
| Delay | 5s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

---

### Section 5: Countdown — 2 petals

**Petal D-1**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-4.png` (cupped teardrop) |
| Motion type | Weighted float |
| Display size | `width: 36px; height: auto` |
| Spawn position | `top: 10%; left: 88%` (far right edge) |
| End position | `top: 80%; left: 78%` |
| Motion path curvature | Gentle arc: 2 control points, ±20px |
| Duration | 20s per cycle |
| Rotation | 5deg to -15deg |
| Opacity | Entry: 0 → 0.5 over 2s; hold 0.5; exit: 0.5 → 0 over 2s |
| Delay | 2s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal D-2**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-5.png` (broad heart) |
| Motion type | Leaf drift |
| Display size | `width: 30px; height: auto` |
| Spawn position | `top: 25%; left: 5%` (far left edge) |
| End position | `top: 90%; left: 15%` |
| Motion path curvature | Wide arc: 2 control points, +30px rightward |
| Duration | 28s per cycle |
| Rotation | -10deg to 10deg (rock, `yoyo: true`) |
| Opacity | Entry: 0 → 0.45 over 3s; hold 0.45; exit: 0.45 → 0 over 3s |
| Delay | 10s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

---

### Section 6: RSVP — 2 petals

**Petal R-1**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-1.png` (elongated teardrop) |
| Motion type | Spiral descent |
| Display size | `width: 34px; height: auto` |
| Spawn position | `top: 5%; left: 90%` (right edge, above form) |
| End position | `top: 70%; left: 80%` (stays right of form) |
| Motion path curvature | S-curve: 2 control points, ±22px |
| Duration | 18s per cycle |
| Rotation | 0deg to 150deg |
| Opacity | Entry: 0 → 0.5 over 2s; hold 0.5; exit: 0.5 → 0 over 2s |
| Delay | 4s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Keep-clear zone:** Petals in this section must never cross into `left: 10%` to `left: 90%` within `top: 15%` to `top: 85%` of section height. That rectangle is the form card area. Both RSVP petals stay pinned to the right edge.

**Petal R-2**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-3.png` (narrow crescent) |
| Motion type | Quick flutter |
| Display size | `width: 24px; height: auto` |
| Spawn position | `top: 30%; left: 4%` (left edge) |
| End position | `top: 75%; left: 8%` (stays left of form) |
| Motion path curvature | Zigzag: 3 control points, ±14px |
| Duration | 14s per cycle |
| Rotation | 0deg to -200deg |
| Opacity | Entry: 0 → 0.5 over 1.5s; hold 0.5; exit: 0.5 → 0 over 1.5s |
| Delay | 9s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

---

### Section 7: Closing — 2 petals

**Petal G-1**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-4.png` (cupped teardrop) |
| Motion type | Weighted float |
| Display size | `width: 42px; height: auto` |
| Spawn position | `top: 5%; left: 75%` |
| End position | `top: 80%; left: 60%` |
| Motion path curvature | Wide arc: 2 control points, ±40px |
| Duration | 24s per cycle |
| Rotation | 0deg to -25deg |
| Opacity | Entry: 0 → 0.5 over 3s; hold 0.5; exit: 0.5 → 0 over 3s |
| Delay | 2s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

**Petal G-2**
| Parameter | Value |
|-----------|-------|
| Asset | `petal-2.png` (broad, rounded) |
| Motion type | Gentle drift |
| Display size | `width: 38px; height: auto` |
| Spawn position | `top: 20%; left: 18%` |
| End position | `top: 88%; left: 30%` |
| Motion path curvature | Gentle arc: 2 control points, +25px rightward |
| Duration | 26s per cycle |
| Rotation | -5deg to -35deg |
| Opacity | Entry: 0 → 0.45 over 3s; hold 0.45; exit: 0.45 → 0 over 3s |
| Delay | 6s |
| Repeat | `repeat: -1` |
| Z-index | 5 |

---

## Motion Path Definitions

### Spiral Descent (petal-1)
```
M {startX},{startY}
C {startX + 25},{startY + 20%h}
  {startX - 25},{startY + 50%h}
  {midX},{midY}
C {midX + 20},{midY + 20%h}
  {midX - 20},{midY + 40%h}
  {endX},{endY}
```
A double S-curve. The petal weaves left-right as it descends. The `25px` offset creates visible lateral movement without exaggeration.

### Gentle Drift (petal-2)
```
M {startX},{startY}
C {startX - 40},{startY + 35%h}
  {endX + 40},{startY + 65%h}
  {endX},{endY}
```
A single wide S-curve. The broad petal shape catches the eye, so the path is simple. The 40px offset creates a lazy, wind-blown quality.

### Quick Flutter (petal-3)
```
M {startX},{startY}
L {startX + 18},{startY + 12%h}
L {startX - 18},{startY + 24%h}
L {startX + 18},{startY + 36%h}
L {startX - 18},{startY + 48%h}
L {endX},{endY}
```
A tight zigzag path. The narrow crescent petal tumbles rapidly through this path with fast rotation, simulating a light petal caught in a draft.

### Weighted Float (petal-4)
```
M {startX},{startY}
C {startX},{startY + 15%h}
  {startX - 30},{startY + 30%h}
  {midX},{midY}
Q {midX + 15},{midY + 25%h}
  {endX},{endY}
```
A soft curve with a slight horizontal drift. The cupped petal shape has visual weight, so the path suggests gravity — steady, unhurried.

### Leaf Drift (petal-5)
```
M {startX},{startY}
C {startX - 55},{startY + 30%h}
  {startX + 55},{startY + 70%h}
  {endX},{endY}
```
The widest S-curve arc (55px offset). Combined with the rocking rotation (`yoyo: true`), this simulates a flat leaf descending through still air — swaying broadly, taking its time.

---

## Global Rules

### Text Avoidance

Petals must never obscure readable text at any point in their motion path. The position specifications above are designed to keep petals in the peripheral zones of each section (edges, above/below content). During implementation, verify that no petal path crosses the center content column (roughly `left: 20%` to `left: 80%` of the section, within the content vertical span).

**Exception:** In the Celebrations section, petals may drift through the gaps between cards (the 32px diamond-separator zones), because no text exists there.

### Opacity Ceiling

No petal instance exceeds 0.7 peak opacity. Most hover between 0.45 and 0.65. This keeps petals ghostly and ambient — they belong to the atmospheric layer, not the content layer.

| Motion type | Peak opacity range |
|------------|-------------------|
| Spiral descent | 0.5 - 0.6 |
| Gentle drift | 0.55 - 0.65 |
| Quick flutter | 0.5 - 0.6 |
| Weighted float | 0.5 - 0.7 |
| Leaf drift | 0.45 - 0.5 |

### Size Range

| | Minimum | Maximum | Typical |
|-|---------|---------|---------|
| Width | 24px | 52px | 34-42px |

The petals are small. At these sizes, the alpha fringing artifacts noted in the asset audit (petals 4, 5) are completely invisible.

### Rotation Behavior

| Motion type | Rotation range | Rotation style |
|------------|----------------|----------------|
| Spiral descent | 0 to 180deg | Continuous one-direction (`ease: "none"` for linear) |
| Gentle drift | 0 to -45deg | Slow ease-in-out |
| Quick flutter | 0 to 270deg | Fast continuous |
| Weighted float | ±20deg | Slow ease-in-out |
| Leaf drift | ±15deg | Yoyo rocking |

### Z-Index

All petals: `z-index: 5`. This places them:
- Above section content (z-index 3)
- Above decorative elements (z-index 2)
- Below the opening doors when closed (z-index 10)

On mobile (402px), if petals overlap interactive elements (buttons, inputs), they receive `pointer-events: none` (applied to all petals globally).

### Viewport-Based Activation

Each petal is controlled by a GSAP ScrollTrigger scoped to its parent section:

```js
ScrollTrigger.create({
  trigger: sectionElement,
  start: "top 90%",    // Start when section is 10% visible
  end: "bottom 10%",   // End when section is 90% scrolled past
  onEnter: () => petalTimeline.play(),
  onLeave: () => petalTimeline.pause(),
  onEnterBack: () => petalTimeline.play(),
  onLeaveBack: () => petalTimeline.pause(),
});
```

This ensures petals are only animating when their section is visible. Off-screen sections have paused animations = zero GPU cost.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .in-petal {
    display: none !important;
  }
}
```

All petals are hidden entirely when the user prefers reduced motion. No slowed-down fallback, no static placement — complete removal.

### Performance Notes

1. **Image sizing:** Petal PNGs must be served at their display size (24-52px width), not at their original resolution (which can be over 1000px). This means the implementation phase must resize the assets to max 120px wide for the src attribute, or use `width`/`height` attributes to let the browser decode at reduced resolution.
2. **GPU layers:** Each petal element should have `will-change: transform, opacity` to promote to its own compositor layer. With 13 elements total, this is well within acceptable GPU memory bounds.
3. **No `requestAnimationFrame` manual loops.** GSAP handles the animation frame internally. No additional rAF calls for petals.
4. **No layout thrashing.** Petals use only `transform` and `opacity` — no top/left animation, no width/height changes. Transform-only animations stay on the compositor thread.
5. **Stagger offsets via `delay`.** Rather than spawning all petals simultaneously, the delays (ranging 0s to 10s) create a natural, unsynchronized distribution — petals feel like they fell at different moments, not launched together.

---

## Summary Table

| ID | Asset | Section | Size | Duration | Peak Opacity | Motion |
|----|-------|---------|------|----------|-------------|--------|
| C-1 | petal-2 | 2. Couple | 48px | 18s | 0.65 | Gentle drift |
| C-2 | petal-1 | 2. Couple | 32px | 22s | 0.55 | Spiral descent |
| C-3 | petal-5 | 2. Couple | 40px | 26s | 0.50 | Leaf drift |
| E-1 | petal-3 | 4. Celebrations | 28px | 12s | 0.60 | Quick flutter |
| E-2 | petal-4 | 4. Celebrations | 44px | 20s | 0.70 | Weighted float |
| E-3 | petal-1 | 4. Celebrations | 36px | 16s | 0.60 | Spiral descent |
| E-4 | petal-2 | 4. Celebrations | 52px | 24s | 0.55 | Gentle drift |
| D-1 | petal-4 | 5. Countdown | 36px | 20s | 0.50 | Weighted float |
| D-2 | petal-5 | 5. Countdown | 30px | 28s | 0.45 | Leaf drift |
| R-1 | petal-1 | 6. RSVP | 34px | 18s | 0.50 | Spiral descent |
| R-2 | petal-3 | 6. RSVP | 24px | 14s | 0.50 | Quick flutter |
| G-1 | petal-4 | 7. Closing | 42px | 24s | 0.50 | Weighted float |
| G-2 | petal-2 | 7. Closing | 38px | 26s | 0.45 | Gentle drift |

**Asset usage count:** petal-1: 3, petal-2: 3, petal-3: 2, petal-4: 3, petal-5: 2. All 5 variants represented.

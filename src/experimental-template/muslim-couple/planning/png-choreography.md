# Muslim Couple Template -- Ambient Animation Choreography

Since this template has no user-provided animated PNGs, all ambient animated elements are SVG-based (inline SVG or SVG files). This document specifies what moves, how it moves, where it appears, and when it pauses. These are the *living details* that make the invitation feel warm and inhabited rather than static.

All animations use GSAP inside `gsap.context()` with cleanup on unmount. All respect `prefers-reduced-motion: reduce` (hidden entirely). All pause when their section leaves the viewport (IntersectionObserver). Maximum **15 concurrent animated elements per section**.

CSS prefix: `mc-anim-*` for animation classes. Properties animated: **only `transform` and `opacity`** (GPU-composited).

---

## 1. Floating Rose Petals

### Description
Individual rose petals drift slowly through sections, as if carried by the gentlest breeze in the palace garden. They tumble and rotate as they float, mimicking the scattered petals on the marble terrace in the reference video.

### Asset
4 distinct petal SVGs, each a simple curved teardrop shape (~`14px` by `10px`):
- Petal A: slightly curled, viewed from above
- Petal B: elongated, viewed from the side
- Petal C: wide, partially open
- Petal D: small, tightly curled

Colors (applied via `fill` attribute, randomized per instance):
- `#C87890` (dusty deep pink / `--mc-rose-deep`)
- `#D4A0A8` (dusty rose)
- `#E0A0B0` (medium rose)
- `#F0B0C0` (soft blush / `--mc-rose`)

### Movement Pattern
Each petal follows a curved path (GSAP `MotionPathPlugin`), never a straight line.

```
Path shape: Gentle S-curve, drifting diagonally downward
Start:  top-left or top-right of visible area (randomized)
End:    bottom-opposite-side, ~200-400px below start
```

Specific motion values:
- **Horizontal drift**: `80-160px` total, direction randomized (left-to-right or right-to-left)
- **Vertical fall**: `200-400px` total, always downward
- **Rotation**: continuous slow rotation, `gsap.utils.random(-180, 180)` degrees over the duration
- **Scale variation**: start at `gsap.utils.random(0.6, 1.0)`, stay constant (no scale animation -- just initial size variety)
- **Opacity**: fade in during first 15% of path (`0 -> gsap.utils.random(0.3, 0.6)`), hold, fade out during last 15% (`-> 0`)

### Timing
- Duration per cycle: `gsap.utils.random(5000, 9000)` ms
- Easing: `sine.inOut` (for the path position)
- Rotation easing: `none` (linear rotation feels natural for a tumbling petal)
- Delay between cycles: `gsap.utils.random(1000, 4000)` ms
- Each petal has its own independent timing (no synchronization)

### Sections & Counts
| Section | Count | Notes |
|---------|-------|-------|
| Entry | 0 | Video provides all visual interest |
| Family | 3 | Scattered lightly, low opacity (0.2-0.4) |
| Countdown | 4 | Slightly more, adding warmth to the champagne background |
| Celebrations | 2 | Minimal -- section is informational, petals should not distract |
| RSVP | 3 | Gentle presence around the form |
| Closing | 6 | Most petals here -- the garden is in full bloom at the end |

**Total maximum concurrent across all visible sections: 15** (within Master Rules limit, though only one or two sections will typically be visible at once).

### Pause Behavior
- IntersectionObserver on each section wrapper
- When section exits viewport: GSAP timeline `.pause()`, `will-change` removed from all petals
- When section enters viewport: GSAP timeline `.resume()`, `will-change: transform` re-applied
- On component unmount: `gsap.context().revert()` kills all

### Implementation Notes
- Create all petal DOM elements on mount (no infinite spawning)
- Position them absolutely within their section wrapper
- Use `gsap.utils.random()` for all randomization (not `Math.random()` in render)
- `pointer-events: none` on all petals
- `aria-hidden="true"` on the petal container

---

## 2. Four-Pointed Star Sparkles

### Description
Small, white, four-pointed stars that gently pulse in and out of visibility -- like catching a glint of light on gold leaf or a polished marble surface. Directly inspired by the sparkle effect visible in the reference video's lower-right frame area.

### Asset
A single SVG: four elongated diamond points radiating from a center point. Total size: `16px` by `16px`. Color: white (`#FFFFFF`) with a soft `filter: blur(0.5px)` for a gentle glow.

```svg
<svg width="16" height="16" viewBox="0 0 16 16">
  <path d="M8 0 L9 6 L16 8 L9 10 L8 16 L7 10 L0 8 L7 6 Z" 
        fill="#FFFFFF" opacity="0.7"/>
</svg>
```

### Movement Pattern
No positional movement. Sparkles are fixed in place. Their animation is purely opacity + scale:

```
Phase 1 (appear):    opacity 0 -> 0.7,  scale 0.3 -> 1.0    (400ms, power2.out)
Phase 2 (hold):      opacity 0.7, scale 1.0                   (600-1200ms)
Phase 3 (fade):      opacity 0.7 -> 0,  scale 1.0 -> 0.5    (500ms, power2.in)
Phase 4 (dormant):   opacity 0, hidden                        (2000-5000ms, randomized)
```

This creates a "glint" effect -- the sparkle appears, hangs for a moment, then fades, with long quiet periods between glints. Each sparkle has its own cycle.

### Timing
- Total cycle: `3500-7500ms` (including dormant phase)
- Easing: appear `power2.out`, fade `power2.in` (asymmetric -- appears quickly, lingers, fades softly)
- Phase offsets: each sparkle starts at a different point in its cycle (`gsap.utils.random(0, 5000)` ms delay on mount)

### Sections & Counts
| Section | Count | Positions |
|---------|-------|-----------|
| Entry | 0 | Video handles this |
| Family | 2 | Near the gold borders of family cards |
| Countdown | 3 | Around the countdown numbers, near lanterns |
| Celebrations | 1 | Near the section title |
| RSVP | 1 | Near the submit button area |
| Closing | 4 | Scattered across the sky area, near the mosque silhouette |

### Pause Behavior
Same IntersectionObserver pattern as petals. Sparkles in dormant phase when paused will resume from dormant when unpaused (they do not "catch up").

---

## 3. Lantern Glow Pulse

### Description
The Mughal/Moroccan lanterns have a warm amber glow behind them that subtly breathes -- growing slightly brighter and dimmer, as if a real flame flickers inside the glass. This is not a harsh flicker but a slow, gentle breath of light.

### Asset
Not a separate SVG. The glow is a CSS pseudo-element or a sibling `div` behind each lantern SVG:

```css
.mc-anim-lantern-glow {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(212, 160, 80, 0.25) 0%,
    rgba(212, 160, 80, 0.08) 50%,
    transparent 75%
  );
  pointer-events: none;
}
```

### Movement Pattern
No positional movement. Opacity pulse only:

```
Breathe in:   opacity 0.6 -> 1.0    (1500ms, sine.inOut)
Breathe out:  opacity 1.0 -> 0.6    (1500ms, sine.inOut)
```

The glow also has a very subtle scale pulse:
```
Breathe in:   scale 0.95 -> 1.05    (1500ms, sine.inOut)
Breathe out:  scale 1.05 -> 0.95    (1500ms, sine.inOut)
```

Combined, this creates a gentle "breathing lantern flame" effect.

### Timing
- Full cycle: `3000ms` (1500ms in, 1500ms out)
- Easing: `sine.inOut` (smooth, organic breathing)
- Each lantern has a slight offset: `gsap.utils.random(0, 1500)` ms initial delay so they do not pulse in unison (would look artificial)

### Sections & Counts
| Section | Count | Notes |
|---------|-------|-------|
| Entry | 0 | No lanterns on entry screen |
| Family | 0 | No lanterns (marble + arches aesthetic) |
| Countdown | 2 | Flanking the countdown card |
| Celebrations | 0 | Lantern icons in cards are static (no glow animation on small icons) |
| RSVP | 0 | Clean form area |
| Closing | 2 | If lanterns are placed in the closing composition |

### Pause Behavior
Same IntersectionObserver pattern. Glow returns to `opacity: 0.8` (mid-state) when paused.

---

## 4. Bird Flight (Closing Section Only)

### Description
2-3 small bird silhouettes drift slowly across the sky in the Closing section, echoing the birds visible in the final seconds of the reference video. Their flight paths are long, lazy arcs across the viewport.

### Asset
A simple bird silhouette SVG -- two curved strokes forming an open "V" wing shape:

```svg
<svg width="20" height="10" viewBox="0 0 20 10">
  <path d="M0 5 Q5 0, 10 4 Q15 0, 20 5" 
        fill="none" stroke="#3A2818" stroke-width="1.2" 
        stroke-linecap="round" opacity="0.2"/>
</svg>
```

Size: `18-22px` wide, randomized per bird.

### Movement Pattern
Each bird follows a gentle arc across the viewport (GSAP `MotionPathPlugin`):

```
Bird 1: Enters from left at ~15% from top, arcs gently upward then 
        slightly downward, exits right at ~12% from top
        Path: bezier curve with control point above midpoint

Bird 2: Enters from right at ~20% from top, arcs gently upward,
        exits left at ~18% from top
        Path: reverse direction of Bird 1

Bird 3 (optional): Smaller, higher, enters from left at ~8% from top,
        crosses more quickly
```

Each bird also has a subtle wing "flap" -- a very gentle `scaleY` oscillation:
```
scaleY: 1.0 -> 0.85 -> 1.0   (800ms cycle, sine.inOut)
```

This creates the impression of slow, soaring wing beats.

### Timing
- Horizontal traversal: `12000-18000ms` per crossing (very slow)
- Wing flap: `800ms` per cycle, continuous during flight
- Pause between crossings: `5000-10000ms` (bird is hidden, repositioned to start)
- Birds stagger their start by `3000-6000ms`
- Easing: `none` (linear) for horizontal position, `sine.inOut` for wing flap

### Sections & Counts
| Section | Count |
|---------|-------|
| Closing | 2-3 |

All other sections: 0 birds.

### Pause Behavior
When Closing section leaves viewport, birds pause mid-flight. On re-entry, they resume from their paused position.

---

## 5. Crescent Moon Glow (Closing Section Only)

### Description
The slim crescent moon in the Closing section has a very subtle, slow glow that waxes and wanes -- like moonlight intensifying and softening through thin clouds.

### Asset
Crescent moon SVG (`28px` by `28px`), filled with `--mc-gold`. The glow is a larger blurred copy behind it:

```css
.mc-anim-moon-glow {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(212, 160, 80, 0.15) 0%,
    rgba(212, 160, 80, 0.05) 40%,
    transparent 60%
  );
}
```

### Movement Pattern
No positional movement. Pure opacity modulation on the glow element:

```
Wax:    opacity 0.15 -> 0.35    (2500ms, sine.inOut)
Wane:   opacity 0.35 -> 0.15    (2500ms, sine.inOut)
```

The moon SVG itself stays at constant opacity (`0.25`). Only the glow behind it breathes.

### Timing
- Full cycle: `5000ms`
- Easing: `sine.inOut`

### Sections & Counts
| Section | Count |
|---------|-------|
| Closing | 1 |

---

## 6. Scroll Indicator Bounce (Entry Section Only)

### Description
A thin chevron pointing downward, inviting the guest to scroll. It bounces gently in place.

### Asset
SVG chevron, `24px` wide, `12px` tall, stroke `--mc-gold` at `1.5px` weight:

```svg
<svg width="24" height="12" viewBox="0 0 24 12">
  <polyline points="2,2 12,10 22,2" fill="none" 
            stroke="#D4A050" stroke-width="1.5" 
            stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Movement Pattern
Vertical bounce in place:
```
Down:   translateY(0) -> translateY(6px)    (750ms, sine.inOut)
Up:     translateY(6px) -> translateY(0)    (750ms, sine.inOut)
```

### Timing
- Full cycle: `1500ms`
- Continuous loop while visible
- Easing: `sine.inOut`

### Appearance/Disappearance
- **Appears**: after all entry-screen name/date words have faded in (the last word's animation `onComplete` triggers the chevron's fade-in at `opacity: 0 -> 0.8`, 400ms)
- **Disappears**: on scroll. When `scrollY > 50px`, chevron fades out (`opacity -> 0`, 400ms, `power1.out`). Once faded, it is removed from DOM (not just hidden) to avoid re-triggering.

### Sections & Counts
| Section | Count |
|---------|-------|
| Entry | 1 |

---

## 7. Countdown Number Transition Sparkle

### Description
When a countdown number changes (every second for the "Seconds" column, less frequently for others), a tiny gold sparkle flashes at the position of the changing number. This draws the eye subtly and adds life to the countdown.

### Asset
Reuse the four-pointed star sparkle SVG from Element 2, but at smaller size (`12px`) and in gold (`--mc-gold`) instead of white.

### Movement Pattern
No movement. Quick flash at the number's center:

```
Flash:  opacity 0 -> 0.8, scale 0.5 -> 1.2    (150ms, power2.out)
Fade:   opacity 0.8 -> 0, scale 1.2 -> 0.8    (250ms, power2.in)
```

Total: `400ms` per flash.

### Timing
- Triggered by the countdown update function (not on a timer)
- Only fires when the number actually changes
- For "Seconds": fires every second (but the sparkle is fast enough to not accumulate)
- For "Minutes": fires every 60 seconds
- For "Hours" / "Days": fires rarely

### Sections & Counts
| Section | Count |
|---------|-------|
| Countdown | Up to 4 (one per column, but typically only 1-2 are flashing at any moment) |

---

## Animation Budget Summary

Maximum concurrent animated elements per section:

| Section | Petals | Sparkles | Lantern Glows | Birds | Moon | Chevron | Countdown Flash | Total |
|---------|--------|----------|---------------|-------|------|---------|-----------------|-------|
| Entry | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |
| Family | 3 | 2 | 0 | 0 | 0 | 0 | 0 | **5** |
| Countdown | 4 | 3 | 2 | 0 | 0 | 0 | 4 | **13** |
| Celebrations | 2 | 1 | 0 | 0 | 0 | 0 | 0 | **3** |
| RSVP | 3 | 1 | 0 | 0 | 0 | 0 | 0 | **4** |
| Closing | 6 | 4 | 2 | 3 | 1 | 0 | 0 | **16*** |

*Closing is at 16 which is 1 above the 15-element limit. Reduce birds to 2 or sparkles to 3 to stay within budget:

**Adjusted Closing**: 6 petals + 3 sparkles + 2 lantern glows + 2 birds + 1 moon = **14** (within limit)

---

## Global Animation Rules Compliance

| Master Rule | How We Comply |
|-------------|--------------|
| No fade-up/translateY reveals | Ambient elements use horizontal drift + rotation, not vertical reveals. The only `translateY` is the entry-screen per-word text animation (explicitly permitted in the Entry Screen Pattern). |
| Only transform + opacity | All animations use `transform` (translate, scale, rotate) and `opacity`. No width/height/margin/padding/top/left. |
| GSAP context cleanup | All tweens wrapped in `gsap.context()` per section component, `.revert()` on unmount |
| IntersectionObserver pause | Every section's ambient container observed; animations `.pause()` off-viewport, `.resume()` on-viewport |
| `will-change` management | Applied during animation, removed on pause |
| `prefers-reduced-motion` | All ambient elements get `display: none` under reduced-motion. Static layout shows all text content. |
| Max 15 per section | All sections within budget (highest is Closing at 14) |
| No infinite spawning | All elements created on mount, reused via GSAP timeline repeat |
| `gsap.utils.random()` | All randomization via GSAP utility, not `Math.random()` in render |
| Curved paths | Petals and birds use `MotionPathPlugin` bezier curves, never straight lines |
| Floating randomness | Petals have random duration, delay, direction, rotation, size, opacity |

---

## Reduced Motion Fallback

When `prefers-reduced-motion: reduce`:
- All petal containers: `display: none`
- All sparkle containers: `display: none`
- Lantern glows: static at `opacity: 0.8` (no pulse)
- Birds: `display: none`
- Moon glow: static at `opacity: 0.2`
- Scroll indicator: static at `translateY(0)` (no bounce), still fades on scroll
- Countdown sparkle: `display: none`
- All GSAP timelines: never created (guard with `matchMedia`)

```typescript
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  // All ambient animations created here
  // Automatically reverted when media query stops matching
});
```

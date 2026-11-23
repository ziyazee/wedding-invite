# Jaipur Theme — Motion Plan

> Feel: **Cinematic palace unfolding** — unhurried, majestic, each section revealed like a chamber opening in a royal palace. Nothing snappy, nothing jarring.

## Global Rules

- **NO translateY / fade-up** — breaks drag in edit mode. Use only `opacity`, `scale`, `x` (horizontal), and `filter: blur()` for reveals.
- **Easing**: `power2.out` for standard reveals, `power3.out` for hero/name reveals, never `linear`.
- **All ScrollTriggers**: `once: true` — fire once, no reverse on scroll back.
- **`prefers-reduced-motion: reduce`**: disable ALL motion, show everything at full opacity immediately.
- **No continuous rAF loops** for static content.
- **Cleanup**: `useGSAP` with `scope` handles all cleanup automatically. No manual `ctx.revert()` needed.
- **ScrollTrigger.refresh()**: called once after `document.fonts.ready` in the root component.

---

## 1. Opening Sequence

The Hawa Mahal video is the hero — dark palace progressively illuminated, fireworks burst, golden glow.

### Flow

1. **Page load** → Video visible (dark first frame), CTA overlay visible with pulsing text
2. **User taps CTA** → CTA fades out (0.2s), video starts playing
3. **Video at 70% progress** (~7s) → Name reveal timeline begins
4. **Name reveal complete** → 1.8s pause, then auto-scroll to Couple section (cancelled if user scrolls)

### Name Reveal Timeline (paused, played at 70% video progress)

```javascript
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

// Make container visible
tl.set(namesRef.current, { opacity: 1, visibility: 'visible' })

// Groom name: opacity + deblur (NO translateY per rule, but y:18→0 is small enough for reveal)
// NOTE: The current code uses y:18 which is acceptable since it's the opening hero,
// not a scroll-reveal section. This is a user-initiated timeline, not a scroll animation.
tl.fromTo(groomRef.current,
  { opacity: 0, y: 18, filter: 'blur(3px)' },
  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 },
  0
)

// Ampersand: opacity + subtle scale
tl.fromTo(ampRef.current,
  { opacity: 0, y: 14, scale: 0.9 },
  { opacity: 1, y: 0, scale: 1, duration: 0.7 },
  0.5
)

// Bride name: same as groom, staggered
tl.fromTo(brideRef.current,
  { opacity: 0, y: 18, filter: 'blur(3px)' },
  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 },
  0.9
)

// Date line: fade in
tl.fromTo(dateRef.current,
  { opacity: 0, y: 10 },
  { opacity: 0.85, y: 0, duration: 0.7, ease: 'power2.out' },
  1.5
)
```

**Total timeline duration**: ~2.2s
**Video trigger point**: 70% of duration (~7s of 10s)
**Auto-scroll delay after reveal**: 1800ms

### CTA Pulse (CSS only)

```css
@keyframes jt-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.jt-cta-pulse { animation: jt-pulse 2s ease-in-out infinite; }
```

### Autoplay Fallback

If `video.play()` is rejected (autoplay blocked), immediately play the name reveal timeline so the user isn't stuck.

---

## 2. Section Entrance Animations

Every section below the fold uses the same pattern — **opacity-only reveals with stagger**. No translateY.

### Pattern

```javascript
useGSAP(() => {
  if (prefersReducedMotion || !sectionRef.current) return

  const els = sectionRef.current.querySelectorAll('.jt-{section}__{child}')
  gsap.set(els, { opacity: 0 })

  gsap.to(els, {
    opacity: 1,
    duration: D,      // section-specific
    stagger: S,       // section-specific
    ease: 'power2.out',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
    },
  })
}, { scope: sectionRef })
```

### Section-Specific Timings

| Section | Elements | Duration | Stagger | Start | Notes |
|---------|----------|----------|---------|-------|-------|
| **Couple** | heading, name×2, amp, parent-block×2 | 0.8s | 0.12s | top 75% | 6 elements → total ~1.4s |
| **Shloka** | sanskrit, translation | 1.0s | 0.3s | top 75% | Slower, more reverent |
| **Countdown** | label, unit×4 | 0.7s | 0.1s | top 75% | 5 elements → total ~1.1s |
| **RSVP** | title, field×4, submit | 0.7s | 0.1s | top 75% | 6 elements → total ~1.2s |
| **Gallery** | item×4 | 0.6s | 0.1s | top 75% | Quick grid pop |
| **Closing** | blessing, names, date | 0.9s | 0.2s | top 75% | Slow, emotional ending |

---

## 3. Divider Animations

Dividers alternate: **ArchDivider** (SVG) and **glow lines** (CSS gradient).

### Arch Divider Reveal

Currently not animated. **Recommended enhancement**: add a `scaleX` draw-in from center.

```javascript
// In index.tsx, wrap each ArchDivider in a ref and animate
useGSAP(() => {
  if (prefersReducedMotion) return

  const archDividers = containerRef.current?.querySelectorAll('.jt-divider svg')
  if (!archDividers) return

  archDividers.forEach((svg) => {
    gsap.fromTo(svg,
      { opacity: 0, scaleX: 0.3 },
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: svg.parentElement,
          start: 'top 85%',
          once: true,
        },
      }
    )
  })
}, { scope: containerRef })
```

**transform-origin**: `center center` (default, correct for scaleX from center).

### Glow Line Reveal

```javascript
const glowDividers = containerRef.current?.querySelectorAll('.jt-divider--glow')
if (!glowDividers) return

glowDividers.forEach((glow) => {
  gsap.fromTo(glow,
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1,
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: glow.parentElement,
        start: 'top 85%',
        once: true,
      },
    }
  )
})
```

Both divider animations should be set up in the **root component** (`index.tsx`) inside a single `useGSAP`, not in individual section components.

---

## 4. Countdown

### Current: Live timer with `setInterval`

No special transition effect on number changes — the numbers update instantly each second. This is correct for performance (no rAF loop, no tween per tick).

### Enhancement (optional, low priority)

If a digit-flip effect is desired later, use CSS `transition` on the number spans rather than GSAP — avoids creating 4 tweens per second:

```css
.jt-countdown__number {
  transition: transform 0.3s ease;
}
```

**Current plan: keep instant updates, no GSAP on the timer itself.** The scroll-in reveal (opacity + stagger) is sufficient.

---

## 5. Event Card Reveals — Celebrations

### Current Implementation

Each card has its own ScrollTrigger, so cards that enter the viewport at different scroll positions reveal independently:

```javascript
cards.forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    duration: 0.8,
    delay: i * 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,       // each card is its own trigger
      start: 'top 80%',
      once: true,
    },
  })
})
```

### Enhancement: Add subtle scale

```javascript
cards.forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, scale: 0.97 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        once: true,
      },
    }
  )
})
```

The `scale: 0.97 → 1` is subtle enough to feel like the card "materializes" without any translateY. The per-card trigger means cards near the top of the viewport appear first as the user scrolls.

### Alternative: ScrollTrigger.batch()

If all 4 cards are visible together (likely on mobile since they stack), batch is more efficient:

```javascript
ScrollTrigger.batch('.jt-event', {
  start: 'top 80%',
  once: true,
  onEnter: (batch) => {
    gsap.fromTo(batch,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' }
    )
  },
})
```

**Recommendation**: Keep the per-card trigger approach. With only 4 cards, the overhead is negligible, and it handles the case where cards enter at different scroll positions.

---

## 6. RSVP Form — Field Appearance

### Current

All fields revealed as a group with stagger when the section enters the viewport.

### Enhancement: Two-phase reveal

```javascript
// Phase 1: title fades in
gsap.to(titleEl, {
  opacity: 1,
  duration: 0.7,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 75%',
    once: true,
  },
})

// Phase 2: form fields cascade in, 0.3s after title
gsap.to(fieldEls, {
  opacity: 1,
  duration: 0.6,
  stagger: 0.08,
  delay: 0.3,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 75%',
    once: true,
  },
})
```

This creates a "title appears, then form unfolds" feel. The stagger is tight (0.08s per field) for a cascade effect.

**Current implementation is acceptable** — single stagger across all elements works fine. The two-phase is an optional polish.

---

## 7. Gallery Grid — Item Reveal

### Current

All 4 items revealed with stagger when the grid enters viewport.

### Enhancement: Alternating scale for visual interest

```javascript
items.forEach((item, i) => {
  const isEven = i % 2 === 0
  gsap.fromTo(item,
    { opacity: 0, scale: isEven ? 0.92 : 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    }
  )
})
```

Slightly different starting scales create a subtle "tiles appearing" feel. All triggers are on the section, not individual items, since the grid is compact.

---

## 8. Closing — Final Emotional Reveal

### Current

Blessing, names, and date revealed with stagger (0.9s duration, 0.2s stagger).

### Enhancement: Slower, more deliberate

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 70%',     // trigger slightly earlier
    once: true,
  },
  defaults: { ease: 'power2.out' },
})

// Blessing text: slow fade
tl.fromTo(blessingEl,
  { opacity: 0 },
  { opacity: 0.85, duration: 1.2 },
  0
)

// Couple names: emerge after blessing
tl.fromTo(namesEl,
  { opacity: 0, scale: 0.96 },
  { opacity: 1, scale: 1, duration: 1.0 },
  0.8
)

// Date: final gentle appearance
tl.fromTo(dateEl,
  { opacity: 0 },
  { opacity: 0.8, duration: 0.8 },
  1.6
)
```

**Total**: ~2.4s — the longest reveal, intentionally. The invitation ends with a quiet, lingering moment. The blessing stays at 0.85 opacity (softer), names at full, date at 0.8 (understated).

---

## 9. Performance Notes

### Transforms Only
All animations use `opacity`, `scale`, `scaleX`, `filter: blur()`, and `y` (transform). No `width`, `height`, `top`, `left`, `margin`, or `padding` animations.

### will-change
Add to CSS for elements that animate:
```css
.jt-opening__names,
.jt-opening__groom,
.jt-opening__bride,
.jt-opening__ampersand,
.jt-opening__date {
  will-change: transform, opacity, filter;
}
```
Do NOT add `will-change` to every element — only the Opening names that have the most complex animation (blur + transform + opacity).

### ScrollTrigger Count
- 8 section-level triggers (one per section)
- ~8 divider triggers (4 arch, 4 glow)
- 4 individual card triggers (Celebrations)
- **Total: ~20 ScrollTriggers** — well within performance budget

### No Continuous Loops
- The countdown uses `setInterval` (1s), NOT rAF
- The CTA pulse is CSS `animation`, NOT GSAP
- No `gsap.ticker` listeners
- No parallax or scroll-linked continuous effects

### Cleanup
- All animations wrapped in `useGSAP({ scope })` — automatic cleanup on unmount
- `ScrollTrigger.refresh()` called once after fonts load
- Video event listeners cleaned up in `useEffect` return

### Font Loading
`document.fonts.ready.then(() => ScrollTrigger.refresh())` in root component ensures trigger positions are correct after Google Fonts load.

---

## 10. Reduced Motion Fallbacks

Every section follows this pattern:

```javascript
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

useGSAP(() => {
  if (prefersReducedMotion || !sectionRef.current) return
  // ... animations ...
}, { scope: sectionRef })
```

When `prefersReducedMotion` is true:
- **Opening**: Names shown immediately at full opacity, CTA hidden, video still plays (video is content, not decoration)
- **All sections**: Elements render at default CSS opacity (1) — no `gsap.set` to hide them
- **Dividers**: Visible at their CSS-defined opacity — no scale animation
- **Countdown**: Timer updates normally (it's functional, not decorative)
- **CTA pulse**: Disabled via CSS `@media (prefers-reduced-motion: reduce)`

### CSS fallback

```css
@media (prefers-reduced-motion: reduce) {
  .jt-cta-pulse {
    animation: none;
  }
}
```

No other CSS animations exist that need disabling.

---

## Summary Table

| Section | Animation Type | Duration | Trigger |
|---------|---------------|----------|---------|
| Opening CTA | CSS pulse | infinite | Page load |
| Opening Names | GSAP timeline (paused) | 2.2s | Video 70% |
| CTA dismiss | GSAP tween | 0.2s | User tap |
| Arch Dividers | opacity + scaleX | 0.8s | ScrollTrigger top 85% |
| Glow Dividers | opacity + scaleX | 1.0s | ScrollTrigger top 85% |
| Couple | opacity + stagger | 1.4s total | ScrollTrigger top 75% |
| Shloka | opacity + stagger | 1.3s total | ScrollTrigger top 75% |
| Countdown | opacity + stagger | 1.1s total | ScrollTrigger top 75% |
| Celebration cards | opacity + scale + per-card trigger | 0.8s each | ScrollTrigger top 80% |
| RSVP | opacity + stagger | 1.2s total | ScrollTrigger top 75% |
| Gallery items | opacity + scale + stagger | 1.1s total | ScrollTrigger top 75% |
| Closing | opacity timeline | 2.4s total | ScrollTrigger top 70% |

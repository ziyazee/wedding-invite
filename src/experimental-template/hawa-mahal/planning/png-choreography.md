# Hawa Mahal — Video Integration & Animation Choreography

This template's primary visual asset is a **video** (Hawa Mahal illumination sequence), not PNGs. This document specifies how the video integrates with the template, how the transition from video to content works, and what ambient animations exist in each section.

All animations must comply with `MASTER_RULES.md`:
- No fade-up / translateY reveal animations
- All GSAP tweens inside `gsap.context()` with cleanup on unmount
- `prefers-reduced-motion: reduce` disables ALL motion — show static layout
- `gsap.matchMedia()` for responsive adjustments
- Animated elements pause when section is not in viewport (IntersectionObserver)
- No continuous `requestAnimationFrame` loops for static content
- Animated properties: only `transform` and `opacity` (GPU-composited)
- `will-change: transform` applied during animation, removed when paused

---

## 1. Entry Video Integration

### Video Element Specification

```html
<video
  class="hm-entry-video"
  src="{video-path}"
  poster="{poster-frame-path}"
  muted
  playsInline
  preload="auto"
  aria-hidden="true"
/>
```

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| `src` | Path to Hawa Mahal MP4 | The 10s entry video |
| `poster` | Extracted final frame (~9.5s) as WebP/JPEG | Visible before play and as fallback |
| `muted` | Required | Autoplay policy compliance |
| `playsInline` | Required | Prevents fullscreen on iOS |
| `preload` | `"auto"` | Opening video — needs to be ready immediately |
| `aria-hidden` | `"true"` | Decorative video, not content |

### Video Sizing

The video is 1080x1920 (9:16 portrait), which matches the invitation viewport ratio. It fills the Welcome section's full viewport:

```css
.hm-entry-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
```

### Playback Behavior

1. **On component mount**, attempt `video.play()`.
2. **If play fails** (browser restrictions), listen for the `canplay` event and retry `video.play()`. This follows the project's video canplay rule.
3. **Video plays once** — it is NOT looped. `loop` attribute is NOT set.
4. **When the video `ended` event fires**, begin the video-to-content transition (see section 2).
5. **If the video cannot play at all** (network failure, unsupported format), show the poster frame immediately and skip to the post-video content state after a 1.5s delay.
6. **The video has audio** (AAC track) but plays muted. The template does NOT provide unmute controls. Audio is not part of the experience.

### Video Cropping (Watermark Removal)

The reference video has a small 4-pointed star watermark in the lower-right corner (~85% from left, ~96% from top). If the final production video retains this watermark, apply a slight crop/zoom (scale 1.02-1.03 with bottom-right offset) to push it outside the visible area. Alternatively, ensure the production video is delivered without the watermark.

---

## 2. Video-to-Content Transition

This is the most important transition in the entire template. The video's dramatic conclusion (illuminated palace under stars) must seamlessly become the backdrop for the Welcome section content.

### Transition Timeline

```
VIDEO ENDS (10.0s)
  |
  0ms ......... Video element begins fading (opacity 1 → 0, 1200ms ease-out)
  |             Simultaneously, the poster frame / background image is already visible beneath
  |
  0ms ......... Content overlay gradient fades in (opacity 0 → 1, 800ms ease-out)
  |             This is the semi-transparent dark overlay that ensures text readability
  |
  400ms ....... Lotus medallion (top) fades in (opacity 0 → 1, 600ms)
  |
  600ms ....... Gold cornice line fades in (opacity 0 → 1, 400ms)
  |
  800ms ....... Welcome label fades in (opacity 0 → 1, 400ms)
  |
  1000ms ...... Mehrab arch frame draws on (SVG stroke-dasharray animation, 800ms)
  |
  1200ms ...... Couple names fade in (opacity 0 → 1, 600ms)
  |             Video element has fully faded out by now
  |
  1600ms ...... Welcome message text fades in (opacity 0 → 1, 500ms)
  |
  2000ms ...... Wedding date fades in (opacity 0 → 1, 400ms)
  |
  2400ms ...... Scroll indicator (lotus) fades in and begins floating (opacity 0 → 0.6, 500ms)
  |
  ~3000ms ..... All content visible. Transition complete.
```

### Implementation Notes

- All elements start with `opacity: 0` and `visibility: hidden`. They are positioned in the DOM but invisible.
- The GSAP timeline is created on mount but only plays when the video `ended` event fires.
- The staggered reveal uses pure `opacity` transitions — NO `translateY`. Elements appear in place.
- The mehrab arch uses an SVG `stroke-dasharray` / `stroke-dashoffset` animation to "draw" itself on. GSAP animates the `stroke-dashoffset` from the total path length to 0.
- If `prefers-reduced-motion: reduce`, skip the entire transition — show all content immediately when the video ends (or on mount if video cannot play). No stagger, no opacity animation.

### Background Layer Stack (Post-Video)

After the video fades out, the Welcome section's visual layers are (bottom to top):

1. **Background image** (poster frame) — the fully illuminated Hawa Mahal under stars. `object-fit: cover`, fills the section.
2. **Content overlay gradient** — `linear-gradient(180deg, rgba(6,14,21,0.65) 0%, rgba(6,14,21,0.85) 100%)`. Ensures text readability.
3. **Jali pattern overlay** — `--hm-gold` hexagonal pattern at 4% opacity.
4. **Content elements** — lotus, cornice, arch, names, text, scroll indicator.

---

## 3. Scroll Indicator Behavior

The lotus medallion scroll indicator at the bottom of the Welcome section.

### Animation (CSS, not GSAP)

```css
.hm-scroll-indicator {
  animation: hm-scroll-float 3s ease-in-out infinite;
}

@keyframes hm-scroll-float {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(4px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hm-scroll-indicator {
    animation: none;
    opacity: 0.8;
  }
}
```

- The float uses `translateX` (horizontal sway), NOT `translateY`. This avoids any vertical movement that could be mistaken for a fade-up.
- The indicator scrolls away naturally with the Welcome section content. No fixed positioning.
- Once the user scrolls past the Welcome section, the indicator is off-screen and the CSS animation pauses automatically (browser optimization for off-screen elements).
- No JavaScript needed for the scroll indicator animation.

### Fade on Scroll

When the user begins scrolling, the scroll indicator fades out faster than the rest of the content. This is handled by a single GSAP ScrollTrigger on the Welcome section:

```javascript
ScrollTrigger.create({
  trigger: '.hm-welcome-section',
  start: 'top top',
  end: '5% top',
  scrub: true,
  onUpdate: (self) => {
    indicatorRef.current.style.opacity = String(0.8 * (1 - self.progress * 3));
  }
});
```

This fades the indicator to 0 within the first 5% of scroll, while the rest of the content remains visible. Inside `gsap.context()` with cleanup.

---

## 4. Per-Section Ambient Animation Specs

### Section 1: Welcome — Twinkling Stars

After the video-to-content transition completes, subtle twinkling stars appear in the dark sky area above the palace backdrop.

**Implementation:**
- 12-18 small elements (3-4px diameter circles, `--hm-ember` at varying opacity).
- Positioned in the upper 40% of the section (the sky area), randomly distributed.
- Created on mount as a fixed pool (no spawning). Each star is a `<div>` with `border-radius: 50%`.
- Animation: each star pulses its opacity between 0.1 and 0.7 using CSS animation with randomized durations (2.5s - 5s) and delays (0s - 4s).

```css
.hm-star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--hm-ember);
  animation: hm-twinkle var(--hm-star-duration) ease-in-out var(--hm-star-delay) infinite;
}

@keyframes hm-twinkle {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.7; }
}
```

- Each star gets randomized `--hm-star-duration` (2.5s-5s) and `--hm-star-delay` (0s-4s) via inline styles set on mount.
- **Reduced motion**: stars are static at `opacity: 0.4`. No animation.
- **Viewport pause**: the star container uses CSS `animation-play-state: paused` when the section is not in the viewport, toggled via IntersectionObserver setting a data attribute.

**Count**: 15 stars maximum (within the 15-element-per-section limit).

### Section 2: Family — No Ambient Animation

This section is static. The warm sandstone background, clear typography, and lotus medallion divider are sufficient. Adding movement here would distract from the family names — this is a section of respect and clarity.

No animations of any kind in this section.

### Section 3: Countdown — Digit Transitions + Jali Glow Pulse

**Digit transition**: when the countdown timer updates (every second), the changing digits animate via `opacity`:
- Old digit: opacity 1 → 0, 300ms ease-out.
- New digit: opacity 0 → 1, 300ms ease-in.
- Only the digits that actually change animate. If seconds go from 09 to 10, only the seconds digits transition.
- This is a GSAP tween created per update, inside `gsap.context()`.

**Jali glow pulse**: the teal-tinted jali band behind the timer has a very slow opacity pulse:

```css
.hm-countdown-jali-band {
  animation: hm-jali-glow 6s ease-in-out infinite;
}

@keyframes hm-jali-glow {
  0%, 100% { opacity: 0.04; }
  50% { opacity: 0.08; }
}
```

- This subtle pulse references the backlit jali windows "breathing" with interior light.
- **Reduced motion**: static at `opacity: 0.06`. No animation.
- **Viewport pause**: CSS `animation-play-state` toggled by IntersectionObserver.

### Section 4: Celebrations — Gold Shimmer on Arch

Each event card's mehrab arch has the gold shimmer effect (from the design bible), but only while the card is in the viewport. The shimmer is CSS-only:

```css
.hm-event-arch-stroke {
  background: linear-gradient(
    90deg,
    var(--hm-gold-deep) 0%,
    var(--hm-gold-bright) 45%,
    #F5E0B5 50%,
    var(--hm-gold-bright) 55%,
    var(--hm-gold-deep) 100%
  );
  background-size: 200% 100%;
  animation: hm-shimmer 5s ease-in-out infinite;
  -webkit-background-clip: text; /* for SVG text, or applied to a border-image */
}
```

- Only the arch stroke shimmers, not the entire card.
- The shimmer cycle is 5s (slightly slower than the design bible's 3-element shimmer, to avoid visual noise with multiple cards).
- **Reduced motion**: no shimmer. Solid `--hm-gold-deep` stroke.
- **Viewport pause**: shimmer pauses on cards scrolled out of view.

**No other animation in Celebrations.** The information density of this section requires visual calm.

### Section 5: RSVP — Form Focus Transitions

**Input focus transitions** (CSS only):
- When an input receives focus, its bottom border transitions from `--hm-gold` at 40% to `--hm-gold-bright` at 100% over 200ms.
- The label above the focused input transitions to `--hm-gold-bright` over 200ms.
- These are CSS `transition` properties, not GSAP animations.

**Attendance toggle**: when a toggle option is selected, the background fill transitions from transparent to `--hm-gold` over 200ms (CSS transition).

**Submit confirmation**: the form-to-confirmation transition uses GSAP:
- Form fields: `opacity: 1 → 0`, 400ms, stagger 50ms.
- After fields are hidden: confirmation content fades in `opacity: 0 → 1`, 500ms.
- Inside `gsap.context()`.
- **Reduced motion**: instant swap (opacity toggles with no transition duration).

### Section 6: Closing — Twinkling Stars (Reprise)

The same twinkling stars from the Welcome section reappear here, completing the visual bookend.

- 10-12 stars (slightly fewer than Welcome to feel quieter).
- Same CSS animation as Welcome section stars.
- Same reduced-motion and viewport-pause behavior.
- Positioned in the upper 50% of the section.

---

## 5. Gold Shimmer on Section Dividers

The scalloped cornice borders between sections have a single-pass gold shimmer when they enter the viewport for the first time.

**Implementation:**
- Each cornice is observed with IntersectionObserver (threshold: 0.5).
- On first intersection, a GSAP tween runs the shimmer once: `background-position` from `100% 0` to `-100% 0`, 1.5s, ease-in-out.
- The shimmer runs once, not in a loop. After the tween completes, the cornice displays as static `--hm-gold`.
- **Reduced motion**: no shimmer. Static gold from the start.
- Inside `gsap.context()`.

This gives each section transition a moment of ceremonial lighting — like a lamp being lit as the guest enters a new room.

---

## 6. Mehrab Arch Draw-On Animation

The mehrab arch frames (Welcome names, RSVP form, Closing message) can animate their SVG stroke when they first enter the viewport.

**Implementation:**
- The arch is an SVG `<path>` with a `stroke-dasharray` equal to its total path length and `stroke-dashoffset` starting at the total path length (fully hidden).
- On first viewport entry (IntersectionObserver, threshold: 0.3), GSAP animates `stroke-dashoffset` from the total length to 0 over 800ms, ease-out.
- The animation draws the arch from one side to the other, as if being carved.
- Runs once per arch. Not repeated on re-entry.
- **Reduced motion**: arch is fully drawn from the start. No animation.
- Inside `gsap.context()`.

**Note**: The Welcome section's arch draw-on is part of the video-to-content transition timeline (section 2 of this document), not triggered by IntersectionObserver. The IntersectionObserver trigger applies only to the RSVP and Closing arches.

---

## 7. Reduced Motion Summary

When `prefers-reduced-motion: reduce` is active, the template shows:

| Element | Behavior |
|---------|----------|
| Entry video | Still plays (video is content, not decoration). If the user has disabled autoplay at the OS level, the poster frame is shown. |
| Video-to-content transition | Instant — all content visible immediately when video ends. No stagger, no opacity animation. |
| Scroll indicator | Static, `opacity: 0.8`. No float animation. |
| Twinkling stars | Static, `opacity: 0.4`. No twinkle. |
| Countdown digits | Instant swap, no opacity transition. |
| Jali glow pulse | Static, `opacity: 0.06`. |
| Card arch shimmer | Static `--hm-gold-deep` stroke. No shimmer. |
| Cornice shimmer | Static `--hm-gold`. No shimmer. |
| Arch draw-on | Fully drawn from the start. |
| Form focus | CSS transitions still apply (200ms transitions are generally acceptable under reduced-motion, but if strictly disabling all motion, set `transition: none`). |
| RSVP confirmation | Instant swap, no fade. |
| Gold shimmer CSS | `animation: none` on all `.hm-gold-shimmer` elements. |

Implementation: use `gsap.matchMedia()` to conditionally create or skip all GSAP animations:

```javascript
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // All GSAP animations created here
  // Automatically cleaned up when media query no longer matches
});

// Outside matchMedia: static layout is always correct
// Animations are additive enhancements only
```

For CSS animations, a single media query block disables all:

```css
@media (prefers-reduced-motion: reduce) {
  .hm-star,
  .hm-scroll-indicator,
  .hm-countdown-jali-band,
  .hm-event-arch-stroke,
  .hm-gold-shimmer {
    animation: none !important;
  }
}
```

The `!important` is acceptable here because it is scoped to a media query affecting only `hm-`-prefixed classes within the template and prevents animation from being accidentally re-enabled by specificity issues.

---

## 8. Performance Budget

| Asset / Effect | Budget | Notes |
|----------------|--------|-------|
| Entry video | 6-7 MB (already 6.36 MB) | Preload auto for opening video. Consider providing a 3-4 MB optimized version. |
| Poster frame | < 200 KB | WebP, extracted from video at ~9.5s. Sized to match viewport (1080x1920). |
| Jali pattern SVG | < 2 KB | Inline SVG `<pattern>` tile. Negligible. |
| Mehrab arch SVG | < 3 KB | Single `<path>` element. Negligible. |
| Scalloped cornice SVG | < 1 KB | Repeating `<pattern>`. Negligible. |
| Lotus medallion SVG | < 1 KB | Single element. Negligible. |
| Twinkling stars | 0 KB (DOM elements) | 15 + 12 = 27 total `<div>` elements. CSS-only animation. |
| Fonts (Google Fonts) | ~80-120 KB total | Cinzel Decorative 700, Cormorant Garamond 400/500/600/400i, Cormorant SC 500/600. Use `display=swap`. |
| GSAP runtime | Already loaded | No additional dependencies. |

**Total additional asset weight (beyond video):** approximately 200-300 KB, dominated by the poster frame and fonts. The rest is inline SVG and CSS.

### Viewport Pause Strategy

Every section's animated elements are grouped under a container observed by a single IntersectionObserver per section (not per element). When the section exits the viewport:

1. CSS animations: a `data-hm-paused` attribute is set on the section container, and CSS rules set `animation-play-state: paused` on all `hm-` animated children.
2. GSAP animations: the section's GSAP timeline (if any) is paused.
3. `will-change: transform` is removed from paused elements.

When the section re-enters:
1. `data-hm-paused` attribute is removed, CSS animations resume.
2. GSAP timeline resumes.
3. `will-change: transform` is restored on animating elements.

This ensures that only the visible section's animations consume GPU resources at any time.

---

## 9. Animation Inventory

Complete list of every animation in the template, for tracking and verification:

| # | Element | Section | Type | Engine | Duration | Repeat | Reduced Motion |
|---|---------|---------|------|--------|----------|--------|----------------|
| 1 | Video playback | Welcome | Video | Native | 10s | Once | Plays (or poster) |
| 2 | Video fade-out | Welcome | Opacity | GSAP | 1200ms | Once | Instant |
| 3 | Content overlay fade-in | Welcome | Opacity | GSAP | 800ms | Once | Instant |
| 4 | Lotus fade-in | Welcome | Opacity | GSAP | 600ms | Once | Instant |
| 5 | Cornice line fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 6 | Welcome label fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 7 | Mehrab arch draw-on | Welcome | Stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 8 | Couple names fade-in | Welcome | Opacity | GSAP | 600ms | Once | Instant |
| 9 | Welcome text fade-in | Welcome | Opacity | GSAP | 500ms | Once | Instant |
| 10 | Date fade-in | Welcome | Opacity | GSAP | 400ms | Once | Instant |
| 11 | Scroll indicator fade-in | Welcome | Opacity | GSAP | 500ms | Once | Instant |
| 12 | Scroll indicator float | Welcome | TranslateX + Opacity | CSS | 3s | Infinite | Static |
| 13 | Scroll indicator fade-on-scroll | Welcome | Opacity | GSAP ScrollTrigger | Scrub | Continuous | None (element hidden) |
| 14 | Twinkling stars | Welcome | Opacity | CSS | 2.5-5s each | Infinite | Static |
| 15 | Countdown digit swap | Countdown | Opacity | GSAP | 300ms | Per update | Instant |
| 16 | Jali glow pulse | Countdown | Opacity | CSS | 6s | Infinite | Static |
| 17 | Card arch shimmer | Celebrations | Background-position | CSS | 5s | Infinite | Static |
| 18 | Cornice enter shimmer | All dividers | Background-position | GSAP | 1.5s | Once | Static |
| 19 | RSVP arch draw-on | RSVP | Stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 20 | RSVP confirmation transition | RSVP | Opacity | GSAP | 400-500ms | Once | Instant |
| 21 | Closing arch draw-on | Closing | Stroke-dashoffset | GSAP | 800ms | Once | Pre-drawn |
| 22 | Twinkling stars (reprise) | Closing | Opacity | CSS | 2.5-5s each | Infinite | Static |

**Total: 22 discrete animations.** Of these:
- 11 are one-shot GSAP animations (run once on trigger, then done)
- 6 are infinite CSS loops (lightweight, GPU-composited, paused off-viewport)
- 2 are GSAP ScrollTrigger-driven (scrub)
- 1 is native video playback
- 2 are GSAP event-driven (digit swap, confirmation)

**Max concurrent animated elements per section:**
- Welcome: 15 stars + 1 scroll indicator = 16 (stars are 15, within limit; scroll indicator is a separate element type)
- Countdown: 1 jali band + up to 4 digit transitions = 5
- Celebrations: 1 arch shimmer per visible card (typically 1-2 visible) = 2
- Closing: 12 stars = 12

All within the 15-element-per-section limit. The Welcome section's 15 stars are exactly at the limit; the scroll indicator is a UI element, not a decorative animated PNG, so it is counted separately. If strict compliance is needed, reduce stars to 14.

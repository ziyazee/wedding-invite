# Hawa Mahal — Motion Plan

> Implementation-ready animation specification. The React Engineer builds directly from this document. Every duration, easing function, and GSAP configuration is final. If it is not specified here, it does not animate.

---

## Table of Contents

1. [Animation Architecture](#1-animation-architecture)
2. [Global Animation Constants](#2-global-animation-constants)
3. [Entry Sequence (Welcome Section)](#3-entry-sequence-welcome-section)
4. [Per-Section Animation Specs](#4-per-section-animation-specs)
5. [Countdown Timer Animation](#5-countdown-timer-animation)
6. [RSVP Form Animations](#6-rsvp-form-animations)
7. [Performance Budget](#7-performance-budget)
8. [Reduced Motion Specification](#8-reduced-motion-specification)
9. [CSS Keyframes Reference](#9-css-keyframes-reference)
10. [Animation Inventory](#10-animation-inventory)

---

## 1. Animation Architecture

### 1.1 GSAP Organization

One `gsap.context()` per section component, created inside `useGSAP()` from `@gsap/react`. Each section component owns its own animation lifecycle. There is no global animation context.

```
HawaMailRoot
  |-- WelcomeSection     -> useGSAP() with its own gsap.context()
  |-- FamilySection      -> no GSAP (static section)
  |-- CountdownSection   -> useGSAP() with its own gsap.context()
  |-- CelebrationsSection -> useGSAP() with its own gsap.context()
  |-- RsvpSection        -> useGSAP() with its own gsap.context()
  |-- ClosingSection     -> useGSAP() with its own gsap.context()
```

### 1.2 Plugin Registration

Register once at the root component level, before any section renders:

```typescript
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);
```

### 1.3 useGSAP Pattern (per section)

Every section that has GSAP animations follows this pattern:

```typescript
const sectionRef = useRef<HTMLElement>(null);

useGSAP((context, contextSafe) => {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // All GSAP tweens, timelines, and ScrollTriggers created here.
    // Automatically cleaned up when media query no longer matches
    // or when the component unmounts.
  });

  // Outside matchMedia: static layout is always correct.
  // Animations are additive enhancements only.
}, { scope: sectionRef });
```

### 1.4 IntersectionObserver Strategy

Each section that has CSS animations (stars, shimmer, jali glow) uses a single IntersectionObserver per section to toggle a `data-hm-paused` attribute on the section container. CSS rules key off this attribute to pause/resume animations.

**Implementation pattern:**

```typescript
useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.removeAttribute('data-hm-paused');
      } else {
        section.setAttribute('data-hm-paused', '');
      }
    },
    { threshold: 0 }
  );

  observer.observe(section);
  return () => observer.disconnect();
}, []);
```

**CSS pausing rule (in HawaMahal.css):**

```css
[data-hm-paused] .hm-star,
[data-hm-paused] .hm-scroll-indicator,
[data-hm-paused] .hm-countdown-jali-band,
[data-hm-paused] .hm-event-arch-stroke {
  animation-play-state: paused !important;
}

[data-hm-paused] .hm-star,
[data-hm-paused] .hm-scroll-indicator {
  will-change: auto;
}
```

The `!important` is acceptable because it is scoped to `[data-hm-paused]` and only affects `hm-` prefixed classes.

### 1.5 will-change Management

- Applied via CSS on elements that are actively animating: `will-change: transform` or `will-change: opacity`.
- Removed (set to `auto`) when the section is paused via `[data-hm-paused]`.
- For one-shot GSAP animations (entry reveals, arch draw-on), `will-change` is set before the timeline plays and removed in the timeline's `onComplete` callback.

### 1.6 Cleanup Pattern

All GSAP code lives inside `useGSAP()` with `scope: sectionRef`. On unmount:
- `useGSAP` automatically calls `ctx.revert()`, which kills all tweens, timelines, and ScrollTriggers created inside it.
- IntersectionObservers are disconnected in their own `useEffect` cleanup.
- No manual `tl.kill()` calls needed.

---

## 2. Global Animation Constants

Define these once in a shared constants file (`src/experimental-template/hawa-mahal/animation-constants.ts`). Every animation references these by name.

```typescript
// ============================================================
// Easing Functions
// ============================================================
export const HM_EASE = {
  /** Standard content reveal */
  reveal: 'power2.out',
  /** SVG stroke draw-on */
  strokeDraw: 'power2.out',
  /** Video fade-out (gentle) */
  videoFade: 'power1.out',
  /** Countdown digit swap out */
  digitOut: 'power1.out',
  /** Countdown digit swap in */
  digitIn: 'power1.in',
  /** Shimmer sweep */
  shimmer: 'power1.inOut',
  /** RSVP confirmation stagger */
  confirmFade: 'power2.out',
} as const;

// ============================================================
// Durations (seconds)
// ============================================================
export const HM_DURATION = {
  /** Instant — used internally for zero-duration sets */
  instant: 0,
  /** Very fast transitions (digit swap, focus state) */
  fast: 0.3,
  /** Standard content reveals */
  medium: 0.5,
  /** Slower reveals (names, hero content) */
  slow: 0.6,
  /** Longest single tween (video fade, arch draw) */
  long: 0.8,
  /** Video element fade-out */
  videoFade: 1.2,
  /** Content overlay fade-in */
  overlayFade: 0.8,
  /** Cornice shimmer sweep */
  shimmer: 1.5,
  /** RSVP form field fade-out */
  formFade: 0.4,
  /** RSVP confirmation fade-in */
  confirmReveal: 0.5,
} as const;

// ============================================================
// Delays (seconds) — relative offsets in timeline positions
// ============================================================
export const HM_DELAY = {
  /** No delay */
  none: 0,
  /** Tight stagger between related elements */
  tight: 0.05,
  /** Standard stagger between elements in a sequence */
  standard: 0.2,
  /** Comfortable gap between content groups */
  comfortable: 0.4,
} as const;

// ============================================================
// ScrollTrigger Defaults
// ============================================================
export const HM_SCROLL_DEFAULTS = {
  /** Standard section entry trigger */
  sectionEntry: {
    start: 'top 80%',
    end: 'top 20%',
    toggleActions: 'play none none none' as const,
    once: true,
  },
  /** Cornice shimmer trigger */
  corniceShimmer: {
    start: 'top 90%',
    once: true,
  },
} as const;

// ============================================================
// matchMedia Breakpoints
// ============================================================
export const HM_BREAKPOINTS = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  fullMotion: '(prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
} as const;
```

---

## 3. Entry Sequence (Welcome Section)

This is the most complex animation in the template. It is a two-phase sequence: video playback, then staggered content reveal.

### 3.1 Video Playback

**Element:** `<video>` filling the Welcome section viewport.

**Attributes:**
```html
<video
  ref={videoRef}
  className="hm-entry-video"
  src="{video-path}"
  poster="{poster-frame-path}"
  muted
  playsInline
  preload="auto"
  aria-hidden="true"
/>
```

**Playback logic (in a useEffect, not useGSAP — video is not a GSAP animation):**

```typescript
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const attemptPlay = () => {
    video.play().catch(() => {
      // Play failed — listen for canplay and retry once
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        video.play().catch(() => {
          // Final failure — skip to post-video state
          handleVideoEnd();
        });
      };
      video.addEventListener('canplay', onCanPlay);
    });
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // This triggers the GSAP reveal timeline (see 3.3)
  };

  video.addEventListener('ended', handleVideoEnd);
  attemptPlay();

  // Fallback: if video hasn't ended after 15s, force transition
  const fallbackTimer = setTimeout(() => {
    if (!videoEndedRef.current) {
      handleVideoEnd();
    }
  }, 15000);

  return () => {
    video.removeEventListener('ended', handleVideoEnd);
    clearTimeout(fallbackTimer);
  };
}, []);
```

**If video cannot play at all:** Show poster frame immediately. After 1.5s delay, trigger `handleVideoEnd()` which starts the content reveal.

### 3.2 Pre-Animation State

All content elements start hidden. Set in CSS (not GSAP) so there is no flash:

```css
.hm-welcome-content {
  opacity: 0;
  visibility: hidden;
}

/* Content overlay starts invisible too */
.hm-welcome-overlay {
  opacity: 0;
}

/* Jali pattern starts invisible */
.hm-welcome-jali {
  opacity: 0;
}

/* Stars container starts invisible */
.hm-welcome-stars {
  opacity: 0;
}
```

**Reduced motion override — content visible from the start:**

```css
@media (prefers-reduced-motion: reduce) {
  .hm-welcome-content,
  .hm-welcome-overlay,
  .hm-welcome-jali,
  .hm-welcome-stars {
    opacity: 1;
    visibility: visible;
  }

  .hm-entry-video {
    /* Video still plays (content, not decoration)
       but if it can't play, poster is visible */
  }

  .hm-welcome-arch path {
    stroke-dashoffset: 0 !important;
    stroke-dasharray: none !important;
  }
}
```

### 3.3 Post-Video Content Reveal Timeline

This GSAP timeline is created on mount but starts **paused**. It plays only when the video `ended` event fires (or the fallback triggers).

**Implementation inside useGSAP:**

```typescript
useGSAP((context, contextSafe) => {
  const mm = gsap.matchMedia();

  mm.add(HM_BREAKPOINTS.fullMotion, () => {
    // -------------------------------------------------------
    // Refs for each animated element (set via ref callbacks)
    // -------------------------------------------------------
    const videoEl = videoRef.current;
    const overlayEl = overlayRef.current;
    const jaliEl = jaliRef.current;
    const starsEl = starsRef.current;
    const lotusTopEl = lotusTopRef.current;
    const corniceLineEl = corniceLineRef.current;
    const welcomeLabelEl = welcomeLabelRef.current;
    const archPathEl = archPathRef.current;
    const coupleNamesEl = coupleNamesRef.current;
    const welcomeMessageEl = welcomeMessageRef.current;
    const weddingDateEl = weddingDateRef.current;
    const scrollIndicatorEl = scrollIndicatorRef.current;

    // -------------------------------------------------------
    // Mehrab arch: measure total path length for stroke draw
    // -------------------------------------------------------
    const archPathLength = archPathEl?.getTotalLength() ?? 0;
    if (archPathEl) {
      gsap.set(archPathEl, {
        strokeDasharray: archPathLength,
        strokeDashoffset: archPathLength,
      });
    }

    // -------------------------------------------------------
    // Create the reveal timeline (paused)
    // -------------------------------------------------------
    const revealTl = gsap.timeline({
      paused: true,
      defaults: {
        ease: HM_EASE.reveal,
      },
      onStart: () => {
        // Apply will-change to all animating elements
        const els = [
          videoEl, overlayEl, jaliEl, starsEl, lotusTopEl,
          corniceLineEl, welcomeLabelEl, coupleNamesEl,
          welcomeMessageEl, weddingDateEl, scrollIndicatorEl
        ];
        els.forEach(el => {
          if (el) el.style.willChange = 'opacity';
        });
        if (archPathEl) archPathEl.style.willChange = 'stroke-dashoffset';
      },
      onComplete: () => {
        // Remove will-change from all elements
        const els = [
          videoEl, overlayEl, jaliEl, starsEl, lotusTopEl,
          corniceLineEl, welcomeLabelEl, coupleNamesEl,
          welcomeMessageEl, weddingDateEl, scrollIndicatorEl,
          archPathEl
        ];
        els.forEach(el => {
          if (el) el.style.willChange = 'auto';
        });
      },
    });

    // -------------------------------------------------------
    // Timeline sequence
    // -------------------------------------------------------

    revealTl
      // t=0: Video fades out + overlay fades in simultaneously
      .to(videoEl, {
        opacity: 0,
        duration: HM_DURATION.videoFade,   // 1.2s
        ease: HM_EASE.videoFade,           // power1.out
      }, 0)
      .to(overlayEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.overlayFade, // 0.8s
        ease: HM_EASE.reveal,             // power2.out
      }, 0)
      // t=0: Jali pattern also fades in with overlay
      .to(jaliEl, {
        opacity: 0.04,
        visibility: 'visible',
        duration: HM_DURATION.overlayFade,
        ease: HM_EASE.reveal,
      }, 0)
      // t=0: Stars container fades in
      .to(starsEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.overlayFade,
        ease: HM_EASE.reveal,
      }, 0)

      // t=0.4s: Lotus medallion (top)
      .to(lotusTopEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.slow, // 0.6s
      }, 0.4)

      // t=0.6s: Gold cornice line
      .to(corniceLineEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.fast, // 0.4s (using 0.4 explicitly)
      }, 0.6)

      // t=0.8s: Welcome label
      .to(welcomeLabelEl, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.4,
      }, 0.8)

      // t=1.0s: Mehrab arch draw-on (stroke-dashoffset)
      .to(archPathEl, {
        strokeDashoffset: 0,
        duration: HM_DURATION.long, // 0.8s
        ease: HM_EASE.strokeDraw,   // power2.out
      }, 1.0)

      // t=1.2s: Couple names (groom + ampersand + bride)
      .to(coupleNamesEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.slow, // 0.6s
      }, 1.2)

      // t=1.6s: Welcome message text
      .to(welcomeMessageEl, {
        opacity: 1,
        visibility: 'visible',
        duration: HM_DURATION.medium, // 0.5s
      }, 1.6)

      // t=2.0s: Wedding date
      .to(weddingDateEl, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.4,
      }, 2.0)

      // t=2.4s: Scroll indicator
      .to(scrollIndicatorEl, {
        opacity: 0.6,
        visibility: 'visible',
        duration: HM_DURATION.medium, // 0.5s
      }, 2.4);

    // -------------------------------------------------------
    // Store the timeline ref so the video-end handler can play it
    // -------------------------------------------------------
    revealTimelineRef.current = revealTl;

    // -------------------------------------------------------
    // Scroll indicator fade-on-scroll (ScrollTrigger)
    // -------------------------------------------------------
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '5% top',
      scrub: true,
      onUpdate: (self) => {
        if (scrollIndicatorEl) {
          const fade = Math.max(0, 0.8 * (1 - self.progress * 3));
          scrollIndicatorEl.style.opacity = String(fade);
        }
      },
    });
  });
}, { scope: sectionRef });
```

**Playing the timeline when video ends:**

```typescript
const handleVideoEnd = useCallback(() => {
  setVideoEnded(true);
  revealTimelineRef.current?.play();
}, []);
```

### 3.4 Timeline Summary Table

| Position (s) | Element | Property | From | To | Duration (s) | Easing |
|---|---|---|---|---|---|---|
| 0 | Video element | opacity | 1 | 0 | 1.2 | power1.out |
| 0 | Content overlay | opacity | 0 | 1 | 0.8 | power2.out |
| 0 | Jali pattern | opacity | 0 | 0.04 | 0.8 | power2.out |
| 0 | Stars container | opacity | 0 | 1 | 0.8 | power2.out |
| 0.4 | Lotus medallion (top) | opacity | 0 | 1 | 0.6 | power2.out |
| 0.6 | Gold cornice line | opacity | 0 | 1 | 0.4 | power2.out |
| 0.8 | Welcome label | opacity | 0 | 1 | 0.4 | power2.out |
| 1.0 | Mehrab arch path | strokeDashoffset | pathLength | 0 | 0.8 | power2.out |
| 1.2 | Couple names + ampersand | opacity | 0 | 1 | 0.6 | power2.out |
| 1.6 | Welcome message | opacity | 0 | 1 | 0.5 | power2.out |
| 2.0 | Wedding date | opacity | 0 | 1 | 0.4 | power2.out |
| 2.4 | Scroll indicator | opacity | 0 | 0.6 | 0.5 | power2.out |

Total reveal duration: ~2.9s (last tween ends at 2.4 + 0.5 = 2.9s).

### 3.5 Twinkling Stars (Welcome)

Stars are 15 `<div>` elements created on mount as a fixed pool. They use CSS animation only (no GSAP).

**Star generation (on mount):**

```typescript
const stars = useMemo(() => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    top: `${gsap.utils.random(2, 38)}%`,    // upper 40% of section
    left: `${gsap.utils.random(3, 97)}%`,
    size: gsap.utils.random(3, 4),            // 3-4px
    duration: `${gsap.utils.random(2.5, 5)}s`,
    delay: `${gsap.utils.random(0, 4)}s`,
  }));
}, []);
```

**Star element:**

```tsx
<div
  className="hm-star"
  style={{
    top: star.top,
    left: star.left,
    width: `${star.size}px`,
    height: `${star.size}px`,
    '--hm-star-duration': star.duration,
    '--hm-star-delay': star.delay,
  } as React.CSSProperties}
/>
```

**CSS (see Section 9 for full keyframes):**

```css
.hm-star {
  position: absolute;
  border-radius: 50%;
  background: var(--hm-ember);
  animation: hm-twinkle var(--hm-star-duration) ease-in-out var(--hm-star-delay) infinite;
  will-change: opacity;
}
```

Paused when section is off-viewport via `[data-hm-paused]` (see 1.4).

### 3.6 Scroll Indicator Animation

**CSS animation (horizontal float):**

```css
.hm-scroll-indicator {
  animation: hm-scroll-float 3s ease-in-out infinite;
  will-change: transform, opacity;
}
```

**GSAP ScrollTrigger fade-on-scroll:** (see 3.3, already specified in the timeline section).

Fades from opacity 0.8 to 0 within the first 5% of section scroll. Uses `scrub: true`.

---

## 4. Per-Section Animation Specs

### 4.1 Section 1: Welcome Message

Covered fully in Section 3 above. Summary of all animations:

| Animation | Engine | Trigger | Duration | Repeat | Notes |
|---|---|---|---|---|---|
| Video playback | Native | Mount | ~10s | Once | canplay retry, poster fallback |
| Content reveal timeline | GSAP | Video `ended` event | 2.9s total | Once | Paused until triggered |
| Scroll indicator float | CSS | Always (after reveal) | 3s | Infinite | translateX only, paused off-viewport |
| Scroll indicator fade | GSAP ScrollTrigger | Scroll position | Scrub | Continuous | Fades to 0 within first 5% of scroll |
| Twinkling stars | CSS | After reveal | 2.5-5s each | Infinite | 15 stars, paused off-viewport |
| Bottom cornice shimmer | GSAP | First viewport entry | 1.5s | Once | See 4.7 |

**Entry animations:** All handled by the reveal timeline. NO translateY on any element.

**Exit behavior:** Content scrolls naturally. Scroll indicator fades via ScrollTrigger. Stars pause via IntersectionObserver.

### 4.2 Section 2: Family Details

**This section has ZERO animations.** It is intentionally static.

- No entry animation.
- No scroll-triggered animation.
- No ambient animation.
- No interactive animation.
- Content is visible as soon as it scrolls into view.
- The lotus medallion divider is static.

The only animated element associated with this section is the bottom cornice shimmer (see 4.7), which is a border element, not section content.

### 4.3 Section 3: Countdown

| Animation | Engine | Trigger | Duration | Repeat | Notes |
|---|---|---|---|---|---|
| Digit swap (opacity) | GSAP | Countdown update (1s interval) | 0.3s | Per update | See Section 5 |
| Jali glow pulse | CSS | Always (when in viewport) | 6s | Infinite | Paused off-viewport |
| Bottom cornice shimmer | GSAP | First viewport entry | 1.5s | Once | See 4.7 |

**Entry animations:** NONE. Section content is visible as soon as it scrolls into view. No stagger, no fade-in.

**Jali glow pulse:** The teal jali band behind the timer oscillates opacity between 0.04 and 0.08.

```css
.hm-countdown-jali-band {
  animation: hm-jali-glow 6s ease-in-out infinite;
  will-change: opacity;
}
```

**Exit behavior:** Content scrolls naturally. Jali glow pauses off-viewport.

### 4.4 Section 4: Celebrations

| Animation | Engine | Trigger | Duration | Repeat | Notes |
|---|---|---|---|---|---|
| Card arch shimmer | CSS | Always (when card in viewport) | 5s | Infinite | Per card, paused off-viewport |
| Bottom cornice shimmer | GSAP | First viewport entry | 1.5s | Once | See 4.7 |

**Entry animations:** NONE. Cards are visible as soon as they scroll into view.

**Card arch shimmer:** Each event card's mehrab arch has a CSS shimmer effect. The shimmer is a horizontal gradient sweep across the arch stroke.

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
  -webkit-background-clip: text;
  background-clip: text;
  animation: hm-shimmer 5s ease-in-out infinite;
}
```

**Viewport pause for cards:** Use one IntersectionObserver per card (not per section) since cards can be individually off-screen while the section is partially visible. Apply `data-hm-paused` per card container.

```typescript
// Inside CelebrationsSection useEffect
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.removeAttribute('data-hm-paused');
      } else {
        entry.target.setAttribute('data-hm-paused', '');
      }
    });
  },
  { threshold: 0 }
);

cardRefs.current.forEach((card) => {
  if (card) cardObserver.observe(card);
});

return () => cardObserver.disconnect();
```

**Exit behavior:** Cards scroll naturally. Shimmer pauses per card off-viewport.

### 4.5 Section 5: RSVP

| Animation | Engine | Trigger | Duration | Repeat | Notes |
|---|---|---|---|---|---|
| Mehrab arch draw-on | GSAP | First viewport entry | 0.8s | Once | IntersectionObserver, threshold 0.3 |
| Form focus transitions | CSS | Input focus/blur | 0.2s | Per interaction | Not GSAP |
| Attendance toggle | CSS | Selection | 0.2s | Per interaction | Not GSAP |
| Submit confirmation | GSAP | Form submit success | ~0.9s total | Once | See Section 6 |
| Bottom cornice shimmer | GSAP | First viewport entry | 1.5s | Once | See 4.7 |

**Arch draw-on (RSVP):**

```typescript
useGSAP((context, contextSafe) => {
  const mm = gsap.matchMedia();

  mm.add(HM_BREAKPOINTS.fullMotion, () => {
    const archPath = rsvpArchPathRef.current;
    if (!archPath) return;

    const pathLength = archPath.getTotalLength();
    gsap.set(archPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Use IntersectionObserver to trigger the draw-on once
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          gsap.to(archPath, {
            strokeDashoffset: 0,
            duration: HM_DURATION.long,     // 0.8s
            ease: HM_EASE.strokeDraw,       // power2.out
            onStart: () => { archPath.style.willChange = 'stroke-dashoffset'; },
            onComplete: () => { archPath.style.willChange = 'auto'; },
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current!);

    // Cleanup observer if component unmounts before trigger
    return () => observer.disconnect();
  });
}, { scope: sectionRef });
```

**Form focus transitions (CSS only):**

```css
.hm-rsvp-input {
  border-bottom: 1px solid rgba(212, 160, 85, 0.4);
  transition: border-color 200ms ease;
}

.hm-rsvp-input:focus {
  border-bottom-color: var(--hm-gold-bright);
}

.hm-rsvp-label {
  color: var(--hm-ember);
  transition: color 200ms ease;
}

.hm-rsvp-input:focus + .hm-rsvp-label,
.hm-rsvp-input:focus ~ .hm-rsvp-label {
  color: var(--hm-gold-bright);
}
```

Note: Label is positioned above the input. If CSS sibling selectors don't reach, use a wrapper class `.hm-rsvp-field--focused` toggled by React state.

**Attendance toggle (CSS only):**

```css
.hm-rsvp-toggle-option {
  background: transparent;
  color: var(--hm-ivory);
  border: 1px solid rgba(212, 160, 85, 0.3);
  transition: background-color 200ms ease, color 200ms ease;
}

.hm-rsvp-toggle-option--selected {
  background: var(--hm-gold);
  color: var(--hm-deep-brown);
}
```

**Exit behavior:** Content scrolls naturally.

### 4.6 Section 6: Closing

| Animation | Engine | Trigger | Duration | Repeat | Notes |
|---|---|---|---|---|---|
| Mehrab arch draw-on | GSAP | First viewport entry | 0.8s | Once | Same pattern as RSVP arch |
| Twinkling stars (reprise) | CSS | Always (when in viewport) | 2.5-5s each | Infinite | 12 stars, paused off-viewport |

**Arch draw-on:** Identical implementation pattern to the RSVP arch (see 4.5), with its own ref and IntersectionObserver at threshold 0.3. Triggered when the Closing section enters the viewport.

```typescript
// Same pattern as RSVP. The arch SVG path:
// - 300px wide x 160px tall
// - stroke opacity 60% (softer than Welcome arch)
// - strokeDashoffset animated from pathLength to 0
// - Duration: 0.8s, ease: power2.out
```

**Twinkling stars (Closing):**

Same CSS animation as Welcome stars but with 12 stars (3 fewer for a quieter mood). Stars are positioned in the upper 50% of the section.

```typescript
const closingStars = useMemo(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${gsap.utils.random(2, 48)}%`,    // upper 50% of section
    left: `${gsap.utils.random(3, 97)}%`,
    size: gsap.utils.random(3, 4),
    duration: `${gsap.utils.random(2.5, 5)}s`,
    delay: `${gsap.utils.random(0, 4)}s`,
  }));
}, []);
```

Paused when section is off-viewport via `[data-hm-paused]` (see 1.4).

**Entry animations:** Stars begin their CSS twinkle animation as soon as the section is in the viewport. Arch draws on at threshold 0.3.

**Exit behavior:** This is the terminal section. No exit transition. Stars pause when scrolled out (though in practice, the user cannot scroll far past this section).

### 4.7 Cornice Shimmer (All Section Dividers)

Each scalloped cornice border between sections has a single-pass gold shimmer effect when it enters the viewport for the first time.

**There are 5 cornices total:**
1. Welcome bottom (gold)
2. Family bottom (sandstone 50%)
3. Countdown bottom (gold)
4. Celebrations bottom (gold)
5. RSVP bottom (gold)

**Implementation:**

All 5 cornices are observed by a single `ScrollTrigger.batch()` call from the root component (or each section handles its own cornice). Using `ScrollTrigger.batch()` is cleaner:

```typescript
// In the root HawaMahal component, inside useGSAP
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add(HM_BREAKPOINTS.fullMotion, () => {
    // Each cornice has a gradient background for shimmer
    // Set initial background-position
    gsap.set('.hm-cornice-shimmer', {
      backgroundPosition: '100% 0',
    });

    ScrollTrigger.batch('.hm-cornice-shimmer', {
      start: 'top 90%',
      once: true,
      onEnter: (elements) => {
        elements.forEach((el) => {
          gsap.to(el, {
            backgroundPosition: '-100% 0',
            duration: HM_DURATION.shimmer,  // 1.5s
            ease: HM_EASE.shimmer,          // power1.inOut
            onStart: () => { el.style.willChange = 'background-position'; },
            onComplete: () => { el.style.willChange = 'auto'; },
          });
        });
      },
    });
  });
}, { scope: rootRef });
```

**CSS for shimmer-ready cornices:**

```css
.hm-cornice-shimmer {
  background: linear-gradient(
    90deg,
    var(--hm-gold) 0%,
    var(--hm-gold-bright) 45%,
    #F5E0B5 50%,
    var(--hm-gold-bright) 55%,
    var(--hm-gold) 100%
  );
  background-size: 200% 100%;
}
```

After the shimmer completes, the background-position rests at `-100% 0`, which visually shows the static gold. No further animation.

---

## 5. Countdown Timer Animation

### 5.1 Digit Transition on Update

The countdown updates every second. Only digits that actually change animate.

**Strategy:** Each digit column has two overlapping elements: the current digit (visible) and the next digit (hidden). When the value changes, GSAP cross-fades them.

**Implementation:**

```typescript
// CountdownDigit component
interface CountdownDigitProps {
  value: string;
}

function CountdownDigit({ value }: CountdownDigitProps) {
  const currentRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if value hasn't changed
    if (previousValueRef.current === value) return;
    previousValueRef.current = value;

    const el = currentRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      // Quick scale-down-up pulse with opacity
      gsap.fromTo(el,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: HM_DURATION.fast, // 0.3s
          ease: HM_EASE.digitIn,       // power1.in
          overwrite: true,
        }
      );
    });
  }, { dependencies: [value], scope: currentRef, revertOnUpdate: true });

  return (
    <span ref={currentRef} className="hm-countdown-digit">
      {value}
    </span>
  );
}
```

**Key rules:**
- **No animation on first render.** The digits appear instantly when the section first loads.
- **Only changing digits animate.** If seconds go from "09" to "10", only the seconds digit transitions.
- The transition is `opacity: 0 -> 1` with a subtle `scale: 0.8 -> 1` (scale is transform, GPU-composited). **No translateY.**
- Duration: 0.3s.
- `overwrite: true` ensures rapid updates don't stack.
- Uses `revertOnUpdate: true` so the previous tween is properly cleaned up before the new one starts.

### 5.2 Reduced Motion

Under `prefers-reduced-motion: reduce`, the `gsap.matchMedia()` block is not entered. Digits swap instantly (React re-render updates the text content with no animation).

---

## 6. RSVP Form Animations

### 6.1 Form Container Appearance

The form container is **static** — it does not animate into view. It is visible as soon as it scrolls into the viewport. The only animated entrance element is the mehrab arch draw-on (see 4.5).

### 6.2 Input Focus States (CSS)

All handled by CSS transitions. See 4.5 for the full CSS specification.

Summary:
- Input bottom border: `transition: border-color 200ms ease`
- Label color: `transition: color 200ms ease`
- No GSAP involvement.

### 6.3 Submit Button Interaction (CSS)

```css
.hm-rsvp-submit {
  background: var(--hm-gold);
  color: var(--hm-deep-brown);
  transition: background-color 150ms ease;
}

.hm-rsvp-submit:hover {
  background: var(--hm-gold-bright);
}

.hm-rsvp-submit:active {
  background: var(--hm-gold-deep);
}

.hm-rsvp-submit:focus-visible {
  outline: 2px solid var(--hm-marble);
  outline-offset: 2px;
}
```

No GSAP involvement.

### 6.4 Success Confirmation Animation (GSAP)

After a successful form submission, the form fields fade out and a confirmation message fades in. This is a GSAP timeline triggered by the submit success callback.

```typescript
// Inside RsvpSection, using contextSafe from useGSAP
const { contextSafe } = useGSAP((context, contextSafe) => {
  // ... other GSAP setup ...
}, { scope: sectionRef });

const handleSubmitSuccess = contextSafe(() => {
  const mm = gsap.matchMedia();

  mm.add(HM_BREAKPOINTS.fullMotion, () => {
    const confirmTl = gsap.timeline({
      defaults: { ease: HM_EASE.confirmFade },
    });

    // Phase 1: Fade out form fields with stagger
    confirmTl.to('.hm-rsvp-form-field', {
      opacity: 0,
      duration: HM_DURATION.formFade,    // 0.4s
      stagger: HM_DELAY.tight,           // 0.05s between fields
      onComplete: () => {
        // Hide form, show confirmation container
        setShowConfirmation(true);
      },
    });

    // Phase 2: Fade in confirmation content
    // (runs after the state update renders the confirmation)
    confirmTl.fromTo('.hm-rsvp-confirmation', {
      opacity: 0,
      visibility: 'hidden',
    }, {
      opacity: 1,
      visibility: 'visible',
      duration: HM_DURATION.confirmReveal, // 0.5s
    }, '+=0.1'); // 100ms gap after fields finish
  });

  // Reduced motion fallback (outside matchMedia, handled by React state)
  mm.add(HM_BREAKPOINTS.reducedMotion, () => {
    setShowConfirmation(true);
  });
});
```

**Confirmation content structure (visible after animation):**
- Lotus medallion (24px, `--hm-gold-bright`)
- 16px gap
- "Thank You" heading (`Cinzel Decorative` 20px, `--hm-gold-bright`)
- 8px gap
- Confirmation text (`Cormorant Garamond` 16px italic, `--hm-ivory`)

### 6.5 Error State Animation

Errors use CSS only. No GSAP.

```css
.hm-rsvp-error {
  color: #D4756A; /* warm red, not harsh */
  opacity: 0;
  transition: opacity 200ms ease;
}

.hm-rsvp-error--visible {
  opacity: 1;
}

.hm-rsvp-input--error {
  border-bottom-color: #D4756A;
}
```

Error messages appear with a 200ms opacity transition. The warm red `#D4756A` is a desaturated sandstone-red that fits the palette without clashing.

---

## 7. Performance Budget

### 7.1 Max Concurrent Animated Elements Per Section

| Section | CSS Animations | GSAP Tweens | Total | Budget (15 max) |
|---|---|---|---|---|
| Welcome | 15 stars + 1 scroll indicator = 16 | 0 (after reveal completes) | 16 | Stars at limit. If strict: reduce to 14 stars. |
| Family | 0 | 0 | 0 | Well under budget |
| Countdown | 1 jali band | Up to 4 digit transitions | 5 | Well under budget |
| Celebrations | 1-2 card shimmers (visible) | 0 | 2 | Well under budget |
| RSVP | 0 ambient | 0 (arch draw is one-shot) | 0 | Well under budget |
| Closing | 12 stars | 0 (after arch draws) | 12 | Under budget |

### 7.2 Max Concurrent CSS Animations Per Section

Same as above (CSS animations are the primary source of concurrent animation in this template).

### 7.3 Total Animation Memory Budget

- GSAP runtime: already loaded, no additional cost.
- ScrollTrigger instances: 7 total (1 scroll indicator fade + 1 batch for 5 cornices + 1 overhead).
- GSAP timelines alive at any time: 1 (Welcome reveal, killed after completion). Countdown digit tweens are ephemeral.
- CSS animations: lightweight (opacity and transform only).

### 7.4 gsap.matchMedia() Breakpoints

```typescript
const HM_BREAKPOINTS = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  fullMotion: '(prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
};
```

**Usage:**
- `fullMotion`: All GSAP animations are created only inside this media query. When the query doesn't match (reduced motion), no animations exist.
- `mobile` / `desktop`: Currently unused (the template renders identically at all sizes inside InvitationViewport), but available if responsive animation adjustments are needed later.

### 7.5 Asset Performance

| Asset | Size | Loading Strategy |
|---|---|---|
| Entry video | ~6.3 MB | `preload="auto"` (opening content) |
| Poster frame | < 200 KB | `priority` loading (opening visual fallback) |
| All SVGs combined | ~5-8 KB | Inline (no network requests) |
| Fonts | ~80-120 KB | `display=swap` via Google Fonts |
| Stars (27 total divs) | 0 KB | DOM elements, CSS-only |

### 7.6 GPU Layer Promotion

Only elements that are actively animating get `will-change`. Specifically:
- Stars: `will-change: opacity` (permanent while visible, removed when paused)
- Scroll indicator: `will-change: transform, opacity` (removed when paused)
- Jali glow band: `will-change: opacity` (removed when paused)
- Card arch shimmers: `will-change: background-position` (removed when paused)
- All one-shot GSAP tweens: `will-change` set in `onStart`, removed in `onComplete`

---

## 8. Reduced Motion Specification

When `prefers-reduced-motion: reduce` is active, **ALL** motion is disabled. No exceptions.

### 8.1 Complete Reduced Motion Map

| # | Animation | Normal Behavior | Reduced Motion Behavior |
|---|---|---|---|
| 1 | Video playback | Plays from start | Still plays (video is content). If OS-level autoplay disabled, poster shown. |
| 2 | Video fade-out (GSAP) | 1.2s opacity transition | Instant: video display:none, background visible |
| 3 | Content overlay fade-in (GSAP) | 0.8s opacity | Instant: opacity 1 from the start |
| 4 | Jali pattern fade-in (GSAP) | 0.8s opacity | Instant: opacity 0.04 from the start |
| 5 | Stars container fade-in (GSAP) | 0.8s opacity | Instant: opacity 1 from the start |
| 6 | Lotus medallion fade-in (GSAP) | 0.6s opacity | Instant: opacity 1 from the start |
| 7 | Gold cornice line fade-in (GSAP) | 0.4s opacity | Instant: opacity 1 from the start |
| 8 | Welcome label fade-in (GSAP) | 0.4s opacity | Instant: opacity 1 from the start |
| 9 | Mehrab arch draw-on Welcome (GSAP) | 0.8s strokeDashoffset | Pre-drawn: strokeDashoffset 0, strokeDasharray none |
| 10 | Couple names fade-in (GSAP) | 0.6s opacity | Instant: opacity 1 from the start |
| 11 | Welcome message fade-in (GSAP) | 0.5s opacity | Instant: opacity 1 from the start |
| 12 | Wedding date fade-in (GSAP) | 0.4s opacity | Instant: opacity 1 from the start |
| 13 | Scroll indicator fade-in (GSAP) | 0.5s opacity | Instant: opacity 0.8 from the start |
| 14 | Scroll indicator float (CSS) | 3s translateX + opacity loop | Static: no animation, opacity 0.8 |
| 15 | Scroll indicator fade-on-scroll (GSAP) | ScrollTrigger scrub | Not created (matchMedia skips it) |
| 16 | Twinkling stars Welcome (CSS) | 2.5-5s opacity loop x15 | Static: opacity 0.4, no animation |
| 17 | Countdown digit swap (GSAP) | 0.3s opacity+scale | Instant: digits update with no transition |
| 18 | Jali glow pulse (CSS) | 6s opacity loop | Static: opacity 0.06, no animation |
| 19 | Card arch shimmer (CSS) | 5s background-position loop | Static: solid --hm-gold-deep, no animation |
| 20 | Cornice shimmer x5 (GSAP) | 1.5s background-position sweep | Static: solid gold from the start |
| 21 | RSVP arch draw-on (GSAP) | 0.8s strokeDashoffset | Pre-drawn: strokeDashoffset 0 |
| 22 | Form focus transitions (CSS) | 200ms border/color transition | `transition: none` |
| 23 | Attendance toggle (CSS) | 200ms background/color transition | `transition: none` |
| 24 | RSVP confirmation (GSAP) | 0.4s + 0.5s opacity stagger | Instant: form hidden, confirmation shown |
| 25 | Submit button hover (CSS) | 150ms background transition | `transition: none` |
| 26 | Closing arch draw-on (GSAP) | 0.8s strokeDashoffset | Pre-drawn: strokeDashoffset 0 |
| 27 | Twinkling stars Closing (CSS) | 2.5-5s opacity loop x12 | Static: opacity 0.4, no animation |

### 8.2 Implementation

**GSAP animations:** All created inside `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. When the media query doesn't match, no GSAP animations are created. When it stops matching (user changes preference at runtime), all animations are automatically cleaned up by `gsap.matchMedia()`.

**CSS animations:** A single media query block in the template CSS:

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all CSS animations */
  .hm-star,
  .hm-scroll-indicator,
  .hm-countdown-jali-band,
  .hm-event-arch-stroke,
  .hm-gold-shimmer,
  .hm-cornice-shimmer {
    animation: none !important;
  }

  /* Kill all CSS transitions */
  .hm-rsvp-input,
  .hm-rsvp-label,
  .hm-rsvp-toggle-option,
  .hm-rsvp-submit {
    transition: none !important;
  }

  /* Static states */
  .hm-star {
    opacity: 0.4;
  }

  .hm-scroll-indicator {
    opacity: 0.8;
  }

  .hm-countdown-jali-band {
    opacity: 0.06;
  }

  /* All welcome content visible immediately */
  .hm-welcome-content,
  .hm-welcome-overlay,
  .hm-welcome-jali,
  .hm-welcome-stars {
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* All arches pre-drawn */
  .hm-welcome-arch path,
  .hm-rsvp-arch path,
  .hm-closing-arch path {
    stroke-dashoffset: 0 !important;
    stroke-dasharray: none !important;
  }
}
```

---

## 9. CSS Keyframes Reference

All CSS `@keyframes` definitions used in the template. These go in `HawaMahal.css`.

### 9.1 Star Twinkle

```css
@keyframes hm-twinkle {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.7;
  }
}
```

Used by: `.hm-star` (Welcome and Closing sections)
Duration: `var(--hm-star-duration)` (2.5s-5s, set per element)
Delay: `var(--hm-star-delay)` (0s-4s, set per element)
Timing: `ease-in-out`
Iteration: `infinite`

### 9.2 Scroll Indicator Float

```css
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
```

Used by: `.hm-scroll-indicator`
Duration: `3s`
Timing: `ease-in-out`
Iteration: `infinite`
Note: Horizontal movement only (translateX). NO translateY.

### 9.3 Jali Glow Pulse

```css
@keyframes hm-jali-glow {
  0%, 100% {
    opacity: 0.04;
  }
  50% {
    opacity: 0.08;
  }
}
```

Used by: `.hm-countdown-jali-band`
Duration: `6s`
Timing: `ease-in-out`
Iteration: `infinite`

### 9.4 Gold Shimmer (CSS variant for card arches)

```css
@keyframes hm-shimmer {
  0%, 100% {
    background-position: 100% 0;
  }
  50% {
    background-position: -100% 0;
  }
}
```

Used by: `.hm-event-arch-stroke`
Duration: `5s`
Timing: `ease-in-out`
Iteration: `infinite`

### 9.5 Reduced Motion Override (all keyframes disabled)

```css
@media (prefers-reduced-motion: reduce) {
  .hm-star,
  .hm-scroll-indicator,
  .hm-countdown-jali-band,
  .hm-event-arch-stroke,
  .hm-gold-shimmer,
  .hm-cornice-shimmer {
    animation: none !important;
  }
}
```

---

## 10. Animation Inventory

Complete list of every animation in the template, for tracking and verification.

| # | Element | Section | Engine | Property | Trigger | Duration | Repeat | Reduced Motion |
|---|---|---|---|---|---|---|---|---|
| 1 | Video playback | Welcome | Native | N/A | Mount | ~10s | Once | Plays (or poster) |
| 2 | Video fade-out | Welcome | GSAP | opacity | Video `ended` | 1.2s | Once | Instant (display:none) |
| 3 | Content overlay fade-in | Welcome | GSAP | opacity | Video `ended` | 0.8s | Once | Already visible |
| 4 | Jali pattern fade-in | Welcome | GSAP | opacity | Video `ended` | 0.8s | Once | Already visible |
| 5 | Stars container fade-in | Welcome | GSAP | opacity | Video `ended` | 0.8s | Once | Already visible |
| 6 | Lotus fade-in | Welcome | GSAP | opacity | Video `ended` +0.4s | 0.6s | Once | Already visible |
| 7 | Cornice line fade-in | Welcome | GSAP | opacity | Video `ended` +0.6s | 0.4s | Once | Already visible |
| 8 | Welcome label fade-in | Welcome | GSAP | opacity | Video `ended` +0.8s | 0.4s | Once | Already visible |
| 9 | Mehrab arch draw-on | Welcome | GSAP | strokeDashoffset | Video `ended` +1.0s | 0.8s | Once | Pre-drawn |
| 10 | Couple names fade-in | Welcome | GSAP | opacity | Video `ended` +1.2s | 0.6s | Once | Already visible |
| 11 | Welcome message fade-in | Welcome | GSAP | opacity | Video `ended` +1.6s | 0.5s | Once | Already visible |
| 12 | Wedding date fade-in | Welcome | GSAP | opacity | Video `ended` +2.0s | 0.4s | Once | Already visible |
| 13 | Scroll indicator fade-in | Welcome | GSAP | opacity | Video `ended` +2.4s | 0.5s | Once | Already visible (0.8) |
| 14 | Scroll indicator float | Welcome | CSS | translateX + opacity | Always | 3s | Infinite | Static (0.8) |
| 15 | Scroll indicator fade-on-scroll | Welcome | GSAP ST | opacity | Scroll position | Scrub (5%) | Continuous | Not created |
| 16 | Twinkling stars (Welcome) | Welcome | CSS | opacity | Always | 2.5-5s each | Infinite | Static (0.4) |
| 17 | Countdown digit swap | Countdown | GSAP | opacity + scale | Value change | 0.3s | Per update | Instant swap |
| 18 | Jali glow pulse | Countdown | CSS | opacity | Always | 6s | Infinite | Static (0.06) |
| 19 | Card arch shimmer | Celebrations | CSS | background-position | Always | 5s | Infinite | Static gold |
| 20 | Cornice shimmer (x5) | All dividers | GSAP | background-position | First viewport entry | 1.5s | Once each | Static gold |
| 21 | RSVP arch draw-on | RSVP | GSAP | strokeDashoffset | First viewport entry | 0.8s | Once | Pre-drawn |
| 22 | RSVP form focus | RSVP | CSS | border-color, color | Focus/blur | 0.2s | Per interaction | No transition |
| 23 | RSVP toggle select | RSVP | CSS | background, color | Selection | 0.2s | Per interaction | No transition |
| 24 | RSVP confirmation | RSVP | GSAP | opacity | Submit success | 0.4s + 0.5s | Once | Instant swap |
| 25 | Closing arch draw-on | Closing | GSAP | strokeDashoffset | First viewport entry | 0.8s | Once | Pre-drawn |
| 26 | Twinkling stars (Closing) | Closing | CSS | opacity | Always | 2.5-5s each | Infinite | Static (0.4) |

**Totals:**
- 14 one-shot GSAP animations (run once on trigger, done)
- 6 infinite CSS loops (lightweight, GPU-composited, paused off-viewport)
- 1 GSAP ScrollTrigger scrub (scroll indicator)
- 1 native video playback
- 2 GSAP event-driven (digit swap, RSVP confirmation)
- 3 CSS transitions (form focus, toggle, button hover)

**Total: 27 discrete animation behaviors. 22 unique animations (some share implementation).**

---

## Appendix A: File Structure for Animation Code

```
src/experimental-template/hawa-mahal/
  animation-constants.ts     <- HM_EASE, HM_DURATION, HM_DELAY, HM_BREAKPOINTS
  HawaMahal.tsx              <- Root component, plugin registration, cornice batch observer
  HawaMahal.css              <- All CSS keyframes, reduced motion overrides, pause rules
  sections/
    WelcomeSection.tsx       <- Video logic, reveal timeline, scroll indicator ST, stars
    FamilySection.tsx        <- Static (no animation code)
    CountdownSection.tsx     <- Digit swap, jali glow (CSS)
    CelebrationsSection.tsx  <- Card arch shimmer (CSS), card IntersectionObserver
    RsvpSection.tsx          <- Arch draw-on, form transitions, confirmation timeline
    ClosingSection.tsx       <- Arch draw-on, stars (CSS)
```

---

## Appendix B: Quick Reference — What NOT to Do

1. **NO translateY on any element.** All reveals are pure opacity. The arch uses strokeDashoffset. The scroll indicator uses translateX. Nothing moves vertically.
2. **NO setInterval for the countdown.** Use a `useEffect` with `setTimeout` or `requestAnimationFrame` for the timer, and GSAP tweens for the digit animation.
3. **NO continuous requestAnimationFrame loops.** Stars use CSS animation. Jali glow uses CSS animation. No JS loops running per-frame for static content.
4. **NO animation on layout-triggering properties** (width, height, top, left, margin, padding).
5. **NO GSAP outside gsap.context() / useGSAP().** Every tween must be inside the context for cleanup.
6. **NO ScrollTrigger on child tweens inside a timeline.** ScrollTrigger goes on the timeline itself or on a standalone `ScrollTrigger.create()`.
7. **NO `markers: true` in production.** Remove all markers before shipping.
8. **NO `will-change` on elements that aren't actively animating.** Apply dynamically, remove when done.
9. **NO spawning new elements during animation.** All stars, all DOM nodes created on mount. Reuse only.
10. **NO animation without a reduced-motion alternative.** Every single animation in this document has a reduced-motion row. If you add a new animation, add its reduced-motion behavior.

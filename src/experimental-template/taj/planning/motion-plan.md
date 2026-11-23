# Taj Template — Motion Plan

> Animation and transition specifications for all 8 sections.
> GSAP for orchestrated/scroll-triggered animations. CSS for ambient loops.
> CSS prefix: `tj-` for classes, `--tj-` for custom properties.

---

## 1. Opening Entrance Timeline

The opening plays a 10-second Taj Mahal video full-screen, then reveals text on top of the frozen final frame. No fade-up / translateY animations (project rule). All reveals use opacity-only or scale-based transforms.

### Timeline Breakdown

| Step | Time (ms) | Element | Property | From | To | Easing |
|------|-----------|---------|----------|------|----|--------|
| 1 | 0-10000 | `.tj-opening-video` | plays | — | — | — |
| 2 | 10000-10800 | `.tj-opening-overlay` | opacity | 0 | 0.85 | power2.inOut |
| 3 | 10400-10800 | `.tj-bismillah` | opacity | 0 | 1 | power2.out |
| 4 | 10800-11400 | `.tj-name-1` | opacity, scale | 0, 0.92 | 1, 1 | power2.out |
| 5 | 10900-11500 | `.tj-name-connector` | opacity | 0 | 1 | power2.out |
| 6 | 11000-11600 | `.tj-name-2` | opacity, scale | 0, 0.92 | 1, 1 | power2.out |
| 7 | 11400-12000 | `.tj-opening-divider` | opacity, scaleX | 0, 0 | 1, 1 | power3.out |
| 8 | 11600-12200 | `.tj-opening-tagline` | opacity | 0 | 1 | power2.out |
| 9 | 12200-12800 | `.tj-scroll-indicator` | opacity | 0 | 0.7 | power1.out |

**Total sequence**: ~12.8 seconds from page load (10s video + 2.8s text reveal).

### GSAP Implementation

```js
// Inside useGSAP with scope: containerRef
const openingTl = gsap.timeline({ paused: true });

openingTl
  // Step 2: overlay fade-in
  .to('.tj-opening-overlay', {
    opacity: 0.85,
    duration: 0.8,
    ease: 'power2.inOut',
  })
  // Step 3: Bismillah
  .to('.tj-bismillah', {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
  }, '<0.4')  // 400ms after overlay starts
  // Step 4: first name — opacity + subtle scale
  .to('.tj-name-1', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '<0.4')  // 400ms after bismillah starts
  // Step 5: connector (&)
  .to('.tj-name-connector', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '<0.1')
  // Step 6: second name — opacity + subtle scale
  .to('.tj-name-2', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '<0.1')
  // Step 7: divider — scaleX from center
  .to('.tj-opening-divider', {
    opacity: 1,
    scaleX: 1,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.2')
  // Step 8: invitation tagline
  .to('.tj-opening-tagline', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.4')
  // Step 9: scroll indicator
  .to('.tj-scroll-indicator', {
    opacity: 0.7,
    duration: 0.6,
    ease: 'power1.out',
  }, '-=0.2');
```

### Initial CSS States (set before timeline plays)

```css
.tj-opening-overlay { opacity: 0; }
.tj-bismillah { opacity: 0; }
.tj-name-1,
.tj-name-2 { opacity: 0; transform: scale(0.92); }
.tj-name-connector { opacity: 0; }
.tj-opening-divider { opacity: 0; transform: scaleX(0); transform-origin: center; }
.tj-opening-tagline { opacity: 0; }
.tj-scroll-indicator { opacity: 0; }
```

### Video Playback Logic

```js
// Video handler (inside useGSAP contextSafe callback)
const videoEl = videoRef.current;
if (!videoEl) {
  // No video — skip to text reveal immediately
  openingTl.play();
  return;
}

// canplay retry per project rule
const attemptPlay = () => {
  const playPromise = videoEl.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — show poster, reveal text
      openingTl.play();
    });
  }
};

videoEl.addEventListener('canplay', attemptPlay, { once: true });
videoEl.addEventListener('ended', () => openingTl.play(), { once: true });

// Fallback: if video never loads within 12s, reveal text anyway
const fallbackTimer = setTimeout(() => {
  openingTl.play();
}, 12000);

// Clear fallback if video ends normally
videoEl.addEventListener('ended', () => clearTimeout(fallbackTimer), { once: true });
```

### Edit Mode Override

In edit mode, skip the entire timeline. All elements render at their final-state CSS (full opacity, scale 1). Video shows poster frame as a static background image. No autoplay.

```js
if (isEditMode) {
  // Set everything to final state immediately
  gsap.set(['.tj-opening-overlay', '.tj-bismillah', '.tj-name-1',
    '.tj-name-2', '.tj-name-connector', '.tj-opening-divider',
    '.tj-opening-tagline'], { opacity: 1, scale: 1, scaleX: 1 });
  // Do not play video, do not create timeline
  return;
}
```

---

## 2. Scroll Reveal Strategy (Sections 2-8)

All scroll reveals use GSAP ScrollTrigger with `once: true`. Elements animate once on entry, then remain in their final state. No fade-up (translateY) in edit mode.

### Global Pattern

```js
// Reusable reveal function
function createScrollReveal(trigger, targets, options = {}) {
  const {
    stagger = 0.12,
    duration = 0.6,
    ease = 'power2.out',
    start = 'top 85%',
  } = options;

  gsap.from(targets, {
    opacity: 0,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger,
      start,
      once: true,
    },
  });
}
```

### Per-Section Scroll Reveals

#### Section 2 — Couple

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section top hits 85% viewport |
| Arch frame | opacity 0 to 1, scale 0.95 to 1 | 800ms | — | Arch container top hits 80% viewport |
| Rose ornaments | opacity 0 to 1 | 500ms | 150ms (left then right) | After arch appears |
| Couple names + note | opacity 0 to 1 | 600ms | 120ms | Text block top hits 85% viewport |

```js
// Couple section
gsap.from('.tj-couple-arch', {
  opacity: 0,
  scale: 0.95,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.tj-couple-arch', start: 'top 80%', once: true },
});

gsap.from('.tj-couple-rose', {
  opacity: 0,
  duration: 0.5,
  stagger: 0.15,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.tj-couple-arch', start: 'top 75%', once: true },
});
```

#### Section 3 — Dua

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section top at 85% |
| Arabic text | opacity 0 to 1 | 800ms | — | Arabic block at 85% |
| Gold rule | opacity 0 to 1, scaleX 0 to 1 | 600ms | — | After Arabic |
| Translation + reference | opacity 0 to 1 | 600ms | 120ms | Translation block at 85% |

```js
gsap.from('.tj-dua-arabic', {
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.tj-dua-arabic', start: 'top 85%', once: true },
});

gsap.from('.tj-dua-rule', {
  opacity: 0,
  scaleX: 0,
  transformOrigin: 'center',
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.tj-dua-rule', start: 'top 85%', once: true },
});
```

#### Section 4 — Countdown

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section at 85% |
| Countdown units (4 boxes) | opacity 0 to 1, scale 0.9 to 1 | 500ms | 100ms left-to-right | Units container at 80% |
| Vertical separator lines | opacity 0 to 1 | 400ms | 80ms | Same trigger |
| Written date | opacity 0 to 1 | 600ms | — | Date block at 85% |
| Star sparkle | opacity 0 to 1, scale 0.5 to 1 | 400ms | — | After date |

```js
gsap.from('.tj-countdown-unit', {
  opacity: 0,
  scale: 0.9,
  duration: 0.5,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.tj-countdown-grid', start: 'top 80%', once: true },
});
```

#### Section 5 — Celebrations

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section at 85% |
| Event cards | opacity 0 to 1, scale 0.97 to 1 | 600ms | 200ms per card | Each card at 85% |

Event cards stagger one at a time as they scroll into view. Use `ScrollTrigger.batch()` for efficient handling when multiple cards are near the viewport simultaneously.

```js
ScrollTrigger.batch('.tj-event-card', {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      scale: 0.97,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out',
    });
  },
  start: 'top 85%',
  once: true,
});
```

#### Section 6 — RSVP

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section at 85% |
| Invitation text | opacity 0 to 1 | 600ms | — | Text at 85% |
| Form panel | opacity 0 to 1, scale 0.98 to 1 | 700ms | — | Panel at 80% |
| Form fields (inside panel) | opacity 0 to 1 | 400ms | 80ms per field | After panel appears |
| Rose border below | opacity 0 to 1 | 500ms | — | After panel |

```js
const rsvpTl = gsap.timeline({
  scrollTrigger: { trigger: '.tj-rsvp-panel', start: 'top 80%', once: true },
});

rsvpTl
  .from('.tj-rsvp-panel', {
    opacity: 0,
    scale: 0.98,
    duration: 0.7,
    ease: 'power2.out',
  })
  .from('.tj-rsvp-field', {
    opacity: 0,
    duration: 0.4,
    stagger: 0.08,
    ease: 'power2.out',
  }, '-=0.3');
```

#### Section 7 — Gallery

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Section at 85% |
| Gallery images | opacity 0 to 1 | 500ms | batch stagger 0.1 | Each image at 85% |

Use `ScrollTrigger.batch()` for gallery images since they enter in groups (a row of two, then a wide image).

```js
ScrollTrigger.batch('.tj-gallery-item', {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  },
  start: 'top 85%',
  once: true,
});
```

#### Section 8 — Closing

| Element | Animation | Duration | Stagger | Trigger |
|---------|-----------|----------|---------|---------|
| Dome silhouette | opacity 0 to 0.08 | 1000ms | — | Section at 90% |
| Section heading + divider | opacity 0 to 1 | 600ms | 120ms | Heading at 85% |
| Gratitude text | opacity 0 to 1 | 600ms | — | Text at 85% |
| Couple names + rule + families | opacity 0 to 1 | 600ms | 150ms | Names block at 85% |
| Crescent + stars | opacity 0 to 1, scale 0.8 to 1 | 800ms | — | Crescent at 80% |

```js
gsap.from('.tj-closing-crescent', {
  opacity: 0,
  scale: 0.8,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.tj-closing-crescent', start: 'top 80%', once: true },
});
```

### Ornamental Divider Reveals (Between Sections)

All section-transition dividers share the same animation: the gold line scales from center using `scaleX: 0` to `scaleX: 1`, while the center motif fades in with a slight scale.

```js
ScrollTrigger.batch('.tj-section-divider', {
  onEnter: (elements) => {
    elements.forEach((el) => {
      const line = el.querySelector('.tj-divider-line');
      const motif = el.querySelector('.tj-divider-motif');
      const tl = gsap.timeline();
      tl.from(line, {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power3.out',
      })
      .from(motif, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.3');
    });
  },
  start: 'top 85%',
  once: true,
});
```

### Edit Mode: All Scroll Reveals Disabled

In edit mode, do not register any ScrollTrigger instances. All elements render at full opacity and final transform. Use a guard at the top of the animation setup:

```js
if (isEditMode) return; // Skip all scroll-based animations
```

---

## 3. CSS Keyframe Definitions — Ambient Animations

These loops run via CSS (not GSAP) because they are simple, repeating, and independent. They must be wrapped in `@media (prefers-reduced-motion: no-preference)`.

### Moon Glow Pulse

```css
@keyframes tj-moon-glow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(232, 228, 216, 0.08),
                0 0 60px rgba(232, 228, 216, 0.04);
  }
  50% {
    box-shadow: 0 0 40px rgba(232, 228, 216, 0.15),
                0 0 80px rgba(232, 228, 216, 0.08);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .tj-crescent-moon {
    animation: tj-moon-glow 4s ease-in-out infinite;
    will-change: box-shadow;
  }
}
```

### Star Twinkle

Six star elements maximum, each with a randomized delay to avoid synchronized blinking.

```css
@keyframes tj-star-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@media (prefers-reduced-motion: no-preference) {
  .tj-star { will-change: opacity; }
  .tj-star:nth-child(1) { animation: tj-star-twinkle 3.0s ease-in-out 0.0s infinite; }
  .tj-star:nth-child(2) { animation: tj-star-twinkle 2.5s ease-in-out 0.8s infinite; }
  .tj-star:nth-child(3) { animation: tj-star-twinkle 3.5s ease-in-out 1.5s infinite; }
  .tj-star:nth-child(4) { animation: tj-star-twinkle 2.8s ease-in-out 0.4s infinite; }
  .tj-star:nth-child(5) { animation: tj-star-twinkle 3.2s ease-in-out 2.0s infinite; }
  .tj-star:nth-child(6) { animation: tj-star-twinkle 2.7s ease-in-out 1.2s infinite; }
}
```

### Gold Shimmer (Couple Names)

A background-position animation on a gradient text fill. Applied only to couple names in the Opening section.

```css
@keyframes tj-gold-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@media (prefers-reduced-motion: no-preference) {
  .tj-name-shimmer {
    background: linear-gradient(
      90deg,
      var(--tj-cream) 0%,
      var(--tj-gold-light) 25%,
      var(--tj-highlight) 50%,
      var(--tj-gold-light) 75%,
      var(--tj-cream) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: tj-gold-shimmer 6s ease-in-out infinite;
    /* No will-change needed — background-position is compositor-friendly here */
  }
}
```

### Scroll Indicator Pulse

```css
@keyframes tj-scroll-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.3; }
}

@media (prefers-reduced-motion: no-preference) {
  .tj-scroll-indicator {
    animation: tj-scroll-pulse 2.5s ease-in-out infinite;
  }
}
```

### Rose Petal Drift (Decorative, Optional)

Up to 5 petal elements that drift slowly downward with a slight rotation. Used sparingly — only on the Closing section.

```css
@keyframes tj-petal-drift {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(80px) rotate(25deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .tj-petal { will-change: transform; }
  .tj-petal:nth-child(1) { animation: tj-petal-drift 10s ease-in-out 0s infinite; }
  .tj-petal:nth-child(2) { animation: tj-petal-drift 12s ease-in-out 2s infinite; }
  .tj-petal:nth-child(3) { animation: tj-petal-drift  9s ease-in-out 4s infinite; }
  .tj-petal:nth-child(4) { animation: tj-petal-drift 11s ease-in-out 1s infinite; }
  .tj-petal:nth-child(5) { animation: tj-petal-drift  8s ease-in-out 3s infinite; }
}
```

### Arch Stroke Reveal (SVG)

Used on the Couple section arch frame. Triggered by GSAP ScrollTrigger (not CSS loop) because it plays once on scroll. Defined here for reference:

```css
.tj-arch-path {
  stroke-dasharray: var(--tj-arch-length);
  stroke-dashoffset: var(--tj-arch-length);
  transition: none; /* GSAP controls this */
}
```

```js
// In useGSAP, after measuring path length:
const archPath = containerRef.current.querySelector('.tj-arch-path');
const length = archPath.getTotalLength();
archPath.style.setProperty('--tj-arch-length', length);

gsap.to(archPath, {
  strokeDashoffset: 0,
  duration: 1.5,
  ease: 'power2.inOut',
  scrollTrigger: { trigger: archPath, start: 'top 80%', once: true },
});
```

---

## 4. Interaction Animations

### RSVP Button States

```css
.tj-rsvp-submit {
  transition:
    background-color var(--tj-duration-fast) var(--tj-ease-gentle),
    color var(--tj-duration-fast) var(--tj-ease-gentle),
    border-color var(--tj-duration-fast) var(--tj-ease-gentle),
    opacity var(--tj-duration-fast) var(--tj-ease-gentle);
}

.tj-rsvp-submit:hover {
  background-color: var(--tj-gold);
  color: var(--tj-midnight);
  border-color: var(--tj-gold);
}

.tj-rsvp-submit:active {
  background-color: var(--tj-gold-bright);
  border-color: var(--tj-gold-bright);
}

.tj-rsvp-submit:disabled {
  opacity: 0.6;
  pointer-events: none;
}
```

### Input Focus Transition

```css
.tj-input {
  border-bottom: 1px solid var(--tj-divider);
  transition: border-color var(--tj-duration-fast) var(--tj-ease-gentle),
              box-shadow var(--tj-duration-fast) var(--tj-ease-gentle);
}

.tj-input:focus {
  border-bottom-color: var(--tj-gold);
  box-shadow: 0 1px 0 0 var(--tj-gold);
  outline: none;
}
```

### Radio Button Selection

```css
.tj-radio-circle {
  transition: background-color var(--tj-duration-fast) var(--tj-ease-gentle),
              border-color var(--tj-duration-fast) var(--tj-ease-gentle);
}

.tj-radio-input:checked + .tj-radio-circle {
  background-color: var(--tj-gold);
  border-color: var(--tj-gold);
}
```

### RSVP Form Step Transitions

If the RSVP form uses multi-step flow (e.g., form then confirmation), animate the transition:

```js
// Transition from form to confirmation (inside contextSafe callback)
const showConfirmation = contextSafe(() => {
  const tl = gsap.timeline();
  tl.to('.tj-rsvp-form', {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      // React state update to swap content happens here
    },
  })
  .from('.tj-rsvp-confirmation', {
    opacity: 0,
    scale: 0.95,
    duration: 0.5,
    ease: 'power2.out',
  });
});
```

### Gallery Lightbox Open/Close

```js
// Open lightbox (contextSafe)
const openLightbox = contextSafe((imageEl) => {
  gsap.from('.tj-lightbox', {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
  });
  gsap.from('.tj-lightbox-image', {
    scale: 0.9,
    duration: 0.4,
    ease: 'power2.out',
    delay: 0.1,
  });
});

// Close lightbox (contextSafe)
const closeLightbox = contextSafe(() => {
  gsap.to('.tj-lightbox', {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      // React state: setLightboxOpen(false)
    },
  });
});
```

---

## 5. Countdown Digit Transition

A clean, elegant digit swap. No flip-clock complexity. When a digit changes, the old value slides up and fades out while the new value slides in from below. Pure CSS transition (no GSAP needed for this per-second tick).

### Mechanism

Each countdown unit contains two stacked spans: the outgoing digit and the incoming digit. On state change, a CSS class toggles the transition.

```css
.tj-digit-container {
  position: relative;
  overflow: hidden;
  height: 1.2em; /* Fits one line of digits */
}

.tj-digit {
  display: block;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Outgoing digit */
.tj-digit--exit {
  position: absolute;
  inset: 0;
  transform: translateY(-100%);
  opacity: 0;
}

/* Incoming digit */
.tj-digit--enter {
  transform: translateY(0);
  opacity: 1;
}

/* Before animation starts (incoming starts below) */
.tj-digit--enter-from {
  transform: translateY(100%);
  opacity: 0;
}
```

### React Pattern

```
1. State: currentValue = "127"
2. Timer ticks, newValue = "126"
3. Render: show "127" with --exit class, "126" with --enter-from class
4. Next frame (rAF): swap --enter-from to --enter, triggering the CSS transition
5. After 300ms (transitionend): remove the old digit DOM node
```

### Edit Mode

Static display. No transitions. Just render the current countdown value with no animation classes.

```css
.tj-edit-mode .tj-digit {
  transition: none;
}
```

---

## 6. Reduced Motion Strategy

When `prefers-reduced-motion: reduce` is active, all motion is disabled and elements show their final visual states immediately.

### What Gets Disabled

| Animation | Reduced Motion Behavior |
|-----------|------------------------|
| Opening video | Still plays (video is content, not decoration), but text appears immediately after — no timeline delay |
| Opening text reveal timeline | Skipped — all text at full opacity instantly |
| All scroll reveals (sections 2-8) | Skipped — elements at final opacity/scale |
| Moon glow pulse | Static — single glow state, no animation |
| Star twinkle | Static — all stars at opacity 0.7 |
| Gold shimmer | Static — solid cream text color, no gradient animation |
| Scroll indicator pulse | Static — fixed at opacity 0.7 |
| Rose petal drift | Hidden — petals set to `display: none` |
| Countdown digit transition | Instant swap — `transition: none` |
| RSVP button hover | Instant state change — `transition: none` |
| Input focus transition | Instant state change — `transition: none` |
| Arch stroke reveal | Fully drawn — `stroke-dashoffset: 0` immediately |
| Lightbox open/close | Instant show/hide — no opacity animation |

### Implementation

**CSS ambient animations** — already wrapped in `@media (prefers-reduced-motion: no-preference)` blocks (see section 3). Elements outside that media query show their static final state.

**GSAP animations** — check at initialization and skip:

```js
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

useGSAP(() => {
  if (prefersReducedMotion || isEditMode) {
    // Set all elements to final visual state
    gsap.set('.tj-opening-overlay', { opacity: 0.85 });
    gsap.set(['.tj-bismillah', '.tj-name-1', '.tj-name-2',
      '.tj-name-connector', '.tj-opening-tagline'], { opacity: 1, scale: 1 });
    gsap.set('.tj-opening-divider', { opacity: 1, scaleX: 1 });
    // Do not register any ScrollTriggers
    return;
  }

  // ... normal animation setup ...
}, { scope: containerRef });
```

**Reduced motion static styles fallback** (CSS):

```css
@media (prefers-reduced-motion: reduce) {
  .tj-crescent-moon {
    box-shadow: 0 0 35px rgba(232, 228, 216, 0.1),
                0 0 70px rgba(232, 228, 216, 0.06);
  }

  .tj-star {
    opacity: 0.7;
  }

  .tj-name-shimmer {
    background: none;
    -webkit-text-fill-color: var(--tj-cream);
    color: var(--tj-cream);
  }

  .tj-scroll-indicator {
    opacity: 0.7;
  }

  .tj-petal {
    display: none;
  }

  .tj-digit {
    transition: none;
  }

  .tj-rsvp-submit,
  .tj-input,
  .tj-radio-circle {
    transition: none;
  }

  .tj-arch-path {
    stroke-dashoffset: 0 !important;
  }
}
```

---

## 7. Performance Constraints

### Rules

1. **No continuous rAF loops for static content.** All ambient animations use CSS `@keyframes` (handled by the browser compositor). GSAP is used only for one-shot orchestrated reveals and scroll triggers — never for per-frame update loops.

2. **Cached measurements.** SVG path lengths (for arch stroke reveal) are measured once and stored in a CSS custom property. No per-frame `getBoundingClientRect()` or `getTotalLength()` calls.

3. **Cleanup in useGSAP.** All GSAP animations and ScrollTrigger instances are created inside `useGSAP({ scope: containerRef })`, which automatically reverts everything on unmount. No manual cleanup needed.

4. **`will-change` budget.** Applied only to actively animating elements:
   - `.tj-crescent-moon` — `will-change: box-shadow` (moon glow loop)
   - `.tj-star` — `will-change: opacity` (twinkle loop)
   - `.tj-petal` — `will-change: transform` (drift loop)
   - No other elements get `will-change`. Scroll reveals are one-shot and do not need layer promotion.

5. **ScrollTrigger `once: true` on every reveal.** After an element's reveal animation completes, its ScrollTrigger instance is automatically killed. No lingering scroll listeners.

6. **ScrollTrigger.batch() for repeated elements.** Event cards and gallery images use `ScrollTrigger.batch()` instead of individual ScrollTrigger instances, reducing the number of active scroll listeners.

7. **Max element counts for ambient animations:**
   - Stars: 6 maximum
   - Petals: 5 maximum
   - These are hard limits to prevent compositor layer bloat.

8. **Video: `preload="metadata"`**, not `"auto"`. Poster image required. `canplay` event listener to retry `play()`. Fallback timer to show text if video fails to load.

9. **No global style injections.** All CSS is scoped under `.tj-` prefixed classes. No `:root` overrides, no unscoped `*` selectors, no `body` modifications.

10. **Transform-only scroll reveals.** All scroll reveal animations use `opacity` and `scale` (transform) — compositor-friendly properties. No `width`, `height`, `top`, `left`, or layout-triggering properties.

### GSAP Cleanup Pattern

```js
// Template root component
const containerRef = useRef(null);

useGSAP(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (isEditMode || prefersReducedMotion) {
    // Set final states, return early — no animations registered
    return;
  }

  // All GSAP animations created here are automatically
  // cleaned up (reverted) when the component unmounts.
  // ScrollTrigger instances created here are also killed.

  // Opening timeline...
  // Scroll reveals...
  // Interaction animations via contextSafe...

}, { scope: containerRef });
```

### ScrollTrigger Creation Order

ScrollTriggers are created in top-to-bottom page order (Opening first, Closing last) so that `refreshPriority` is not needed. If any triggers are created asynchronously (e.g., after images load), call `ScrollTrigger.refresh()` once after all are registered.

---

## Animation Summary Table

| Section | GSAP Animations | CSS Animations | Scroll-Triggered |
|---------|----------------|----------------|-----------------|
| Opening | Entrance timeline (8 steps) | Moon glow, star twinkle, gold shimmer, scroll pulse | No |
| Couple | Arch scale reveal, rose fade-in, arch stroke draw | None | Yes (once) |
| Dua | Text opacity, rule scaleX | None | Yes (once) |
| Countdown | Unit scale+opacity reveal | Digit slide transition (CSS) | Yes (once) |
| Celebrations | Card batch reveal | None | Yes (once) |
| RSVP | Panel scale, field stagger, form-to-confirmation | Button/input transitions (CSS) | Yes (once) |
| Gallery | Image batch reveal, lightbox open/close | None | Yes (once) |
| Closing | Dome fade, crescent scale, text reveals | Petal drift | Yes (once) |

---

*This motion plan is the implementation guide for all Taj template animations. Refer to `design-bible.md` for token values and `section-blueprints.md` for layout context.*

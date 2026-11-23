# Ivory Nikah — Motion Plan

Complete animation specification for the Ivory Nikah template. Every duration, easing curve, and pixel value in this document is implementation-ready. GSAP handles all orchestrated and scroll-linked animation; CSS handles simple looping ambient effects.

---

## 1. Opening Entrance Timeline

The cinematic door-open sequence is the emotional hook of the invitation. Two Mughal palace doors swing outward from their hinge edges, revealing the Bismillah, couple names, and wedding date behind them. This plays once on page load.

### 1.1 Scene Setup (Initial States)

Before the timeline plays, every element in the opening section must be at its starting position:

```javascript
// Initial states — set immediately, before any animation
gsap.set('.in-door--left', {
  rotateY: 0,
  transformOrigin: 'left center',
  transformPerspective: 800,
  zIndex: 10,
  willChange: 'transform',
});

gsap.set('.in-door--right', {
  rotateY: 0,
  transformOrigin: 'right center',
  transformPerspective: 800,
  zIndex: 10,
  willChange: 'transform',
});

gsap.set('.in-opening__bismillah', { opacity: 0 });
gsap.set('.in-opening__divider', { opacity: 0 });
gsap.set('.in-opening__bride-name', { opacity: 0 });
gsap.set('.in-opening__ampersand', { opacity: 0 });
gsap.set('.in-opening__groom-name', { opacity: 0 });
gsap.set('.in-opening__date', { opacity: 0 });
```

Doors are fully closed (rotateY: 0), covering the arch interior. All text content behind the doors is invisible.

### 1.2 Full Timeline

```javascript
const doorOpenTl = gsap.timeline({
  paused: true,
  defaults: { ease: 'power2.out' },
  onComplete: () => {
    // Clean up will-change after animation completes
    gsap.set('.in-door--left, .in-door--right', {
      willChange: 'auto',
      zIndex: -1,
    });
  },
});

doorOpenTl
  // --- PHASE 1: Door swing (0ms - 2000ms) ---
  .to('.in-door--left', {
    rotateY: -92,              // Slightly past 90 so edge disappears
    duration: 2.0,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',  // --in-ease-door-open
  }, 0)
  .to('.in-door--right', {
    rotateY: 92,
    duration: 2.0,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  }, 0)

  // --- PHASE 2: Bismillah reveal (800ms - 1400ms) ---
  // Appears when doors are ~40% open
  .to('.in-opening__bismillah', {
    opacity: 1,
    duration: 0.6,
    ease: 'power1.out',
  }, 0.8)

  // --- PHASE 3: Gold divider reveal (1000ms - 1400ms) ---
  .to('.in-opening__divider', {
    opacity: 1,
    duration: 0.4,
    ease: 'power1.out',
  }, 1.0)

  // --- PHASE 4: Bride name reveal (1200ms - 1800ms) ---
  // Appears when doors are ~60% open
  .to('.in-opening__bride-name', {
    opacity: 1,
    duration: 0.6,
    ease: 'power1.out',
  }, 1.2)

  // --- PHASE 5: Ampersand reveal (1400ms - 1900ms) ---
  .to('.in-opening__ampersand', {
    opacity: 1,
    duration: 0.5,
    ease: 'power1.out',
  }, 1.4)

  // --- PHASE 6: Groom name reveal (1500ms - 2100ms) ---
  .to('.in-opening__groom-name', {
    opacity: 1,
    duration: 0.6,
    ease: 'power1.out',
  }, 1.5)

  // --- PHASE 7: Date reveal (1800ms - 2400ms) ---
  // Appears when doors are ~80% open
  .to('.in-opening__date', {
    opacity: 1,
    duration: 0.6,
    ease: 'power1.out',
  }, 1.8)

  // --- PHASE 8: Doors fade out (2000ms - 2400ms) ---
  // Doors have swung past 90deg; fade them to invisible
  .to('.in-door--left, .in-door--right', {
    opacity: 0,
    duration: 0.4,
    ease: 'power1.out',
  }, 2.0);
```

### 1.3 Playback Trigger

```javascript
// Start the door sequence 300ms after page load
// Use a setTimeout wrapped in useGSAP for React context safety
setTimeout(() => {
  doorOpenTl.play();
}, 300);
```

### 1.4 Timeline Summary

| Time (ms) | Event | Duration | Easing |
|-----------|-------|----------|--------|
| 0 | Doors begin swinging outward | 2000ms | cubic-bezier(0.16, 1, 0.3, 1) |
| 800 | Bismillah fades in | 600ms | power1.out |
| 1000 | Gold divider fades in | 400ms | power1.out |
| 1200 | Bride name fades in | 600ms | power1.out |
| 1400 | Ampersand fades in | 500ms | power1.out |
| 1500 | Groom name fades in | 600ms | power1.out |
| 1800 | Date fades in | 600ms | power1.out |
| 2000 | Doors fade to invisible | 400ms | power1.out |
| 2400 | All complete. Doors z-index set to -1, will-change removed. | - | - |

Total sequence duration: **2.4 seconds** from first door movement to final state.

---

## 2. Scroll Reveal Strategy

Every section (except the Opening, which uses the door timeline) reveals its content via opacity-only fade as it enters the viewport. **No translateY, no translateX, no scale** -- opacity only. This is a hard rule because translate transforms break drag positioning in edit mode.

### 2.1 Global Configuration

```javascript
gsap.registerPlugin(ScrollTrigger);

const REVEAL_DURATION = 0.8;   // 800ms
const REVEAL_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // --in-ease-elegant
const REVEAL_STAGGER = 0.12;   // 120ms between child elements
```

### 2.2 Per-Section ScrollTrigger Configuration

**Section 2: Couple & Family**

```javascript
// Main section container fades in
gsap.from('.in-section--couple .in-section__content', {
  opacity: 0,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--couple',
    start: 'top 80%',     // Section 20% visible
    toggleActions: 'play none none none',
    once: true,
  },
});

// Child elements stagger in after container
gsap.from('.in-section--couple .in-reveal-child', {
  opacity: 0,
  duration: 0.6,
  ease: REVEAL_EASE,
  stagger: REVEAL_STAGGER,
  scrollTrigger: {
    trigger: '.in-section--couple',
    start: 'top 75%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

Reveal sequence for children (each tagged with `.in-reveal-child`):
1. "Together with their families" text
2. Divider B
3. Bride's parents
4. Invitation text block
5. Bride full name
6. "to" connector
7. Groom full name
8. Groom's parents

Stagger: 8 elements x 120ms = 960ms total cascade. Combined with the 600ms per-element fade, the full section reveal completes in ~1560ms.

---

**Section 3: Dua / Blessing**

```javascript
gsap.from('.in-section--dua .in-section__content', {
  opacity: 0,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--dua',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});

// Staggered child reveals
gsap.from('.in-section--dua .in-reveal-child', {
  opacity: 0,
  duration: 0.7,
  ease: REVEAL_EASE,
  stagger: 0.15,        // Slightly slower stagger for reverence
  scrollTrigger: {
    trigger: '.in-section--dua',
    start: 'top 75%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

Reveal sequence:
1. "Blessing" label with flanking rules
2. Arabic verse
3. Divider B
4. English translation
5. Surah attribution
6. Gold diamond marker

Stagger: 6 elements x 150ms = 900ms cascade. Slightly slower pacing befits the contemplative section.

---

**Section 4: Celebrations**

```javascript
// Section title + divider reveal first
gsap.from('.in-section--celebrations .in-section__header', {
  opacity: 0,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--celebrations',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});

// Each card reveals as it enters viewport individually
// Using ScrollTrigger.batch for the cards
ScrollTrigger.batch('.in-celebration-card', {
  start: 'top 85%',
  once: true,
  onEnter: (cards) => {
    gsap.from(cards, {
      opacity: 0,
      duration: 0.7,
      ease: REVEAL_EASE,
      stagger: 0.2,
    });
  },
});

// Card internal content staggers after card appears
// Each card's children reveal in sequence
document.querySelectorAll('.in-celebration-card').forEach((card) => {
  gsap.from(card.querySelectorAll('.in-reveal-child'), {
    opacity: 0,
    duration: 0.5,
    ease: REVEAL_EASE,
    stagger: 0.08,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%',
      toggleActions: 'play none none none',
      once: true,
    },
  });
});
```

Per-card child reveal sequence:
1. Floral corner ornaments (all 4 simultaneously)
2. Event name
3. Mini divider
4. Date
5. Time
6. Venue
7. Address

Card-to-card stagger: 200ms. Cards may be on-screen simultaneously (on longer viewports), so ScrollTrigger.batch handles the grouping gracefully.

---

**Section 5: Countdown**

```javascript
gsap.from('.in-section--countdown .in-section__content', {
  opacity: 0,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--countdown',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});

// Countdown units stagger in
gsap.from('.in-countdown__unit', {
  opacity: 0,
  duration: 0.5,
  ease: REVEAL_EASE,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.in-countdown',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

Reveal sequence:
1. Intro text ("The celebration begins in")
2. Days unit
3. Hours unit
4. Minutes unit
5. Seconds unit
6. Target date
7. Divider

Units stagger: 4 x 100ms = 400ms. Fast cascade for excitement.

---

**Section 6: RSVP**

```javascript
gsap.from('.in-section--rsvp .in-section__content', {
  opacity: 0,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--rsvp',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});

// Form card reveals as a single unit
gsap.from('.in-rsvp-card', {
  opacity: 0,
  duration: 0.7,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-rsvp-card',
    start: 'top 85%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

The RSVP form card reveals as a single unit (not staggered fields) because staggering form fields can feel disorienting when the user wants to interact immediately.

---

**Section 7: Closing**

```javascript
gsap.from('.in-section--closing .in-section__content', {
  opacity: 0,
  duration: 1.0,           // Slower — the farewell lingers
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: '.in-section--closing',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
});

gsap.from('.in-section--closing .in-reveal-child', {
  opacity: 0,
  duration: 0.7,
  ease: REVEAL_EASE,
  stagger: 0.15,
  scrollTrigger: {
    trigger: '.in-section--closing',
    start: 'top 75%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

Reveal sequence:
1. "With love & prayers"
2. Couple names
3. Divider A
4. Closing message
5. Hashtag

---

### 2.3 Divider Reveals

Dividers between sections also reveal on scroll, but with their own trigger (they sit in the gap between sections):

```javascript
gsap.utils.toArray('.in-divider').forEach((divider) => {
  gsap.from(divider, {
    opacity: 0,
    duration: 0.6,
    ease: REVEAL_EASE,
    scrollTrigger: {
      trigger: divider,
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true,
    },
  });
});
```

### 2.4 Vine Border Reveals

Vine borders (Sections 2, 7) reveal with the section, slightly delayed:

```javascript
gsap.from('.in-vine-border', {
  opacity: 0,
  duration: 1.0,
  ease: REVEAL_EASE,
  scrollTrigger: {
    trigger: (self) => self.trigger.closest('.in-section'),
    start: 'top 70%',
    toggleActions: 'play none none none',
    once: true,
  },
});
```

---

## 3. PNG Animation Specifications

All 13 jasmine petal instances translated from `png-choreography.md` into exact GSAP configurations. Each petal uses the MotionPath plugin for organic curved trajectories.

```javascript
gsap.registerPlugin(MotionPathPlugin);
```

### 3.1 Petal C-1 (Section 2: Couple)

```javascript
{
  id: 'C-1',
  asset: 'petal-2.png',
  type: 'gentle-drift',
  element: {
    className: 'in-petal in-petal--c1',
    width: 48,
    initialPosition: { top: '8%', left: '78%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: -40, y: '35%' },
        { x: 40, y: '65%' },
        { x: -52, y: '100%' },
      ],
      curviness: 1.5,
      autoRotate: false,
    },
    rotation: -45,
    duration: 18,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.65, duration: 2 },
      { opacity: 0.65, duration: 12 },
      { opacity: 0, duration: 2 },
    ],
    // Implemented as a parallel tween synced to the same timeline
  },
  scrollTrigger: {
    trigger: '.in-section--couple',
    start: 'top 90%',
    end: 'bottom 10%',
    onEnter: 'play',
    onLeave: 'pause',
    onEnterBack: 'play',
    onLeaveBack: 'pause',
  },
  delay: 0,
}
```

### 3.2 Petal C-2 (Section 2: Couple)

```javascript
{
  id: 'C-2',
  asset: 'petal-1.png',
  type: 'spiral-descent',
  element: {
    className: 'in-petal in-petal--c2',
    width: 32,
    initialPosition: { top: '15%', left: '12%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 25, y: '20%' },
        { x: -25, y: '50%' },
        { x: 20, y: '70%' },
        { x: -20, y: '90%' },
        { x: 40, y: '100%' },
      ],
      curviness: 1.2,
      autoRotate: false,
    },
    rotation: 180,
    duration: 22,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.55, duration: 3 },
      { opacity: 0.55, duration: 14 },
      { opacity: 0, duration: 2 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--couple',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 4,
}
```

### 3.3 Petal C-3 (Section 2: Couple)

```javascript
{
  id: 'C-3',
  asset: 'petal-5.png',
  type: 'leaf-drift',
  element: {
    className: 'in-petal in-petal--c3',
    width: 40,
    initialPosition: { top: '35%', left: '85%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: -55, y: '30%' },
        { x: 55, y: '70%' },
        { x: -52, y: '100%' },
      ],
      curviness: 2.0,
      autoRotate: false,
    },
    rotation: 15,           // Rocking rotation handled by child tween
    duration: 26,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  rotationTween: {
    // Separate yoyo tween for rocking motion
    rotation: '+=30',       // -15 to +15 (rock)
    duration: 3.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.5, duration: 3 },
      { opacity: 0.5, duration: 17 },
      { opacity: 0, duration: 3 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--couple',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 8,
}
```

### 3.4 Petal E-1 (Section 4: Celebrations)

```javascript
{
  id: 'E-1',
  asset: 'petal-3.png',
  type: 'quick-flutter',
  element: {
    className: 'in-petal in-petal--e1',
    width: 28,
    initialPosition: { top: '3%', left: '70%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 18, y: '12%' },
        { x: -18, y: '24%' },
        { x: 18, y: '36%' },
        { x: -18, y: '48%' },
        { x: -60, y: '100%' },
      ],
      curviness: 0.5,       // Low curviness for zigzag sharpness
      autoRotate: false,
    },
    rotation: 270,
    duration: 12,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.6, duration: 1.5 },
      { opacity: 0.6, duration: 7.5 },
      { opacity: 0, duration: 1.5 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--celebrations',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 0,
}
```

### 3.5 Petal E-2 (Section 4: Celebrations)

```javascript
{
  id: 'E-2',
  asset: 'petal-4.png',
  type: 'weighted-float',
  element: {
    className: 'in-petal in-petal--e2',
    width: 44,
    initialPosition: { top: '20%', left: '15%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 0, y: '15%' },
        { x: -30, y: '30%' },
        { x: -10, y: '55%' },
        { x: 15, y: '75%' },
        { x: 52, y: '100%' },
      ],
      curviness: 1.3,
      autoRotate: false,
    },
    rotation: -20,
    duration: 20,
    ease: 'sine.inOut',     // Slight easing for weighted feel
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.7, duration: 2 },
      { opacity: 0.7, duration: 14 },
      { opacity: 0, duration: 2 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--celebrations',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 3,
}
```

### 3.6 Petal E-3 (Section 4: Celebrations)

```javascript
{
  id: 'E-3',
  asset: 'petal-1.png',
  type: 'spiral-descent',
  element: {
    className: 'in-petal in-petal--e3',
    width: 36,
    initialPosition: { top: '40%', left: '82%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 35, y: '15%' },
        { x: -35, y: '40%' },
        { x: 20, y: '65%' },
        { x: -56, y: '100%' },
      ],
      curviness: 1.2,
      autoRotate: false,
    },
    rotation: -120,
    duration: 16,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.6, duration: 2 },
      { opacity: 0.6, duration: 10 },
      { opacity: 0, duration: 2 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--celebrations',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 7,
}
```

### 3.7 Petal E-4 (Section 4: Celebrations)

```javascript
{
  id: 'E-4',
  asset: 'petal-2.png',
  type: 'gentle-drift',
  element: {
    className: 'in-petal in-petal--e4',
    width: 52,
    initialPosition: { top: '65%', left: '8%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 45, y: '35%' },
        { x: 20, y: '65%' },
        { x: 48, y: '100%' },
      ],
      curviness: 1.5,
      autoRotate: false,
    },
    rotation: -30,
    duration: 24,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.55, duration: 3 },
      { opacity: 0.55, duration: 15 },
      { opacity: 0, duration: 3 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--celebrations',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 5,
}
```

### 3.8 Petal D-1 (Section 5: Countdown)

```javascript
{
  id: 'D-1',
  asset: 'petal-4.png',
  type: 'weighted-float',
  element: {
    className: 'in-petal in-petal--d1',
    width: 36,
    initialPosition: { top: '10%', left: '88%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 0, y: '15%' },
        { x: -20, y: '35%' },
        { x: 10, y: '60%' },
        { x: -40, y: '100%' },
      ],
      curviness: 1.3,
      autoRotate: false,
    },
    rotation: -15,
    duration: 20,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.5, duration: 2 },
      { opacity: 0.5, duration: 14 },
      { opacity: 0, duration: 2 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--countdown',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 2,
}
```

### 3.9 Petal D-2 (Section 5: Countdown)

```javascript
{
  id: 'D-2',
  asset: 'petal-5.png',
  type: 'leaf-drift',
  element: {
    className: 'in-petal in-petal--d2',
    width: 30,
    initialPosition: { top: '25%', left: '5%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 30, y: '30%' },
        { x: -15, y: '65%' },
        { x: 40, y: '100%' },
      ],
      curviness: 2.0,
      autoRotate: false,
    },
    rotation: 10,
    duration: 28,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  rotationTween: {
    rotation: '+=20',       // -10 to +10 (rock)
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.45, duration: 3 },
      { opacity: 0.45, duration: 19 },
      { opacity: 0, duration: 3 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--countdown',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 10,
}
```

### 3.10 Petal R-1 (Section 6: RSVP)

```javascript
{
  id: 'R-1',
  asset: 'petal-1.png',
  type: 'spiral-descent',
  element: {
    className: 'in-petal in-petal--r1',
    width: 34,
    initialPosition: { top: '5%', left: '90%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 22, y: '18%' },
        { x: -22, y: '45%' },
        { x: 15, y: '70%' },
        { x: -40, y: '100%' },
      ],
      curviness: 1.2,
      autoRotate: false,
    },
    rotation: 150,
    duration: 18,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.5, duration: 2 },
      { opacity: 0.5, duration: 12 },
      { opacity: 0, duration: 2 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--rsvp',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  keepClearZone: {
    // Petal stays right of form card: left 80%-100% of section
    note: 'Path constrained to left: 80%-100% of section width',
  },
  delay: 4,
}
```

### 3.11 Petal R-2 (Section 6: RSVP)

```javascript
{
  id: 'R-2',
  asset: 'petal-3.png',
  type: 'quick-flutter',
  element: {
    className: 'in-petal in-petal--r2',
    width: 24,
    initialPosition: { top: '30%', left: '4%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 14, y: '15%' },
        { x: -14, y: '30%' },
        { x: 14, y: '45%' },
        { x: 16, y: '100%' },
      ],
      curviness: 0.5,
      autoRotate: false,
    },
    rotation: -200,
    duration: 14,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.5, duration: 1.5 },
      { opacity: 0.5, duration: 9.5 },
      { opacity: 0, duration: 1.5 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--rsvp',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  keepClearZone: {
    note: 'Path constrained to left: 0%-10% of section width',
  },
  delay: 9,
}
```

### 3.12 Petal G-1 (Section 7: Closing)

```javascript
{
  id: 'G-1',
  asset: 'petal-4.png',
  type: 'weighted-float',
  element: {
    className: 'in-petal in-petal--g1',
    width: 42,
    initialPosition: { top: '5%', left: '75%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 0, y: '12%' },
        { x: -40, y: '35%' },
        { x: -20, y: '60%' },
        { x: -60, y: '100%' },
      ],
      curviness: 1.3,
      autoRotate: false,
    },
    rotation: -25,
    duration: 24,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.5, duration: 3 },
      { opacity: 0.5, duration: 15 },
      { opacity: 0, duration: 3 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--closing',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 2,
}
```

### 3.13 Petal G-2 (Section 7: Closing)

```javascript
{
  id: 'G-2',
  asset: 'petal-2.png',
  type: 'gentle-drift',
  element: {
    className: 'in-petal in-petal--g2',
    width: 38,
    initialPosition: { top: '20%', left: '18%' },
    zIndex: 5,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  gsap: {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 25, y: '30%' },
        { x: -10, y: '60%' },
        { x: 48, y: '100%' },
      ],
      curviness: 1.5,
      autoRotate: false,
    },
    rotation: -35,
    duration: 26,
    ease: 'none',
    repeat: -1,
    yoyo: false,
  },
  opacity: {
    keyframes: [
      { opacity: 0, duration: 0 },
      { opacity: 0.45, duration: 3 },
      { opacity: 0.45, duration: 17 },
      { opacity: 0, duration: 3 },
    ],
  },
  scrollTrigger: {
    trigger: '.in-section--closing',
    start: 'top 90%',
    end: 'bottom 10%',
  },
  delay: 6,
}
```

---

## 4. Motion Path Definitions

Concrete SVG path data for each motion type. These are relative to the petal's spawn position (0,0 origin). Vertical values use section-relative percentages; the implementation must convert `%h` to actual pixel values based on the section's rendered height at runtime.

### 4.1 Spiral Descent Path

Used by: C-2, E-3, R-1 (petal-1.png instances)

```svg
<!-- Relative to spawn. Double S-curve with lateral weave. -->
<!-- For a section ~800px tall: -->
<path d="M 0,0
         C 25,160  -25,400  5,440
         C 20,540  -20,680  10,800"
      fill="none" />
```

GSAP MotionPath equivalent:
```javascript
{
  path: [
    { x: 0, y: 0 },
    { x: 25, y: 160 },
    { x: -25, y: 400 },
    { x: 5, y: 440 },
    { x: 20, y: 540 },
    { x: -20, y: 680 },
    { x: 10, y: 800 },
  ],
  curviness: 1.2,
}
```

Character: The petal weaves left-right as it descends. The 25px lateral offset creates visible oscillation without exaggeration. The curviness of 1.2 softens the control points into smooth S-curves rather than sharp zigzags.

### 4.2 Gentle Drift Path

Used by: C-1, E-4, G-2 (petal-2.png instances)

```svg
<!-- Wide lazy S-curve. Wind-blown quality. -->
<!-- For a section ~800px tall: -->
<path d="M 0,0
         C -40,280  40,520  -20,800"
      fill="none" />
```

GSAP MotionPath equivalent:
```javascript
{
  path: [
    { x: 0, y: 0 },
    { x: -40, y: 280 },
    { x: 40, y: 520 },
    { x: -20, y: 800 },
  ],
  curviness: 1.5,
}
```

Character: A single wide S-curve. The broad petal-2 shape catches the eye, so the path is simple and unhurried. The 40px offset creates a lazy, wind-blown quality. The higher curviness (1.5) produces very smooth, organic arcs.

### 4.3 Quick Flutter Path

Used by: E-1, R-2 (petal-3.png instances)

```svg
<!-- Tight zigzag. Rapid tumbling. -->
<!-- For a section ~800px tall: -->
<path d="M 0,0
         L 18,96   L -18,192
         L 18,288  L -18,384
         L 0,800"
      fill="none" />
```

GSAP MotionPath equivalent:
```javascript
{
  path: [
    { x: 0, y: 0 },
    { x: 18, y: 96 },
    { x: -18, y: 192 },
    { x: 18, y: 288 },
    { x: -18, y: 384 },
    { x: 0, y: 800 },
  ],
  curviness: 0.5,
}
```

Character: Tight zigzag with minimal curvature smoothing (0.5). The narrow crescent petal-3 tumbles rapidly through this path with fast rotation, simulating a light petal caught in a draft. The 18px oscillation is tight and energetic.

### 4.4 Weighted Float Path

Used by: E-2, D-1, G-1 (petal-4.png instances)

```svg
<!-- Soft curve with gravity. Steady and unhurried. -->
<!-- For a section ~800px tall: -->
<path d="M 0,0
         C 0,120  -30,240  -15,360
         Q 0,560  20,800"
      fill="none" />
```

GSAP MotionPath equivalent:
```javascript
{
  path: [
    { x: 0, y: 0 },
    { x: 0, y: 120 },
    { x: -30, y: 240 },
    { x: -15, y: 360 },
    { x: 0, y: 560 },
    { x: 20, y: 800 },
  ],
  curviness: 1.3,
}
```

Character: A soft curve with slight horizontal drift. The cupped petal-4 shape has visual weight, so the path suggests gravity. The initial vertical drop (0,0 to 0,120) feels like a pause before lateral drift begins. Curviness 1.3 keeps arcs natural.

### 4.5 Leaf Drift Path

Used by: C-3, D-2 (petal-5.png instances)

```svg
<!-- Widest arc. Rocking, slow descent. -->
<!-- For a section ~800px tall: -->
<path d="M 0,0
         C -55,240  55,560  -20,800"
      fill="none" />
```

GSAP MotionPath equivalent:
```javascript
{
  path: [
    { x: 0, y: 0 },
    { x: -55, y: 240 },
    { x: 55, y: 560 },
    { x: -20, y: 800 },
  ],
  curviness: 2.0,
}
```

Character: The widest S-curve arc (55px offset). Combined with the rocking yoyo rotation tween, this simulates a flat leaf descending through still air. Curviness 2.0 produces the most exaggerated organic curves of any motion type -- appropriate for the slowest, most graceful petal.

---

## 5. CSS Keyframe Definitions

Ambient CSS animations for effects that loop continuously and do not require GSAP orchestration. These use pure CSS for minimal overhead.

### 5.1 Warm Light Shift

A barely perceptible brightness oscillation simulating sunlight moving across marble surfaces. Applied to background/decorative layers only, never to text.

```css
@keyframes in-warm-light {
  0% {
    filter: brightness(1.0);
  }
  50% {
    filter: brightness(1.02);
  }
  100% {
    filter: brightness(1.0);
  }
}

.in-section--couple .in-section__bg,
.in-section--dua .in-section__bg,
.in-section--closing .in-section__bg {
  animation: in-warm-light 12s ease-in-out infinite;
}
```

- **Duration:** 12 seconds per cycle
- **Easing:** ease-in-out (smooth sinusoidal)
- **Brightness range:** 1.0 to 1.02 (2% variation -- felt, not seen)
- **Applied to:** Background pseudo-elements on Type A (Ivory) and Type B (Warm Glow) sections
- **Never applied to:** Text elements, form fields, buttons, or card surfaces

### 5.2 Gold Shimmer

A subtle luminosity pulse on gold decorative elements -- dividers, corner ornament borders, and the arch frame trim. Simulates the way burnished metal catches changing light.

```css
@keyframes in-gold-shimmer {
  0% {
    opacity: 1;
  }
  40% {
    opacity: 0.85;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

.in-gold-rule,
.in-divider__dot {
  animation: in-gold-shimmer 8s ease-in-out infinite;
}

/* Stagger the dots so they don't pulse in unison */
.in-divider__dot:nth-child(2) {
  animation-delay: 0.4s;
}
.in-divider__dot:nth-child(3) {
  animation-delay: 0.8s;
}
```

- **Duration:** 8 seconds per cycle
- **Opacity range:** 0.85 to 1.0 (15% variation)
- **Applied to:** Gold tapered rules, divider dots
- **Stagger on dots:** 400ms between each dot for a traveling shimmer effect

### 5.3 Ornament Breathing

Floral corner ornaments and vine borders have a very gentle scale pulse, as if the carved stone is slowly expanding and contracting with the building's breath.

```css
@keyframes in-ornament-breathe {
  0% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(1.008);
  }
  100% {
    transform: scale(1.0);
  }
}

.in-floral-corner {
  animation: in-ornament-breathe 16s ease-in-out infinite;
  transform-origin: center center;
}

/* Vine borders breathe even slower */
.in-vine-border img {
  animation: in-ornament-breathe 20s ease-in-out infinite;
  transform-origin: center center;
}
```

- **Duration:** 16s for corners, 20s for vine borders
- **Scale range:** 1.0 to 1.008 (0.8% -- completely subliminal)
- **Transform-origin:** center center (breathes from the middle)
- **No layout impact:** Uses transform: scale only

### 5.4 Jali Lattice Subtle Drift

The jali lattice background texture shifts its position imperceptibly over time, preventing the tiled pattern from feeling static.

```css
@keyframes in-jali-drift {
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 200px 200px;
  }
}

.in-section--jali::before {
  animation: in-jali-drift 120s linear infinite;
}
```

- **Duration:** 120 seconds (2 minutes for one full tile cycle)
- **Easing:** linear (constant, imperceptible movement)
- **Distance:** One full tile repeat (200px x 200px), creating seamless loop
- **Applied to:** Jali overlay pseudo-elements on Sections 3, 5, and 6

---

## 6. Interaction Animations

### 6.1 Button Hover / Active States

The "Send Response" submit button uses CSS transitions (not GSAP) for instant response:

```css
.in-button {
  transition:
    background-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 100ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Hover: darken gold, add warm glow */
.in-button:hover {
  background-color: #B8953F;
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
}

/* Active: further darken, micro press-down */
.in-button:active {
  background-color: #A88535;
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.1);
  transform: scale(0.98);
}

/* Focus-visible for keyboard navigation */
.in-button:focus-visible {
  outline: 2px solid var(--in-gold);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px rgba(201, 168, 76, 0.15);
}
```

- **Hover transition:** 200ms on background-color and box-shadow
- **Active press:** 100ms scale to 0.98 (subtle physical press)
- **Focus ring:** 2px gold outline with 3px offset for keyboard accessibility

### 6.2 Form Field Focus Transitions

```css
.in-input {
  transition:
    border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

.in-input:focus {
  outline: none;
  border-color: var(--in-gold);    /* #C9A84C */
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
}

/* Textarea grows its focus glow slightly wider */
.in-textarea:focus {
  box-shadow: 0 0 0 4px rgba(201, 168, 76, 0.10);
}
```

- **Transition duration:** 200ms
- **Focus border:** Changes from gold-light (#E0CFA0) to full gold (#C9A84C)
- **Focus ring:** 3px transparent gold glow (12% opacity) -- warm, not electric
- **No movement or scale** on focus -- form fields must stay perfectly still for typing

### 6.3 RSVP Attendance Toggle Transition

The "Joyfully Accept" / "Regretfully Decline" toggle has a selection slide:

```css
.in-toggle-option {
  transition:
    background-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1),
    color 250ms cubic-bezier(0.25, 0.1, 0.25, 1),
    border-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

.in-toggle-option--selected {
  background-color: var(--in-gold);
  color: var(--in-cream-bright);
  border-color: var(--in-gold);
}

/* Unselected option on hover */
.in-toggle-option:not(.in-toggle-option--selected):hover {
  background-color: rgba(201, 168, 76, 0.06);
}
```

- **Transition duration:** 250ms (slightly slower than button for a considered, deliberate feel)
- **Selected state:** Background fills to gold, text inverts to cream
- **Unselected hover:** 6% gold tint on background (whisper-level acknowledgment)
- **No transform animations** -- the toggle is purely color-based

### 6.4 Celebration Card Hover (Desktop Only)

On desktop viewports (768px+), celebration event cards respond to hover with a subtle lift:

```css
@media (min-width: 768px) and (hover: hover) {
  .in-celebration-card {
    transition:
      box-shadow 300ms cubic-bezier(0.25, 0.1, 0.25, 1),
      transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .in-celebration-card:hover {
    box-shadow: 0 4px 24px rgba(61, 43, 31, 0.12);   /* --in-shadow-deep */
    transform: translateY(-2px);
  }
}
```

- **Lift distance:** 2px translateY (barely perceptible physical lift)
- **Shadow deepens** from raised (2px blur) to deep (24px blur)
- **Duration:** 300ms
- **Desktop only:** Guarded by `hover: hover` media query. No hover effects on touch.

---

## 7. Reduced Motion Strategy

When the user has `prefers-reduced-motion: reduce` enabled, all animation is disabled. The invitation must be fully readable and functional as a static layout.

### 7.1 CSS Reduced Motion Rules

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all CSS animations */
  .in-page *,
  .in-page *::before,
  .in-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Remove all floating petals */
  .in-petal {
    display: none !important;
  }

  /* Doors start in open/hidden state */
  .in-door--left,
  .in-door--right {
    opacity: 0 !important;
    z-index: -1 !important;
  }

  /* All content visible immediately */
  .in-opening__bismillah,
  .in-opening__divider,
  .in-opening__bride-name,
  .in-opening__ampersand,
  .in-opening__groom-name,
  .in-opening__date,
  .in-section__content,
  .in-reveal-child,
  .in-celebration-card,
  .in-rsvp-card,
  .in-vine-border,
  .in-divider {
    opacity: 1 !important;
  }
}
```

### 7.2 GSAP Reduced Motion Check

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Do not create any GSAP timelines, tweens, or ScrollTriggers.
  // Set all elements to their final visible state.
  gsap.set('.in-door--left, .in-door--right', { opacity: 0, zIndex: -1 });
  gsap.set([
    '.in-opening__bismillah',
    '.in-opening__divider',
    '.in-opening__bride-name',
    '.in-opening__ampersand',
    '.in-opening__groom-name',
    '.in-opening__date',
  ], { opacity: 1 });
  // All section content already visible via CSS rule above.
  // No ScrollTriggers created. No petal timelines created.
  // The page is a fully static, readable document.
  return;
}
```

### 7.3 What Changes in Reduced Motion

| Feature | Normal | Reduced Motion |
|---------|--------|----------------|
| Door opening | 2.4s cinematic sequence | Doors hidden, content visible |
| Scroll reveals | Opacity fade per section | All content visible immediately |
| Floating petals | 13 animated instances | `display: none` on all |
| Warm light shift | 12s CSS animation loop | Disabled (static brightness) |
| Gold shimmer | 8s CSS animation loop | Disabled (static opacity) |
| Ornament breathing | 16-20s CSS animation loop | Disabled (static scale) |
| Jali drift | 120s CSS animation loop | Disabled (static position) |
| Button hover/active | 200ms transitions | Instant state changes |
| Toggle transition | 250ms transitions | Instant state changes |
| Countdown tick | Number updates | Number updates (still works, no visual transition) |

### 7.4 Dynamic Preference Change

Listen for runtime changes in case the user toggles reduced motion while viewing:

```javascript
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

motionQuery.addEventListener('change', (event) => {
  if (event.matches) {
    // User just enabled reduced motion
    // Kill all active GSAP tweens and ScrollTriggers
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach((st) => st.kill());
    // Set all content to visible
    gsap.set('.in-section__content, .in-reveal-child', { opacity: 1 });
    // CSS handles hiding petals and disabling animations via the media query
  }
  // If they disable reduced motion mid-session, we do NOT restart animations.
  // The page remains static. This avoids jarring surprise animation.
});
```

---

## 8. Performance Budget

### 8.1 Hard Limits

| Metric | Budget | Rationale |
|--------|--------|-----------|
| Max concurrent GSAP tweens per section | 20 | Prevents compositor overload on low-end devices |
| Max animated PNG elements total | 13 | All petal instances combined (hard ceiling: 15) |
| Max animated elements per section | 4 petals + section reveal tweens | Celebrations section hits this max |
| Max simultaneous `will-change` elements | 13 petals + 2 doors (during opening) = 15 | Doors drop `will-change` after animation |
| GPU layers promoted | 15 max at any time | Each petal = 1 layer. Doors = 2 during opening. |
| Layout-triggering properties animated | 0 | Only `transform` and `opacity`. No width, height, top, left, margin. |
| requestAnimationFrame manual loops | 0 | GSAP handles all animation frames internally |

### 8.2 Property Restrictions

**Allowed animated properties:**
- `transform` (translateX, translateY, rotate, scale via GSAP shorthand x, y, rotation, scale)
- `opacity`
- `filter: brightness()` (CSS only, on background layers -- compositor-friendly)

**Prohibited animated properties:**
- `top`, `left`, `right`, `bottom` (layout thrash)
- `width`, `height` (layout thrash)
- `margin`, `padding` (layout thrash)
- `background-position` on scroll (EXCEPT the 120s jali drift, which is CSS-only and too slow to cause jank)
- `box-shadow` animation (paint-heavy; only transition on hover, which is acceptable)

### 8.3 Off-Screen Pausing Strategy

Every petal animation is controlled by a ScrollTrigger scoped to its parent section:

```javascript
// Applied to each petal timeline
ScrollTrigger.create({
  trigger: sectionElement,
  start: 'top 90%',
  end: 'bottom 10%',
  onEnter: () => petalTimeline.play(),
  onLeave: () => petalTimeline.pause(),
  onEnterBack: () => petalTimeline.play(),
  onLeaveBack: () => petalTimeline.pause(),
});
```

When a section is not visible:
- All its petal GSAP timelines are **paused** (zero CPU/GPU cost)
- CSS animations continue but have no visual impact (off-screen)
- ScrollTrigger reveal tweens are `once: true` and self-dispose after firing

### 8.4 will-change Lifecycle

```
Page load:
  - Doors: will-change: transform (set in initial state)
  - Petals: will-change: transform, opacity (set in CSS)

After door animation completes (2.4s):
  - Doors: will-change: auto (removed via onComplete callback)
  - Net reduction: 2 GPU layers freed

Off-screen sections:
  - Petal will-change remains in CSS but paused tweens mean
    the browser can deprioritize the layer hint
```

### 8.5 Asset Optimization Requirements

| Asset | Original size (est.) | Target display size | Recommended src size |
|-------|---------------------|--------------------|--------------------|
| petal-1.png | ~1000px wide | 28-36px | 72px wide (2x for retina) |
| petal-2.png | ~1000px wide | 38-52px | 104px wide (2x for retina) |
| petal-3.png | ~1000px wide | 24-28px | 56px wide (2x for retina) |
| petal-4.png | ~1000px wide | 36-44px | 88px wide (2x for retina) |
| petal-5.png | ~1000px wide | 30-40px | 80px wide (2x for retina) |

Petal PNGs must be resized and re-exported at 2x their max display size. Serving 1000px originals for 52px display elements wastes bandwidth and GPU decode time.

### 8.6 Initialization Sequence

To avoid a heavy burst of work at page load, animations initialize in a waterfall:

```
T+0ms:      Register GSAP plugins
T+0ms:      Set initial states (gsap.set calls)
T+300ms:    Start door opening timeline
T+300ms:    Create Section 2 ScrollTrigger (top of page, likely visible)
T+300ms:    Create remaining ScrollTriggers (top-to-bottom order, per refreshPriority)
T+300ms:    Create petal ScrollTriggers (paused until sections enter viewport)
T+2400ms:   Door animation complete, clean up door will-change
T+varies:   Petals activate as user scrolls to each section
```

ScrollTriggers are created in **page order** (Section 2 first, Section 7 last) to ensure correct `refreshPriority` ordering without explicit priority values.

### 8.7 Cleanup on Unmount (React)

```javascript
// In the template's root component, using useGSAP:
const containerRef = useRef(null);

useGSAP(() => {
  // All GSAP setup code here...
  // useGSAP automatically reverts all tweens, timelines,
  // and ScrollTriggers created in this scope on unmount.
}, { scope: containerRef });
```

All GSAP code runs inside a single `useGSAP` hook scoped to the template container. On unmount (navigation away, order preview toggle, etc.), `useGSAP` automatically calls `ctx.revert()`, which:
- Kills all timelines and tweens
- Kills all ScrollTrigger instances
- Reverts inline styles to pre-animation state
- Removes `will-change` and other GSAP-applied properties

No manual cleanup is needed. No stray animations leak.

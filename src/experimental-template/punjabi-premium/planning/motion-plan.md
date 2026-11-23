# Punjabi Premium -- Motion Plan

> Complete animation specification for the React Engineer. Every animation in the invitation is listed here with its trigger, GSAP API, timing, and implementation notes.

---

## 1. Animation Inventory

10 unique animations total. No continuous rAF loops. All respect `prefers-reduced-motion`.

| # | Animation | Section | Trigger | Elements | Duration | Easing | GSAP API |
|---|-----------|---------|---------|----------|----------|--------|----------|
| 1 | Opening entrance sequence | S1 Opening | User tap ("Tap to open") | Background, arch, florals, ornaments, monogram, names, couple, botanicals | ~2.5s total | power2.out (varied per step) | gsap.timeline (paused) |
| 2 | Toran sway | S1 Opening | After entrance completes | 5 hanging ornaments | 3.5s period, infinite | CSS ease-in-out | CSS @keyframes (not GSAP) |
| 3 | Family block reveal | S2 Family | Scroll into view | Groom block, bride block | 600ms each | power2.out | ScrollTrigger + gsap.from |
| 4 | Countdown frame reveal | S3 Countdown | Scroll into view | Scalloped frame | 600ms | power2.out | ScrollTrigger + gsap.from |
| 5 | Countdown digit transition | S3 Countdown | Every second (state change) | Digit spans | 200ms | CSS ease-out | CSS transition (not GSAP) |
| 6 | Event card slide-in | S4 Celebrations | Scroll into view | Individual event cards | 600ms, 150ms stagger | power2.out | ScrollTrigger.batch + gsap.from |
| 7 | RSVP arch stroke draw | S5 RSVP | Scroll into view | Arch SVG outline | 800ms | power2.inOut | ScrollTrigger + gsap.fromTo |
| 8 | Gallery row stagger | S6 Gallery | Scroll into view | Photo grid rows | 600ms, 150ms stagger | power2.out | ScrollTrigger.batch + gsap.from |
| 9 | Closing arch stroke draw | S7 Closing | Scroll into view | Full arch SVG outline | 1200ms | power2.inOut | ScrollTrigger + gsap.fromTo |
| 10 | Lotus breathing | S7 Closing | After closing arch completes | Single lotus element | 4s period, infinite | CSS ease-in-out | CSS @keyframes (not GSAP) |

---

## 2. Opening Entrance Sequence

The most complex animation. A GSAP timeline triggered by the user tapping the "Tap to open" overlay.

### 2.1 Overlay State

Before the sequence plays, a full-screen overlay covers the opening section:

- Background: `var(--pp-bg-cream)` solid fill matching the section background
- Content: Monogram initials (Cormorant Garamond 700, `--pp-gold-dark`) centered vertically at ~40% from top, plus "Tap to begin" label (Cormorant 500, `clamp(12px, 3vw, 16px)`, `--pp-gold-dark`) centered below
- The overlay is a sibling of the opening section content, positioned absolutely, z-index 30 (above everything)

When tapped, the overlay fades out (300ms) and is removed from DOM (or set to `display: none` / `visibility: hidden` + `pointer-events: none`). The entrance timeline then plays.

### 2.2 Initial State (before timeline plays)

All opening section elements start invisible. Set via `gsap.set()` inside `useGSAP` before the timeline is constructed:

```
gsap.set(".pp-opening__bg", { autoAlpha: 0 })
gsap.set(".pp-opening__arch", { autoAlpha: 0, y: 8 })
gsap.set(".pp-opening__canopy", { autoAlpha: 0, y: -12 })
gsap.set(".pp-opening__ornament", { autoAlpha: 0, y: -20 })
gsap.set(".pp-opening__botanicals", { autoAlpha: 0, y: 8 })
gsap.set(".pp-opening__roses", { autoAlpha: 0 })
gsap.set(".pp-opening__monogram", { autoAlpha: 0 })
gsap.set(".pp-opening__names", { autoAlpha: 0, y: 16 })
gsap.set(".pp-opening__couple", { autoAlpha: 0, y: 24 })
```

### 2.3 Timeline Structure

```
const tl = gsap.timeline({
  paused: true,
  defaults: { ease: "power2.out" },
  onComplete: () => {
    // Start toran sway by adding the CSS animation class
    // to the ornament container
  }
})

// Step 1: Background gradient
tl.to(".pp-opening__bg", {
  autoAlpha: 1,
  duration: 0.8
}, 0)

// Step 2: Arch structure (fade in + rise)
tl.to(".pp-opening__arch", {
  autoAlpha: 1,
  y: 0,
  duration: 0.7
}, 0.2)

// Step 3: Floral canopy (fade in + drift down into position)
tl.to(".pp-opening__canopy", {
  autoAlpha: 1,
  y: 0,
  duration: 0.8
}, 0.5)

// Step 4: Toran ornaments (drop in with stagger)
tl.to(".pp-opening__ornament", {
  autoAlpha: 1,
  y: 0,
  duration: 0.6,
  ease: "back.out(1.4)",
  stagger: 0.08
}, 0.8)

// Step 5: Bottom botanicals (fade in + rise)
tl.to(".pp-opening__botanicals", {
  autoAlpha: 1,
  y: 0,
  duration: 0.8
}, 1.0)

// Step 6: Mid roses (simple fade)
tl.to(".pp-opening__roses", {
  autoAlpha: 1,
  duration: 0.5
}, 1.2)

// Step 7: Monogram (fade in)
tl.to(".pp-opening__monogram", {
  autoAlpha: 1,
  duration: 0.6
}, 1.4)

// Step 8: Couple names (fade in + rise)
tl.to(".pp-opening__names", {
  autoAlpha: 1,
  y: 0,
  duration: 0.6
}, 1.8)

// Step 9: Couple illustration (fade up from bottom)
tl.to(".pp-opening__couple", {
  autoAlpha: 1,
  y: 0,
  duration: 0.8
}, 2.2)
```

### 2.4 Timing Chart

```
Time (s)  0.0   0.5   1.0   1.5   2.0   2.5   3.0
          |     |     |     |     |     |     |
BG        ========
Arch        =======
Canopy          ========
Ornaments         ======== (staggered 5x 80ms)
Botanicals          ========
Roses                 =====
Monogram                ======
Names                        ======
Couple                            ========
                                            ^ Sequence complete (~3.0s)
                                              Toran sway begins
```

Total sequence: approximately 3.0 seconds (last tween starts at 2.2s, duration 0.8s).

### 2.5 Easing Per Step

| Step | Element | Ease | Why |
|------|---------|------|-----|
| 1 | Background | power2.out | Smooth, natural fade |
| 2 | Arch | power2.out | Gentle upward drift settling into place |
| 3 | Canopy | power2.out | Organic downward drift |
| 4 | Ornaments | back.out(1.4) | Slight overshoot simulates hanging/dropping. The 1.4 strength is subtle -- not bouncy, just a hint of settle. |
| 5 | Botanicals | power2.out | Consistent with arch |
| 6 | Roses | power2.out | Simple fade, no motion |
| 7 | Monogram | power2.out | Simple fade, no motion |
| 8 | Names | power2.out | Rising text reveal (project standard) |
| 9 | Couple | power2.out | Larger travel distance (24px), same easing |

### 2.6 Overlay Dismissal

The tap handler on the overlay:

```
function handleOpen() {
  gsap.to(overlayRef.current, {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      setIsOpen(true)    // React state to unmount or hide overlay
      entranceTl.play()  // Play the entrance timeline
    }
  })
}
```

This must be wrapped in `contextSafe` from the `useGSAP` hook since it runs in an event handler outside the initial setup.

---

## 3. Toran Sway Animation

CSS keyframes -- not GSAP. More performant for continuous, simple oscillation. No JavaScript cost per frame.

### 3.1 Keyframe Definition

```css
@keyframes pp-toran-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2deg);
  }
  75% {
    transform: rotate(-2deg);
  }
}
```

### 3.2 Application

```css
.pp-opening__ornament {
  transform-origin: top center;
}

.pp-toran-sway .pp-opening__ornament {
  animation: pp-toran-sway 3.5s ease-in-out infinite;
}

/* Stagger via animation-delay on each ornament */
.pp-toran-sway .pp-opening__ornament:nth-child(1) { animation-delay: 0s; }
.pp-toran-sway .pp-opening__ornament:nth-child(2) { animation-delay: 0.15s; }
.pp-toran-sway .pp-opening__ornament:nth-child(3) { animation-delay: 0.30s; }
.pp-toran-sway .pp-opening__ornament:nth-child(4) { animation-delay: 0.45s; }
.pp-toran-sway .pp-opening__ornament:nth-child(5) { animation-delay: 0.60s; }
```

### 3.3 Activation

The `.pp-toran-sway` class is added to the ornament container in the timeline's `onComplete` callback (after the entrance sequence finishes). This prevents the sway from running while ornaments are still dropping in.

### 3.4 Properties

- Period: 3.5s
- Amplitude: 2deg maximum rotation
- Transform-origin: top center (ornaments hang from a point)
- Phase offset between ornaments: 0.15s (creates organic, wave-like motion)
- Only uses `transform: rotate()` -- no layout-triggering properties
- `will-change: transform` is NOT permanently applied. The browser handles compositing for CSS animations efficiently on its own.

### 3.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .pp-toran-sway .pp-opening__ornament {
    animation: none;
  }
}
```

---

## 4. Scroll-Triggered Section Reveals

All sections below S1 use GSAP ScrollTrigger for one-time reveal animations. The pattern is consistent, with section-specific variations noted.

### 4.1 Shared Configuration

```
Base reveal pattern:
  - Property: autoAlpha 0 -> 1, y: 24 -> 0
  - Duration: 0.6s (600ms)
  - Ease: "power2.out"
  - ScrollTrigger: { trigger: sectionElement, start: "top 85%", once: true }
```

The `once: true` flag ensures the animation fires once and the ScrollTrigger is then killed -- no reverse on scroll back, no re-trigger.

### 4.2 Section-by-Section ScrollTrigger Specs

#### S2: Family Block Reveal

- **Trigger**: The section container
- **Start**: `"top 85%"` (when section top enters bottom 15% of viewport)
- **Elements**: Two family blocks (groom, bride), staggered
- **Animation**:
  ```
  gsap.from(".pp-family__block", {
    autoAlpha: 0,
    y: 24,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.3,
    scrollTrigger: {
      trigger: ".pp-family",
      start: "top 85%",
      once: true
    }
  })
  ```
- **Note**: The two blocks stagger 300ms apart (groom first, then bride).

#### S3: Countdown Frame Reveal

- **Trigger**: The countdown section
- **Start**: `"top 85%"`
- **Elements**: The scalloped frame container
- **Animation**:
  ```
  gsap.from(".pp-countdown__frame", {
    autoAlpha: 0,
    y: 24,
    scale: 0.95,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".pp-countdown",
      start: "top 85%",
      once: true
    }
  })
  ```
- **Note**: Adds a subtle `scale: 0.95 -> 1` to the standard reveal for this framed element. The scale uses `transform` only (no layout cost).

#### S4: Event Card Slide-In

- **Trigger**: Each card individually via `ScrollTrigger.batch`
- **Start**: `"top 85%"`
- **Elements**: Individual event cards
- **Animation**:
  ```
  ScrollTrigger.batch(".pp-event-card", {
    start: "top 85%",
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        autoAlpha: 0,
        x: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        overwrite: true
      })
    }
  })
  ```
- **Note**: Cards slide from the right (`x: 24 -> 0`) instead of from below. This matches the timeline layout where cards are right-offset. The `batch` approach groups cards that enter the viewport around the same time and staggers them 150ms apart. Using `overwrite: true` prevents conflicts if the user scrolls fast.

#### S5: RSVP Arch Stroke Draw

- **Trigger**: The RSVP section
- **Start**: `"top 80%"`
- **Elements**: The arch outline SVG `<path>` element
- **Animation**:
  ```
  // Measure the path length on mount
  const pathLength = archPathRef.current.getTotalLength()

  gsap.set(archPathRef.current, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  })

  gsap.to(archPathRef.current, {
    strokeDashoffset: 0,
    duration: 0.8,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".pp-rsvp",
      start: "top 80%",
      once: true
    }
  })
  ```
- **Note**: This is a stroke-dashoffset draw animation. The SVG path starts fully hidden (dashoffset = full length) and "draws" to visible (dashoffset = 0). The `power2.inOut` easing gives a smooth acceleration/deceleration that feels like a hand drawing the outline.

#### S6: Gallery Row Stagger

- **Trigger**: Each photo element via `ScrollTrigger.batch`
- **Start**: `"top 90%"` (slightly later trigger since photos are smaller)
- **Elements**: Individual photo containers
- **Animation**:
  ```
  ScrollTrigger.batch(".pp-gallery__photo", {
    start: "top 90%",
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        overwrite: true
      })
    }
  })
  ```
- **Note**: Smaller travel distance (`y: 16`) than other sections since the grid items are smaller. Batch naturally groups items that enter together (a full row on mobile).

#### S7: Closing Arch Stroke Draw

- **Trigger**: The closing section
- **Start**: `"top 80%"`
- **Elements**: The full arch SVG outline path, then content inside
- **Animation**:
  ```
  const closingTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".pp-closing",
      start: "top 80%",
      once: true
    }
  })

  // Phase 1: Draw the arch
  closingTl.fromTo(archPathRef.current, {
    strokeDashoffset: pathLength
  }, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: "power2.inOut"
  })

  // Phase 2: Fade in content inside the arch
  closingTl.from(".pp-closing__content", {
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.1")
  ```
- **Note**: This is a two-phase timeline. The arch draws itself (1.2s, longer than S5 because it is the full arch shape), then the content inside fades in with a slight overlap (`"-=0.1"` position parameter). The `once: true` on the ScrollTrigger sits on the timeline, not on child tweens.

---

## 5. Countdown Digit Transition

CSS transitions -- not GSAP. The countdown updates every second via React state. Using GSAP for per-second digit changes would be overhead with no benefit.

### 5.1 Implementation Approach

Each digit position (days, hours, minutes, seconds) has two elements: an outgoing digit and an incoming digit. When React state updates:

1. The outgoing digit gets a class that triggers translateY(-8px) + opacity 0
2. The incoming digit gets a class that triggers translateY(0) + opacity 1
3. After the transition completes (200ms), the outgoing element is cleaned up

### 5.2 CSS

```css
.pp-countdown__digit {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.pp-countdown__digit--exiting {
  transform: translateY(-8px);
  opacity: 0;
}

.pp-countdown__digit--entering {
  transform: translateY(0);
  opacity: 1;
}
```

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .pp-countdown__digit {
    transition: none;
  }
}
```

Digits update instantly with no visual transition.

---

## 6. RSVP Form Interactions

Lightweight CSS-based interactions. No GSAP needed for these micro-interactions.

### 6.1 Button Press Feedback

```css
.pp-rsvp__submit:active {
  transform: scale(0.98);
}

.pp-rsvp__submit {
  transition: background-color 200ms ease, transform 100ms ease;
}
```

### 6.2 Form Submission Success

When the form submits successfully, the form container fades out and the thank-you message fades in. This is a simple two-step swap using React state:

```css
.pp-rsvp__form--submitting {
  opacity: 0;
  transition: opacity 200ms ease-out;
  pointer-events: none;
}

.pp-rsvp__thankyou {
  opacity: 0;
  transition: opacity 400ms ease-out 200ms; /* 200ms delay = waits for form to fade */
}

.pp-rsvp__thankyou--visible {
  opacity: 1;
}
```

This can also be done with GSAP if the React Engineer prefers a more controlled sequence, but CSS transitions are sufficient for this simple cross-fade.

### 6.3 Error Shake

When validation fails on submit, the submit button shakes briefly:

```css
@keyframes pp-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.pp-rsvp__submit--error {
  animation: pp-shake 400ms ease-out;
}
```

The `--error` class is added on validation failure and removed after the animation ends (via `animationend` event listener or a setTimeout).

### 6.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .pp-rsvp__submit--error {
    animation: none;
    /* Fallback: brief opacity flash to indicate error */
    outline: 2px solid var(--pp-error);
    outline-offset: 2px;
  }
}
```

---

## 7. React Integration Strategy

### 7.1 Dependencies

```
npm install gsap @gsap/react
```

### 7.2 Plugin Registration

At the top of the main template component file, before any component code:

```javascript
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)
```

Register once at module level. Do not register inside a component or hook.

### 7.3 Component Structure

The main template component uses a single `useGSAP` hook with `scope` set to the template root ref. All GSAP animations are created inside this hook. The scope ensures all selector strings (`.pp-opening__arch`, etc.) resolve only within the template container -- critical since this is a scoped template.

```javascript
function PunjabiPremium({ data }) {
  const containerRef = useRef(null)
  const entranceTlRef = useRef(null)

  useGSAP((context, contextSafe) => {
    // 1. Set initial states for opening elements
    gsap.set(".pp-opening__bg", { autoAlpha: 0 })
    // ... (all initial sets from Section 2.2)

    // 2. Build the entrance timeline (paused)
    entranceTlRef.current = gsap.timeline({ paused: true, ... })
    // ... (all timeline steps from Section 2.3)

    // 3. Set up scroll-triggered reveals for S2-S7
    // S2: Family block reveal
    gsap.from(".pp-family__block", { ... scrollTrigger: { ... } })
    // ... (all ScrollTrigger animations from Section 4)

    // 4. Expose the tap handler as contextSafe
    // (stored on a ref or passed to child via callback ref)

  }, { scope: containerRef })

  return <div ref={containerRef} className="pp-page">...</div>
}
```

### 7.4 Ref Management

| Ref | Purpose |
|-----|---------|
| `containerRef` | Template root. Passed as `scope` to `useGSAP`. |
| `entranceTlRef` | Stores the paused entrance timeline. Called `.play()` from the overlay tap handler. |
| `overlayRef` | The "Tap to open" overlay element. Needed for the fade-out animation. |
| `rsvpArchPathRef` | The RSVP arch SVG `<path>` element. Needed for `getTotalLength()` to set up the stroke-draw animation. |
| `closingArchPathRef` | The closing arch SVG `<path>` element. Same purpose. |

Most animated elements are targeted via scoped CSS selectors (`.pp-opening__arch`, etc.) rather than individual refs. This is cleaner and is safe because the `scope` option on `useGSAP` restricts queries to the template container.

### 7.5 Cleanup

The `useGSAP` hook handles all cleanup automatically:

- All tweens, timelines, and ScrollTrigger instances created inside the hook are reverted on component unmount.
- No manual `.kill()` calls needed.
- The CSS animation class for toran sway is removed naturally when the component unmounts (the DOM is gone).

### 7.6 Opening Overlay State

React state controls the overlay visibility:

```javascript
const [isOpen, setIsOpen] = useState(false)
```

The overlay tap handler (wrapped in `contextSafe`):

1. Fades the overlay out with `gsap.to(overlayRef, { autoAlpha: 0, ... })`
2. On complete: sets `isOpen` to `true` (unmounts or hides overlay)
3. Calls `entranceTlRef.current.play()`

The `isOpen` state can also be used to conditionally render the overlay or set `display: none` after the fade completes.

### 7.7 Scroll Position After Opening

After the entrance sequence plays, the page is at the top (scroll position 0). ScrollTrigger instances for S2-S7 are already created and waiting. As the user scrolls, each section triggers in order. Because all ScrollTriggers are created inside a single `useGSAP` hook and the sections are rendered in DOM order (S1 through S7), they are created in top-to-bottom order. No `refreshPriority` adjustment is needed.

### 7.8 The /edits Preview

Per project rules: never add animation in the /edits preview. The template component should accept a prop (e.g. `isPreview` or `mode`) that, when true, skips all GSAP setup entirely. The `useGSAP` hook should check this prop and return early:

```javascript
useGSAP(() => {
  if (isPreview) return  // No animations in /edits preview
  // ... all animation setup
}, { scope: containerRef, dependencies: [isPreview] })
```

When `isPreview` is true, all elements render at their final visible state (no `gsap.set` calls, no autoAlpha: 0). This means the opening section shows all elements immediately with no overlay, and all sections are fully visible.

---

## 8. Reduced Motion Strategy

### 8.1 Approach

Use a combination of:
1. **GSAP `gsap.matchMedia()`** for JavaScript-driven animations (entrance timeline, ScrollTrigger reveals)
2. **CSS `@media (prefers-reduced-motion: reduce)`** for CSS animations (toran sway, digit transitions, form interactions)

### 8.2 GSAP matchMedia Setup

Wrap all GSAP animation creation inside a `gsap.matchMedia()` block within the `useGSAP` hook:

```javascript
useGSAP(() => {
  if (isPreview) return

  const mm = gsap.matchMedia()

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // ALL GSAP animations go here:
    // - Initial gsap.set() calls
    // - Entrance timeline
    // - ScrollTrigger reveals for S2-S7
    // Everything is automatically reverted if the user
    // changes their motion preference
  })

  // Outside matchMedia: any non-animated setup
  // (e.g. countdown interval, RSVP form logic)

}, { scope: containerRef })
```

When `prefers-reduced-motion: reduce` is active, the matchMedia block never executes. All elements render at their natural CSS state (visible, positioned, no transforms). The `gsap.set()` calls that hide elements never run, so everything is visible from the start.

### 8.3 What Happens With Reduced Motion

| Animation | Reduced Motion Behavior |
|-----------|------------------------|
| Opening entrance | Skipped entirely. All elements visible immediately. No overlay "Tap to open" interaction -- the overlay is either not shown, or shown briefly and auto-dismissed. |
| Toran sway | Disabled via CSS media query. Ornaments static. |
| Family block reveal | Skipped. Blocks visible at full opacity, no translate. |
| Countdown frame reveal | Skipped. Frame visible immediately. |
| Digit transitions | Disabled via CSS media query. Numbers update instantly. |
| Event card slide-in | Skipped. Cards visible immediately. |
| RSVP arch draw | Skipped. Arch visible immediately (no strokeDashoffset). |
| Gallery row stagger | Skipped. Photos visible immediately. |
| Closing arch draw | Skipped. Arch visible immediately. Content visible. |
| Lotus breathing | Disabled via CSS media query. Lotus static. |

### 8.4 Overlay in Reduced Motion

Two options (React Engineer should choose based on UX feel):

**Option A (recommended)**: Show the overlay but auto-dismiss it after a 1-second delay (no animation, just unmount). The user still sees the monogram and "Tap to begin" briefly, establishing the opening moment.

**Option B**: Skip the overlay entirely. Set `isOpen` to `true` on mount when `prefers-reduced-motion: reduce` is detected.

Detection:

```javascript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches
```

---

## 9. Performance Budget

### 9.1 Simultaneous Animation Limits

- **Maximum 5 elements animating simultaneously** during the entrance sequence (the most demanding moment). This occurs around the 1.0-1.5s mark when ornaments, botanicals, and roses overlap.
- **Maximum 4 elements in a batch** for scroll reveals (ScrollTrigger.batch handles this naturally by grouping items that enter together).
- **At any given scroll position**, at most 1 scroll-triggered animation is playing (sections are spaced far enough apart that reveals do not overlap).

### 9.2 Animated Properties

Only these CSS properties are animated throughout the entire invitation:

| Property | GSAP name | Compositable? |
|----------|-----------|---------------|
| transform: translateX | `x` | Yes |
| transform: translateY | `y` | Yes |
| transform: scale | `scale` | Yes |
| transform: rotate | `rotation` (CSS only for toran) | Yes |
| opacity / visibility | `autoAlpha` | Yes (opacity) |
| stroke-dashoffset | `strokeDashoffset` | Yes (paint only) |

All animated properties are compositor-friendly. No layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`) are ever animated.

### 9.3 will-change Rules

- **Do NOT set `will-change` permanently** on any element.
- The browser handles layer promotion for CSS animations (toran sway) automatically.
- GSAP internally optimizes compositing for its tweens.
- The only case where explicit `will-change` might help is the SVG stroke-draw animations. If the React Engineer observes jank during the arch draw, add `will-change: stroke-dashoffset` to the path element immediately before the animation and remove it in `onComplete`. But start without it.

### 9.4 No Continuous rAF Loops

- The toran sway uses CSS `@keyframes` -- the browser handles this on the compositor thread with no JavaScript involvement.
- The lotus breathing uses CSS `@keyframes` -- same benefit.
- The countdown updates once per second via `setInterval`, not via requestAnimationFrame.
- No `gsap.ticker` subscriptions. No custom rAF loops.
- All ScrollTrigger instances use `once: true`, so they self-destruct after firing. After the user has scrolled through the entire invitation, zero ScrollTrigger instances remain active.

### 9.5 Asset Loading and Animation

- The entrance timeline is `paused: true` and only plays after the user taps "open". This means the user is already looking at the page (overlay) and assets have had time to load.
- Priority-loaded assets (couple illustration, floral canopy, arch, bottom botanicals) should be loaded before the entrance plays. If an asset is slow, the entrance should still play (elements fade in even if the image is not yet painted).
- Below-fold sections use lazy-loaded images. ScrollTrigger animations fire when the section enters the viewport. Images should already be loaded or loading by that point (since `loading="lazy"` triggers at a browser-determined threshold above the viewport).

---

## 10. GSAP Dependencies

### 10.1 NPM Packages

```
gsap          (core library + CSSPlugin + ScrollTrigger bundled)
@gsap/react   (useGSAP hook)
```

That's it. Two packages.

### 10.2 Imports

```javascript
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
```

### 10.3 Registration

```javascript
gsap.registerPlugin(useGSAP, ScrollTrigger)
```

Called once at module level in the template's main component file.

### 10.4 No Other Plugins

The following GSAP plugins are NOT needed:

- **ScrollSmoother** -- not needed; native scroll is fine for a single-page invitation
- **Flip** -- no layout transitions in this template
- **Draggable** -- no drag interactions
- **MotionPath** -- no path-based motion
- **MorphSVG** -- no shape morphing
- **SplitText** -- no character/line-level text animation (design bible explicitly prohibits text stagger)
- **CustomEase** -- built-in eases (power2.out, back.out) are sufficient

---

## Appendix A: Animation Class Names

CSS classes used to trigger or control animations:

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pp-toran-sway` | Enables toran CSS animation | Ornament container |
| `.pp-countdown__digit--exiting` | Digit exit transition | Outgoing digit span |
| `.pp-countdown__digit--entering` | Digit enter transition | Incoming digit span |
| `.pp-rsvp__submit--error` | Error shake animation | Submit button |
| `.pp-rsvp__form--submitting` | Form fade-out on submit | Form container |
| `.pp-rsvp__thankyou--visible` | Thank-you fade-in | Thank-you container |

## Appendix B: What NOT to Animate (from Design Bible 9.4)

These are explicit prohibitions. The React Engineer must not add:

1. **Floral sway or particle effects** -- no swaying flowers, no floating petals, no bloom effects
2. **Parallax on the opening section** -- depth is achieved through static z-positioning only
3. **Text color, font-size, or letter-spacing animation** -- typography is static
4. **Hover animations on decorative elements** -- only interactive elements (buttons, links) get hover states
5. **Continuous rAF loops for static content** -- all continuous effects use CSS keyframes
6. **Any animation in the /edits preview** -- breaks drag interactions

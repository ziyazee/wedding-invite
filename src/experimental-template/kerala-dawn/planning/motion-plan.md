# Kerala Dawn -- Motion Plan

> Every animation in this template serves the dawn metaphor. Nothing moves
> for decoration alone -- each transition carries the guest deeper into the
> morning, from the first spark of a lamp to full golden daylight.

---

## 0. Technical Foundation

### Stack

- **GSAP 3.12+** with `ScrollTrigger` plugin
- **@gsap/react** -- `useGSAP` hook for all animation setup and automatic cleanup
- **CSS @keyframes** for ambient loops (flame flicker, pulse glow, kasavu shimmer)
- No Framer Motion, no CSS-only scroll reveals

### Registration (once, at module scope)

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

### Shared Constants

```ts
const EASE_REVEAL  = 'cubic-bezier(0.22, 1, 0.36, 1)'; // CSS
const EASE_REVEAL_GSAP = 'power2.out';                   // GSAP equivalent
const EASE_CINEMATIC = 'power3.out';                      // slower, grander
const DURATION_REVEAL = 0.6;   // seconds
const STAGGER_STEP   = 0.12;   // seconds between sibling elements
const TRANSLATE_Y     = 16;     // px -- standard rise distance
```

### Architecture

Each section is its own React component. Each component owns one
`useGSAP` call with `{ scope: sectionRef }`. No animation code leaks
across component boundaries. The root `KeralaDawn` component owns only
the Opening entrance timeline (because it controls the video and
auto-scroll that span the full viewport).

---

## 1. Opening Entrance Sequence

### 1.1 Initial States (before any interaction)

| Element | CSS initial state |
|---------|-------------------|
| Video `<video>` | `opacity: 1`, paused, showing poster (frame 8) |
| Gradient overlay | `opacity: 1` (always visible) |
| Vignette overlay | `opacity: 1` (always visible) |
| Touch CTA container | `opacity: 1` (visible via CSS) |
| Four-pointed star | `opacity: 0.7` (pulse animation start) |
| "Touch to begin" text | `opacity: 0.7` (synced with star) |
| Name reveal container | `opacity: 0; visibility: hidden` |
| Groom name | `opacity: 0; transform: translateY(20px)` |
| Ampersand | `opacity: 0; transform: translateY(20px)` |
| Bride name | `opacity: 0; transform: translateY(20px)` |
| Wedding date | `opacity: 0; transform: translateY(20px)` |
| Water transition | `opacity: 0` |

### 1.2 Touch Prompt Pulse (CSS -- runs before any JS)

The pulse is pure CSS so it works immediately, before GSAP loads. See
Section 3 for the `@keyframes` definition. Applied via class `.kd-cta-pulse`.

```css
.kd-cta-pulse {
  animation: kd-pulse-glow 3s ease-in-out infinite;
}
```

Both the star SVG and the "Touch to begin" text share this class.

### 1.3 Tap Handler -- Video Play

On tap/click of the CTA area (the entire bottom region is the tap target
for easy mobile interaction):

```
1. Immediately fade out CTA:
   gsap.to(ctaRef, { opacity: 0, duration: 0.2, ease: 'power1.out',
     onComplete: () => { ctaRef.style.display = 'none'; } })

2. Play the video:
   videoRef.play()
   -- If play() rejects (autoplay policy), catch and:
     a. Show poster frame
     b. Skip to step 4 (name reveal) immediately
```

### 1.4 Video Progress Watcher

We listen for `timeupdate` on the video element. When
`currentTime >= duration * 0.75` (approximately 7.5s of 10s), we trigger
the name reveal. We do NOT use `requestAnimationFrame` polling -- the
native `timeupdate` event fires ~4 times per second, which is precise
enough for a 10-second video.

```ts
const handleTimeUpdate = () => {
  if (videoRef.currentTime >= videoRef.duration * 0.75 && !nameRevealStarted) {
    nameRevealStarted = true;
    playNameReveal();
  }
};
```

### 1.5 Name Reveal Timeline

A single GSAP timeline, created at mount time as `paused: true`, played
by the video watcher. This is the cinematic centrepiece.

```
Timeline: nameRevealTL (paused: true)
  defaults: { ease: 'power3.out' }

  Label "start" @ 0

  [0.0s] Name container: { opacity: 1, visibility: 'visible', duration: 0 }
         -- instant visibility flip

  [0.0s] Groom name:
         from { opacity: 0, y: 20, filter: 'blur(4px)' }
         to   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }
         -- text-shadow (glow) is already in CSS; the blur-to-sharp
            creates a "materializing from light" effect

  [0.4s] Ampersand "&":
         from { opacity: 0, y: 16, scale: 0.85 }
         to   { opacity: 1, y: 0, scale: 1, duration: 0.7 }
         -- slightly smaller, scales up to feel like it blooms

  [0.8s] Bride name:
         from { opacity: 0, y: 20, filter: 'blur(4px)' }
         to   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }
         -- mirrors groom timing exactly

  [1.4s] Wedding date:
         from { opacity: 0, y: 12 }
         to   { opacity: 0.85, y: 0, duration: 0.7, ease: 'power2.out' }
         -- slightly lower opacity target (0.85) per blueprint

  [2.0s] Water transition zone:
         from { opacity: 0 }
         to   { opacity: 1, duration: 0.8, ease: 'power1.inOut' }

  Label "complete" @ 2.8
```

Total name reveal duration: **2.8 seconds**.

### 1.6 Auto-Scroll to Couple Section

After name reveal completes, wait 1.5 seconds, then smooth-scroll:

```ts
nameRevealTL.eventCallback('onComplete', () => {
  autoScrollTimer = setTimeout(() => {
    if (!userHasScrolled) {
      gsap.to(window, {
        scrollTo: { y: coupleSectionRef, offsetY: 0 },
        duration: 1.2,
        ease: 'power2.inOut'
      });
    }
  }, 1500);
});
```

**Cancel condition:** A `scroll` event listener is registered at mount.
If the user scrolls manually at any point after the video starts,
`userHasScrolled = true` and the auto-scroll is cancelled. The
`setTimeout` is also cleared on unmount.

### 1.7 Opening -- Complete Timeline Summary

```
t=0.0    User taps CTA
t=0.0    CTA fades out (200ms)
t=0.0    Video starts playing
t=~7.5   Video reaches 75% -- name reveal fires
t=7.5    Groom name materializes (900ms)
t=7.9    Ampersand blooms (700ms)
t=8.3    Bride name materializes (900ms)
t=8.9    Date fades up (700ms)
t=9.5    Water transition fades in (800ms)
t=10.0   Video ends (holds on last frame or loops)
t=11.8   Auto-scroll begins (1200ms)
t=13.0   Couple section in view
```

---

## 2. Scroll Reveal Strategy -- Sections 2-6

### 2.0 Shared Reveal Pattern

All sections use the same base reveal: **fade in while rising from
below**. No character stagger, no line stagger. Each element is one
atomic unit.

```ts
// Utility: standard reveal properties
const REVEAL_FROM = {
  opacity: 0,
  y: TRANSLATE_Y, // 16px
};

const REVEAL_VARS = {
  opacity: 1,
  y: 0,
  duration: DURATION_REVEAL, // 0.6s
  ease: EASE_REVEAL_GSAP,   // power2.out
};
```

### 2.1 ScrollTrigger Defaults for All Sections

Every section reveal uses these ScrollTrigger defaults unless overridden:

```ts
{
  trigger: sectionRef.current,
  start: 'top 80%',    // reveal starts when top of section enters bottom 20% of viewport
  once: true,           // play once, do not reverse on scroll back
}
```

`once: true` is critical -- we never reverse reveals. The guest scrolls
down through the invitation; content stays visible once revealed.

### 2.2 Section 2: Couple & Family

**Component:** `CoupleSection`

**ScrollTrigger config:**
```ts
{ trigger: sectionRef, start: 'top 75%', once: true }
```

**Timeline:**
```
tl = gsap.timeline({ scrollTrigger, defaults: { ease: 'power2.out' } })

[0.0s] Kasavu frame border:
       from { opacity: 0 }
       to   { opacity: 1, duration: 0.8 }
       -- the border draws itself into existence

[0.0s] Jasmine garland (top):
       from { opacity: 0, y: 10 }
       to   { opacity: 0.3, y: 0, duration: 0.6 }
       -- target opacity is 0.3 (per blueprint spec)

[0.12s] Section heading ("The Families Invite You..."):
        standard reveal (0.6s)

[0.24s] Groom's family block (entire block as one unit):
        standard reveal (0.6s)

[0.36s] Nilavilakku divider:
        from { opacity: 0, scaleX: 0 }
        to   { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out' }
        -- the divider "grows" outward from center
        -- transformOrigin: 'center center'

[0.48s] Bride's family block:
        standard reveal (0.6s)

[0.60s] Jasmine garland (bottom):
        from { opacity: 0, y: -10 }
        to   { opacity: 0.3, y: 0, duration: 0.6 }
        -- rises from above (inverted direction for bottom garland)

[0.72s] Elephant corner motifs (all 4 simultaneously):
        from { opacity: 0 }
        to   { opacity: 0.15, duration: 0.8, ease: 'power1.out' }
        -- slow, ghostly appearance; they are watermarks, not content
```

**Special treatment -- Kasavu border shimmer:**
After the frame reaches full opacity, start a perpetual CSS animation
(see Section 3: `kd-kasavu-shimmer`). This is applied by toggling a
class, NOT by GSAP, so there is no continuous JS involvement.

```ts
tl.call(() => {
  kasavuFrameRef.current?.classList.add('kd-kasavu-active');
}, [], 0.8); // after border fade-in completes
```

### 2.3 Section 3: Countdown

**Component:** `CountdownSection`

**ScrollTrigger config:**
```ts
{ trigger: sectionRef, start: 'top 80%', once: true }
```

**Timeline:**
```
tl = gsap.timeline({ scrollTrigger, defaults: { ease: 'power2.out' } })

[0.0s] Kasavu strips (top and bottom simultaneously):
       from { opacity: 0, scaleX: 0 }
       to   { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power3.out' }
       transformOrigin: 'center center'

[0.0s] Nilavilakku hero SVG:
       from { opacity: 0, y: 12, filter: 'drop-shadow(0 0 0px rgba(212,162,54,0))' }
       to   { opacity: 1, y: 0, filter: 'drop-shadow(0 0 16px rgba(212,162,54,0.3))',
              duration: 0.8, ease: 'power3.out' }
       -- the glow intensifies as the lamp appears, as if it is being lit

[0.12s] "Counting the Moments" subtitle:
        standard reveal (0.6s)

[0.24s] Countdown grid (all 4 cells as one block):
        from { opacity: 0, y: 16 }
        to   { opacity: 1, y: 0, duration: 0.6 }

[0.36s] Countdown separators (vertical lines between cells):
        from { opacity: 0, scaleY: 0 }
        to   { opacity: 1, scaleY: 1, duration: 0.4 }
        transformOrigin: 'center center'
```

**Special treatment -- Lamp glow pulse:**
After reveal, the lamp SVG gets a gentle CSS animation:

```ts
tl.call(() => {
  lampRef.current?.classList.add('kd-lamp-breathing');
}, [], 0.8);
```

The `kd-lamp-breathing` animation is a 6-second CSS `filter` oscillation
(see Section 3). It is subtle enough to not draw attention but alive
enough to feel organic.

**Countdown tick:** The countdown numbers update every second via
`setInterval` in React state. No GSAP involved -- pure React state
updates with `font-variant-numeric: tabular-nums` preventing layout
shift.

### 2.4 Section 4: Celebrations

**Component:** `CelebrationsSection`

**ScrollTrigger config for section header:**
```ts
{ trigger: headerRef, start: 'top 80%', once: true }
```

**Header timeline:**
```
tl = gsap.timeline({ scrollTrigger, defaults: { ease: 'power2.out' } })

[0.0s] Kasavu strip (top):
       scaleX: 0 -> 1, opacity: 0 -> 1, duration: 0.7

[0.12s] "Celebrations" title:
        standard reveal (0.6s) + text-shadow glow

[0.24s] "Join us for the festivities" subtitle:
        standard reveal (0.6s)
```

**Event cards -- ScrollTrigger.batch():**

Each banana leaf card is an independent scroll-triggered reveal. We use
`ScrollTrigger.batch()` for efficiency when multiple cards are close
together and enter the viewport in quick succession:

```ts
ScrollTrigger.batch('.kd-event-card', {
  start: 'top 85%',
  once: true,
  interval: 0.15,
  batchMax: 2,
  onEnter: (cards) => {
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 }
    );
  },
});
```

**Special treatment -- Banana leaf card entrance:**

Each card does NOT just fade up. The card has a subtle secondary motion
that evokes unrolling a banana leaf:

```
Individual card entrance (within the batch stagger):
  from { opacity: 0, y: 24, scaleY: 0.96 }
  to   { opacity: 1, y: 0, scaleY: 1, duration: 0.7, ease: 'power2.out' }
  transformOrigin: 'top center'
  -- the scaleY: 0.96 -> 1 is barely visible but gives an organic
     "unfurl" sensation, as if the leaf is uncurling vertically
```

**Elephant dividers:** Each divider between cards fades in simultaneously
with the card below it:

```
from { opacity: 0 }
to   { opacity: 1, duration: 0.5 }
-- triggered when the card below enters
```

**Special treatment -- Elephant entrance (premium touch):**

The two mirrored elephants in each divider slide inward from opposite
sides:

```
Left elephant:
  from { opacity: 0, x: -8 }
  to   { opacity: 0.25, x: 0, duration: 0.5, ease: 'power2.out' }

Right elephant:
  from { opacity: 0, x: 8 }
  to   { opacity: 0.25, x: 0, duration: 0.5, ease: 'power2.out' }

Diamond (center):
  from { opacity: 0, scale: 0 }
  to   { opacity: 0.2, scale: 1, duration: 0.3, delay: 0.15 }
```

**Coconut palm watermarks:**

The palms at section edges are purely atmospheric. They do NOT animate on
scroll. They are static at `opacity: 0.06`. Adding motion to them would
distract from the event content.

**Desktop hover on cards (inside InvitationViewport only):**

```css
.kd-event-card {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.kd-event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.50);
}
```

This is CSS-only, no GSAP. Hover is not a scroll effect.

### 2.5 Section 5: RSVP

**Component:** `RSVPSection`

**ScrollTrigger config:**
```ts
{ trigger: sectionRef, start: 'top 80%', once: true }
```

**Timeline:**
```
tl = gsap.timeline({ scrollTrigger, defaults: { ease: 'power2.out' } })

[0.0s] Kasavu strip (top):
       scaleX: 0 -> 1, opacity: 0 -> 1, duration: 0.7

[0.12s] "Kindly Respond" title:
        standard reveal (0.6s)

[0.24s] Subtitle:
        standard reveal (0.6s)

[0.36s] Form fields (all inputs as one block):
        from { opacity: 0, y: 16 }
        to   { opacity: 1, y: 0, duration: 0.6 }
        -- we do NOT stagger individual form fields; the form
           is one logical unit and staggers would feel fussy

[0.48s] Button row:
        from { opacity: 0, y: 12 }
        to   { opacity: 1, y: 0, duration: 0.5 }

[0.60s] Kasavu strip (bottom):
        scaleX: 0 -> 1, opacity: 0 -> 1, duration: 0.7
```

**No special entrance effects.** The RSVP section is functional.
Restraint here contrasts with the decorative Couple and Celebrations
sections and makes the form feel approachable rather than overwhelming.

### 2.6 Section 6: Closing

**Component:** `ClosingSection`

**ScrollTrigger config:**
```ts
{ trigger: sectionRef, start: 'top 75%', once: true }
```

This section triggers slightly earlier (`75%` vs `80%`) because the warm
color shift is the most dramatic transition in the template. Starting
the reveal earlier lets the guest absorb the dawn arrival.

**Timeline:**
```
tl = gsap.timeline({ scrollTrigger, defaults: { ease: 'power3.out' } })

Note: ease is power3.out (cinematic), not power2.out. The Closing
section is the emotional climax -- everything moves a touch slower
and more gracefully.

[0.0s] Kasavu frame (warm variant):
       from { opacity: 0 }
       to   { opacity: 1, duration: 1.0 }
       -- slower fade-in than Section 2 (1.0s vs 0.8s)
       -- the warmer gold is immediately striking against the green

[0.0s] Lotus divider (top):
       from { opacity: 0, scale: 0.7 }
       to   { opacity: 1, scale: 1, duration: 0.7 }
       transformOrigin: 'center center'
       -- the lotus "blooms" into place

[0.12s] "With Love and Blessings" subtitle:
        standard reveal (0.6s) with power3.out

[0.24s] Lotus watermark (behind blessing):
        from { opacity: 0, scale: 0.8, rotation: -15 }
        to   { opacity: 0.08, scale: 1, rotation: 0, duration: 1.2 }
        -- very slow, ghostly rotation from slightly tilted to level
        -- this is the only rotation animation in the template,
           making it feel special and deliberate

[0.30s] Blessing text:
        from { opacity: 0, y: 20 }
        to   { opacity: 1, y: 0, duration: 0.8 }
        -- slightly longer than standard reveal (0.8s vs 0.6s)
        -- the blessing deserves a measured pace

[0.42s] Lotus divider (bottom):
        same as top lotus

[0.54s] Couple names (reprise):
        from { opacity: 0, y: 12 }
        to   { opacity: 1, y: 0, duration: 0.6 }

[0.66s] Wedding date:
        from { opacity: 0 }
        to   { opacity: 0.8, duration: 0.5 }
        -- pure opacity, no Y movement; it "appears" rather than "rises"

[0.78s] Final nilavilakku:
        from { opacity: 0, y: 8, filter: 'drop-shadow(0 0 0 rgba(212,162,54,0))' }
        to   { opacity: 1, y: 0,
               filter: 'drop-shadow(0 0 20px rgba(212,162,54,0.35))',
               duration: 1.0, ease: 'power3.out' }
        -- the strongest glow of any element in the template
        -- it is the last thing to appear: the dawn lamp, fully lit

[1.0s]  Lamp radial glow (the 120px background spot behind lamp):
        from { opacity: 0, scale: 0.5 }
        to   { opacity: 1, scale: 1, duration: 1.2, ease: 'power1.out' }
        -- the warm light pool expands outward from the lamp

[1.8s]  Start lamp breathing animation (CSS class toggle):
        tl.call(() => {
          finalLampRef.current?.classList.add('kd-lamp-breathing');
        });

[2.2s]  Attribution:
        from { opacity: 0 }
        to   { opacity: 0.4, duration: 0.5 }
        -- appears last, quietly
```

---

## 3. CSS @keyframes Definitions

### 3.1 Lamp Flame Flicker

A very subtle flame flicker for the nilavilakku icon. Not a full
flame-dance -- just the gentlest wavering, as if seen from across
a still courtyard.

```css
@keyframes kd-lamp-breathing {
  0%, 100% {
    filter: drop-shadow(0 0 16px rgba(212, 162, 54, 0.28));
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 0 22px rgba(212, 162, 54, 0.38));
    opacity: 0.95;
  }
}

.kd-lamp-breathing {
  animation: kd-lamp-breathing 6s ease-in-out infinite;
  will-change: filter, opacity;
}
```

Period: 6 seconds. The slow period makes it feel like natural lamp flame
movement rather than a pulsing UI indicator.

### 3.2 Kasavu Gold Shimmer

A traveling light sweep across the kasavu border pattern, evoking the
sheen of silk thread catching candlelight. Implemented as a CSS
gradient mask that translates horizontally.

```css
@keyframes kd-kasavu-shimmer {
  0% {
    mask-position: -200% 0;
    -webkit-mask-position: -200% 0;
  }
  100% {
    mask-position: 200% 0;
    -webkit-mask-position: 200% 0;
  }
}

.kd-kasavu-active .kd-kasavu-pattern {
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 35%,
    rgba(0, 0, 0, 0.4) 45%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 1) 65%,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 35%,
    rgba(0, 0, 0, 0.4) 45%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 1) 65%,
    rgba(0, 0, 0, 1) 100%
  );
  mask-size: 200% 100%;
  -webkit-mask-size: 200% 100%;
  animation: kd-kasavu-shimmer 5s ease-in-out infinite;
  animation-delay: 1s; /* wait for border to fully fade in */
}
```

The mask creates a narrow "dim band" that sweeps across, making the
gold pattern appear to catch and release light. Period: 5 seconds.

### 3.3 Touch Prompt Pulse Glow

```css
@keyframes kd-pulse-glow {
  0%, 100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 8px rgba(212, 162, 54, 0.15))
            drop-shadow(0 0 16px rgba(212, 162, 54, 0.06));
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 12px rgba(212, 162, 54, 0.30))
            drop-shadow(0 0 24px rgba(212, 162, 54, 0.12));
  }
}

.kd-cta-pulse {
  animation: kd-pulse-glow 3s ease-in-out infinite;
  will-change: opacity, filter;
}
```

Uses `filter: drop-shadow` instead of `box-shadow` because the star is
an SVG and needs the glow to follow its shape, not its bounding box.

### 3.4 Closing Lamp Intense Glow

The final lamp in Section 6 has a stronger version of the breathing
animation with a slightly different rhythm:

```css
@keyframes kd-lamp-final-glow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(212, 162, 54, 0.30))
            drop-shadow(0 0 40px rgba(212, 162, 54, 0.10));
  }
  35% {
    filter: drop-shadow(0 0 26px rgba(212, 162, 54, 0.40))
            drop-shadow(0 0 50px rgba(212, 162, 54, 0.15));
  }
  70% {
    filter: drop-shadow(0 0 22px rgba(212, 162, 54, 0.34))
            drop-shadow(0 0 44px rgba(212, 162, 54, 0.12));
  }
}

.kd-lamp-final {
  animation: kd-lamp-final-glow 5s ease-in-out infinite;
  will-change: filter;
}
```

The asymmetric keyframes (0 / 35% / 70% / 100% instead of 0 / 50% /
100%) create a slightly irregular rhythm that feels more organic -- like
a real flame rather than a mechanical pulse.

---

## 4. Interaction Animations

### 4.1 RSVP Button Hover / Press

All button interactions are CSS transitions, not GSAP. This keeps them
instant and avoids any GSAP overhead for simple UI feedback.

```css
/* Primary button (Will Attend) */
.kd-btn-primary {
  background: var(--kd-lamp-gold);
  color: var(--kd-teal-black);
  box-shadow: var(--kd-glow-button);
  transition: background 0.2s ease,
              box-shadow 0.25s ease,
              transform 0.15s ease;
}

.kd-btn-primary:hover {
  background: var(--kd-gold-bright);
  box-shadow: 0 0 16px rgba(212, 162, 54, 0.30),
              0 2px 8px rgba(0, 0, 0, 0.30);
  transform: translateY(-1px);
}

.kd-btn-primary:active {
  background: var(--kd-gold-dim);
  transform: translateY(0);
  transition-duration: 0.05s;
}

/* Secondary button (Regret) */
.kd-btn-secondary {
  background: transparent;
  border: 1px solid rgba(212, 162, 54, 0.30);
  color: var(--kd-kasavu-light);
  transition: border-color 0.2s ease,
              background 0.2s ease,
              transform 0.15s ease;
}

.kd-btn-secondary:hover {
  border-color: rgba(212, 162, 54, 0.50);
  background: rgba(212, 162, 54, 0.06);
}

.kd-btn-secondary:active {
  background: rgba(212, 162, 54, 0.10);
}
```

### 4.2 RSVP Button Submit Success

On successful submission, the primary button transforms. This uses GSAP
because it is a one-time state change with a timed revert:

```ts
const playSubmitSuccess = contextSafe(() => {
  const tl = gsap.timeline();

  tl.to(btnRef, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in',
  })
  .to(btnRef, {
    scale: 1,
    duration: 0.3,
    ease: 'back.out(1.7)',
  })
  // Text swap happens via React state at this point
  .to(btnRef, {
    background: '#2D5A27', // --kd-paddy
    duration: 0.4,
    ease: 'power1.out',
  }, '<');

  // Revert after 2s
  tl.to(btnRef, {
    background: '#D4A236', // --kd-lamp-gold
    duration: 0.4,
    delay: 2,
  });
});
```

### 4.3 Form Input Focus

Pure CSS transitions. No GSAP.

```css
.kd-input {
  border: 1px solid rgba(212, 162, 54, 0.20);
  box-shadow: var(--kd-shadow-inset);
  transition: border-color 0.2s ease,
              box-shadow 0.2s ease;
}

.kd-input:focus {
  border-color: rgba(212, 162, 54, 0.50);
  box-shadow: var(--kd-shadow-inset),
              0 0 0 2px rgba(212, 162, 54, 0.10);
  outline: none;
}
```

### 4.4 Guest Count Stepper

The stepper +/- buttons have a brief scale animation on press:

```css
.kd-stepper-btn:active {
  transform: scale(0.92);
  transition: transform 0.08s ease;
}
```

The number display updates via React state with no animation -- the
tabular-nums font feature prevents any visual jitter.

---

## 5. Dawn Warmth Progression

### 5.1 Technical Approach

The dawn warmth is achieved entirely through **static CSS gradients** on
each section. No ScrollTrigger-driven color interpolation, no CSS
variable transitions, no JavaScript color manipulation.

**Why static gradients:** Each section has a fixed background gradient
(defined in the design bible) that represents its moment in the dawn
arc. As the user scrolls from one section to the next, the background
naturally shifts warmer because each section's gradient starts where the
previous one ends. This is the simplest, most performant approach and
creates the most reliable visual result.

### 5.2 Section Background Map

```
Section 1 (Opening):     #050D0B solid (video covers it)
Section 2 (Couple):      #0A1F1C -> #1A3418 (dark teal to dark green)
Section 3 (Countdown):   #0F1A14 radial (deep neutral, slight regression)
Section 4 (Celebrations): #1A3418 -> #2D5A27 (dark green to paddy green)
Section 5 (RSVP):        #0D1B16 -> #142E1F (dark, calming regression)
Section 6 (Closing):     #2D5A27 -> #4A7838 + golden radial overlay
```

### 5.3 The Atmospheric Haze Intensification

Each section's gold haze overlay (the radial gradient centered on the
content) gets progressively more opaque:

| Section | Gold haze opacity |
|---------|-------------------|
| 2 (Couple) | 0.04 |
| 3 (Countdown) | 0.05 |
| 4 (Celebrations) | 0.07 |
| 5 (RSVP) | 0.06 |
| 6 (Closing) | 0.20 |

This subtle intensification contributes more to the perceived warmth
shift than the background colors alone. The jump from 0.06 to 0.20
at the Closing section is the "dawn arrives" moment.

### 5.4 Section Transition Zones

Between sections, there is no explicit transition animation. The CSS
background gradients are designed so that each section's top color
closely matches the previous section's bottom color:

```
Couple bottom:        #1A3418
Countdown top:        #0F1A14  (subtle darkening -- stepping into a quiet room)

Countdown bottom:     #0A1510
Celebrations top:     #1A3418  (noticeable warming -- dawn progressing)
Transition marker:    1px line at --kd-lamp-gold 0.10 opacity

Celebrations bottom:  #2D5A27
RSVP top:             #0D1B16  (cooling -- stepping inside for business)

RSVP bottom:          #142E1F
Closing top:          #2D5A27  (big jump -- dawn has arrived)
```

The Countdown-to-Celebrations transition gets a 1px gold hairline
rendered as a `<div>` between sections. No animation on it.

---

## 6. Reduced Motion Strategy

### 6.1 Detection

```ts
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
```

Checked once at mount. Also exposed as a CSS media query for the
keyframe animations.

### 6.2 CSS: Disable All @keyframes

```css
@media (prefers-reduced-motion: reduce) {
  .kd-cta-pulse,
  .kd-lamp-breathing,
  .kd-lamp-final,
  .kd-kasavu-active .kd-kasavu-pattern {
    animation: none !important;
  }

  /* Static equivalents */
  .kd-cta-pulse {
    opacity: 1;
    filter: drop-shadow(0 0 12px rgba(212, 162, 54, 0.20));
  }

  .kd-lamp-breathing,
  .kd-lamp-final {
    filter: drop-shadow(0 0 20px rgba(212, 162, 54, 0.30));
  }
}
```

### 6.3 JS: Instant Final States

When `prefersReducedMotion` is true, all GSAP animations are replaced
with instant `gsap.set()` calls:

```ts
useGSAP(() => {
  if (prefersReducedMotion) {
    // Skip all timelines. Set everything to final state immediately.
    gsap.set('.kd-reveal-target', { opacity: 1, y: 0 });
    gsap.set('.kd-kasavu-frame', { opacity: 1 });
    // ... etc for all animated elements
    return; // no ScrollTriggers created, no timelines
  }

  // Normal animation code...
}, { scope: containerRef });
```

### 6.4 Video Handling with Reduced Motion

```ts
if (prefersReducedMotion) {
  // Do not require tap interaction
  // Show poster frame (fully lit mandapam, frame 8)
  // Show names immediately (no staggered reveal)
  // No auto-scroll (user controls their own pace)
  videoRef.current.poster = '/templates/kerala-dawn/kerala-poster.webp';
  gsap.set(nameContainerRef, { opacity: 1, visibility: 'visible' });
  gsap.set([groomNameRef, ampersandRef, brideNameRef, dateRef], {
    opacity: 1, y: 0, filter: 'blur(0px)'
  });
  gsap.set(ctaRef, { display: 'none' }); // hide CTA since no interaction needed
}
```

### 6.5 Reduced Motion Summary

| Normal behavior | Reduced motion fallback |
|-----------------|------------------------|
| Tap CTA to play video | Poster frame shown, names visible immediately |
| Name reveal timeline (2.8s) | Names at final position instantly |
| Auto-scroll to Section 2 | No auto-scroll |
| Scroll-triggered fade-up reveals | All content visible immediately |
| Kasavu border shimmer loop | Static gold border |
| Lamp flame breathing loop | Static glow |
| Touch prompt pulse | Static glow |
| Elephant slide-in | Elephants at final position |
| Lotus bloom-in | Lotuses at final position |
| Button hover lift | Hover still works (CSS transition, not animation) |

---

## 7. Performance Constraints

### 7.1 No Continuous rAF Loops

**Zero** `requestAnimationFrame` loops run for static content. All
ambient animations (lamp glow, kasavu shimmer, pulse) use CSS
`@keyframes`, which the browser composites on the GPU without JS
involvement.

The only JS-driven timer is the countdown `setInterval(1000)` in
Section 3, which updates React state once per second. This is
negligible.

### 7.2 ScrollTrigger Cleanup

Every `useGSAP` hook with `{ scope: sectionRef }` automatically reverts
all GSAP animations and kills all ScrollTriggers on unmount. This is
handled by the `@gsap/react` package -- no manual cleanup needed.

Additionally, since `once: true` is used on all scroll reveals, each
ScrollTrigger kills itself after triggering. By the time the guest has
scrolled to the bottom of the invitation, only the last section's
ScrollTrigger remains (briefly).

### 7.3 Video Preload Strategy

```html
<video
  preload="metadata"
  playsinline
  muted
  poster="/templates/kerala-dawn/kerala-poster.webp"
>
  <source src="/templates/kerala-dawn/kerala.mp4" type="video/mp4" />
</video>
```

- `preload="metadata"` -- loads only dimensions, duration, and first
  frame. Does NOT download the full video on page load.
- Poster is a WebP image (~50-80KB) extracted from frame 8 (fully lit
  scene). This is what the guest sees before tapping.
- The video downloads on demand when `play()` is called (or shortly
  before, depending on the browser's preload behavior with metadata).
- `canplay` event listener retries `play()` if the first attempt
  fails due to insufficient buffer. Poster remains visible as fallback.

### 7.4 Maximum Simultaneous Tweens

At any given moment, the maximum number of active GSAP tweens is:

| Scenario | Active tweens |
|----------|---------------|
| Page load (before interaction) | 0 (pulse is CSS) |
| Name reveal playing | 5 (groom, &, bride, date, water transition) |
| Scrolling into Section 2 | 7 (frame, garlands, heading, families, divider, elephants) |
| Scrolling into Section 4 with 3 events | 4-6 (header items + batched cards) |
| All sections revealed, at rest | 0 (all CSS ambient only) |

No scenario exceeds ~8 simultaneous GSAP tweens. This is well within
comfortable performance for any modern device.

### 7.5 will-change Usage

Applied only to elements with active CSS animations:

```css
.kd-cta-pulse       { will-change: opacity, filter; }
.kd-lamp-breathing   { will-change: filter; }
.kd-lamp-final       { will-change: filter; }
```

`will-change` is NOT applied to:
- Elements that only animate once on scroll reveal (the tween is
  temporary; promoting the layer permanently wastes memory)
- Static decorative elements (watermarks, palms, garlands)
- The video element (the browser already composites video efficiently)

The `will-change` properties are added via CSS class only when the
animation class is toggled on (after reveal), and remain because the
CSS animation is indefinite. If we used GSAP for these loops, we would
set `force3D: true` on the individual tweens instead.

### 7.6 Filter Animation Cost

The `filter: drop-shadow()` animations on the lamp elements are the most
expensive CSS animations in the template. On very low-end devices, these
may cause repaint. Mitigation:

1. The affected elements are small (24-48px SVGs)
2. There are at most 2 lamp elements animating at once (Countdown +
   Closing, and only if both are in the viewport simultaneously, which
   is unlikely given the section heights)
3. The animation periods are long (5-6 seconds), so repaints are
   infrequent
4. Under reduced motion, these are disabled entirely

### 7.7 Font Loading

Kerala Dawn loads its own fonts (Cormorant Garamond + Outfit) via a
`<link>` in the component head or a font-face declaration. It does NOT
use the shared SiteFonts wrapper. After fonts load:

```ts
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
});
```

This ensures all ScrollTrigger positions are calculated with the correct
font metrics.

---

## 8. Implementation Checklist

For the React engineer building this template:

- [ ] Register GSAP plugins once at module scope
- [ ] Each section component: one `useGSAP({ scope: sectionRef })`
- [ ] Opening: `paused: true` timeline for name reveal, played by video timeupdate
- [ ] Opening: `contextSafe` wrapper for the tap handler
- [ ] Sections 2-6: `once: true` on all ScrollTriggers
- [ ] Section 4: `ScrollTrigger.batch()` for event cards
- [ ] CSS keyframes in the template's scoped stylesheet (`.kd-` prefix)
- [ ] Reduced motion: single early-return branch in each `useGSAP`
- [ ] Video: `canplay` listener, poster fallback, no autoplay
- [ ] `ScrollTrigger.refresh()` after `document.fonts.ready`
- [ ] No GSAP imports in SSR path
- [ ] All animation CSS classes toggled via timeline `.call()`, not inline styles
- [ ] Countdown timer: `setInterval` in React `useEffect`, cleared on unmount
- [ ] Auto-scroll: cancelled if user scrolls manually; timeout cleared on unmount

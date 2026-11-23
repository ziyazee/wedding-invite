# Amrit Glow — Motion Plan

Complete animation specification for the amrit-glow Punjabi wedding invitation template. Every tween, timeline, ScrollTrigger, CSS keyframe, and interaction is defined here with exact values. The implementation uses GSAP (with `useGSAP` from `@gsap/react`) for orchestrated, scroll-triggered, and PNG particle animations, and CSS `@keyframes` for simple looping ambient effects.

---

## 1. Opening Entrance Timeline

The hero section is the cinematic hook. A reference video plays, then couple names and date reveal with gold shimmer. The entire sequence is a single GSAP timeline created inside `useGSAP()` with the hero section ref as `scope`.

### Video Setup

```
- <video> element attributes:
    muted, playsInline, preload="auto", poster={posterFrame}
- On mount: attempt video.play()
- On canplay: if video.paused, retry video.play()
- On error / play rejection: hide video, show --ag-gradient-bg fallback with moon
```

**canplay retry logic**: The component stores a ref `hasPlayed`. On mount, call `video.play().catch(() => {})`. Register a `canplay` listener that checks `if (!hasPlayed.current && video.paused) video.play().catch(() => {})`. On successful `play` event, set `hasPlayed.current = true` and remove the listener. If neither fires within 6s (setTimeout fallback), skip to the text reveal regardless.

### GSAP Timeline: `heroEntrance`

```javascript
// Created inside useGSAP(() => { ... }, { scope: heroRef })
gsap.registerPlugin(ScrollTrigger);

const heroTl = gsap.timeline({
  paused: true,  // triggered by video timeupdate or timeout
  defaults: { ease: 'power2.out' }
});

// Step 1: Names fade in with gold shimmer (text-shadow glow)
heroTl.fromTo('.ag-hero-names', 
  { 
    opacity: 0, 
    y: 30,
    textShadow: '0 0 0px rgba(212, 168, 67, 0)'
  },
  { 
    opacity: 1, 
    y: 0,
    textShadow: '0 0 24px rgba(212, 168, 67, 0.35), 0 0 48px rgba(232, 198, 90, 0.15)',
    duration: 1.2,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)'  // --ag-hero-text-easing
  },
  'names'
);

// Step 2: Ampersand fades in alongside names, slightly delayed
heroTl.fromTo('.ag-hero-ampersand',
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  'names+=0.15'
);

// Step 3: Date text follows 0.3s after names start
heroTl.fromTo('.ag-hero-date',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
  'names+=0.3'
);

// Step 4: Scroll hint appears 1.2s after names start
heroTl.fromTo('.ag-scroll-hint',
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  'names+=1.2'
);

// Step 5: Hero sparkles begin spawning (staggered over 2s)
heroTl.fromTo('.ag-hero-particle',
  { opacity: 0 },
  { opacity: (i, el) => parseFloat(el.dataset.maxOpacity || '0.3'), 
    duration: 1.0, 
    stagger: 0.3, 
    ease: 'power1.inOut' },
  'names+=1.0'
);
```

### Trigger Logic

```javascript
// Video timeupdate listener triggers the timeline at ~4s
const onTimeUpdate = contextSafe(() => {
  if (videoRef.current && videoRef.current.currentTime >= 4 && !heroTriggered.current) {
    heroTriggered.current = true;
    heroTl.play();
  }
});

// Fallback: if video doesn't play or doesn't reach 4s within 6s, trigger anyway
const fallbackTimeout = setTimeout(() => {
  if (!heroTriggered.current) {
    heroTriggered.current = true;
    heroTl.play();
  }
}, 6000);

// Cleanup in useGSAP return
return () => {
  clearTimeout(fallbackTimeout);
  videoRef.current?.removeEventListener('timeupdate', onTimeUpdate);
};
```

### Opening Sequence Summary

| Time | What Happens | Duration |
|------|-------------|----------|
| 0.0s | Video begins playing (muted, playsInline) | continuous |
| 4.0s | `heroTl.play()` — names begin fade-up with gold shimmer | 1.2s |
| 4.15s | Ampersand fades in | 0.8s |
| 4.3s | Date text fades in | 0.8s |
| 5.0s | Hero particles start appearing (staggered) | 1.0s each, 0.3s stagger |
| 5.2s | Scroll hint fades in | 0.6s |
| 6.0s | Fallback fires if video never reached 4s | — |

---

## 2. Scroll Reveal Strategy

Every section below the hero reveals its content on scroll entry. All reveals use `once: true` — content appears and stays. The pattern is the project's shared text reveal: **fade in while rising from below**, no character or line stagger. Sequential sibling blocks stagger by 0.1s increments.

### Global Configuration

```javascript
const REVEAL_DEFAULTS = {
  y: 24,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.1,
};

const TRIGGER_DEFAULTS = {
  start: 'top 85%',    // trigger when element top hits 85% of viewport
  end: 'bottom 20%',   // not used with once:true, but defined for completeness
  once: true,
  toggleActions: 'play none none none',
};
```

### Per-Section ScrollTrigger Configurations

**Section 2 — Couple & Family**

```javascript
// Trigger: the couple section container
gsap.from('.ag-couple-names', {
  ...REVEAL_DEFAULTS,
  duration: 1.0,                // slightly longer for the formal names
  scrollTrigger: {
    trigger: '.ag-section-couple',
    ...TRIGGER_DEFAULTS,
  }
});

// Family info reveals after names
gsap.from('.ag-couple-family > *', {
  ...REVEAL_DEFAULTS,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.ag-couple-family',
    ...TRIGGER_DEFAULTS,
    start: 'top 88%',
  }
});

// Gold corners fade in with the section
gsap.from('.ag-section-couple .ag-gold-corner', {
  opacity: 0,
  scale: 0.85,
  duration: 1.0,
  ease: 'power2.out',
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.ag-section-couple',
    ...TRIGGER_DEFAULTS,
  }
});
```

**Section 3 — Countdown**

```javascript
gsap.from('.ag-countdown-text', {
  ...REVEAL_DEFAULTS,
  scrollTrigger: {
    trigger: '.ag-section-countdown',
    ...TRIGGER_DEFAULTS,
  }
});

gsap.from('.ag-timer-unit', {
  ...REVEAL_DEFAULTS,
  stagger: 0.08,                // tighter stagger for the 4 units
  scrollTrigger: {
    trigger: '.ag-timer-row',
    ...TRIGGER_DEFAULTS,
    start: 'top 88%',
  }
});

gsap.from('.ag-countdown-diya-row', {
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.ag-countdown-diya-row',
    ...TRIGGER_DEFAULTS,
    start: 'top 90%',
  }
});
```

**Section 4 — Celebrations (Events)**

Each event card/frame is an independent ScrollTrigger. The section heading reveals first, then events as they scroll in.

```javascript
// Section heading
gsap.from('.ag-celebrations-heading', {
  ...REVEAL_DEFAULTS,
  scrollTrigger: {
    trigger: '.ag-section-celebrations',
    ...TRIGGER_DEFAULTS,
  }
});

// Each event card/frame — batch approach for efficiency
ScrollTrigger.batch('.ag-event-block', {
  onEnter: (elements) => {
    gsap.from(elements, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1,
      overwrite: true,
    });
  },
  start: 'top 85%',
  once: true,
});

// Marigold garland dividers
ScrollTrigger.batch('.ag-marigold-garland', {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      scale: 0.92,
      duration: 1.0,
      ease: 'power2.out',
      overwrite: true,
    });
  },
  start: 'top 88%',
  once: true,
});

// Firework burst (Jaggo event only) — separate glow-in
gsap.from('.ag-firework-burst', {
  opacity: 0,
  scale: 0.7,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.ag-event-jaggo',
    ...TRIGGER_DEFAULTS,
    start: 'top 80%',
  }
});
```

**Section 5 — RSVP**

```javascript
gsap.from('.ag-rsvp-heading', {
  ...REVEAL_DEFAULTS,
  scrollTrigger: {
    trigger: '.ag-section-rsvp',
    ...TRIGGER_DEFAULTS,
  }
});

gsap.from('.ag-rsvp-form > *', {
  ...REVEAL_DEFAULTS,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.ag-rsvp-form',
    ...TRIGGER_DEFAULTS,
    start: 'top 85%',
  }
});
```

**Section 6 — Personal Notes**

```javascript
gsap.from('.ag-personal-note-text', {
  ...REVEAL_DEFAULTS,
  duration: 1.0,                // slower — intimate moment
  y: 20,                        // gentler rise
  scrollTrigger: {
    trigger: '.ag-section-notes',
    ...TRIGGER_DEFAULTS,
    start: 'top 80%',
  }
});

gsap.from('.ag-personal-note-attribution', {
  ...REVEAL_DEFAULTS,
  scrollTrigger: {
    trigger: '.ag-personal-note-text',
    ...TRIGGER_DEFAULTS,
    start: 'bottom 85%',        // after the quote text is in view
  }
});

// Diagonal gold corners
gsap.from('.ag-section-notes .ag-gold-corner', {
  opacity: 0,
  scale: 0.85,
  duration: 1.0,
  ease: 'power2.out',
  stagger: 0.15,
  scrollTrigger: {
    trigger: '.ag-section-notes',
    ...TRIGGER_DEFAULTS,
  }
});
```

**Section 7 — Closing**

```javascript
gsap.from('.ag-closing-names', {
  ...REVEAL_DEFAULTS,
  scrollTrigger: {
    trigger: '.ag-section-closing',
    ...TRIGGER_DEFAULTS,
  }
});

gsap.from('.ag-closing-date, .ag-closing-hashtag', {
  ...REVEAL_DEFAULTS,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.ag-closing-names',
    ...TRIGGER_DEFAULTS,
    start: 'bottom 90%',
  }
});

gsap.from('.ag-closing-diya-row > *', {
  opacity: 0,
  y: 12,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: '.ag-closing-diya-row',
    ...TRIGGER_DEFAULTS,
    start: 'top 90%',
  }
});
```

### ScrollTrigger Creation Order

Create ScrollTriggers in page order (top to bottom) or set `refreshPriority` so they refresh correctly:

| Section | refreshPriority |
|---------|----------------|
| Couple | 0 |
| Countdown | 1 |
| Celebrations heading | 2 |
| Event blocks (batch) | 3 |
| RSVP | 4 |
| Personal Notes | 5 |
| Closing | 6 |

---

## 3. PNG Animation Specifications

All PNG particle animations use GSAP `repeat: -1` tweens (no continuous rAF loops). Each particle is an absolutely positioned `<img>` with `pointer-events: none`, `mix-blend-mode: screen`, and a calculated starting position within its zone. Particles initialize only when their section enters a 200px threshold (IntersectionObserver), and pause when the section exits.

### 3.1 Diyas (Floating Oil Lamps)

**Behavior**: Gentle vertical bob in place. Diyas are placed elements (flanking rules), not free-floating particles. They maintain layout position but have a float animation applied.

**Sections**: Countdown (2), RSVP (2), Closing (3 in row)

```javascript
// Per-diya GSAP tween — created when section enters viewport
// Applied to each .ag-diya element

function createDiyaFloat(element) {
  const amplitude = gsap.utils.random(4, 8);
  const tiltDeg = gsap.utils.random(1, 3);

  return gsap.to(element, {
    y: -amplitude,
    rotation: tiltDeg,
    duration: gsap.utils.random(6, 10),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: gsap.utils.random(0, 5),
  });
}
```

**Spawn configuration**:

| Section | Count | Variant assignment | Position |
|---------|-------|--------------------|----------|
| Countdown | 2 | diya-1 (left), diya-2 (right) | Flanking `.ag-rule`, inline flex |
| RSVP | 2 | diya-3 (left), diya-4 (right) | Flanking `.ag-rule`, inline flex |
| Closing | 3 | diya-1, diya-2, diya-3 | Horizontal flex row, `gap: 32px` |

**Rendered size**: 28-44px (Countdown/RSVP: 40px; Closing: 32px)
**Blend**: `mix-blend-mode: screen`
**Opacity**: 0.30-0.50 (Countdown: 0.45; RSVP: 0.40; Closing: 0.50)

### 3.2 Sparkles (Gold Bokeh / Star Shapes)

**Behavior**: Two simultaneous motions — a shimmer (opacity pulse) and a slow positional drift with rotation. Sparkles are scattered in margins and fields.

**Sections**: Hero (4), Couple (2), Celebrations (4), Personal Notes (2)

```javascript
// Per-sparkle GSAP tween set — created per instance
function createSparkle(element) {
  const shimmerMin = gsap.utils.random(0.12, 0.18);
  const shimmerMax = gsap.utils.random(0.28, 0.42);

  // Shimmer: opacity oscillation
  const shimmerTween = gsap.fromTo(element,
    { opacity: shimmerMin },
    {
      opacity: shimmerMax,
      duration: gsap.utils.random(3, 5),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: gsap.utils.random(0, 4),
    }
  );

  // Drift: slow positional wander with rotation
  const dx1 = gsap.utils.random(-30, 30);
  const dy1 = gsap.utils.random(-25, 25);
  const dx2 = gsap.utils.random(-30, 30);
  const dy2 = gsap.utils.random(-25, 25);
  const dx3 = gsap.utils.random(-30, 30);
  const dy3 = gsap.utils.random(-25, 25);
  const rot1 = gsap.utils.random(-12, 12);
  const rot2 = gsap.utils.random(-12, 12);

  const driftTl = gsap.timeline({
    repeat: -1,
    delay: gsap.utils.random(0, 6),
    defaults: { ease: 'sine.inOut' },
  });

  const segDur = gsap.utils.random(12, 16) / 4;

  driftTl
    .to(element, { x: `+=${dx1}`, y: `+=${dy1}`, rotation: rot1, duration: segDur })
    .to(element, { x: `+=${dx2}`, y: `+=${dy2}`, rotation: rot2, duration: segDur })
    .to(element, { x: `+=${dx3}`, y: `+=${dy3}`, rotation: rot1, duration: segDur })
    .to(element, { x: 0, y: 0, rotation: 0, duration: segDur });

  return [shimmerTween, driftTl];
}
```

**Spawn configuration**:

| Section | Count | Variants | Position zones | Rendered sizes |
|---------|-------|----------|---------------|---------------|
| Hero | 4 | sparkle-6 (36px), sparkle-2 (22px), sparkle-4 (18px), sparkle-3 (28px) | `full-margin`, `upper-field` | 18-36px |
| Couple | 2 | sparkle-3 (24px), sparkle-4 (18px) | `left-margin`, `right-margin` | 18-24px |
| Celebrations | 4 | sparkle-3, sparkle-2, sparkle-4, sparkle-3 (spread across events) | `full-margin`, `lower-field` | 18-28px |
| Personal Notes | 2 | sparkle-4 (16px), sparkle-4 (16px) | `right-margin`, `lower-field` | 16px |

**Hero sparkle-6 special behavior**: During the hero entrance timeline, sparkle-6 briefly appears at `z-index: 4` (foreground) for a "sparkle across the names" effect, then transitions to `z-index: 2` after 2 seconds.

```javascript
// Inside heroTl, after names reveal
heroTl.set('.ag-sparkle-hero-fg', { zIndex: 4 }, 'names');
heroTl.to('.ag-sparkle-hero-fg', { zIndex: 2, duration: 0.01 }, 'names+=2.0');
```

### 3.3 Marigold Petals (Falling Petals)

**Behavior**: Spawn at top of zone, fall downward with lateral sinusoidal sway and tumble rotation. Fade out in the last 15% of fall. Respawn after a delay at a new random position.

**Sections**: Celebrations (7), Closing (3)

```javascript
// Per-petal GSAP timeline — manages a full spawn-fall-fade-respawn cycle
function createPetalCycle(element, sectionEl) {
  const sectionHeight = sectionEl.offsetHeight;
  const fallDist = gsap.utils.random(300, 500);
  const swayA = gsap.utils.random(-30, 30);
  const swayB = gsap.utils.random(-30, 30);
  const swayEnd = gsap.utils.random(-15, 15);
  const rotEnd = gsap.utils.random(-45, 45);
  const petalOpacity = gsap.utils.random(0.30, 0.55);
  const fallDuration = gsap.utils.random(10, 16);
  const respawnDelay = gsap.utils.random(2, 6);

  function randomSpawnX() {
    // Spawn across section width, avoiding 40px clustering
    return gsap.utils.random(5, 95) + '%';
  }

  function runCycle() {
    // Reset to top of zone at new X position
    gsap.set(element, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      left: randomSpawnX(),
      top: gsap.utils.random(0, 10) + '%',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(respawnDelay, runCycle);
      }
    });

    tl
      // Fade in
      .to(element, { opacity: petalOpacity, duration: 0.5, ease: 'power1.in' })
      // Fall with sway — 5 keyframe segments
      .to(element, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayA}`,
        rotation: 12,
        duration: fallDuration * 0.2,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayA * -0.6}`,
        rotation: -8,
        duration: fallDuration * 0.2,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayB}`,
        rotation: 18,
        duration: fallDuration * 0.2,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayB * -0.4}`,
        rotation: -5,
        duration: fallDuration * 0.2,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.2}`,
        x: `+=${swayEnd}`,
        rotation: rotEnd,
        opacity: 0,
        duration: fallDuration * 0.2,
        ease: 'none',
      });
  }

  // Start with a staggered initial delay
  gsap.delayedCall(gsap.utils.random(0, fallDuration), runCycle);
}
```

**Spawn configuration**:

| Section | Count | Variants | Rendered sizes |
|---------|-------|----------|---------------|
| Celebrations | 7 | Random mix of marigold-1 through marigold-5 (max 1 marigold-4 per viewport) | 14-24px |
| Closing | 3 | Random mix, no marigold-4 | 16-20px |

**Position zones**: Spawn in `upper-field` (y: 0-10%). Fall distances 300-500px. X positions randomized across `full-margin` + `upper-field` (5-95% width), with 40px minimum horizontal separation enforced at spawn time.

### 3.4 Gold Leaf Flakes (Metallic Confetti)

**Behavior**: Very slow downward drift with continuous full rotation (tumbling). The rotation is the primary visual characteristic. Lateral wander overlaid on the fall.

**Sections**: Hero (3), Couple (2), Celebrations (3), RSVP (2)

```javascript
// Per-leaf GSAP timeline — manages spawn-fall-fade-respawn cycle
function createLeafCycle(element, sectionEl) {
  const fallDist = gsap.utils.random(200, 400);
  const lateralDx = gsap.utils.random(-15, 15);
  const lateralDx2 = gsap.utils.random(-15, 15);
  const leafOpacity = gsap.utils.random(0.45, 0.80);
  const fallDuration = gsap.utils.random(12, 18);
  const rotDirection = Math.random() > 0.5 ? 360 : -360;
  const respawnDelay = gsap.utils.random(3, 8);

  function randomSpawnPos() {
    // Spawn in margins or field edges
    const zones = [
      { xMin: 0, xMax: 12 },    // left-margin
      { xMin: 88, xMax: 100 },  // right-margin
      { xMin: 10, xMax: 90 },   // upper/lower-field
    ];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    return gsap.utils.random(zone.xMin, zone.xMax) + '%';
  }

  function runCycle() {
    gsap.set(element, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      left: randomSpawnPos(),
      top: gsap.utils.random(0, 15) + '%',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(respawnDelay, runCycle);
      }
    });

    tl
      // Fade in
      .to(element, { opacity: leafOpacity, duration: 0.8, ease: 'power1.in' })
      // Fall with rotation and lateral wander — 4 segments
      .to(element, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx}`,
        rotation: rotDirection * 0.25,
        duration: fallDuration * 0.25,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx * -0.5}`,
        rotation: rotDirection * 0.5,
        duration: fallDuration * 0.25,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.25}`,
        x: `+=${lateralDx2}`,
        rotation: rotDirection * 0.75,
        duration: fallDuration * 0.25,
        ease: 'none',
      })
      .to(element, {
        y: `+=${fallDist * 0.25}`,
        x: 0,
        rotation: rotDirection,
        opacity: 0,                  // fade out in last segment
        duration: fallDuration * 0.25,
        ease: 'none',
      });
  }

  gsap.delayedCall(gsap.utils.random(0, fallDuration), runCycle);
}
```

**Spawn configuration**:

| Section | Count | Variants | Rendered sizes |
|---------|-------|----------|---------------|
| Hero | 3 | leaf-1, leaf-2, leaf-4 (max 1 leaf-3 per section) | 8-14px |
| Couple | 2 | leaf-2, leaf-4 | 10-14px |
| Celebrations | 3 | leaf-1, leaf-3, leaf-4 | 8-16px |
| RSVP | 2 | leaf-1, leaf-2 | 10-14px |

**Position zones**: `full-margin`, `upper-field`, `lower-field`. Fall distances 200-400px.

### 3.5 Particle Lifecycle Management (IntersectionObserver)

```javascript
// One observer per section, 200px rootMargin for early init
function createParticleObserver(sectionEl, particleTweens) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Resume all particle tweens for this section
        particleTweens.forEach(t => t.resume());
        // Add will-change on animated elements
        sectionEl.querySelectorAll('.ag-particle').forEach(el => {
          el.style.willChange = 'transform, opacity';
        });
      } else {
        // Pause all particle tweens for this section
        particleTweens.forEach(t => t.pause());
        // Remove will-change to free GPU layers
        sectionEl.querySelectorAll('.ag-particle').forEach(el => {
          el.style.willChange = 'auto';
        });
      }
    },
    { rootMargin: '200px 0px 200px 0px', threshold: 0 }
  );
  observer.observe(sectionEl);
  return observer;
}
```

---

## 4. CSS Keyframe Definitions

These are simple looping ambient effects that do not need GSAP orchestration.

### 4.1 Diya Glow Pulse

A warm glow pseudo-element behind each diya's flame area. Pulses gently to simulate flickering lamplight.

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
  background: radial-gradient(
    circle,
    rgba(255, 228, 160, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
  animation: ag-diya-glow 3s ease-in-out infinite;
}

@keyframes ag-diya-glow {
  0%, 100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.15);
  }
}
```

### 4.2 Gold Shimmer on Decorative Elements

A subtle traveling highlight on gold rule lines and ornamental dividers.

```css
.ag-rule::after,
.ag-rule-ornate::before,
.ag-rule-ornate::after {
  /* Existing styles preserved, animation added */
  animation: ag-gold-shimmer 4s ease-in-out infinite;
}

@keyframes ag-gold-shimmer {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.75;
  }
}
```

### 4.3 Scroll Arrow Bounce

The scroll hint arrow at the bottom of the hero section.

```css
.ag-scroll-hint-arrow {
  animation: ag-scroll-bounce 2s ease-in-out infinite;
}

@keyframes ag-scroll-bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
}
```

### 4.4 CSS Sparkle Dot (Supplement)

For additional ambient density without PNG overhead. Used as CSS-only sparkle replacements.

```css
.ag-sparkle-css {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ag-lamp);
  box-shadow: 0 0 6px 2px rgba(255, 228, 160, 0.35);
  animation: ag-css-shimmer var(--shimmer-dur, 4s) ease-in-out infinite;
  animation-delay: var(--shimmer-delay, 0s);
  pointer-events: none;
  position: absolute;
  z-index: var(--ag-z-particles-bg);
}

@keyframes ag-css-shimmer {
  0%, 100% {
    opacity: 0.1;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.2);
  }
}
```

### 4.5 Hero Name Gold Shimmer Sustain

After the GSAP entrance completes, the hero names maintain a subtle pulsing glow via CSS.

```css
.ag-hero-names.is-revealed {
  animation: ag-name-glow 4s ease-in-out infinite;
}

@keyframes ag-name-glow {
  0%, 100% {
    text-shadow:
      0 0 24px rgba(212, 168, 67, 0.30),
      0 0 48px rgba(232, 198, 90, 0.12);
  }
  50% {
    text-shadow:
      0 0 28px rgba(212, 168, 67, 0.40),
      0 0 56px rgba(232, 198, 90, 0.18);
  }
}
```

The `is-revealed` class is added by the hero GSAP timeline's `onComplete` callback to hand off from the GSAP text-shadow tween to the CSS sustain animation.

---

## 5. Interaction Animations

All interaction animations use GSAP for consistency and easy reduced-motion handling.

### 5.1 Button Hover / Active States

**Primary button (gold gradient)**:

```javascript
// Created via contextSafe inside useGSAP

// Hover enter
const onPrimaryHoverEnter = contextSafe((e) => {
  gsap.to(e.currentTarget, {
    boxShadow: '0 0 20px rgba(212, 168, 67, 0.35), 0 0 40px rgba(212, 168, 67, 0.15)',
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
  });
});

// Hover leave
const onPrimaryHoverLeave = contextSafe((e) => {
  gsap.to(e.currentTarget, {
    boxShadow: '0 0 0px rgba(212, 168, 67, 0)',
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
});

// Active (pressed)
const onPrimaryActive = contextSafe((e) => {
  gsap.to(e.currentTarget, {
    scale: 0.98,
    duration: 0.1,
    ease: 'power2.in',
  });
});
```

**Ghost button (outline)**:

```javascript
const onGhostHoverEnter = contextSafe((e) => {
  gsap.to(e.currentTarget, {
    borderColor: 'rgba(212, 168, 67, 0.60)',
    color: '#D4A843',
    boxShadow: '0 0 12px rgba(212, 168, 67, 0.10)',
    duration: 0.3,
    ease: 'power2.out',
  });
});

const onGhostHoverLeave = contextSafe((e) => {
  gsap.to(e.currentTarget, {
    borderColor: 'rgba(212, 168, 67, 0.25)',
    color: '#F5E6C8',
    boxShadow: '0 0 0px rgba(212, 168, 67, 0)',
    duration: 0.3,
    ease: 'power2.out',
  });
});
```

### 5.2 Form Field Focus Transitions

```javascript
// These can remain as CSS transitions (simpler, no GSAP needed):
```

```css
.ag-input {
  border-bottom: 1px solid var(--ag-divider);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.ag-input:focus {
  border-bottom-color: var(--ag-gold);
  box-shadow: 0 1px 0 0 var(--ag-gold);
}
```

Since these are simple two-state CSS transitions with no orchestration needs, CSS handles them. No GSAP overhead required.

### 5.3 RSVP Toggle Button Active State

When the user selects "Joyfully Accept" or "With Regrets", the active button gets a gold highlight and the other dims.

```javascript
function animateRsvpToggle(activeBtn, inactiveBtn) {
  const tl = gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.inOut' } });

  tl.to(activeBtn, {
    background: 'linear-gradient(135deg, #8B6914 0%, #D4A843 45%, #E8C65A 55%, #D4A843 100%)',
    color: '#0F1623',
    borderColor: 'transparent',
    scale: 1.02,
    boxShadow: '0 0 16px rgba(212, 168, 67, 0.25)',
  }, 0);

  tl.to(inactiveBtn, {
    background: 'transparent',
    color: '#F5E6C8',
    borderColor: 'rgba(212, 168, 67, 0.25)',
    scale: 1,
    boxShadow: 'none',
    opacity: 0.6,
  }, 0);

  return tl;
}
```

### 5.4 RSVP Thank-You Reveal

After successful RSVP submission, a thank-you message replaces the form.

```javascript
function animateRsvpThankYou(formEl, thankYouEl) {
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' }
  });

  // Fade out form
  tl.to(formEl, {
    opacity: 0,
    y: -12,
    duration: 0.4,
    onComplete: () => { formEl.style.display = 'none'; }
  });

  // Reveal thank-you
  tl.set(thankYouEl, { display: 'flex' });
  tl.fromTo(thankYouEl,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  );

  // Success checkmark scale-in
  tl.fromTo('.ag-rsvp-check',
    { scale: 0, rotation: -45 },
    { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' },
    '-=0.4'
  );

  return tl;
}
```

---

## 6. Reduced Motion Strategy

When `prefers-reduced-motion: reduce` is active, all decorative motion is disabled. Content is shown immediately. Only functional state transitions (form focus, button active) remain.

### Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Check this at the top of the `useGSAP` hook. If true, skip all GSAP timeline creation and particle initialization.

### CSS Fallback

```css
@media (prefers-reduced-motion: reduce) {
  /* ── Stop all CSS keyframe animations ── */
  .ag-diya::after,
  .ag-scroll-hint-arrow,
  .ag-rule::after,
  .ag-rule-ornate::before,
  .ag-rule-ornate::after,
  .ag-sparkle-css,
  .ag-hero-names.is-revealed {
    animation: none !important;
  }

  /* ── Hide all animated PNG particles ── */
  .ag-particle {
    display: none !important;
  }

  /* ── Show all content immediately (no scroll reveal) ── */
  .ag-hero-names,
  .ag-hero-ampersand,
  .ag-hero-date,
  .ag-scroll-hint,
  .ag-couple-names,
  .ag-couple-family,
  .ag-celebrations-heading,
  .ag-event-block,
  .ag-marigold-garland,
  .ag-rsvp-heading,
  .ag-rsvp-form,
  .ag-personal-note-text,
  .ag-personal-note-attribution,
  .ag-closing-names,
  .ag-closing-date,
  .ag-closing-hashtag,
  .ag-closing-diya-row,
  .ag-gold-corner,
  .ag-firework-burst {
    opacity: 1 !important;
    transform: none !important;
  }

  /* ── Video: do not autoplay, show poster ── */
  .ag-hero-video {
    display: none;
  }
  .ag-hero-poster {
    display: block;
    opacity: 1;
  }

  /* ── Functional transitions remain ── */
  .ag-input {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .ag-btn-primary,
  .ag-btn-ghost {
    transition: opacity 0.2s ease, border-color 0.2s ease;
  }
}
```

### GSAP Guard

```javascript
useGSAP(() => {
  if (prefersReducedMotion) {
    // Show all content immediately, no animations
    gsap.set('.ag-reveal-target', { opacity: 1, y: 0 });
    return; // No ScrollTriggers, no particles, no hero timeline
  }

  // ... all animation code from sections 1-3 and 5 goes here
}, { scope: templateRef });
```

### What Remains Active Under Reduced Motion

| Category | Behavior |
|----------|----------|
| Video | Does not autoplay. Poster frame shown. |
| Hero text | Visible immediately, static gold text-shadow. No glow pulse. |
| Scroll reveals | All content at `opacity: 1`, no transforms. Visible on load. |
| PNG particles | All hidden (`display: none`). |
| CSS ambient animations | All stopped (`animation: none`). |
| Diya glow pulse | Stopped. Diya images shown static (in Closing row). |
| Button hover | Disabled GSAP tweens; CSS `transition: opacity 0.2s` remains. |
| Form focus | CSS transitions preserved. |
| RSVP toggle | Instant state swap (no animation). |
| RSVP thank-you | Simple opacity fade (CSS transition, 0.3s). |
| Countdown timer | Numbers update without animation. |

---

## 7. Performance Budget

### Hard Limits

| Metric | Budget |
|--------|--------|
| Max concurrent GSAP tweens per section | 20 |
| Max animated PNG elements per section | 15 |
| Max simultaneously visible animated elements | ~10 |
| Max GPU-promoted layers (will-change) at any time | 15 |
| Total particle image payload (all sections) | ~140KB (only ~60KB loaded initially for hero) |

### Animation Property Constraints

- **Allowed in tweens**: `transform` properties (`x`, `y`, `rotation`, `scale`), `opacity`, `boxShadow`, `textShadow`, `color`, `borderColor`, `background` (for button states only)
- **Never in tweens**: `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`, or any layout-triggering property
- **will-change**: Applied via IntersectionObserver when section enters viewport. Removed when section exits. Never set statically in CSS on all particles.

### Off-Screen Pausing Strategy

Every section's particles are managed by an IntersectionObserver (see section 3.5). When a section leaves the viewport + 200px margin:

1. All GSAP tweens for that section are `.pause()`-d
2. `will-change` is set to `auto` on all particle elements in that section
3. No GSAP `.kill()` — tweens resume cleanly when the section re-enters

When a section enters the viewport - 200px margin:

1. All GSAP tweens for that section are `.resume()`-d
2. `will-change: transform, opacity` is restored

### Degradation Order

If frame rate drops below 45fps consistently (measured via `gsap.ticker` delta monitoring):

| Priority | Action | Elements affected | Visual impact |
|----------|--------|-------------------|--------------|
| 1 (first to drop) | Pause gold leaf flakes | 10 elements across 4 sections | Minimal — 8-16px metallic glints, barely noticed |
| 2 | Reduce sparkle count to 1 per visible section | ~8 elements reduced to ~2 | Low — fewer twinkling points |
| 3 | Pause marigold petal fall animation (show static) | 10 elements across 2 sections | Medium — petals freeze mid-fall |
| 4 (last resort) | Hide all particles, keep diyas as static images | All ~39 particles | High — ambient layer removed |

### Frame Rate Monitoring

```javascript
// Optional performance watchdog — only if degradation is needed
let frameCount = 0;
let lastCheck = 0;
let degradationLevel = 0;

gsap.ticker.add((time) => {
  frameCount++;
  if (time - lastCheck >= 2) { // check every 2 seconds
    const fps = frameCount / (time - lastCheck);
    frameCount = 0;
    lastCheck = time;

    if (fps < 45 && degradationLevel < 4) {
      degradationLevel++;
      applyDegradation(degradationLevel);
    }
  }
});

function applyDegradation(level) {
  switch (level) {
    case 1:
      document.querySelectorAll('.ag-gold-leaf').forEach(el => {
        gsap.killTweensOf(el);
        el.style.display = 'none';
      });
      break;
    case 2:
      // Keep only 1 sparkle per section, pause the rest
      document.querySelectorAll('.ag-section').forEach(section => {
        const sparkles = section.querySelectorAll('.ag-sparkle');
        sparkles.forEach((el, i) => {
          if (i > 0) { gsap.killTweensOf(el); el.style.display = 'none'; }
        });
      });
      break;
    case 3:
      document.querySelectorAll('.ag-marigold-petal').forEach(el => {
        gsap.killTweensOf(el);
        // Leave visible but static
      });
      break;
    case 4:
      document.querySelectorAll('.ag-particle').forEach(el => {
        gsap.killTweensOf(el);
        el.style.display = 'none';
      });
      break;
  }
}
```

### Image Loading Strategy

| Asset set | Loading | Preload? | Est. payload |
|-----------|---------|----------|-------------|
| Hero sparkles (sparkle-2, -3, -4, -6) | `loading="eager"` | Yes (hero particles) | ~60KB |
| Hero gold leaf (leaf-1, -2, -4) | `loading="eager"` | No (low priority) | ~9KB |
| All other particle PNGs | `loading="lazy"`, `decoding="async"` | No | ~70KB |
| Crescent moon | `loading="eager"` | No (static, non-critical) | ~15KB |
| Decorative (arch, garland, corners) | `loading="lazy"`, `decoding="async"` | No | ~50KB |

### Cleanup on Unmount

All animation cleanup is handled by `useGSAP`'s automatic `gsap.context().revert()`. This kills all GSAP tweens, timelines, and ScrollTriggers created within the scope. IntersectionObservers are disconnected in the `useGSAP` return cleanup function.

```javascript
useGSAP(() => {
  // ... all animation setup ...

  const observers = [];
  // ... create observers, push to array ...

  return () => {
    observers.forEach(obs => obs.disconnect());
    // gsap.context revert handles all GSAP cleanup automatically
  };
}, { scope: templateRef });
```

---

## Appendix: Easing Reference

| Context | Easing | GSAP value |
|---------|--------|-----------|
| Hero text reveal | Dramatic cinematic ease-out | `'cubic-bezier(0.16, 1, 0.3, 1)'` or `'expo.out'` |
| Scroll reveals | Standard ease-out | `'power2.out'` |
| Ambient float (diyas) | Smooth sinusoidal | `'sine.inOut'` |
| Ambient drift (sparkles) | Smooth sinusoidal | `'sine.inOut'` |
| Ambient fall (petals, leaf) | Constant speed | `'none'` (linear) |
| Interaction hover | Responsive | `'power2.out'` |
| Interaction press | Quick feedback | `'power2.in'` |
| RSVP toggle | Balanced transition | `'power2.inOut'` |
| RSVP thank-you reveal | Standard rise | `'power2.out'` |
| RSVP checkmark bounce | Playful overshoot | `'back.out(1.7)'` |

## Appendix: Complete Particle Budget Summary

| Section | Diyas | Sparkles | Petals | Gold Leaf | Total |
|---------|-------|----------|--------|-----------|-------|
| Hero | 0 | 4 | 0 | 3 | 7 |
| Couple | 0 | 2 | 0 | 2 | 4 |
| Countdown | 2 | 0 | 0 | 0 | 2 |
| Celebrations | 0 | 4 | 7 | 3 | 14 |
| RSVP | 2 | 0 | 0 | 2 | 4 |
| Personal Notes | 0 | 2 | 0 | 0 | 2 |
| Closing | 3 | 0 | 3 | 0 | 6 |
| **Total** | **7** | **12** | **10** | **10** | **39** |

Peak viewport load: 8-10 concurrent animated elements.

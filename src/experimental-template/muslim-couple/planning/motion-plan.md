# Muslim Couple Template -- Motion Plan

Complete GSAP animation specification for the React Engineer. Every code pattern here is copy-ready. All animations comply with Master Rules: no fade-up/translateY reveals (except the one permitted Entry Screen per-word overlay), only `transform` and `opacity` on animated elements, all tweens inside `gsap.context()` with cleanup, `prefers-reduced-motion` disables everything.

**GSAP version**: 3.15.1, `@gsap/react` 2.1.2 (already installed).  
**Plugins**: ScrollTrigger, MotionPathPlugin (register once at app entry).

---

## 1. Opening Sequence

The entry screen is a multi-phase choreography driven by user interaction and video playback. This is the most complex animation sequence in the template.

### Phase A: Initial State (page load)

```tsx
// On mount, all text elements start hidden
// The "Tap to Open" button is visible and breathing
// Scroll indicator is hidden
// Music button is visible

const INITIAL_STATE = {
  nameWords: { opacity: 0, y: 20 },     // each word element
  tapButton: { opacity: 1, scale: 1 },
  scrollIndicator: { opacity: 0 },
  musicButton: { opacity: 1 },
};
```

#### Tap-to-Open Breathing Animation

```tsx
useGSAP(() => {
  gsap.to(tapButtonRef.current, {
    scale: 1.03,
    duration: 1,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}, { scope: entryRef });
```

- Property: `scale` only (transform, GPU-composited)
- Duration: 2s full cycle (1s up, 1s down)
- Ease: `sine.inOut`
- Repeat: infinite, yoyo

### Phase B: Tap to Open (user taps button)

```tsx
const handleTapToOpen = contextSafe(() => {
  // 1. Fade out button
  gsap.to(tapButtonRef.current, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      // Remove from DOM after fade
      if (tapButtonRef.current) {
        tapButtonRef.current.style.display = "none";
      }
    },
  });

  // 2. Play video
  videoRef.current?.play().catch(() => {
    // Fallback: force text reveal if play fails
    forceTextReveal();
  });

  // 3. Start music (if not muted)
  if (!isMuted) {
    audioRef.current?.play().catch(() => {});
  }
});
```

- Button fade: `opacity: 1 -> 0`, 300ms, `power2.out`
- After fade: `display: none` (remove from layout)
- Video `play()` called with error catch

### Phase C: Text Reveal (video `timeupdate` driven)

The couple names and date fade in per-word, timed so the last word finishes 1 second before video ends. This is the **ONLY** place `translateY` is used (permitted by Master Rules Entry Screen Pattern).

#### Timing Calculation

```tsx
// Words: ["AISHA", "&", "FAIZAN", "December 20, 2025"] = 4 words
// Each word: 1s duration
// Stagger between words: 0.35s
// Total animation time: 1s + (3 x 0.35s) = 2.05s
// Last word must finish 1s before video ends
// triggerTime = videoDuration - 1s - 2.05s

const calculateTriggerTime = (videoDuration: number, wordCount: number): number => {
  const wordDuration = 1;        // seconds per word
  const stagger = 0.35;          // seconds between word starts
  const bufferAfterLastWord = 1; // seconds before video ends
  const totalAnimTime = wordDuration + (wordCount - 1) * stagger;
  return videoDuration - bufferAfterLastWord - totalAnimTime;
};
```

#### Timeline Definition

```tsx
// Build the per-word reveal timeline (created paused, triggered by timeupdate)
const buildTextRevealTimeline = (wordElements: HTMLElement[]): gsap.core.Timeline => {
  const tl = gsap.timeline({ paused: true });

  wordElements.forEach((word, i) => {
    tl.to(word, {
      opacity: 1,
      y: 0,           // from y: 20 (set in initial CSS/GSAP state)
      duration: 1,
      ease: "power2.out",
    }, i * 0.35);      // position: stagger 0.35s
  });

  return tl;
};
```

#### Video timeupdate Handler

```tsx
const textRevealed = useRef(false);
const textRevealTl = useRef<gsap.core.Timeline | null>(null);

const handleTimeUpdate = contextSafe(() => {
  const video = videoRef.current;
  if (!video || textRevealed.current) return;

  const triggerTime = calculateTriggerTime(video.duration, wordElements.length);

  if (video.currentTime >= triggerTime) {
    textRevealed.current = true;
    textRevealTl.current?.play();
  }
});

// Attach listener
// videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
```

#### Word Element Setup (initial state via GSAP)

```tsx
useGSAP(() => {
  // Set initial state for all word elements
  gsap.set(wordRefs.current, { opacity: 0, y: 20 });

  // Build the timeline (paused)
  textRevealTl.current = buildTextRevealTimeline(wordRefs.current);
}, { scope: entryRef });
```

**Properties animated**: `opacity` and `y` (translateY via transform) -- permitted ONLY here.  
**Duration**: 1s per word.  
**Stagger**: 0.35s between word starts.  
**Ease**: `power2.out`.

### Phase D: Scroll Indicator Appears

After the last word finishes its fade-in, the scroll chevron fades in and begins bouncing.

```tsx
// Called from the text reveal timeline's onComplete
const showScrollIndicator = contextSafe(() => {
  // Wait 200ms after last word
  gsap.delayedCall(0.2, () => {
    // Fade in the chevron
    gsap.to(scrollIndicatorRef.current, {
      opacity: 0.8,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        // Start bounce loop
        scrollBounceTl.current = gsap.timeline({ repeat: -1 });
        scrollBounceTl.current.to(scrollIndicatorRef.current, {
          y: 6,
          duration: 0.75,
          ease: "sine.inOut",
        }).to(scrollIndicatorRef.current, {
          y: 0,
          duration: 0.75,
          ease: "sine.inOut",
        });
      },
    });
  });
});

// Wire it up:
// In buildTextRevealTimeline, add onComplete to the timeline:
// const tl = gsap.timeline({ paused: true, onComplete: showScrollIndicator });
```

#### Scroll Indicator Fade on Scroll

```tsx
// ScrollTrigger to fade out the chevron when user scrolls
ScrollTrigger.create({
  trigger: entryRef.current,
  start: "top top",
  end: "+=50",           // 50px of scroll
  onUpdate: (self) => {
    if (self.progress > 0 && scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          // Remove from DOM entirely
          scrollIndicatorRef.current?.remove();
          scrollBounceTl.current?.kill();
        },
      });
      self.kill(); // Only fire once
    }
  },
});
```

- Bounce: `y: 0 -> 6 -> 0`, 1.5s full cycle, `sine.inOut`, infinite repeat
- Fade on scroll: `opacity -> 0`, 400ms, `power1.out`, triggered at 50px scroll
- After fade: removed from DOM, timeline killed

### Phase E: Fallback (video fails or exceeds 15s)

```tsx
const fallbackTimer = useRef<gsap.core.Tween | null>(null);

useGSAP(() => {
  // Set a 15-second deadline
  fallbackTimer.current = gsap.delayedCall(15, () => {
    if (!textRevealed.current) {
      forceTextReveal();
    }
  });
}, { scope: entryRef });

const forceTextReveal = contextSafe(() => {
  textRevealed.current = true;
  // Play the text reveal immediately
  textRevealTl.current?.play();
  // Hide the tap button if still visible
  gsap.to(tapButtonRef.current, { opacity: 0, duration: 0.3 });
});

// Also listen for video error:
// videoRef.current.addEventListener("error", forceTextReveal);
```

### Video canplay Retry

```tsx
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const handleCanPlay = () => {
    // Retry play if video was supposed to be playing
    if (videoShouldPlay.current && video.paused) {
      video.play().catch(() => {});
    }
  };

  video.addEventListener("canplay", handleCanPlay);
  return () => video.removeEventListener("canplay", handleCanPlay);
}, []);
```

### Complete Entry Sequence Timeline Summary

```
t=0s        Page loads. Poster visible. Tap button visible + breathing.
            Names at opacity:0, y:20. Scroll indicator at opacity:0.

[user taps]  Tap button fades out (300ms). Video plays. Music starts.

t=~7s       (for 10s video) Text reveal begins.
            Word 1 (name): opacity 0->1, y 20->0, 1s, power2.out
            Word 2 (&):    starts at t+0.35s
            Word 3 (name): starts at t+0.70s
            Word 4 (date): starts at t+1.05s
            Last word finishes at ~9s (1s before 10s video end)

t=~9.2s     Scroll indicator fades in (0->0.8, 400ms)
            Bounce loop begins (y: 0->6->0, 1.5s cycle)

[user scrolls 50px]  Scroll indicator fades out (400ms), removed from DOM
```

---

## 2. Section Entry Animations

Every section (2-6) uses ScrollTrigger to reveal elements as they enter the viewport. **NO fade-up/translateY** -- only `opacity`, `scale`, and `clip-path` reveals.

### Shared Entry Timeline Pattern

```tsx
// Reusable pattern for every section (2-6)
const useSectionEntryAnimation = (
  sectionRef: RefObject<HTMLElement>,
  elements: SectionEntryConfig[]
) => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true, // play once, never reverse
      },
      defaults: {
        ease: "power2.out",
      },
    });

    elements.forEach(({ ref, props, position }) => {
      tl.to(ref.current, props, position);
    });
  }, { scope: sectionRef });
};
```

### Section 2: Family Details

```tsx
useGSAP(() => {
  // Set initial states
  gsap.set([bismillahRef.current, ...bismillahFlankRefs.current], {
    opacity: 0, scale: 0.92,
  });
  gsap.set(goldDividerRef.current, {
    opacity: 0, clipPath: "inset(0 50% 0 50%)",
  });
  gsap.set(togetherRef.current, { opacity: 0 });
  gsap.set(familyCard1Ref.current, { opacity: 0, scale: 0.95 });
  gsap.set(petalClusterRef.current, { opacity: 0 });
  gsap.set(familyCard2Ref.current, { opacity: 0, scale: 0.95 });
  gsap.set(cornerArabesqueRefs.current, { opacity: 0 });

  // Build entry timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: familySectionRef.current,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    defaults: { ease: "power2.out" },
  });

  tl.to(bismillahRef.current, {
    opacity: 1, scale: 1, duration: 1,
  }, 0)
  .to(bismillahFlankRefs.current, {
    opacity: 1, scale: 1, duration: 1,
  }, 0) // simultaneous with bismillah
  .to(goldDividerRef.current, {
    opacity: 1,
    clipPath: "inset(0 0% 0 0%)",
    duration: 0.8,
  }, 0.2)
  .to(togetherRef.current, {
    opacity: 1, duration: 0.8,
  }, 0.4)
  .to(familyCard1Ref.current, {
    opacity: 1, scale: 1, duration: 0.8,
  }, 0.6)
  .to(petalClusterRef.current, {
    opacity: 0.4, duration: 0.6,
  }, 0.8)
  .to(familyCard2Ref.current, {
    opacity: 1, scale: 1, duration: 0.8,
  }, 0.9)
  .to(cornerArabesqueRefs.current, {
    opacity: 0.2, duration: 0.6,
  }, 1.0);

  // Start ambient animations after entry completes
  tl.eventCallback("onComplete", () => {
    startAmbientAnimations();
  });
}, { scope: familySectionRef });
```

**Element order and timing:**

| # | Element | From | To | Duration | Position | Ease |
|---|---------|------|-----|----------|----------|------|
| 1 | Bismillah + arabesque flanks | opacity:0, scale:0.92 | opacity:1, scale:1 | 1000ms | 0 | power2.out |
| 2 | Gold divider line | opacity:0, clipPath:inset(0 50% 0 50%) | opacity:1, clipPath:inset(0 0% 0 0%) | 800ms | 0.2 | power2.out |
| 3 | "Together with their families" | opacity:0 | opacity:1 | 800ms | 0.4 | power2.out |
| 4 | First family card | opacity:0, scale:0.95 | opacity:1, scale:1 | 800ms | 0.6 | power2.out |
| 5 | Petal cluster ornament | opacity:0 | opacity:0.4 | 600ms | 0.8 | power2.out |
| 6 | Second family card | opacity:0, scale:0.95 | opacity:1, scale:1 | 800ms | 0.9 | power2.out |
| 7 | Corner arabesques | opacity:0 | opacity:0.2 | 600ms | 1.0 | power2.out |
| 8 | Ambient animations begin | -- | -- | -- | 1.2 | -- |

### Section 3: Countdown

```tsx
useGSAP(() => {
  gsap.set(countdownTitleRef.current, { opacity: 0, scale: 0.92 });
  gsap.set(flourishRef.current, {
    opacity: 0, clipPath: "inset(0 50% 0 50%)",
  });
  gsap.set(countdownCardRef.current, { opacity: 0, scale: 0.93 });
  gsap.set(lanternRefs.current, { opacity: 0 });
  gsap.set(dateTimeRef.current, { opacity: 0 });
  gsap.set(bottomFlorishPairRef.current, { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: countdownSectionRef.current,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    defaults: { ease: "power2.out" },
  });

  tl.to(countdownTitleRef.current, {
    opacity: 1, scale: 1, duration: 1,
  }, 0)
  .to(flourishRef.current, {
    opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.8,
  }, 0.2)
  .to(countdownCardRef.current, {
    opacity: 1, scale: 1, duration: 0.8,
  }, 0.4)
  .to(lanternRefs.current, {
    opacity: 1, duration: 0.6,
  }, 0.5)
  .to(dateTimeRef.current, {
    opacity: 1, duration: 0.8,
  }, 0.7)
  .to(bottomFlorishPairRef.current, {
    opacity: 0.3, duration: 0.6,
  }, 0.9);
}, { scope: countdownSectionRef });
```

| # | Element | To | Duration | Position |
|---|---------|-----|----------|----------|
| 1 | Section title | opacity:1, scale:1 | 1000ms | 0 |
| 2 | Arabesque flourish | opacity:1, clipPath reveal | 800ms | 0.2 |
| 3 | Countdown card | opacity:1, scale:1 | 800ms | 0.4 |
| 4 | Lanterns | opacity:1 | 600ms | 0.5 |
| 5 | Date + time text | opacity:1 | 800ms | 0.7 |
| 6 | Bottom arabesque pair | opacity:0.3 | 600ms | 0.9 |
| 7 | Ambient animations begin | -- | -- | 1.0 |

### Section 4: Celebrations

Each event card has its own ScrollTrigger so cards further down animate independently as they scroll into view.

```tsx
useGSAP(() => {
  // Section title + flourish (one-time)
  gsap.set(celebrationsTitleRef.current, { opacity: 0, scale: 0.92 });
  gsap.set(celebrationsFlourish.current, {
    opacity: 0, clipPath: "inset(0 50% 0 50%)",
  });

  const headerTl = gsap.timeline({
    scrollTrigger: {
      trigger: celebrationsSectionRef.current,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    defaults: { ease: "power2.out" },
  });

  headerTl
    .to(celebrationsTitleRef.current, {
      opacity: 1, scale: 1, duration: 1,
    }, 0)
    .to(celebrationsFlourish.current, {
      opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.8,
    }, 0.2);

  // Per-card entry animations
  eventCardRefs.current.forEach((cardRef, index) => {
    gsap.set(cardRef, { opacity: 0, scale: 0.95 });

    gsap.to(cardRef, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  });

  // Card separator dots animate with their following card
  separatorRefs.current.forEach((sepRef) => {
    gsap.set(sepRef, { opacity: 0 });
    gsap.to(sepRef, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sepRef,
        start: "top 90%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  });
}, { scope: celebrationsSectionRef });
```

| # | Element | To | Duration | Trigger |
|---|---------|-----|----------|---------|
| 1 | Section title | opacity:1, scale:1 | 1000ms | Section top 85% |
| 2 | Flourish | opacity:1, clipPath reveal | 800ms | +0.2s |
| 3-N | Each event card | opacity:1, scale:1 | 800ms | Card top 85% (independent) |
| -- | Card separators | opacity:1 | 400ms | Separator top 90% |

### Section 5: RSVP

```tsx
useGSAP(() => {
  gsap.set(rsvpTitleRef.current, { opacity: 0, scale: 0.92 });
  gsap.set(rsvpFlourish.current, {
    opacity: 0, clipPath: "inset(0 50% 0 50%)",
  });
  gsap.set(rsvpSubtitleRef.current, { opacity: 0 });
  gsap.set(rsvpCardRef.current, { opacity: 0, scale: 0.95 });
  gsap.set(rsvpCornerArabesques.current, { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: rsvpSectionRef.current,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    defaults: { ease: "power2.out" },
  });

  tl.to(rsvpTitleRef.current, {
    opacity: 1, scale: 1, duration: 1,
  }, 0)
  .to(rsvpFlourish.current, {
    opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.8,
  }, 0.2)
  .to(rsvpSubtitleRef.current, {
    opacity: 1, duration: 0.8,
  }, 0.3)
  .to(rsvpCardRef.current, {
    opacity: 1, scale: 1, duration: 0.8,
  }, 0.5)
  .to(rsvpCornerArabesques.current, {
    opacity: 0.15, duration: 0.6,
  }, 0.7);
}, { scope: rsvpSectionRef });
```

| # | Element | To | Duration | Position |
|---|---------|-----|----------|----------|
| 1 | Section title | opacity:1, scale:1 | 1000ms | 0 |
| 2 | Arabesque flourish | opacity:1, clipPath reveal | 800ms | 0.2 |
| 3 | Subtitle | opacity:1 | 800ms | 0.3 |
| 4 | Form card | opacity:1, scale:1 | 800ms | 0.5 |
| 5 | Corner arabesques | opacity:0.15 | 600ms | 0.7 |
| 6 | Ambient animations begin | -- | -- | 0.8 |

### Section 6: Closing

The closing section has the most elaborate entry with early emergence of the mosque silhouette.

```tsx
useGSAP(() => {
  gsap.set(mosqueRef.current, { opacity: 0 });
  gsap.set(crescentMoonRef.current, { opacity: 0 });
  gsap.set(moonGlowRef.current, { opacity: 0 });
  gsap.set(duaArabicRef.current, { opacity: 0, scale: 0.92 });
  gsap.set(duaEnglishRef.current, { opacity: 0 });
  gsap.set(closingDividerRef.current, {
    opacity: 0, clipPath: "inset(0 50% 0 50%)",
  });
  gsap.set(signoffRefs.current, { opacity: 0 });
  gsap.set(bottomGarlandRef.current, { opacity: 0 });
  gsap.set(footerRef.current, { opacity: 0 });

  // Mosque starts emerging early (when section is still below viewport)
  gsap.to(mosqueRef.current, {
    opacity: 0.1,
    duration: 1.5,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: closingSectionRef.current,
      start: "top 100%",   // starts when section's top reaches viewport bottom
      toggleActions: "play none none none",
      once: true,
    },
  });

  // Main content entry timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: closingSectionRef.current,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    defaults: { ease: "power2.out" },
  });

  tl.to(crescentMoonRef.current, {
    opacity: 0.25, duration: 1.2,
  }, 0.3)
  .to(moonGlowRef.current, {
    opacity: 0.15, duration: 1.2,
  }, 0.3)
  .to(duaArabicRef.current, {
    opacity: 1, scale: 1, duration: 1,
  }, 0.5)
  .to(duaEnglishRef.current, {
    opacity: 0.85, duration: 0.8,
  }, 0.7)
  .to(closingDividerRef.current, {
    opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.8,
  }, 0.9)
  .to(signoffRefs.current, {
    opacity: 1, duration: 0.8,
  }, 1.0)
  .to(bottomGarlandRef.current, {
    opacity: 1, duration: 1,
  }, 1.5)
  .to(footerRef.current, {
    opacity: 0.5, duration: 0.6,
  }, 2.0);

  // Ambient animations start at staggered delays after entry
  // Sparkles: 0.8s, Petals: 1.2s, Birds: 1.5s
}, { scope: closingSectionRef });
```

| # | Element | To | Duration | Position |
|---|---------|-----|----------|----------|
| 0 | Mosque silhouette (early) | opacity:0.1 | 1500ms | Separate ST, start:"top 100%" |
| 1 | Crescent moon + glow | opacity:0.25 / 0.15 | 1200ms | 0.3 |
| 2 | Arabic Dua | opacity:1, scale:1 | 1000ms | 0.5 |
| 3 | English translation | opacity:0.85 | 800ms | 0.7 |
| 4 | Gold divider | clipPath reveal | 800ms | 0.9 |
| 5 | Sign-off text | opacity:1 | 800ms | 1.0 |
| 6 | Sparkles begin | -- | -- | 0.8 (ambient) |
| 7 | Petals begin | -- | -- | 1.2 (ambient) |
| 8 | Birds begin flight | -- | -- | 1.5 (ambient) |
| 9 | Bottom garland | opacity:1 | 1000ms | 1.5 |
| 10 | Footer | opacity:0.5 | 600ms | 2.0 |

---

## 3. Scroll-Linked Animations

### 3.1 Background Parallax

Background decorative elements move at a slightly slower rate than content, creating subtle depth. Content itself NEVER has parallax -- only decorative layers.

#### Family Section -- Geometric Star Texture + Corner Arabesques

```tsx
useGSAP(() => {
  // Background star texture parallax (0.95x = 5% slower)
  gsap.to(starTextureRef.current, {
    yPercent: -5,       // moves 5% less than scroll
    ease: "none",
    scrollTrigger: {
      trigger: familySectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,      // direct link to scroll, no lag
    },
  });

  // Corner arabesques same parallax rate
  gsap.to(cornerArabesqueRefs.current, {
    yPercent: -5,
    ease: "none",
    scrollTrigger: {
      trigger: familySectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}, { scope: familySectionRef });
```

#### Countdown Section -- Jali Lattice Texture

```tsx
useGSAP(() => {
  gsap.to(jaliTextureRef.current, {
    yPercent: -5,
    ease: "none",
    scrollTrigger: {
      trigger: countdownSectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}, { scope: countdownSectionRef });
```

#### Celebrations Section -- Star Texture

```tsx
useGSAP(() => {
  gsap.to(celebrationsTextureRef.current, {
    yPercent: -5,
    ease: "none",
    scrollTrigger: {
      trigger: celebrationsSectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}, { scope: celebrationsSectionRef });
```

#### Closing Section -- Mosque Silhouette + Crescent Moon

The closing section has the strongest parallax in the template.

```tsx
useGSAP(() => {
  // Mosque at 0.9x (10% slower -- most pronounced parallax)
  gsap.to(mosqueRef.current, {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: closingSectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // Crescent moon at 0.92x (8% slower)
  gsap.to(crescentContainerRef.current, {
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
      trigger: closingSectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}, { scope: closingSectionRef });
```

### 3.2 Parallax Rate Summary

| Section | Element | Scroll Rate | yPercent Offset | scrub |
|---------|---------|-------------|-----------------|-------|
| Family | Star geometric texture | 0.95x | -5 | true |
| Family | Corner arabesques | 0.95x | -5 | true |
| Countdown | Jali lattice texture | 0.95x | -5 | true |
| Celebrations | Star geometric texture | 0.95x | -5 | true |
| RSVP | (none) | 1.0x | -- | -- |
| Closing | Mosque silhouette | 0.9x | -10 | true |
| Closing | Crescent moon | 0.92x | -8 | true |

### 3.3 Scroll Indicator Fade (Entry Section)

Already covered in Section 1 Phase D. Uses `ScrollTrigger.create()` with `onUpdate` callback to detect 50px of scroll and trigger a one-time fade-out.

---

## 4. Ambient Animations

All ambient animations share these rules:
- Only `transform` and `opacity` properties
- Inside `gsap.context()` with cleanup
- Paused via IntersectionObserver when section exits viewport
- `will-change: transform` applied during animation, removed on pause
- All randomization via `gsap.utils.random()`, never `Math.random()` in render
- All elements created on mount (no infinite spawning)
- All wrapped in `gsap.matchMedia()` for reduced-motion guard

### 4.1 Rose Petals (Floating)

Curved S-path drift using MotionPathPlugin. Present in sections 2-6.

#### Per-Petal Timeline

```tsx
const createPetalTimeline = (
  petalEl: HTMLElement,
  sectionWidth: number,
  sectionHeight: number
): gsap.core.Timeline => {
  const duration = gsap.utils.random(5, 9);
  const delay = gsap.utils.random(1, 4);
  const goRight = gsap.utils.random(0, 1) > 0.5;
  const hDrift = gsap.utils.random(80, 160);
  const vFall = gsap.utils.random(200, 400);
  const rotation = gsap.utils.random(-180, 180);
  const peakOpacity = gsap.utils.random(0.3, 0.6);
  const initialScale = gsap.utils.random(0.6, 1.0);

  // Randomize start position
  const startX = goRight
    ? gsap.utils.random(0, sectionWidth * 0.3)
    : gsap.utils.random(sectionWidth * 0.7, sectionWidth);
  const startY = gsap.utils.random(-20, sectionHeight * 0.1);

  // Build motion path (S-curve)
  const endX = goRight ? startX + hDrift : startX - hDrift;
  const midX1 = goRight ? startX + hDrift * 0.3 : startX - hDrift * 0.3;
  const midX2 = goRight ? startX + hDrift * 0.7 : startX - hDrift * 0.7;
  const endY = startY + vFall;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: delay,
    delay: gsap.utils.random(0, 3), // offset initial start
  });

  // Set initial position and scale
  gsap.set(petalEl, {
    x: startX,
    y: startY,
    scale: initialScale,
    opacity: 0,
  });

  // Motion path + rotation
  tl.to(petalEl, {
    motionPath: {
      path: [
        { x: startX, y: startY },
        { x: midX1, y: startY + vFall * 0.3 },
        { x: midX2, y: startY + vFall * 0.6 },
        { x: endX, y: endY },
      ],
      curviness: 1.5,
    },
    rotation: rotation,
    duration: duration,
    ease: "none",            // linear rotation feels natural
  }, 0);

  // Opacity: fade in 0-15%, hold, fade out 85-100%
  tl.to(petalEl, {
    opacity: peakOpacity,
    duration: duration * 0.15,
    ease: "sine.in",
  }, 0);
  tl.to(petalEl, {
    opacity: 0,
    duration: duration * 0.15,
    ease: "sine.out",
  }, duration * 0.85);

  return tl;
};
```

#### Section Integration

```tsx
// Example for Family section (3 petals)
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const petalTimelines: gsap.core.Timeline[] = [];
    const sectionEl = familySectionRef.current!;
    const { width, height } = sectionEl.getBoundingClientRect();

    petalRefs.current.forEach((petalEl) => {
      if (!petalEl) return;
      petalEl.style.willChange = "transform";
      const tl = createPetalTimeline(petalEl, width, height);
      petalTimelines.push(tl);
    });

    // IntersectionObserver pause/resume
    const observer = new IntersectionObserver(
      ([entry]) => {
        petalTimelines.forEach((tl) => {
          if (entry.isIntersecting) {
            tl.resume();
            petalRefs.current.forEach((el) => {
              if (el) el.style.willChange = "transform";
            });
          } else {
            tl.pause();
            petalRefs.current.forEach((el) => {
              if (el) el.style.willChange = "auto";
            });
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      petalTimelines.forEach((tl) => tl.kill());
    };
  });
}, { scope: familySectionRef });
```

#### Petal Counts Per Section

| Section | Count | Opacity Range | Notes |
|---------|-------|---------------|-------|
| Entry | 0 | -- | Video provides visual interest |
| Family | 3 | 0.2-0.4 | Low opacity, light scatter |
| Countdown | 4 | 0.2-0.4 | Slightly more, warm background |
| Celebrations | 2 | 0.2-0.4 | Minimal, informational section |
| RSVP | 3 | 0.2-0.4 | Gentle around form |
| Closing | 6 | 0.3-0.6 | Most petals, garden in bloom |

#### Petal Colors (randomized per instance)

```tsx
const PETAL_COLORS = ["#C87890", "#D4A0A8", "#E0A0B0", "#F0B0C0"];
// Applied via fill attribute on the SVG
```

#### Petal SVG Variants

4 shapes: A (curled, above view), B (elongated, side view), C (wide, partially open), D (small, tight curl). Each ~14px x 10px. Randomly assigned on mount.

### 4.2 Four-Pointed Star Sparkles

Stationary elements with opacity + scale pulse creating a "glint" effect.

#### Per-Sparkle Timeline

```tsx
const createSparkleTimeline = (sparkleEl: HTMLElement): gsap.core.Timeline => {
  const holdDuration = gsap.utils.random(0.6, 1.2);
  const dormantDuration = gsap.utils.random(2, 5);
  const initialDelay = gsap.utils.random(0, 5);

  const tl = gsap.timeline({
    repeat: -1,
    delay: initialDelay,
  });

  // Start hidden
  gsap.set(sparkleEl, { opacity: 0, scale: 0.3 });

  // Phase 1: Appear (400ms)
  tl.to(sparkleEl, {
    opacity: 0.7,
    scale: 1.0,
    duration: 0.4,
    ease: "power2.out",
  });

  // Phase 2: Hold (600-1200ms)
  tl.to(sparkleEl, {
    opacity: 0.7,     // maintain
    scale: 1.0,
    duration: holdDuration,
  });

  // Phase 3: Fade (500ms)
  tl.to(sparkleEl, {
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    ease: "power2.in",
  });

  // Phase 4: Dormant (2000-5000ms) -- just hold at 0 opacity
  tl.to(sparkleEl, {
    opacity: 0,
    duration: dormantDuration,
  });

  return tl;
};
```

#### Sparkle Counts Per Section

| Section | Count | Positions |
|---------|-------|-----------|
| Family | 2 | Near gold borders of family cards |
| Countdown | 3 | Around countdown card, near lanterns |
| Celebrations | 1 | Near section title |
| RSVP | 1 | Near submit button area |
| Closing | 3 | Scattered in sky area, near mosque |

**Total cycle per sparkle**: 3500-7500ms (400ms appear + 600-1200ms hold + 500ms fade + 2000-5000ms dormant).

**Asset**: 16x16 four-pointed star SVG. Color: `#FFFFFF` at 70% opacity. `filter: blur(0.5px)` for soft glow.

### 4.3 Lantern Glow Pulse

Warm amber glow behind lantern SVGs that "breathes" like a real flame.

#### Per-Lantern Glow Timeline

```tsx
const createLanternGlowTimeline = (glowEl: HTMLElement): gsap.core.Timeline => {
  const initialDelay = gsap.utils.random(0, 1.5);

  gsap.set(glowEl, { opacity: 0.6, scale: 0.95 });

  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    delay: initialDelay,
  });

  tl.to(glowEl, {
    opacity: 1.0,
    scale: 1.05,
    duration: 1.5,
    ease: "sine.inOut",
  });

  // yoyo handles the reverse: back to opacity 0.6, scale 0.95

  return tl;
};
```

- **Properties**: `opacity` (0.6 <-> 1.0) and `scale` (0.95 <-> 1.05)
- **Full cycle**: 3000ms (1500ms in + 1500ms out via yoyo)
- **Ease**: `sine.inOut`
- **Stagger**: Each lantern starts at random offset (0-1500ms)

#### Lantern Counts

| Section | Count | Notes |
|---------|-------|-------|
| Countdown | 2 | Flanking the countdown card |
| Closing | 2 | If lanterns in composition |

#### Glow Element CSS

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

### 4.4 Bird Flight (Closing Section Only)

Lazy arcs across the viewport using MotionPathPlugin, with wing flap via scaleY.

#### Per-Bird Timeline

```tsx
const createBirdTimeline = (
  birdEl: HTMLElement,
  config: {
    fromLeft: boolean;
    startYPercent: number;
    endYPercent: number;
    sectionWidth: number;
    sectionHeight: number;
  }
): gsap.core.Timeline => {
  const { fromLeft, startYPercent, endYPercent, sectionWidth, sectionHeight } = config;
  const traversalDuration = gsap.utils.random(12, 18);
  const pauseBetween = gsap.utils.random(5, 10);
  const birdSize = gsap.utils.random(18, 22);

  const startX = fromLeft ? -birdSize : sectionWidth + birdSize;
  const endX = fromLeft ? sectionWidth + birdSize : -birdSize;
  const startY = sectionHeight * startYPercent;
  const endY = sectionHeight * endYPercent;
  const midY = Math.min(startY, endY) - gsap.utils.random(20, 60); // arc upward

  // Flip bird SVG if going right-to-left
  gsap.set(birdEl, {
    scaleX: fromLeft ? 1 : -1,
    x: startX,
    y: startY,
    opacity: 0.2,
  });

  const master = gsap.timeline({
    repeat: -1,
    repeatDelay: pauseBetween,
  });

  // Flight arc
  master.to(birdEl, {
    motionPath: {
      path: [
        { x: startX, y: startY },
        { x: (startX + endX) / 2, y: midY },
        { x: endX, y: endY },
      ],
      curviness: 1.2,
    },
    duration: traversalDuration,
    ease: "none",     // linear traversal
  }, 0);

  // Wing flap (scaleY oscillation, independent timing)
  const wingTl = gsap.timeline({
    repeat: Math.ceil(traversalDuration / 0.8),
  });
  wingTl.to(birdEl, {
    scaleY: 0.85,
    duration: 0.4,
    ease: "sine.inOut",
  }).to(birdEl, {
    scaleY: 1.0,
    duration: 0.4,
    ease: "sine.inOut",
  });

  master.add(wingTl, 0);

  // Reset position before repeat
  master.set(birdEl, {
    x: startX,
    y: startY,
  }, `>${pauseBetween}`);

  return master;
};
```

#### Bird Configuration

```tsx
const BIRD_CONFIGS = [
  {
    fromLeft: true,
    startYPercent: 0.15,
    endYPercent: 0.12,
    staggerDelay: 0,
  },
  {
    fromLeft: false,
    startYPercent: 0.20,
    endYPercent: 0.18,
    staggerDelay: gsap.utils.random(3, 6),
  },
];
```

- **Count**: 2 birds in Closing section only
- **Traversal**: 12,000-18,000ms per crossing, linear ease
- **Wing flap**: `scaleY: 1.0 -> 0.85 -> 1.0`, 800ms cycle, `sine.inOut`
- **Pause between crossings**: 5,000-10,000ms (bird hidden off-screen)
- **Stagger**: 3,000-6,000ms between birds

### 4.5 Crescent Moon Glow (Closing Section Only)

A slow wax/wane on the glow element behind the crescent moon. The moon SVG itself stays at constant opacity.

```tsx
const createMoonGlowTimeline = (glowEl: HTMLElement): gsap.core.Timeline => {
  gsap.set(glowEl, { opacity: 0.15 });

  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });

  tl.to(glowEl, {
    opacity: 0.35,
    duration: 2.5,
    ease: "sine.inOut",
  });

  // yoyo reverses back to 0.15

  return tl;
};
```

- **Property**: `opacity` only (0.15 <-> 0.35)
- **Full cycle**: 5000ms (2500ms wax + 2500ms wane via yoyo)
- **Ease**: `sine.inOut`
- **Count**: 1 (Closing section only)
- The moon SVG itself: constant `opacity: 0.25`, no animation

#### Moon Glow Element CSS

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
  pointer-events: none;
}
```

### 4.6 Countdown Digit Transition

When a countdown number changes, the outgoing digit scales down/fades and the incoming scales up/fades in, with a gold sparkle flash.

```tsx
const animateDigitChange = (
  outgoingEl: HTMLElement,
  incomingEl: HTMLElement,
  sparkleEl: HTMLElement,
  contextSafe: (fn: Function) => Function
) => {
  const animate = contextSafe(() => {
    // Outgoing digit
    gsap.to(outgoingEl, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(outgoingEl, { display: "none" });
      },
    });

    // Incoming digit
    gsap.set(incomingEl, { scale: 1.2, opacity: 0, display: "block" });
    gsap.to(incomingEl, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    // Gold sparkle flash at number center
    gsap.set(sparkleEl, { opacity: 0, scale: 0.5 });
    const sparkleTl = gsap.timeline();
    sparkleTl.to(sparkleEl, {
      opacity: 0.8,
      scale: 1.2,
      duration: 0.15,
      ease: "power2.out",
    }).to(sparkleEl, {
      opacity: 0,
      scale: 0.8,
      duration: 0.25,
      ease: "power2.in",
    });
  });

  return animate;
};
```

**Outgoing digit**: `scale: 1 -> 0.8`, `opacity: 1 -> 0`, 300ms, `power2.out`  
**Incoming digit**: `scale: 1.2 -> 1`, `opacity: 0 -> 1`, 300ms, `power2.out`  
**Sparkle flash**: `opacity: 0 -> 0.8 -> 0`, `scale: 0.5 -> 1.2 -> 0.8`, 400ms total  
**Triggered by**: countdown update logic (not a timer), only when the digit actually changes.

**Sparkle asset**: 12x12 four-pointed star, `--mc-gold` color.

---

## 5. Interactive Animations

### 5.1 Tap-to-Open Button

Already specified in Section 1 Phase B.

- **Breathing**: `scale: 1 <-> 1.03`, 2s cycle, `sine.inOut`, repeat:-1, yoyo:true
- **On tap**: `opacity: 1 -> 0`, 300ms, `power2.out`, then `display: none`
- Kill the breathing timeline on tap before starting the fade

### 5.2 Music Button Toggle

```tsx
const toggleMusic = contextSafe(() => {
  if (isPlaying) {
    audioRef.current?.pause();
    // Swap icon: note -> pause bars
    gsap.to(musicIconRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.15,
      ease: "power2.out",
      onComplete: () => {
        setIsPlaying(false);
        gsap.to(musicIconRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      },
    });
  } else {
    audioRef.current?.play().catch(() => {});
    // Same quick swap animation
    gsap.to(musicIconRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.15,
      ease: "power2.out",
      onComplete: () => {
        setIsPlaying(true);
        gsap.to(musicIconRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      },
    });
  }
});
```

- **Icon swap**: scale down + fade out (150ms), change icon state, scale up + fade in (150ms)
- Total toggle animation: 300ms

### 5.3 RSVP Form Interactions

#### Focus States (CSS transitions, not GSAP)

```css
.mc-rsvp-input {
  border-bottom: 1px solid var(--mc-cream);
  transition: border-bottom-color 300ms ease;
}
.mc-rsvp-input:focus {
  border-bottom-color: var(--mc-gold);
  outline: none;
}

.mc-rsvp-textarea {
  border: 1px solid var(--mc-cream);
  transition: border-color 300ms ease;
}
.mc-rsvp-textarea:focus {
  border-color: var(--mc-gold);
  outline: none;
}

/* Keyboard accessibility */
.mc-rsvp-input:focus-visible,
.mc-rsvp-textarea:focus-visible,
.mc-rsvp-submit:focus-visible {
  outline: 2px solid var(--mc-gold);
  outline-offset: 2px;
}
```

#### Radio Button Selection (GSAP)

```tsx
const animateRadioSelect = contextSafe((dotEl: HTMLElement) => {
  gsap.fromTo(dotEl, {
    scale: 0,
    opacity: 0,
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.2,
    ease: "power2.out",
  });
});

const animateRadioDeselect = contextSafe((dotEl: HTMLElement) => {
  gsap.to(dotEl, {
    scale: 0,
    opacity: 0,
    duration: 0.15,
    ease: "power2.in",
  });
});
```

- Selected inner circle (`12px`, fill `--mc-gold`): `scale: 0 -> 1`, 200ms, `power2.out`
- Deselected: `scale: 1 -> 0`, 150ms, `power2.in`

#### Guest Count Stepper

```tsx
const animateCountChange = contextSafe((
  countEl: HTMLElement,
  direction: "increment" | "decrement"
) => {
  // Quick scale pulse on the number
  gsap.fromTo(countEl, {
    scale: direction === "increment" ? 1.15 : 0.85,
  }, {
    scale: 1,
    duration: 0.25,
    ease: "power2.out",
  });
});
```

- On increment: number briefly scales up to 1.15, then back to 1 (250ms)
- On decrement: number briefly scales down to 0.85, then back to 1 (250ms)
- Stepper button press: CSS `transform: scale(0.98)` and `background: var(--mc-champagne)`, 150ms transition

#### Submit Button States

```tsx
// Active/pressed (CSS transition):
// .mc-rsvp-submit:active { background: var(--mc-champagne); transform: scale(0.98); }

// Success state (GSAP):
const animateSubmitSuccess = contextSafe(() => {
  gsap.to(submitBtnRef.current, {
    backgroundColor: "rgba(90, 125, 90, 0.15)",
    duration: 0.4,
    ease: "power2.out",
  });
  // Text/icon change handled by React state
  // Color transition to --mc-green for text handled via className swap
});
```

- **Pressed**: `scale: 0.98`, `background: champagne`, 150ms (CSS transition)
- **Success**: `background -> rgba(90,125,90,0.15)`, 400ms, text changes to "Response Sent" with checkmark in `--mc-green`

### 5.4 Maps/Calendar Link Tap Feedback

```css
.mc-card-event-action {
  transition: transform 150ms ease, opacity 150ms ease;
}
.mc-card-event-action:active {
  transform: scale(0.95);
  opacity: 0.8;
}
```

CSS-only, no GSAP needed. Quick scale + opacity on tap.

---

## 6. Transition Animations

### 6.1 Gradient Bleed (60px overlap)

Each section has a `::after` pseudo-element creating a gradient blend into the next section's background.

```css
/* Family -> Countdown */
.mc-section-family::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #E8D5C0);
  pointer-events: none;
  z-index: 2;
}

/* Countdown -> Celebrations */
.mc-section-countdown::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #FAF5EB);
  pointer-events: none;
  z-index: 2;
}

/* Celebrations -> RSVP */
.mc-section-celebrations::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #F5F0E8);
  pointer-events: none;
  z-index: 2;
}

/* RSVP -> Closing (longer, 80px, starts the sunset sky hint) */
.mc-section-rsvp::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(192, 160, 176, 0.1) 50%,
    rgba(139, 166, 199, 0.15) 100%
  );
  pointer-events: none;
  z-index: 2;
}
```

These are **static CSS** -- no GSAP animation. The gradient is always present; the scroll creates the blending illusion naturally.

### 6.2 Ornamental Bridge Elements

| Transition | Bridge Element | Implementation |
|------------|---------------|----------------|
| Entry -> Family | Hard break (no bridge) | No transition element; 56px ivory padding |
| Family -> Countdown | Jali lattice strip | SVG strip, 100% width x 40px, `--mc-cream`, at section bottom |
| Countdown -> Celebrations | Mirrored arabesque pair | Two 40px flourishes facing each other, centered, `--mc-gold` at 30% |
| Celebrations -> RSVP | Garland drape | WebP, 100% width x 40px, blush flowers, z-index:30 |
| RSVP -> Closing | Mosque emergence | Mosque silhouette fades to 3% opacity in RSVP's last 80px (via Closing section's mosque positioned with `top: -80px`) |

Bridge elements are **static** (no animation). They participate in the section entry animations (fading in with their parent section) but do not have independent scroll-linked motion.

### 6.3 Cross-Section Parallax

The mosque silhouette in the Closing section extends into the RSVP section's space via negative positioning:

```css
.mc-decor-mosque {
  position: absolute;
  top: -80px;  /* extends 80px above the closing section into RSVP space */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  pointer-events: none;
  z-index: 2;
}
```

The mosque's parallax (0.9x scroll rate) is applied via ScrollTrigger on the Closing section. Since the mosque starts above the section, the parallax creates a subtle emergence effect as the user scrolls from RSVP into Closing.

---

## 7. Performance Budget

### 7.1 Concurrent Animated Elements Per Section

| Section | Petals | Sparkles | Lantern Glows | Birds | Moon | Chevron | CD Flash | Total |
|---------|--------|----------|---------------|-------|------|---------|----------|-------|
| Entry | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |
| Family | 3 | 2 | 0 | 0 | 0 | 0 | 0 | **5** |
| Countdown | 4 | 3 | 2 | 0 | 0 | 0 | 4 | **13** |
| Celebrations | 2 | 1 | 0 | 0 | 0 | 0 | 0 | **3** |
| RSVP | 3 | 1 | 0 | 0 | 0 | 0 | 0 | **4** |
| Closing | 6 | 3 | 2 | 2 | 1 | 0 | 0 | **14** |

All sections within the **15-element maximum**. Typically only 1-2 sections are visible at once, keeping the actual concurrent count low (usually under 20 total across visible sections).

### 7.2 Memory Management: gsap.context() Cleanup

Every section component wraps ALL its GSAP work in a single `gsap.context()` via `useGSAP({ scope: sectionRef })`. This ensures:

- All tweens, timelines, and ScrollTriggers created within the scope are tracked
- On unmount, `.revert()` kills everything and restores inline styles
- No stray tweens leak between component lifecycles

```tsx
// Pattern: one useGSAP per section, everything inside
useGSAP((context, contextSafe) => {
  // Entry animations (ScrollTrigger)
  // Ambient animations (timelines)
  // IntersectionObserver setup
  // Event listeners (via contextSafe)

  // Cleanup runs automatically on unmount via context.revert()
  return () => {
    // Additional manual cleanup if needed
    observer?.disconnect();
  };
}, { scope: sectionRef });
```

### 7.3 matchMedia Breakpoints

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  // Reduced motion: disable ALL animation
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // ALL ambient and entry animations go here
    // Automatically reverted when media query stops matching

    return () => {
      // Cleanup
    };
  });

  // Mobile-specific adjustments (if needed)
  mm.add("(max-width: 480px)", () => {
    // Reduce petal counts, simplify paths if needed
  });

  // Desktop (within InvitationViewport frame)
  mm.add("(min-width: 768px)", () => {
    // Parallax rates may be adjusted for desktop
  });
}, { scope: sectionRef });
```

### 7.4 Reduced Motion: Complete Disable Strategy

When `prefers-reduced-motion: reduce` is active:

**CSS Layer** (always applied):
```css
@media (prefers-reduced-motion: reduce) {
  .mc-root * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
  .mc-decor-petal,
  .mc-decor-sparkle,
  .mc-anim-float,
  .mc-decor-bird {
    display: none !important;
  }
}
```

**GSAP Layer** (conditional creation):
```tsx
// ALL animation code wrapped in matchMedia
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  // Entry animations
  // Ambient animations
  // ScrollTrigger parallax
  // All GSAP timelines

  return () => {
    // Full cleanup -- runs when media query stops matching
  };
});
```

**Static fallback state:**
- All content at full opacity, no scale transforms
- Lantern glows static at `opacity: 0.8`
- Moon glow static at `opacity: 0.2`
- Scroll indicator static at `y: 0`, still fades on scroll (via JS, not animation)
- Countdown numbers swap instantly (no scale animation)
- "Tap to Open" has no breathing animation
- Entry screen text displayed immediately (no word stagger)
- No petals, sparkles, or birds rendered

### 7.5 will-change Management

```tsx
// Apply when animation starts / section enters viewport
element.style.willChange = "transform";

// Remove when animation pauses / section leaves viewport
element.style.willChange = "auto";

// For IntersectionObserver pattern:
const observer = new IntersectionObserver(([entry]) => {
  animatedElements.forEach((el) => {
    el.style.willChange = entry.isIntersecting ? "transform" : "auto";
  });
  timelines.forEach((tl) => {
    entry.isIntersecting ? tl.resume() : tl.pause();
  });
}, { threshold: 0 });
```

Never set `will-change` on elements that are not actively animating. This prevents unnecessary GPU memory usage.

---

## 8. GSAP Code Patterns

Reusable patterns the React engineer should follow for every section.

### 8.1 Hook Setup with useGSAP

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register plugins once at module level
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

const SectionComponent: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP((context, contextSafe) => {
    // ---- Initial states ----
    gsap.set(titleRef.current, { opacity: 0, scale: 0.92 });
    gsap.set(cardRef.current, { opacity: 0, scale: 0.95 });

    // ---- Entry animation ----
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      defaults: { ease: "power2.out" },
    });

    entryTl
      .to(titleRef.current, { opacity: 1, scale: 1, duration: 1 }, 0)
      .to(cardRef.current, { opacity: 1, scale: 1, duration: 0.8 }, 0.4);

    // ---- Ambient animations (inside matchMedia) ----
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Create ambient timelines here
      // IntersectionObserver here
      return () => { /* cleanup */ };
    });

    // ---- Event handlers (contextSafe) ----
    const handleClick = contextSafe(() => {
      gsap.to(cardRef.current, { scale: 0.98, duration: 0.15 });
    });

    cardRef.current?.addEventListener("click", handleClick);
    return () => {
      cardRef.current?.removeEventListener("click", handleClick);
    };
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="mc-section-example">
      <h2 ref={titleRef}>Title</h2>
      <div ref={cardRef}>Card</div>
    </div>
  );
};
```

### 8.2 ScrollTrigger Registration Pattern

```tsx
// Plugin registration (once, at module level)
gsap.registerPlugin(ScrollTrigger);

// Inside useGSAP:
// 1. Tween with inline scrollTrigger (simple cases)
gsap.to(elementRef.current, {
  opacity: 1,
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 85%",
    toggleActions: "play none none none",
    once: true,
  },
});

// 2. Timeline with scrollTrigger (sequenced reveals)
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 85%",
    toggleActions: "play none none none",
    once: true,
  },
});
tl.to(a, { ... }, 0).to(b, { ... }, 0.3);

// 3. Scrub-linked (parallax)
gsap.to(bgRef.current, {
  yPercent: -5,
  ease: "none",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

// 4. Standalone (scroll indicator fade)
ScrollTrigger.create({
  trigger: entryRef.current,
  start: "top top",
  end: "+=50",
  onUpdate: (self) => { /* custom logic */ },
});
```

**Key rules:**
- Never put ScrollTrigger on a child tween inside a timeline
- Use `toggleActions` for discrete play/reverse, `scrub` for scroll-linked -- never both
- `once: true` for entry animations that should not reverse
- Create ScrollTriggers in page order (top to bottom) for correct refresh

### 8.3 Context Cleanup

```tsx
// Using useGSAP (preferred) -- cleanup is automatic
useGSAP(() => {
  // Everything here is automatically reverted on unmount
  const tl = gsap.timeline();
  tl.to(".element", { x: 100 });

  ScrollTrigger.create({ trigger: ".section", ... });

  // Return additional cleanup if needed
  return () => {
    observer?.disconnect();
  };
}, { scope: sectionRef });

// If using useEffect instead (not recommended but acceptable):
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP code here
  }, sectionRef);

  return () => ctx.revert(); // ALWAYS clean up
}, []);
```

### 8.4 IntersectionObserver Integration

```tsx
// Standard pattern for ambient animation pause/resume
const useAmbientPause = (
  sectionRef: RefObject<HTMLElement>,
  timelines: gsap.core.Timeline[],
  elements: HTMLElement[]
) => {
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Resume animations
          timelines.forEach((tl) => tl.resume());
          // Apply will-change
          elements.forEach((el) => {
            el.style.willChange = "transform";
          });
        } else {
          // Pause animations
          timelines.forEach((tl) => tl.pause());
          // Remove will-change
          elements.forEach((el) => {
            el.style.willChange = "auto";
          });
        }
      },
      { threshold: 0 } // any part visible = resume
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [sectionRef, timelines, elements]);
};
```

### 8.5 matchMedia Usage

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  // Reduced motion guard (REQUIRED for all animations)
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // ALL ambient animations
    const petalTl = createPetalTimeline(/* ... */);
    const sparkleTl = createSparkleTimeline(/* ... */);

    // ALL entry animations
    const entryTl = gsap.timeline({ scrollTrigger: { /* ... */ } });

    // ALL parallax
    gsap.to(bgRef.current, { yPercent: -5, scrollTrigger: { /* ... */ } });

    // Cleanup runs automatically when media query stops matching
    return () => {
      observer?.disconnect();
    };
  });

  // Mobile adjustments (optional, within no-preference)
  mm.add(
    {
      isSmall: "(max-width: 380px)",
      isMedium: "(min-width: 381px) and (max-width: 480px)",
    },
    (context) => {
      const { isSmall } = context.conditions!;
      if (isSmall) {
        // Reduce petal count or simplify paths
      }
    }
  );
}, { scope: sectionRef });
```

### 8.6 Reduced Motion Check (Imperative)

For cases where you need to check reduced motion outside of `matchMedia`:

```tsx
const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Usage in event handlers:
const handleTapToOpen = contextSafe(() => {
  if (prefersReducedMotion()) {
    // Skip animation, show content immediately
    gsap.set(tapButtonRef.current, { display: "none" });
    gsap.set(wordRefs.current, { opacity: 1, y: 0 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0.8 });
    videoRef.current?.play().catch(() => {});
  } else {
    // Full animated sequence
    gsap.to(tapButtonRef.current, { opacity: 0, duration: 0.3, /* ... */ });
    // ...
  }
});
```

### 8.7 Complete Section Component Template

```tsx
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

interface SectionProps {
  // template data props
}

const TemplateSection: React.FC<SectionProps> = (props) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLElement[]>([]);
  const petalRefs = useRef<HTMLElement[]>([]);
  const sparkleRefs = useRef<HTMLElement[]>([]);

  useGSAP((context, contextSafe) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ========== ENTRY ANIMATIONS ==========
      // Set initial states
      contentRefs.current.forEach((el) => {
        gsap.set(el, { opacity: 0, scale: 0.95 });
      });

      // Build entry timeline
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      contentRefs.current.forEach((el, i) => {
        entryTl.to(el, {
          opacity: 1, scale: 1, duration: 0.8,
        }, i * 0.2);
      });

      // ========== PARALLAX ==========
      // (if section has background texture)

      // ========== AMBIENT ANIMATIONS ==========
      const ambientTimelines: gsap.core.Timeline[] = [];

      // Petals
      petalRefs.current.forEach((petalEl) => {
        if (!petalEl) return;
        const tl = createPetalTimeline(petalEl, /* ... */);
        ambientTimelines.push(tl);
      });

      // Sparkles
      sparkleRefs.current.forEach((sparkleEl) => {
        if (!sparkleEl) return;
        const tl = createSparkleTimeline(sparkleEl);
        ambientTimelines.push(tl);
      });

      // ========== INTERSECTION OBSERVER ==========
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = entry.isIntersecting;
          ambientTimelines.forEach((tl) => {
            isVisible ? tl.resume() : tl.pause();
          });
          [...petalRefs.current, ...sparkleRefs.current].forEach((el) => {
            if (el) el.style.willChange = isVisible ? "transform" : "auto";
          });
        },
        { threshold: 0 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);

      // Cleanup (runs on unmount or when media query stops matching)
      return () => {
        observer.disconnect();
        ambientTimelines.forEach((tl) => tl.kill());
      };
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="mc-section-name">
      {/* Background texture (for parallax) */}
      {/* Decorative elements */}
      {/* Content elements (assigned to contentRefs) */}
      {/* Ambient elements: petals (assigned to petalRefs) */}
      {/* Ambient elements: sparkles (assigned to sparkleRefs) */}
    </div>
  );
};
```

---

## Appendix A: Easing Reference

| Context | Easing | Notes |
|---------|--------|-------|
| Section entry reveals | `power2.out` | Quick start, gentle settle |
| Clip-path reveals (dividers) | `power2.out` | Same as entry |
| Ambient float (petals) | `sine.inOut` for path, `none` for rotation | Organic, smooth |
| Sparkle appear | `power2.out` | Quick pop |
| Sparkle fade | `power2.in` | Soft fade |
| Lantern glow | `sine.inOut` | Smooth breathing |
| Moon glow | `sine.inOut` | Slow, atmospheric |
| Bird traversal | `none` (linear) | Constant glide |
| Bird wing flap | `sine.inOut` | Gentle beat |
| Scroll indicator bounce | `sine.inOut` | Gentle bounce |
| Button fade (tap-to-open) | `power2.out` | Quick response |
| Scroll indicator fade | `power1.out` | Gentle exit |
| Countdown digit out | `power2.out` | Quick shrink |
| Countdown digit in | `power2.out` | Quick grow |
| Music icon toggle | `power2.out` | Responsive |
| Radio select | `power2.out` | Quick pop |
| Submit success | `power2.out` | Satisfying |
| Tap-to-open breathing | `sine.inOut` | Organic pulse |

## Appendix B: Duration Reference

| Animation | Duration | Notes |
|-----------|----------|-------|
| Text appearance (entry words) | 1000ms each, 350ms stagger | Per-word reveal |
| UI element appear | 600-800ms | General fade-in |
| Card entrance (scale+fade) | 800ms | Section entry |
| Ambient float (petals) | 5000-9000ms per cycle | Per-petal random |
| Sparkle full cycle | 3500-7500ms | Including dormant |
| Lantern glow cycle | 3000ms | Breathing |
| Moon glow cycle | 5000ms | Slow wax/wane |
| Bird traversal | 12000-18000ms | Per crossing |
| Bird wing flap | 800ms | Per beat |
| Scroll indicator bounce | 1500ms | Per bounce cycle |
| Button press feedback | 150ms | Quick response |
| Scroll indicator fade | 400ms | On scroll |
| Countdown digit swap | 300ms each (in/out) | Per digit |
| Countdown sparkle | 400ms | Quick flash |
| Music icon toggle | 300ms (150+150) | Scale down + up |
| Radio select/deselect | 200ms / 150ms | Scale in/out |
| Submit success transition | 400ms | Background change |
| Gradient bleed | Static CSS | No animation |

## Appendix C: Properties Animated (Compliance Checklist)

Every animated property in this plan, confirming Master Rules compliance:

| Property | Type | Where Used | GPU? |
|----------|------|------------|------|
| `opacity` | Visual | All entries, ambient, interactive | Yes |
| `transform: scale()` | Transform | Entries, sparkles, countdown, buttons | Yes |
| `transform: translateX()` | Transform | Petals (via motionPath), birds | Yes |
| `transform: translateY()` | Transform | **Entry screen words ONLY**, scroll indicator bounce, petals (via motionPath) | Yes |
| `transform: rotate()` | Transform | Petals tumbling | Yes |
| `transform: scaleX()` | Transform | Bird direction flip | Yes |
| `transform: scaleY()` | Transform | Bird wing flap | Yes |
| `clip-path: inset()` | Paint | Gold dividers (center-outward reveal) | Partial |

**NOT animated** (confirming prohibition compliance):
- width, height
- top, left, right, bottom
- margin, padding
- border-width
- font-size
- color (except via CSS transition on focus states -- not GSAP)
- background-color (except submit success -- acceptable as non-layout)

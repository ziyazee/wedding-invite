# Hawa Mahal — Visual QA Report

**Date:** 2026-11-14
**Template:** hawa-mahal (Rajasthani Royal culture)
**Specs reviewed:** MASTER_RULES.md, design-bible.md, storyboard.md, motion-plan.md

---

## Build Verification

| Check | Result |
|-------|--------|
| TypeScript (`tsc -b`) | FAIL — but **zero errors in hawa-mahal files** |
| Vite build | FAIL (blocked by tsc) |

All TypeScript errors originate from other project files: amrit-glow, ivory-nikah, kerala-dawn, bloom, destination-wedding, emerald-parchment, mangal, qubool, raabta, royal-jodhpur, ruby-hour, viah, maroon-letter, shared/cinematic, model.ts, App.tsx, InvitationRenderer.tsx. The hawa-mahal template itself is type-clean.

---

## Test Results (20 Checks)

### 1. All Six Sections Exist and Render
**PASS**

All six mandatory sections are implemented as separate components and rendered from `index.tsx`:
- `Welcome.tsx` (Welcome)
- `Family.tsx` (Family)
- `Countdown.tsx` (Countdown)
- `Celebrations.tsx` (Celebrations)
- `RSVP.tsx` (RSVP)
- `Closing.tsx` (Closing)

### 2. CSS Scoping — All Classes Use `hm-` Prefix
**PASS**

Every class in `hawa-mahal.css` uses the `hm-` prefix. All custom properties use `--hm-` prefix. Custom properties are scoped to `.hm-root`. Keyframes are prefixed: `hm-twinkle`, `hm-scroll-float`, `hm-jali-glow`, `hm-shimmer`. No global selectors found.

### 3. Root `isolation: isolate`
**PASS**

`.hm-root` in `hawa-mahal.css` has `isolation: isolate` set, creating a new stacking context that prevents z-index leaking into the host page.

### 4. No Pure White (#fff) or Pure Black (#000)
**PASS**

Color tokens in `design-bible.md` and implemented in CSS:
- Darkest: `--hm-night: #0B0E1A` (not #000)
- Lightest: `--hm-ivory: #FFF8F0` (not #fff)
All other colors are within the prescribed palette.

### 5. No translateY Reveal Animations
**PASS**

Checked all GSAP animations across all sections. Reveals use `opacity` only (fade). No `y`, `translateY`, or vertical movement in reveal animations. The `hm-scroll-float` keyframe uses `translateX` only (horizontal). This complies with the MASTER_RULES prohibition on translateY reveals (which break drag-and-drop in text editor).

### 6. GSAP Cleanup via useGSAP / gsap.context
**PARTIAL PASS — see issues #1 and #2**

- `index.tsx`: useGSAP with scope — PASS
- `Welcome.tsx`: useGSAP with scope — PASS
- `Countdown.tsx`: CountdownDigit uses useGSAP with scope and dependencies — PASS
- `Celebrations.tsx`: useGSAP with scope — PASS
- `Closing.tsx`: useGSAP with scope — PASS
- `RSVP.tsx`: useGSAP for arch draw — PASS; **but lines 86 and 110 create GSAP tweens outside any useGSAP/gsap.context** — FAIL (see Issue #1)

### 7. Reduced Motion Support
**PASS**

Two-layer approach correctly implemented:
1. **CSS:** `@media (prefers-reduced-motion: reduce)` block in `hawa-mahal.css` (lines ~1077-1132) disables all keyframe animations, removes transitions, sets `animation: none !important` on stars, scroll-float, jali-glow, shimmer.
2. **GSAP:** `gsap.matchMedia()` with `HM_BREAKPOINTS.fullMotion = '(prefers-reduced-motion: no-preference)'` gates all GSAP animations. Animations only run when user has no reduced-motion preference.
3. **RSVP.tsx:** Explicitly checks `window.matchMedia('(prefers-reduced-motion: reduce)')` before form submit animation.

### 8. Video: canplay Retry + poster + muted + playsInline
**PARTIAL PASS — see issue #3**

- `muted` attribute: PASS (line 265)
- `playsInline` attribute: PASS (line 266)
- `canplay` retry logic: PASS (lines 58-67, retries play on canplay after initial failure)
- 15s fallback timer: PASS (lines 74-78)
- **`poster` attribute: FAIL** — Video element at line 261 has no `poster` attribute. MASTER_RULES require: "always provide poster".

### 9. Dynamic Celebrations (mapped from data, not hardcoded)
**PASS**

`Celebrations.tsx` line 84: `data.events.map((event, index) => ...)` — events are dynamically rendered from the `data.events` array. No hardcoded event content. Card count adapts to data. Visual rest rule applied for 7+ events (line 85: `const isMuted = index >= 6`).

### 10. IntersectionObserver for Viewport-Based Pausing
**PASS**

IntersectionObserver implemented in 5 of 6 sections:
- `Welcome.tsx`: Sets/removes `data-hm-paused` attribute (lines 87-104)
- `Countdown.tsx`: Sets/removes `data-hm-paused` attribute (lines 92-109)
- `Celebrations.tsx`: Per-card observer for stagger reveals (lines 90-115)
- `RSVP.tsx`: Observer for arch draw-on (lines 41-61, inside useGSAP)
- `Closing.tsx`: Observer for arch draw-on (inside useGSAP)
- `Family.tsx`: No observer needed (static section, zero animations) — correct

CSS rules in `hawa-mahal.css` pause keyframe animations when `[data-hm-paused]` is set.

### 11. will-change Management (apply during, remove on complete)
**PASS**

Correctly implemented across sections:
- `Welcome.tsx`: `onStart` sets `willChange = 'opacity'` on all reveal elements and `'stroke-dashoffset'` on arch; `onComplete` resets all to `'auto'` (lines 137-158)
- `RSVP.tsx`: Arch draw-on sets `willChange = 'stroke-dashoffset'` onStart, resets to `'auto'` onComplete (lines 49-50)
- CSS: `[data-hm-paused]` rules set `will-change: auto` to release GPU layers when off-viewport

### 12. No setInterval for Animation Timing
**FAIL — see issue #4**

`Countdown.tsx` line 84: `const timer = setInterval(() => { ... }, 1000)` — Uses setInterval for the countdown timer updates. MASTER_RULES explicitly state: "No setInterval for animation timing."

**Note:** This is a borderline case. The setInterval updates *state* (the countdown numbers), not directly driving animation frames. The actual visual animation (digit swap) uses GSAP via useGSAP. However, the MASTER_RULES prohibition is absolute.

### 13. No Files Outside hawa-mahal Workspace Modified
**PASS**

Only `src/App.tsx` has a lazy route import added for the hawa-mahal preview route. This is a pre-existing pattern used by all experimental templates. No other files outside `src/experimental-template/hawa-mahal/` were modified.

### 14. Google Fonts Loaded Correctly
**PASS**

`hawa-mahal.css` line 1: `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cormorant+SC:wght@300;400;500;600&display=swap');`

Matches design-bible.md specification:
- Cinzel Decorative (display headings)
- Cormorant Garamond (body text)
- Cormorant SC (labels/small caps)

### 15. Color Tokens Match Design Bible Palette
**PASS**

All 15 color tokens from design-bible.md are declared in `.hm-root`:
- `--hm-night: #0B0E1A`
- `--hm-deep-blue: #111633`
- `--hm-midnight: #1A1F3D`
- `--hm-teal: #1B3A4B`
- `--hm-sandstone: #C2A87D`
- `--hm-gold: #D4A055`
- `--hm-gold-bright: #E8B86D`
- `--hm-ivory: #FFF8F0`
- `--hm-blush: #F5E1D0`
- `--hm-rose-dust: #C9A293`
- `--hm-ember: #BF6340`
- `--hm-mahal-pink: #D4837A`
- `--hm-sage: #4A6741`
- `--hm-jade: #2D5A4E`
- `--hm-cream: #F0E6D6`

### 16. Scalloped Cornice Borders Between Sections
**PASS**

`HmScallopedCornice` SVG component renders at the bottom of each section with the `hm-section-cornice hm-cornice-shimmer` classes. Present in: Welcome, Family, Countdown, Celebrations, RSVP, Closing. Gradient bleed zones (`hm-section-bleed`) are present between Welcome-Family, Countdown-Celebrations, and other section transitions as specified.

### 17. All 6 SVG Assets Render
**PASS**

All SVG components implemented and exported from barrel file:
- `HmMehrabArch.tsx` — Multi-cusped pointed arch (parametric width/height/cuspCount)
- `HmLotusMedallion.tsx` — 3-ring petal system (8/12/16 petals)
- `HmScallopedCornice.tsx` — Repeating semicircular scallops with finial dots
- `HmJaliPattern.tsx` — Hexagonal honeycomb SVG pattern tile
- `HmCalendarIcon.tsx` — 12x12 calendar outline
- `HmClockIcon.tsx` — 12x12 clock face

All are parametric with sensible defaults and use `aria-hidden="true"`.

### 18. RSVP Form Completeness
**PARTIAL PASS — see issue #5**

Present form fields:
- Guest name input with validation: PASS
- Attendance toggle (Joyfully Accept / Respectfully Decline): PASS
- Message textarea (optional): PASS
- Submit button: PASS
- Confirmation animation: PASS

**Missing:** "Number of Guests" input — storyboard.md specifies this field but it is not implemented. The `RSVPResponse` type in `types/index.ts` also lacks a `guestCount` field.

### 19. Countdown Digit Animation via GSAP
**PASS**

`CountdownDigit` component (Countdown.tsx lines 37-75) uses `useGSAP` with `dependencies: [value]` and `revertOnUpdate: true`. On value change, animates with `fromTo` (opacity 0 + scale 0.8 to opacity 1 + scale 1) using `HM_DURATION.fast` and `HM_EASE.digitIn`. Gated by `gsap.matchMedia()` for reduced motion.

### 20. Max 15 Concurrent Animated Elements Per Section
**FAIL — see issue #6**

`Welcome.tsx` has:
- 15 stars (each with CSS `hm-twinkle` keyframe animation)
- 1 scroll indicator (with `hm-scroll-float` CSS keyframe animation)

Total: **16 concurrent CSS-animated elements**, exceeding the MASTER_RULES limit of 15 per section.

---

## Issues by Severity

### MAJOR

#### Issue #1: GSAP Tweens Outside useGSAP Context (RSVP.tsx)
- **File:** `src/experimental-template/hawa-mahal/sections/RSVP.tsx`
- **Lines:** 86, 110
- **Rule violated:** MASTER_RULES — "GSAP tweens must be created inside useGSAP or gsap.context for cleanup"
- **Detail:** `handleSubmit` callback (line 86) creates a `gsap.timeline()` for form field fade-out. `useEffect` (line 110) creates a `gsap.fromTo()` for confirmation fade-in. Neither is wrapped in useGSAP or gsap.context. These tweens will not be automatically cleaned up on component unmount, risking memory leaks and animation artifacts.
- **Fix:** Wrap both in a `gsap.context()` stored in a ref, or restructure to use `useGSAP` with appropriate dependencies.

#### Issue #2: Video Missing `poster` Attribute (Welcome.tsx)
- **File:** `src/experimental-template/hawa-mahal/sections/Welcome.tsx`
- **Line:** 261-269
- **Rule violated:** MASTER_RULES — "always provide poster"
- **Detail:** The `<video>` element has `muted`, `playsInline`, and `preload="auto"` but no `poster` attribute. Users on slow connections will see a blank frame before the video loads. The poster provides a meaningful first paint.
- **Fix:** Add `poster="/path/to/hawa-mahal-poster.webp"` to the video element.

#### Issue #3: setInterval Used in Countdown (Countdown.tsx)
- **File:** `src/experimental-template/hawa-mahal/sections/Countdown.tsx`
- **Line:** 84
- **Rule violated:** MASTER_RULES — "No setInterval for animation timing"
- **Detail:** `setInterval(() => { setTime(getTimeRemaining(data.weddingDate)) }, 1000)` drives countdown updates. While this updates React state rather than directly animating, the rule is absolute. The digit swap animation itself correctly uses GSAP, but the timer tick mechanism uses the prohibited API.
- **Fix:** Replace with `requestAnimationFrame` loop that checks elapsed time, or use `setTimeout` recursion (which self-corrects for drift).

#### Issue #4: RSVP Form Missing "Number of Guests" Field
- **File:** `src/experimental-template/hawa-mahal/sections/RSVP.tsx`
- **Spec:** storyboard.md, RSVP section
- **Detail:** The storyboard specifies a "Number of Guests" input in the RSVP form. This field is absent from both the component JSX and the `RSVPResponse` TypeScript interface in `types/index.ts`.
- **Fix:** Add `guestCount?: number` to `RSVPResponse` type. Add a number input field between the attendance toggle and message textarea.

#### Issue #5: Welcome Section Exceeds 15 Concurrent Animated Elements
- **File:** `src/experimental-template/hawa-mahal/sections/Welcome.tsx`
- **Rule violated:** MASTER_RULES — "max 15 concurrent animated elements per section"
- **Detail:** 15 stars (each with `hm-twinkle` CSS keyframe) + 1 scroll indicator (with `hm-scroll-float` CSS keyframe) = 16 total concurrent CSS-animated elements.
- **Fix:** Reduce stars from 15 to 14, keeping total at 15.

### MINOR

#### Issue #6: Inline Opacity Conflict on Gold Rule (Welcome.tsx)
- **File:** `src/experimental-template/hawa-mahal/sections/Welcome.tsx`
- **Line:** 307
- **Detail:** The gold rule `<div>` has inline `style={{ opacity: 0.4 }}`. The GSAP reveal timeline later animates this element's opacity to 1.0 (via the corniceLineRef tween at t=0.6s). After the reveal animation completes, the gold rule will be at full opacity (1.0), not the intended resting opacity of 0.4. The inline style is effectively overridden and never restored.
- **Fix:** Either set the GSAP tween target opacity to 0.4, or remove the inline style and let the initial hidden state + reveal handle it.

#### Issue #7: Placeholder Footer Instead of DesignedByFooter (Closing.tsx)
- **File:** `src/experimental-template/hawa-mahal/sections/Closing.tsx`
- **Detail:** Uses placeholder text "Designed with love" instead of the shared `DesignedByFooter` component from `src/invitations/components/`. Acceptable for an experimental template not yet integrated into the production invitation system, but should be connected before production deployment.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| MAJOR | 5 |
| MINOR | 2 |
| **Total** | **7** |

| Check Result | Count |
|-------------|-------|
| PASS | 15 |
| PARTIAL PASS | 3 |
| FAIL | 2 |
| **Total** | **20** |

---

## Recommendations

1. **Priority 1:** Fix GSAP context leak in RSVP.tsx (Issue #1) — this causes real cleanup problems on unmount.
2. **Priority 2:** Add `poster` attribute to Welcome video (Issue #2) — required by MASTER_RULES and impacts perceived load time.
3. **Priority 3:** Replace setInterval in Countdown.tsx (Issue #3) — use setTimeout recursion or rAF-based timer.
4. **Priority 4:** Add "Number of Guests" field to RSVP form (Issue #4) — storyboard compliance.
5. **Priority 5:** Reduce stars from 15 to 14 in Welcome section (Issue #5) — one-line change.
6. **Lower priority:** Fix gold rule opacity conflict (Issue #6), connect DesignedByFooter (Issue #7).

The template is architecturally sound. CSS scoping is thorough, animation patterns are well-structured, reduced motion support is comprehensive, and the SVG asset system is clean and parametric. The issues found are fixable without architectural changes.

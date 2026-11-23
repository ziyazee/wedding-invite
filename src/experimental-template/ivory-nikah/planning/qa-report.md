# Ivory Nikah -- QA Report

Date: 2026-11-14

---

## 1. Build Status

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS (zero errors) |
| `npx vite build` | PASS (built in 3.25s, no warnings) |

---

## 2. Route Verification

| Item | Status |
|------|--------|
| Lazy import in `App.tsx` line 56 | Registered (`lazy(() => import('./experimental-template/ivory-nikah'))`) |
| Route path in `App.tsx` line 153 | Registered (`/experimental/ivory-nikah`) |

---

## 3. Critical Defects Found

**None.** Zero critical issues. Build passes, route registered, no runtime crashes in code review.

---

## 4. Major Defects Found

**None.** Zero major issues. All hard rules satisfied:

- No translateY in scroll reveals (grep confirmed; two legitimate translateY uses exist: vine border positioning and desktop card hover, neither are scroll-reveal animations)
- No fade-up animations (grep confirmed empty)
- No global CSS leaks (all classes `in-` prefixed, all custom properties `--in-` prefixed)
- Dua section has zero petals (no AmbientLayer rendered)
- Total 13 animated PNG elements (3 + 4 + 2 + 2 + 2 = 13, under 15 ceiling)
- No requestAnimationFrame loops (grep confirmed empty)
- PNG animations use only transform and opacity via GSAP MotionPath
- IntersectionObserver pauses/plays petals by viewport visibility
- Font loading correct (Playfair Display 700, Cormorant Garamond 400/600, Lato 300/400, Amiri 400)
- Asset paths all use `new URL('...', import.meta.url).href` pattern

---

## 5. Minor Issues (for future polish)

### 5.1 SVG Gradient ID Duplication

Multiple instances of the same divider component (e.g., three GoldDividerA on page) produce duplicate `<defs>` IDs in the DOM. No visible rendering bug because all instances use identical gradient definitions, but technically SVG IDs must be unique. Fix: generate unique IDs per instance (e.g., `useId()` hook).

Files: `assets/svg/GoldDividerA.tsx`, `GoldDividerB.tsx`, `GoldDividerC.tsx`

### 5.2 RSVP Toggle Accessibility

The attendance toggle buttons ("Joyfully Accept" / "Regretfully Decline") work as buttons with visible selected state, but lack explicit ARIA semantics:
- Container missing `role="radiogroup"` and `aria-label`
- Buttons missing `aria-pressed` or `role="radio"` + `aria-checked`

Keyboard navigation works (tab/enter), and selected state is visually clear.

File: `sections/Rsvp.tsx` lines 95-109

### 5.3 Corner Ornament Opacity Mismatch

Design bible section 5.4 specifies floral corner opacity as 0.35. CSS implementation uses 0.25. The section-blueprints document also says 0.25 for celebration cards. The two spec documents conflict; implementation follows the section-blueprints.

File: `styles/main.css` line 575

### 5.4 Card Padding Spec Conflict

Design bible section 8.1 specifies celebration card padding as `32px 24px`. Section-blueprints section 4 specifies `40px 28px`. Implementation uses `40px 28px` (matching section-blueprints, the more specific doc).

File: `styles/main.css` line 498

### 5.5 Card Max-Width Spec Conflict

Design bible section 8.1 specifies card max-width as 340px. Section-blueprints specifies 380px. Implementation uses 380px (matching section-blueprints).

File: `styles/main.css` line 499

### 5.6 Missing Footer Component

The closing section blueprint and design bible section 8.4 describe a "Designed by Shaadi" footer (Lato 300, label size, 0.6 opacity, 64px margin-top). The CSS class `.in-footer` is defined (line 854-864) but never rendered in any component. This is expected to be added during production integration.

### 5.7 Opening Door Timeline Cleanup

The Opening component creates a GSAP timeline inside a setTimeout. On unmount, it clears the timeout and sets a `cancelled` flag, but does not explicitly kill a running timeline if the timeout already fired. Since the timeline is non-repeating (2.4s total), the risk is negligible -- GSAP handles missing DOM elements gracefully, and the timeline self-completes.

File: `sections/Opening.tsx` lines 30-101

### 5.8 Petal will-change Lifecycle

The `.in-petal` CSS class permanently sets `will-change: transform, opacity`. The motion plan spec says to apply during animation and remove when done. Since petal animations are infinite-repeat and paused via IntersectionObserver (never truly "done"), permanent `will-change` is functionally correct for 13 elements. Reduced-motion mode hides petals entirely via `display: none`.

File: `styles/main.css` line 918

### 5.9 IntersectionObserver vs ScrollTrigger for Petals

The motion plan specifies GSAP ScrollTrigger for petal viewport pause/play. Implementation uses native IntersectionObserver instead. This is a reasonable engineering decision (avoids importing ScrollTrigger into the AmbientLayer module). Functional result is identical.

File: `animations/AmbientLayer.tsx` lines 119-139

### 5.10 Design Bible --in-border-subtle Value

Design bible specifies `rgba(192, 168, 76, 0.15)` but the CSS uses `rgba(201, 168, 76, 0.15)`. The CSS value (201) is the correct R component of #C9A84C. The design bible has a typo (192 vs 201).

---

## 6. What Works Well

### Architecture
- Clean separation: 7 section components, 1 animation layer, 5 motion path definitions, 13 petal instances in declarative data
- Single CSS file with logical numbering (18 sections), fully scoped
- SVG decoratives as React components with proper barrel export
- Types cleanly defined in separate module

### CSS System
- Complete design token system with 100+ custom properties
- Fluid typography with clamp() targeting 402px-768px range
- 8px spacing scale consistently applied
- Three background treatment types (ivory, warm-glow, clear) correctly applied per spec
- Reduced motion media query is thorough (kills animations, shows all content, hides petals/doors)
- `isolation: isolate` on root prevents stacking context leaks
- `overflow-x: hidden` on root prevents horizontal scroll

### Animation System
- Scroll reveals are strictly opacity-only (hard rule satisfied)
- GSAP loaded asynchronously with graceful fallback (content shown if GSAP fails)
- gsap.context() used for scroll reveal cleanup in index.tsx
- Reduced motion state tracked in React + CSS, with dynamic listener for runtime changes
- Door animation timeline precisely matches motion plan timing table
- Petal data is fully declarative (petalData.ts), making it easy to tune values

### Design Fidelity
- All color tokens match design bible hex values exactly
- All typography tokens (families, sizes, weights, tracking, leading) match spec
- All spacing tokens match spec
- Divider pattern A-B-B-C-C-A correctly implemented
- Background treatments per section match spec exactly
- Jali overlay on correct sections (Dua, Countdown, RSVP)
- Vine borders on correct sections (Couple, Closing) with 0.4 opacity on Closing

### Petal Choreography
- 13 petals total matching spec exactly
- Distribution: couple:3, celebrations:4, countdown:2, rsvp:2, closing:2
- All 5 petal variants used with correct motion types
- Custom paths per instance for natural variation
- Opacity ranges within spec ceilings (max 0.7)
- Size ranges within spec (24-52px)

### Accessibility
- All decorative SVGs have `aria-hidden="true"`
- All decorative images have `alt=""`
- AmbientLayer has `aria-hidden="true"`
- Form inputs have proper `<label>` with `htmlFor`
- Required attribute on name field
- Focus-visible styles on submit button
- Touch targets meet 44px minimum (toggles) and 48px (submit button)
- `draggable={false}` on all decorative images

### Performance
- Lazy import of template (via App.tsx lazy())
- Async GSAP import (not bundled eagerly)
- No rAF loops
- Petals paused when off-screen
- Door will-change removed after animation via onComplete callback
- CSS-only ambient animations (warm-light, gold-shimmer, ornament-breathe, jali-drift)
- All animation properties compositor-friendly (transform, opacity, filter:brightness)

---

## 7. Testing Limitations

- **No browser runtime test performed.** This report is code-review only. Visual rendering, actual animation smoothness, and cross-browser behavior require manual browser testing on the dev server (localhost:5173).
- **Asset quality not verified.** Petal PNGs, arch frame, door panels, vine borders, and corners exist on disk but were not visually inspected for quality or sizing.
- **Mobile device testing not performed.** 402px viewport behavior verified by CSS analysis only.
- **Performance profiling not performed.** GPU layer count, paint timing, and FPS during animation require Chrome DevTools profiling.
- **Screen reader testing not performed.** ARIA attributes checked in code; actual screen reader behavior needs manual verification.
- **Form submission not tested end-to-end.** The RSVP form currently uses `setSubmitted(true)` without backend integration, which is expected for this experimental template stage.

# Punjabi Premium -- QA Report

**Date**: 2026-11-11
**Tester**: Visual QA Engineer (code review + server verification)
**Route**: `/experimental/punjabi-premium`
**Dev server**: http://localhost:5173 (confirmed running, route returns 200)

---

## 1. Build Status

### TypeScript (`npx tsc --noEmit`): PASS
No errors reported.

### Production Build (`npm run build`): FAIL

Two errors in the Punjabi Premium template:

```
src/experimental-template/punjabi-premium/index.tsx(25,9): error TS6133: 'contextSafe' is declared but its value is never read.
src/experimental-template/punjabi-premium/index.tsx(26,16): error TS6133: 'contextSafe' is declared but its value is never read.
```

**Root cause**: `contextSafe` is destructured from the `useGSAP` return value on line 25 AND received as a callback parameter on line 26. Neither is used in the code. The `handleOpen` function calls `gsap.to()` directly without `contextSafe` wrapping.

**Fix**: Remove the destructured return on line 25 (`const { contextSafe } =` should become just the hook call). The callback parameter `contextSafe` on line 26 should either be used or prefixed with underscore.

(Note: Two additional build errors exist in `src/pages/ruby-hour/RubyHour.tsx` which are unrelated to this template.)

---

## 2. Route Verification

| Check | Result |
|-------|--------|
| `/experimental/punjabi-premium` returns 200 | PASS |
| `/` homepage returns 200 | PASS |
| Route registered in `src/App.tsx` with `lazy()` import | PASS |
| Template does not break other routes | PASS |

---

## 3. Section-by-Section Findings

### S1 Opening -- MIXED

| Check | Result | Notes |
|-------|--------|-------|
| "Tap to Open" overlay renders | PASS | Conditional render with `!isOpen` |
| Overlay is keyboard-accessible | PASS | `role="button"`, `tabIndex={0}`, `onKeyDown` handles Enter/Space |
| Overlay has ARIA label | PASS | `aria-label="Tap to open the wedding invitation"` |
| MughalArch SVG renders | PASS | 7-cusped scalloped inner edge, pillars, pillar capitals |
| ToranOrnaments display (5 ornaments) | PASS | SVG with 5 `<g>` groups, connecting garland line |
| Monogram "AS" visible | PASS | Cormorant Garamond 700, gold-dark color |
| Couple names in Pinyon Script | PASS | Uses `--pp-font-script`, correct per design bible |
| RoseCluster SVGs visible | PASS | Left and right, `size={48}`, mirrored |
| LotusFlower at bottom | PASS | `size={48}`, `aria-hidden="true"` |
| Floral canopy placeholder | PASS | CSS gradient placeholder renders |
| Botanicals placeholder | PASS | CSS gradient placeholder renders |
| Couple illustration placeholder | PASS | CSS gradient with descriptive `aria-label` |
| **Entrance animation targets ornaments** | **DEFECT** | See Critical Defect #2 |
| Toran sway animation | **DEFECT** | See Critical Defect #2 |
| Overlay GSAP fade uses contextSafe | **DEFECT** | `handleOpen` calls `gsap.to()` directly without `contextSafe` wrapper. Per motion plan section 2.6, this must be wrapped in `contextSafe`. |

### S2 Couple & Family -- PASS (with design note)

| Check | Result | Notes |
|-------|--------|-------|
| Tagline "Two souls, one journey" | PASS | Conditional render when `couple.tagline` exists |
| Groom and bride family blocks | PASS | Proper hierarchy: name, relation, parents |
| ScallopedBorder at top/bottom | PASS | 7 cusps, bottom is `scaleY(-1)` mirrored |
| LotusFlower divider | PASS | `size={24}`, centered |
| RoseCluster corner accents | PASS | Top-left and bottom-right, 60% opacity |
| GoldFlourish divider | PASS | Above family blocks |
| Left-aligned text blocks with 12% offset | PASS | Matches section blueprints |
| **Names use script font** | NOTE | Design bible S10.S2 says "Cormorant Garamond 600 (not script -- contrast from opening)" but implementation uses `--pp-font-script` (Pinyon Script). Section blueprints say Great Vibes. This is a design discrepancy to clarify with creative direction. |

### S3 Countdown -- PASS

| Check | Result | Notes |
|-------|--------|-------|
| Live countdown updates every second | PASS | `setInterval` with 1s period, cleanup on unmount |
| Scalloped frame with ScallopedBorder top | PASS | 5 cusps, color `#D5C4A8` |
| VineBorders on sides | PASS | Left and right, `height={200}`, `opacity={0.15}` |
| Full date in Pinyon Script | PASS | Uses `.pp-script` class, formatted with `toLocaleDateString` |
| Tabular figures on digits | PASS | `font-variant-numeric: tabular-nums` in CSS |
| `role="timer"` on countdown | PASS | With descriptive `aria-label` |
| Individual digit `aria-label` | PASS | e.g., "45 Days" |
| Gold dot separators between units | PASS | CSS `::after` pseudo-elements |
| `useMemo` for formatted date | PASS | Prevents recalculation every second |

### S4 Celebrations -- PASS

| Check | Result | Notes |
|-------|--------|-------|
| 4 event cards on vertical timeline | PASS | Mehendi, Sangeet, Anand Karaj, Reception |
| Gold timeline line on left | PASS | `linear-gradient(to bottom, --pp-gold, --pp-divider)` |
| Scalloped card headers | PASS | 3 cusps per card |
| Anand Karaj highlight styling | PASS | Dark surface warm bg, gold-light name, light text |
| Event details present | PASS | Name, date, time, venue, address, description |
| View on Map / Add to Calendar buttons | PASS | `type="button"`, descriptive `aria-label` per event |
| Timeline nodes with event icons | PASS | Shamrock, musical note, flower, star |
| RoseCluster floral corners | PASS | `size={20}`, 40% opacity |
| Date formatting | PASS | "Wed, 12 Feb 2027" format |

### S5 RSVP -- PASS

| Check | Result | Notes |
|-------|--------|-------|
| ArchSilhouette framing form | PASS | `openBottom` variant, absolute positioned |
| Rose pair flanking heading | PASS | Two RoseCluster, `size={24}`, mirrored |
| Name field works | PASS | Controlled input with `htmlFor`/`id` association |
| Attendance buttons | PASS | "Joyfully Accept" / "Regretfully Decline" |
| Guest count stepper | PASS | Min 1, max 10, `aria-live="polite"` on count |
| Message textarea | PASS | Optional, with label and placeholder |
| Validation (empty name) | PASS | Error message with `role="alert"`, `aria-describedby`, `aria-invalid` |
| Submit shake on validation fail | PASS | CSS animation + timeout cleanup |
| Thank you state | PASS | Fades in after submission |
| Attendance radio semantics | PASS | `role="radiogroup"` on container, `role="radio"` + `aria-checked` on buttons |
| Guest count conditional render | PASS | Only shows when attending is "yes" |
| Three gold dots separator | PASS | Below form |
| **Arch stroke-draw animation missing** | NOTE | Motion plan specifies SVG stroke-dashoffset draw animation. Implementation uses a simple `gsap.from` opacity/y reveal instead. The arch renders but does not "draw in". See Minor Issue #3. |

### S6 Gallery -- PASS

| Check | Result | Notes |
|-------|--------|-------|
| 2-column grid renders | PASS | `grid-template-columns: repeat(2, 1fr)` |
| Placeholder gradients visible | PASS | Two alternating gradient styles via `:nth-child(odd)` |
| Alternating aspect ratios | PASS | Portrait (3:4) / Square (1:1) pattern, algorithm correct |
| Photo frames with border | PASS | 2px solid `--pp-arch-beige`, elevated shadow |
| Hover zoom effect | PASS | `scale(1.03)` and desaturation removal on hover |
| Transition lotus below grid | PASS | `size={28}` |
| 6 images from sample data | PASS | Mapped from `data.gallery` |

### S7 Closing -- MIXED

| Check | Result | Notes |
|-------|--------|-------|
| ArchSilhouette (closed variant) | PASS | Full arch outline, default `openBottom=false` |
| Couple names in Pinyon Script | PASS | Uses `.pp-script` class |
| LotusFlower with breathing animation | PASS | `.pp-lotus-breathe` class, CSS keyframes 4s cycle |
| Closing phrase | PASS | "With love and gratitude" |
| Footer text | PASS | "Invitation by Shaadi Invites" |
| **Background is cream, not dark** | NOTE | Design bible S10.S7 says `--pp-dark-surface` background. Section blueprints say cream with vignette. Implementation follows blueprints (cream). See Minor Issue #4. |
| **Closing arch stroke-draw missing** | NOTE | Motion plan specifies 1200ms stroke-dashoffset draw + content fade-in timeline. Implementation uses simple `gsap.from` reveal. See Minor Issue #3. |

---

## 4. Responsive Findings

### CSS Analysis (code review -- not visual viewport testing)

| Check | Result | Notes |
|-------|--------|-------|
| Mobile-first CSS structure | PASS | Default styles, then 480px and 768px breakpoints |
| `clamp()` fluid typography | PASS | All text sizes use clamp() |
| Max-width 720px on `.pp-page` | PASS | Prevents overwide on desktop |
| `overflow-x: hidden` on root | PASS | Prevents horizontal scroll |
| No fixed pixel widths on content | PASS | All use %, max-width, or clamp() |
| 480px breakpoint adjustments | PASS | Padding increases, frame max-widths widen |
| 768px breakpoint adjustments | PASS | Full desktop spacing applied |

**Note**: I cannot test visual rendering at specific viewport widths (402px, 768px, 1024px) from the terminal. Visual regression testing with screenshots would require browser automation. The CSS structure and breakpoint logic are sound based on code review.

---

## 5. Accessibility Findings

| Check | Result | Notes |
|-------|--------|-------|
| Focus ring on `:focus-visible` | PASS | 2px solid gold, 4px offset, scoped to `.pp-page` |
| Overlay keyboard access | PASS | Enter and Space handled, `role="button"`, `tabIndex={0}` |
| Form labels associated | PASS | `htmlFor`/`id` on name and message fields |
| ARIA on decorative elements | PASS | All decorative SVGs have `aria-hidden="true"` |
| Arch SVGs `aria-hidden` | PASS | MughalArch, ArchSilhouette, ScallopedBorder all set |
| Radio group semantics | PASS | `role="radiogroup"` + `role="radio"` + `aria-checked` |
| Error message linked | PASS | `aria-describedby` + `aria-invalid` on name input |
| Section landmarks | PASS | All 7 sections use `<section>` with `aria-label` |
| Timer role on countdown | PASS | `role="timer"` with `aria-label` |
| Live region on guest count | PASS | `aria-live="polite"` |
| Couple illustration alt text | PASS | Descriptive `aria-label` with cultural context |
| Tap highlight removed | PASS | `-webkit-tap-highlight-color: transparent` on buttons/links |
| Screen reader only utility | PASS | `.pp-sr-only` class defined |
| **Reduced motion: GSAP** | PASS | `gsap.matchMedia()` wraps all animations, only runs for `no-preference` |
| **Reduced motion: CSS** | PASS | `@media (prefers-reduced-motion: reduce)` disables toran sway, digit transitions, lotus breathing, shake, form/gallery transitions |
| **Reduced motion: overlay** | PASS | Auto-dismisses after 1s timeout when reduced motion preferred |

---

## 6. Performance Findings

| Check | Result | Notes |
|-------|--------|-------|
| Lazy route import | PASS | `lazy(() => import(...))` in App.tsx |
| No continuous rAF loops | PASS | Toran sway and lotus breathing are CSS keyframes. Countdown uses `setInterval(1s)`. |
| Countdown cleanup | PASS | `clearInterval` in useEffect return |
| `tabular-nums` on countdown digits | PASS | Prevents layout shift on number change |
| ScrollTrigger `once: true` | PASS | All triggers self-destruct after firing |
| `overwrite: true` on batch animations | PASS | Prevents conflicts on fast scroll |
| Only compositor-friendly properties animated | PASS | transform, opacity, autoAlpha only |
| No `will-change` permanently set | PASS | Per design bible guidelines |
| Font loading with `display=swap` | PASS | Included in Google Fonts @import URL |
| `font-preconnect` in HTML | PASS | Global HTML has `preconnect` to fonts.googleapis.com |
| No per-scroll layout reads | PASS | No scroll event handlers, only IntersectionObserver via ScrollTrigger |
| **@import blocks rendering** | NOTE | CSS `@import` for Google Fonts blocks rendering until font CSS is fetched. A `<link>` tag in the component would be better. Minor since this is a native template that manages its own fonts. |

---

## 7. CSS Scoping

| Check | Result | Notes |
|-------|--------|-------|
| All classes use `pp-` prefix | PASS | 174 pp-prefixed selectors found |
| No unprefixed global selectors | PASS | Grep found zero bare element/class selectors |
| Custom properties on `.pp-page` not `:root` | PASS | All `--pp-*` tokens scoped to `.pp-page` |
| `isolation: isolate` on root | PASS | Contains z-index stacking context |
| `box-sizing: border-box` scoped | PASS | Applied via `.pp-page *` selector |
| Google Fonts `@import` | NOTE | The @import is inside the scoped CSS file, but Google Fonts CSS generates global `@font-face` rules. This is standard and acceptable -- font-face rules must be global. The fonts won't interfere with other pages since they're opt-in via font-family declarations. |

---

## 8. Critical Defects (must fix)

### CRITICAL-1: Production build fails due to unused `contextSafe`

**File**: `src/experimental-template/punjabi-premium/index.tsx`, lines 25-26
**Impact**: The template cannot be included in a production build.
**Details**: `contextSafe` is destructured from both the `useGSAP` return value (line 25) and the callback parameter (line 26). Neither is used. TypeScript strict mode (tsconfig `noUnusedLocals`) flags this as an error.
**Fix**: Change line 25 from `const { contextSafe } = useGSAP(` to `useGSAP(` and prefix the callback parameter with underscore: `(_context, _contextSafe) =>`.

### CRITICAL-2: Toran ornament animations target non-existent CSS class

**File**: `src/experimental-template/punjabi-premium/index.tsx` (GSAP setup) and `styles/main.css` (CSS animation)
**Impact**: The 5 hanging ornaments never animate. Neither the GSAP entrance sequence nor the CSS pendulum sway will fire.
**Details**:
- GSAP targets `.pp-opening__ornament` for initial state and entrance animation (lines 46, 72-78)
- CSS targets `.pp-toran-sway .pp-opening__ornament` for pendulum sway (lines 1156-1164)
- But the `ToranOrnaments` component renders `<g>` elements inside an SVG with NO class applied. The individual ornament groups have `data-ornament={index}` and `style={{ transformOrigin }}` but no `className`.
- Therefore, `.pp-opening__ornament` matches zero elements.
- Additionally, the CSS nth-child selectors use `:nth-child(2)` through `:nth-child(6)` (skipping child 1), which was presumably intended to skip the connecting garland `<path>` element. But since the SVG is inside a wrapper `<div>`, the CSS descendant selector would need to reach into the SVG, which it does (SVG elements can be targeted by CSS). However, the `<g>` elements have no `.pp-opening__ornament` class, so the selectors still match nothing.

**Fix**: Either:
(a) Add `className="pp-opening__ornament"` to each `<g>` element in `ToranOrnaments.tsx`, OR
(b) Change the GSAP and CSS selectors to target `[data-ornament]` or `.pp-opening__toran g[data-ornament]`.

---

## 9. Minor Issues (nice to fix)

### MINOR-1: `handleOpen` GSAP call not wrapped in contextSafe

**File**: `src/experimental-template/punjabi-premium/index.tsx`, line 198
**Impact**: Low. The animation works because it uses a direct ref, not a scoped selector. However, the motion plan (section 2.6) explicitly says "This must be wrapped in `contextSafe`." Not wrapping means the tween is not registered with the GSAP context and won't be auto-cleaned on unmount.
**Fix**: Use `contextSafe` to wrap the overlay fade animation. This requires fixing CRITICAL-1 first to properly expose `contextSafe`.

### MINOR-2: Design Bible vs. Section Blueprints font discrepancy in S2

**File**: `src/experimental-template/punjabi-premium/sections/Couple.tsx`
**Impact**: Design direction unclear. Not a code bug.
**Details**: The design bible (authoritative doc, section 10, S2) says: "Couple names repeated in Cormorant Garamond 600 (not script -- contrast from opening)". But the section blueprints say Great Vibes for S2 names. Implementation uses `--pp-font-script` (Pinyon Script).
**Action**: Clarify with creative direction which is correct. If the design bible is authoritative, S2 names should use `--pp-font-display` at weight 600.

### MINOR-3: SVG stroke-draw animations not implemented for S5 and S7

**Files**: `src/experimental-template/punjabi-premium/index.tsx`, lines 141-151 (S5) and 170-180 (S7)
**Impact**: Medium visual. The arch outlines appear via simple fade/translate instead of the specified "drawing in" effect.
**Details**: Motion plan sections 4.2.5 (S5) and 4.2.7 (S7) specify `strokeDashoffset` draw animations using `getTotalLength()`. The implementation uses standard `gsap.from` with `autoAlpha` and `y` properties instead. The S7 motion plan also specifies a two-phase timeline (arch draws, then content fades in).
**Fix**: Add refs to the arch `<path>` elements in ArchSilhouette. Measure path length with `getTotalLength()`. Use `gsap.fromTo` with `strokeDashoffset` as specified in the motion plan.

### MINOR-4: S7 closing background does not match design bible

**File**: `src/experimental-template/punjabi-premium/styles/main.css`, lines 1060-1074
**Impact**: Design direction unclear.
**Details**: Design bible S10.S7 says "`--pp-dark-surface` background" (deep warm brown #3E2218). Implementation uses cream with subtle radial vignette, matching the section blueprints. The two planning docs disagree.
**Action**: Clarify with creative direction. The cream background provides continuity; the dark background would create a dramatic closing contrast.

### MINOR-5: CSS @import for fonts blocks rendering

**File**: `src/experimental-template/punjabi-premium/styles/main.css`, line 8
**Impact**: Slightly slower font loading on first visit.
**Details**: Using `@import url(...)` for Google Fonts means the browser must fetch the CSS file, then discover the font files, then fetch those. A `<link rel="preload" as="style">` or direct `<link>` tag would allow parallel discovery.
**Fix**: Consider loading fonts via a `<link>` tag injected by the component (similar to how other native templates in the project handle fonts).

### MINOR-6: Inline styles in RSVP gold dots separator

**File**: `src/experimental-template/punjabi-premium/sections/RSVP.tsx`, lines 212-230
**Impact**: Inconsistency with the rest of the template which uses CSS classes.
**Details**: The three gold dots separator uses inline styles for layout. A CSS class (e.g., `.pp-rsvp__dots`) would be more consistent and maintainable.

---

## 10. Summary

### What works well
- Clean component architecture with 7 well-separated section components
- All 8 SVG asset components render correctly with proper viewBoxes and paths
- Comprehensive accessibility implementation (ARIA roles, labels, keyboard access, reduced motion)
- CSS is fully scoped with `pp-` prefix, `isolation: isolate`, no global leaks
- GSAP integration follows best practices: `useGSAP` with scope, `gsap.matchMedia()`, `once: true` ScrollTriggers
- RSVP form has proper validation, error states, and accessibility
- Responsive breakpoints are well-structured with fluid `clamp()` typography
- Sample data is culturally appropriate and well-structured
- Template configuration file exists

### What needs fixing
- **2 critical defects** block production deployment
  - Build failure from unused variables
  - Toran ornament animations completely non-functional
- **6 minor issues** for refinement
  - Missing contextSafe wrapping
  - Font choice discrepancy in S2
  - Missing stroke-draw animations in S5/S7
  - Closing section background color discrepancy
  - Font loading could be optimized
  - Minor inline style inconsistency

### Overall Verdict

**NOT READY FOR PRODUCTION** -- two critical defects must be resolved first. The build failure (CRITICAL-1) is a quick fix. The toran ornament targeting (CRITICAL-2) requires either modifying the ToranOrnaments component or updating the animation selectors. Once both are fixed, the template is structurally sound and well-implemented for an experimental/prototype stage. The minor issues are refinements that can be addressed in a follow-up pass.

### Testing Limitations

This QA was performed via code review and HTTP status verification. I was unable to:
- Take screenshots or visually inspect rendered output at specific viewport widths
- Verify pixel-level CSS rendering (element overlaps, clipping, etc.)
- Test actual animation playback timing and smoothness
- Verify font rendering / FOUT behavior
- Test on mobile devices or in the InvitationViewport wrapper
- Measure actual performance metrics (LCP, CLS, etc.)

A visual QA pass with browser DevTools or Playwright screenshots is recommended as a follow-up.

# Amrit Glow -- QA Report

**Date**: 2026-11-13
**Template**: `src/experimental-template/amrit-glow/`

---

## Summary

| Category | Pass | Fail |
|----------|------|------|
| Build Verification | 2/2 | 0 |
| Code Review (imports/isolation) | 6/6 | 0 |
| Opening Section | 6/6 | 0 |
| Celebrations Section | 3/3 | 0 |
| PersonalNotes Section | 2/3 | 1 |
| PNG Animation System | 5/7 | 2 |
| CSS Verification | 3/7 | 4 |
| Accessibility | 4/5 | 1 |
| Performance | 5/5 | 0 |
| Isolation Rule | 3/3 | 0 |

**Totals**: 39 pass, 8 fail

**Critical defects**: 3
**Major defects**: 5
**Minor defects**: 7

---

## 1. Build Verification

- [x] `npx tsc --noEmit` -- zero errors in amrit-glow files
- [x] `npx vite build` -- builds successfully, outputs `amrit-glow-DwWBtva3.js` (67.18 kB)

---

## 2. Code Review Checks

- [x] All CSS classes use `ag-` prefix
- [x] All custom properties use `--ag-` prefix
- [x] No imports from outside `src/experimental-template/amrit-glow/` (except react, gsap, @gsap/react)
- [x] No production component usage (no InvitationSection, EditableText, etc.)
- [x] `prefers-reduced-motion` handled in every section and animation component
- [x] ScrollTrigger cleanup via useGSAP scope in every section

---

## 3. Opening Section

- [x] Video has muted, playsInline, preload="auto" (Opening.tsx:153-157)
- [x] canplay event listener for play retry (Opening.tsx:100-107)
- [x] Fallback timeout 6s (Opening.tsx:127-132)
- [x] Hero timeline triggered at video currentTime >= 4 (Opening.tsx:117-123)
- [x] Names, ampersand, date all animated (Opening.tsx:56-95)
- [x] Scroll hint present (Opening.tsx:185-188)

---

## 4. Celebrations Section

- [x] B-A-C-A-B palindrome layout implemented via `getLayoutPattern()` (Celebrations.tsx:32-49)
- [x] Layouts A (ornamental card), B (open frame), C (feature/firework) are visually distinct
- [x] Dividers between events: garland flanking Layout C, ThinGoldRule for others (Celebrations.tsx:57-66)

---

## 5. PersonalNotes Section

- [x] LEFT-ALIGNED text (text-align:left in CSS .ag-personal-note-text, line 948)
- [x] Diagonal corner ornaments TL + BR only (PersonalNotes.tsx:78-79)
- [x] Darkest background (bg-deep) via .ag-section-notes (CSS line 928)

**DEFECT**: Class name mismatch -- see Critical Defect #1

---

## 6. PNG Animation System

- [x] FloatingElement uses useGSAP for lifecycle (FloatingElement.tsx:49)
- [x] AmbientLayer uses IntersectionObserver for pause/resume (AmbientLayer.tsx:98-119)
- [x] mix-blend-mode: screen applied via CSS class .ag-particle (main.css:1103)
- [ ] **Particle counts per section DO NOT all match choreography budgets** (see Major Defect #1)
- [x] prefers-reduced-motion returns null from AmbientLayer (AmbientLayer.tsx:125-127)
- [ ] **AmbientLayer IntersectionObserver only resumes, never pauses GSAP tweens** (see Major Defect #2)

---

## 7. CSS Verification

- [x] All class definitions prefixed with `ag-`
- [x] All custom properties prefixed with `--ag-`
- [x] No global style leaks (no bare element selectors; resets scoped under `.ag-page`)
- [ ] **43 CSS classes used in JSX are missing from the stylesheet** (see Critical Defect #2)
- [ ] **3 CSS class name mismatches** (see Critical Defects #1 and #3)
- [x] Progressive darkness verified: hero bg-deep, couple/celebrations gradient-bg, notes bg-deep
- [x] Type scale uses the 11-level system from design bible (11 .ag-type-* classes match spec)
- [x] Responsive breakpoints present (374px at line 1283, 339px at line 1313)

---

## 8. Accessibility

- [x] Decorative images have alt="" and role="presentation" (verified in all sections)
- [x] Video is muted (Opening.tsx:156)
- [x] Reduced motion media query disables ALL animations (main.css:1218-1276)
- [x] Form inputs have proper labels (RSVP.tsx: htmlFor on name, guests, dietary inputs)
- [ ] **"Will you attend?" span lacks aria-label or accessible labeling for the toggle group** (see Minor Defect #1)

---

## 9. Performance

- [x] No continuous animation-frame loops for static content (all GSAP repeat:-1 with yoyo, no rAF loops)
- [x] will-change managed by IntersectionObserver (AmbientLayer.tsx:102-103, 114-115)
- [x] Lazy loading on non-critical images (FloatingElement.tsx:84-85)
- [x] No imports from production template system
- [x] isolation: isolate on root element (index.tsx:105)

---

## 10. Isolation Rule

- [x] No files outside `src/experimental-template/amrit-glow/` modified (except App.tsx route)
- [x] No imports from src/invitations/, src/pages/, or src/lib/
- [x] Template removable by deleting folder + one route line

---

## Critical Defects (MUST FIX)

### Critical #1: PersonalNotes class name mismatch

**File**: `sections/PersonalNotes.tsx` line 82, `styles/main.css` line 933
**What's wrong**: JSX uses `className="ag-notes-content"` but CSS defines `.ag-personal-note-content`
**Expected**: Class names must match for left-alignment, max-width:280px, and margin-left:32px to apply
**Impact**: PersonalNotes text block has no positioning/layout -- falls back to default, breaking the deliberate left-aligned intimate layout
**Status**: FIXED -- renamed CSS class to match JSX

### Critical #2: 43 CSS classes missing from stylesheet

**File**: `styles/main.css`
**What's wrong**: Many classes used in JSX have no corresponding CSS rules. Most critical:
- `.ag-section-wrap` -- parent of AmbientLayer needs `position:relative; overflow:hidden` or particles escape containment
- `.ag-section-spacer` / `.ag-spacer-3xl` -- section spacing between hero and couple (64px gap)
- `.ag-noise-overlay` -- noise texture overlays invisible
- `.ag-event-card` / `.ag-event-content` / `.ag-event-open-frame` / `.ag-event-card-layout` -- event layouts unstyled
- `.ag-garland-divider` / `.ag-garland-img` -- celebration garland dividers unstyled
- `.ag-closing-diya` -- closing diya images unsized
- `.ag-closing-fade-up` / `.ag-closing-rule` / `.ag-closing-ornate` -- closing section elements unstyled
- `.ag-countdown-lamp-glow` / `.ag-countdown-close` -- countdown elements unstyled
- `.ag-rsvp-toggle-row` / `.ag-rsvp-close` / `.ag-rsvp-submit` -- RSVP layout elements unstyled
- `.ag-footer-label` / `.ag-footer-brand` -- footer text unstyled
- `.ag-timer-frame` -- timer frame SVG unstyled
**Expected**: All classes used in JSX should have CSS definitions
**Impact**: Layout broken in multiple sections: particles escape bounds, events unstyled, spacing wrong
**Status**: FIXED -- added all missing CSS rules

### Critical #3: Firework burst class name mismatch

**File**: `sections/Celebrations.tsx` line 253, `styles/main.css` line 688
**What's wrong**: JSX uses `className="ag-firework-burst"` but CSS defines `.ag-event-firework`. GSAP animation also targets `.ag-firework-burst` (line 133).
**Expected**: Class names must match for absolute positioning, blend mode, and opacity to apply
**Impact**: Firework burst in Jaggo event has no positioning/blend mode -- renders as a regular image
**Status**: FIXED -- renamed CSS class to match JSX

---

## Major Defects (SHOULD FIX)

### Major #1: Particle counts deviate from choreography budget

**File**: `index.tsx` lines 38-91
**What's wrong**: Some section particle totals don't match the budgets from png-choreography.md:
- Hero: 6 actual vs 7 budgeted (missing 1 gold leaf -- needs leaf-4)
- Celebrations: 12 actual vs 14 budgeted (has 8 petals + 4 sparkles; missing 3 gold leaves)
- Composition differences: Countdown budget says 2 diyas but AmbientLayer has 2 sparkles (diyas are layout elements); RSVP budget says 2 diyas + 2 leaves but code has 2 sparkles + 2 leaves; Closing budget says 3 diyas + 3 petals but code has 3 petals + 2 sparkles + 1 leaf
**Expected**: Totals and compositions should match png-choreography.md
**Impact**: Slightly less visual density than designed in Hero and Celebrations. The composition differences (sparkles vs diyas in AmbientLayer) are acceptable since diyas serve as layout elements.
**Severity**: Major

### Major #2: AmbientLayer IntersectionObserver only resumes, never pauses

**File**: `animations/AmbientLayer.tsx` lines 106-116
**What's wrong**: When section exits viewport, the observer removes `will-change` but does NOT call `.pause()` on the GSAP tweens. The resume logic queries `gsap.globalTimeline.getChildren()` which works, but the else branch only sets `will-change: auto` -- it never pauses the tweens.
**Expected**: Off-screen particles should have their GSAP tweens paused (per motion-plan.md section 3.5)
**Impact**: Off-screen particles continue animating, wasting GPU/CPU resources. The will-change removal helps, but GSAP tweens still run.
**Severity**: Major

### Major #3: RSVP water background opacity not applied

**File**: `sections/RSVP.tsx` line 58-60, `styles/main.css` lines 741-745
**What's wrong**: JSX sets `backgroundImage` as inline style on the `.ag-rsvp-water-bg` div. CSS defines `.ag-rsvp-water-bg img { opacity: 0.20 }` expecting an `<img>` child. Since there's no `<img>`, the 20% opacity rule never applies -- the background renders at full opacity.
**Expected**: Water reflection should be at 20% opacity per design-bible.md
**Impact**: Water texture overpowers the RSVP form content
**Severity**: Major

### Major #4: Closing water background opacity not applied

**File**: `sections/Closing.tsx` line 87-89, `styles/main.css` lines 991-993
**What's wrong**: Same issue as RSVP -- JSX uses `backgroundImage` style, CSS expects `<img>` child for `.ag-closing-water-bg img { opacity: 0.38 }`.
**Expected**: Water reflection at 35-40% opacity per design-bible.md
**Impact**: Water texture overpowers closing content
**Severity**: Major

### Major #5: Missing leaf-4 import in index.tsx

**File**: `index.tsx`
**What's wrong**: `leaf-4.png` exists in the animated assets directory but is never imported or used. The choreography calls for leaf-4 in the Hero section.
**Expected**: leaf-4 should be imported and included in heroParticles for the full 7-particle budget
**Severity**: Major (easy fix but deviates from spec)

---

## Minor Defects (NICE TO FIX)

### Minor #1: RSVP attendance toggle lacks accessible grouping

**File**: `sections/RSVP.tsx` lines 111-129
**What's wrong**: "Will you attend?" uses a `<span>` instead of a `<fieldset>` with `<legend>`, and the toggle buttons have no `role="group"` or `aria-label` to associate them.
**Expected**: Proper ARIA grouping or fieldset/legend for the toggle buttons
**Severity**: Minor

### Minor #2: Couple section GoldCorners positioned on section, not on couple-frame

**File**: `sections/Couple.tsx` lines 68-71
**What's wrong**: Gold corners are rendered as direct children of `<section>` which has `padding: 80px 16px`. They should be inside `.ag-couple-frame` per the blueprints ("inset 16px from content container edges").
**Expected**: GoldCorners inside the frame container for correct positioning
**Severity**: Minor

### Minor #3: DesignedByFooter not using the shared component

**File**: `sections/Closing.tsx` lines 129-132
**What's wrong**: Footer renders custom markup (`<span>Designed by</span><span>Shaadi Invites</span>`) instead of importing the shared `DesignedByFooter` component. Section blueprints say "DesignedByFooter component (shared, unchanged)."
**Expected**: Use shared DesignedByFooter component
**Note**: Using shared component would break isolation rule, so custom footer is acceptable for experimental template. This is an observation, not a required change.
**Severity**: Minor (acceptable tradeoff for isolation)

### Minor #4: Couple section Couple names not wrapped in ag-section__inner

**File**: `sections/Couple.tsx`
**What's wrong**: The section doesn't use `.ag-section` base class or `.ag-section__inner` for content width constraint.
**Expected**: Content should be constrained to `--ag-content-width` (370px)
**Severity**: Minor (ag-couple-frame provides equivalent constraint)

### Minor #5: Countdown timer numbers -- no animation on number change

**File**: `sections/Countdown.tsx`
**What's wrong**: Timer numbers update via React state with no transition animation. Motion plan doesn't explicitly require number-change animation, but the countdown updates every second with a hard swap.
**Expected**: Optional smooth number transition
**Severity**: Minor

### Minor #6: Event card Layout A uses inline backgroundImage

**File**: `sections/Celebrations.tsx` line 209
**What's wrong**: Layout A card sets `backgroundImage` via inline style, duplicating the CSS class `.ag-event-layout-a` which also defines `background-image`. This means the inline style overrides the CSS.
**Expected**: Use either CSS class or inline style, not both
**Severity**: Minor (works, just redundant)

### Minor #7: leaf-4 asset not imported

**File**: `index.tsx`
**What's wrong**: `leaf-4.png` exists but is not imported. Should be added to hero and/or other particle configs to match choreography.
**Expected**: Import and use leaf-4 for complete particle budget
**Severity**: Minor (tied to Major #1 and Major #5)

---

## Observations

1. **Architecture is solid**: The template is well-isolated, uses proper React patterns (refs, useGSAP, IntersectionObserver), and the component hierarchy is clean.

2. **SVG components are inline**: All 11 SVG decorative elements are React components with `aria-hidden="true"`, avoiding extra network requests.

3. **CSS variables are comprehensive**: All 60+ design tokens from the design bible are implemented in `:root`.

4. **Reduced motion handling is thorough**: Every section component checks for `prefers-reduced-motion`, CSS has a comprehensive media query block, and AmbientLayer returns null.

5. **Video handling is robust**: The canplay retry + 6s fallback + play promise rejection handling covers all failure modes.

6. **Build output**: Template chunk is 67.18 kB (26.54 kB gzipped) which is reasonable for the complexity.

7. **Font loading**: Google Fonts loaded via CSS @import in main.css. This blocks rendering until fonts are loaded. Consider using `<link rel="preload">` for faster font loading.

8. **The main.css @import for Google Fonts** is at line 9 -- this is a render-blocking request. For production, fonts should be self-hosted or loaded via a `<link>` tag in the HTML head.

9. **water-reflection.png is 400KB**: This is the largest asset. Consider compression before production use.

# Taj Template — QA Report

> Visual QA review conducted by code inspection on 2026-11-11.
> Template route: `/experimental/taj`

---

## 1. Build Status

### TypeScript (`npx tsc --noEmit`)
**PASS** — Zero Taj-specific errors. All type checks pass for files in `src/experimental-template/taj/`.

### Vite Build (`npm run build`)
**PASS (Taj-specific)** — The build fails due to pre-existing errors in other templates (`kerala-dawn`, `ruby-hour`) and `model.ts`, but none originate from the Taj template. The Taj template code itself compiles cleanly.

Pre-existing errors (not Taj):
- `kerala-dawn/sections/Closing.tsx` — unused import
- `kerala-dawn/sections/Couple.tsx` — unused imports and variable
- `ruby-hour/RubyHour.tsx` — type mismatch, unused import, missing property
- `src/invitations/model.ts` — missing DOM lib

---

## 2. Route Verification

**PASS** — Route is correctly registered in `src/App.tsx`:
- Line 52: `const Taj = lazy(() => import('./experimental-template/taj'))`
- Line 145: `<Route path="/experimental/taj" element={<Taj />} />`

Uses `lazy()` (not `lazySitePage()`), which is correct per project rules — native templates manage their own fonts and must not be wrapped with SiteFonts.

---

## 3. Critical Defects (Blocking)

**None found.** The template compiles, the route is registered, and there are no runtime crash risks visible from code inspection.

---

## 4. Major Issues

### MAJ-1: Section Dividers Placed One Section Too Early

**Severity: MAJOR**
**File:** `src/experimental-template/taj/index.tsx` (lines 314-349)

The ornamental dividers between sections are each placed one position earlier than specified in the blueprints. The current layout:

| Position in code | Comment says | Actually between |
|-----------------|-------------|-----------------|
| After Opening | "Couple / Dua — star, 50%" | Opening / Couple |
| After Couple | "Dua / Countdown — crescent, 40%" | Couple / Dua |
| After Dua | "Countdown / Celebrations — dome, 60%" | Dua / Countdown |
| After Countdown | "Celebrations / RSVP — diamond, 40%" | Countdown / Celebrations |
| After RSVP | "Gallery / Closing — rose, 40%" | RSVP / Gallery |

The blueprints specify:
- **No divider** between Opening and Couple (seamless midnight transition with 32px gap)
- First divider (star, 50%) between Couple and Dua
- Crescent (40%) between Dua and Countdown
- Dome (60%) between Countdown and Celebrations
- Diamond (40%) between Celebrations and RSVP
- **No divider** between RSVP and Gallery (48px gap of solid midnight)
- Rose (40%) between Gallery and Closing

This means the entire divider sequence is shifted up by one section. The motifs themselves are correct but misplaced.

### MAJ-2: Missing Divider Between Celebrations and RSVP

**Severity: MAJOR**
**File:** `src/experimental-template/taj/index.tsx`

The comment on line 342 says "No divider between RSVP and Gallery per blueprints" — this is correct per the blueprints. However, because all dividers are shifted (MAJ-1), the diamond divider that should be between Celebrations and RSVP is instead between Countdown and Celebrations, and there is no divider at all between Celebrations and RSVP. Fixing MAJ-1 would resolve this.

### MAJ-3: Countdown Year Display Shows Numeric Instead of Written-Out Year

**Severity: MAJOR**
**File:** `src/experimental-template/taj/sections/Countdown.tsx` (line 34)

The blueprints specify the year should be written in a poetic format: "Two Thousand Twenty Seven" (not "2027"). The current implementation simply calls `dateObj.getFullYear().toString()`, producing "2027". The variable is even named `yearWords` but does not convert to words.

### MAJ-4: Missing Digit Transition Animation in Countdown

**Severity: MAJOR**
**File:** `src/experimental-template/taj/sections/Countdown.tsx`

The motion plan specifies an animated digit transition: "old digit slides up and fades out while new digit slides in from below." The CSS classes for this are defined in `main.css` (`.tj-digit-container`, `.tj-digit`, `.tj-digit--exit`, `.tj-digit--enter`, `.tj-digit--enter-from`), but the Countdown component does not use them. It renders static `<span>` elements without the digit transition mechanism described in the motion plan. The countdown values update (via `setInterval`), but they snap between values with no animation.

### MAJ-5: `useGSAP` Registration In Wrong Location

**Severity: MAJOR**
**File:** `src/experimental-template/taj/index.tsx` (line 17)

The code calls `gsap.registerPlugin(ScrollTrigger, useGSAP)` at module scope. The GSAP docs and the gsap-react skill specify that `useGSAP` should be registered as a plugin, but this is done correctly. However, `ScrollTrigger` registration at the module level (outside a component) could cause issues if this module is loaded server-side or in a context without a DOM. Since this is a lazy-loaded component and the project uses client-side rendering, this is unlikely to cause a runtime error, but it deviates from the motion plan's recommended pattern of registering inside the component. Downgraded from critical since it works in practice.

---

## 5. Minor Issues

### MIN-1: Bismillah Font Size Differs From Blueprint

**Severity: MINOR**
**File:** `src/experimental-template/taj/styles/main.css` (line 204)

The CSS sets `.tj-bismillah` font-size to `var(--tj-text-h1)` which is 28px. The section blueprints specify Bismillah at 28px, which matches. However, the design bible says Arabic text should use `--tj-text-arabic-lg` (32px) for "primary Arabic" like Bismillah. The blueprint wins over the design bible for section-specific decisions, so this is minor — but note the inconsistency.

### MIN-2: Couple Section Has Extra Content Not In Blueprint

**Severity: MINOR**
**File:** `src/experimental-template/taj/sections/Couple.tsx`

The implementation adds parent details (bride/groom parents with "Son of"/"Daughter of" labels) and a center divider with `&` icon. These elements are not in the Couple section blueprint, which only shows: arch photo frame, rose ornaments, couple names, and a personal note. The extra content is a reasonable enhancement for a Muslim wedding template (family acknowledgment is important) but deviates from the spec.

### MIN-3: Closing Section Family Name Extraction Is Fragile

**Severity: MINOR**
**File:** `src/experimental-template/taj/sections/Closing.tsx` (lines 40-41)

The family names are extracted via `.split(' ').pop()`, which takes the last word of the full name. For "Arham Syed Khan" this gives "Khan", and for "Aisha Fatima Qureshi" this gives "Qureshi". This works for the sample data but would break for names with suffixes (e.g., "Arham Khan Jr.") or single-word names. A dedicated field in the data model would be more robust.

### MIN-4: Countdown Year Not Poetic Format

**Severity: MINOR** (duplicate aspect of MAJ-3)

The blueprint shows "Two Thousand Twenty Seven" as the year format. This is a stylistic gap that reduces the "poetic/ceremonial" feel described in the blueprints. Not just a missing utility — the entire written-date treatment is intended to avoid the casual "2027" format.

### MIN-5: Gallery Uses Placeholder Divs Instead of Images

**Severity: MINOR**
**File:** `src/experimental-template/taj/sections/Gallery.tsx`

The gallery renders placeholder `<div>` elements with "Photo N" text instead of `<img>` elements. This is expected for a prototype/experimental template but means:
- No lazy loading attribute (`loading="lazy"`) is applied
- No `object-fit: cover` is tested
- The lightbox interaction described in the motion plan is not implemented

### MIN-6: No Petal Drift Animation in Closing Section

**Severity: MINOR**
**File:** `src/experimental-template/taj/sections/Closing.tsx`

The motion plan and CSS define a rose petal drift animation (`.tj-petal` with `tj-petal-drift` keyframes), but the Closing section does not render any petal elements. The CSS for petals exists in the motion plan but is not in `main.css` either — it was documented as optional.

### MIN-7: Arch Stroke Reveal Animation Not Implemented

**Severity: MINOR**
**File:** Index GSAP setup / `main.css`

The motion plan specifies an arch stroke reveal animation using `stroke-dashoffset` on the Couple section's arch SVG. The CSS class `.tj-arch-path` is defined in the reduced-motion section of `main.css` (line 1110) but the corresponding GSAP animation to measure path length and animate `strokeDashoffset` is not present in `index.tsx`. The `MughalArch` component would need to expose a path element with class `tj-arch-path` for this to work.

### MIN-8: Event Card Title Alignment

**Severity: MINOR**
**File:** `src/experimental-template/taj/styles/main.css` (line 624)

The event card title (`.tj-event-card__title`) is set to `text-align: center`, but the blueprint specifies event details should be "left-aligned" within cards for scanability. The title being centered while date/time/venue are left-aligned creates a mixed alignment. The blueprint says event name is inside the arch header (centered there), with details below being left-aligned — so the current center alignment for the title may be intentional for the arch header context, but worth verifying visually.

### MIN-9: RSVP Textarea Uses Different Border Style Than Inputs

**Severity: MINOR**
**File:** `src/experimental-template/taj/styles/main.css`

The blueprint specifies all form inputs use "bottom-border-only style" (no visible box borders). The text inputs correctly use `border-bottom` only. However, the textarea (`.tj-rsvp-textarea`) uses a full box border (`border: 1px solid var(--tj-divider)`). This is a reasonable UX choice for a multiline field but differs from the blueprint's uniform bottom-border design language.

### MIN-10: `lazySitePage` Used for Old Tajmahal Route

**Severity: MINOR** (not a Taj bug, but related)
**File:** `src/App.tsx` (line 26)

The old `/tajmahal` route uses `lazySitePage()` (line 26), while the new `/experimental/taj` correctly uses `lazy()`. The old route wraps with SiteFonts, which the new experimental template avoids. This is expected since they are different templates, but worth noting that the old iframe-based Tajmahal template still exists at `/tajmahal`.

---

## 6. What Works Well

1. **CSS scoping is excellent.** Every class uses `tj-` prefix, every custom property uses `--tj-` prefix. No global leaks. The `isolation: isolate` on `.tj-page` prevents stacking context bleed.

2. **Design token system is comprehensive.** All 12 core palette colors, functional tokens, spacing scale, typography tokens, shadow/glow tokens, and animation tokens are properly defined on `.tj-page` and consistently referenced throughout.

3. **GSAP integration follows best practices.** `useGSAP` with `scope: containerRef` ensures cleanup on unmount. All `scrollTrigger` instances use `once: true`. `ScrollTrigger.batch()` is used for repeated elements (event cards, gallery items). No translateY animations per project rules.

4. **Reduced motion support is thorough.** Both CSS (`@media (prefers-reduced-motion: reduce)`) and GSAP (JS `matchMedia` check) are implemented. The CSS fallback sets all opening elements to their final visible state. The GSAP guard skips timeline creation and sets final states with `gsap.set()`.

5. **Video handling follows project rules.** The `canplay` event listener, autoplay fallback, 12s timeout, `preload="metadata"`, poster image, and `muted`/`playsInline` attributes are all present and correctly implemented.

6. **Arabic text accessibility.** `dir="rtl"` and `lang="ar"` attributes are correctly applied on the Bismillah element in Opening and the Dua Arabic text. Amiri font is loaded for Arabic rendering.

7. **Module isolation.** Zero imports from outside `src/experimental-template/taj/` except React, GSAP, and `@gsap/react`. No database connections, no Supabase references, no environment variables. The template is fully self-contained.

8. **Asset barrel file is complete.** All 13 SVG components are exported from `assets/index.ts`, including the backward-compat alias (`CrescentStar` -> `CrescentMoon`).

9. **Type safety.** `WeddingData`, `CoupleInfo`, `CelebrationEvent`, and `RSVPFormData` interfaces are well-defined. Props flow correctly from index -> sections. TypeScript reports zero errors.

10. **Font loading strategy.** CSS `@import` loads all three Google Fonts families (Cormorant Garamond, Amiri, Outfit) with `display=swap`. `ScrollTrigger.refresh()` is called after `document.fonts.ready` to recalculate positions after font swap.

11. **Responsive handling.** Small-screen adjustments at `max-width: 380px` scale down hero text, heading sizes, and spacing tokens per the design bible spec.

12. **Opening timeline matches motion plan.** The GSAP timeline sequence (overlay -> bismillah -> name1 -> connector -> name2 -> divider -> tagline -> scroll indicator) matches the motion plan's 9-step breakdown with correct position parameters and easing.

---

## 7. Testing Limitations

1. **No browser rendering.** This review was conducted entirely by reading code. Visual appearance, layout correctness, animation timing, and font rendering could not be verified.

2. **No interaction testing.** RSVP form submission, radio button behavior, countdown timer accuracy, and gallery interactions were reviewed structurally but not functionally tested.

3. **No cross-browser testing.** CSS features like `background-clip: text`, `dvh` units, `aspect-ratio`, and `border-image` have varying support. Could not verify fallback behavior.

4. **No performance profiling.** GSAP animation frame rates, CSS animation compositor promotion, font loading impact, and video decode performance were not measurable.

5. **No actual video playback.** The `canplay`/`ended` event flow and autoplay policy handling were reviewed in code but not tested with the actual `opening.mp4` file.

6. **Asset SVG rendering.** The SVG path data in all 13 asset components was reviewed for structural correctness but the actual visual output (arch shape, rose design, jali pattern geometry) could not be verified without rendering.

7. **No InvitationViewport integration test.** The template is designed to render at 402px inside InvitationViewport on desktop, but the experimental route does not wrap with this component, so the desktop presentation was not testable.

---

## Summary

| Category | Count |
|----------|-------|
| Critical defects | 0 |
| Major issues | 5 |
| Minor issues | 10 |

The template is structurally sound — it compiles cleanly, follows project conventions rigorously, and implements the design system faithfully. The most significant issue is the misplaced section dividers (MAJ-1), which shifts the entire ornamental divider sequence one section too early. The countdown year display (MAJ-3) and missing digit transitions (MAJ-4) are the other notable gaps versus the blueprints. All major issues are straightforward to fix.

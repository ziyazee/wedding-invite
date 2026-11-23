# Muslim Couple Template -- Visual QA Report

**Date**: 2026-11-14
**Reviewer**: Visual QA Agent
**Template**: muslim-couple (experimental)
**Docs audited**: MASTER_RULES.md, design-bible.md, storyboard.md, motion-plan.md, svg-manifest.md

---

## 1. Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| MAJOR | 18 |
| MINOR | 10 |

**Overall status**: FAIL -- 3 critical and 18 major issues must be resolved before the template is production-ready.

---

## 2. Build Verification

> **Note**: Build verification was not executed because this project's instructions prohibit shell commands for builds. A manual `npx tsc --noEmit` and `npm run build` should be run to confirm zero type errors and a clean production bundle.

---

## 3. Checklist Results

### 3.1 Filesystem Isolation

**PASS**

- All template files are contained within `src/experimental-template/muslim-couple/`.
- `App.tsx` has exactly 2 lines added: lazy import (line 59) and Route (line 159).
- No imports from `src/invitations/` or other template directories.
- SVG barrel export at `assets/svg/index.ts` exports only local components.
- Sample data, types, animations all within template directory.

### 3.2 CSS Scoping

**PASS**

- Root: `.mc-root { isolation: isolate; }` correctly applied.
- All CSS classes use `mc-` prefix.
- All custom properties use `--mc-` prefix.
- No `body`, `html`, `*`, or `:root` selectors.
- No global style injections.

### 3.3 Section Completeness

**FAIL** -- All 6 sections exist but have content/element count deviations.

| Section | Status | Issues |
|---------|--------|--------|
| Welcome (Entry) | FAIL | Missing breathing animation, wrong reveal timing, video autoplay issue |
| Family | FAIL | Wrong element counts, wrong font, extra content |
| Countdown | FAIL | Wrong element counts, missing digit animation |
| Celebrations | FAIL | Wrong title, missing ambient elements, wrong animation pattern |
| RSVP | FAIL | Wrong title, wrong subtitle, missing ambient elements |
| Closing | FAIL | Wrong bird count, missing elements, wrong footer text |

### 3.4 Entry Screen Pattern Compliance

**FAIL** -- Multiple deviations from MASTER_RULES.md Section 10 and motion-plan.md.

See CRITICAL issues C-01, C-02, C-03 and MAJOR issues M-01 through M-05 below.

### 3.5 Animation Rules Compliance

**PARTIAL PASS**

- No translateY reveal animations outside the entry screen per-word overlay. PASS.
- No setInterval for animation timing (the countdown uses setInterval for data tick, which is acceptable). PASS.
- No continuous rAF loops. PASS.
- IntersectionObserver pauses ambient timelines when section leaves viewport. PASS.
- will-change managed correctly (applied on visible, removed on pause). PASS.
- gsap.matchMedia used for prefers-reduced-motion. PASS.
- Ambient element counts do NOT match the motion-plan performance budget. FAIL.
- Missing digit transition animation in Countdown. FAIL.
- Missing tap-to-open breathing animation. FAIL.

### 3.6 Content / Cultural Accuracy

**PARTIAL PASS**

- Bismillah present in Family section. PASS.
- Dua Arabic text present in Closing section. PASS.
- Nikah, Walima, Mehendi events present in sample data. PASS.
- Family roles (son/daughter) correctly handled. PASS.
- Footer text "Made with love" does not match spec "Designed by Shaadi Invites". FAIL.
- Section titles deviate from storyboard. FAIL.

### 3.7 Performance

**PARTIAL PASS**

- GSAP plugins registered once at root. PASS.
- Fonts loaded via single Google Fonts link, no SiteFonts wrapper. PASS.
- Sections 2-6 conditionally rendered only when isOpen. PASS.
- ScrollTrigger.refresh() called after open. PASS.
- Video uses preload="metadata". PASS.
- Ambient element counts exceed budget in Family, Countdown. FAIL.

### 3.8 Accessibility

**PARTIAL PASS**

- All sections have `aria-label`. PASS.
- Decorative elements have `aria-hidden="true"`. PASS.
- RSVP form has proper labels, htmlFor, and autoComplete. PASS.
- Radio buttons have role="radiogroup", role="radio", aria-checked. PASS.
- Guest count has aria-live="polite". PASS.
- Countdown has role="timer" and aria-live="polite". PASS.
- prefers-reduced-motion supported with gsap.matchMedia. PASS.
- Reduced motion in Welcome.tsx sets all words visible immediately. PASS.
- Reduced motion in Closing.tsx sets mosque and crescent visible. PASS.
- Missing: RSVP reduced motion (clip-path still animates in reduced-motion mode -- gsap.matchMedia may handle it, but no explicit static fallback for the card). MINOR.

---

## 4. Issues Found

### CRITICAL

#### C-01: Video attempts autoplay before user tap
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, lines 50-57
- **Spec**: MASTER_RULES.md Section 10 and motion-plan.md Phase B both state: video plays ONLY after user taps "Tap to Open" button. `play()` is called in Phase B (handleTapToOpen), not on canplay.
- **Actual**: The `canplay` event handler on line 50-57 calls `video.play()` immediately when the video is ready, before any user interaction. This violates the Entry Screen Pattern which requires user-initiated playback.
- **Fix**: Remove the `video.play()` call from the canplay handler. The canplay handler should only set `videoReady` state. Video playback should begin in `handleOpen()` (index.tsx) or `handleTapOpen()` (Welcome.tsx) after the user taps.

#### C-02: Name reveal timing uses fixed 3s instead of calculated from video duration
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, lines 81-82
- **Spec**: motion-plan.md Phase C specifies: `triggerTime = videoDuration - 1s - totalAnimTime`. The reveal must be calculated so the last word finishes 1 second before the video ends. Each word gets 1s duration with 0.35s stagger.
- **Actual**: Line 82 hardcodes `const revealDuration = 3;` and uses simple progress-based word show/hide. This means the timing is disconnected from the actual video length.
- **Fix**: Implement `calculateTriggerTime()` as specified in motion-plan.md. Use `video.duration` to compute when to start the reveal timeline. Build a paused GSAP timeline with per-word stagger and play it when `currentTime >= triggerTime`.

#### C-03: Date not included in name word reveal
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, line 41
- **Spec**: motion-plan.md Phase C line 90: `// Words: ["AISHA", "&", "FAIZAN", "December 20, 2025"] = 4 words`. The date is the 4th word in the reveal sequence.
- **Actual**: Line 41 builds words from `"${couple.groom} & ${couple.bride}"` only, producing 3 words (e.g., "Farhan & Ayesha"). The wedding date is never included in the word reveal.
- **Fix**: Append the formatted wedding date as the final word: `const nameText = \`${couple.groom} & ${couple.bride}\n${couple.weddingDateFormatted}\`;` (or similar, treating the date as the final reveal element).

---

### MAJOR

#### M-01: Video has `loop` attribute not in spec
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, line 186
- **Spec**: motion-plan.md specifies the video plays once after tap; the name reveal is timed to finish before the video ends. A looping video breaks the one-shot reveal timing.
- **Actual**: `<video ... loop>` is set on line 186.
- **Fix**: Remove the `loop` attribute from the video element.

#### M-02: Music button only visible when isOpen
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, line 235
- **Spec**: motion-plan.md Phase A initial state: `musicButton: { opacity: 1 }`. The music button must be visible at all times (before and after open).
- **Actual**: Line 235: `{musicUrl && isOpen && (` -- the button is hidden before the invitation is opened.
- **Fix**: Change condition to `{musicUrl && (` to show the button at all times.

#### M-03: Missing tap-to-open breathing animation
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`
- **Spec**: motion-plan.md Phase A specifies a breathing scale animation on the tap button: `scale: 1.03`, duration 1s, `sine.inOut`, repeat -1, yoyo.
- **Actual**: No breathing animation is applied to the tap button. It has static opacity only.
- **Fix**: Add a useGSAP hook that animates `tapBtnRef.current` with the specified breathing params.

#### M-04: Poster image is .jpg instead of .webp
- **File**: `src/experimental-template/muslim-couple/sections/Welcome.tsx`, line 6
- **Spec**: storyboard.md and svg-manifest.md specify WebP for all raster assets (garland corners, drape, poster).
- **Actual**: `import posterImage from '../assets/images/muslim-couple-poster.jpg';`
- **Fix**: Convert the poster to WebP format and update the import path.

#### M-05: Family section -- wrong ambient element counts
- **File**: `src/experimental-template/muslim-couple/sections/Family.tsx`, lines 165, 181
- **Spec**: motion-plan.md performance budget: Family = 3 petals, 2 sparkles (total 5).
- **Actual**: Lines 165: `{[0, 1, 2, 3, 4].map(` = 5 petals. Lines 181: `{[0, 1, 2, 3].map(` = 4 sparkles. Total = 9 animated elements.
- **Fix**: Reduce to 3 petals `[0, 1, 2]` and 2 sparkles `[0, 1]`.

#### M-06: Family section -- "Together with their families" uses wrong font
- **File**: `src/experimental-template/muslim-couple/sections/Family.tsx`, line 215
- **Spec**: storyboard.md specifies "Together with their families" uses Great Vibes (accent font) at 1rem.
- **Actual**: Line 215 uses `mc-font-body-light` (which maps to Lato 300).
- **Fix**: Change class to `mc-font-accent` (Great Vibes).

#### M-07: Family section -- extra couple names display not in storyboard
- **File**: `src/experimental-template/muslim-couple/sections/Family.tsx`, lines 219-233
- **Spec**: storyboard.md Section 2 layout does NOT include a display of the couple names between the "Together" text and the family cards. The names are already revealed in the Entry Screen.
- **Actual**: Lines 219-233 render the couple names with an ampersand between "Together with their families" and the family cards.
- **Fix**: Remove the couple names block (lines 219-233) from the Family section.

#### M-08: Family section -- uses ArabesqueFlourish for corners instead of ArabesqueScrollwork
- **File**: `src/experimental-template/muslim-couple/sections/Family.tsx`, lines 138, 142
- **Spec**: storyboard.md Section 2 specifies ArabesqueScrollwork for corner ornaments. svg-manifest.md lists ArabesqueScrollwork as "Corner arabesque ornament" distinct from ArabesqueFlourish ("Horizontal flourish").
- **Actual**: Uses `ArabesqueFlourish variant="small"` for corners.
- **Fix**: Change to `ArabesqueScrollwork` for the corner decorations.

#### M-09: Countdown section -- wrong sparkle count
- **File**: `src/experimental-template/muslim-couple/sections/Countdown.tsx`, line 153
- **Spec**: motion-plan.md performance budget: Countdown = 3 sparkles.
- **Actual**: `{[0, 1, 2, 3, 4, 5].map(` = 6 sparkles.
- **Fix**: Reduce to 3 sparkles `[0, 1, 2]`.

#### M-10: Countdown section -- missing 4 floating petals
- **File**: `src/experimental-template/muslim-couple/sections/Countdown.tsx`
- **Spec**: motion-plan.md performance budget: Countdown = 4 petals.
- **Actual**: No petals are rendered in the Countdown section. No petalRefs exist.
- **Fix**: Add 4 floating petals with RosePetal SVG and createPetalTimeline animations.

#### M-11: Countdown section -- missing digit transition animation
- **File**: `src/experimental-template/muslim-couple/sections/Countdown.tsx`
- **Spec**: motion-plan.md Section 5 specifies a digit transition: when a countdown digit changes, the old value fades out while the new value fades in (opacity + scale micro-animation, 300ms).
- **Actual**: Digits update via React state only with no visual transition. The countdown numbers just change instantly.
- **Fix**: Implement a digit-change animation using GSAP -- detect when a digit value changes and apply a short opacity/scale transition.

#### M-12: Countdown section -- date/time inside card instead of below
- **File**: `src/experimental-template/muslim-couple/sections/Countdown.tsx`, lines 209-214
- **Spec**: storyboard.md Section 3 layout shows the date and time text BELOW the frosted glass countdown card, not inside it.
- **Actual**: Lines 209-214 place `mc-countdown-date` and `mc-countdown-time` inside the `.mc-card-countdown` div.
- **Fix**: Move the date/time elements outside and below the `.mc-card-countdown` div.

#### M-13: Celebrations section -- title "Celebrations" instead of "Our Celebrations"
- **File**: `src/experimental-template/muslim-couple/sections/Celebrations.tsx`, line 82
- **Spec**: storyboard.md line 742 and typography table line 801: title is "Our Celebrations".
- **Actual**: Line 82: `Celebrations`
- **Fix**: Change to `Our Celebrations`.

#### M-14: Celebrations section -- missing ambient elements
- **File**: `src/experimental-template/muslim-couple/sections/Celebrations.tsx`
- **Spec**: motion-plan.md performance budget: Celebrations = 2 petals, 1 sparkle (total 3).
- **Actual**: No ambient petals or sparkles rendered. No useAmbientPause hook.
- **Fix**: Add 2 floating petals and 1 sparkle with appropriate animations and IntersectionObserver pause.

#### M-15: Celebrations section -- single ScrollTrigger with stagger instead of per-card independent ScrollTriggers
- **File**: `src/experimental-template/muslim-couple/sections/Celebrations.tsx`, lines 53-68
- **Spec**: storyboard.md specifies each event card has its own independent ScrollTrigger so they reveal as the user scrolls to each card individually.
- **Actual**: Uses a single ScrollTrigger on the section with `stagger: 0.2` applied to all `.mc-card-event` elements at once. All cards begin animating when the trigger point is reached.
- **Fix**: Create individual ScrollTriggers for each card, each triggered when that specific card enters the viewport.

#### M-16: RSVP section -- title "RSVP" instead of "Will You Join Us?"
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`, line 116
- **Spec**: storyboard.md line 928 and typography table line 1005: title is "Will You Join Us?".
- **Actual**: Line 116: `RSVP`
- **Fix**: Change to `Will You Join Us?`.

#### M-17: RSVP section -- missing ambient elements
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`
- **Spec**: motion-plan.md performance budget: RSVP = 3 petals, 1 sparkle (total 4).
- **Actual**: No ambient petals or sparkles rendered. No useAmbientPause hook.
- **Fix**: Add 3 floating petals and 1 sparkle with appropriate animations and IntersectionObserver pause.

#### M-18: Closing section -- wrong bird count and missing ambient elements
- **File**: `src/experimental-template/muslim-couple/sections/Closing.tsx`, lines 121-125, 171
- **Spec**: motion-plan.md line 1179: "2 birds in Closing section only". Performance budget: Closing = 6 petals, 3 sparkles, 2 lantern glows, 2 birds, 1 moon (total 14).
- **Actual**: 3 birds (line 121-125 has 3 configs, line 171 renders `[0, 1, 2]`). Missing 6 petals, missing 3 sparkles, missing 2 lantern glows, missing bottom garland WebP.
- **Fix**: Reduce birds to 2. Add 6 petals, 3 sparkles, 2 lantern glows. Add the bottom garland WebP image. Change footer from "Made with love" to "Designed by Shaadi Invites" (storyboard line 1205/1249).

---

### MINOR

#### m-01: RSVP section -- wrong clip-path reveal direction
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`, lines 54-55
- **Spec**: storyboard.md specifies RSVP card reveals with `clipPath: 'inset(0 50% 0 50%)'` (center-out horizontal).
- **Actual**: Uses `clipPath: 'inset(0 0 100% 0)'` to `'inset(0 0 0% 0)'` (bottom-up reveal).
- **Fix**: Change to center-out: `from: 'inset(0 50% 0 50%)'`, `to: 'inset(0 0% 0 0%)'`.

#### m-02: RSVP section -- submit button text "Send RSVP" instead of "Send Response"
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`, line 258
- **Spec**: storyboard.md line 1012: "Send Response".
- **Actual**: `'Send RSVP'`
- **Fix**: Change to `'Send Response'`.

#### m-03: RSVP section -- success text "Sent with Love" instead of "Response Sent"
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`, line 255
- **Spec**: storyboard.md line 1138: "Response Sent".
- **Actual**: `Sent with Love`
- **Fix**: Change to `Response Sent`.

#### m-04: RSVP section -- wrong subtitle text
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`, line 127
- **Spec**: storyboard.md does not specify this exact subtitle wording. The section should follow the storyboard layout.
- **Actual**: "Kindly let us know if you will be gracing us with your presence" -- not specified in storyboard.
- **Fix**: Verify against storyboard and align subtitle text.

#### m-05: RSVP section -- missing corner arabesques
- **File**: `src/experimental-template/muslim-couple/sections/RSVP.tsx`
- **Spec**: storyboard.md Section 5 layout includes ArabesqueScrollwork corner ornaments (similar to Family section).
- **Actual**: No corner ornaments rendered.
- **Fix**: Add ArabesqueScrollwork corner decorations.

#### m-06: Family sparkles use inline SVG circle instead of FourPointStar
- **File**: `src/experimental-template/muslim-couple/sections/Family.tsx`, lines 191-193
- **Spec**: svg-manifest.md specifies FourPointStar for sparkles. All other sections use FourPointStar for sparkles.
- **Actual**: Family sparkles use an inline `<svg><circle>` instead of the FourPointStar component.
- **Fix**: Replace inline SVG with `<FourPointStar variant="gold" style={{ width: 6, height: 6 }} />`.

#### m-07: Closing section -- footer text "Made with love" instead of "Designed by Shaadi Invites"
- **File**: `src/experimental-template/muslim-couple/sections/Closing.tsx`, line 215
- **Spec**: storyboard.md lines 1205, 1249: "Designed by Shaadi Invites", Lato 12px, 50% opacity.
- **Actual**: `Made with love`
- **Fix**: Change to `Designed by Shaadi Invites`.

#### m-08: Closing section -- missing bottom garland WebP
- **File**: `src/experimental-template/muslim-couple/sections/Closing.tsx`
- **Spec**: storyboard.md line 1149: "A bottom floral garland mirrors the entry screen's top garland, completing the visual circle." Line 1379: "The bottom garland WebP provides a visual 'closing' frame."
- **Actual**: No bottom garland image rendered.
- **Fix**: Add the bottom garland WebP image at the end of the Closing section.

#### m-09: No public/templates/muslim-couple/ directory for WebP assets
- **File**: `public/templates/muslim-couple/` (missing)
- **Spec**: svg-manifest.md lists 4 WebP assets (garland-corner-tl.webp, garland-corner-tr.webp, garland-bottom.webp, drape-blush.webp) expected in the public assets directory.
- **Actual**: No `public/templates/muslim-couple/` directory exists.
- **Fix**: Create the directory and add the required WebP assets. Reference them in the template components.

#### m-10: useGSAP used without gsap.context() in some animations
- **File**: Multiple section files
- **Spec**: motion-plan.md Section 7.2: "Every section component wraps ALL its GSAP work in a single gsap.context() via useGSAP({ scope: sectionRef })."
- **Actual**: The useGSAP hooks do use `scope: sectionRef` which is the @gsap/react equivalent of gsap.context(). However, some query-based selectors like `.mc-family-content` (Family.tsx line 48) and `.mc-closing-content` (Closing.tsx line 78) select by class name within the scoped context. This works but is fragile if there are multiple instances.
- **Fix**: Consider using refs instead of class-based selectors for animation targets. Low priority since scope limits the query to the section.

---

## 5. Recommendations

### Priority 1 (Critical -- must fix before any testing)
1. **C-01**: Remove video autoplay from canplay handler. Video must only play after user taps "Tap to Open".
2. **C-02**: Implement video-duration-based name reveal timing per motion-plan.md Phase C.
3. **C-03**: Include the wedding date as the final word in the reveal sequence.

### Priority 2 (Major -- fix before visual review)
4. **M-01**: Remove `loop` from video element.
5. **M-02**: Show music button at all times, not just after open.
6. **M-03**: Add breathing animation to tap button.
7. **M-05 through M-18**: Correct all ambient element counts to match the performance budget table. This is a systematic issue affecting 5 of 6 sections.
8. Fix all incorrect section titles (M-13, M-16) and footer text (M-18/m-07).
9. **M-07**: Remove extra couple names display from Family section.
10. **M-08**: Use ArabesqueScrollwork for corners, not ArabesqueFlourish.

### Priority 3 (Minor -- fix before polish pass)
11. Create `public/templates/muslim-couple/` and add WebP assets.
12. Fix RSVP clip-path direction, button/success text.
13. Add corner arabesques to RSVP section.
14. Replace inline SVG sparkles in Family with FourPointStar component.

### General Observations
- The animation infrastructure (useAmbientPause, ambientElements.ts, GSAP plugin registration) is well-built and follows the spec patterns closely.
- CSS scoping and filesystem isolation are exemplary.
- The primary gap is between the planning documents' element counts/content and what was actually implemented -- most sections have either too many or too few ambient elements, and several text strings deviate from the storyboard.
- The entry screen has the most critical issues: autoplay behavior, reveal timing, and missing date word.

---

*End of QA Report*

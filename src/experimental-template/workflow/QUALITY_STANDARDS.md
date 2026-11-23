# Quality Standards

## Acceptance Criteria

Every template must meet these standards before it can pass Gate 7 (Final Delivery). The Visual QA agent evaluates against this document.

## Mandatory Rejections

The following conditions are automatic failures. A template exhibiting any of these must be revised before re-submission.

### Visual composition
- Plain colored sections with no visual composition
- Generic gradient backgrounds used as primary section backgrounds
- Generic AI-looking floral or decorative elements
- Random floating particles with no design rationale
- Repetitive identical section layouts (all sections look the same)
- Unrelated cultural decorations (elements from wrong tradition)
- Unnecessary visual clutter (elements that don't serve the design)

### Animation
- Static artwork where the storyboard specified animated movement
- Basic fade-in used as the sole animation throughout the template
- Uncontrolled animations (tweens not killed on unmount, infinite spawning)
- Broken or disconnected section transitions
- Random movement with no design intent
- Animations that obscure readable content
- Animations that cause horizontal scrollbar overflow

### Technical
- TypeScript compilation errors
- Vite build failures
- Console errors on page load
- Missing sections (any of the 6 mandatory sections absent)
- Broken RSVP interaction
- Horizontal scrollbar on mobile or desktop
- Memory leaks from GSAP tweens or element spawning

---

## Mandatory Requirements

### Creative concept
- A distinctive, identifiable creative concept that goes beyond "wedding invitation"
- The concept must be articulable in one sentence (e.g. "a moonlit Kerala backwater ceremony viewed through the glow of oil lamps")
- The concept must visibly influence every section's composition

### Cultural authenticity
- Artwork, motifs, and decorative elements grounded in the specified culture
- Research-backed: every cultural element traceable to `planning/cultural-direction.md`
- No mixing of unrelated cultural traditions without acknowledgment
- Script/language fonts (Arabic, Devanagari, Gurmukhi, etc.) must be authentic typefaces

### Custom SVG illustrations
- At least one set of custom SVG decorative elements (ornaments, dividers, patterns)
- SVGs must be detailed and refined: multi-path, varied opacity, fine strokes
- Clean, valid SVG with appropriate viewBox
- Animation-friendly structure (separate paths for independently moving parts)

### Visual depth
- Multiple layers of visual content (background, mid-ground, foreground)
- Depth created through opacity layering, parallax, or z-index composition
- Background treatments beyond flat color: textures, patterns, gradients, images
- Light and shadow effects where appropriate

### Purposeful motion
- Every animation must have a design reason (reveal, atmosphere, transition, feedback)
- Opening sequence must feel cinematic (not a simple fade-in)
- Scroll experience should feel like unfolding/exploring, not just scrolling a page
- Ambient animations should feel natural and organic (slight randomness, varied timing)
- 2–3 animated element types maximum per template (restraint is luxury)

### Section transitions
- Each section must have a deliberate entry and exit
- Transitions should maintain visual continuity (the design flows, doesn't jump)
- No abrupt cuts between sections unless intentionally designed

### Typography
- Minimum 3-font system:
  - **Display** — for names (the most prominent, beautiful text on the page)
  - **Heading** — for section titles and event names
  - **Body** — for details, dates, addresses
- Letter-spacing, line-height, and font-weight deliberately chosen per element
- Names must be the largest, most visually prominent text
- All fonts from Google Fonts (loaded per-template, not via global SiteFonts)

### Color and light
- Rich, deep backgrounds — never flat or washed out
- Metallic accents (gold, silver, copper) must feel warm and real, not cheap yellow or grey
- Subtle gradients and glows for depth and atmosphere
- Opacity layering for visual richness (lattice patterns at 3–5%, textures, light bleeds)
- Color system defined as CSS custom properties with template prefix

### Layout and spacing
- Generous whitespace — never cramped or cluttered
- Strong vertical rhythm: 80–120px between sections
- Each section has a distinct layout (not repetitive card-after-card)
- Content centered and narrow: max 400–450px reading width
- Mobile-first responsive design (402px base viewport)

### Responsive design
- Template renders correctly at 402px (phone preview)
- Template renders correctly at 768px+ (tablet/desktop)
- InvitationViewport wrapping not required (experimental templates are standalone)
- No content cut off or inaccessible at any viewport width
- PNG animations scale appropriately or reduce in count on mobile

---

## PNG Animation Standards

### Performance
- Maximum 15 concurrent animated PNG elements per section
- Animated PNGs use only `transform` and `opacity` (GPU-composited properties)
- `will-change: transform` applied during active animation, removed when paused
- IntersectionObserver pauses GSAP tweens when section leaves viewport
- Tweens resume smoothly when section re-enters viewport
- No infinite element spawning — create all instances on mount, reuse them
- Each animated PNG file: max 200KB, WebP preferred with PNG fallback
- Randomize with `gsap.utils.random()`, not `Math.random()` during render

### Quality
- Animated elements feel natural: gentle, organic, not mechanical
- Slight randomness in timing and position (nature isn't uniform)
- Flying elements follow curved motion paths, never straight lines
- Floating elements have varied duration and delay between instances
- Animated elements never obscure readable text or interactive controls
- Animated elements stay within section bounds (no horizontal overflow)
- `prefers-reduced-motion: reduce` shows static PNGs without any animation

### Quantity
- 2–3 types of animated elements maximum per template
- Density must serve the design — scattered is usually better than crowded
- Elements must earn their place: decorative atmosphere, not visual noise

---

## GSAP Standards

### Lifecycle
- All tweens created inside `gsap.context()` with revert on unmount
- `gsap.matchMedia()` for responsive animation adjustments
- ScrollTrigger instances killed on unmount
- No orphan tweens after component unmount

### Easing
- Default: `power2.out` or `power2.inOut`
- Never `linear` for UI animations (acceptable only for continuous rotation or constant-speed paths)
- Custom bezier curves for signature animations
- Smooth, unhurried reveals — nothing snappy or jarring

### Scroll integration
- ScrollTrigger for viewport-based reveals
- `scrub` for scroll-linked animations (parallax, progress-based)
- `toggleActions: "play none none none"` for one-shot reveals
- Appropriate `start` and `end` markers (not all "top center")

### Reduced motion
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` on mount
- If reduced motion: skip all GSAP timeline, skip all ScrollTrigger animations, skip all ambient PNG animations, show static layout with all content immediately visible
- CSS ambient effects also disabled via `@media (prefers-reduced-motion: reduce)`

---

## CSS Standards

### Scoping
- All class names prefixed: `{abbr}-section`, `{abbr}-title`, `{abbr}-ornament`
- All custom properties prefixed: `--{abbr}-primary`, `--{abbr}-gold`
- Root element: `isolation: isolate`
- No `body`, `html`, `*`, or `:root` selectors
- No `!important` on properties that could leak outside the template
- No global `@import` statements

### Quality
- No inline styles except for dynamic values (GSAP positions, computed dimensions)
- Consistent naming convention within the template
- Logical property grouping (layout, typography, color, animation)
- Mobile-first breakpoint structure
- No vendor prefixes that GSAP or Vite/PostCSS handle automatically

---

## What Premium Does NOT Mean

- **Not excessive** — restraint is luxury; every element earns its place
- **Not busy** — visual density is deliberate, not accidental
- **Not flashy** — no neon, no heavy drop shadows, no glassmorphism
- **Not generic** — must feel handcrafted for this specific culture and couple
- **Not overloaded** — 2–3 animated element types, used tastefully
- **Not slow** — animations are unhurried but the page loads quickly

---

## Scoring Guide (for QA reports)

### CRITICAL (must fix before Gate 7)
- Build failure
- Route broken
- Section missing
- Runtime crash
- Memory leak
- Horizontal overflow

### MAJOR (should fix before Gate 7)
- Animation doesn't match storyboard specification
- PNG animation broken (not loading, not pausing, not resuming)
- Cultural element incorrect or inappropriate
- Accessibility violation (keyboard, screen reader)
- Mobile layout broken
- Reduced motion not working
- CSS scoping leak

### MINOR (fix if time allows)
- Visual detail doesn't match design bible (color slightly off, spacing inconsistent)
- Animation timing differs from motion plan
- Typography weight or size slightly off
- Decorative element positioning differs from storyboard
- Performance: animation jank at high scroll speed (but works normally)

### POLISH (nice to have)
- Animation could be smoother with different easing
- Additional decorative detail would enhance a section
- Mobile layout could be refined further
- Microinteraction missing but not specified as mandatory

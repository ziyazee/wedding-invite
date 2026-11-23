# Visual QA Skill

Methodology for testing and verifying wedding invitation templates.

## Test Sequence

### 1. Build Verification
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] Route returns HTTP 200
- [ ] No console errors on initial load
- [ ] No console warnings (except expected React dev warnings)

### 2. Section Completeness
- [ ] Welcome/Opening section renders
- [ ] Family section renders
- [ ] Countdown section renders with live timer
- [ ] Celebrations section renders (test with 1, 2, 3+ events)
- [ ] RSVP section renders with interactive form
- [ ] Closing section renders
- [ ] All sections accessible by scrolling

### 3. Visual Quality
For each section, compare against design-bible.md and section-blueprints.md:
- [ ] Colors match specified hex values
- [ ] Typography matches specified fonts, sizes, weights
- [ ] Spacing matches specified scale
- [ ] Background treatments match specification
- [ ] Decorative elements positioned correctly
- [ ] SVG ornaments render correctly
- [ ] PNG assets display at correct size and position

### 4. Animation Testing
- [ ] Opening sequence plays correctly
- [ ] Scroll reveals trigger at correct positions
- [ ] PNG ambient animations run smoothly
- [ ] Animations pause when section scrolls out of viewport
- [ ] Animations resume when section scrolls back
- [ ] `prefers-reduced-motion: reduce` disables all motion
- [ ] No jank or stutter during scroll
- [ ] No animation conflicts (elements fighting for position)

### 5. PNG Animation Specific
- [ ] All PNG images load (no broken images, no 404s)
- [ ] No more than 15 animated elements per section
- [ ] Elements don't obscure readable text
- [ ] Elements don't cause horizontal overflow
- [ ] No infinite element spawning
- [ ] GSAP tweens properly cleaned up on unmount

### 6. Responsive Testing
- [ ] Mobile (402px): layout correct, readable, functional
- [ ] Tablet (768px): appropriate adaptation
- [ ] Desktop (1200px+): InvitationViewport frame if applicable
- [ ] No horizontal scrollbar at any breakpoint
- [ ] Text readable at all sizes

### 7. Interaction Testing
- [ ] RSVP form validates correctly
- [ ] RSVP form submits (local/mock)
- [ ] Google Maps links work (if celebrations have map URLs)
- [ ] Calendar links work (if celebrations have calendar URLs)
- [ ] Scroll indicator works (if implemented)

### 8. Code Quality
- [ ] All CSS classes prefixed with template abbreviation
- [ ] All CSS custom properties prefixed
- [ ] Root element has `isolation: isolate`
- [ ] No global style leaks
- [ ] GSAP context cleanup on unmount
- [ ] No orphan ScrollTrigger instances
- [ ] IntersectionObserver disconnected on unmount

### 9. Performance
- [ ] Smooth 60fps scroll on mobile
- [ ] No layout shift (CLS) during load
- [ ] Images lazy-loaded (except opening section)
- [ ] GSAP tween count reasonable per section
- [ ] No memory leaks from animation loops

### 10. Isolation Verification
- [ ] No files created outside `src/experimental-template/{name}/`
- [ ] Only App.tsx modified externally (one route line)
- [ ] No imports from production templates
- [ ] No imports from production components
- [ ] Homepage still works (no route regression)

## Severity Classification

- **CRITICAL**: Build fails, route broken, crash, memory leak, security issue
- **MAJOR**: Section missing, animation broken, accessibility violation, PNG not loading, overflow
- **MINOR**: Visual mismatch, timing off, spacing inconsistency, missing detail

## Report Format

`planning/qa-report.md` with:
1. Build status (pass/fail)
2. Section-by-section results
3. Animation audit
4. Performance assessment
5. Critical defects (must fix)
6. Major defects (should fix)
7. Minor issues (nice to fix)
8. What works well
9. Testing limitations

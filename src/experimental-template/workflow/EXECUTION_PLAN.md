# Execution Plan

## Overview

The template creation pipeline runs in 8 phases. Some phases can be parallelized; others have strict dependencies. The orchestrator enforces execution order, manages approval gates, and prevents agents from skipping ahead.

## Phase 1: Discovery

**Mode:** Interactive, orchestrator-led
**Agent:** None — the orchestrator handles this directly
**Parallelizable:** No

### Steps

#### Step 1 — Template Identity
Ask for:
- Template name (kebab-case, e.g. `kerala-dawn`)
- Cultural identity / wedding tradition (e.g. Kerala Christian, Punjabi Sikh)
- Experience description (optional — what they envision)

Do not assume culture from the template name.

#### Step 2 — Reference Material
Ask: *"Do you have any reference images or videos?"*

Collect file paths. Verify each is accessible. Support:
- Single/multiple images
- Single/multiple videos
- Mixed references
- No references

#### Step 3 — Reference Analysis
Delegate to **Reference Analyst** agent.

For images: composition, colors (hex), typography, elements, architecture, artwork, layering, positioning, hierarchy, lighting.

For videos: duration, scenes, transitions, movement, timing, typography, loops. Inspect frames throughout, not just the opening.

Output: `planning/reference-analysis.md` (+ `planning/asset-audit.md` if PNGs provided)

#### Step 4 — Reference Classification
Present analysis to user. Ask how each reference should be used:
1. First video / intro video
2. Entry image
3. Entry video
4. Design reference only
5. Animation reference only
6. Asset reference only
7. Complete template inspiration

Record classifications in decision log.

#### Step 5 — Scroll Interaction
Ask about scroll-down indicator preferences:
- Wanted? (yes/no)
- Visual style (arrow, text, animated element, cultural motif)
- Position
- Fixed or scrolling
- Animation behavior

### Gate 1: Discovery Complete
Present a discovery summary to the user. Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 2: Research

**Agents:** Cultural Researcher + Reference Analyst
**Parallelizable:** Yes — these two run simultaneously

### Cultural Researcher
- Input: template name, cultural identity, experience description
- Research: architecture, textiles, clothing, jewellery, rituals, flowers, patterns, art forms, music, symbols, historical references
- Distinguish: historically grounded vs. modern interpretation vs. decorative choice
- Output: `planning/cultural-direction.md`

### Reference Analyst (continued)
- If not already completed in Step 3, or if additional references were provided
- Complete the reference analysis and asset audit

### Gate 2: Cultural Direction
Present cultural direction to user. Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 3: Creative Direction

**Agent:** Creative Director
**Parallelizable:** No — depends on Gate 2

### Input
- `planning/reference-analysis.md`
- `planning/asset-audit.md` (if exists)
- `planning/cultural-direction.md`
- Reference classifications from decision log
- User's creative brief / experience description

### Work
- Establish complete visual identity
- Design the invitation as one cohesive experience (not 6 independent blocks)
- Define: concept, emotion, colors (CSS vars), typography (3+ fonts), materials, backgrounds, decorative language, artwork style, depth, lighting, section continuity
- Define PNG choreography for all animated elements
- Define background image placement

### Output
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/png-choreography.md`

### Gate 3: Creative Brief
Present all three documents to user. Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 4: Storyboard

**Agent:** Storyboard Designer
**Parallelizable:** No — depends on Gate 3

### Input
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/png-choreography.md`
- `planning/cultural-direction.md`

### Work
For each of the 6 mandatory sections, specify:
1. Purpose
2. Visual concept
3. Layout and composition
4. Background artwork
5. Foreground artwork
6. Typography
7. SVG elements
8. PNG assets
9. Decorative elements
10. Element positions
11. Layering order
12. Entry animation
13. Scroll behavior
14. Exit transition
15. Mobile composition

Describe the experience as a continuous animated wedding film explored through scrolling. Avoid repeating the same layout across sections.

### Output
- `planning/storyboard.md`

### Gate 4: Storyboard
Present storyboard to user. Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 5: Production

**Agents:** Asset Illustrator + Motion Designer
**Parallelizable:** Yes — these two run simultaneously

### Asset Illustrator
- Input: storyboard, design bible, section blueprints, cultural direction
- Create production-ready SVG illustrations
- Build SVG React components in `assets/svg/`
- Verify PNG asset quality and transparency
- Separate independently animatable elements into individual layers
- Output: `planning/svg-manifest.md` + SVG files

### Motion Designer
- Input: design bible, section blueprints, png choreography, storyboard
- Plan all 5 animation layers:
  1. Opening sequence (GSAP timeline)
  2. Scroll reveals (ScrollTrigger)
  3. Ambient PNG animations (GSAP tweens with configs)
  4. CSS ambient effects (keyframes)
  5. Micro-interactions
- For each animation: element, type, states, duration, delay, easing, trigger, loop, mobile, reduced-motion
- Output: `planning/motion-plan.md`

### Gate 5: Asset & Motion Plan
Present SVG manifest and motion plan to user. Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 6: Implementation

**Agent:** React Engineer
**Parallelizable:** No — depends on Gate 5

### Input
- ALL approved planning documents
- SVG component files from Asset Illustrator
- PNG assets from user

### Work
1. Create module directory structure
2. Copy PNG assets into `assets/images/` subdirectories
3. Build types and sample data
4. Register lazy route in App.tsx
5. Build all 6 section components per blueprints
6. Build PNG animation system (FloatingElement, AmbientLayer, hooks, motion configs)
7. Integrate SVG components per manifest
8. Write scoped CSS per design bible
9. Integrate GSAP per motion plan (opening, scroll, ambient, CSS, interactions)
10. Implement RSVP form (local/mock)

### Internal Validation
- `npx tsc --noEmit` passes
- `npm run build` passes
- Route loads without console errors
- All 6 sections render

### Gate 6: Implementation (Internal)
Automated — if TypeScript and build pass, proceed to QA. No user gate.

---

## Phase 7: QA

**Agent:** Visual QA
**Parallelizable:** No — depends on Phase 6

### Input
- Working template at `/experimental/{template-name}`
- All planning documents for comparison

### Work
1. Build verification (TypeScript, Vite, route, console)
2. Code quality (CSS scoping, GSAP cleanup, reduced motion, responsive)
3. PNG animation testing (loading, smoothness, viewport, resume, reduced motion, readability, overflow, memory, count, mobile, cleanup)
4. Visual quality (compare against design bible, blueprints, storyboard)
5. Interaction testing (RSVP, links, scroll indicator)

### Output
- `planning/qa-report.md`

### Gate 7: Final Delivery
Present QA report to user along with the working template URL.
Proceed only with explicit approval.
Record in `planning/decision-log.md`.

---

## Phase 8: Polish

**Agent:** React Engineer (+ Visual QA for re-verification)
**Parallelizable:** No

### Work
- Fix all CRITICAL and MAJOR defects from QA report
- Address MINOR issues per user priority
- Re-run Visual QA on fixes
- Update QA report

### Gate 8: User Sign-off
Present the fixed template for final approval.
Template is complete when the user explicitly signs off.

---

## Parallelization Summary

| Phase | Can run in parallel | Dependency |
|-------|-------------------|------------|
| 1. Discovery | No | — |
| 2. Research | Cultural Researcher ∥ Reference Analyst | Gate 1 |
| 3. Creative Direction | No | Gate 2 |
| 4. Storyboard | No | Gate 3 |
| 5. Production | Asset Illustrator ∥ Motion Designer | Gate 4 |
| 6. Implementation | No | Gate 5 |
| 7. QA | No | Phase 6 internal validation |
| 8. Polish | No | Gate 7 |

## Rejection Handling

When a gate is rejected:

1. Record rejection + user feedback in decision log
2. Send work back to the responsible agent with the feedback
3. Agent revises the artifacts
4. All downstream artifacts that depended on the rejected work are invalidated
5. Re-present for approval

Invalidation cascade:
- Gate 2 rejected → Phases 3–8 must re-run
- Gate 3 rejected → Phases 4–8 must re-run
- Gate 4 rejected → Phases 5–8 must re-run
- Gate 5 rejected → Phases 6–8 must re-run
- Gate 7 rejected → Phase 8 fixes, re-QA

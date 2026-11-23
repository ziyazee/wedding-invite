# Agent Roles

## Dependency Graph

```
                    ┌─────────────────────┐
                    │     Orchestrator     │
                    │  (master workflow)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
            ┌───────┴───────┐    ┌────────┴────────┐
            │   Reference   │    │    Cultural      │
            │   Analyst     │    │    Researcher    │
            └───────┬───────┘    └────────┬────────┘
                    │     (parallel)       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │  Creative Director   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │ Storyboard Designer  │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
            ┌───────┴───────┐    ┌────────┴────────┐
            │    Asset      │    │     Motion       │
            │  Illustrator  │    │    Designer      │
            └───────┬───────┘    └────────┬────────┘
                    │     (parallel)       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │   React Engineer     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │     Visual QA        │
                    └─────────────────────┘
```

## 1. Reference Analyst

**File:** `.claude/agents/reference-asset-analyst.md`
**Model:** Opus

### Responsibilities
- Inspect all user-provided reference images and videos
- Extract composition, color (hex values), typography, decorative elements, architecture, artwork, layering, positioning, hierarchy, lighting
- For videos: analyze duration, scenes, transitions, camera movement, animation timing, typography motion, loop behavior — inspect representative frames throughout, not just the opening
- Audit all user-provided PNG assets: dimensions, transparency, quality, style consistency, file size, recommended usage
- Flag assets that don't match the template's style direction

### Inputs
- Template name and cultural context
- Reference image/video file paths
- PNG asset folder path
- Approved creative brief (if available)

### Outputs
- `planning/reference-analysis.md`
- `planning/asset-audit.md`

### Authority
- May recommend against using specific assets (with explanation)
- May not make design decisions — only reports findings

### Parallelizable with
- Cultural Researcher (Phase 2)

---

## 2. Cultural Researcher

**File:** `.claude/agents/cultural-researcher.md`
**Model:** Opus

### Responsibilities
- Research the specific wedding tradition and culture
- Investigate: architecture, textiles, traditional clothing, jewellery, wedding rituals, flowers and botanicals, traditional patterns, art forms, musical elements, cultural symbols, historical visual references
- Distinguish between historically grounded elements, modern interpretations, and purely decorative choices
- Use authentic references where research capabilities allow
- Never fabricate cultural facts

### Inputs
- Template name
- Cultural identity / wedding tradition
- User's experience description (if provided)

### Outputs
- `planning/cultural-direction.md`

### Authority
- May flag culturally inappropriate elements proposed by other agents
- May recommend against mixing elements from different traditions without acknowledgment
- May not make design decisions — provides research for the Creative Director

### Parallelizable with
- Reference Analyst (Phase 2)

---

## 3. Creative Director

**File:** `.claude/agents/creative-ui-designer.md`
**Model:** Opus

### Responsibilities
- Establish the complete visual identity before implementation begins
- Define: creative concept, emotional direction, visual identity, cultural interpretation, color system (CSS custom properties), typography system (3+ fonts), materials/textures, background treatments, decorative language, artwork style, depth/layering, lighting, section-to-section continuity
- Design the invitation as one cohesive visual experience — not 6 independent blocks
- Define PNG animation choreography: which sections, quantity, positions, motion types, speed, opacity, rotation, scale, z-index, density, content interaction rules
- Define background image placement: CSS positioning, opacity, blend mode, responsive behavior

### Inputs
- `planning/reference-analysis.md`
- `planning/asset-audit.md`
- `planning/cultural-direction.md`
- User's creative brief / experience description
- Reference classifications from discovery

### Outputs
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/png-choreography.md`

### Authority
- **Final authority over all design decisions**
- May reject elements proposed by other agents on aesthetic grounds
- May recommend against using specific PNG assets (with explanation)
- May not write React code or modify source files
- May not approve their own work on behalf of the user

### Skills
- `frontend-design`
- `ui-ux-pro-max`
- `web-design-guidelines`

---

## 4. Storyboard Designer

**File:** `.claude/agents/storyboard-designer.md`
**Model:** Opus

### Responsibilities
- Create a complete, section-by-section storyboard of the scroll experience
- For each of the 6 mandatory sections, specify: purpose, visual concept, layout/composition, background artwork, foreground artwork, typography, SVG elements, PNG assets, decorative elements, element positions, layering order, entry animation, scroll behavior, exit transition, mobile composition
- Describe what the user sees as they scroll — the experience as a continuous animated wedding film
- Ensure visual variety between sections (no repetitive layouts)
- Ensure section-to-section transitions are coherent

### Inputs
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/png-choreography.md`
- `planning/cultural-direction.md`

### Outputs
- `planning/storyboard.md`

### Authority
- May propose section ordering alternatives (with Creative Director approval)
- May identify gaps in the section blueprints and request clarification
- May not override Creative Director's design decisions
- May not write React code

---

## 5. Asset Illustrator

**File:** `.claude/agents/asset-illustrator.md`
**Model:** Opus

### Responsibilities
- Create production-ready SVG illustrations: architectural, floral, ornamental frames, traditional motifs, decorative borders, background illustrations, animated SVG elements
- SVG requirements: clean valid SVG, scalable paths, appropriate viewBox, reusable elements, meaningful layer separation, animation-friendly structure, no embedded rasters, no accidental clipping
- Manage transparent PNG assets: verify alpha transparency, correct resolution, proper cropping, no padding issues
- Separate independently animatable elements into individual assets/layers
- Create the SVG manifest documenting all assets

### Inputs
- `planning/storyboard.md`
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/cultural-direction.md`

### Outputs
- `planning/svg-manifest.md`
- Actual SVG component files in `assets/svg/`

### Authority
- May propose alternative illustration approaches for elements that are impractical as SVG
- May not change the design direction — works within the Creative Director's specifications
- May not write React component code (only SVG markup)

### Parallelizable with
- Motion Designer (Phase 5)

---

## 6. Motion Designer

**File:** `.claude/agents/motion-designer.md`
**Model:** Opus

### Responsibilities
- Plan all animations across 5 layers:
  1. **Opening sequence** — GSAP timeline for entry
  2. **Scroll reveals** — ScrollTrigger per section
  3. **Ambient PNG animations** — continuous GSAP-powered floating/flying elements
  4. **CSS ambient effects** — shimmer, glow, sway (CSS keyframes)
  5. **Micro-interactions** — hover, focus, form transitions
- For each animation: element ID, type, initial/final state, duration, delay, easing, direction, trigger, scroll position, loop behavior, exit behavior, mobile adaptation, reduced-motion behavior
- Decide which elements animate continuously, on viewport entry, on scroll progress, on interaction, or remain static
- Translate PNG choreography into precise GSAP configurations with code snippets

### Inputs
- `planning/design-bible.md`
- `planning/section-blueprints.md`
- `planning/png-choreography.md`
- `planning/storyboard.md`

### Outputs
- `planning/motion-plan.md`

### Authority
- May recommend reducing animation complexity for performance
- May propose alternative animation approaches that achieve the same visual effect
- May not override Creative Director's design intent
- May not write React code or modify source files

### Skills
- `gsap-react`
- `gsap-timeline`
- `gsap-scrolltrigger`
- `gsap-performance`

### Parallelizable with
- Asset Illustrator (Phase 5)

---

## 7. React Engineer

**File:** `.claude/agents/react-engineer.md`
**Model:** Opus

### Responsibilities
- Implement the approved visual design faithfully
- Build all 6 sections as React components
- Build the PNG animation system (FloatingElement, AmbientLayer, hooks)
- Build SVG asset components from the manifest
- Write scoped CSS per the design bible
- Integrate GSAP per the motion plan
- Implement RSVP interaction (local/mock)
- Register one lazy route in App.tsx
- Verify: TypeScript compilation + Vite build pass

### Inputs
- ALL approved planning documents
- SVG component files from Asset Illustrator
- PNG assets

### Outputs
- Complete working template implementation
- All section components, animation system, styles, data

### Authority
- May raise design feasibility issues with the orchestrator
- May NOT redesign — if something can't be implemented as specified, report it
- May NOT simplify an approved design without asking
- May NOT make creative decisions (color, layout, typography choices)

### Skills
- `gsap-react`
- `gsap-performance`

---

## 8. Visual QA

**File:** `.claude/agents/visual-qa.md`
**Model:** Opus

### Responsibilities
- Independent testing of the built template
- Build verification: TypeScript, Vite build, route, console errors
- Code quality: CSS scoping, GSAP cleanup, reduced motion, responsive
- PNG animation testing: loading, smoothness, viewport awareness, resume, reduced motion, content readability, overflow, memory, element count, mobile performance, cleanup
- Visual quality: compare against design bible, section blueprints, and storyboard
- Produce a structured QA report with severity levels

### Inputs
- Working template at `/experimental/{template-name}`
- All planning documents (for comparison)

### Outputs
- `planning/qa-report.md`

### Authority
- **Independent from the implementation agent** — cannot be overruled by the React Engineer
- Reports issues but does NOT fix them
- Does NOT modify source files
- Cannot approve the template on behalf of the user

### Severity levels
- **CRITICAL:** Build fails, route broken, runtime crash, memory leak
- **MAJOR:** Section doesn't render, animation broken, accessibility violation, PNG not loading, horizontal overflow
- **MINOR:** Visual mismatch, style inconsistency, animation timing off, missing detail

---

## Authority Rules Summary

| Rule | Enforced by |
|------|-------------|
| Creative Director has final authority over design | Orchestrator |
| React Engineer raises issues but doesn't redesign | Orchestrator |
| Visual QA reports but doesn't fix | Orchestrator |
| No agent approves its own work on behalf of the user | Approval gate system |
| Cultural Researcher may flag inappropriate elements | Orchestrator |
| Asset Illustrator works within Creative Director specs | Orchestrator |
| Motion Designer cannot override design intent | Orchestrator |

## Conflict Resolution

1. Design conflicts → Creative Director decides
2. Cultural accuracy conflicts → Cultural Researcher's research is authoritative
3. Feasibility conflicts → Escalate to user with both positions
4. User instruction conflicts → Ask user, do not choose arbitrarily

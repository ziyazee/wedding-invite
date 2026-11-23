# New Template Workflow

## Invocation

| Command | Mode | Use when |
|---------|------|----------|
| `/new-template` | Conversational | Starting from scratch — walks through discovery interactively |
| `/create-template <name> <culture>` | Direct | Creative brief and references already prepared |

Both commands produce the same output: a complete, isolated, premium wedding invitation template inside `src/experimental-template/{template-name}/`.

## Pipeline

```
Discovery → Cultural Research → Creative Direction → Storyboard → Asset Production → Motion Design → Implementation → QA
```

### Phase summary

| # | Phase | Agent | Inputs | Outputs | Gate |
|---|-------|-------|--------|---------|------|
| 1 | Discovery | Orchestrator | User conversation | Discovery summary, classified references | User approval |
| 2 | Research | Cultural Researcher + Reference Analyst (parallel) | Discovery summary, reference files | `cultural-direction.md`, `reference-analysis.md`, `asset-audit.md` | User approval of cultural direction |
| 3 | Creative Direction | Creative Director | Research outputs, creative brief | `design-bible.md`, `section-blueprints.md`, `png-choreography.md` | User approval |
| 4 | Storyboard | Storyboard Designer | Creative brief, section blueprints | `storyboard.md` | User approval |
| 5 | Production | Asset Illustrator + Motion Designer (parallel) | Storyboard, design bible | `svg-manifest.md`, SVG files, `motion-plan.md` | User approval |
| 6 | Implementation | React Engineer | All approved design artifacts | Working template at `/experimental/{name}` | Internal (TypeScript + build) |
| 7 | QA | Visual QA | Working template, all planning docs | `qa-report.md` | User approval |
| 8 | Polish | React Engineer | QA report | Fixed template | User sign-off |

## Interactive Discovery Flow

When invoked via `/new-template`, the orchestrator collects requirements through a conversational sequence. Questions are asked one step at a time — never all at once. Previously provided answers are preserved.

### Step 1 — Template Identity

Ask for:
- **Template name** — kebab-case identifier (e.g. `kerala-dawn`, `ruby-hour`)
- **Cultural identity** — the specific wedding tradition (e.g. Kerala Christian, Punjabi Sikh, South Indian Hindu, Muslim Nikah)
- **Experience description** (optional) — what the user envisions for the overall feel

Do not assume culture from the template name. "Mandap at Dusk" could be any Hindu tradition.

### Step 2 — Reference Material

Ask: *"Do you have any reference images or videos?"*

Supported inputs:
- Single or multiple images
- Single or multiple videos
- Mixed image and video references
- No references (proceed with cultural research only)

Collect actual file paths. Verify each path is accessible before proceeding. If a file cannot be read, report it and ask for correction.

### Step 3 — Reference Analysis

Delegate to the **Reference Analyst** agent. The analyst inspects all supplied material and produces:
- `planning/reference-analysis.md`
- `planning/asset-audit.md` (if PNG assets were provided)

For images: composition, colors (hex values), typography, decorative elements, architecture, artwork, layering, positioning, hierarchy, lighting.

For videos: duration, scenes, transitions, camera movement, animation timing, typography motion, loop behavior. Must inspect representative frames throughout — not just the opening.

### Step 4 — Reference Classification

Present the analysis to the user and ask how each reference should be used:

1. **First video / intro video** — used as the opening sequence
2. **Entry image** — opening background image
3. **Entry video** — opening background video
4. **Design reference only** — informs the visual direction, not reproduced
5. **Animation reference only** — informs motion design, not the visual style
6. **Asset reference only** — specific elements to recreate or use
7. **Inspiration for the complete template** — holistic influence on the entire design

Different references may have different roles. Record classifications in the decision log.

### Step 5 — Scroll Interaction

Ask whether the user wants a scroll-down indicator. If yes:
- Visual style (arrow, text prompt, animated element, cultural motif)
- Position (bottom of opening, fixed overlay, inline)
- Fixed or scrolling with content
- Animation behavior (bounce, fade, pulse)

Do not assume positioning. Bottom-of-opening is a default only when the user approves it.

## Mandatory Invitation Sections

Every template must include these 6 sections in this order. Do not remove, merge, rename, or reorder without explicit user approval.

### Section 1 — Welcome Message
- Welcome text with custom typography
- Bride and groom names (the most prominent text)
- Decorative illustrations
- Animated entry sequence
- Section-specific visual composition

### Section 2 — Family Details
- Groom's family (names, descriptions)
- Bride's family (names, descriptions)
- Optional portraits or family illustrations
- Distinct layout from Section 1

### Section 3 — Countdown
- Wedding date and time display
- Live countdown timer with animated numerical transitions
- Custom visual composition
- Responsive behavior for different digit counts

### Section 4 — Celebrations
- **Dynamic** — supports any number of events (do not hardcode)
- Each event: name, date, time, venue, location, Google Maps link, calendar link
- Each event may have its own visual identity, illustrations, background, and animations
- Visual variation between events

### Section 5 — RSVP
- Guest response interaction
- Confirmation feedback with appropriate animation
- Custom visual design consistent with template identity
- Form validation

### Section 6 — Closing
- Closing message
- Final visual composition
- Closing animation
- Smooth transition from previous section

All 6 sections must appear in the storyboard and implementation.

## Resuming a Paused Workflow

If a workflow is interrupted:
1. Check `{template}/planning/decision-log.md` for the last completed gate
2. Read all existing planning docs to restore context
3. Resume from the next incomplete phase
4. Do not re-ask questions the user has already answered (check the decision log)

## Decision Log

Every template maintains `{template}/planning/decision-log.md` recording:
- Each discovery answer
- Each reference classification
- Each approval gate result (approved / rejected + reasoning)
- Each user correction or change request
- Timestamps for each entry

The decision log is the source of truth for what was agreed. If an agent's output conflicts with the decision log, the log wins.

## Requirement Traceability

The orchestrator maintains a traceability matrix in `{template}/planning/traceability.md` linking:
- Each user requirement → design specification → implementation location → QA result

This ensures nothing is silently dropped between phases.

## Directory Structure per Template

```
src/experimental-template/{template-name}/
  index.tsx
  sections/
    Opening.tsx
    Couple.tsx          (or FamilyDetails.tsx)
    Countdown.tsx
    Celebrations.tsx
    RSVP.tsx
    Closing.tsx
  assets/
    images/
      animated/         PNG elements for GSAP animation
      backgrounds/      Background images
      decorative/       Frames, borders, overlays
    svg/
      index.ts          Barrel export
  animations/
    FloatingElement.tsx
    AmbientLayer.tsx
    useAmbientAnimation.ts
    motionPaths.ts
  data/
    sample.ts
  styles/
    main.css
  types/
    index.ts
  planning/
    decision-log.md
    traceability.md
    reference-analysis.md
    asset-audit.md
    cultural-direction.md
    design-bible.md
    section-blueprints.md
    png-choreography.md
    storyboard.md
    svg-manifest.md
    motion-plan.md
    qa-report.md
```

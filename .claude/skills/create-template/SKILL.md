# Create Wedding Template — Reusable Workflow

Build a premium culturally-themed digital wedding invitation from an approved creative brief, reference analysis, and user-provided PNG assets.

## How to invoke

```
/create-template <template-name> <culture>
```

Example: `/create-template kerala-dawn Kerala`

## Isolation Rule — EXPERIMENTAL ONLY

**Everything lives inside `src/experimental-template/{template-name}/`.** This includes all assets (PNGs, SVGs), all components, all styles, all animation code, all planning docs, and all data. The ONLY file touched outside this directory is `App.tsx` (one lazy route registration). Do not create files in `public/templates/`, `src/pages/`, `src/invitations/`, or anywhere else. User-provided PNG assets are copied INTO the template's `assets/images/` directory, not referenced from external paths.

The caller (NEW_TEMPLATE_BRIEF.md) provides:
- Approved creative brief (culture, palette, typography, animation strategy, preferences, exclusions)
- Reference analysis findings
- Path to user-provided PNG assets folder
- Master asset manifest (what each PNG is, how it should be used)

## What's reusable (same for every template)

| Layer | Reused from | Notes |
|-------|-------------|-------|
| Module structure | This skill | 6+ sections, scoped styles, isolated route |
| Agent team | `.claude/agents/` | 5 generic agents, all Opus |
| GSAP setup | Pattern | `useGSAP` + `matchMedia` + `ScrollTrigger`, same lifecycle |
| RSVP form | Pattern | Validation, stepper, thank-you state — reskin per template |
| Countdown | Pattern | Live timer with formatted date — reskin per template |
| Types | `types/index.ts` | CoupleInfo, CelebrationEvent, RSVPEntry, GalleryImage, WeddingData |
| Route registration | App.tsx | `lazy(() => import('./experimental-template/{name}'))` |
| Planning doc structure | This skill | Same 7 docs, same headings |

## What's template-specific (rebuilt for each)

| Layer | Where | Notes |
|-------|-------|-------|
| Design tokens | `styles/main.css` `:root` | Colors, fonts, spacing unique per culture |
| PNG assets | `assets/` | User-provided animated elements + backgrounds |
| SVG assets | `assets/svg/` | Cultural motifs built in code — ornaments, dividers, patterns |
| CSS | `styles/main.css` | Layout, backgrounds, textures, animations |
| Section layouts | `sections/*.tsx` | Structure varies per design |
| Sample data | `data/sample.ts` | Culturally appropriate names, events, venues |
| Opening interaction | `index.tsx` | GSAP timeline unique per design |
| PNG animation system | `animations/` | GSAP-powered motion for floating/flying PNG elements |
| Planning docs | `planning/` | Analysis and specs for this specific design |

## Workflow Phases

### Phase 1: Setup & Asset Integration

1. Create module directory: `src/experimental-template/{template-name}/`
2. Create full directory structure (see Module Structure below)
3. Copy user-provided PNG assets into `assets/images/`:
   - Animated elements (birds, petals, butterflies, etc.) → `assets/images/animated/`
   - Background images → `assets/images/backgrounds/`
   - Decorative frames/borders → `assets/images/decorative/`
4. Copy types from the reusable pattern
5. Create sample data with culturally appropriate content
6. Register lazy route in App.tsx immediately (so user can preview at `/experimental/{name}`)
7. Create a minimal index.tsx so the route renders

Verify all provided PNGs exist and are accessible before proceeding.

### Phase 2: Reference & Asset Analysis (Agent: reference-asset-analyst)

- Input: reference images/videos + creative brief + PNG asset folder
- Analyse: reference visual style + each provided PNG asset (dimensions, quality, transparency, style consistency)
- Flag any PNG assets that don't match the template's style direction
- Output: `planning/reference-analysis.md` + `planning/asset-audit.md`

### Phase 3: Creative Direction (Agent: creative-ui-designer)

- Input: reference analysis + asset audit + creative brief
- Output: `planning/design-bible.md` + `planning/section-blueprints.md` + `planning/png-choreography.md`
- The **PNG choreography** document specifies for each animated PNG element:
  - Which section(s) it appears in
  - Entry timing and position
  - Motion path (drift direction, speed, rotation, scale changes)
  - How many instances on screen simultaneously
  - Opacity behavior (fade in/out distances)
  - Layering (z-index relative to content)
  - Random variation range (so instances don't look identical)
- Skills: `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines`

### Phase 4: Motion Planning (Agent: motion-designer)

- Input: design bible + section blueprints + PNG choreography + creative brief
- Output: `planning/motion-plan.md`
- The motion plan now covers three animation layers:
  1. **Opening sequence** — GSAP timeline for entry animation
  2. **Scroll reveals** — ScrollTrigger for section content
  3. **Ambient PNG animations** — continuous floating/flying elements using GSAP
- For each ambient PNG animation, specify:
  - GSAP tween configuration (duration, ease, repeat, yoyo)
  - Motion path coordinates or simple property animations (x, y, rotation, scale, opacity)
  - Stagger timing between multiple instances
  - Viewport boundary behavior (reset to start position when off-screen)
  - Performance strategy (pause when not in viewport, limit concurrent instances)
- Skills: `gsap-react`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`
- **Run in parallel with Phase 5**

### Phase 5: SVG Asset Creation

- Catalog all SVG components needed from the design bible (ornaments, dividers, patterns, icons)
- Build these as React components — these are the elements Claude creates, not the user
- Output: `planning/svg-manifest.md` + actual SVG component files in `assets/svg/`
- **Run in parallel with Phase 4**

### Phase 6: Implementation (Agent: react-engineer)

- Build all sections per blueprints
- Integrate user-provided PNG assets per the asset audit
- Build the **PNG animation system**:
  - Create `animations/FloatingElement.tsx` — reusable component that wraps a PNG in GSAP motion
  - Create `animations/AmbientLayer.tsx` — manages multiple floating elements for a section
  - Each animated PNG uses absolute positioning within its section
  - GSAP handles all motion (no CSS animation loops for these)
  - `IntersectionObserver` or ScrollTrigger to pause animations off-screen
  - `prefers-reduced-motion` disables all ambient animations
- Build SVG asset components per manifest
- Write scoped CSS per design bible
- Integrate GSAP per motion plan
- Skills: `gsap-react`, `gsap-performance`
- Verify: `npx tsc --noEmit` and `npm run build` pass

### Phase 7: QA (Agent: visual-qa)

- Test running app at the route
- Specific checks for PNG animations:
  - All PNGs load correctly (no broken images)
  - Animations are smooth (no jank from too many concurrent GSAP tweens)
  - Animations pause when section is off-screen
  - Reduced motion disables ambient animations
  - PNG elements don't obscure readable content
  - PNG elements don't trigger horizontal scrollbar
  - Memory usage is reasonable (no infinite PNG spawning)
- Output: `planning/qa-report.md`
- Fix critical/major defects found by QA

## Module Structure

```
src/experimental-template/{template-name}/
  index.tsx                    — Main page, GSAP setup, section composition
  sections/
    Opening.tsx
    Couple.tsx
    Countdown.tsx
    Celebrations.tsx
    RSVP.tsx
    Closing.tsx
    [Dua.tsx]                  — Optional, if user requested
    [Gallery.tsx]              — Optional, if user requested
  assets/
    images/
      animated/                — User-provided PNGs for animation (birds, petals, etc.)
      backgrounds/             — User-provided background images
      decorative/              — User-provided frames, borders, overlays
    svg/                       — Claude-built SVG components
      index.ts                 — Barrel export
  animations/
    FloatingElement.tsx        — Reusable: wraps one PNG in GSAP motion
    AmbientLayer.tsx           — Reusable: manages multiple floating elements in a section
    useAmbientAnimation.ts     — Hook: GSAP tween config + viewport awareness
    motionPaths.ts             — Predefined motion path configurations
  data/
    sample.ts                  — Culturally appropriate sample data
  styles/
    main.css                   — All scoped styles + design tokens
  types/
    index.ts                   — TypeScript interfaces
  planning/                    — Design and QA docs
    reference-analysis.md
    asset-audit.md
    design-bible.md
    section-blueprints.md
    png-choreography.md
    svg-manifest.md
    motion-plan.md
    qa-report.md
```

## PNG Animation Architecture

### FloatingElement Component

Wraps a single PNG image with GSAP-powered motion:

```tsx
interface FloatingElementProps {
  src: string;              // PNG path
  alt: string;
  className?: string;
  startX: number;           // Initial X position (% of container)
  startY: number;           // Initial Y position (% of container)
  motionConfig: MotionConfig;
  delay?: number;           // Stagger delay
  style?: React.CSSProperties;
}

interface MotionConfig {
  type: 'drift' | 'float' | 'fly' | 'fall' | 'sway';
  duration: number;         // seconds
  xRange: [number, number]; // min/max X drift in px
  yRange: [number, number]; // min/max Y drift in px
  rotation?: [number, number];
  scale?: [number, number];
  opacity?: [number, number];
  ease: string;
  repeat: number;           // -1 for infinite
  yoyo: boolean;
}
```

### AmbientLayer Component

Places multiple FloatingElements in a section:

```tsx
interface AmbientLayerProps {
  elements: Array<{
    src: string;
    count: number;           // How many instances
    motionConfig: MotionConfig;
    sizeRange: [number, number]; // min/max width in px
    zIndex: number;
  }>;
  sectionRef: React.RefObject<HTMLElement>;
  className?: string;
}
```

### Performance Rules for PNG Animations

- Maximum 15 animated PNG elements visible simultaneously per section
- Use `will-change: transform` on animated elements
- Pause all GSAP tweens when element is not in viewport (IntersectionObserver)
- Use `gsap.set()` for initial positioning, `gsap.to()` for motion
- Randomize start positions and delays so instances don't move in sync
- PNG images should be optimized (WebP with fallback, max 200KB each for animated elements)
- Use `loading="lazy"` for PNG elements not in the viewport
- Absolutely positioned within section container — never affect document flow

## Opening Rules

- If user provides a video: use `<video>` with `canplay` retry, `muted`, `playsInline`, `preload="auto"`. Do NOT add heavy decorations over the video.
- If user wants static image: use `<img>` with animated text reveal over it.
- If user wants pure animation: build SVG/CSS/PNG layered opening sequence.
- If user wants parallax opening: build layered depth opening with PNG elements at different scroll speeds.
- The overlay on video should be subtle (30–50% opacity gradient), not a heavy blanket.

## Isolation Rules

1. **Everything inside `src/experimental-template/{template-name}/`** — assets, components, styles, animations, data, planning docs
2. One route in App.tsx, lazy-loaded with bare `lazy()` (not `lazySitePage`) — the ONLY external touch
3. No files in `public/templates/`, `src/pages/`, `src/invitations/`, or any other directory
4. User-provided PNGs copied INTO `assets/images/`, not referenced from external paths
5. No production template component reuse
6. No invitation rendering engine dependency
7. No production database connections
8. All CSS scoped with template prefix (e.g. `kd-`, `rh-`, `md-`)
9. Removable by deleting the folder + one route line — nothing else breaks

## Agent Definitions

Located at `.claude/agents/` — all generic, parameterized by template name:
- `reference-asset-analyst.md` — reference + provided PNG asset analysis
- `creative-ui-designer.md` — design bible, blueprints, PNG choreography
- `motion-designer.md` — GSAP motion plan including PNG animation configs
- `react-engineer.md` — full implementation with animated PNG system
- `visual-qa.md` — testing including PNG animation performance

## Design Quality Bar — ULTRA PREMIUM

Every template must look and feel like a luxury brand experience. Non-negotiable.

### Typography
- Minimum 3-font system: display (names), heading (sections), body (details)
- Arabic/script fonts must be authentic (e.g. Amiri, Noto Nastaliq), never generic sans-serif
- Letter-spacing, line-height, and font-weight deliberately chosen per element
- Names must be the largest, most beautiful text on the page

### Color & Light
- Rich, deep backgrounds — never flat or washed out
- Gold/metallic accents must feel warm and real, not cheap yellow
- Subtle gradients and glows to create depth and atmosphere
- Opacity layering for visual richness (lattice patterns at 3–5%, textures, light bleeds)

### Layout & Spacing
- Generous whitespace — never cramped, never cluttered
- Strong vertical rhythm with intentional section padding (80–120px between sections)
- Each section must have a distinct layout — no repetitive card-after-card patterns
- Content centered and narrow (max 400–450px) for elegant reading flow

### Decorative Elements
- Culturally authentic motifs, not generic clip art
- SVG ornaments must be detailed and refined (multi-path, varied opacity, fine strokes)
- Ornamental dividers between sections with variation
- Background treatments: jali patterns, subtle textures, gradient overlays — never bare flat color
- **PNG animated elements** add life and atmosphere — birds, petals, butterflies bring the scene alive

### Animation & Motion
- Smooth, unhurried reveals — nothing snappy or jarring
- Opening sequence must feel cinematic
- Scroll reveals should feel like the invitation is unfolding
- Ambient PNG animations should feel natural — gentle, organic, not mechanical
- Easing curves: power2.out or custom beziers, never linear
- Floating elements should have slight randomness — nature isn't uniform

### What Premium Does NOT Mean
- Not excessive — restraint is luxury
- Not busy — every element earns its place
- Not flashy — no neon, no heavy drop shadows, no glassmorphism
- Not generic — must feel handcrafted for this specific culture and couple
- Not overloaded with animated PNGs — 2–3 types per template max, used tastefully

## Key Project Rules (pass to ALL agents)

- NO fade-up/translateY animations (breaks drag in edit mode)
- Video must use `canplay` event to retry `play()`
- `prefers-reduced-motion: reduce` must disable all motion including PNG animations
- No continuous animation-frame loops for static content — use GSAP tweens with repeat
- All CSS classes prefixed, all custom properties prefixed
- `isolation: isolate` on root element
- PNG animated elements must pause off-screen (IntersectionObserver)
- Maximum 15 concurrent animated PNG elements per section
- All user-provided PNGs must be verified to exist before implementation begins

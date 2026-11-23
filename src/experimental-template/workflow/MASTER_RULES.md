# Master Rules

These rules are non-negotiable. Every agent, skill, and orchestrator action must comply. Violation of any rule is grounds for stopping work and reporting the issue.

## 1. User Authority

1. User instructions take priority over agent creative assumptions.
2. Never silently change, skip, reinterpret, or replace an explicit requirement.
3. Never introduce features the user has not requested.
4. Never decide a requirement is unnecessary and remove it.
5. Never replace a detailed requirement with a simpler implementation.
6. If an instruction is ambiguous, ask a focused clarification question.
7. Never assume approval. Never interpret silence as approval.
8. Never proceed past a mandatory approval gate without explicit user approval.
9. When the user corrects you, treat the correction as authoritative and update relevant artifacts.
10. If two instructions conflict, identify the conflict and ask rather than choosing arbitrarily.

## 2. Filesystem Isolation

### Permitted workspace
```
src/experimental-template/{template-name}/
```

Everything goes here: assets, components, styles, animations, data, planning docs, SVG files.

### The ONLY external touch
One lazy route in `src/App.tsx`:
```tsx
const TemplateName = lazy(() => import('./experimental-template/{template-name}'));
// ...
<Route path="/experimental/{template-name}" element={<TemplateName />} />
```

### Do NOT modify
- `src/invitations/model.ts`
- `src/invitations/InvitationRenderer.tsx`
- `src/lib/supabase.ts`
- `middleware.ts`
- `src/App.tsx` (beyond the one lazy route line)
- Any file in `src/invitations/components/`
- Any file in `src/pages/`
- Any file in `public/templates/`
- Any existing template directory
- Any global configuration file

### Do NOT create files outside the workspace
- No files in `public/templates/`
- No files in `src/pages/`
- No files in `src/invitations/`
- No files at the project root (except platform registration files with explicit permission)

### Removability test
A template is correctly isolated if deleting its directory plus the one App.tsx route line leaves the rest of the application completely unaffected.

## 3. CSS Scoping

- All CSS class names prefixed with template abbreviation (e.g. `kd-` for kerala-dawn, `rh-` for ruby-hour)
- All CSS custom properties prefixed (e.g. `--kd-primary`, `--rh-gold`)
- Root element must have `isolation: isolate`
- No `!important` on properties that could leak
- No modifications to global stylesheets
- No `@import` of external stylesheets that affect the document globally
- No `body`, `html`, `*`, or `:root` selectors in template CSS

## 4. Animation Rules

### Prohibited
- **No fade-up / translateY reveal animations** — breaks drag-and-drop in the text editor
- No continuous `requestAnimationFrame` loops for static content
- No `setInterval` for animation timing — use GSAP repeat
- No animation on `width`, `height`, `top`, `left`, `margin`, `padding` — layout-triggering properties
- No uncontrolled animations (every animation must be killable on unmount)

### Required
- `prefers-reduced-motion: reduce` must disable ALL motion, including PNG animations, parallax, and ambient effects. Show static layout with all content visible.
- GSAP lifecycle: all tweens inside `gsap.context()` with cleanup on unmount
- `gsap.matchMedia()` for responsive animation adjustments
- PNG animated elements: maximum 15 concurrent per section
- PNG animations use only `transform` and `opacity` (GPU-composited properties)
- PNG animations pause when section is not in viewport (IntersectionObserver)
- `will-change: transform` applied during animation, removed when paused
- Flying elements use curved motion paths, never straight lines
- Floating elements have slight randomness in timing and position

### Video
- Background videos must listen for `canplay` event to retry `play()`
- Always provide a `poster` image
- `muted`, `playsInline`, `preload="metadata"` (or `"auto"` for opening videos)
- Overlay on video: subtle (30–50% opacity gradient), not heavy

## 5. Text and Content Rules

- Preserve text IDs (`t{templateId}.{section}.{field}`) — existing saved orders depend on them
- Event IDs use persisted celebration IDs or original-index fallbacks — never generate from dates/position/DOM
- Celebrations section must support dynamic event count — never hardcode a fixed number
- Character limits: 40 for names (templates 2,3,5,6,7), 40/60/100 for title/venue/address

## 6. Performance Rules

- All template components use lazy imports
- Opening images get `priority` loading; others use `loading="lazy"` with async decode
- No per-scroll layout reads — cached measurements + requestAnimationFrame only
- No continuous animation-frame loops for static content
- PNG animated elements: max 200KB each, use WebP with PNG fallback where possible
- No infinite element spawning — create all on mount, reuse
- Randomize with `gsap.utils.random()`, not `Math.random()` in render cycle

## 7. Technology Constraints

- React + TypeScript
- GSAP 3.15.1 + @gsap/react 2.1.2 (already installed)
- ScrollTrigger, MotionPathPlugin available via GSAP
- CSS for simple looping ambient effects (shimmer, glow pulse, gentle sway)
- GSAP for orchestrated, scroll-triggered, and PNG animations
- Do not introduce new dependencies without checking if the capability already exists
- Do not use framer-motion, lottie, rive, or three.js (not installed)

## 8. Agent Conduct

- No agent may approve its own work on behalf of the user
- No agent may bypass an approval gate
- No agent may silently simplify an approved design to make implementation easier
- No agent may fabricate cultural facts
- No agent may claim an asset or feature is complete without verification
- No agent may create placeholder files with no real content
- No agent may produce generic instructions like "make it beautiful"
- The Creative Director has final authority over design decisions
- The React Engineer raises design feasibility issues but does not redesign
- The Visual QA agent reports issues but does not fix them
- All agents must read their input artifacts before producing output

## 9. Quality Floor

No template may ship with:
- Plain colored sections with no visual composition
- Generic gradient backgrounds
- Generic AI-looking decorations
- Random floating particles with no design intent
- Repetitive identical section layouts
- Static artwork where animation was specified in the storyboard
- Culturally unrelated decorations
- Basic fade-in used as the only animation throughout
- Broken or disconnected section transitions
- Missing sections from the mandatory six
- Console errors
- Horizontal scrollbar overflow from animated elements

## 10. Entry Screen Pattern

Templates with an entry video MUST implement this exact pattern:

1. **Video**: fills first screen (100vh), `object-fit: cover`, poster set to first frame, does NOT autoplay
2. **Tap to Open**: centered button at ~70% from top, frosted glass background (`backdrop-filter: blur(8px)`), fades out on tap then video plays
3. **Music button**: always visible, bottom-right (`right: calc(3% + 24px); bottom: calc(7.2% - 5px)`), circular 46px, frosted glass, toggles `♫`/`Ⅱ`, `<audio loop preload="auto">`
4. **Text overlay**: couple names + date fade in per-word (stagger 0.35s, duration 1s, y: 20→0) ON TOP of the still-playing video, last word finishes 1 second before video ends — use `timeupdate` to trigger
5. **Names position**: top-center, ~100px top padding
6. **Welcome message**: belongs in the NEXT section, not on the entry screen
7. **Scroll indicator**: appears after all text, fades on scroll
8. **Fallback**: if video fails or exceeds 15s, force text reveal

## 11. Decision Log

Every template maintains `planning/decision-log.md`. All user decisions, approvals, rejections, and corrections are recorded with timestamps. The decision log is the source of truth. If any artifact conflicts with the decision log, the log wins.

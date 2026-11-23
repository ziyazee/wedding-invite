# React Animation Engineering Skill

Implementation methodology for wedding invitation templates.

## Architecture

```
src/experimental-template/{name}/
  index.tsx              — Root component, GSAP context, ScrollTrigger setup
  sections/
    Opening.tsx          — Welcome/hero section
    Couple.tsx           — Family details
    Countdown.tsx        — Date countdown
    Celebrations.tsx     — Events (dynamic count)
    RSVP.tsx             — Response form
    Closing.tsx          — Farewell
  animations/
    FloatingElement.tsx  — Single PNG with GSAP motion
    AmbientLayer.tsx     — Multiple floating elements manager
    useAmbientAnimation.ts — GSAP tween lifecycle hook
    motionPaths.ts       — Predefined motion configurations
  assets/
    images/animated/     — Floating PNGs
    images/backgrounds/  — Background images
    images/decorative/   — Static decorative PNGs
    svg/                 — SVG React components
      index.ts           — Barrel export
  data/
    sample.ts            — Culturally appropriate mock data
  styles/
    main.css             — All styles, scoped with prefix
  types/
    index.ts             — TypeScript interfaces
```

## Root Component Pattern

```tsx
export default function TemplateName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    // Opening timeline
    // ScrollTrigger registrations
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="{prefix}-root" style={{ isolation: 'isolate' }}>
      <Opening />
      <Couple />
      <Countdown />
      <Celebrations events={data.celebrations} />
      <RSVP />
      <Closing />
    </div>
  );
}
```

## CSS Scoping Rules

- All classes: `.{prefix}-{element}` (e.g. `.kd-opening`, `.kd-title`)
- All custom properties: `--{prefix}-{property}` (e.g. `--kd-bg-primary`)
- Root element: `isolation: isolate`
- No bare element selectors
- No global class names

## Celebrations Section (Dynamic)

Must support any number of events:
```tsx
interface CelebrationEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
  calendarUrl?: string;
}

function Celebrations({ events }: { events: CelebrationEvent[] }) {
  return events.map((event, i) => (
    <CelebrationCard key={i} event={event} />
  ));
}
```

## Performance Rules

- Images: `loading="lazy"` except opening section
- Animated PNGs: `alt="" aria-hidden="true"` (decorative)
- GSAP: `gsap.context()` for all lifecycle management
- ScrollTrigger: `kill()` on unmount
- IntersectionObserver: pause animations off-screen
- No layout thrashing in scroll handlers
- Fonts: load template-specific fonts only, not the full site font set

## Route Registration (the ONE external file touch)

In App.tsx:
```tsx
const TemplateName = lazy(() => import('./experimental-template/{name}'));
// In routes:
<Route path="/experimental/{name}" element={<TemplateName />} />
```

## Build Verification

Before declaring implementation complete:
1. `npx tsc --noEmit` — no TypeScript errors
2. `npm run build` — Vite build succeeds
3. Route loads at `/experimental/{name}` — no runtime errors
4. All sections render with sample data
5. Scroll through entire page — no console errors

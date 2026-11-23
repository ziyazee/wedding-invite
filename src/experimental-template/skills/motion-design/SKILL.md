# Motion Design Skill

Methodology for planning animations in wedding invitation templates.

## Animation Layers

### Layer 1: Opening Sequence
GSAP timeline that plays on page load:
- Element entry order
- Stagger timing
- Easing per element
- Total duration (aim for 2-4 seconds)
- Must feel cinematic, not mechanical

### Layer 2: Scroll Reveals
ScrollTrigger configurations per section:
- Trigger element and start/end positions
- Animation type (fade, slide, scale, clip-path)
- Scrub vs triggered (scrub ties to scroll position, triggered plays once)
- Stagger for multi-element reveals
- Recommended: `start: "top 80%"` for comfortable reveal timing

### Layer 3: Ambient PNG Animations
GSAP tweens for floating/flying elements:
- Motion type: drift, float, fly, fall, sway
- Duration: 8-15s for slow, 4-8s for medium
- GSAP config: duration, x/y range, rotation, scale, opacity, ease, repeat, yoyo
- Spawn zone: percentage-based area within section
- Instance count and stagger timing
- Viewport pause behavior

### Layer 4: CSS Ambient Effects
Simple CSS keyframe loops:
- Glow pulses on decorative elements
- Gentle shimmer on metallic accents
- Subtle breathing on backgrounds
- These are too simple for GSAP — CSS keyframes are more efficient

### Layer 5: Micro-interactions
- Button hover/press states
- Form field focus styling
- RSVP stepper transitions
- Link hover effects

## GSAP Best Practices

- Always use `gsap.context()` for cleanup
- Always use `useGSAP` hook in React components
- Use `matchMedia` for responsive animation differences
- Use `gsap.utils.random()` for natural variation
- Only animate `transform` and `opacity` (GPU composited)
- Apply `will-change: transform` during animation, remove when done
- Pause tweens off-screen via IntersectionObserver
- `power2.out` for reveals, `sine.inOut` for continuous motion
- Never use `linear` easing for decorative animation

## Reduced Motion

When `prefers-reduced-motion: reduce`:
- Skip all GSAP animations
- Skip all CSS keyframe animations
- Show content in its final state immediately
- Render PNG elements statically (no motion)
- Keep scroll functionality (just no animation)

## Performance Budget

Per section:
- Max 20 concurrent GSAP tweens
- Max 15 animated PNG elements
- All ambient animations pause off-screen
- No layout-triggering properties in tweens
- No continuous rAF loops

## Output Format

`planning/motion-plan.md` with:
1. Opening timeline (step-by-step)
2. Scroll reveal config per section
3. PNG animation specs with GSAP code snippets
4. Motion path definitions
5. CSS keyframe definitions
6. Interaction animations
7. Reduced motion strategy
8. Performance budget verification

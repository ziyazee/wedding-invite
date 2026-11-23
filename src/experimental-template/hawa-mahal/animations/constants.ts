// ============================================================
// Hawa Mahal — Animation Constants
// ============================================================

// Easing Functions
export const HM_EASE = {
  /** Standard content reveal */
  reveal: 'power2.out',
  /** SVG stroke draw-on */
  strokeDraw: 'power2.out',
  /** Video fade-out (gentle) */
  videoFade: 'power1.out',
  /** Countdown digit swap out */
  digitOut: 'power1.out',
  /** Countdown digit swap in */
  digitIn: 'power1.in',
  /** Shimmer sweep */
  shimmer: 'power1.inOut',
  /** RSVP confirmation stagger */
  confirmFade: 'power2.out',
} as const;

// Durations (seconds)
export const HM_DURATION = {
  /** Instant — used internally for zero-duration sets */
  instant: 0,
  /** Very fast transitions (digit swap, focus state) */
  fast: 0.3,
  /** Standard content reveals */
  medium: 0.5,
  /** Slower reveals (names, hero content) */
  slow: 0.6,
  /** Longest single tween (video fade, arch draw) */
  long: 0.8,
  /** Video element fade-out */
  videoFade: 1.2,
  /** Content overlay fade-in */
  overlayFade: 0.8,
  /** Cornice shimmer sweep */
  shimmer: 1.5,
  /** RSVP form field fade-out */
  formFade: 0.4,
  /** RSVP confirmation fade-in */
  confirmReveal: 0.5,
} as const;

// Delays (seconds) — relative offsets in timeline positions
export const HM_DELAY = {
  /** No delay */
  none: 0,
  /** Tight stagger between related elements */
  tight: 0.05,
  /** Standard stagger between elements in a sequence */
  standard: 0.2,
  /** Comfortable gap between content groups */
  comfortable: 0.4,
} as const;

// ScrollTrigger Defaults
export const HM_SCROLL_DEFAULTS = {
  /** Standard section entry trigger */
  sectionEntry: {
    start: 'top 80%',
    end: 'top 20%',
    toggleActions: 'play none none none' as const,
    once: true,
  },
  /** Cornice shimmer trigger */
  corniceShimmer: {
    start: 'top 90%',
    once: true,
  },
} as const;

// matchMedia Breakpoints
export const HM_BREAKPOINTS = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  fullMotion: '(prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
} as const;

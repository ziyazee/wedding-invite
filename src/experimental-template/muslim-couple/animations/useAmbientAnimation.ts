import { useEffect, useRef, type RefObject } from 'react';

/**
 * IntersectionObserver-based hook to pause/resume ambient GSAP timelines
 * when a section enters/leaves the viewport.
 * Also manages will-change on animated elements.
 */
export function useAmbientPause(
  sectionRef: RefObject<HTMLElement | null>,
  getTimelines: () => gsap.core.Timeline[],
  getElements: () => (HTMLElement | null)[]
) {
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    timelinesRef.current = getTimelines();
    elementsRef.current = getElements();
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        timelinesRef.current.forEach((tl) => {
          if (isVisible) {
            tl.resume();
          } else {
            tl.pause();
          }
        });
        elementsRef.current.forEach((el) => {
          if (el) {
            el.style.willChange = isVisible ? 'transform' : 'auto';
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [sectionRef]);
}

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

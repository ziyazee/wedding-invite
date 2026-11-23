/**
 * Ivory Nikah — Main Page Component
 *
 * Premium Muslim (Nikah) wedding invitation with Mughal architectural
 * elegance. Composes 7 sections with gold SVG dividers, GSAP scroll
 * reveals (opacity-only — no translateY), and floating petal animations.
 *
 * Sections: Opening | Couple | Dua | Celebrations | Countdown | RSVP | Closing
 * Divider pattern between sections: A – B – B – C – C – A
 */
import { useRef, useEffect, useState } from 'react';
import { sampleData } from './data/sample';
import type { WeddingData } from './types';

/* ── Sections ──────────────────────────────────────────────── */
import { Opening } from './sections/Opening';
import { Couple } from './sections/Couple';
import { Dua } from './sections/Dua';
import { Celebrations } from './sections/Celebrations';
import { Countdown } from './sections/Countdown';
import { Rsvp } from './sections/Rsvp';
import { Closing } from './sections/Closing';

/* ── SVG Dividers ──────────────────────────────────────────── */
import { GoldDividerA, GoldDividerB, GoldDividerC } from './assets/svg';

/* ── Styles ────────────────────────────────────────────────── */
import './styles/main.css';

/* ── Google Fonts ──────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Amiri&family=Cormorant+Garamond:wght@400;600&family=Lato:wght@300;400&family=Playfair+Display:wght@700&display=swap';

/* ── Scroll reveal constants (motion plan section 2.1) ───── */
const REVEAL_DURATION = 0.8;
const REVEAL_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const REVEAL_STAGGER = 0.12;

/**
 * Section CSS class suffixes, in page order (Opening excluded — it
 * has its own door timeline). Used to create ScrollTriggers top-to-bottom
 * so refreshPriority ordering is implicit.
 */
const REVEAL_SECTIONS = [
  'couple',
  'dua',
  'celebrations',
  'countdown',
  'rsvp',
  'closing',
] as const;

/* ────────────────────────────────────────────────────────── */

export default function IvoryNikah() {
  const data: WeddingData = sampleData;
  const rootRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  /* ── Load Google Fonts ─────────────────────────────────── */
  useEffect(() => {
    const existing = document.querySelector(`link[href="${FONT_LINK}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  /* ── Listen for reduced-motion changes ────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── GSAP scroll reveals (opacity-only) ───────────────── */
  useEffect(() => {
    if (reducedMotion) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [gsapModule, stModule] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);

        if (cancelled) return;

        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
        const ScrollTrigger =
          stModule.ScrollTrigger || stModule.default || stModule;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const root = rootRef.current;
          if (!root) return;

          for (const suffix of REVEAL_SECTIONS) {
            const section = root.querySelector(`.in-section--${suffix}`);
            if (!section) continue;

            const content = section.querySelector('.in-section__content');
            if (content) {
              gsap.fromTo(
                content,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: REVEAL_DURATION,
                  ease: REVEAL_EASE,
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
                  },
                },
              );
            }

            const children = section.querySelectorAll('.in-reveal-child');
            if (children.length > 0) {
              gsap.fromTo(
                children,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: suffix === 'dua' ? 0.7 : 0.6,
                  ease: REVEAL_EASE,
                  stagger: suffix === 'dua' ? 0.15 : REVEAL_STAGGER,
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true,
                  },
                },
              );
            }
          }

          const dividers = root.querySelectorAll('.in-divider');
          dividers.forEach((div) => {
            gsap.fromTo(
              div,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.6,
                ease: REVEAL_EASE,
                scrollTrigger: {
                  trigger: div,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              },
            );
          });
        }, rootRef);
      } catch {
        /* GSAP failed to load — show all content immediately */
        if (!cancelled && rootRef.current) {
          rootRef.current
            .querySelectorAll('.in-section__content, .in-reveal-child, .in-divider')
            .forEach((el) => {
              (el as HTMLElement).style.opacity = '1';
            });
        }
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="in-page">
      {/* ── Section 1: Opening ──────────────────────────── */}
      <Opening data={data} reducedMotion={reducedMotion} />

      {/* ── Divider A: Opening → Couple ─────────────────── */}
      <div className="in-divider">
        <GoldDividerA style={{ maxWidth: 280, width: '100%' }} />
      </div>

      {/* ── Section 2: Couple & Family ──────────────────── */}
      <Couple data={data} reducedMotion={reducedMotion} />

      {/* ── Divider B: Couple → Dua ─────────────────────── */}
      <div className="in-divider">
        <GoldDividerB style={{ maxWidth: 200, width: '100%' }} />
      </div>

      {/* ── Section 3: Dua / Blessing ───────────────────── */}
      {data.dua && <Dua dua={data.dua} />}

      {/* ── Divider B: Dua → Celebrations ───────────────── */}
      <div className="in-divider">
        <GoldDividerB style={{ maxWidth: 200, width: '100%' }} />
      </div>

      {/* ── Section 4: Celebrations ─────────────────────── */}
      <Celebrations
        celebrations={data.celebrations}
        reducedMotion={reducedMotion}
      />

      {/* ── Divider C: Celebrations → Countdown ─────────── */}
      <div className="in-divider">
        <GoldDividerC style={{ maxWidth: 180, width: '100%' }} />
      </div>

      {/* ── Section 5: Countdown ────────────────────────── */}
      <Countdown
        targetDate={data.weddingDate}
        reducedMotion={reducedMotion}
      />

      {/* ── Divider C: Countdown → RSVP ─────────────────── */}
      <div className="in-divider">
        <GoldDividerC style={{ maxWidth: 180, width: '100%' }} />
      </div>

      {/* ── Section 6: RSVP ─────────────────────────────── */}
      <Rsvp reducedMotion={reducedMotion} />

      {/* ── Divider A: RSVP → Closing ───────────────────── */}
      <div className="in-divider">
        <GoldDividerA style={{ maxWidth: 280, width: '100%' }} />
      </div>

      {/* ── Section 7: Closing ──────────────────────────── */}
      <Closing data={data} reducedMotion={reducedMotion} />
    </div>
  );
}

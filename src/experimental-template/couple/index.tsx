import { useRef, useEffect, useState } from 'react';
import { sampleData } from './data/sample';
import type { WeddingData } from './types';

import { Opening } from './sections/Opening';
import { Welcome } from './sections/Welcome';
import { Couple } from './sections/Couple';
import { Celebrations } from './sections/Celebrations';
import { Countdown } from './sections/Countdown';
import { Rsvp } from './sections/Rsvp';
import { Closing } from './sections/Closing';

import { GoldDividerA, GoldDividerB } from './assets/svg';

import './styles/main.css';

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Great+Vibes&family=Lato:wght@300;400&family=Playfair+Display:wght@700&display=swap';

const REVEAL_DURATION = 0.8;
const REVEAL_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const REVEAL_STAGGER = 0.12;

const REVEAL_SECTIONS = [
  'welcome',
  'couple',
  'celebrations',
  'countdown',
  'rsvp',
  'closing',
] as const;

export default function CoupleTemplate() {
  const data: WeddingData = sampleData;
  const rootRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const existing = document.querySelector(`link[href="${FONT_LINK}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
            const section = root.querySelector(`.cp-section--${suffix}`);
            if (!section) continue;

            const content = section.querySelector('.cp-section__content');
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

            const children = section.querySelectorAll('.cp-reveal-child');
            if (children.length > 0) {
              gsap.fromTo(
                children,
                { opacity: 0, scale: 0.97 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.7,
                  ease: 'power2.out',
                  stagger: REVEAL_STAGGER,
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

          const dividers = root.querySelectorAll('.cp-divider');
          dividers.forEach((div) => {
            const svg = div.querySelector('svg');

            gsap.fromTo(
              div,
              { opacity: 0, scaleX: 0.3 },
              {
                opacity: 1,
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: div,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                  once: true,
                },
                onComplete: () => {
                  if (svg) {
                    (div as HTMLElement).classList.add('cp-divider--glowing');
                    gsap.delayedCall(1.5, () => {
                      (div as HTMLElement).classList.remove('cp-divider--glowing');
                    });
                  }
                },
              },
            );
          });

          const cardCorners = root.querySelectorAll('.cp-event-card__corner');
          if (cardCorners.length) {
            gsap.fromTo(
              cardCorners,
              { opacity: 0, scale: 0 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.4)',
                stagger: 0.05,
                scrollTrigger: {
                  trigger: root.querySelector('.cp-section--celebrations'),
                  start: 'top 70%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              },
            );
          }

          const countdownValues = root.querySelectorAll('.cp-countdown__value');
          if (countdownValues.length) {
            gsap.fromTo(
              countdownValues,
              { opacity: 0, scale: 0.5 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                stagger: 0.1,
                scrollTrigger: {
                  trigger: root.querySelector('.cp-section--countdown'),
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              },
            );
          }

          const glowRings = root.querySelectorAll('.cp-glow-ring');
          if (glowRings.length) {
            glowRings.forEach((ring) => {
              gsap.to(ring, {
                scale: 1.1 + Math.random() * 0.3,
                opacity: 0.15 + Math.random() * 0.1,
                duration: 6 + Math.random() * 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            });
          }
        }, rootRef);
      } catch {
        if (!cancelled && rootRef.current) {
          rootRef.current
            .querySelectorAll(
              '.cp-section__content, .cp-reveal-child, .cp-divider',
            )
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
    <div ref={rootRef} className="cp-page">
      <Opening data={data} reducedMotion={reducedMotion} />

      <Welcome data={data} reducedMotion={reducedMotion} />

      <div className="cp-divider">
        <GoldDividerA style={{ maxWidth: 280, width: '100%' }} className="cp-shimmer cp-shimmer--slow" />
      </div>

      <Couple data={data} reducedMotion={reducedMotion} />

      <div className="cp-divider">
        <GoldDividerB style={{ maxWidth: 200, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-1" />
      </div>

      <Celebrations
        celebrations={data.celebrations}
        reducedMotion={reducedMotion}
      />

      <div className="cp-divider">
        <GoldDividerB style={{ maxWidth: 200, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-2" />
      </div>

      <Countdown targetDate={data.weddingDate} reducedMotion={reducedMotion} />

      <div className="cp-divider">
        <GoldDividerA style={{ maxWidth: 280, width: '100%' }} className="cp-shimmer cp-shimmer--slow" />
      </div>

      <Rsvp reducedMotion={reducedMotion} />

      <div className="cp-divider">
        <GoldDividerB style={{ maxWidth: 200, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-1" />
      </div>

      <Closing data={data} reducedMotion={reducedMotion} />
    </div>
  );
}

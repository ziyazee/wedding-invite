import { useRef, useEffect, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
}

interface GoldSparklesProps {
  count?: number;
  reducedMotion: boolean;
  className?: string;
}

export function GoldSparkles({ count = 12, reducedMotion, className }: GoldSparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
        driftX: -15 + Math.random() * 30,
      });
    }
    return arr;
  }, [count]);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

        if (cancelled) return;

        ctx = gsap.context(() => {
          const dots = containerRef.current?.querySelectorAll('.cp-sparkle');
          if (!dots?.length) return;

          dots.forEach((dot: Element, i: number) => {
            const p = particles[i];
            if (!p) return;

            gsap.set(dot, { opacity: 0 });

            gsap.to(dot, {
              keyframes: [
                { opacity: 0, duration: 0 },
                { opacity: 0.6 + Math.random() * 0.4, duration: p.duration * 0.3 },
                { opacity: 0, duration: p.duration * 0.7 },
              ],
              y: -(20 + Math.random() * 40),
              x: p.driftX,
              scale: 0.3 + Math.random() * 0.7,
              ease: 'none',
              duration: p.duration,
              delay: p.delay,
              repeat: -1,
            });
          });
        }, containerRef);
      } catch {
        /* gsap unavailable */
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reducedMotion, particles]);

  if (reducedMotion) return null;

  return (
    <div ref={containerRef} className={`cp-sparkles ${className || ''}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="cp-sparkle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

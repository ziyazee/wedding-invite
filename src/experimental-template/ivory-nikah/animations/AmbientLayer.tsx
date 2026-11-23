/**
 * Ivory Nikah — AmbientLayer
 *
 * Manages multiple floating petal instances within a section.
 * Each petal gets a GSAP tween with MotionPath for organic movement.
 * Uses IntersectionObserver for viewport-based pause/play.
 * Respects prefers-reduced-motion by rendering nothing.
 */
import { useRef, useEffect, useMemo } from 'react';
import type { PetalInstance } from './petalData';
import { motionConfigs } from './motionPaths';

// Petal asset URLs — resolved at module scope via import.meta.url
const petalUrls: Record<number, string> = {
  1: new URL('../assets/images/animated/petal-1.png', import.meta.url).href,
  2: new URL('../assets/images/animated/petal-2.png', import.meta.url).href,
  3: new URL('../assets/images/animated/petal-3.png', import.meta.url).href,
  4: new URL('../assets/images/animated/petal-4.png', import.meta.url).href,
  5: new URL('../assets/images/animated/petal-5.png', import.meta.url).href,
};

interface AmbientLayerProps {
  /** Array of petal instance configurations */
  petals: PetalInstance[];
  /** Whether reduced motion is active */
  reducedMotion: boolean;
}

export function AmbientLayer({ petals, reducedMotion }: AmbientLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<Array<{ kill: () => void }>>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Precompute which assets are needed
  const assetSet = useMemo(() => {
    const set = new Set<number>();
    petals.forEach((p) => set.add(p.asset));
    return set;
  }, [petals]);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let cancelled = false;
    const tweens: Array<{ kill: () => void }> = [];

    const initAnimation = async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap;
        const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
        gsap.registerPlugin(MotionPathPlugin);

        if (cancelled || !containerRef.current) return;

        const container = containerRef.current;
        const petalElements = container.querySelectorAll<HTMLElement>('.in-petal');

        petalElements.forEach((el, i) => {
          const config = petals[i];
          if (!config) return;

          const motionConfig = motionConfigs[config.motionType];
          if (!motionConfig) return;

          // Use custom path if provided, otherwise use default
          const pathData = config.customPath || motionConfig.path;

          // Scale y-values based on approximate section height
          const sectionH = container.parentElement?.offsetHeight || 800;
          const scaledPath = pathData.map((p) => ({
            x: p.x,
            y: typeof p.y === 'number' && p.y > 1 ? p.y * (sectionH / 800) : p.y,
          }));

          // Main motion path tween
          const mainTween = gsap.to(el, {
            motionPath: {
              path: scaledPath,
              curviness: motionConfig.curviness,
              autoRotate: false,
            },
            rotation: config.rotation ?? motionConfig.rotation,
            duration: config.duration,
            ease: motionConfig.ease,
            repeat: -1,
            delay: config.delay,
            paused: true,
          });
          tweens.push(mainTween);

          // Opacity keyframe tween
          const holdDuration = config.duration - config.fadeIn - config.fadeOut;
          const opacityTl = gsap.timeline({
            repeat: -1,
            delay: config.delay,
            paused: true,
          });
          opacityTl
            .fromTo(el, { opacity: 0 }, { opacity: config.peakOpacity, duration: config.fadeIn, ease: 'power1.out' })
            .to(el, { opacity: config.peakOpacity, duration: Math.max(0, holdDuration) })
            .to(el, { opacity: 0, duration: config.fadeOut, ease: 'power1.in' });
          tweens.push(opacityTl);

          // Separate rotation tween for leaf-drift rocking
          if (motionConfig.rotationTween) {
            const rockTween = gsap.to(el, {
              ...motionConfig.rotationTween,
              delay: config.delay,
              paused: true,
            });
            tweens.push(rockTween);
          }
        });

        tweensRef.current = tweens;

        // IntersectionObserver for viewport-based play/pause
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              tweens.forEach((t) => {
                if ('play' in t && 'pause' in t) {
                  const tween = t as gsap.core.Animation;
                  if (entry.isIntersecting) {
                    tween.play();
                  } else {
                    tween.pause();
                  }
                }
              });
            });
          },
          { threshold: 0.1 }
        );

        const sectionEl = container.closest('.in-section') || container.parentElement;
        if (sectionEl) {
          observerRef.current.observe(sectionEl);
        }
      } catch {
        // GSAP not available — petals just don't animate
      }
    };

    initAnimation();

    return () => {
      cancelled = true;
      tweensRef.current.forEach((t) => {
        if ('kill' in t) t.kill();
      });
      tweensRef.current = [];
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [petals, reducedMotion]);

  // Don't render at all if reduced motion
  if (reducedMotion) return null;

  return (
    <div ref={containerRef} className="in-ambient-layer" aria-hidden="true">
      {petals.map((petal) => (
        <img
          key={petal.id}
          className="in-petal"
          src={petalUrls[petal.asset]}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: petal.top,
            left: petal.left,
            width: petal.width,
            height: 'auto',
            zIndex: 5,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

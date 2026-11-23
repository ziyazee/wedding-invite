import gsap from 'gsap';

/**
 * Petal color palette — randomized per instance via gsap.utils.random.
 */
export const PETAL_COLORS = ['#C87890', '#D4A0A8', '#E0A0B0', '#F0B0C0'];

/**
 * Creates a floating rose petal timeline with S-curve MotionPath drift.
 */
export function createPetalTimeline(
  petalEl: HTMLElement,
  sectionWidth: number,
  sectionHeight: number
): gsap.core.Timeline {
  const duration = gsap.utils.random(5, 9);
  const delay = gsap.utils.random(1, 4);
  const goRight = gsap.utils.random(0, 1) > 0.5;
  const hDrift = gsap.utils.random(80, 160);
  const vFall = gsap.utils.random(200, 400);
  const rotation = gsap.utils.random(-180, 180);
  const peakOpacity = gsap.utils.random(0.3, 0.6);
  const initialScale = gsap.utils.random(0.6, 1.0);

  const startX = goRight
    ? gsap.utils.random(0, sectionWidth * 0.3)
    : gsap.utils.random(sectionWidth * 0.7, sectionWidth);
  const startY = gsap.utils.random(-20, sectionHeight * 0.1);

  const endX = goRight ? startX + hDrift : startX - hDrift;
  const midX1 = goRight ? startX + hDrift * 0.3 : startX - hDrift * 0.3;
  const midX2 = goRight ? startX + hDrift * 0.7 : startX - hDrift * 0.7;
  const endY = startY + vFall;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: delay,
    delay: gsap.utils.random(0, 3),
  });

  gsap.set(petalEl, {
    x: startX,
    y: startY,
    scale: initialScale,
    opacity: 0,
  });

  // Motion path + rotation
  tl.to(
    petalEl,
    {
      motionPath: {
        path: [
          { x: startX, y: startY },
          { x: midX1, y: startY + vFall * 0.3 },
          { x: midX2, y: startY + vFall * 0.6 },
          { x: endX, y: endY },
        ],
        curviness: 1.5,
      },
      rotation: rotation,
      duration: duration,
      ease: 'none',
    },
    0
  );

  // Opacity: fade in 0-15%, hold, fade out 85-100%
  tl.to(
    petalEl,
    {
      opacity: peakOpacity,
      duration: duration * 0.15,
      ease: 'sine.in',
    },
    0
  );
  tl.to(
    petalEl,
    {
      opacity: 0,
      duration: duration * 0.15,
      ease: 'sine.out',
    },
    duration * 0.85
  );

  return tl;
}

/**
 * Creates a sparkle pulse timeline (appear -> hold -> fade -> dormant).
 */
export function createSparkleTimeline(
  sparkleEl: HTMLElement
): gsap.core.Timeline {
  const holdDuration = gsap.utils.random(0.6, 1.2);
  const dormantDuration = gsap.utils.random(2, 5);
  const initialDelay = gsap.utils.random(0, 5);

  gsap.set(sparkleEl, { opacity: 0, scale: 0.3 });

  const tl = gsap.timeline({
    repeat: -1,
    delay: initialDelay,
  });

  // Phase 1: Appear
  tl.to(sparkleEl, {
    opacity: 0.7,
    scale: 1.0,
    duration: 0.4,
    ease: 'power2.out',
  });

  // Phase 2: Hold
  tl.to(sparkleEl, {
    opacity: 0.7,
    scale: 1.0,
    duration: holdDuration,
  });

  // Phase 3: Fade
  tl.to(sparkleEl, {
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    ease: 'power2.in',
  });

  // Phase 4: Dormant
  tl.to(sparkleEl, {
    opacity: 0,
    duration: dormantDuration,
  });

  return tl;
}

/**
 * Creates a lantern glow breathing timeline.
 */
export function createLanternGlowTimeline(
  glowEl: HTMLElement
): gsap.core.Timeline {
  const initialDelay = gsap.utils.random(0, 1.5);

  gsap.set(glowEl, { opacity: 0.6, scale: 0.95 });

  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    delay: initialDelay,
  });

  tl.to(glowEl, {
    opacity: 1.0,
    scale: 1.05,
    duration: 1.5,
    ease: 'sine.inOut',
  });

  return tl;
}

/**
 * Creates a crescent moon glow timeline.
 */
export function createMoonGlowTimeline(
  glowEl: HTMLElement
): gsap.core.Timeline {
  gsap.set(glowEl, { opacity: 0.15 });

  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });

  tl.to(glowEl, {
    opacity: 0.35,
    duration: 2.5,
    ease: 'sine.inOut',
  });

  return tl;
}

/**
 * Creates a bird flight timeline across the viewport.
 */
export function createBirdTimeline(
  birdEl: HTMLElement,
  config: {
    fromLeft: boolean;
    startYPercent: number;
    endYPercent: number;
    sectionWidth: number;
    sectionHeight: number;
  }
): gsap.core.Timeline {
  const { fromLeft, startYPercent, endYPercent, sectionWidth, sectionHeight } =
    config;
  const traversalDuration = gsap.utils.random(12, 18);
  const pauseBetween = gsap.utils.random(5, 10);
  const birdSize = 20;

  const startX = fromLeft ? -birdSize : sectionWidth + birdSize;
  const endX = fromLeft ? sectionWidth + birdSize : -birdSize;
  const startY = sectionHeight * startYPercent;
  const endY = sectionHeight * endYPercent;
  const midY = Math.min(startY, endY) - gsap.utils.random(20, 60);

  gsap.set(birdEl, {
    scaleX: fromLeft ? 1 : -1,
    x: startX,
    y: startY,
    opacity: 0.2,
  });

  const master = gsap.timeline({
    repeat: -1,
    repeatDelay: pauseBetween,
  });

  // Flight arc
  master.to(
    birdEl,
    {
      motionPath: {
        path: [
          { x: startX, y: startY },
          { x: (startX + endX) / 2, y: midY },
          { x: endX, y: endY },
        ],
        curviness: 1.2,
      },
      duration: traversalDuration,
      ease: 'none',
    },
    0
  );

  // Wing flap (scaleY oscillation)
  const flapCount = Math.ceil(traversalDuration / 0.8);
  for (let i = 0; i < flapCount; i++) {
    master.to(
      birdEl,
      {
        scaleY: 0.85,
        duration: 0.4,
        ease: 'sine.inOut',
      },
      i * 0.8
    );
    master.to(
      birdEl,
      {
        scaleY: 1.0,
        duration: 0.4,
        ease: 'sine.inOut',
      },
      i * 0.8 + 0.4
    );
  }

  return master;
}

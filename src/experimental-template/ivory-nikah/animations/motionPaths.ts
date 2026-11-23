/**
 * Ivory Nikah — Motion Path Definitions
 *
 * 5 predefined motion configurations for floating petal animations.
 * Each path defines a GSAP MotionPath config with curviness and
 * associated rotation/timing parameters.
 */

export interface MotionConfig {
  /** GSAP motionPath path array (relative coordinates) */
  path: Array<{ x: number; y: number }>;
  /** Curviness factor for GSAP MotionPath */
  curviness: number;
  /** End rotation in degrees */
  rotation: number;
  /** Whether rotation should yoyo (rock back and forth) */
  rotationYoyo?: boolean;
  /** Separate rotation tween config for rocking motion */
  rotationTween?: {
    rotation: string;
    duration: number;
    ease: string;
    repeat: number;
    yoyo: boolean;
  };
  /** GSAP ease for the main path tween */
  ease: string;
}

/**
 * Spiral descent — double S-curve with lateral weave.
 * Used by petal-1 (elongated teardrop).
 */
export const spiralDescent: MotionConfig = {
  path: [
    { x: 0, y: 0 },
    { x: 25, y: 160 },
    { x: -25, y: 400 },
    { x: 5, y: 440 },
    { x: 20, y: 540 },
    { x: -20, y: 680 },
    { x: 10, y: 800 },
  ],
  curviness: 1.2,
  rotation: 180,
  ease: 'none',
};

/**
 * Gentle drift — single wide S-curve.
 * Used by petal-2 (broad, rounded).
 */
export const gentleDrift: MotionConfig = {
  path: [
    { x: 0, y: 0 },
    { x: -40, y: 280 },
    { x: 40, y: 520 },
    { x: -20, y: 800 },
  ],
  curviness: 1.5,
  rotation: -45,
  ease: 'none',
};

/**
 * Quick flutter — tight zigzag, rapid tumbling.
 * Used by petal-3 (narrow crescent/curved).
 */
export const quickFlutter: MotionConfig = {
  path: [
    { x: 0, y: 0 },
    { x: 18, y: 96 },
    { x: -18, y: 192 },
    { x: 18, y: 288 },
    { x: -18, y: 384 },
    { x: 0, y: 800 },
  ],
  curviness: 0.5,
  rotation: 270,
  ease: 'none',
};

/**
 * Weighted float — soft curve with gravity. Steady and unhurried.
 * Used by petal-4 (cupped teardrop).
 */
export const weightedFloat: MotionConfig = {
  path: [
    { x: 0, y: 0 },
    { x: 0, y: 120 },
    { x: -30, y: 240 },
    { x: -15, y: 360 },
    { x: 0, y: 560 },
    { x: 20, y: 800 },
  ],
  curviness: 1.3,
  rotation: -20,
  ease: 'sine.inOut',
};

/**
 * Leaf drift — widest S-curve arc with rocking rotation.
 * Used by petal-5 (broad heart-shaped).
 */
export const leafDrift: MotionConfig = {
  path: [
    { x: 0, y: 0 },
    { x: -55, y: 240 },
    { x: 55, y: 560 },
    { x: -20, y: 800 },
  ],
  curviness: 2.0,
  rotation: 15,
  rotationYoyo: true,
  rotationTween: {
    rotation: '+=30',
    duration: 3.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  },
  ease: 'none',
};

/** Map motion type string to config */
export const motionConfigs: Record<string, MotionConfig> = {
  'spiral-descent': spiralDescent,
  'gentle-drift': gentleDrift,
  'quick-flutter': quickFlutter,
  'weighted-float': weightedFloat,
  'leaf-drift': leafDrift,
};

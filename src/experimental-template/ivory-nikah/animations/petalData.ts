/**
 * Ivory Nikah — Petal Instance Data
 *
 * Complete specification for all 13 floating petal instances.
 * Each entry defines the petal asset, section, size, position,
 * motion type, duration, opacity, and delay.
 */

export interface PetalInstance {
  id: string;
  /** Which petal PNG (1-5) */
  asset: number;
  /** Motion type key from motionConfigs */
  motionType: string;
  /** Display width in px */
  width: number;
  /** Spawn position as CSS values */
  top: string;
  left: string;
  /** Animation duration in seconds */
  duration: number;
  /** Peak opacity (0-1) */
  peakOpacity: number;
  /** Opacity fade-in duration in seconds */
  fadeIn: number;
  /** Opacity fade-out duration in seconds */
  fadeOut: number;
  /** Delay before animation starts (seconds) */
  delay: number;
  /** Override rotation if different from motion config */
  rotation?: number;
  /** Custom motion path override */
  customPath?: Array<{ x: number; y: number }>;
}

/** Section 2: Couple — 3 petals */
export const couplePetals: PetalInstance[] = [
  {
    id: 'C-1',
    asset: 2,
    motionType: 'gentle-drift',
    width: 48,
    top: '8%',
    left: '78%',
    duration: 18,
    peakOpacity: 0.65,
    fadeIn: 2,
    fadeOut: 2,
    delay: 0,
    rotation: -45,
    customPath: [
      { x: 0, y: 0 },
      { x: -40, y: 280 },
      { x: 40, y: 520 },
      { x: -52, y: 800 },
    ],
  },
  {
    id: 'C-2',
    asset: 1,
    motionType: 'spiral-descent',
    width: 32,
    top: '15%',
    left: '12%',
    duration: 22,
    peakOpacity: 0.55,
    fadeIn: 3,
    fadeOut: 2,
    delay: 4,
    rotation: 180,
  },
  {
    id: 'C-3',
    asset: 5,
    motionType: 'leaf-drift',
    width: 40,
    top: '35%',
    left: '85%',
    duration: 26,
    peakOpacity: 0.5,
    fadeIn: 3,
    fadeOut: 3,
    delay: 8,
    rotation: 15,
    customPath: [
      { x: 0, y: 0 },
      { x: -55, y: 240 },
      { x: 55, y: 560 },
      { x: -52, y: 800 },
    ],
  },
];

/** Section 4: Celebrations — 4 petals */
export const celebrationsPetals: PetalInstance[] = [
  {
    id: 'E-1',
    asset: 3,
    motionType: 'quick-flutter',
    width: 28,
    top: '3%',
    left: '70%',
    duration: 12,
    peakOpacity: 0.6,
    fadeIn: 1.5,
    fadeOut: 1.5,
    delay: 0,
    rotation: 270,
    customPath: [
      { x: 0, y: 0 },
      { x: 18, y: 96 },
      { x: -18, y: 192 },
      { x: 18, y: 288 },
      { x: -18, y: 384 },
      { x: -60, y: 800 },
    ],
  },
  {
    id: 'E-2',
    asset: 4,
    motionType: 'weighted-float',
    width: 44,
    top: '20%',
    left: '15%',
    duration: 20,
    peakOpacity: 0.7,
    fadeIn: 2,
    fadeOut: 2,
    delay: 3,
    rotation: -20,
    customPath: [
      { x: 0, y: 0 },
      { x: 0, y: 120 },
      { x: -30, y: 240 },
      { x: -10, y: 440 },
      { x: 15, y: 600 },
      { x: 52, y: 800 },
    ],
  },
  {
    id: 'E-3',
    asset: 1,
    motionType: 'spiral-descent',
    width: 36,
    top: '40%',
    left: '82%',
    duration: 16,
    peakOpacity: 0.6,
    fadeIn: 2,
    fadeOut: 2,
    delay: 7,
    rotation: -120,
    customPath: [
      { x: 0, y: 0 },
      { x: 35, y: 120 },
      { x: -35, y: 320 },
      { x: 20, y: 520 },
      { x: -56, y: 800 },
    ],
  },
  {
    id: 'E-4',
    asset: 2,
    motionType: 'gentle-drift',
    width: 52,
    top: '65%',
    left: '8%',
    duration: 24,
    peakOpacity: 0.55,
    fadeIn: 3,
    fadeOut: 3,
    delay: 5,
    rotation: -30,
    customPath: [
      { x: 0, y: 0 },
      { x: 45, y: 280 },
      { x: 20, y: 520 },
      { x: 48, y: 800 },
    ],
  },
];

/** Section 5: Countdown — 2 petals */
export const countdownPetals: PetalInstance[] = [
  {
    id: 'D-1',
    asset: 4,
    motionType: 'weighted-float',
    width: 36,
    top: '10%',
    left: '88%',
    duration: 20,
    peakOpacity: 0.5,
    fadeIn: 2,
    fadeOut: 2,
    delay: 2,
    rotation: -15,
    customPath: [
      { x: 0, y: 0 },
      { x: 0, y: 120 },
      { x: -20, y: 280 },
      { x: 10, y: 480 },
      { x: -40, y: 800 },
    ],
  },
  {
    id: 'D-2',
    asset: 5,
    motionType: 'leaf-drift',
    width: 30,
    top: '25%',
    left: '5%',
    duration: 28,
    peakOpacity: 0.45,
    fadeIn: 3,
    fadeOut: 3,
    delay: 10,
    rotation: 10,
    customPath: [
      { x: 0, y: 0 },
      { x: 30, y: 240 },
      { x: -15, y: 520 },
      { x: 40, y: 800 },
    ],
  },
];

/** Section 6: RSVP — 2 petals */
export const rsvpPetals: PetalInstance[] = [
  {
    id: 'R-1',
    asset: 1,
    motionType: 'spiral-descent',
    width: 34,
    top: '5%',
    left: '90%',
    duration: 18,
    peakOpacity: 0.5,
    fadeIn: 2,
    fadeOut: 2,
    delay: 4,
    rotation: 150,
    customPath: [
      { x: 0, y: 0 },
      { x: 22, y: 144 },
      { x: -22, y: 360 },
      { x: 15, y: 560 },
      { x: -40, y: 800 },
    ],
  },
  {
    id: 'R-2',
    asset: 3,
    motionType: 'quick-flutter',
    width: 24,
    top: '30%',
    left: '4%',
    duration: 14,
    peakOpacity: 0.5,
    fadeIn: 1.5,
    fadeOut: 1.5,
    delay: 9,
    rotation: -200,
    customPath: [
      { x: 0, y: 0 },
      { x: 14, y: 120 },
      { x: -14, y: 240 },
      { x: 14, y: 360 },
      { x: 16, y: 800 },
    ],
  },
];

/** Section 7: Closing — 2 petals */
export const closingPetals: PetalInstance[] = [
  {
    id: 'G-1',
    asset: 4,
    motionType: 'weighted-float',
    width: 42,
    top: '5%',
    left: '75%',
    duration: 24,
    peakOpacity: 0.5,
    fadeIn: 3,
    fadeOut: 3,
    delay: 2,
    rotation: -25,
    customPath: [
      { x: 0, y: 0 },
      { x: 0, y: 96 },
      { x: -40, y: 280 },
      { x: -20, y: 480 },
      { x: -60, y: 800 },
    ],
  },
  {
    id: 'G-2',
    asset: 2,
    motionType: 'gentle-drift',
    width: 38,
    top: '20%',
    left: '18%',
    duration: 26,
    peakOpacity: 0.45,
    fadeIn: 3,
    fadeOut: 3,
    delay: 6,
    rotation: -35,
    customPath: [
      { x: 0, y: 0 },
      { x: 25, y: 240 },
      { x: -10, y: 480 },
      { x: 48, y: 800 },
    ],
  },
];

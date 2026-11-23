/* Golden — seeded randomness. Same seed, same layout, every render. */

export interface Rng {
  /** [0, 1) */
  next: () => number
  range: (min: number, max: number) => number
  pick: <T>(items: readonly T[]) => T
}

/** mulberry32 */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    pick: (items) => items[Math.floor(next() * items.length)],
  }
}

/** Mix a base seed with extra parts (section id, index) into a new seed. */
export function hashSeed(seed: number, ...parts: Array<string | number>): number {
  let h = (seed ^ 0x9e3779b9) >>> 0
  for (const part of parts) {
    const s = String(part)
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0
  }
  return h >>> 0
}

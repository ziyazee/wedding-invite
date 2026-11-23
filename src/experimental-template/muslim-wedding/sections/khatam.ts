/* Khatam (eight-pointed star): two overlaid squares. Shared by dividers and cards. */

export interface KhatamPaths {
  /** Square aligned to the axes. */
  upright: string
  /** The same square turned 45 degrees. */
  turned: string
  /** One outline of the eight-pointed star. */
  star: string
}

const f = (n: number) => Number(n.toFixed(2))

export function khatam(cx: number, cy: number, r: number): KhatamPaths {
  const a = r * Math.SQRT1_2 // half-side of the upright square
  const upright = `M${f(cx - a)} ${f(cy - a)} H${f(cx + a)} V${f(cy + a)} H${f(cx - a)} Z`
  const turned = `M${f(cx)} ${f(cy - r)} L${f(cx + r)} ${f(cy)} L${f(cx)} ${f(cy + r)} L${f(cx - r)} ${f(cy)} Z`
  // Star outline: alternate outer points (r) with inner notches (where the squares cross).
  const k = r * 0.7654 // notch radius: r * cos45 / cos22.5
  const pts: string[] = []
  for (let i = 0; i < 16; i += 1) {
    const ang = (-90 + i * 22.5) * (Math.PI / 180)
    const rad = i % 2 === 0 ? r : k
    pts.push(`${f(cx + Math.cos(ang) * rad)} ${f(cy + Math.sin(ang) * rad)}`)
  }
  const star = `M${pts.join(' L')} Z`
  return { upright, turned, star }
}

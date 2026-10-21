import type { BaseTextTransform } from './components/EditableText'

// Existing approved stationery placements. These remain template defaults,
// separate from the order's additional textOverrides offsets.
export const royalGraceBasePlacements: Record<string, BaseTextTransform> = {
  calendar: { x: 0.0136968085106383, y: 0.08959350585937499, scale: 1.2 },
  directions: { x: 0.012890625, y: 0.0963134765625, scale: 0.85 },
  address: { x: 0.0016206781914893619, y: 0.06765747070312499, scale: 1.4 },
  venue: { x: 0.011643949468085104, y: 0.06127319335937499, scale: 1 },
  time: { x: 0.007754321808510638, y: 0.051361083984375, scale: 1 },
  date: { x: 0.0071143617021276594, y: 0.039508056640625, scale: 1 },
  weekday: { x: 0.008061835106382979, y: 0.040655517578125, scale: 1.4 },
  title: { x: 0.00269281914893617, y: 0.046435546875000004, scale: 1 },
}

# Hawa Mahal — SVG Component Manifest

All SVG components live in `src/experimental-template/hawa-mahal/assets/svg/` and are exported from the barrel `index.ts`.

---

## Component Inventory

### 1. HmMehrabArch

**File:** `HmMehrabArch.tsx`
**Purpose:** Multi-cusped (polylobed) pointed arch frame — the primary framing element of Rajasthani palace architecture. Scalloped inner edge with cusps curving inward, meeting at a pointed apex.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `320` | SVG width in px |
| `height` | `number` | `180` | SVG height in px |
| `cuspCount` | `number` | `5` | Number of cusps per side |
| `strokeColor` | `string` | `var(--hm-gold)` | Stroke color (CSS value or hex) |
| `strokeWidth` | `number` | `1.5` | Stroke width in px |
| `strokeOpacity` | `number` | `1` | Stroke opacity (0-1) |
| `fillColor` | `string` | `'none'` | Optional fill color |
| `fillOpacity` | `number` | `0` | Fill opacity (0-1) |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Variants (by section):**

| Section | Width | Height | Cusps | Stroke | Opacity | Fill |
|---------|-------|--------|-------|--------|---------|------|
| Welcome (hero names) | 320 | 180 | 5 | `--hm-gold` 1.5px | 1.0 | `--hm-gold` at 3% |
| RSVP (form header) | 200 | 48 | 3 | `--hm-gold` 1.5px | 1.0 | none |
| Celebrations (card header) | 120 | 36 | 3 | `--hm-gold-deep` 1px | 1.0 | none |
| Closing (farewell frame) | 300 | 160 | 5 | `--hm-gold` 1.5px | 0.6 | `--hm-gold` at 2% |

**Color tokens used:** `--hm-gold`, `--hm-gold-deep`

---

### 2. HmLotusMedallion

**File:** `HmLotusMedallion.tsx`
**Purpose:** Stylized lotus flower viewed from above — concentric rings of pointed petals radiating from a center dot. Used as scroll indicator, section punctuation, and spacer.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `28` | Diameter in px |
| `strokeColor` | `string` | `var(--hm-gold)` | Petal stroke color |
| `strokeWidth` | `number` | `1` | Stroke width |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Petal structure:**
- Inner ring: 8 petals
- Middle ring: 12 petals (offset by half-petal for interleaving)
- Outer ring: 16 petals
- Center: filled dot

**Variants (by section):**

| Section | Size | Color |
|---------|------|-------|
| Welcome (top) | 28px | `--hm-gold` |
| Welcome (scroll indicator) | 32px | `--hm-gold` |
| Family (divider) | 24px | `--hm-gold-deep` |
| Countdown (top) | 28px | `--hm-gold-bright` |
| Celebrations (transition zone) | 24px | `--hm-gold` |
| RSVP (confirmation) | 24px | `--hm-gold-bright` |
| Closing (top) | 32px | `--hm-gold-bright` |

**Color tokens used:** `--hm-gold`, `--hm-gold-deep`, `--hm-gold-bright`

---

### 3. HmScallopedCornice

**File:** `HmScallopedCornice.tsx`
**Purpose:** Repeating semicircular scallop border strip — the decorative cornice ledge separating tiers of the Hawa Mahal. A straight line at top with hanging semicircular arcs and optional finial dots.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `402` | Total width |
| `height` | `number` | `18` | Strip height |
| `scallopWidth` | `number` | `24` | Individual scallop arc width |
| `strokeColor` | `string` | `var(--hm-gold)` | Stroke color |
| `strokeWidth` | `number` | `1` | Stroke width |
| `strokeOpacity` | `number` | `1` | Stroke opacity (0-1) |
| `showFinials` | `boolean` | `true` | Show finial dots at scallop peaks |
| `finialRadius` | `number` | `1.5` | Finial dot radius |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Variants (by section boundary):**

| Transition | Color | Opacity | Notes |
|------------|-------|---------|-------|
| Welcome -> Family | `--hm-gold` | 1.0 | Gold on dark |
| Family -> Countdown | `--hm-sandstone` | 0.5 | Sandstone on warm |
| Countdown -> Celebrations | `--hm-gold` | 1.0 | Gold on dark |
| Celebrations -> RSVP | `--hm-gold` | 1.0 | Gold on light |
| RSVP -> Closing | `--hm-gold` | 1.0 | Gold on dark |

**Color tokens used:** `--hm-gold`, `--hm-sandstone`

---

### 4. HmJaliPattern

**File:** `HmJaliPattern.tsx`
**Purpose:** Hexagonal honeycomb lattice overlay — the signature jali screen pattern of the Hawa Mahal. Renders as a full-coverage SVG with an inline `<pattern>` tile for seamless tiling.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strokeColor` | `string` | `var(--hm-gold)` | Hexagon stroke color |
| `strokeWidth` | `number` | `1` | Stroke width |
| `patternId` | `string` | `'hm-jali-hex'` | Unique pattern element ID |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Pattern geometry:**
- Tile: 40px wide x ~34.64px tall (proper hexagonal tessellation)
- Hexagons: pointy-top orientation, ~40px flat-to-flat width
- Two hexagons per tile for seamless tessellation

**Usage per section:**

| Section | Color | Opacity | Notes |
|---------|-------|---------|-------|
| Welcome | `--hm-gold` | 4% | Full section overlay, z-index 3 |
| Countdown (full) | `--hm-gold` | 4% | Full section overlay, z-index 1 |
| Countdown (timer band) | `--hm-teal` | 6% | Horizontal band behind timer, with horizontal CSS mask fade |
| RSVP | `--hm-gold` | 3% | Full section overlay, z-index 1 |
| Closing | `--hm-gold` | 4% | Full section overlay, z-index 1 |

**Important:** When multiple jali instances exist on one page, each must have a unique `patternId` prop to avoid SVG pattern ID collisions.

**Color tokens used:** `--hm-gold`, `--hm-teal`

---

### 5. HmCalendarIcon

**File:** `HmCalendarIcon.tsx`
**Purpose:** Simple calendar outline icon for event date display. Rectangle with two top pins, horizontal header divider, and a 2x3 grid of date dots.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `12` | Icon size (square) |
| `strokeColor` | `string` | `var(--hm-gold-deep)` | Stroke color |
| `strokeWidth` | `number` | `1.5` | Stroke width |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Usage:** Celebrations section only — inline with event date text.

**Color tokens used:** `--hm-gold-deep`

---

### 6. HmClockIcon

**File:** `HmClockIcon.tsx`
**Purpose:** Simple clock face icon for event time display. Circle with hour hand (~10 o'clock) and minute hand (12 o'clock), plus center dot.

**Props Interface:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `12` | Icon size (square) |
| `strokeColor` | `string` | `var(--hm-gold-deep)` | Stroke color |
| `strokeWidth` | `number` | `1.5` | Stroke width |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

**Usage:** Celebrations section only — inline with event time text.

**Color tokens used:** `--hm-gold-deep`

---

## Section-to-SVG Usage Map

| Section | HmMehrabArch | HmLotusMedallion | HmScallopedCornice | HmJaliPattern | HmCalendarIcon | HmClockIcon |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Welcome | 320x180 (hero) | 28px (top) + 32px (scroll) | bottom divider (gold) | 4% overlay | — | — |
| Family | — | 24px (divider) | bottom divider (sandstone 50%) | — | — | — |
| Countdown | — | 28px (top) | bottom divider (gold) | 4% overlay + 6% teal band | — | — |
| Celebrations | 120x36 (card headers) | 24px (transition zone) | bottom divider (gold) | — | per card | per card |
| RSVP | 200x48 (form frame) | 24px (confirmation) | bottom divider (gold) | 3% overlay | — | — |
| Closing | 300x160 (farewell) | 32px (top) | — (terminal) | 4% overlay | — | — |

---

## Color Token Reference

| Token | Hex | Used By |
|-------|-----|---------|
| `--hm-gold` | `#D4A055` | MehrabArch, LotusMedallion, ScallopedCornice, JaliPattern |
| `--hm-gold-bright` | `#E8B86D` | LotusMedallion (Countdown, RSVP confirm, Closing) |
| `--hm-gold-deep` | `#B8892E` | MehrabArch (Celebrations), LotusMedallion (Family), CalendarIcon, ClockIcon |
| `--hm-sandstone` | `#C4836A` | ScallopedCornice (Family section bottom) |
| `--hm-teal` | `#2A4540` | JaliPattern (Countdown timer band) |

---

## Estimated SVG Payload

All SVGs are inline React components generating paths at render time. No external `.svg` files are loaded.

| Component | Estimated DOM size | Notes |
|-----------|-------------------|-------|
| HmMehrabArch | ~500 bytes per instance | 1 `<path>` element |
| HmLotusMedallion | ~2KB per instance | 3 `<path>` elements + 1 `<circle>` |
| HmScallopedCornice | ~1KB per instance | 1 `<path>` + ~17 `<circle>` finials |
| HmJaliPattern | ~300 bytes per instance | 1 `<pattern>` with 2 `<path>` + 1 `<rect>` |
| HmCalendarIcon | ~400 bytes per instance | lines, rect, circles |
| HmClockIcon | ~300 bytes per instance | circle, 2 lines, 1 dot |

**Total across all sections:** ~8-10KB of inline SVG DOM. Well within the 5-8KB target.

---

## Barrel Export

```ts
// src/experimental-template/hawa-mahal/assets/svg/index.ts
export { default as HmMehrabArch } from './HmMehrabArch';
export { default as HmLotusMedallion } from './HmLotusMedallion';
export { default as HmScallopedCornice } from './HmScallopedCornice';
export { default as HmJaliPattern } from './HmJaliPattern';
export { default as HmCalendarIcon } from './HmCalendarIcon';
export { default as HmClockIcon } from './HmClockIcon';
```

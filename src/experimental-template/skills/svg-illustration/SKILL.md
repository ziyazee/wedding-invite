# SVG Illustration Skill

Methodology for creating production-ready SVG illustrations.

## SVG Quality Standards

### Structure
- Valid SVG with proper namespace
- Meaningful `viewBox` (match content bounds, no excess whitespace)
- Named groups (`<g id="...">`) for logical sections
- Reusable elements in `<defs>`
- No unnecessary nesting

### Paths
- Clean bezier curves (minimal control points for smooth shapes)
- No overlapping fill paths where a single path suffices
- Stroke widths appropriate for the viewBox scale
- No hairline strokes that disappear at small sizes

### Animation Readiness
- Elements that animate independently are separate `<g>` or `<path>` elements
- Transforms set on groups, not individual paths
- `transform-origin` set where rotation/scale center should be
- No inline transforms that would conflict with GSAP

### React Component Format
```tsx
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export function OrnamentName({ className, style, width = 200, height = 100 }: SvgProps) {
  return (
    <svg viewBox="0 0 200 100" width={width} height={height} className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      {/* SVG content */}
    </svg>
  );
}
```

### Color Strategy
- Use `currentColor` for elements that should inherit text color
- Use CSS custom properties for theme-aware colors: `var(--{prefix}-accent)`
- Hardcode only for complex multi-color illustrations where theming doesn't apply

## Common Wedding SVG Types

### Ornamental Frames
- Corner ornaments (4 rotated copies of one design)
- Full borders (top, sides, bottom with distinct treatments)
- Arch frames (for names or section headers)

### Dividers
- Horizontal separators between sections
- Should have variation (not the same divider everywhere)
- Center ornament + extending lines is a classic pattern

### Cultural Motifs
- Research-backed patterns specific to the tradition
- Appropriate level of detail
- Culturally accurate geometry

### Floral Compositions
- Arranged clusters (not random scatter)
- Leaf + flower + bud variety
- Consistent botanical style throughout

## Output
- `planning/svg-manifest.md` — catalog of all SVGs with purpose and placement
- `assets/svg/*.tsx` — React component files
- `assets/svg/index.ts` — barrel export

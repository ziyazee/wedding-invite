# Asset Generation & Management Skill

Methodology for managing and organizing visual assets.

## PNG Asset Categories

### Animated Elements (`assets/images/animated/`)
- Flying elements (birds, butterflies)
- Floating elements (petals, leaves, feathers)
- Falling elements (confetti, flowers)
- Swaying elements (branches, vines, fabric)
- Max recommended: 200KB per animated PNG
- Must have true alpha transparency

### Background Images (`assets/images/backgrounds/`)
- Full-section backgrounds
- Texture overlays
- Gradient maps
- Max recommended: 500KB per background
- Can be JPG/WebP if no transparency needed

### Decorative Elements (`assets/images/decorative/`)
- Frames and borders
- Corner ornaments
- Header/footer decorations
- Static overlays
- Must have true alpha transparency

## Asset Audit Checklist

For each PNG:
- [ ] File exists at specified path
- [ ] Correct dimensions for intended use
- [ ] True transparency (not simulated checkerboard)
- [ ] Clean edges (no jagged aliasing)
- [ ] Appropriate resolution (not blurry when displayed)
- [ ] File size within limits
- [ ] Style consistent with template direction
- [ ] No unwanted artifacts or backgrounds

## Organization Rules

- All assets live inside `src/experimental-template/{template-name}/assets/`
- Subdirectories: `images/animated/`, `images/backgrounds/`, `images/decorative/`, `svg/`
- SVGs are React components (`.tsx`), not raw `.svg` files
- Naming: kebab-case, descriptive (`golden-bird.png`, not `img1.png`)
- Barrel export for SVGs: `assets/svg/index.ts`

# Performance Guidelines

## Code Splitting

### Current Strategy
- All pages and templates use `lazy()` imports via `lazySitePage()`
- `InvitationRenderer` lazy-loads each template component
- `OrderTextEditor` lazy-loaded only in dashboard form
- `InvitationLayoutEditor` lazy-loaded for standalone named routes only

### Loading Boundaries
A cold public invitation route should request only:
- Its specific template renderer
- Template-specific CSS and fonts
- NOT the dashboard, other templates, or editor controls

Native templates (Royal Grace, Majestic) bypass `SiteFonts` and load their own fonts. Other templates still load the full Google Fonts set via `SiteFonts`.

### Entry Points
Two HTML entry points in `vite.config.ts`:
- `index.html` — main SPA
- `arjunbhavana.html` — dedicated entry with sharing metadata

## Image Optimization

### Current Approach
- `InvitationMedia` component: opening images get `priority`, others use lazy/async decode
- Large PNG artwork remains unoptimized (2–2.5 MiB each for Royal Grace)
- Design 13 has optimized responsive WebP assets in `assets/optimized/`
- vercel.json sets `Cache-Control: public, max-age=2592000` for images

### Known Large Assets
| Asset | Size | Template |
|-------|------|----------|
| celebration-roses.png | 2.0 MiB | Royal Grace |
| ivory-stationery-unframed.png | 2.3 MiB | Royal Grace |
| sage-stationery-unframed.png | 2.5 MiB | Royal Grace |
| scratch.png | 2.5 MiB | Royal Grace |

These are candidates for WebP/AVIF conversion, but appearance must be measured before replacing.

## Video Handling

- Opening videos: poster image has `priority`; video uses `preload="metadata"` (not `preload="auto"`)
- Decorative video: `pointer-events: none`
- Background media: paused on visibility change via `public/media-visibility.js`
- Celebration videos (`.mov`): muted, looping, intrinsic aspect ratio

## Caching Strategy (vercel.json)

| Content | Cache-Control |
|---------|--------------|
| `/assets/*` (Vite hashed) | `max-age=31536000, immutable` |
| `*.js, *.css` | `max-age=31536000, immutable` |
| `*.woff2, *.woff, *.ttf, *.otf` | `max-age=31536000, immutable` |
| `*.png, *.jpg, *.webp, *.svg` | `max-age=2592000` (30 days) |
| `*.mp4, *.mov, *.mp3` | `max-age=2592000` (30 days) |

## React Rendering

### Optimization Patterns
- `useMemo` on `InvitationData` in `InvitationRenderer` to prevent unnecessary re-renders
- `InvitationSection` uses ResizeObserver only when child needs position geometry
- No scroll listeners, DOM scans, or continuous animation-frame loops in layout components
- Parallax uses cached measurements + requestAnimationFrame

### Anti-patterns to Avoid
- Per-scroll layout reads competing with scroll transforms
- Continuous animation frame loops for static content
- Global style injections from template CSS
- Eagerly importing dashboard/editor code in guest routes

## Font Loading

### Strategy
- `SiteFonts`: Google Fonts multi-family stylesheet (reference-counted mount/unmount)
- Native templates: Own font files in template CSS
- `lazySitePage()` bundles SiteFonts with page components automatically
- A cold native template URL should not request the full site font set

## Supabase Optimization

### Current Queries
- `get_published_invitation`: Single RPC call, security definer (no RLS overhead)
- Admin dashboard: Parallel count queries for status breakdown
- Realtime: Single subscription for order updates

### Potential Improvements
- No client-side caching on `get_published_invitation` (intentional: needs invalidation strategy)
- Consider adding edge caching for published invitations after expiry/edit invalidation is designed

## Bundle Size

### Not Measured
Production chunks have not been inspected. Source-level import boundaries suggest good splitting, but actual bundle analysis requires an authorized build.

### Expected Boundaries
- Guest invitation: template component + shared invitation engine
- Dashboard: large monolith (ClientDashboard.tsx is ~2000+ lines)
- Admin: separate chunk from client dashboard

## Known Performance Bottlenecks

1. **Large unoptimized PNGs** in Royal Grace (up to 2.5 MiB each)
2. **ClientDashboard.tsx** is very large — potential split into sub-modules
3. **AnimatedInvitation** fetches and parses HTML at runtime for templates 6–7
4. **TextLayoutLayer** DOM scanning for iframe templates
5. **No production build analysis** has been performed
6. **No LCP/CLS/interaction latency measurements** exist

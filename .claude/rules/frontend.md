---
description: Rules for working with frontend React components and pages
globs: src/pages/**/*.tsx, src/pages/**/*.css, src/components/**/*.tsx
---

# Frontend Rules

- All page components are lazy-loaded in `src/App.tsx`. New pages need a `lazy()` import and `<Route>`.
- Use `lazySitePage()` from `SiteFonts.tsx` for pages that need the shared Google Fonts set.
- Native templates (Royal Grace, Majestic, Secret Garden) manage their own fonts — do NOT wrap them with SiteFonts.
- `ClientDashboard.tsx` is very large. Read only the relevant section; do not dump the entire file.
- Landing CSS (`Landing.css`) has successive responsive overrides. Always check the final applicable rules at a breakpoint before changing a value.
- Dashboard theme tokens are centralized in `ClientDashboard.css`. Preserve the sage/ivory/champagne palette.
- Preserve existing animations: opening interactions, parallax (cached + rAF), carousel looping.
- Do not introduce per-scroll layout reads that compete with scroll transforms.

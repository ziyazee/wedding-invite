---
description: Performance rules for the application
globs: src/**/*.tsx, src/**/*.ts, vite.config.ts
---

# Performance Rules

- All pages and template components use lazy imports. Do not eagerly import dashboard/editor code in guest routes.
- Native templates bypass SiteFonts and load their own fonts. A cold invitation URL should not request the full font set.
- `InvitationMedia`: opening images get `priority`; others use lazy loading with async decode.
- Videos use `preload="metadata"` (not auto). Poster images have `priority`.
- No continuous animation-frame loops for static content.
- No global style injections from template CSS.
- Parallax: cached measurements + requestAnimationFrame only. No per-scroll layout reads.
- Large assets (Royal Grace PNGs up to 2.5 MiB) are candidates for optimization but appearance must be verified first.

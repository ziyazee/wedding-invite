# Performance Optimization Report

**Date:** 2026-11-05
**Templates:** Royal Grace (1), Majestic (2), Mandap at Dusk (4), A Timeless Union (3), Artful Love Story (8)
**Playbooks applied:** `TEMPLATE_PERFORMANCE_PLAYBOOK.md` (3-phase), `UNUSED_ASSET_CLEANUP.md`

---

## The Issue

Both templates carried significant dead weight from their pre-React origins and iterative design process:

- **Legacy HTML/JS/CSS** from the pre-React migration still deployed but never loaded
- **Multiple unused design variants** (alternate illustrations, scratch overlays, monograms) left in the asset folder
- **Unoptimized media**: PNGs where WebP exists, MOV files replaced by MP4, audio at 256–321 kbps when 128 kbps is transparent on phone speakers
- **Silent audio tracks** embedded in muted decorative videos
- **Missing loading optimizations**: no retry-on-failure for video playback, no preload hints for below-fold assets

Every unused file ships to Vercel on every deploy and downloads to guests who never see it.

---

## The Plan

Apply the 3-phase performance playbook to each template:

| Phase | Goal | Actions |
|-------|------|---------|
| **Phase 1 — Asset Optimization** | Shrink files | PNG→WebP, strip muted video audio, compress MP3 to 128 kbps |
| **Phase 2 — Loading Strategy** | Faster interaction | No preload gates, video retry pattern, `<link rel="preload">` hints, lazy loading |
| **Phase 3 — Unused Cleanup** | Reduce deploy size | Move unreferenced files to `public/unused/{template}/` |

---

## What Was Done

### Royal Grace (template 1)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| opening.mp4 (strip audio) | 2.9 MB | 2.7 MB | 200 KB |
| music.mp3 (256→128 kbps) | 3.0 MB | 1.5 MB | 1.5 MB |
| Images | Already WebP | — | — |

#### Phase 2 — Loading Strategy
- **No preload gate** — confirmed: "Tap to open" button was already always clickable
- **Video retry pattern** — upgraded `openInvitation()`: if `video.play()` fails, waits for `canplaythrough` with a 5-second timeout before falling back to showing names. Previously failed immediately with no retry
- **Preload hints** — added `<link rel="preload">` for 6 below-fold assets: `couple.webp`, `sage-stationery-unframed.webp`, `ivory-stationery-unframed.webp`, `general.webp`, `end.webp`, `stationery-silhouette.svg`
- **Priority image** — opening poster already had `priority` prop (eager loading)
- **No decorative videos below fold** — nothing to gate
- **Music** — already independent via `PersonalMusic`
- **Fonts** — Google Fonts with `display=swap`, no SiteFonts

#### Phase 3 — Unused Cleanup
**28 files moved to `public/unused/royal-grace/`** (45 MB):
- 10 unused design variants (scratch PNGs, alternate stationery, alternate endings)
- 8 original files before WebP/compression (`*-original.*`)
- 4 legacy files (index.html, interactions.js, reference.css, asset-map.json)
- 2 Phase 1 backups (opening-with-audio.mp4, music-256kbps.mp3)
- 4 miscellaneous unused files

**Active assets remaining:** 9.6 MB (12 files)

---

### Majestic (template 2)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| ornate-badge-2PyCLI0e (PNG→WebP) | 1.0 MB | 48 KB | 952 KB (95%) |
| celebrations.mp4 (strip audio) | 344 KB | 339 KB | 5 KB |
| intro-music (321→128 kbps) | 2.7 MB | 1.1 MB | 1.6 MB |
| footer-flowers.png | 446 KB | — | Kept PNG (WebP was larger) |

#### Phase 2 — Loading Strategy
- **No preload gate** — confirmed: "Open Invitation" button is a simple `onClick={() => setOpened(true)}`, always clickable
- **No video retry needed** — Majestic uses `AmbientVideo` for background loops (not a hero sequence), which silently catches play failures and falls back to poster
- **Preload hints** — expanded existing preload list from 5 entries to 10, adding: `lights.webp`, `ornate-badge-2PyCLI0e.webp`, `food.webp`, `envelope-closed-new.webp`, `string-lights-DfoJYed-.webp`
- **Decorative video visibility gating** — `AmbientVideo` component already implements IntersectionObserver + visibilitychange + reduced-motion pattern
- **Music** — already independent via `PersonalMusic`
- **Fonts** — self-hosted with `font-display: swap` and `.woff2`, no SiteFonts

#### Phase 3 — Unused Cleanup
**40 files moved to `public/unused/majestic/`** (25 MB):
- 3 MOV files (originals before MP4 conversion)
- 2 unused MP4 variants
- 15 unused illustration PNGs (legacy design alternatives)
- 4 unused JPGs (venue photos, map, hero illustration)
- 2 unused WebP files
- 1 unknown upload (JPEG with UUID filename)
- 5 legacy files (index.html, interactions.js, reference.css, interactions.css, fonts.css)
- 2 Phase 1 backups (intro-music-321kbps.mp3, celebrations-with-audio.mp4)
- 6 other unused media files

**Active assets remaining:** 4.6 MB (22 files: 2 videos, 1 audio, 8 images, 11 fonts)

---

## Impact Summary

| Metric | Royal Grace | Majestic | Combined |
|--------|------------|----------|----------|
| Files removed from deploy | 28 | 40 | **68 files** |
| Deploy size reduced | 45 MB | 25 MB | **70 MB** |
| Active asset reduction | — | 1.0 MB PNG → 48 KB WebP | **952 KB** |
| Audio compression savings | 1.5 MB | 1.6 MB | **3.1 MB** |
| Video audio stripped | 200 KB | 5 KB | **205 KB** |
| Preload hints added | 6 images | 5 images | **11 hints** |
| Video retry pattern | Added | Not needed | — |

### Before vs After — Active Asset Totals

| Template | Before | After | Reduction |
|----------|--------|-------|-----------|
| Royal Grace | ~55 MB deployed | 9.6 MB active | **82%** |
| Majestic | ~30 MB deployed | 4.6 MB active | **85%** |

### Guest-Facing Improvements

1. **Instant interaction** — both templates have no preload gate; "Tap to open" / "Open Invitation" buttons are never disabled
2. **Faster video playback** — Royal Grace now retries video playback if the first attempt fails (slow connection), with a 5-second fallback
3. **Earlier below-fold loading** — preload hints start fetching images before the guest scrolls to them
4. **Smaller downloads** — compressed audio saves 3.1 MB on first visit; WebP conversion saves ~1 MB
5. **30-day caching** — returning guests load instantly from browser cache (Vercel headers already configured)

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/RoyalGrace.tsx` | Added video retry pattern in `openInvitation()`, added preload hints for 6 below-fold assets |
| `src/pages/majestic/Majestic.tsx` | Updated `ornate-badge` reference from `.png` to `.webp`, expanded preload hints from 5 to 10 entries |
| `public/templates/royal-grace/opening.mp4` | Stripped silent AAC audio track |
| `public/templates/royal-grace/music.mp3` | Re-encoded 256→128 kbps |
| `public/templates/majestic/assets/ornate-badge-2PyCLI0e.webp` | New WebP conversion (48 KB vs 1.0 MB PNG) |
| `public/templates/majestic/assets/celebrations.mp4` | Stripped silent AAC audio track |
| `public/templates/majestic/assets/intro-music-CzqJOUtA.mp3` | Re-encoded 321→128 kbps |
| `public/unused/royal-grace/` | 28 files moved here |
| `public/unused/majestic/` | 40 files moved here |
| `project-context/UNUSED_ASSET_CLEANUP.md` | Added Majestic cleanup log |
| `project-context/TEMPLATE_ASSET_AUDIT.md` | Updated Royal Grace and Majestic status to Done |

---

## Standalone React Templates — Batch 2

### Mandap at Dusk (template 4)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| 8 PNGs → WebP | 11.4 MB total | 1.1 MB total | 10.3 MB (90%) |
| inkem.mp3 (192→128 kbps) | 1.0 MB | 667 KB | 333 KB |
| entry.mp4 (audio check) | 953 KB | — | No audio track present |

Key conversions: burgundy-stationery (2.8→264KB, 91%), border2 (2.4→233KB, 90%), ivory-stationery-unframed (2.3→210KB, 91%), post-scratch (1.2→79KB, 93%).

#### Phase 2 — Loading Strategy
- **Video retry pattern** — added canplaythrough retry with 5s timeout to `openInvitation()` in MandapAtDusk.tsx
- **Preload hints** — 7 below-fold assets: seam-garland, border2, ivory-stationery-unframed, burgundy-stationery, couple-watercolor, scratch, post-scratch
- **No preload gate** — confirmed: button always clickable, no asset loading dependency
- **Lazy loading** — couple-watercolor `<img>` already has `loading="lazy"`

#### Phase 3 — Unused Cleanup
**11 files moved to `public/unused/mandap-at-dusk/`** (14.9 MB):
- 8 original PNGs replaced by WebP conversions
- 1 MP3 backup (inkem-192kbps.mp3)
- 2 unused design variants (scratch2.png, post-scratch2.png)

**Active assets remaining:** 2.8 MB (13 files: 1 video, 1 audio, 10 images, 1 SVG mask)

---

### A Timeless Union (template 3)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| rinnehtiauuttzor38lg.mp3 (320→128 kbps) | 1.8 MB | 733 KB | 1.1 MB |
| Images | Already all WebP | — | — |
| Video | None | — | — |

#### Phase 2 — Loading Strategy (no changes needed)
- **5 preload hints** already present in ATimelessUnion.tsx for opening scene images
- **Lazy loading** — all below-fold images have `loading="lazy"` + `decoding="async"` in Design14Scenes.tsx
- **Audio** — `preload="auto"` intentional (mobile tap gesture compliance), playbackFailed state handles failures
- **No preload gate** — open button always clickable
- **CelebrationsEmbed** — standalone component, no lazy loading concern

#### Phase 3 — Unused Cleanup
**43 files moved to `public/unused/a-timeless-union/`** (53 MB):
- 7 original PNGs (replaced by WebP used in code)
- 8 alternate variant PNGs (unused design iterations)
- 3 TTF font files (woff2 equivalents are used)
- 2 MP3 backups (320kbps original + unused alternate)
- 1 large JPG (5.5MB, unreferenced)
- 1 JPEG (unreferenced)
- ~20 unreferenced WebP files from Framer export

**Kept:** `arjun-bhavana-share.png` (1.6MB) — OG share image referenced in index.html meta tags.

**Active assets remaining:** 8.7 MB (28 files: 19 images, 1 audio, 6 fonts, 1 SVG, 1 OG share PNG)

---

### Artful Love Story (template 8)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| tCmbsmXAUth2weao58tGilF28.png → WebP (CSS bg) | 1.2 MB | 558 KB | 642 KB (54%) |
| zBRd2fZShor1nxxKvdVKhKU.png (OG image) | 692 KB | — | Kept as PNG (social sharing) |
| Audio | None (handled outside iframe) | — | — |
| Video | None | — | — |

Architecture note: iframe-based template. React wrapper (`ArtfulLoveStory.tsx`) is thin; the actual template is `index.html` (271KB) with inline styles and responsive `<picture>`/`srcset` referencing `assets/optimized/` WebP variants.

#### Phase 2 — Loading Strategy (no changes needed)
- **React preloads** — 3 hero images preloaded at responsive widths (640/960/1600) in ArtfulLoveStory.tsx
- **HTML loading attributes** — hero images: `loading="eager"` + `fetchpriority="high"`; below-fold: `loading="lazy"` + `decoding="async"`
- **Responsive srcset** — all images use 640/960/1600 WebP variants
- **IntersectionObserver** in local-runtime.js — text reveal with threshold 0.12, unobserves after reveal
- **Parallax** — cached measurements + rAF, pauses on visibility change, respects reduced-motion
- **CelebrationsEmbed** — replaced inline with lazy-loaded iframe (`loading="lazy"`)

#### Phase 3 — Unused Cleanup
**30 files moved to `public/unused/the-artful-love-story/`** (24 MB):
- 16 original PNGs (all have optimized/ WebP responsive variants used by HTML)
- 4 original WebP files from Framer export (HTML uses optimized/ versions)
- 4 JPEG/JPG files (unreferenced originals)
- 1 original PNG from Phase 1 conversion (tCmbsmXAUth2weao58tGilF28.png)
- 1 WebP duplicate of OG image (zBRd2fZShor1nxxKvdVKhKU.webp)
- 1 unused JPG at template root (artful-love-story-opening.jpg, 421KB)
- 3 small image files (unreferenced)

**Kept:** `zBRd2fZShor1nxxKvdVKhKU.png` (692KB) — OG/Twitter share image.

**Active assets remaining:** 18.8 MB (153 files: 2 root images, 59 optimized WebPs, 92 woff2 fonts)

---

## Combined Impact — All 5 Templates

| Metric | Royal Grace | Majestic | Mandap at Dusk | A Timeless Union | Artful Love Story | **Total** |
|--------|------------|----------|----------------|------------------|-------------------|-----------|
| Files removed | 28 | 40 | 11 | 43 | 30 | **152 files** |
| Deploy size reduced | 45 MB | 25 MB | 14.9 MB | 53 MB | 24 MB | **162 MB** |
| Image conversion savings | — | 952 KB | 10.3 MB | — | 642 KB | **11.9 MB** |
| Audio compression | 1.5 MB | 1.6 MB | 333 KB | 1.1 MB | — | **4.5 MB** |
| Video audio stripped | 200 KB | 5 KB | — | — | — | **205 KB** |
| Preload hints added | 6 | 5 | 7 | 0 (5 existing) | 0 (3 existing) | **18 new** |
| Video retry pattern | Yes | — | Yes | — | — | **2 templates** |

### Files Modified — Batch 2

| File | Changes |
|------|---------|
| `src/pages/MandapAtDusk.tsx` | 8 asset refs PNG→WebP, video retry pattern, 7 preload hints |
| `src/pages/Design18.css` | 4 background-image URLs PNG→WebP |
| `public/templates/mandap-at-dusk/inkem.mp3` | Re-encoded 192→128 kbps |
| `public/templates/mandap-at-dusk/*.webp` | 8 new WebP conversions |
| `public/templates/a-timeless-union/assets/rinnehtiauuttzor38lg.mp3` | Re-encoded 320→128 kbps |
| `public/templates/the-artful-love-story/index.html` | 2 background-image refs PNG→WebP |
| `public/templates/the-artful-love-story/assets/tCmbsmXAUth2weao58tGilF28.webp` | New WebP conversion |
| `public/unused/mandap-at-dusk/` | 11 files moved here |
| `public/unused/a-timeless-union/` | 43 files moved here |
| `public/unused/the-artful-love-story/` | 30 files moved here |

---

## AnimatedInvitation Templates — Batch 3

### Bloom (template 7)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| wedding-background-music.mp3 (320→128 kbps) | 5.2 MB | 2.1 MB | 3.1 MB |
| humming.mp4 (strip audio) | 955 KB | 883 KB | 72 KB |
| dress-code-frame (PNG→WebP) | 418 KB | 97 KB | 321 KB (77%) |
| checkered-frame (PNG→WebP) | 373 KB | 54 KB | 319 KB (86%) |
| floral-top-right (PNG→WebP) | 368 KB | 61 KB | 307 KB (83%) |
| floral-bottom-left (PNG→WebP) | 409 KB | 66 KB | 343 KB (84%) |

#### Phase 2 — Loading Strategy
- **No preload gate** — confirmed: "Tap to open" click handler fires immediately, no asset dependency
- **Video visibility gating** — added IntersectionObserver in `interactions.js` for muted `humming.mp4` decorative videos (media-visibility.js intentionally skips muted videos)
- **Opening video** — has poster + `preload="auto"` + 25s fallback timeout + error handler
- **Music** — already `preload="none"`, independent play/pause

#### Phase 3 — Unused Cleanup
**61 files moved to `public/unused/bloom/`** (33 MB):
- 10 PNG duplicates of WebP files (~14.6 MB)
- 19 unreferenced gallery JPGs (~2.4 MB)
- 21 accommodation/transport/weekend/butterfly PNGs (~4.5 MB)
- 2 unreferenced videos (hum.mov, intro-video-new)
- 3 unreferenced images (intro-poster, celebration.jpeg, UUID jpeg)
- 6 Phase 1 originals (4 PNGs, MP3 backup, humming-with-audio.mp4)

**Active assets remaining:** 11 MB (49 files: 17 media + 32 fonts)

---

### Embroidered Garden (template 6)

Architecture note: EG has dual rendering paths. Native React (`EmbroideredGarden.tsx`) already uses `-opt` assets. The HTML path (`index.html`) was using unoptimized originals — updated to use `-opt` variants, making the originals eligible for cleanup.

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| CSS fallback hero (3MB PNG→302KB opt WebP) | 3.0 MB | 302 KB | 2.7 MB (90%) |
| celebration.mov → celebration2.mp4 | 2.7 MB | 250 KB | 2.5 MB (91%) |
| intro-curtains.jpg → opt.webp | 457 KB | 177 KB | 280 KB |
| dresscode-hanging-garland → opt | 618 KB | 172 KB | 446 KB |
| intro-doors-trimmed → opt.mp4 | 728 KB | 511 KB | 217 KB |
| dress-code-illustration → opt | 255 KB | 37 KB | 218 KB |
| footer-chateau.png → opt.webp | 238 KB | 79 KB | 159 KB |
| countdown-pearl-medallion → opt | 291 KB | 144 KB | 147 KB |
| countdown-embroidery-frame → opt | 367 KB | 245 KB | 122 KB |
| ceremony-reception-bg → opt | 447 KB | 382 KB | 65 KB |
| autumn-wind.mp3 → opt (320→128 kbps) | 6.8 MB | 2.7 MB | 4.1 MB |
| 4× timeline PNGs → WebP | 1.28 MB | 1.05 MB | 230 KB |
| timeline-chapel-v2.png | 175 KB | — | Kept PNG (WebP was larger) |

#### Phase 2 — Loading Strategy (no changes needed)
- **No preload gate** — confirmed: click handler fires immediately, 22s fallback timeout
- **Video error handling** — CSS fallback background when video fails (`.video-unavailable`)
- **Scroll reveals** — IntersectionObserver on `[data-reveal]` at 0.04 threshold
- **Timeline images** — already have `loading="lazy"`
- **Audio** — already `preload="none"`
- **Native React path** — already fully optimized (AmbientVideo, IntersectionObserver, priority/lazy)

#### Phase 3 — Unused Cleanup
**23 files moved to `public/unused/embroidered-garden/`** (15 MB):
- 8 truly unused files (zero references): embroidered-swans-hero-v22.png, story-frame.png, rsvp-topiary.png, rsvp-envelope-v2.png, recovery-venue-v2.png, recovery-day-divider.png, gift-frame-v3.png, intro-doors.jpg
- 11 superseded originals (HTML updated to -opt variants): embroidered-swans-hero-v2.png, embroidered-swans-hero-v2-optimized.webp, dresscode-hanging-garland-v2.webp, ceremony-reception-bg-v2.webp, countdown-embroidery-frame-0EWM-os9.webp, countdown-pearl-medallion-DJ2mwLBm.webp, dress-code-illustration-v2.webp, footer-chateau.png, intro-curtains.jpg, intro-doors-trimmed.mp4, celebration.mov
- 4 original timeline PNGs (replaced by WebP conversions)

**Active assets remaining:** 3.5 MB (17 files: 2 videos, 9 images, 6 timeline images/PNGs)

---

## Combined Impact — All 7 Templates

| Metric | Royal Grace | Majestic | Mandap | Timeless Union | Artful Love | Bloom | Embroidered Garden | **Total** |
|--------|------------|----------|--------|----------------|-------------|-------|--------------------|-----------|
| Files removed | 28 | 40 | 11 | 43 | 30 | 61 | 23 | **236 files** |
| Deploy size reduced | 45 MB | 25 MB | 14.9 MB | 53 MB | 24 MB | 33 MB | 15 MB | **210 MB** |
| Image optimization | — | 952 KB | 10.3 MB | — | 642 KB | 1.3 MB | 6.9 MB | **20 MB** |
| Audio compression | 1.5 MB | 1.6 MB | 333 KB | 1.1 MB | — | 3.1 MB | 4.1 MB | **11.7 MB** |
| Video savings | 200 KB | 5 KB | — | — | — | 72 KB | 2.7 MB | **3.0 MB** |

### Files Modified — Batch 3

| File | Changes |
|------|---------|
| `public/templates/bloom/index.html` | 2 PNG refs → WebP (CSS background-image, border-image) |
| `public/templates/bloom/rsvp.html` | 2 PNG img src → WebP |
| `public/templates/bloom/interactions.js` | Added IntersectionObserver video visibility gating |
| `public/templates/bloom/assets/wedding-background-music.mp3` | Re-encoded 320→128 kbps |
| `public/templates/bloom/assets/humming.mp4` | Stripped silent AAC audio track |
| `public/templates/bloom/assets/*.webp` | 4 new WebP conversions |
| `public/templates/embroidered-garden/index.html` | 10 asset refs updated to -opt variants, 4 timeline PNGs → WebP |
| `public/templates/embroidered-garden/interactions.css` | CSS fallback hero: 3MB PNG → 302KB opt WebP |
| `src/invitations/personalizeEG.ts` | celebration.mov → celebration2.mp4, 2 image refs → -opt |
| `src/invitations/AnimatedInvitation.tsx` | 2 EG theme asset refs → -opt |
| `src/invitations/model.ts` | footer-chateau.png → footer-chateau-opt.webp |
| `src/lib/templateCardData.ts` | intro-doors-trimmed.mp4 → intro-doors-opt.mp4 |
| `public/unused/bloom/` | 61 files moved here |
| `public/unused/embroidered-garden/` | 23 files moved here |

---

## OrderFrame + Native React Templates — Batch 4

### Qubool (template 14)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| music.mp3 (320→128 kbps) | 1.6 MB | 636 KB | 964 KB |
| Images | Already all WebP in HTML | — | — |

#### Phase 2 — Loading Strategy (no changes needed)
- **No preload gate** — gate opens instantly on click (`openGate()` at line 859)
- **IntersectionObserver lazy loading** — all scene layers loaded when within one-screen lead time
- **Audio** — `preload="none"`, starts muted
- **Scene 1 layers** loaded immediately, others lazy
- **Uses media-visibility.js** for visibility gating

#### Phase 3 — Unused Cleanup
**5 files moved to `public/unused/qubool/`** (1.8 MB):
- 4 unreferenced scene5 assets (scene5 section removed from HTML but assets left behind): 05-rose-petals.webp (50K), 01-rose-blur-p.webp (31K), 01-rose-blur.webp (30K), 02-dholak.webp (93K)
- 1 MP3 backup: music-320kbps.mp3 (1.6M)

**Active assets remaining:** 5.3 MB (WebP images + compressed MP3 + vendor JS)

---

### Destination Wedding (template 12)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| 4× couple JPGs → WebP | 4.8 MB total | 3.2 MB total | 1.6 MB (33%) |
| music.mp3 (320→128 kbps) | 1.6 MB | 636 KB | 964 KB |

couple-1: 1.0M→693K, couple-2: 1.5M→1.0M, couple-3: 1.2M→796K, couple-4: 1.1M→716K.
Updated `index.html` couple_carousel URLs from .jpg to .webp.

#### Phase 2 — Loading Strategy (no changes needed)
- Standalone React app inside OrderFrame iframe
- Loading handled by built React bundle
- Audio loaded on demand

#### Phase 3 — Unused Cleanup
**5 files moved to `public/unused/destination-wedding/`** (6.4 MB):
- 4 original JPGs: couple-1.jpg (1.0M), couple-2.jpg (1.5M), couple-3.jpg (1.2M), couple-4.jpg (1.1M)
- 1 MP3 backup: music-320kbps.mp3 (1.6M)

**Active assets remaining:** 7.6 MB (4 WebP images + compressed MP3 + React bundle)

---

### Mangal (template 15)

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| 8× background PNGs → WebP (data-bg) | 17.5 MB total | 1.1 MB total | 16.4 MB (94%) |
| Made In Heaven.mp3 (192→128 kbps) | 1.5 MB | 1.0 MB | 500 KB |

Also fixed 8 broken `data-bg` references — HTML referenced non-existent landscape PNGs (e.g., `gate/00-gate.png`), causing 404 fallbacks on desktop. Created proper WebP versions from the `-p.png` sources and updated all `data-bg` attributes.

21 PNGs already had WebP duplicates (created Nov 3). HTML foreground elements (`data-src`), placeholders (`data-bg-p`), and decorative images (`img src`) already referenced WebP. All 21 PNGs on disk were unused originals.

#### Phase 2 — Loading Strategy (no changes needed)
- **No preload gate** — gate opens instantly on click
- **IntersectionObserver lazy loading** — all scene layers lazy-loaded with one-screen lead time
- **Audio** — `preload="none"`, starts muted
- **Uses media-visibility.js** for visibility gating
- Same architecture as Qubool (templates 14-16 share the same script.js pattern)

#### Phase 3 — Unused Cleanup
**22 files moved to `public/unused/mangal/`** (41 MB):
- 8 portrait placeholder PNGs (-p.png, HTML uses -p.webp): gate, scene1-4, scene6-8 backgrounds
- 7 foreground element PNGs (HTML uses .webp): scene1/02-her, scene1/03-him, scene3/02-couple-seated, scene4/02-festive-moment, scene6/02-ceremony-moment, scene7/02-couple-close, scene8/02-couple-sit
- 6 decorative PNGs (HTML uses .webp): golden-bokeh, warm-lampglow, rangoli-motif, om-motif, footer-ornament, diya-float
- 1 MP3 backup: Made In Heaven-192kbps.mp3 (1.5M)
- .DS_Store deleted

**Active assets remaining:** ~5.5 MB (29 WebP files + 1 MP3 + vendor JS/CSS)

---

### Tajmahal (template 17)

Architecture note: Native React template (NOT OrderFrame despite being in the same number range). Component at `src/templates/Tajmahal.tsx` with `Tajmahal.css`.

#### Phase 1 — Asset Optimization
| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| opening.mp4 (strip audio) | 6.1 MB | 5.9 MB | 200 KB |
| 7.mp4 (strip audio) | 3.1 MB | 2.1 MB | 1.0 MB |
| music.mp3 | 772 KB | — | Already at 105 kbps |
| Images | All referenced as WebP in TSX/CSS | — | — |

Both videos always played muted (`muted`, `defaultMuted = true`), silent AAC audio tracks stripped.

#### Phase 2 — Loading Strategy (no changes needed)
- **No preload gate** — tap prompt fires `playOpening()` immediately, video starts at 1.5s mark
- **Opening video** — `preload="auto"` with poster image, intentional for instant playback
- **Scene 7 video** — `preload="metadata"` with IntersectionObserver visibility gating (play when visible, no-op catch on block)
- **Lazy images** — scenes 4-6 images have `loading="lazy"`
- **Parallax** — cached measurements + requestAnimationFrame, respects `prefers-reduced-motion`
- **Audio** — `preload="none"`, starts on user tap

#### Phase 3 — Unused Cleanup
**14 files moved to `public/unused/tajmahal/`** (32 MB):
- 6 PNGs with WebP duplicates (React uses .webp): 2.png, 3.png, 4.png, 5.png, 6.png, 7.png
- 6 unreferenced PNGs (zero references anywhere): 22.png, 33.png, 6-1.png, celebration.png, celebration2.png, celebration3.png
- 2 video backups with audio: opening-with-audio.mp4 (6.1M), 7-with-audio.mp4 (3.1M)

**Active assets remaining:** ~10.2 MB (8 WebP images + 2 MP4s + 1 MP3 + 1 JPG poster)

---

## Combined Impact — All 11 Templates

| Metric | Batch 1-3 (7 templates) | Qubool | Dest. Wedding | Mangal | Tajmahal | **Grand Total** |
|--------|------------------------|--------|---------------|--------|----------|-----------------|
| Files removed | 236 | 5 | 5 | 22 | 14 | **282 files** |
| Deploy size reduced | 210 MB | 1.8 MB | 6.4 MB | 41 MB | 32 MB | **291 MB** |
| Image optimization | 20 MB | — | 1.6 MB | 16.4 MB | — | **38 MB** |
| Audio compression | 11.7 MB | 964 KB | 964 KB | 500 KB | — | **14.1 MB** |
| Video savings | 3.0 MB | — | — | — | 1.2 MB | **4.2 MB** |

### Files Modified — Batch 4

| File | Changes |
|------|---------|
| `public/templates/mangal/index.html` | 8 data-bg PNG refs → WebP (fixed broken desktop backgrounds) |
| `public/templates/destination-wedding/index.html` | 4 couple_carousel URLs .jpg → .webp |
| `public/templates/mangal/Made In Heaven.mp3` | Re-encoded 192→128 kbps |
| `public/templates/qubool/music.mp3` | Re-encoded 320→128 kbps |
| `public/templates/destination-wedding/music.mp3` | Re-encoded 320→128 kbps |
| `public/templates/destination-wedding/wedding/*.webp` | 4 new WebP conversions from JPGs |
| `public/templates/mangal/assets/*/*.webp` | 8 new background WebP conversions |
| `public/templates/tajmahal/assets/opening.mp4` | Stripped silent AAC audio track |
| `public/templates/tajmahal/assets/7.mp4` | Stripped silent AAC audio track |
| `public/unused/qubool/` | 5 files moved here |
| `public/unused/destination-wedding/` | 5 files moved here |
| `public/unused/mangal/` | 22 files moved here |
| `public/unused/tajmahal/` | 14 files moved here |

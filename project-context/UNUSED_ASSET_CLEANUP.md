# Unused Asset Cleanup — Playbook

Tag: **`/cleanup-unused-assets`**

Move unused files out of `public/templates/{template}/` into `public/unused/{template}/` to reduce deploy size without deleting anything.

---

## Process

### Step 1 — Identify all assets

```bash
ls -lhS public/templates/{template}/assets/
```

Also check for non-asset files in the template root (legacy `index.html`, `interactions.js`, `reference.css`, `asset-map.json`).

### Step 2 — Check what's referenced in source code

```bash
# For each file, check if it's referenced anywhere in src/
grep -rl 'filename.ext' src/ --include='*.ts' --include='*.tsx' --include='*.css'
```

**Important distinctions:**
- Files referenced in `src/pages/` or `src/invitations/` = **actively used**
- Files referenced ONLY in `public/templates/{template}/index.html`, `interactions.js`, or `asset-map.json` = **legacy-only** (for Native React templates — these HTML files are from the pre-React migration and aren't loaded by any code)
- Files with zero references = **completely unused**

### Step 3 — Verify legacy files are truly dead

For Native React templates (currently: Royal Grace, Majestic, Secret Garden), confirm the template's `index.html` isn't loaded:

```bash
# Should return nothing for Native React templates
grep -rn '{template}/index.html' src/ --include='*.ts' --include='*.tsx'
```

Check `OrderFrameInvitation.tsx` — only templates listed in its `sources` map use their `index.html`. Check `AnimatedInvitation.tsx` — only templates in its config use the HTML version.

### Step 4 — Create folder and move

```bash
mkdir -p public/unused/{template}
mv public/templates/{template}/assets/unused-file.ext public/unused/{template}/
```

For legacy files in the template root:
```bash
mv public/templates/{template}/index.html public/unused/{template}/
mv public/templates/{template}/interactions.js public/unused/{template}/
mv public/templates/{template}/reference.css public/unused/{template}/
mv public/templates/{template}/asset-map.json public/unused/{template}/
```

### Step 5 — Verify nothing broke

Check every asset referenced in the template's React component still exists:

```bash
grep -ohP "(?<=/templates/{template}/assets/)[^\s'\")]+" src/pages/{template}/*.tsx src/invitations/components/*.tsx | sort -u | while read f; do
  [ -f "public/templates/{template}/assets/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

---

## What qualifies as unused

| Category | Description | Safe to move? |
|----------|-------------|---------------|
| **Originals** | `*-original.*`, `*-full.*`, `*-320.*` files kept as backups after optimization | Yes |
| **Pre-conversion** | `.mov` files replaced by `.mp4`, `.png` files replaced by `.webp` | Yes, if React code uses the new format |
| **Alternate versions** | `pearl-clock2.*`, `pearl-clock3.*` — unused design alternatives | Yes |
| **Legacy PNGs** | `.png` versions where React uses `.webp`, only referenced in dead `index.html` | Yes, for Native React templates |
| **Legacy HTML/JS/CSS** | `index.html`, `interactions.js`, `reference.css` from pre-React version | Yes, for Native React templates |
| **Asset map** | `asset-map.json` — manifest for the legacy HTML version | Yes, for Native React templates |

## What to keep

- Every file referenced in the template's `.tsx` component
- Every file referenced in shared components (`InvitationRsvp.tsx`, `InvitationMedia.tsx`)
- Template preview image (referenced in `model.ts` designs array)
- All font files (`.woff`, `.woff2`) referenced in the template's `.css`
- For AnimatedInvitation/OrderFrameInvitation templates: the `index.html` and related files ARE actively used — do not move them

---

## Completed templates

### Secret Garden (template 5) — 2026-11-05

**Moved to `public/unused/secret-garden/`** (41 MB total):

| File | Size | Reason |
|------|------|--------|
| autumn-wind-320.mp3 | 6.8 MB | Original 320kbps audio before compression |
| autumn-wind-full.mp3 | 2.7 MB | Full-length audio backup |
| celebrations.mov | 2.8 MB | Original MOV before MP4 conversion |
| venue-frame.png | 3.0 MB | Legacy PNG, React uses ornate-badge WebP |
| pearl-clock.png | 2.8 MB | Legacy PNG, React uses .webp |
| pearl-clock2.png | 2.5 MB | Unused alternate design |
| pearl-clock3.png | 2.7 MB | Unused alternate design |
| dress-code-new.png | 2.7 MB | Legacy PNG, React uses .webp |
| food.png | 2.5 MB | Legacy PNG, React uses .webp |
| bouquet_flores_majestic.png | 2.4 MB | Legacy PNG, not used in React |
| couple.png | 1.9 MB | Legacy PNG, React uses .webp |
| cochecito.png | 1.2 MB | Legacy PNG, not used in React |
| ornate-badge-2PyCLI0e.png | 1.0 MB | Legacy PNG, React uses .webp |
| envelope-open-new.png | 1.0 MB | Legacy PNG, React uses .webp |
| cover-original.jpg | 1.0 MB | Original before optimization |
| envelope-closed-new.png | 774 KB | Legacy PNG, React uses .webp |
| lights.png | 652 KB | Legacy PNG, React uses .webp |
| food-original.webp | 579 KB | Original before optimization |
| footer-flowers-original.png | 446 KB | Original before optimization |
| dress-code-new-original.webp | 347 KB | Original before optimization |
| venue-frame.webp | 283 KB | Unused (React uses ornate-badge) |
| timeline-banquete.png | 269 KB | Legacy PNG, not used in React |
| pearl-clock3.webp | 263 KB | Unused alternate design |
| pearl-clock2.webp | 202 KB | Unused alternate design |
| bouquet_flores_majestic.webp | 175 KB | Unused, not referenced anywhere |
| rings-illustration-DpManX9p.png | 159 KB | Legacy PNG, not used in React |
| angel-icon-Cg0tP4nb.png | 59 KB | Legacy PNG, not used in React |
| reference.css | 79 KB | Legacy HTML template stylesheet |
| index.html | 12 KB | Legacy HTML template (pre-React) |
| asset-map.json | 11 KB | Legacy asset manifest |
| interactions.js | 7 KB | Legacy template JS |

**Active assets remaining:** 5.9 MB (14 media files + 68 font files)

### Royal Grace (template 1) — 2026-11-05

**Moved to `public/unused/royal-grace/`** (45 MB total):

| File | Size | Reason |
|------|------|--------|
| sage-stationery-print.png | 3.0 MB | Unused alternate stationery |
| sage-stationery-green-ornament.png | 2.7 MB | Unused alternate stationery |
| post-scratch.png | 2.7 MB | Unused (HeartDateReveal uses canvas, not images) |
| ivory-stationery.png | 2.6 MB | Unused full-frame stationery PNG |
| post-scratch3.png | 2.5 MB | Unused alternate scratch reveal |
| end2.png | 2.5 MB | Unused alternate ending image |
| scratch2.png | 2.5 MB | Unused alternate scratch coating |
| ivory-stationery-cutout.png | 2.5 MB | Unused alternate stationery |
| sage-stationery-unframed-original.png | 2.5 MB | Original before WebP conversion |
| end-original.png | 2.4 MB | Original before WebP conversion |
| welcome-original.jpg | 2.4 MB | Original before WebP conversion |
| general-original.jpg | 2.4 MB | Original before WebP conversion |
| scratch3.png | 2.4 MB | Unused alternate scratch coating |
| ivory-stationery-unframed-original.png | 2.3 MB | Original before WebP conversion |
| couple-original.png | 2.3 MB | Original before WebP conversion |
| couple1.png | 2.3 MB | Unused alternate couple illustration |
| celebration-roses-original.png | 2.0 MB | Original before WebP conversion |
| scratch-.png | 836 KB | Unused scratch coating variant |
| scratch.png | 781 KB | Unused scratch coating (canvas is used instead) |
| end1.jpg | 479 KB | Unused alternate ending image |
| post-scratch2.png | 284 KB | Unused alternate scratch reveal |
| welcome1.jpg | 284 KB | Unused alternate welcome image |
| opening-lastframe.jpg | 203 KB | Unused video last-frame capture |
| opening-poster-original.jpg | 186 KB | Original before WebP conversion |
| general1.jpg | 144 KB | Unused alternate background |
| celebration-plaque.svg | 2.4 KB | Unused SVG element |

**Active assets remaining:** 9.6 MB (12 files: 2 videos, 1 audio, 8 WebP images, 1 SVG mask)

### Majestic (template 2) — 2026-11-05

**Moved to `public/unused/majestic/`** (25 MB total, 40 files):

| File | Size | Reason |
|------|------|--------|
| celebration.mov | 2.8 MB | Original MOV, React uses celebrations.mp4 |
| intro-music-321kbps.mp3 | 2.7 MB | Original 321kbps audio before compression |
| food.png | 2.5 MB | Legacy PNG, React uses food.webp |
| celebrations.mov | 2.1 MB | MOV variant |
| Animated_wedding_invitation_loop…mp4 | 1.7 MB | Unused video variant |
| celebrationss.mov | 1.6 MB | MOV variant |
| envelope-illustration-viyIlQ4t.png | 1.4 MB | Legacy PNG, React uses envelope-*-new.webp |
| footer-ornament-doM17sdI.png | 1.2 MB | Legacy footer ornament PNG |
| ornate-badge-2PyCLI0e.png | 1.0 MB | Replaced by WebP (95% smaller) |
| monogram-mj-F-9vDsNY.png | 688 KB | Legacy PNG |
| string-lights-DfoJYed-.png | 654 KB | Legacy PNG, React uses .webp |
| accommodation-icon-C32ZXcpl.png | 588 KB | Unused illustration |
| dog-bouquet-BGxYEHD3.png | 584 KB | Unused illustration |
| monogram-mj-ornate-BvTtjQ8E.png | 565 KB | Unused monogram variant |
| bus-illustration-HGTtKXQS.png | 504 KB | Unused illustration |
| intro-video-Dhn3t98e.mp4 | 469 KB | Unused intro video |
| couple-dancing-D8lPNoP4.png | 451 KB | Unused illustration |
| flower-bouquet-CBjxDcRF.png | 440 KB | Legacy PNG (has .webp) |
| celebrations-with-audio.mp4 | 344 KB | Original before audio strip |
| dress-code-illustration-Yae00T83.png | 333 KB | Unused illustration |
| party-illustration-_BntG0bC.png | 278 KB | Unused illustration |
| celebrationsz.mp4 | 245 KB | Unused MP4 variant |
| hero-illustration-BQEp2DxL.jpg | 235 KB | Unused hero illustration |
| entrada-venue-DRdtJg5f.jpg | 199 KB | Unused venue image |
| rings-illustration-LjMzScCM.png | 166 KB | Unused illustration |
| monogram-mj-F-9vDsNY.webp | 165 KB | Unused monogram (not referenced) |
| watermark-DICa3eBu.png | 136 KB | Unused watermark |
| F88DF8C5-…jpeg | 116 KB | Unknown upload |
| footer-bg-new-CQ33XzYQ.jpg | 109 KB | Unused footer background |
| finca-biniagual-illustration-L_H2jd6R.jpg | 86 KB | Unused venue illustration |
| flower-bouquet-CBjxDcRF.webp | 74 KB | Unused WebP |
| framed-couple-photo-new-DICNXdLN.jpg | 65 KB | Unused photo |
| mallorca-map-illustrated-BRkc7Ahw.jpg | 43 KB | Unused map illustration |
| ornate-frame-new-DrDlIAz5.jpg | 35 KB | Unused frame |
| intro-poster-BaLFALiu.jpg | 25 KB | Unused poster |
| reference.css | 69 KB | Legacy HTML template stylesheet |
| index.html | 13 KB | Legacy HTML template (pre-React) |
| interactions.js | 4.6 KB | Legacy template JS |
| interactions.css | 1.9 KB | Legacy template interaction styles |
| fonts.css | 1.2 KB | Legacy font declarations |

**Active assets remaining:** 4.6 MB (22 files: 2 videos, 1 audio, 8 images, 11 font files)

### Mandap at Dusk (template 4) — 2026-11-05

**Moved to `public/unused/mandap-at-dusk/`** (14.9 MB total, 11 files):

| File | Size | Reason |
|------|------|--------|
| burgundy-stationery.png | 2.8 MB | Replaced by WebP (264 KB) |
| border2.png | 2.4 MB | Replaced by WebP (233 KB) |
| ivory-stationery-unframed.png | 2.3 MB | Replaced by WebP (210 KB) |
| post-scratch2.png | 2.3 MB | Unused alternate design variant |
| scratch2.png | 1.9 MB | Unused alternate design variant |
| post-scratch.png | 1.2 MB | Replaced by WebP (79 KB) |
| seam-garland.png | 1.1 MB | Replaced by WebP (78 KB) |
| inkem-192kbps.mp3 | 1.0 MB | Original before 128 kbps compression |
| couple-watercolor.png | 547 KB | Replaced by WebP (44 KB) |
| scratch.png | 575 KB | Replaced by WebP (48 KB) |
| open-invitation-button.png | 505 KB | Replaced by WebP (155 KB) |

**Active assets remaining:** 2.8 MB (13 files: 1 video, 1 audio, 10 images, 1 SVG mask)

### A Timeless Union (template 3) — 2026-11-05

**Moved to `public/unused/a-timeless-union/`** (53 MB total, 43 files):

| File | Size | Reason |
|------|------|--------|
| jsLG9oDACMxED6MHxxxqjxxtNQ.jpg | 5.5 MB | Unreferenced large JPG |
| end-scene.png | 3.2 MB | Original PNG (WebP used) |
| wedding.png | 2.8 MB | Original PNG (WebP used) |
| sangeet.png | 2.5 MB | Original PNG (WebP used) |
| reception.png | 2.4 MB | Original PNG (WebP used) |
| engagement.png | 2.3 MB | Original PNG (WebP used) |
| brideandgrrom.png | 2.3 MB | Original PNG (WebP used) |
| image.png | 2.1 MB | Original PNG (WebP used) |
| rinnehtiauuttzor38lg-320kbps.mp3 | 1.8 MB | Original 320 kbps before compression |
| rinnehtiauuttzor38lg2.mp3 | 1.3 MB | Unused alternate audio |
| end-scene4.png | 1.8 MB | Unused alternate design variant |
| end-scene3.png | 1.6 MB | Unused alternate design variant |
| end-scene2.png | 1.5 MB | Unused alternate design variant |
| reception2.png | 1.4 MB | Unused alternate variant |
| sangeet3.png | 1.3 MB | Unused alternate variant |
| sangeet2.png | 1.2 MB | Unused alternate variant |
| wedding2.png | 1.1 MB | Unused alternate variant |
| engagement2.png | 1.1 MB | Unused alternate variant |
| 704nAPXndZuu4f9Y58HGiZKFCM.jpeg | 830 KB | Unreferenced JPEG |
| 3× TTF fonts | ~600 KB each | woff2 equivalents used |
| ~20 unreferenced WebP files | various | Framer export leftovers |

**Kept:** `arjun-bhavana-share.png` (1.6 MB) — OG share image in index.html meta tags.

**Active assets remaining:** 8.7 MB (28 files: 19 images, 1 audio, 6 fonts, 1 SVG, 1 OG share PNG)

### Artful Love Story (template 8) — 2026-11-05

**Moved to `public/unused/the-artful-love-story/`** (24 MB total, 30 files):

| File | Size | Reason |
|------|------|--------|
| QUYudzcydz5OmxfmIxgjPrFyb6I.png | 2.9 MB | Original PNG (optimized/ WebP used) |
| CUxzxi5SNqNa0t77tmEkNmfHc.png | 2.0 MB | Original PNG (optimized/ WebP used) |
| J6YiMAQTDPTAlfG2On7An1Q5lB4.png | 1.9 MB | Original PNG (optimized/ WebP used) |
| iciTJeQ6Cx2u0gNdZeuKHPf1I.png | 1.9 MB | Original PNG (optimized/ WebP used) |
| sc2GPAV2jTrdKAHcfHti42Mz5YE.png | 1.8 MB | Original PNG (optimized/ WebP used) |
| VrdsdVM2OwyjQkw6YWOB0OowTQ.png | 1.4 MB | Original PNG (optimized/ WebP used) |
| D4pzTjtAOLwhyi0UPGweoWoztA.png | 1.4 MB | Original PNG (optimized/ WebP used) |
| tCmbsmXAUth2weao58tGilF28.png | 1.2 MB | Replaced by WebP (558 KB) |
| f7X3FcEZ4muD31rwPB6wnsMnmsw.png | 1.1 MB | Original PNG (optimized/ WebP used) |
| 6f9AxarIs54UBYT1Lrm4ws9V764.png | 998 KB | Original PNG (optimized/ WebP used) |
| sdAKyTg4o5WmZhgAcUR0DbKY.png | 933 KB | Original PNG (optimized/ WebP used) |
| F2ADq8uKnJWgYF9TX50Ef0rL0U.png | 925 KB | Original PNG (optimized/ WebP used) |
| J6YiMAQTDPTAlfG2On7An1Q5lB4.webp | 790 KB | Full-size WebP (optimized/ used) |
| xZKlIX9XaacbmAvyKmu8rqVXE.png | 722 KB | Original PNG (optimized/ WebP used) |
| 7Jc7F5U6LjAzdX4ypVkjja74nO8.png | 714 KB | Original PNG (optimized/ WebP used) |
| a6l8leK3Q1bKzvdCCwf3nSzy7E.png | 564 KB | Original PNG (optimized/ WebP used) |
| VrdsdVM2OwyjQkw6YWOB0OowTQ.webp | 451 KB | Full-size WebP (optimized/ used) |
| artful-love-story-opening.jpg | 421 KB | Zero references anywhere |
| HHhvRybKYYn0bwE2ivhhQVsGc5A.jpeg | 376 KB | Unreferenced JPEG |
| mpTuXe92kxp4o8MtgrakEGpuQPA.jpeg | 295 KB | Unreferenced JPEG |
| 7Jc7F5U6LjAzdX4ypVkjja74nO8.webp | 292 KB | Full-size WebP (optimized/ used) |
| Hroe8U2N75359CjJrk9AA0WAFk.jpeg | 287 KB | Unreferenced JPEG |
| 123OKdea8oPhNCq0uetsHB8OcDw.jpeg | 213 KB | Unreferenced JPEG |
| zBRd2fZShor1nxxKvdVKhKU.webp | 185 KB | WebP duplicate of OG image |
| hV0sxZSugZ1H4ccFPtXXsbHVi54.png | 161 KB | Original PNG (optimized/ WebP used) |
| rOJVGWe8W5Nx4kfOdvTCIYo3N30.jpg | 122 KB | Unreferenced JPG |
| z4FcDC07DapVhAf2xKtlQGU.jpg | 84 KB | Unreferenced JPG |
| xZKlIX9XaacbmAvyKmu8rqVXE.webp | 78 KB | Full-size WebP (optimized/ used) |
| sZJ4c6HdPUPslpxpmOqUaERrJtA.jpg | 74 KB | Unreferenced JPG |
| Rt8UBMylAa1Uf8GIPommwOJom8.png | 52 KB | Original PNG (optimized/ WebP used) |

**Kept:** `zBRd2fZShor1nxxKvdVKhKU.png` (692 KB) — OG/Twitter share image.

**Active assets remaining:** 18.8 MB (153 files: 2 root images, 59 optimized WebPs, 92 woff2 fonts)

### Bloom (template 7) — 2026-11-05

**Moved to `public/unused/bloom/`** (33 MB total, 61 files):

| File | Size | Reason |
|------|------|--------|
| hero-bg-RvVOmFvi.png | 2.5 MB | PNG duplicate (WebP used in HTML) |
| venue-illustration-CJozVy2q.png | 2.2 MB | PNG duplicate (WebP used) |
| ceremony-oval-bg-Dus9vYNo.png | 2.0 MB | PNG duplicate (WebP used) |
| dresscode-illustration-CKNDNV2q.png | 1.8 MB | PNG duplicate (WebP used) |
| hum.mov | 1.6 MB | Replaced by humming.mp4 |
| intro-video-new-bkm1XghM.mp4 | 1.6 MB | Zero references |
| black-tie-illustration-Bzqxj15v.png | 1.3 MB | PNG duplicate (WebP used) |
| programme-frame-B9QNR9GL.png | 1.3 MB | PNG duplicate (WebP used) |
| rsvp-portrait-mMZuOcbA.png | 1.3 MB | PNG duplicate (WebP used) |
| intro-poster-I95nUE3P.jpg | 918 KB | Zero references |
| welcome-flowers-Dy0evJgO.png | 888 KB | PNG duplicate (WebP used) |
| countdown-frame-DEQv0lAm.png | 720 KB | PNG duplicate (WebP used) |
| welcome-flowers-bottom-CYQVvwo4.png | 562 KB | PNG duplicate (WebP used) |
| 19× gallery JPGs | ~2.4 MB | Zero references anywhere |
| 21× accommodation/transport/weekend/butterfly PNGs | ~4.5 MB | Zero references anywhere |
| 4× Phase 1 original PNGs | various | Replaced by WebP conversions |
| wedding-background-music-320kbps.mp3 | 5.2 MB | Original before 128kbps compression |
| humming-with-audio.mp4 | 955 KB | Original before audio strip |
| celebration.jpeg | 99 KB | Zero references |
| 42552DF7-...jpeg | 99 KB | Zero references (UUID upload) |

**Active assets remaining:** 11 MB (49 files: 17 media + 32 fonts)

### Embroidered Garden (template 6) — 2026-11-05

**Moved to `public/unused/embroidered-garden/`** (15 MB total, 23 files):

| File | Size | Reason |
|------|------|--------|
| embroidered-swans-hero-v2.png | 3.0 MB | CSS fallback now uses -opt.webp |
| celebration.mov | 2.7 MB | Replaced by celebration2.mp4 in personalizeEG.ts |
| intro-doors.jpg | 2.0 MB | Zero references anywhere |
| intro-doors-trimmed.mp4 | 728 KB | HTML updated to intro-doors-opt.mp4 |
| dresscode-hanging-garland-v2.webp | 618 KB | Superseded by -opt variant |
| embroidered-swans-hero-v22.png | 488 KB | Typo variant, zero references |
| intro-curtains.jpg | 457 KB | HTML updated to intro-curtains-opt.webp |
| ceremony-reception-bg-v2.webp | 447 KB | Superseded by -opt variant |
| story-frame.png | 433 KB | Zero references |
| timeline-rings-v2.png | 403 KB | Replaced by WebP conversion |
| countdown-embroidery-frame-0EWM-os9.webp | 367 KB | Superseded by -opt variant |
| embroidered-swans-hero-v2-optimized.webp | 367 KB | Superseded by -opt variant |
| timeline-disco-v2.png | 334 KB | Replaced by WebP conversion |
| timeline-champagne-v2.png | 293 KB | Replaced by WebP conversion |
| countdown-pearl-medallion-DJ2mwLBm.webp | 291 KB | Superseded by -opt variant |
| rsvp-topiary.png | 266 KB | Zero references |
| recovery-venue-v2.png | 256 KB | Zero references |
| dress-code-illustration-v2.webp | 255 KB | Superseded by -opt variant |
| rsvp-envelope-v2.png | 253 KB | Zero references |
| timeline-cocktail-v2.png | 247 KB | Replaced by WebP conversion |
| footer-chateau.png | 238 KB | HTML+model.ts updated to -opt.webp |
| gift-frame-v3.png | 200 KB | Zero references |
| recovery-day-divider.png | 122 KB | Zero references |

**Active assets remaining:** 3.5 MB (17 files: 2 videos, 15 images/PNGs)

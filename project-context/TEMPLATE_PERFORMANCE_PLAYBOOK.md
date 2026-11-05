# Template Performance Playbook

Step-by-step guide for optimizing invitation template performance. Developed during the Secret Garden (template 5) optimization. Apply to each new or existing template.

---

## Phase 1 — Asset Optimization

Reduce file sizes before touching any code. This is the biggest bang-for-buck.

### 1.1 Images: PNG/JPG → WebP

Convert all template images to WebP. Typical savings: 70–90%.

**Steps:**
1. List all images in `public/templates/{template}/assets/`
2. Convert each to WebP using `cwebp` or an online tool (quality 80–85 is usually indistinguishable)
3. Keep the original file as `{name}-original.{ext}` for reference
4. Update all `src=` references in the template component and CSS to use `.webp`
5. Visually verify every image — some transparency or detail may need higher quality

**Secret Garden results:**

| Asset | PNG | WebP | Savings |
|-------|-----|------|---------|
| pearl-clock | 2.8 MB | 221 KB | 92% |
| food | 2.5 MB | 273 KB | 89% |
| dress-code-new | 2.7 MB | 139 KB | 95% |
| ornate-badge | 1.0 MB | 48 KB | 95% |
| couple | 1.9 MB | 303 KB | 84% |
| lights | 652 KB | 139 KB | 79% |
| footer-flowers | 446 KB | 212 KB | 52% |

### 1.2 Video: MOV → MP4 (H.264)

Convert decorative/background videos from MOV to MP4. MOV files are often 10x larger.

**Steps:**
1. Use `ffmpeg` to convert: `ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -an output.mp4`
2. For background/ambient videos (not primary content), use higher CRF (28–32) and lower resolution
3. Strip audio track with `-an` if the video is decorative (muted in code)
4. Keep the original MOV for reference

**Secret Garden results:**

| Asset | MOV | MP4 | Savings |
|-------|-----|-----|---------|
| celebrations | 2.8 MB | 267 KB | 90% |

### 1.3 Audio: MP3 Compression + Trimming

**Compression:**
1. Re-encode to 128 kbps: `ffmpeg -i input.mp3 -b:a 128k output.mp3`
2. 128 kbps is transparent quality for background music on phone speakers
3. Keep the full-quality file as `{name}-full.mp3`

**Trimming (template-specific — ask before trimming):**
1. Some templates loop a shorter clip; others play a full song
2. Ask: "Do you want to trim this track? If so, to what duration?"
3. Trim with: `ffmpeg -i input.mp3 -t {seconds} -b:a 128k output.mp3`

**Secret Garden results:**

| Asset | Original | Optimized | Savings |
|-------|----------|-----------|---------|
| autumn-wind | 6.8 MB (320 kbps) | 938 KB (128 kbps, trimmed) | 86% |

### 1.4 Cleanup

After converting, the original files still sit in `public/` and get deployed.
- Originals kept as `*-original.*` are fine — they aren't referenced in code
- Files like `.mov` or `.png` that are fully replaced should be removed to reduce deploy size
- Verify no code references the old filenames before deleting: `grep -rn 'filename.png' src/`

---

## Phase 2 — Loading Strategy

Control **when** and **how** assets load. The goal: the guest can interact instantly, and below-fold assets load in the background.

### 2.1 No Preload Gates on Interaction

**Rule:** Never block the "Tap to open" button (or any user interaction) behind full asset downloads.

**Why:** Mobile browsers often ignore `preload="auto"` on `<video>` elements to save bandwidth. A `fetch().blob()` gate forces the entire file to download before enabling the button. On slow connections this means 5–10 seconds of "Loading…".

**Pattern:**
```tsx
// BAD — blocks interaction behind full download
const [ready, setReady] = useState(false)
useEffect(() => {
  fetch('/assets/hero-video.mp4').then(r => r.blob()).then(() => setReady(true))
}, [])
<button disabled={!ready}>Tap to open</button>

// GOOD — tap always works, video plays when ready
function openInvitation() {
  if (opened) return
  setOpened(true)
  video.currentTime = 0
  video.play().catch(() => {
    // Video not buffered yet — wait for it, then retry
    const tryAgain = () => { video.currentTime = 0; video.play().catch(() => showContent()) }
    if (video.readyState >= 3) { tryAgain(); return }
    video.addEventListener('canplaythrough', tryAgain, { once: true })
    // Give up after 5 seconds if video never loads
    setTimeout(() => { video.removeEventListener('canplaythrough', tryAgain); showContent() }, 5000)
  })
}
```

### 2.2 Preload Hints for Below-Fold Assets

Fire `<link rel="preload">` hints on mount for assets that appear after the opening section. This tells the browser to start fetching them early without blocking render.

```tsx
useEffect(() => {
  const urls = [
    '/templates/{template}/assets/section-2-image.webp',
    '/templates/{template}/assets/background-video.mp4',
    // ... all assets visible after opening
  ]
  const links = urls.map(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.setAttribute('as', href.endsWith('.mp4') ? 'video' : 'image')
    document.head.appendChild(link)
    return link
  })
  return () => { links.forEach(link => link.remove()) }
}, [])
```

**Don't include** assets that are already loaded via other means:
- Images with `priority` prop on `InvitationMedia` (already eager-loaded)
- The hero video (already has `preload="auto"` on the element)

### 2.3 InvitationMedia: Priority vs Lazy

The `InvitationMedia` component handles this automatically:

| Prop | `loading` | `fetchPriority` | Use for |
|------|-----------|-----------------|---------|
| `priority` | `eager` | `high` | Above-fold images (hero poster, opening art) |
| default | `lazy` | `auto` | Everything below the fold |

Only the first visible image should get `priority`. Everything else lazy-loads as the guest scrolls.

### 2.4 Video Visibility Gating

Decorative videos should pause when not visible to save CPU/battery:

```tsx
function AmbientVideo({ src, poster, className }) {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = video.current
    if (!el) return
    el.muted = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => {
      if (visible && !motion.matches && !document.hidden) void el.play().catch(() => {})
      else el.pause()
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting; sync()
    })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    sync()
    return () => { observer.disconnect(); /* ... cleanup */ }
  }, [])
  return <video ref={video} src={src} poster={poster} muted loop playsInline />
}
```

Key behaviors:
- Pauses when scrolled out of view (IntersectionObserver)
- Pauses when tab is hidden (visibilitychange)
- Respects `prefers-reduced-motion`
- Multiple elements with the same `src` share the browser HTTP cache — no extra network cost

### 2.5 Music: Decouple from Interaction

Music should never gate user interaction. It loads and plays independently after the invitation opens:

- The `PersonalMusic` component mounts only after `opened` is true
- It handles its own buffering and playback
- No need to prefetch the music file before the guest can tap

---

## Phase 3 — Caching

Leverage HTTP caching so returning guests load instantly.

### 3.1 Vercel Cache Headers (vercel.json)

Already configured project-wide:

| Content | Cache-Control | Duration |
|---------|--------------|----------|
| Images (`.webp`, `.jpg`, `.png`, `.svg`) | `max-age=2592000` | 30 days |
| Video (`.mp4`, `.mov`) | `max-age=2592000` | 30 days |
| Audio (`.mp3`) | `max-age=2592000` | 30 days |
| Fonts (`.woff2`) | `max-age=31536000, immutable` | 1 year |
| JS/CSS (Vite hashed) | `max-age=31536000, immutable` | 1 year |

No service worker needed. The browser HTTP cache handles repeat visits — assets are served from disk instantly on the second visit.

### 3.2 Font Loading

Templates load their own fonts via `@font-face` in their CSS:
- Use `font-display: swap` — text is visible immediately with a fallback font, then swaps when the custom font loads
- Use `.woff2` format (smallest)
- Native templates do NOT use the shared `SiteFonts` Google Fonts set — this avoids loading fonts the template doesn't need

---

## Checklist

Use this when optimizing a template:

### Asset optimization
- [ ] All images converted to WebP (verify appearance)
- [ ] Videos converted from MOV to MP4 (H.264, CRF 28+)
- [ ] Audio stripped from muted/decorative videos
- [ ] Background music compressed to 128 kbps
- [ ] Background music trimmed if appropriate (ask first)
- [ ] Original files renamed to `*-original.*` or removed
- [ ] No code references old filenames (`grep -rn` to verify)

### Loading strategy
- [ ] No preload gate on "Tap to open" or primary interaction
- [ ] Opening video uses retry-on-ready pattern with timeout fallback
- [ ] Below-fold assets have `<link rel="preload">` hints
- [ ] Opening image has `priority` prop; all others use lazy loading
- [ ] Decorative videos pause when off-screen / tab hidden / reduced-motion
- [ ] Music loads independently after opening — not part of any gate

### Caching
- [ ] Verify `vercel.json` cache headers cover the template's asset types
- [ ] Fonts use `font-display: swap` and `.woff2` format
- [ ] Template does not load `SiteFonts` (native templates manage their own)

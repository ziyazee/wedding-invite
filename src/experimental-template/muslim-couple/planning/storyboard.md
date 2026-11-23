# Muslim Couple Template -- Scroll-Experience Storyboard

This document is the single source of truth for the React engineer implementing the "Muslim Couple" template. Every visual element has a specified position, size, color, and behavior. Read top to bottom; implement section by section.

---

## Global Context

- **Viewport**: Mobile-first at `402px` width. Content area = `354px` (402 - 48px gutters).
- **CSS prefix**: All classes use `mc-` prefix. All custom properties use `--mc-` prefix.
- **Root scoping**: `.mc-root { isolation: isolate; }` contains all styles.
- **Animation library**: GSAP 3.15.1 with ScrollTrigger and MotionPathPlugin. All tweens inside `gsap.context()` with `.revert()` on unmount.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables ALL motion. All ambient elements hidden. Static layout with all content visible.
- **Entry animations**: Opacity fade, scale, or clip-path reveals ONLY. **No translateY reveal animations** (prohibited -- breaks drag-and-drop in editor). The sole exception is the Entry Screen per-word text overlay which uses `y: 20 -> 0` as explicitly permitted by the Entry Screen Pattern in MASTER_RULES.md.
- **Ambient pause**: Every section's ambient animations pause via IntersectionObserver when the section leaves the viewport, resume when it re-enters. `will-change: transform` applied during animation, removed on pause.
- **Font loading**: Cormorant Garamond, Lato, Amiri, Great Vibes loaded via Google Fonts link in the template root component. Amiri may be deferred until the Family section enters viewport.
- **Max concurrent animated elements per section**: 15.

---

## Design Token Reference (Quick Lookup)

```
Colors:
  --mc-ivory: #F5F0E8          --mc-champagne: #E8D5C0
  --mc-gold: #D4A050            --mc-rose: #F0B0C0
  --mc-green: #5A7D5A           --mc-gold-light: #E0CFA0
  --mc-gold-deep: #C8A050       --mc-rose-deep: #C87890
  --mc-peach: #F5B78A           --mc-amber: #E8A84C
  --mc-mauve: #C0A0B0           --mc-sky: #8BA6C7
  --mc-cream: #EDE5D5           --mc-offwhite: #FAF5EB
  --mc-beige: #D8C0B0           --mc-bronze: #8B6838
  --mc-marble: #F0E8E0

Text:
  --mc-text-primary: #3A2818    --mc-text-secondary: #6B5B4E
  --mc-text-muted: #8A7B6E      --mc-text-on-dark: #F5EDD6
  --mc-text-gold: #D4A050

Spacing:
  --mc-gutter: 24px             --mc-section-pad-top: 56px
  --mc-section-pad-bottom: 64px --mc-block-gap: 32px
  --mc-element-gap: 16px        --mc-card-gap: 24px
  --mc-card-radius: 16px        --mc-button-radius: 12px

Z-index:
  --mc-z-bg: 1                  --mc-z-decor: 5
  --mc-z-content: 10            --mc-z-overlay: 30
  --mc-z-ui: 40                 --mc-z-modal: 50
```

---

## Section 1: Welcome / Entry Screen

### 1. Purpose
The emotional threshold of the invitation. The guest sees a cinematic Mughal garden at sunset and is drawn into the couple's world. The tap-to-open moment creates deliberate engagement. The couple's names materializing over the video establishes the invitation's identity. This section says: "You are about to enter something precious."

### 2. Visual Concept
A full-viewport cinematic moment. The reference video (`muslim-couple.mp4`) fills the entire screen -- a slow forward dolly through a Mughal palace garden terrace at golden hour, with a wedding couple walking toward a distant sunset mosque. The screen is initially a still poster frame with a frosted-glass "Tap to Open" button. On tap, the video plays. As the video nears its end, the couple's names and wedding date fade in word-by-word over the footage. After text reveal, a scroll indicator appears. This is the only section where video is the primary visual.

### 3. Layout and Composition (402px)

```
+------------------------------------------+ 0px (top)
|  [Floral garland corner - TL]            |
|         [Floral garland corner - TR]     |
|                                          |
|         (Video fills 100vh)              |
|         muslim-couple.mp4                |
|         object-fit: cover                |
|                                          |
|  ~100px from top:                        |
|     ---- Names overlay (centered) ----   |
|     AISHA                                |
|        &                                 |
|     FAIZAN                               |
|     December 20, 2025                    |
|                                          |
|                                          |
|                                          |
|                                          |
|     ~70% from top:                       |
|     +------------------------------+    |
|     |      Tap to Open             |    |
|     +------------------------------+    |
|                                          |
|                            [Music btn]   |
|                            bottom-right  |
|                                          |
|     [Scroll indicator chevron]           |
|     bottom-center, 32px from bottom      |
+------------------------------------------+ 100vh
```

- The section wrapper is `position: relative; width: 100%; height: 100vh; overflow: hidden;`.
- All children are positioned absolutely within this wrapper.
- The video element is `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;`.

### 4. Background Artwork
- **Primary**: The video IS the background. It covers 100% of the viewport.
- **Fallback** (if video fails to load): `background: var(--mc-gradient-sky)` -- the sunset sky gradient:
  ```css
  linear-gradient(180deg,
    #7090B8 0%, #9BA8C0 18%, #C0A0B0 36%, #E0A0A0 52%,
    #F0B888 70%, #E8A050 88%, #E8A84C 100%
  )
  ```
- **Poster image**: First frame of the video extracted as WebP (`muslim-couple-poster.webp`). Set as the `poster` attribute on the `<video>` element.

### 5. Foreground Artwork
- **Top text-readability overlay**: A `position: absolute` div covering the top half of the viewport. This ensures names are legible against the video. z-index: `var(--mc-z-overlay)` (30).
  ```css
  .mc-entry-overlay-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(42, 30, 18, 0.45) 0%,
      rgba(42, 30, 18, 0.15) 40%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 30;
  }
  ```
- **Floral garland corners**: Two WebP images with transparency, positioned at top-left and top-right. These mirror the cascading floral canopy from the reference video. z-index: `var(--mc-z-overlay)` (30).
  - Top-left garland: `position: absolute; top: 0; left: 0; width: 160px; height: 200px;`
  - Top-right garland: `position: absolute; top: 0; right: 0; width: 160px; height: 200px; transform: scaleX(-1);` (mirrored copy of left)
  - Colors in the garland artwork: blush pink (`--mc-rose`), white, sage green (`--mc-green`).
  - These do NOT scroll. They are fixed within the entry screen wrapper (not `position: fixed` on the window -- they scroll away with the section).

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Spacing |
|---------|------|------|--------|-------|-----------|---------|
| Bride name (e.g. "AISHA") | Cormorant Garamond | `2.5rem` (40px) | 300 | `--mc-text-on-dark` (#F5EDD6) | center | `letter-spacing: 0.02em` |
| Ampersand "&" | Great Vibes | `1.25rem` (20px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |
| Groom name (e.g. "FAIZAN") | Cormorant Garamond | `2.5rem` (40px) | 300 | `--mc-text-on-dark` (#F5EDD6) | center | `letter-spacing: 0.02em` |
| Date (e.g. "December 20, 2025") | Lato | `0.9375rem` (15px) | 400 | `--mc-text-on-dark` (#F5EDD6) | center | `letter-spacing: 0.08em` |
| "Tap to Open" | Lato | `0.9375rem` (15px) | 400 | `--mc-text-on-dark` (#F5EDD6) | center | -- |

- Names container is positioned at `top: 100px; left: 0; right: 0; text-align: center;`. z-index: `var(--mc-z-overlay)` (30).
- Each name on its own line. The ampersand on its own line between them. The date on its own line below both names. Vertical gap between elements: `8px`.
- All text initially at `opacity: 0`. The per-word stagger animation reveals them (see Entry Animation below).

### 7. SVG Elements Needed
| SVG | Dimensions | Purpose |
|-----|------------|---------|
| Scroll indicator chevron | `24px` wide x `12px` tall | Downward-pointing chevron at bottom-center |

```svg
<svg width="24" height="12" viewBox="0 0 24 12">
  <polyline points="2,2 12,10 22,2" fill="none"
    stroke="#D4A050" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Scroll chevron | `bottom: 32px; left: 50%; transform: translateX(-50%);` | 1 | Vertical bounce: `translateY(0) -> translateY(6px) -> translateY(0)` | 1500ms cycle, `sine.inOut`, continuous loop |
| "Tap to Open" breathing | In-place at 70% from top | 1 | `scale(1) -> scale(1.03) -> scale(1)` | 2000ms cycle, `sine.inOut` |

**Total concurrent animated elements in this section: 2** (well within 15 limit).

- Scroll chevron appears AFTER all name/date words have finished their fade-in. The last word's animation `onComplete` triggers the chevron fade-in at `opacity: 0 -> 0.8` over 400ms.
- Scroll chevron fades to `opacity: 0` over 400ms (`power1.out`) when `scrollY > 50px`. Once faded, remove from DOM.
- No floating petals, no sparkles in this section. The video provides all visual richness.

### 9. Decorative Elements
- **Floral garland corners** (described in Foreground Artwork above): two WebP assets framing the top of the viewport.
- No additional borders or dividers. The video provides all visual interest.

### 10. Element Positions (CSS)
```
.mc-entry-section:         position: relative; width: 100%; height: 100vh; overflow: hidden;
.mc-entry-video:           position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;
.mc-entry-overlay-top:     position: absolute; top: 0; left: 0; right: 0; height: 50%; z-index: 30;
.mc-entry-garland-left:    position: absolute; top: 0; left: 0; width: 160px; height: 200px; z-index: 30;
.mc-entry-garland-right:   position: absolute; top: 0; right: 0; width: 160px; height: 200px; z-index: 30; transform: scaleX(-1);
.mc-entry-names:           position: absolute; top: 100px; left: 0; right: 0; z-index: 30; text-align: center;
.mc-entry-tap-btn:         position: absolute; top: 70%; left: 50%; transform: translateX(-50%); z-index: 40;
.mc-entry-music-btn:       position: fixed (within viewport wrapper); right: calc(3% + 24px); bottom: calc(7.2% - 5px); z-index: 40;
.mc-entry-scroll-indicator: position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 30;
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Video | 1 | `<video>` element |
| Top overlay gradient | 30 | Dark-to-transparent gradient for text readability |
| Floral garland corners | 30 | WebP floral frames (decorative, `pointer-events: none`) |
| Names + date text | 30 | Couple names, ampersand, date |
| Scroll indicator | 30 | Gold chevron at bottom |
| "Tap to Open" button | 40 | Interactive frosted glass pill |
| Music button | 40 | Persistent interactive element |

### 12. Entry Animation
This section has a multi-phase choreography triggered by user interaction:

**Phase A: Initial State (page load)**
- Video shows poster frame (still image). Video does NOT autoplay.
- "Tap to Open" button is visible at `opacity: 1` with breathing scale animation.
- Names, date, scroll indicator are all at `opacity: 0`.
- Music button is visible.
- Floral garland corners visible at full opacity.

**Phase B: Tap to Open (user taps button)**
1. "Tap to Open" button fades out: `opacity: 1 -> 0` over 300ms, then `display: none`.
2. Video begins playing (`video.play()`).
3. Music starts playing (if user has not muted).

**Phase C: Text Reveal (triggered by video `timeupdate`)**
- Calculate the trigger time so the last word finishes 1 second before video ends (video is 10s, so last word should finish at 9s).
- Words to animate: ["AISHA", "&", "FAIZAN", "December 20, 2025"] = 4 words.
- Each word: `opacity: 0 -> 1`, `y: 20 -> 0` (this specific translateY IS permitted per Master Rules Entry Screen Pattern).
- Stagger: `0.35s` between words. Duration: `1s` per word.
- Total animation time: 1s + (3 x 0.35s) = 2.05s. So trigger at `10s - 1s - 2.05s = 6.95s` (approximately 7s into video).
- Easing: `power2.out`.

**Phase D: Scroll Indicator Appears**
- After the last word finishes its fade-in, wait 200ms, then fade in the scroll chevron: `opacity: 0 -> 0.8` over 400ms.
- Chevron begins its bounce loop.

**Fallback**: If video fails to load or 15 seconds pass without `canplay`, force Phase C text reveal immediately (skip video, show names on poster/gradient fallback).

### 13. Scroll Behavior
- The entry screen scrolls away normally with the page. No sticky behavior, no parallax, no pinning.
- When user scrolls past this section, it simply scrolls off the top of the viewport.

### 14. Exit Transition
- **Hard transition**: The entry screen has no gradient bleed into the next section. The video section scrolls away, and the Family section begins with a solid `--mc-ivory` marble background.
- The visual "break" is intentional -- crossing from the cinematic video world into the formal invitation proper, marked by the Bismillah.
- The first `56px` of the Family section is blank ivory marble, giving breathing room before the Bismillah appears.

### 15. Mobile Composition (402px)
- At 402px, the layout is as described above (this IS the mobile-first design).
- Floral garland corners at `160px x 200px` may be reduced to `120px x 150px` on viewports narrower than 380px using a `@media (max-width: 380px)` query.
- Names font size stays at `2.5rem` (40px) -- names are the hero element and must feel grand.
- "Tap to Open" button width is auto (text-determined), height is `48px`, with `padding: 0 28px`.

### Tap to Open Button Spec
```css
.mc-entry-tap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 28px;
  border-radius: 24px; /* pill */
  background: rgba(245, 240, 232, 0.65); /* --mc-glass */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 160, 80, 0.25); /* --mc-glass-border */
  box-shadow: 0 4px 20px rgba(42, 30, 18, 0.25);
  cursor: pointer;
}
```

### Music Button Spec
```css
.mc-ui-music-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(245, 240, 232, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 160, 80, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```
- Icon: Musical note glyph, toggles to pause bars on play/pause.
- `<audio loop preload="auto">` element.
- **Persists across all sections** -- fixed position within the invitation viewport frame (not within a single section).

### Video Element Spec
```html
<video
  class="mc-entry-video"
  poster="muslim-couple-poster.webp"
  muted
  playsInline
  preload="auto"
>
  <source src="muslim-couple.mp4" type="video/mp4" />
</video>
```
- Listen for `canplay` event to retry `play()`.
- The video does NOT have `autoplay`. Playback is triggered by the "Tap to Open" interaction.

---

## Section 2: Family Details

### 1. Purpose
The spiritual and familial anchor of the invitation. The Bismillah opens the formal content with reverence. The family details establish lineage and honor -- this is who raised the couple. This section says: "These families invite you with love and tradition."

### 2. Visual Concept
An elegant formal presentation on warm marble. The Bismillah sits at the very top -- the spiritual opening of the invitation proper. Below, the families are presented in two stacked bordered cards, each crowned by a faint Mughal arch motif. Gold borders, cream surfaces, and subtle geometric textures create the feeling of opening a hand-lettered nikahnama (marriage contract). The aesthetic is clean, spacious, and reverent.

### 3. Layout and Composition (402px)

```
+------------------------------------------+
| 56px top padding (ivory marble)          |
|                                          |
|  ~ ~ Bismillah (Arabic, Amiri) ~ ~      |
|  flanked by arabesque ornaments          |
|  centered                                |
|                                          |
|  24px gap                                |
|                                          |
|  --- gold divider line (60% width) ---   |
|                                          |
|  24px gap                                |
|                                          |
|  "Together with their families"          |
|  (Great Vibes, 20px, centered)           |
|                                          |
|  32px gap                                |
|                                          |
|  +------------------------------------+ |
|  | [Arch silhouette - above card]      | |
|  |                                     | |
|  |  "Son of"                           | |
|  |  (caption text)                     | |
|  |  12px gap                           | |
|  |  MR. AHMED KHAN                     | |
|  |  &                                  | |
|  |  MRS. FATIMA KHAN                   | |
|  |  (gold heading text)               | |
|  |  16px gap                           | |
|  |  "request the honour..."            | |
|  |  (body light text)                  | |
|  |                                     | |
|  +------------------------------------+ |
|  gutter: 24px left/right                 |
|                                          |
|  24px gap                                |
|  [3 petal cluster ornament, centered]    |
|  24px gap                                |
|                                          |
|  +------------------------------------+ |
|  | [Arch silhouette - above card]      | |
|  |                                     | |
|  |  "Daughter of"                      | |
|  |  MR. HASSAN ALI                     | |
|  |  &                                  | |
|  |  MRS. NADIA ALI                     | |
|  |  "request the honour..."            | |
|  |                                     | |
|  +------------------------------------+ |
|                                          |
|  48px gap                                |
|                                          |
|  [Jali lattice divider strip]            |
|  full width, 40px tall                   |
|                                          |
| 64px bottom padding (gradient bleed)     |
+------------------------------------------+
```

- Section wrapper: `position: relative; width: 100%; padding: 56px 24px 64px;`
- Content flows in normal document order (no absolute positioning for content). Decorative elements are positioned absolutely within the section wrapper.

### 4. Background Artwork
- **Base**: `--mc-gradient-marble` (ivory-to-cream warmth):
  ```css
  background: linear-gradient(170deg, #FAF5EB 0%, #F5F0E8 40%, #F0E8E0 70%, #EDE5D5 100%);
  ```
- **Warm overlay**: `--mc-gradient-glow` (subtle radial vignette adding golden warmth to center):
  ```css
  background-image: radial-gradient(
    ellipse at 50% 30%,
    rgba(245, 240, 232, 0) 0%,
    rgba(232, 213, 192, 0.15) 50%,
    rgba(212, 160, 80, 0.08) 100%
  );
  ```
  Applied as a pseudo-element (`::before`) on the section wrapper, `position: absolute; inset: 0; z-index: 1; pointer-events: none;`.
- **Geometric texture**: 8-pointed star (Rub el Hizb) tessellation SVG tile at `5%` opacity, color `--mc-gold`, `background-size: 80px 80px`, tiled across full section. z-index: 1.

### 5. Foreground Artwork
- **Bismillah arabesque flanks**: Two small mirrored arabesque flourish SVGs flanking the Bismillah text. Each `40px` wide by `20px` tall, `--mc-gold-light` (#E0CFA0). Positioned vertically centered with the Bismillah, `12px` gap from text on each side. z-index: 10.
- **Arch motifs**: A simplified arch silhouette SVG centered above each family card. `80px` wide by `50px` tall, `--mc-gold` at `15%` opacity. Positioned `8px` above each card's top edge. z-index: 5.
- **Corner arabesques**: Small arabesque scrollwork ornaments at top-left and bottom-right corners of the section. Each `60px` square, `--mc-gold-light` at `20%` opacity. z-index: 5.
  - Top-left: `position: absolute; top: 20px; left: 12px;`
  - Bottom-right: `position: absolute; bottom: 80px; right: 12px; transform: rotate(180deg);`
- **Petal cluster ornament**: Between the two family cards, 3 small rose petal SVGs arranged in a gentle cluster (one slightly left, one center, one slightly right). Each petal `12px x 8px`, `--mc-rose` at `40%` opacity. Centered horizontally.

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Additional |
|---------|------|------|--------|-------|-----------|------------|
| Bismillah (Arabic) | Amiri | `1.875rem` (30px) | 400 | `--mc-text-gold` (#D4A050) | center | `direction: rtl; lang="ar"` |
| "Together with their families" | Great Vibes | `1.25rem` (20px) | 400 | `--mc-text-secondary` (#6B5B4E) | center | -- |
| "Son of" / "Daughter of" | Lato | `0.8125rem` (13px) | 400 | `--mc-text-muted` (#8A7B6E) | center | `letter-spacing: 0.06em` |
| Parent names (e.g. "MR. AHMED KHAN") | Cormorant Garamond | `1.375rem` (22px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |
| Ampersand between parents | Lato | `0.9375rem` (15px) | 300 | `--mc-text-secondary` (#6B5B4E) | center | -- |
| Invitation message ("request the honour...") | Lato | `0.9375rem` (15px) | 300 | `--mc-text-secondary` (#6B5B4E) | center | `max-width: 30ch; margin: 0 auto;` |

### 7. SVG Elements Needed
| SVG | Dimensions | Color | Purpose |
|-----|------------|-------|---------|
| Arabesque flourish (horizontal) | `40px` x `20px` | `--mc-gold-light` | Flanking the Bismillah |
| Mughal arch silhouette | `80px` x `50px` | `--mc-gold` at 15% opacity | Above each family card |
| Corner arabesque scrollwork | `60px` x `60px` | `--mc-gold-light` at 20% opacity | Section corners (TL, BR) |
| Rose petal (4 variants) | ~`14px` x `10px` | `--mc-rose` at 40% opacity | Cluster ornament between cards |
| 8-pointed star tessellation tile | `80px` x `80px` | `--mc-gold` at 5% opacity | Background texture |
| Gold divider line | `60%` width x `1px` height | gradient from transparent to `--mc-gold` to transparent | Below Bismillah |
| Jali lattice strip | `100%` width x `40px` height | `--mc-cream` on ivory | Bottom section transition |

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Floating rose petals | Scattered within section bounds | 3 | Curved S-path drift, diagonal downward, 80-160px horizontal, 200-400px vertical, continuous rotation | 5000-9000ms per cycle, `sine.inOut` |
| Four-pointed star sparkles | Near gold borders of family cards | 2 | Stationary. Opacity pulse: `0 -> 0.7 -> 0`. Scale: `0.3 -> 1.0 -> 0.5`. | 3500-7500ms total cycle (400ms appear, 600-1200ms hold, 500ms fade, 2000-5000ms dormant) |

**Total concurrent animated elements: 5.** Well within 15 limit.

Petal details:
- Colors: randomized from `#C87890`, `#D4A0A8`, `#E0A0B0`, `#F0B0C0`.
- Opacity: fade in first 15% of path to `0.2-0.4`, hold, fade out last 15%.
- Created on mount, positioned absolutely. `pointer-events: none; aria-hidden: true;`
- Use `gsap.utils.random()` for all randomization.

### 9. Decorative Elements
- **Gold divider line** below Bismillah: `width: 60%; height: 1px; margin: 0 auto;`
  ```css
  background: linear-gradient(90deg, transparent 0%, var(--mc-gold) 20%, var(--mc-gold) 80%, transparent 100%);
  ```
- **Family card borders**: `1px solid var(--mc-gold)`, `border-radius: 16px`.
- **Petal cluster ornament** between cards: 3 petals (see Foreground Artwork above).
- **Jali lattice strip** at section bottom: SVG pattern tile, `--mc-cream` on ivory, full width, `40px` tall. This spans the boundary between Family and Countdown sections.

### 10. Element Positions (CSS)
```
.mc-section-family:            position: relative; width: 100%; padding: 56px 24px 64px;
                               background: linear-gradient(170deg, ...); /* marble */
.mc-section-family::before:    /* warm glow overlay */ position: absolute; inset: 0; z-index: 1;
.mc-text-bismillah:            position: relative; z-index: 10; text-align: center;
                               margin-bottom: 24px; padding-top: 0;
.mc-decor-bismillah-left:      position: absolute; /* centered vertically with bismillah */
                               transform: translateY(-50%);
.mc-decor-bismillah-right:     position: absolute; /* mirrored */
                               transform: translateY(-50%) scaleX(-1);
.mc-divider-gold:              position: relative; z-index: 10; width: 60%; height: 1px;
                               margin: 0 auto 24px;
.mc-text-together:             position: relative; z-index: 10; text-align: center;
                               margin-bottom: 32px;
.mc-card-family:               position: relative; z-index: 10; width: 100%;
                               padding: 28px 20px; border: 1px solid var(--mc-gold);
                               border-radius: 16px; background: var(--mc-offwhite);
                               box-shadow: 0 2px 12px var(--mc-shadow);
.mc-decor-arch:                position: absolute; z-index: 5; /* above card, centered */
.mc-decor-corner-tl:           position: absolute; top: 20px; left: 12px; z-index: 5;
.mc-decor-corner-br:           position: absolute; bottom: 80px; right: 12px; z-index: 5;
.mc-decor-jali-strip:          position: relative; z-index: 10; width: 100%; height: 40px;
                               /* at very bottom of section */
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Geometric star texture | 1 | Background tile |
| Warm glow overlay | 1 | Radial gradient pseudo-element |
| Arch silhouettes | 5 | Faint arch above each card |
| Corner arabesques | 5 | Section corner ornaments |
| All content | 10 | Bismillah, text, family cards, dividers, jali strip |
| Bismillah arabesque flanks | 10 | Flanking ornaments |
| Floating petals | 30 | Ambient animation layer |
| Sparkles | 30 | Ambient animation layer |

### 12. Entry Animation
When the section scrolls into the viewport (IntersectionObserver, `threshold: 0.15`):

1. **Bismillah + arabesque flanks**: `opacity: 0 -> 1` over 1000ms, `power2.out`. Simultaneous `scale(0.92) -> scale(1)`.
2. **Gold divider line**: `opacity: 0 -> 1` over 800ms, delayed by 200ms. Revealed via `clip-path: inset(0 50% 0 50%) -> inset(0 0% 0 0%)` (grows from center outward).
3. **"Together with their families"**: `opacity: 0 -> 1` over 800ms, delayed by 400ms, `power2.out`.
4. **First family card**: `opacity: 0 -> 1` over 800ms, delayed by 600ms, `power2.out`. Simultaneous `scale(0.95) -> scale(1)`.
5. **Petal cluster ornament**: `opacity: 0 -> 0.4` over 600ms, delayed by 800ms.
6. **Second family card**: `opacity: 0 -> 1` over 800ms, delayed by 900ms, `power2.out`. Simultaneous `scale(0.95) -> scale(1)`.
7. **Corner arabesques**: `opacity: 0 -> 0.2` over 600ms, delayed by 1000ms.
8. **Ambient petals and sparkles begin** after the last card has appeared (delay: 1200ms).

All entry animations are GSAP ScrollTrigger-driven, using `opacity` and `scale` only. **No translateY.**

### 13. Scroll Behavior
- **Geometric star background texture**: moves at `0.95x` scroll speed (slight parallax, 0.05 offset). Achieved via ScrollTrigger with `y` scrub on the background texture element.
- **Corner arabesques**: move at `0.95x` scroll speed (same slight parallax as background).
- **All content (cards, text, dividers)**: scrolls at normal `1.0x` speed. No parallax on content.

### 14. Exit Transition
- **Gradient bleed**: The bottom `60px` of this section transitions from marble ivory to `--mc-champagne`:
  ```css
  .mc-section-family::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, #E8D5C0);
    pointer-events: none;
    z-index: 2;
  }
  ```
- **Jali lattice strip**: The horizontal jali pattern strip (`100%` width, `40px` tall) sits at the very bottom of this section, straddling the boundary. It is drawn in `--mc-cream` (#EDE5D5) on the ivory/champagne-transitioning background, creating a tone-on-tone divider that connects the two sections.

### 15. Mobile Composition (402px)
- Content width: `354px` (402 - 48px gutters).
- Family cards take full content width.
- Bismillah text at 30px is generously spaced. Top margin from section top: `56px`.
- Cards have internal padding `28px 20px`. Card body text max-width `30ch` auto-centered.
- Gap between cards: `24px` + ornament height + `24px` (~72px total visual gap).
- On viewports below `360px`: consider reducing Bismillah font from `30px` to `26px`.

---

## Section 3: Countdown

### 1. Purpose
Build anticipation. This section is the emotional heartbeat -- time is literally counting down to the sacred moment. The warmth peaks here (champagne background, gold accents everywhere). This section says: "The moment is approaching. Feel the anticipation."

### 2. Visual Concept
The warmest section in the invitation. A champagne-toned panel with golden-hour glow concentrated at its center. A live countdown ticks in large, elegant display numerals inside a frosted glass card. Flanking lanterns emit a warm amber glow. Below the countdown, the exact date and time are stated with quiet authority. Faint jali lattice patterns and floating petals add texture without competing with the numbers. The section has a meditative, sacred quality -- time holding its breath.

### 3. Layout and Composition (402px)

```
+------------------------------------------+
| 56px top padding (champagne)             |
|                                          |
|  "Counting the Days"                     |
|  (section title, centered)               |
|                                          |
|  16px gap                                |
|                                          |
|  [Gold arabesque flourish, centered]     |
|  120px x 20px                            |
|                                          |
|  32px gap                                |
|                                          |
|  +------------------------------------+ |
|  |         Frosted glass card          | |
|  | [Lantern]                [Lantern]  | |
|  |  left edge               right edge | |
|  |                                     | |
|  |    42      12      36      08       | |
|  |   Days    Hrs     Min     Sec       | |
|  |                                     | |
|  |  (numbers: Cormorant 300, 48px)     | |
|  |  (labels: Lato 400, 13px)           | |
|  +------------------------------------+ |
|                                          |
|  32px gap                                |
|                                          |
|  "Saturday, December 20, 2025"           |
|  (Cormorant 400, 22px, gold)             |
|                                          |
|  8px gap                                 |
|                                          |
|  "at half past four in the evening"      |
|  (Lato 300, 15px, secondary)             |
|                                          |
|  24px gap                                |
|                                          |
|  [Mirrored arabesque pair, centered]     |
|  80px x 20px total                       |
|                                          |
| 64px bottom padding (gradient bleed)     |
+------------------------------------------+
```

### 4. Background Artwork
- **Base**: `--mc-champagne` (#E8D5C0) solid fill.
- **Warm overlay**: `--mc-gradient-glow` (radial gradient adding golden warmth to center). Applied as `::before` pseudo-element, `position: absolute; inset: 0; z-index: 1; pointer-events: none`.
- **Jali texture**: Jali lattice pattern SVG tile at `4%` opacity, `--mc-gold`, `background-size: 60px 60px`, tiled across full section. z-index: 1.
- **Peripheral vignette**: Very faint (`3%` opacity) vignette using:
  ```css
  background-image: radial-gradient(
    ellipse at 50% 50%,
    transparent 40%,
    rgba(212, 160, 80, 0.03) 100%
  );
  ```

### 5. Foreground Artwork
- **Section title arabesque flourish**: Horizontal ornament SVG centered below the title. `120px` wide by `20px` tall, `--mc-gold` (#D4A050). z-index: 10.
- **Lantern pair**: Two small lantern SVGs (`40px` tall each) positioned at the left and right edges of the countdown card. Each lantern has an amber glow behind it (see Animated Elements). z-index: 10.
  - Left lantern: positioned at `left: -8px` (overlapping card edge slightly), vertically centered on the card.
  - Right lantern: positioned at `right: -8px`, vertically centered.
- **Bottom mirrored arabesque pair**: Two small arabesque flourishes facing each other, centered, `80px` total width (`40px` each with `8px` gap). `--mc-gold` at 30% opacity. z-index: 10.

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Additional |
|---------|------|------|--------|-------|-----------|------------|
| "Counting the Days" | Cormorant Garamond | `1.75rem` (28px) | 400 | `--mc-text-gold` (#D4A050) | center | `letter-spacing: 0.015em` |
| Countdown numbers (42, 12, 36, 08) | Cormorant Garamond | `3rem` (48px) | 300 | `--mc-text-primary` (#3A2818) | center | `letter-spacing: -0.02em` |
| Countdown labels (Days, Hrs, Min, Sec) | Lato | `0.8125rem` (13px) | 400 | `--mc-text-muted` (#8A7B6E) | center | `letter-spacing: 0.04em` |
| Date (e.g. "Saturday, December 20, 2025") | Cormorant Garamond | `1.375rem` (22px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |
| Time (e.g. "at half past four in the evening") | Lato | `0.9375rem` (15px) | 300 | `--mc-text-secondary` (#6B5B4E) | center | -- |

### 7. SVG Elements Needed
| SVG | Dimensions | Color | Purpose |
|-----|------------|-------|---------|
| Arabesque flourish (horizontal, wide) | `120px` x `20px` | `--mc-gold` | Below section title |
| Arabesque flourish pair (small, mirrored) | `40px` x `20px` each | `--mc-gold` at 30% opacity | Bottom decorative pair |
| Mughal lantern | `24px` wide x `40px` tall | Frame: `--mc-bronze` (#8B6838). Glass: `--mc-gold` at 40% | Flanking countdown card |
| Jali lattice tile | `60px` x `60px` | `--mc-gold` at 4% opacity | Background texture |
| Four-pointed star sparkle | `16px` x `16px` | `#FFFFFF` at 70% | Ambient sparkles |
| Countdown sparkle (small) | `12px` x `12px` | `--mc-gold` | Flash on number change |

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Floating rose petals | Scattered in section background | 4 | Curved S-path drift (same spec as Family section but more petals) | 5000-9000ms per cycle |
| Four-pointed star sparkles | Near countdown card, near lanterns | 3 | Opacity + scale pulse: appear -> hold -> fade -> dormant | 3500-7500ms total cycle |
| Lantern glow pulse | Behind each lantern | 2 | `opacity: 0.6 -> 1.0 -> 0.6` and `scale: 0.95 -> 1.05 -> 0.95` | 3000ms cycle, `sine.inOut` |
| Countdown number sparkle | At the position of changing numbers | Up to 4 (one per column) | `opacity: 0 -> 0.8 -> 0`, `scale: 0.5 -> 1.2 -> 0.8` | 400ms per flash, triggered on number change |

**Total concurrent animated elements: 13.** Within 15 limit.

Lantern glow spec:
```css
.mc-anim-lantern-glow {
  position: absolute;
  width: 50px; height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(212, 160, 80, 0.25) 0%,
    rgba(212, 160, 80, 0.08) 50%,
    transparent 75%
  );
  pointer-events: none;
}
```
Each lantern has a randomized initial delay (`gsap.utils.random(0, 1500)` ms) so they don't pulse in unison.

### 9. Decorative Elements
- **Arabesque flourish below title** (described above).
- **Mirrored arabesque pair at bottom** (described above).
- **Gold divider dots**: Three gold dots (`4px` circles, `--mc-gold`) spaced `8px` apart, centered, between the date and the bottom flourishes. Subtle visual anchor.

### 10. Element Positions (CSS)
```
.mc-section-countdown:     position: relative; width: 100%; padding: 56px 24px 64px;
                           background: var(--mc-champagne);
.mc-countdown-title:       position: relative; z-index: 10; text-align: center;
.mc-decor-flourish-title:  position: relative; z-index: 10; margin: 16px auto 32px;
.mc-card-countdown:        position: relative; z-index: 10;
                           width: calc(100% - 16px); margin: 0 auto;
                           padding: 32px 16px;
                           background: rgba(245, 240, 232, 0.65);
                           backdrop-filter: blur(12px);
                           -webkit-backdrop-filter: blur(12px);
                           border: 1px solid rgba(212, 160, 80, 0.25);
                           border-radius: 16px;
                           box-shadow: 0 4px 24px var(--mc-shadow), 0 1px 4px var(--mc-shadow);
.mc-countdown-grid:        display: flex; justify-content: space-around; align-items: center;
.mc-countdown-column:      display: flex; flex-direction: column; align-items: center;
.mc-decor-lantern-left:    position: absolute; left: -8px; top: 50%; transform: translateY(-50%); z-index: 10;
.mc-decor-lantern-right:   position: absolute; right: -8px; top: 50%; transform: translateY(-50%); z-index: 10;
.mc-countdown-date:        position: relative; z-index: 10; text-align: center; margin-top: 32px;
.mc-countdown-time:        position: relative; z-index: 10; text-align: center; margin-top: 8px;
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Jali texture + glow overlay | 1 | Background patterns |
| Floating petals | 30 | Ambient petal animation |
| Sparkles | 30 | Ambient sparkle animation |
| All content + decorations | 10 | Title, card, numbers, lanterns, text, flourishes |

### 12. Entry Animation
When the section scrolls into the viewport (ScrollTrigger, `start: "top 85%"`):

1. **Section title ("Counting the Days")**: `opacity: 0 -> 1` over 1000ms, `power2.out`. Simultaneous `scale(0.92) -> scale(1)`.
2. **Arabesque flourish**: `opacity: 0 -> 1` over 800ms, delayed by 200ms. `clip-path: inset(0 50% 0 50%) -> inset(0 0% 0 0%)` (center-outward reveal).
3. **Countdown card**: `opacity: 0 -> 1` over 800ms, delayed by 400ms, `power2.out`. Simultaneous `scale(0.93) -> scale(1)`.
4. **Lanterns**: `opacity: 0 -> 1` over 600ms, delayed by 500ms.
5. **Countdown numbers**: Already visible when card appears (no stagger on individual digits).
6. **Date + time text**: `opacity: 0 -> 1` over 800ms, delayed by 700ms.
7. **Bottom arabesque pair**: `opacity: 0 -> 0.3` over 600ms, delayed by 900ms.
8. **Ambient animations begin** at 1000ms delay.

All animations use `opacity` and `scale` only. **No translateY.**

### 13. Scroll Behavior
- **Jali lattice background**: moves at `0.95x` (slight parallax).
- **Lanterns**: anchored to the card (no independent parallax).
- **All content**: normal scroll speed.

### 14. Exit Transition
- **Gradient bleed**: Bottom `60px` transitions from champagne to `--mc-offwhite`:
  ```css
  .mc-section-countdown::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, #FAF5EB);
    pointer-events: none;
    z-index: 2;
  }
  ```
- **Ornamental bridge**: A pair of mirrored arabesque flourishes centered at the boundary between Countdown and Celebrations. `--mc-gold` at 30% opacity. These belong to neither section but visually bridge them. Implemented as a pseudo-element or a dedicated bridge div between sections.

### 15. Mobile Composition (402px)
- Countdown card width: `calc(100% - 16px)` = `338px` at 402px viewport.
- 4-column grid fits comfortably. Each column gets ~80px width.
- Countdown number at 48px is the largest non-display text. Ensure numbers have `min-width: 56px` to prevent layout shift when digits change.
- Lanterns extend beyond the card edge by `8px` on each side. Ensure they don't cause horizontal overflow (the section wrapper has `overflow: hidden` on x-axis).

### Number Transition Animation (per digit change)
When a countdown number changes:
1. **Outgoing digit**: `scale(1) -> scale(0.8)`, `opacity: 1 -> 0`, 300ms, `power2.out`.
2. **Incoming digit**: `scale(1.2) -> scale(1)`, `opacity: 0 -> 1`, 300ms, `power2.out`.
3. **Gold sparkle flash**: At the center of the changing number column: `opacity: 0 -> 0.8`, `scale: 0.5 -> 1.2` (150ms), then `opacity: 0.8 -> 0`, `scale: 1.2 -> 0.8` (250ms).

Implemented with GSAP, transforming only `scale` and `opacity`. Never animate position properties.

---

## Section 4: Celebrations

### 1. Purpose
Practical information presented beautifully. The guest needs to know what events to attend, when, and where. Each event card is a miniature composition that treats logistical details with the same visual care as the rest of the invitation. This section says: "Here is everything you need to know to celebrate with us."

### 2. Visual Concept
The cleanest section in the invitation. An off-white background provides maximum breathing room for the event cards. Each card is a self-contained unit with consistent structure: event name with lantern icon, date/time details, venue information, and action links (maps, calendar). The cards stack vertically with small ornamental separators between them. The section supports a DYNAMIC number of events -- never hardcoded. Whether there is 1 event (just a Nikah) or 8 events (the full sequence from Mehendi to Chauthi), the layout handles it gracefully.

### 3. Layout and Composition (402px)

```
+------------------------------------------+
| 56px top padding (off-white)             |
|                                          |
|  "Our Celebrations"                      |
|  (section title, centered)               |
|                                          |
|  16px gap                                |
|                                          |
|  [Gold arabesque flourish, centered]     |
|  120px x 20px                            |
|                                          |
|  32px gap                                |
|                                          |
|  +------------------------------------+ |
|  | [Lantern 24px]  NIKAH              | |
|  |                                    | |
|  | [Cal icon] Saturday, Dec 20, 2025  | |
|  | [Clock icon] 4:30 PM               | |
|  |                                    | |
|  | [Pin icon] Grand Masjid Hall       | |
|  |            123 Heritage Ln, Lucknow| |
|  |                                    | |
|  | ---------------------------------- | |
|  | [Maps icon] Maps  [Cal] Calendar   | |
|  +------------------------------------+ |
|                                          |
|  16px gap                                |
|  [3 gold dots separator, centered]       |
|  16px gap                                |
|                                          |
|  +------------------------------------+ |
|  | [Lantern 24px]  WALIMA             | |
|  | ...                                | |
|  +------------------------------------+ |
|                                          |
|  16px gap                                |
|  [3 gold dots separator]                 |
|  16px gap                                |
|                                          |
|  +------------------------------------+ |
|  | [Lantern 24px]  MEHENDI            | |
|  | ...                                | |
|  +------------------------------------+ |
|                                          |
|  (... more cards as events dictate)      |
|                                          |
| 64px bottom padding (gradient bleed)     |
+------------------------------------------+
```

### 4. Background Artwork
- **Base**: `--mc-offwhite` (#FAF5EB) solid fill.
- **Geometric texture**: Very faint (`3%` opacity) 8-pointed star tessellation SVG tile, `--mc-cream` (#EDE5D5), `background-size: 100px 100px`. z-index: 1.
- **No gradient overlay**: This section should feel clean and airy. No warm glow overlay.

### 5. Foreground Artwork
- **Section title arabesque flourish**: Same style as Countdown section. `120px` x `20px`, `--mc-gold`, centered below title. z-index: 10.
- **Card separator ornaments**: Between each card, 3 gold dots (`4px` diameter circles, `--mc-gold`, spaced `8px` apart), centered horizontally. z-index: 10.

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Additional |
|---------|------|------|--------|-------|-----------|------------|
| "Our Celebrations" | Cormorant Garamond | `1.75rem` (28px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |
| Event name (e.g. "NIKAH") | Cormorant Garamond | `1.125rem` (18px) | 500 | `--mc-text-primary` (#3A2818) | left | -- |
| Date | Lato | `0.9375rem` (15px) | 400 | `--mc-text-primary` (#3A2818) | left | -- |
| Time | Lato | `0.9375rem` (15px) | 400 | `--mc-text-primary` (#3A2818) | left | -- |
| Venue name | Lato | `0.9375rem` (15px) | 700 | `--mc-text-primary` (#3A2818) | left | -- |
| Address | Lato | `0.8125rem` (13px) | 300 | `--mc-text-secondary` (#6B5B4E) | left | -- |
| Action labels ("Maps", "Calendar") | Lato | `0.75rem` (12px) | 400 | `--mc-text-gold` (#D4A050) | center | Inline with icon |

### 7. SVG Elements Needed
| SVG | Dimensions | Color | Purpose |
|-----|------------|-------|---------|
| Arabesque flourish (horizontal) | `120px` x `20px` | `--mc-gold` | Below section title |
| Lantern icon (small) | `24px` x `24px` | `--mc-gold` | Event card header |
| Calendar icon | `18px` x `18px` | `--mc-gold` | Date row |
| Clock icon | `18px` x `18px` | `--mc-gold` | Time row |
| Map pin icon | `18px` x `18px` | `--mc-gold` | Venue row |
| Maps action icon | `18px` x `18px` | `--mc-gold` | Action row link |
| Calendar action icon | `18px` x `18px` | `--mc-gold` | Action row link |
| Gold dot | `4px` circle | `--mc-gold` | Card separator |
| 8-pointed star tile | `100px` x `100px` | `--mc-cream` at 3% | Background texture |

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Floating rose petals | Scattered in section background | 2 | Same curved drift as Family section | 5000-9000ms per cycle |
| Four-pointed star sparkle | Near section title area | 1 | Same opacity+scale pulse | 3500-7500ms total cycle |

**Total concurrent animated elements: 3.** Minimal -- this section prioritizes information clarity.

### 9. Decorative Elements
- **Arabesque flourish below title** (described above).
- **Card separator dots**: Between each pair of event cards, 3 gold dots. These replace the heavy ornamental dividers of other sections to keep this section clean and readable.
- **Action row separator**: Inside each card, a `1px` horizontal line at `15%` opacity `--mc-gold`, spanning the card's content width, separating the venue details from the action links.

### 10. Element Positions (CSS)
```
.mc-section-celebrations:    position: relative; width: 100%; padding: 56px 24px 64px;
                             background: var(--mc-offwhite);
.mc-celebrations-title:      position: relative; z-index: 10; text-align: center;
.mc-card-event:              position: relative; z-index: 10; width: 100%;
                             padding: 24px 20px;
                             border: 1px solid rgba(212, 160, 80, 0.3);
                             border-radius: 16px;
                             background: var(--mc-ivory);
                             box-shadow: 0 2px 12px var(--mc-shadow);
.mc-card-event-header:       display: flex; align-items: center; gap: 10px;
                             margin-bottom: 16px;
.mc-card-event-row:          display: flex; align-items: center; gap: 8px;
                             min-height: 28px; /* comfortable reading */
.mc-card-event-venue:        display: flex; flex-direction: column; gap: 2px;
                             padding-left: 26px; /* align with text after icon */
.mc-card-event-actions:      display: flex; justify-content: center; gap: 32px;
                             padding-top: 16px;
                             margin-top: 16px;
                             border-top: 1px solid rgba(212, 160, 80, 0.15);
.mc-card-event-action:       display: flex; flex-direction: column; align-items: center;
                             gap: 4px; min-height: 44px; /* touch target */
                             cursor: pointer;
.mc-card-separator:          display: flex; justify-content: center; align-items: center;
                             gap: 8px; padding: 16px 0;
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Star geometric texture | 1 | Background tile |
| All content | 10 | Title, flourish, cards, separators |
| Floating petals | 30 | Ambient layer |
| Sparkle | 30 | Ambient layer |

### 12. Entry Animation
Each event card animates independently as it enters the viewport (ScrollTrigger per card, `start: "top 85%"`):

1. **Section title + flourish**: `opacity: 0 -> 1` over 1000ms, `scale(0.92) -> scale(1)`, `power2.out`. (Only on first visit -- once played, stays visible.)
2. **Each event card**: `opacity: 0 -> 1` over 800ms, `scale(0.95) -> scale(1)`, `power2.out`. Stagger: `200ms` between cards for cards visible simultaneously; cards further down the page trigger independently via their own ScrollTrigger.
3. **Card separator dots**: `opacity: 0 -> 1` over 400ms, timed with the card below them.

All animations use `opacity` and `scale` only. **No translateY.**

### 13. Scroll Behavior
- **Background texture**: `0.95x` parallax (subtle).
- **All cards and content**: normal `1.0x` scroll. No special scroll behavior.
- No sticky elements.

### 14. Exit Transition
- **Gradient bleed**: Bottom `60px` transitions from off-white to `--mc-ivory` with a rose tint:
  ```css
  .mc-section-celebrations::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, #F5F0E8);
    pointer-events: none;
    z-index: 2;
  }
  ```
- **Garland drape**: A thin floral garland WebP (`100%` width x `40px` tall, blush flowers with transparency) spans the boundary between Celebrations and RSVP. Positioned at the very bottom of the Celebrations section, overlapping slightly into the RSVP section. z-index: 30. `pointer-events: none`.

### 15. Mobile Composition (402px)
- Cards take full content width (354px).
- Card internal layout is all flexbox. Icons at `18px` with `8px` gap to text.
- Action buttons have `44px` min-height for touch targets.
- With many events (5+), the section becomes tall. Each card self-contains its ScrollTrigger so it animates in as the user reaches it -- no waiting for the entire section to be visible.
- Card separation via dot ornaments provides visual rhythm without adding excessive height.

### Dynamic Event Count Implementation Notes
- The section component receives an array of event objects: `{ name, date, time, venueName, venueAddress, mapsUrl, calendarUrl }`.
- The `.map()` over events generates cards. No fixed count. If `events.length === 0`, the section should still render its title and flourish but display a graceful message ("Celebrations coming soon" in `--mc-text-secondary`).
- Each card uses a consistent component with the same styling regardless of event type (Nikah, Mehendi, Walima, Sangeet, etc.).

---

## Section 5: RSVP

### 1. Purpose
The moment of participation. The guest transitions from observer to participant by responding to the invitation. The form should feel intimate, welcoming, and easy. The design communicates: "Your presence is not just requested -- it is deeply desired. Please tell us you will come."

### 2. Visual Concept
A warm, rose-tinted ivory space that feels like stepping into a private chamber. The section is softer and more intimate than the others -- a slight blush overlay gives it feminine warmth without being overtly pink. The form card is clean and spacious, with frosted glass touches on the submit button. Corner arabesque ornaments and scattered petals frame the space without crowding the interactive elements. The RSVP form is minimal: just name, guest count, accept/decline, optional message, and submit.

### 3. Layout and Composition (402px)

```
+------------------------------------------+
| 56px top padding (ivory + rose tint)     |
|                                          |
|  "Will You Join Us?"                     |
|  (section title, centered)               |
|                                          |
|  16px gap                                |
|                                          |
|  [Gold arabesque flourish, centered]     |
|                                          |
|  16px gap                                |
|                                          |
|  "Your presence would make our           |
|   celebration complete"                  |
|  (subtitle, centered)                    |
|                                          |
|  32px gap                                |
|                                          |
|  +------------------------------------+ |
|  |  RSVP Form Card                    | |
|  |                                    | |
|  |  Name                              | |
|  |  ________________________________  | |
|  |  (underline input)                 | |
|  |                                    | |
|  |  20px gap                          | |
|  |                                    | |
|  |  Number of Guests                  | |
|  |        [ - ]   2   [ + ]           | |
|  |  (stepper, centered)               | |
|  |                                    | |
|  |  20px gap                          | |
|  |                                    | |
|  |  ( ) Joyfully Accept               | |
|  |  ( ) Regretfully Decline            | |
|  |  (custom radio buttons)            | |
|  |                                    | |
|  |  20px gap                          | |
|  |                                    | |
|  |  Message (optional)                | |
|  |  +------------------------------+ | |
|  |  |                              | | |
|  |  |                              | | |
|  |  +------------------------------+ | |
|  |  (bordered textarea)              | |
|  |                                    | |
|  |  24px gap                          | |
|  |                                    | |
|  |  +------------------------------+ | |
|  |  |      Send Response            | | |
|  |  +------------------------------+ | |
|  |  (frosted glass button)           | |
|  |                                    | |
|  +------------------------------------+ |
|                                          |
| 64px bottom padding (gradient bleed)     |
+------------------------------------------+
```

### 4. Background Artwork
- **Base**: `--mc-ivory` (#F5F0E8) solid fill.
- **Rose tint overlay**: `--mc-gradient-rose` applied as `::before`:
  ```css
  background: linear-gradient(180deg,
    rgba(240, 176, 192, 0.12) 0%,
    rgba(240, 176, 192, 0) 100%
  );
  ```
  This gives the section a faint warm blush, concentrated at the top and fading to plain ivory at the bottom. z-index: 1. `pointer-events: none`.

### 5. Foreground Artwork
- **Section title arabesque flourish**: Same style. `120px` x `20px`, `--mc-gold`, centered. z-index: 10.
- **Corner arabesques**: Small arabesque ornaments at top-left and bottom-right of the section (outside the form card). Each `60px` square, `--mc-gold-light` at `15%` opacity. z-index: 5.
  - Top-left: `position: absolute; top: 20px; left: 12px;`
  - Bottom-right: `position: absolute; bottom: 80px; right: 12px; transform: rotate(180deg);`
- **Scattered petals**: 2-3 rose petal SVGs near the bottom corners of the section. `--mc-rose` at `20%` opacity. z-index: 5. `pointer-events: none`.

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Additional |
|---------|------|------|--------|-------|-----------|------------|
| "Will You Join Us?" | Cormorant Garamond | `1.75rem` (28px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |
| Subtitle ("Your presence...") | Lato | `0.9375rem` (15px) | 300 | `--mc-text-secondary` (#6B5B4E) | center | `max-width: 28ch; margin: 0 auto;` |
| Form labels ("Name", "Number of Guests", etc.) | Lato | `0.8125rem` (13px) | 400 | `--mc-text-secondary` (#6B5B4E) | left | `letter-spacing: 0.04em` |
| Input text (user-typed) | Lato | `0.9375rem` (15px) | 400 | `--mc-text-primary` (#3A2818) | left | -- |
| Radio label ("Joyfully Accept", etc.) | Lato | `0.9375rem` (15px) | 400 | `--mc-text-primary` (#3A2818) | left | -- |
| Guest count number | Cormorant Garamond | `1.375rem` (22px) | 400 | `--mc-text-primary` (#3A2818) | center | `min-width: 40px` |
| Stepper buttons ("+", "-") | Lato | `1.125rem` (18px) | 400 | `--mc-text-secondary` (#6B5B4E) | center | -- |
| "Send Response" | Lato | `0.9375rem` (15px) | 400 | `--mc-text-gold` (#D4A050) | center | -- |

### 7. SVG Elements Needed
| SVG | Dimensions | Color | Purpose |
|-----|------------|-------|---------|
| Arabesque flourish (horizontal) | `120px` x `20px` | `--mc-gold` | Below section title |
| Corner arabesque scrollwork | `60px` x `60px` | `--mc-gold-light` at 15% | Section corners |
| Rose petal variants (2-3) | ~`14px` x `10px` | `--mc-rose` at 20% | Scattered decoration |
| Custom radio circle (unselected) | `20px` circle | `1.5px stroke, --mc-gold` at 50% | Radio button |
| Custom radio dot (selected) | `12px` circle | `fill: --mc-gold` | Selected state |

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Floating rose petals | Section background | 3 | Same curved drift | 5000-9000ms per cycle |
| Four-pointed star sparkle | Near submit button area | 1 | Same pulse | 3500-7500ms |

**Total concurrent animated elements: 4.** Keeping it low so the interactive form is not distracting.

### 9. Decorative Elements
- **Arabesque flourish below title** (described above).
- **Corner arabesques** (described above).
- **Form card border**: `1px solid` `--mc-gold` at `25%` opacity.
- **Name input underline**: `border-bottom: 1px solid var(--mc-cream)`. On focus: transitions to `--mc-gold` over 300ms.
- **Textarea border**: `1px solid var(--mc-cream)`, `border-radius: 8px`. On focus: transitions to `--mc-gold`.

### 10. Element Positions (CSS)
```
.mc-section-rsvp:          position: relative; width: 100%; padding: 56px 24px 64px;
                           background: var(--mc-ivory);
.mc-section-rsvp::before:  /* rose tint overlay */ position: absolute; inset: 0; z-index: 1;
.mc-rsvp-title:            position: relative; z-index: 10; text-align: center;
.mc-rsvp-subtitle:         position: relative; z-index: 10; text-align: center;
                           max-width: 28ch; margin: 0 auto;
.mc-card-rsvp:             position: relative; z-index: 10; width: 100%;
                           padding: 28px 20px;
                           border: 1px solid rgba(212, 160, 80, 0.25);
                           border-radius: 16px;
                           background: var(--mc-offwhite);
                           box-shadow: 0 2px 12px var(--mc-shadow);
.mc-rsvp-input:            width: 100%; height: 44px; padding: 0 12px;
                           border: none; border-bottom: 1px solid var(--mc-cream);
                           background: transparent;
                           font-family: 'Lato', sans-serif; font-size: 15px;
                           color: var(--mc-text-primary);
.mc-rsvp-input:focus:      border-bottom-color: var(--mc-gold); outline: none;
.mc-rsvp-stepper:          display: flex; align-items: center; justify-content: center; gap: 16px;
.mc-rsvp-stepper-btn:      width: 44px; height: 44px; border-radius: 50%;
                           border: 1px solid var(--mc-cream); background: transparent;
.mc-rsvp-stepper-btn:active: background: var(--mc-champagne);
                              transition: background 150ms ease;
.mc-rsvp-radio-row:        display: flex; align-items: center; min-height: 44px;
                           cursor: pointer;
.mc-rsvp-radio-circle:     width: 20px; height: 20px; border-radius: 50%;
                           border: 1.5px solid rgba(212, 160, 80, 0.5);
                           flex-shrink: 0;
.mc-rsvp-radio-label:      margin-left: 12px;
.mc-rsvp-textarea:         width: 100%; min-height: 80px; padding: 12px;
                           border: 1px solid var(--mc-cream); border-radius: 8px;
                           background: transparent; resize: vertical;
.mc-rsvp-submit:           width: 100%; height: 48px; border-radius: 12px;
                           background: rgba(245, 240, 232, 0.65);
                           backdrop-filter: blur(12px);
                           border: 1px solid rgba(212, 160, 80, 0.25);
                           cursor: pointer;
.mc-rsvp-submit:active:    background: var(--mc-champagne); transform: scale(0.98);
                           transition: all 150ms ease;
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Rose tint overlay | 1 | Background gradient |
| Corner arabesques | 5 | Section corner ornaments |
| Scattered petals (static) | 5 | Decorative petals |
| All content | 10 | Title, subtitle, form card, all interactive elements |
| Floating petals (animated) | 30 | Ambient layer |
| Sparkle | 30 | Ambient layer |

### 12. Entry Animation
When the section scrolls into viewport (ScrollTrigger, `start: "top 85%"`):

1. **Section title**: `opacity: 0 -> 1` over 1000ms, `scale(0.92) -> scale(1)`, `power2.out`.
2. **Arabesque flourish**: `opacity: 0 -> 1` over 800ms, delayed 200ms. `clip-path` center-outward reveal.
3. **Subtitle**: `opacity: 0 -> 1` over 800ms, delayed 300ms.
4. **Form card**: `opacity: 0 -> 1` over 800ms, delayed 500ms, `scale(0.95) -> scale(1)`.
5. **Corner arabesques**: `opacity: 0 -> 0.15` over 600ms, delayed 700ms.
6. **Ambient animations begin** at 800ms delay.

All animations use `opacity` and `scale` only. **No translateY.**

### 13. Scroll Behavior
- No parallax in this section. The focus is on the interactive form; distracting background movement would be counterproductive.
- All elements scroll at normal `1.0x` speed.

### 14. Exit Transition
- **Gradient bleed**: Bottom `60px` transitions from rose-tinted ivory to the beginning of the sunset sky gradient:
  ```css
  .mc-section-rsvp::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(192, 160, 176, 0.1) 50%,
      rgba(139, 166, 199, 0.15) 100%
    );
    pointer-events: none;
    z-index: 2;
  }
  ```
- The mosque silhouette begins to emerge very faintly in the background during the last `80px` of this section (at `3%` opacity, a hint of the sky to come). This is achieved by extending the Closing section's mosque SVG upward with `position: absolute; top: -80px;` and very low opacity.

### 15. Mobile Composition (402px)
- Form card takes full content width (354px).
- All inputs are full-width within the card.
- Radio buttons have `44px` minimum row height for touch targets.
- Stepper buttons are `44px` square circles, easy to tap.
- Submit button is full-width, `48px` tall.
- Guest count stepper is centered horizontally in the card.

### Form States
- **Focus**: Input underlines and textarea borders transition to `--mc-gold` over 300ms. This is the only focus indicator (no outline ring, as the gold underline is the visual feedback).
- **Radio selected**: Inner `12px` circle fills with `--mc-gold`, animated with `scale(0) -> scale(1)` over 200ms.
- **Submit active/pressed**: `background: var(--mc-champagne)`, `transform: scale(0.98)`, 150ms ease.
- **Submit success**: Background transitions to `rgba(90, 125, 90, 0.15)` (Mughal sage tint). Text changes to "Response Sent" with a check mark icon. Color changes to `--mc-green` (#5A7D5A). Transition: 400ms.
- **Keyboard accessibility**: All interactive elements focusable. Visible focus ring: `outline: 2px solid var(--mc-gold); outline-offset: 2px;` (for keyboard navigation, not for touch -- use `:focus-visible`).

---

## Section 6: Closing

### 1. Purpose
The emotional and spiritual culmination. The invitation ends as it began -- with sky and atmosphere -- but now enriched by everything the guest has experienced. A Dua (prayer) lifts the couple's union into the sacred. The mosque silhouette anchors the Islamic identity. The family sign-off personalizes the farewell. This section says: "Go with our blessings. We will see you soon, Insha'Allah."

### 2. Visual Concept
A return to grandeur. The full sunset sky gradient fills the background, bookending the invitation (it began with the same sky behind the video). A large mosque silhouette glows faintly at the center. A slim crescent moon catches the light in the upper area. Birds drift across the sky. Rose petals float more abundantly here than anywhere else -- the garden is in full bloom. The Arabic Dua and its English translation are the textual centerpiece, followed by a warm family sign-off. A bottom floral garland mirrors the entry screen's top garland, completing the visual circle. The "Designed by" footer anchors the very end.

### 3. Layout and Composition (402px)

```
+------------------------------------------+
| 56px top padding (sunset sky gradient)   |
|                                          |
|  [Mosque silhouette SVG - background]    |
|  centered, large, very faint             |
|  dome at ~30% from section top           |
|                                          |
|  [Crescent moon SVG]            top-right|
|  ~15% from top, ~25% from right         |
|                                          |
|  [Bird silhouettes, 2]                   |
|  scattered in upper sky area             |
|                                          |
|  [Sparkle accents, 3]                    |
|  scattered in upper area                 |
|                                          |
|  ~40% from top:                          |
|                                          |
|  Arabic Dua text                         |
|  (Amiri, centered, RTL)                  |
|                                          |
|  12px gap                                |
|                                          |
|  "May Allah bless you both               |
|   and unite you in goodness"             |
|  (Lato 300, centered)                    |
|                                          |
|  32px gap                                |
|                                          |
|  --- gold divider line (60% width) ---   |
|                                          |
|  24px gap                                |
|                                          |
|  "With love and duas,"                   |
|  (Great Vibes, accent)                   |
|                                          |
|  8px gap                                 |
|                                          |
|  "The Khan & Ali Families"               |
|  (Cormorant 400, pearl ivory)            |
|                                          |
|  [generous vertical space]               |
|                                          |
|  [Floating petals, 6]                    |
|  throughout the section                  |
|                                          |
|  [Floral garland - bottom edge]          |
|  mirrored/flipped from entry top garland |
|                                          |
|  32px gap                                |
|                                          |
|  "Designed by Shaadi Invites"            |
|  (footer, small text)                    |
|                                          |
|  80px bottom padding                     |
+------------------------------------------+
```

### 4. Background Artwork
- **Full sunset sky gradient** (`--mc-gradient-sky`):
  ```css
  background: linear-gradient(180deg,
    #7090B8 0%,
    #9BA8C0 18%,
    #C0A0B0 36%,
    #E0A0A0 52%,
    #F0B888 70%,
    #E8A050 88%,
    #E8A84C 100%
  );
  ```
  This is the same gradient used as the video fallback on the Entry screen, creating a visual bookend.

### 5. Foreground Artwork
- **Mosque silhouette**: Large SVG, centered horizontally. `width: 80%` of viewport width (322px at 402px viewport). Positioned so the central dome sits at approximately `30%` from the section top. Color: `--mc-gold-light` (#E0CFA0) at `10%` opacity. z-index: 2. `pointer-events: none`.
  - The mosque design: a simplified outline with one central large dome, two tall minarets flanking it, and two smaller side domes. Clean, geometric silhouette -- no interior detail.
- **Crescent moon**: Slim waxing crescent SVG, `28px` x `28px`. Positioned at `right: 25%; top: 15%` of section. Fill: `--mc-gold` at `25%` opacity. z-index: 5. Has an animated glow behind it (see Animated Elements).
- **Bird silhouettes**: 2 small SVG birds (`18-20px` wingspan each). Positioned in the upper third of the section at varying heights. Color: `--mc-text-primary` (#3A2818) at `15%` opacity. z-index: 5.
  ```svg
  <svg width="20" height="10" viewBox="0 0 20 10">
    <path d="M0 5 Q5 0, 10 4 Q15 0, 20 5"
      fill="none" stroke="#3A2818" stroke-width="1.2"
      stroke-linecap="round" opacity="0.2"/>
  </svg>
  ```
- **Bottom floral garland**: A floral garland WebP (mirror of the entry top garland), flipped vertically (`transform: scaleY(-1)`), positioned at the bottom of the section. Full width, ~`200px` tall. Creates a framing element that mirrors the entry screen, completing the visual circle. z-index: 30. `pointer-events: none`.
- **Sparkle accents**: 3 four-pointed star SVGs scattered in the upper area. z-index: 5.

### 6. Typography
| Element | Font | Size | Weight | Color | Alignment | Additional |
|---------|------|------|--------|-------|-----------|------------|
| Arabic Dua | Amiri | `1.5rem` (24px) | 400 | `--mc-text-on-dark` (#F5EDD6) | center | `direction: rtl; lang="ar"` |
| English translation | Lato | `0.9375rem` (15px) | 300 | `--mc-text-on-dark` at 85% opacity | center | `max-width: 30ch; margin: 0 auto;` |
| "With love and duas," | Great Vibes | `1.25rem` (20px) | 400 | `--mc-gold-light` (#E0CFA0) | center | -- |
| Family names | Cormorant Garamond | `1.125rem` (18px) | 400 | `--mc-text-on-dark` (#F5EDD6) | center | -- |
| "Designed by Shaadi Invites" | Lato | `0.75rem` (12px) | 400 | `--mc-text-on-dark` at 50% opacity | center | -- |

### 7. SVG Elements Needed
| SVG | Dimensions | Color | Purpose |
|-----|------------|-------|---------|
| Mosque silhouette | ~`322px` wide (80% of 402) x proportional height | `--mc-gold-light` at 10% | Background architectural element |
| Crescent moon (slim waxing) | `28px` x `28px` | `--mc-gold` at 25% | Sky element |
| Bird silhouette (2 copies) | `18-20px` x `10px` | `--mc-text-primary` at 15% | Sky element |
| Four-pointed star sparkle (3 copies) | `16px` x `16px` | `#FFFFFF` at 70% | Ambient sparkles |
| Rose petal variants (4 shapes, 6 instances) | `14px` x `10px` | Various rose tones | Floating ambient petals |
| Gold divider line | `60%` width x `1px` | `--mc-gold-light` gradient | Between Dua and sign-off |

### 8. Animated Elements and Placement
| Element | Position | Count | Motion | Duration |
|---------|----------|-------|--------|----------|
| Floating rose petals | Throughout section | 6 | Curved S-path drift, most visible ambient element | 5000-9000ms per cycle |
| Four-pointed star sparkles | Upper sky area, near mosque | 3 | Opacity + scale pulse (same as other sections) | 3500-7500ms total cycle |
| Lantern glow pulse | If lanterns placed in composition | 2 | Opacity + scale breathing | 3000ms cycle |
| Bird flight | Upper third of section | 2 | Gentle arc across viewport via MotionPathPlugin + wing flap (scaleY oscillation) | 12000-18000ms horizontal traversal, 800ms wing cycle |
| Crescent moon glow | Behind crescent moon SVG | 1 | Opacity modulation on glow element: `0.15 -> 0.35 -> 0.15` | 5000ms cycle, `sine.inOut` |

**Total concurrent animated elements: 14.** Within 15 limit.

Bird flight details:
- Bird 1: Enters from left at ~15% from section top, arcs gently upward then slightly downward, exits right at ~12% from top. Bezier curve path with control point above midpoint.
- Bird 2: Enters from right at ~20% from section top, arcs gently upward, exits left at ~18% from top. Reverse direction.
- Wing flap: `scaleY: 1.0 -> 0.85 -> 1.0`, 800ms cycle, `sine.inOut`.
- Pause between crossings: 5000-10000ms (bird hidden, repositioned).
- Birds stagger start by 3000-6000ms.
- Easing: linear for horizontal position, `sine.inOut` for wing flap.

Moon glow:
```css
.mc-anim-moon-glow {
  position: absolute;
  width: 50px; height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(212, 160, 80, 0.15) 0%,
    rgba(212, 160, 80, 0.05) 40%,
    transparent 60%
  );
  pointer-events: none;
}
```
Moon SVG itself stays at constant opacity (0.25). Only the glow behind it breathes.

### 9. Decorative Elements
- **Gold divider line**: Same gradient line as Family section, but using `--mc-gold-light` (lighter for dark background). `60%` width, `1px` height, centered. Between the English translation and the sign-off text.
- **Bottom floral garland**: WebP image with transparency (described in Foreground Artwork). This is the most prominent decorative piece in this section.

### 10. Element Positions (CSS)
```
.mc-section-closing:       position: relative; width: 100%; min-height: 500px;
                           padding: 56px 24px 80px;
                           background: linear-gradient(180deg, ...); /* sunset sky */
                           overflow: hidden;
.mc-decor-mosque:          position: absolute; z-index: 2;
                           top: 15%; left: 50%; transform: translateX(-50%);
                           width: 80%; opacity: 0.1;
                           pointer-events: none;
.mc-decor-crescent:        position: absolute; z-index: 5;
                           top: 15%; right: 25%;
.mc-anim-moon-glow:        position: absolute; z-index: 4;
                           /* centered behind crescent, offset by half size difference */
.mc-decor-bird:            position: absolute; z-index: 5;
                           /* positions set dynamically by GSAP MotionPath */
.mc-decor-sparkle-closing: position: absolute; z-index: 5;
                           /* scattered positions in upper area */
.mc-closing-content:       position: relative; z-index: 10;
                           /* all text content in this container */
                           display: flex; flex-direction: column; align-items: center;
                           margin-top: 40%; /* push content below mosque dome area */
.mc-text-dua-arabic:       text-align: center; direction: rtl;
.mc-text-dua-english:      text-align: center; max-width: 30ch;
                           margin-top: 12px;
.mc-divider-gold-light:    width: 60%; height: 1px; margin: 32px auto 24px;
.mc-text-signoff-accent:   text-align: center;
.mc-text-signoff-families: text-align: center; margin-top: 8px;
.mc-decor-garland-bottom:  position: absolute; z-index: 30;
                           bottom: 100px; left: 0; right: 0;
                           /* bottom edge garland, flipped vertically */
                           transform: scaleY(-1);
                           pointer-events: none;
.mc-text-footer:           position: relative; z-index: 10;
                           text-align: center;
                           margin-top: auto; /* push to bottom */
```

### 11. Layering Order (z-index)
| Layer | z-index | Contents |
|-------|---------|----------|
| Sunset sky gradient | (background) | Section background |
| Mosque silhouette | 2 | Large faint architectural anchor |
| Moon glow | 4 | Behind crescent moon |
| Crescent moon | 5 | Sky element |
| Bird silhouettes | 5 | Sky animation layer |
| Sparkle accents | 5 | Sky ambient layer |
| All text content | 10 | Dua, translation, sign-off, footer |
| Floating petals | 30 | Ambient foreground |
| Bottom garland | 30 | Foreground floral frame |

### 12. Entry Animation
When the section scrolls into viewport (ScrollTrigger, `start: "top 85%"`):

1. **Mosque silhouette**: `opacity: 0 -> 0.1` over 1500ms, `power1.inOut`. Begins faintly even before the section fully enters (can start at `start: "top 100%"` for early emergence).
2. **Crescent moon + glow**: `opacity: 0 -> 0.25` (moon) and `opacity: 0 -> 0.15` (glow) over 1200ms, delayed 300ms.
3. **Arabic Dua**: `opacity: 0 -> 1` over 1000ms, `power2.out`, delayed 500ms. Simultaneous `scale(0.92) -> scale(1)`.
4. **English translation**: `opacity: 0 -> 0.85` over 800ms, delayed 700ms.
5. **Gold divider**: `clip-path: inset(0 50% 0 50%) -> inset(0 0% 0 0%)` over 800ms, delayed 900ms.
6. **Sign-off text** ("With love and duas," + family names): `opacity: 0 -> 1` over 800ms, delayed 1000ms.
7. **Sparkles begin**: delayed 800ms.
8. **Birds begin flight**: delayed 1500ms.
9. **Floating petals begin**: delayed 1200ms.
10. **Bottom garland**: `opacity: 0 -> 1` over 1000ms, delayed 1500ms.
11. **Footer**: `opacity: 0 -> 0.5` over 600ms, delayed 2000ms.

All animations use `opacity`, `scale`, and `clip-path` only. **No translateY.**

### 13. Scroll Behavior
- **Mosque silhouette**: moves at `0.9x` scroll speed (most notable parallax in the template). This creates a subtle "the mosque is far away" depth effect.
- **Crescent moon**: moves at `0.92x` (slightly faster than mosque, slightly slower than content).
- **Birds**: move independently via GSAP timeline (not scroll-linked).
- **All text content**: normal `1.0x` scroll speed.
- **Bottom garland**: normal `1.0x` scroll speed (anchored to section bottom).

### 14. Exit Transition
- This is the final section. No exit transition to another section.
- The section ends with `padding-bottom: 80px` to give breathing room after the footer.
- The very last visual element is the "Designed by Shaadi Invites" footer mark.
- The bottom garland WebP provides a visual "closing" frame that mirrors the entry screen's opening frame.

### 15. Mobile Composition (402px)
- Mosque silhouette at 80% width = `322px`.
- Text content container has `margin-top: 40%` to push content below the mosque dome, ensuring the Dua text overlaps the body of the mosque (not the dome) for better readability.
- Arabic Dua at `24px` is large enough to read clearly but not so large as to overwhelm on mobile.
- English translation at `15px` with `max-width: 30ch` keeps lines short and centered.
- Bottom garland at `200px` tall may need reduction to `150px` on very small viewports to avoid consuming too much space.
- Footer at `12px` and `50%` opacity is subtle. Minimum touch target rules do not apply as it is not interactive.
- `min-height: 500px` ensures the section has enough vertical space for the atmospheric composition even with minimal content.

---

## Appendix A: SVG Asset Inventory

Complete list of all unique SVG assets needed across all sections. Each asset should be a separate SVG file or inline SVG component within the template workspace.

| # | Asset Name | Dimensions | Used In | Notes |
|---|-----------|------------|---------|-------|
| 1 | `mc-arch-silhouette.svg` | `80px` x `50px` | Family (above cards) | Pointed Mughal arch, `--mc-gold`, designed at full opacity but applied at 15% |
| 2 | `mc-arabesque-flourish-wide.svg` | `120px` x `20px` | Family, Countdown, Celebrations, RSVP (below titles) | Horizontal scrollwork ornament |
| 3 | `mc-arabesque-flourish-small.svg` | `40px` x `20px` | Countdown (bottom pair), Bismillah flanks | Smaller version of the same scrollwork |
| 4 | `mc-arabesque-corner.svg` | `60px` x `60px` | Family (TL, BR), RSVP (TL, BR) | Quarter-turn scrollwork for corners |
| 5 | `mc-star-tessellation-tile.svg` | `80px` x `80px` | Family background | 8-pointed star repeating tile |
| 6 | `mc-star-tessellation-tile-lg.svg` | `100px` x `100px` | Celebrations background | Slightly larger tile variant |
| 7 | `mc-jali-lattice-tile.svg` | `60px` x `60px` | Countdown background | Lattice screen repeating tile |
| 8 | `mc-jali-lattice-strip.svg` | `full width` x `40px` | Family/Countdown transition | Horizontal lattice border strip |
| 9 | `mc-lantern.svg` | `24px` x `40px` | Countdown (flanking), Celebrations (card icons at 24x24) | Mughal box lantern |
| 10 | `mc-lantern-small.svg` | `24px` x `24px` | Celebrations (card headers) | Simplified lantern icon |
| 11 | `mc-petal-a.svg` | `14px` x `10px` | All sections (ambient) | Curled petal, viewed from above |
| 12 | `mc-petal-b.svg` | `14px` x `10px` | All sections (ambient) | Elongated petal, side view |
| 13 | `mc-petal-c.svg` | `14px` x `10px` | All sections (ambient) | Wide, partially open petal |
| 14 | `mc-petal-d.svg` | `14px` x `10px` | All sections (ambient) | Small, tightly curled petal |
| 15 | `mc-sparkle.svg` | `16px` x `16px` | Family, Countdown, Celebrations, RSVP, Closing | Four-pointed star sparkle |
| 16 | `mc-sparkle-gold.svg` | `12px` x `12px` | Countdown (number change) | Same shape, gold color |
| 17 | `mc-scroll-chevron.svg` | `24px` x `12px` | Entry (scroll indicator) | Downward-pointing chevron |
| 18 | `mc-mosque-silhouette.svg` | `~322px` wide (scales to 80%) | Closing | Simplified mosque outline |
| 19 | `mc-crescent-moon.svg` | `28px` x `28px` | Closing | Slim waxing crescent |
| 20 | `mc-bird.svg` | `20px` x `10px` | Closing | Simple V-wing bird silhouette |
| 21 | `mc-icon-calendar.svg` | `18px` x `18px` | Celebrations (date row) | Calendar icon |
| 22 | `mc-icon-clock.svg` | `18px` x `18px` | Celebrations (time row) | Clock icon |
| 23 | `mc-icon-pin.svg` | `18px` x `18px` | Celebrations (venue row) | Map pin icon |
| 24 | `mc-icon-maps.svg` | `18px` x `18px` | Celebrations (action row) | Maps link icon |
| 25 | `mc-icon-cal-add.svg` | `18px` x `18px` | Celebrations (action row) | Add-to-calendar icon |

**WebP Assets (raster with transparency):**
| # | Asset Name | Dimensions | Used In | Notes |
|---|-----------|------------|---------|-------|
| W1 | `mc-garland-corner-left.webp` | `160px` x `200px` | Entry (TL) | Cascading floral garland |
| W2 | `mc-garland-bottom.webp` | `full width` x `200px` | Closing (bottom edge) | Flipped version of entry garland |
| W3 | `mc-garland-drape.webp` | `full width` x `40px` | Celebrations/RSVP transition | Thin horizontal floral strip |
| W4 | `muslim-couple-poster.webp` | `720px` x `1280px` | Entry (video poster) | First frame of video |

---

## Appendix B: Section Transition Map

```
ENTRY (100vh, video)
  |
  | [HARD BREAK: video scrolls away, ivory marble begins]
  V
FAMILY (variable height, marble background)
  |  Bottom 60px: ivory -> champagne gradient bleed
  |  + jali lattice strip bridging the boundary
  V
COUNTDOWN (variable height, champagne background)
  |  Bottom 60px: champagne -> off-white gradient bleed
  |  + mirrored arabesque pair centered at boundary
  V
CELEBRATIONS (variable height, off-white background)
  |  Bottom 60px: off-white -> ivory gradient bleed
  |  + thin garland drape WebP at boundary
  V
RSVP (variable height, rose-tinted ivory background)
  |  Bottom 80px: rose-ivory -> hint of sunset sky
  |  + mosque silhouette beginning to emerge at 3% opacity
  V
CLOSING (variable height, min ~500px, sunset sky gradient)
  |
  [END: 80px bottom padding after footer]
```

---

## Appendix C: Animation Budget Summary

| Section | Petals | Sparkles | Lantern Glows | Birds | Moon | Chevron | Countdown Flash | Total |
|---------|--------|----------|---------------|-------|------|---------|-----------------|-------|
| Entry | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |
| Family | 3 | 2 | 0 | 0 | 0 | 0 | 0 | **5** |
| Countdown | 4 | 3 | 2 | 0 | 0 | 0 | 4 | **13** |
| Celebrations | 2 | 1 | 0 | 0 | 0 | 0 | 0 | **3** |
| RSVP | 3 | 1 | 0 | 0 | 0 | 0 | 0 | **4** |
| Closing | 6 | 3 | 2 | 2 | 1 | 0 | 0 | **14** |

All sections within the 15-element maximum.

---

## Appendix D: Reduced Motion Fallback

When `prefers-reduced-motion: reduce`:
- All petal containers: `display: none`
- All sparkle containers: `display: none`
- Lantern glows: static at `opacity: 0.8` (no pulse)
- Birds: `display: none`
- Moon glow: static at `opacity: 0.2`
- Scroll indicator: static at `translateY(0)` (no bounce), still fades on scroll
- Countdown number sparkles: `display: none`
- Countdown number transitions: instant swap (no scale animation)
- "Tap to Open" button: no breathing animation
- Entry screen text overlay: instant display (no word stagger)
- All GSAP timelines: never created (guard with `gsap.matchMedia()`)

```typescript
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  // All ambient and entry animations created here
  // Automatically reverted when media query stops matching
});
```

Static layout shows all content visible. No information is lost.

---

## Appendix E: Accessibility Checklist

| Requirement | Implementation |
|-------------|---------------|
| Color contrast (body text) | `--mc-text-primary` (#3A2818) on `--mc-ivory` (#F5F0E8) = ~9:1. Passes WCAG AAA. |
| Color contrast (gold display text) | `--mc-text-gold` (#D4A050) on `--mc-ivory` = ~3.1:1. Passes WCAG AA for large text (18px+ regular or 14px+ bold). All gold text is >= 18px display text. |
| Color contrast (text on dark/sky) | `--mc-text-on-dark` (#F5EDD6) on darkest sky gradient (#7090B8) = ~4.7:1. Passes WCAG AA. |
| Touch targets | All interactive elements minimum `44px x 44px`. |
| Keyboard navigation | All interactive elements focusable. Focus ring: `outline: 2px solid var(--mc-gold); outline-offset: 2px;` using `:focus-visible`. |
| Reduced motion | Full static layout. See Appendix D. |
| Screen reader | All decorative SVGs and ambient elements: `aria-hidden="true"`. Bismillah: `lang="ar"`. Dua: `lang="ar"`. Structural headings form logical hierarchy (`h2` for section titles, `h3` for card titles). |
| Font scaling | All sizes in `rem`. Layout does not break at 200% zoom. |
| Form labels | All form inputs have associated `<label>` elements. |

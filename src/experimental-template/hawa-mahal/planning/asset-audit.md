# Hawa Mahal — Asset Audit

Catalog of visual elements observed in the reference video that could inform template design. Each item describes what was seen, its potential role in the template, and notes on how it might be implemented.

---

## 1. Architectural Elements

### 1.1 Hawa Mahal Facade (Hero Element)

- **What:** The complete five-tiered Hawa Mahal palace front, viewed straight-on
- **Visual character:** Pink-terracotta sandstone, stepped pyramid profile (wider at base, narrowing at top), densely ornamented with protruding bay windows
- **Occupies:** Lower ~65% of the frame, centered horizontally
- **Role in template:** This IS the template's identity. The facade or stylized version of it would be the primary visual throughout the invitation
- **Implementation note:** Could be a layered SVG/PNG composition where each tier is a separate layer, allowing independent lighting animation per tier. Alternatively, a single high-quality image with CSS/GSAP-driven overlay effects for the lighting progression

### 1.2 Jharokha (Projecting Bay Windows)

- **What:** Semi-octagonal enclosed balcony windows that protrude from the facade wall, the signature architectural feature of Hawa Mahal
- **Quantity observed:** Approximately 40-50 individual jharokhas across all five tiers
- **Visual character:** Each is framed with carved arches, flanked by small columns, and topped with a pointed or scalloped canopy
- **Role in template:** Could serve as decorative frames or containers for content sections. A single jharokha motif could become a recurring design element — framing names, dates, or section headers
- **Implementation note:** An SVG jharokha frame could be a reusable component

### 1.3 Jali Lattice Screens (Window Screens)

- **What:** Perforated stone screens with honeycomb/hexagonal pattern filling window openings
- **Visual character:** When backlit, they glow with a distinctive teal-green color. The hexagonal pattern is geometric and regular.
- **Pattern types observed:**
  1. Honeycomb/hexagonal (primary pattern) — small hexagons in a regular grid
  2. Rectangular/grid (secondary pattern) — simple vertical and horizontal bars
- **Role in template:** The honeycomb jali pattern is an iconic Rajasthani design motif. It could be used as:
  - Background texture/overlay pattern
  - Section dividers
  - Decorative borders
  - Semi-transparent overlay on images
- **Implementation note:** SVG pattern tile, repeatable. The backlit teal-green glow could be achieved with CSS background-color behind the pattern

### 1.4 Cusped/Pointed Arches (Mehrab)

- **What:** Multi-lobed pointed arches above windows and door openings
- **Visual character:** The arches have a scalloped/cusped inner profile — not simple pointed arches but decorated with small internal curves
- **Role in template:** Frame shape for content areas. Could top section headers or frame important text like the couple's names
- **Implementation note:** SVG path or CSS clip-path

### 1.5 Domed Finials and Spires (Chhatris)

- **What:** Small dome-topped pavilions and pointed pinnacles along the roofline of each tier, especially prominent at the very top
- **Visual character:** Gold/brass-toned small domes with pointed finials, creating a decorative crown silhouette against the sky
- **Role in template:** Roofline silhouette could be a header/footer decorative element. Finials could be used as bullet/accent markers
- **Implementation note:** SVG silhouette strip

### 1.6 Semi-Cylindrical Columns (Pilasters)

- **What:** Decorative half-columns flanking each jharokha bay, running vertically along the facade
- **Visual character:** Cylindrical, carved with vertical fluting or decorative bands
- **Role in template:** Vertical dividers between content columns or sections
- **Implementation note:** CSS border or SVG element

### 1.7 Scalloped Cornices

- **What:** Decorative horizontal ledges between each tier with scalloped/wave-pattern edges
- **Visual character:** A continuous horizontal decorative band separating floor levels
- **Role in template:** Section dividers. A horizontal scalloped line between invitation sections
- **Implementation note:** SVG or CSS border-image pattern

### 1.8 Carved Relief Panels

- **What:** Decorative carved stone panels between windows, featuring floral and geometric motifs
- **Visual character:** Low-relief carving in sandstone, subtle when unlit, more visible with directional lighting
- **Role in template:** Subtle background texture or decorative fill for non-primary areas
- **Implementation note:** Very low-opacity texture overlay

---

## 2. Lighting Effects

### 2.1 Ground-Up Light Sweep

- **What:** Progressive illumination of the building from bottom to top, simulating uplights turning on
- **Duration:** ~1.5 seconds (2.0s to 3.5s in the video)
- **Color:** Warm amber/gold (`#D4A055` to `#E8B86D`)
- **Role in template:** Entry animation — reveal the opening section by sweeping light upward
- **Implementation note:** GSAP timeline animating opacity/brightness on layered elements from bottom to top. Could use multiple overlay layers with clip-path animation, or animate gradient positions

### 2.2 Window Glow

- **What:** Individual windows appearing to glow from within, creating a warm interior light effect
- **Color:** Bright gold center (`#E8B86D`) fading to amber edges
- **Role in template:** Ambient animation — windows could subtly pulse or flicker to suggest life within the palace
- **Implementation note:** CSS animation on opacity or brightness of window-specific layers/elements. Subtle random variation in timing per window

### 2.3 Teal-Green Backlit Jali

- **What:** The distinctive teal-green glow visible through the honeycomb lattice screens when windows are backlit
- **Color:** `#2A4540` to `#3D5C52`
- **Role in template:** Accent color for interactive elements, links, or decorative highlights. The green-teal against terracotta-gold creates a distinctive complementary color contrast
- **Implementation note:** CSS color variable for accent color

### 2.4 Warm Sandstone Tones Under Light

- **What:** The sandstone facade transitioning from cold/dark brown to warm pink-gold when illuminated
- **Unlit:** `#2C231F` to `#6E4A3A`
- **Lit:** `#C4836A` to `#D4A07A`
- **Role in template:** Color palette foundation. Sections could have a "lit" warm tone as their primary background color
- **Implementation note:** CSS custom properties with these values

---

## 3. Pyrotechnic Effects

### 3.1 Firework Rockets (Trails)

- **What:** White/bright streaks rising vertically from behind the building, trailing sparks
- **Visual character:** Thin bright line with a glowing head and trailing dotted sparks
- **Count:** 4-6 rockets visible across the sequence
- **Origin:** Behind the palace on both left and right sides
- **Direction:** Vertical, with slight outward angle from building center
- **Role in template:** Entry animation accent. Could be represented as ascending light trails during the reveal
- **Implementation note:** GSAP motion-path animation on small circle/line elements rising upward. Spark trail could be a sequence of small dots with staggered opacity

### 3.2 Firework Bursts (Starbursts)

- **What:** Large radial explosion patterns in the sky above the palace
- **Visual character:** 30-50 bright radiating lines from a central point, expanding outward. White/warm-gold color. Each burst roughly 200-300px equivalent diameter at peak
- **Count:** 2-4 simultaneous bursts during the peak display
- **Position:** Upper portion of frame, above the roofline
- **Color:** White center (`#F5F0E5`) → warm gold spokes (`#E8B86D`) → fading amber (`#C4956A`)
- **Duration per burst:** ~1.5 seconds from initial explosion to full fade
- **Role in template:** Celebratory climax of the entry animation
- **Implementation note:** Canvas-based or GSAP-animated radial elements. Each spoke could be an animated line with stagger. Important: limited to the entry sequence, not continuous

### 3.3 Falling Embers/Sparks

- **What:** Small bright dots falling downward after firework bursts fade, like ash or embers
- **Visual character:** Very small gold-orange dots, drifting downward with slight lateral movement
- **Count:** Dozens of small particles at peak
- **Role in template:** Post-climax transition particles. Could gently rain down as the entry video transitions to the first invitation section
- **Implementation note:** GSAP-animated pool of small elements with randomized fall paths. Pre-created on mount, animated in batches

### 3.4 Smoke Wisps

- **What:** Faint grayish-white smoke or haze visible around firework burst origins
- **Visual character:** Very subtle, semi-transparent, organic/cloud-like shapes
- **Role in template:** Subtle depth effect if fireworks are implemented. Not critical
- **Implementation note:** Could be a very low-opacity blurred div with slow drift animation

---

## 4. Sky and Atmospheric Elements

### 4.1 Night Sky

- **What:** Deep blue-black sky occupying the upper ~35% of the frame
- **Color gradient:** Top `#010C0E` (nearly black) → horizon `#0A1520` (very dark navy)
- **Role in template:** Background for the upper portions of the invitation. A dark sky section could frame the opening/hero area
- **Implementation note:** CSS radial or linear gradient

### 4.2 Twinkling Stars

- **What:** Small points of light appearing in the final phase of the video, gently twinkling
- **Visual character:** Tiny (~2-4px equivalent), warm white dots with subtle brightness variation
- **Count:** ~20-30 visible stars in the final frames
- **Role in template:** Ambient background animation for the opening section or throughout the invitation (above the palace roofline)
- **Implementation note:** CSS animation with keyframes for opacity pulse on small positioned elements. Use `will-change: opacity` during animation, pause when off-screen via IntersectionObserver

### 4.3 Small Sparkle Particles

- **What:** Tiny glittering particles visible in the sky during the transition from full illumination to fireworks
- **Visual character:** Very small, appearing briefly, falling with slight drift
- **Role in template:** Subtle ambient effect — could complement the twinkling stars or appear during scroll transitions
- **Implementation note:** Reuse the twinkling star elements with occasional "sparkle" keyframes

---

## 5. Color Schemes for Template Sections

Based on the observed color palette, suggested section color schemes:

### Opening / Hero Section
- Background: Dark sky gradient (`#0A1520` → `#040F14`)
- Hero image: Illuminated Hawa Mahal facade
- Text: Warm cream/gold (`#E8D8C0`)
- Accent: Teal-green (`#2A4540`)

### Content Sections (Warm)
- Background: Warm sandstone (`#D4A07A`) or lighter (`#E8D2BC`)
- Text: Deep brown (`#2C231F`)
- Accent: Gold (`#D4A055`)
- Borders/dividers: Terracotta (`#C4836A`)

### Content Sections (Dark)
- Background: Deep navy (`#0A1520`)
- Text: Warm cream (`#E8D8C0`)
- Accent: Bright gold (`#E8B86D`)
- Pattern overlay: Jali pattern at very low opacity

### Celebration/Event Section
- Background: Terracotta/warm (`#B87A5E`)
- Text: Cream white (`#F5F0E5`)
- Accent: Gold highlights (`#D4A055`)
- Decorative: Jali pattern borders

---

## 6. Pattern Motifs for SVG/CSS

### 6.1 Honeycomb Jali Pattern
- **Grid type:** Regular hexagonal tessellation
- **Use:** Background pattern, section dividers, decorative borders
- **Implementation:** SVG `<pattern>` element with hexagonal grid

### 6.2 Scalloped Arch Border
- **Shape:** Repeating cusped/scalloped arch along a horizontal line
- **Use:** Section dividers, header decorations
- **Implementation:** SVG path repeated horizontally

### 6.3 Stepped Pyramid Profile
- **Shape:** The characteristic stepped/pyramidal silhouette of the Hawa Mahal facade
- **Use:** Section shapes, decorative header/footer
- **Implementation:** CSS clip-path or SVG silhouette

### 6.4 Finial/Spire Silhouette
- **Shape:** The pointed dome-and-spire profile of the rooftop ornaments
- **Use:** Bullet points, accent marks, small decorative elements
- **Implementation:** Small SVG icon

### 6.5 Mehrab (Pointed Arch) Frame
- **Shape:** A single cusped pointed arch
- **Use:** Content frame for names, dates, events
- **Implementation:** SVG/CSS border-image

---

## 7. Suggested Asset Production List

Based on this audit, the following assets would need to be created or sourced:

### Required Assets
1. **Hawa Mahal facade illustration/image** — layered for animation (each tier separate)
2. **Jali honeycomb pattern tile** — SVG, repeatable
3. **Mehrab arch frame** — SVG, for content framing
4. **Scalloped border strip** — SVG, horizontal divider
5. **Roofline silhouette** — SVG, header/footer decoration
6. **Finial/spire icon** — SVG, small accent element
7. **Entry video poster frame** — extracted from video final frame (~9.5s), used as `poster` attribute

### Optional/Enhancement Assets
8. **Firework burst graphic** — SVG or Canvas element for entry animation
9. **Sparkle/star particle** — small SVG or CSS element for ambient effects
10. **Smoke wisp texture** — semi-transparent PNG for depth
11. **Carved panel texture** — very subtle background pattern
12. **Column/pilaster vertical strip** — SVG, section edge decoration

### Color Tokens
```
--hm-sky-dark: #010C0E;
--hm-sky: #0A1520;
--hm-sandstone-dark: #2C231F;
--hm-sandstone-shadow: #6E4A3A;
--hm-sandstone: #C4836A;
--hm-sandstone-light: #D4A07A;
--hm-sandstone-cream: #E8D2BC;
--hm-gold: #D4A055;
--hm-gold-bright: #E8B86D;
--hm-teal: #2A4540;
--hm-teal-light: #3D5C52;
--hm-text-cream: #E8D8C0;
--hm-text-white: #F5F0E5;
--hm-ember: #C4956A;
--hm-terracotta: #B87A5E;
--hm-deep-brown: #8F603C;
```

---

## 8. Implementation Considerations

### Video as Entry
- The reference video could potentially be used directly as the entry video (with the watermark star removed or cropped out)
- Alternatively, the entry sequence (dark → light sweep → fireworks → serene) could be recreated with GSAP animation on static assets, giving full control over timing and interactivity
- If using the video directly: extract poster frame from ~9.5s, ensure `muted playsInline preload="auto"` per project rules, provide `canplay` retry handler

### Performance
- The facade image would be the heaviest asset — optimize with WebP
- Jali pattern should be SVG (tiny file size, infinitely scalable)
- Firework effects should be limited to the entry sequence, not continuous
- Star twinkle is CSS-only animation (very lightweight)
- All animated elements must pause when off-viewport (IntersectionObserver)
- `prefers-reduced-motion: reduce` must show the fully-lit palace immediately with no animation

### CSS Prefix
- All CSS classes: `hm-` prefix (e.g., `hm-hero`, `hm-section`, `hm-jali-pattern`)
- All CSS custom properties: `--hm-` prefix (as shown in color tokens above)

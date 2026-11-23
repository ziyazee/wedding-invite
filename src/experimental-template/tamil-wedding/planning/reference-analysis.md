# tamil-wedding — Opening reference analysis

Source: `src/experimental-template/public/tamil-wedding.mp4` (720×1280, 8.04s). Stills analysed: 0.5s, 2.0s, 4.0s, 6.0s, 7.5s.
Scope: we take only the **rendering style** and **viewport bands** from this video. The couple, gopuram, banana trees and toran are not subjects to copy into downstream assets.

All measurements are % of frame height (y) or width (x), measured from the top-left corner. Values are estimates from scaled stills, accurate to about ±2%.

## 1. Motion progression

| Time | What you see in the frame |
|------|------|
| 0.5s | Starting state. The peach damask cusped arch border is visible on the top and sides. Short green vines with pink buds hang to about y 27%. There is no centre toran yet. Banana trees, gopuram, couple and lotuses are already in place. |
| 2.0s | The toran has grown in. A magenta fuchsia-style garland crosses the top, and more vines hang down the sides (left to about y 47%, right to about y 54%). It partly covers the arch border. One stray petal at about y 11%. |
| 4.0s | Petal shower peaks. About 10 pink and peach petals spread from y 12% to 60%, mostly in the central column. Wind blows the bride's sari pallu out to the left. The banana leaves sway slightly. |
| 6.0s | Petals have drifted lower (about y 28–83%) and spread wider. The pallu reaches its widest point. |
| 7.5s | Settling. Only 2–3 petals remain (about y 58–65%). The pallu is falling back. The toran is complete. This is the final composed state. |

What moves: the toran and vines grow in (about 0.5–2s), petals fall (about 3–7s), and the sari pallu and banana leaves sway in the wind (about 3.5–7s). The paper, gopuram, couple's bodies and lotuses stay still.

**Poster:** use the **7.5s frame, or the last frame at about 8.0s**. It has the complete toran, an empty quiet zone and the final composition, so a poster that holds after the video ends will not jump. The 2.0s frame is a close second: full toran and almost no petals, but the pallu is at rest. Only use 0.5s if the poster has to match the first frame of playback exactly. It looks thin because the toran is missing.

**`revealAtSec`: about 2.4s.** By then the toran has finished growing and the quiet zone is framed. The petal shower (3–7s) then drifts behind the title, which looks intentional. If the title should appear only after the motion has fully settled, use 6.8s instead.

## 2. Opening viewport bands

### Top floral arch / toran (final state, 2.0s onward)
- **Centre (x 40–60%):** the lowest fuchsia blooms end at about **y 15%**. Between the garland swags at dead centre, the arch edge is about y 9%.
- **Inner sides (x 18–30% and 70–82%):** garland blooms reach about y 14–17%.
- **Side vines (x 0–17% and 83–100%):** hang much lower. The left side ends at about **y 47%**, the right side at about **y 54%** (pink buds at x 84–94%).
- Peach arch damask border: x 0–8% and 92–100%, down to about y 50% (left) and 53% (right).

### Lower obstacles
- Left banana tree: leaf tips reach **x 36%** across y 41–58%. The trunk runs along x 0–6%.
- Right banana tree: begins at **y 52%**, inner leaf edge at about **x 74%**.
- Gopuram (lower left): top finial at **y 67%**, spans x 2–36%.
- Couple (lower centre-right): heads at **y 75%**, spans x 40–72% (the pallu reaches x 37% at 6s).
- Lotus foreground: y 87–100%.

### Quiet zone (textured parchment only)
- **Primary text band: y 18% → 45%, x 18% → 82% (64% clear width, centred).** Put the couple names and the main title here.
- **Secondary column: y 45% → 72%, x 37% → 63% (about 26% clear width, centred).** It narrows between the banana trees, then sits above the couple's heads and to the right of the gopuram finial. Put the date and a small line here.
- **"Tap to Open" seal:** centre at about **y 61%**, diameter of 20–22% of frame width, so it occupies about y 55–67%. It clears the right banana leaves (x 74%), the gopuram finial (y 67%, x ≤36%) and the heads (y 75%).
- Do not place text above y 17% or below y 72%.
- Falling petals cross y 12–65% between 3s and 7s. They sit behind the text layer, so they do not cause a collision.

### Text colour
The ground is light parchment (about #EEE7D6), so ivory text would have no contrast. Use:
- **Names/title:** deep kumkum maroon **#7A1F1A** (darker alternative: #5E1714).
- **Date, small caps, rules:** temple bronze **#8C5A22**. Use antique gold #B8863A only for hairline ornaments. It is too light for body text.
- **Seal:** vermilion or maroon disc (#A82A14 → #7A1F1A) with ivory #F7F1E3 lettering and a bronze #8C5A22 rim.

## 3. Rendering style DNA

### Surface and paper grain
- Handmade cotton-rag / crinkled washi parchment, filling the whole frame. It has a mottled, fibrous crinkle with low-contrast blotches (about ±6% luminance). The colour is a neutral-to-warm cream.
- There is no vignette and no gradient. The texture is evenly lit from edge to edge.
- Prompt phrase: *"crinkled handmade cotton-rag paper, soft mottled fibre texture, warm cream, evenly lit, no vignette."*

### Line and ink
- Mostly **lineless**. Forms are defined by colour and tone shifts, not by outlines.
- Where there is linework (gopuram carvings, hair, garland strings, sari border), it is a fine, darker tone of the local colour, about 1–1.5px at 720w. Examples: gopuram #6B4E22, hair #1E1A1A, sari folds #A82A14. There is never a uniform black keyline.
- Figures are stylised and faceless, with no facial features.

### Wash and shading
- Digital gouache over flat colour fields, with soft gradient modelling and a little dry-brush texture on leaves and petals. Banana leaves show painted vein striations.
- Balance is about **65% flat colour / 35% painterly**: flat local colour with one shadow tone and one highlight tone, plus a light watercolour bloom on lotuses and petals.
- Elements look like **collage cut-outs** layered on the paper, with clean edges. There are no cast shadows and at most a faint contact shadow.
- Lighting is flat, diffuse daylight, with a slight warm highlight from the upper left on the gopuram gold and the leaf tops. Contrast is gentle, with no deep blacks except the hair.

### Layering and negative space
- Back to front: paper → peach damask arch → toran/vines → banana trees → gopuram and couple → lotus foreground.
- Decoration frames a **U-shape**: a heavy top band, thin sides and a heavy bottom third. The upper-middle 45–55% of the frame stays empty parchment.

### Colour notes (sampled and estimated)

| Role | Hex |
|------|-----|
| Parchment ground (base / highlight / grain shadow) | #EEE7D6 / #F5F0E3 / #D9CFBA |
| Peach damask arch (fill / line / deep) | #F3D3A8 / #E8B987 / #D9A06A |
| Vermilion sindoor sari (main / mid / shadow) | #E0461F / #D2381A / #A82A14 |
| Blouse maroon | #8E1E1A |
| Sari zari border gold | #D9A441 |
| Antique temple gold (highlight / mid / shadow / deep) | #EFD9A0 / #D9B26A / #8F6A2E / #6B4E22 |
| Groom tan/ochre (fill / shadow) | #C9A16E / #9E7448 |
| Toran fuchsia (bloom / light / bud) | #C42E6B / #D8457F / #E87FA8 |
| Lotus pink (petal / magenta tip) | #F08DA8 / #D9467A |
| White lotus (fill / cool shadow) | #F4F1EC / #C9D3DC |
| Banana-leaf viridian (main / deep) | #2E8B4A / #1F5E34 |
| Banana-leaf chartreuse (highlight / light) | #A9C94A / #C8D96A |
| Dried banana leaf orange | #E8A43A |
| Teal-slate temple leaves (light / deep) | #7FA8A4 / #5E8A8C |
| Top foliage canopy green | #3E6B3A |
| Falling petals (pink / peach) | #E88A9A / #F2B8A0 |
| Deep warm ink (lines) / hair | #3A2418 / #1E1A1A |

### Prompt style block (reuse for Generate Image)
> Flat-painterly digital gouache illustration on crinkled warm-cream handmade cotton-rag paper (#EEE7D6). Lineless shapes modelled with soft one-tone shadows and fine tonal-colour detail lines; no black outlines, no cast shadows; layered collage cut-out feel with clean edges; flat diffuse daylight with a gentle upper-left warm highlight. Palette: vermilion #E0461F, antique temple gold #D9B26A, lotus pink #F08DA8, fuchsia #C42E6B, banana-leaf viridian #2E8B4A with chartreuse #A9C94A, teal-slate #7FA8A4, peach damask #F3D3A8, deep warm ink #3A2418. Transparent background, isolated element.

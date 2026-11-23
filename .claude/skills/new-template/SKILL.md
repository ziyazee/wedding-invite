---
name: new-template
description: Creates a premium experimental wedding invitation by cloning the golden template, re-skinning its theme and sections, and deriving a cohesive visual asset system from the Opening media. Uses manual model checkpoints for reference direction and implementation.
---

# New Template

Every new template starts as a copy of `src/experimental-template/_golden/`. It is built from a plug-in section system: one contract, a registry, a layout array and a generic renderer. Do not rebuild that machinery. Re-skin it.

## Invoke

```
/new-template
```

## Rules

- Work only inside `src/experimental-template/{name}/`. The one external touch is a lazy route in `src/App.tsx` (`/experimental/{name}`).
- Leave `_golden/` and every existing template untouched.
- `/new-template` authorizes shell commands, `tsc`, builds, the dev server, `ffmpeg`, and browser automation for QA. It does not authorize commits, pushes or deploys.
- Experimental only: there is no production contract (no text IDs, no editor wiring, no DB templates).
- Honour `src/experimental-template/workflow/MASTER_RULES.md` for CSS scoping, reduced motion, and animation limits. Where it conflicts with `_golden` (e.g. text-ID rules), `_golden` wins.
- Preserve unrelated edits in the working tree.
- Model changes are manual. At each model checkpoint, stop completely and wait for the user to confirm the switch. If the recommended model is unavailable, let the user choose `stay` and continue with the current model.

## Quality contract (non-negotiable)

Quality is never traded for cost or speed. Only repetitive engineering work may be shortened, and only by the tools in `workflow/tools/`. If a run is cheaper than the previous template, that must come from those tools, never from doing less research, design, assets, code or animation.

Forbidden shortcuts:
- Skipping or thinning the research pass, the reference analysis or the asset manifest.
- Keeping golden geometry, dividers, particles or timelines with a colour swap.
- Fewer or smaller assets, reusing one motif across sections, or leaving a section with a generic box, circle or pill.
- Dropping animations, per-section particles, reduced-motion support or the stress tests to save effort.
- Declaring done without the verification below. Do not summarize "done" while any audit item fails.

Mandatory, every run, in this order (each is a gate; do not move on without it):
1. **Research written down.** Spawn `cultural-researcher` and `reference-asset-analyst` and save the results to `{name}/planning/cultural-direction.md` and `{name}/planning/reference-analysis.md` before proposing the direction. These are not optional "when available". If a subagent is unavailable, do the research yourself, in the same depth, and write the same files.
2. **Direction approved by the user**, including a full asset manifest with prompts. The manifest must cover at least: family crest + corner, event toran + corner, RSVP header, countdown scene, closing scene, a Couple-section top valance or equivalent signature piece, and any extra culture-specific pieces the research supports.
3. **Every section custom.** Each of the six sections gets its own composition, its own redrawn `Divider.tsx`, its own culture-specific particle sprites, and its own tuned GSAP timeline. Countdown needs custom unit plaques (not the golden shapes) and a drawn-on rail or equivalent. Celebrations needs an event-type motif matcher and a crafted date plaque. Couple needs a top-edge signature piece and one culture-specific connector between the two families.
4. **Opening and Closing placed from the artwork**, verified by screenshots.
5. **Depth audit passes:** `bash src/experimental-template/workflow/tools/audit.sh {name} {prefix}`. It is mechanical evidence only; taste is still judged by reading the screenshots, section by section, against the "Premium visual bar".
6. **Full verification** (Phase 4) including the stress tests.

If the user later says a template looks basic, treat it as a failed gate: find which gate was skipped, fix the template, and fix the skill.

## Architecture you are cloning

```
{name}/
  index.tsx              route entry: config + data -> <GoldenRenderer>
  config/layout.ts       the layout array, Opening media, music, seed
  config/sample.ts       sample WeddingData
  core/                  do not fork lightly: contract, registry, Renderer, MediaSlot,
                         theme, seeded rng, reduced-motion hook, scroll (Lenis), music,
                         countdown logic, RSVP state, events rendering, AmbientLayer
  sections/{id}/         one folder per section: index.tsx (plug-in), Divider.tsx, {id}.css
  sections/index.ts      registry: one registerSections line
  styles/golden.css      core styles
```

- **Contract:** every section is a component taking `{ data, theme, ctx }`. `ctx` carries `reducedMotion`, `seed`, `media`, `options`, `scroll`, `music`, `onRsvp`.
- **Plug-in:** a section file default-exports `SectionPlugin { id, Component, particles?, Divider?, media? }`. It brings its own particles, animation and divider.
- **Layout:** `config/layout.ts` is an array of `{ section, media?, options?, divider?, particles? }`. Reorder or remove a section by moving or deleting one line. Add a section: create its folder, add it to `sections/index.ts`, add one layout line.
- **Opening:** always first and fixed. It lives in `config.opening`, not in `layout`. It takes an image or a video. Video keeps tap-to-open (starts the film and music, unlocks scroll). Image mode has no gate and runs a slow push.
- **Media slots:** every other section takes an image or video through `media` on its layout entry. `slot: 'background'` fills behind it, `'banner'` renders a framed strip above it. The renderer draws it, so sections need no media code. `parallax`, `overlay`, `aspect`, `position` are optional.
- **Motion:** GSAP + `@gsap/react` + Lenis. Always import from `core` (`gsap`, `useGSAP`, `reveal`, `drawOn`). Reveals use opacity/blur/scale/clip, never translateY. Randomness comes from `ctx.seed` via `createRng`, never `Math.random()`. Reduced motion shows everything static with no particles.

## Phase 1: Discovery

Ask in order. Skip anything already answered.

1. **Template name** (kebab-case, becomes the folder) and **cultural identity or tradition** (e.g. "Kerala Hindu", "South Indian Muslim"). Never infer culture from the name. Optionally, a one-line description of the feeling.
2. **Opening media: image or video?** and its file path. This is the only media question you ask. Verify the path exists (Read tool). Never ask about media for any other section. For a video with no poster, extract one with `ffmpeg` (a mid-late frame).

### Model checkpoint 1 — reference direction

After the Opening path is verified, show this checkpoint and **do nothing else**:

> **Model checkpoint — reference direction**  
> Recommended: switch this chat to **Gemini 4 Carbon Medium** for cultural research, Opening/video analysis, creative direction and premium asset planning.  
> Reply **switched** when ready, or **stay** to continue with the current model.

Wait for the user's reply. Do not analyze the Opening or propose a direction before they confirm.

After confirmation, research the tradition, analyze the Opening and propose a **direction**: palette tokens, display/body fonts, motif vocabulary drawn from the culture and religion (not from the video), section order, and a premium asset manifest. For every proposed asset, include its section role, composition, aspect/size, opaque-vs-transparent requirement, reference stills and a ready-to-use Cursor Generate Image prompt. Present it concisely and wait for approval. Run `cultural-researcher` and `reference-asset-analyst` every time (see the Quality contract) and save their output to `{name}/planning/`. Do not create the template folder yet: scaffold in Phase 2 and then move/copy the planning docs in, or write them straight into `{name}/planning/` after scaffolding. If the user wants it different, adjust and re-present.

## Phase 2: Scaffold

### Model checkpoint 2 — implementation

After the direction is approved, show this checkpoint and **do nothing else**:

> **Model checkpoint — implementation**  
> Switch this chat to **Claude Sonnet 5.5 Medium** for scaffolding, React/CSS/SVG/GSAP implementation, asset integration and QA.  
> Reply **switched** when ready, or **stay** to continue with the current model.

Wait for the user's reply. Do not copy files, generate assets or edit code before they confirm.

After confirmation:

Steps 1, 2 and 4 are automated. Choose a 2–3 letter prefix, then run:

`bash src/experimental-template/workflow/tools/scaffold.sh {name} {prefix} {ComponentName}`

It copies `_golden`, replaces `gd` everywhere (`gd-` classes, `--gd-` variables, `PREFIX`, the font link id, gradient ids), and adds the lazy import and route to `src/App.tsx`. It reports any leftover `gd`. Keep `isolation: isolate` on the root and use no `:root`/`html`/`body` selectors.

3. Copy the media into `{name}/assets/` and import it in `config/layout.ts` (or serve from an existing public path for demos). Never write to `public/templates/`.

Tools in `src/experimental-template/workflow/tools/` (pure engineering, no design decisions):
- `key.py in out.webp --width N`: chroma-key a flat-blue generated asset (samples the real border colour, soft-keys, despills, crops, resizes). Needs pillow and numpy.
- `audit.sh {name} {prefix}`: depth audit against `_golden` (planning docs, per-section changed lines, redrawn dividers, culture-specific particles, asset count/size/references). Run it before Phase 4 sign-off. It exits non-zero on failure; fix the template, never the thresholds.
- `qa.mjs {name} {prefix} [--reduced]`: 390px screenshots through the 9:16 iframe (Opening before/after tap, then every ~640px), plus console errors and overflow. Run it in an unsandboxed shell with vite running; then read the screenshots yourself.

## Phase 3: Re-skin

Do these in order. Stop to show the user after step 3.

1. `core/theme.ts`: tokens and fonts from the approved direction.
2. `config/sample.ts`: names, families, events and copy appropriate to the tradition. Dynamic event count: never assume four.
3. `config/layout.ts`: Opening media, music, section order, and any section media the user later asks for.
4. **Reference-to-asset pass:** treat the Opening as the template's *style* source (palette, line quality, finish), not as the source of asset subjects. Subjects come from the culture and religion (see "Subjects come from culture and religion" below).
   - For video, extract representative early/middle/late stills. Ignore half-revealed transition frames, compression artifacts and watermarks.
   - From the Opening, extract only the *style*: palette, line quality, texture, layering, lighting and negative space. Do not catalogue its buildings, plants or props as the asset list. Use `reference-asset-analyst` and `creative-ui-designer` when available.
   - Write a small asset manifest before generating. Put generated assets in `{name}/assets/generated/`; never in `public/templates/`.
   - Use Cursor's Generate Image tool to render the approved manifest after the implementation checkpoint. Do not redesign the approved assets while generating them.
   - Rasterize only painterly material: broad scenes, garlands, drapes, botanicals and cultural objects. Keep borders, dividers, form controls, progress traces, text and simple geometry as CSS/SVG.
   - Use no more than one broad backdrop and one foreground ornament in a viewport. Keep ornaments on edges and reserve the centre for text.
   - Do not ask the user for more media. Generate/repaint the required assets from the approved Opening direction.
   - **Subjects come from culture and religion, never from the video.** The Opening sets only the rendering language (palette, line quality, painterly finish). Every asset's *subject* comes from the tradition and its faith: sacred symbols and scripture motifs, places of worship and their architecture, ritual objects and ceremonies, textiles and embroidery, regional flora and crops, music and instruments, jewellery and dress, birds and animals, household and craft objects. Plan each asset from that vocabulary (e.g. Sikh Punjabi: Ik Onkar, gurdwara and palki, kalire, chooda, phulkari, haveli, sarson and wheat, mor, dhol, charkha, jutti, paranda). Research it with `cultural-researcher` when unsure, and be accurate and respectful with religious symbols (correct form, appropriate placement, never decorative clutter or on anything that would be stepped on or cut). Do not recycle what is merely visible in the video, and do not reproduce its scene.
   - **Assets must say something about their section.** Family art should be about the family: ancestral home, land, lineage, textiles. Celebration art should be about celebration: toran, garlands, bells, blooms. An attractive object with no link to the section's meaning is wrong.
   - **Never make a fixed-size frame for a content-driven card.** Family and event cards grow with their text (long names, addresses, any number of events). Build them as a CSS panel (gradient + hairline borders) plus separable pieces:
     - one **corner** piece drawn for a single corner and mirrored with CSS (`scaleX(-1)`, `scaleY(-1)`, `scale(-1,-1)`);
     - one **top-edge** piece (crest, toran, valance) that overhangs or sits on the top edge, with its width tied to the card and its height fixed;
     - stretchable edge ornament done in CSS/SVG (repeating stitch, rule with a diamond), never in the raster.
     Reserve padding for the pieces (top for the crest/toran, bottom for corners) so content never sits under them, and give the cards enough height for the pieces to breathe.
   - **Corner/edge asset pipeline.** Generate on flat `#0057FF`, then (a) sample the *actual* background colour at several points; AI "flat" blue drifts and may be a gradient (`ffmpeg -vf format=rgb24,crop=2:2:x:y -f rawvideo - | xxd -p`); (b) key with that colour, tolerance about 0.16–0.18; (c) compute the opaque bounding box from the alpha channel and crop to it with a small margin; (d) scale to about 2x the rendered width; (e) encode with `cwebp -q 86 -alpha_q 95` (ffmpeg here has no `libwebp`). Target 40–150 KB each. Check on the page background colour for halos.
   - **Animating overhanging pieces.** A `clip-path` on a card clips pieces that overhang it, and `gsap.from` leaves the final clip in place. Animate the card with opacity/scale, animate the crest/toran/corners on their own (clip with `clearProps: 'clipPath'`, blur with `clearProps: 'filter'`). Do not use `gsap.from` on `scale` for elements flipped with a CSS transform; fade them instead.
   - **Place text from the image, never from a fixed formula.** See "Image-aware placement" below.
5. `sections/*`: for each section, make its signature pieces specific to the culture:
   - **particles:** edit the `particles` array. Add sprites in `core/ambient/Sprites.tsx` (inline SVG tinted with `currentColor`) or use PNGs in a new sprite kind.
   - **divider:** redraw `Divider.tsx` as hand-built SVG with `className="{prefix}-draw"` and `pathLength="1"`; `useDrawOnScroll` animates it. Follow `draw-better-svg` for geometry and `svg-animation` for motion.
   - **animation:** adjust the GSAP timeline in the section. Follow `cinematic-gsap-lenis-motion-system` and the `gsap-*` skills. Smooth, deliberate, no bounce.
   - **composition:** replace generic UI geometry with a culture-specific scene or object system. A colour swap is not a re-skin.
6. Keep what is shared as is: countdown logic, RSVP state, events rendering, `AmbientLayer`, `FloatingElement`, `MediaSlot`, reduced-motion hook, music button. Celebrations already has map and calendar links.

To add a new section type, copy the smallest existing section folder, give it a new `id`, register it, add the layout line.

## Image-aware placement (Opening and Closing)

The Opening title block and the Closing blessing must be positioned from the actual artwork, not from a default offset. The golden template parks the Opening text low and the Closing text mid-page; that is only right for the golden artwork. For every new template:

1. **Study the image first.** Before writing `opening.css` or `closing.css`, view the Opening poster (and the generated Closing backdrop). Note, as percentages of the viewport height at 390x844: where the heavy elements are (drapes, chandeliers, foliage, architecture, the couple or focal figures), and where the quiet area is (open sky, plain wall, empty lawn, a clear band).
2. **Put text in the quiet area and keep the focal subject clear.** The text block must not overlap the couple, the main architecture or any face. Derive `padding-top`/`justify-content` from the measured band (for example, sky between the drape ending at 23% and the garland starting at 50% → start the title near 25svh). Put the tap-to-open seal or scroll hint in a quiet area too, so it never covers the focal subject.
3. **Choose text colour from the area it sits on.** Pale sky or wall → deep theme text with a soft light glow (`text-shadow` in the page ivory). Dark foliage or night → ivory text with a dark shadow. Add only the veil that region needs (a soft radial behind the text, a thin gradient at the edge for the scroll hint); never a heavy full-width scrim over the artwork.
4. **Closing backdrop is generated with a quiet area on purpose.** Prompt it with an explicit empty band (sky or wall) sized for the blessing, names and date, then place the closing text in that band, with `min-height` large enough that nothing sits on the busy part. Fade the backdrop's top edge into the previous section with a mask instead of a hard seam.
5. **Verify by screenshot** at 390px, before and after the Opening tap, and at the Closing. If the text touches a focal element, move the block; do not darken the image to compensate.
6. Decorative dividers must not sit on a media edge. If a section transition has a seam, fade it with a mask rather than stacking an ornament on it.

## Premium visual bar

Every section needs one cultural anchor, one compositional idea and one crafted detail. Use these defaults unless the approved direction calls for something else:

- **Family:** culturally specific, content-flexible cards: an ancestral-home or lineage crest on the top edge, mirrored corner pieces from the family's land/textile, a CSS stitch border and a rule between parents and the person. Never two plain bordered boxes, never a fixed-size raster frame.
- **Countdown:** a cultural environment (pavilion, shrine, garden, textile panel, etc.) with styled units; never four circles or dashboard tiles. Fade the backdrop's top and bottom edges with a mask.
- **Celebrations:** a flexible card per event (CSS panel + top-edge toran/garland + mirrored bloom corners) with a crafted date plaque and an event-specific motif; never a basic rounded date badge repeated down a line, and never assume four events.
- **RSVP:** frame the form with drapery, botanicals or architecture while keeping fields calm; do not put the form in a generic glass/card panel.
- **Closing:** use the strongest full scene here, with a deliberate quiet area for the blessing and names.

Reject a section and redesign it when it looks like a generic event template, a technology dashboard, or the golden template with new colours. In particular, avoid default rectangles, circles, pills, glassmorphism, repeated gold outlines and the same motif in every section.

Generated assets must:

- Match the Opening's rendering language and palette; pass a still as a *style* reference only. The prompt describes culture/religion subjects explicitly, so the model does not copy the video's scene.
- Be generated at about 2× rendered size, contain no embedded text and keep important detail legible at final mobile size.
- Use JPG/WebP for opaque backgrounds and PNG/WebP for transparency. Prefer under 400 KB for backgrounds and under 650 KB for transparent ornaments.
- Leave intentional negative space. Do not solve text legibility by covering an illustration with a large opaque card.
- Be inspected after generation. A painted checkerboard is not transparency.

When the image tool cannot output alpha, generate on a flat chroma-blue `#0057FF` background and remove it with `ffmpeg`. **Chromakey must run before despill**:

```bash
ffmpeg -i input.jpg \
  -vf "chromakey=0x0057FF:0.18:0.04,despill=type=blue:mix=1:expand=0.16:blue=-1,format=rgba" \
  output.png
```

For motif sheets, remove chroma first, then crop the transparent cells. Check the final edges in-browser for blue halos.

## Phase 4: Verify

Run all of these and fix what they find:

0. `bash src/experimental-template/workflow/tools/audit.sh {name} {prefix}` must pass. Then compare your screenshots to the reference builds (`tamil-wedding`, `punjabi-wedding`) section by section: if any section is visibly plainer than they are (fewer layered pieces, flatter dividers, weaker date plaques or countdown units), redesign it. Never lower an audit floor to pass.
1. `npx tsc -b 2>&1 | grep {name}` must be empty (other templates have unrelated errors).
2. `npx oxlint src/experimental-template/{name}`.
3. Start `npx vite`, open `/experimental/{name}` and `/experimental/{name}?opening=image` if you kept the query switch. The app renders inside a 9:16 iframe frame, so screenshot the `iframe` element and call `scrollTo` on the child frame (`page.frames()`).
   Shortcut for 3–5: `node src/experimental-template/workflow/tools/qa.mjs {name} {prefix}` (and again with `--reduced`) needs an unsandboxed shell; it writes the screenshots and prints console errors and overflow.
4. Check at ~390px wide: Opening before and after tap, every section, divider clipping, particles, text legibility over any media. Background scenes: keep the full artwork aspect (`aspect-ratio`, pinned to the bottom) and give the section enough height that text never reaches the artwork's busy area.
5. Re-run with `reducedMotion: 'reduce'`: all content visible, no particles, timeline and dividers fully drawn.
6. Exercise RSVP, a map link, the calendar link and the `.ics` download.
7. Headless Chromium has no H.264, so a video will not decode in Playwright. The poster shows and the name reveal falls back to its timer. Say so rather than claiming video playback was verified.
8. Inspect every generated asset at its actual rendered size: alpha, crop, halo, compression, text contrast and section overlap.
9. Stress the flexible cards: temporarily lengthen a name, an address and add or remove an event. Cards must grow with no clipped text, nothing under a corner or toran, and no overhang cut by `overflow`.
10. Check Opening and Closing text against the artwork (see "Image-aware placement"): no overlap with the focal subject, readable at 390px.

Show screenshots to the user. Fix any section that still looks generic: unchanged golden geometry, dividers, particles or palette; basic boxes/circles; ornamental assets that compete with text.

## Phase 5: Hand off

- Summarize what changed, the route, and anything unverified. Include the audit result and list each gate (research, direction, custom sections, placement, audit, verification) as done or not done. Never hide a skipped gate.
- Update `PROJECT_CONTEXT.md` only if the golden architecture itself changed (not for a new re-skin).
- Do not commit or push unless explicitly asked.

# Review fixes to apply on top of concept.md

Sources: UI-design critique + motion review. These override concept.md where they conflict.

## Whole piece
- Cut total length from ~2380svh to ~1500svh (Scene 1 160, Scene 3 4x70, Scene 6 100, Scene 7 300).
- Names visible at scroll 0 (on the shagun envelope flap); date on a small brass plate on the door.
- Thread present in EVERY scene: one SVG path per stage, pathLength=1, stroke-dashoffset: calc(1 - var(--p)), 2-3px, no filters. Segments hand off at an agreed screen point (top-centre).
- Fixed 44px music/horn toggle in a corner (if audio is used).
- Text over art: normal blend only, no multiply/overlay/perspective on text. Min 16px body, countdown digits 22px+, 4.5:1 contrast. Screen-reader list for events and static date.

## Scene fixes
1. Shagun: fake door swing in 2D (scaleX to 0.12 at hinges + shade overlay); no preserve-3d.
2. Jaago: countdown on a flat brass tag tied to the gaagar neck (no curved engraving, no blend); aria-live off + hidden static date; cut bell tap.
3. Bagh: event rows in indigo/vermilion on cream, flat (no tilt); stepped pan only (drop needle drag); mount only two adjacent bands.
4. Road: pin it as a vertical pan (no unpinned mode); split art into 3 tiles of 780x1600.
5. Milni: change to a top-down view of two shawl stacks on a dari (new camera angle); family names on the open top shawl; halves = two translateX layers.
6. Hush: pull-back scale 2 to 1 only; no text.
7. Doli: no drag, no canvas mask. Blessing covered by 4-5 cut-out phulian drifts that slide/fade on --p, clear by 0.7; tap the thaal to throw 8-10 CSS grains. Thread trails from the car then snaps to the gate niche.
8. Manja/RSVP: real labelled inputs (16px+) on a bahi ledger; form in normal unpinned flow after a 100svh pinned intro; buttons "Joyfully attending / Sending blessings" with Punjabi beneath; one short pani vaarna circle (NOT seven, reads as phere); manja appears after submit as payoff.

## Engine extensions (minimal)
- Stage-less scenes write --p on the track (~6 lines)
- Smoothed --j (~5)
- Keyboard guard: skip re-measure while an input is focused (~6)
- scrollToProgress(scene, p) helper (~10)
- Live window one viewport ahead (1)

## Budgets
- Max 2 live stages, 8 composited layers per stage, 12 total.
- Plates 780px WebP <=250KB; cut-outs <=800px long edge, <=80KB; no image >4MP.
- <=600KB before Scene 1 shows; <=3.5MB total. Particles <=12 per scene.
- Never animate filter/backdrop-filter/blend per frame; grade light with overlay opacity.

## Reduced motion
Doors ajar and names visible; static glow with ticking countdown; crossfade bands; no parallax; halves closed; crossfade palla to shoes; blessing shown, no grains; fades only; thread fully drawn.

## Content rules (research)
- Core rite is a swappable block: Anand Karaj (Sikh, four laavan) vs pheras (Hindu). Never mix. Never depict Guru Granth Sahib, Gurus, deities. No khanda decoration. Gurdwara exterior only.
- Gurmukhi strings need native review; blessing must be a family blessing, not Gurbani.

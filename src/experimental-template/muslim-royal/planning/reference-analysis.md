# muslim-royal — Reference analysis and asset manifest

## Style DNA (carried from the approved punjabi-heritage build, not its subjects)
- Rendering language: lush painterly digital illustration with fine ornamental linework, luminous glow, visible paper tooth in skies, 9:16 scenes at 1080×1920.
- Pipeline: opaque scenes JPG; ornaments on flat `#0057FF` → `workflow/tools/key.py` → WebP. No text in any image.
- Depth: scenes are split into near and far plates (auto-masked sky/garden hole, far plate scaled 1.25) driven by `useDepthParallax`; the countdown scene and text layers drift at their own speeds.
- Layout: text sits in measured quiet bands; edges of scenes fade into neighbouring sections with masks.

## Palette hexes used in prompts
night `#0A1B2E`, sapphire `#1D3B66`, teal haze `#1E5A63`, emerald `#0F5B47`, gold `#C9A24B`, marble `#F6EEDC`, lantern glow `#FFC970`.

## Common style prefix (prepend to every prompt)
"Lush painterly digital illustration, premium Mughal-court wedding art, fine ornamental linework, soft luminous glow, rich emerald, ivory marble and gold-leaf palette, crisp detail, no text, no lettering, no calligraphy, no people, no animals, no watermark."
Transparent pieces add: "on a perfectly flat solid #0057FF blue background, no shadow on the background, no gradient, subject fully inside frame with margin."

## Asset manifest (17 pieces)
| # | File | Role | Aspect / size | Alpha | Composition |
|---|---|---|---|---|---|
| 1 | opening-marble-iwan-dusk.jpg | Opening scene (split to near+far) | 9:16 1080×1920 | opaque | Centre: white-marble iwan with a tall multifoil arch, jali panels each side, brass fanous lanterns lit, three marble steps; through the arch: charbagh channel, fountain, cypress, a domed pavilion and slim minaret, deep blue-hour sky with first stars. Top 24%: mogra and rose strands hanging in a curtain, dipping to ~24% at the quarter points, centre clear. **Clear sky band at 24–46% height, centre.** Plain marble threshold at 88–100%. |
| 2 | countdown-courtyard-night.jpg | Countdown scene | 9:16 | opaque | Night marble courtyard seen between two slender columns with multifoil arches; jali, fountain basin and lit lanterns only below 78%; **centre wall plain and quiet from 11–80%, x 16–84%**. |
| 3 | closing-garden-night.jpg | Closing scene (split) | 9:16 | opaque | Marble multifoil arch frame with velvet-and-zardozi drapes at the top; through it a night charbagh, domes lit softly, cypress, reflecting channel at the bottom; **arch sky clear 14–70%**, sill with small lit diyas/fanous at ~84%. |
| 4 | couple-zardozi-valance.webp | Couple top-edge piece | ~3:1 wide | key | Scalloped emerald velvet qanat valance with gold zardozi arabesque border, gold tassels and pearl strings, flat top edge. |
| 5 | family-arch-crest.webp | Family card top-edge | ~3:1 | key | Small white-marble cusped arch with onion dome, gold finial and crescent, inlaid lapis/jade flowers; flat base. |
| 6 | family-pietra-corner.webp | Family card corner | ~1:1 | key | Pietra-dura tulip, iris and lily corner spray with gold stem, designed for bottom-left. |
| 7 | countdown-niche-plaque.webp | Countdown unit plaque | 2:3 | key | Marble multifoil niche with gold frame, lapis inlay edge, small gold crescent finial; interior plain ivory. |
| 8 | celebration-sehra-toran.webp | Celebrations header | ~7:3 | key | Hanging strands of mogra and red rose beads with gold-thread tassels and pearl drops, flat top beam of emerald brocade. |
| 9 | celebration-corner.webp | Event card corner | ~1:1 | key | Rose and mogra bloom cluster with emerald leaves and a gold thread, bottom-left. |
| 10 | date-plaque.webp | Date plaque | ~1:1 | key | Eight-pointed star (khatam) plaque, gold rim, emerald and ivory inlay, plain ivory centre. |
| 11 | rsvp-takht-tableau.webp | RSVP header | ~5:3 | key | Low royal takht with emerald velvet bolsters, silver paandaan, crystal attar bottles, rosewater sprinkler, silver tray of dates, a brass lantern each side. |
| 12 | motif-mangni.webp | Mangni motif | ~4:3 | key | Open ring box with a ruby ring and a small attar bottle on a velvet cushion. |
| 13 | motif-mehndi.webp | Mehndi/Dholki motif | ~4:3 | key | Henna cone beside a brass thaal with henna paste, petals and bangles. |
| 14 | motif-dholki.webp | Sangeet motif | ~4:3 | key | Dholak drum with brocade ropes and rose garlands. |
| 15 | motif-nikah.webp | Nikah motif | ~4:3 | key | Nikahnama scroll with a gold qalam and ink pot, with a spray of roses. |
| 16 | motif-walima.webp | Walima motif | ~4:3 | key | Silver handi and tray of dates and sweets. |
| 17 | (derived) opening-near/far, closing-near/far | Parallax plates | 1080×1920 | split | Auto-masked from #1 and #3. |

## Placement assumptions (verified after generation, as before)
Opening text band 24–46%; countdown content in x 16–84% / y 11–80%; closing text in arch sky y 20–62%; scroll hint on the threshold slab.

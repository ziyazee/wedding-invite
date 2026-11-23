# Punjabi Journey: Concept & Storyboard

Spine: **dusk to dusk inside one haveli** (Dhillon Haveli), with the baraat road across the mustard fields as the only trip outside. The visual language is Kangra/Punjab miniature gouache, built as paper-theatre cut-out layers. Palette: mustard `#E3A82B`, vermilion `#C23B22`, phulkari magenta `#B0225B`, parrot green `#3E7C3A`, cream `#F4E6C6`, terracotta `#B5573A`, gold `#C9972B`, night indigo `#1E2A5A`. There are no figures or faces, no sacred imagery, and no text baked into the art.

> `style-dna.md` was not present in `planning/`. The style rules above are taken from the brief.

---

## 1. Governing idea

**The house is getting ready for you. A single gold phulkari thread, tied to the haveli's door ring at dusk, leads you through one night and one day, and everything the family wants you to know has been stitched, lit, stamped or engraved onto the things the thread touches.**

Why it reads as authored:
- The thread is one device, so every transition has a cause: it is tied, climbs, stitches, flies as a kite string, binds, goes slack and finally knots. The scenes stop being interchangeable because each one is reached by following the thread, and each one changes the thread.
- The information belongs to the ritual. The countdown burns on the jaago lamp because jaago means "wake, it is coming". The schedule is stitched into the bagh because grandmothers stitched a bagh for a girl's wedding. Nothing is placed on top of a picture; each piece of information is part of an object.
- The light carries the clock (dusk, night, blue dawn, mustard morning, white hush, long gold, lamp-dusk), so scroll progress *is* the passing of the wedding day.

**Guest's role: the awaited guest.** You are not a spectator but the person the house is preparing for. You find a shagun envelope at the door, you are woken by the jaago, you go out to meet the baraat, and at the end a borrowed manja is carried out into the courtyard with your name stencilled on it.

**Text rule (engine):** all text is live HTML anchored to an object plane. It inherits that plane's transform (rotate, perspective, scale) and is blended (`multiply` on cloth and paper, a light `overlay` on brass) so it reads as ink, stitch or engraving. Contrast is checked at 390px. Art stays text-free.

---

## 2. Beat sheet (8 scenes)

### Scene 1: Shagun at the Door
- **Echoes:** Roka / sagan: the word is given.
- **Light:** Winter dusk on the eve, with a terracotta sky fading toward indigo at the top.
- **Setting:** The deorhi, seen from the lane: a nanakshahi brick arch, a studded double door, a brass plate, two gharas and a marigold toran.
- **Feeling:** Private anticipation, a held breath.
- **Carries:** **Couple names.** A vermilion shagun envelope with a chhuara is tucked in the iron door ring. Early in the scroll the envelope slides out of the ring and its flap lifts. *Harpreet & Simran* is written on the inside of the flap in Gurmukhi and Latin.
- **Guest action:** Scroll only.
- **Scroll model:** **Rotate/turn.** After the names hold, the two door leaves swing inward (rotateY about their hinges) and the gold thread is revealed, tied to the ring.
- **Layers (front to back):**
  1. Marigold toran strings (cut-out)
  2. Envelope flap (cut-out)
  3. Envelope body + chhuara (cut-out)
  4. Door leaf left (cut-out)
  5. Door leaf right (cut-out)
  6. Brick arch + wall + gharas, with a transparent doorway (cut-out)
  7. Night courtyard and stair seen through the door (opaque; the shared *vehra* plate, night grade)
  8. Dusk sky gradient (CSS)
- **Transition and device:** The thread runs from the ring, across the courtyard and up the stair. The camera follows it upward while the dusk grades to indigo. A loudspeaker crackles once.
- **Length:** 220svh.

### Scene 2: Jaago Aayi Aa
- **Echoes:** Jaago, the loudest night.
- **Light:** Full night in indigo, lit by amber lamp flame and fog.
- **Setting:** The kotha (roof), looking down a foggy brick lane between roofs.
- **Feeling:** Noise and joy. The village is awake.
- **Carries:** **Date/time + live countdown.** The brass gaagar crowned with diyas is lifted onto the parapet. *14 · 02 · 2027 · 10:00 IST* is engraved around its neck, and the live days, hours and minutes tick on its belly. Each tick sets one diya flame flaring. The flames grow taller as the date gets closer (flame height mapped to days remaining).
- **Guest action:** Tap the gaagar to shake the belled stick (bell and dholki audio). Tap the loudspeaker horn to toggle music for the whole piece.
- **Scroll model:** **Ascent + light-bloom.** The parapet drops away as you climb onto the roof. A warm glow (CSS radial with flicker) travels up the lane toward you, and at about 0.6 the gaagar rises into frame and the glow blooms across the roofs. Fireflies and sparks are CSS particles.
- **Layers (front to back):**
  1. Spark particles (CSS)
  2. Gaagar with diya crown (cut-out; flames are a separate small cut-out)
  3. Parapet (cut-out)
  4. Loudspeaker horn on pole + *lareeyan* bulbs (cut-out)
  5. Near rooftops (cut-out)
  6. Lane with fog banks (cut-out)
  7. Far roofs + tube-well lights (cut-out)
  8. Night sky (CSS gradient + star dots)
- **Transition and device:** **The lamp is carried down.** The gaagar sinks below the parapet and its glow drops with it. You land in the courtyard, where the same flame now sits as a small diya by a charpai.
- **Length:** 300svh.

### Scene 3: The Bagh Is Finished
- **Echoes:** The phulkari bagh stitched for the daaj, the grandmother's work, finished through the small hours.
- **Light:** Lamp-lit indigo turning to blue dawn on the last step.
- **Setting:** The vehra. A bagh lies across a charpai, with a needle, a thimble and a diya. There are no hands.
- **Feeling:** Intimate craft. The night's noise drains away into the quiet of the needle.
- **Carries:** **The four events.** Each geometric band of the bagh is one event, and its details sit in the plain khaddar row beneath the motif, set as if darned in pat-gold.
  - **Jaago Night:** a band of lamp-diamonds
  - **Mehndi:** a leaf-lozenge vine in parrot green
  - **Wedding Ceremony:** four nested squares
  - **Sweets & Reception:** a field of stepped laddoo dots
  Each row gives the day, time, place and one-line description.
- **Guest action:** Scroll. Dragging the needle sideways also scrubs the pan.
- **Scroll model:** **Stepped horizontal pan.** The bagh slides right to left through four steps, and each step dwells. The gold thread (an SVG stroke) is drawn through each band as it arrives, as if being stitched.
- **Layers (front to back):**
  1. Needle + thread end (cut-out)
  2. Diya + thimble (cut-out)
  3. Bagh strip, about 4× viewport width, made of four tileable bands (cut-out)
  4. Charpai frame + rope weave (cut-out)
  5. Chooda bowl in milk at the charpai's foot, appearing only on the dawn step (cut-out)
  6. Vehra floor and wall (opaque; shared plate, night to dawn grade)
- **Transition and device:** **The last stitch pulls the thread taut.** It runs out through the open deorhi and rises into the dawn sky as a kite string.
- **Length:** 440svh (4 steps × 100 + entry).

### Scene 4: The Road Through the Sarhon
- **Echoes:** The baraat coming across the fields. This is the one trip out.
- **Light:** Bright mustard morning with a little fog lingering low.
- **Setting:** A tall painting in miniature convention: stacked registers of mustard field, a winding road, kikar trees, a tube-well koti and the haveli walls on the top horizon.
- **Feeling:** Loud, bright, open air. The dhol is coming.
- **Carries:** **Venue + map.** A roadside milestone (cream stone with a mustard cap) reads *Dhillon Haveli · Ludhiana*. Tapping it opens the map link. As the scroll nears it, the stone tilts slightly toward the viewer.
- **Guest action:** Scroll. Tap the milestone.
- **Scroll model:** **Unpinned tall-scroll register climb.** The painting scrolls naturally, with no sticky stage. Kites and the decorated trolley move on their own parallax rates. Dust and marigold petals drift as CSS particles. The baraat appears without people: a dust plume, magenta bunting, a dhol riding on a trolley, and horn and dhol sound.
- **Layers (front to back):**
  1. Kites with strings (3 small cut-outs)
  2. Kikar tree (cut-out)
  3. Milestone (cut-out)
  4. Trolley with dhol + bunting (cut-out)
  5. Tall field painting with road and haveli on the horizon (opaque, about 390×2400)
- **Transition and device:** **The kite string is reeled in at the haveli.** The road ends at the deorhi, and the same door, now in morning light, is already open.
- **Length:** ~300svh of natural scroll.

### Scene 5: Milni at the Gate
- **Echoes:** Milni: two families meeting in pairs.
- **Light:** Warm late morning on brick.
- **Setting:** The deorhi, open, with marigold garlands and a thaal of jalebi and matthi on a ledge.
- **Feeling:** Warmth. Two families visibly becoming one.
- **Carries:** **Both family blocks.** A stack of folded shawls sits on each side: groom's family in phulkari magenta on the left, bride's family in parrot green on the right. Each name is woven along a fold edge, one name per shawl, and the top shawl names the family.
- **Guest action:** Tap a shawl pair to unfold the top shawl and read the longer note under it (optional).
- **Scroll model:** **Split-converge.** The stage opens as two halves with a gap of mustard field between them. Scroll slides the halves together, the seam closes behind a marigold garland, and the two stacks end up side by side.
- **Layers (front to back):**
  1. Garland across the seam (reuses the toran cut-out)
  2. Shawl stacks, left and right (cut-outs; one folded shawl drawing, recoloured)
  3. Unfolded shawl (cut-out, recoloured)
  4. Jalebi thaal (cut-out)
  5. Deorhi with open leaves (reuses Scene 1 frame + leaves, morning grade)
  6. Mustard field strip in the gap (crop of the Scene 4 painting)
- **Transition and device:** **A shawl unfolds to fill the frame.** The last shawl opens toward the viewer, and its cream cloth whitens until it is the white of the next scene.
- **Length:** 260svh.

### Scene 6: The Hush
- **Echoes:** Anand Karaj, the quietest moment, shown only through what is left outside.
- **Light:** Flat white morning with lattice shadows.
- **Setting:** A pink palla laid in a slow curve on a white sheet. Then the camera pulls back past a lattice to rows of shoes at the joda ghar. There is no scripture, no interior darbar, no figures and no emblem.
- **Feeling:** Silence. All audio fades to nothing.
- **Carries:** **Nothing.** This is deliberate. Putting no text here is the respectful choice, and the emptiness is the content.
- **Guest action:** None.
- **Scroll model:** **Pull-back.** The camera starts close on the palla and scales out through the lattice to the shoe rows. The colour grades toward near-white while the gold thread goes slack.
- **Layers (front to back):**
  1. Lattice shadow (cut-out)
  2. Shoe rows on white steps (cut-out)
  3. Palla on sheet (cut-out)
  4. White sheet field (CSS)
- **Transition and device:** **The palla's pink end slides out of frame.** Colour floods back in as afternoon gold, as if the household had exhaled.
- **Length:** 180svh.

### Scene 7: Phulian Over the Shoulder (longest)
- **Echoes:** Doli: the bride throws puffed rice back over her head without turning round, so the house stays full.
- **Light:** Low winter afternoon gold, with long shadows that lengthen with the scroll.
- **Setting:** The deorhi seen **from inside the courtyard**, looking out. A marigold-decked car is reversing out through the gate, the daaj trunk is roped on, and a thaal of phulian rests on the threshold. There is no person.
- **Feeling:** The ache, the peak of the piece. It is slow, and the vidaai song can be heard faintly if audio is on.
- **Carries:** **The blessing**, in Gurmukhi and Latin. It is hidden under a layer of scattered phulian.
- **Guest action:** **Drag (flick) upward from the thaal**, which means throwing the rice back over your shoulder. Each flick scatters grains (particles) and clears part of a mask over the threshold stones, revealing the blessing as if written on the swept brick. Scroll alone also clears it slowly, so the scene still works without the gesture.
- **Scroll model:** **Reveal-by-mask + slow drift.** The car eases out through the gate over the full length of the scroll, and the shadows stretch across the courtyard (a CSS gradient mask). Coins glint once as the car clears the gate.
- **Layers (front to back):**
  1. Phulian grains (cut-out sprite + CSS particles)
  2. Phulian thaal (cut-out)
  3. Long shadow overlay (CSS)
  4. Car rear with marigold (cut-out)
  5. Daaj sandook (cut-out)
  6. Deorhi from inside, with the lane beyond (opaque, new angle)
- **Transition and device:** **A lamp is lit in the gate niche.** The gate is empty and the light falls to dusk. The diya from Scene 2 is lit in the *aala* by the door, and the house turns back toward you.
- **Length:** 480svh.

### Scene 8: A Manja Is Kept for You
- **Echoes:** Pani vaarna and the practice of borrowing manjas for guests. The house welcomes you instead of letting you go.
- **Light:** Dusk again, with lamp-warm terracotta. The cycle closes.
- **Setting:** The vehra at dusk: a niche with a diya, a printed wall calendar on a nail, a brass lota, and charpais leaning against the wall.
- **Feeling:** Warm release and welcome.
- **Carries:** **RSVP + add-to-calendar.**
  - **Name:** typed text appears live as stencil along the manja's side rail.
  - **Accept/decline:** two lamps in the niche: *Aavange* ("we'll come") lights the diya, *Asees bhejange* ("sending blessings") lays a folded shawl on the manja.
  - **Guest count:** a stepper that brings 1–6 manjas out from the wall.
  - **Submit:** the lota circles seven times as the submit animation.
  - **Thank-you state:** your manja sits in the centre of the courtyard with your name on it, the lamp burns, and the line reads "Your manja is kept."
  - **Add to calendar:** tapping the wall calendar exports the event (.ics / Google).
- **Guest action:** Tap and type.
- **Scroll model:** **Interactive stage.** It is pinned briefly and the scroll settles there; the scene is driven by taps, not progress.
- **Layers (front to back):**
  1. Lota (cut-out)
  2. Manja (reuses the Scene 3 charpai, duplicated with offsets)
  3. Wall calendar (cut-out)
  4. Aala niche + diya (cut-out + shared flame)
  5. Vehra at dusk (opaque; shared plate, dusk grade)
- **Transition:** This is the end. The gold thread knots itself around the manja leg.
- **Length:** 200svh (pinned) + the form.

**Total:** about 2,380svh.

---

## 3. Emotional curve

```
LOUD     .        S2 Jaago                S4 Road
         .       /      \                /     \
WARM     S1 ----/        \   S3 Bagh ---/       \- S5 Milni       S8 Welcome
QUIET                     \_/                       \            /
SILENCE                                              S6 Hush    /
ACHE                                                     \- S7 Doli
```

The piece has two loud peaks (night noise and the open-air dhol), each followed by a drop into intimacy: the needle after the jaago, and the silence after the milni. The deepest point is **Scene 7, Doli**, which is the longest, slowest and most important scene. It is the only scene where the guest's gesture is itself the ritual. Scene 8 lifts the piece back to warmth so that it ends on welcome, not loss.

---

## 4. Content mapping

| Fixed content | Scene | Carrying object |
|---|---|---|
| Couple names | 1 Shagun at the Door | Inside flap of shagun envelope in door ring |
| Date/time + live countdown | 2 Jaago | Engraved gaagar neck + ticking belly, diya flames |
| Four events (day/time/place/line) | 3 The Bagh | Four phulkari bands, darned text rows |
| Venue + map link | 4 The Road | Roadside milestone (tap → map) |
| Groom's family / bride's family | 5 Milni | Two shawl stacks, names on fold edges |
| Blessing (Gurmukhi + Latin) | 7 Doli | Threshold brick revealed under thrown phulian |
| RSVP (name, accept/decline, count, thanks) | 8 Manja | Manja rail stencil, niche lamp, manja count, lota |
| Add-to-calendar | 8 Manja | Wall calendar on nail |
| Music toggle (global) | 2 Jaago | Rooftop loudspeaker horn |

---

## 5. Reject list

- **No card over a background.** No rounded panels, frosted glass, or text boxes floating over art. If text has no object to live on, the object is missing.
- **No two consecutive scenes with the same scroll model.** The sequence is rotate, ascent, stepped pan, unpinned climb, converge, pull-back, mask, interactive. Only Scene 4 uses vertical motion without a pinned stage.
- **No default pinned push-in.** No scene relies on scale-into-centre as its main move.
- **No figures, faces, hands, silhouettes, or riderless ghodi.** Rituals are shown through objects, light and sound.
- **No sacred imagery:** no Guru Granth Sahib, palki, chaur, darbar interior, khanda, deities, fire-mandap or Gurbani typography. Scene 6 stays outside.
- **No text baked into any PNG/WebP.**
- **No Rajasthani sandstone, jharokhas, camels, peacock wallpaper, Bollywood sangeet stage, or saffron as a brand colour.**
- **No marigold as wallpaper.** It appears only on the toran, garlands and car.
- **No phulkari as clip-art texture.** It is only true geometric darning, and only in Scene 3 and the shawl borders.
- **No information-free decoration scenes** except Scene 6, whose silence is the point.
- **No gesture that is required to read content.** Every tap or drag has a scroll fallback.

---

## 6. Asset budget

There are about **34 unique art layers**. The sky, shadows, white field, particles and the thread are CSS/SVG, not painted art.

| Group | Layers | Reuse |
|---|---|---|
| Deorhi exterior: arch/wall, door L, door R, toran | 4 | Scenes 1, 5 (morning grade), toran reused as the milni garland |
| Vehra courtyard plate | 1 | Scenes 1 (through door), 3 (night→dawn), 8 (dusk): one painting, three CSS grades |
| Charpai/manja | 1 | Scenes 3 and 8, duplicated ×6 for guest count |
| Diya + flame | 2 | Scenes 2, 3, 7→8 niche |
| Scene 1 envelope body, flap | 2 | — |
| Scene 2 gaagar, parapet, horn/lights, near roofs, lane, far roofs | 6 | Far roofs can be a crop of the near roofs |
| Scene 3 bagh bands (4 tiles), needle, thimble, chooda bowl | 7 | Bagh border motif reused on shawl edges |
| Scene 4 tall field painting, kites (3), kikar, milestone, trolley | 7 | Field crop reused in the Scene 5 gap |
| Scene 5 folded shawl, unfolded shawl, jalebi thaal | 3 | Shawls recoloured magenta/green |
| Scene 6 palla, shoe rows, lattice | 3 | Palla magenta matches groom-side shawl |
| Scene 7 inside-deorhi view, car, sandook, phulian thaal, grain | 5 | Thaal shape shared with jalebi thaal (recolour/contents swap) |
| Scene 8 lota, wall calendar, aala niche | 3 | — |

For consistency, generate the **deorhi, vehra and charpai first** as anchor assets and derive the others against them. All night, dawn, morning and dusk variants come from CSS light grading on one painting, never from separate generations.

**Small engine extensions requested:**
1. Object-anchored HTML text that inherits a layer's transform and blend mode.
2. An unpinned "tall scene" mode with per-layer parallax (Scene 4).
3. A drag-flick particle emitter that erases a mask (Scene 7).
4. Drag-to-scrub on stepped scenes (Scene 3).
5. A global audio bus with per-scene ducking (silence in Scene 6).

---

## 7. Open questions

1. **Branch:** Scene 6 assumes a Sikh Anand Karaj (a 10:00 morning ceremony fits). Should the template support a Hindu-phere variant, which would need a night hush and a different Scene 6?
2. **Blessing line:** which exact Gurmukhi line will you use? It must be a family blessing, not Gurbani, and a native reader should proof it before it ships.
3. **Doli tone:** some families prefer an invite without the farewell grief. Should Scene 7 keep the vidaai song, or play only the visual?

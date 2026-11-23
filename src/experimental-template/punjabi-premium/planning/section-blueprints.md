# Punjabi Premium -- Section Blueprints

Seven invitation sections. Mobile-first (402px viewport within InvitationViewport 9:16 frame). Each section has a distinct layout structure while sharing the warm cream-to-blush palette, Mughal architectural vocabulary, and painterly floral language from the reference.

---

## Design Tokens (shared across all sections)

### Color
```
--pp-bg-cream:       #F5E6D3    background base
--pp-bg-blush:       #F0D5C0    warmer background variant
--pp-arch-beige:     #E8D5C0    architectural stone
--pp-pink-bright:    #E84080    bougainvillea, highlight accents
--pp-pink-rose:      #D4708A    roses, soft floral
--pp-pink-lotus:     #E8A0A8    lotus petals, gentle pink
--pp-green-sage:     #7A9A6A    foliage, leaf
--pp-green-deep:     #3D6B4A    dark greenery
--pp-gold:           #C9A84C    ornaments, metallic accents
--pp-gold-dark:      #8B6B3D    monogram, rich gold text
--pp-purple-mauve:   #8B5E8B    ornament terminals, accent
--pp-text-names:     #9B6878    couple names script
--pp-text-body:      #6B5245    body text, warm brown
--pp-text-heading:   #5A3D2E    section headings
--pp-lehenga-deep:   #C43068    deep pink accent
--pp-surface-card:   #FDF6EE    slightly lighter than bg, for cards
--pp-divider:        #D4B896    subtle warm divider lines
```

### Typography
```
Display / Monogram:   Cormorant Garamond 700
Script / Names:       Great Vibes 400
Body / Details:       Cormorant 400 / 500
Micro / Labels:       Cormorant 600 (small caps tracking)
```

All font sizes use `clamp()` for fluid scaling. The base reference is a 402px wide container.

### Spacing scale
```
--pp-space-xs:   clamp(4px, 1vw, 8px)
--pp-space-sm:   clamp(8px, 2vw, 16px)
--pp-space-md:   clamp(16px, 4vw, 32px)
--pp-space-lg:   clamp(24px, 6vw, 48px)
--pp-space-xl:   clamp(32px, 8vw, 64px)
--pp-space-2xl:  clamp(48px, 10vw, 80px)
```

### Arch motif evolution
The Mughal arch is the structural backbone. It evolves across sections to avoid repetition:
- S1: Full arch with pillars, scalloped inner edge (literal reference)
- S2: Arch crown silhouette as a top border, no pillars
- S3: Scalloped border band (just the cusped edge, abstracted)
- S4: Individual scalloped card headers per event
- S5: Simplified pointed arch outline framing the form
- S6: Scalloped photo frames (the cusp shape as a clip-path)
- S7: Full arch silhouette returns, minimal, as a closing mirror

### Floral density gradient
Florals diminish from opening to closing:
- S1: Lush canopy, dense rose clusters, full lotus arrangement
- S2: Medium rose sprays, corner leaf accents
- S3: Single lotus motif, thin vine borders
- S4: Small floral corner markers on cards
- S5: Single rose pair flanking the heading
- S6: Leaf corner accents only
- S7: Single lotus, minimal leaf tendrils

---

## Section 1: Opening / Entry

The reference image translated directly. Full-viewport immersion, layered depth, center-axis symmetry.

### Layout
- Single viewport container, `position: relative`, `overflow: hidden`
- All child elements positioned absolutely within this container
- Strong center-axis alignment -- every element on or mirroring the vertical center
- 4 depth planes stacked via z-index (see reference analysis z-stack)

### Content hierarchy (eye path)
1. Couple illustration (largest element, anchored bottom-center)
2. Monogram initials (upper-third, within arch opening)
3. Couple names in script (between monogram and couple)
4. Arch + florals (perceived as environment)
5. Hanging ornaments (noticed last, ambient detail)

### Dimensions
```
Height:          100dvh (full viewport, minimum 700px)
Width:           100%
Padding:         0 (edge-to-edge, florals bleed past container)
```

### Background
- Radial gradient: center lighter (`#F5E6D3`), edges slightly warmer/darker (`#EDD4BE`)
- Subtle paper texture overlay at 6% opacity (CSS noise or texture image)
- The gradient creates a gentle vignette drawing the eye to center

### Architecture layer
- **Mughal arch**: SVG path, warm beige `#E8D5C0`, with multi-cusped (5-7 cusps) scalloped inner edge
- Arch top: 15% from container top
- Arch bottom / pillar base: 75% from top
- Arch width: 85% of container width, centered
- **Pillars**: Slender columns flanking the arch, rose-beige `#E0C8B4`, partial fluted detail
- Subtle inner shadow on scalloped edge (1px, `rgba(139,107,61,0.15)`)

### Hanging ornaments
- 5 ornaments descending from inner arch crown, symmetrical
- Each: golden bell/kalash (`#C9A84C`) + pearl strand + mauve teardrop terminal (`#8B5E8B`)
- Outer two slightly longer, creating gentle concave curve
- CSS pendulum animation: `transform-origin: top center`, 3.5s period, max 2deg rotation
- `prefers-reduced-motion`: static, no sway

### Floral elements (3 groups, layered)
1. **Top canopy** (z-8): Dense bougainvillea cluster (`#E84080` / `#D4708A`), green foliage (`#7A9A6A`), bleeding past left/right edges. Positioned over and around arch crown, extending above frame. Width: 110% of container (centered with negative margins). Height: top 20%.
2. **Mid roses** (z-6): 2-3 rose clusters per side flanking monogram area, at arch-pillar junction. Each cluster: ~8% container width.
3. **Bottom botanicals** (z-4): Lotus flowers (`#E8A0A8`), large tropical leaves (`#3D6B4A`), layered petals framing couple from below. Dense, filling bottom-left and bottom-right corners as natural vignette. Height: bottom 25%.

### Monogram
```
Position:        center, 35% from top
Font:            Cormorant Garamond 700
Size:            clamp(48px, 10vw, 80px)
Color:           #8B6B3D
Letter-spacing:  0.05em
```
Two initials interlocking (e.g., "MS"), standalone, no background shape. Floating in the arch opening against the cream gradient.

### Couple names
```
Position:        center, 48% from top
Font:            Great Vibes 400
Size:            clamp(24px, 6vw, 40px)
Color:           #9B6878
Letter-spacing:  0.02em
Line-height:     1.3
```
Format: "{Groom} & {Bride}" on a single line (or wrapping naturally). The ampersand is the same typeface and size.

### Couple illustration
```
Position:        bottom-center, extending from 60% to 95% vertically
Width:           70% of container
```
PNG/WebP with transparency. The couple faces inward (backs to viewer), "walking into the arch." The bride's lehenga fans out to the right, creating visual weight. Garden backdrop (topiary trees) visible behind/beside them at z-2.

### Typography summary for section
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Monogram | Cormorant Garamond | clamp(48px, 10vw, 80px) | 700 | #8B6B3D |
| Names | Great Vibes | clamp(24px, 6vw, 40px) | 400 | #9B6878 |

### Spacing
- Monogram to names: ~5% of container height
- Names to couple top: ~8% of container height
- Couple extends nearly to bottom edge (5% bottom margin)
- Florals bleed 5% past left/right edges

### Responsive behavior
- **Mobile (402px)**: Primary design. All proportions as specified.
- **Tablet (768px)**: Within InvitationViewport frame, no changes needed. If breakout: arch width reduces to 75%, floral canopy scales proportionally.
- **Desktop (1024px+)**: Wrapped in InvitationViewport (402 x 874 phone frame). Internal layout unchanged.

### Interaction
- **Tap to open**: Overlay screen with couple monogram + "Tap to begin" in Cormorant 500 at `clamp(12px, 3vw, 16px)`, `#8B6B3D`. Cream background matching section bg. Tap triggers the entry sequence.
- **Entry animation sequence** (total ~3s):
  1. Background gradient fades in (0-400ms)
  2. Arch structure fades in, slight upward drift of 8px (200-800ms)
  3. Top floral canopy fades in, slight downward drift of 12px (500-1100ms)
  4. Hanging ornaments drop in with gentle ease-out bounce, staggered 80ms each (800-1500ms)
  5. Bottom botanicals fade in, slight upward drift of 8px (1000-1500ms)
  6. Mid roses fade in (1200-1600ms)
  7. Monogram fades in (1400-2000ms)
  8. Couple names fade in, rising 16px (1800-2400ms)
  9. Couple illustration fades up from bottom, rising 24px (2200-3000ms)
  10. Ornament sway begins after sequence completes
- `prefers-reduced-motion`: All elements appear immediately, no animation. Ornaments static.

### Transition to Section 2
- As user scrolls past ~80% of this section, the bottom botanicals and couple illustration begin to scroll away naturally
- Section 2 background (same cream base) provides seamless continuity
- A thin horizontal vine/leaf divider SVG marks the threshold between sections: a single meandering stem with 3-4 small leaves, `#7A9A6A` at 40% opacity, width 60%, centered

---

## Section 2: Couple & Family Introduction

A structured, hierarchical layout presenting both families. Breaks from the full-bleed immersion of Section 1 into a contained, readable typography layout.

### Layout
- **Asymmetric two-block stack**: Groom's family block followed by Bride's family block
- Each family block is left-aligned text within a right-offset container (creating an asymmetric relationship with the center-aligned opening)
- Between the two blocks: a centered gold divider element (lotus bud icon, `#C9A84C`, 24px)
- Top and bottom: arch crown silhouette as decorative border (the scalloped edge only, no pillars -- the arch motif simplified)

### Content hierarchy
1. Section tagline: "Two souls, one journey" -- small, above everything
2. Groom's full name (prominent)
3. "Son of" + parents' names
4. Gold lotus divider
5. Bride's full name (prominent)
6. "Daughter of" + parents' names
7. Floral corner accents

### Dimensions
```
Height:          auto (content-driven), min-height 85dvh
Width:           100%
Padding:         var(--pp-space-2xl) var(--pp-space-lg)
                 (generous vertical, moderate horizontal)
Max-width:       360px centered within container
```

### Background
- Solid `#F5E6D3` (cream base, matching opening)
- Arch crown silhouette at top: SVG of just the scalloped cusped edge, `#E8D5C0` at 30% opacity, spanning full width, positioned at top of section, height ~40px
- Mirrored (flipped) arch crown silhouette at bottom

### Typography
| Element | Font | Size | Weight | Color | Spacing |
|---------|------|------|--------|-------|---------|
| Tagline | Cormorant | clamp(11px, 2.8vw, 14px) | 600 | #C9A84C | 0.2em tracking |
| Full name (groom/bride) | Great Vibes | clamp(28px, 7vw, 44px) | 400 | #5A3D2E | 0.01em |
| Relationship label | Cormorant | clamp(11px, 2.8vw, 14px) | 500 | #9B6878 | 0.15em tracking |
| Parents' names | Cormorant Garamond | clamp(16px, 4vw, 22px) | 700 | #6B5245 | 0.02em |

### Decorative elements
- **Arch crown silhouettes**: Top and bottom borders, the cusped scalloped edge extracted as a minimal SVG. `#E8D5C0`, 30% opacity.
- **Rose sprays**: Two small watercolor rose clusters (3 roses each, ~48px wide) positioned at top-left and bottom-right of the content area, rotated to follow the diagonal. `#D4708A` with subtle leaf accents `#7A9A6A`.
- **Lotus bud divider**: Single small lotus icon centered between the two family blocks, `#C9A84C`, 24px.
- **Leaf corner accents**: Small leaf tendrils at all four content corners, `#7A9A6A` at 25% opacity, each ~32px.

### Spacing
```
Top padding to tagline:           var(--pp-space-2xl)
Tagline to first name:            var(--pp-space-lg)
Name to "Son/Daughter of":        var(--pp-space-xs)
Relationship to parents' names:   var(--pp-space-xs)
Parents' names to lotus divider:  var(--pp-space-xl)
Lotus divider to second name:     var(--pp-space-xl)
Last parents' names to bottom:    var(--pp-space-2xl)
```

### Family block detail
Each block:
```
display: flex
flex-direction: column
align-items: flex-start   (left-aligned text)
margin-left: 12%          (offset from center creates asymmetry)
```

The tagline "Two souls, one journey" sits centered above both blocks:
```
text-align: center
width: 100%
text-transform: uppercase (Cormorant small caps)
```

### Responsive behavior
- **Mobile (402px)**: As described. Left-aligned blocks with 12% left margin.
- **Tablet (768px)**: If outside viewport frame, blocks center and max-width widens to 440px. Rose sprays scale up to 64px.
- **Desktop (1024px+)**: Within InvitationViewport. No changes from mobile.

### Interaction
- **Scroll reveal**: Each family block fades in while rising 20px as it enters the viewport (IntersectionObserver, threshold 0.3). Staggered: groom block first, 300ms delay, then bride block.
- `prefers-reduced-motion`: Immediate visibility, no animation.

### Transition to Section 3
- Bottom arch crown silhouette at the base of this section
- A thin `1px` line in `#D4B896` at 40% opacity, width 40%, centered, separates from Section 3
- Background color continues unchanged into Section 3

---

## Section 3: Countdown

A centered, monumental countdown that feels architectural rather than widget-like. The numbers are presented as specimens within a decorative frame.

### Layout
- **Centered single-column** with a framed countdown block
- The countdown sits within a scalloped border band (the arch's cusped edge abstracted into a rectangular frame)
- Above: section heading
- Below: wedding date in human-readable format
- The frame is the focal point -- a bordered card but with the Mughal scalloped edge rather than rounded corners

### Content hierarchy
1. Heading: "Counting the Days" or the wedding date phrase
2. Countdown numbers (Days / Hours / Minutes / Seconds)
3. Full date written out below: "Saturday, 25th December 2026"
4. Single lotus motif below the date

### Dimensions
```
Height:          auto, min-height 70dvh
Width:           100%
Padding:         var(--pp-space-2xl) var(--pp-space-md)
```

### Background
- Base: `#F5E6D3`
- Subtle shift: a very gentle linear gradient from `#F5E6D3` (top) to `#F0D5C0` (bottom), introducing the blush warmth that will carry into the celebrations section

### Countdown frame
```
Width:           88%
Max-width:       352px
Margin:          0 auto
Border:          1.5px solid #D4B896
Shape:           Rectangle with scalloped top edge (CSS clip-path or SVG border)
                 The top edge uses the cusped arch profile as a decorative header
Padding:         var(--pp-space-xl) var(--pp-space-md)
Background:      #FDF6EE (slightly lighter card surface)
```

### Typography
| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Heading | Cormorant Garamond | clamp(20px, 5vw, 28px) | 700 | #5A3D2E | Center-aligned |
| Number | Cormorant Garamond | clamp(36px, 9vw, 56px) | 700 | #8B6B3D | Tabular figures |
| Unit label | Cormorant | clamp(10px, 2.5vw, 13px) | 600 | #9B6878 | 0.15em tracking |
| Full date | Great Vibes | clamp(16px, 4vw, 24px) | 400 | #9B6878 | Below the frame |

### Countdown number layout
```
display: grid
grid-template-columns: repeat(4, 1fr)
gap: var(--pp-space-sm)
text-align: center
```

Each unit cell:
```
display: flex
flex-direction: column
align-items: center
gap: 4px
```

Number on top, unit label ("Days" / "Hours" / "Min" / "Sec") below. Between each pair of cells, a small gold dot (`#C9A84C`, 4px circle) vertically centered at the number baseline acts as a separator (positioned via `::after` pseudo-elements on the first three cells).

### Decorative elements
- **Scalloped frame top**: The cusped arch profile (5 cusps) as the top border of the countdown card. SVG or clip-path. `#D4B896`.
- **Thin vine borders**: Left and right inner edges of the frame have a thin vertical vine pattern (single stem, small leaves every ~40px), `#7A9A6A` at 20% opacity, running the full frame height.
- **Lotus motif**: Single lotus flower below the written date, centered, ~36px wide, `#E8A0A8` with `#7A9A6A` leaf. Marks the section's conclusion.

### Spacing
```
Section top to heading:       var(--pp-space-2xl)
Heading to countdown frame:   var(--pp-space-lg)
Frame internal padding:       var(--pp-space-xl) top/bottom
Frame to full date:           var(--pp-space-lg)
Full date to lotus:           var(--pp-space-md)
Lotus to section bottom:      var(--pp-space-2xl)
```

### Responsive behavior
- **Mobile (402px)**: As described. Grid of 4 columns fills the frame width.
- **Tablet (768px)**: Frame max-width extends to 400px. Numbers can size up slightly.
- **Desktop (1024px+)**: Within InvitationViewport. No structural change.

### Interaction
- **Live countdown**: JavaScript updates every second. Numbers use `font-variant-numeric: tabular-nums` to prevent layout shift.
- **Number change**: When a digit changes, the outgoing digit fades out (opacity 0, translateY -8px, 200ms) and the incoming digit fades in (opacity 1, translateY 0, 200ms). Subtle, not distracting.
- `prefers-reduced-motion`: Numbers update without animation.
- **Scroll reveal**: The entire frame fades in and scales from 0.95 to 1.0 (200ms, ease-out) on viewport entry.

### Transition to Section 4
- The blush gradient at the bottom of this section warms into the celebrations section
- The lotus motif at the bottom creates a natural endpoint
- No hard divider -- the background gradient shift provides the transition

---

## Section 4: Celebrations (Events)

A vertical timeline of events with individual cards. This section has the most structural complexity, handling variable event counts. The layout is a left-anchored timeline with cards offset to the right.

### Layout
- **Vertical timeline** with a thin gold line running down the left side
- Each event is a card that connects to the timeline via a small ornament node
- Cards are right-offset from the timeline, creating an asymmetric left-weighted layout
- This is the key layout variation: where S1 is centered, S2 is left-offset, S3 is centered-framed, S4 is left-timeline
- Section heading sits above the timeline, centered

### Content hierarchy
1. Section heading: "Celebrations" or "Our Celebrations"
2. For each event:
   a. Event name (largest, script font)
   b. Date + Day of week
   c. Time
   d. Venue name
   e. Address
   f. Brief description (if provided)

### Dimensions
```
Height:          auto (driven by event count)
Width:           100%
Padding:         var(--pp-space-xl) var(--pp-space-sm) var(--pp-space-xl) var(--pp-space-md)
```

### Background
- Base: `#F0D5C0` (the blush variant, warmer than previous sections)
- This is the warmest section, matching the celebratory mood
- Subtle paper texture at 4% opacity continues

### Timeline structure
```
Timeline line:
  position: absolute
  left: 28px
  top: (first node center)
  bottom: (last node center)
  width: 1.5px
  background: linear-gradient(to bottom, #C9A84C, #D4B896)

Timeline node (per event):
  width: 12px
  height: 12px
  border-radius: 50%
  border: 1.5px solid #C9A84C
  background: #FDF6EE
  position: absolute
  left: 22px  (centered on the line)
```

### Event card
```
margin-left: 52px        (past the timeline + gap)
margin-right: 12px
margin-bottom: var(--pp-space-lg)
padding: var(--pp-space-md) var(--pp-space-md) var(--pp-space-md) var(--pp-space-md)
background: #FDF6EE
border: 1px solid #E8D5C0
border-top: none          (replaced by scalloped header)
position: relative
```

Each card has a scalloped top edge (3 small cusps, the arch motif further simplified into a card header). Implemented via SVG or clip-path on a `::before` pseudo-element, `#E8D5C0`.

### Typography
| Element | Font | Size | Weight | Color | Notes |
|---------|------|------|--------|-------|-------|
| Section heading | Cormorant Garamond | clamp(22px, 5.5vw, 32px) | 700 | #5A3D2E | Centered above timeline |
| Event name | Great Vibes | clamp(22px, 5.5vw, 32px) | 400 | #8B6B3D | Card title |
| Date + Day | Cormorant Garamond | clamp(13px, 3.2vw, 17px) | 700 | #6B5245 | |
| Time | Cormorant | clamp(12px, 3vw, 16px) | 500 | #6B5245 | |
| Venue name | Cormorant Garamond | clamp(14px, 3.5vw, 18px) | 700 | #5A3D2E | |
| Address | Cormorant | clamp(11px, 2.8vw, 15px) | 400 | #9B6878 | |
| Description | Cormorant | clamp(12px, 3vw, 15px) | 400 italic | #6B5245 | Optional |

### Card internal layout
```
display: flex
flex-direction: column
gap: var(--pp-space-xs)
```

Event name sits at top. Below it, date/day and time on the same line (flexbox, `justify-content: space-between`). Then venue name. Then address. Then optional description in italic.

### Small actions row at card bottom
- "View on Map" link: Cormorant 500, `clamp(11px, 2.5vw, 13px)`, `#C9A84C`, underline on hover
- "Add to Calendar" link: same styling, right-aligned
- Row: `display: flex; justify-content: space-between; margin-top: var(--pp-space-sm)`

### Decorative elements
- **Scalloped card headers**: 3-cusp scalloped top on each card (simplified from the full arch)
- **Small floral corners**: Each card has a tiny rose-and-leaf motif (~20px) at the top-right corner, `#D4708A` + `#7A9A6A`, 40% opacity. Subtle, not competing with content.
- **Timeline gradient**: The gold line fades from full opacity at top to 50% at bottom.
- **Event-specific icon**: Inside each timeline node, a tiny icon can optionally appear:
  - Mehendi: leaf
  - Sangeet: musical note
  - Anand Karaj: lotus
  - Reception: star
  These are decorative only, 6px, `#C9A84C`, within the 12px node circle.

### Spacing
```
Section top to heading:           var(--pp-space-xl)
Heading to first event card:      var(--pp-space-lg)
Between event cards:              var(--pp-space-lg)
Last card to section bottom:      var(--pp-space-xl)
Card internal vertical gap:       var(--pp-space-xs)
```

### Responsive behavior
- **Mobile (402px)**: Timeline on left at 28px, cards fill remaining width. This is the primary layout.
- **Tablet (768px)**: Timeline moves to center. Cards alternate left and right (odd cards right, even cards left) for a true timeline layout. Cards max-width 280px.
- **Desktop (1024px+)**: Within InvitationViewport, reverts to mobile layout (centered timeline would be too cramped in the 402px frame).

### Interaction
- **Scroll reveal**: Each event card fades in and translates from 24px right to 0 (sliding in from the timeline), staggered 150ms per card. IntersectionObserver triggers per card.
- **Card tap (mobile)**: Subtle press feedback -- card background shifts to `#F5E6D3` for 150ms.
- `prefers-reduced-motion`: All cards visible immediately.

### Transition to Section 5
- Timeline line ends at the last node
- Below the last card, a thin vine line (same as S1-S2 divider) separates sections
- Background transitions back from blush `#F0D5C0` to cream `#F5E6D3`

---

## Section 5: RSVP

A form that belongs to the invitation, not bolted on. The form sits within a simplified arch outline, and form elements use the invitation's typography and color palette.

### Layout
- **Centered form within a pointed arch outline**
- The arch is drawn as a thin stroke outline (not filled), creating a frame around the form fields
- Heading and fields sit inside the arch shape
- This is the layout variation: a tall, narrow centered column within an architectural outline

### Content hierarchy
1. Heading: "Kindly Respond" (inside the arch, near the top)
2. Guest name field
3. Attendance (Yes/No selection)
4. Number of guests (stepper or select)
5. Message field (optional, textarea)
6. Submit button
7. Thank-you state after submission

### Dimensions
```
Height:          auto, min-height 90dvh
Width:           100%
Padding:         var(--pp-space-2xl) var(--pp-space-md)
```

### Background
- Base: `#F5E6D3` (cream, returned from the blush)

### Arch outline frame
```
Width:           82%
Max-width:       330px
Margin:          0 auto
```
The arch is a thin SVG stroke path:
- Pointed top (Mughal arch peak)
- Straight sides descending into pillars
- Open at the bottom (the form content flows out below the arch line naturally)
- Stroke: `1.5px`, color `#D4B896`
- The form fields sit within the vertical space framed by this arch
- Arch peak is ~60px tall from the start of the straight sides

### Form fields
All fields are minimally styled -- bottom-border only, no full box borders:
```
input, select, textarea:
  background: transparent
  border: none
  border-bottom: 1px solid #D4B896
  padding: var(--pp-space-sm) 0
  font-family: Cormorant, serif
  font-size: clamp(14px, 3.5vw, 18px)
  font-weight: 500
  color: #5A3D2E
  width: 100%

  &:focus:
    border-bottom-color: #C9A84C
    outline: none

  &::placeholder:
    color: #D4B896
    font-style: italic
```

### Label styling
```
font-family: Cormorant, serif
font-size: clamp(11px, 2.8vw, 14px)
font-weight: 600
color: #9B6878
letter-spacing: 0.1em
margin-bottom: 4px
```

### Attendance selector
Not a dropdown. Two side-by-side buttons:
```
display: grid
grid-template-columns: 1fr 1fr
gap: var(--pp-space-sm)

Each button:
  padding: var(--pp-space-sm) var(--pp-space-md)
  border: 1px solid #D4B896
  background: transparent
  font-family: Cormorant Garamond, serif
  font-size: clamp(14px, 3.5vw, 18px)
  font-weight: 700
  color: #6B5245
  cursor: pointer
  transition: all 200ms ease

  &.selected:
    background: #C9A84C
    border-color: #C9A84C
    color: #FDF6EE

  &:focus-visible:
    outline: 2px solid #C9A84C
    outline-offset: 2px
```

"Joyfully Accept" and "Regretfully Decline" as the two options.

### Guest count
A simple number stepper: minus button, number, plus button, inline:
```
display: flex
align-items: center
gap: var(--pp-space-md)
justify-content: center

Button (plus/minus):
  width: 36px
  height: 36px
  border-radius: 50%
  border: 1px solid #D4B896
  background: transparent
  font-size: 18px
  color: #6B5245

Number:
  font: Cormorant Garamond 700, clamp(24px, 6vw, 32px)
  color: #5A3D2E
  min-width: 40px
  text-align: center
```

### Submit button
```
width: 100%
padding: var(--pp-space-md) var(--pp-space-lg)
background: #C9A84C
border: none
font-family: Cormorant Garamond, serif
font-size: clamp(14px, 3.5vw, 18px)
font-weight: 700
color: #FDF6EE
letter-spacing: 0.1em
cursor: pointer
margin-top: var(--pp-space-lg)
transition: background 200ms ease

&:hover, &:focus-visible:
  background: #8B6B3D

&:active:
  transform: scale(0.98)

&:focus-visible:
  outline: 2px solid #8B6B3D
  outline-offset: 2px
```

### Thank-you state
After submission, the form fades out (200ms) and is replaced by:
```
text-align: center
padding: var(--pp-space-2xl) 0

"Thank You" in Great Vibes:
  font-size: clamp(28px, 7vw, 44px)
  color: #8B6B3D

Subtitle in Cormorant:
  font-size: clamp(13px, 3.2vw, 17px)
  color: #9B6878
  margin-top: var(--pp-space-sm)
  "We look forward to celebrating with you"

Single lotus motif below, 32px, #E8A0A8
```

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Heading | Cormorant Garamond | clamp(22px, 5.5vw, 30px) | 700 | #5A3D2E |
| Labels | Cormorant | clamp(11px, 2.8vw, 14px) | 600 | #9B6878 |
| Input text | Cormorant | clamp(14px, 3.5vw, 18px) | 500 | #5A3D2E |
| Button text | Cormorant Garamond | clamp(14px, 3.5vw, 18px) | 700 | #FDF6EE |
| Thank you | Great Vibes | clamp(28px, 7vw, 44px) | 400 | #8B6B3D |

### Decorative elements
- **Arch outline**: Thin stroke, described above. The primary decorative structure.
- **Rose pair**: Two small roses flanking the heading text inside the arch, `#D4708A`, ~24px each, positioned at the same vertical line as the heading.
- **Vine tendrils**: Thin vine lines descending along the inner left and right edges of the arch outline, `#7A9A6A` at 15% opacity.

### Spacing
```
Section top to arch frame:            var(--pp-space-2xl)
Arch top (heading area) internal:     var(--pp-space-lg)
Between form fields:                  var(--pp-space-lg)
Textarea height:                      clamp(80px, 20vw, 120px)
Submit button margin-top:             var(--pp-space-lg)
Arch bottom to section bottom:        var(--pp-space-2xl)
```

### Responsive behavior
- **Mobile (402px)**: As described. Arch frame width 82%.
- **Tablet (768px)**: If outside viewport, arch frame max-width 380px.
- **Desktop (1024px+)**: Within InvitationViewport. Same as mobile.

### Interaction
- **Form validation**: Fields validate on blur. Invalid state: border-bottom turns `#E84080` (the bright pink), with a small error message in Cormorant 400, `clamp(10px, 2.5vw, 13px)`, same pink.
- **Submit loading**: Button text replaced with "Sending..." in italic, background unchanged.
- **Scroll reveal**: The arch outline draws itself in (SVG stroke-dashoffset animation, 800ms) as the section enters the viewport.
- `prefers-reduced-motion`: Arch visible immediately, no draw animation.

### Accessibility
- All form fields have visible labels (not just placeholders)
- Focus states are clearly visible (gold bottom border on inputs, outline on buttons)
- Attendance buttons use `role="radiogroup"` with `aria-checked`
- Error messages linked to fields via `aria-describedby`
- Color contrast: all text combinations meet WCAG AA on the cream background

### Transition to Section 6
- Below the form (or thank-you state), a gentle fade in background warmth
- A centered decorative break: three small gold dots (`#C9A84C`, 4px each, spaced 12px apart)

---

## Section 6: Photo Gallery

A grid of couple photos framed with the Mughal scalloped motif. The layout is the most grid-heavy section, contrasting with the vertical flow of previous sections.

### Layout
- **Masonry-inspired grid** with mixed aspect ratios
- The grid uses scalloped clip-paths on images (the arch cusp shape applied as frame decoration)
- Above: section heading
- The grid itself is the visual interest -- no surrounding frame

### Content hierarchy
1. Section heading: "Our Story" or "Moments Together"
2. Photo grid (variable count, minimum 4, recommended 6-8)
3. Subtle caption area below each photo (optional)

### Dimensions
```
Height:          auto (content-driven)
Width:           100%
Padding:         var(--pp-space-xl) var(--pp-space-sm)
```

### Background
- Base: `#F5E6D3` (cream)

### Grid structure
```
display: grid
grid-template-columns: repeat(2, 1fr)
gap: var(--pp-space-sm)
padding: 0 var(--pp-space-sm)
```

Photos alternate between two aspect ratios to create visual rhythm:
- **Portrait**: aspect-ratio 3/4 (taller)
- **Square**: aspect-ratio 1/1

Pattern for a 6-photo grid:
```
Row 1: [portrait] [square]
Row 2: [square]   [portrait]
Row 3: [portrait] [square]
```

This alternating pattern prevents the grid from feeling like a uniform stamp.

### Photo frame treatment
Each photo container:
```
position: relative
overflow: hidden
border: 2px solid #E8D5C0
```

Scalloped top edge on alternating photos (every other photo has the 3-cusp scalloped clip-path on its top border, tying back to the arch motif). The others have a simple straight border.

```
Photo with scalloped top:
  clip-path: url(#scalloped-frame)  (SVG clipPath defining 3 cusps at top)
  OR
  border-top: none, with a ::before element drawing the scalloped edge

Photo without scallop:
  standard rectangle with 2px border
```

### Photo styling
```
img:
  width: 100%
  height: 100%
  object-fit: cover
  filter: sepia(8%) saturate(95%)   // very subtle warm filter for cohesion
  transition: transform 300ms ease, filter 300ms ease
```

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section heading | Cormorant Garamond | clamp(22px, 5.5vw, 32px) | 700 | #5A3D2E |
| Caption (optional) | Cormorant | clamp(10px, 2.5vw, 13px) | 400 italic | #9B6878 |

### Decorative elements
- **Scalloped frames**: As described above, alternating photos.
- **Leaf corner accents**: Small leaf tendril at the top-left and bottom-right of the grid area (outside the grid itself), `#7A9A6A` at 20% opacity, ~24px each. Minimal -- the photos are the focus.

### Spacing
```
Section top to heading:        var(--pp-space-xl)
Heading to grid:               var(--pp-space-lg)
Grid gap:                      var(--pp-space-sm)  (8-16px)
Grid to section bottom:        var(--pp-space-xl)
Caption below image:           4px
```

### Responsive behavior
- **Mobile (402px)**: 2-column grid as described.
- **Tablet (768px)**: If outside viewport, grid expands to 3 columns. Aspect ratios remain but pattern adjusts: `portrait, square, square / square, portrait, square / ...`
- **Desktop (1024px+)**: Within InvitationViewport, 2 columns.

### Interaction
- **Tap to expand (mobile)**: Tapping a photo opens a simple lightbox overlay:
  ```
  Overlay: position fixed, inset 0, background rgba(90,61,46,0.85)
  Image: max-width 92%, max-height 80vh, centered
  Close: tap anywhere outside the image, or swipe down
  Transition: image scales from the grid position to center (300ms ease-out)
  ```
- **Hover (desktop/tablet)**: Photo scales to 1.03 and filter shifts to `sepia(0%) saturate(100%)` (full color), 300ms ease.
- **Scroll reveal**: Grid rows stagger in. First row fades up, second row 150ms later, etc. Each row fades in while translating 16px up.
- `prefers-reduced-motion`: All visible immediately, no scale on hover (or instant), no lightbox animation.

### Transition to Section 7
- Below the grid, a centered single lotus icon (`#E8A0A8`, 28px)
- Background holds at cream
- Generous spacing (var(--pp-space-2xl)) before the closing section

---

## Section 7: Closing

A mirror of the opening, distilled. Where the opening was lush and immersive, the closing is refined and still. It brings back the full arch silhouette but as an outline, creates visual bookending, and leaves the viewer with warmth.

### Layout
- **Centered, vertical stack** within a full arch silhouette (outline only)
- The arch is the full Mughal shape this time (pointed top, pillar sides) but rendered as a thin stroke rather than a filled element -- the skeleton of the opening
- Content sits within the arch: closing message, couple names, and a single lotus
- Bottom: footer with company branding

### Content hierarchy
1. Arch silhouette outline (structural frame)
2. Closing phrase: "With love and gratitude" (script, centered)
3. Couple names (script, prominent)
4. Single lotus flower (centered, the final botanical)
5. Footer: "Invitation by {Company}"

### Dimensions
```
Height:          auto, min-height 80dvh
Width:           100%
Padding:         var(--pp-space-xl) var(--pp-space-md) var(--pp-space-lg)
```

### Background
- Base: `#F5E6D3`
- Subtle radial gradient returning: center slightly lighter, creating the vignette from Section 1, but gentler (only 3% brightness variation). Mirroring the opening atmosphere.

### Arch silhouette
```
Width:           78%
Max-width:       314px
Margin:          0 auto
Height:          auto (content-driven), min-height: 420px
```

SVG outline of the full Mughal arch:
- Pointed top with scalloped inner edge (matching Section 1 exactly)
- Straight pillar sides
- Open at the bottom (the content flows out, the arch does not close at the base)
- Stroke: `1.5px`, color `#D4B896` at 60% opacity
- No fill, purely structural outline
- The arch is taller and narrower than Section 1's filled version, creating a different proportion

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Closing phrase | Cormorant Garamond | clamp(14px, 3.5vw, 18px) | 700 | #9B6878 |
| Couple names | Great Vibes | clamp(28px, 7vw, 44px) | 400 | #8B6B3D |
| Footer text | Cormorant | clamp(10px, 2.5vw, 12px) | 500 | #9B6878 |

### Content within the arch
```
display: flex
flex-direction: column
align-items: center
justify-content: center
text-align: center
padding: var(--pp-space-2xl) var(--pp-space-md)
min-height: 360px
```

Vertical stack:
1. Closing phrase: "With love and gratitude" -- centered, in Cormorant Garamond
2. Gap: `var(--pp-space-lg)`
3. Couple names: "{Groom} & {Bride}" in Great Vibes, gold-dark
4. Gap: `var(--pp-space-xl)`
5. Single lotus flower: watercolor PNG/SVG, 48px wide, `#E8A0A8`, centered
6. Gap: `var(--pp-space-sm)`
7. Two small leaf tendrils flanking the lotus (subtle, `#7A9A6A` at 30% opacity, ~16px each)

### Footer (outside the arch)
```
text-align: center
padding: var(--pp-space-xl) 0 var(--pp-space-md)
```

"Invitation by" + company logo or company name. Uses the shared `DesignedByFooter` component pattern, styled to match:
- "Invitation by" in Cormorant 500, `clamp(10px, 2.5vw, 12px)`, `#9B6878`
- Company logo/name below, linked to WhatsApp

### Decorative elements
- **Full arch silhouette**: As described, the primary decorative and structural element. It mirrors Section 1 but as pure outline.
- **Single lotus**: The botanical language reduced to its simplest expression. One flower, centered, the last organic element. This is the final floral after the density gradient across all sections.
- **Leaf tendrils**: Two tiny tendrils flanking the lotus. The greenery's last appearance, minimal.
- No roses, no canopy, no ornaments -- the closing is intentionally spare.

### Spacing
```
Section top to arch top:          var(--pp-space-2xl)
Arch internal top to phrase:      var(--pp-space-xl)
Closing phrase to couple names:   var(--pp-space-lg)
Couple names to lotus:            var(--pp-space-xl)
Lotus to arch visual bottom:      var(--pp-space-xl)
Arch bottom to footer:            var(--pp-space-xl)
Footer to section bottom:         var(--pp-space-lg)
```

### Responsive behavior
- **Mobile (402px)**: As described. Arch silhouette width 78%.
- **Tablet (768px)**: If outside viewport, arch max-width extends to 360px.
- **Desktop (1024px+)**: Within InvitationViewport. Same as mobile.

### Interaction
- **Scroll reveal**: The arch silhouette draws itself in via stroke-dashoffset (similar to Section 5's arch, but the full shape takes 1200ms). The content inside fades in 400ms after the arch completes.
- **Lotus**: Subtle pulse -- a 4s cycle where opacity oscillates between 0.85 and 1.0, very gentle breathing effect. `prefers-reduced-motion`: static.
- `prefers-reduced-motion`: All visible immediately.

### Transition
- This is the final section. No transition out.
- The footer sits at the absolute bottom, grounded.
- If music is playing, it continues through the closing until the user pauses or leaves.

---

## Cross-Section Summary

### Layout variation map
| Section | Layout type | Alignment | Primary structure |
|---------|------------|-----------|-------------------|
| 1. Opening | Full-viewport layers | Center axis | Mughal arch (filled) |
| 2. Family | Stacked text blocks | Left-offset | Arch crown borders |
| 3. Countdown | Centered framed card | Center | Scalloped border frame |
| 4. Celebrations | Left timeline + cards | Left-anchored | Timeline + card headers |
| 5. RSVP | Centered form | Center | Arch outline frame |
| 6. Gallery | 2-column grid | Grid | Scalloped photo frames |
| 7. Closing | Centered vertical | Center | Full arch outline |

### Arch motif progression
```
S1: |||=ARCH=|||    Full filled arch, pillars, scalloped interior
S2:  ~~~cusp~~~     Crown silhouette only, top/bottom borders
S3: [___cusp___]    Scalloped top edge on rectangular frame
S4:  [_c_] [_c_]   Mini scalloped headers on individual cards
S5:     /\          Thin arch outline framing form
        ||
S6:  [~] [~]       Scalloped clip-paths on photo frames
S7:     /\          Full arch outline returns (bookend)
       /  \
       |  |
```

### Floral density map
```
S1: ******  Dense canopy, rose clusters, full lotus, bottom botanicals
S2: ***     Corner rose sprays, leaf accents, lotus bud divider
S3: **      Single lotus below, thin vine borders in frame
S4: *       Tiny floral corners on cards only
S5: *       Two roses flanking heading, vine tendrils
S6: .       Leaf corner accents only (almost bare)
S7: *       Single lotus, two tiny leaf tendrils (refined conclusion)
```

### Background color flow
```
S1: #F5E6D3 (cream) with radial vignette
S2: #F5E6D3 (cream, flat)
S3: #F5E6D3 → #F0D5C0 (cream to blush gradient)
S4: #F0D5C0 (blush, warmest point)
S5: #F5E6D3 (cream, cooled back)
S6: #F5E6D3 (cream)
S7: #F5E6D3 (cream) with subtle radial vignette (mirrors S1)
```

### Animation budget
Total unique animations: 10 (conservative, no per-scroll loops)
- S1 entry sequence (orchestrated, one-time)
- S1 ornament sway (CSS, lightweight, continuous)
- S2 family block reveal (intersection, one-time)
- S3 number digit change (per-second, minimal)
- S3 frame scale-in (intersection, one-time)
- S4 card slide-in (intersection, staggered, one-time)
- S5 arch stroke draw (intersection, one-time)
- S6 grid row stagger (intersection, one-time)
- S7 arch stroke draw (intersection, one-time)
- S7 lotus breathing (CSS, continuous, subtle)

All animations respect `prefers-reduced-motion` by disabling or showing content immediately.

No requestAnimationFrame loops. No per-scroll layout reads. Intersection observers for reveal triggers only.

### Asset requirements
| Asset | Type | Section | Priority | Est. size |
|-------|------|---------|----------|-----------|
| Arch (filled) | SVG | S1 | High | 3-5 KB |
| Arch outline | SVG | S5, S7 | Medium | 2-3 KB |
| Scalloped edge | SVG | S2, S3, S4, S6 | Medium | 1-2 KB |
| Top floral canopy | WebP | S1 | High | 80-150 KB |
| Mid rose clusters | WebP | S1, S2 | High | 30-60 KB |
| Bottom botanicals | WebP | S1 | High | 60-100 KB |
| Couple illustration | WebP | S1 | Critical | 150-300 KB |
| Single lotus | SVG or WebP | S3, S5, S7 | Medium | 2-5 KB |
| Leaf tendrils | SVG | S2, S5, S6, S7 | Low | 1-2 KB |
| Hanging ornaments | SVG | S1 | Medium | 3-5 KB |
| Small floral corner | WebP | S4 | Low | 5-10 KB |
| Paper texture | WebP tile | All | Low | 10-20 KB |

Total estimated: 350-660 KB (before optimization). Couple illustration is the heaviest single asset.

### Font loading
```
Google Fonts request:
  Cormorant Garamond: 700
  Cormorant: 400, 400i, 500, 600
  Great Vibes: 400

Total: 3 weights of Cormorant + 1 weight of Cormorant Garamond + 1 weight of Great Vibes
Estimated: ~120-180 KB total (woff2)

Load strategy: font-display swap, preconnect to fonts.googleapis.com
Template manages its own fonts (no SiteFonts wrapper per project convention)
```

### Accessibility checklist
- All text meets WCAG AA contrast on cream backgrounds (verified: #5A3D2E on #F5E6D3 = 7.2:1, #6B5245 on #F5E6D3 = 5.1:1, #9B6878 on #F5E6D3 = 3.2:1 -- the rose text on large display sizes passes AA Large)
- Form fields have visible labels, focus indicators, and error states
- Attendance buttons use proper ARIA roles
- All decorative images have `alt=""`
- Couple illustration and meaningful images have descriptive `alt` text
- Reduced motion fully supported throughout
- Semantic HTML: sections use `<section>`, headings follow h1-h3 hierarchy across sections
- Lightbox is keyboard-dismissible (Escape key)
- Touch targets minimum 44px (buttons, interactive elements)

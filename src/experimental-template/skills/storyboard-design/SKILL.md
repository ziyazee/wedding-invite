# Storyboard Design Skill

Methodology for creating the complete scroll experience storyboard.

## The Film Analogy

Think of the invitation as a short film:
- The opening is the title sequence
- Each section is a scene
- Scrolling is the timeline
- The closing is the credits

The guest is both the audience and the camera operator (via scroll).

## Storyboard Structure

For each section, answer these 15 questions:

1. **Purpose**: What does this section accomplish?
2. **Visual concept**: What does the guest see? Be specific.
3. **Layout**: How is content arranged? (not "centered" — describe the actual structure)
4. **Background artwork**: What fills the canvas behind content?
5. **Foreground artwork**: What decorates around/above content?
6. **Typography**: Which font, size, weight, color for each text element
7. **SVG elements**: Specific motifs, ornaments, dividers
8. **PNG assets**: Which user-provided images and where
9. **Decorative elements**: Borders, patterns, overlays
10. **Element positions**: Where things go (percentages, alignment)
11. **Layering order**: z-index from back to front
12. **Entry animation**: How elements appear (fade, slide, scale, reveal)
13. **Scroll behavior**: What changes as user scrolls through this section
14. **Exit transition**: How this section hands off to the next
15. **Mobile composition**: Specific mobile layout (not just "responsive")

## Transition Mapping

Between each pair of sections, describe:
- Visual bridge (shared element, color fade, decorative connector)
- Animation timing (does previous section's exit overlap next section's entry?)
- Scroll distance for transition (quick snap or gradual blend)

## Experience Arc

The 6 sections should follow an emotional arc:
1. **Welcome**: Wonder, anticipation — the first impression
2. **Family**: Warmth, tradition — grounding in family
3. **Countdown**: Excitement, anticipation — building to the day
4. **Celebrations**: Joy, details — practical but beautiful
5. **RSVP**: Action, participation — the guest's moment
6. **Closing**: Gratitude, beauty — the farewell

## Output Format

`planning/storyboard.md` — complete document covering all 6 sections with all 15 points each, plus transitions, experience arc, and asset requirements.

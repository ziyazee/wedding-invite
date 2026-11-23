# New Template — End-to-End Workflow

When the user says **"new template"**, this workflow begins. It covers everything from reference intake through creative discovery, asset generation prompts, and full implementation handoff.

## Isolation Rule — EXPERIMENTAL ONLY

**Everything lives inside `src/experimental-template/{template-name}/`.** No new files, folders, routes, components, or references outside this directory — except the single lazy route registration in `App.tsx`. This is an experiment sandbox. Do not touch production code, production assets, production templates, or anything in `src/pages/`, `src/invitations/`, or `public/templates/`.

---

## Step 1: Reference Intake

Ask the user ONE question first:

> Do you have a reference image or video? If yes, provide the file path.

Accept: image files (PNG, JPG, WEBP) or video files (MP4, MOV, WEBM).

**Analyse the reference immediately.** Extract:
- Culture / region / tradition (e.g. South Indian, Punjabi, Muslim, Bengali, Rajasthani, Kerala, North Indian, fusion)
- Color palette — dominant colors, accent colors, background tones (hex values)
- Mood — warm, regal, romantic, minimal, earthy, dramatic, festive
- Lighting — daylight, golden hour, dusk, candlelit, dark/moody
- Decorative elements — architectural motifs, florals, fabrics, metals, patterns
- Typography style — calligraphic, serif, modern, traditional script
- Composition — layout structure, visual hierarchy, spacing
- Materials and textures — silk, marble, wood, gold leaf, embroidery, watercolor

Present a short summary (5–8 lines) of what you observed. This grounds the conversation.

If the file cannot be read, say exactly why. Do not pretend to have analysed it.

---

## Step 2: Smart Discovery (informed by reference)

Ask questions in groups of 2–3. Wait for answers before the next group. **Skip anything the reference already answers clearly.** Use AskUserQuestion for structured choices where possible.

### Group A: Design & Motion Style

Based on the reference analysis, ask:

1. **Animation style** — What kind of motion do you want?
   - Parallax scrolling (layered depth as you scroll)
   - Cinematic motion (elements animate in sequence like a film)
   - Floating / ambient (gentle continuous movement — petals drifting, birds flying)
   - Scroll-triggered reveals (elements appear as you scroll down)
   - Minimal / subtle (clean transitions, no heavy animation)
   - Combination (recommend a specific mix based on the reference)

2. **Vibe / Atmosphere** — What feeling should the invitation give?
   - Bright daylight — clean, fresh, airy
   - Golden warm — sunset, candlelit, romantic warmth
   - Light elegant — soft pastels, subtle luxury
   - Rich and regal — deep tones, gold accents, grand
   - Dark and moody — deep backgrounds, dramatic contrast
   - Earthy natural — muted greens, terracotta, organic

Propose a recommendation based on the reference. Let the user override.

### Group B: Culture & Personal Touch

3. **Cultural elements** — Based on what you detected, confirm:
   - Which cultural elements to feature prominently (mandap, mehndi, mosque, temple, etc.)
   - Which ceremonies are part of this wedding (varies by culture)
   - Any religious elements (Quran verses, mantras, Guru Granth Sahib references, etc.)
   - Any cultural elements to avoid

4. **Personal touch** — What makes this template unique?
   - Custom illustrations or artwork style
   - Specific motifs the couple cares about (e.g. lotus, peacock, jasmine, crescent moon)
   - Any specific narrative or story flow they want
   - Regional language inclusion (Urdu, Tamil, Punjabi, Bengali text)

### Group C: Color & Typography Confirmation

5. **Color direction** — Present 2–3 palette options derived from the reference. Include:
   - Exact hex values for primary, secondary, accent, background, text
   - Each option should feel distinctly different (not 3 variations of gold)

6. **Typography** — Recommend 2–3 Google Font combinations suited to the culture:
   - Display font (couple names — the showpiece)
   - Heading font (section titles)
   - Body font (details, descriptions)
   - Optional: script/calligraphy font for cultural text

### Group D: Section Structure

Present the default section format:

1. Opening / Entry
2. Couple & Family
3. Countdown
4. Celebrations / Events
5. RSVP
6. Closing

Ask: Want to add, remove, reorder, or customise any sections?

Optional additions: Dua/Blessing, Photo Gallery, Love Story, Personal Notes.

### Group E: Opening Style

- Video opening (user provides video)
- Static image with animated text reveal
- Pure animated SVG/CSS opening with cultural motifs
- Parallax layered opening (multiple depth layers)

---

## Step 3: Discovery Rules

- Reference analysis should answer 40–60% of questions automatically. Do not ask what is already obvious.
- Make confident recommendations, not open-ended questions. "Based on the Rajasthani reference, I'd recommend a warm gold + deep maroon palette — sound right?" is better than "What colors do you want?"
- Do not overwhelm. 2–3 questions per group, max 5 groups.
- Allow the user to completely override your recommendations.
- Never treat suggestions as approved decisions.
- Do not start implementation during discovery.

---

## Step 4: Asset Generation Prompts

**This is a critical new phase.** Claude cannot generate images. The user will generate PNGs using OpenAI (or similar) and provide them.

After discovery, identify every raster asset the template needs. Assets fall into two categories:

### Category A: Animated PNG Elements

These are transparent PNG elements that will be animated with GSAP/CSS (not videos). Examples:
- Birds in flight (individual bird PNGs at different wing positions)
- Butterflies (individual butterfly PNGs, different angles)
- Floating petals (rose petals, jasmine, marigold — individual pieces)
- Drifting leaves or branches
- Floating lanterns, diyas, candles
- Sparkles, dust particles, light bokeh
- Flying doves
- Falling confetti or rice
- Swaying decorative elements (tassels, bells, fabric)

For each animated element, specify:
- **What**: Exact description of the PNG needed
- **Quantity**: How many variants (e.g. 3 bird poses, 5 different petals)
- **Size**: Approximate dimensions in pixels
- **Style**: Must match the template's artistic direction (watercolor, realistic, illustrated, etc.)
- **Background**: Always transparent (PNG with alpha)
- **Color notes**: Must work against the template's background colors

### Category B: Background & Section Images

These are static images used as backgrounds or section decoration. Examples:
- Full-bleed section backgrounds (architectural scenes, landscapes, patterns)
- Decorative borders or frames
- Cultural illustrations (mandap, mosque, temple artwork)
- Textured overlays (fabric, marble, watercolor washes)
- Header/footer decorative art

For each static image, specify:
- **What**: Exact description
- **Dimensions**: Exact pixel dimensions needed
- **Style**: Must match template direction
- **Format**: PNG (transparent) or JPG (opaque backgrounds)
- **Placement**: Which section, how it's positioned

### Master Prompt Document

Compile ALL asset requirements into a single **Master Asset Generation Prompt** document. Structure it as:

```markdown
# Asset Generation Prompts — {Template Name}

## Style Guide for All Assets
- Artistic style: {watercolor / realistic / illustrated / etc.}
- Color palette: {hex values}
- Mood: {warm / regal / moody / etc.}
- Consistency note: All assets must feel like they belong to the same visual world.

## Animated Elements

### 1. {Element name} (e.g. "Floating Rose Petals")
- Count: {N} variants
- Size: {W}×{H}px each
- Prompt: "{Detailed generation prompt}"
- Background: Transparent PNG
- Notes: {Any specific requirements}

### 2. {Next element}
...

## Background Images

### 1. {Image name} (e.g. "Opening Section — Mughal Arch")
- Size: {W}×{H}px
- Prompt: "{Detailed generation prompt}"
- Format: PNG / JPG
- Notes: {Positioning, opacity, overlay instructions}

### 2. {Next image}
...

## SVG Elements (Claude will build these)
List any elements that should be SVG (built in code) rather than generated:
- Ornamental dividers
- Geometric patterns
- Simple decorative borders
- Icons (countdown, RSVP, etc.)
```

### Present to User

Tell the user:
1. Here is the Master Asset Generation Prompt
2. Use these prompts with OpenAI / Midjourney / your preferred tool
3. Generate all PNGs and provide them in a folder
4. Give me the folder path when ready

**Wait for the user to provide the asset folder path before proceeding to implementation.**

---

## Step 5: Creative Brief (for approval)

After discovery + asset planning, compile the creative brief:

- **Template name** — kebab-case identifier
- **Culture and theme** — tradition, region, mood
- **Reference interpretation** — what to take, what to change
- **Color palette** — all hex values with roles
- **Typography** — font families, weights, hierarchy
- **Artistic direction** — visual treatment, atmosphere, detail level
- **Section structure** — which sections, in what order
- **Animation strategy** — opening sequence, scroll reveals, ambient PNG animations, parallax
- **Animated PNG elements** — what will fly/float/drift and how
- **Background images** — what each section uses
- **SVG elements** — what Claude builds in code
- **Explicit preferences** — user's specific requests
- **Explicit exclusions** — user's specific rejections

Present the brief. Ask the user to approve before implementation begins.

---

## Step 6: Hand Off to Implementation

After user approves the creative brief AND provides the generated assets:

1. Invoke `/create-template {template-name} {culture}`
2. Pass the approved creative brief, reference analysis, and asset folder path
3. The skill uses the five agents at `.claude/agents/`:
   - `reference-asset-analyst` — deep reference + asset analysis
   - `creative-ui-designer` — design bible, section blueprints, PNG animation choreography
   - `motion-designer` — GSAP animation plan including PNG element motion paths
   - `react-engineer` — full React implementation with animated PNGs
   - `visual-qa` — testing and QA
4. Follow the phased workflow defined in the skill
5. Every agent receives the creative brief + asset manifest as input

**Do not** create a new agent team.
**Do not** skip the skill and implement directly.
**Do not** begin implementation before assets are provided.

---

## Boundaries

This file owns:
- Reference intake and analysis
- Creative discovery conversation
- Asset generation prompt creation
- Creative brief preparation
- User approval gate
- Invoking `/create-template`

The `/create-template` skill owns:
- Module scaffolding
- Agent coordination
- Planning documents
- PNG asset integration and animation
- Section implementation
- GSAP animation lifecycle
- Route registration
- Build verification and QA

These do not overlap. This file does not implement. The skill does not do discovery.

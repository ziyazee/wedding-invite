# Enforcement Checklists

Mandatory verification checklists. The orchestrator MUST run these at the specified points. A failed check blocks progression — do not bypass to finish faster.

---

## Pre-Implementation Checklist

Run BEFORE delegating to the React Engineer (Phase 6). Every box must pass.

```
[ ] planning/reference-analysis.md exists and is non-empty
[ ] planning/cultural-direction.md exists and is approved (decision log shows approval)
[ ] planning/design-bible.md exists and is approved
[ ] planning/section-blueprints.md exists and is approved
[ ] planning/png-choreography.md exists (may be empty if no animated PNGs)
[ ] planning/storyboard.md exists and is approved
[ ] planning/svg-manifest.md exists and is approved
[ ] planning/motion-plan.md exists and is approved
[ ] Storyboard covers all 6 mandatory sections (Welcome, Family, Countdown, Celebrations, RSVP, Closing)
[ ] All approval gates 1–5 show "Approved" in the decision log
[ ] Template directory exists: src/experimental-template/{name}/
[ ] Subdirectories exist: sections/, assets/images/, assets/svg/, animations/, data/, styles/, types/
```

**If ANY check fails**: STOP. Report which items are missing. Do not proceed.

---

## Pre-Delivery Checklist

Run BEFORE presenting the template to the user for final approval (Phase 7). Every box must pass.

### Build & Route
```
[ ] npx tsc --noEmit passes with zero errors
[ ] npm run build succeeds
[ ] Route /experimental/{name} returns a rendered page
[ ] No console errors on initial page load
[ ] No console warnings (except standard React dev warnings)
```

### Section Completeness
```
[ ] Welcome/Opening section renders with content
[ ] Family section renders with sample data
[ ] Countdown section renders with a live timer
[ ] Celebrations section renders (tested with 1, 2, and 3+ events)
[ ] RSVP section renders with interactive form
[ ] Closing section renders
[ ] All sections reachable by scrolling
```

### Artwork & Assets
```
[ ] All SVG ornaments render correctly (no broken paths, no missing fills)
[ ] All PNG assets load (no broken images, no 404s in network tab)
[ ] Background treatments match the design bible
[ ] Decorative elements match section blueprints
```

### Animation
```
[ ] Opening sequence plays on load
[ ] Scroll reveals trigger at specified scroll positions
[ ] Ambient PNG animations (if any) run smoothly
[ ] Animations pause when their section is off-screen
[ ] prefers-reduced-motion: reduce disables ALL motion
[ ] No animation jank during continuous scrolling
```

### Scoping & Isolation
```
[ ] All CSS classes use the template prefix (e.g. kd-, rh-)
[ ] All CSS custom properties use the template prefix
[ ] Root element has isolation: isolate
[ ] No files created outside src/experimental-template/{name}/ (except App.tsx route)
[ ] No imports from production templates or shared invitation components
[ ] Homepage still loads correctly (no route regression)
[ ] Deleting the template folder + one App.tsx line would leave zero traces
```

### Responsive
```
[ ] Mobile (402px): all sections render correctly
[ ] Text readable at mobile width
[ ] No horizontal scrollbar at any viewport width
[ ] Interactive elements (RSVP form, links) accessible on mobile
```

**If ANY check fails**: Report the failure. Fix critical/major issues before presenting to user. Minor issues can be noted in the QA report.

---

## Post-QA Verification

Run AFTER the Visual QA agent delivers its report, before closing the workflow.

```
[ ] qa-report.md exists in planning/
[ ] All CRITICAL defects are resolved (zero remaining)
[ ] All MAJOR defects are resolved or explicitly deferred with user approval
[ ] Decision log is up to date with final status for all gates
[ ] Requirement traceability table is filled in (all rows have design spec, implementation, and QA result)
```

---

## Filesystem Isolation Audit

Run at ANY point if there's suspicion of isolation violation.

```
[ ] git diff --name-only shows ONLY files inside src/experimental-template/{name}/
    (exception: App.tsx for the one route line)
[ ] No new files in src/pages/
[ ] No new files in src/invitations/
[ ] No new files in public/templates/
[ ] No modifications to model.ts
[ ] No modifications to InvitationRenderer.tsx
[ ] No modifications to supabase.ts or middleware.ts
[ ] No new global CSS files
[ ] No modifications to existing template directories
```

---

## Agent Output Validation

Run after each agent completes, before proceeding to the next phase.

### Reference Analyst Output
```
[ ] reference-analysis.md contains specific values (hex, px, %) not vague descriptions
[ ] Distinguishes SEEN from INFERRED observations
[ ] asset-audit.md (if PNGs provided) catalogs every file with dimensions and quality assessment
```

### Cultural Researcher Output
```
[ ] cultural-direction.md categorizes elements as HISTORIC, MODERN, or DECORATIVE
[ ] Does not mix incompatible regional traditions
[ ] Includes avoidance list (what NOT to use)
[ ] Does not fabricate cultural facts
```

### Creative Director Output
```
[ ] design-bible.md has CSS custom property tokens with hex values
[ ] Typography system specifies actual Google Font names
[ ] Section blueprints cover all 6 mandatory sections
[ ] Each section has a distinct layout (not repetitive)
```

### Storyboard Designer Output
```
[ ] storyboard.md covers all 6 sections with all 15 specification points each
[ ] Includes transition mapping between sections
[ ] Includes mobile adaptation notes per section
[ ] Sections have distinct compositions (not same layout repeated)
```

### Asset Illustrator Output
```
[ ] svg-manifest.md catalogs every SVG with purpose and placement
[ ] SVG components are valid React .tsx files
[ ] SVGs have proper viewBox attributes
[ ] index.ts barrel export includes all SVG components
```

### Motion Designer Output
```
[ ] motion-plan.md covers all 5 animation layers
[ ] PNG animation specs include GSAP config code snippets
[ ] Reduced motion strategy documented
[ ] Performance budget specified per section
```

### React Engineer Output
```
[ ] All 6 section components exist in sections/
[ ] index.tsx is the root component with GSAP context
[ ] styles/main.css uses prefixed classes and custom properties
[ ] data/sample.ts has culturally appropriate mock data
[ ] types/index.ts has complete TypeScript interfaces
```

### Visual QA Output
```
[ ] qa-report.md follows the severity classification (CRITICAL/MAJOR/MINOR)
[ ] Report tests actual running app, not just code review
[ ] PNG animation section is filled in (or noted as N/A)
[ ] Responsive section tested at 402px mobile width
```

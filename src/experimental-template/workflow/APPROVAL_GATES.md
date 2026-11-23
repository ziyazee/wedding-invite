# Approval Gates

## Gate Definitions

| # | Gate Name | Phase | Responsible Agent | Required Artifacts | Approver | On Rejection |
|---|-----------|-------|-------------------|-------------------|----------|--------------|
| 1 | Discovery Complete | 1 | Orchestrator | Discovery summary with all answers and reference classifications | User | Re-ask specific questions; do not restart from scratch |
| 2 | Cultural Direction | 2 | Cultural Researcher | `planning/cultural-direction.md` | User | Revise research based on user feedback |
| 3 | Creative Brief | 3 | Creative Director | `planning/design-bible.md`, `planning/section-blueprints.md`, `planning/png-choreography.md` | User | Revise visual direction per feedback |
| 4 | Storyboard | 4 | Storyboard Designer | `planning/storyboard.md` | User | Revise storyboard per feedback |
| 5 | Asset & Motion Plan | 5 | Asset Illustrator + Motion Designer | `planning/svg-manifest.md`, SVG files, `planning/motion-plan.md` | User | Revise asset plan and/or motion spec |
| 6 | Implementation | 6 | React Engineer | Working template, TypeScript pass, Vite build pass | Internal (automated) | Fix build/type errors before proceeding |
| 7 | Final Delivery | 7 | Visual QA | `planning/qa-report.md`, working template | User | Fix defects per QA report and user priorities |

## Rules

### Approval protocol
1. Present the artifacts to the user with a clear summary of what was produced
2. Ask explicitly: *"Do you approve this [phase name]? If you'd like changes, please describe what should be different."*
3. Wait for the user's response
4. Record the decision in `planning/decision-log.md` with timestamp

### What counts as approval
- User explicitly says "approved", "yes", "looks good", "proceed", or equivalent
- User approves with minor notes (record notes, apply them, re-present if substantive)

### What does NOT count as approval
- Silence — never interpret silence as approval
- Moving on to a different topic — the gate remains open
- Asking a question about the artifacts — answer the question, then re-ask for approval
- An agent declaring its own work approved

### Rejection handling
1. Record the rejection with user's feedback in the decision log
2. Identify which specific artifacts need revision
3. Send the rejection feedback to the responsible agent
4. Agent revises the artifacts
5. Re-present for approval (do not skip re-presentation)

### Invalidation cascade
When a gate is rejected, all downstream work that depended on it is invalidated:

```
Gate 1 rejected → Invalidates: Phases 2, 3, 4, 5, 6, 7, 8
Gate 2 rejected → Invalidates: Phases 3, 4, 5, 6, 7, 8
Gate 3 rejected → Invalidates: Phases 4, 5, 6, 7, 8
Gate 4 rejected → Invalidates: Phases 5, 6, 7, 8
Gate 5 rejected → Invalidates: Phases 6, 7, 8
Gate 7 rejected → Invalidates: Phase 8 (fixes only)
```

If downstream work has already begun, it must be discarded and re-done after the upstream gate passes.

### Partial approval
The user may approve parts of a deliverable and reject others. In that case:
1. Record which parts are approved and which are rejected
2. Only revise the rejected parts
3. Re-present the revised parts for approval
4. Approved parts remain valid unless the revision changes them

### Change requests mid-stream
If the user requests a change to an already-approved artifact:
1. Record the change request in the decision log
2. Update the relevant artifact
3. Assess which downstream artifacts are affected
4. Re-present the changed artifact for re-approval
5. Re-run affected downstream phases

## Pre-Implementation Checklist

Before the React Engineer begins Phase 6, verify ALL of these:

- [ ] `planning/reference-analysis.md` exists and is complete
- [ ] `planning/cultural-direction.md` exists and is approved (Gate 2)
- [ ] `planning/design-bible.md` exists and is approved (Gate 3)
- [ ] `planning/section-blueprints.md` exists and is approved (Gate 3)
- [ ] `planning/png-choreography.md` exists and is approved (Gate 3)
- [ ] `planning/storyboard.md` exists and is approved (Gate 4)
- [ ] `planning/svg-manifest.md` exists and is approved (Gate 5)
- [ ] SVG component files exist in `assets/svg/`
- [ ] `planning/motion-plan.md` exists and is approved (Gate 5)
- [ ] All 6 mandatory sections are accounted for in the storyboard
- [ ] All specified PNG assets are accessible and verified
- [ ] All approval gates 1–5 are recorded as approved in the decision log

If ANY check fails, STOP and report which items are missing. Do not begin implementation with incomplete specifications.

## Pre-Delivery Checklist

Before presenting the template for Gate 7 (Final Delivery), verify ALL of these:

- [ ] All 6 sections exist and render
- [ ] All specified artwork is present (SVGs and PNGs)
- [ ] All specified animations work
- [ ] All interactive elements work (RSVP, links, scroll indicator)
- [ ] Mobile layout is verified (402px viewport)
- [ ] Desktop layout is verified
- [ ] `prefers-reduced-motion: reduce` disables all motion
- [ ] No console errors
- [ ] No horizontal scrollbar overflow
- [ ] TypeScript compilation passes
- [ ] Vite build passes
- [ ] No files modified outside the template workspace (except App.tsx route)
- [ ] No prohibited external references introduced
- [ ] CSS is properly scoped (all classes/properties prefixed)
- [ ] GSAP contexts cleaned up on unmount
- [ ] PNG animations pause off-screen
- [ ] QA report completed by Visual QA agent
- [ ] QA report has no unresolved CRITICAL defects

If ANY check fails, fix the issue before presenting for user approval.

## Decision Log Format

Each entry in `planning/decision-log.md`:

```markdown
## [YYYY-MM-DD HH:MM] Gate N: {Gate Name}

**Status:** Approved / Rejected / Approved with notes

**Artifacts reviewed:**
- {artifact 1}
- {artifact 2}

**User feedback:**
{Exact user feedback, quoted where possible}

**Action taken:**
{What was done in response — approval recorded, revisions made, etc.}

**Next phase:** {Phase N}
```

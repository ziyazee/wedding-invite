# Shared invitation architecture

## Milestone 2: Majestic — implemented, verification pending

- Native entry: `src/pages/majestic/Majestic.tsx`. Order template 2 and named
  `/majestic` / `/design6` routes now use it. Named routes use catalog sample data.
- No runtime HTML fetching, DOM-generated invitation markup, or inner iframe.
  The dashboard's outer phone-preview iframe remains.
- Uses the same `InvitationLayoutProvider`, `InvitationSection`, `EditableText`,
  and `InvitationMedia` contract. IDs start with `t2.`; event keys use persisted
  IDs or the original input index before date sorting. Keep this ID contract.
- Shared dashboard text selection, size handles, positioning, center snapping,
  undo/reset and order JSON saving apply through those markers. Guest rendering
  applies overrides directly without the legacy DOM override layer.
- Reuses local Majestic fonts and existing artwork/video files. Local name/card
  measurements accommodate content changes and custom sizes; scoped CSS keeps
  template styles out of other routes. Explicit font overrides remain authoritative.
- Native `InvitationRsvp` retains the envelope opening and uses `saveOrderRsvp`;
  preview submissions are disabled. Countdown uses the order's offset; calendar
  actions use the current details. Empty map/notes/dress sections are omitted.
- Existing reference HTML remains in `public/design6/` for compatibility.
- No schema migration is needed for this template. No build, tests, browser
  checks, visual comparisons, or latency measurements have been run for it.
  Apply the verification gate below before treating it as production-verified.

## Milestone 1: Royal Grace

Catalog update: Maroon Letter (9), Emerald Parchment (10), and Royal Jodhpur
(11) now have order-rendering adapters. They retain their iframe implementations;
they have not migrated to the native shared text editor. The catalog SQL migration
`202610210001_new_order_templates.sql` must be applied before the dashboard lists
them. This addition has not been built or tested.

Implementation is in source. Builds, browser checks, database submission checks,
and performance measurements have **not** been run. Do not call the milestone
verified or use it as the basis for a bulk template migration yet.

### Source baseline

Before this change, App and InvitationRenderer statically imported every design.
Royal Grace's personalized orders also mounted the old browser layout editor, and
the shared TextLayoutLayer searched the DOM and emitted styles for saved edits.
The root stylesheet requested the full site's Google Fonts set.

Royal Grace has these sections: opening video/names, welcome, scratch date reveal,
countdown, celebration heading/cards, personal notes, and closing. Keep the
opening state, playback, scratch interaction, music, scroll reveals, calendar
downloads and links intact.

Read-only asset inventory (rounded on-disk sizes; not network transfer measurements):

| Asset | Size |
| --- | --- |
| opening-poster.jpg | 186 KiB |
| opening.mp4 | 2.9 MiB |
| celebration-roses.png | 2.0 MiB |
| ivory-stationery-unframed.png | 2.3 MiB |
| sage-stationery-unframed.png | 2.5 MiB |
| scratch.png | 2.5 MiB |
| post-scratch.png | 284 KiB |

These originals remain unchanged. Large PNG artwork is a candidate for a later
image optimization pass; size savings and appearance must be measured before
replacing it. Native lazy loading does not guarantee all below-fold images wait
until they enter the viewport; the browser chooses its preload distance.

## Component contract

All native templates should use `src/invitations/components/`:

- `InvitationLayoutProvider` validates the order's versioned overrides once per
  change. Place it around the template, with no extra DOM wrapper.
- `InvitationSection` renders the original section/div/footer/article and exposes
  its dimensions to its text. One ResizeObserver is installed for a section only
  when a child needs position geometry. There are no scroll listeners, DOM scans,
  or continuous animation-frame loops in this component.
- `EditableText` renders the original HTML text tag. Keep a stable `textId` and
  descriptive `label`; the existing `editableText()` spread helper remains
  compatible. Saved size/font/color use CSS variables with explicit precedence
  over template defaults. Position uses the individual `translate` property,
  leaving the template's `transform` available for existing effects.
- `InvitationMedia` prioritizes an explicitly marked opening image, defers other
  image downloads and decodes asynchronously. Video defaults to metadata preload;
  playback is still controlled by the template. Set dimensions/aspect ratios
  wherever the asset geometry is known to avoid layout shifts.

Example:

```tsx
<InvitationLayoutProvider layout={details.textOverrides}>
  <InvitationSection data-invite-section="welcome" className="welcome">
    <EditableText as="h2" textId="t1.welcome.groom" label="Groom · welcome">
      {details.groom}
    </EditableText>
  </InvitationSection>
</InvitationLayoutProvider>
```

The semantic HTML tags and class names stay the same when migrating, so existing
CSS selectors and animations retain their targets. HTML text inside SVG and
curved SVG text need their own conversion strategy; this milestone does not
claim native SVG editing support.

## Data and compatibility

Continue using `orders.form_data.textOverrides`:

```json
{
  "version": 1,
  "elements": {
    "t1.opening.groom": { "fontSize": 60, "x": 0.02, "y": -0.03 }
  }
}
```

Size is CSS pixels, currently 8–160. X/Y are additional offsets as fractions of
the nearest section's client width/height, currently -1 to 1. They are offsets,
not absolute coordinates. Keep these boundaries identical to the previous
renderer or existing orders will move. The same values apply across breakpoints;
no separate desktop/mobile overrides have been introduced.

Missing overrides preserve defaults. Existing font/color overrides continue to
render even while those dashboard controls are hidden. Unsupported schema
versions currently fall back to defaults; introduce an explicit migration reader
before writing a new version. Unknown text IDs remain in validated data (within
the existing limits) and are ignored by templates that do not render them.

Keep all Royal Grace IDs, including `t1.event-{event.id}.{field}` and existing
legacy event-index fallbacks. New events receive durable IDs before editing.
Do not generate IDs from wording, dates, chronological position or DOM indexes.

`royalGraceLayout.ts` is the single source for the earlier approved stationery
placements. For personalized orders, preserve the previous rule that only the
event identified as `nikah` receives those defaults. Base `transform` values and
client `translate` offsets remain independent. The standalone named invitation
retains the older browser-local editor through a separate lazy import.

No schema migration or new database request is required. Draft persistence,
Create invitation submission, validation and published lookup still use the
existing form_data path. Existing-order dashboard layout autosaving remains a
separate feature, not part of this milestone.

## Loading boundaries

App routes and individual invitation renderers now use dynamic imports. A cold
Royal Grace order route should request its renderer without requesting the
dashboard, other template implementations, the old DOM override layer or editor
controls. Actual production chunks must still be inspected after an authorized
build; source-level import boundaries alone are not a bundle-size measurement.

Royal Grace bypasses TextLayoutLayer and uses native saved styles. Other designs
retain TextLayoutLayer until migrated. The dashboard still loads OrderTextEditor
lazily and uses the same data markers to select and resize native text.

SiteFonts loads the historical multi-family stylesheet only for site pages and
unmigrated templates. Royal Grace's CSS supplies Dancing Script and Cormorant
Garamond. A cold Royal Grace URL should not request the full site font set.
Previously visited route styles can remain cached in a single-page session.

Royal Grace's opening poster has priority; its video now requests metadata
instead of preload=auto. The existing tap-to-play behavior is retained. Compare
tap-to-first-frame latency as well as initial page loading before accepting this
tradeoff on slow connections.

## Verification gate (pending authorization)

### Temporary editor adapters for unmigrated templates

All current order templates (1–11) are enabled in the dashboard text editor.
Templates 3–11 use `legacyTextAdapters.ts`: explicit authored selectors map real
HTML/SVG text to semantic version-1 override IDs. `TextLayoutLayer` installs the
adapters in same-origin frame documents only during editing or when saved
overrides exist. Published pages do not install drag/selection controls.

Keep the same IDs and section coordinate boundaries during later React
migrations. Repeated events use persisted event IDs, falling back to original
order indices for older data. Responsive/carousel copies share a saved ID but
receive their own geometry conversion. SVG and foreignObject translations use
the current screen matrix to convert section-relative offsets to local units.
Images, video, canvas lettering and external cross-origin frames are excluded.

This adds no schema change: layouts remain in `orders.form_data.textOverrides`.
New invitation drafts autosave locally and are persisted on Create invitation;
existing-order dashboard layout autosave is still outside this change. Adapter
coverage, resize/drag behavior, published reloads and fit interactions remain
unverified in a browser. No tests or builds were run for this extension.

1. Run the production build/type checks. Inspect its chunk graph for accidental
   eager editor/template imports and missing route CSS dependencies.
2. Compare the same order before/after at narrow phone, the 402×874 dashboard
   viewport, and desktop widths. Include long names, multiline addresses, blank
   notes, changed celebration ordering, and every supported text occurrence.
3. Exercise size/drag/center snap, undo/redo, reset, browser draft restoration,
   Create invitation, published reload, and existing-order management saves.
   Test old version-1 overrides and orders without overrides.
4. Check opening video/fallback, fonts, music, scratch reveal, countdown, scroll
   effects, map links and calendar downloads. Check the standalone named route.
5. On identical network/CPU settings, record multiple cold and warm runs: order
   lookup latency, transferred JS/CSS/fonts/media, LCP, CLS, interaction latency,
   video-start delay and editor drag responsiveness. Report medians and worst
   observed runs; no before/after timing claims are available yet.

Do not add caching to public lookup until publishing, edits, expiry and access
changes have an explicit invalidation strategy. Do not convert the next template
until this reference implementation passes the gate.

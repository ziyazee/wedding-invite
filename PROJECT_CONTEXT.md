# Wedding invitation project context

Last updated: 2026-10-17. These notes describe work established in the conversation, not a fresh repository audit.

## Project and local workflow

- The song picker groups `musicCatalog.ts` into Muslim, Hindu, Christian, and General. Twelve unique repository MP3s were copied into `public/audios/` category folders; Destination/Raabta/Qubool share identical audio and one catalog entry. Wedding Nasheed is Muslim; tracks without established religious classification remain General pending identification. Hindu and Christian folders are currently empty. Original audio paths remain intact; the two old `/audios/` selections are recognized as aliases. No database migration is needed: selections still use `orders.form_data.music`.

- Public invitation routes now use `InvitationViewport` at the App boundary on screens at least 768px wide: a centered 9:16 iframe with a light ivory surround. The frame loads the same route so native designs and legacy templates receive a real portrait viewport. Embedded previews bypass this wrapper to prevent recursion and preserve dashboard editor access. Phones, application routes, order-management links, and the standalone celebrations embed retain their existing layout. No browser or build verification was run for this change.

- Majestic (order template 2) migration is implemented in `src/pages/majestic/Majestic.tsx`, `Majestic.css`, and `useMajesticFit.ts`. Orders bypass `AnimatedInvitation`/`TextLayoutLayer` and render native React with the shared layout provider, section, text and media components. `/majestic` and `/design6` use this renderer with catalog sample data through `Design6.tsx`; original `public/design6/` reference files remain. Uses stable `t2.*` text IDs and `t2.event-{event.id || legacy-originalIndex}.*` event IDs, existing version-1 order overrides, and the dashboard editor. Font family/color controls remain hidden. Scoped native CSS retains the existing assets, local fonts, background videos, venue badge, celebration videos, dress artwork, RSVP envelope and closing flowers; visual parity is not verified. The shared native `InvitationRsvp` submits through existing order RSVP storage. Names and card fitting use local observers and respect explicit text sizes. No build, tests or browser checks were run for this migration; verify before calling it complete. Nine other collection templates still await native/editor migration.

- Native template architecture milestone: see `TEMPLATE_ARCHITECTURE.md`. Royal Grace now uses `EditableText`, `InvitationSection`, `InvitationLayoutProvider`, and `InvitationMedia` from `src/invitations/components/`. Its saved version-1 IDs and position boundaries are preserved; it bypasses the DOM-scanning TextLayoutLayer. Sections observe their dimensions only when positioning/base transforms require it. The old layout editor is lazy-loaded for standalone named invitations only. App routes and template renderers are lazy-loaded; `SiteFonts.tsx` provides the old site font set to site pages/unmigrated templates, while Royal Grace uses its own fonts. Opening video preload is metadata and the poster has priority. Source changes are not built, browser-verified, database-tested or performance-measured; the documentation records the pending verification gate before migrating more templates.

- Project root: `/Users/mziya/new/wedding-invite`.
- React + TypeScript + Vite. Routes are declared in `src/App.tsx`.
- Follow `AGENTS.md`: direct patches only, no commands/builds/tests/commits/pushes unless requested.
- The user previews changes through a running Vite development server. Do not assume a port without confirmation; several local servers have existed.
- A production preview reads the last build, while a Vite development page picks up source edits. Do not rebuild automatically if an old preview is visible.
- Local edits are not necessarily deployed. Many recent changes remain uncommitted by request.

## Landing page

| Purpose | File |
| --- | --- |
| Collection, filtering, sorting, favourites, live phone preview | `src/pages/Landing.tsx` |
| Layout, hero, phone surround, responsive sizing, card finish | `src/pages/Landing.css` |
| Shared font imports | `src/index.css` |
| Landing artwork and thumbnails | `public/landing/` |

The collection is a local `templates` array in `Landing.tsx`; changing another registry may not change the landing page. Category tags are in a separate `tags` object. The default selection uses `templates[0].id`.

Current landing decisions:

- Navbar is present. Its removal was reverted.
- Warm ivory/gold palette, textured background, glossy template covers.
- Hero artwork spans the full width behind the phone panel on desktop.
- The phone panel is on the right and sticky on desktop. It retains its textured ivory/gold botanical surround.
- The controls card below the phone was removed, including template navigation, Use This Template, Preview Full Invitation, and customisation links.
- Desktop phone width and panel position are calculated from viewport height, bezel/padding, and the 402:874 preview dimensions. Bottom alignment includes the 60px navbar.
- The iframe renders at 402 × 874 and is scaled by a ResizeObserver. Preserve the matching screen aspect ratio.
- Landing previews with sample data use `/client/live-preview` and the updated order invitation renderer, including Bloom and Secret Garden. Do not route those two landing previews to their older standalone named routes.
- On narrow screens the phone preview follows the collection; selecting a template scrolls to it.
- Gulabi Mandap (17) and Ivory Arch (15) were removed from the landing collection only. Their routes and assets were not deleted.
- Design 14's collection title is **A Timeless Union**, not “Arjun & Bhavana · A Timeless Union”.
- Design 14 and Design 13 use captured opening-screen thumbnails, not couple photographs.
- The sort dropdown uses a custom chevron anchored to the right.

Current active collection (the only designs to offer for new orders): Royal Grace, Majestic, A Timeless Union, Mandap at Dusk, Secret Garden, Embroidered Garden, Bloom, The Artful Love Story, Maroon Letter. All other designs are deprecated for current use. Keep their existing code, routes, and assets; do not offer them for new orders or remove them unless asked. The Royal Grace preview retains the existing `/mohadrahma` route for testing.

Active order template IDs are compact and fixed: 1 Royal Grace, 2 Majestic, 3 A Timeless Union, 4 Mandap at Dusk, 5 Secret Garden, 6 Embroidered Garden, 7 Bloom, 8 The Artful Love Story. The `name` and `template_code` fields use these displayed names (`royal-grace` for Royal Grace); `preview_url` uses name-based testing routes. Existing numbered and personalized URLs remain available. These order IDs are distinct from the legacy route/design numbers. Apply `202610190001_compact_active_template_ids.sql` after the dashboard and company-template-settings migrations, then `202610190002_royal_grace_catalog_metadata.sql` and `202610190003_named_template_preview_urls.sql`.

Important landing assets:

- `public/landing/palace-wedding-hero.jpg`
- `public/landing/preview-botanical.svg`
- `public/landing/ivory-paper-texture.svg`
- `public/landing/timeless-union-opening.jpg`
- `public/landing/artful-love-story-opening.jpg`

`Landing.css` contains successive responsive overrides. Inspect the final applicable rules before changing a value; an earlier declaration may be overridden later. Avoid adding conflicting overrides unnecessarily.

## Design map

| Design | Display name | Implementation / assets |
| --- | --- | --- |
| 3 | Embroidered Garden | `src/pages/Design3.tsx` iframe wrapper; `public/design3/` |
| 5 | Secret Garden | `src/pages/Design5.tsx` iframe wrapper; `public/design5/` |
| 6 | Majestic | Native React: `src/pages/majestic/Majestic.tsx`; `Design6.tsx` sample route; artwork `public/design6/` |
| 7 | Bloom | `src/pages/Design7.tsx` iframe wrapper; `public/design7/` |
| 11 | Design 11 | `src/pages/Design11.tsx`, `src/pages/Design11.css` |
| 13 | The Artful Love Story | `src/pages/Design13.tsx` iframe wrapper; `public/design13/index.html`, `local-runtime.js`, assets |
| 14 | A Timeless Union / Arjun & Bhavana | Native React: `src/pages/Design14.tsx`, `src/pages/design14/`; assets remain in `public/design14/assets/` |
| 15 | Ivory Arch | `src/pages/Design15.tsx`, `Design15.css`; removed from landing only |
| 16 | Sacred Mandap | `src/pages/Design16.tsx`, `Design16.css`; `public/design16/` |
| 17 | Gulabi Mandap | `src/pages/Design17.tsx`, `Design17.css`; removed from landing only |
| 18 | Mandap at Dusk | `src/pages/Design18.tsx`, `Design18.css`; `public/design18/` |
| Named route | Mohad & Rahma | `src/pages/MohadRahma.tsx`, `MohadRahma.css`; `/mohadrahma`; order invitations also render through this dedicated component |
| 19 | Maroon Letter | `src/pages/MaroonLetter.tsx` iframe wrapper; `public/maroon-letter/index.html`, assets in `public/maroon-letter/` |

Standalone iframe designs commonly use `index.html`, `interactions.js`, `interactions.css`, and `reference.css` inside their public directory. Some files contain very long minified lines; inspect targeted portions rather than dumping the whole file.

## Order dashboard and Supabase

- Current order catalog now registers **14 designs**: **12 Destination**, **13 Raabta**, **14 Qubool** join IDs 1–11. Apply `supabase/migrations/202610220001_complete_order_template_catalog.sql` after the compact-ID migration to add/activate all six newer designs (9–14); it also covers the still-pending 202610210001 catalog rows. This SQL has NOT been applied: the workspace has only public Supabase credentials. Dashboard visibility depends on these database rows, not the landing-page list.

- IDs 12–14 use `OrderFrameInvitation` and `newOrderTemplates.ts`. Destination receives order configuration before its bundled React app boots; content edits reload its preview, while styling-only edits keep the document. Raabta/Qubool personalize their existing HTML scenes and clone original event artwork for the entered event count. Shared RSVP replaces sample forms; demo wishes/photos/contact details are omitted, and notes/gallery/maps/music use order values. Raabta/Qubool countdowns use the wedding time and offset; Destination retains its native date-based countdown. Text mappings are compatibility adapters, not React migrations; Destination mappings still depend on the exported scene structure and matching configured text, so future migration needs an explicit saved-ID compatibility pass. No builds, unit tests, browser checks, or database writes were run for this addition.

- Invitation song selection uses `src/invitations/musicCatalog.ts`, currently listing `/audios/music.mp3` and `/audios/template02.mp3`. Add catalog entries when adding files to `public/audios`. Dashboard and management forms share `MusicPicker` with manual audio preview and a template-default option. Existing custom song URLs remain selectable. The selected path is saved in the existing `orders.form_data.music` string; shared validation accepts catalog paths alongside existing HTTP(S) URLs. No database migration is needed. Order iframe adapters accept catalog paths too. No builds, tests, or browser checks were run for this addition.

- New order templates: **9 Maroon Letter**, **10 Emerald Parchment**, **11 Royal Jodhpur**. Apply `supabase/migrations/202610210001_new_order_templates.sql` after the existing compact-ID catalog migrations to expose them in the database-backed dashboard. Migration is prepared, not applied. `model.ts`, `templateData.ts`, and `InvitationRenderer.tsx` now register them. `OrderFrameInvitation.tsx` / `orderFrameAdapter.ts` personalize the existing same-origin iframe documents in place for previews and published orders (names/families, events, dates/countdowns, maps/calendar, music, notes/gallery and order RSVP). Standalone named demo routes retain sample data. Orders omit sample photos and sample RSVP destinations. Maroon keeps its first two scratch cards; further events use additional cards. Emerald keeps its paged shell/timeline. Royal Jodhpur uses its event artwork in a flow layout that supports the order's event count. These are order adapters, **not** shared React text-editor migrations. No builds, tests, browser checks or database writes were run for this addition.

- Text editing is connected to all **11 current order templates**. Royal Grace/Majestic use native components; templates 3–11 use explicit semantic mappings in `legacyTextAdapters.ts` through `TextLayoutLayer`, including same-origin iframe and SVG/foreignObject text. Size, drag, center snap, undo/redo/reset reuse the dashboard editor; font/color controls remain hidden. Fixed headings/captions and mapped action labels are included alongside form text. Artwork baked into images/videos/canvas is not selectable. Use Preview to activate links/buttons. Adapter coverage and SVG geometry have not been browser-verified; no build or tests were run for this extension.

- Preserve adapter IDs (`t<order-template>.<section>.<field>`) and section geometry when migrating. Event IDs use persisted celebration IDs with original-index fallbacks for legacy records; responsive/carousel copies intentionally share IDs. Saved edits continue through `orders.form_data.textOverrides` (version 1), with local draft autosave before Create invitation. No additional database migration is required for adapters. Existing-order dashboard layout autosave remains separate. Guest pages without overrides skip adapter setup; edited legacy pages install mappings/styles but no editor controls. No rendering-latency measurements have been taken.

- Selected form text now has a gold resize handle inside the dashboard phone preview (`textResizeHandle.ts`). Drag outward/inward to adjust font size within 8–160px; pointer release commits one undoable change through the existing draft/order saving. Arrow keys on the handle also adjust size. The separate phone resize handle changes only the preview dimensions.

- Dashboard phone preview now has a bottom-right drag handle (`PhonePreviewResize.tsx`), with arrow-key resizing and double-click/Home to reset. It resizes only the preview surround, preserves the 402:874 invitation viewport, and fits the available panel width. Font-family and color controls are temporarily hidden in the text editor; size and positioning remain enabled, and previously saved font/color overrides remain supported.

- Latest text-editor alignment decision: dragging within 8 preview pixels of a section's horizontal center automatically snaps the text to the middle and displays the center guide. Moving beyond that range releases the snap. The snapped position saves with the draft/order, including when the pointer is released before the next animation frame. This supersedes the earlier suggestion-only center guide decision.

- Shared text layout editor: `src/pages/OrderTextEditor.tsx` is lazy-loaded only in the client dashboard form and is editable by default. It selects explicitly marked form text in the live phone, supports font size/system font/color, section-relative dragging, optional center guides, precise offsets, undo/redo and reset. Draft changes save with the existing authenticated browser draft; Create invitation persists them in `orders.form_data.textOverrides` (versioned JSON), not a separate column. No migration is required. `textLayout.ts`, `textLayoutDom.ts`, and `TextLayoutLayer.tsx` validate and apply saved overrides on preview and published orders. Royal Grace is the first adapter (names, message, dates/times, celebration text and personal notes); other template adapters remain pending. Elements use `data-invite-text` and a `data-invite-section` ancestor; editable labels must correspond to form fields. Celebration IDs are retained in form data so sorting does not move their edits. The legacy Royal Grace browser layout is isolated from personalized orders. This implementation has not been built, tested or visually reviewed. Existing-order layout editing/autosaving is not yet exposed in the dashboard.

- Order prices reflect the final INR selling price at creation. The final form step offers an editable price defaulted to the template's discounted price; it persists with the draft and appears in review. Zero displays “Complimentary” in Orders, overview rows, review, and the order modal, and contributes zero to dashboard revenue. `202610200002_order_sale_price.sql` adds the price snapshot; apply `202610200003_custom_order_sale_price.sql` afterward to preserve entered amounts and grant price insertion. Later template changes never recalculate existing order prices. Unknown historical prices stay NULL (“Not recorded”); dashboard totals include recorded prices and note missing ones. Pricing helpers are in `src/lib/orderPricing.ts`.

- The create-invitation review step uses `InvitationReview.tsx` / `InvitationReview.css` and follows the user's supplied reference: ivory floral names banner, two columns containing Couple Information / Wedding Details and Additional Information / Celebrations, gold outline icons, label/value rows, and equal-width gold Create invitation / white Edit details buttons. Use `public/landing/invitation-review-floral.png` for the header. Keep this design inside the existing order form, preserving its heading, progress, scrolling, and adjacent live phone preview; do not expand the review to the whole screen. Preserve submission and drafts. Time-zone controls remain omitted; date/time and venue/address are included for review.
- Dashboard order forms default the contact number to `7975948093`. Draft details, contact number, celebrations, selected/preview template, active tab, form step, and review state persist in browser localStorage under an authenticated-user-specific key. Refresh resumes that draft; successful submission resets the form and its saved draft to defaults. This is browser-local persistence, not cross-device sync.

- Secret Garden has a **Show Bride & Groom Illustrations** checkbox in the dashboard and management forms. Save `showCoupleIllustrations` as a boolean in the existing `orders.form_data` JSON. Defaulting and boolean validation are handled in the application: missing values mean true, and explicit false is preserved. No database migration is needed. False hides the welcome couple picture and the dress-code people illustration, with their image spacing, during live previews and in published invitations. Images are marked `data-couple-illustration`; mark any future couple illustrations as well.

- The client dashboard's live phone preview uses `/client/live-preview?editor=1` so form edits update animated invitations in place and preserve their opening state and scroll position.
- Client dashboard opens on Overview, with a wedding-art hero, order metrics and status breakdown, recent orders, and a popular templates strip. The catalogue, orders, and settings remain separate tabs.
- The client order catalog is limited to the eight landing designs (Mohad & Rahma, Majestic, A Timeless Union, Mandap at Dusk, Secret Garden, Embroidered Garden, Bloom, The Artful Love Story).
- Apply `supabase/migrations/202610170001_selected_order_templates.sql` after the dashboard schema migration to align existing Supabase projects. The base migration also seeds this catalog for fresh setups.
- New orders start with Mohad & Rahma's couple and event details as editable defaults; clients still choose the design for each order.
- Client Settings lets each company configure its own template price, sale type (none, percentage, or fixed), discount value, and premium flag. These values live in `company_template_settings`; apply `supabase/migrations/202610180001_company_template_settings.sql` after the dashboard schema migration.
- After order submission, clients see the generated `/{order-id}/{groombride}` URL and can publish the order immediately. The public route uses the existing `get_published_invitation` lookup; apply `supabase/migrations/202610180002_client_order_publishing.sql` to enable company-scoped publishing through its security-definer function.

## Design 14

- The personalized opening retains the reference's bold uppercase gold serif names, white Jost **WEDS** separator, and pale-gold serif date. Keep its bounded Names Fit behavior; `/arjunbhavana` remains isolated.
- Personalized A Timeless Union Names Fit uses 12 characters as the default-size guide, reduces both names equally by up to 25% through 16 characters, and wraps longer multiword names at spaces with a 16-character line guide. Actual measured width and complete-group height remain authoritative; oversized single words shrink intact. These thresholds do not change the standalone `/arjunbhavana` reference scenes or other layout elements.
- Preserve `/arjunbhavana` as the original named invitation, including **Arjun WEDS Bhavana**, its original SVG typography, family layout, and celebration carousel. `ReferenceScenes.tsx` holds its original opening/welcome. Only invitations with `InvitationContext` details load `TimelessRules.css` and the rule-enabled opening, welcome, and celebration components. Standalone named routes must not inherit order-template design changes.
- A Timeless Union (active ID 3) now uses `TimelessRules.tsx` / `TimelessRules.css` for the saved rules. Full entered names are retained; paired names shrink equally, wrap at spaces, reset after edits/fonts/resizing, and family details sit beneath their names. Empty entered family fields do not show sample families. The opening replaces independent SVG name boxes with one bounded names/date group while retaining the scene artwork and entry animation. Welcome content can grow with family text. Names are limited to 40 characters; event title/venue/address limits are 40/60/100 through shared validation and forms.
- Personalized celebrations now render every entered event, without title-based sample substitutions. The new carousel uses the existing engagement/sangeet/wedding/reception artwork, fits the complete copy/actions inside each image's lower plain area, and extends the frame only if minimum fonts and gaps cannot fit. Explicit text line breaks are preserved. Empty map links are omitted; Add to calendar downloads the shared start-only ICS using current event details and offset. Dress code and gift note are separate sections shown only for non-whitespace content. The original `Celebrations` export remains available for legacy embedded layouts.
- A Timeless Union's illustration toggle is available in both forms, defaults to true, and uses existing form-data persistence. False hides the dedicated couple scene and closing couple overlay. Celebration illustrations are baked into their backgrounds, so false uses plain bordered cards in place of those images. Re-enabling illustrations reconnects motion observers. Source changes have not been visually verified in a running browser or tested with a build.
- Public route: `/arjunbhavana`; `/design14` redirects there.
- Public site: `https://www.shaadiinvites.in/arjunbhavana`.
- Dedicated entry: `arjunbhavana.html` and `src/arjunbhavana.tsx`; includes sharing metadata.
- Scene markup: `src/pages/design14/Design14Scenes.tsx`.
- Styling: `src/pages/design14/Design14.css`.
- Behaviour: `useDesign14Motion.ts`, `useDesign14TextMotion.ts`, `useDesign14Carousel.ts` in the same directory.
- The old `public/design14/local-runtime.js` is not the native React implementation; an open IDE tab may be stale.
- Scenes: opening gate → welcome/family details → bride-and-groom scene → celebration carousel → closing temple/couple scene → compact WhatsApp footer.
- Opening action starts music, fades away, reveals names, unlocks scrolling, and starts clouds.
- Parallax uses cached measurements and requestAnimationFrame; avoid introducing per-scroll layout reads or transitions that compete with scroll transforms.
- Celebration carousel loops smoothly with duplicate edge slides and supports automatic advance.
- Welcome family details are smaller white text beneath each person's name. Nephew/niece details were removed; sibling details remain. Bhavana's parents are the first line.
- Date: 3rd February 2027. Do not replace event dates from unrelated reference images without a request.
- Closing couple asset: `public/design14/assets/brideandgrrom.png`.
- Footer is thin, small text and WhatsApp icon on one line; no visible number.

## Design 18

- Mandap at Dusk uses `/design18/scratch.png` as the scratchable canvas coating in `HeartDateReveal`, revealing the entered wedding date beneath. Its transparent silhouette masks the card; scratching 40% reveals the rest, with the existing tap alternative and confetti preserved. Other templates retain their original coating.

- Full content/styling was copied from Design 16, while retaining a separate Design 18 component and CSS namespace (`d18-`). Some shared artwork correctly uses `/design16/` asset paths.
- **Preserve Design 18's original curtain video**: `/design18/entry.mp4`, poster `/design18/entry-poster.jpg`. Do not replace these with Design 16's video.
- Opening button artwork: `/design18/open-invitation-button.png`.
- Button overlays the curtain, starts the existing opening experience, and fades out after tapping. It remains mounted during the opacity transition and becomes disabled/non-interactive.
- Scrolling is available while the video plays. Decorative video has `pointer-events: none`; the entry allows vertical pan gestures.

## Other established design decisions

- Secret Garden: framed venue photo, Transport, Gifts, and RSVP removed. Venue details use Majestic's `/design6/assets/ornate-badge-2PyCLI0e.png`; Google Maps and Calendar sit below the frame, side by side.
- Secret Garden's countdown uses the supplied `public/design5/assets/pearl-clock.png` face with pearl/gold edging and 12/3/6/9 numerals, centered sage day numerals, and live hours/minutes/seconds in `public/design5/interactions.js` and `interactions.css`. The original square, guide lines, and plain rings are removed. Its seconds hand sweeps counterclockwise inside the pearl border, respects reduced motion, and stops at zero. Personalized invitations pass `data-wedding-instant` and refresh the target during editor updates. The standalone October 3, 2026 sample date remains unchanged, so it shows zero after that date.
- Secret Garden personalized order invitations retain the envelope RSVP form and use `/design6/assets/celebrations.mov` as muted, looping celebration frames behind their event details. Their page and RSVP background is `#EFE8DA`, matching Majestic.
- Secret Garden's personalized welcome applies Family Layout: with both family fields empty, show the names and ampersand on one line when Names Fit permits. With either family field filled, stack the groom, ampersand, and bride, grouping family details beneath the corresponding name. Empty family paragraphs are hidden. Both names shrink equally if needed. The entered invitation message appears beneath the Details heading, before “when & where”, rather than in the welcome section.
- Secret Garden's personalized opening applies Names Fit: keep names on one line when they fit; otherwise stack groom, ampersand, and bride. If either name remains too wide, shrink both names equally to a minimum of 24px, then wrap if needed. The ampersand retains its size. Fitting resets to the design's maximum after font loading, resizing, and live preview edits.
- Secret Garden personalized invitations show the decorative lights, Welcome / Family section, framed location, and programme heading/artwork in that order below the countdown, using the shared layout with Majestic and Secret Garden's green palette. The illustrated dress code follows the celebration cards. Maps and Calendar use the entered wedding details; custom dress code replaces the reference guidance. The original standalone lights and text-only dress code are not duplicated.
- Majestic: Gifts are removed. Hero video should autoplay; introductory envelope video is skipped. Personalized order invitations include the Secret Garden style RSVP envelope and reply form, styled with Majestic artwork and palette.
- Majestic personalized celebration cards use `/design6/assets/celebrations.mov` as muted, looping video frames behind the existing event details and links. The page, RSVP, and closing panel background is `#EFE8DA`.
- Majestic personalized invitations show the decorative lights immediately after the countdown, followed by the Welcome / Family section, framed Details / Location, programme heading/artwork, and celebration cards. The welcome keeps its typography in a separate `.atelier-personal` wrapper. The illustrated dress code follows the celebration cards inside `.atelier-personal`, with scoped typography to preserve its layout. The venue, Maps, and Calendar use the entered wedding details; an entered dress code replaces the reference Formal / Black tie copy. Both Majestic and Secret Garden use `/design6/assets/food.png` above the programme heading; the schedule list and “the day” subtitle are removed.
- Embroidered Garden: Recovery Day, Gifts, and RSVP removed.
- Bloom: uses `/design7/assets/intro-video-2-a-H3NxSy.mp4`; first envelope video was removed from use. Scrolling unlocks immediately after tapping, without waiting for the video to finish.
- Bloom dashboard and published order invitations are personalized in `src/invitations/AnimatedInvitation.tsx`. The welcome section reuses `public/design7/index.html`'s actual `#welcome` markup, fonts, spacing, and floral artwork, with the entered names/message/date and a pink `&`. Keep it outside `.atelier-personal` to avoid generic typography overrides; do not recreate it with separate approximate styles.
- Bloom's main wedding celebration also reuses Design 7's native `#wedding-events` section outside `.atelier-personal`, directly after the welcome. Its heading comes from the entered wedding celebration name; venue, date/time, address, map link, and calendar use that event's details. Preserve the original frame and typography.
- Bloom's first wedding celebration card retains its original image. Additional cards use `/design7/assets/hum.mov`, muted and looping, at its intrinsic aspect ratio by default. For long content, reduce fonts and gaps first; when the readable minimum still cannot fit, increase the card height and extend the full video frame vertically to match. Keep the text and actions inside the central 18–82% area. Never move text beneath an empty frame. Observe card width changes rather than video height changes to avoid fit loops.
- Bloom ends with the original RSVP layout restored in `public/design7/rsvp.html`, followed by Design 7's checkered closing names/date card and WhatsApp contact. Both sit outside `.atelier-personal`. Published order RSVPs use `src/invitations/rsvp.ts` and the `submit_order_rsvp` RPC; browser storage remembers the form and a per-order submission token for updates. Dashboard/sample previews cannot submit. Apply `supabase/migrations/202610180003_order_rsvps.sql` to create `order_rsvps` and return `orderId` from `get_published_invitation`. Replies store name, attendance, guest count, additional names, message, and timestamps against the order; only the owning company and admins can read them. The Wedding Day Programme is hidden; entered dress code, gift, and gallery notes retain their existing presentation before RSVP.
- Secret Garden, Majestic, and Bloom ending credits were replaced with invitation contact text and a WhatsApp icon.
- Design 13: optimized responsive WebP assets in `public/design13/assets/optimized/`; opening temple parallax multiplier was reduced to 0.5. Preserve original source assets.
- Design 13's temple-and-couple scene is the third section (`PAGE 3`), before celebrations (`PAGE 4`). `local-runtime.js` reorders and relabels the two original sections before initializing their motion.
- Design 13's fourth section reuses Design 14's complete celebration carousel (Engagement, Sangeeth, Marriage, Reception), including its artwork, navigation, swipe and looping autoplay. `local-runtime.js` replaces the old section with an automatically sized iframe at `/design14/celebrations`; `src/pages/design14/CelebrationsEmbed.tsx` shares the native component and isolates its styles. The main section stack uses its content height.
- Design 13's couple image starts at the top of `PAGE 3`, with its size capped to the viewport. When the viewport bottom reaches the image's resting bottom edge, the image moves downward through the section at 0.5 times the scroll speed, matching the opening temple, stopping at the section bottom and reversing when scrolling back. Measure the resting edge without the current translation. The green-screen filter preserves source transparency to avoid a black rectangle.

### Order management links

- Each order has a private root-level link in the format `/{order-id}-{16-character-random-code}`. Apply `supabase/migrations/202610200001_order_management_links.sql` after `202610180003_order_rsvps.sql`; it backfills existing orders and assigns links to new orders.
- The mobile-first page offers invitation detail editing and RSVP response reading through scoped Supabase RPCs. Detail editing now defaults to a full-screen form on phones, with a sticky toolbar and explicit Save button at the top right. The previous half-preview/half-form layout and field-following code are retained behind `SPLIT_PREVIEW_ENABLED` in `OrderManagement.tsx` (currently false). Anyone holding the link can use it, so share it privately.
- The management preview uses `/client/live-preview?editor=1`. Animated templates update their generated markup in place with `editorDocument.ts`; Design 13 receives edits through its personalization message handler. Preserve these paths to avoid replaying intros and resetting scroll on every keystroke. The editor centers the first visible text occurrence once per field change, using the previous text location when clearing a field.

## Shared music and contact behaviour

- `public/media-visibility.js` pauses playing audio/unmuted media when the browser/app goes into the background and resumes previously playing media when visible, subject to browser autoplay rules.
- It is included in app HTML entries and standalone public design pages. Preserve user-muted/paused state.
- Contact number: +91 7975948093. Visible contact links should show the WhatsApp icon, not the number.
- Prefilled message: `Hey I need an invitation!`
- Link: `https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21`.

## Reusable design rules

### Additional approved design rules

These named rules refine the existing Names Fit, Safe Text Area, Font Limits, and Card Content Fit rules. Apply them when requested by name; recording them does not automatically update every template. Form control choices are one-time implementation changes, not reusable design rules.

| Rule name | Behaviour |
| --- | --- |
| **Whole-Word Names** | Never split a name mid-word. Shrink both partners' names equally and wrap multiword names only at spaces. |
| **Shrink Before Wrap** | Start at the template's default font size. Reduce both names equally by up to 25% before wrapping at spaces. Allow further shrinking for a single word that still exceeds the safe width. Honour explicitly entered line breaks. |
| **Default Size Reset** | Recalculate from the template's default size after edits, resizing, and font loading. Restore that size when shorter text fits; never enlarge beyond it. |
| **Artwork-Based Boundaries** | Define text areas from the actual rendered artwork, accounting for narrow curves, flowers, and other decorations at each position. Keep text inside its plain areas across viewport sizes. |
| **Complete Group Fit** | Measure related content together: names, ampersand, and date; or event details and action buttons. Adjust shared sizing and spacing so one element cannot push another outside the safe area. |
| **Keep Content Inside Frame** | Shrink text and spacing first, then grow the decorative frame where the template supports it. Keep content inside the frame; never move overflowing text beneath an empty decorative frame. |

- Bloom opening names now start at 32px on mobile / 40px on desktop and sit 24px lower than the original name margin. Keep the original curved heading unchanged. Limit name width using 30% of the rendered background image width (actual cover/contain scale), not nested percentages. Copy individual web-font properties for measurement and verify each rendered line with DOM ranges, shrinking both names equally if needed. Include the date when checking clearance above the lower oval border. Explicit editor line breaks remain authoritative.
- Dashboard and order-management forms use textareas for groom/bride names, family details, venue, address, and celebration titles. Enter inserts a line break; existing character limits and required validation remain. Animated invitations preserve entered name breaks with `data-name-input` so fitting does not mistake generated wrapping for the editor's chosen lines. Bloom honours explicit lines before automatic two-word wrapping, and preserves multiline addresses on its main celebration card. Other native/SVG templates need their own rendering support before assuming manual line breaks display everywhere.
- Latest Bloom name-wrap correction: a two-word name uses one word per line. Never insert a break inside a word; shrink both partners' names equally enough for the widest whole word, even when that requires going below the earlier 24px floor. Longer multiword names wrap only at spaces. Keep the original opening design.
- Bloom opening rollback: the user requested the initial design. Do not call `prepareBloomOpening` or activate `.atelier-bloom-hero`; use the original Design 7 opening DOM, curved SVG, proportions, and spacing. The later custom artwork-coordinate panel described below is inactive. Retain name fitting within the original container and the celebration-card fixes.
- Bloom's Names Fit is owned by `fitBloomNames` in `bloomRules.ts`, bypassing the generic fitter. Measure full names first, reduce both equally by up to 25%, then wrap at spaces. If a single word still exceeds the area, reduce both further down to 24px before splitting that word as a last resort. Reset to the design's original size on each recalculation. Opening geometry is derived from the original 941×1672 background's actual cover/contain scale: a panel spans 33–67% of image width and 27–61% of image height. Its curved heading has a separate slot above the names/date group. Remove the old nested percentage widths and negative name margins. Fit the complete group vertically; increase hero height and recalculate artwork coordinates for extreme values. Welcome and closing use the same name fitter. Recheck the rendered layout before claiming visual verification.
- Bloom (active and legacy ID 7) applies the rules through `AnimatedInvitation.tsx` and `bloomRules.ts`: Names Fit in opening, native welcome, and closing; family text directly beneath each name; 40-character names and 40/60/100 event title/venue/address limits in shared validation and both forms; word-based card wrapping; optional map links and whitespace-empty notes; default-on illustration toggle for the dress-code people; and Add to calendar using the shared start-only calendar generator. Preserve its native welcome and first celebration markup outside `.atelier-personal`. The image card reserves 28–70% of height and 18–82% of width for text; additional video cards reserve 18–82% in both dimensions. Fonts reduce only when the complete group needs room. Oversized image cards grow; oversized video-card content moves into plain space beneath the intact video at the readable minimum. Recalculate on fonts, resizing, video metadata, and live edits. Visual review of the running preview remains pending.
- Card Content Fit in Secret Garden, Majestic, and Embroidered Garden wraps event titles at 18 characters per line, venues at 24, and addresses at 32, preferring word boundaries and splitting oversized words when necessary. These line limits are separate from the total input limits of 40/60/100. Titles use a 40px maximum / 24px minimum; Secret Garden and Majestic use a compact 0.82 line height, while Embroidered Garden uses 1.1. Start at maximum size even for multiline content; reduce only when the complete card content needs more room.
- Embroidered Garden (active template 6, legacy design 3) applies Names Fit with 40-character name limits, Family Layout/Family Under Name, Card Content Fit, Optional Section, Optional Map Link, Couple Illustration Toggle, and Start-Time Calendar. Its opening keeps the intentional three-line names; welcome names follow that layout. Dashboard and management offer the illustration toggle, defaulting to true, for the dress-code people artwork. The first floral card uses a 1072:1920 frame with text between 26–86% of height and 22–78% of width; video cards use 28–78% of height. The shared fitter derives available height from each card's actual bounds. These floral clearances still need visual review with the running preview.

- In Secret Garden and Majestic, when family details are absent, the welcome names follow the opening's Names Fit arrangement: if the opening stacks, the welcome also stacks. The welcome may also stack if its own available width is narrower. With family details present, the welcome always stacks.

- Names Fit allows a combined name line to occupy at most 80% of the available text width, including gaps around the ampersand. Wider combinations stack into groom, ampersand, and bride; individual stacked names may use the full safe text width.

- Majestic's updated renderer also applies the rule set: Names Fit in the opening and welcome, Family Layout/Family Under Name in the welcome, bounded location text, Card Content Fit with the same 40/60/100 limits, optional Dress Code, Optional Map Link for venue and event links, Couple Illustration Toggle for dress-code people, and Start-Time Calendar. Dashboard and management forms offer the toggle for active template ID 2. The renderer uses legacy design ID 6 for Majestic. Its artwork, palette, and existing welcome message position are retained.

- Secret Garden's Dress Code section applies Optional Section: `d.dressCode.trim()` controls inclusion of the entire illustrated section. Blank or whitespace-only input leaves no heading, artwork, or section spacing.

- Secret Garden celebration cards apply Card Content Fit. Input limits are 40 characters for event titles, 60 for venues, and 100 for addresses, including spaces, enforced in dashboard/management editing and shared validation. The content area spans 34–83% of card height and 18–82% of width. Spare vertical space is distributed between the time, venue, address, and links below the date. Fonts and spacing fit the whole group, including links; if readable minimum sizes still exceed the area, increase the card height. Existing rendered content is never truncated. Implementation: `src/invitations/cardContentFit.ts` and `cardTextLimit` in `model.ts`.

- Names Fit is implemented for the opening names in Secret Garden, Majestic, and Bloom through shared fitting logic in `AnimatedInvitation.tsx`. Bloom retains its existing stacked layout and separate ampersand styling. Both names shrink equally when needed, with a 24px minimum before wrapping; font loading, resizing, and live edits trigger recalculation.

These names are reusable instructions for future edits. Naming a rule with a template or section requests applying it there; recording a rule does not apply it to every template. Preserve each design's fonts, palette, artwork, and interactions. If no destination is stated, use the template and section currently being discussed.

| Rule name | Behaviour |
| --- | --- |
| **Names Fit** | Limit each entered name to 40 characters including spaces (currently enforced for Secret Garden, Majestic, and Bloom). Keep `Groom & Bride` together when the complete line fits at the design's maximum name size; otherwise stack groom, ampersand, and bride with equal gaps around the ampersand. Preserve intentionally stacked designs. Long multiword names wrap at spaces before shrinking. If an individual word is still too wide, reduce both names equally to fit the widest word, down to the readable minimum, then allow word breaking. Keep the ampersand's own font styling. Recalculate from the maximum after font loading, resizing, and live edits so shorter names can grow back; do not restart the invitation. |
| **Safe Text Area** | Keep text inside the plain area of the existing artwork, clear of flowers, illustrations, borders, and ornaments. Background images remain intentional. Define the safe area for each particular artwork and breakpoint; the image's full bounds are not the text bounds. Handle long unbroken words. Grow text sections only where the artwork layout permits it. Do not clip or truncate text, or display editor warnings. |
| **Font Limits** | Set a maximum and a readable minimum font size for the selected field, using its existing design size as the maximum by default. Fit within those limits; at the minimum, wrap and grow within the permitted plain area. A fixed artwork area may need a layout adjustment for exceptionally long content; do not promise unlimited text fits a fixed area at a readable minimum. |
| **Family Under Name** | Group each person's family details directly beneath that person's name. Omit empty family paragraphs. Keep the ampersand between the two groups and leave a clear gap before the invitation message. |
| **Optional Section** | Show the selected section only when its corresponding form field contains non-whitespace text. Otherwise omit the whole section, including its heading, artwork, and spacing. Update visibility during live edits. |
| **Optional Map Link** | Show Google Maps or Directions only when that venue or event has an explicitly entered, non-whitespace map link. Otherwise hide the link and its spacing; do not substitute an automatically generated search link. Update visibility during live edits. |
| **Couple Illustration Toggle** | Provide a “Show Bride & Groom Illustrations” checkbox, defaulting to true in the application when the saved value is absent. Persist explicit false in the existing invitation form data. When false, hide all marked bride/groom illustrations and their wrappers or leftover spacing, while retaining section text. Restore them when true. |
| **Start-Time Calendar** | Label calendar actions “Add to calendar”. Generate each event from the current invitation details, including its start date, time, time-zone offset, title, and venue. Do not add an assumed end time or duration. Live-preview actions must use the latest edited details. |
| **Family Layout** | In the welcome/family section, show `Groom & Bride` on one line when both family fields are empty or whitespace-only. When either field is filled, stack groom, ampersand, and bride, with each person's family details below their name. Apply Names Fit for long names, including stacking an oversized combined line and shrinking both names equally when necessary. Recalculate during live edits. |
| **Card Content Fit** | Bound the entire event text and links inside the artwork's plain area. Use character limits of 40 for event titles, 60 for venue names, and 100 for addresses, including spaces. Reduce fonts and spacing within readable limits; reserve room for dates, times, and links. If the minimum still does not fit, grow the card while preserving decorative clearance. Recalculate after fonts load, resizing, and live edits. Do not clip or truncate rendered text. |

Example requests: “Apply Names Fit to Bloom's opening”, “Apply Safe Text Area to Secret Garden's celebration cards”, or “Apply Family Under Name to Majestic's welcome”. These are project instructions, not implemented global switches; apply the necessary source changes when requested.

## Scope reminders

- Removing a design from the landing page does not authorize deleting its route, component, or assets.
- User declined bulk unused-asset cleanup; do not resume it unprompted.
- Template screenshots should represent the real opening screen. Preserve functional live previews.
- Source edits, builds, commits, and deployments are separate actions. Report only what actually happened.

# Wedding invitation project context

Last updated: 2026-10-17. These notes describe work established in the conversation, not a fresh repository audit.

## Project and local workflow

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
- On narrow screens the phone preview follows the collection; selecting a template scrolls to it.
- Gulabi Mandap (17) and Ivory Arch (15) were removed from the landing collection only. Their routes and assets were not deleted.
- Design 14's collection title is **A Timeless Union**, not “Arjun & Bhavana · A Timeless Union”.
- Design 14 and Design 13 use captured opening-screen thumbnails, not couple photographs.
- The sort dropdown uses a custom chevron anchored to the right.

Current active collection (the only designs to offer for new orders): Mohad & Rahma, Majestic, A Timeless Union, Mandap at Dusk, Secret Garden, Embroidered Garden, Bloom, The Artful Love Story. All other designs are deprecated for current use. Keep their existing code, routes, and assets; do not offer them for new orders or remove them unless asked.

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
| 6 | Majestic | `src/pages/Design6.tsx` iframe wrapper; `public/design6/` |
| 7 | Bloom | `src/pages/Design7.tsx` iframe wrapper; `public/design7/` |
| 11 | Design 11 | `src/pages/Design11.tsx`, `src/pages/Design11.css` |
| 13 | The Artful Love Story | `src/pages/Design13.tsx` iframe wrapper; `public/design13/index.html`, `local-runtime.js`, assets |
| 14 | A Timeless Union / Arjun & Bhavana | Native React: `src/pages/Design14.tsx`, `src/pages/design14/`; assets remain in `public/design14/assets/` |
| 15 | Ivory Arch | `src/pages/Design15.tsx`, `Design15.css`; removed from landing only |
| 16 | Sacred Mandap | `src/pages/Design16.tsx`, `Design16.css`; `public/design16/` |
| 17 | Gulabi Mandap | `src/pages/Design17.tsx`, `Design17.css`; removed from landing only |
| 18 | Mandap at Dusk | `src/pages/Design18.tsx`, `Design18.css`; `public/design18/` |
| Named route | Mohad & Rahma | `src/pages/MohadRahma.tsx`, `MohadRahma.css`; `/mohadrahma`; order invitations also render through this dedicated component |

Standalone iframe designs commonly use `index.html`, `interactions.js`, `interactions.css`, and `reference.css` inside their public directory. Some files contain very long minified lines; inspect targeted portions rather than dumping the whole file.

## Order dashboard and Supabase

- Client dashboard opens on Overview, with a wedding-art hero, order metrics and status breakdown, recent orders, and a popular templates strip. The catalogue, orders, and settings remain separate tabs.
- The client order catalog is limited to the eight landing designs (Mohad & Rahma, Majestic, A Timeless Union, Mandap at Dusk, Secret Garden, Embroidered Garden, Bloom, The Artful Love Story).
- Apply `supabase/migrations/202610170001_selected_order_templates.sql` after the dashboard schema migration to align existing Supabase projects. The base migration also seeds this catalog for fresh setups.
- New orders start with Mohad & Rahma's couple and event details as editable defaults; clients still choose the design for each order.
- Client Settings lets each company configure its own template price, sale type (none, percentage, or fixed), discount value, and premium flag. These values live in `company_template_settings`; apply `supabase/migrations/202610180001_company_template_settings.sql` after the dashboard schema migration.
- After order submission, clients see the generated `/{order-id}/{groombride}` URL and can publish the order immediately. The public route uses the existing `get_published_invitation` lookup; apply `supabase/migrations/202610180002_client_order_publishing.sql` to enable company-scoped publishing through its security-definer function.

## Design 14

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

- Full content/styling was copied from Design 16, while retaining a separate Design 18 component and CSS namespace (`d18-`). Some shared artwork correctly uses `/design16/` asset paths.
- **Preserve Design 18's original curtain video**: `/design18/entry.mp4`, poster `/design18/entry-poster.jpg`. Do not replace these with Design 16's video.
- Opening button artwork: `/design18/open-invitation-button.png`.
- Button overlays the curtain, starts the existing opening experience, and fades out after tapping. It remains mounted during the opacity transition and becomes disabled/non-interactive.
- Scrolling is available while the video plays. Decorative video has `pointer-events: none`; the entry allows vertical pan gestures.

## Other established design decisions

- Secret Garden: framed venue photo, Transport, Gifts, and RSVP removed. Venue details use Majestic's `/design6/assets/ornate-badge-2PyCLI0e.png`; Google Maps and Calendar sit below the frame, side by side.
- Majestic: Gifts and RSVP removed. Hero video should autoplay; introductory envelope video is skipped.
- Embroidered Garden: Recovery Day, Gifts, and RSVP removed.
- Bloom: uses `/design7/assets/intro-video-2-a-H3NxSy.mp4`; first envelope video was removed from use. Scrolling unlocks immediately after tapping, without waiting for the video to finish.
- Bloom dashboard and published order invitations are personalized in `src/invitations/AnimatedInvitation.tsx`. The welcome section reuses `public/design7/index.html`'s actual `#welcome` markup, fonts, spacing, and floral artwork, with the entered names/message/date and a pink `&`. Keep it outside `.atelier-personal` to avoid generic typography overrides; do not recreate it with separate approximate styles.
- Bloom's main wedding celebration also reuses Design 7's native `#wedding-events` section outside `.atelier-personal`, directly after the welcome. Its heading comes from the entered wedding celebration name; venue, date/time, address, map link, and calendar use that event's details. Preserve the original frame and typography.
- Bloom's first wedding celebration card retains its original image. Additional cards use `/design7/assets/hum.mov`, muted and looping, at its intrinsic aspect ratio (`width:100%; height:auto`) with event text overlaid in the same grid cell. Preserve the full video frame without cropping, stretching, or forcing a fixed card height.
- Bloom ends with the original RSVP layout restored in `public/design7/rsvp.html`, followed by Design 7's checkered closing names/date card and WhatsApp contact. Both sit outside `.atelier-personal`. Published order RSVPs use `src/invitations/rsvp.ts` and the `submit_order_rsvp` RPC; browser storage remembers the form and a per-order submission token for updates. Dashboard/sample previews cannot submit. Apply `supabase/migrations/202610180003_order_rsvps.sql` to create `order_rsvps` and return `orderId` from `get_published_invitation`. Replies store name, attendance, guest count, additional names, message, and timestamps against the order; only the owning company and admins can read them. The Wedding Day Programme is hidden; entered dress code, gift, and gallery notes retain their existing presentation before RSVP.
- Secret Garden, Majestic, and Bloom ending credits were replaced with invitation contact text and a WhatsApp icon.
- Design 13: optimized responsive WebP assets in `public/design13/assets/optimized/`; opening temple parallax multiplier was reduced to 0.5. Preserve original source assets.

## Shared music and contact behaviour

- `public/media-visibility.js` pauses playing audio/unmuted media when the browser/app goes into the background and resumes previously playing media when visible, subject to browser autoplay rules.
- It is included in app HTML entries and standalone public design pages. Preserve user-muted/paused state.
- Contact number: +91 7975948093. Visible contact links should show the WhatsApp icon, not the number.
- Prefilled message: `Hey I need an invitation!`
- Link: `https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21`.

## Scope reminders

- Removing a design from the landing page does not authorize deleting its route, component, or assets.
- User declined bulk unused-asset cleanup; do not resume it unprompted.
- Template screenshots should represent the real opening screen. Preserve functional live previews.
- Source edits, builds, commits, and deployments are separate actions. Report only what actually happened.

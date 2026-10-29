# To do

- [ ] Revamp the invitation management dashboard, organized by order.
- [ ] Review `ClientDashboard.tsx` and reduce its responsibilities by extracting focused components and logic; break up the very long lines.
- [ ] Redesign the Review Order and Publish Order flows.
  - Keep all text fully visible in clearly sized text areas; avoid truncating content.
- [ ] Complete the WhatsApp integration.
- [ ] Optimize PDF extraction.
- [ ] Fix text sizing so text is consistently readable and fully visible.
- [ ] Support bride-side invitations across all designs, including “Bride weds Groom” name ordering.
- [ ] Fix missing Bloom and The Artful Love Story thumbnails in the Settings tab.
  - **Where:** `TemplateSettingsPanel` in `src/pages/ClientDashboard.tsx` (~line 679). The `.setting-art-wrap` element uses a bare `<img src={template.thumbnail_url}>`. Bloom (id 7) and The Artful Love Story (id 8) have no `thumbnail_url` from the catalog, so their cards render a broken image.
  - **Fix:** Mirror the media logic already used in the Templates tab cards (~line 491): check `TEMPLATE_INTRO_VIDEOS[id]` first (renders a `<video>`), then fall back to `TEMPLATE_THUMBNAIL_OVERRIDES[id] ?? TEMPLATE_INTRO_IMAGES[id] ?? template.thumbnail_url`. All three maps are already imported from `src/lib/templateCardData.ts`.
  - **CSS:** In `src/pages/ClientDashboard.css`, update `.setting-art-wrap` to handle both `<img>` and `<video>` children (object-fit, sizing). The Templates tab's `.client-selected-thumb` styles are the reference.

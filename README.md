# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Design 5 — Secret Garden

- Route: `/design5` (the standalone invitation is `/design5/index.html`).
- Reference: https://www.thedigitalyes.com/demo/secret-garden
- Content: `public/design5/index.html`; layout: `reference.css`; local behavior and overrides: `interactions.js` and `interactions.css`.
- Artwork, fonts, video, and music are served locally from `public/design5/assets/`. The reference application's scripts and backend are not loaded.
- The curtain opens on tap or keyboard activation. Music starts on that gesture and has one mute control. Reduced motion skips the opening animation.
- RSVP supports attendance, guest count, a message, validation, saving, and updating on the current device. It explicitly identifies itself as a demo; **responses are not sent to the couple**. Connect a production RSVP endpoint before collecting guest replies.
- To personalize, change the names, date, venue and programme in `index.html`, the countdown/calendar event in `interactions.js`, and the page title in `src/pages/Design5.tsx`. The reference date is October 3, 2026, so its countdown displays zero after that date.
- Run `npm run build` and publish the **contents of `dist`**, not the source folder or `node_modules`. Hosting must provide SPA routing for `/design5`; the standalone `/design5/index.html` also works directly.

## Design 6 — Majestic

- Route: `/design6`; standalone invitation: `/design6/index.html`.
- Reference: https://www.thedigitalyes.com/demo/majestic
- Content lives in `public/design6/index.html`. `reference.css` and `fonts.css` provide the design; `interactions.css` and `interactions.js` provide local behavior. Artwork, videos, music and fonts are in `public/design6/assets/`.
- Includes the pearl envelope opening, looping chandelier and garden scene, music control, countdown, venue directions, calendar download, programme, dress code, gift panels, and RSVP with adult/child companions, allergies, transport, accommodation and song requests.
- RSVP saves and updates on the current device only. A backend is required to collect real guest replies. No reference payment or bank details are reused; the bank panel directs guests to contact the couple.
- Personalize the invitation text in `index.html`, the countdown/calendar in `interactions.js`, and the page title in `src/pages/Design6.tsx`. Demo event: September 18, 2027, 17:00 in Italy.
- Opening works by tap or keyboard; reduced motion skips the opening video and keeps the hero still. Video playback failure falls back to the invitation.

## Design 7 — Bloom

- Route: `/design7`; standalone invitation: `/design7/index.html`.
- Reference: https://www.thedigitalyes.com/demo/bloom
- Content: `public/design7/index.html`; design styles: `reference.css` and `fonts.css`; local interactions and overrides: `interactions.js` and `interactions.css`.
- Includes both opening videos, background music, floral frames, countdown, welcome, venue, dress code, programme, expandable story, photo gallery, welcome evening, transport, accommodation and RSVP. All media and fonts are served locally from `public/design7/assets/`.
- RSVP validates names and transport preferences, supports 1–10 guests with individual name fields, and saves/updates on the current device only. Connect a backend before collecting real guest replies.
- Update the names, date, venues, travel information, story and hotel details in `index.html`; update countdown, map and calendar data in `interactions.js`; update the title in `src/pages/Design7.tsx`. The sample wedding date is September 27, 2026, so the countdown shows zero after that date.
- Reduced motion skips the opening and stops gallery autoplay. The gallery supports touch scrolling, mouse dragging, keyboard scrolling, and a pause control.

## Design 8 — Noor · A Courtyard in Bloom

An original Muslim wedding concept at `/design8`, created independently of the reference templates. No reference template code, layout, artwork, or video is used.

- Implementation: `src/pages/Design8.tsx` and `src/pages/Design8.css`.
- Bespoke AI-generated watercolor artwork: `public/design8/courtyard.png`. Original SVG jasmine sprigs and geometric details are authored in the component.
- Includes CSS lattice-door opening, Bismillah, family introduction, countdown, Nikah itinerary, venue map, attire and guest notes, and RSVP. No video or background audio.
- Sample couple: Aaliyah Ahmed & Zayaan Khan. Sample event: February 12, 2027, Hyderabad. The names, family details, schedule, location and RSVP deadline are editable in `Design8.tsx`; the countdown uses `EVENT`, and the map link uses `MAP`.
- RSVP is explicitly a local preview: replies save/update on the current device only. Connect a backend to receive guest responses.
- Supports keyboard opening, accessible form labels, reduced motion, smooth section navigation and mobile shortcuts.
- Production build: `npm run build`. Publish `dist` with SPA fallback routing.

### Noor visual refinement

Design 8 now includes custom SVG illustrations for the welcome drinks, Nikah arch and lantern-lit reception; arched itinerary panels; ornamental hero corners; framed family introduction; medallion countdown; a new original moonlit garden artwork (`public/design8/moonlit-garden.png`); an overlapping venue card; and layered RSVP stationery. Both watercolor images are imagined artwork, not documentary photographs of the named sample venue. No video is used.


### Noor venue photo update

The displayed venue image now uses a real photograph of Falaknuma Palace: **The hotel rooms around the courtyard**, by **Tijl Vercaemer**, licensed **CC BY 2.0**. Local asset: `public/design8/falaknuma-courtyard.jpg`. Source: https://commons.wikimedia.org/wiki/File:The_hotel_rooms_around_the_courtyard_(9918844916).jpg . License: https://creativecommons.org/licenses/by/2.0/ . The image is displayed with a responsive crop and a separate gradient overlay; attribution is linked in the venue section. The earlier moonlit illustration is no longer displayed.

## Mohad & Rahma

- Route: `/mohadrahma`.
- Uses Design 2's Royal Grace styling, opening video, music, flower trail and heart date reveal.
- Content source: https://mohad-rahma-wedding.fly.dev . Includes all five events (December 17–24, 2026), original directions, calendar links, and the original gallery.
- Main wedding countdown: December 20, 2026 at 11:00 AM IST.
- Page: `src/pages/MohadRahma.tsx`; scoped event styles: `src/pages/MohadRahma.css`. Edit event details in its `events` array.
- `HeartDateReveal` accepts optional date/day/time props; Design 2 retains its existing default details.
- The original gallery and calendar endpoints remain hosted on the source website. No sample RSVP, unrelated venue image, or invented dress/gift rules are included on this page.

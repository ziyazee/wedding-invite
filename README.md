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
- The invitation starts on the open garden still, with editable names and a separate music control.
- RSVP supports attendance, guest count, a message, validation, saving, and updating on the current device. It explicitly identifies itself as a demo; **responses are not sent to the couple**. Connect a production RSVP endpoint before collecting guest replies.
- To personalize, change the names, date, venue and programme in `index.html`, the countdown/calendar event in `interactions.js`, and the page title in `src/pages/Design5.tsx`. The reference date is October 3, 2026, so its countdown displays zero after that date.
- Run `npm run build` and publish the **contents of `dist`**, not the source folder or `node_modules`. Hosting must provide SPA routing for `/design5`; the standalone `/design5/index.html` also works directly.

## Design 6 — Majestic

- Route: `/design6`; standalone invitation: `/design6/index.html`.
- Reference: https://www.thedigitalyes.com/demo/majestic
- Content lives in `public/design6/index.html`. `reference.css` and `fonts.css` provide the design; `interactions.css` and `interactions.js` provide local behavior. Artwork, videos, music and fonts are in `public/design6/assets/`.
- Includes a looping chandelier and garden scene, music control, countdown, venue directions, calendar download, programme, dress code, gift panels, and RSVP with adult/child companions, allergies, transport, accommodation and song requests.
- RSVP saves and updates on the current device only. A backend is required to collect real guest replies. No reference payment or bank details are reused; the bank panel directs guests to contact the couple.
- Personalize the invitation text in `index.html`, the countdown/calendar in `interactions.js`, and the page title in `src/pages/Design6.tsx`. Demo event: September 18, 2027, 17:00 in Italy.
- The invitation is immediately visible. Reduced motion keeps the decorative hero still.

## Design 7 — Bloom

- Route: `/design7`; standalone invitation: `/design7/index.html`.
- Reference: https://www.thedigitalyes.com/demo/bloom
- Content: `public/design7/index.html`; design styles: `reference.css` and `fonts.css`; local interactions and overrides: `interactions.js` and `interactions.css`.
- Includes background music, floral frames, countdown, welcome, venue, dress code, programme, expandable story, photo gallery, welcome evening, transport, accommodation and RSVP. All media and fonts are served locally from `public/design7/assets/`.
- RSVP validates names and transport preferences, supports 1–10 guests with individual name fields, and saves/updates on the current device only. Connect a backend before collecting real guest replies.
- Update the names, date, venues, travel information, story and hotel details in `index.html`; update countdown, map and calendar data in `interactions.js`; update the title in `src/pages/Design7.tsx`. The sample wedding date is September 27, 2026, so the countdown shows zero after that date.
- Reduced motion stops gallery autoplay. The gallery supports touch scrolling, mouse dragging, keyboard scrolling, and a pause control.

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

## Royal Grace

- Route: `/royal-grace`.
- Sage and ivory stationery with pearls and delicate botanical relief.
- Page: `src/pages/RoyalGrace.tsx`; scoped event styles: `src/pages/RoyalGrace.css`.
- `HeartDateReveal` accepts optional date/day/time props.
- `/mohadrahma` redirects to `/royal-grace`.

## Invitation dashboard

Open `/dashboard` to choose from all eight designs, enter the couple's names, wedding date/time, venue, map link, additional celebrations, family details, and optional notes/music/gallery links. The home page's buttons now lead here.

Submitting creates a groom-first URL such as `/ahmedsara`. Existing names and built-in routes are never overwritten: a suffix is added when necessary. `/royal-grace` and the remaining demo routes retain their existing content. `/newDesign` (Sacred Romance) is retired and redirects to `/dashboard`. It cannot be selected for new invitations; existing saved invitations using it remain supported.

### Local use

Run `npm run dev -- --host 0.0.0.0`. The Vite API stores records in `.invitation-data/invitations.json`, which is ignored by Git. Records survive browser refreshes and server restarts. A second device reaching the same server can open the same invitation URL; creation does not rely on browser-local invitation storage. The dashboard's recent-invitations list is a browser-local shortcut list.

The built static files alone cannot create or retrieve records. `vite preview` does not run the development API. Use Vite development for local creation, or deploy the Pages Functions and database below.

### Cloudflare Pages storage

The `functions/api/invitations/` endpoints use a D1 binding named `INVITATIONS_DB`. Database binding setup follows [Cloudflare Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/).

1. Create the database: `npx wrangler d1 create wedding-invitations`.
2. Copy `wrangler.example.toml` to `wrangler.toml`, set your Pages project name, and insert the returned database ID.
3. Initialize storage: `npx wrangler d1 execute wedding-invitations --remote --file=server/schema.sql`.
4. Run `npm run build`.
5. From this project directory, deploy the site and Functions with `npx wrangler pages deploy dist`.

These steps require your Cloudflare account; no database has been created and no deployment has been performed by this change. Local records are not automatically copied into D1. Keep a backup of `.invitation-data` if you need to migrate local invitations.

The SPA fallback is in `public/_redirects`; API Functions are scoped using `public/_routes.json`. See [Pages routing](https://developers.cloudflare.com/pages/functions/routing/) and [Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/).

### Template personalization

- Designs 1, 2, 4, 8, and 9 consume the shared invitation context in React. Design 2 uses the refined Royal Grace celebration cards.
- Designs 3, 5, 6, and 7 retain their typography, artwork, scroll effects and countdown; their video opening gates have been removed. Their generated versions replace demo-only body sections with personalized welcome, event stationery, and optional notes. Original demo URLs are unchanged.
- Dates and calendar downloads use the event's explicit UTC offset; select the offset applicable on the wedding date.
- External music/gallery/map links must use HTTP(S). Music starts after a guest gesture when the browser allows it.
- Names or initials baked into videos and images are artwork; changing text fields cannot rewrite those media pixels.
- Generated invitations do not offer the demos' local-only RSVP forms. There is no guest-response collection endpoint in this dashboard.
- The original invitation builder at `/dashboard` remains a direct invitation creation flow and has no account system. Partner order accounts are separate at `/login` and use the client/admin dashboards below.

### Design 9 — Sunehri · The Golden Veil

Preview `/design9`, or select it in `/dashboard` to create a personalized invitation.

`public/design9/curtain-portrait.mp4` is a centered 1080 × 1920 crop of the supplied curtain video. The complete 10.005-second duration and original audio track are preserved in the MP4. The MP4 is retained as an export asset. The website now opens directly on the final arch still with editable names and a separate music control.

### Editable first screens

Video opening scenes are removed from designs 2, 3, 5, 6, 7, and 9, including `/royal-grace` and generated invitations. These designs immediately display their invitation content without downloading the opening video. Decorative background video in Majestic is retained. Designs 4 and 8 retain their code-driven openings. Archived video files remain on disk.

### Customer creation experience — `/create`

A single-page Royal Grace form collects groom full name, bride full name, wedding date and time (IST), and venue location. A + button adds optional events with their name, date, time, and location. There are no extra steps or preview panels.

Submission saves a Royal Grace application through `POST /api/applications/`. It does not create an invitation or public URL. The customer sees a receipt reference. Applications are separate from the invitation catalog and dashboard history.

### Cloudflare application storage

Applications use the same `INVITATIONS_DB` D1 binding, in a separate `applications` table. Names, wedding date, submission time and status are indexed/queryable fields; the full details including additional events are stored as JSON in `payload`. The public endpoint only accepts submissions and does not list or return customer details.

1. If not already created, run `npx wrangler d1 create wedding-invitations`.
2. Copy `wrangler.example.toml` to `wrangler.toml` if needed and fill in the returned database ID (keep your existing configuration if already set up).
3. Create the applications table: `npx wrangler d1 execute wedding-invitations --remote --file=server/applications.sql`.
4. Run `npm run build`, then deploy from this project directory using `npx wrangler pages deploy dist` so Pages Functions are included.

Use Cloudflare’s D1 dashboard console to review applications:

```sql
SELECT id, created_at, status, groom, bride, wedding_date, payload
FROM applications
ORDER BY created_at DESC;
```

Locally, Vite stores submissions as individual JSON files in `.invitation-data/applications/` (gitignored). Local applications are not automatically copied to D1. The separate Royal Grace applications queue still has no review screen or notification delivery. The public submission endpoint validates data but has no CAPTCHA or submission rate limiter yet.

### Design 10 — Yasmin · An Ivory Beginning

Preview `/design10`. Uses the complete portrait `public/video2.mp4` as a tap-to-play opening, with a skip control, reduced-motion fallback and a final-frame still. Names remain editable HTML. Includes ivory-and-sage celebration stationery, directions, music, and scroll reveals. Available in the dashboard and personalized invitation renderer. The `/create` application flow remains Royal Grace.

### Featured sample invitations

Five source-backed invitation examples are available without API/database setup. Their names, dates, and venues are fictional demonstration content. Each page uses its selected design and includes ceremony details appropriate to the sample couple.

- Hindu: `/arjunmeera` (Embroidered Garden), `/rohankavya` (Secret Garden), `/vikramananya` (Royal Grace).
- Christian: `/aarongrace` (Majestic), `/danielsarah` (Bloom).

Sample details are maintained in `src/invitations/showcase.ts`. These routes are reserved so invitation creation cannot overwrite them.

## Client and admin order dashboards

The partner sign-in is `/login`. Enter the account email as the username. Supabase Auth verifies the password. The app matches client accounts to `companies.email` and sends them to `/client/dashboard`; trusted Auth `app_metadata.role = 'ADMIN'` sends studio administrators to `/admin/dashboard`. Both dashboards check access, and database RLS policies enforce company and admin access for order queries and updates.

### Supabase setup

Apply `supabase/migrations/202610150001_dashboard_orders.sql`, `supabase/migrations/202610170001_selected_order_templates.sql`, `supabase/migrations/202610180001_company_template_settings.sql`, and `supabase/migrations/202610180002_client_order_publishing.sql` to the Supabase project. They create companies, the selected eight-design order catalog, orders, role checks, RLS policies, and the public published-invitation lookup and company publishing functions. The order form starts with sample couple and event details as editable defaults; submitted details are saved with each order. Clients can publish their own new order immediately from the confirmation dialog.

Configure the existing public client environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the latter accepts a Supabase publishable key). Do not put a service-role key in browser configuration. Create user accounts in Supabase Auth. For a client, use the same email on the Auth user and company row; the company email is unique and determines which orders the user can see. For an admin, assign the role only through trusted SQL or a server process because browser users must not be allowed to edit Auth `app_metadata`.

```sql
-- Create a company whose email matches the client's Supabase Auth email.
insert into public.companies (company_name, email)
values ('Client company name', 'client@example.com');

-- For an admin, set only the role (replace with the Auth user's UUID).
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"ADMIN"}'::jsonb
where id = 'ADMIN-AUTH-USER-UUID'::uuid;
```

Assign `ADMIN` only through the trusted Supabase SQL editor or a trusted server process. After changing `app_metadata`, have the user sign out and back in so their JWT receives the updated claim. The app does not provide self-service role changes. Published dashboard orders use `/{orderNumber}/{groombrideName}` and are looked up through `get_published_invitation`; only rows with `READY` status are returned to public visitors. Existing D1/local invitations continue to use their existing storage routes.

The new dashboards require the Supabase migration and Auth accounts to be configured before use. Apply `supabase/migrations/202610200001_order_management_links.sql` after `202610180003_order_rsvps.sql` to add per-order mobile management links for editing invitation details and reading RSVP responses. Anyone holding a management link can access that order, so share it privately. No Supabase schema changes or deployment are applied automatically by the frontend.


### Design 14 — Arjun & Bhavana

`/arjunbhavana` is a native React invitation. The earlier `/design14` and
`/design14/index.html` URLs redirect to it. Artwork and music remain under
`public/design14/assets/`.

- `src/pages/Design14.tsx`: invitation entry, music, names, and page lifecycle.
- `src/pages/design14/Design14Scenes.tsx`: original scene markup converted to JSX,
  including the four celebration cards and closing message.
- `src/pages/design14/Design14.css`: preserved layout, typography, and animation
  styles, scoped to the mounted invitation.
- `src/pages/design14/useDesign14Motion.ts`: scene motion and reveal effects.
- `src/pages/design14/useDesign14Carousel.ts`: carousel autoplay, dragging,
  keyboard controls, and lifecycle cleanup.
- `arjunbhavana.html` and `src/arjunbhavana.tsx`: dedicated React entry with static
  social metadata, built alongside the main application by Vite.

The public page renders the invitation directly, without an iframe. The landing
page still uses its existing phone preview frame. The invitation retains the
opening music gesture, paused clouds and locked scrolling before opening, slow
name reveal, original artwork, event details, and responsive dimensions. Shared
invitation context still supplies custom names/music; legacy name/music query
parameters are also accepted. Timers, listeners, observers, and music are cleaned
up when the component unmounts.

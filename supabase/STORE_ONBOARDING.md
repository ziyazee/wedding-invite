# Store onboarding

Open **Admin dashboard → Companies → New store**. The four steps collect store
identity, branding, collection/pricing, and review. Submitting creates the company,
its allowed catalogue and prices, uploads branding, prepares an owner account,
and returns a single-use password setup link. The admin copies and shares that
link; this implementation does not send an email.

## Deployment requirements

1. Apply the existing company/catalogue migrations, including
   `202610300001_multi_store_landing.sql`, `202611010001_admin_company_activity.sql`
   and the two company-branding migrations, then
   `202611030003_store_onboarding.sql`. Apply this migration before releasing the
   updated frontend: company reads now include its new columns.
2. Deploy the `onboard-store` Supabase Edge Function, including
   `functions/_shared/storeOnboarding.ts`. It uses the platform-provided
   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` on the server.
   Never place the service-role key in a `VITE_` variable.
3. Set the function secret `STORE_APP_URL` to the main application origin. It
   defaults to `https://www.shaadiinvites.in`. For local account-setup checks use
   `http://localhost:5173` and deploy the function to a development project.
4. In Supabase Auth URL Configuration, allow the exact callback
   `https://www.shaadiinvites.in/account/setup`, or the corresponding development
   URL. The frontend includes that route. Without an allowed callback, Supabase
   can redirect to its configured Site URL instead.
5. Existing wildcard DNS and hosting for `*.shaadiinvites.in` must point to this
   application. The flow reserves a hostname in the database; it does not change
   DNS or hosting settings.

No migration, deployment, account creation, or live onboarding verification was
performed while implementing this feature.

## Behaviour and recovery

- Only authenticated users with server-managed `app_metadata.role = ADMIN` can
  provision stores. The privileged provisioning RPCs are service-role-only.
- Logo is required; banner, tagline and custom colour are optional (a default
  colour is supplied). PNG/JPEG/WebP uploads are resized in the browser and sent
  as PNG. The server checks size, signature and dimensions. Files are stored in
  the public `store-branding` bucket, with no client write policy.
- Asset filenames remain `company-logos/{slug}.png` and `landing/{slug}.png`.
  New stores use their Supabase Storage base URL. Existing stores with no
  `branding_base_url` continue to use repository assets at the same paths.
- A setup UUID reserves the company/email/address and catalogue transactionally.
  Completed uploads are recorded. Partial setups stay private and can be resumed
  from **Recent store setups** without duplicating the company. Details are frozen
  after reservation; this first version does not include editing or deleting a
  reserved store. Before reservation, Back lets the admin correct all fields.
- New stores default to a private storefront. The review checkbox can publish it
  after setup. Completed private stores can be published later; public stores can
  be made private. Visibility affects the storefront, not the owner’s dashboard
  or previously published wedding invitations.
- New stores see only selected templates in the storefront and dashboard. The
  database rejects creating orders outside that collection. Existing stores keep
  their existing catalogue behaviour. Existing orders can still be edited.
- Store and invitation hostname writes share a transaction lock and reject
  collisions; reserved hostnames are also rejected. Email uniqueness is enforced
  by the existing companies index. Existing unlinked non-admin Auth accounts can
  be linked to a new store without changing their password or role.
- Setup links are never saved in the database or browser storage. A failed or
  expired link can be replaced with **New owner setup link**. Link creation uses
  an invite for a new user and recovery for an existing user; existing passwords
  are not changed until the owner completes the setup page.
- The list shows the 50 most recent setups. Incomplete reservations appear in
  the company activity list too, but their storefront remains private.

## Verification still required

Run the build/type checks and exercise onboarding against a development database
before release. In particular, verify:

- A non-admin cannot invoke provisioning RPCs, upload branding, or enable a store.
- A new store with a logo and selected templates can be created as a private
  draft, resumed after an interrupted upload, and published once complete.
- Two simultaneous requests for the same store/invitation hostname cannot both
  claim it; duplicate owner emails are rejected without creating partial rows.
- An owner setup link opens `/account/setup`, sets a password and reaches the
  correct company dashboard; expired links can be regenerated.
- Selected prices, discounts, premium badges, optional banner and logo appear
  in the storefront. Published wedding footers use the uploaded slug-based logo.
- A direct order insert outside a restricted collection fails, while existing
  stores and orders continue to work.

API references: [Supabase generateLink](https://supabase.com/docs/reference/javascript/auth-admin-generatelink),
[Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), and
[Storage uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads).

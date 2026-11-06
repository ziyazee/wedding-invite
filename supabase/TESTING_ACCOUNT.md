# Testing Account

Convert the existing login `ziyamohd123@gmail.com` into the single Testing Account.
Keep its existing company name, login, password, and settings.

Testing Account creates orders in `public.test_order`. Its integer identity starts
at 1 and uses its own sequence. The existing `orders.id` and regular dashboard
numbering are unchanged. No separate display numbers are used.

## Activate

1. Apply `migrations/202611070001_test_order.sql` after the existing migrations.
2. Release the updated frontend, then run `setup_testing_account.sql` in the
   intended Supabase project's SQL Editor.
3. The setup updates only the existing company's `is_test_account` flag. If the
   email is not linked to a company, it stops instead of creating anything. A
   unique index prevents a second company from being marked as a test account.
4. Close old dashboard tabs, sign in again, and open `/client/dashboard`.

No company or Auth user is created. Existing branding, template access, active
status, storefront settings, password, and Auth role are preserved. Existing
orders stay in `orders`; this setup neither deletes nor moves them. After
conversion, this account's client order list shows its new test orders; its old
normal orders remain accessible through the regular admin dashboard and their
existing management links.

## Behavior

- Creating, listing, editing, publishing, and realtime updates use `test_order`
  for companies marked `is_test_account`. The flag is managed by administrators.
- Test invitations use `/test-invite/{couple}-{id}`; their management links start
  with `test-`. They support the normal invitation renderer and management page.
- Guest replies use `test_order_rsvps` so overlapping live/test IDs cannot mix
  responses. Browser RSVP storage also distinguishes test IDs.
- Regular admin order lists, order counts, and order revenue continue to read
  only `orders`. Test orders are managed through the Testing Account dashboard.
- Normal test creation never inserts into `orders` or consumes its sequence.
  An insert policy rejects stale/direct attempts to put a test account's order
  into `orders`; like other failed identity inserts, those rejected attempts can
  still consume an ID. Use the updated frontend and close old tabs before testing.
- `TRUNCATE orders RESTART IDENTITY` affects regular orders only. Resetting test
  data requires separately truncating `test_order_rsvps` and `test_order` with
  `RESTART IDENTITY`. Neither reset is performed by this setup.
- Future order schema changes must consider `test_order` too; it is an independent
  table, not a view or inherited table.

No migration, account creation, deployment, build, tests, or browser checks were
performed. Supabase administrator access is required to activate this setup.

The identity copy creates an independent sequence; see
[PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html).

-- Published client orders use /{order_number}/{couple_name} URLs.
-- Keep legacy one-segment invitation paths valid during the transition.
alter table public.orders
  drop constraint if exists published_path_format;

alter table public.orders
  add constraint published_path_format
  check (
    published_path is null
    or published_path ~ '^([a-z0-9]{1,80}|[0-9]+/[a-z0-9]{1,80})$'
  );

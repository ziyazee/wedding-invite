-- Management links already shared with clients live on public.orders.
-- couple_orders created later (configure_order_invitations) got a freshly
-- generated management_id, so the shared link returned null from
-- get_order_management. Reuse the legacy order's link whenever one exists.
set search_path = public, extensions;
begin;

create or replace function public.couple_order_management_id()
returns trigger
language plpgsql
set search_path = public, extensions
as $$
begin
  if new.management_id is null and new.legacy_order_id is not null then
    select o.management_id into new.management_id
    from public.orders o
    where o.id = new.legacy_order_id;
  end if;
  if new.management_id is null then
    new.management_id := new.id::text || '-' ||
      translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_');
  end if;
  return new;
end;
$$;

drop trigger if exists couple_orders_assign_management_id on public.couple_orders;
create trigger couple_orders_assign_management_id
before insert on public.couple_orders
for each row execute function public.couple_order_management_id();

-- Repair existing rows (e.g. orders 12 and 14) so shared links work again.
update public.couple_orders c
set management_id = o.management_id
from public.orders o
where o.id = c.legacy_order_id
  and c.management_id is distinct from o.management_id;

commit;

-- Allow studio admins to delete an individual regular order.
-- order_rsvps.order_id already cascades on delete; identity counters are unchanged.
begin;

drop policy if exists "admins delete orders" on public.orders;
create policy "admins delete orders" on public.orders
for delete to authenticated
using (public.current_user_is_admin());

grant delete on public.orders to authenticated;

commit;

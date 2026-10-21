-- Management URLs are bearer links. The order number is for identification;
-- the random suffix grants access to that order's details and RSVP responses.
set search_path = public, extensions;

alter table public.orders add column management_id text unique;

update public.orders
set management_id = id::text || '-' || translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_')
where management_id is null;

alter table public.orders alter column management_id set not null;

create or replace function public.assign_order_management_id()
returns trigger
language plpgsql
set search_path = public, extensions
as $$
begin
  if new.management_id is null then
    new.management_id := new.id::text || '-' || translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_');
  end if;
  return new;
end;
$$;

create trigger orders_assign_management_id
before insert on public.orders
for each row execute function public.assign_order_management_id();

create or replace function public.get_order_management(p_management_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'orderId', o.id::text,
    'managementId', o.management_id,
    'status', o.status,
    'details', o.form_data,
    'responses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'name', r.full_name,
        'attendance', r.attendance,
        'guestCount', r.guest_count,
        'additionalGuests', r.additional_guests,
        'message', r.message,
        'createdAt', r.created_at,
        'updatedAt', r.updated_at
      ) order by r.created_at desc)
      from public.order_rsvps r where r.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.orders o
  where o.management_id = p_management_id
  limit 1
$$;

create or replace function public.update_order_management(
  p_management_id text,
  p_form_data jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare updated_order public.orders%rowtype;
begin
  if jsonb_typeof(p_form_data) is distinct from 'object' then
    raise exception 'Invitation details are invalid.';
  end if;

  update public.orders
  set form_data = p_form_data,
      groom_name = p_form_data->>'groom',
      bride_name = p_form_data->>'bride'
  where management_id = p_management_id
  returning * into updated_order;

  if not found then
    raise exception 'This management link is invalid.';
  end if;

  return jsonb_build_object('saved', true, 'details', updated_order.form_data);
end;
$$;

revoke all on function public.get_order_management(text) from public;
revoke all on function public.update_order_management(text, jsonb) from public;
grant execute on function public.get_order_management(text) to anon, authenticated;
grant execute on function public.update_order_management(text, jsonb) to anon, authenticated;

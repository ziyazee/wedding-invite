-- Turn the existing management link into the couple's shared RSVP dashboard.
-- The foundation migration has already copied the legacy management IDs and
-- linked existing RSVP responses to their invitation rows.
begin;

alter table public.couple_orders add column management_id text;

update public.couple_orders c
set management_id = o.management_id
from public.orders o
where o.id = c.legacy_order_id
  and c.management_id is null;

create unique index couple_orders_management_id_key
  on public.couple_orders(management_id);

alter table public.couple_orders alter column management_id set not null;

drop trigger if exists couple_orders_assign_management_id on public.couple_orders;
create trigger couple_orders_assign_management_id before insert on public.couple_orders
for each row execute function public.assign_order_management_id();

create or replace function public.attribute_order_rsvp_to_invitation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.invitation_id is null and new.order_id is not null then
    select i.id into new.invitation_id
    from public.invitations i
    where i.legacy_order_id = new.order_id;
  end if;
  return new;
end;
$$;
revoke all on function public.attribute_order_rsvp_to_invitation() from public, anon, authenticated;
create trigger order_rsvps_attribute_invitation
before insert or update of order_id, invitation_id on public.order_rsvps
for each row execute function public.attribute_order_rsvp_to_invitation();

-- Keep existing management URLs valid. They now load the couple's primary
-- invitation details and aggregate RSVP responses from every linked invitation.
create or replace function public.get_order_management(p_management_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'orderId', coalesce(primary_invitation.legacy_order_id, c.id)::text,
    'coupleOrderId', c.id::text,
    'managementId', c.management_id,
    'status', primary_invitation.status,
    'details', primary_invitation.details,
    'responses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'name', r.full_name,
        'attendance', r.attendance,
        'guestCount', r.guest_count,
        'additionalGuests', r.additional_guests,
        'message', r.message,
        'createdAt', r.created_at,
        'updatedAt', r.updated_at,
        'invitationName', coalesce(nullif((
          select string_agg(items.event_item->>'title', ' + ' order by items.event_ordinal)
          from jsonb_array_elements(coalesce(
            coalesce(legacy_order.form_data, invitation.form_data)->'events', '[]'::jsonb
          )) with ordinality as items(event_item, event_ordinal)
        ), ''), 'Wedding invitation'),
        'invitationPath', invitation.published_path
      ) order by r.created_at desc)
      from public.order_rsvps r
      join public.invitations invitation
        on invitation.couple_order_id = c.id
       and (invitation.id = r.invitation_id
         or (r.invitation_id is null and invitation.legacy_order_id = r.order_id))
      left join public.orders legacy_order on legacy_order.id = invitation.legacy_order_id
    ), '[]'::jsonb)
  )
  from public.couple_orders c
  join lateral (
    select i.legacy_order_id, i.status,
      coalesce(o.form_data, i.form_data) as details
    from public.invitations i
    left join public.orders o on o.id = i.legacy_order_id
    where i.couple_order_id = c.id
    order by i.created_at, i.id
    limit 1
  ) primary_invitation on true
  where c.management_id = p_management_id
  limit 1
$$;
revoke all on function public.get_order_management(text) from public;
grant execute on function public.get_order_management(text) to anon, authenticated;

comment on column public.couple_orders.management_id is
  'Shared bearer management link for the couple order and all attached invitations.';

commit;

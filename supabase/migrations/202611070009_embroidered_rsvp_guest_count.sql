-- Supersedes 202611070008: safe whether that migration was already applied or not.
-- Embroidered Garden accepts positive integer guest counts, including 51.
-- Other templates keep their 10-person/name validation. Existing replies remain.
-- Requires the test-order migration; apply before the frontend update.
begin;

alter table public.order_rsvps
  drop constraint order_rsvp_guest_count_valid,
  add constraint order_rsvp_guest_count_valid check (
    (attendance = 'yes' and guest_count >= 1
      and (cardinality(additional_guests) = 0
        or (guest_count <= 10 and cardinality(additional_guests) = guest_count - 1)))
    or (attendance = 'no' and guest_count = 0 and cardinality(additional_guests) = 0)
  );

alter table public.test_order_rsvps
  drop constraint order_rsvp_guest_count_valid,
  add constraint order_rsvp_guest_count_valid check (
    (attendance = 'yes' and guest_count >= 1
      and (cardinality(additional_guests) = 0
        or (guest_count <= 10 and cardinality(additional_guests) = guest_count - 1)))
    or (attendance = 'no' and guest_count = 0 and cardinality(additional_guests) = 0)
  );

create or replace function public.submit_order_rsvp(
  p_order_id bigint,
  p_published_path text,
  p_submission_token uuid,
  p_full_name text,
  p_attendance text,
  p_guest_count integer,
  p_additional_guests text[],
  p_message text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare count_only boolean;
begin
  select coalesce(form_data->>'template' = '6', false) into count_only
  from public.orders
  where id = p_order_id and published_path = p_published_path
    and status = 'READY' and (expires_at is null or expires_at > now())
  for share;
  if not found then
    raise exception 'This invitation is no longer accepting replies.';
  end if;

  if p_submission_token is null then
    raise exception 'A reply token is required. Please reload the invitation.';
  end if;
  if p_full_name is null or length(btrim(p_full_name)) not between 1 and 120 then
    raise exception 'Please enter a full name of up to 120 characters.';
  end if;
  if p_attendance is null or p_attendance not in ('yes', 'no') then
    raise exception 'Please select whether you will be attending.';
  end if;
  -- Ignore names from older cached Embroidered Garden forms too.
  if count_only then
    p_additional_guests := array[]::text[];
  end if;
  if p_guest_count is null or p_additional_guests is null
    or coalesce(array_ndims(p_additional_guests), 1) <> 1 then
    raise exception 'Please enter valid guest details.';
  end if;
  if (p_attendance = 'yes' and (p_guest_count < 1
      or (not count_only and (p_guest_count > 10 or cardinality(p_additional_guests) <> p_guest_count - 1))))
    or (p_attendance = 'no' and (p_guest_count <> 0 or cardinality(p_additional_guests) <> 0)) then
    raise exception 'Please enter valid guest details.';
  end if;
  if exists (
    select 1 from unnest(p_additional_guests) as guests(name)
    where name is null or length(btrim(name)) not between 1 and 120
  ) then
    raise exception 'Please enter each additional guest name (up to 120 characters).';
  end if;
  if length(coalesce(p_message, '')) > 1000 then
    raise exception 'Please keep your message within 1000 characters.';
  end if;

  insert into public.order_rsvps (
    order_id, submission_token, full_name, attendance, guest_count, additional_guests, message
  ) values (
    p_order_id, p_submission_token, btrim(p_full_name), p_attendance, p_guest_count,
    array(select btrim(name) from unnest(p_additional_guests) as guests(name)),
    btrim(coalesce(p_message, ''))
  )
  on conflict (order_id, submission_token) do update
  set full_name = excluded.full_name,
      attendance = excluded.attendance,
      guest_count = excluded.guest_count,
      additional_guests = excluded.additional_guests,
      message = excluded.message;

  return jsonb_build_object('saved', true);
end;
$$;

revoke all on function public.submit_order_rsvp(bigint, text, uuid, text, text, integer, text[], text) from public;
grant execute on function public.submit_order_rsvp(bigint, text, uuid, text, text, integer, text[], text) to anon, authenticated;

create or replace function public.submit_test_order_rsvp(
  p_order_id bigint,
  p_published_path text,
  p_submission_token uuid,
  p_full_name text,
  p_attendance text,
  p_guest_count integer,
  p_additional_guests text[],
  p_message text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare count_only boolean;
begin
  select coalesce(form_data->>'template' = '6', false) into count_only
  from public.test_order
  where id = p_order_id and published_path = p_published_path
    and status = 'READY' and (expires_at is null or expires_at > now())
  for share;
  if not found then
    raise exception 'This invitation is no longer accepting replies.';
  end if;

  if p_submission_token is null then
    raise exception 'A reply token is required. Please reload the invitation.';
  end if;
  if p_full_name is null or length(btrim(p_full_name)) not between 1 and 120 then
    raise exception 'Please enter a full name of up to 120 characters.';
  end if;
  if p_attendance is null or p_attendance not in ('yes', 'no') then
    raise exception 'Please select whether you will be attending.';
  end if;
  -- Ignore names from older cached Embroidered Garden forms too.
  if count_only then
    p_additional_guests := array[]::text[];
  end if;
  if p_guest_count is null or p_additional_guests is null
    or coalesce(array_ndims(p_additional_guests), 1) <> 1 then
    raise exception 'Please enter valid guest details.';
  end if;
  if (p_attendance = 'yes' and (p_guest_count < 1
      or (not count_only and (p_guest_count > 10 or cardinality(p_additional_guests) <> p_guest_count - 1))))
    or (p_attendance = 'no' and (p_guest_count <> 0 or cardinality(p_additional_guests) <> 0)) then
    raise exception 'Please enter valid guest details.';
  end if;
  if exists (
    select 1 from unnest(p_additional_guests) as guests(name)
    where name is null or length(btrim(name)) not between 1 and 120
  ) then
    raise exception 'Please enter each additional guest name (up to 120 characters).';
  end if;
  if length(coalesce(p_message, '')) > 1000 then
    raise exception 'Please keep your message within 1000 characters.';
  end if;

  insert into public.test_order_rsvps (
    order_id, submission_token, full_name, attendance, guest_count, additional_guests, message
  ) values (
    p_order_id, p_submission_token, btrim(p_full_name), p_attendance, p_guest_count,
    array(select btrim(name) from unnest(p_additional_guests) as guests(name)),
    btrim(coalesce(p_message, ''))
  )
  on conflict (order_id, submission_token) do update
  set full_name = excluded.full_name,
      attendance = excluded.attendance,
      guest_count = excluded.guest_count,
      additional_guests = excluded.additional_guests,
      message = excluded.message;

  return jsonb_build_object('saved', true);
end;
$$;

revoke all on function public.submit_test_order_rsvp(bigint, text, uuid, text, text, integer, text[], text) from public;
grant execute on function public.submit_test_order_rsvp(bigint, text, uuid, text, text, integer, text[], text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;

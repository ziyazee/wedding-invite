-- Testing Account orders have their own table and identity sequence.
-- Apply after the existing migrations; no live order data or IDs are changed.
begin;

alter table public.companies
  add column is_test_account boolean not null default false;
comment on column public.companies.is_test_account is
  'Admin-managed: this company creates orders in test_order.';

-- INCLUDING IDENTITY creates a new sequence, not a reference to orders_id_seq.
-- LIKE does not copy foreign keys, triggers, grants, or RLS policies.
create table public.test_order (
  like public.orders including defaults including identity including constraints including indexes
);
alter table public.test_order
  add foreign key (company_id) references public.companies(id) on delete cascade,
  add foreign key (created_by) references auth.users(id),
  drop constraint published_path_format,
  add constraint test_order_path_format check (
    published_path is null or published_path ~ '^test-invite/[a-z0-9-]+$'
  );

create function public.initialize_test_order() returns trigger
language plpgsql set search_path = public, extensions as $$
declare couple_slug text;
begin
  couple_slug := left(regexp_replace(lower(
    case when new.form_data->'brideFirst' = 'true'::jsonb
      then new.bride_name || new.groom_name
      else new.groom_name || new.bride_name end
  ), '[^a-z0-9]', '', 'g'), 60);
  new.published_path := 'test-invite/' || coalesce(nullif(couple_slug, ''), 'invitation') || '-' || new.id::text;
  new.management_id := 'test-' || new.id::text || '-' ||
    translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_');
  return new;
end;
$$;
revoke all on function public.initialize_test_order() from public, anon, authenticated;

create trigger test_order_initialize before insert on public.test_order
for each row execute function public.initialize_test_order();
create trigger test_order_validate_payload
before insert or update of form_data, template_code, groom_name, bride_name, phone_number on public.test_order
for each row execute function public.validate_order_payload();
create trigger test_order_guard_catalogue
before insert or update of company_id, template_code on public.test_order
for each row execute function public.guard_company_order_catalogue();
create trigger test_order_snapshot_price before insert on public.test_order
for each row execute function public.snapshot_order_sale_price();
create trigger test_order_touch_updated_at before update on public.test_order
for each row execute function public.touch_updated_at();

alter table public.test_order enable row level security;
revoke all on public.test_order from public, anon, authenticated;
revoke all on sequence public.test_order_id_seq from public, anon, authenticated;
grant select on public.test_order to authenticated;
grant insert (company_id, created_by, template_code, groom_name, bride_name, phone_number, form_data, price)
  on public.test_order to authenticated;
grant usage, select on sequence public.test_order_id_seq to authenticated;

create policy "test orders visible to owner and admins" on public.test_order
for select to authenticated using (
  public.current_user_is_admin() or company_id = public.current_user_company_id()
);
create policy "testing accounts create their own test orders" on public.test_order
for insert to authenticated with check (
  company_id = public.current_user_company_id() and created_by = auth.uid()
  and exists (select 1 from public.companies c where c.id = company_id and c.is_test_account and c.is_active)
  and status = 'CREATED' and published_url is null and published_at is null
  and expires_at is null and rejection_reason is null and admin_notes is null
);
-- Also reject writes from stale clients that still target the live table.
create policy "testing accounts cannot create live orders" on public.orders
as restrictive for insert to authenticated with check (
  not exists (select 1 from public.companies c where c.id = company_id and c.is_test_account)
);

-- Keep test responses separate, since order 1 can exist in both tables.
create table public.test_order_rsvps (
  like public.order_rsvps including defaults including identity including constraints including indexes
);
alter table public.test_order_rsvps
  add foreign key (order_id) references public.test_order(id) on delete cascade;
create trigger test_order_rsvps_touch_updated_at before update on public.test_order_rsvps
for each row execute function public.touch_updated_at();
alter table public.test_order_rsvps enable row level security;
revoke all on public.test_order_rsvps from public, anon, authenticated;
revoke all on sequence public.test_order_rsvps_id_seq from public, anon, authenticated;
grant select on public.test_order_rsvps to authenticated;
create policy "test replies visible to owner and admins" on public.test_order_rsvps
for select to authenticated using (
  public.current_user_is_admin() or exists (
    select 1 from public.test_order o where o.id = test_order_rsvps.order_id
      and o.company_id = public.current_user_company_id()
  )
);

create function public.publish_test_order(p_order_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare order_row public.test_order%rowtype;
begin
  if auth.uid() is null then raise exception 'Sign in to publish this invitation.'; end if;
  select o.* into order_row from public.test_order o
  join public.companies c on c.id = o.company_id
  where o.id = p_order_id and o.company_id = public.current_user_company_id()
    and c.is_test_account and c.is_active
  for update of o;
  if not found then raise exception 'Test order not found for your account.'; end if;
  if order_row.status not in ('CREATED', 'READY') then
    raise exception 'Only new orders can be published from the client dashboard.';
  end if;
  if order_row.status = 'CREATED' then
    update public.test_order set status = 'READY',
      published_url = 'https://www.shaadiinvites.in/' || published_path,
      published_at = now(), rejection_reason = null
    where id = p_order_id returning * into order_row;
  end if;
  return jsonb_build_object(
    'published_path', order_row.published_path,
    'published_url', order_row.published_url,
    'published_at', order_row.published_at
  );
end;
$$;
revoke all on function public.publish_test_order(bigint) from public, anon;
grant execute on function public.publish_test_order(bigint) to authenticated;

-- Allow authenticated company members to update their own CREATED orders.
-- Published (READY) orders are locked and cannot be edited.

create or replace function public.update_test_order(
  p_order_id bigint,
  p_form_data jsonb,
  p_phone_number text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.test_order%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in to update this order.';
  end if;

  if jsonb_typeof(p_form_data) is distinct from 'object' then
    raise exception 'Invitation details are invalid.';
  end if;

  update public.test_order
  set form_data = p_form_data,
      groom_name = p_form_data->>'groom',
      bride_name = p_form_data->>'bride',
      phone_number = p_phone_number
  where id = p_order_id
    and company_id = public.current_user_company_id()
    and status = 'CREATED'
    and exists (select 1 from public.companies c where c.id = company_id and c.is_test_account and c.is_active)
  returning * into updated_order;

  if not found then
    raise exception 'Order not found for your company.';
  end if;

  return jsonb_build_object('saved', true, 'id', updated_order.id);
end;
$$;

revoke all on function public.update_test_order(bigint, jsonb, text) from public;
grant execute on function public.update_test_order(bigint, jsonb, text) to authenticated;

create or replace function public.get_test_published_invitation(p_path text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('orderId', 'test-' || o.id::text, 'slug', o.published_path,
    'details', (o.form_data - 'companyLogo')
      || case when nullif(c.slug,'') is not null then jsonb_build_object('companyLogo', coalesce(c.branding_base_url,'') || '/company-logos/' || c.slug || '.png') else '{}'::jsonb end
      || case when nullif(btrim(c.company_name),'') is not null then jsonb_build_object('companyName', c.company_name) else '{}'::jsonb end
      || case when nullif(btrim(c.phone),'') is not null then jsonb_build_object('companyPhone', c.phone) else '{}'::jsonb end,
    'createdAt', o.published_at)
  from public.test_order o left join public.companies c on c.id = o.company_id
  where o.published_path = p_path and o.status = 'READY' and (o.expires_at is null or o.expires_at > now()) limit 1
$$;
revoke all on function public.get_test_published_invitation(text) from public;
grant execute on function public.get_test_published_invitation(text) to anon, authenticated;

create or replace function public.get_test_order_management(p_management_id text)
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
      from public.test_order_rsvps r where r.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.test_order o
  where o.management_id = p_management_id
  limit 1
$$;

create or replace function public.update_test_order_management(
  p_management_id text,
  p_form_data jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare updated_order public.test_order%rowtype;
begin
  if jsonb_typeof(p_form_data) is distinct from 'object' then
    raise exception 'Invitation details are invalid.';
  end if;

  update public.test_order
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

revoke all on function public.get_test_order_management(text) from public;
revoke all on function public.update_test_order_management(text, jsonb) from public;
grant execute on function public.get_test_order_management(text) to anon, authenticated;
grant execute on function public.update_test_order_management(text, jsonb) to anon, authenticated;

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
begin
  -- Resolve the path and ID together; never accept replies to drafts or expired orders.
  perform 1 from public.test_order
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
  if p_guest_count is null or p_additional_guests is null
    or coalesce(array_ndims(p_additional_guests), 1) <> 1 then
    raise exception 'Please enter valid guest details.';
  end if;
  if (p_attendance = 'yes' and (p_guest_count not between 1 and 10
      or cardinality(p_additional_guests) <> p_guest_count - 1))
    or (p_attendance = 'no' and (p_guest_count <> 0 or cardinality(p_additional_guests) <> 0)) then
    raise exception 'The guest count must match the names provided.';
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

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.test_order;
  end if;
end;
$$;

notify pgrst, 'reload schema';
commit;

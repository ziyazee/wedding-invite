-- Admin-led onboarding. Existing stores retain their catalogue and local assets.
alter table public.companies
  add column if not exists branding_base_url text,
  add column if not exists storefront_enabled boolean not null default true,
  add column if not exists catalog_restricted boolean not null default false;

create table public.company_template_access (
  company_id bigint not null references public.companies(id) on delete cascade,
  template_id integer not null references public.invitation_templates(id) on delete cascade,
  primary key (company_id, template_id)
);
alter table public.company_template_access enable row level security;
create policy "company catalogue access readable by members" on public.company_template_access
  for select to authenticated using (public.current_user_is_admin() or company_id = public.current_user_company_id());
grant select on public.company_template_access to authenticated;

create table public.store_onboarding_requests (
  id uuid primary key,
  company_id bigint not null unique references public.companies(id),
  created_by uuid not null references auth.users(id),
  details jsonb not null,
  templates jsonb not null,
  logo_uploaded boolean not null default false,
  banner_uploaded boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.store_onboarding_requests enable row level security;
create policy "admins read store onboarding" on public.store_onboarding_requests
  for select to authenticated using (public.current_user_is_admin());
grant select on public.store_onboarding_requests to authenticated;
grant all on public.store_onboarding_requests, public.company_template_access to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('store-branding', 'store-branding', true, 5242880, array['image/png'])
on conflict (id) do nothing;
-- Uploads are performed only by the admin-authorized Edge Function. No public writes.

create or replace function public.store_slug_reserved(p_slug text) returns boolean
language sql immutable set search_path = public as $$
  select p_slug = any(array['www','api','admin','app','auth','assets','client','dashboard','login','mail','smtp','ftp','support','templates','static','cdn','account'])
$$;

-- Both store and invitation writes take the same lock before claiming a hostname.
create or replace function public.guard_store_hostname() returns trigger
language plpgsql security definer set search_path = public as $$
declare candidate text;
begin
  if tg_table_name = 'companies' then candidate := new.slug;
  else candidate := new.published_path; end if;
  if candidate is null or position('/' in candidate) > 0 then return new; end if;
  if tg_op = 'UPDATE' then
    if tg_table_name = 'companies' then
      if new.slug is not distinct from old.slug then return new; end if;
    else
      if new.published_path is not distinct from old.published_path then return new; end if;
    end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(lower(candidate), 0));
  if public.store_slug_reserved(lower(candidate)) then raise exception 'This address is reserved.'; end if;
  if tg_table_name = 'companies' then
    if exists (select 1 from public.orders where lower(published_path) = lower(candidate)) then
      raise exception 'This address is already used by an invitation.';
    end if;
  elsif exists (select 1 from public.companies where lower(slug) = lower(candidate)) then
    raise exception 'This address is already used by a store.';
  end if;
  return new;
end $$;
create trigger companies_guard_hostname before insert or update of slug on public.companies
  for each row execute function public.guard_store_hostname();
create trigger orders_guard_store_hostname before insert or update of published_path on public.orders
  for each row execute function public.guard_store_hostname();

create or replace function public.admin_store_slug_available(p_slug text) returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.current_user_is_admin() then raise exception 'Administrator access required.'; end if;
  return p_slug ~ '^[a-z][a-z0-9-]{0,59}[a-z0-9]$'
    and not public.store_slug_reserved(p_slug)
    and not exists (select 1 from public.companies where slug = p_slug)
    and not exists (select 1 from public.orders where published_path = p_slug);
end $$;
revoke all on function public.admin_store_slug_available(text) from public;
grant execute on function public.admin_store_slug_available(text) to authenticated;

-- A single transaction reserves the company, catalogue and prices. Retrying the
-- same request reuses that reservation instead of creating duplicate accounts.
create or replace function public.prepare_store_onboarding(p_id uuid, p_actor uuid, p_details jsonb, p_templates jsonb, p_base_url text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare saved public.store_onboarding_requests; company bigint; item jsonb;
begin
  if not exists (select 1 from auth.users where id = p_actor and upper(raw_app_meta_data->>'role') = 'ADMIN') then
    raise exception 'Administrator access required.';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 1));
  select * into saved from public.store_onboarding_requests where id = p_id;
  if found then
    if saved.details <> p_details or saved.templates <> p_templates then raise exception 'This setup has already started. Resume its original details.'; end if;
    return to_jsonb(saved);
  end if;
  if jsonb_typeof(p_templates) <> 'array' or jsonb_array_length(p_templates) < 1 then raise exception 'Choose at least one template.'; end if;
  if exists (select 1 from auth.users where lower(email) = lower(p_details->>'email') and upper(raw_app_meta_data->>'role') = 'ADMIN') then
    raise exception 'Use the store owner’s email, not an administrator account.';
  end if;
  insert into public.companies (company_name, slug, contact_name, email, phone, tagline, brand_color, branding_base_url, storefront_enabled, catalog_restricted, is_active)
  values (p_details->>'company_name', p_details->>'slug', p_details->>'contact_name', lower(p_details->>'email'), p_details->>'phone', nullif(p_details->>'tagline',''), p_details->>'brand_color', p_base_url, false, true, true)
  returning id into company;
  for item in select value from jsonb_array_elements(p_templates) loop
    if not exists (select 1 from public.invitation_templates where id = (item->>'template_id')::integer and is_active and company_id is null) then
      raise exception 'A selected template is no longer available. Choose active shared templates.';
    end if;
    insert into public.company_template_access(company_id, template_id) values (company, (item->>'template_id')::integer);
    insert into public.company_template_settings(company_id, template_id, price, sale_type, sale_value, is_premium)
    values (company, (item->>'template_id')::integer, (item->>'price')::numeric, item->>'sale_type', (item->>'sale_value')::numeric, (item->>'is_premium')::boolean);
  end loop;
  insert into public.store_onboarding_requests(id, company_id, created_by, details, templates)
  values (p_id, company, p_actor, p_details, p_templates) returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.prepare_store_onboarding(uuid, uuid, jsonb, jsonb, text) from public;
grant execute on function public.prepare_store_onboarding(uuid, uuid, jsonb, jsonb, text) to service_role;

-- Never return password hashes or issue setup links for an administrator.
create or replace function public.store_onboarding_owner(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare owner_id uuid; administrator boolean;
begin
  select u.id, upper(coalesce(u.raw_app_meta_data->>'role','')) = 'ADMIN' into owner_id, administrator
  from public.store_onboarding_requests r join public.companies c on c.id = r.company_id
  join auth.users u on lower(u.email) = lower(c.email) where r.id = p_id;
  if administrator then raise exception 'Administrator accounts cannot be used as store owners.'; end if;
  return jsonb_build_object('id', owner_id);
end $$;
revoke all on function public.store_onboarding_owner(uuid) from public;
grant execute on function public.store_onboarding_owner(uuid) to service_role;

create or replace function public.finish_store_onboarding(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r public.store_onboarding_requests; c public.companies;
begin
  select * into r from public.store_onboarding_requests where id = p_id for update;
  if not found then raise exception 'Store setup not found.'; end if;
  select * into c from public.companies where id = r.company_id for update;
  if r.completed_at is null then
    if not r.logo_uploaded or not exists (select 1 from storage.objects where bucket_id = 'store-branding' and name = 'company-logos/' || c.slug || '.png') then raise exception 'Upload the store logo before finishing setup.'; end if;
    if not exists (select 1 from auth.users where lower(email) = lower(c.email)) then raise exception 'The owner account is not ready yet.'; end if;
    update public.companies set
      logo_path = branding_base_url || '/company-logos/' || slug || '.png',
      hero_image_path = case when r.banner_uploaded then branding_base_url || '/landing/' || slug || '.png' else null end,
      storefront_enabled = (r.details->>'activate')::boolean
    where id = c.id returning * into c;
    update public.store_onboarding_requests set completed_at = now() where id = p_id;
  end if;
  return jsonb_build_object('company_id', c.id, 'slug', c.slug, 'company_name', c.company_name, 'email', c.email, 'storefront_enabled', c.storefront_enabled);
end $$;
revoke all on function public.finish_store_onboarding(uuid) from public;
grant execute on function public.finish_store_onboarding(uuid) to service_role;

create or replace function public.admin_set_storefront_enabled(p_company_id bigint, p_enabled boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.current_user_is_admin() then raise exception 'Administrator access required.'; end if;
  if not exists (select 1 from public.store_onboarding_requests where company_id = p_company_id and completed_at is not null) then
    raise exception 'Complete store setup before changing visibility.';
  end if;
  update public.companies set storefront_enabled = p_enabled where id = p_company_id;
end $$;
revoke all on function public.admin_set_storefront_enabled(bigint, boolean) from public;
grant execute on function public.admin_set_storefront_enabled(bigint, boolean) to authenticated;

-- Enforce the onboarded catalogue at order creation, including direct API calls.
create or replace function public.guard_company_order_catalogue() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.company_id = old.company_id and new.template_code = old.template_code then return new; end if;
  if exists (select 1 from public.companies where id = new.company_id and catalog_restricted) and not exists (
    select 1 from public.company_template_access a join public.invitation_templates t on t.id = a.template_id
    where a.company_id = new.company_id and t.template_code = new.template_code and t.is_active
      and (t.company_id is null or t.company_id = new.company_id)
  ) then raise exception 'This template is not included in your store’s collection.'; end if;
  return new;
end $$;
create trigger orders_guard_company_catalogue before insert or update of company_id, template_code on public.orders
  for each row execute function public.guard_company_order_catalogue();

create or replace function public.get_store_landing(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'company', jsonb_build_object('id', c.id, 'company_name', c.company_name, 'slug', c.slug,
      'tagline', c.tagline, 'brand_color', c.brand_color, 'hero_image_path', c.hero_image_path,
      'logo_path', c.logo_path, 'phone', c.phone, 'branding_base_url', c.branding_base_url),
    'templates', (select coalesce(jsonb_agg(jsonb_build_object(
      'id', t.id, 'template_code', t.template_code, 'name', t.name, 'category', t.category,
      'thumbnail_url', t.thumbnail_url, 'preview_url', t.preview_url, 'is_active', t.is_active,
      'is_private', t.company_id is not null, 'display_order', coalesce(cts.display_order,0),
      'price', cts.price, 'sale_type', cts.sale_type, 'sale_value', cts.sale_value,
      'is_premium', coalesce(cts.is_premium,false), 'demo_data', ctd.demo_data)
      order by case when coalesce(cts.display_order,0) > 0 then 0 else 1 end, coalesce(cts.display_order,0), t.id), '[]'::jsonb)
    from public.invitation_templates t
    left join public.company_template_settings cts on cts.company_id = c.id and cts.template_id = t.id
    left join public.company_template_defaults ctd on ctd.company_id = c.id and ctd.template_id = t.id
    where t.is_active and (t.company_id is null or t.company_id = c.id)
      and (not c.catalog_restricted or exists (select 1 from public.company_template_access a where a.company_id = c.id and a.template_id = t.id)))
  ) from public.companies c where c.slug = p_slug and c.is_active and c.storefront_enabled
$$;
revoke all on function public.get_store_landing(text) from public;
grant execute on function public.get_store_landing(text) to anon, authenticated;

create or replace function public.get_published_invitation(p_path text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('orderId', o.id::text, 'slug', o.published_path,
    'details', (o.form_data - 'companyLogo')
      || case when nullif(c.slug,'') is not null then jsonb_build_object('companyLogo', coalesce(c.branding_base_url,'') || '/company-logos/' || c.slug || '.png') else '{}'::jsonb end
      || case when nullif(btrim(c.company_name),'') is not null then jsonb_build_object('companyName', c.company_name) else '{}'::jsonb end
      || case when nullif(btrim(c.phone),'') is not null then jsonb_build_object('companyPhone', c.phone) else '{}'::jsonb end,
    'createdAt', o.published_at)
  from public.orders o left join public.companies c on c.id = o.company_id
  where o.published_path = p_path and o.status = 'READY' and (o.expires_at is null or o.expires_at > now()) limit 1
$$;
revoke all on function public.get_published_invitation(text) from public;
grant execute on function public.get_published_invitation(text) to anon, authenticated;

notify pgrst, 'reload schema';

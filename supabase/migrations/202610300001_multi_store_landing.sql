-- Multi-store landing pages: per-company storefronts with global + private
-- templates and custom demo data.

-- 1a. Store identity and branding on companies
alter table public.companies
  add column if not exists slug text,
  add column if not exists tagline text,
  add column if not exists brand_color text,
  add column if not exists hero_image_path text,
  add column if not exists logo_path text;

alter table public.companies
  add constraint companies_slug_format
    check (slug is null or slug ~ '^[a-z][a-z0-9-]{1,60}$');

create unique index if not exists companies_slug_unique_idx
  on public.companies (lower(slug))
  where slug is not null;

-- 1b. Template ownership (null = global, non-null = private to company)
alter table public.invitation_templates
  add column if not exists company_id bigint
    references public.companies(id) on delete set null;

create index if not exists invitation_templates_company_id_idx
  on public.invitation_templates (company_id)
  where company_id is not null;

-- 1c. RLS: replace existing template policies with ownership-aware ones
drop policy if exists "active templates visible publicly" on public.invitation_templates;
drop policy if exists "all templates visible to signed-in users" on public.invitation_templates;
drop policy if exists "active templates visible to signed in users" on public.invitation_templates;

create policy "active global templates visible publicly"
  on public.invitation_templates for select to anon
  using (is_active and company_id is null);

create policy "templates visible to signed-in users"
  on public.invitation_templates for select to authenticated
  using (
    company_id is null
    or company_id = public.current_user_company_id()
    or public.current_user_is_admin()
  );

-- 1d. Display order on company template settings
alter table public.company_template_settings
  add column if not exists display_order integer not null default 0;

-- 1e. Per-company custom demo data for template previews
create table if not exists public.company_template_defaults (
  company_id  bigint  not null references public.companies(id) on delete cascade,
  template_id integer not null references public.invitation_templates(id) on delete cascade,
  demo_data   jsonb   not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (company_id, template_id)
);

create trigger company_template_defaults_touch_updated_at
  before update on public.company_template_defaults
  for each row execute function public.touch_updated_at();

alter table public.company_template_defaults enable row level security;

create policy "template defaults readable by everyone"
  on public.company_template_defaults for select to anon, authenticated
  using (true);

create policy "clients manage their template defaults"
  on public.company_template_defaults for insert to authenticated
  with check (
    public.current_user_is_admin()
    or company_id = public.current_user_company_id()
  );

create policy "clients update their template defaults"
  on public.company_template_defaults for update to authenticated
  using (
    public.current_user_is_admin()
    or company_id = public.current_user_company_id()
  )
  with check (
    public.current_user_is_admin()
    or company_id = public.current_user_company_id()
  );

create policy "clients delete their template defaults"
  on public.company_template_defaults for delete to authenticated
  using (
    public.current_user_is_admin()
    or company_id = public.current_user_company_id()
  );

grant select on public.company_template_defaults to anon, authenticated;
grant insert, update, delete on public.company_template_defaults to authenticated;

-- 1f. RPC: fetch everything a store landing page needs in one call
create or replace function public.get_store_landing(p_slug text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'company', (
      select jsonb_build_object(
        'id', c.id,
        'company_name', c.company_name,
        'slug', c.slug,
        'tagline', c.tagline,
        'brand_color', c.brand_color,
        'hero_image_path', c.hero_image_path,
        'logo_path', c.logo_path,
        'phone', c.phone
      )
      from public.companies c
      where c.slug = p_slug
    ),
    'templates', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'template_code', t.template_code,
          'name', t.name,
          'category', t.category,
          'thumbnail_url', t.thumbnail_url,
          'preview_url', t.preview_url,
          'is_active', t.is_active,
          'is_private', t.company_id is not null,
          'display_order', coalesce(cts.display_order, 0),
          'price', cts.price,
          'sale_type', cts.sale_type,
          'sale_value', cts.sale_value,
          'is_premium', coalesce(cts.is_premium, false),
          'demo_data', ctd.demo_data
        ) order by
          case when coalesce(cts.display_order, 0) > 0 then 0 else 1 end,
          coalesce(cts.display_order, 0),
          t.id
      ), '[]'::jsonb)
      from public.invitation_templates t
      left join public.companies c on c.slug = p_slug
      left join public.company_template_settings cts
        on cts.company_id = c.id and cts.template_id = t.id
      left join public.company_template_defaults ctd
        on ctd.company_id = c.id and ctd.template_id = t.id
      where t.is_active
        and (t.company_id is null or t.company_id = c.id)
    )
  )
$$;

revoke all on function public.get_store_landing(text) from public;
grant execute on function public.get_store_landing(text) to anon, authenticated;

-- 1g. RPC: lightweight subdomain disambiguator
create or replace function public.resolve_subdomain(p_slug text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select case
    when exists (
      select 1 from public.companies
      where slug = p_slug
    )
    then jsonb_build_object('type', 'store', 'slug', p_slug)
    else jsonb_build_object('type', 'invitation', 'slug', p_slug)
  end
$$;

revoke all on function public.resolve_subdomain(text) from public;
grant execute on function public.resolve_subdomain(text) to anon, authenticated;

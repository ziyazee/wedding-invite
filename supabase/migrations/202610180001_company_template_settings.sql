create table if not exists public.company_template_settings (
  company_id bigint not null references public.companies(id) on delete cascade,
  template_id integer not null references public.invitation_templates(id) on delete cascade,
  price numeric(10,2) not null default 0 check (price >= 0),
  sale_type text not null default 'none' check (sale_type in ('none', 'percentage', 'fixed')),
  sale_value numeric(10,2) not null default 0,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, template_id),
  constraint company_template_sale_value_valid check (
    (sale_type = 'none' and sale_value = 0)
    or (sale_type = 'percentage' and sale_value between 0 and 100)
    or (sale_type = 'fixed' and sale_value between 0 and price)
  )
);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

create or replace function public.current_user_is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select upper(coalesce(auth.jwt()->'app_metadata'->>'role', '')) = 'ADMIN' $$;

create or replace function public.current_user_company_id() returns bigint
language sql stable security definer set search_path = public
as $$
  select c.id from public.companies c
  where lower(c.email) = lower(auth.jwt()->>'email')
  limit 1
$$;

drop trigger if exists company_template_settings_touch_updated_at on public.company_template_settings;
create trigger company_template_settings_touch_updated_at
before update on public.company_template_settings
for each row execute function public.touch_updated_at();

alter table public.company_template_settings enable row level security;

drop policy if exists "company template settings visible to members and admins" on public.company_template_settings;
create policy "company template settings visible to members and admins"
on public.company_template_settings for select to authenticated
using (public.current_user_is_admin() or company_id = public.current_user_company_id());

drop policy if exists "clients manage their company template settings" on public.company_template_settings;
create policy "clients manage their company template settings"
on public.company_template_settings for insert to authenticated
with check (public.current_user_is_admin() or company_id = public.current_user_company_id());

drop policy if exists "clients update their company template settings" on public.company_template_settings;
create policy "clients update their company template settings"
on public.company_template_settings for update to authenticated
using (public.current_user_is_admin() or company_id = public.current_user_company_id())
with check (public.current_user_is_admin() or company_id = public.current_user_company_id());

grant select, insert, update on public.company_template_settings to authenticated;

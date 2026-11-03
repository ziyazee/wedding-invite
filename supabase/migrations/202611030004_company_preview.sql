-- Company preview slot: one preview per company, last-write-wins.
-- Clients preview an invitation before publishing it. The preview URL
-- is {company-slug}.shaadiinvites.in/preview and always shows the
-- last order that was previewed.

create table if not exists public.company_previews (
  company_id  bigint      primary key references public.companies(id) on delete cascade,
  form_data   jsonb       not null,
  template_code text      not null,
  updated_at  timestamptz not null default now()
);

alter table public.company_previews enable row level security;

create policy "company_members_own_preview"
  on public.company_previews for all
  using (company_id = current_user_company_id())
  with check (company_id = current_user_company_id());

create policy "admins_all_previews"
  on public.company_previews for all
  using (current_user_is_admin())
  with check (current_user_is_admin());

-- Upsert preview data for the caller's company.
create or replace function public.set_company_preview(
  p_form_data   jsonb,
  p_template_code text
) returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_company_id bigint;
begin
  v_company_id := current_user_company_id();
  if v_company_id is null then
    raise exception 'Company not found for the current user.';
  end if;

  insert into public.company_previews (company_id, form_data, template_code, updated_at)
  values (v_company_id, p_form_data, p_template_code, now())
  on conflict (company_id) do update
    set form_data     = excluded.form_data,
        template_code = excluded.template_code,
        updated_at    = now();
end;
$$;

-- Fetch the current preview by company slug. Anon-accessible so the
-- preview page works without authentication (opened in a new tab).
create or replace function public.get_company_preview(p_slug text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'details',       cp.form_data,
    'template_code', cp.template_code,
    'updated_at',    cp.updated_at
  )
  from public.company_previews cp
  join public.companies c on c.id = cp.company_id
  where c.slug = p_slug
  limit 1
$$;

grant execute on function public.set_company_preview(jsonb, text) to authenticated;
grant execute on function public.get_company_preview(text) to anon, authenticated;

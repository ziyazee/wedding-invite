create or replace function public.admin_company_names()
returns table (id bigint, company_name text)
language sql stable security definer set search_path = public
as $$
  select c.id, c.company_name from public.companies c
  where public.current_user_is_admin();
$$;

revoke all on function public.admin_company_names() from public;
grant execute on function public.admin_company_names() to authenticated;

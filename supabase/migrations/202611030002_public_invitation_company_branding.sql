-- Supply the company's current name as well as its slug-based logo so older
-- orders retain visible footer branding even when their saved details omit it.
create or replace function public.get_published_invitation(p_path text)
returns jsonb language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'orderId', o.id::text,
    'slug', o.published_path,
    'details', (o.form_data - 'companyLogo')
      || case
        when nullif(c.slug, '') is not null
          then jsonb_build_object('companyLogo', '/company-logos/' || c.slug || '.png')
        else '{}'::jsonb
      end
      || case
        when nullif(btrim(c.company_name), '') is not null
          then jsonb_build_object('companyName', c.company_name)
        else '{}'::jsonb
      end
      || case
        when nullif(btrim(c.phone), '') is not null
          then jsonb_build_object('companyPhone', c.phone)
        else '{}'::jsonb
      end,
    'createdAt', o.published_at
  )
  from public.orders o
  left join public.companies c on c.id = o.company_id
  where o.published_path = p_path
    and o.status = 'READY'
    and (o.expires_at is null or o.expires_at > now())
  limit 1
$$;

revoke all on function public.get_published_invitation(text) from public;
grant execute on function public.get_published_invitation(text) to anon, authenticated;

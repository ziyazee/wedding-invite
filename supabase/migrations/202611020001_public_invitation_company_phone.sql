create or replace function public.get_published_invitation(p_path text)
returns jsonb language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'orderId', o.id::text,
    'slug', o.published_path,
    'details', case
      when nullif(btrim(c.phone), '') is not null
        then jsonb_set(o.form_data, '{companyPhone}', to_jsonb(c.phone), true)
      else o.form_data
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

create or replace function public.publish_company_order(
  p_order_id bigint,
  p_published_path text,
  p_published_url text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row public.orders%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in to publish this invitation.';
  end if;

  select * into order_row
  from public.orders
  where id = p_order_id
    and company_id = public.current_user_company_id()
  for update;

  if not found then
    raise exception 'This order was not found for your company.';
  end if;

  if order_row.status = 'READY' then
    return jsonb_build_object(
      'published_path', order_row.published_path,
      'published_url', order_row.published_url,
      'published_at', order_row.published_at
    );
  end if;

  if order_row.status <> 'CREATED' then
    raise exception 'Only new orders can be published from the client dashboard.';
  end if;

  if p_published_path is null
    or p_published_url is null
    or p_published_path !~ ('^' || p_order_id::text || '/[a-z0-9]{1,80}$')
    or p_published_url !~ '^https?://[^/]+'
    or right(p_published_url, length(p_published_path) + 1) <> '/' || p_published_path then
    raise exception 'The invitation URL is invalid.';
  end if;

  update public.orders
  set status = 'READY',
      published_path = p_published_path,
      published_url = p_published_url,
      published_at = now(),
      rejection_reason = null
  where id = p_order_id
  returning * into order_row;

  return jsonb_build_object(
    'published_path', order_row.published_path,
    'published_url', order_row.published_url,
    'published_at', order_row.published_at
  );
end;
$$;

revoke all on function public.publish_company_order(bigint, text, text) from public;
grant execute on function public.publish_company_order(bigint, text, text) to authenticated;

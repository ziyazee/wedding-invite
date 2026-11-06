-- Match the seven name-based URL options supplied by the frontend.
-- Preserve collision handling and the www.shaadiinvites.in/path URL format.
begin;

create or replace function public.reserve_company_order_path(
  p_order_id bigint,
  p_candidate_paths text[]
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row public.orders%rowtype;
  candidate text;
begin
  if auth.uid() is null then
    raise exception 'Sign in to reserve this invitation URL.';
  end if;

  if p_candidate_paths is null or cardinality(p_candidate_paths) = 0 or cardinality(p_candidate_paths) > 7 then
    raise exception 'The invitation URL options are invalid.';
  end if;

  select * into order_row
  from public.orders
  where id = p_order_id
    and company_id = public.current_user_company_id()
  for update;

  if not found then
    raise exception 'This order was not found for your company.';
  end if;

  if order_row.status <> 'CREATED' then
    raise exception 'Only new orders can reserve an invitation URL.';
  end if;

  if order_row.published_path is not null then
    return jsonb_build_object('published_path', order_row.published_path);
  end if;

  foreach candidate in array p_candidate_paths loop
    if candidate is null or candidate !~ '^[a-z][a-z0-9.-]{0,79}$' then
      continue;
    end if;

    begin
      update public.orders
      set published_path = candidate
      where id = p_order_id
      returning * into order_row;

      return jsonb_build_object('published_path', order_row.published_path);
    exception when unique_violation then
      -- Another order already claimed this candidate. Try the next priority.
      null;
    end;
  end loop;

  raise exception 'All seven invitation URL options for these names are taken.';
end;
$$;

revoke all on function public.reserve_company_order_path(bigint, text[]) from public;
grant execute on function public.reserve_company_order_path(bigint, text[]) to authenticated;

create or replace function public.publish_company_order_with_candidates(
  p_order_id bigint,
  p_candidate_paths text[]
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row public.orders%rowtype;
  candidate text;
begin
  if auth.uid() is null then
    raise exception 'Sign in to publish this invitation.';
  end if;

  if p_candidate_paths is null or cardinality(p_candidate_paths) = 0 or cardinality(p_candidate_paths) > 7 then
    raise exception 'The invitation URL options are invalid.';
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

  foreach candidate in array p_candidate_paths loop
    if candidate is null or candidate !~ '^[a-z][a-z0-9.-]{0,79}$' then
      continue;
    end if;

    begin
      update public.orders
      set status = 'READY',
          published_path = candidate,
          published_url = 'https://www.shaadiinvites.in/' || candidate,
          published_at = now(),
          rejection_reason = null
      where id = p_order_id
      returning * into order_row;

      return jsonb_build_object(
        'published_path', order_row.published_path,
        'published_url', order_row.published_url,
        'published_at', order_row.published_at
      );
    exception when unique_violation then
      null;
    end;
  end loop;

  raise exception 'All seven invitation URL options for these names are taken.';
end;
$$;

revoke all on function public.publish_company_order_with_candidates(bigint, text[]) from public;
grant execute on function public.publish_company_order_with_candidates(bigint, text[]) to authenticated;

-- 2. Migrate existing published orders from subdomain to path-based URLs.
update public.orders
set published_url = 'https://www.shaadiinvites.in/' || published_path
where published_path is not null
  and published_url like 'https://%.shaadiinvites.in';

commit;

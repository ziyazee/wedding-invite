-- Save the parent order's URL when publishing its invitations. Otherwise the
-- published_order_has_path constraint rolls back the entire publish operation.
begin;

create or replace function public.publish_couple_order_with_candidates(
  p_order_id bigint,
  p_candidates jsonb,
  p_expires_at timestamptz default null,
  p_admin_notes text default null
) returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  parent public.orders%rowtype;
  invitation public.invitations%rowtype;
  paths jsonb;
  candidate text;
  primary_path text;
  result_rows jsonb := '[]'::jsonb;
  published_time timestamptz := now();
begin
  select * into parent from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found.'; end if;
  if not public.current_user_is_admin() and parent.company_id is distinct from public.current_user_company_id() then
    raise exception 'Access denied.';
  end if;
  if parent.status not in ('CREATED','IN_PROGRESS','READY') then raise exception 'This order cannot be published.'; end if;
  for invitation in select * from public.invitations where couple_order_id = (
    select id from public.couple_orders where legacy_order_id = p_order_id
  ) order by created_at, id for update loop
    if invitation.legacy_order_id is not null and parent.published_path is not null then
      candidate := parent.published_path;
    elsif invitation.published_path is not null then
      candidate := invitation.published_path;
    else
      paths := p_candidates->invitation.id::text;
      candidate := null;
      for candidate in select jsonb_array_elements_text(coalesce(paths,'[]'::jsonb)) loop
        if exists(select 1 from public.orders existing_order where existing_order.published_path=candidate) then
          candidate := null;
          continue;
        end if;
        begin
          update public.invitations set published_path = candidate where id = invitation.id;
          exit;
        exception when unique_violation then candidate := null;
        end;
      end loop;
      if candidate is null then raise exception 'Could not reserve an invitation URL. Please retry publishing.'; end if;
    end if;
    update public.invitations set status='READY', published_path=candidate,
      published_url='https://www.shaadiinvites.in/' || candidate,
      published_at=coalesce(published_at,published_time), expires_at=p_expires_at,
      admin_notes=coalesce(p_admin_notes,admin_notes)
    where id=invitation.id;
    if invitation.legacy_order_id = p_order_id then
      primary_path := candidate;
    end if;
    result_rows := result_rows || jsonb_build_array(jsonb_build_object(
      'id', invitation.id, 'name', invitation.invitation_name,
      'published_path', candidate, 'published_url', 'https://www.shaadiinvites.in/' || candidate
    ));
  end loop;
  if result_rows = '[]'::jsonb then raise exception 'No invitations are configured for this order.'; end if;
  if primary_path is null then raise exception 'The default invitation for this order was not found.'; end if;
  update public.orders set status='READY', published_path=primary_path,
    published_url='https://www.shaadiinvites.in/' || primary_path,
    published_at=coalesce(published_at,published_time),
    expires_at=p_expires_at, admin_notes=coalesce(p_admin_notes,admin_notes)
  where id=p_order_id;
  update public.couple_orders set status='READY' where legacy_order_id=p_order_id;
  return jsonb_build_object(
    'published_path', primary_path,
    'published_url', 'https://www.shaadiinvites.in/' || primary_path,
    'published_at', published_time, 'invitations', result_rows
  );
end;
$$;
revoke all on function public.publish_couple_order_with_candidates(bigint,jsonb,timestamptz,text) from public, anon;
grant execute on function public.publish_couple_order_with_candidates(bigint,jsonb,timestamptz,text) to authenticated;

commit;

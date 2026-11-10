-- Add named invitation variants to each couple order. Existing order rows and
-- public paths remain intact; their linked invitation becomes the first plan.
begin;

alter table public.couple_orders add column if not exists shared_form_data jsonb;
alter table public.invitations add column if not exists invitation_name text not null default 'Wedding';
alter table public.invitations add column if not exists selected_event_ids text[] not null default '{}';
alter table public.invitations add column if not exists uses_snapshot boolean not null default false;

update public.invitations i
set invitation_name = coalesce(nullif((
      select string_agg(event->>'title', ' + ' order by ordinal)
      from jsonb_array_elements(coalesce(i.form_data->'events','[]'::jsonb)) with ordinality as rows(event,ordinal)
    ), ''), 'Wedding'),
    selected_event_ids = coalesce((
      select array_agg('event-' || ordinal::text order by ordinal)
      from jsonb_array_elements(coalesce(i.form_data->'events','[]'::jsonb)) with ordinality as rows(event,ordinal)
    ), '{}');

create or replace function public.configure_order_invitations(p_order_id bigint, p_plans jsonb)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  parent public.orders%rowtype;
  couple_id bigint;
  primary_invitation_id bigint;
  plan jsonb;
  plan_events jsonb;
  event_ids text[];
  event_count integer;
  idx integer := 0;
  inserted_ids bigint[] := '{}';
begin
  select * into parent from public.orders where id = p_order_id for update;
  if not found or parent.company_id is distinct from public.current_user_company_id() then
    raise exception 'Order not found or access denied.';
  end if;
  if jsonb_typeof(p_plans) <> 'array' or jsonb_array_length(p_plans) not between 1 and 10 then
    raise exception 'Add between one and ten invitations.';
  end if;
  select id into couple_id from public.couple_orders where legacy_order_id = p_order_id for update;
  if couple_id is null then
    insert into public.couple_orders(legacy_order_id,company_id,created_by,groom_name,bride_name,bride_first,phone_number,status)
    values(parent.id,parent.company_id,parent.created_by,parent.groom_name,parent.bride_name,
      coalesce(parent.form_data->'brideFirst'='true'::jsonb,false),parent.phone_number,parent.status)
    returning id into couple_id;
  end if;
  select id into primary_invitation_id from public.invitations where legacy_order_id = p_order_id for update;
  if primary_invitation_id is null then
    insert into public.invitations(couple_order_id,legacy_order_id,template_code,form_data,status,published_path,published_url,
      management_id,published_at,expires_at,rejection_reason,admin_notes)
    values(couple_id,parent.id,parent.template_code,parent.form_data,parent.status,parent.published_path,parent.published_url,
      parent.management_id,parent.published_at,parent.expires_at,parent.rejection_reason,parent.admin_notes)
    returning id into primary_invitation_id;
  end if;

  update public.couple_orders set shared_form_data = parent.form_data where id = couple_id;
  delete from public.invitations where couple_order_id = couple_id and legacy_order_id is null and status = 'CREATED';
  event_count := jsonb_array_length(coalesce(parent.form_data->'events','[]'::jsonb));

  for plan in select value from jsonb_array_elements(p_plans) loop
    if nullif(btrim(plan->>'name'), '') is null or length(btrim(plan->>'name')) > 80 then
      raise exception 'Every invitation needs a name of up to 80 characters.';
    end if;
    if jsonb_typeof(plan->'event_indexes') <> 'array' or jsonb_array_length(plan->'event_indexes') = 0 then
      raise exception 'Every invitation must include at least one event.';
    end if;
    if exists(select 1 from jsonb_array_elements_text(plan->'event_indexes') as vals(value) where value::integer < 0 or value::integer >= event_count) then
      raise exception 'An invitation contains an invalid event selection.';
    end if;
    plan_events := (select jsonb_agg(jsonb_set(parent.form_data->'events'->(value::integer), '{id}', to_jsonb('event-' || (value::integer + 1)::text), true) order by value::integer)
      from jsonb_array_elements_text(plan->'event_indexes') as vals(value));
    event_ids := (select array_agg('event-' || (value::integer + 1)::text order by value::integer)
      from jsonb_array_elements_text(plan->'event_indexes') as vals(value));
    idx := idx + 1;
    if idx = 1 then
      update public.invitations
      set invitation_name = btrim(plan->>'name'), selected_event_ids = event_ids,
          uses_snapshot = true,
          form_data = jsonb_set(parent.form_data, '{events}', plan_events, true),
          template_code = parent.template_code
      where id = primary_invitation_id;
      inserted_ids := array_append(inserted_ids, primary_invitation_id);
    else
      insert into public.invitations(couple_order_id, template_code, form_data, invitation_name, selected_event_ids, uses_snapshot)
      values (couple_id, parent.template_code, jsonb_set(parent.form_data, '{events}', plan_events, true),
        btrim(plan->>'name'), event_ids, true)
      returning id into primary_invitation_id;
      inserted_ids := array_append(inserted_ids, primary_invitation_id);
    end if;
  end loop;
  return jsonb_build_object('invitation_ids', to_jsonb(inserted_ids));
end;
$$;
revoke all on function public.configure_order_invitations(bigint,jsonb) from public, anon;
grant execute on function public.configure_order_invitations(bigint,jsonb) to authenticated;

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
    if invitation.legacy_order_id is not null then
      update public.invitations set status='READY', published_path=candidate,
        published_url='https://www.shaadiinvites.in/' || candidate, published_at=coalesce(published_at,published_time),
        expires_at=p_expires_at, admin_notes=coalesce(p_admin_notes,admin_notes)
      where id=invitation.id;
    else
      update public.invitations set status='READY', published_url='https://www.shaadiinvites.in/' || candidate,
        published_at=coalesce(published_at,published_time), expires_at=p_expires_at,
        admin_notes=coalesce(p_admin_notes,admin_notes)
      where id=invitation.id;
    end if;
    result_rows := result_rows || jsonb_build_array(jsonb_build_object(
      'id', invitation.id, 'name', invitation.invitation_name,
      'published_path', candidate, 'published_url', 'https://www.shaadiinvites.in/' || candidate
    ));
  end loop;
  if result_rows = '[]'::jsonb then raise exception 'No invitations are configured for this order.'; end if;
  update public.orders set status='READY', published_at=coalesce(published_at,published_time),
    expires_at=p_expires_at, admin_notes=coalesce(p_admin_notes,admin_notes)
  where id=p_order_id;
  update public.couple_orders set status='READY' where legacy_order_id=p_order_id;
  return jsonb_build_object('published_at', published_time, 'invitations', result_rows);
end;
$$;
revoke all on function public.publish_couple_order_with_candidates(bigint,jsonb,timestamptz,text) from public, anon;
grant execute on function public.publish_couple_order_with_candidates(bigint,jsonb,timestamptz,text) to authenticated;

create or replace function public.get_published_invitation(p_path text)
returns jsonb language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'orderId', coalesce(i.legacy_order_id, c.legacy_order_id)::text,
    'invitationId', i.id::text,
    'invitationName', i.invitation_name,
    'slug', i.published_path,
    'details', ((case when i.uses_snapshot then i.form_data else coalesce(o.form_data,i.form_data) end) - 'companyLogo')
      || case when nullif(cmp.slug,'') is not null then jsonb_build_object('companyLogo','/company-logos/'||cmp.slug||'.png') else '{}'::jsonb end
      || case when nullif(btrim(cmp.phone),'') is not null then jsonb_build_object('companyPhone',cmp.phone) else '{}'::jsonb end,
    'createdAt', i.published_at
  )
  from public.invitations i
  join public.couple_orders c on c.id=i.couple_order_id
  left join public.orders o on o.id=i.legacy_order_id
  left join public.companies cmp on cmp.id=c.company_id
  where i.published_path=p_path and i.status='READY'
    and (i.expires_at is null or i.expires_at>now())
  limit 1
$$;
revoke all on function public.get_published_invitation(text) from public;
grant execute on function public.get_published_invitation(text) to anon, authenticated;

create or replace function public.get_order_management(p_management_id text)
returns jsonb language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'orderId', coalesce(primary_invitation.legacy_order_id,c.id)::text,
    'coupleOrderId',c.id::text,'managementId',c.management_id,
    'status',primary_invitation.status,'details',primary_invitation.details,
    'responses',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',r.id,'name',r.full_name,'attendance',r.attendance,'guestCount',r.guest_count,
        'additionalGuests',r.additional_guests,'message',r.message,'createdAt',r.created_at,
        'updatedAt',r.updated_at,'invitationName',invitation.invitation_name,
        'invitationPath',invitation.published_path
      ) order by r.created_at desc)
      from public.order_rsvps r
      join public.invitations invitation on invitation.couple_order_id=c.id
        and (invitation.id=r.invitation_id or (r.invitation_id is null and invitation.legacy_order_id=r.order_id))
    ),'[]'::jsonb)
  )
  from public.couple_orders c
  join lateral (
    select i.legacy_order_id,i.status,
      case when i.uses_snapshot then i.form_data else coalesce(o.form_data,i.form_data) end as details
    from public.invitations i left join public.orders o on o.id=i.legacy_order_id
    where i.couple_order_id=c.id order by i.created_at,i.id limit 1
  ) primary_invitation on true
  where c.management_id=p_management_id limit 1
$$;
revoke all on function public.get_order_management(text) from public;
grant execute on function public.get_order_management(text) to anon, authenticated;

create or replace function public.submit_invitation_rsvp(
  p_invitation_id bigint, p_order_id bigint, p_published_path text, p_submission_token uuid,
  p_full_name text, p_attendance text, p_guest_count integer, p_additional_guests text[], p_message text
) returns jsonb language plpgsql security definer set search_path = public
as $$
declare count_only boolean;
begin
  select coalesce(i.form_data->>'template' = '6', false) into count_only
  from public.invitations i
  join public.couple_orders c on c.id=i.couple_order_id
  where i.id=p_invitation_id and i.published_path=p_published_path and i.status='READY'
    and c.legacy_order_id=p_order_id and (i.expires_at is null or i.expires_at>now())
  for share of i;
  if not found then raise exception 'This invitation is no longer accepting replies.'; end if;
  if p_submission_token is null or p_full_name is null or length(btrim(p_full_name)) not between 1 and 120 then
    raise exception 'Please enter a full name of up to 120 characters.';
  end if;
  if p_attendance not in ('yes','no') then raise exception 'Please select whether you will be attending.'; end if;
  if count_only then p_additional_guests := array[]::text[]; end if;
  if p_guest_count is null or p_additional_guests is null
    or coalesce(array_ndims(p_additional_guests),1)<>1
    or (p_attendance='yes' and (p_guest_count<1 or (not count_only and (p_guest_count>10 or cardinality(p_additional_guests)<>p_guest_count-1))))
    or (p_attendance='no' and (p_guest_count<>0 or cardinality(p_additional_guests)<>0)) then
    raise exception 'Please enter valid guest details.';
  end if;
  if exists(select 1 from unnest(p_additional_guests) guest where guest is null or length(btrim(guest)) not between 1 and 120) then
    raise exception 'Please enter each additional guest name (up to 120 characters).';
  end if;
  if length(coalesce(p_message,''))>1000 then raise exception 'Please keep your message within 1000 characters.'; end if;
  insert into public.order_rsvps(order_id,invitation_id,submission_token,full_name,attendance,guest_count,additional_guests,message)
  values(p_order_id,p_invitation_id,p_submission_token,btrim(p_full_name),p_attendance,p_guest_count,
    array(select btrim(guest) from unnest(p_additional_guests) guest),btrim(coalesce(p_message,'')))
  on conflict(order_id,submission_token) do update set invitation_id=excluded.invitation_id,
    full_name=excluded.full_name,attendance=excluded.attendance,guest_count=excluded.guest_count,
    additional_guests=excluded.additional_guests,message=excluded.message;
  return jsonb_build_object('saved',true);
end;
$$;
revoke all on function public.submit_invitation_rsvp(bigint,bigint,text,uuid,text,text,integer,text[],text) from public;
grant execute on function public.submit_invitation_rsvp(bigint,bigint,text,uuid,text,text,integer,text[],text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;

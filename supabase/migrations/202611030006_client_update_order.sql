-- Allow authenticated company members to update their own CREATED orders.
-- Published (READY) orders are locked and cannot be edited.

create or replace function public.update_company_order(
  p_order_id bigint,
  p_form_data jsonb,
  p_phone_number text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.orders%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in to update this order.';
  end if;

  if jsonb_typeof(p_form_data) is distinct from 'object' then
    raise exception 'Invitation details are invalid.';
  end if;

  update public.orders
  set form_data = p_form_data,
      groom_name = p_form_data->>'groom',
      bride_name = p_form_data->>'bride',
      phone_number = p_phone_number
  where id = p_order_id
    and company_id = public.current_user_company_id()
  returning * into updated_order;

  if not found then
    raise exception 'Order not found for your company.';
  end if;

  return jsonb_build_object('saved', true, 'id', updated_order.id);
end;
$$;

revoke all on function public.update_company_order(bigint, jsonb, text) from public;
grant execute on function public.update_company_order(bigint, jsonb, text) to authenticated;

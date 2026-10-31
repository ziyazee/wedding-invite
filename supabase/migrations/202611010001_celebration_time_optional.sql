-- Make celebration time optional in validate_order_payload trigger.
create or replace function public.validate_order_payload() returns trigger
language plpgsql set search_path = public
as $$
declare event_item jsonb;
begin
  if jsonb_typeof(new.form_data) <> 'object'
    or nullif(trim(new.groom_name),'') is null
    or nullif(trim(new.bride_name),'') is null
    or nullif(trim(new.phone_number),'') is null
    or new.form_data->>'groom' is distinct from new.groom_name
    or new.form_data->>'bride' is distinct from new.bride_name then
    raise exception 'Order names and phone number must match valid invitation details.';
  end if;
  if not exists (select 1 from public.invitation_templates where id=(new.form_data->>'template')::integer and template_code=new.template_code and is_active) then
    raise exception 'The selected invitation template is not active.';
  end if;
  if jsonb_typeof(new.form_data->'events') is distinct from 'array'
    or coalesce(jsonb_array_length(new.form_data->'events'), 0) < 1
    or coalesce(jsonb_array_length(new.form_data->'events'), 0) > 10 then
    raise exception 'An order must contain between one and ten event details.';
  end if;
  if nullif(trim(new.form_data->>'date'),'') is null
    or new.form_data->>'date' !~ '^\d{4}-\d{2}-\d{2}$'
    or coalesce(new.form_data->>'time','') !~ '^([01]\d|2[0-3]):[0-5]\d$'
    or coalesce(new.form_data->>'offset','') !~ '^[+-](0\d|1[0-4]):(00|15|30|45)$'
    or nullif(trim(new.form_data->>'venue'),'') is null
    or nullif(trim(new.form_data->>'address'),'') is null then
    raise exception 'Wedding date, time, venue, and address are required.';
  end if;
  for event_item in select value from jsonb_array_elements(new.form_data->'events') loop
    if nullif(trim(event_item->>'title'),'') is null or nullif(trim(event_item->>'date'),'') is null
      or event_item->>'date' !~ '^\d{4}-\d{2}-\d{2}$'
      or (nullif(trim(coalesce(event_item->>'time','')),'') is not null and coalesce(event_item->>'time','') !~ '^([01]\d|2[0-3]):[0-5]\d$')
      or nullif(trim(event_item->>'venue'),'') is null
      or nullif(trim(event_item->>'address'),'') is null then
      raise exception 'Each celebration needs a name, date, venue, and address.';
    end if;
  end loop;
  return new;
end $$;

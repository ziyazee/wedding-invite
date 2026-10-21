-- Give the eight active order templates compact IDs while retaining archived
-- template rows under their former ID + 100.
begin;

drop trigger if exists orders_validate_payload on public.orders;
alter table public.company_template_settings
  drop constraint if exists company_template_settings_template_id_fkey;

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
      or coalesce(event_item->>'time','') !~ '^([01]\d|2[0-3]):[0-5]\d$'
      or nullif(trim(event_item->>'venue'),'') is null
      or nullif(trim(event_item->>'address'),'') is null then
      raise exception 'Each celebration needs a name, date, time, venue, and address.';
    end if;
  end loop;
  return new;
end $$;

update public.company_template_settings set template_id = template_id + 10000000;
update public.invitation_templates set id = id + 10000000;

update public.company_template_settings s
set template_id = case t.template_code
  when 'mohadrahma' then 1
  when 'royal-grace' then 1
  when 'majestic' then 2
  when 'timeless-union' then 3
  when 'mandap-at-dusk' then 4
  when 'secret-garden' then 5
  when 'embroidered-garden' then 6
  when 'bloom' then 7
  when 'artful-love-story' then 8
  else case when mod(t.id, 1000000) between 101 and 999 then mod(t.id, 1000000) else mod(t.id, 1000000) + 100 end
end
from public.invitation_templates t
where s.template_id = t.id;

update public.invitation_templates
set id = case template_code
  when 'mohadrahma' then 1
  when 'royal-grace' then 1
  when 'majestic' then 2
  when 'timeless-union' then 3
  when 'mandap-at-dusk' then 4
  when 'secret-garden' then 5
  when 'embroidered-garden' then 6
  when 'bloom' then 7
  when 'artful-love-story' then 8
  else case when mod(id, 1000000) between 101 and 999 then mod(id, 1000000) else mod(id, 1000000) + 100 end
end;

alter table public.company_template_settings
  add constraint company_template_settings_template_id_fkey
  foreign key (template_id) references public.invitation_templates(id) on delete cascade;

update public.orders o
set form_data = jsonb_set(o.form_data, '{template}', to_jsonb(case o.template_code
  when 'mohadrahma' then 1
  when 'royal-grace' then 1
  when 'majestic' then 2
  when 'timeless-union' then 3
  when 'mandap-at-dusk' then 4
  when 'secret-garden' then 5
  when 'embroidered-garden' then 6
  when 'bloom' then 7
  when 'artful-love-story' then 8
  else case when (o.form_data->>'template')::integer between 101 and 999
    then (o.form_data->>'template')::integer
    else (o.form_data->>'template')::integer + 100
  end
end), true)
where o.form_data ? 'template';

update public.orders set template_code = 'royal-grace' where template_code = 'mohadrahma';
update public.invitation_templates
set template_code = 'royal-grace', name = 'Royal Grace', preview_url = '/mohadrahma', updated_at = now()
where template_code in ('mohadrahma', 'royal-grace');

do $$
begin
  if to_regprocedure('public.validate_order_payload()') is not null then
create trigger orders_validate_payload before insert or update of form_data, template_code, groom_name, bride_name, phone_number
on public.orders for each row execute function public.validate_order_payload();
  end if;
end $$;

commit;

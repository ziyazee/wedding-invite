-- Apply after the compact-ID catalog migration. Existing archived rows use
-- IDs above 100; these IDs match the landing collection and application model.
begin;
insert into public.invitation_templates (id, template_code, name, category, thumbnail_url, preview_url, is_active)
values
  (9, 'maroon-letter', 'Maroon Letter', 'Muslim', '/maroon-letter/demo.webp', '/maroon-letter', true),
  (10, 'emerald-parchment', 'Emerald Parchment', 'Muslim', '/emerald-parchment/demo.webp', '/emerald-parchment', true),
  (11, 'royal-jodhpur', 'Royal Jodhpur', 'Hindu', '/shaadipath-t02/assets/layers/Herp Palace.webp', '/royal-jodhpur', true)
on conflict (template_code) do update set
  name = excluded.name, category = excluded.category,
  thumbnail_url = excluded.thumbnail_url, preview_url = excluded.preview_url,
  is_active = true, updated_at = now();
-- Fail instead of silently assigning an order to a mismatched template ID.
do $$ begin
  if exists (select 1 from public.invitation_templates where
    (template_code = 'maroon-letter' and id <> 9) or
    (template_code = 'emerald-parchment' and id <> 10) or
    (template_code = 'royal-jodhpur' and id <> 11)) then
    raise exception 'New template IDs conflict with the application catalog.';
  end if;
end $$;
commit;

-- Ensure Mandap at Dusk is available in the client order catalog.
do $$
begin
  if exists (
    select 1 from public.invitation_templates
    where id = 4 and template_code <> 'mandap-at-dusk'
  ) then
    raise exception 'Template ID 4 is assigned to a different template; resolve the catalog conflict before restoring Mandap at Dusk.';
  end if;

  if exists (
    select 1 from public.invitation_templates
    where template_code = 'mandap-at-dusk' and id <> 4
  ) then
    raise exception 'Mandap at Dusk has an unexpected template ID; resolve the catalog conflict before restoring it.';
  end if;
end;
$$;

insert into public.invitation_templates (
  id, template_code, name, category, thumbnail_url, preview_url, is_active
) values (
  4, 'mandap-at-dusk', 'Mandap at Dusk', 'Hindu',
  '/design18/preview.jpg', '/mandap-at-dusk', true
)
on conflict (id) do update set
  template_code = excluded.template_code,
  name = excluded.name,
  category = excluded.category,
  thumbnail_url = excluded.thumbnail_url,
  preview_url = excluded.preview_url,
  is_active = true,
  updated_at = now();

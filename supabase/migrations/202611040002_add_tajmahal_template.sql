begin;

do $$ begin
  if exists (
    select 1 from public.invitation_templates
    where id = 17 and template_code <> 'tajmahal'
  ) then
    raise exception 'Template ID 17 is already assigned to another template.';
  end if;
end $$;

insert into public.invitation_templates (
  id, template_code, name, category, thumbnail_url, preview_url, is_active
) values (
  17,
  'tajmahal',
  'Tajmahal',
  'Indian',
  '/templates/tajmahal/assets/opening-poster.jpg',
  '/tajmahal',
  false
)
on conflict (template_code) do update set
  name = excluded.name,
  category = excluded.category,
  thumbnail_url = excluded.thumbnail_url,
  preview_url = excluded.preview_url,
  is_active = false,
  updated_at = now();

do $$ begin
  if exists (
    select 1 from public.invitation_templates
    where template_code = 'tajmahal' and id <> 17
  ) then
    raise exception 'Tajmahal is already assigned to a different template ID.';
  end if;
end $$;

commit;

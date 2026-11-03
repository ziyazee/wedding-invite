-- Adds Viah (Punjabi culture-neutral) template and backfills Mangal if missing.
begin;
insert into public.invitation_templates (id, template_code, name, category, thumbnail_url, preview_url, is_active)
values
  (15, 'mangal', 'Mangal', 'Hindu', '/templates/mangal/assets/gate/00-gate-p.webp', '/mangal', true),
  (16, 'viah', 'Viah', 'Punjabi', '/templates/viah/assets/gate/00-gate-p.webp', '/viah', true)
on conflict (template_code) do update set
  name = excluded.name, category = excluded.category,
  thumbnail_url = excluded.thumbnail_url, preview_url = excluded.preview_url,
  is_active = true, updated_at = now();
do $$ begin
  if exists (
    select 1 from (values (15,'mangal'),(16,'viah')) expected(id,code)
    join public.invitation_templates actual on actual.template_code=expected.code
    where actual.id<>expected.id
  ) then raise exception 'Template IDs conflict with the application catalog.';
  end if;
end $$;
commit;

-- Completes all six newer designs; also safe when the 202610210001 catalog
-- migration has already been applied. Run after the compact-ID migration.
begin;
insert into public.invitation_templates (id, template_code, name, category, thumbnail_url, preview_url, is_active)
values
  (9, 'maroon-letter', 'Maroon Letter', 'Muslim', '/maroon-letter/demo.webp', '/maroon-letter', true),
  (10, 'emerald-parchment', 'Emerald Parchment', 'Muslim', '/emerald-parchment/demo.webp', '/emerald-parchment', true),
  (11, 'royal-jodhpur', 'Royal Jodhpur', 'Hindu', '/shaadipath-t02/assets/layers/Herp Palace.webp', '/royal-jodhpur', true),
  (12, 'destination', 'Destination', 'Hindu', '/aamantran-destination/wedding/background_main.webp', '/destination-wedding', true),
  (13, 'raabta', 'Raabta', 'Muslim', '/aamantran-raabta/assets/mosque-scene.webp', '/raabta', true),
  (14, 'qubool', 'Qubool', 'Muslim', '/aamantran-qubool/assets/scene1/01-jaali-dawn.webp', '/qubool', true)
on conflict (template_code) do update set
  name = excluded.name, category = excluded.category,
  thumbnail_url = excluded.thumbnail_url, preview_url = excluded.preview_url,
  is_active = true, updated_at = now();
do $$ begin
  if exists (
    select 1 from (values (9,'maroon-letter'),(10,'emerald-parchment'),(11,'royal-jodhpur'),(12,'destination'),(13,'raabta'),(14,'qubool')) expected(id,code)
    join public.invitation_templates actual on actual.template_code=expected.code
    where actual.id<>expected.id
  ) then raise exception 'Template IDs conflict with the application catalog.';
  end if;
end $$;
commit;

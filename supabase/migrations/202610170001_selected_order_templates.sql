-- Keep the client order catalog aligned with the eight designs on the landing page.
insert into public.invitation_templates (id, template_code, name, category, thumbnail_url, preview_url) values
 (2,'mohadrahma','Mohad & Rahma','Muslim','/images/royal-grace/opening-poster.jpg','/mohadrahma'),
 (3,'embroidered-garden','Embroidered Garden','Garden','/design3/assets/embroidered-swans-hero-v2.png','/design3'),
 (5,'secret-garden','Secret Garden','Garden','/design5/assets/opened.jpg','/design5'),
 (6,'majestic','Majestic','Classic','/design6/assets/hero-poster-DkA1j00-.jpg','/design6'),
 (7,'bloom','Bloom','Garden','/design7/assets/hero-bg-RvVOmFvi.png','/design7'),
 (13,'artful-love-story','The Artful Love Story','Indian','/landing/artful-love-story-opening.jpg','/design13'),
 (14,'timeless-union','A Timeless Union','Hindu','/landing/timeless-union-opening.jpg','/arjunbhavana'),
 (18,'mandap-at-dusk','Mandap at Dusk','Hindu','/design18/preview.jpg','/design18')
on conflict (id) do update set
  template_code=excluded.template_code,
  name=excluded.name,
  category=excluded.category,
  thumbnail_url=excluded.thumbnail_url,
  preview_url=excluded.preview_url,
  is_active=true,
  updated_at=now();

update public.invitation_templates
set is_active=false, updated_at=now()
where id not in (2,3,5,6,7,13,14,18);

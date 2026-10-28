-- Align invitation_templates with the public/templates/ folder restructure.
-- Active folders renamed from /designN/ to /templates/{name}/
-- Testing folders renamed from /aamantran-*/ to /templates/{name}/
-- Deprecated folders moved to /templates/deprecated/designN/
-- Royal Grace, A Timeless Union, Artful Love Story thumbnails consolidated into /templates/
-- Also fixes template_code and name for ID 12 (destination-wedding).
begin;

-- ── Active templates: /designN/ → /templates/{name}/ ──

update public.invitation_templates
set thumbnail_url = '/templates/royal-grace/opening-poster.jpg',
    updated_at = now()
where id = 1 and thumbnail_url like '/images/royal-grace/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design6/', '/templates/majestic/'),
    updated_at = now()
where id = 2 and thumbnail_url like '/design6/%';

update public.invitation_templates
set thumbnail_url = '/templates/a-timeless-union/timeless-union-opening.jpg',
    updated_at = now()
where id = 3 and thumbnail_url = '/landing/timeless-union-opening.jpg';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design18/', '/templates/mandap-at-dusk/'),
    updated_at = now()
where id = 4 and thumbnail_url like '/design18/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design5/', '/templates/secret-garden/'),
    updated_at = now()
where id = 5 and thumbnail_url like '/design5/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design3/', '/templates/embroidered-garden/'),
    updated_at = now()
where id = 6 and thumbnail_url like '/design3/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design7/', '/templates/bloom/'),
    updated_at = now()
where id = 7 and thumbnail_url like '/design7/%';

update public.invitation_templates
set thumbnail_url = '/templates/the-artful-love-story/artful-love-story-opening.jpg',
    updated_at = now()
where id = 8 and thumbnail_url = '/landing/artful-love-story-opening.jpg';

-- ── Testing templates already at named paths: add /templates/ prefix ──

update public.invitation_templates
set thumbnail_url = '/templates' || thumbnail_url,
    updated_at = now()
where id in (9, 10, 11)
  and thumbnail_url not like '/templates/%';

-- ── Testing templates with renamed folders ──

update public.invitation_templates
set template_code = 'destination-wedding',
    name = 'Destination Wedding',
    thumbnail_url = replace(thumbnail_url, '/aamantran-destination/', '/templates/destination-wedding/'),
    updated_at = now()
where id = 12;

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/aamantran-raabta/', '/templates/raabta/'),
    updated_at = now()
where id = 13 and thumbnail_url like '/aamantran-raabta/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/aamantran-qubool/', '/templates/qubool/'),
    updated_at = now()
where id = 14 and thumbnail_url like '/aamantran-qubool/%';

-- ── Deprecated templates: /designN/ → /templates/deprecated/designN/ ──

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design4/',  '/templates/deprecated/design4/'),
    updated_at = now()
where id = 104 and thumbnail_url like '/design4/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design8/',  '/templates/deprecated/design8/'),
    updated_at = now()
where id = 108 and thumbnail_url like '/design8/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design9/',  '/templates/deprecated/design9/'),
    updated_at = now()
where id = 109 and thumbnail_url like '/design9/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design10/', '/templates/deprecated/design10/'),
    updated_at = now()
where id = 110 and thumbnail_url like '/design10/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design11/', '/templates/deprecated/design11/'),
    updated_at = now()
where id = 111 and thumbnail_url like '/design11/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design12/', '/templates/deprecated/design12/'),
    updated_at = now()
where id = 112 and thumbnail_url like '/design12/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design15/', '/templates/deprecated/design15/'),
    updated_at = now()
where id = 115 and thumbnail_url like '/design15/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design16/', '/templates/deprecated/design16/'),
    updated_at = now()
where id = 116 and thumbnail_url like '/design16/%';

update public.invitation_templates
set thumbnail_url = replace(thumbnail_url, '/design17/', '/templates/deprecated/design17/'),
    updated_at = now()
where id = 117 and thumbnail_url like '/design17/%';

commit;

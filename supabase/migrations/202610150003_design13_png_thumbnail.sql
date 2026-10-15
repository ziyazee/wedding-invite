update public.invitation_templates
set thumbnail_url = '/design13/assets/zBRd2fZShor1nxxKvdVKhKU.png',
    updated_at = now()
where id = 13
   or template_code = 'artful-love-story';

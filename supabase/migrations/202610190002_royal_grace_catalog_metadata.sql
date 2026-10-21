-- Keep the stored catalog metadata aligned with the current landing-page name.
update public.invitation_templates
set template_code = 'royal-grace',
    name = 'Royal Grace',
    preview_url = '/mohadrahma',
    updated_at = now()
where id = 1
  and template_code in ('mohadrahma', 'royal-grace');

update public.orders
set template_code = 'royal-grace'
where template_code = 'mohadrahma';

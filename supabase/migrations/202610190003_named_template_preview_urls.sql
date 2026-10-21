-- Give every retained catalog design a name-based testing URL. Existing routes
-- remain available as compatibility URLs in the application.
update public.invitation_templates
set preview_url = case template_code
  when 'royal-grace' then '/royal-grace'
  when 'mohadrahma' then '/royal-grace'
  when 'majestic' then '/majestic'
  when 'timeless-union' then '/a-timeless-union'
  when 'mandap-at-dusk' then '/mandap-at-dusk'
  when 'secret-garden' then '/secret-garden'
  when 'embroidered-garden' then '/embroidered-garden'
  when 'bloom' then '/bloom'
  when 'artful-love-story' then '/the-artful-love-story'
  when 'blossom-oud' then '/blossom-and-oud'
  when 'noor-courtyard' then '/noor'
  when 'sunehri' then '/sunehri'
  when 'yasmin' then '/yasmin'
  when 'maitri' then '/maitri'
  when 'kiran' then '/kiran'
  when 'ivory-arch' then '/ivory-arch'
  when 'sacred-mandap' then '/sacred-mandap'
  when 'gulabi-mandap' then '/gulabi-mandap'
  else preview_url
end,
updated_at = now()
where template_code in (
  'royal-grace', 'mohadrahma', 'majestic', 'timeless-union', 'mandap-at-dusk',
  'secret-garden', 'embroidered-garden', 'bloom', 'artful-love-story',
  'blossom-oud', 'noor-courtyard', 'sunehri', 'yasmin', 'maitri', 'kiran',
  'ivory-arch', 'sacred-mandap', 'gulabi-mandap'
);

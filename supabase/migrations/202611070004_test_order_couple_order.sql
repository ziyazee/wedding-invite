-- Keep test invitation URLs in the saved couple display order.
-- Existing reserved links remain unchanged; this trigger only runs on insert.
begin;

create or replace function public.initialize_test_order() returns trigger
language plpgsql set search_path = public, extensions as $$
declare couple_slug text;
begin
  couple_slug := left(regexp_replace(lower(
    case when new.form_data->'brideFirst' = 'true'::jsonb
      then new.bride_name || new.groom_name
      else new.groom_name || new.bride_name end
  ), '[^a-z0-9]', '', 'g'), 60);
  new.published_path := 'test-invite/' || coalesce(nullif(couple_slug, ''), 'invitation') || '-' || new.id::text;
  new.management_id := 'test-' || new.id::text || '-' ||
    translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_');
  return new;
end;
$$;
revoke all on function public.initialize_test_order() from public, anon, authenticated;

commit;

-- The public landing page uses the anon Supabase key and only needs active
-- catalog rows. Signed-in client tooling also needs inactive templates.
create policy "active templates visible publicly"
  on public.invitation_templates
  for select
  to anon
  using (is_active);

create policy "all templates visible to signed-in users"
  on public.invitation_templates
  for select
  to authenticated
  using (true);

grant select on public.invitation_templates to anon, authenticated;

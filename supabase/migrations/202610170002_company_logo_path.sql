-- Store the Supabase Storage object path for each company's logo.
alter table public.companies
  add column if not exists logo_path text;

-- Run before releasing the music-library frontend. Existing audio URLs remain valid.
begin;

create table public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120 and name = btrim(name)),
  category text not null check (category in ('Classic', 'Hindu', 'Muslim')),
  storage_path text unique,
  local_path text unique,
  created_at timestamptz not null default now(),
  constraint music_track_source check (
    num_nonnulls(storage_path, local_path) = 1
    and (storage_path is null or storage_path = 'tracks/' || id::text || '.mp3')
    and (local_path is null or local_path ~ '^/audios/[a-z0-9/_-]+[.]mp3$')
  )
);
alter table public.music_tracks enable row level security;
create policy "music catalogue is readable" on public.music_tracks
  for select to anon, authenticated using (true);
revoke all on public.music_tracks from anon, authenticated;
grant select on public.music_tracks to anon, authenticated;
grant all on public.music_tracks to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitation-music', 'invitation-music', true, 20971520, array['audio/mpeg'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins upload invitation music" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'invitation-music' and public.current_user_is_admin()
    and name ~ '^tracks/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.]mp3$'
  );
create policy "admins inspect invitation music" on storage.objects
  for select to authenticated using (bucket_id = 'invitation-music' and public.current_user_is_admin());
-- Downloads use the public bucket. No client overwrite/delete policy: saved
-- orders retain their audio even when the catalogue changes in a later phase.

create or replace function public.register_music_track(p_id uuid, p_name text, p_category text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  track public.music_tracks%rowtype;
  object_path text := 'tracks/' || p_id::text || '.mp3';
begin
  if auth.uid() is null or not public.current_user_is_admin() then
    raise exception 'Only administrators can add music.';
  end if;
  if p_id is null or p_name is null or char_length(btrim(p_name)) not between 1 and 120
    or p_category is null or p_category not in ('Classic', 'Hindu', 'Muslim') then
    raise exception 'Enter a song name and a valid category.';
  end if;
  if not exists (select 1 from storage.objects where bucket_id = 'invitation-music' and name = object_path) then
    raise exception 'Upload the MP3 before saving the song.';
  end if;
  insert into public.music_tracks (id, name, category, storage_path)
    values (p_id, btrim(p_name), p_category, object_path)
    on conflict (id) do nothing;
  select * into track from public.music_tracks where id = p_id;
  if track.name is distinct from btrim(p_name) or track.category is distinct from p_category
    or track.storage_path is distinct from object_path then
    raise exception 'This upload is already registered with different details.';
  end if;
  -- Retrying after a lost response returns the same row, without duplicates.
  return to_jsonb(track);
end;
$$;
revoke all on function public.register_music_track(uuid, text, text) from public, anon;
grant execute on function public.register_music_track(uuid, text, text) to authenticated;

-- Seed the current catalogue in place; no media copy or URL rewrite is needed.
insert into public.music_tracks (name, category, local_path) values
  ('Wedding Nasheed', 'Muslim', '/audios/muslim/wedding-nasheed.mp3'),
  ('Music', 'Classic', '/audios/general/music.mp3'),
  ('Template 02', 'Classic', '/audios/general/template02.mp3'),
  ('Bisara', 'Classic', '/audios/general/bisara.mp3'),
  ('Destination / Raabta / Qubool', 'Classic', '/audios/general/aamantran.mp3'),
  ('Blossom and Oud', 'Classic', '/audios/general/blossom-and-oud.mp3'),
  ('Autumn Wind', 'Classic', '/audios/general/autumn-wind.mp3'),
  ('Majestic Intro', 'Classic', '/audios/general/majestic-intro.mp3'),
  ('Bloom Wedding Music', 'Classic', '/audios/general/bloom-wedding.mp3'),
  ('A Timeless Union — Track 1', 'Classic', '/audios/general/timeless-union-1.mp3'),
  ('A Timeless Union — Track 2', 'Classic', '/audios/general/timeless-union-2.mp3'),
  ('Royal Grace', 'Classic', '/audios/general/royal-grace.mp3');

commit;

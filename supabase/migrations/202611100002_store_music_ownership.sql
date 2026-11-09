begin;

alter table public.music_tracks
  add column company_id bigint references public.companies(id) on delete cascade;

alter table public.music_tracks drop constraint music_track_source;
alter table public.music_tracks add constraint music_track_source check (
  num_nonnulls(storage_path, local_path) = 1
  and (
    (local_path is not null and company_id is null
      and local_path ~ '^/audios/[a-z0-9/_-]+[.]mp3$')
    or (storage_path = 'tracks/' || id::text || '.mp3' and company_id is null)
    or (company_id is not null
      and storage_path = 'companies/' || company_id::text || '/' || id::text || '.mp3')
  )
);

drop policy if exists "music catalogue is readable" on public.music_tracks;
create policy "stores read global and own music" on public.music_tracks
  for select to authenticated using (
    public.current_user_is_admin()
    or company_id is null
    or company_id = public.current_user_company_id()
  );
create policy "public reads global invitation music" on public.music_tracks
  for select to anon using (company_id is null);
grant select on public.music_tracks to anon;
grant select on public.music_tracks to authenticated;

create policy "stores upload own invitation music" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'invitation-music'
    and case
      when name ~ '^companies/[0-9]+/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.]mp3$'
      then split_part(name, '/', 2)::bigint = public.current_user_company_id()
      else false
    end
  );

create or replace function public.register_company_music_track(
  p_id uuid, p_name text, p_category text, p_company_id bigint
)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  track public.music_tracks%rowtype;
  object_path text := 'companies/' || p_company_id::text || '/' || p_id::text || '.mp3';
begin
  if auth.uid() is null or p_company_id is null
    or p_company_id is distinct from public.current_user_company_id() then
    raise exception 'You can only add music for your own store.';
  end if;
  if p_id is null or p_name is null or char_length(btrim(p_name)) not between 1 and 120
    or p_category is null or p_category not in ('Classic', 'Hindu', 'Muslim') then
    raise exception 'Enter a song name and a valid category.';
  end if;
  if not exists (
    select 1 from storage.objects
    where bucket_id = 'invitation-music' and name = object_path
  ) then
    raise exception 'Upload the MP3 before saving the song.';
  end if;
  insert into public.music_tracks (id, name, category, storage_path, company_id)
    values (p_id, btrim(p_name), p_category, object_path, p_company_id)
    on conflict (id) do nothing;
  select * into track from public.music_tracks where id = p_id;
  if track.name is distinct from btrim(p_name) or track.category is distinct from p_category
    or track.storage_path is distinct from object_path or track.company_id is distinct from p_company_id then
    raise exception 'This upload is already registered with different details.';
  end if;
  return to_jsonb(track);
end;
$$;
revoke all on function public.register_company_music_track(uuid, text, text, bigint) from public, anon;
grant execute on function public.register_company_music_track(uuid, text, text, bigint) to authenticated;

commit;

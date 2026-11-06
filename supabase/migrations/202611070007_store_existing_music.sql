-- Apply after 202611070006_music_library.sql. The admin UI copies the bytes;
-- this function switches a catalogue row only after its Storage object exists.
begin;

create or replace function public.store_existing_music_track(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  track public.music_tracks%rowtype;
  object_path text := 'tracks/' || p_id::text || '.mp3';
begin
  if auth.uid() is null or not public.current_user_is_admin() then
    raise exception 'Only administrators can store music.';
  end if;
  select * into track from public.music_tracks where id = p_id for update;
  if not found then raise exception 'This song was not found.'; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'invitation-music' and name = object_path) then
    raise exception 'Upload the MP3 before switching its storage location.';
  end if;
  if track.storage_path is null then
    update public.music_tracks set storage_path = object_path, local_path = null
      where id = p_id returning * into track;
  end if;
  return to_jsonb(track);
end;
$$;
revoke all on function public.store_existing_music_track(uuid) from public, anon;
grant execute on function public.store_existing_music_track(uuid) to authenticated;

commit;

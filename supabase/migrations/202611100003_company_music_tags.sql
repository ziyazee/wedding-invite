begin;

create table public.company_music_tags (
  id uuid primary key default gen_random_uuid(),
  company_id bigint not null references public.companies(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40 and name = btrim(name)),
  created_at timestamptz not null default now()
);
create unique index company_music_tags_name_ci_uidx
  on public.company_music_tags (company_id, lower(name));

alter table public.company_music_tags enable row level security;
create policy "stores read own music tags" on public.company_music_tags
  for select to authenticated using (
    public.current_user_is_admin() or company_id = public.current_user_company_id()
  );
grant select on public.company_music_tags to authenticated;

create or replace function public.create_company_music_tag(p_name text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  company bigint := public.current_user_company_id();
  tag public.company_music_tags%rowtype;
  label text := btrim(coalesce(p_name, ''));
begin
  if auth.uid() is null or company is null then
    raise exception 'A store account is required to add a music tag.';
  end if;
  if char_length(label) not between 1 and 40 then
    raise exception 'Enter a tag name up to 40 characters.';
  end if;
  if lower(label) in ('classic', 'hindu', 'muslim') then
    raise exception 'That tag is already available.';
  end if;
  insert into public.company_music_tags (company_id, name)
    values (company, label) on conflict do nothing;
  select * into tag from public.company_music_tags
    where company_id = company and lower(name) = lower(label);
  return to_jsonb(tag);
end;
$$;
revoke all on function public.create_company_music_tag(text) from public, anon;
grant execute on function public.create_company_music_tag(text) to authenticated;

alter table public.music_tracks drop constraint music_tracks_category_check;
alter table public.music_tracks add constraint music_tracks_category_check check (
  char_length(category) between 1 and 40 and category = btrim(category)
);

create or replace function public.enforce_music_track_category()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if new.company_id is null then
    if new.category not in ('Classic', 'Hindu', 'Muslim') then
      raise exception 'Global music must use a global category.';
    end if;
  elsif new.category not in ('Classic', 'Hindu', 'Muslim') and not exists (
    select 1 from public.company_music_tags tag
    where tag.company_id = new.company_id and tag.name = new.category
  ) then
    raise exception 'This music tag does not belong to the store.';
  end if;
  return new;
end;
$$;
create trigger music_tracks_enforce_category
  before insert or update of company_id, category on public.music_tracks
  for each row execute function public.enforce_music_track_category();

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
    or p_category is null or char_length(btrim(p_category)) not between 1 and 40
    or p_category <> btrim(p_category) then
    raise exception 'Enter a song name and a valid music tag.';
  end if;
  if p_category not in ('Classic', 'Hindu', 'Muslim') and not exists (
    select 1 from public.company_music_tags
    where company_id = p_company_id and name = p_category
  ) then
    raise exception 'This music tag does not belong to your store.';
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

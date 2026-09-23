create or replace function public.get_profile_challenge_count(profile_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.challenge_completions
  where member_id = profile_id;
$$;

grant execute on function public.get_profile_challenge_count(uuid) to authenticated;

drop policy if exists "Members can view own profile" on public.profiles;
drop policy if exists "Authenticated members can view profiles" on public.profiles;
create policy "Authenticated members can view profiles" on public.profiles
for select to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Members can upload own avatar" on storage.objects;
create policy "Members can upload own avatar" on storage.objects
for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Members can update own avatar" on storage.objects;
create policy "Members can update own avatar" on storage.objects
for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Members can delete own avatar" on storage.objects;
create policy "Members can delete own avatar" on storage.objects
for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Members can create own profile" on public.profiles;
create policy "Members can create own profile" on public.profiles
for insert to authenticated
with check (id = auth.uid());
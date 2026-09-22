alter table public.profiles
  add column if not exists username text,
  add column if not exists bio text not null default '';

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null and username <> '';
-- MileZero database schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  miles integer not null default 0 check (miles >= 0),
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  frequency text not null check (frequency in ('Daily', 'Weekly', 'Monthly', 'Special')),
  category text not null,
  miles_reward integer not null default 0 check (miles_reward >= 0),
  requires_proof boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.proof_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.challenge_completions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  proof_submission_id uuid references public.proof_submissions(id) on delete set null,
  completed_at timestamptz not null default timezone('utc', now()),
  unique (challenge_id, member_id)
);

create index if not exists challenges_active_frequency_idx on public.challenges (is_active, frequency);
create index if not exists proof_submissions_status_idx on public.proof_submissions (status);
create index if not exists proof_submissions_member_idx on public.proof_submissions (member_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.proof_submissions enable row level security;
alter table public.challenge_completions enable row level security;

drop policy if exists "Members can view own profile" on public.profiles;
create policy "Members can view own profile" on public.profiles
for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "Members can update own profile" on public.profiles;
create policy "Members can update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Members can view active challenges" on public.challenges;
create policy "Members can view active challenges" on public.challenges
for select to authenticated using (is_active = true or public.is_admin());

drop policy if exists "Admins can create challenges" on public.challenges;
create policy "Admins can create challenges" on public.challenges
for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update challenges" on public.challenges;
create policy "Admins can update challenges" on public.challenges
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete challenges" on public.challenges;
create policy "Admins can delete challenges" on public.challenges
for delete to authenticated using (public.is_admin());

drop policy if exists "Members can view own proofs" on public.proof_submissions;
create policy "Members can view own proofs" on public.proof_submissions
for select to authenticated using (member_id = auth.uid() or public.is_admin());

drop policy if exists "Members can submit own proofs" on public.proof_submissions;
create policy "Members can submit own proofs" on public.proof_submissions
for insert to authenticated with check (member_id = auth.uid());

drop policy if exists "Admins can review proofs" on public.proof_submissions;
create policy "Admins can review proofs" on public.proof_submissions
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Members can view own completions" on public.challenge_completions;
create policy "Members can view own completions" on public.challenge_completions
for select to authenticated using (member_id = auth.uid() or public.is_admin());

drop policy if exists "Members can create own completions" on public.challenge_completions;
create policy "Members can create own completions" on public.challenge_completions
for insert to authenticated with check (member_id = auth.uid());

drop policy if exists "Admins can manage completions" on public.challenge_completions;
create policy "Admins can manage completions" on public.challenge_completions
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict (id) do nothing;

drop policy if exists "Members can upload proof files" on storage.objects;
create policy "Members can upload proof files" on storage.objects
for insert to authenticated
with check (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Members can view own proof files" on storage.objects;
create policy "Members can view own proof files" on storage.objects
for select to authenticated
using (bucket_id = 'proofs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists "Admins can delete proof files" on storage.objects;
create policy "Admins can delete proof files" on storage.objects
for delete to authenticated using (bucket_id = 'proofs' and public.is_admin());

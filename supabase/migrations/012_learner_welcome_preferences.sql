-- Optional learner welcome preferences. Existing auth.users, profiles,
-- submissions and XP remain untouched. No backfill of fictitious preferences.
create table public.learner_preferences (
  learner_id uuid primary key references public.profiles(id) on delete cascade,
  preferred_name text not null check (char_length(btrim(preferred_name)) between 2 and 60),
  goal text not null check (goal in ('first_site','web_app','professional')),
  experience text not null check (experience in ('beginner','some','practiced')),
  minutes_per_day integer not null check (minutes_per_day in (30,60,90,120)),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.learner_preferences enable row level security;
create policy learner_preferences_read on public.learner_preferences
for select to authenticated
using (learner_id=(select auth.uid()) or (select public.is_trainer()));
create policy learner_preferences_create on public.learner_preferences
for insert to authenticated
with check (
 learner_id=(select auth.uid())
 and exists(select 1 from public.profiles p
            where p.id=(select auth.uid()) and p.role='learner')
);
create policy learner_preferences_update on public.learner_preferences
for update to authenticated
using (learner_id=(select auth.uid()))
with check (
 learner_id=(select auth.uid())
 and exists(select 1 from public.profiles p
            where p.id=(select auth.uid()) and p.role='learner')
);
revoke all on public.learner_preferences from anon;
revoke delete on public.learner_preferences from authenticated;
grant select,insert,update on public.learner_preferences to authenticated;

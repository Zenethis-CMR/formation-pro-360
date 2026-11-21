-- Formation Pro 360: private in-app coaching notes.
-- Notifications remain inside the authenticated platform; no emails or SMS are sent.
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete restrict,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 10 and 1200),
  created_at timestamptz not null default now()
);
create index if not exists coach_messages_learner_time on public.coach_messages(learner_id,created_at desc);
create index if not exists coach_messages_trainer_time on public.coach_messages(trainer_id,created_at desc);
alter table public.coach_messages enable row level security;
create policy coach_messages_read on public.coach_messages for select to authenticated
  using (learner_id=(select auth.uid()) or (select public.is_trainer()));
create policy coach_messages_create on public.coach_messages for insert to authenticated
  with check (
    trainer_id=(select auth.uid())
    and (select public.is_trainer())
    and exists (
      select 1 from public.profiles p where p.id=learner_id and p.role='learner'
    )
  );
revoke update,delete on public.coach_messages from anon,authenticated;
revoke insert on public.coach_messages from anon;
grant select,insert on public.coach_messages to authenticated;

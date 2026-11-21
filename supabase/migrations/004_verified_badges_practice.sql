-- Gamification based on verified learning, not on arbitrary client-side XP.
-- Badges are granted only after an approved submission inserts an XP ledger entry.
create table if not exists public.badges (
  slug text primary key check (slug ~ '^[a-z0-9_]+$'),
  title text not null,
  description text not null,
  icon text not null,
  required_missions integer not null unique check (required_missions between 1 and 100)
);

create table if not exists public.learner_badges (
  learner_id uuid not null references public.profiles(id) on delete cascade,
  badge_slug text not null references public.badges(slug) on delete restrict,
  awarded_at timestamptz not null default now(),
  primary key (learner_id, badge_slug)
);

insert into public.badges(slug,title,description,icon,required_missions) values
('first_delivery','Première victoire','Une première mission évaluée et validée.','badge-check',1),
('project_starter','Créateur en action','Deux livrables validés par le formateur.','rocket',2),
('web_foundations','Fondations solides','Quatre livrables pratiques validés.','code-2',4),
('halfway_builder','Cap de mi-parcours','Huit missions validées sur le parcours.','medal',8),
('consistent_builder','Constructeur régulier','Douze livrables validés.','flame',12),
('final_creator','Créateur de produit','Seize missions validées : un parcours complet.','trophy',16)
on conflict (slug) do nothing;

create function public.award_verified_badges()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.learner_badges(learner_id,badge_slug)
    select new.learner_id, b.slug
    from public.badges b
    where b.required_missions <= (
      select count(*) from public.xp_ledger x where x.learner_id = new.learner_id
    )
    on conflict (learner_id,badge_slug) do nothing;
  return new;
end;
$$;
create trigger award_verified_badges_on_xp
after insert on public.xp_ledger
for each row execute function public.award_verified_badges();

-- Backfill existing validated progress without awarding additional XP.
insert into public.learner_badges(learner_id,badge_slug)
select x.learner_id, b.slug
from (select learner_id,count(*) as n from public.xp_ledger group by learner_id) x
join public.badges b on b.required_missions <= x.n
on conflict do nothing;

-- A daily practice check-in reflects a self-declared practice session, not grading or XP.
-- Cameroon time is explicitly used for calendar-day boundaries.
create table if not exists public.practice_checkins (
  learner_id uuid not null references public.profiles(id) on delete cascade,
  practice_date date not null default (timezone('Africa/Douala',now()))::date,
  created_at timestamptz not null default now(),
  primary key (learner_id,practice_date)
);
create index if not exists practice_checkins_recent on public.practice_checkins(practice_date desc);

alter table public.badges enable row level security;
alter table public.learner_badges enable row level security;
alter table public.practice_checkins enable row level security;

create policy badges_read on public.badges for select to authenticated using (true);
create policy learner_badges_read on public.learner_badges for select to authenticated
using (learner_id=(select auth.uid()) or (select public.is_trainer()));
create policy practice_checkins_read on public.practice_checkins for select to authenticated
using (learner_id=(select auth.uid()) or (select public.is_trainer()));
create policy practice_checkins_insert on public.practice_checkins for insert to authenticated
with check (
  learner_id=(select auth.uid())
  and practice_date=(timezone('Africa/Douala',now()))::date
  and exists (select 1 from public.profiles p
    where p.id=(select auth.uid()) and p.role='learner')
);

-- Clients may never mint a badge directly or alter prior practice history.
revoke insert,update,delete on public.badges from anon, authenticated;
revoke insert,update,delete on public.learner_badges from anon, authenticated;
revoke update,delete on public.practice_checkins from anon, authenticated;
revoke all on function public.award_verified_badges() from public, anon, authenticated;

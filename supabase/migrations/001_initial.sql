-- Formation Pro 360: Supabase PostgreSQL schema, access policies, and grading.
-- Apply once in a NEW Supabase project. Do not execute in a database containing user data
-- without reviewing the migration, constraints and privileges.
create extension if not exists pgcrypto;
create type public.app_role as enum ('learner', 'trainer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'learner',
  created_at timestamptz not null default now()
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 110),
  domain text not null check (char_length(domain) between 2 and 80),
  week integer not null check (week between 1 and 52),
  description text not null check (char_length(description) between 10 and 1500),
  deliverable text not null check (char_length(deliverable) between 3 and 500),
  objectives text[] not null default '{}',
  duration text not null default 'À définir',
  xp integer not null check (xp between 10 and 1000),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.mission_prerequisites (
  mission_id uuid not null references public.missions(id) on delete cascade,
  prerequisite_id uuid not null references public.missions(id) on delete restrict,
  primary key (mission_id, prerequisite_id),
  check (mission_id <> prerequisite_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete restrict,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  url text not null check (char_length(url) between 10 and 800 and url ~* '^https?://'),
  note text not null default '' check (char_length(note) <= 1200),
  status text not null default 'pending' check (status in ('pending','changes_requested','approved')),
  score integer check (score between 0 and 100),
  feedback text check (char_length(feedback) <= 1500),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check ((status='pending' and score is null and reviewed_by is null and reviewed_at is null)
      or (status <> 'pending' and score is not null and reviewed_by is not null and reviewed_at is not null))
);
create index submissions_learner_mission_time on public.submissions(learner_id, mission_id, created_at desc);
create index submissions_pending on public.submissions(status, created_at) where status='pending';

create table public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete restrict,
  submission_id uuid not null references public.submissions(id) on delete restrict,
  xp integer not null check (xp > 0),
  awarded_at timestamptz not null default now(),
  unique (learner_id, mission_id),
  unique (submission_id)
);

-- Role is assigned by a database trigger; clients may not upgrade themselves.
create function public.on_auth_user_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, role) values (new.id, 'learner');
  return new;
end;
$$;
create trigger auth_user_created after insert on auth.users
for each row execute function public.on_auth_user_created();

-- Only the owner can grant the trainer role, via reviewed SQL/admin console.
-- Avoid recursive RLS checks by using a security-definer role helper.
create function public.is_trainer()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='trainer');
$$;

create function public.validate_submission()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.learner_id <> auth.uid()
     or not exists (select 1 from public.profiles p where p.id=new.learner_id and p.role='learner')
  then
    raise exception 'Not permitted to submit for this learner';
  end if;
  if not exists (select 1 from public.missions m where m.id=new.mission_id and m.published)
  then
    raise exception 'Mission not published';
  end if;
  if exists(
    select 1 from public.mission_prerequisites req
    where req.mission_id = new.mission_id
      and not exists(
        select 1 from public.xp_ledger xp
        where xp.learner_id = new.learner_id and xp.mission_id=req.prerequisite_id
      )
  ) then
    raise exception 'Prerequisite mission not approved';
  end if;
  if exists(
    select 1 from public.submissions s
    where s.learner_id = new.learner_id and s.mission_id = new.mission_id
      and s.status in ('pending','approved')
  ) then
    raise exception 'Mission already submitted or approved';
  end if;
  new.status := 'pending';
  new.score := null;
  new.feedback := null;
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;
create trigger validate_submission_before_insert
before insert on public.submissions
for each row execute function public.validate_submission();

create function public.review_submission(
  p_submission_id uuid, p_score integer, p_feedback text
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_submission public.submissions%rowtype;
  v_xp integer;
begin
  if not public.is_trainer() then raise exception 'Trainer permission required'; end if;
  if p_score is null or p_score not between 0 and 100 then raise exception 'Invalid score'; end if;
  if char_length(trim(coalesce(p_feedback,''))) < 3 or char_length(p_feedback)>1500
  then raise exception 'Feedback required'; end if;

  select * into v_submission from public.submissions
    where id=p_submission_id and status='pending' for update;
  if not found then raise exception 'Pending submission not found'; end if;

  update public.submissions
    set status = case when p_score >= 80 then 'approved' else 'changes_requested' end,
        score=p_score, feedback=trim(p_feedback),
        reviewed_by=auth.uid(), reviewed_at=now()
    where id=p_submission_id;

  if p_score >= 80 then
    select m.xp into v_xp from public.missions m where m.id=v_submission.mission_id;
    insert into public.xp_ledger(learner_id,mission_id,submission_id,xp)
      values(v_submission.learner_id,v_submission.mission_id,p_submission_id,v_xp)
      on conflict (learner_id, mission_id) do nothing;
  end if;
end;
$$;

-- Deny public role execution of functions and expose only intended RPC methods.
revoke all on function public.on_auth_user_created() from public, anon, authenticated;
revoke all on function public.validate_submission() from public, anon, authenticated;
revoke all on function public.is_trainer() from public, anon;
grant execute on function public.is_trainer() to authenticated;
revoke all on function public.review_submission(uuid, integer, text) from public, anon;
grant execute on function public.review_submission(uuid, integer, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.mission_prerequisites enable row level security;
alter table public.submissions enable row level security;
alter table public.xp_ledger enable row level security;

create policy profiles_read on public.profiles for select to authenticated
using (id=auth.uid() or public.is_trainer());
-- No direct profile inserts or updates; the auth trigger provisions learners.

create policy missions_read on public.missions for select to authenticated
using (published or public.is_trainer());
create policy missions_create on public.missions for insert to authenticated
with check (public.is_trainer());
create policy missions_update on public.missions for update to authenticated
using (public.is_trainer()) with check(public.is_trainer());

create policy prereqs_read on public.mission_prerequisites for select to authenticated
using (true);
create policy prereqs_insert on public.mission_prerequisites for insert to authenticated
with check(public.is_trainer());
create policy prereqs_delete on public.mission_prerequisites for delete to authenticated
using (public.is_trainer());

create policy submissions_read on public.submissions for select to authenticated
using (learner_id=auth.uid() or public.is_trainer());
create policy submissions_create on public.submissions for insert to authenticated
with check (learner_id=auth.uid() and status='pending');
-- Reviews are only written by the privileged RPC; clients cannot update submissions.

create policy xp_read on public.xp_ledger for select to authenticated
using (learner_id=auth.uid() or public.is_trainer());
-- XP inserts and edits are only performed by the privileged RPC.

-- Basic initial curriculum, stored server-side instead of in browser localStorage.
insert into public.missions(title,domain,week,description,deliverable,objectives,duration,xp,published) values
('Créer une page HTML structurée','Développement web',1,
 'Construire une page de présentation sémantique, claire et accessible.',
 'Lien vers le code et une démonstration',array['HTML sémantique','Titres accessibles','Formulaires simples'],'2–3 h',100,true),
('Transformer la page en interface responsive','Design & CSS',1,
 'Concevoir une interface cohérente sur téléphone et ordinateur.',
 'Lien vers la page responsive',array['Flexbox et Grid','Typographie','Approche mobile'],'4 h',150,true),
('Programmer une liste de tâches','JavaScript',2,
 'Ajouter, terminer et supprimer des tâches sans bibliothèque UI.',
 'Lien de démonstration et README',array['Fonctions','Événements DOM','Gestion des erreurs'],'5 h',200,true),
('Sauvegarder les tâches','Produit & données',2,
 'Conserver les tâches au rafraîchissement et documenter les limites du stockage local.',
 'Lien de démonstration et tests',array['localStorage','JSON','Tests'],'4 h',250,true);

insert into public.mission_prerequisites(mission_id,prerequisite_id)
select m.id, p.id from public.missions m join public.missions p on
(m.title='Transformer la page en interface responsive' and p.title='Créer une page HTML structurée')
or (m.title='Programmer une liste de tâches' and p.title='Transformer la page en interface responsive')
or (m.title='Sauvegarder les tâches' and p.title='Programmer une liste de tâches');

-- Existing auth users (if this is not a fresh project) can be given profiles:
insert into public.profiles(id) select id from auth.users on conflict (id) do nothing;

-- First trainer bootstrap (MANUAL, after this user has signed in for the first time):
-- update public.profiles set role='trainer'
-- where id=(select id from auth.users where email='YOUR_TRAINER_EMAIL');

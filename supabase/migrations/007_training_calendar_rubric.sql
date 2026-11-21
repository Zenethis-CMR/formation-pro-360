-- Formation Pro 360: paced curriculum and criterion-based, transactional reviews.
-- No fabricated training start date: the trainer chooses it explicitly.
create table if not exists public.training_settings (
  id boolean primary key default true check (id = true),
  start_date date,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);
insert into public.training_settings(id,start_date) values(true,null)
on conflict(id) do nothing;
alter table public.training_settings enable row level security;
create policy training_settings_read on public.training_settings for select to authenticated
  using(true);
create policy training_settings_update on public.training_settings for update to authenticated
  using ((select public.is_trainer()))
  with check ((select public.is_trainer()));
revoke insert,delete on public.training_settings from anon,authenticated;

create table if not exists public.submission_assessments (
  submission_id uuid primary key references public.submissions(id) on delete cascade,
  criterion_scores jsonb not null check (jsonb_typeof(criterion_scores) = 'array' and jsonb_array_length(criterion_scores) = 4),
  total_score integer not null check (total_score between 0 and 100),
  reviewer_id uuid not null references public.profiles(id),
  reviewed_at timestamptz not null default now()
);
alter table public.submission_assessments enable row level security;
create policy submission_assessments_read on public.submission_assessments for select to authenticated
  using (
    exists(
      select 1 from public.submissions s
      where s.id=submission_id and (
        s.learner_id=(select auth.uid()) or (select public.is_trainer())
      )
    )
  );
revoke insert,update,delete on public.submission_assessments from anon,authenticated;

-- Read-only to learners; trainer-created metadata is synchronized only via server actions.
create or replace function public.review_submission_with_rubric(
  p_submission_id uuid, p_scores jsonb, p_feedback text
) returns integer
language plpgsql security definer set search_path=''
as $$
declare
  v_submission public.submissions%rowtype;
  v_rubric jsonb;
  v_score jsonb;
  v_total integer := 0;
  v_points integer;
begin
  if not public.is_trainer() then
    raise exception 'Trainer permission required';
  end if;

  select * into v_submission
  from public.submissions
  where id=p_submission_id and status='pending'
  for update;
  if not found then raise exception 'Pending submission not found'; end if;

  select g.rubric into v_rubric from public.mission_guides g
  where g.mission_id=v_submission.mission_id;

  if v_rubric is null or jsonb_typeof(v_rubric)<>'array'
     or jsonb_array_length(v_rubric)<>4
     or p_scores is null or jsonb_typeof(p_scores)<>'array'
     or jsonb_array_length(p_scores)<>4 then
    raise exception 'Four criterion scores are required';
  end if;

  for v_score in select value from jsonb_array_elements(p_scores) as t(value) loop
    if jsonb_typeof(v_score)<>'number' or (v_score::text !~ '^(0|[1-9][0-9]*)$') then
      raise exception 'Criterion score must be an integer between 0 and 25';
    end if;
    v_points := (v_score #>> '{}')::integer;
    if v_points<0 or v_points>25 then
      raise exception 'Criterion score must be between 0 and 25';
    end if;
    v_total := v_total + v_points;
  end loop;

  -- This function already protects reviewer permissions, locks the submission,
  -- and awards XP atomically for a passing grade.
  perform public.review_submission(p_submission_id,v_total,p_feedback);

  insert into public.submission_assessments(
    submission_id, criterion_scores, total_score, reviewer_id
  ) values (p_submission_id,p_scores,v_total,auth.uid());
  return v_total;
end;
$$;
revoke all on function public.review_submission_with_rubric(uuid,jsonb,text) from public,anon;
grant execute on function public.review_submission_with_rubric(uuid,jsonb,text) to authenticated;

create index if not exists submission_assessments_reviewer_idx
  on public.submission_assessments(reviewer_id);

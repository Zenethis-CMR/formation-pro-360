-- Authoring tools for trainers. Both actions respect the existing RLS policies.
-- A new mission and its optional prerequisite are written in one transaction.
create or replace function public.create_trainer_mission(
  p_title text,p_domain text,p_description text,p_deliverable text,
  p_week integer,p_xp integer,p_prerequisite_id uuid default null
) returns uuid
language plpgsql security invoker set search_path=''
as $$
declare v_new_id uuid;
begin
  if not public.is_trainer() then raise exception 'Trainer required'; end if;
  if char_length(btrim(coalesce(p_title,''))) not between 3 and 110 or
     char_length(btrim(coalesce(p_domain,''))) not between 2 and 80 or
     char_length(btrim(coalesce(p_description,''))) not between 10 and 1500 or
     char_length(btrim(coalesce(p_deliverable,''))) not between 3 and 500 or
     p_week not between 1 and 8 or p_xp not between 10 and 1000
  then raise exception 'Invalid mission values'; end if;
  if p_prerequisite_id is not null and not exists(
    select 1 from public.missions m
    where m.id=p_prerequisite_id and m.published and m.week<=p_week
  ) then raise exception 'Prerequisite must be a published mission from this or a prior week'; end if;

  insert into public.missions(title,domain,description,deliverable,week,xp,
    objectives,duration,published)
  values (btrim(p_title),btrim(p_domain),btrim(p_description),btrim(p_deliverable),
    p_week,p_xp,array[]::text[],'À définir',false)
  returning id into v_new_id;
  if p_prerequisite_id is not null then
    insert into public.mission_prerequisites(mission_id,prerequisite_id)
    values (v_new_id,p_prerequisite_id);
  end if;
  return v_new_id;
end;
$$;
revoke all on function public.create_trainer_mission(text,text,text,text,integer,integer,uuid) from public,anon;
grant execute on function public.create_trainer_mission(text,text,text,text,integer,integer,uuid) to authenticated;

-- Draft guides are trainer-managed. Published guides are immutable here, so
-- grading rubrics cannot silently change after a learner has submitted work.
drop policy if exists mission_guides_read on public.mission_guides;
create policy mission_guides_read on public.mission_guides for select to authenticated
  using (exists (
    select 1 from public.missions m where m.id=mission_id
    and (m.published or (select public.is_trainer()))
  ));
create policy mission_guides_author_insert on public.mission_guides for insert to authenticated
  with check (
    (select public.is_trainer()) and exists(
      select 1 from public.missions m where m.id=mission_id and not m.published
    )
  );
create policy mission_guides_author_update on public.mission_guides for update to authenticated
  using (
    (select public.is_trainer()) and exists(
      select 1 from public.missions m where m.id=mission_id and not m.published
    )
  )
  with check (
    (select public.is_trainer()) and exists(
      select 1 from public.missions m where m.id=mission_id and not m.published
    )
  );
grant insert,update on public.mission_guides to authenticated;

-- Authoring must always have four explicit criteria and exactly four
-- detailed steps matching the shape expected by the learner interface.
alter table public.mission_guides
  add constraint mission_guides_four_criteria check(jsonb_array_length(rubric)=4);

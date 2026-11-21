-- Repair an existing JSON shape mismatch without deleting learner data.
-- Original seed stored steps as [title,instruction,deliverable] arrays.
-- Next.js requires {title,instruction,deliverable} objects.
update public.mission_guides g
set steps = (
  select jsonb_agg(
    jsonb_build_object(
      'title', part.item->>0,
      'instruction', part.item->>1,
      'deliverable', part.item->>2
    ) order by part.ordinality
  )
  from jsonb_array_elements(g.steps) with ordinality as part(item, ordinality)
)
where jsonb_typeof(g.steps->0)='array'
  and not exists(
    select 1 from jsonb_array_elements(g.steps) as item
    where jsonb_typeof(item) <> 'array' or jsonb_array_length(item) <> 3
  );

-- Validate expected structure for newly authored guided missions.
alter table public.mission_guides
  add constraint mission_guide_steps_are_objects
  check (
    jsonb_typeof(steps->0)='object'
    and steps->0 ? 'title'
    and steps->0 ? 'instruction'
    and steps->0 ? 'deliverable'
  );

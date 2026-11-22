-- Intensive Formation Pro 360 schedules, preserving historic optional onboarding.
-- Existing preferences are not fabricated or overwritten. NULL regular_days
-- means the learner has not yet confirmed a new weekly schedule.
alter table public.learner_preferences
  add column if not exists regular_days integer[],
  add column if not exists optional_days integer[] not null default '{}'::integer[];

alter table public.learner_preferences
  drop constraint if exists learner_preferences_minutes_per_day_check;

-- Old 30/60/90/120 minute choices survive only on legacy unscheduled rows.
-- New scheduling choices require at least 3 weekly regular days, 5h minimum.
alter table public.learner_preferences
  add constraint learner_preferences_intensive_schedule_check
  check (
    (
      regular_days is null
      and cardinality(optional_days)=0
      and minutes_per_day in (30,60,90,120)
    )
    or (
      regular_days is not null
      and minutes_per_day in (300,360,480,600)
      and cardinality(regular_days) between 3 and 7
      and cardinality(optional_days) between 0 and 4
      and regular_days <@ array[1,2,3,4,5,6,7]::integer[]
      and optional_days <@ array[1,2,3,4,5,6,7]::integer[]
      and not (regular_days && optional_days)
    )
  );

comment on column public.learner_preferences.regular_days is
  'ISO weekdays 1=Monday to 7=Sunday for recurring intensive sessions, three or more days.';
comment on column public.learner_preferences.optional_days is
  'Additional optional ISO weekdays; disjoint from regular_days.';
comment on column public.learner_preferences.minutes_per_day is
  'Target intensive working session duration in minutes, 300/360/480/600 for new schedules. Legacy onboarding values are preserved until voluntarily updated.';

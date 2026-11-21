-- Supabase database linter: cover the remaining foreign-key lookups.
create index if not exists learner_badges_by_slug_idx
  on public.learner_badges(badge_slug);
create index if not exists training_settings_updated_by_idx
  on public.training_settings(updated_by);

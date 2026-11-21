-- Indexes used by mission checks, trainer review queues, and learner progression.
create index if not exists idx_mission_prerequisites_prerequisite on public.mission_prerequisites(prerequisite_id);
create index if not exists idx_submissions_mission on public.submissions(mission_id);
create index if not exists idx_submissions_reviewer on public.submissions(reviewed_by);
create index if not exists idx_xp_ledger_mission on public.xp_ledger(mission_id);

-- Avoid recomputing a stable auth lookup for each scanned row.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated
  using (id=(select auth.uid()) or (select public.is_trainer()));
drop policy if exists missions_read on public.missions;
create policy missions_read on public.missions for select to authenticated
  using (published or (select public.is_trainer()));
drop policy if exists missions_create on public.missions;
create policy missions_create on public.missions for insert to authenticated
  with check ((select public.is_trainer()));
drop policy if exists missions_update on public.missions;
create policy missions_update on public.missions for update to authenticated
  using ((select public.is_trainer())) with check ((select public.is_trainer()));
drop policy if exists prereqs_insert on public.mission_prerequisites;
create policy prereqs_insert on public.mission_prerequisites for insert to authenticated
  with check ((select public.is_trainer()));
drop policy if exists prereqs_delete on public.mission_prerequisites;
create policy prereqs_delete on public.mission_prerequisites for delete to authenticated
  using ((select public.is_trainer()));
drop policy if exists submissions_read on public.submissions;
create policy submissions_read on public.submissions for select to authenticated
  using (learner_id=(select auth.uid()) or (select public.is_trainer()));
drop policy if exists submissions_create on public.submissions;
create policy submissions_create on public.submissions for insert to authenticated
  with check (learner_id=(select auth.uid()) and status='pending');
drop policy if exists xp_read on public.xp_ledger;
create policy xp_read on public.xp_ledger for select to authenticated
  using (learner_id=(select auth.uid()) or (select public.is_trainer()));
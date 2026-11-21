-- Defense in depth: privileged actions remain behind server-reviewed functions.
-- Existing RLS policies already prevent these writes. The explicit grants keep the API surface small.
revoke insert,update,delete on public.xp_ledger from anon, authenticated;
revoke insert,update,delete on public.profiles from anon, authenticated;
revoke update,delete on public.submissions from anon, authenticated;
-- The formateur mission creation and learner submission inserts remain granted
-- and are still governed by existing RLS policies and server validation.

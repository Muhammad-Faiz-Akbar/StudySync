-- StudySync 0003_events_self_read
-- `login_succeeded` needs to know whether the user has logged in before (T-003).
-- Without a select policy the client cannot read its own events, which would force
-- the service role into the login path. Keep it scoped to the user's own rows.

create policy events_select_own on public.events for select to authenticated
  using (user_id = auth.uid());

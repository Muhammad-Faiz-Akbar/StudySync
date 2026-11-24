-- StudySync 0002_harden_rls
-- Hardening for findings found while reviewing 0001_init.sql (T-002).
-- Run AFTER 0001_init.sql. Never edit an applied migration; add a new one instead.
-- Requires PostgreSQL 15+ (security_invoker views), which Supabase provides.

-- ============ 1. public_profiles must respect RLS and discoverable ============
-- A view owned by the migration role bypasses RLS unless security_invoker is on.
create or replace view public.public_profiles as
  select id, display_name, study_program, entry_year, bio, study_mode
  from public.profiles
  where onboarding_completed_at is not null
    and discoverable;

alter view public.public_profiles set (security_invoker = true);

-- Column-level grants: contacts and is_demo stay unreadable by any client.
revoke select on public.profiles from authenticated;
grant select (
  id, display_name, study_program, entry_year, bio, study_mode, discoverable,
  availability_reveal, onboarding_completed_at, created_at, updated_at
) on public.profiles to authenticated;

-- Discoverable peers may read public profile fields (contact columns are not granted).
create policy profiles_select_public on public.profiles for select to authenticated
  using (onboarding_completed_at is not null and discoverable);

-- ============ 2. Only hosts or open sessions accept new participants ============
create or replace function public.is_open_session(sid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.study_sessions s
    where s.id = sid and s.is_open and s.status = 'scheduled'
  );
$$;

revoke all on function public.is_open_session(uuid) from public, anon;
grant execute on function public.is_open_session(uuid) to authenticated;
revoke all on function public.is_session_host(uuid) from public, anon;
grant execute on function public.is_session_host(uuid) to authenticated;
revoke all on function public.is_session_participant(uuid) from public, anon;
grant execute on function public.is_session_participant(uuid) to authenticated;

drop policy participants_insert on public.session_participants;
create policy participants_insert on public.session_participants for insert to authenticated
  with check (
    public.is_session_host(session_id)
    or (user_id = auth.uid() and public.is_open_session(session_id))
  );

-- ============ 3. Connections: parties and course are immutable ============
create or replace function public.enforce_connection_immutable()
returns trigger language plpgsql as $$
begin
  if new.requester_id <> old.requester_id
    or new.addressee_id <> old.addressee_id
    or new.course_id <> old.course_id
    or new.created_at <> old.created_at then
    raise exception 'connection parties and course are immutable' using errcode = '42501';
  end if;

  if old.status <> 'pending' and new.status <> old.status then
    raise exception 'connection status is final' using errcode = '42501';
  end if;

  -- Client-initiated transitions only: auth.uid() is null for service role.
  if auth.uid() is not null then
    if new.status = 'cancelled' and old.requester_id <> auth.uid() then
      raise exception 'only the requester can cancel a connection' using errcode = '42501';
    end if;
    if new.status in ('accepted', 'declined') and old.addressee_id <> auth.uid() then
      raise exception 'only the addressee can accept or decline' using errcode = '42501';
    end if;
  end if;

  return new;
end $$;

create trigger connections_immutable
  before update on public.connections
  for each row execute function public.enforce_connection_immutable();

-- ============ 4. No PII in display_name by default ============
-- The email local part often contains a student id or real name, and display_name
-- is shown in public_profiles. Users fill it during onboarding instead.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

-- ============ 5. Open sessions are only visible while scheduled ============
drop policy sessions_select on public.study_sessions;
create policy sessions_select on public.study_sessions for select to authenticated
  using (
    host_id = auth.uid()
    or public.is_session_participant(id)
    or (is_open and status = 'scheduled')
  );

-- ============ 6. Indexes, explicit FK behaviour, block-aware contact reveal ============
create index if not exists study_sessions_host_idx on public.study_sessions (host_id);

-- Deleting a catalog course must not silently delete sessions or connections.
alter table public.study_sessions drop constraint study_sessions_course_id_fkey;
alter table public.study_sessions
  add constraint study_sessions_course_id_fkey
  foreign key (course_id) references public.courses (id) on delete restrict;

alter table public.connections drop constraint connections_course_id_fkey;
alter table public.connections
  add constraint connections_course_id_fkey
  foreign key (course_id) references public.courses (id) on delete restrict;

create or replace function public.get_contact(target uuid)
returns table (kind public.contact_kind, value text)
language sql security definer stable set search_path = public as $$
  select p.contact_kind, p.contact_value
  from public.profiles p
  where p.id = target
    and p.contact_value is not null
    and exists (
      select 1 from public.connections c
      where c.status = 'accepted'
        and ((c.requester_id = auth.uid() and c.addressee_id = target)
          or (c.addressee_id = auth.uid() and c.requester_id = target))
    )
    and not exists (
      select 1 from public.user_blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = target)
         or (b.blocker_id = target and b.blocked_id = auth.uid())
    );
$$;

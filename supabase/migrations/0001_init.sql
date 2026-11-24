-- StudySync 0001_init
-- Jalankan di project Supabase DEV. Belum dijalankan; verifikasi dengan T-002 dan T-016.

-- ============ Enum ============
create type public.study_mode as enum ('online', 'offline', 'either');
create type public.session_mode as enum ('online', 'offline');
create type public.availability_reveal as enum ('overlap_only', 'after_connect');
create type public.course_role as enum ('learn', 'help', 'both');
create type public.study_goal as enum ('exam_prep', 'assignment', 'project', 'concept');
create type public.connection_status as enum ('pending', 'accepted', 'declined', 'cancelled');
create type public.session_status as enum ('scheduled', 'cancelled', 'done');
create type public.participant_status as enum ('invited', 'joined', 'declined', 'attended');
create type public.contact_kind as enum ('whatsapp', 'telegram', 'discord', 'email');

-- ============ Tabel ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  study_program text check (char_length(study_program) <= 80),
  entry_year smallint check (entry_year between 2000 and 2100),
  bio text check (char_length(bio) <= 280),
  study_mode public.study_mode not null default 'either',
  discoverable boolean not null default true,
  availability_reveal public.availability_reveal not null default 'overlap_only',
  contact_kind public.contact_kind,
  contact_value text check (char_length(contact_value) <= 120),
  is_demo boolean not null default false,
  onboarding_started_at timestamptz,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  study_program text,
  created_at timestamptz not null default now()
);

create table public.user_courses (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  level smallint not null check (level between 1 and 5),
  role public.course_role not null default 'both',
  goal public.study_goal not null default 'concept',
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
create index user_courses_course_idx on public.user_courses (course_id);

-- 0 = Senin ... 6 = Minggu; menit sejak 00:00, kelipatan 30
create table public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_min smallint not null check (start_min between 0 and 1410),
  end_min smallint not null check (end_min between 30 and 1440),
  is_shareable boolean not null default true,
  constraint slot_order check (end_min > start_min),
  constraint slot_granularity check (start_min % 30 = 0 and end_min % 30 = 0)
);
create index availability_slots_user_idx on public.availability_slots (user_id);

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status public.connection_status not null default 'pending',
  message text check (char_length(message) <= 280),
  match_score smallint check (match_score between 0 and 100),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint no_self_connection check (requester_id <> addressee_id)
);
-- Satu koneksi aktif per pasangan + mata kuliah (boleh minta lagi setelah ditolak/dibatalkan)
create unique index connections_active_pair_course_uq
  on public.connections (least(requester_id, addressee_id), greatest(requester_id, addressee_id), course_id)
  where status in ('pending', 'accepted');
create index connections_addressee_idx on public.connections (addressee_id, status);
create index connections_requester_idx on public.connections (requester_id, status);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id),
  title text not null check (char_length(title) between 3 and 80),
  topic text check (char_length(topic) <= 280),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  mode public.session_mode not null default 'online',
  location_text text check (char_length(location_text) <= 160),
  meeting_url text check (char_length(meeting_url) <= 300),
  capacity smallint not null default 2 check (capacity between 2 and 8),
  is_open boolean not null default false, -- true = tampil di Open Study Board (P1)
  status public.session_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  constraint session_time_order check (ends_at > starts_at)
);
create index study_sessions_open_idx on public.study_sessions (starts_at) where is_open and status = 'scheduled';

create table public.session_participants (
  session_id uuid not null references public.study_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.participant_status not null default 'invited',
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);
create index session_participants_user_idx on public.session_participants (user_id);

create table public.session_feedback (
  session_id uuid not null references public.study_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  would_repeat boolean,
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table public.user_blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now()
);

-- Event analitik (M1-M5). Jangan simpan PII di props.
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null check (char_length(name) <= 60),
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index events_name_created_idx on public.events (name, created_at);
create index events_user_idx on public.events (user_id, created_at);

create table public.allowed_email_domains (
  domain text primary key
);

-- ============ Fungsi bantu ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Buat baris profil otomatis saat user auth baru dibuat
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, ''), '@', 1));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- (OPSIONAL) Paksa domain email kampus. Aktifkan setelah allowed_email_domains terisi
-- dan domain demo/juri sudah dimasukkan, kalau tidak pendaftaran akan ditolak semua.
-- create or replace function public.enforce_email_domain()
-- returns trigger language plpgsql security definer set search_path = public as $$
-- begin
--   if not exists (
--     select 1 from public.allowed_email_domains d
--     where lower(d.domain) = lower(split_part(new.email, '@', 2))
--   ) then
--     raise exception 'Email domain not allowed';
--   end if;
--   return new;
-- end $$;
-- create trigger enforce_email_domain before insert on auth.users
--   for each row execute function public.enforce_email_domain();

-- Helper sesi (security definer agar policy tidak saling memanggil / rekursif)
create or replace function public.is_session_host(sid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.study_sessions s where s.id = sid and s.host_id = auth.uid());
$$;

create or replace function public.is_session_participant(sid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.session_participants p where p.session_id = sid and p.user_id = auth.uid());
$$;

-- Kontak hanya terbuka untuk pasangan dengan koneksi 'accepted'
create or replace function public.get_contact(target uuid)
returns table (kind public.contact_kind, value text)
language sql security definer stable set search_path = public as $$
  select p.contact_kind, p.contact_value
  from public.profiles p
  where p.id = target
    and exists (
      select 1 from public.connections c
      where c.status = 'accepted'
        and ((c.requester_id = auth.uid() and c.addressee_id = target)
          or (c.addressee_id = auth.uid() and c.requester_id = target))
    );
$$;

-- ============ View profil publik (tanpa kontak) ============
create view public.public_profiles as
  select id, display_name, study_program, entry_year, bio, study_mode
  from public.profiles
  where onboarding_completed_at is not null;

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.user_courses enable row level security;
alter table public.availability_slots enable row level security;
alter table public.connections enable row level security;
alter table public.study_sessions enable row level security;
alter table public.session_participants enable row level security;
alter table public.session_feedback enable row level security;
alter table public.user_blocks enable row level security;
alter table public.reports enable row level security;
alter table public.events enable row level security;
alter table public.allowed_email_domains enable row level security;

-- profiles: hanya milik sendiri. Profil orang lain lewat public_profiles / route handler server.
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- courses: katalog dibaca semua user login
create policy courses_select_all on public.courses for select to authenticated using (true);

-- data pribadi milik sendiri: lintas-user HANYA lewat server (service role) -> DTO
create policy user_courses_own on public.user_courses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy availability_slots_own on public.availability_slots for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- connections
create policy connections_select_party on public.connections for select to authenticated
  using (auth.uid() in (requester_id, addressee_id));
create policy connections_insert_requester on public.connections for insert to authenticated
  with check (requester_id = auth.uid() and status = 'pending');
create policy connections_update_addressee on public.connections for update to authenticated
  using (addressee_id = auth.uid() and status = 'pending')
  with check (addressee_id = auth.uid() and status in ('accepted', 'declined'));
create policy connections_update_requester on public.connections for update to authenticated
  using (requester_id = auth.uid() and status = 'pending')
  with check (requester_id = auth.uid() and status = 'cancelled');

-- sesi
create policy sessions_select on public.study_sessions for select to authenticated
  using (host_id = auth.uid() or is_open or public.is_session_participant(id));
create policy sessions_insert_host on public.study_sessions for insert to authenticated
  with check (host_id = auth.uid());
create policy sessions_update_host on public.study_sessions for update to authenticated
  using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy sessions_delete_host on public.study_sessions for delete to authenticated
  using (host_id = auth.uid());

create policy participants_select on public.session_participants for select to authenticated
  using (user_id = auth.uid() or public.is_session_host(session_id));
create policy participants_insert on public.session_participants for insert to authenticated
  with check (user_id = auth.uid() or public.is_session_host(session_id));
create policy participants_update on public.session_participants for update to authenticated
  using (user_id = auth.uid() or public.is_session_host(session_id))
  with check (user_id = auth.uid() or public.is_session_host(session_id));
create policy participants_delete on public.session_participants for delete to authenticated
  using (user_id = auth.uid() or public.is_session_host(session_id));

-- feedback, block, report, events: milik sendiri, tulis saja
create policy feedback_own on public.session_feedback for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy blocks_own on public.user_blocks for all to authenticated
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());
create policy reports_insert_own on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());
create policy events_insert_own on public.events for insert to authenticated
  with check (user_id = auth.uid());
-- allowed_email_domains: tanpa policy = hanya service role / SQL editor

-- ============ Grant ============
revoke all on public.public_profiles from anon;
grant select on public.public_profiles to authenticated;
revoke all on function public.get_contact(uuid) from public, anon;
grant execute on function public.get_contact(uuid) to authenticated;

-- Batasi kolom yang boleh diubah user di profiles (is_demo, id, created_at tidak boleh)
revoke update on public.profiles from authenticated;
grant update (
  display_name, study_program, entry_year, bio, study_mode, discoverable,
  availability_reveal, contact_kind, contact_value,
  onboarding_started_at, onboarding_completed_at
) on public.profiles to authenticated;

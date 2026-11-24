-- StudySync schema smoke check (T-002). Read-only.
-- Run in Supabase SQL Editor against the dev project. Every row must show status = 'ok'.
-- Cross-user RLS tests (user A cannot read user B data) belong to T-016.
with rls as (
  select count(*) as total,
         count(*) filter (where c.relrowsecurity) as enabled
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
),
pol as (
  select count(*) as n from pg_policies where schemaname = 'public'
),
view_opts as (
  select coalesce(array_to_string(c.reloptions, ','), '') as opts
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'public_profiles'
),
seed as (
  select count(*) as courses from public.courses
),
domains as (
  select count(*) as n from public.allowed_email_domains
),
trg as (
  select
    exists (
      select 1 from pg_trigger
      where tgname = 'connections_immutable'
        and tgrelid = 'public.connections'::regclass
        and not tgisinternal
    ) as immutable,
    exists (
      select 1 from pg_trigger
      where tgname = 'on_auth_user_created'
        and tgrelid = 'auth.users'::regclass
        and not tgisinternal
    ) as new_user,
    exists (
      select 1 from pg_trigger
      where tgname = 'enforce_email_domain'
        and tgrelid = 'auth.users'::regclass
        and not tgisinternal
    ) as domain_trigger
),
fks as (
  select
    (select confdeltype from pg_constraint where conname = 'study_sessions_course_id_fkey') as sessions_course,
    (select confdeltype from pg_constraint where conname = 'connections_course_id_fkey') as connections_course
),
grants as (
  select count(*) as n,
         count(*) filter (where column_name in ('contact_kind', 'contact_value', 'is_demo')) as secret_cols
  from information_schema.column_privileges
  where table_schema = 'public'
    and table_name = 'profiles'
    and grantee = 'authenticated'
    and privilege_type = 'SELECT'
),
fn as (
  select coalesce(
           (select prosrc from pg_proc
            where proname = 'handle_new_user' and pronamespace = 'public'::regnamespace),
           ''
         ) as body,
         exists (
           select 1 from pg_proc
           where proname = 'is_open_session' and pronamespace = 'public'::regnamespace
         ) as open_session
),
idx as (
  select exists (
           select 1 from pg_indexes
           where schemaname = 'public' and indexname = 'connections_active_pair_course_uq'
         ) as pair_uq,
         exists (
           select 1 from pg_indexes
           where schemaname = 'public' and indexname = 'study_sessions_host_idx'
         ) as host_idx
),
polsafety as (
  select count(*) filter (where 'anon' = any(roles)) as anon_policies,
         count(*) filter (
           where tablename <> 'courses' and (qual = 'true' or with_check = 'true')
         ) as allow_all_policies
  from pg_policies
  where schemaname = 'public'
)
select 'tables_in_public' as check_name, '12' as expected, rls.total::text as actual,
       case when rls.total = 12 then 'ok' else 'FAIL' end as status
from rls
union all
select 'rls_enabled_on_all_tables', 'all tables', rls.enabled::text || '/' || rls.total::text,
       case when rls.enabled = rls.total then 'ok' else 'FAIL' end
from rls
union all
select 'policies_total', '22', pol.n::text,
       case when pol.n = 22 then 'ok' else 'FAIL' end
from pol
union all
select 'public_profiles_security_invoker', 'security_invoker=true', view_opts.opts,
       case when view_opts.opts like '%security_invoker=true%' then 'ok' else 'FAIL' end
from view_opts
union all
select 'courses_seeded', '20', seed.courses::text,
       case when seed.courses = 20 then 'ok' else 'FAIL' end
from seed
union all
select 'allowed_email_domains_rows', '0', domains.n::text,
       case when domains.n = 0 then 'ok' else 'FAIL' end
from domains
union all
select 'trigger_connections_immutable', 'true', trg.immutable::text,
       case when trg.immutable then 'ok' else 'FAIL' end
from trg
union all
select 'trigger_on_auth_user_created', 'true', trg.new_user::text,
       case when trg.new_user then 'ok' else 'FAIL' end
from trg
union all
select 'trigger_enforce_email_domain', 'false (still disabled)', trg.domain_trigger::text,
       case when not trg.domain_trigger then 'ok' else 'FAIL' end
from trg
union all
select 'fk_study_sessions_course', 'r = restrict', fks.sessions_course,
       case when fks.sessions_course = 'r' then 'ok' else 'FAIL' end
from fks
union all
select 'fk_connections_course', 'r = restrict', fks.connections_course,
       case when fks.connections_course = 'r' then 'ok' else 'FAIL' end
from fks
union all
select 'authenticated_select_profiles_columns', '11 columns, 0 secret',
       grants.n::text || ' columns, ' || grants.secret_cols::text || ' secret',
       case when grants.n = 11 and grants.secret_cols = 0 then 'ok' else 'FAIL' end
from grants
union all
select 'handle_new_user_without_email_local_part', 'no split_part',
       case when fn.body like '%split_part%' then 'split_part present' else 'clean' end,
       case when fn.body not like '%split_part%' then 'ok' else 'FAIL' end
from fn
union all
select 'function_is_open_session', 'true', fn.open_session::text,
       case when fn.open_session then 'ok' else 'FAIL' end
from fn
union all
select 'index_connections_active_pair_course_uq', 'true', idx.pair_uq::text,
       case when idx.pair_uq then 'ok' else 'FAIL' end
from idx
union all
select 'index_study_sessions_host_idx', 'true', idx.host_idx::text,
       case when idx.host_idx then 'ok' else 'FAIL' end
from idx
union all
select 'policies_for_anon_role', '0', polsafety.anon_policies::text,
       case when polsafety.anon_policies = 0 then 'ok' else 'FAIL' end
from polsafety
union all
select 'policies_using_true_outside_courses', '0', polsafety.allow_all_policies::text,
       case when polsafety.allow_all_policies = 0 then 'ok' else 'FAIL' end
from polsafety
order by 1;

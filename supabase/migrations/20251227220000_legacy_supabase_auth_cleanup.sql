/*
LEGACY SUPABASE AUTH CLEANUP — PHASE A

This migration renames Supabase Auth–dependent tables and functions
to clearly mark them as legacy.

- Clerk is the sole authentication provider.
- Application-layer auth + service-role DB access enforce security.
- No behavior changes are introduced by this migration.

Idempotent / Safe version: Checks for existence before renaming to avoid errors.
*/

-- 1. Rename DEAD tables (Idempotent)
DO $$
BEGIN
    -- profiles -> legacy_supabase_profiles
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'legacy_supabase_profiles') THEN
            ALTER TABLE public.profiles RENAME TO legacy_supabase_profiles;
        END IF;
    END IF;

    -- user_roles -> legacy_supabase_user_roles
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
         IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'legacy_supabase_user_roles') THEN
            ALTER TABLE public.user_roles RENAME TO legacy_supabase_user_roles;
         END IF;
    END IF;
END $$;

-- 2. Add table comments (Safely)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'legacy_supabase_profiles') THEN
        COMMENT ON TABLE public.legacy_supabase_profiles IS 'LEGACY: Supabase Auth profiles table. Clerk is the active auth system. This table is unused and kept temporarily for audit safety.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'legacy_supabase_user_roles') THEN
        COMMENT ON TABLE public.legacy_supabase_user_roles IS 'LEGACY: Supabase Auth role mapping. Clerk manages roles. This table is unused and kept temporarily for audit safety.';
    END IF;
END
$$;

-- 3. Rename DEAD functions (Idempotent)
DO $$
BEGIN
    -- is_admin(uuid)
    -- Check if target name exists first to avoid collision
    IF NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_is_admin') THEN
        -- Check if source exists
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'is_admin') THEN
            ALTER FUNCTION public.is_admin(uuid) RENAME TO legacy_is_admin;
        END IF;
    END IF;

    -- check_user_is_admin(uuid)
    IF NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_check_user_is_admin') THEN
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'check_user_is_admin') THEN
            ALTER FUNCTION public.check_user_is_admin(uuid) RENAME TO legacy_check_user_is_admin;
        END IF;
    END IF;
    
    -- handle_new_user()
    IF NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_handle_new_user') THEN
         IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'handle_new_user') THEN
            ALTER FUNCTION public.handle_new_user() RENAME TO legacy_handle_new_user;
         END IF;
    END IF;
END $$;

-- 4. Add function comments (Safely)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_is_admin') THEN
        COMMENT ON FUNCTION public.legacy_is_admin(uuid) IS 'LEGACY: Supabase Auth-based admin check. Clerk is used instead. Do not use.';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_check_user_is_admin') THEN
        COMMENT ON FUNCTION public.legacy_check_user_is_admin(uuid) IS 'LEGACY: Supabase Auth-based admin check. Do not use.';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'legacy_handle_new_user') THEN
        COMMENT ON FUNCTION public.legacy_handle_new_user() IS 'LEGACY: Trigger function for auth.users inserts. Clerk does not populate auth.users.';
    END IF;
END
$$;

-- 5. Disable DEAD triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

/*
LEGACY SUPABASE AUTH CLEANUP — PHASE A
Completed.
*/

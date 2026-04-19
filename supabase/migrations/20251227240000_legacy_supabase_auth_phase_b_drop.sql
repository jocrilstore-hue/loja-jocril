/*
=============================================================================
LEGACY SUPABASE AUTH CLEANUP — PHASE B (DESTRUCTIVE)
=============================================================================

Prerequisites:
  - Phase A migration (20251227220000) has been applied
  - At least one successful deploy post-Phase A
  - No runtime errors related to legacy artifacts

This migration permanently removes:
  - Legacy tables: legacy_supabase_profiles, legacy_supabase_user_roles
  - Legacy functions: legacy_is_admin, legacy_check_user_is_admin, legacy_handle_new_user
  - Dead RLS policies referencing auth.uid(), auth.jwt(), auth.role()

Kept:
  - Service-role "allow all" policies
  - Any policy explicitly documented as ACTIVE

Behavior:
  - Fails loudly if unexpected dependencies exist
  - Uses RESTRICT (not CASCADE) to surface hidden dependencies

=============================================================================
*/

-- =============================================================================
-- STEP 1: Pre-flight dependency check
-- =============================================================================
-- This block will RAISE an error if any unexpected object depends on legacy items

DO $$
DECLARE
    dep_count INTEGER;
    dep_list TEXT;
BEGIN
    -- Check for foreign keys referencing legacy_supabase_profiles
    SELECT COUNT(*), string_agg(conname || ' on ' || conrelid::regclass::text, ', ')
    INTO dep_count, dep_list
    FROM pg_constraint
    WHERE confrelid = 'public.legacy_supabase_profiles'::regclass
      AND contype = 'f';

    IF dep_count > 0 THEN
        RAISE EXCEPTION 'PHASE B BLOCKED: Foreign keys depend on legacy_supabase_profiles: %', dep_list;
    END IF;

    -- Check for foreign keys referencing legacy_supabase_user_roles
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'legacy_supabase_user_roles') THEN
        SELECT COUNT(*), string_agg(conname || ' on ' || conrelid::regclass::text, ', ')
        INTO dep_count, dep_list
        FROM pg_constraint
        WHERE confrelid = 'public.legacy_supabase_user_roles'::regclass
          AND contype = 'f';

        IF dep_count > 0 THEN
            RAISE EXCEPTION 'PHASE B BLOCKED: Foreign keys depend on legacy_supabase_user_roles: %', dep_list;
        END IF;
    END IF;

    -- Check for views depending on legacy tables
    SELECT COUNT(*), string_agg(dependent_view::text, ', ')
    INTO dep_count, dep_list
    FROM (
        SELECT DISTINCT dependent_ns.nspname || '.' || dependent_view.relname AS dependent_view
        FROM pg_depend
        JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
        JOIN pg_class AS dependent_view ON pg_rewrite.ev_class = dependent_view.oid
        JOIN pg_namespace AS dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
        JOIN pg_class AS source_table ON pg_depend.refobjid = source_table.oid
        WHERE source_table.relname IN ('legacy_supabase_profiles', 'legacy_supabase_user_roles')
          AND dependent_view.relkind = 'v'
    ) views;

    IF dep_count > 0 THEN
        RAISE EXCEPTION 'PHASE B BLOCKED: Views depend on legacy tables: %', dep_list;
    END IF;

    RAISE NOTICE 'Pre-flight check passed. No unexpected dependencies found.';
END $$;


-- =============================================================================
-- STEP 2: Drop dead RLS policies referencing auth.uid(), auth.jwt(), auth.role()
-- =============================================================================
-- These policies are non-functional because Clerk users don't populate auth.*

DO $$
DECLARE
    pol RECORD;
    policy_def TEXT;
    dropped_count INTEGER := 0;
BEGIN
    -- Iterate through all policies in public schema
    FOR pol IN
        SELECT schemaname, tablename, policyname, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        -- Get full policy definition for inspection
        policy_def := COALESCE(pol.qual, '') || ' ' || COALESCE(pol.with_check, '');

        -- Check if policy references auth.uid(), auth.jwt(), or auth.role()
        -- Skip policies that are "allow all" (true) - these are service-role policies
        IF policy_def ~ 'auth\.(uid|jwt|role)\s*\('
           AND policy_def !~ '^\s*true\s*$'
           AND policy_def !~ 'ACTIVE'  -- Skip explicitly marked active policies
        THEN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                          pol.policyname, pol.schemaname, pol.tablename);
            RAISE NOTICE 'Dropped policy: %.% -> %', pol.tablename, pol.policyname, pol.qual;
            dropped_count := dropped_count + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Dropped % dead RLS policies referencing auth.*', dropped_count;
END $$;


-- =============================================================================
-- STEP 3: Drop legacy functions (RESTRICT to catch hidden dependencies)
-- =============================================================================

-- legacy_is_admin(uuid)
DROP FUNCTION IF EXISTS public.legacy_is_admin(uuid) RESTRICT;

-- legacy_check_user_is_admin(uuid)
DROP FUNCTION IF EXISTS public.legacy_check_user_is_admin(uuid) RESTRICT;

-- legacy_handle_new_user()
DROP FUNCTION IF EXISTS public.legacy_handle_new_user() RESTRICT;


-- =============================================================================
-- STEP 4: Drop legacy tables (RESTRICT to catch hidden dependencies)
-- =============================================================================

-- legacy_supabase_profiles
DROP TABLE IF EXISTS public.legacy_supabase_profiles RESTRICT;

-- legacy_supabase_user_roles
DROP TABLE IF EXISTS public.legacy_supabase_user_roles RESTRICT;


-- =============================================================================
-- STEP 5: Verification
-- =============================================================================

DO $$
DECLARE
    remaining_legacy INTEGER;
BEGIN
    -- Check no legacy tables remain
    SELECT COUNT(*) INTO remaining_legacy
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename LIKE 'legacy_supabase_%';

    IF remaining_legacy > 0 THEN
        RAISE WARNING 'Some legacy tables still exist: %', remaining_legacy;
    END IF;

    -- Check no legacy functions remain
    SELECT COUNT(*) INTO remaining_legacy
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname LIKE 'legacy_%';

    IF remaining_legacy > 0 THEN
        RAISE WARNING 'Some legacy functions still exist: %', remaining_legacy;
    END IF;

    RAISE NOTICE 'PHASE B COMPLETE: Legacy Supabase Auth artifacts removed.';
END $$;


/*
=============================================================================
LEGACY SUPABASE AUTH CLEANUP — PHASE B
Completed.

Runtime impact: ZERO
  - These artifacts were unused since Clerk became the auth provider
  - No application code references these tables or functions
  - RLS policies referencing auth.uid() were already non-functional

If this migration fails:
  - Read the error message — it will specify the blocking dependency
  - Resolve the dependency before re-running
  - Do NOT use CASCADE without understanding what will be dropped
=============================================================================
*/

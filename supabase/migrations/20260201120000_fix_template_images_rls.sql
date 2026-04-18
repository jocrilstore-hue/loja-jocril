-- Migration: Fix RLS policies for product_template_images table
-- This table was missing from the main security migration
-- Also updates the admin check function to work with Clerk's JWT structure

-- =====================================================
-- FIX: Update admin check function for Clerk compatibility
-- Clerk puts role in 'public_metadata' not 'app_metadata'
-- =====================================================
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  jwt_claims jsonb := auth.jwt();
  user_role text;
BEGIN
  -- 1. Check Clerk's public_metadata (where Clerk stores publicMetadata)
  user_role := jwt_claims -> 'public_metadata' ->> 'role';
  IF user_role = 'admin' OR user_role = 'super_admin' THEN
    RETURN true;
  END IF;

  -- 2. Check app_metadata (Supabase default location)
  user_role := jwt_claims -> 'app_metadata' ->> 'role';
  IF user_role = 'admin' OR user_role = 'super_admin' OR user_role = 'service_role' THEN
    RETURN true;
  END IF;

  -- 3. Check user_metadata (Supabase user editable metadata)
  user_role := jwt_claims -> 'user_metadata' ->> 'role';
  IF user_role = 'admin' OR user_role = 'super_admin' THEN
    RETURN true;
  END IF;

  -- 4. Fallback: Check for service_role
  IF (jwt_claims ->> 'role') = 'service_role' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- =====================================================
-- FIX: product_template_images RLS policies
-- =====================================================

-- Drop old policies that use the wrong admin check function
DROP POLICY IF EXISTS "Anyone can view template images" ON public.product_template_images;
DROP POLICY IF EXISTS "Admins can manage template images" ON public.product_template_images;

-- Ensure RLS is enabled
ALTER TABLE public.product_template_images ENABLE ROW LEVEL SECURITY;

-- READ (Public access - catalog images are public)
CREATE POLICY "Enable read access for all users"
    ON public.product_template_images
    FOR SELECT
    USING (true);

-- INSERT (Admin only)
CREATE POLICY "Enable insert access for admins"
    ON public.product_template_images
    FOR INSERT
    WITH CHECK (public.current_user_is_admin());

-- UPDATE (Admin only)
CREATE POLICY "Enable update access for admins"
    ON public.product_template_images
    FOR UPDATE
    USING (public.current_user_is_admin())
    WITH CHECK (public.current_user_is_admin());

-- DELETE (Admin only)
CREATE POLICY "Enable delete access for admins"
    ON public.product_template_images
    FOR DELETE
    USING (public.current_user_is_admin());

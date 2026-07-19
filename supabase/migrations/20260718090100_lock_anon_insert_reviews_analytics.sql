-- =====================================================
-- Lock down anonymous INSERT on product_reviews and product_analytics
-- =====================================================
-- REWRITTEN 2026-07-19 after adversarial review (F-05).
-- DRAFT — apply at the coordinated cutover (safe before or after the code
-- deploy: no application code writes to either table today).
--
-- Original problem (20251220130000_fix_security_issues.sql): INSERT policies
-- named "Enable insert access for all users" WITH CHECK (true) on both tables
-- let anyone with the public anon key spam reviews and analytics rows.
--
-- This app authenticates with CLERK — there are no Supabase `authenticated`
-- sessions, so recreating `TO authenticated` INSERT policies (as an earlier
-- draft did) would be dead code pretending to be a write path. If a review or
-- analytics write path ships later, it must go through a validated,
-- rate-limited server-side route using the service-role client (which
-- bypasses RLS and needs no policy).
--
-- Public SELECT on product_reviews stays: the PDP displays reviews.
-- Public SELECT on product_analytics stays as originally defined; revisit
-- separately if analytics data becomes sensitive.

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.product_reviews;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.product_analytics;

-- No replacement INSERT policies — writes are service-role only by design.

ALTER TABLE public.product_reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;

-- Post-apply verification (run at cutover):
--   SELECT policyname, cmd FROM pg_policies
--     WHERE tablename IN ('product_reviews','product_analytics');
--     -- expect: only the SELECT ("Enable read access for all users") rows
--   Anon probe: INSERT into product_reviews with the anon key must fail.
--   PDP still renders (reviews SELECT unaffected).

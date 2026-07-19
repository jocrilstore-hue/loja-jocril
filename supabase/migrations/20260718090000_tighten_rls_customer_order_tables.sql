-- =====================================================
-- Tighten RLS: customer PII, orders, shipping config + privileged RPC ACLs
-- =====================================================
-- REWRITTEN 2026-07-19 after adversarial review (F-01/F-02/F-05/F-09).
-- DRAFT — apply ONLY at the coordinated cutover, AFTER the application code
-- that switches these access paths to the service-role client is DEPLOYED
-- (app/api/orders, app/api/payment/*, app/api/webhooks/eupago,
-- app/api/orders/[orderNumber]/status, app/(store)/encomenda[s] pages).
-- Applying this against the old code breaks checkout and payment webhooks.
--
-- Model: this app authenticates with CLERK. There are NO Supabase
-- `authenticated` sessions and auth.uid() is always NULL, so user-scoped
-- policies are dead code by construction. All PII access flows through
-- server-side routes using the service-role key, which BYPASSES RLS.
-- Therefore: enable RLS and create NO policies on these tables — anon (the
-- only key that ships to browsers) is fully denied; service-role is unaffected.

-- =====================================================
-- 1. Customer PII / order tables: drop the permissive PUBLIC policies
--    (misleadingly named "Service role has full access ..." but created
--    FOR ALL USING(true) — i.e. wide open to anon).
--    Original names verified against 20251220112000 and 20251220111000.
-- =====================================================

DROP POLICY IF EXISTS "Service role has full access to customers" ON public.customers;
DROP POLICY IF EXISTS "Service role has full access to shipping_addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Service role has full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Service role has full access to order_items" ON public.order_items;
DROP POLICY IF EXISTS "Service role has full access to email_logs" ON public.email_logs;

-- Also drop the auth.uid()-scoped SELECT policies (same original migrations).
-- Under Clerk there are no Supabase sessions, so auth.uid() is always NULL —
-- these never matched a row and only suggest a user read-path that does not
-- exist. Removing them makes the post-apply check exact: zero policies.
DROP POLICY IF EXISTS "Users can view their own customer record" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.shipping_addresses;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own email logs" ON public.email_logs;

-- Keep RLS enabled (idempotent if already enabled).
ALTER TABLE public.customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs         ENABLE ROW LEVEL SECURITY;

-- Intentionally NO replacement policies: no anon/authenticated access at all.
-- service_role bypasses RLS and remains the single server-side path.

-- =====================================================
-- 2. Shipping config tables (20251221100000): same permissive FOR ALL
--    policies + public SELECT policies. The storefront hardcodes shipping
--    costs and only /api/admin/settings/shipping (service-role) reads/writes
--    these tables — no anon consumer exists (F-09 least privilege).
-- =====================================================

DROP POLICY IF EXISTS "Service role has full access to shipping_zones"    ON public.shipping_zones;
DROP POLICY IF EXISTS "Service role has full access to shipping_classes"  ON public.shipping_classes;
DROP POLICY IF EXISTS "Service role has full access to shipping_rates"    ON public.shipping_rates;
DROP POLICY IF EXISTS "Service role has full access to shipping_settings" ON public.shipping_settings;
DROP POLICY IF EXISTS "Public can read active shipping zones"   ON public.shipping_zones;
DROP POLICY IF EXISTS "Public can read active shipping classes" ON public.shipping_classes;
DROP POLICY IF EXISTS "Public can read active shipping rates"   ON public.shipping_rates;
DROP POLICY IF EXISTS "Public can read shipping settings"       ON public.shipping_settings;

ALTER TABLE public.shipping_zones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_classes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. Privileged RPC ACLs (F-02). create_complete_order is SECURITY DEFINER
--    and was granted to anon + authenticated (20251227200000:241-247) —
--    letting any browser call it directly with arbitrary prices, bypassing
--    all route validation. The checkout route now calls it with service_role.
--    PostgreSQL grants EXECUTE to PUBLIC by default on new functions, so
--    revoke PUBLIC explicitly as the docs recommend for SECURITY DEFINER.
-- =====================================================

REVOKE ALL ON FUNCTION public.create_complete_order(jsonb, jsonb, jsonb, jsonb)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_complete_order(jsonb, jsonb, jsonb, jsonb)
  TO service_role;

-- Admin RPCs: same family of risk; only ever called via the admin routes
-- (service_role after the Clerk admin check). The `authenticated` grants are
-- dead code under Clerk and get revoked.
REVOKE ALL ON FUNCTION public.admin_apply_price_tiers(jsonb)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_apply_price_tiers(jsonb)
  TO service_role;

REVOKE ALL ON FUNCTION public.admin_save_product_template(jsonb, int[])
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_save_product_template(jsonb, int[])
  TO service_role;

-- Pin search_path on the SECURITY DEFINER functions (hardening per the
-- PostgreSQL "Writing SECURITY DEFINER Functions Safely" guidance).
ALTER FUNCTION public.create_complete_order(jsonb, jsonb, jsonb, jsonb)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.admin_apply_price_tiers(jsonb)
  SET search_path = public, pg_temp;
ALTER FUNCTION public.admin_save_product_template(jsonb, int[])
  SET search_path = public, pg_temp;

-- NOT touched here (deliberately):
--   * search_products / storefront read RPCs — SECURITY INVOKER, anon keeps
--     EXECUTE; product catalog SELECT policies remain public (storefront).
--   * check_user_is_admin / current_user_is_admin — legacy helpers that may
--     be referenced by existing policies; auditing them is a separate task.
--
-- Post-apply verification (run at cutover):
--   SELECT tablename, policyname FROM pg_policies WHERE tablename IN
--     ('customers','shipping_addresses','orders','order_items','email_logs',
--      'shipping_zones','shipping_classes','shipping_rates','shipping_settings');
--     -- expect: zero rows
--   SELECT has_function_privilege('anon',
--     'public.create_complete_order(jsonb,jsonb,jsonb,jsonb)', 'EXECUTE');
--     -- expect: false
--   Anon probes: SELECT on orders/customers must fail; guest checkout via the
--   app must still succeed (service-role path).

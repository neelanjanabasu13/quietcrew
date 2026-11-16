DROP POLICY IF EXISTS "Agencies create their own orders" ON public.goldmine_orders;
REVOKE INSERT ON public.goldmine_orders FROM authenticated;
CREATE TABLE public.outshine_purchases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 business_id text NOT NULL,
 environment text NOT NULL CHECK (environment IN ('sandbox','live')),
 business_snapshot jsonb NOT NULL,
 stripe_session_id text UNIQUE,
 payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
 amount integer NOT NULL DEFAULT 799 CHECK (amount = 799),
 currency text NOT NULL DEFAULT 'gbp' CHECK (currency = 'gbp'),
 created_at timestamptz NOT NULL DEFAULT now(),
 paid_at timestamptz,
 UNIQUE (user_id, business_id, environment)
);
GRANT SELECT ON public.outshine_purchases TO authenticated;
GRANT ALL ON public.outshine_purchases TO service_role;
ALTER TABLE public.outshine_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can read their Outshine purchases" ON public.outshine_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
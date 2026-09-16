CREATE TABLE public.goldmine_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  locality text NOT NULL,
  category text NOT NULL,
  amount_pence integer NOT NULL DEFAULT 1900,
  currency text NOT NULL DEFAULT 'GBP',
  payment_provider text,
  payment_reference text UNIQUE,
  payment_status text NOT NULL DEFAULT 'unpaid',
  scan_status text NOT NULL DEFAULT 'not_started',
  engine_scan_id text,
  engine_error text,
  results jsonb,
  drafts jsonb,
  is_fixture boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX goldmine_orders_engine_scan_id_key ON public.goldmine_orders (engine_scan_id) WHERE engine_scan_id IS NOT NULL;
CREATE INDEX goldmine_orders_user_id_idx ON public.goldmine_orders (user_id);

GRANT SELECT, INSERT ON public.goldmine_orders TO authenticated;
GRANT ALL ON public.goldmine_orders TO service_role;

ALTER TABLE public.goldmine_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies read their own orders"
  ON public.goldmine_orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Agencies create their own orders"
  ON public.goldmine_orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE TABLE public.goldmine_payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text NOT NULL,
  order_id uuid REFERENCES public.goldmine_orders(id) ON DELETE SET NULL,
  payload jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

GRANT ALL ON public.goldmine_payment_events TO service_role;

ALTER TABLE public.goldmine_payment_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER goldmine_orders_updated_at
BEFORE UPDATE ON public.goldmine_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
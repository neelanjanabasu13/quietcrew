ALTER TABLE public.goldmine_orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.goldmine_orders ADD COLUMN IF NOT EXISTS guest_token TEXT;
CREATE INDEX IF NOT EXISTS goldmine_orders_guest_token_idx ON public.goldmine_orders (guest_token);
ALTER TABLE public.goldmine_orders DROP CONSTRAINT IF EXISTS goldmine_orders_owner_present;
ALTER TABLE public.goldmine_orders ADD CONSTRAINT goldmine_orders_owner_present CHECK (user_id IS NOT NULL OR guest_token IS NOT NULL);
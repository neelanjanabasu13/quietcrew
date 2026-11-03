ALTER TABLE public.outshine_purchases DROP CONSTRAINT IF EXISTS outshine_purchases_amount_check;
ALTER TABLE public.outshine_purchases ALTER COLUMN amount SET DEFAULT 999;
ALTER TABLE public.outshine_purchases ADD CONSTRAINT outshine_purchases_amount_check CHECK (amount IN (799,999));
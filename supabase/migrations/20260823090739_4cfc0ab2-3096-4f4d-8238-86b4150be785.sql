CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  company_size TEXT NOT NULL,
  systems TEXT,
  manual_work TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.enquiries TO anon;
GRANT INSERT ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(company) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND length(company_size) BETWEEN 1 AND 40
  AND (systems IS NULL OR length(systems) <= 1000)
  AND (manual_work IS NULL OR length(manual_work) <= 5000)
);
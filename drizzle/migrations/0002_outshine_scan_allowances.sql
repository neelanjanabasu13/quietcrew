CREATE TABLE public.outshine_visitors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token_hash text NOT NULL UNIQUE, user_id uuid, ip_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.outshine_visitors TO service_role;
ALTER TABLE public.outshine_visitors ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.outshine_scan_credits (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, business_id text NOT NULL, environment text NOT NULL, kind text NOT NULL DEFAULT 'paid', purchase_id uuid, stripe_session_id text UNIQUE, payment_status text NOT NULL DEFAULT 'pending', used_by uuid, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(purchase_id)
);
GRANT SELECT ON public.outshine_scan_credits TO authenticated;
GRANT ALL ON public.outshine_scan_credits TO service_role;
ALTER TABLE public.outshine_scan_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read scan credits" ON public.outshine_scan_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TABLE public.outshine_scans (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), visitor_id uuid NOT NULL REFERENCES public.outshine_visitors(id), user_id uuid, ip_hash text NOT NULL, business_id text NOT NULL, environment text NOT NULL, status text NOT NULL DEFAULT 'running', source text NOT NULL DEFAULT 'free', credit_id uuid REFERENCES public.outshine_scan_credits(id), snapshot jsonb, created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, expires_at timestamptz
);
GRANT SELECT ON public.outshine_scans TO authenticated;
GRANT ALL ON public.outshine_scans TO service_role;
ALTER TABLE public.outshine_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read saved scans" ON public.outshine_scans FOR SELECT TO authenticated USING (auth.uid() = user_id AND expires_at > now());
CREATE INDEX outshine_scan_owner ON public.outshine_scans(user_id, environment, business_id);
CREATE INDEX outshine_scan_visitor ON public.outshine_scans(visitor_id, environment);
CREATE TABLE public.outshine_request_budgets (
 bucket text PRIMARY KEY, used integer NOT NULL DEFAULT 0, expires_at timestamptz NOT NULL
);
GRANT ALL ON public.outshine_request_budgets TO service_role;
ALTER TABLE public.outshine_request_budgets ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.outshine_take_budget(p_bucket text, p_limit integer, p_expires timestamptz) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.outshine_request_budgets(bucket,used,expires_at) VALUES(p_bucket,1,p_expires)
 ON CONFLICT(bucket) DO UPDATE SET used=outshine_request_budgets.used+1 WHERE outshine_request_budgets.used < p_limit RETURNING used INTO n;
 RETURN n IS NOT NULL;
END; $$;
REVOKE ALL ON FUNCTION public.outshine_take_budget(text,integer,timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.outshine_take_budget(text,integer,timestamptz) TO service_role;
CREATE FUNCTION public.outshine_reserve_scan(p_visitor uuid, p_user uuid, p_ip text, p_business text, p_environment text, p_fresh boolean DEFAULT false) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_scan public.outshine_scans; v_credit public.outshine_scan_credits; n integer;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended('outshine:ip:'||p_ip,0));
 IF p_user IS NOT NULL THEN PERFORM pg_advisory_xact_lock(hashtextextended('outshine:user:'||p_user::text,0)); END IF;
 IF p_user IS NOT NULL THEN
  UPDATE public.outshine_visitors SET user_id=p_user WHERE id=p_visitor AND (user_id IS NULL OR user_id=p_user);
  UPDATE public.outshine_scans SET user_id=p_user WHERE visitor_id=p_visitor AND user_id IS NULL;
 END IF;
 -- Stalled jobs cost no allowance, while the global API budget still bounds provider spend.
 UPDATE public.outshine_scans SET status='failed' WHERE status='running' AND created_at < now()-interval '3 minutes' AND (visitor_id=p_visitor OR (p_user IS NOT NULL AND user_id=p_user));
 UPDATE public.outshine_scan_credits c SET used_by=NULL WHERE EXISTS(SELECT 1 FROM public.outshine_scans s WHERE s.id=c.used_by AND s.status='failed');
 SELECT * INTO v_scan FROM public.outshine_scans WHERE business_id=p_business AND environment=p_environment AND (visitor_id=p_visitor OR (p_user IS NOT NULL AND user_id=p_user)) AND status='completed' AND expires_at>now() ORDER BY completed_at DESC LIMIT 1;
 IF FOUND AND NOT p_fresh THEN RETURN jsonb_build_object('kind','cached','scanId',v_scan.id); END IF;
 IF EXISTS(SELECT 1 FROM public.outshine_scans WHERE status='running' AND (visitor_id=p_visitor OR (p_user IS NOT NULL AND user_id=p_user))) THEN RETURN jsonb_build_object('kind','busy'); END IF;
 IF p_user IS NULL THEN
  SELECT count(*) INTO n FROM public.outshine_scans WHERE environment=p_environment AND status IN ('running','completed') AND (visitor_id=p_visitor OR ip_hash=p_ip) AND source='free';
  IF n>=1 THEN RETURN jsonb_build_object('kind','signin'); END IF;
 ELSE
  -- A pack verification is used first for an explicit same-business re-check.
  IF p_fresh THEN SELECT * INTO v_credit FROM public.outshine_scan_credits WHERE user_id=p_user AND business_id=p_business AND environment=p_environment AND payment_status='paid' AND used_by IS NULL AND kind='verification' ORDER BY created_at LIMIT 1 FOR UPDATE; END IF;
  SELECT count(*) INTO n FROM public.outshine_scans WHERE environment=p_environment AND status IN ('running','completed') AND source='free' AND (user_id=p_user OR visitor_id=p_visitor);
  IF v_credit.id IS NULL AND n>=3 THEN SELECT * INTO v_credit FROM public.outshine_scan_credits WHERE user_id=p_user AND business_id=p_business AND environment=p_environment AND payment_status='paid' AND used_by IS NULL ORDER BY created_at LIMIT 1 FOR UPDATE; END IF;
  IF n>=3 AND v_credit.id IS NULL THEN RETURN jsonb_build_object('kind','payment'); END IF;
 END IF;
 INSERT INTO public.outshine_scans(visitor_id,user_id,ip_hash,business_id,environment,source,credit_id) VALUES(p_visitor,p_user,p_ip,p_business,p_environment,CASE WHEN v_credit.id IS NULL THEN 'free' ELSE v_credit.kind END,v_credit.id) RETURNING * INTO v_scan;
 IF v_credit.id IS NOT NULL THEN UPDATE public.outshine_scan_credits SET used_by=v_scan.id WHERE id=v_credit.id; END IF;
 RETURN jsonb_build_object('kind','reserved','scanId',v_scan.id);
END; $$;
REVOKE ALL ON FUNCTION public.outshine_reserve_scan(uuid,uuid,text,text,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.outshine_reserve_scan(uuid,uuid,text,text,text,boolean) TO service_role;
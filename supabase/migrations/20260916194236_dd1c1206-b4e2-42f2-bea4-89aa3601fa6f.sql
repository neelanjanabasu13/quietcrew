CREATE POLICY "No client access to payment events"
  ON public.goldmine_payment_events FOR SELECT TO authenticated
  USING (false);
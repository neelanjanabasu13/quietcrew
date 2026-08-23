DROP POLICY "Admins can read enquiries" ON public.enquiries;

CREATE POLICY "Admins can read enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createDiyCheckout } from "@/lib/outshine/payments.functions";
import { Link } from "@tanstack/react-router";

export function DiyCheckout({ businessId, open, onOpenChange }: { businessId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const create = useServerFn(createDiyCheckout);
  useEffect(() => {
    if (!open) return;
    let active = true;
    setError(null);
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSignedIn(Boolean(data.session));
      if (!data.session) return;
      try {
        const result = await create({ data: { businessId, environment: getStripeEnvironment() } });
        if ("error" in result) throw new Error(result.error);
        if (active) setClientSecret(result.clientSecret);
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Payment could not be opened."); }
    });
    return () => { active = false; };
  }, [open, businessId, create]);
  const fetchClientSecret = useCallback(async () => {
    if (!clientSecret) throw new Error("Checkout is not ready.");
    return clientSecret;
  }, [clientSecret]);
  const next = `/outshine/report/${encodeURIComponent(businessId)}?buy=diy`;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-[20px] p-5 sm:p-8">
      <DialogTitle>Get your Done-for-You Fix Pack · £9.99</DialogTitle>
      <DialogDescription>Step-by-step guides for your audit findings, ready-to-paste wording and a downloadable PDF. One payment, no subscription.</DialogDescription>
      <PaymentTestModeBanner />
      {signedIn === false ? <div className="space-y-4 py-4">
        <p className="text-sm text-muted-foreground">Create a free account or sign in so you can return to your purchased pack.</p>
        <Button asChild className="w-full"><Link to="/login" search={{ next, mode: "signup" }}>Create account to buy · £9.99</Link></Button>
        <Button asChild variant="outline" className="w-full"><Link to="/login" search={{ next, mode: "signin" }}>Sign in to buy · £9.99</Link></Button>
      </div> : error ? <p role="alert" className="py-4 text-sm text-destructive">{error}</p> : clientSecret ?
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider>
        : <p role="status" className="py-6 text-sm text-muted-foreground">Preparing secure checkout…</p>}
      <p className="text-xs leading-relaxed text-muted-foreground">Instant digital delivery after payment. Sales are final, subject to your statutory rights. If you have a technical problem with your report, contact <a href="mailto:hello@quietcrew.ai" className="font-semibold underline underline-offset-4">hello@quietcrew.ai</a> and we will help you sort it out.</p>
    </DialogContent>
  </Dialog>;
}
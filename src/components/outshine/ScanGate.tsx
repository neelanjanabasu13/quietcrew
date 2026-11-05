import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "./Brand";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { outshineAllowance, startOutshineScan } from "@/lib/outshine/scan.functions";
import { ACCOUNT_FREE_SCANS, GUEST_FREE_SCANS } from "@/lib/outshine/scan-rules";
import { confirmScanCheckout, createScanCheckout } from "@/lib/outshine/scan-payments.functions";
import { getBusiness } from "@/lib/outshine/places.functions";
import { findBusiness } from "@/lib/outshine/sample";

export type LoadedAudit = NonNullable<Awaited<ReturnType<typeof getBusiness>>>;
export function ScanGate({ id, fresh, paymentSession, onReady }: { id: string; fresh: boolean; paymentSession?: string | undefined; onReady: (business: LoadedAudit, cached: boolean) => void }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<{ signedIn: boolean; remaining: number } | null>(null);
  const start = useServerFn(startOutshineScan);
  const read = useServerFn(getBusiness);
  const checkout = useServerFn(createScanCheckout);
  const confirm = useServerFn(confirmScanCheckout);
  const balance = useServerFn(outshineAllowance);
  useEffect(() => { if (findBusiness(id)) return; balance({ data: { environment: getStripeEnvironment() } }).then(setAllowance).catch(() => setAllowance(null)); }, [id, status, balance]);
  const run = useCallback(async (changesConfirmed = false) => {
    setStatus("loading"); setError(null);
    try {
      const environment = getStripeEnvironment();
      const result = await start({ data: { businessId: id, environment, fresh, changesConfirmed } });
      if (result.kind === "ready") {
        const business = await read({ data: { id, environment } });
        if (!business) throw new Error("The saved report could not be opened. Please try again.");
        onReady(business, Boolean(result.cached));
      } else { setStatus(result.kind); if (result.message) setError(result.message); }
    } catch (e) { setError(e instanceof Error ? e.message : "The scan could not start."); setStatus("error"); }
  }, [id, fresh, start, read, onReady]);
  useEffect(() => {
    let active = true;
    const open = async () => {
      if (findBusiness(id)) { const b = await read({ data: { id } }); if (active && b) onReady(b, false); return; }
      if (paymentSession) {
        try {
          const result = await confirm({ data: { businessId: id, sessionId: paymentSession, environment: getStripeEnvironment() } });
          if ("error" in result) throw new Error(result.error);
          if (!result.paid) throw new Error("Payment is not confirmed yet. Please try again shortly; no scan has started.");
          if (active) { window.history.replaceState(null, "", window.location.pathname + "?fresh=1"); setStatus("confirmation"); }
        } catch (e) { if (active) { setError(e instanceof Error ? e.message : "Could not confirm payment."); setStatus("error"); } }
      } else if (fresh) setStatus("confirmation");
      else await run();
    };
    void open();
    return () => { active = false; };
  }, [id, fresh, paymentSession, read, confirm, run, onReady]);
  const buy = async () => {
    setStatus("checkout-loading"); setError(null);
    try {
      const result = await checkout({ data: { businessId: id, environment: getStripeEnvironment() } });
      if ("error" in result) throw new Error(result.error);
      setClientSecret(result.clientSecret); setStatus("checkout");
    } catch (e) { setError(e instanceof Error ? e.message : "Checkout could not open."); setStatus("payment"); }
  };
  const fetchClientSecret = useCallback(async () => { if (!clientSecret) throw new Error("Checkout is not ready."); return clientSecret; }, [clientSecret]);
  const next = `/outshine/scan/${encodeURIComponent(id)}${fresh ? "?fresh=1" : ""}`;
  return <div className="min-h-screen bg-cream"><Header /><main className="mx-auto max-w-2xl px-6 py-12">
    <Button asChild variant="link" className="px-0"><Link to="/outshine">← Back to Outshine</Link></Button>
    <h1 className="mt-6 text-3xl font-extrabold">{status === "signin" ? "Sign in for more scans" : status === "payment" || status.startsWith("checkout") ? "A fresh scan for £2.99" : status === "confirmation" ? "Ready to check your changes?" : "Your Outshine scan"}</h1>
    {allowance && <p className="mt-4 inline-flex rounded-full bg-violet-tint px-4 py-1.5 text-sm font-semibold text-violet-deep" aria-live="polite">{allowance.signedIn ? `Free scans: ${ACCOUNT_FREE_SCANS - allowance.remaining} of ${ACCOUNT_FREE_SCANS} used` : `Guest scan: ${GUEST_FREE_SCANS - allowance.remaining} of ${GUEST_FREE_SCANS} used`}{allowance.remaining === 0 ? ", further scans are £2.99" : ""}</p>}
    {status === "loading" && <p role="status" className="mt-5 text-muted-foreground">Checking your allowance and preparing your report…</p>}
    {error && <p role="alert" className="mt-5 text-destructive">{error}</p>}
    {status === "signin" && <div className="mt-6 space-y-4"><p>Your guest scan is included in three free scans total when you create an account. A Done-for-You Fix Pack is a separate purchase.</p><Button asChild><Link to="/login" search={{ next, mode: "signup" }}>Create a free account</Link></Button><Button asChild variant="outline" className="ml-3"><Link to="/login" search={{ next, mode: "signin" }}>Sign in</Link></Button></div>}
    {status === "confirmation" && <div className="mt-6 space-y-5"><p>Run this check after applying changes, especially the instructions in your Done-for-You Fix Pack. Google may take time to publish edits, so an immediate re-check can show the same information.</p><p className="text-sm text-muted-foreground">This uses one available scan: your included same-business Fix Pack verification first, then a remaining free scan or a purchased £2.99 scan. If none are available, the price appears before payment.</p><label className="flex items-start gap-3"><Checkbox checked={confirmed} onCheckedChange={v => setConfirmed(v === true)} /><span>I have made changes and want to check them now.</span></label><Button disabled={!confirmed} onClick={() => void run(true)}>Check my changes</Button></div>}
    {status === "payment" && <div className="mt-6 space-y-5"><p>Your three free scans have been used. This £2.99 payment covers one fresh scan of this business, not a Done-for-You Fix Pack or a subscription.</p><Button onClick={() => void buy()}>Buy one fresh scan · £2.99</Button></div>}
    {status.startsWith("checkout") && <div className="mt-6"><PaymentTestModeBanner />{clientSecret ? <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider> : <p role="status">Preparing secure checkout…</p>}</div>}
    {(status === "error" || status === "busy") && <Button className="mt-5" onClick={() => void run(confirmed)}>Try again</Button>}
  </main></div>;
}

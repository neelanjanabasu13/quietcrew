import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { SCAN_AMOUNT, SCAN_PRICE_ID } from "./scan-rules";
import { resolveOrCreateCustomer } from "./payments.functions";
const input = z.object({ businessId: z.string().regex(/^live\.(plumbing|electrician|cleaning|landscaping|salon)\.[A-Za-z0-9_-]+$/).max(400), environment: z.enum(["sandbox", "live"]) });
export const createScanCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d: unknown) => input.parse(d)).handler(async ({ data, context }) => {
  try {
    const stripe = createStripeClient(data.environment);
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const { data: available, error: readError } = await context.supabase.from("outshine_scan_credits").select("id").eq("business_id", data.businessId).eq("environment", data.environment).eq("payment_status", "paid").is("used_by", null).limit(1).maybeSingle();
    if (readError) throw readError;
    if (available) return { error: "A scan for this business is already available. Close checkout and run your check." };
    const prices = await stripe.prices.list({ lookup_keys: [SCAN_PRICE_ID] });
    const price = prices.data[0];
    if (!price || price.unit_amount !== SCAN_AMOUNT || price.currency !== "gbp" || price.type !== "one_time") throw new Error("The £2.99 scan price is not configured correctly.");
    const product = await stripe.products.retrieve(typeof price.product === "string" ? price.product : price.product.id);
    const email = (context.claims as { email?: string }).email;
    const customer = await resolveOrCreateCustomer(stripe, { userId: context.userId, ...(email && { email }) });
    const { data: pending, error: pendingError } = await db.from("outshine_scan_credits").select("*").eq("user_id", context.userId).eq("business_id", data.businessId).eq("environment", data.environment).eq("payment_status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (pendingError) throw pendingError;
    if (pending?.stripe_session_id) {
      const previous = await stripe.checkout.sessions.retrieve(pending.stripe_session_id);
      if (previous.status === "open" && previous.client_secret) return { clientSecret: previous.client_secret };
      if (previous.status === "complete") return { error: "Your payment is being confirmed. Please close checkout and try the check again shortly." };
    }
    const { data: credit, error } = await db.from("outshine_scan_credits").insert({ user_id: context.userId, business_id: data.businessId, environment: data.environment }).select("id").single();
    if (error || !credit) throw error ?? new Error("Could not save the scan purchase.");
    const origin = new URL(getRequestUrl()).origin;
    const session = await stripe.checkout.sessions.create({ mode: "payment", ui_mode: "embedded_page", customer, adaptive_pricing: { enabled: false }, line_items: [{ price: price.id, quantity: 1 }], return_url: `${origin}/outshine/scan/${encodeURIComponent(data.businessId)}?scan_payment={CHECKOUT_SESSION_ID}`, payment_intent_data: { description: product.name }, metadata: { outshineScanCreditId: credit.id, userId: context.userId, businessId: data.businessId, environment: data.environment } }, { idempotencyKey: `outshine-scan-${credit.id}` });
    const { error: saveError } = await db.from("outshine_scan_credits").update({ stripe_session_id: session.id }).eq("id", credit.id);
    if (saveError) throw saveError;
    if (!session.client_secret) throw new Error("Stripe did not return a checkout form.");
    return { clientSecret: session.client_secret };
  } catch (error) { return { error: getStripeErrorMessage(error) }; }
});
export const confirmScanCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d: unknown) => input.extend({ sessionId: z.string().startsWith("cs_").max(300) }).parse(d)).handler(async ({ data, context }) => {
  try {
    const { confirmScanPayment } = await import("./scan-payments.server");
    const paid = await confirmScanPayment(data.sessionId, data.environment, context.userId, data.businessId);
    return { paid };
  } catch (error) { return { error: getStripeErrorMessage(error) }; }
});

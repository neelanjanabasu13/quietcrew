import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { DIY_AMOUNT, DIY_PRICE_ID } from "./payment-rules";
import type { Business } from "./sample";
import type { Sop } from "./diy";

export type PaidPack = { business: Business; sops: Record<string, Sop>; actions: Record<string, string> };

const input = z.object({ businessId: z.string().min(1).max(400), environment: z.enum(["sandbox", "live"]) });

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    const first = found.data[0];
    if (first) return first.id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    const customer = existing.data[0];
    if (customer) {
      if (options.userId && customer.metadata?.['userId'] !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createDiyCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth]).inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const { getBusiness } = await import("./places.functions");
      const business = await getBusiness({ data: { id: data.businessId } });
      if (!business?.live) return { error: "Please scan a real business before buying its DIY pack." };
      const { evaluate, topProblems } = await import("./audit");
      if (!topProblems(evaluate(business.trade, business.signals, business.name, true).filter(f => f.id !== "replies"), 5).length) return { error: "This profile has no assessed gaps, so there is no pack to buy." };
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [DIY_PRICE_ID] });
      const price = prices.data[0];
      if (!price || price.unit_amount !== DIY_AMOUNT || price.currency !== "gbp" || price.type !== "one_time") return { error: "The £7.99 DIY pack price is not configured correctly." };
      const product = await stripe.products.retrieve(typeof price.product === "string" ? price.product : price.product.id);
      const email = (context.claims as { email?: string }).email;
      const customer = await resolveOrCreateCustomer(stripe, { userId: context.userId, ...(email && { email }) });
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: existing, error: readError } = await context.supabase.from("outshine_purchases").select("*").eq("business_id", business.id).eq("environment", data.environment).maybeSingle();
      if (readError) throw readError;
      if (existing?.payment_status === "paid") return { error: "You already own this pack. Reload your report to download it." };
      if (existing?.stripe_session_id) {
        const previous = await stripe.checkout.sessions.retrieve(existing.stripe_session_id);
        if (previous.status === "open" && previous.client_secret) return { clientSecret: previous.client_secret };
        if (previous.status === "complete") return { error: "Your previous payment is being confirmed. Reload your report before trying again." };
      }
      const { data: purchase, error } = await supabaseAdmin.from("outshine_purchases").upsert({ user_id: context.userId, business_id: business.id, environment: data.environment, business_snapshot: JSON.parse(JSON.stringify(business)) }, { onConflict: "user_id,business_id,environment" }).select("id").single();
      if (error || !purchase) throw error ?? new Error("Could not save your purchase.");
      const origin = new URL(getRequestUrl()).origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment", ui_mode: "embedded_page", customer,
        line_items: [{ price: price.id, quantity: 1 }],
        return_url: `${origin}/outshine/report/${encodeURIComponent(business.id)}?session_id={CHECKOUT_SESSION_ID}`,
        payment_intent_data: { description: product.name },
        metadata: { userId: context.userId, outshinePurchaseId: purchase.id, businessId: business.id, environment: data.environment },
      }, { idempotencyKey: `outshine-${purchase.id}-${existing?.stripe_session_id ?? "first"}` });
      const { error: saveError } = await supabaseAdmin.from("outshine_purchases").update({ stripe_session_id: session.id }).eq("id", purchase.id);
      if (saveError) throw saveError;
      if (!session.client_secret) throw new Error("Stripe did not return a checkout form.");
      return { clientSecret: session.client_secret };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });

export const readDiyPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth]).inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data, context }): Promise<{ pack: PaidPack | null } | { error: string }> => {
    try {
      const { data: purchase, error } = await context.supabase.from("outshine_purchases").select("*").eq("business_id", data.businessId).eq("environment", data.environment).maybeSingle();
      if (error) throw error;
      if (!purchase) return { pack: null };
      if (purchase.stripe_session_id) {
        const { confirmDiyPayment } = await import("./payments.server");
        const paid = await confirmDiyPayment(purchase.stripe_session_id, data.environment);
        if (!paid) return { pack: null };
      } else return { pack: null };
      const business = purchase.business_snapshot as unknown as Business;
      const { evaluate, topProblems } = await import("./audit");
      const { sopFor } = await import("./diy");
      const { runAgent } = await import("./agent");
      const findings = topProblems(evaluate(business.trade, business.signals, business.name, true).filter(f => f.id !== "replies"), 5);
      return { pack: { business, sops: Object.fromEntries(findings.map(f => [f.id, sopFor(f, business.trade, business.name)])), actions: Object.fromEntries(findings.map(f => [f.id, runAgent(f.fix, business).output])) } };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
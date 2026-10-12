/**
 * Goldmine server functions.
 *
 * Every function that touches an order requires a signed in user and passes
 * that user id into the ownership check. None of these have been run against a
 * live engine: while GOLDMINE_ENGINE_URL and GOLDMINE_ENGINE_TOKEN are absent,
 * they return clearly labelled example data and no payment is taken.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const orderIdSchema = z.object({ orderId: z.string().uuid() });

/** Public: says only whether the engine is connected, never the values. */
export const getGoldmineStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { isEngineConfigured } = await import("./goldmine/engine.server");
  const configured = isEngineConfigured();
  return {
    engineConnected: configured,
    paidScanningEnabled: false,
    notice: configured
      ? "The research engine address is set. Paid scanning stays switched off until a real scan has been run and checked."
      : "The research engine is not connected yet, so everything shown is example data and no payment is taken.",
  };
});

export const createGoldmineOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        locality: z.string().trim().min(1).max(80),
        category: z.string().trim().min(1).max(80),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { createPreviewOrder } = await import("./goldmine/orders.server");
    const email = (context.claims as { email?: string } | undefined)?.email ?? "";
    return createPreviewOrder({
      userId: context.userId,
      email,
      locality: data.locality,
      category: data.category,
    });
  });

/** A signed in agency sees the full list only once the scan is paid for. */
async function gateForPayment(orderId: string, userId: string, snapshot: import("./goldmine/types").ScanSnapshot) {
  const { loadOwnedOrder, limitSnapshotForPreview } = await import("./goldmine/orders.server");
  const order = await loadOwnedOrder(orderId, { userId });
  if (order?.payment_status === "paid") return { ...snapshot, lockedCount: 0, paid: true };
  return { ...limitSnapshotForPreview(snapshot), paid: false };
}

export const startGoldmineScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { startScanForOrder } = await import("./goldmine/orders.server");
    const snap = await startScanForOrder(data.orderId, { userId: context.userId });
    return gateForPayment(data.orderId, context.userId, snap);
  });

export const getGoldmineScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { readScanForOrder } = await import("./goldmine/orders.server");
    const snap = await readScanForOrder(data.orderId, { userId: context.userId });
    return gateForPayment(data.orderId, context.userId, snap);
  });

export const getGoldmineDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    orderIdSchema.extend({ businessId: z.string().trim().min(1).max(120) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { readScanForOrder, readDraftsForBusiness } = await import("./goldmine/orders.server");
    const owner = { userId: context.userId };
    const gated = await gateForPayment(data.orderId, context.userId, await readScanForOrder(data.orderId, owner));
    if (!gated.businesses.some((b) => b.id === data.businessId)) {
      throw new Error("That business is part of the full scan");
    }
    return readDraftsForBusiness(data.orderId, owner, data.businessId);
  });

/** Moves a free preview run into the signed in agency's account, once. */
export const claimGuestGoldmineOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    orderIdSchema.extend({ guestToken: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = (context.claims as { email?: string } | undefined)?.email ?? "";
    await supabaseAdmin
      .from("goldmine_orders")
      .update({ user_id: context.userId, customer_email: email })
      .eq("id", data.orderId)
      .eq("guest_token", data.guestToken)
      .is("user_id", null);
    return { ok: true };
  });

/** Opens a £49 checkout for one owned order. */
export const createGoldmineCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    orderIdSchema
      .extend({ returnUrl: z.string().url().max(500), environment: z.enum(["sandbox", "live"]) })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<{ clientSecret: string } | { error: string }> => {
    const { loadOwnedOrder } = await import("./goldmine/orders.server");
    const order = await loadOwnedOrder(data.orderId, { userId: context.userId });
    if (!order) return { error: "That scan was not found in your account." };
    if (order.payment_status === "paid") return { error: "This scan is already unlocked." };
    const { createStripeClient, getStripeErrorMessage } = await import("./stripe.server");
    try {
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: ["goldmine_scan_single"] });
      const price = prices.data[0];
      if (!price) return { error: "The Goldmine price is not set up yet." };
      const email = (context.claims as { email?: string } | undefined)?.email;
      const userId = context.userId;
      let customerId: string;
      const found = await stripe.customers.search({ query: `metadata['userId']:'${userId}'`, limit: 1 });
      if (found.data.length) customerId = found.data[0].id;
      else {
        const byEmail = email ? await stripe.customers.list({ email, limit: 1 }) : { data: [] };
        if (byEmail.data.length) {
          customerId = byEmail.data[0].id;
          await stripe.customers.update(customerId, { metadata: { ...byEmail.data[0].metadata, userId } });
        } else {
          customerId = (await stripe.customers.create({ ...(email && { email }), metadata: { userId } })).id;
        }
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        payment_intent_data: { description: "Goldmine by Quietcrew Scan" },
        metadata: { userId, goldmineOrderId: order.id, managed_payments: "true" },
        managed_payments: { enabled: true },
      } as import("stripe").Stripe.Checkout.SessionCreateParams);
      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const listGoldmineOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { listOwnedOrders } = await import("./goldmine/orders.server");
    return listOwnedOrders(context.userId);
  });


/**
 * Free preview, no account needed.
 *
 * A visitor gets a random token from their own browser, the order is recorded
 * against that token, and only the first businesses are ever sent back. The
 * rest of the list needs an account, because that is what a purchase is
 * recorded and billed against.
 */
const guestSchema = z.object({ guestToken: z.string().uuid() });

export const createGuestGoldmineOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    guestSchema
      .extend({
        locality: z.string().trim().min(1).max(80),
        category: z.string().trim().min(1).max(80),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { createPreviewOrder } = await import("./goldmine/orders.server");
    return createPreviewOrder({
      userId: null,
      guestToken: data.guestToken,
      email: "",
      locality: data.locality,
      category: data.category,
    });
  });

export const startGuestGoldmineScan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => guestSchema.merge(orderIdSchema).parse(data))
  .handler(async ({ data }) => {
    const { startScanForOrder, limitSnapshotForPreview } = await import("./goldmine/orders.server");
    return limitSnapshotForPreview(
      await startScanForOrder(data.orderId, { guestToken: data.guestToken }),
    );
  });

export const getGuestGoldmineScan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => guestSchema.merge(orderIdSchema).parse(data))
  .handler(async ({ data }) => {
    const { readScanForOrder, limitSnapshotForPreview } = await import("./goldmine/orders.server");
    return limitSnapshotForPreview(
      await readScanForOrder(data.orderId, { guestToken: data.guestToken }),
    );
  });

export const getGuestGoldmineDrafts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    guestSchema.merge(orderIdSchema).extend({ businessId: z.string().trim().min(1).max(120) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { readScanForOrder, readDraftsForBusiness, limitSnapshotForPreview } = await import(
      "./goldmine/orders.server"
    );
    const owner = { guestToken: data.guestToken } as const;
    // The business must be one of the businesses the preview actually shows,
    // so a held back business cannot be reached by asking for it directly.
    const preview = limitSnapshotForPreview(await readScanForOrder(data.orderId, owner));
    if (!preview.businesses.some((b) => b.id === data.businessId)) {
      throw new Error("That business is part of the full scan");
    }
    return readDraftsForBusiness(data.orderId, owner, data.businessId);
  });

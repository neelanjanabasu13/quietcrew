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

export const startGoldmineScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { startScanForOrder } = await import("./goldmine/orders.server");
    return startScanForOrder(data.orderId, context.userId);
  });

export const getGoldmineScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { readScanForOrder } = await import("./goldmine/orders.server");
    return readScanForOrder(data.orderId, context.userId);
  });

export const getGoldmineDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    orderIdSchema.extend({ businessId: z.string().trim().min(1).max(120) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { readDraftsForBusiness } = await import("./goldmine/orders.server");
    return readDraftsForBusiness(data.orderId, context.userId, data.businessId);
  });

export const listGoldmineOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { listOwnedOrders } = await import("./goldmine/orders.server");
    return listOwnedOrders(context.userId);
  });

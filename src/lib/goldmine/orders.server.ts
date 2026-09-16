/**
 * Goldmine order handling.
 *
 * Ownership rule: every read and every action takes the signed in user id and
 * matches it against the order row. An order that belongs to another agency is
 * treated as if it does not exist, so nobody can probe for other people's runs.
 *
 * Nothing here has been run against the live engine. While the engine is
 * unconfigured, scans stay in fixture mode and no payment is taken.
 */

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  engineReadOutreach,
  engineReadScan,
  engineStartScan,
  isEngineConfigured,
  previewSnapshot,
} from "./engine.server";
import { fixturePendingSnapshot } from "./fixtures";
import { normaliseEngineRun, normaliseOutreach } from "./mapping";
import type { ScanSnapshot } from "./types";

export type OrderRow = {
  id: string;
  user_id: string;
  locality: string;
  category: string;
  payment_status: string;
  scan_status: string;
  engine_scan_id: string | null;
  engine_error: string | null;
  results: unknown;
  is_fixture: boolean;
};

const ORDER_COLUMNS =
  "id, user_id, locality, category, payment_status, scan_status, engine_scan_id, engine_error, results, is_fixture";

/** Returns the order only when it belongs to this user. */
export async function loadOwnedOrder(orderId: string, userId: string): Promise<OrderRow | null> {
  const { data, error } = await supabaseAdmin
    .from("goldmine_orders")
    .select(ORDER_COLUMNS)
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[goldmine] order lookup failed", error);
    throw new Error("Could not load that order");
  }
  return (data as OrderRow | null) ?? null;
}

export async function listOwnedOrders(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("goldmine_orders")
    .select("id, locality, category, payment_status, scan_status, is_fixture, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[goldmine] order list failed", error);
    throw new Error("Could not load your orders");
  }
  return data ?? [];
}

/**
 * Create a preview order. Paid scanning is off, so the order is recorded as
 * unpaid and in fixture mode until the engine and a payment provider are live.
 */
export async function createPreviewOrder(input: {
  userId: string;
  email: string;
  locality: string;
  category: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("goldmine_orders")
    .insert({
      user_id: input.userId,
      customer_email: input.email,
      locality: input.locality,
      category: input.category,
      payment_status: "unpaid",
      scan_status: "not_started",
      is_fixture: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[goldmine] order insert failed", error);
    throw new Error("Could not create that order");
  }
  return { id: data.id as string };
}

/**
 * Start the scan for an owned order.
 *
 * Idempotent in two places: the order row only moves out of not_started once,
 * and the engine call carries the order id as its idempotency key. A duplicate
 * request, including one caused by a repeated payment notification, returns the
 * run that already exists.
 */
export async function startScanForOrder(orderId: string, userId: string): Promise<ScanSnapshot> {
  const order = await loadOwnedOrder(orderId, userId);
  if (!order) throw new Error("That order was not found");

  if (!isEngineConfigured()) {
    // Fixture mode. No payment is taken and no provider is contacted.
    return fixturePendingSnapshot(order.locality, order.category);
  }

  if (order.payment_status !== "paid") {
    throw new Error("That scan has not been paid for");
  }

  if (order.engine_scan_id) {
    return readScanForOrder(orderId, userId);
  }

  const claimed = await claimOrderForScan(orderId);
  if (!claimed) {
    // Another request won the race and is already starting the same scan.
    return readScanForOrder(orderId, userId);
  }

  try {
    const { engineScanId } = await engineStartScan({
      orderId,
      locality: order.locality,
      category: order.category,
    });
    await supabaseAdmin
      .from("goldmine_orders")
      .update({ engine_scan_id: engineScanId, scan_status: "pending", is_fixture: false })
      .eq("id", orderId);
  } catch (err) {
    console.error("[goldmine] engine start failed", err);
    await supabaseAdmin
      .from("goldmine_orders")
      .update({ scan_status: "failed", engine_error: "The research engine could not start this scan." })
      .eq("id", orderId);
    throw new Error("The research engine could not start this scan");
  }

  return readScanForOrder(orderId, userId);
}

/** Moves not_started to starting exactly once; false means someone else did it. */
async function claimOrderForScan(orderId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("goldmine_orders")
    .update({ scan_status: "starting" })
    .eq("id", orderId)
    .eq("scan_status", "not_started")
    .select("id");

  if (error) {
    console.error("[goldmine] scan claim failed", error);
    throw new Error("Could not start that scan");
  }
  return (data?.length ?? 0) > 0;
}

/** Read the current state of an owned scan. */
export async function readScanForOrder(orderId: string, userId: string): Promise<ScanSnapshot> {
  const order = await loadOwnedOrder(orderId, userId);
  if (!order) throw new Error("That order was not found");

  if (!isEngineConfigured() || !order.engine_scan_id) {
    return previewSnapshot(order.locality, order.category);
  }

  try {
    const payload = await engineReadScan(order.engine_scan_id);
    const snapshot = normaliseEngineRun(payload, order.locality, order.category);
    await supabaseAdmin
      .from("goldmine_orders")
      .update({
        scan_status: snapshot.status,
        results: JSON.parse(JSON.stringify(snapshot)),
        ...(snapshot.status === "failed" ? { engine_error: "The run stopped early at the research engine." } : {}),
      })
      .eq("id", orderId);
    return snapshot;
  } catch (err) {
    console.error("[goldmine] engine read failed", err);
    // Partial results already stored are preserved rather than discarded.
    const stored = order.results as ScanSnapshot | null;
    if (stored && Array.isArray(stored.businesses)) {
      return { ...stored, status: "partial", message: "Some checks could not be reached. What has already arrived is shown below." };
    }
    throw new Error("Could not read that scan");
  }
}

/**
 * Drafts for one business inside an owned scan.
 *
 * Ownership is checked twice: the order must belong to this user, and the place
 * must appear in that order's own run. The engine can otherwise fall back to a
 * stored business when the run does not match, so the check cannot be left to it.
 */
export async function readDraftsForBusiness(orderId: string, userId: string, businessId: string) {
  const order = await loadOwnedOrder(orderId, userId);
  if (!order) throw new Error("That order was not found");

  const snapshot = await readScanForOrder(orderId, userId);
  const business = snapshot.businesses.find((b) => b.id === businessId);
  if (!business) throw new Error("That business was not found in this scan");

  if (snapshot.isFixture || !isEngineConfigured() || !order.engine_scan_id) {
    return { isFixture: snapshot.isFixture, drafts: business.drafts };
  }

  try {
    const payload = await engineReadOutreach({ engineScanId: order.engine_scan_id, placeId: business.id });
    const drafts = normaliseOutreach(payload);
    if (drafts.length === 0) {
      return {
        isFixture: false,
        drafts: [],
        message: "The engine did not return a draft for this business.",
      };
    }
    return { isFixture: false, drafts };
  } catch (err) {
    console.error("[goldmine] outreach read failed", err);
    const status = (err as { status?: number }).status;
    if (status === 422) {
      return {
        isFixture: false,
        drafts: [],
        message: "The engine could not verify the evidence for this business, so no draft was produced.",
      };
    }
    throw new Error("Could not prepare a draft for that business");
  }
}


/**
 * Record a payment notification once. Returns false when the same provider
 * event has already been seen, so a repeated notification cannot pay for or
 * start a second scan.
 */
export async function recordPaymentEvent(input: {
  provider: string;
  eventId: string;
  orderId: string | null;
  payload: unknown;
}): Promise<boolean> {
  const { error } = await supabaseAdmin.from("goldmine_payment_events").insert({
    provider: input.provider,
    event_id: input.eventId,
    order_id: input.orderId,
    payload: JSON.parse(JSON.stringify(input.payload ?? null)),
  });

  if (error) {
    // 23505 is the unique violation on (provider, event_id): a duplicate.
    if (error.code === "23505") return false;
    console.error("[goldmine] payment event insert failed", error);
    throw new Error("Could not record that payment event");
  }
  return true;
}

/** Marks an order paid once. A second call for the same order changes nothing. */
export async function markOrderPaid(orderId: string, reference: string, provider: string) {
  const { data, error } = await supabaseAdmin
    .from("goldmine_orders")
    .update({
      payment_status: "paid",
      payment_reference: reference,
      payment_provider: provider,
      is_fixture: false,
    })
    .eq("id", orderId)
    .eq("payment_status", "unpaid")
    .select("id, user_id");

  if (error) {
    console.error("[goldmine] mark paid failed", error);
    throw new Error("Could not record that payment");
  }
  return (data?.[0] as { id: string; user_id: string } | undefined) ?? null;
}

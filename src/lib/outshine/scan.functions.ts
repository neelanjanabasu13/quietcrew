import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findBusiness } from "./sample";
import { freeScansRemaining } from "./scan-rules";

const input = z.object({ businessId: z.string().regex(/^live\.(plumbing|electrician|cleaning|landscaping|salon)\.[A-Za-z0-9_-]+$/).max(400), environment: z.enum(["sandbox", "live"]), fresh: z.boolean().default(false), changesConfirmed: z.boolean().default(false) });
export const startOutshineScan = createServerFn({ method: "POST" }).inputValidator((d: unknown) => input.parse(d)).handler(async ({ data }) => {
  const { scanIdentity, savedBusiness, finishScan } = await import("./scan-access.server");
  const { db, userId, visitor, ipHash } = await scanIdentity(true);
  if (!visitor) return { kind: "error", message: "Could not start a scan session." };
  if (visitor.user_id && visitor.user_id !== userId) return { kind: "signin", message: "Sign in to continue with this scan session." };
  if (data.fresh && !data.changesConfirmed) return { kind: "error", message: "Make your changes first, then confirm you are ready for a fresh check." };
  const { data: reservation, error } = await db.rpc("outshine_reserve_scan", { p_visitor: visitor.id, p_user: userId ?? undefined, p_ip: ipHash, p_business: data.businessId, p_environment: data.environment, p_fresh: data.fresh });
  if (error) return { kind: "error", message: "The scan allowance could not be checked. No scan was started." };
  const result = reservation as { kind: string; scanId?: string };
  if (result.kind === "cached") return { kind: "ready", cached: true };
  if (result.kind !== "reserved" || !result.scanId) return { kind: result.kind, message: result.kind === "busy" ? "A scan is already running. Please wait a moment, then try again." : undefined };
  try {
    const [, trade, placeId] = data.businessId.split(".");
    const { getLiveBusiness, isTrade } = await import("./places.server");
    if (!trade || !isTrade(trade) || !placeId) throw new Error("Choose a supported business.");
    const business = await getLiveBusiness(data.businessId, trade, placeId, true, data.fresh);
    await finishScan(result.scanId, business);
    // Read back the durable report, rather than treating an upstream response as delivery.
    if (!await savedBusiness(data.businessId, data.environment)) throw new Error("The report could not be saved.");
    return { kind: "ready", cached: false };
  } catch (e) {
    await finishScan(result.scanId, null);
    return { kind: "error", message: e instanceof Error ? e.message : "The scan failed. Your scan allowance has not been used." };
  }
});
export const outshineAllowance = createServerFn({ method: "POST" }).inputValidator((d: unknown) => z.object({ environment: z.enum(["sandbox", "live"]) }).parse(d)).handler(async ({ data }) => {
  const { scanIdentity } = await import("./scan-access.server");
  const { db, userId, visitor, ipHash } = await scanIdentity(true);
  if (!visitor) throw new Error("Could not check scan allowance.");
  // Claiming the guest history is safe only for the original opaque cookie and an unclaimed visitor.
  if (userId && !visitor.user_id) {
    const { data: claimed, error } = await db.from("outshine_visitors").update({ user_id: userId }).eq("id", visitor.id).is("user_id", null).select("id").maybeSingle();
    if (error) throw error;
    if (claimed) { const { error: claimError } = await db.from("outshine_scans").update({ user_id: userId }).eq("visitor_id", visitor.id).is("user_id", null); if (claimError) throw claimError; }
  }
  let query = db.from("outshine_scans").select("id", { count: "exact", head: true }).eq("environment", data.environment).eq("source", "free").in("status", ["running", "completed"]);
  query = userId ? query.eq("user_id", userId) : query.or(`visitor_id.eq.${visitor.id},ip_hash.eq.${ipHash}`);
  const { count, error } = await query;
  if (error) throw error;
  return { signedIn: Boolean(userId), remaining: freeScansRemaining(Boolean(userId), count ?? 0) };
});

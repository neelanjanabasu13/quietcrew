import { getCookie, setCookie, getRequest } from "@tanstack/react-start/server";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Business } from "./sample";
import { REPORT_TTL_MS } from "./scan-rules";

const COOKIE = "outshine_visitor";
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export async function scanIdentity(create = false) {
  const request = getRequest();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  let userId: string | null = null;
  const bearer = request.headers.get("authorization");
  if (bearer) {
    const url = process.env["SUPABASE_URL"], key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Account checks are not configured.");
    const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: bearer }, fetch: (input, init) => { const headers = new Headers(init?.headers); headers.set("apikey", key); return fetch(input, { ...init, headers }); } } });
    const { data, error } = await client.auth.getUser(bearer.replace(/^Bearer /, ""));
    if (error || !data.user) throw new Error("Your sign-in has expired. Please sign in again.");
    userId = data.user.id;
  }
  const salt = process.env["GOOGLE_PLACES_API_KEY"];
  if (!salt) throw new Error("Business search is not configured.");
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const ipHash = createHmac("sha256", salt).update(ip).digest("hex");
  let token = getCookie(COOKIE);
  let visitor = token && /^[a-f0-9]{64}$/.test(token) ? (await db.from("outshine_visitors").select("*").eq("token_hash", hash(token)).maybeSingle()).data : null;
  if (!visitor && create) {
    await takeBudget(`visitor:${ipHash}`, 5, 24 * 60 * 60 * 1000);
    token = randomBytes(32).toString("hex");
    const { data, error } = await db.from("outshine_visitors").insert({ token_hash: hash(token), ip_hash: ipHash }).select("*").single();
    if (error || !data) throw new Error("Could not start a scan session.");
    visitor = data;
    setCookie(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return { db, userId, visitor, ipHash };
}
export async function takeBudget(scope: string, limit: number, windowMs: number) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const window = Math.floor(Date.now() / windowMs);
  const { data, error } = await supabaseAdmin.rpc("outshine_take_budget", { p_bucket: `${scope}:${window}`, p_limit: limit, p_expires: new Date((window + 1) * windowMs).toISOString() });
  if (error || !data) throw new Error("The scan safety limit has been reached. Please try again later; no scan has been used.");
}
export async function guardLookup() {
  const identity = await scanIdentity(true);
  await takeBudget(`lookup:${identity.ipHash}`, 30, 60 * 60 * 1000);
  return identity;
}
export async function guardGoogleCall() {
  await takeBudget("google:daily", 150, 24 * 60 * 60 * 1000);
}
export async function savedBusiness(id: string, environment: "sandbox" | "live") {
  const { db, userId, visitor } = await scanIdentity();
  if (!visitor && !userId) return null;
  let query = db.from("outshine_scans").select("snapshot,completed_at,expires_at").eq("business_id", id).eq("environment", environment).eq("status", "completed").gt("expires_at", new Date().toISOString()).order("completed_at", { ascending: false }).limit(1);
  const visitorAllowed = visitor && (!visitor.user_id || visitor.user_id === userId);
  if (userId && visitorAllowed) query = query.or(`user_id.eq.${userId},visitor_id.eq.${visitor.id}`);
  else if (userId) query = query.eq("user_id", userId);
  else if (visitorAllowed && visitor) query = query.eq("visitor_id", visitor.id);
  else return null;
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  if (data?.snapshot) return { ...(data.snapshot as unknown as Business), scannedAt: data.completed_at, expiresAt: data.expires_at };
  // A purchased pack remains readable after the free scan snapshot expires, without new Google calls.
  if (userId) {
    const { data: purchase, error: purchaseError } = await db.from("outshine_purchases").select("business_snapshot,paid_at").eq("user_id", userId).eq("business_id", id).eq("environment", environment).eq("payment_status", "paid").maybeSingle();
    if (purchaseError) throw purchaseError;
    if (purchase) return { ...(purchase.business_snapshot as unknown as Business), scannedAt: purchase.paid_at, expiresAt: null };
  }
  return null;
}
export async function finishScan(scanId: string, business: Business | null) {
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { error } = await db.from("outshine_scans").update(business ? { status: "completed", snapshot: JSON.parse(JSON.stringify(business)), completed_at: new Date().toISOString(), expires_at: new Date(Date.now() + REPORT_TTL_MS).toISOString() } : { status: "failed" }).eq("id", scanId).eq("status", "running");
  if (error) throw error;
  if (!business) { const { error: creditError } = await db.from("outshine_scan_credits").update({ used_by: null }).eq("used_by", scanId); if (creditError) throw creditError; }
}

export function signedPhotoUrl(name: string) {
  const secret = process.env["GOOGLE_PLACES_API_KEY"];
  if (!secret) throw new Error("Photos are not configured.");
  const expires = Date.now() + REPORT_TTL_MS;
  const signature = createHmac("sha256", secret).update(`${name}:${expires}`).digest("hex");
  return `/api/public/outshine-photo?name=${encodeURIComponent(name)}&expires=${expires}&signature=${signature}`;
}
export function validPhotoRequest(name: string, expires: string, signature: string) {
  const secret = process.env["GOOGLE_PLACES_API_KEY"];
  if (!secret || !/^\d+$/.test(expires) || Number(expires) < Date.now() || Number(expires) > Date.now() + REPORT_TTL_MS) return false;
  const expected = createHmac("sha256", secret).update(`${name}:${expires}`).digest("hex");
  return /^[a-f0-9]{64}$/.test(signature) && signature === expected;
}

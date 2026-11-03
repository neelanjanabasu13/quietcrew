import { afterAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { Database } from "@/integrations/supabase/types";
const url = process.env["SUPABASE_URL"];
const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const enabled = Boolean(url && key);
const db = enabled ? createClient<Database>(url ?? "", key ?? "", { auth: { persistSession: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key?.startsWith("sb_")) headers.delete("Authorization"); headers.set("apikey", key ?? ""); return fetch(input, { ...init, headers }); } } }) : null;
const visitors: string[] = [], users: string[] = [], ips: string[] = [];
async function identity() {
  if (!db) throw new Error("Database test access missing");
  const ip = `test-${randomUUID()}`, user = randomUUID();
  const { data, error } = await db.from("outshine_visitors").insert({ token_hash: randomUUID(), ip_hash: ip }).select("id").single();
  if (error || !data) throw error;
  visitors.push(data.id); users.push(user); ips.push(ip);
  return { visitor: data.id, ip, user };
}
async function reserve(i: Awaited<ReturnType<typeof identity>>, user: string | null, business = "live.cleaning.test-business", fresh = false) {
  if (!db) throw new Error("Database test access missing");
  const { data, error } = await db.rpc("outshine_reserve_scan", { p_visitor: i.visitor, p_user: user as string, p_ip: i.ip, p_business: business, p_environment: "sandbox", p_fresh: fresh });
  if (error) throw error;
  return data as { kind: string; scanId?: string };
}
async function complete(id?: string) {
  if (!db || !id) throw new Error("Missing reservation");
  const { error } = await db.from("outshine_scans").update({ status: "completed", completed_at: new Date().toISOString(), expires_at: new Date(Date.now() + 172800000).toISOString() }).eq("id", id);
  if (error) throw error;
}
describe.skipIf(!enabled)("Durable Outshine scan allowances", () => {
  afterAll(async () => {
    if (!db) return;
    await db.from("outshine_scans").delete().in("visitor_id", visitors);
    await db.from("outshine_scan_credits").delete().in("user_id", users);
    await db.from("outshine_visitors").delete().in("id", visitors);
  });
  it("enforces one guest scan and carries it into three account scans total", async () => {
    const i = await identity();
    const first = await reserve(i, null); expect(first.kind).toBe("reserved"); await complete(first.scanId);
    expect((await reserve(i, null)).kind).toBe("cached");
    expect((await reserve(i, null, "live.cleaning.second")).kind).toBe("signin");
    const second = await reserve(i, i.user, "live.cleaning.second"); expect(second.kind).toBe("reserved"); await complete(second.scanId);
    const third = await reserve(i, i.user, "live.cleaning.third"); expect(third.kind).toBe("reserved"); await complete(third.scanId);
    expect((await reserve(i, i.user, "live.cleaning.fourth")).kind).toBe("payment");
  });
  it("allows only one simultaneous reservation and restores failed scans", async () => {
    const i = await identity();
    const attempts = await Promise.all([reserve(i, null), reserve(i, null)]);
    expect(attempts.map(a => a.kind).sort()).toEqual(["busy", "reserved"]);
    const scan = attempts.find(a => a.kind === "reserved");
    if (!db || !scan?.scanId) throw new Error("Missing scan");
    await db.from("outshine_scans").update({ status: "failed" }).eq("id", scan.scanId);
    expect((await reserve(i, null)).kind).toBe("reserved");
  });
  it("prevents a cleared guest cookie from resetting the same network allowance", async () => {
    const i = await identity(), second = await identity(); second.ip = i.ip;
    const first = await reserve(i, null); await complete(first.scanId);
    expect((await reserve(second, null, "live.cleaning.another")).kind).toBe("signin");
  });
  it("uses one same-business DIY verification once without consuming another free scan", async () => {
    const i = await identity();
    if (!db) throw new Error("Missing database");
    const { data: credit, error } = await db.from("outshine_scan_credits").insert({ user_id: i.user, business_id: "live.cleaning.test-business", environment: "sandbox", kind: "verification", payment_status: "paid", purchase_id: randomUUID() }).select("id").single();
    if (error || !credit) throw error;
    const wrong = await reserve(i, i.user, "live.cleaning.other", true); await complete(wrong.scanId);
    const correct = await reserve(i, i.user, "live.cleaning.test-business", true); await complete(correct.scanId);
    const { data: scan } = await db.from("outshine_scans").select("source,credit_id").eq("id", correct.scanId ?? "").single();
    expect(scan?.source).toBe("verification"); expect(scan?.credit_id).toBe(credit.id);
    const repeat = await reserve(i, i.user, "live.cleaning.test-business", true);
    const { data: repeated } = await db.from("outshine_scans").select("source").eq("id", repeat.scanId ?? "").single();
    expect(repeated?.source).toBe("free");
  });
});

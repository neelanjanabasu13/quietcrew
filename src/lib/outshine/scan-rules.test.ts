import { describe, expect, it } from "vitest";
import { freeScansRemaining, isPaidScanSession, REPORT_TTL_MS, savedReportValid, SCAN_AMOUNT } from "./scan-rules";
describe("Outshine scan rules", () => {
  it("allows one guest scan", () => { expect(freeScansRemaining(false, 0)).toBe(1); expect(freeScansRemaining(false, 1)).toBe(0); });
  it("allows three account scans total, including the guest scan", () => { expect(freeScansRemaining(true, 1)).toBe(2); expect(freeScansRemaining(true, 3)).toBe(0); });
  it("reopens saved reports for 48 hours without a new scan", () => { expect(REPORT_TTL_MS).toBe(172800000); expect(savedReportValid(new Date(1000 + REPORT_TTL_MS).toISOString(), 1001)).toBe(true); expect(savedReportValid(new Date(1000 + REPORT_TTL_MS).toISOString(), 1000 + REPORT_TTL_MS)).toBe(false); });
  it("charges exactly £2.99 per extra scan", () => { expect(SCAN_AMOUNT).toBe(299); });
  const credit = { id: "credit", user_id: "owner", business_id: "business", environment: "sandbox" };
  const session = { status: "complete", payment_status: "paid", amount_total: 299, currency: "gbp", metadata: { outshineScanCreditId: "credit", userId: "owner", businessId: "business", environment: "sandbox" } };
  it("requires a completed paid scan session", () => { expect(isPaidScanSession(session, credit)).toBe(true); expect(isPaidScanSession({ ...session, payment_status: "unpaid" }, credit)).toBe(false); expect(isPaidScanSession({ ...session, amount_total: 359 }, credit)).toBe(false); });
  it("binds each payment to its owner, business and environment", () => { for (const change of [{ user_id: "other" }, { business_id: "other" }, { environment: "live" }, { id: "other" }]) expect(isPaidScanSession(session, { ...credit, ...change })).toBe(false); });
});

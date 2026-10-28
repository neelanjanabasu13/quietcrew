import { describe, expect, it } from "vitest";
import { DIY_AMOUNT, isPaidDiySession } from "./payment-rules";
const purchase = { id: "purchase", user_id: "owner", business_id: "business", environment: "sandbox" };
const session = { status: "complete", payment_status: "paid", amount_total: 999, currency: "gbp", metadata: { outshinePurchaseId: "purchase", userId: "owner", businessId: "business", environment: "sandbox" } };
describe("Outshine DIY purchase rules", () => {
  it("charges exactly £9.99, with no VAT added on top", () => { expect(DIY_AMOUNT).toBe(999); expect(isPaidDiySession(session, purchase)).toBe(true); expect(isPaidDiySession({ ...session, amount_total: 1199 }, purchase)).toBe(false); });
  it("does not deliver an unpaid pack", () => { expect(isPaidDiySession({ ...session, payment_status: "unpaid" }, purchase)).toBe(false); });
  it("only delivers to the paying owner and report", () => { expect(isPaidDiySession(session, { ...purchase, user_id: "other" })).toBe(false); expect(isPaidDiySession(session, { ...purchase, business_id: "other" })).toBe(false); });
  it("keeps test purchases separate from live", () => { expect(isPaidDiySession(session, { ...purchase, environment: "live" })).toBe(false); });
});
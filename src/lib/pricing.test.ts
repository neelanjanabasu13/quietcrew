import { describe, expect, it } from "vitest";
import { PRICES_PENCE, PRICE_LABELS } from "./pricing";

describe("Quietcrew prices", () => {
  it("Fix Pack is £19.99, was £24.99", () => { expect(PRICES_PENCE.fixPack).toBe(1999); expect(PRICE_LABELS.fixPackWas).toBe("£24.99"); });
  it("extra Outshine scans are £2.99", () => { expect(PRICE_LABELS.outshineScan).toBe("£2.99"); });
  it("Goldmine is £49 per scan", () => { expect(PRICE_LABELS.goldmineScan).toBe("£49"); });
  it("Workflow Audit is £99", () => { expect(PRICE_LABELS.workflowAudit).toBe("£99"); });
  it("consultation is £149 per hour", () => { expect(PRICE_LABELS.consultationHourly).toBe("£149"); });
});

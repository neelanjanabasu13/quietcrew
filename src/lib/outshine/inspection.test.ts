import { describe, expect, it } from "vitest";
import { checkSummary, inspect } from "./inspection";
import type { Business } from "./sample";

const base = (o: Partial<Business["signals"]> = {}, extra: Partial<Business> = {}): Business => ({
  id: "x", name: "Test", trade: "plumbing", address: "1 High St", area: "Leeds", phone: "0113",
  services: [], reviews: [], competitors: [],
  signals: { rating: 4.8, reviewCount: 60, reviewsLast90: 0, replyRate: 0, photoCount: 8, newestPhotoDays: 0, descriptionLength: 0, hasWebsite: true, hasHours: true, postsLast30: 0, credentialMentioned: false, servicesListed: 0, ownerPhotos: 8, websiteCredential: null, ...o },
  ...extra,
});

describe("free scan inspection", () => {
  it("never counts a check it could not run", () => {
    const s = checkSummary(inspect(base()));
    expect(s.checked).toBe(7);
  });
  it("flags a missing website as critical", () => {
    expect(inspect(base({ hasWebsite: false })).find((c) => c.id === "website")?.status).toBe("critical");
  });
  it("compares against rivals only when rivals were found", () => {
    const rival = base({ rating: 4.9, reviewCount: 200 }).signals;
    const checks = inspect(base({}, { competitors: [{ name: "R", signals: rival }] }));
    expect(checks.find((c) => c.id === "rival-volume")?.status).toBe("critical");
  });
});

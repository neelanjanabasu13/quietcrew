import { describe, expect, it } from "vitest";
import { fixtureSnapshot } from "./fixtures";
import { canUnlockOpportunities, nearbyAreas, opportunitySnapshot, evidenceGroup } from "./opportunities";

function scan(scores: number[], status: "completed" | "partial" = "completed") {
  const base = fixtureSnapshot("Soho & Carnaby", "Dental");
  const business = base.businesses[0];
  if (!business) throw new Error("A fixture business is required");
  return { ...base, status, businesses: scores.map((gold, index) => ({ ...business, id: String(index), gold })) };
}

describe("Goldmine opportunity results", () => {
  it("keeps a zero score in a completed scan", () => {
    expect(opportunitySnapshot(scan([0])).businesses).toHaveLength(1);
  });
  it("ranks every checked business before the two-business preview is sliced", () => {
    expect(opportunitySnapshot(scan([0, 12, 92, 91])).businesses.map((b) => b.gold)).toEqual([92, 91, 12, 0]);
  });
  it("keeps provisional zero scores while checks are running", () => {
    expect(opportunitySnapshot(scan([0], "partial")).businesses).toHaveLength(1);
  });
  it("does not allow payment when there are no prospects beyond the two free results", () => {
    expect(canUnlockOpportunities(scan([91, 92]))).toBe(false);
    expect(canUnlockOpportunities(scan([0, 91, 92]))).toBe(true);
    expect(canUnlockOpportunities(scan([91, 92, 12]))).toBe(true);
  });
  it("does not allow payment for unfinished scans", () => {
    expect(canUnlockOpportunities(scan([91, 92, 12], "partial"))).toBe(false);
  });
  it("suggests supported alternatives for Soho without keeping the original area", () => {
    expect(nearbyAreas("Soho & Carnaby", [{ areas: ["Soho & Carnaby", "Marylebone", "Fitzrovia", "Bloomsbury"] }])).toEqual(["Marylebone", "Fitzrovia", "Bloomsbury"]);
  });
  it("accepts the engine's city and country suffix on an area", () => {
    expect(nearbyAreas("Highgate, London, UK", [{ areas: ["Highgate", "Hampstead", "Camden Town"] }])).toEqual(["Hampstead", "Camden Town"]);
  });
});
it("counts every checked business by search area and preserves totals in the preview", () => {
  const snapshot = scan([90, 12, 0]);
  snapshot.discovery = {
    found: 3, qualified: 3, analysed: 3, chainsExcluded: 0,
    searchAreas: ["Highgate", "Crouch End"],
  };
  snapshot.businesses[0]!.searchArea = { name: "Highgate", nearby: false };
  for (const business of snapshot.businesses.slice(1)) {
    business.searchArea = { name: "Crouch End", nearby: true };
  }
  const full = opportunitySnapshot(snapshot);
  expect(full.discovery?.prospectsByArea).toEqual({ Highgate: 1, "Crouch End": 2 });
  const preview = opportunitySnapshot({ ...full, businesses: full.businesses.slice(0, 1), lockedCount: 1 });
  expect(preview.discovery?.prospectsByArea).toEqual(full.discovery?.prospectsByArea);
});

function withChecks(checks: ("none" | "named" | "unavailable")[]) {
  const b = scan([10]).businesses[0]!;
  const names = ["Gemini", "OpenAI", "Claude"] as const;
  return { ...b, providers: Object.fromEntries(names.map((n, i) => [n, checks[i] === "unavailable" ? { status: "unavailable", note: "" } : { status: "complete", mentions: checks[i] === "named" ? 2 : 0, note: "" }])) as typeof b.providers };
}
it("groups by assistant evidence rather than score", () => {
  expect(evidenceGroup(withChecks(["none", "none", "none"])).key).toBe("win");
  expect(evidenceGroup(withChecks(["none", "named", "none"])).key).toBe("build");
  expect(evidenceGroup(withChecks(["named", "unavailable", "none"])).key).toBe("incomplete");
});

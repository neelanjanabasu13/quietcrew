import { describe, expect, it } from "vitest";
import { fixtureSnapshot } from "./fixtures";
import { canUnlockOpportunities, nearbyAreas, opportunitySnapshot } from "./opportunities";

function scan(scores: number[], status: "completed" | "partial" = "completed") {
  const base = fixtureSnapshot("Soho & Carnaby", "Dental");
  const business = base.businesses[0];
  if (!business) throw new Error("A fixture business is required");
  return { ...base, status, businesses: scores.map((gold, index) => ({ ...business, id: String(index), gold })) };
}

describe("Goldmine opportunity results", () => {
  it("excludes a zero score from a completed scan", () => {
    expect(opportunitySnapshot(scan([0])).businesses).toEqual([]);
  });
  it("ranks positive scores before the two-business preview is sliced", () => {
    expect(opportunitySnapshot(scan([0, 12, 92, 91])).businesses.map((b) => b.gold)).toEqual([92, 91, 12]);
  });
  it("keeps provisional zero scores while checks are running", () => {
    expect(opportunitySnapshot(scan([0], "partial")).businesses).toHaveLength(1);
  });
  it("does not allow payment when there are no prospects beyond the two free results", () => {
    expect(canUnlockOpportunities(scan([0, 91, 92]))).toBe(false);
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
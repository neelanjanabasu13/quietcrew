import { describe, expect, it } from "vitest";
import { mapRunStatus, normaliseEngineRun, normaliseOutreach } from "./mapping";
import { fixturePendingSnapshot, fixtureSnapshot } from "./fixtures";

describe("Goldmine fixtures", () => {
  it("labels every fixture snapshot as example data", () => {
    const snapshot = fixtureSnapshot("Highgate", "Dentists");
    expect(snapshot.isFixture).toBe(true);
    expect(snapshot.message).toMatch(/Example data/);
  });

  it("reports a failed provider check as unavailable rather than zero mentions", () => {
    const snapshot = fixtureSnapshot("Highgate", "Dentists");
    const claude = snapshot.businesses[0]!.providers.Claude;
    expect(claude.status).toBe("unavailable");
    expect(snapshot.counts.unavailable).toBeGreaterThan(0);
  });

  it("treats an all pending run as pending", () => {
    expect(fixturePendingSnapshot("Camden", "Law firms").status).toBe("pending");
  });
});

describe("Engine payload mapping", () => {
  const payload = {
    status: "running",
    businesses: [
      {
        id: "a",
        name: "A Practice",
        reputation: { rating: 4.8, reviews: 100 },
        gold: 70,
        providers: {
          Gemini: { status: "complete", mentions: 0, note: "No mentions." },
          OpenAI: { status: "error" },
          Claude: { status: "pending" },
        },
        drafts: [{ id: "d1", angle: "Gap", body: "Hello" }],
      },
    ],
  };

  it("keeps a genuine zero separate from a failed check", () => {
    const snapshot = normaliseEngineScan(payload, "Highgate", "Dentists");
    const providers = snapshot.businesses[0]!.providers;
    expect(providers.Gemini).toEqual({ status: "complete", mentions: 0, note: "No mentions." });
    expect(providers.OpenAI.status).toBe("unavailable");
    expect(providers.Claude.status).toBe("pending");
  });

  it("calls a run with some checks outstanding partial", () => {
    const snapshot = normaliseEngineScan(payload, "Highgate", "Dentists");
    expect(snapshot.status).toBe("partial");
    expect(snapshot.isFixture).toBe(false);
  });

  it("calls a run failed when every check failed", () => {
    const all = normaliseEngineScan(
      {
        businesses: [
          {
            id: "b",
            providers: { Gemini: { status: "error" }, OpenAI: { status: "error" }, Claude: { status: "error" } },
          },
        ],
      },
      "Camden",
      "Dentists",
    );
    expect(all.status).toBe("failed");
    expect(deriveStatus(all.businesses)).toBe("failed");
  });
});

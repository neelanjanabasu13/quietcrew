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

describe("Engine run mapping", () => {
  const runPayload = {
    run_id: "run_example",
    location: "Highgate",
    category: "Dentists",
    status: "running",
    stage: "ai_checks",
    results: [
      {
        place_id: "place_a",
        name: "A Practice",
        address: "Highgate",
        rating: 4.8,
        review_count: 100,
        quality: "Strong reputation locally.",
        gold_score: 70,
        score_status: "ready",
        ai: {
          queries: [
            { query: "q1", status: "tested", mentioned: false, providers: { openai: { status: "failed" }, anthropic: { status: "pending" } } },
            { query: "q2", status: "tested", mentioned: true, providers: { openai: { status: "failed" }, anthropic: { status: "pending" } } },
          ],
          providers: { gemini: { total: 2, mentions: 1, visibility: 50, status: "tested" } },
        },
      },
    ],
  };

  it("keeps a genuine non mention separate from a failed or pending check", () => {
    const snapshot = normaliseEngineRun(runPayload, "Highgate", "Dentists");
    const providers = snapshot.businesses[0]!.providers;
    expect(providers.Gemini).toMatchObject({ status: "complete", mentions: 1 });
    expect(providers.OpenAI.status).toBe("unavailable");
    expect(providers.Claude.status).toBe("pending");
  });

  it("never turns a missing total into zero mentions", () => {
    const snapshot = normaliseEngineRun(
      {
        status: "running",
        results: [{ place_id: "p", ai: { queries: [], providers: { gemini: { status: "running" } } } }],
      },
      "Camden",
      "Dentists",
    );
    expect(snapshot.businesses[0]!.providers.Gemini).toEqual({ status: "pending" });
  });

  it("maps the engine statuses onto the four interface states", () => {
    expect(mapRunStatus("running", false)).toBe("pending");
    expect(mapRunStatus("running", true)).toBe("partial");
    expect(mapRunStatus("market_ready", true)).toBe("partial");
    expect(mapRunStatus("complete", true)).toBe("completed");
    expect(mapRunStatus("error", true)).toBe("failed");
  });

  it("keeps results that already arrived when the run reports an error", () => {
    const snapshot = normaliseEngineRun({ ...runPayload, status: "error" }, "Highgate", "Dentists");
    expect(snapshot.status).toBe("failed");
    expect(snapshot.businesses).toHaveLength(1);
  });

  it("reads an outreach draft and its evidence note", () => {
    const drafts = normaliseOutreach({ subject: "Visibility gap", body: "Hello there.", evidence_note: "Gemini only." });
    expect(drafts[0]).toMatchObject({ angle: "Visibility gap", body: "Hello there." });
    expect(drafts).toHaveLength(2);
  });

  it("returns no draft when the engine sends an empty body", () => {
    expect(normaliseOutreach({ subject: "x", body: "" })).toEqual([]);
  });
});

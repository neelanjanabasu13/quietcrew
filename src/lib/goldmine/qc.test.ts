import { describe, expect, it } from "vitest";
import { percentilePhrase } from "./mapping";
import { opportunitySnapshot } from "./opportunities";
import type { ScanSnapshot } from "./types";

const biz = (id: string, name: string, area: string, gold: number) => ({
  id, name, area, category: "Beauty and aesthetics", reputation: { rating: 5, reviews: 10 }, gold, why: "", drafts: [],
  providers: { Gemini: { status: "complete", mentions: 0 }, OpenAI: { status: "complete", mentions: 0 }, Claude: { status: "complete", mentions: 0 } },
});

describe("Goldmine QC rules", () => {
  it("never says top 0 or top 99", () => {
    expect(percentilePhrase(100)).toBe("top 1 per cent");
    expect(percentilePhrase(1)).toBe("bottom 1 per cent");
    expect(percentilePhrase(94)).toBe("top 6 per cent");
  });
  it("ranks Paddington W2 businesses above Harley Street and drops gyms", () => {
    const snap = {
      status: "completed", locality: "Paddington", category: "Beauty and aesthetics",
      businesses: [
        biz("a", "Dermis Clinics", "150 Harley St, London W1G 7LQ, UK", 91),
        biz("b", "Spa Bayswater", "1 Queensway, London W2 4QJ, UK", 40),
        biz("c", "Nuffield Health Paddington", "London W2 1AA, UK", 60),
      ],
    } as unknown as ScanSnapshot;
    const out = opportunitySnapshot(snap).businesses;
    expect(out.map((b) => b.id)).toEqual(["b", "a"]);
    expect(out[1].outsideArea).toBe(true);
  });
});

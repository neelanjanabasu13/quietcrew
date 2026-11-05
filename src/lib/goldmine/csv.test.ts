import { describe, expect, it } from "vitest";
import { businessesToCsv } from "./csv";
import type { ScanBusiness } from "./types";

const b: ScanBusiness = {
  id: "1", name: 'Joe "The" Baker', area: "Camden", category: "Retail", reputation: { rating: 4.8, reviews: 120 }, gold: 82, why: "=SUM(A1)",
  providers: { Gemini: { status: "complete", mentions: 0, note: "" }, OpenAI: { status: "unavailable", note: "" }, Claude: { status: "pending" } },
  drafts: [{ id: "d", angle: "a", body: "Hello" }],
};

describe("businessesToCsv", () => {
  it("escapes quotes, blocks formulas and keeps unavailable distinct from zero", () => {
    const [, row] = businessesToCsv([b]).split("\r\n");
    expect(row).toContain('"Joe ""The"" Baker"');
    expect(row).toContain(`"'=SUM(A1)"`);
    expect(row).toContain('"0","unavailable","pending"');
  });
});

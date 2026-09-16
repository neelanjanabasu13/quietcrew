/** Shared Goldmine shapes. Safe to import from the browser: no secrets here. */

export type ProviderName = "Gemini" | "OpenAI" | "Claude";

export const PROVIDERS: ProviderName[] = ["Gemini", "OpenAI", "Claude"];

/**
 * A failed provider check is "unavailable", which is deliberately different
 * from a genuine result of zero mentions. A failure tells you nothing about the
 * business, so it must never be presented as an absence of mentions.
 */
export type ProviderCheck =
  | { status: "pending" }
  | { status: "complete"; mentions: number; note: string }
  | { status: "unavailable"; note: string };

export type ScanBusiness = {
  id: string;
  name: string;
  area: string;
  category: string;
  reputation: { rating: number; reviews: number };
  gold: number;
  why: string;
  providers: Record<ProviderName, ProviderCheck>;
  drafts: { id: string; angle: string; body: string }[];
};

/** Overall run state. Partial means some checks landed and others have not. */
export type ScanStatus = "pending" | "partial" | "failed" | "completed";

export type ScanSnapshot = {
  status: ScanStatus;
  /** True whenever the content is example data rather than an engine result. */
  isFixture: boolean;
  locality: string;
  category: string;
  businesses: ScanBusiness[];
  counts: { completed: number; unavailable: number; total: number };
  message: string;
};

export function countChecks(businesses: ScanBusiness[]) {
  let completed = 0;
  let unavailable = 0;
  for (const business of businesses) {
    for (const provider of PROVIDERS) {
      const check = business.providers[provider];
      if (check.status === "complete") completed += 1;
      if (check.status === "unavailable") unavailable += 1;
    }
  }
  return { completed, unavailable, total: businesses.length * PROVIDERS.length };
}

export function deriveStatus(businesses: ScanBusiness[]): ScanStatus {
  const counts = countChecks(businesses);
  if (counts.completed === 0 && counts.unavailable === counts.total) return "failed";
  if (counts.completed === 0 && counts.unavailable === 0) return "pending";
  if (counts.completed + counts.unavailable < counts.total) return "partial";
  return "completed";
}

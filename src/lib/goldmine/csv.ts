import { evidenceGroup } from "./opportunities";
import { PROVIDERS, type ScanBusiness } from "./types";

/** Quote a CSV cell and neutralise spreadsheet formula injection. */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function businessesToCsv(businesses: ScanBusiness[]): string {
  const header = ["Rank", "Business", "Area", "Category", "Google rating", "Google reviews", "Gold score", "Group", "Website", ...PROVIDERS.map((p) => `${p} mentions`), "Why it is a prospect", "Area match", "First outreach draft"];
  const rows = businesses.map((b, i) => [
    i + 1, b.name, b.area, b.category, b.reputation.rating, b.reputation.reviews, b.gold, evidenceGroup(b).label, b.website ?? "",
    ...PROVIDERS.map((p) => { const c = b.providers[p]; return c.status === "complete" ? c.mentions : c.status === "unavailable" ? "not checked" : "pending"; }),
    b.why, b.outsideArea ? "Nearby" : "In area",
    b.drafts[0]?.body || "Open this business in your report to write its draft",
  ]);
  return [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}

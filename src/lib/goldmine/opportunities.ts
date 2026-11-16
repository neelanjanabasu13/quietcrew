import { PROVIDERS, type ScanBusiness, type ScanSnapshot } from "./types";

/** Rank every checked business before preview slicing; zero scores stay in the report. */
export function opportunitySnapshot(snapshot: ScanSnapshot): ScanSnapshot {
  if (snapshot.status !== "completed") return snapshot;
  const businesses = snapshot.businesses
    .map((business) => ({ ...business, gold: Number.isFinite(business.gold) ? business.gold : 0 }))
    .sort((a, b) => b.gold - a.gold);
  const discovery = snapshot.discovery;
  if (!discovery?.searchAreas?.length || discovery.prospectsByArea) return { ...snapshot, businesses };
  const prospectsByArea = Object.fromEntries(discovery.searchAreas.map((area) => [area, 0]));
  for (const business of businesses) {
    const area = business.searchArea?.name;
    if (area && Object.hasOwn(prospectsByArea, area)) prospectsByArea[area] = (prospectsByArea[area] ?? 0) + 1;
  }
  return { ...snapshot, businesses, discovery: { ...discovery, prospectsByArea } };
}

export function canUnlockOpportunities(snapshot: ScanSnapshot): boolean {
  return snapshot.status === "completed" && opportunitySnapshot(snapshot).businesses.length > 2;
}

const centralAlternatives: Record<string, string[]> = {
  "Soho & Carnaby": ["Marylebone", "Fitzrovia", "Bloomsbury"],
  "Covent Garden & Strand": ["Bloomsbury", "Fitzrovia", "Marylebone"],
  "Fitzrovia": ["Marylebone", "Bloomsbury", "Soho & Carnaby"],
  "Marylebone": ["Fitzrovia", "Paddington", "Bloomsbury"],
};

export function nearbyAreas(locality: string, groups: { areas: string[] }[]): string[] {
  const supported = groups.flatMap((group) => group.areas);
  locality = supported.find((area) => locality === area || locality.startsWith(`${area},`)) ?? locality;
  const curated = centralAlternatives[locality];
  if (curated) return curated.filter((area) => supported.includes(area));
  const areas = groups.find((group) => group.areas.includes(locality))?.areas ?? [];
  const index = areas.indexOf(locality);
  return areas.filter((area) => area !== locality)
    .sort((a, b) => Math.abs(areas.indexOf(a) - index) - Math.abs(areas.indexOf(b) - index))
    .slice(0, 3);
}
export type EvidenceGroup = { key: "win" | "build" | "incomplete"; label: string; pitch: string };

export const EVIDENCE_GROUPS: Record<EvidenceGroup["key"], EvidenceGroup> = {
  win: { key: "win", label: "Win more AI recommendations", pitch: "Well reviewed, but not named in the sampled assistant answers. Lead with the visibility gap." },
  build: { key: "build", label: "Build on existing AI visibility", pitch: "Already named by at least one assistant. Pitch making that visibility consistent and protecting it." },
  incomplete: { key: "incomplete", label: "Checks incomplete", pitch: "Some assistant checks did not finish, so only the finished checks are shown and no claim is made from the rest." },
};

/** Grouped by assistant evidence, never by Gold score alone. */
export function evidenceGroup(business: ScanBusiness): EvidenceGroup {
  const checks = PROVIDERS.map((p) => business.providers[p]);
  if (checks.some((c) => c.status !== "complete")) return EVIDENCE_GROUPS.incomplete;
  return checks.some((c) => c.status === "complete" && c.mentions > 0) ? EVIDENCE_GROUPS.build : EVIDENCE_GROUPS.win;
}

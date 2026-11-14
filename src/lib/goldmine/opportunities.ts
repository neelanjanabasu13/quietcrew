import type { ScanSnapshot } from "./types";

/** Filter before preview slicing so zero scores never occupy or inflate paid slots. */
export function opportunitySnapshot(snapshot: ScanSnapshot): ScanSnapshot {
  if (snapshot.status !== "completed") return snapshot;
  return {
    ...snapshot,
    businesses: snapshot.businesses
      .filter((business) => Number.isFinite(business.gold) && business.gold > 0)
      .sort((a, b) => b.gold - a.gold),
  };
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
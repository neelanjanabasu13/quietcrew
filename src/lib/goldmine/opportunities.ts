import { PROVIDERS, type ScanBusiness, type ScanSnapshot } from "./types";

/** Rank every checked business before preview slicing; zero scores stay in the report. */
export function opportunitySnapshot(snapshot: ScanSnapshot): ScanSnapshot {
  if (snapshot.status !== "completed") return snapshot;
  const districts = areaDistricts(snapshot.locality);
  const businesses = snapshot.businesses
    .filter((business) => !excludedForCategory(business))
    .map((business) => ({
      ...business,
      gold: Number.isFinite(business.gold) ? business.gold : 0,
      outsideArea: districts ? !inDistricts(business.area, districts) : false,
    }))
    .sort((a, b) => Number(a.outsideArea) - Number(b.outsideArea) || b.gold - a.gold);
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

/** Postcode districts that count as inside each chosen area. Unlisted areas are not reordered. */
export const AREA_DISTRICTS: Record<string, string[]> = {
  "Soho & Carnaby": ["W1D", "W1F", "W1B"],
  "Covent Garden & Strand": ["WC2E", "WC2H", "WC2N", "WC2R", "WC2B"],
  "Fitzrovia": ["W1T", "W1W"],
  "Marylebone": ["W1U", "W1H", "W1G", "NW1"],
  "Mayfair": ["W1J", "W1K", "W1S"],
  "Bloomsbury": ["WC1A", "WC1B", "WC1E", "WC1H", "WC1N", "WC1R"],
  "King's Cross & St Pancras": ["N1C", "WC1X", "WC1H", "N1"],
  "London Bridge": ["SE1"],
  "Bankside & Borough": ["SE1"],
  "Waterloo & South Bank": ["SE1"],
  "Victoria": ["SW1V", "SW1W", "SW1E", "SW1P"],
  "Paddington": ["W2"],
  "Notting Hill": ["W11", "W10", "W2"],
  "Shoreditch": ["EC2A", "E1", "E2", "N1"],
  "Highgate": ["N6"],
  "Hampstead": ["NW3"],
  "Camden Town": ["NW1"],
  "Kentish Town": ["NW5"],
  "Angel & Islington": ["N1", "EC1V"],
  "Crouch End": ["N8"],
  "Muswell Hill": ["N10"],
  "Finsbury Park": ["N4"],
  "Stoke Newington": ["N16"],
  "Golders Green": ["NW11"],
  "Brixton": ["SW2", "SW9"],
  "Clapham": ["SW4"],
  "Peckham": ["SE15"],
  "Balham": ["SW12"],
  "Tooting": ["SW17"],
  "Battersea": ["SW11"],
  "Putney": ["SW15"],
  "Chelsea": ["SW3", "SW10"],
  "Kensington": ["W8", "W14", "SW7", "SW5"],
  "Hammersmith": ["W6"],
  "Chiswick": ["W4"],
  "Acton": ["W3"],
  "Shepherd's Bush": ["W12"],
  "Greenwich": ["SE10"],
  "Blackheath": ["SE3"],
  "Canary Wharf": ["E14"],
  "Hackney Central": ["E8", "E9"],
  "Dalston": ["E8"],
  "Bethnal Green": ["E2"],
  "Brick Lane": ["E1"],
};

function areaDistricts(locality: string): string[] | null {
  const key = Object.keys(AREA_DISTRICTS).find((area) => locality === area || locality.startsWith(`${area},`));
  return key ? AREA_DISTRICTS[key] : null;
}

/** True when the address has no readable postcode or its district is listed. */
function inDistricts(address: string, districts: string[]): boolean {
  const match = address.toUpperCase().match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*\d[A-Z]{2}\b/);
  return match ? districts.includes(match[1]) : true;
}

const GYM = /\b(gym|fitness|health club|leisure centre|crossfit|nuffield health|puregym|virgin active|david lloyd|the gym group)\b/i;

/** Gyms are not beauty businesses, even when they offer spa treatments. */
function excludedForCategory(business: ScanBusiness): boolean {
  return /beauty|aesthetic/i.test(business.category) && GYM.test(business.name);
}

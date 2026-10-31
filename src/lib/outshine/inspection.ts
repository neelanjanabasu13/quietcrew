import { TRADES } from "./audit";
import type { Business } from "./sample";

export type CheckStatus = "pass" | "attention" | "critical" | "unknown";

export interface Check {
  id: string;
  group: "Reputation" | "Against your rivals" | "Profile basics" | "Trust";
  label: string;
  status: CheckStatus;
  detail: string;
}

const median = (xs: number[]): number => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? (s[m] ?? 0) : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2;
};

/** Only checks that come straight from Google's public data or the business's own website. Nothing is guessed. */
export function inspect(b: Business): Check[] {
  const s = b.signals;
  const t = TRADES[b.trade];
  const rivals = b.competitors.map((c) => c.signals);
  const rivalReviews = median(rivals.map((r) => r.reviewCount));
  const rivalRating = rivals.length ? rivals.reduce((a, r) => a + r.rating, 0) / rivals.length : 0;
  const owner = s.ownerPhotos ?? s.photoCount;
  const checks: Check[] = [
    {
      id: "rating", group: "Reputation", label: "Star rating",
      status: s.rating >= 4.7 ? "pass" : s.rating >= 4.3 ? "attention" : "critical",
      detail: `${s.rating.toFixed(1)} stars on Google. Most people look for 4.5 or higher before they call.`,
    },
    {
      id: "volume", group: "Reputation", label: "Number of reviews",
      status: s.reviewCount >= 50 ? "pass" : s.reviewCount >= 15 ? "attention" : "critical",
      detail: `${s.reviewCount} reviews in total. Fewer than 15 makes a profile look new or quiet.`,
    },
  ];
  if (rivals.length) {
    checks.push(
      {
        id: "rival-rating", group: "Against your rivals", label: "Rating against nearby rivals",
        status: s.rating >= rivalRating ? "pass" : rivalRating - s.rating <= 0.2 ? "attention" : "critical",
        detail: `You have ${s.rating.toFixed(1)}, and the ${rivals.length} nearest rivals we found average ${rivalRating.toFixed(1)}.`,
      },
      {
        id: "rival-volume", group: "Against your rivals", label: "Reviews against nearby rivals",
        status: s.reviewCount >= rivalReviews ? "pass" : s.reviewCount >= rivalReviews / 2 ? "attention" : "critical",
        detail: `You have ${s.reviewCount}, and the typical nearby rival has ${Math.round(rivalReviews)}.`,
      },
    );
  }
  checks.push(
    {
      id: "photos", group: "Profile basics", label: "Photos you have uploaded yourself",
      status: owner >= 5 ? "pass" : owner >= 1 ? "attention" : "critical",
      detail: owner ? `At least ${owner} of the photos Google shows were added by you. Customers expect ${t.expectedPhotos}.` : `None of the photos Google shows were added by you. Customers expect ${t.expectedPhotos}.`,
    },
    {
      id: "website", group: "Profile basics", label: "Website linked",
      status: s.hasWebsite ? "pass" : "critical",
      detail: s.hasWebsite ? "A website is linked from your Google profile." : "There is no website on your Google profile, so people who want to check you out go elsewhere.",
    },
    {
      id: "hours", group: "Profile basics", label: "Opening hours",
      status: s.hasHours ? "pass" : "attention",
      detail: s.hasHours ? "Opening hours are listed." : "No opening hours are listed, so customers cannot tell when you will pick up.",
    },
    {
      id: "phone", group: "Profile basics", label: "Phone number",
      status: b.phone ? "pass" : "critical",
      detail: b.phone ? `${b.phone} is shown, so people can tap to call.` : "No phone number is shown, which is how most trade jobs start.",
    },
    {
      id: "address", group: "Profile basics", label: "Address or service area",
      status: b.address ? "pass" : "attention",
      detail: b.address ? "An address is shown, which helps Google match you to nearby searches." : "No address is shown.",
    },
    {
      id: "credential", group: "Trust", label: `${t.credential} named on your website`,
      status: s.websiteCredential === true ? "pass" : s.websiteCredential === false ? "attention" : "unknown",
      detail: s.websiteCredential === true ? `Your website mentions ${t.credential}.` : s.websiteCredential === false ? `Your website does not mention ${t.credential}. ${t.credentialPlain}` : "We could not read a website to check this.",
    },
  );
  return checks;
}

/** Things Google does not publish reliably, so the free scan says so rather than guessing. */
export const NOT_CHECKED = [
  { label: "Whether you reply to reviews", why: "Google does not share owner replies through its public data." },
  { label: "How recent your newest review is", why: "Google only shares five reviews, picked by relevance rather than date." },
  { label: "Your full photo count", why: "Google only shares a sample of up to ten photos." },
  { label: "Google posts and updates", why: "Google does not share posts through its public data." },
];

export function checkSummary(checks: Check[]) {
  const done = checks.filter((c) => c.status !== "unknown");
  return {
    checked: done.length,
    passed: done.filter((c) => c.status === "pass").length,
    attention: done.filter((c) => c.status === "attention").length,
    critical: done.filter((c) => c.status === "critical").length,
  };
}

/**
 * Clearly labelled example data.
 *
 * Every snapshot produced here carries isFixture true and a message saying so.
 * This is what the integration layer is tested against while the research
 * engine is unavailable. None of it reflects a real scan of a real business.
 */

import { countChecks, deriveStatus, type ScanBusiness, type ScanSnapshot } from "./types";

export const FIXTURE_NOTICE =
  "Example data. The research engine is not connected, so nothing here reflects a live check of a real business.";

function businesses(locality: string, category: string): ScanBusiness[] {
  return [
    {
      id: "hornsey-lane-dental",
      name: "Hornsey Lane Dental Practice",
      area: locality,
      category,
      reputation: { rating: 4.9, reviews: 214 },
      gold: 86,
      why: "Strong local reputation over many years, and almost no presence in the answers the assistants give when someone asks for a practice nearby.",
      providers: {
        Gemini: { status: "complete", mentions: 0, note: "Named three other practices and did not name this one." },
        OpenAI: { status: "complete", mentions: 1, note: "Named the practice once, in a list of five." },
        Claude: { status: "unavailable", note: "The check did not complete, so there is no result for this provider." },
      },
      drafts: [
        {
          id: "d1",
          angle: "The visibility gap",
          body: "Hello, when someone asks an AI assistant for a practice in this area, your name is not among the ones it returns, even though you hold a 4.9 rating across more than two hundred reviews. I have written up what each assistant said, and I am happy to send it over.",
        },
        {
          id: "d2",
          angle: "Evidence first",
          body: "Hello, I ran the same ten questions people ask assistants when they look for a business like yours nearby. Two of the three assistants named competitors and none named you. The write up takes two minutes to read, and I can send it with no obligation.",
        },
      ],
    },
    {
      id: "marlow-grey-physio",
      name: "Marlow and Grey Physiotherapy",
      area: locality,
      category,
      reputation: { rating: 4.8, reviews: 168 },
      gold: 74,
      why: "Mentioned occasionally by one assistant and missing from the others, so there is room to improve how consistently it appears.",
      providers: {
        Gemini: { status: "complete", mentions: 2, note: "Named the business in two of the ten questions." },
        OpenAI: { status: "complete", mentions: 0, note: "Named other businesses in the area." },
        Claude: { status: "complete", mentions: 1, note: "Named the business once, alongside two others." },
      },
      drafts: [
        {
          id: "d1",
          angle: "Partly visible",
          body: "Hello, one of the three assistants I tested does mention you when asked about this area, and the other two do not. That inconsistency is usually fixable, and I have the detail of what each one said.",
        },
      ],
    },
    {
      id: "fallow-kitchen",
      name: "The Fallow Kitchen",
      area: locality,
      category,
      reputation: { rating: 4.7, reviews: 402 },
      gold: 61,
      why: "Well reviewed and already named by two assistants, so the opportunity here is narrower than the others on this list.",
      providers: {
        Gemini: { status: "complete", mentions: 4, note: "Named the business in four of the ten questions." },
        OpenAI: { status: "complete", mentions: 3, note: "Named the business in three of the ten questions." },
        Claude: { status: "unavailable", note: "The check did not complete, so there is no result for this provider." },
      },
      drafts: [
        {
          id: "d1",
          angle: "Hold the ground",
          body: "Hello, two of the three assistants I tested already recommend you when asked about this area. The third does not, and I have written down exactly what it said instead.",
        },
      ],
    },
  ];
}

export function fixtureSnapshot(locality: string, category: string): ScanSnapshot {
  const list = businesses(locality, category);
  return {
    status: deriveStatus(list),
    isFixture: true,
    locality,
    category,
    businesses: list,
    counts: countChecks(list),
    message: FIXTURE_NOTICE,
  };
}

/** Same data with every check still running, for exercising the pending state. */
export function fixturePendingSnapshot(locality: string, category: string): ScanSnapshot {
  const list = businesses(locality, category).map((business) => ({
    ...business,
    providers: {
      Gemini: { status: "pending" } as const,
      OpenAI: { status: "pending" } as const,
      Claude: { status: "pending" } as const,
    },
  }));
  return {
    status: "pending",
    isFixture: true,
    locality,
    category,
    businesses: list,
    counts: countChecks(list),
    message: FIXTURE_NOTICE,
  };
}

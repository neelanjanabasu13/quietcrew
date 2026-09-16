import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Goldmine results preview.
 *
 * Everything here is fixture data used to show how a completed scan reads.
 * No provider APIs are called, and nothing on this screen reflects a live run.
 */

type ProviderName = "Gemini" | "OpenAI" | "Claude";

type ProviderState =
  | { status: "pending" }
  | { status: "complete"; mentions: number; note: string }
  | { status: "unavailable"; note: string };

type Business = {
  id: string;
  name: string;
  area: string;
  category: string;
  reputation: { rating: number; reviews: number };
  gold: number;
  why: string;
  drafts: { id: string; angle: string; body: string }[];
};

const PROVIDERS: ProviderName[] = ["Gemini", "OpenAI", "Claude"];

const businesses: Business[] = [
  {
    id: "hornsey-lane-dental",
    name: "Hornsey Lane Dental Practice",
    area: "Highgate",
    category: "Dentists",
    reputation: { rating: 4.9, reviews: 214 },
    gold: 86,
    why: "Strong local reputation over many years, and almost no presence in the answers the assistants give when someone asks for a dentist nearby.",
    drafts: [
      {
        id: "d1",
        angle: "The visibility gap",
        body: "Hello, when someone asks an AI assistant for a dentist in Highgate, your practice is not among the names it returns, even though you hold a 4.9 rating across more than two hundred reviews. I have written up what each assistant said, and I am happy to send it over.",
      },
      {
        id: "d2",
        angle: "Evidence first",
        body: "Hello, I ran the same ten questions people ask assistants when they look for a dentist in your area. Two of the three assistants named competitors and none named you. The write up takes two minutes to read, and I can send it with no obligation.",
      },
    ],
  },
  {
    id: "marlow-grey-physio",
    name: "Marlow and Grey Physiotherapy",
    area: "Crouch End",
    category: "Physiotherapists",
    reputation: { rating: 4.8, reviews: 168 },
    gold: 74,
    why: "Mentioned occasionally by one assistant and missing from the others, so there is room to improve how consistently the practice appears.",
    drafts: [
      {
        id: "d1",
        angle: "Partly visible",
        body: "Hello, one of the three assistants I tested does mention your practice when asked about physiotherapy in Crouch End, and the other two do not. That inconsistency is usually fixable, and I have the detail of what each one said.",
      },
    ],
  },
  {
    id: "fallow-kitchen",
    name: "The Fallow Kitchen",
    area: "Highgate",
    category: "Restaurants and cafés",
    reputation: { rating: 4.7, reviews: 402 },
    gold: 61,
    why: "Well reviewed and already named by two assistants, so the opportunity here is narrower than the others on this list.",
    drafts: [
      {
        id: "d1",
        angle: "Hold the ground",
        body: "Hello, two of the three assistants I tested already recommend you when asked where to eat in Highgate. The third does not, and I have written down exactly what it said instead.",
      },
    ],
  },
];

/** Fixture outcomes, including one provider that fails rather than returning a count. */
const outcomes: Record<string, Record<ProviderName, ProviderState>> = {
  "hornsey-lane-dental": {
    Gemini: { status: "complete", mentions: 0, note: "Named three other practices and did not name this one." },
    OpenAI: { status: "complete", mentions: 1, note: "Named the practice once, in a list of five." },
    Claude: { status: "unavailable", note: "The check did not complete, so there is no result for this provider." },
  },
  "marlow-grey-physio": {
    Gemini: { status: "complete", mentions: 2, note: "Named the practice in two of the ten questions." },
    OpenAI: { status: "complete", mentions: 0, note: "Named other clinics in the area." },
    Claude: { status: "complete", mentions: 1, note: "Named the practice once, alongside two others." },
  },
  "fallow-kitchen": {
    Gemini: { status: "complete", mentions: 4, note: "Named the restaurant in four of the ten questions." },
    OpenAI: { status: "complete", mentions: 3, note: "Named the restaurant in three of the ten questions." },
    Claude: { status: "unavailable", note: "The check did not complete, so there is no result for this provider." },
  },
};

/** Arrival order for the preview, in milliseconds after the run starts. */
const schedule: { businessId: string; provider: ProviderName; at: number }[] = [
  { businessId: "hornsey-lane-dental", provider: "Gemini", at: 1200 },
  { businessId: "marlow-grey-physio", provider: "Gemini", at: 1900 },
  { businessId: "fallow-kitchen", provider: "Gemini", at: 2600 },
  { businessId: "hornsey-lane-dental", provider: "OpenAI", at: 3400 },
  { businessId: "marlow-grey-physio", provider: "OpenAI", at: 4200 },
  { businessId: "fallow-kitchen", provider: "OpenAI", at: 5000 },
  { businessId: "marlow-grey-physio", provider: "Claude", at: 5900 },
  { businessId: "hornsey-lane-dental", provider: "Claude", at: 6700 },
  { businessId: "fallow-kitchen", provider: "Claude", at: 7400 },
];

type ResultMap = Record<string, Record<ProviderName, ProviderState>>;

function pendingMap(): ResultMap {
  const map: ResultMap = {};
  for (const b of businesses) {
    map[b.id] = { Gemini: { status: "pending" }, OpenAI: { status: "pending" }, Claude: { status: "pending" } };
  }
  return map;
}

function stateFor(map: ResultMap, id: string): Record<ProviderName, ProviderState> {
  return (
    map[id] ?? { Gemini: { status: "pending" }, OpenAI: { status: "pending" }, Claude: { status: "pending" } }
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-violet-tint border-t-violet"
    />
  );
}

function ProviderRow({ provider, state }: { provider: ProviderName; state: ProviderState }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] bg-violet-tint px-3 py-2 text-[14px] font-semibold">
      <span>{provider}</span>
      {state.status === "pending" ? (
        <span className="flex items-center gap-2 text-muted-paper">
          <Spinner />
          Checking…
        </span>
      ) : state.status === "unavailable" ? (
        <span className="text-muted-paper">Unavailable</span>
      ) : (
        <span className="text-violet">
          {state.mentions === 0
            ? "No mentions found"
            : state.mentions === 1
              ? "1 mention"
              : `${state.mentions} mentions`}
        </span>
      )}
    </div>
  );
}

export function GoldmineResults() {
  const [results, setResults] = useState<ResultMap>(pendingMap);
  const [openId, setOpenId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setResults(pendingMap());
    for (const step of schedule) {
      timers.current.push(
        setTimeout(() => {
          // Results are merged in, so an open business detail and any edited
          // draft stay exactly as they were while checks continue to land.
          setResults((prev) => {
            const current = prev[step.businessId] as Record<ProviderName, ProviderState>;
            const outcome = outcomes[step.businessId] as Record<ProviderName, ProviderState>;
            return {
              ...prev,
              [step.businessId]: { ...current, [step.provider]: outcome[step.provider] },
            };
          });
        }, step.at),
      );
    }
  }, []);

  useEffect(() => {
    start();
    return () => timers.current.forEach(clearTimeout);
  }, [start]);

  const completed = useMemo(() => {
    let done = 0;
    let unavailable = 0;
    for (const b of businesses) {
      for (const p of PROVIDERS) {
        const s = stateFor(results, b.id)[p];
        if (s.status === "complete") done += 1;
        if (s.status === "unavailable") unavailable += 1;
      }
    }
    return { done, unavailable, total: businesses.length * PROVIDERS.length };
  }, [results]);

  const open = businesses.find((b) => b.id === openId) ?? null;
  const draftKey = (businessId: string, draftId: string) => `${businessId}:${draftId}`;

  return (
    <div>
      <div className="rounded-[20px] bg-white p-5 soft-shadow md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow self-start">Preview with example data</p>
            <p className="mt-3 text-[15px] text-muted-paper">
              Highgate and nearby, mixed categories. Nothing here is a live check, and no provider
              is contacted while you are on this page.
            </p>
          </div>
          <button type="button" onClick={start} className="pill-btn btn-primary-dark px-5 py-3 text-[15px]">
            Replay the preview
          </button>
        </div>

        <div
          className="mt-5 grid gap-3 sm:grid-cols-3"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="rounded-[14px] bg-violet-tint px-4 py-3">
            <p className="text-[13px] text-muted-paper">Checks completed</p>
            <p className="text-[20px] font-extrabold text-ink">
              {completed.done} of {completed.total}
            </p>
          </div>
          <div className="rounded-[14px] bg-violet-tint px-4 py-3">
            <p className="text-[13px] text-muted-paper">Still running</p>
            <p className="text-[20px] font-extrabold text-ink">
              {completed.total - completed.done - completed.unavailable}
            </p>
          </div>
          <div className="rounded-[14px] bg-violet-tint px-4 py-3">
            <p className="text-[13px] text-muted-paper">Unavailable</p>
            <p className="text-[20px] font-extrabold text-ink">{completed.unavailable}</p>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-muted-paper">
          When a provider check fails it is recorded as unavailable rather than as zero mentions,
          because a failed check tells you nothing about the business. Everything that has already
          come back stays on screen, and the drafts remain available throughout.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* List */}
        <ul className="space-y-4">
          {businesses.map((b) => {
            const state = stateFor(results, b.id);
            const pending = PROVIDERS.filter((p) => state[p].status === "pending").length;
            const isOpen = openId === b.id;
            return (
              <li key={b.id} className="rounded-[20px] bg-white p-5 soft-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1.1rem]">{b.name}</h3>
                    <p className="mt-1 text-[14px] text-muted-paper">
                      {b.area}, {b.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-muted-paper">Gold opportunity score</p>
                    <p className="text-[22px] font-extrabold text-violet">{b.gold}</p>
                  </div>
                </div>

                <p className="mt-3 text-[14px] font-semibold text-ink">
                  Customer reputation: {b.reputation.rating} from {b.reputation.reviews} reviews
                </p>

                <div className="mt-3 space-y-2">
                  {PROVIDERS.map((p) => (
                    <ProviderRow key={p} provider={p} state={state[p]} />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : b.id)}
                    aria-expanded={isOpen}
                    className="pill-btn btn-primary-dark px-5 py-3 text-[14px]"
                  >
                    {isOpen ? "Close detail" : "Open detail and drafts"}
                  </button>
                  {pending > 0 ? (
                    <span className="flex items-center gap-2 text-[13px] text-muted-paper">
                      <Spinner />
                      {pending} of {PROVIDERS.length} still checking
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Detail */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {open ? (
            <div className="rounded-[20px] bg-white p-6 soft-shadow">
              <p className="eyebrow self-start">Business detail</p>
              <h3 className="mt-4 text-[1.35rem]">{open.name}</h3>
              <p className="mt-2 text-[14px] text-muted-paper">
                {open.area}, {open.category}. Reputation {open.reputation.rating} from{" "}
                {open.reputation.reviews} reviews.
              </p>

              <div className="mt-5 space-y-3">
                {PROVIDERS.map((p) => {
                  const s = stateFor(results, open.id)[p];
                  return (
                    <div key={p} className="rounded-[14px] bg-violet-tint px-4 py-3">
                      <div className="flex items-center justify-between gap-3 text-[14px] font-semibold">
                        <span>{p}</span>
                        {s.status === "pending" ? (
                          <span className="flex items-center gap-2 text-muted-paper">
                            <Spinner />
                            Checking…
                          </span>
                        ) : s.status === "unavailable" ? (
                          <span className="text-muted-paper">Unavailable</span>
                        ) : (
                          <span className="text-violet">
                            {s.mentions === 0 ? "No mentions found" : `${s.mentions} in ten questions`}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[13px] text-muted-paper">
                        {s.status === "pending" ? "The result will appear here when it arrives." : s.note}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[14px] bg-cream p-4">
                <p className="text-[13px] font-semibold text-ink">Why the score reads this way</p>
                <p className="mt-2 text-[14px] text-muted-paper">{open.why}</p>
              </div>

              <div className="mt-6">
                <p className="text-[15px] font-semibold text-ink">Outreach drafts</p>
                <p className="mt-1 text-[13px] text-muted-paper">
                  Drafts stay available while checks are still running, and anything you type here
                  is kept as new results arrive. You decide what to send, and Goldmine sends
                  nothing on your behalf.
                </p>
                <div className="mt-4 space-y-4">
                  {open.drafts.map((d) => {
                    const key = draftKey(open.id, d.id);
                    return (
                      <div key={d.id}>
                        <label
                          htmlFor={`draft-${key}`}
                          className="mono-label text-muted-paper"
                        >
                          {d.angle}
                        </label>
                        <textarea
                          id={`draft-${key}`}
                          rows={5}
                          value={drafts[key] ?? d.body}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="mt-2 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-[15px] text-ink"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] bg-cream p-6 text-[15px] text-muted-paper">
              Open any business to read what each assistant said and to see the outreach drafts.
              The detail updates as further checks land, without disturbing a draft you are
              editing.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[20px] bg-white p-6 soft-shadow">
        <p className="eyebrow self-start">About the Gold score</p>
        <p className="mt-4 text-[15px] text-muted-paper">
          Gold is an opportunity score for you as an agency, not a rating of how well the business
          is run. It simply describes how much room there is between a healthy customer reputation
          and how often the assistants mention that business. A lower score means a narrower gap on
          the day of the scan, and it is not a judgement about the business or a reason to leave it
          off your list. You choose whom to approach, in whatever order suits your agency.
        </p>
      </div>
    </div>
  );
}

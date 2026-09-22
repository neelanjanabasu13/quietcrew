import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  createGoldmineOrder,
  createGuestGoldmineOrder,
  getGoldmineDrafts,
  getGoldmineScan,
  getGuestGoldmineDrafts,
  getGuestGoldmineScan,
  startGoldmineScan,
  startGuestGoldmineScan,
} from "@/lib/goldmine.functions";
import { PROVIDERS, type ProviderCheck, type ProviderName, type ScanSnapshot } from "@/lib/goldmine/types";

/**
 * Live Goldmine intake and results.
 *
 * Every engine call happens on the server, behind the signed in agency's own
 * order, so neither the engine address nor its token is ever present in the
 * browser. Purchases are switched off, so a scan is run without payment while
 * the engine is still being hardened.
 */

// Areas and categories are exactly the ones the research engine supports, in
// the regions it groups them by. Anything outside this list is refused.
const localityGroups: { region: string; areas: string[] }[] = [
  {
    region: "Central London",
    areas: [
      "Soho & Carnaby", "Covent Garden & Strand", "Fitzrovia", "Marylebone", "Mayfair",
      "Bloomsbury", "King's Cross & St Pancras", "London Bridge", "Bankside & Borough",
      "Waterloo & South Bank", "Victoria", "Paddington", "Notting Hill", "Shoreditch",
    ],
  },
  {
    region: "North London",
    areas: [
      "Highgate", "Hampstead", "Camden Town", "Kentish Town", "Angel & Islington",
      "Crouch End", "Muswell Hill", "Finsbury Park", "Stoke Newington", "Finchley",
      "Golders Green",
    ],
  },
  {
    region: "East London",
    areas: [
      "Hackney Central", "Dalston", "Bethnal Green", "Brick Lane", "Canary Wharf",
      "Stratford", "Walthamstow", "Leyton", "Greenwich", "Blackheath",
    ],
  },
  {
    region: "South London",
    areas: [
      "Brixton", "Clapham", "Peckham", "Dulwich", "Balham", "Tooting", "Wimbledon",
      "Battersea", "Putney", "Richmond", "Kingston",
    ],
  },
  {
    region: "West London",
    areas: [
      "Kensington", "Chelsea", "Hammersmith", "Chiswick", "Ealing", "Acton",
      "Shepherd's Bush", "Wembley", "Harrow",
    ],
  },
];

const categories = [
  "Restaurants and cafés",
  "Bars and pubs",
  "Dental",
  "Hair",
  "Fitness",
  "Beauty and aesthetics",
  "Estate agencies",
  "Accountancy",
  "Legal",
  "Home services",
  "Automotive",
  "Veterinary",
  "Private healthcare",
  "Retail",
  "Hospitality",
];

// The first results are shown in full so an agency can judge the quality of the
// work. The remainder of the list is held back until the scan is paid for.
const FREE_PREVIEW_COUNT = 2;

/**
 * A visitor who is not signed in still runs a real scan and reads the first
 * results. The run is recorded against a random token kept in their own
 * browser, so their results stay theirs while no account exists yet.
 */
const GUEST_TOKEN_KEY = "goldmine.guest";

function guestToken(): string {
  const existing = window.localStorage.getItem(GUEST_TOKEN_KEY);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  window.localStorage.setItem(GUEST_TOKEN_KEY, fresh);
  return fresh;
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-violet-tint border-t-violet"
    />
  );
}

function ProviderRow({ provider, check }: { provider: ProviderName; check: ProviderCheck }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] bg-violet-tint px-3 py-2 text-[14px] font-semibold">
      <span>{provider}</span>
      {check.status === "pending" ? (
        <span className="flex items-center gap-2 text-muted-paper">
          <Spinner />
          Checking…
        </span>
      ) : check.status === "unavailable" ? (
        <span className="text-muted-paper">Unavailable</span>
      ) : (
        <span className="text-violet">
          {check.mentions === 0
            ? "No mentions found"
            : check.mentions === 1
              ? "1 mention"
              : `${check.mentions} mentions`}
        </span>
      )}
    </div>
  );
}

type DraftState = {
  loading: boolean;
  message?: string;
  drafts: { id: string; angle: string; body: string }[];
};

export function GoldmineLive() {
  const createOrder = useServerFn(createGoldmineOrder);
  const startScan = useServerFn(startGoldmineScan);
  const readScan = useServerFn(getGoldmineScan);
  const readDrafts = useServerFn(getGoldmineDrafts);
  const createGuestOrder = useServerFn(createGuestGoldmineOrder);
  const startGuestScan = useServerFn(startGuestGoldmineScan);
  const readGuestScan = useServerFn(getGuestGoldmineScan);
  const readGuestDrafts = useServerFn(getGuestGoldmineDrafts);

  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [locality, setLocality] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<ScanSnapshot | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draftState, setDraftState] = useState<Record<string, DraftState>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);
  // Flipped on once a scan is paid for. Payment is not connected yet, so the
  // locked results stay locked.
  const [unlocked] = useState(false);


  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (poll.current) {
      clearInterval(poll.current);
      poll.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const beginPolling = useCallback(
    (id: string) => {
      stopPolling();
      poll.current = setInterval(() => {
        (signedIn
          ? readScan({ data: { orderId: id } })
          : readGuestScan({ data: { orderId: id, guestToken: guestToken() } })
        )
          .then((next) => {
            // Results are merged in as they arrive, so an open business detail
            // and anything typed into a draft are left exactly as they were.
            setSnapshot(next as ScanSnapshot);
            if ((next as ScanSnapshot).status === "completed" || (next as ScanSnapshot).status === "failed") {
              stopPolling();
            }
          })
          .catch(() => {
            setError("The last update could not be read. Anything already on screen is kept.");
          });
      }, 6000);
    },
    [readScan, readGuestScan, signedIn, stopPolling],
  );

  async function onRun() {
    setError(null);
    if (!locality || !category) {
      setError("Choose a London area and a business category first.");
      return;
    }
    setBusy(true);
    setSnapshot(null);
    setOpenId(null);
    setDraftState({});
    try {
      const token = signedIn ? null : guestToken();
      const order = (token
        ? await createGuestOrder({ data: { locality, category, guestToken: token } })
        : await createOrder({ data: { locality, category } })) as { id: string };
      setOrderId(order.id);
      const first = (token
        ? await startGuestScan({ data: { orderId: order.id, guestToken: token } })
        : await startScan({ data: { orderId: order.id } })) as ScanSnapshot;
      setSnapshot(first);
      if (first.status === "pending" || first.status === "partial") beginPolling(order.id);
    } catch {
      setError("The scan could not be started. Nothing has been charged, and you can try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onOpen(businessId: string) {
    if (openId === businessId) {
      setOpenId(null);
      return;
    }
    setOpenId(businessId);
    if (!orderId || draftState[businessId]) return;
    setDraftState((prev) => ({ ...prev, [businessId]: { loading: true, drafts: [] } }));
    try {
      const result = (await (signedIn
        ? readDrafts({ data: { orderId, businessId } })
        : readGuestDrafts({ data: { orderId, businessId, guestToken: guestToken() } }))) as {
        drafts: { id: string; angle: string; body: string }[];
        message?: string;
      };
      setDraftState((prev) => ({
        ...prev,
        [businessId]: {
          loading: false,
          drafts: result.drafts ?? [],
          ...(result.message ? { message: result.message } : {}),
        },
      }));
    } catch {
      setDraftState((prev) => ({
        ...prev,
        [businessId]: {
          loading: false,
          drafts: [],
          message: "The draft could not be prepared for this business. The scan results are unaffected.",
        },
      }));
    }
  }

  const visibleBusinesses = unlocked
    ? (snapshot?.businesses ?? [])
    : (snapshot?.businesses ?? []).slice(0, FREE_PREVIEW_COUNT);
  // Held back businesses are counted by the server for a visitor, because
  // their details are never sent to the browser in the first place.
  const lockedCount =
    (snapshot?.lockedCount ?? 0) + (snapshot?.businesses.length ?? 0) - visibleBusinesses.length;
  const open = visibleBusinesses.find((b) => b.id === openId) ?? null;
  const openDrafts = openId ? draftState[openId] : undefined;


  return (
    <div className="rounded-[24px] bg-white p-6 text-ink soft-shadow-lg md:p-8">
      <p className="text-[15px] text-muted-paper">
        Choose a London area and a business category. Goldmine runs the discovery and the
        assistant checks for you, and nothing is sent to any business on your behalf.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="goldmine-locality" className="mono-label text-muted-paper">
            Locality
          </label>
          <select
            id="goldmine-locality"
            aria-describedby="goldmine-locality-help"
            className="mt-2 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-[16px] font-semibold text-ink"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          >
            <option value="" disabled>
              Choose a London area
            </option>
            {localityGroups.map((group) => (
              <optgroup key={group.region} label={group.region}>
                {group.areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p id="goldmine-locality-help" className="mt-2 text-[13px] text-muted-paper">
            One London area, grouped by central, north, east, south and west.
          </p>
        </div>

        <div>
          <label htmlFor="goldmine-category" className="mono-label text-muted-paper">
            Business category
          </label>
          <select
            id="goldmine-category"
            aria-describedby="goldmine-category-help"
            className="mt-2 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-[16px] font-semibold text-ink"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p id="goldmine-category-help" className="mt-2 text-[13px] text-muted-paper">
            One type of business, for example Restaurants and cafés.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[14px] text-muted-paper">
        There is no box for business names or websites. Finding the businesses is Goldmine&rsquo;s
        job, so you only choose where to look and what kind of business to look for.
      </p>

      <button
        type="button"
        onClick={onRun}
        disabled={busy || signedIn === null}
        className="pill-btn btn-primary-dark mt-6 w-full px-7 py-4 text-[1rem] disabled:opacity-60"
      >
        {busy ? "Starting the scan" : "Run the scan"}
      </button>

      <p className="mt-3 text-center text-[14px] text-muted-paper">
        {signedIn === false
          ? "No account is needed to run this scan, and nothing is charged. You read the first two businesses in full, and the rest of the list opens once you sign in and buy the full scan."
          : "Payment is switched off during this pilot, so nothing is charged. The engine still keeps its work in memory rather than in durable storage, so treat a run as a test rather than a record you can rely on."}
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-cream p-4 text-[15px] text-ink">
          {error}
        </p>
      ) : null}

      {snapshot ? (
        <div className="mt-8 border-t border-border pt-8">
          <div aria-live="polite" aria-atomic="true">
            <p className="eyebrow self-start">
              {snapshot.status === "completed"
                ? "Scan complete"
                : snapshot.status === "failed"
                  ? "Scan stopped"
                  : "Scan running"}
            </p>
            <p className="mt-3 text-[15px] text-muted-paper">
              {snapshot.locality}, {snapshot.category}.{" "}
              {snapshot.message ||
                (snapshot.status === "completed"
                  ? "Every check that could run has come back."
                  : "Results appear here as they arrive.")}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[14px] bg-violet-tint px-4 py-3">
                <p className="text-[13px] text-muted-paper">Checks completed</p>
                <p className="text-[20px] font-extrabold text-ink">
                  {snapshot.counts.completed} of {snapshot.counts.total}
                </p>
              </div>
              <div className="rounded-[14px] bg-violet-tint px-4 py-3">
                <p className="text-[13px] text-muted-paper">Still running</p>
                <p className="text-[20px] font-extrabold text-ink">
                  {Math.max(
                    snapshot.counts.total - snapshot.counts.completed - snapshot.counts.unavailable,
                    0,
                  )}
                </p>
              </div>
              <div className="rounded-[14px] bg-violet-tint px-4 py-3">
                <p className="text-[13px] text-muted-paper">Unavailable</p>
                <p className="text-[20px] font-extrabold text-ink">{snapshot.counts.unavailable}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[14px] text-muted-paper">
            A provider check that fails is recorded as unavailable rather than as no mentions,
            because a failed check tells you nothing about the business. The OpenAI and Claude
            checks do not use web search at present, so read them as what the models say from
            training rather than from a live search of the web.
          </p>

          {snapshot.businesses.length === 0 ? (
            <p className="mt-6 rounded-[16px] bg-cream p-4 text-[15px] text-muted-paper">
              No businesses came back for this run. Nothing was found rather than hidden, and the
              message above says what the engine reported.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <ul className="space-y-4">
                {snapshot.businesses.map((b, index) => {
                  const locked = !unlocked && index >= FREE_PREVIEW_COUNT;
                  const pending = PROVIDERS.filter((p) => b.providers[p].status === "pending").length;
                  const isOpen = openId === b.id;

                  if (locked) {
                    return (
                      <li key={b.id} className="rounded-[20px] bg-white p-5 soft-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div aria-hidden="true" className="select-none blur-[6px]">
                            <h3 className="text-[1.1rem]">{b.name}</h3>
                            <p className="mt-1 text-[14px] text-muted-paper">{b.area}</p>
                          </div>
                          <span className="rounded-full bg-violet-tint px-3 py-1 text-[12px] font-semibold text-violet">
                            Locked
                          </span>
                        </div>
                        <p className="mt-3 text-[14px] text-muted-paper">
                          This business, its reputation figures, its assistant checks and its outreach
                          draft are part of the full scan.
                        </p>
                      </li>
                    );
                  }

                  return (
                    <li key={b.id} className="rounded-[20px] bg-white p-5 soft-shadow">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[1.1rem]">{b.name}</h3>
                          <p className="mt-1 text-[14px] text-muted-paper">{b.area}</p>
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
                          <ProviderRow key={p} provider={p} check={b.providers[p]} />
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onOpen(b.id)}
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

                {lockedCount > 0 ? (
                  <li className="rounded-[20px] bg-violet-deep p-6 text-white soft-shadow-lg">
                    <p className="eyebrow-on-violet self-start text-[12px] font-semibold uppercase tracking-[0.12em] text-peach">
                      Full scan
                    </p>
                    <h3 className="mt-3 text-[1.35rem] text-white">
                      {lockedCount === 1
                        ? "One more business in this area"
                        : `${lockedCount} more businesses in this area`}
                    </h3>
                    <p className="mt-3 text-[15px] text-muted-on-violet">
                      The first two results are open so you can judge the quality. The rest of the
                      list, with every reputation figure, each assistant check and the outreach draft
                      for each business, comes with the full scan at £19.
                    </p>
                    {signedIn === false ? (
                      <>
                        <a
                          href="/login?next=/goldmine"
                          className="pill-btn mt-5 inline-flex bg-white px-6 py-3 text-[15px] font-semibold text-ink"
                        >
                          Sign in to unlock the full scan, £19
                        </a>
                        <p className="mt-3 text-[14px] text-muted-on-violet">
                          An account is needed for the full scan, so the purchase is recorded and
                          billed to you and the results stay yours. Payment opens in the next few
                          days, and nothing is charged today.
                        </p>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          className="pill-btn mt-5 bg-white px-6 py-3 text-[15px] font-semibold text-ink disabled:opacity-70"
                        >
                          Unlock the full scan, £19
                        </button>
                        <p className="mt-3 text-[14px] text-muted-on-violet">
                          Payment opens in the next few days, once the business account is live.
                          Nothing is charged today.
                        </p>
                      </>
                    )}
                  </li>
                ) : null}
              </ul>


              <div className="lg:sticky lg:top-24 lg:self-start">
                {open ? (
                  <div className="rounded-[20px] bg-white p-6 soft-shadow">
                    <p className="eyebrow self-start">Business detail</p>
                    <h3 className="mt-4 text-[1.35rem]">{open.name}</h3>
                    <p className="mt-2 text-[14px] text-muted-paper">{open.area}</p>

                    <div className="mt-5 space-y-3">
                      {PROVIDERS.map((p) => {
                        const s = open.providers[p];
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
                                  {s.mentions === 0
                                    ? "No mentions found"
                                    : s.mentions === 1
                                      ? "1 mention"
                                      : `${s.mentions} mentions`}
                                </span>
                              )}


                            </div>
                            <p className="mt-2 text-[13px] text-muted-paper">
                              {s.status === "pending"
                                ? "The result will appear here when it arrives."
                                : s.status === "unavailable"
                                  ? s.note
                                  : s.note}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {open.why ? (
                      <div className="mt-5 rounded-[14px] bg-cream p-4">
                        <p className="text-[13px] font-semibold text-ink">Why the score reads this way</p>
                        <p className="mt-2 text-[14px] text-muted-paper">{open.why}</p>
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <p className="text-[15px] font-semibold text-ink">Outreach drafts</p>
                      {openDrafts?.loading ? (
                        <p className="mt-2 flex items-center gap-2 text-[14px] text-muted-paper">
                          <Spinner />
                          Preparing the draft
                        </p>
                      ) : null}
                      {openDrafts?.message ? (
                        <p className="mt-2 text-[14px] text-muted-paper">{openDrafts.message}</p>
                      ) : null}
                      <div className="mt-4 space-y-4">
                        {(openDrafts?.drafts ?? []).map((d) => {
                          const key = `${open.id}:${d.id}`;
                          return (
                            <div key={d.id}>
                              <label htmlFor={`draft-${key}`} className="mono-label text-muted-paper">
                                {d.angle}
                              </label>
                              <textarea
                                id={`draft-${key}`}
                                rows={6}
                                value={edits[key] ?? d.body}
                                onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
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
                    Open any business to read what each assistant said and to see the outreach
                    draft. The detail updates as further checks land, without disturbing a draft you
                    are editing.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

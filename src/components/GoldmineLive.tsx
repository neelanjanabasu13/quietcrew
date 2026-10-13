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
  claimGuestGoldmineOrder,
  createGoldmineCheckout,
} from "@/lib/goldmine.functions";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { CopyDraftButton } from "@/components/CopyDraftButton";
import { GoldmineLockedCard } from "@/components/GoldmineLockedCard";
import { GoldmineContrast } from "@/components/GoldmineContrast";

const LAST_ORDER_KEY = "goldmine.lastOrder";
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

// Held-back businesses are drawn as numbered rows, so the size of the paid scan
// is visible before anyone pays. A handful of them is enough to show that.
const LOCKED_PLACEHOLDER_ROWS = 5;

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
  const claimOrder = useServerFn(claimGuestGoldmineOrder);
  const createCheckout = useServerFn(createGoldmineCheckout);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const unlocked = Boolean(snapshot?.paid);
  const restored = useRef(false);


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

  // Bring back the last scan after signing in or returning from checkout, so
  // the agency lands on the same results it was looking at.
  useEffect(() => {
    if (signedIn === null || restored.current) return;
    restored.current = true;
    const id = window.localStorage.getItem(LAST_ORDER_KEY);
    if (!id) return;
    const returning = new URLSearchParams(window.location.search).has("session_id");
    (async () => {
      try {
        if (signedIn) {
          const token = window.localStorage.getItem(GUEST_TOKEN_KEY);
          if (token) await claimOrder({ data: { orderId: id, guestToken: token } });
        }
        const read = () =>
          (signedIn
            ? readScan({ data: { orderId: id } })
            : readGuestScan({ data: { orderId: id, guestToken: guestToken() } })) as Promise<ScanSnapshot>;
        let snap = await read();
        // The payment confirmation can land a few seconds after the return.
        for (let i = 0; returning && !snap.paid && i < 10; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          snap = await read();
        }
        setOrderId(id);
        setSnapshot(snap);
        if (snap.status === "pending" || snap.status === "partial") beginPolling(id);
      } catch {
        window.localStorage.removeItem(LAST_ORDER_KEY);
      }
    })();
  }, [signedIn, claimOrder, readScan, readGuestScan, beginPolling]);

  const fetchClientSecret = useCallback(async () => {
    if (!orderId) throw new Error("No scan to unlock");
    const result = await createCheckout({
      data: {
        orderId,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/goldmine?session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if ("error" in result) {
      setCheckoutError(result.error);
      throw new Error(result.error);
    }
    return result.clientSecret;
  }, [createCheckout, orderId]);

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
      window.localStorage.setItem(LAST_ORDER_KEY, order.id);
      const first = (token
        ? await startGuestScan({ data: { orderId: order.id, guestToken: token } })
        : await startScan({ data: { orderId: order.id } })) as ScanSnapshot;
      setSnapshot(first);
      if (first.status === "pending" || first.status === "partial") beginPolling(order.id);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      setError(
        detail && detail.length < 200 && !/fetch|network|json/i.test(detail)
          ? `${detail} Nothing has been charged, and you can try again.`
          : "The scan could not be started. Nothing has been charged, and you can try again.",
      );
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
    if (typeof window !== "undefined") {
      setTimeout(() => document.getElementById("goldmine-live-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
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
  // Rows already drawn from businesses the browser holds, and how many
  // placeholder rows the rest needs, so the paid scan reads at full size.
  const lockedRows = (snapshot?.businesses.length ?? 0) - visibleBusinesses.length;
  const placeholderCount = Math.max(
    0,
    Math.min(lockedCount - lockedRows, LOCKED_PLACEHOLDER_ROWS),
  );
  const scanTotal = visibleBusinesses.length + lockedCount;
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

      <div className="mt-6 grid gap-3 rounded-[20px] bg-violet-tint p-4 sm:grid-cols-2">
        <div className="rounded-[16px] bg-white p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-violet">Free preview</p>
          <p className="mt-1 text-[1.4rem] font-extrabold text-ink">£0</p>
          <p className="mt-1 text-[14px] text-muted-paper">
            The top two prospects in full, with no account and no card needed.
          </p>
        </div>
        <div className="rounded-[16px] bg-white p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-violet">Full scan</p>
          <p className="mt-1 text-[1.4rem] font-extrabold text-ink">£49, one payment</p>
          <p className="mt-1 text-[14px] text-muted-paper">
            Every qualified business found, each assistant check and an outreach draft for each one.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRun}
        disabled={busy || signedIn === null}
        className="pill-btn btn-primary-dark mt-6 w-full px-7 py-4 text-[1rem] disabled:opacity-60"
      >
        {busy ? "Starting the scan" : "Run the free preview"}
      </button>

      <p className="mt-3 text-center text-[14px] text-muted-paper">
        Nothing is charged to run the preview. You only pay £49 if you decide to open the rest of
        the list, and you will need a free account at that point so the purchase is yours.
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
            <div className="mt-6">
              <ul className={open ? "hidden" : "grid gap-4 md:grid-cols-2"}>
                {snapshot.businesses.map((b, index) => {
                  const locked = !unlocked && index >= FREE_PREVIEW_COUNT;
                  const pending = PROVIDERS.filter((p) => b.providers[p].status === "pending").length;
                  const isOpen = openId === b.id;

                  if (locked) {
                    return (
                      <GoldmineLockedCard
                        key={b.id}
                        rank={index + 1}
                        total={scanTotal}
                        blur={{ name: b.name, meta: b.area }}
                      />
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

                      <div className="mt-4">
                        <GoldmineContrast business={b} />
                      </div>

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

                {!unlocked
                  ? Array.from({ length: placeholderCount }, (_, i) => (
                      <GoldmineLockedCard
                        key={`held-back-${i}`}
                        rank={FREE_PREVIEW_COUNT + i + 1}
                        total={scanTotal}
                      />
                    ))
                  : null}

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
                      for each business, comes with the full scan at £49.
                    </p>
                    {signedIn === false ? (
                      <>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href="/login?next=/goldmine&mode=signup"
                            className="pill-btn inline-flex bg-white px-6 py-3 text-[15px] font-semibold text-ink"
                          >
                            Create a free account to buy, £49
                          </a>
                          <a
                            href="/login?next=/goldmine&mode=signin"
                            className="pill-btn inline-flex px-6 py-3 text-[15px] font-semibold text-white ring-1 ring-white/40"
                          >
                            I already have an account
                          </a>
                        </div>
                        <p className="mt-3 text-[14px] text-muted-on-violet">
                          An account is needed for the full scan, so the purchase is recorded and
                          billed to you and the results stay yours. Your preview comes with you
                          when you sign in.
                        </p>
                      </>
                    ) : (
                      <>
                        {checkoutOpen ? (
                          <div className="mt-5 overflow-hidden rounded-[20px] bg-white">
                            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
                              <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutError(null);
                              setCheckoutOpen(true);
                            }}
                            className="pill-btn mt-5 bg-white px-6 py-3 text-[15px] font-semibold text-ink"
                          >
                            Unlock the full scan, £49
                          </button>
                        )}
                        {checkoutError ? (
                          <p role="alert" className="mt-3 text-[14px] text-peach">{checkoutError}</p>
                        ) : null}
                        <p className="mt-3 text-[14px] text-muted-on-violet">
                          One payment of £49 unlocks every business in this scan, and the results
                          stay in your account.
                        </p>
                      </>
                    )}
                  </li>
                ) : null}
              </ul>


              <div id="goldmine-live-detail" className={open ? "scroll-mt-24" : "hidden"}>
                {open ? (
                  <div className="rounded-[20px] bg-white p-6 soft-shadow md:p-8">
                    <button
                      type="button"
                      onClick={() => setOpenId(null)}
                      className="pill-btn btn-primary-dark px-5 py-3 text-[14px]"
                    >
                      <span aria-hidden="true">←</span> Back to the scan results
                    </button>
                    <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow self-start">Prospect audit</p>
                        <h3 className="mt-4 text-[1.6rem] md:text-[2rem]">{open.name}</h3>
                        <p className="mt-2 text-[14px] text-muted-paper">
                          {open.category} · {open.area}
                        </p>
                      </div>
                      <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-violet-tint text-center">
                        <div>
                          <p className="text-[2rem] font-extrabold leading-none text-violet">{open.gold}</p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-paper">
                            Gold
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <GoldmineContrast business={open} size="lg" />
                    </div>
                    <p className="mt-3 text-[13px] text-muted-paper">
                      Gold is an opportunity score: high when customers rate a business well and the
                      assistants rarely name it. It is not a rating of how good the business is.
                    </p>
                    <p className="mt-8 text-[15px] font-semibold text-ink">What each assistant said</p>

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
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <label
                                  htmlFor={`draft-${key}`}
                                  className="mono-label text-muted-paper"
                                >
                                  {d.angle}
                                </label>
                                <CopyDraftButton
                                  text={edits[key] ?? d.body}
                                  describes={d.angle}
                                  targetId={`draft-${key}`}
                                />
                              </div>
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

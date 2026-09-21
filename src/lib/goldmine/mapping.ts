/**
 * Maps an engine run payload onto the shape the Goldmine interface reads.
 *
 * Written from the supplied contract and never exercised against a deployed
 * engine, so it must be re-checked during integration.
 *
 * Two rules matter more than anything else here:
 *  - A failed or still pending provider check is unknown. It is never turned
 *    into zero mentions, and a missing total is never turned into nought per
 *    cent.
 *  - Results that have already arrived are kept, even when the run as a whole
 *    reports an error.
 */

import { countChecks, PROVIDERS, type ProviderCheck, type ProviderName, type ScanBusiness, type ScanSnapshot, type ScanStatus } from "./types";

/** The engine names Claude's provider key "anthropic". */
const PROVIDER_KEYS: Record<ProviderName, string> = {
  Gemini: "gemini",
  OpenAI: "openai",
  Claude: "anthropic",
};

type Dict = Record<string, unknown>;

const asDict = (value: unknown): Dict => (value && typeof value === "object" ? (value as Dict) : {});
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const asNumber = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);

const UNAVAILABLE_NOTE = "The check did not complete, so there is no result for this provider.";

/**
 * Turn one provider summary into a check. Only tested answers count towards the
 * denominator, so a summary without a usable total stays unknown.
 */
function checkFromSummary(summary: Dict): ProviderCheck | null {
  const status = String(summary["status"] ?? "").toLowerCase();
  if (status === "failed" || status === "error" || status === "unavailable") {
    return { status: "unavailable", note: UNAVAILABLE_NOTE };
  }
  if (status === "pending" || status === "running") return { status: "pending" };

  const total = asNumber(summary["total"]);
  const mentions = asNumber(summary["mentions"]);
  if (total === null || total === 0 || mentions === null) return null;

  const visibility = asNumber(summary["visibility"]);
  return {
    status: "complete",
    mentions,
    note:
      visibility === null
        ? `Named in ${mentions} of ${total} questions that completed.`
        : `Named in ${mentions} of ${total} questions that completed, ${Math.round(visibility)} per cent visibility.`,
  };
}

/**
 * Fall back to the per query evidence. Gemini is recorded at query level and
 * the other two sit under each query's providers block.
 */
function checkFromQueries(queries: unknown[], provider: ProviderName): ProviderCheck {
  let tested = 0;
  let mentions = 0;
  let failed = 0;
  let pending = 0;

  for (const raw of queries) {
    const query = asDict(raw);
    const entry =
      provider === "Gemini" ? query : asDict(asDict(query["providers"])[PROVIDER_KEYS[provider]]);
    if (Object.keys(entry).length === 0) {
      pending += 1;
      continue;
    }
    const state = String(entry["status"] ?? "pending").toLowerCase();
    if (state === "failed" || state === "error") {
      failed += 1;
    } else if (state === "tested" || state === "complete" || state === "completed") {
      tested += 1;
      if (entry["mentioned"] === true) mentions += 1;
    } else {
      pending += 1;
    }
  }

  if (tested > 0) {
    return {
      status: "complete",
      mentions,
      note: `Named in ${mentions} of ${tested} questions that completed.`,
    };
  }
  if (pending > 0) return { status: "pending" };
  if (failed > 0) return { status: "unavailable", note: UNAVAILABLE_NOTE };
  return { status: "pending" };
}

function businessFromResult(raw: unknown, index: number, locality: string, category: string): ScanBusiness {
  const result = asDict(raw);
  const ai = asDict(result["ai"]);
  const summaries = asDict(ai["providers"]);
  const queries = asArray(ai["queries"]);

  const providers = {} as Record<ProviderName, ProviderCheck>;
  for (const provider of PROVIDERS) {
    const summary = asDict(summaries[PROVIDER_KEYS[provider]]);
    providers[provider] = checkFromSummary(summary) ?? checkFromQueries(queries, provider);
  }

  const scoreStatus = String(result["score_status"] ?? "").toLowerCase();
  const gold = asNumber(result["gold_score"]);

  return {
    id: String(result["place_id"] ?? `business-${index}`),
    name: String(result["name"] ?? "Unnamed business"),
    area: String(result["address"] ?? locality),
    category,
    reputation: {
      rating: asNumber(result["rating"]) ?? 0,
      reviews: asNumber(result["review_count"]) ?? 0,
    },
    gold: gold ?? 0,
    why:
      gold === null || scoreStatus === "pending" || scoreStatus === "failed"
        ? "The opportunity score is not available for this business yet."
        : String(result["quality"] ?? ""),
    providers,
    drafts: [],
  };
}

/**
 * Map the engine's own statuses onto the four the interface handles.
 * running with nothing back is pending, running or market_ready with results is
 * partial, error is failed while results already gathered are kept, and
 * complete is completed even when individual checks inside it failed.
 */
export function mapRunStatus(engineStatus: string, hasResults: boolean): ScanStatus {
  switch (engineStatus) {
    case "complete":
      return "completed";
    case "error":
      return "failed";
    case "market_ready":
      return hasResults ? "partial" : "pending";
    case "running":
    default:
      return hasResults ? "partial" : "pending";
  }
}

export function normaliseEngineRun(payload: unknown, locality: string, category: string): ScanSnapshot {
  const run = asDict(payload);
  const results = asArray(run["results"]);
  const businesses = results.map((item, index) => businessFromResult(item, index, locality, category));
  const engineStatus = String(run["status"] ?? "running").toLowerCase();
  const status = mapRunStatus(engineStatus, businesses.length > 0);
  const engineError = String(run["error"] ?? "").trim().slice(0, 300);
  const stage = String(run["stage"] ?? "").trim();

  const failedMessage = engineError
    ? `The run stopped early. The research engine reported: ${engineError}`
    : "The run stopped early. Anything that had already arrived is kept below.";

  const pendingMessage = stage
    ? `The run is under way, currently at the ${stage} stage. Results appear here as they arrive.`
    : "The run is under way. Results appear here as they arrive.";

  return {
    status,
    isFixture: false,
    locality: String(run["location"] ?? locality),
    category: String(run["category"] ?? category),
    businesses,
    counts: countChecks(businesses),
    message:
      status === "failed"
        ? failedMessage
        : status === "partial"
          ? "Some checks are still running. What has arrived so far is shown below."
          : status === "pending"
            ? pendingMessage
            : "",
  };
}

/** Map one outreach response onto the draft shape the interface reads. */
export function normaliseOutreach(payload: unknown): { id: string; angle: string; body: string }[] {
  const draft = asDict(payload);
  const body = String(draft["body"] ?? draft["outreach"] ?? "").trim();
  if (!body) return [];
  const note = String(draft["evidence_note"] ?? "").trim();
  const subject = String(draft["subject"] ?? "Outreach draft").trim();
  const drafts = [{ id: "engine-draft", angle: subject, body }];
  if (note) {
    drafts.push({ id: "engine-draft-note", angle: "Evidence note", body: note });
  }
  return drafts;
}

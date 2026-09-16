/**
 * Goldmine research engine client.
 *
 * The engine is a separate service and it is not deployed yet, so both values
 * below are expected to be absent for now. Nothing in this file has been
 * exercised against a live engine, and every call path returns clearly marked
 * example data until GOLDMINE_ENGINE_URL and GOLDMINE_ENGINE_TOKEN are saved as
 * server secrets. The engine's own documentation also notes that the token is
 * not yet enforced at its end, so this project treats a configured engine as
 * unproven rather than trusted.
 *
 * Endpoint shapes follow the supplied contract:
 *   POST /api/run                 { location, category, services } -> { run_id }
 *   GET  /api/run/:runId          -> { status, stage, results, ... }
 *   POST /api/outreach/:placeId   { run_id, services } -> draft fields
 *
 * Secrets are read inside functions, never at module scope, and this module is
 * server only: the token must never reach the browser.
 */

import type { ScanSnapshot } from "./types";
import { fixtureSnapshot } from "./fixtures";

export type EngineConfig = { url: string; token: string };

/** The services line the engine asks for alongside a run. */
export const ENGINE_SERVICES = "SEO and AI visibility";

export function readEngineConfig(): EngineConfig | null {
  const url = process.env["GOLDMINE_ENGINE_URL"];
  const token = process.env["GOLDMINE_ENGINE_TOKEN"];
  if (!url || !token) return null;
  if (!/^https:\/\//i.test(url)) {
    console.error("[goldmine] GOLDMINE_ENGINE_URL must be an https address, ignoring it");
    return null;
  }
  return { url: url.replace(/\/+$/, ""), token };
}

export function isEngineConfigured(): boolean {
  return readEngineConfig() !== null;
}

async function engineFetch(
  config: EngineConfig,
  path: string,
  init: { method: "GET" | "POST"; body?: unknown; idempotencyKey?: string },
): Promise<unknown> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/json",
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  // The engine has no idempotency of its own yet, so this header is a request
  // rather than a guarantee. Duplicate protection lives in this project.
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;

  const response = await fetch(`${config.url}${path}`, {
    method: init.method,
    headers,
    ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });

  const text = await response.text();
  if (!response.ok) {
    // The engine's own message is logged server side and never returned to the page.
    console.error(`[goldmine] engine ${init.method} ${path} failed`, response.status, text.slice(0, 500));
    const error = new Error(`Engine request failed with status ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Engine returned a response that was not valid JSON");
  }
}

/**
 * Start a run. The order id is sent as an idempotency key, though the engine
 * does not honour it yet, so this project also claims the order exactly once
 * before calling.
 */
export async function engineStartScan(input: {
  orderId: string;
  locality: string;
  category: string;
}): Promise<{ engineScanId: string }> {
  const config = readEngineConfig();
  if (!config) throw new Error("Goldmine engine is not configured");

  const payload = (await engineFetch(config, "/api/run", {
    method: "POST",
    idempotencyKey: input.orderId,
    body: { location: input.locality, category: input.category, services: ENGINE_SERVICES },
  })) as { run_id?: string };

  const engineScanId = payload.run_id;
  if (!engineScanId) throw new Error("Engine did not return a run reference");
  return { engineScanId };
}

export async function engineReadScan(engineScanId: string): Promise<unknown> {
  const config = readEngineConfig();
  if (!config) throw new Error("Goldmine engine is not configured");
  return engineFetch(config, `/api/run/${encodeURIComponent(engineScanId)}`, { method: "GET" });
}

/**
 * Ask the engine for an outreach draft. The caller must already have confirmed
 * that the order belongs to the signed in agency and that the place belongs to
 * that run: the engine can fall back to a stored business otherwise.
 */
export async function engineReadOutreach(input: { engineScanId: string; placeId: string }): Promise<unknown> {
  const config = readEngineConfig();
  if (!config) throw new Error("Goldmine engine is not configured");
  return engineFetch(config, `/api/outreach/${encodeURIComponent(input.placeId)}`, {
    method: "POST",
    body: { run_id: input.engineScanId, services: ENGINE_SERVICES },
  });
}

/** Example data stand-in used everywhere while the engine is unavailable. */
export function previewSnapshot(locality: string, category: string): ScanSnapshot {
  return fixtureSnapshot(locality, category);
}

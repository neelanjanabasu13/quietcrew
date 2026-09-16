/**
 * Goldmine research engine client.
 *
 * The engine is a separate service. It is not deployed yet, so both of the
 * values below are expected to be absent for now. Nothing in this file has
 * ever been exercised against a live engine, and every call path returns a
 * clearly marked fixture until GOLDMINE_ENGINE_URL and GOLDMINE_ENGINE_TOKEN
 * are saved as server secrets.
 *
 * Secrets are read inside functions, never at module scope, and this module is
 * server only: the token must never reach the browser.
 */

import type { ScanSnapshot } from "./types";
import { fixtureSnapshot } from "./fixtures";

export type EngineConfig = { url: string; token: string };

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
    throw new Error(`Engine request failed with status ${response.status}`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Engine returned a response that was not valid JSON");
  }
}

/**
 * Start a scan. The idempotency key is the paid order id, so a repeated call
 * for the same order must not create a second run at the engine either.
 */
export async function engineStartScan(input: {
  orderId: string;
  locality: string;
  category: string;
}): Promise<{ engineScanId: string }> {
  const config = readEngineConfig();
  if (!config) throw new Error("Goldmine engine is not configured");

  const payload = (await engineFetch(config, "/scans", {
    method: "POST",
    idempotencyKey: input.orderId,
    body: { locality: input.locality, category: input.category, reference: input.orderId },
  })) as { id?: string; scan_id?: string };

  const engineScanId = payload.id ?? payload.scan_id;
  if (!engineScanId) throw new Error("Engine did not return a scan reference");
  return { engineScanId };
}

export async function engineReadScan(engineScanId: string): Promise<unknown> {
  const config = readEngineConfig();
  if (!config) throw new Error("Goldmine engine is not configured");
  return engineFetch(config, `/scans/${encodeURIComponent(engineScanId)}`, { method: "GET" });
}

/** Fixture stand-in used everywhere while the engine is unavailable. */
export function previewSnapshot(locality: string, category: string): ScanSnapshot {
  return fixtureSnapshot(locality, category);
}

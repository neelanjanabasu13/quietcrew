import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findBusiness } from "./sample";
import { getCuratedReference } from "./references";

// Live ids look like "live.plumbing.<googlePlaceId>".
export const liveId = (trade: string, placeId: string) => `live.${trade}.${placeId}`;

export const searchBusinesses = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ q: z.string().trim().min(2).max(120), max: z.number().int().min(1).max(20).optional() }).parse(d))
  .handler(async ({ data }) => {
    const { guardLookup } = await import("./scan-access.server");
    await guardLookup();
    // Sample listings never trigger a paid scan.
    const seed = /mops\s*stars?/i.test(data.q) ? [{ placeId: "seed:mops-stars-cleaning", name: "Mops Stars Cleaning", address: "88 Upper Street, London N1", rating: 3.9, reviewCount: 14, trade: "cleaning" as const, photo: null }] : [];
    const { searchPlaces } = await import("./places.server");
    try { return { results: [...seed, ...(await searchPlaces(data.q, data.max))], error: null }; }
    catch { return { results: seed, error: seed.length ? null : "Search is having a moment. Please try again." }; }
  });

export const getBusiness = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().min(1).max(400), environment: z.enum(["sandbox", "live"]).default("live") }).parse(d))
  .handler(async ({ data }) => {
    const sample = findBusiness(data.id);
    if (sample) return { ...sample, reference: getCuratedReference(sample.address, sample.trade, sample.location) };
    const { savedBusiness } = await import("./scan-access.server");
    const business = await savedBusiness(data.id, data.environment);
    return business ? { ...business, reference: getCuratedReference(business.address, business.trade, business.location) } : null;
  });

export const discoverBusinesses = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ trade: z.enum(["plumbing", "electrician", "cleaning", "landscaping", "salon"]), city: z.string().trim().min(2).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const { guardLookup } = await import("./scan-access.server");
    await guardLookup();
    const { discoverPlaces } = await import("./places.server");
    const { discoveryQueries, pickExamples, inExampleRange } = await import("./discovery");
    const { evaluate, cappedGrade } = await import("./audit");
    try {
      const found = await discoverPlaces(data.trade, discoveryQueries(data.trade, data.city), inExampleRange);
      const graded = found.map(({ signals, ...r }) => ({ ...r, grade: cappedGrade(evaluate(data.trade, signals, r.name, true)) }));
      return { results: pickExamples(graded).map(({ grade: _g, ...r }) => r), error: null };
    } catch { return { results: [], error: "Search is having a moment. Please try again." }; }
  });

import { createFileRoute } from "@tanstack/react-router";

// Each Google photo lookup is billed, so remember the resolved image address for a day.
const photoCache = new Map<string, { at: number; uri: string }>();
const DAY = 24 * 60 * 60 * 1000;

// Turns a Google Places photo reference into the real image without exposing the API key.
export const Route = createFileRoute("/api/public/outshine-photo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const name = params.get("name") ?? "";
        const { validPhotoRequest, guardGoogleCall } = await import("@/lib/outshine/scan-access.server");
        if (!validPhotoRequest(name, params.get("expires") ?? "", params.get("signature") ?? "")) return new Response("Photo link expired", { status: 403 });
        if (!/^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/.test(name)) return new Response("Bad photo", { status: 400 });
        const hit = photoCache.get(name);
        if (hit && Date.now() - hit.at < DAY) return new Response(null, { status: 302, headers: { Location: hit.uri, "Cache-Control": "public, max-age=86400" } });
        const key = process.env["GOOGLE_PLACES_API_KEY"];
        if (!key) return new Response("Not set up", { status: 503 });
        await guardGoogleCall();
        const res = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=600&skipHttpRedirect=true&key=${key}`);
        if (!res.ok) return new Response("Not found", { status: 404 });
        const { photoUri } = (await res.json()) as { photoUri?: string };
        if (!photoUri) return new Response("Not found", { status: 404 });
        if (photoCache.size > 5000) photoCache.clear();
        photoCache.set(name, { at: Date.now(), uri: photoUri });
        return new Response(null, { status: 302, headers: { Location: photoUri, "Cache-Control": "public, max-age=86400" } });
      },
    },
  },
});

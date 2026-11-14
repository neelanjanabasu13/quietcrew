<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- Goldmine filters and ranks completed opportunities through a shared browser-safe helper before preview slicing and checkout eligibility; unfinished scores are preserved. Why: provisional zeros must not disappear and zero-score rows must not inflate paid results.
- Outshine lives in-app under `src/routes/outshine.*`, `src/lib/outshine/`, `src/components/outshine/`; it calls Google Places directly from server functions (GOOGLE_PLACES_API_KEY) and scores locally. Why: it is fast enough to need no external engine, unlike Goldmine which uses the Railway engine.
- Outshine DIY purchases use authenticated embedded Stripe checkout and owner-scoped durable purchase snapshots; verify session status, amount, currency, report, environment and user server-side before delivering guides. Why: local storage or return URLs cannot authorise paid content, and snapshots preserve the purchased audit.
- Google Places calls must request only fields that are graded or shown, never Atmosphere fields (reviews, editorialSummary), and repeat lookups are cached in memory. Why: Google bills each call at its priciest field and an Atmosphere mask caused a £105 bill.
- Anywhere Google Places data renders (names, addresses, ratings, photos), include the `PoweredByGoogle` badge from `src/components/PoweredByGoogle.tsx`. Why: Google Maps Platform terms require visible attribution.

- Outshine scans are reserved atomically in the database before Places calls; guest cookies are opaque and server-issued, guest use transfers into account history, and all Google entrypoints share a durable daily request budget. Why: UI counters and process-local caches cannot prevent parallel requests or unexpected bills.
- Live report routes only read owner/session-scoped saved scans; fresh checks run through the explicit scan action, and photo URLs require expiring server signatures. Why: refreshing, guessing a report URL or modifying a photo name must not bypass billing safeguards.
- Scan payments and same-business DIY verification entitlements are separate, environment-scoped and consumed only on successful saved scans. Why: report purchases must not imply a bundle of reports or consume credits on failure.

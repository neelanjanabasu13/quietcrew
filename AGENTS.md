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
- Outshine lives in-app under `src/routes/outshine.*`, `src/lib/outshine/`, `src/components/outshine/`; it calls Google Places directly from server functions (GOOGLE_PLACES_API_KEY) and scores locally. Why: it is fast enough to need no external engine, unlike Goldmine which uses the Railway engine.
- Outshine DIY purchases use authenticated embedded Stripe checkout and owner-scoped durable purchase snapshots; verify session status, amount, currency, report, environment and user server-side before delivering guides. Why: local storage or return URLs cannot authorise paid content, and snapshots preserve the purchased audit.

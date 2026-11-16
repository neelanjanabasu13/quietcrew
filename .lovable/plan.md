# Goldmine full report: every checked business, grouped by evidence

The engine fix (commit ba89449) is live on Railway, so the website needs no engine work. This plan covers only the website change you described. Price stays £49.

## What the buyer will see

**Before paying**
- A plain line beside the button with the exact count, for example: "2 in your free preview. Unlock the other 8 and the full CSV for £49."
- If a scan has two businesses or fewer, both show free and the unlock button is hidden.

**In the report (preview and paid)**
Every business the engine checked appears, including those scoring 0. They are grouped under three headings:
1. **Win more AI recommendations**: strong reviews, rarely named in the sampled assistant answers. Shows the questions where it was missed.
2. **Build on existing AI visibility**: already named by at least one assistant. Shows which assistants named it and where it was inconsistent.
3. **Checks incomplete**: one or more assistant checks did not finish. Only the finished checks are shown, with no sales claim drawn from the missing ones.

The group is decided by the actual evidence (how many assistants named the business and whether all checks finished), not by the Gold score alone. Within each group, results stay sorted by Gold score. The free preview still shows the top two overall.

The current "Visibility gap" and "Hold the ground" labels are replaced by the first two groups above. Nothing else on the page is removed.

## Technical details
- `src/lib/goldmine/opportunities.ts`: stop dropping businesses with gold 0 or missing; add `evidenceGroup(business)` using check statuses and mention counts (any incomplete → incomplete; any mentions > 0 → build; else → win). Keep `opportunityTier` export removed only after its callers move. `canUnlockOpportunities` uses the new count (more than 2).
- `src/components/GoldmineLive.tsx` (and `GoldmineResults.tsx` for the example preview): render grouped sections, exact unlock line, hide button when nothing is locked, update the empty-scan wording.
- CSV gains a "Group" column.
- Update the project rule in AGENTS.md about filtering zero scores, since this reverses it.
- Tests: zero-score business is kept; grouping for each of the three cases; unlock count and hidden button at two or fewer.
- Requires Publish afterwards.

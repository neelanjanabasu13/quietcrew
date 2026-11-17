# Goldmine QC fixes before tomorrow's emails

## What I found
- **Outreach drafts:** on screen, a draft is written when a buyer opens a business after paying ("Open detail and drafts"). The download never asks for them, so the "First outreach draft" column is always blank. "AI check area" and "Search coverage" are blank because the engine does not send that information.
- **Review wording:** the sentence always says "top X per cent", so the busiest business reads "top 0 per cent" and a quiet one reads "top 99 per cent".
- **Area and the gym:** the engine chooses which businesses come back, so stray postcodes and Nuffield Health need a check on this site.

## Changes
1. **Download drafts:** the "First outreach draft" column will say "Open this business in your report to write its draft" instead of being blank. Writing all 50 drafts at download time would use 50 AI calls per scan, so I will skip that unless you want it. I will remove the empty "AI check area" and "Search coverage" columns.
2. **Email line:** "a first outreach draft" stays true for the on-screen report. I will check one paid Paddington report in the browser to confirm a draft appears when a business is opened before saying so.
3. **Review wording:** "top 1 per cent" at minimum, and anything in the lower half reads "bottom X per cent" (Rose Beauty becomes "bottom 1 per cent" or similar). The same fix applies to the rating sentence.
4. **Area:** each London area gets a list of its postcode districts (Paddington: W2, plus agreed neighbours). Businesses inside rank first. Businesses outside it are labelled "Nearby" and listed after them, so Harley Street can never be number one for Paddington. If you would rather hide them completely, tell me.
5. **Gym:** businesses whose name or Google type marks them as a gym, fitness or health club are left out of Beauty and aesthetics.
6. Tests for the wording at the extremes, the area ordering and the gym exclusion.

## Technical notes
- `src/lib/goldmine/mapping.ts` handles the percentile wording, `csv.ts` the columns, and a new area postcode map sorts results in `opportunities.ts` before preview slicing, keeping the AGENTS rule.
- Saved scans re-rank when they are read, so existing paid reports pick up the fix.

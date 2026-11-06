# Make "Work with us" action-oriented

Goal: a small business owner should come away sure that the audit ends in a clear fix they can carry out themselves, or hand to us, so they are never left with a list of problems and nowhere to go.

## Section intro (top of "Work with us")
Headline stays "Need something the tools do not cover?". The line under it becomes:
"We find what is slowing you down, show you exactly how to fix it, and then you choose: do it yourself with our step-by-step plan, or have us do it for you."

## A simple three-step strip under the intro
A small row (matching the existing card style) that shows the path:
1. **We dig in.** We go deep into the part of the business that is costing you time.
2. **We map the fix.** What to change, how to do it and why, step by step.
3. **You choose.** Do it yourself with the plan, or have us build it on an outcome-based or fixed fee.

## The three cards, rewritten
- **Workflow Audit, £99**
  "Pick the job that eats your week, such as chasing quotes, updating spreadsheets or sending the same report. We go deep into how it works today, then hand you a step-by-step fix covering what to change, how to do it and why. You can stop there and do it yourself, or ask us to do it for you." Button: "Book an audit".
- **Consultation, £100 per hour** (light edit)
  "An hour with us on your software setup, the tools worth paying for and the ones you can cancel, or a small build you have in mind. You leave knowing exactly what to do next, and who can do it." Button unchanged.
- **We do it for you, outcome-based or fixed price** (replaces "Setup and small builds", price line "Outcome-based or fixed price")
  "Once the fix is clear, we can carry it out: connecting the tools you already use, setting up the automations, or building a clean one-page website. We agree the result you want and the price before we start, so you pay for the outcome rather than our hours." Button: "Ask us to do it".

## Matching copy elsewhere
- FAQ "What happens in a Workflow Audit?" updated to the same dig in, map the fix, you choose story.
- FAQ "How much does it cost?" says delivery work is priced on the outcome or as a fixed price agreed before we start.

All copy keeps the standing rules: company "we" voice, no contractions, no em-dashes, flowing sentences, no client claims.

## Technical details
- Edits only in `src/routes/index.tsx`: `tiers` array, intro paragraph, a new inline steps strip inside the Work with us section, and two FAQ entries (the FAQPage structured data reads from the same array).
- No layout or colour changes beyond the new strip; check at 752px and 1280px.

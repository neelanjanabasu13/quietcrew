# Search launch checklist for quietcrew.ai

## Where things stand (checked on the live site today)

| Item | Status |
|---|---|
| Site published publicly | Done |
| quietcrew.ai connected and primary | Done |
| SEO review, no high-impact findings | Last review passed, but it predates recent changes. Needs a fresh run |
| Unique title and description per page | Done on all 6 pages |
| Social preview per page | Titles are per page, but Goldmine, Outshine, Company, Privacy and Terms share one generic preview image |
| Search Console connected, verified, sitemap sent | Not connected to this project |
| Homepage headline says what we do | Not yet. "Ready-made tools, and a builder you can talk to." does not say what the products do |
| Images have alt text | 9 images on Outshine have none |
| One search intent per page | Not researched yet |
| Key facts in page text | Done. Prices, FAQs and offers are written as text |
| Plan for first five backlinks | Not started |

## Steps, in order

1. **Fresh SEO review** and fix anything high-impact it finds.
2. **Homepage headline.** I propose three plain options for you to pick from (for example "Find local clients and fix your Google profile, without the manual work"). Nothing changes until you choose.
3. **Alt text on Outshine.** Add short descriptions to the 9 images, or mark them decorative where they carry no meaning.
4. **Per-page social images.** One preview image each for Goldmine and Outshine in the Quietcrew violet style. Legal pages keep the main Quietcrew image.
5. **Search Console.** You click Connect on the card I show, sign in with the Workspace account, then I add the verification tag, publish once, verify, and submit the sitemap.
6. **Keyword intent.** One search check per page (homepage, Goldmine, Outshine) to give each page a single main search phrase, then small wording tweaks to titles and headings.
7. **Five backlinks plan.** A short, saved list of real places to get listed (UK startup directories, product launch sites, agency and trade communities), each checked and dated, with a ready-to-send message.
8. **Publish once** at the end.

## Technical details
- Social images: new `og:image` and `twitter:image` per route `head()` using absolute URLs.
- Alt text: `src/components/outshine/*` image elements.
- Search Console: standard connector link, META tag in `__root` head, then verify, add site, submit `/sitemap.xml`.
- Keywords: Semrush keyword research (uk database). Backlinks: marketing research subagent, saved to Project Files.

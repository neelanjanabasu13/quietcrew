# Quiet Crew

# Quietcrew Lovable Build Brief (v2)

## What to build
A single-page marketing website for **Quietcrew**, a UK firm that removes manual work from small businesses using integration, automation and practical AI. One page, plus two small legal pages (Privacy, Terms) linked from the footer.

**Primary conversion goal:** book a free 30-minute Workflow Review.

**Brand philosophy (drives everything):** the solutions we build run quietly in the background. Nobody has to learn a new system. The work just stops landing on people's desks. Calm, competent, unshowy.

Name is always written **Quietcrew** (one word, capital Q only). Domain: quietcrew.co.uk.

## Positioning rules
- Lead with the workflow problem, never with AI. Quietcrew is not an AI consultancy.
- Never use the words: transformation, cutting-edge, revolutionise, seamless, empower, unlock, leverage, journey.
- Never use em-dashes anywhere in the copy. Use commas, colons, periods or parentheses.
- No robots, brains, circuit boards, glowing nodes, generic AI imagery, stock photos of people high-fiving.
- Tone: a capable British firm talking plainly to a business owner. British spelling throughout. Short sentences, concrete nouns.

## Design direction

**Feel:** quiet premium. Editorial rather than SaaS. Lots of whitespace, strong typographic hierarchy, thin 1px borders instead of heavy shadows, no gradients, no glassmorphism, no neon.

**Type:** Google Fonts. Headings `Inter Tight` (600/700, tight tracking). Body `Inter` (400/500, 17px base, line-height 1.65). No third font.

**Colour tokens (use exactly these, define as CSS variables):**
- `--ink: #12120F` (primary text)
- `--paper: #FBFAF7` (page background, warm off-white)
- `--surface: #FFFFFF` (cards)
- `--accent: #1F4D3D` (deep green: buttons, links, diagram highlights)
- `--accent-soft: #E8EFEA` (tints, section bands)
- `--muted: #6E6E66` (secondary text)
- `--line: #E4E1D9` (borders/dividers)

Deep green deliberately, to avoid the indigo/violet default that every AI site uses.

**Layout:** max content width 1080px, section padding 96px desktop / 56px mobile. Fully responsive, mobile-first. Buttons solid `--accent`, 6px radius, no gradient, subtle darken on hover.

**Motion:** fade-and-rise on scroll into view, 300ms, once only. One ambient touch: in the hero diagram, a small dot travels along the connector path on a slow loop, to visualise work moving in the background. Nothing else animates.

**Dark mode:** not required. Commit to the light palette and paint backgrounds explicitly.

## Page sections, in order

### 1. Nav (sticky, slim)
`Quietcrew` wordmark left. Right: Services, Who We Help, How It Works, FAQ, and a **Book a Workflow Review** button. Mobile: hamburger to a simple full-screen menu.

### 2. Hero
**H1:** You bought the software. Your team is still doing the work in between.

**Sub:** Quietcrew connects the tools you already use, automates the repetitive work around them, and adds AI only where it genuinely helps. It runs quietly in the background. Your team just stops doing the busywork.

**Primary CTA:** Book a free Workflow Review
**Secondary CTA (scrolls to Examples):** See what we automate

**Small muted line under the CTAs:** 30 minutes. No pitch. You leave with a map of one process and an honest answer on whether it's worth automating.

**Hero visual:** a horizontal flow diagram built as real inline SVG (not text with arrow characters), showing `Your systems` then `Quietcrew` then `Work happens on its own`, with the middle node labelled "connect, automate, practical AI". Thin lines, `--accent` accents, an animated dot travelling left to right on a slow loop. Stacks vertically on mobile.

### 3. The problem
**H2:** Your tools changed. The work didn't.

Two short paragraphs:
> Most growing businesses already own a CRM, an accounting system, an industry platform, a project tool and a dozen spreadsheets. Some have started using AI. None of that stopped people copying information between systems, chasing approvals, retyping documents, preparing the same report every week and remembering to follow up.

> That gap between the software and the work is where your team's time actually goes. It rarely shows up on any budget line, which is why it never gets fixed.

**Pull quote:** You don't need more technology. You need the manual work taken off people's desks.

### 4. Three services (three cards, equal weight)
Each card: title, one-line description, example bullets, footer line with price and timescale.

**Workflow & Systems Automation** (flagship: add a small "Most common starting point" tag)
Connect the software you already use and automate the repetitive steps between it.
Examples: client and staff onboarding, document processing, moving data between systems, approvals and sign-offs, scheduled reporting, follow-up chasing.
`From £2,000, 1 to 3 weeks`

**Sales Workflow Automation**
Take the admin out of selling so your people spend the time actually selling.
Examples: lead research and qualification, CRM enrichment and hygiene, account briefs before meetings, automated follow-up, pipeline reporting.
`From £2,500, 1 to 3 weeks`

**Internal AI Tools**
Focused tools that make your own information usable, not another chatbot.
Examples: company knowledge assistant, question-answering across your documents, contract and lease intelligence, proposal drafting from past work, policy and operations assistants.
`From £4,000, 2 to 4 weeks`

### 5. AI, only where it helps
**H2:** You don't need an AI strategy to work with us.

Three short columns:
- **Not using AI?** We'll tell you where it would save real time, and just as importantly where it wouldn't.
- **Experimenting with AI?** We'll connect it to actual workflows and the systems you already run.
- **Already using AI?** We'll close the manual gaps still sitting between your people, your software and your AI.

**Pull quote:** If existing software can solve it, we connect it. If automation can solve it, we automate it. If AI makes it better, we add AI. In that order.

### 6. Who we help
Qualifying line above the cards: Typically service businesses with 15 to 150 people, several systems, and no in-house engineering team.

Five compact cards:
- **Recruitment & Staffing**: Recruitment agencies, executive search, staffing firms. Candidate processing, ATS and CRM admin, research, client reporting, sales admin.
- **Professional Services**: Consultancies, advisory and specialist B2B firms. Document work, research, reporting, knowledge retrieval, client administration.
- **Marketing & Digital Agencies**: Marketing, digital, branding, web, design and PR. Client onboarding, project setup, reporting, CRM, sales admin.
- **Property**: Estate and letting agents, property managers, commercial property firms. Enquiry handling, leases and documents, approvals, system updates.
- **Accounting & Bookkeeping**: Practices, bookkeepers, outsourced finance and payroll. Document processing, onboarding, approvals, reporting, data entry.

### 7. Workflow examples
**H2:** What this looks like in practice
**Sub:** Four workflows, and the manual version they replace.

Four items, each a small horizontal step diagram in inline SVG (same style as the hero) with a muted "before" line underneath.

- **Recruitment**: CV arrives, details extracted, ATS updated, summary written, recruiter notified.
  *Before: someone opens the CV, retypes six fields into the ATS, writes a summary, and forwards it on. Ten minutes, forty times a week.*
- **Sales**: New lead, company researched, qualified, CRM enriched, account brief sent to the rep.
  *Before: the rep Googles the company the morning of the call, if there's time.*
- **Property**: Lease received, key terms extracted, system updated, made searchable, team notified.
  *Before: the lease sits in a folder and someone reads all forty pages when a question comes up.*
- **Agency**: New client won, project created, tasks generated, team assigned, onboarding starts.
  *Before: a half-remembered checklist, done slightly differently every time.*

Small note under the block: *Illustrative workflows. Real client examples and figures will be published as engagements complete.*

### 8. How it works (5 numbered steps, horizontal on desktop)
1. **Show us what's still manual.** One process. Tell us where the time goes.
2. **We map it.** People, systems, steps, handoffs, and what it costs you a year.
3. **We pick the simplest fix.** Existing software, an integration, automation, AI, or a combination. Sometimes the answer is that it isn't worth doing, and we'll say so.
4. **We build it.** Usually one to four weeks, in your systems, with your team involved.
5. **We measure it.** Time saved, then the next opportunity.

### 9. How we handle your data (trust block, do not omit)
**H2:** Your data stays yours
- **It stays in your systems.** We build inside your accounts and your storage wherever possible. We orchestrate the work, we don't hold your data.
- **Nothing is used to train AI models.** We use commercial API tiers with training switched off, and we name every provider involved in your build.
- **Written agreements before anything connects.** A data processing agreement and a scope of work signed up front, every time.
- **Registered and insured.** ICO registered and covered by professional indemnity insurance.

### 10. Why Quietcrew (four short blocks)
- **Business problem first.** We start with what's costing you time, not with what technology is fashionable.
- **We improve what you already have.** No rip and replace. Your team keeps the systems they know.
- **You own what we build.** It runs in your accounts. No lock-in.
- **Fast and small.** Most first projects land in one to four weeks for £2,000 to £10,000, so you find out if this works without a big bet.

### 11. FAQ (accordion, 6 items, use these answers verbatim, do not invent your own)
- **How much does this cost?** Most first projects are £2,000 to £10,000 depending on how many systems are involved. We give a fixed price after the Workflow Review, before any work starts.
- **How long does it take?** One to three weeks for most automation work, two to four for internal AI tools.
- **What if it breaks?** Things change: software updates, APIs move, processes evolve. Every build includes a settling-in period, and we offer an ongoing care plan if you'd rather we look after it permanently.
- **Do we own what you build?** Yes. It runs in your accounts, under your logins. If you stop working with us, everything keeps running.
- **How is this different from hiring a freelancer to set up Zapier?** A freelancer builds the workflow you describe. We work out whether it's the right workflow, what it's actually costing you, and what happens when it hits the exceptions. You're buying the diagnosis and the outcome, not a file.
- **What if you look at our process and it isn't worth automating?** Then we tell you, and you've lost half an hour. That happens, and we'd rather say it than sell you something you don't need.

### 12. Final CTA
**H2:** What's still manual in your business?
**Sub:** Show us one repetitive process. In 30 minutes we'll map it, tell you what could be automated, roughly what it would cost, and whether it's worth doing at all.

**Form fields:** Name, Company, Work email, Company size (dropdown: 1-9, 10-24, 25-49, 50-149, 150+), Which systems do you use? (short text), What does your team still do manually? (textarea).

**Submit behaviour, implement properly, do not leave a dead form:**
- On submit, persist the enquiry and show a clear success state reading: Thanks. We'll come back to you within one working day.
- Below the form, a secondary booking option labelled "Or pick a time now" with a clearly marked Cal.com embed placeholder the owner can point at their own link.

### 13. Footer
Quietcrew wordmark, strapline "The work gets done in the background.", email placeholder hello@quietcrew.co.uk, links to Privacy and Terms, a placeholder line for company registration number and registered address, copyright.

## Technical requirements
- Single page with smooth anchor scrolling, plus `/privacy` and `/terms` routes with sensible UK-appropriate starter content clearly marked as a draft for legal review.
- Semantic HTML, correct heading order, alt text on every graphic, keyboard-navigable accordion and menu, visible focus states, AA contrast throughout.
- Set page title, meta description, favicon and an Open Graph image.
- Form validation with inline errors, plus a honeypot field for spam.
- No analytics and no cookie banner at launch. Leave a clearly commented placeholder where an analytics snippet and consent banner would go.
- No heavy libraries. Inline SVG for all graphics.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://quietcrew.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6459a9a5-e354-4c9b-9a4d-75ab325da696).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { HeroFlow, StepFlow } from "@/components/FlowDiagram";
import { EnquiryForm } from "@/components/EnquiryForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "Quietcrew | Workflow automation and practical AI for UK businesses";
const DESCRIPTION =
  "Quietcrew connects the tools you already use and automates the repetitive work around them, so your team stops doing the busywork. Book a free 30 minute Workflow Review.";
const OG_IMAGE = "https://quietcrew.co.uk/og-quietcrew.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: Index,
});

const services = [
  {
    tag: "Most common starting point",
    title: "Workflow & Systems Automation",
    line: "Connect the software you already use and automate the repetitive steps between it.",
    examples:
      "Client and staff onboarding, document processing, moving data between systems, approvals and sign-offs, scheduled reporting, follow-up chasing.",
    price: "From £2,000, 1 to 3 weeks",
  },
  {
    tag: null,
    title: "Sales Workflow Automation",
    line: "Take the admin out of selling so your people spend the time actually selling.",
    examples:
      "Lead research and qualification, CRM enrichment and hygiene, account briefs before meetings, automated follow-up, pipeline reporting.",
    price: "From £2,500, 1 to 3 weeks",
  },
  {
    tag: null,
    title: "Internal AI Tools",
    line: "Focused tools that make your own information usable, not another chatbot.",
    examples:
      "Company knowledge assistant, question-answering across your documents, contract and lease intelligence, proposal drafting from past work, policy and operations assistants.",
    price: "From £4,000, 2 to 4 weeks",
  },
];

const sectors = [
  {
    title: "Recruitment & Staffing",
    who: "Recruitment agencies, executive search, staffing firms.",
    work: "Candidate processing, ATS and CRM admin, research, client reporting, sales admin.",
  },
  {
    title: "Professional Services",
    who: "Consultancies, advisory and specialist B2B firms.",
    work: "Document work, research, reporting, knowledge retrieval, client administration.",
  },
  {
    title: "Marketing & Digital Agencies",
    who: "Marketing, digital, branding, web, design and PR.",
    work: "Client onboarding, project setup, reporting, CRM, sales admin.",
  },
  {
    title: "Property",
    who: "Estate and letting agents, property managers, commercial property firms.",
    work: "Enquiry handling, leases and documents, approvals, system updates.",
  },
  {
    title: "Accounting & Bookkeeping",
    who: "Practices, bookkeepers, outsourced finance and payroll.",
    work: "Document processing, onboarding, approvals, reporting, data entry.",
  },
];

const examples = [
  {
    title: "Recruitment",
    steps: ["CV arrives", "Details extracted", "ATS updated", "Summary written", "Recruiter notified"],
    before:
      "Before: someone opens the CV, retypes six fields into the ATS, writes a summary, and forwards it on. Ten minutes, forty times a week.",
  },
  {
    title: "Sales",
    steps: ["New lead", "Company researched", "Qualified", "CRM enriched", "Brief sent to rep"],
    before: "Before: the rep Googles the company the morning of the call, if there's time.",
  },
  {
    title: "Property",
    steps: ["Lease received", "Key terms extracted", "System updated", "Made searchable", "Team notified"],
    before:
      "Before: the lease sits in a folder and someone reads all forty pages when a question comes up.",
  },
  {
    title: "Agency",
    steps: ["New client won", "Project created", "Tasks generated", "Team assigned", "Onboarding starts"],
    before: "Before: a half-remembered checklist, done slightly differently every time.",
  },
];

const steps = [
  {
    title: "Show us what's still manual.",
    body: "One process. Tell us where the time goes.",
  },
  {
    title: "We map it.",
    body: "People, systems, steps, handoffs, and what it costs you a year.",
  },
  {
    title: "We pick the simplest fix.",
    body: "Existing software, an integration, automation, AI, or a combination. Sometimes the answer is that it isn't worth doing, and we'll say so.",
  },
  {
    title: "We build it.",
    body: "Usually one to four weeks, in your systems, with your team involved.",
  },
  {
    title: "We measure it.",
    body: "Time saved, then the next opportunity.",
  },
];

const dataPoints = [
  {
    title: "It stays in your systems.",
    body: "We build inside your accounts and your storage wherever possible. We orchestrate the work, we don't hold your data.",
  },
  {
    title: "Nothing is used to train AI models.",
    body: "We use commercial API tiers with training switched off, and we name every provider involved in your build.",
  },
  {
    title: "Written agreements before anything connects.",
    body: "A data processing agreement and a scope of work signed up front, every time.",
  },
  {
    title: "Registered and insured.",
    body: "ICO registered and covered by professional indemnity insurance.",
  },
];

const whyUs = [
  {
    title: "Business problem first.",
    body: "We start with what's costing you time, not with what technology is fashionable.",
  },
  {
    title: "We improve what you already have.",
    body: "No rip and replace. Your team keeps the systems they know.",
  },
  {
    title: "You own what we build.",
    body: "It runs in your accounts. No lock-in.",
  },
  {
    title: "Fast and small.",
    body: "Most first projects land in one to four weeks for £2,000 to £10,000, so you find out if this works without a big bet.",
  },
];

const faqs = [
  {
    q: "How much does this cost?",
    a: "Most first projects are £2,000 to £10,000 depending on how many systems are involved. We give a fixed price after the Workflow Review, before any work starts.",
  },
  {
    q: "How long does it take?",
    a: "One to three weeks for most automation work, two to four for internal AI tools.",
  },
  {
    q: "What if it breaks?",
    a: "Things change: software updates, APIs move, processes evolve. Every build includes a settling-in period, and we offer an ongoing care plan if you'd rather we look after it permanently.",
  },
  {
    q: "Do we own what you build?",
    a: "Yes. It runs in your accounts, under your logins. If you stop working with us, everything keeps running.",
  },
  {
    q: "How is this different from hiring a freelancer to set up Zapier?",
    a: "A freelancer builds the workflow you describe. We work out whether it's the right workflow, what it's actually costing you, and what happens when it hits the exceptions. You're buying the diagnosis and the outcome, not a file.",
  },
  {
    q: "What if you look at our process and it isn't worth automating?",
    a: "Then we tell you, and you've lost half an hour. That happens, and we'd rather say it than sell you something you don't need.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="border-b border-line">
          <div className="container-page section-y">
            <Reveal className="max-w-[820px]">
              <h1 className="text-[2.15rem] leading-[1.1] md:text-[3.4rem]">
                You bought the software. Your team is still doing the work in between.
              </h1>
              <p className="mt-6 max-w-[660px] text-[1.05rem] text-muted md:text-[1.15rem]">
                Quietcrew connects the tools you already use, automates the repetitive work around them,
                and adds AI only where it genuinely helps. It runs quietly in the background. Your team
                just stops doing the busywork.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#book" className="btn-accent">
                  Book a free Workflow Review
                </a>
                <a href="#examples" className="btn-quiet">
                  See what we automate
                </a>
              </div>
              <p className="mt-5 max-w-[600px] text-[15px] text-muted">
                30 minutes. No pitch. You leave with a map of one process and an honest answer on whether
                it&rsquo;s worth automating.
              </p>
            </Reveal>

            <Reveal className="mt-14" delay={80}>
              <HeroFlow />
            </Reveal>
          </div>
        </section>

        {/* The problem */}
        <section className="border-b border-line">
          <div className="container-page section-y max-w-[820px]">
            <Reveal>
              <h2 className="text-3xl md:text-4xl">Your tools changed. The work didn&rsquo;t.</h2>
              <p className="mt-6 text-muted">
                Most growing businesses already own a CRM, an accounting system, an industry platform, a
                project tool and a dozen spreadsheets. Some have started using AI. None of that stopped
                people copying information between systems, chasing approvals, retyping documents,
                preparing the same report every week and remembering to follow up.
              </p>
              <p className="mt-4 text-muted">
                That gap between the software and the work is where your team&rsquo;s time actually goes.
                It rarely shows up on any budget line, which is why it never gets fixed.
              </p>
              <blockquote className="mt-10 border-l-2 border-accent pl-6 font-display text-xl leading-snug md:text-2xl">
                You don&rsquo;t need more technology. You need the manual work taken off people&rsquo;s
                desks.
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20 border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <p className="eyebrow">Services</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Three ways we take work off your desks</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.title} className="card-quiet flex flex-col p-6" delay={i * 60}>
                  {s.tag && (
                    <span className="mb-4 inline-flex w-fit rounded-sm bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent">
                      {s.tag}
                    </span>
                  )}
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted">{s.line}</p>
                  <p className="mt-4 text-[15px] text-ink">
                    <span className="font-medium">Examples: </span>
                    {s.examples}
                  </p>
                  <p className="mt-auto border-t border-line pt-4 text-[14px] font-medium text-accent">
                    {s.price}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI, only where it helps */}
        <section className="border-b border-line bg-accent-soft">
          <div className="container-page section-y">
            <Reveal className="max-w-[760px]">
              <h2 className="text-3xl md:text-4xl">You don&rsquo;t need an AI strategy to work with us.</h2>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  q: "Not using AI?",
                  a: "We'll tell you where it would save real time, and just as importantly where it wouldn't.",
                },
                {
                  q: "Experimenting with AI?",
                  a: "We'll connect it to actual workflows and the systems you already run.",
                },
                {
                  q: "Already using AI?",
                  a: "We'll close the manual gaps still sitting between your people, your software and your AI.",
                },
              ].map((c, i) => (
                <Reveal key={c.q} delay={i * 60}>
                  <h3 className="text-lg text-accent">{c.q}</h3>
                  <p className="mt-2 text-[15px] text-ink">{c.a}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12">
              <blockquote className="max-w-[760px] border-l-2 border-accent pl-6 font-display text-xl leading-snug md:text-2xl">
                If existing software can solve it, we connect it. If automation can solve it, we automate
                it. If AI makes it better, we add AI. In that order.
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* Who we help */}
        <section id="who-we-help" className="scroll-mt-20 border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <p className="eyebrow">Who we help</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Built for firms running on several systems</h2>
              <p className="mt-4 max-w-[680px] text-[15px] text-muted">
                Typically service businesses with 15 to 150 people, several systems, and no in-house
                engineering team.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((s, i) => (
                <Reveal key={s.title} className="card-quiet p-5" delay={i * 50}>
                  <h3 className="text-lg">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{s.who}</p>
                  <p className="mt-2 text-[15px] text-ink">{s.work}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow examples */}
        <section id="examples" className="scroll-mt-20 border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <h2 className="text-3xl md:text-4xl">What this looks like in practice</h2>
              <p className="mt-4 text-[15px] text-muted">
                Four workflows, and the manual version they replace.
              </p>
            </Reveal>
            <div className="mt-10 space-y-5">
              {examples.map((ex, i) => (
                <Reveal key={ex.title} className="card-quiet p-6" delay={i * 50}>
                  <h3 className="text-lg">{ex.title}</h3>
                  <div className="mt-4">
                    <StepFlow
                      steps={ex.steps}
                      label={`${ex.title} workflow: ${ex.steps.join(", then ")}.`}
                    />
                  </div>
                  <p className="mt-4 text-[15px] italic text-muted">{ex.before}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6">
              <p className="text-[14px] italic text-muted">
                Illustrative workflows. Real client examples and figures will be published as engagements
                complete.
              </p>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Five steps, start to finish</h2>
            </Reveal>
            <ol className="mt-10 grid gap-6 md:grid-cols-5">
              {steps.map((s, i) => (
                <Reveal key={s.title} as="li" className="border-t border-line pt-4" delay={i * 50}>
                  <span className="font-display text-sm font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[17px]">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{s.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Data */}
        <section className="border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <p className="eyebrow">How we handle your data</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Your data stays yours</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {dataPoints.map((d, i) => (
                <Reveal key={d.title} className="card-quiet p-6" delay={i * 50}>
                  <h3 className="text-[17px]">{d.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{d.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Quietcrew */}
        <section className="border-b border-line">
          <div className="container-page section-y">
            <Reveal>
              <h2 className="text-3xl md:text-4xl">Why Quietcrew</h2>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {whyUs.map((w, i) => (
                <Reveal key={w.title} delay={i * 50}>
                  <h3 className="text-[17px]">{w.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{w.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-line">
          <div className="container-page section-y max-w-[820px]">
            <Reveal>
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Questions we get asked</h2>
            </Reveal>
            <Reveal className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="border-line">
                    <AccordionTrigger className="text-left font-display text-[17px] hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] text-muted">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section id="book" className="scroll-mt-20 bg-accent-soft">
          <div className="container-page section-y">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <h2 className="text-3xl md:text-4xl">What&rsquo;s still manual in your business?</h2>
                <p className="mt-4 text-[16px] text-ink">
                  Show us one repetitive process. In 30 minutes we&rsquo;ll map it, tell you what could be
                  automated, roughly what it would cost, and whether it&rsquo;s worth doing at all.
                </p>
                <p className="mt-6 text-[15px] text-muted">
                  Prefer email? Write to{" "}
                  <a href="mailto:hello@quietcrew.co.uk" className="text-accent underline underline-offset-4">
                    hello@quietcrew.co.uk
                  </a>
                  .
                </p>
              </Reveal>

              <Reveal delay={60}>
                <EnquiryForm />

                <div className="mt-6 rounded-md border border-dashed border-accent bg-surface p-6">
                  <h3 className="text-[17px]">Or pick a time now</h3>
                  <p className="mt-2 text-[15px] text-muted">
                    Cal.com embed placeholder. Replace the block below with your own Cal.com embed or
                    booking link (for example cal.com/quietcrew/workflow-review).
                  </p>
                  {/* CAL.COM EMBED PLACEHOLDER
                      Paste the Cal.com inline embed script or iframe here, pointed at
                      your own booking link. Nothing else on the page needs to change. */}
                  <div className="mt-4 flex h-32 items-center justify-center rounded-md border border-line bg-paper text-[14px] text-muted">
                    Cal.com booking embed goes here
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

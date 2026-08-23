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
    annotate: { index: 3, text: "HUMAN APPROVAL" },
    reference: "QC-101 / RECRUITMENT INTAKE",
  },
  {
    title: "Sales",
    steps: ["New lead", "Company researched", "Qualified", "CRM enriched", "Brief sent to rep"],
    before: "Before: the rep Googles the company the morning of the call, if there's time.",
    annotate: { index: 2, text: "HUMAN APPROVAL" },
    reference: "QC-102 / LEAD QUALIFICATION",
  },
  {
    title: "Property",
    steps: ["Lease received", "Key terms extracted", "System updated", "Made searchable", "Team notified"],
    before:
      "Before: the lease sits in a folder and someone reads all forty pages when a question comes up.",
    annotate: { index: 1, text: "HUMAN APPROVAL" },
    reference: "QC-103 / LEASE ABSTRACTION",
  },
  {
    title: "Agency",
    steps: ["New client won", "Project created", "Tasks generated", "Team assigned", "Onboarding starts"],
    before: "Before: a half-remembered checklist, done slightly differently every time.",
    annotate: { index: 3, text: "HUMAN APPROVAL" },
    reference: "QC-104 / CLIENT ONBOARDING",
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
    title: "A person approves anything irreversible.",
    body: "Payments, deletions and messages to your customers always wait for a human to sign off. Automation does the work, it does not make the decisions.",
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

/** Large mono section marker with a hairline rule across the full content width. */
function SectionMark({ num, name, tone }: { num: string; name: string; tone: "ink" | "paper" | "hivis" }) {
  const text = tone === "ink" ? "text-muted-ink" : "text-muted-paper";
  const rule = tone === "ink" ? "border-rule-dark" : tone === "hivis" ? "border-ink" : "border-rule-light";
  const numColour = tone === "ink" ? "text-hivis" : "text-ink";
  return (
    <div className={`border-b ${rule} pb-4`}>
      <p className="mono-num">
        <span className={numColour}>{num}</span>
        <span className={`${text} ml-2`}>/ {name}</span>
      </p>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-hivis text-ink">
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <blockquote className="max-w-[1000px] font-display text-[1.9rem] font-bold leading-[1.05] tracking-[-0.02em] md:text-[3.2rem]">
            {children}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="on-ink bg-ink text-paper">
          <div className="container-page section-y">
            <Reveal className="max-w-[980px]">
              <p className="mono-num text-hivis">00 / QUIETCREW</p>
              <h1 className="mt-6 text-[2.4rem] leading-[1.0] md:text-[4.6rem]">
                You bought the software. Your team is still doing the work in between.
              </h1>
              <p className="mt-8 max-w-[720px] text-[1.05rem] text-muted-ink md:text-[1.15rem]">
                Quietcrew connects the tools you already use, automates the repetitive work around them,
                and adds AI only where it genuinely helps. It runs quietly in the background. Your team
                just stops doing the busywork.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="#book" className="btn-hivis">
                  Book a free Workflow Review
                </a>
                <a href="#examples" className="btn-outline-paper">
                  See what we automate
                </a>
              </div>
              <p className="mono-label mt-6 max-w-[620px] normal-case tracking-[0.04em] text-muted-ink">
                30 minutes. No pitch. You leave with a map of one process and an honest answer on whether
                it&rsquo;s worth automating.
              </p>
            </Reveal>

            <Reveal className="mt-16 border-t border-rule-dark pt-14" delay={80}>
              <HeroFlow />
            </Reveal>
          </div>
        </section>

        {/* 01 The problem */}
        <section className="bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="01" name="PROBLEM" tone="paper" />
            <Reveal className="mt-10 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <h2 className="text-[2rem] md:text-[3rem]">Your tools changed. The work didn&rsquo;t.</h2>
              <div>
                <p className="text-muted-paper">
                  Most growing businesses already own a CRM, an accounting system, an industry platform, a
                  project tool and a dozen spreadsheets. Some have started using AI. None of that stopped
                  people copying information between systems, chasing approvals, retyping documents,
                  preparing the same report every week and remembering to follow up.
                </p>
                <p className="mt-5 text-muted-paper">
                  That gap between the software and the work is where your team&rsquo;s time actually goes.
                  It rarely shows up on any budget line, which is why it never gets fixed.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pull quote */}
        <PullQuote>
          You don&rsquo;t need more technology. You need the manual work taken off people&rsquo;s desks.
        </PullQuote>

        {/* 02 Services */}
        <section id="services" className="scroll-mt-[68px] bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="02" name="SERVICES" tone="paper" />
            <Reveal className="mt-10">
              <h2 className="max-w-[820px] text-[2rem] md:text-[3rem]">
                Three ways we take work off your desks
              </h2>
            </Reveal>
            <div className="mt-12 grid border-t border-rule-light md:grid-cols-3">
              {services.map((s, i) => (
                <Reveal
                  key={s.title}
                  className="flex flex-col border-b border-rule-light py-8 md:border-r md:px-7 md:last:border-r-0 md:first:pl-0"
                  delay={i * 60}
                >
                  <p className="mono-label text-muted-paper">
                    {String(i + 1).padStart(2, "0")}
                    {s.tag ? ` / ${s.tag}` : ""}
                  </p>
                  <h3 className="mt-5 text-[1.4rem]">{s.title}</h3>
                  <p className="mt-4 text-[16px] text-muted-paper">{s.line}</p>
                  <p className="mt-5 text-[16px]">
                    <span className="mono-label">Examples: </span>
                    {s.examples}
                  </p>
                  <p className="mono-label mt-auto border-t border-rule-light pt-5 text-ink">{s.price}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 03 AI, only where it helps */}
        <section className="bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="03" name="AI, ONLY WHERE IT HELPS" tone="paper" />
            <Reveal className="mt-10 max-w-[860px]">
              <h2 className="text-[2rem] md:text-[3rem]">
                You don&rsquo;t need an AI strategy to work with us.
              </h2>
            </Reveal>
            <div className="mt-12 grid border-t border-rule-light md:grid-cols-3">
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
                <Reveal
                  key={c.q}
                  className="border-b border-rule-light py-8 md:border-r md:px-7 md:last:border-r-0 md:first:pl-0"
                  delay={i * 60}
                >
                  <p className="mono-label text-muted-paper">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-[1.25rem]">{c.q}</h3>
                  <p className="mt-3 text-[16px] text-muted-paper">{c.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <PullQuote>
          If existing software can solve it, we connect it. If automation can solve it, we automate it. If
          AI makes it better, we add AI. In that order.
        </PullQuote>

        {/* 04 Who we help */}
        <section id="who-we-help" className="scroll-mt-[68px] bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="04" name="WHO WE HELP" tone="paper" />
            <Reveal className="mt-10">
              <h2 className="max-w-[860px] text-[2rem] md:text-[3rem]">
                Built for firms running on several systems
              </h2>
              <p className="mt-5 max-w-[680px] text-[16px] text-muted-paper">
                Typically service businesses with 15 to 150 people, several systems, and no in-house
                engineering team.
              </p>
            </Reveal>
            <div className="mt-12 border-t border-rule-light">
              {sectors.map((s, i) => (
                <Reveal
                  key={s.title}
                  className="grid gap-3 border-b border-rule-light py-7 md:grid-cols-[64px_1fr_1.2fr] md:gap-8"
                  delay={i * 50}
                >
                  <p className="mono-label text-muted-paper">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-[1.2rem]">{s.title}</h3>
                  <div>
                    <p className="text-[16px] text-muted-paper">{s.who}</p>
                    <p className="mt-1 text-[16px]">{s.work}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 05 Workflow examples: the centrepiece */}
        <section id="examples" className="on-ink scroll-mt-[68px] bg-ink text-paper">
          <div className="container-page py-20 md:py-40">
            <SectionMark num="05" name="WORKFLOW EXAMPLES" tone="ink" />
            <Reveal className="mt-12">
              <h2 className="max-w-[900px] text-[2.2rem] md:text-[3.6rem]">
                What this looks like in practice
              </h2>
              <p className="mt-6 max-w-[620px] text-[16px] text-muted-ink">
                Four workflows, and the manual version they replace.
              </p>
            </Reveal>
            <div className="mt-16 border-t border-rule-dark">
              {examples.map((ex, i) => (
                <Reveal key={ex.title} className="border-b border-rule-dark py-14" delay={i * 50}>
                  <div className="flex items-baseline gap-4">
                    <span className="mono-label text-hivis">{ex.reference}</span>
                  </div>
                  <h3 className="mt-3 text-[1.6rem] md:text-[2.1rem]">{ex.title}</h3>
                  <div className="mt-8">
                    <StepFlow
                      steps={ex.steps}
                      annotate={ex.annotate}
                      label={`${ex.title} workflow: ${ex.steps.join(", then ")}.`}
                    />
                  </div>
                  <p className="mono-label mt-6 max-w-[720px] normal-case tracking-[0.04em] text-muted-ink">
                    {ex.before}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <p className="mono-label text-muted-ink">
                Illustrative workflows. Real client examples and figures will be published as engagements
                complete.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 06 How it works */}
        <section id="how-it-works" className="scroll-mt-[68px] bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="06" name="HOW IT WORKS" tone="paper" />
            <Reveal className="mt-10">
              <h2 className="text-[2rem] md:text-[3rem]">Five steps, start to finish</h2>
            </Reveal>
            <ol className="mt-12 grid border-t border-rule-light md:grid-cols-5">
              {steps.map((s, i) => (
                <Reveal
                  key={s.title}
                  as="li"
                  className="border-b border-rule-light py-7 md:border-r md:px-5 md:last:border-r-0 md:first:pl-0"
                  delay={i * 50}
                >
                  <span className="mono-num text-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-[1.05rem]">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted-paper">{s.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 Your data stays yours */}
        <section className="bg-hivis text-ink">
          <div className="container-page section-y">
            <SectionMark num="07" name="HOW WE HANDLE YOUR DATA" tone="hivis" />
            <Reveal className="mt-10">
              <h2 className="text-[2rem] md:text-[3rem]">Your data stays yours</h2>
            </Reveal>
            <div className="mt-12 grid border-t border-ink md:grid-cols-4">
              {dataPoints.map((d, i) => (
                <Reveal
                  key={d.title}
                  className="border-b border-ink py-8 md:border-r md:px-6 md:last:border-r-0 md:first:pl-0"
                  delay={i * 50}
                >
                  <p className="mono-label">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-[1.15rem]">{d.title}</h3>
                  <p className="mt-3 text-[16px]">{d.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 08 Why Quietcrew */}
        <section className="bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="08" name="WHY QUIETCREW" tone="paper" />
            <Reveal className="mt-10">
              <h2 className="text-[2rem] md:text-[3rem]">Why Quietcrew</h2>
            </Reveal>
            <div className="mt-12 grid border-t border-rule-light sm:grid-cols-2">
              {whyUs.map((w, i) => (
                <Reveal
                  key={w.title}
                  className="border-b border-rule-light py-8 sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
                  delay={i * 50}
                >
                  <p className="mono-label text-muted-paper">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-[1.15rem]">{w.title}</h3>
                  <p className="mt-3 text-[16px] text-muted-paper">{w.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 09 FAQ */}
        <section id="faq" className="scroll-mt-[68px] bg-paper text-ink">
          <div className="container-page section-y">
            <SectionMark num="09" name="FAQ" tone="paper" />
            <Reveal className="mt-10">
              <h2 className="text-[2rem] md:text-[3rem]">Questions we get asked</h2>
            </Reveal>
            <Reveal className="mt-10 max-w-[900px]">
              <Accordion type="single" collapsible className="w-full border-t border-rule-light">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="border-b border-rule-light">
                    <AccordionTrigger className="py-6 text-left font-display text-[1.15rem] font-bold hover:no-underline">
                      <span className="flex gap-5">
                        <span className="mono-label pt-1 text-muted-paper">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{f.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-7 pl-[52px] text-[16px] text-muted-paper">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* 10 Final CTA */}
        <section id="book" className="on-ink scroll-mt-[68px] bg-ink text-paper">
          <div className="container-page section-y">
            <SectionMark num="10" name="BOOK A WORKFLOW REVIEW" tone="ink" />
            <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <h2 className="text-[2rem] md:text-[3rem]">
                  What&rsquo;s still manual in your business?
                </h2>
                <p className="mt-6 text-[16px] text-muted-ink">
                  Show us one repetitive process. In 30 minutes we&rsquo;ll map it, tell you what could be
                  automated, roughly what it would cost, and whether it&rsquo;s worth doing at all.
                </p>
                <p className="mono-label mt-8 normal-case tracking-[0.04em] text-muted-ink">
                  Prefer email? Write to{" "}
                  <a href="mailto:hello@quietcrew.co.uk" className="text-hivis underline underline-offset-4">
                    hello@quietcrew.co.uk
                  </a>
                  .
                </p>
              </Reveal>

              <Reveal delay={60}>
                <EnquiryForm />

                <div className="mt-6 border border-rule-dark p-6">
                  <p className="mono-label text-hivis">Or pick a time now</p>
                  <p className="mt-3 text-[16px] text-muted-ink">
                    Cal.com embed placeholder. Replace the block below with your own Cal.com embed or
                    booking link (for example cal.com/quietcrew/workflow-review).
                  </p>
                  {/* CAL.COM EMBED PLACEHOLDER
                      Paste the Cal.com inline embed script or iframe here, pointed at
                      your own booking link. Nothing else on the page needs to change. */}
                  <div className="mono-label mt-5 flex h-32 items-center justify-center border border-rule-dark text-muted-ink">
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

import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { StepSequence } from "@/components/FlowDiagram";
import { LiveWorkflow, Marquee, RotatingWord } from "@/components/LiveWorkflow";
import {
  ArtefactTile,
  CandidateSummary,
  AccountBrief,
  LeaseAnswer,
  WeeklyReport,
} from "@/components/Artefacts";
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
    artefact: <CandidateSummary />,
  },
  {
    tag: null,
    title: "Sales Workflow Automation",
    line: "Take the admin out of selling so your people spend the time actually selling.",
    examples:
      "Lead research and qualification, CRM enrichment and hygiene, account briefs before meetings, automated follow-up, pipeline reporting.",
    price: "From £2,500, 1 to 3 weeks",
    artefact: <AccountBrief />,
  },
  {
    tag: null,
    title: "Internal AI Tools",
    line: "Focused tools that make your own information usable, not another chatbot.",
    examples:
      "Company knowledge assistant, question-answering across your documents, contract and lease intelligence, proposal drafting from past work, policy and operations assistants.",
    price: "From £4,000, 2 to 4 weeks",
    artefact: <LeaseAnswer />,
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

const examples: {
  title: string;
  steps: string[];
  before: string;
  approvalIndex: number;
  artefact: ReactNode;
}[] = [
  {
    title: "Recruitment",
    steps: ["CV arrives", "Details extracted", "ATS updated", "Summary written", "Recruiter notified"],
    before:
      "Before: someone opens the CV, retypes six fields into the ATS, writes a summary, and forwards it on. Ten minutes, forty times a week.",
    approvalIndex: 3,
    artefact: <CandidateSummary />,
  },
  {
    title: "Sales",
    steps: ["New lead", "Company researched", "Qualified", "CRM enriched", "Brief sent to rep"],
    before: "Before: the rep Googles the company the morning of the call, if there's time.",
    approvalIndex: 2,
    artefact: <AccountBrief />,
  },
  {
    title: "Property",
    steps: ["Lease received", "Key terms extracted", "System updated", "Made searchable", "Team notified"],
    before:
      "Before: the lease sits in a folder and someone reads all forty pages when a question comes up.",
    approvalIndex: 1,
    artefact: <LeaseAnswer />,
  },
  {
    title: "Agency",
    steps: ["New client won", "Project created", "Tasks generated", "Team assigned", "Onboarding starts"],
    before: "Before: a half-remembered checklist, done slightly differently every time.",
    approvalIndex: 3,
    artefact: <WeeklyReport />,
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

function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "violet" }) {
  return <p className={tone === "light" ? "eyebrow" : "eyebrow-on-violet"}>{children}</p>;
}

function Index() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="on-violet violet-glow relative text-white">
          <div className="container-page pb-16 pt-[140px] md:pb-24 md:pt-[180px]">
            <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <span
                  aria-hidden="true"
                  className="mb-7 flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/95 text-[1.2rem] font-extrabold text-violet soft-shadow"
                >
                  Q
                </span>
                <h1 className="text-[2.6rem] md:text-[4.4rem]">
                  You bought the software.
                  <br />
                  <span className="text-peach">
                    Your team still does{" "}
                    <RotatingWord words={["the CVs.", "the invoices.", "the chasing.", "the reports."]} />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={80}>
                <p className="max-w-[520px] text-[1.05rem] text-muted-on-violet md:text-[1.15rem]">
                  We connect the tools you already own and automate the work between them. It runs in the
                  background. Your team just stops doing it.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a href="#book" className="pill-btn btn-white px-7 py-4 text-[1rem]">
                    Book a free Workflow Review
                  </a>
                  <a
                    href="#examples"
                    className="pill-btn px-7 py-4 text-[1rem] text-white ring-1 ring-white/40 hover:bg-white/10"
                  >
                    See it working
                  </a>
                </div>
                <p className="mt-4 text-[15px] text-muted-on-violet">
                  30 minutes. No pitch. One process mapped, and an honest answer.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-14" delay={120}>
              <LiveWorkflow />
            </Reveal>
          </div>

          <div className="border-t border-white/10 py-5 text-muted-on-violet">
            <Marquee
              items={[
                "CV to ATS",
                "Invoice to finance system",
                "Lease to searchable answer",
                "Enquiry to CRM",
                "Client won to project set up",
                "Weekly report, written and sent",
                "Approval chased, then closed",
              ]}
            />
          </div>
        </section>

        {/* Problem */}
        <section className="bg-cream text-ink">
          <div className="container-page section-y text-center">
            <Reveal className="mx-auto max-w-[760px]">
              <Eyebrow>The problem</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Your tools changed.
                <br />
                <span className="text-violet">The work didn&rsquo;t.</span>
              </h2>
              <p className="mx-auto mt-7 max-w-[620px] text-muted-paper">
                You own the systems. Your people still fill the gaps between them by hand, and that time
                never shows up on a budget line.
              </p>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5" delay={60}>
              {[
                "Copying between systems",
                "Chasing approvals",
                "Retyping documents",
                "The same weekly report",
                "Remembering to follow up",
                "Updating the CRM",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-muted-paper soft-shadow"
                >
                  {chip}
                </span>
              ))}
            </Reveal>


            <Reveal className="mx-auto mt-14 max-w-[900px]">
              <p className="text-[1.7rem] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[2.6rem]">
                You don&rsquo;t need more technology.{" "}
                <span className="text-violet">
                  You need the manual work taken off people&rsquo;s desks.
                </span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Three ways we take
                <br />
                <span className="text-violet">work off your desks</span>
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {services.map((s, i) => (
                <Reveal
                  key={s.title}
                  className="flex flex-col rounded-[20px] bg-white p-6 soft-shadow"
                  delay={i * 60}
                >
                  {s.tag && (
                    <p className="eyebrow mb-4 self-start">{s.tag}</p>
                  )}
                  <h3 className="text-[1.35rem]">{s.title}</h3>
                  <p className="mt-3 text-[16px] text-muted-paper">{s.line}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.examples
                      .split(",")
                      .slice(0, 4)
                      .map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full bg-violet-tint px-3 py-1.5 text-[13px] font-semibold text-violet"
                        >
                          {chip.trim().replace(/\.$/, "").replace(/^./, (c) => c.toUpperCase())}
                        </li>
                      ))}
                  </ul>
                  <p className="mt-5 text-[15px] font-semibold text-violet">{s.price}</p>
                  <div className="mt-auto pt-6">
                    <ArtefactTile tone={i === 2 ? "peach" : "violet"}>{s.artefact}</ArtefactTile>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI, only where it helps */}
        <section className="bg-white text-ink">
          <div className="container-page pb-16 md:pb-28">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow>AI, only where it helps</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3rem]">
                You don&rsquo;t need an AI strategy
                <br />
                <span className="text-violet">to work with us.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                <Reveal key={c.q} className="rounded-[20px] bg-cream p-6" delay={i * 60}>
                  <h3 className="text-[1.2rem]">{c.q}</h3>
                  <p className="mt-3 text-[16px] text-muted-paper">{c.a}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mx-auto mt-16 max-w-[900px] text-center">
              <p className="text-[1.6rem] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[2.4rem]">
                If existing software can solve it, we connect it. If automation can solve it, we automate
                it. <span className="text-violet">If AI makes it better, we add AI. In that order.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Workflow examples: the centrepiece */}
        <section id="examples" className="on-violet violet-glow scroll-mt-[110px] text-white">
          <div className="container-page py-24 md:py-36">
            <Reveal className="mx-auto max-w-[820px] text-center">
              <Eyebrow tone="violet">Workflow examples</Eyebrow>
              <h2 className="mt-5 text-[2.2rem] md:text-[3.4rem]">
                What this looks like
                <br />
                <span className="text-peach">in practice</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[560px] text-[16px] text-muted-on-violet">
                Four workflows, and the manual version they replace.
              </p>
            </Reveal>

            <div className="mt-16 space-y-8">
              {examples.map((ex, i) => (
                <Reveal
                  key={ex.title}
                  className="grid items-start gap-8 rounded-[20px] bg-white/[0.07] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-9"
                  delay={i * 50}
                >
                  <div>
                    <h3 className="text-[1.6rem] md:text-[2rem]">{ex.title}</h3>
                    <div className="mt-6">
                      <StepSequence steps={ex.steps} approvalIndex={ex.approvalIndex} />
                    </div>
                    <p className="mt-6 max-w-[520px] text-[15px] text-muted-on-violet">{ex.before}</p>
                  </div>
                  <ArtefactTile tone="violet" className="bg-white/10">
                    {ex.artefact}
                  </ArtefactTile>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 text-center">
              <p className="text-[14px] text-muted-on-violet">
                Illustrative workflows. Real client examples and figures will be published as engagements
                complete.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Who we help */}
        <section id="who-we-help" className="scroll-mt-[110px] bg-cream text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow>Who we help</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Built for firms running
                <br />
                <span className="text-violet">on several systems</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-[16px] text-muted-paper">
                Typically service businesses with 15 to 150 people, several systems, and no in-house
                engineering team.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {sectors.map((s, i) => (
                <Reveal
                  key={s.title}
                  className="rounded-[20px] bg-white p-6 soft-shadow"
                  delay={i * 50}
                >
                  <h3 className="text-[1.2rem]">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted-paper">{s.who}</p>
                  <p className="mt-2 text-[15px] text-ink">{s.work}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Five steps,
                <br />
                <span className="text-violet">start to finish</span>
              </h2>
            </Reveal>
            <ol className="mt-14 grid gap-6 md:grid-cols-5">
              {steps.map((s, i) => (
                <Reveal
                  key={s.title}
                  as="li"
                  className="rounded-[20px] bg-cream p-6"
                  delay={i * 50}
                >
                  <span className="block text-[2.4rem] font-extrabold leading-none tracking-[-0.03em] text-violet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[1.05rem]">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted-paper">{s.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Your data stays yours */}
        <section className="on-violet violet-glow text-white">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow tone="violet">How we handle your data</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Your data
                <br />
                <span className="text-peach">stays yours</span>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {dataPoints.map((d, i) => (
                <Reveal key={d.title} className="rounded-[20px] bg-white/[0.09] p-6" delay={i * 50}>
                  <h3 className="text-[1.1rem]">{d.title}</h3>
                  <p className="mt-3 text-[15px] text-muted-on-violet">{d.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mx-auto mt-12 max-w-[760px]">
              <ArtefactTile tone="violet" className="bg-white/10">
                <WeeklyReport />
              </ArtefactTile>
            </Reveal>
          </div>
        </section>

        {/* Why Quietcrew */}
        <section className="bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>Why Quietcrew</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Why <span className="text-violet">Quietcrew</span>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {whyUs.map((w, i) => (
                <Reveal key={w.title} className="rounded-[20px] bg-cream p-6" delay={i * 50}>
                  <h3 className="text-[1.15rem]">{w.title}</h3>
                  <p className="mt-3 text-[16px] text-muted-paper">{w.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page pb-16 md:pb-28">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Questions
                <br />
                <span className="text-violet">we get asked</span>
              </h2>
            </Reveal>
            <Reveal className="mx-auto mt-12 max-w-[880px]">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`item-${i}`}
                    className="mb-3 rounded-[20px] border-0 bg-cream px-6"
                  >
                    <AccordionTrigger className="py-5 text-left text-[1.1rem] font-bold hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-[16px] text-muted-paper">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section id="book" className="on-violet violet-glow scroll-mt-[110px] text-white">
          <div className="container-page section-y">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <Eyebrow tone="violet">Book a Workflow Review</Eyebrow>
                <h2 className="mt-5 text-[2rem] md:text-[3rem]">
                  What&rsquo;s still manual
                  <br />
                  <span className="text-peach">in your business?</span>
                </h2>
                <p className="mt-6 text-[16px] text-muted-on-violet">
                  Show us one repetitive process. In 30 minutes we&rsquo;ll map it, tell you what could be
                  automated, roughly what it would cost, and whether it&rsquo;s worth doing at all.
                </p>
                <p className="mt-8 text-[15px] text-muted-on-violet">
                  Prefer email? Write to{" "}
                  <a href="mailto:hello@quietcrew.co.uk" className="font-semibold text-peach underline underline-offset-4">
                    hello@quietcrew.co.uk
                  </a>
                  .
                </p>
              </Reveal>

              <Reveal delay={60}>
                <EnquiryForm />

                <div className="mt-6 rounded-[20px] bg-white/[0.09] p-6">
                  <p className="eyebrow-on-violet">Or pick a time now</p>
                  <p className="mt-4 text-[16px] text-muted-on-violet">
                    Cal.com embed placeholder. Replace the block below with your own Cal.com embed or
                    booking link (for example cal.com/quietcrew/workflow-review).
                  </p>
                  {/* CAL.COM EMBED PLACEHOLDER
                      Paste the Cal.com inline embed script or iframe here, pointed at
                      your own booking link. Nothing else on the page needs to change. */}
                  <div className="mt-5 flex h-32 items-center justify-center rounded-[14px] bg-white/10 text-[14px] text-muted-on-violet">
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

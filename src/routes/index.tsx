import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LiveWorkflow, Marquee, RotatingWord } from "@/components/LiveWorkflow";
import {
  ArtefactTile,
  CandidateSummary,
  AccountBrief,
  LeaseAnswer,
  WeeklyReport,
} from "@/components/Artefacts";
import { ExampleTabs } from "@/components/ExampleTabs";
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
  label: string;
  steps: string[];
  before: string;
  approvalIndex: number;
  artefact: ReactNode;
}[] = [
  {
    title: "Recruitment",
    label: "Recruitment",
    steps: ["CV arrives", "Details extracted", "ATS updated", "Summary written", "Recruiter notified"],
    before:
      "Before this ran on its own, someone opened each CV, retyped six fields into the ATS, wrote a summary and forwarded it on, which took about ten minutes and happened forty times a week.",
    approvalIndex: 3,
    artefact: <CandidateSummary />,
  },
  {
    title: "Sales",
    label: "Sales",
    steps: ["New lead", "Company researched", "Qualified", "CRM enriched", "Brief sent to rep"],
    before:
      "Before this ran on its own, the rep researched the company on the morning of the call, whenever there was time for it.",
    approvalIndex: 2,
    artefact: <AccountBrief />,
  },
  {
    title: "Property",
    label: "Property",
    steps: ["Lease received", "Key terms extracted", "System updated", "Made searchable", "Team notified"],
    before:
      "Before this ran on its own, the lease sat in a folder and somebody read all forty pages each time a question came up.",
    approvalIndex: 1,
    artefact: <LeaseAnswer />,
  },
  {
    title: "Agency",
    label: "Agencies",
    steps: ["New client won", "Project created", "Tasks generated", "Team assigned", "Onboarding starts"],
    before:
      "Before this ran on its own, onboarding relied on a half-remembered checklist that was done slightly differently every time.",
    approvalIndex: 3,
    artefact: <WeeklyReport />,
  },
];

const steps = [
  {
    title: "Show us what is still manual",
    body: "Pick one process and talk us through where the time actually goes.",
  },
  {
    title: "We map it",
    body: "We write down the people, the systems, the steps and the handoffs, along with what the process costs you over a year.",
  },
  {
    title: "We pick the simplest fix",
    body: "That might be existing software, an integration, automation, AI or a combination of them, and if it is not worth doing at all we will say so.",
  },
  {
    title: "We build it",
    body: "Most builds take one to four weeks, they run in your systems, and your team is involved as we go.",
  },
  {
    title: "We measure it",
    body: "We check the time you have got back, then look at where the next hour is going.",
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
    title: "We start with the business problem",
    body: "The first conversation is about what is costing you time, rather than about whichever technology happens to be fashionable this year.",
  },
  {
    title: "We improve what you already have",
    body: "There is no rip and replace, so your team keeps working in the systems they already know.",
  },
  {
    title: "You own what we build",
    body: "Everything runs in your own accounts, which means there is nothing to lock you in and nothing to take away.",
  },
  {
    title: "Small first projects, delivered quickly",
    body: "Most first projects land in one to four weeks for £2,000 to £10,000, so you can find out whether this works for you without making a large bet.",
  },
];

const faqs = [
  {
    q: "How much does this cost?",
    a: "Most first projects are £2,000 to £10,000 depending on how many systems are involved. We give a fixed price after the Workflow Review, before any work starts.",
  },
  {
    q: "How long does it take?",
    a: "Most automation work takes one to three weeks, and internal AI tools usually take two to four, depending on how many systems are involved.",
  },
  {
    q: "What if it breaks?",
    a: "Things do change, because software updates, interfaces move and processes evolve, so every build includes a settling-in period, and we offer an ongoing care plan if you would rather we looked after it permanently.",
  },
  {
    q: "Do we own what you build?",
    a: "Yes, because it runs in your accounts and under your logins, so if you stop working with us everything carries on running exactly as it did.",
  },
  {
    q: "How is this different from hiring a freelancer to set up Zapier?",
    a: "A freelancer builds the workflow you describe, whereas we work out whether it is the right workflow in the first place, what it is actually costing you, and what should happen when it meets the exceptions, so you are buying the diagnosis and the outcome rather than a file.",
  },
  {
    q: "What if you look at our process and it isn't worth automating?",
    a: "Then we tell you and you have lost half an hour, which does happen from time to time, and we would much rather say it than sell you something you do not need.",
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
                    <RotatingWord words={["the copying.", "the chasing.", "the CVs.", "the leases.", "the reports."]} />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={80}>
                <p className="max-w-[520px] text-[1.05rem] text-muted-on-violet md:text-[1.15rem]">
                  We connect the tools you already use and automate the manual work between them. Less
                  copying, chasing, updating and retyping for your team.
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
                  It takes 30 minutes, there is no pitch, and you leave with one process mapped and an
                  honest answer about it.
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
                Most businesses already have plenty of software. The problem is all the work people
                still do between those systems.
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
                Pick the one that looks like your business.
              </p>
            </Reveal>

            <Reveal className="mt-14">
              <ExampleTabs examples={examples} />
            </Reveal>

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

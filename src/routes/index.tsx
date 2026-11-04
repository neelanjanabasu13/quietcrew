import { ProductSlider } from "@/components/ProductSlider";
import { WorkflowShowcase } from "@/components/WorkflowShowcase";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { RotatingWord } from "@/components/LiveWorkflow";
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
const OG_IMAGE = "https://quietcrew.ai/og-quietcrew.jpg";

const faqEntries: { q: string; a: string }[] = [
  {
    q: "Do I need to know anything about AI?",
    a: "No. You do not even need to use AI today. Show us the process that is causing you pain and we will work out the technology.",
  },
  {
    q: "Will this work with our existing software?",
    a: "Usually yes, because most business software can be connected, and where a system is closed we work around it rather than asking you to replace it. We check this during the Workflow Review before quoting anything.",
  },
  {
    q: "Could I not just use Zapier?",
    a: "Sometimes, yes. If your problem is a straightforward Zapier workflow, we will tell you. We tend to help when a process crosses several systems, needs judgement or document understanding, or is not obvious enough to automate from a template.",
  },
  {
    q: "What happens to our data?",
    a: "It stays in the tools and accounts you already control wherever possible, and if a workflow uses an AI provider we tell you which one and what it receives. We agree scope, access and data handling with you before anything connects.",
  },
  {
    q: "How much does it cost?",
    a: "Goldmine is £49 per scan, the Outshine scan is free with the detailed fix list at £9.99, and a one-time Workflow Audit is £99. Custom automation is quoted as a fixed price after the Workflow Review, so you know the cost before any work starts.",
  },
  {
    q: "How long does it take?",
    a: "Most automation work takes one to three weeks, and internal AI tools usually take two to four, depending on how many systems are involved.",
  },
];

const serviceOfferings = [
  {
    name: "Workflow & Systems Automation",
    description:
      "Connecting the systems you already own and automating the repetitive steps between them, including onboarding, document processing, approvals and scheduled reporting.",
    price: 2000,
  },
  {
    name: "Sales Workflow Automation",
    description:
      "Automating the repetitive work around the sale, including lead research and qualification, CRM enrichment, account briefs before meetings, follow-up and pipeline reporting.",
    price: 2500,
  },
  {
    name: "Internal AI Tools",
    description:
      "Practical internal AI tools built around a specific job, such as question answering across your documents, contract search and proposal drafting from past work.",
    price: 4000,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": serviceOfferings.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: s.name,
    areaServed: { "@type": "Country", name: "United Kingdom" },
    provider: {
      "@type": "Organization",
      name: "Quietcrew",
      url: "https://quietcrew.ai",
      email: "hello@quietcrew.ai",
    },
  })),
};

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
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      { type: "application/ld+json", children: JSON.stringify(servicesSchema) },
    ],
  }),
  component: Index,
});


const steps = [
  {
    title: "Show us the annoying bit",
    body: "Pick one job your team repeats every week, such as tidying CRM records, building client reports or chasing an approval.",
  },
  {
    title: "We work out what is happening",
    body: "We follow it through the people, the systems and the hand-offs, and count the hours it eats. Then we tell you whether it is worth fixing.",
  },
  {
    title: "We build the simplest solution",
    body: "That might be an integration, an automation, AI, or a combination of the three. We will not add technology just because we can.",
  },
  {
    title: "See if it worked",
    body: "We measure the hours it gave back. If there is another job worth tackling, we move onto that one.",
  },
];


const dataPoints = [
  "Wherever possible, we build inside the tools and accounts you already control rather than creating another place to store your data.",
  "If a workflow uses an AI provider, we will tell you which one, what information it receives and how that data is handled.",
  "For sensitive actions such as payments, deletions or customer communications, we will agree where human approval is required before we build the workflow.",
  "Before anything connects to your systems, we will agree the scope, access and data handling with you.",
];


const faqs = faqEntries;

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
          <div className="container-page pb-12 pt-[120px] md:pb-16 md:pt-[150px]">
            <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <h1 className="text-[2.6rem] md:text-[4.4rem]">
                  You bought the software.
                  <br />
                  <span className="text-peach">
                    Your team still does{" "}
                    <RotatingWord words={["the copying.", "the chasing.", "the follow-ups.", "the reports."]} />
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
                    href="#workflows"
                    className="pill-btn px-7 py-4 text-[1rem] text-white ring-1 ring-white/40 hover:bg-white/10"
                  >
                    See what we build
                  </a>
                </div>
                <p className="mt-4 text-[15px] text-muted-on-violet">
                  It takes 30 minutes, there is no pitch, and you leave with one process mapped and an
                  honest answer about it.
                </p>
              </Reveal>
            </div>

            <ProductSlider />
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
                <span className="text-violet">The work did not.</span>
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
          </div>
        </section>

        {/* AI, only where it helps */}
        <section className="bg-white text-ink">
          <div className="container-page pb-12 md:pb-20">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow>AI, only where it helps</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3rem]">
                AI is not
                <br />
                <span className="text-violet">the starting point.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-[18px] text-muted-paper">
                We start with the work that is taking your team too long. Sometimes the answer is
                connecting two systems you already pay for, sometimes a straightforward automation, and
                sometimes AI can do something that was not practical before. We will use whatever makes
                the most sense, and tell you when AI does not.
              </p>
            </Reveal>
          </div>
        </section>



        {/* Workflows in motion */}
        <section id="workflows" className="on-violet violet-glow scroll-mt-[110px] text-white">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow tone="violet">Workflows in motion</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                The same job,
                <br />
                <span className="text-peach">with the busywork taken out.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-[18px] text-muted-on-violet">
                Pick a card to watch the manual version race the automated one, with a person still
                approving anything that goes out.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <WorkflowShowcase />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Start with one
                <br />
                <span className="text-violet">annoying workflow.</span>
              </h2>
            </Reveal>
            <ol className="mt-10 grid gap-6 md:grid-cols-4">
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
            <Reveal className="mx-auto mt-10 max-w-[620px] text-center">
              <p className="text-[18px] text-muted-paper">
                Sometimes the answer is that it is not worth doing, and we will say so.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Deliberately small + data & control */}
        <section className="on-violet violet-glow text-white">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow tone="violet">Why Quietcrew</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                We are
                <br />
                <span className="text-peach">deliberately small.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[660px] text-[18px] text-muted-on-violet">
                There is no sales team and no six-week discovery exercise, so you speak to the people
                who understand the problem and build the solution.
              </p>
              <p className="mx-auto mt-4 max-w-[660px] text-[18px] text-muted-on-violet">
                We start with one annoying workflow, build it quickly and measure the hours it gave
                back. Then you decide whether we do another one.
              </p>
            </Reveal>

            <Reveal className="mx-auto mt-10 max-w-[880px] rounded-[20px] bg-white/[0.09] p-7 md:p-9">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-peach">
                Data &amp; control
              </p>
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {dataPoints.map((d) => (
                  <li key={d} className="text-[16px] text-muted-on-violet">
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>


        {/* FAQ */}
        <section id="faq" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page pt-16 pb-12 md:pt-24 md:pb-20">

            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Questions
                <br />
                <span className="text-violet">we get asked</span>
              </h2>
            </Reveal>
            <Reveal className="mx-auto mt-10 max-w-[880px]">
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
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <Eyebrow tone="violet">Book a Workflow Review</Eyebrow>
                <h2 className="mt-5 text-[2rem] md:text-[3rem]">
                  What is still manual
                  <br />
                  <span className="text-peach">in your business?</span>
                </h2>
                <p className="mt-6 text-[16px] text-muted-on-violet">
                  Show us one repetitive process. In 30 minutes we will map it, tell you what could be
                  automated, roughly what it would cost, and whether it is worth doing at all.
                </p>
                <p className="mt-8 text-[15px] text-muted-on-violet">
                  Prefer email? Write to{" "}
                  <a href="mailto:hello@quietcrew.ai" className="font-semibold text-peach underline underline-offset-4">
                    hello@quietcrew.ai
                  </a>
                  .
                </p>
              </Reveal>

              <Reveal delay={60}>
                <EnquiryForm />

              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

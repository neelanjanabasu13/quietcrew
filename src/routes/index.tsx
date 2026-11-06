import { ProductSlider } from "@/components/ProductSlider";
import { WorkflowShowcase } from "@/components/WorkflowShowcase";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "Quietcrew | Ready-made tools and hands-on help for small UK businesses";
const DESCRIPTION =
  "Goldmine finds local prospects for agencies, Outshine shows local businesses how they compare with nearby rivals on Google, and we offer audits, consultations and small builds for everything else.";
const OG_IMAGE = "https://quietcrew.ai/og-quietcrew.jpg";

const faqEntries: { q: string; a: string }[] = [
  {
    q: "Who is behind Quietcrew?",
    a: "Quietcrew is a small UK firm. We build the tools ourselves, and when you get in touch you speak to the person doing the work rather than to a sales team.",
  },
  {
    q: "What is the difference between Goldmine and Outshine?",
    a: "Goldmine is for marketing and SEO agencies looking for new clients: you pick a London area and a category, and it finds well reviewed local businesses that AI assistants rarely recommend, with an outreach draft for each one. Outshine is for the local businesses themselves, giving you a free scan of your public Google profile against nearby rivals, with a detailed fix list available if you want it.",
  },
  {
    q: "How much does it cost?",
    a: "Goldmine is £49 per scan. The Outshine scan is free, and the Done-for-You Fix Pack is £9.99, reduced from £14.99. A Workflow Audit is £99, a 1:1 consultation is £100 per hour, and setup or small builds are quoted as a fixed price before we start, so you always know the cost first.",
  },
  {
    q: "What happens in a Workflow Audit?",
    a: "You pick one job that takes your team too long, and we map it with you from start to finish. You then get a plain English write-up of what could be connected, what could be automated, which off-the-shelf tools would suit you, and whether it is worth doing at all.",
  },
  {
    q: "Do you build AI agents?",
    a: "Not at the moment. We start with the software you already pay for and simple automations, and if something needs more than we can deliver well, we will tell you plainly rather than take it on.",
  },
  {
    q: "What happens to my data?",
    a: "Wherever possible it stays in the tools and accounts you already control. We agree the scope, access and data handling with you before anything is connected, and a person always approves anything irreversible, such as payments, deletions or messages to your customers.",
  },
];

const serviceOfferings = [
  {
    name: "Workflow Audit",
    description:
      "A one-time review of one repetitive process, ending with a plain English plan of what to connect, what to automate and which tools to use.",
    price: "99",
  },
  {
    name: "1:1 Consultation",
    description:
      "An hour-long session on your software setup, the tools worth buying and small no-code builds.",
    price: "100",
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
    offers: { "@type": "Offer", price: s.price, priceCurrency: "GBP" },
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

const tiers = [
  {
    label: "One-time",
    title: "Workflow Audit",
    price: "£99",
    body: "Pick one job that eats your week, such as chasing quotes, updating spreadsheets or sending the same report. We map it with you and hand you a plain English plan of what to connect, what to automate and which tools to use.",
    subject: "Workflow Audit enquiry",
    cta: "Ask for an audit",
  },
  {
    label: "1:1",
    title: "Consultation",
    price: "£100 per hour",
    body: "An hour with us on your software setup, the tools worth paying for and the ones you can cancel, or a small no-code build you have in mind. You leave with clear next steps.",
    subject: "Consultation enquiry",
    cta: "Arrange a consultation",
  },
  {
    label: "Hands-on",
    title: "Setup and small builds",
    price: "Price on request",
    body: "When you would rather we did it, we connect the tools you already use, set up simple automations between them, or build a clean one-page website for your business. You get a fixed price before we start.",
    subject: "Setup or build enquiry",
    cta: "Tell us what you need",
  },
];

const principles = [
  {
    title: "You speak to the person doing the work",
    body: "There is no sales team or account manager in between, so the person who listens to the problem is the one who fixes it.",
  },
  {
    title: "What you already own comes first",
    body: "If your existing software can do the job, we connect it. If a simple automation will do, we set that up, and we only suggest new tools when they clearly earn their place.",
  },
  {
    title: "A person approves anything irreversible",
    body: "Payments, deletions and messages to your customers always wait for someone on your side to say yes before they go out.",
  },
  {
    title: "Plain answers, including no",
    body: "If something is not worth automating, or is beyond what we can deliver well, we will say so before you spend anything.",
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
          <div className="container-page pb-12 pt-[120px] md:pb-16 md:pt-[150px]">
            <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <h1 className="text-[2.6rem] md:text-[4.4rem]">
                  Ready-made tools,
                  <br />
                  <span className="text-peach">and a builder you can talk to.</span>
                </h1>
              </Reveal>

              <Reveal delay={80}>
                <p className="max-w-[520px] text-[1.05rem] text-muted-on-violet md:text-[1.15rem]">
                  We build simple tools that help agencies and local businesses win more work, and when you
                  need something more specific, we will sit down with you and work out the simplest fix.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a href="#tools" className="pill-btn btn-white px-7 py-4 text-[1rem]">
                    See the tools
                  </a>
                  <a
                    href="#work-with-me"
                    className="pill-btn px-7 py-4 text-[1rem] text-white ring-1 ring-white/40 hover:bg-white/10"
                  >
                    Work with us
                  </a>
                </div>
              </Reveal>
            </div>

            <ProductSlider />
          </div>
        </section>

        {/* Tools in motion */}
        <section id="tools" className="scroll-mt-[110px] bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>Ready-made tools</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Watch each tool
                <br />
                <span className="text-violet">do the legwork.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-[18px] text-muted-paper">
                Pick a tool to see the steps it runs for you, from the first search to the finished
                result you can act on.
              </p>
            </Reveal>
            <Reveal className="on-violet violet-glow mt-10 rounded-[20px] p-5 text-white md:p-10">
              <WorkflowShowcase />
            </Reveal>
          </div>
        </section>

        {/* Work with us */}
        <section id="work-with-me" className="scroll-mt-[110px] bg-cream text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>Work with us</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Need something
                <br />
                <span className="text-violet">the tools do not cover?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-[18px] text-muted-paper">
                Choose how much help you want, from a single review of one process to having us set it
                up for you.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {tiers.map((t, i) => (
                <Reveal
                  key={t.title}
                  delay={i * 60}
                  className="flex flex-col rounded-[20px] bg-white p-7 soft-shadow"
                >
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-violet">
                    {t.label}
                  </span>
                  <h3 className="mt-3 text-[1.4rem]">{t.title}</h3>
                  <p className="mt-2 text-[1.15rem] font-extrabold text-violet-deep">{t.price}</p>
                  <p className="mt-4 text-[16px] text-muted-paper">{t.body}</p>
                  <div className="mt-auto pt-7">
                    <a
                      href={`mailto:hello@quietcrew.ai?subject=${encodeURIComponent(t.subject)}`}
                      className="pill-btn btn-primary-dark px-6 py-3 text-[15px]"
                    >
                      {t.cta}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-[15px] text-muted-paper">
              Every button opens an email to{" "}
              <a href="mailto:hello@quietcrew.ai" className="font-semibold text-violet underline underline-offset-4">
                hello@quietcrew.ai
              </a>
              , and we reply within one working day.
            </p>
          </div>
        </section>

        {/* How we work */}
        <section id="how-i-work" className="on-violet violet-glow scroll-mt-[110px] text-white">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow tone="violet">How we work</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Small on purpose,
                <br />
                <span className="text-peach">and plain about it.</span>
              </h2>
            </Reveal>
            <ul className="mx-auto mt-10 grid max-w-[960px] gap-5 md:grid-cols-2">
              {principles.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 50} className="rounded-[20px] bg-white/[0.09] p-7">
                  <h3 className="text-[1.15rem]">{p.title}</h3>
                  <p className="mt-3 text-[16px] text-muted-on-violet">{p.body}</p>
                </Reveal>
              ))}
            </ul>
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
                <span className="text-violet">people ask us</span>
              </h2>
            </Reveal>
            <Reveal className="mx-auto mt-10 max-w-[880px]">
              <Accordion type="single" collapsible className="w-full">
                {faqEntries.map((f, i) => (
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

        {/* Contact */}
        <section id="book" className="on-violet violet-glow scroll-mt-[110px] text-white">
          <div className="container-page section-y">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <Eyebrow tone="violet">Get in touch</Eyebrow>
                <h2 className="mt-5 text-[2rem] md:text-[3rem]">
                  Tell us what is
                  <br />
                  <span className="text-peach">slowing you down.</span>
                </h2>
                <p className="mt-6 text-[16px] text-muted-on-violet">
                  Describe the job that takes too long or the tool you are unsure about, and we will reply
                  within one working day with an honest view of whether we can help and what it would cost.
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

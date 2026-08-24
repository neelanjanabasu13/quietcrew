import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice | Quietcrew" },
      {
        name: "description",
        content:
          "How Quietcrew collects, uses and protects personal data for enquiries and client work in the UK.",
      },
      { property: "og:title", content: "Privacy Notice | Quietcrew" },
      {
        property: "og:description",
        content: "How Quietcrew handles personal data for enquiries and client work in the UK.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="container-page section-y max-w-[760px]">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Privacy notice</h1>
        <p className="mt-6 rounded-[16px] bg-violet-tint px-5 py-4 text-[15px] text-ink">
          Draft for legal review. This is starter wording for a UK business and must be checked by a
          solicitor before launch.
        </p>

        <div className="mt-10 space-y-8 text-[17px] leading-[1.65] text-ink">
          <section>
            <h2 className="text-2xl">Who we are</h2>
            <p className="mt-3">
              Quietcrew is a United Kingdom business and is the data controller for the personal data
              described here. You can reach us at hello@quietcrew.ai.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">What we collect</h2>
            <p className="mt-3">
              When you complete the enquiry form we collect your name, company, work email, company size
              and the details you choose to share about your systems and manual processes. When we work
              with a client we may also process information contained in that client&rsquo;s systems, under
              a separate data processing agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Why we use it</h2>
            <p className="mt-3">
              We use enquiry details to respond to you, to prepare for a Workflow Review, and to keep a
              record of the conversation. Our lawful basis is legitimate interests (responding to a
              business enquiry you made) and, where a contract follows, performance of that contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Who we share it with</h2>
            <p className="mt-3">
              We share personal data only with the service providers we use to run the business, such as
              hosting, database and email providers, and only where they are bound by appropriate
              contractual terms. We do not sell personal data, and we do not use client data or enquiry
              data to train AI models. Where we use AI providers in a client build we use commercial API
              tiers with training switched off, and we name every provider involved.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">How long we keep it</h2>
            <p className="mt-3">
              Enquiry records are kept for up to 24 months from the last contact, unless we begin working
              together, in which case client records are kept for the duration of the engagement and for
              six years afterwards for tax and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Your rights</h2>
            <p className="mt-3">
              Under UK GDPR you can ask for a copy of your personal data, ask us to correct or delete it,
              object to or restrict how we use it, and ask us to transfer it. Write to
              hello@quietcrew.ai and we will respond within one month. If you are unhappy with our
              response you can complain to the Information Commissioner&rsquo;s Office at ico.org.uk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Cookies</h2>
            <p className="mt-3">
              This website does not use analytics or advertising cookies. If that changes we will publish
              a cookie notice and ask for consent first.
            </p>
          </section>

          <p className="text-[15px] text-muted-paper">Last updated: August 2026.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

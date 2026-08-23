import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Quietcrew" },
      {
        name: "description",
        content:
          "The terms that apply to using the Quietcrew website, and how our client engagements are contracted.",
      },
      { property: "og:title", content: "Terms of Use | Quietcrew" },
      {
        property: "og:description",
        content: "Terms for using the Quietcrew website and how client work is contracted.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteNav />
      <main className="container-page section-y max-w-[760px]">
        <p className="mono-label text-muted-paper">Legal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Terms of use</h1>
        <p className="mt-6 border-l-2 border-hivis bg-secondary px-4 py-3 text-[15px] text-ink">
          Draft for legal review. This is starter wording for a UK business and must be checked by a
          solicitor before launch.
        </p>

        <div className="mt-10 space-y-8 text-[17px] leading-[1.65] text-ink">
          <section>
            <h2 className="text-2xl">About these terms</h2>
            <p className="mt-3">
              This website is operated by Quietcrew Ltd (placeholder company number 00000000), registered
              in England and Wales. By using the site you accept these terms. If you do not accept them,
              please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Information on this site</h2>
            <p className="mt-3">
              The content here is provided for general information about our services. Workflow examples
              shown on the site are illustrative. Prices and timescales are indicative starting points,
              not offers, and are confirmed in writing before any work begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Enquiries and bookings</h2>
            <p className="mt-3">
              Submitting the enquiry form or booking a Workflow Review does not create a contract for
              services. Any engagement is governed by a separate scope of work and a data processing
              agreement signed by both parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Intellectual property</h2>
            <p className="mt-3">
              The Quietcrew name, wording, design and graphics on this site belong to Quietcrew Ltd. You
              may view and print pages for your own business use. You may not copy or republish the
              content commercially without our written permission. Work we build for a client is owned by
              that client on the terms set out in their scope of work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Liability</h2>
            <p className="mt-3">
              We take care to keep this site accurate and available, but we do not guarantee either. To
              the extent permitted by law we exclude liability for loss arising from use of the site.
              Nothing in these terms limits liability for death or personal injury caused by negligence,
              or for fraud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">Governing law</h2>
            <p className="mt-3">
              These terms are governed by the laws of England and Wales, and the courts of England and
              Wales have exclusive jurisdiction.
            </p>
          </section>

          <p className="text-[15px] text-muted-paper">Last updated: placeholder date.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

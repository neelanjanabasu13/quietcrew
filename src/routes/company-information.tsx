import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/company-information")({
  head: () => ({
    meta: [
      { title: "Company Information | Quietcrew" },
      {
        name: "description",
        content:
          "Company details for Quietcrew Ltd, including registration number, incorporation date and contact email.",
      },
      { property: "og:title", content: "Company Information | Quietcrew" },
      {
        property: "og:description",
        content:
          "Company details for Quietcrew Ltd, including registration number, incorporation date and contact email.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://quietcrew.ai/company-information" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://quietcrew.ai/company-information" }],
  }),
  component: CompanyInformationPage,
});

function CompanyInformationPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="container-page section-y max-w-[760px]">
        <p className="eyebrow">Company</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Company information</h1>

        <div className="mt-10 space-y-8 text-[17px] leading-[1.65] text-ink">
          <section>
            <h2 className="text-2xl">Registered details</h2>
            <dl className="mt-5 grid gap-4 rounded-[16px] bg-violet-tint p-5 md:grid-cols-[160px_1fr]">
              <div className="flex flex-col gap-1">
                <dt className="text-[14px] font-semibold text-muted-paper">Company name</dt>
                <dd className="font-semibold text-ink">QUIETCREW LTD</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[14px] font-semibold text-muted-paper">Company number</dt>
                <dd className="font-semibold text-ink">17444773</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[14px] font-semibold text-muted-paper">Registered in</dt>
                <dd className="font-semibold text-ink">England and Wales</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[14px] font-semibold text-muted-paper">Incorporated</dt>
                <dd className="font-semibold text-ink">7 September 2026</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-2xl">Contact</h2>
            <p className="mt-3">
              Email us at{" "}
              <a
                href="mailto:hello@quietcrew.ai"
                className="font-semibold text-violet underline underline-offset-4"
              >
                hello@quietcrew.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

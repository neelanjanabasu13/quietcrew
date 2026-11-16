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
          "Terms for using Quietcrew and buying Goldmine scans and Outshine Fix Packs.",
      },
      { property: "og:image", content: "https://quietcrew.ai/og-quietcrew.jpg" },
      { name: "twitter:image", content: "https://quietcrew.ai/og-quietcrew.jpg" },
      { property: "og:title", content: "Terms of Use | Quietcrew" },
      {
        property: "og:description",
        content: "Terms for using Quietcrew and buying Goldmine scans and Outshine Fix Packs.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="container-page section-y max-w-[760px]">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Terms of use</h1>
        <div className="mt-8 space-y-8 text-justify text-[17px] leading-[1.65] text-ink">

          <p>Quietcrew is a UK AI and automation consultancy. We help businesses decide where AI and automation can improve their day-to-day work, then help put those changes into practice. We also offer ready-made tools, including Goldmine for agencies looking for local prospects and Outshine for businesses looking to improve their Google Business Profile.</p>
          <p>Quietcrew is the trading name of QUIETCREW LTD, registered in England and Wales under company number 17444773. Our registered office is listed on our <a className="underline" href="/company-information">Company Information page</a>. For questions about these terms or a purchase, email <a className="underline" href="mailto:hello@quietcrew.ai">hello@quietcrew.ai</a>.</p>
          <section><h2 className="text-2xl">What these terms cover</h2><p className="mt-3">These terms cover use of the Quietcrew website and purchases of our ready-made tools. For consultancy, audits and bespoke work, we agree the scope, price and terms with you separately before work begins.</p></section>
          <section><h2 className="text-2xl">What you are buying</h2>
            <p className="mt-3"><strong>Goldmine</strong> helps agencies find and research local businesses. Buying a full scan unlocks the additional prospects and full CSV export for the scan you selected, as shown before checkout. The results reflect the public business information and AI answers checked for that scan. They can help you decide whom to approach. They do not guarantee future recommendations, replies or sales.</p>
            <p className="mt-3"><strong>Outshine</strong> checks public information about a business and its nearby rivals. Each paid purchase covers the scan or Fix Pack shown at checkout. The Fix Pack includes tailored instructions and ready-to-use wording so you can apply the changes yourself. We can agree separately to carry out work for you.</p>
            <p className="mt-3">We show the total price before you place an order. Paid access is linked to the account you use to buy. Keep your order confirmation so we can help you find your purchase if needed.</p>
          </section>
          <section><h2 className="text-2xl">If you are unhappy with your results</h2>
            <p className="mt-3">If the results are not what you expected, or you cannot access your scan or download, email <a className="underline" href="mailto:hello@quietcrew.ai">hello@quietcrew.ai</a> with your order details and a short description of the issue. We will look into what happened and work with you to put it right.</p>
            <p className="mt-3">We do not offer discretionary refunds for a change of mind or because the results differ from what you hoped for. Any cancellation, refund or other rights you have under law still apply.</p>
          </section>
          <section><h2 className="text-2xl">Using the website and reports</h2><p className="mt-3">You may use your reports and downloads for your own business, including adapting Goldmine’s outreach drafts. Review any draft and check the details before sending it. Use your own account and only access reports you are authorised to view.</p></section>
          <section><h2 className="text-2xl">Governing law</h2><p className="mt-3">These terms are governed by the laws of England and Wales. If you are a consumer, this does not take away any protections or rights to bring a claim that apply where you live.</p></section>
          <p className="text-left text-[15px] text-muted-paper">Last updated: 15 November 2026.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

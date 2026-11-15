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
          "How Quietcrew handles personal information for enquiries, accounts, scans, purchases and consultancy.",
      },
      { property: "og:title", content: "Privacy Notice | Quietcrew" },
      {
        property: "og:description",
        content: "How Quietcrew handles personal information for enquiries, accounts, scans, purchases and consultancy.",
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
        <div className="mt-8 space-y-8 text-justify text-[17px] leading-[1.65] text-ink">

          <p>Quietcrew is a UK AI and automation consultancy offering advice, implementation and ready-made tools such as Goldmine and Outshine. QUIETCREW LTD is responsible for the personal information covered by this notice. We are registered in England and Wales under company number 17444773.</p>
          <p>Contact us at <a className="underline" href="mailto:hello@quietcrew.ai">hello@quietcrew.ai</a> or find our registered office on our <a className="underline" href="/company-information">Company Information page</a>.</p>
          <section><h2 className="text-2xl">What information we use and why</h2>
            <p className="mt-3"><strong>Enquiries.</strong> We use your name, contact details and the information you share about your business to reply, discuss what you need and keep a record of the conversation.</p>
            <p className="mt-3"><strong>Accounts and purchases.</strong> We use your account and order details to manage access, confirm payments and help with any issues. Stripe processes card payments. Quietcrew stores order details, payment references and payment status.</p>
            <p className="mt-3"><strong>Scans and reports.</strong> We store information about the scan you requested and the results it produced to show your report, restore access where available and deliver what you bought. Reports can contain public business information from sources such as Google, including names, addresses, websites, ratings and review counts.</p>
            <p className="mt-3"><strong>Keeping the service running.</strong> We use technical information to manage scan allowances and prevent misuse. For Outshine guest scans, this includes hashed identifiers associated with the browser session and network connection.</p>
            <p className="mt-3"><strong>Consultancy and implementation.</strong> If a project needs access to your systems or information, we agree the scope, access and data handling with you before work begins.</p>
          </section>
          <section><h2 className="text-2xl">Why we are allowed to use it</h2><p className="mt-3">We use personal information where necessary to take steps you request before a contract or to perform a contract with you. We rely on legitimate interests where appropriate, including responding to enquiries, supporting business customers and keeping the service secure. We also keep records where the law requires us to do so.</p></section>
          <section><h2 className="text-2xl">Where information is stored and who receives it</h2><p className="mt-3">Quietcrew uses Supabase for account sign-in and to store enquiries, scan records and purchases. Stripe processes payments. If you choose Google sign-in, Google handles that sign-in step. We use hosting and email providers to run the site and respond to customers.</p><p className="mt-3">Goldmine uses Google business information and sends recommendation questions to AI providers to run its checks. Outshine uses public business information to generate its reports.</p></section>
          <section><h2 className="text-2xl">How long we keep information</h2><p className="mt-3">We keep information as needed to provide access, respond to enquiries, resolve order issues, prevent misuse and meet our legal obligations. How long you can access a report is separate from how long we keep the underlying record.</p></section>
          <section><h2 className="text-2xl">Cookies and browser storage</h2><p className="mt-3">The site uses cookies and browser storage to keep you signed in, remember a guest scan and return you to the right page after sign-in. Sign-in and payment providers may also use their own cookies or browser storage when you use those features.</p></section>
          <section><h2 className="text-2xl">Your rights</h2><p className="mt-3">You can ask us for a copy of your information or ask us to correct it. Depending on how we use it, you may also be able to ask us to delete it, restrict its use, transfer it or object to our use of it. Email <a className="underline" href="mailto:hello@quietcrew.ai">hello@quietcrew.ai</a> to make a request. You can also complain to the <a className="underline" href="https://ico.org.uk/make-a-complaint/">Information Commissioner’s Office</a>.</p></section>
          <p className="text-left text-[15px] text-muted-paper">Last updated: 15 November 2026.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

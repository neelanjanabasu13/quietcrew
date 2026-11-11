import type { Business } from "@/lib/outshine/sample";

const STEPS = [
  "Go to chatgpt.com/business and sign in with the email you use for your business.",
  "Search for your business name and choose the listing that matches your Google profile address.",
  "Follow the verification steps ChatGPT shows you. Use the same phone number and website as on your Google profile.",
  "Paste the business description from this Fix Pack, so your details read the same on Google, your website and ChatGPT.",
  "List your services using the same names as on your Google profile, the way customers search for them.",
  "Check your opening hours and service area match Google exactly, then save.",
];

export function ChatgptGuide({ b }: { b: Business }) {
  return (
    <section aria-labelledby="chatgpt-guide" className="rounded-lg border border-border bg-card p-6">
      <h3 id="chatgpt-guide" className="text-2xl font-semibold">Claim and fill in your ChatGPT listing</h3>
      <p className="mt-2 text-muted-foreground">ChatGPT now lets businesses claim how they appear. It is free and takes about ten minutes. Matching details everywhere helps AI tools be confident that {b.name} is one business.</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5">{STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
      <p className="mt-4 text-sm text-muted-foreground">Write down the mention and click numbers Business Hub shows you now, and compare them after your other fixes. Outshine has no connection with OpenAI, and the screens may change while the feature is in beta.</p>
    </section>
  );
}

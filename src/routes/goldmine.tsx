import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { GoldmineResults } from "@/components/GoldmineResults";

const TITLE = "Goldmine by Quietcrew | Local prospect discovery for agencies";
const DESCRIPTION =
  "Goldmine finds local businesses in a London area and category you choose, checks their customer reputation against what Gemini, OpenAI and Claude actually say about them, and prepares the evidence and outreach drafts.";

// Areas are grouped by London region, the same way the engine groups them.
const localityGroups: { region: string; areas: string[] }[] = [
  {
    region: "Central London",
    areas: [
      "Bayswater", "Bloomsbury", "Chelsea", "Clerkenwell", "Covent Garden", "Holborn",
      "Kensington", "Marylebone", "Mayfair", "Notting Hill", "Pimlico", "Soho", "Westminster",
    ],
  },
  {
    region: "North London",
    areas: [
      "Angel", "Archway", "Barnet", "Belsize Park", "Camden Town", "Crouch End", "Finchley",
      "Finsbury Park", "Golders Green", "Hampstead", "Harringay", "Hendon", "Highbury",
      "Highgate", "Holloway", "Hornsey", "Islington", "Kentish Town", "Mill Hill",
      "Muswell Hill", "Palmers Green", "Southgate", "Stoke Newington", "Tottenham",
      "Tufnell Park", "Whetstone", "Winchmore Hill", "Wood Green",
    ],
  },
  {
    region: "East London",
    areas: [
      "Bethnal Green", "Bow", "Canary Wharf", "Chingford", "Clapton", "Dalston", "Hackney",
      "Ilford", "Leyton", "Leytonstone", "Romford", "Shoreditch", "South Woodford", "Stepney",
      "Stratford", "Walthamstow", "Wanstead", "Woodford",
    ],
  },
  {
    region: "South London",
    areas: [
      "Balham", "Battersea", "Beckenham", "Bermondsey", "Blackheath", "Brixton", "Bromley",
      "Camberwell", "Catford", "Clapham", "Croydon", "Crystal Palace", "Dulwich",
      "East Dulwich", "Eltham", "Forest Hill", "Greenwich", "Herne Hill", "Kennington",
      "Lewisham", "New Cross", "Nunhead", "Peckham", "Sidcup", "Stockwell", "Streatham",
      "Sydenham", "Thornton Heath", "Tooting", "Vauxhall", "West Norwood", "Woolwich",
    ],
  },
  {
    region: "West London",
    areas: [
      "Acton", "Barnes", "Brentford", "Chiswick", "Cricklewood", "Ealing", "Fulham",
      "Hammersmith", "Hanwell", "Harrow", "Hounslow", "Kensal Rise", "Kilburn", "Maida Vale",
      "Queens Park", "Richmond", "Ruislip", "Shepherd's Bush", "Stanmore", "Swiss Cottage",
      "Teddington", "Twickenham", "Wembley", "West Hampstead", "Willesden Green",
    ],
  },
  {
    region: "South West London",
    areas: [
      "Colliers Wood", "Earlsfield", "Kingston upon Thames", "Mitcham", "Morden", "Mortlake",
      "Putney", "Raynes Park", "Southfields", "Surbiton", "Sutton", "Wandsworth", "Wimbledon",
    ],
  },
];


// These match the categories the engine currently supports.
const categories = [
  "Restaurants and cafés",
  "Beauty and aesthetics",
  "Dental",
  "Fitness",
  "Legal",
  "Home services",
  "Estate agencies",
  "Hair",
];


const providers = ["Gemini", "OpenAI", "Claude"];

function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "violet" }) {
  return <p className={tone === "light" ? "eyebrow" : "eyebrow-on-violet"}>{children}</p>;
}

export const Route = createFileRoute("/goldmine")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Goldmine,
});

function Goldmine() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero with intake */}
        <section className="on-violet violet-glow relative text-white">
          <div className="container-page pb-16 pt-[120px] md:pb-20 md:pt-[150px]">
            <Reveal className="mx-auto max-w-[780px] text-center">
              <Eyebrow tone="violet">Goldmine by Quietcrew</Eyebrow>
              <h1 className="mt-5 text-[2.6rem] md:text-[4rem]">
                Your next clients are nearby.
                <br />
                <span className="text-peach">AI just does not mention them yet.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-[640px] text-[1.05rem] text-muted-on-violet md:text-[1.15rem]">
                Pick a London locality and a business category. Goldmine discovers the businesses
                there, weighs their customer reputation against what Gemini, OpenAI and Claude
                actually say about them, and prepares the evidence and the first outreach drafts.
                You decide whom to approach.
              </p>
            </Reveal>

            {/* Intake card: selects wired, scan action disabled until the engine is hosted */}
            <Reveal className="mx-auto mt-10 max-w-[720px]" delay={80}>
              <div className="rounded-[24px] bg-white p-6 text-ink soft-shadow-lg md:p-8">
                <p className="text-[15px] text-muted-paper">
                  Choose a London area and a business category. Areas are grouped by part of
                  London, the same way the engine groups them.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="goldmine-locality" className="mono-label text-muted-paper">
                      Locality
                    </label>
                    <select
                      id="goldmine-locality"
                      aria-describedby="goldmine-locality-help"
                      className="mt-2 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-[16px] font-semibold text-ink"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a London area
                      </option>
                      {localityGroups.map((group) => (
                        <optgroup key={group.region} label={group.region}>
                          {group.areas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <p id="goldmine-locality-help" className="mt-2 text-[13px] text-muted-paper">
                      One London area, grouped by central, north, east, south and west.
                    </p>
                  </div>


                  <div>
                    <label htmlFor="goldmine-category" className="mono-label text-muted-paper">
                      Business category
                    </label>
                    <select
                      id="goldmine-category"
                      aria-describedby="goldmine-category-help"
                      className="mt-2 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-[16px] font-semibold text-ink"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a category
                      </option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <p id="goldmine-category-help" className="mt-2 text-[13px] text-muted-paper">
                      One type of business, for example Restaurants and cafés.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[14px] text-muted-paper">
                  There is no box for business names or websites. Finding the businesses is
                  Goldmine&rsquo;s job, so you only choose where to look and what kind of business
                  to look for.
                </p>


                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="pill-btn btn-primary-dark mt-6 w-full cursor-not-allowed px-7 py-4 text-[1rem] opacity-60"
                >
                  Run the scan, £19 introductory price
                </button>
                <p className="mt-3 text-center text-[14px] text-muted-paper">
                  Scans are not live yet. The research engine is being prepared, and this button
                  will start working when it is connected.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Results preview, fixture data only */}
        <section className="bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>Results preview</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                What a finished scan
                <br />
                <span className="text-violet">looks like to read</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[640px] text-muted-paper">
                The screen below is filled with example data so you can see how results arrive and
                how the drafts sit alongside them. No provider is contacted from this page.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <GoldmineResults />
            </Reveal>
          </div>
        </section>

        {/* What a scan shows you */}
        <section className="bg-cream text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>What a scan shows you</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                Reputation on one side.
                <br />
                <span className="text-violet">AI mentions on the other.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[620px] text-muted-paper">
                Some businesses are loved by their customers and invisible to the AI assistants
                people now ask for recommendations. That gap is your opening, and Goldmine
                documents it for you.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Reveal className="rounded-[20px] bg-white p-6 soft-shadow">
                <p className="eyebrow self-start">Example output</p>
                <h3 className="mt-4 text-[1.25rem]">Discovered for you</h3>
                <p className="mt-3 text-[15px] text-muted-paper">
                  You never supply names or websites. Goldmine finds the businesses in your chosen
                  area and category, so your prospect list starts wider than your own knowledge.
                </p>
                <ul className="mt-4 space-y-2 text-[14px] font-semibold text-ink">
                  <li className="rounded-[12px] bg-violet-tint px-3 py-2">Hornsey Lane Dental Practice</li>
                  <li className="rounded-[12px] bg-violet-tint px-3 py-2">Marlow &amp; Grey Physiotherapy</li>
                  <li className="rounded-[12px] bg-violet-tint px-3 py-2">The Fallow Kitchen</li>
                </ul>
              </Reveal>

              <Reveal className="rounded-[20px] bg-white p-6 soft-shadow" delay={60}>
                <p className="eyebrow self-start">Example output</p>
                <h3 className="mt-4 text-[1.25rem]">Reputation versus AI mentions</h3>
                <p className="mt-3 text-[15px] text-muted-paper">
                  Each business is checked for customer reputation and for whether the AI
                  assistants mention it at all, provider by provider.
                </p>
                <div className="mt-4 space-y-2">
                  {providers.map((p, i) => (
                    <div
                      key={p}
                      className="flex items-center justify-between rounded-[12px] bg-violet-tint px-3 py-2 text-[14px] font-semibold"
                    >
                      <span>{p}</span>
                      <span className={i === 0 ? "text-violet" : "text-muted-paper"}>
                        {i === 0 ? "Mentioned once" : "Not mentioned"}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="rounded-[20px] bg-white p-6 soft-shadow" delay={120}>
                <p className="eyebrow self-start">Example output</p>
                <h3 className="mt-4 text-[1.25rem]">Evidence and outreach drafts</h3>
                <p className="mt-3 text-[15px] text-muted-paper">
                  A report for every scan, plus up to three outreach drafts grounded in what the
                  scan found, ready for you to edit and send.
                </p>
                <div className="mt-4 rounded-[12px] bg-violet-tint p-3 text-[13px] font-semibold text-violet">
                  &ldquo;When someone asks an AI assistant for a physiotherapist in Crouch End,
                  your practice is not among the names it gives, despite over two hundred five
                  star reviews.&rdquo;
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white text-ink">
          <div className="container-page section-y">
            <Reveal className="mx-auto max-w-[760px] text-center">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 text-[2rem] md:text-[3.2rem]">
                From a postcode
                <br />
                <span className="text-violet">to a shortlist</span>
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "1",
                  title: "Choose the ground",
                  body: "Select a London locality and a business category. That is all Goldmine asks of you, because discovery is the point of the product.",
                },
                {
                  n: "2",
                  title: "Read the evidence",
                  body: "Goldmine discovers the businesses there, checks customer reputation, and tests what Gemini, OpenAI and Claude say about each one. The report shows who is respected offline and missing online.",
                },
                {
                  n: "3",
                  title: "Decide whom to approach",
                  body: "You review the shortlist and the drafts, and you choose which businesses to contact. Nothing is sent on your behalf.",
                },
              ].map((s, i) => (
                <Reveal key={s.n} className="rounded-[20px] bg-white p-6 soft-shadow" delay={i * 60}>
                  <p className="mono-num inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-tint text-violet">
                    {s.n}
                  </p>
                  <h3 className="mt-4 text-[1.25rem]">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted-paper">{s.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mx-auto mt-12 max-w-[620px] text-center">
              <p className="text-[16px] text-muted-paper">
                The pilot scan costs £19 and tests each business through Gemini, OpenAI and
                Claude. Questions about the product are welcome at{" "}
                <a
                  href="mailto:hello@quietcrew.ai"
                  className="font-semibold text-violet underline underline-offset-4"
                >
                  hello@quietcrew.ai
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

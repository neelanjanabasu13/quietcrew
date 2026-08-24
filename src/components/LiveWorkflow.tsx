/**
 * Motion pieces. All animation is CSS or small timers, no libraries.
 * Everything here respects prefers-reduced-motion via the .motion-safe-only
 * rules in styles.css and the useReducedMotion hook below.
 */

import { useEffect, useState } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Swaps one word of a headline on a slow loop. Static for reduced motion. */
export function RotatingWord({ words, className = "" }: { words: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setShown(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % words.length);
        setShown(true);
      }, 260);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  return (
    <span className={`inline-block ${className}`}>
      <span
        aria-hidden="true"
        className="inline-block transition-all duration-[260ms] ease-out"
        style={shown ? undefined : { opacity: 0, transform: "translateY(0.18em)" }}
      >
        {words[i]}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}

/** Continuous strip of short workflow phrases. Pauses for reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

type Run = {
  tab: string;
  caption: string;
  title: string;
  steps: { step: string; detail: string }[];
  fields: [string, string][];
  summary: string;
  before: string;
};

/** One run per sector, so a visitor can pick the version that looks like their business. */
export const RUNS: Run[] = [
  {
    tab: "Recruitment",
    caption: "Recruitment, CV to ATS",
    title: "New candidate: Hannah Wright, Senior Analyst",
    steps: [
      { step: "CV arrives", detail: "hannah-wright-cv.pdf received" },
      { step: "Details extracted", detail: "6 fields read from the document" },
      { step: "ATS updated", detail: "Record created, no retyping" },
      { step: "Summary written", detail: "One paragraph, plus the source file" },
      { step: "Recruiter notified", detail: "Sent, ready for a human decision" },
    ],
    fields: [
      ["Current role", "Senior Analyst, financial services"],
      ["Notice period", "One month"],
      ["Salary expectation", "£58,000 to £62,000"],
      ["Location", "Manchester, hybrid"],
      ["Right to work", "UK, no sponsorship needed"],
      ["Key skills", "SQL, forecasting, Power BI"],
    ],
    summary:
      "Seven years in analytics, currently leading a small reporting team, looking for a step into management.",
    before: "Before this ran on its own, someone opened the CV, retyped six fields, wrote the summary and forwarded it on.",
  },
  {
    tab: "Property",
    caption: "Property, lease to searchable answer",
    title: "Lease summary: 23 High Street, Harrogate",
    steps: [
      { step: "Lease received", detail: "lease-23-high-street.pdf received" },
      { step: "Key terms extracted", detail: "Dates, rent, breaks and repairs read" },
      { step: "System updated", detail: "Property record filled in" },
      { step: "Made searchable", detail: "Answers cite the clause and page" },
      { step: "Team notified", detail: "Sent, ready for a human decision" },
    ],
    fields: [
      ["Tenant", "Bramley Dental Practice Ltd"],
      ["Term", "10 years from 1 March 2024"],
      ["Rent", "£28,500 a year, quarterly"],
      ["Break clause", "Year 5, six months' notice"],
      ["Repairs", "Tenant internal, landlord structure"],
      ["Next review", "1 March 2029"],
    ],
    summary:
      "Repair liability sits with the tenant internally, with structural costs recovered through the service charge. Clause 4.2, page 11.",
    before: "Before this ran on its own, the lease sat in a folder and somebody read forty pages whenever a question came up.",
  },
  {
    tab: "Professional services",
    caption: "Professional services, enquiry to matter",
    title: "New enquiry: Whitfield Joinery Ltd",
    steps: [
      { step: "Enquiry arrives", detail: "Website form received" },
      { step: "Checks run", detail: "Company and conflict checks completed" },
      { step: "File opened", detail: "Matter created in the practice system" },
      { step: "Engagement letter drafted", detail: "Ready for a partner to approve" },
      { step: "Client emailed", detail: "Sent once a person signs it off" },
    ],
    fields: [
      ["Contact", "Andrew Whitfield, Director"],
      ["Work type", "Commercial contract review"],
      ["Company number", "09 442 118"],
      ["Conflict check", "Clear"],
      ["Fee basis", "Fixed fee, £1,200"],
      ["Owner", "Sarah Bennett"],
    ],
    summary:
      "File opened and the engagement letter drafted. Nothing goes to the client until a partner approves it.",
    before: "Before this ran on its own, someone rekeyed the enquiry, ran the checks by hand and drafted the letter from an older one.",
  },
  {
    tab: "Agency",
    caption: "Agency, client won to project set up",
    title: "Project created: Ashcroft Retail, brand refresh",
    steps: [
      { step: "Client won", detail: "Deal marked closed in the CRM" },
      { step: "Project created", detail: "Board and folders set up" },
      { step: "Tasks generated", detail: "Standard onboarding plan applied" },
      { step: "Team assigned", detail: "Owners and dates filled in" },
      { step: "Kick-off booked", detail: "Invites sent to both sides" },
    ],
    fields: [
      ["Client", "Ashcroft Retail Ltd"],
      ["Budget", "£24,000"],
      ["Start", "Monday 7 September"],
      ["Lead", "James Holloway"],
      ["Tasks created", "18"],
      ["Kick-off", "Thursday, 11:00"],
    ],
    summary:
      "Every new project starts the same way, with the same checklist, without anyone remembering to do it.",
    before: "Before this ran on its own, setup relied on a half-remembered checklist that was done slightly differently every time.",
  },
];

/**
 * Hero product mock. A workflow running in front of you: steps tick through
 * on a loop and the finished artefact fills in on the right. Sector tabs let
 * a visitor jump straight to the version that resembles their own business.
 */
export function LiveWorkflow() {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState(0);
  const run = RUNS[tab]!;

  useEffect(() => {
    if (reduced) {
      setActive(run.steps.length - 1);
      return;
    }
    setActive(0);
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % (run.steps.length + 1));
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduced, tab, run.steps.length]);

  const done = Math.min(active, run.steps.length - 1);
  const complete = active >= run.steps.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose a sector">
        <span className="mr-1 text-[13px] text-muted-on-violet">Show me:</span>
        {RUNS.map((r, i) => (
          <button
            key={r.tab}
            type="button"
            role="tab"
            id={`live-tab-${i}`}
            aria-selected={i === tab}
            aria-controls="live-panel"
            onClick={() => setTab(i)}
            className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              i === tab
                ? "bg-white text-ink"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {r.tab}
          </button>
        ))}
      </div>

      <div
        className="live-panel"
        id="live-panel"
        role="tabpanel"
        aria-labelledby={`live-tab-${tab}`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
          <span className="live-dot" />
          <p className="text-[13px] font-semibold text-white">Workflow running</p>
          <p className="ml-auto text-[12px] text-muted-on-violet">{run.caption}</p>
        </div>

        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <ol className="space-y-1 p-5">
            {run.steps.map((r, i) => {
              const state = i < done ? "done" : i === done ? "active" : "idle";
              return (
                <li key={r.step} className={`live-step live-step-${state}`}>
                  <span className="live-tick" aria-hidden="true">
                    {state === "idle" ? "" : "✓"}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-white">{r.step}</span>
                    <span className="block text-[12.5px] text-muted-on-violet">{r.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="border-t border-white/10 p-5 md:border-l md:border-t-0">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
              After
            </p>

            <div className="rounded-[14px] bg-white p-4 text-left">
              <p className="text-[13px] font-bold text-ink">{run.title}</p>
              <div className="mt-2">
                {run.fields.map(([label, value], i) => (
                  <div
                    key={label}
                    className="live-field flex items-start justify-between gap-4 border-b border-border py-1.5 last:border-b-0"
                    style={{ opacity: complete || i <= done + 1 ? 1 : 0.12 }}
                  >
                    <span className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-muted-paper">
                      {label}
                    </span>
                    <span className="text-right text-[12.5px] text-ink">{value}</span>
                  </div>
                ))}
              </div>
              <p
                className="mt-3 text-[12.5px] text-muted-paper transition-opacity duration-500"
                style={{ opacity: complete ? 1 : 0.15 }}
              >
                {run.summary}
              </p>
            </div>
          </div>
        </div>

        <p className="border-t border-white/10 px-5 py-3 text-[12px] text-muted-on-violet">{run.before}</p>
      </div>
    </div>
  );
}

/**
 * Motion pieces. All animation is CSS or small timers, no libraries.
 * Everything here respects prefers-reduced-motion via the .motion-safe-only
 * rules in styles.css and the useReducedMotion hook below.
 */

import { useEffect, useRef, useState } from "react";

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

const RUN = [
  { step: "CV arrives", detail: "priya-r-cv.pdf received" },
  { step: "Details extracted", detail: "6 fields read from the document" },
  { step: "ATS updated", detail: "Record created, no retyping" },
  { step: "Summary written", detail: "One paragraph, plus the source file" },
  { step: "Recruiter notified", detail: "Sent, ready for a human decision" },
];

const FIELDS: [string, string][] = [
  ["Current role", "Senior Analyst, financial services"],
  ["Notice period", "One month"],
  ["Salary expectation", "£58,000 to £62,000"],
  ["Location", "Manchester, hybrid"],
  ["Right to work", "UK, no sponsorship needed"],
  ["Key skills", "SQL, forecasting, Power BI"],
];

/**
 * Hero product mock. A workflow running in front of you: steps tick through
 * on a loop and the finished artefact fills in on the right.
 */
export function LiveWorkflow() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(reduced ? RUN.length - 1 : 0);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setActive(RUN.length - 1);
      return;
    }
    started.current = true;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % (RUN.length + 1));
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduced]);

  const done = Math.min(active, RUN.length - 1);
  const complete = active >= RUN.length - 1;

  return (
    <div className="live-panel" role="img" aria-label="Example of a Quietcrew workflow running: a CV arrives, details are extracted, the ATS is updated, a summary is written and the recruiter is notified.">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="live-dot" />
        <p className="text-[13px] font-semibold text-white">Workflow running</p>
        <p className="ml-auto text-[12px] text-muted-on-violet">Recruitment, CV to ATS</p>
      </div>

      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <ol className="space-y-1 p-5">
          {RUN.map((r, i) => {
            const state = i < done ? "done" : i === done ? "active" : "idle";
            return (
              <li key={r.step} className={`live-step live-step-${state}`}>
                <span className="live-tick">{state === "idle" ? "" : "✓"}</span>
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
            Example output
          </p>
          <div className="rounded-[14px] bg-white p-4 text-left">
            <p className="text-[13px] font-bold text-ink">New candidate: Priya R, Senior Analyst</p>
            <div className="mt-2">
              {FIELDS.map(([label, value], i) => (
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
              Seven years in analytics, currently leading a small reporting team, looking for a step
              into management.
            </p>
          </div>
        </div>
      </div>

      <p className="border-t border-white/10 px-5 py-3 text-[12px] text-muted-on-violet">
        Before: someone opens the CV, retypes six fields, writes the summary and forwards it on.
      </p>
    </div>
  );
}

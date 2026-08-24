/**
 * Animated before and after comparison for the workflow examples section.
 * Two lanes run on one shared timeline: the manual lane crawls, one hand-off
 * at a time, while the automated lane completes the same job in a few
 * seconds and pauses on the step that waits for a person. All motion is a
 * single timer plus CSS transitions, and it holds still for reduced motion.
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

export type RaceProps = {
  /** The manual version of the job, described as the person doing it. */
  manual: string[];
  /** The automated version, same job, in order. */
  steps: string[];
  /** Which automated step waits for a person to approve it. */
  approvalIndex: number;
  /** Minutes of attention each manual hand-off costs. */
  minutesPerManualStep: number;
};

const TICK_MS = 620;

export function WorkflowRace({
  manual,
  steps,
  approvalIndex,
  minutesPerManualStep,
}: RaceProps) {
  const reduced = useReducedMotion();
  const total = manual.length * 3 + 5;
  const [t, setT] = useState(0);

  useEffect(() => {
    if (reduced) {
      setT(total);
      return;
    }
    setT(0);
    const id = window.setInterval(() => {
      setT((v) => (v + 1 > total ? 0 : v + 1));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, total, manual.length, steps.length]);

  const manualDone = Math.min(Math.floor(t / 3), manual.length);
  const autoDone = Math.min(t, steps.length);
  const manualMinutes = manualDone * minutesPerManualStep;
  const autoSeconds = Math.min(autoDone * 9, steps.length * 9);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Lane
        tone="before"
        heading="Before"
        subtitle="A person moves it along"
        items={manual}
        done={manualDone}
        meterValue={`${manualMinutes}`}
        meterUnit="min"
        meterNote="of someone's day"
        angle={(manualMinutes / Math.max(manual.length * minutesPerManualStep, 1)) * 360}
        pending="waiting on a person"
      />
      <Lane
        tone="after"
        heading="After"
        subtitle="The workflow moves it along"
        items={steps}
        done={autoDone}
        approvalIndex={approvalIndex}
        meterValue={`${autoSeconds}`}
        meterUnit="sec"
        meterNote="no retyping"
        angle={(autoSeconds / Math.max(steps.length * 9, 1)) * 360}
        pending="running"
      />
    </div>
  );
}

function TimerDial({
  value,
  unit,
  note,
  angle,
  after,
}: {
  value: string;
  unit: string;
  note: string;
  angle: number;
  after: boolean;
}) {
  return (
    <div
      className={`mt-4 flex items-center gap-3 rounded-[14px] px-4 py-3 ${
        after ? "bg-peach/15" : "bg-white/[0.06]"
      }`}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center">
        <svg viewBox="0 0 44 44" className="h-11 w-11" aria-hidden="true">
          <circle
            cx="22"
            cy="22"
            r="17"
            fill="none"
            strokeWidth="2"
            className={after ? "stroke-peach/35" : "stroke-white/25"}
          />
          <line
            x1="22"
            y1="9"
            x2="22"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
            className={after ? "stroke-peach" : "stroke-white/60"}
          />
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "22px 22px",
              transition: "transform 500ms ease-out",
            }}
          >
            <line
              x1="22"
              y1="22"
              x2="22"
              y2="11"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={after ? "stroke-peach" : "stroke-white/70"}
            />
          </g>
          <circle cx="22" cy="22" r="2" className={after ? "fill-peach" : "fill-white/70"} />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="flex items-baseline gap-1">
          <span
            className={`text-[1.5rem] font-extrabold tabular-nums tracking-[-0.02em] ${
              after ? "text-peach" : "text-white"
            }`}
          >
            {value}
          </span>
          <span
            className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${
              after ? "text-peach" : "text-muted-on-violet"
            }`}
          >
            {unit}
          </span>
        </span>
        <span className="text-[12.5px] text-muted-on-violet">{note}</span>
      </span>
    </div>
  );
}


function Lane({
  tone,
  heading,
  subtitle,
  items,
  done,
  approvalIndex,
  meterValue,
  meterUnit,
  meterNote,
  angle,
  pending,
}: {
  tone: "before" | "after";
  heading: string;
  subtitle: string;
  items: string[];
  done: number;
  approvalIndex?: number;
  meterValue: string;
  meterUnit: string;
  meterNote: string;
  angle: number;
  pending: string;
}) {
  const after = tone === "after";
  const progress = Math.round((done / items.length) * 100);

  return (
    <div className={`rounded-[14px] p-5 ${after ? "bg-white/[0.12]" : "bg-white/[0.05]"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
            after ? "bg-peach text-ink" : "bg-white/15 text-white"
          }`}
        >
          {heading}
        </span>
        <span className="text-[12.5px] text-muted-on-violet">{subtitle}</span>
      </div>

      <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            after ? "bg-peach" : "bg-white/40"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-4 space-y-2" aria-hidden="true">
        {items.map((item, i) => {
          const complete = i < done;
          const current = i === done;
          const waits = after && i === approvalIndex;
          return (
            <li
              key={item}
              className="flex items-start gap-3 transition-opacity duration-500"
              style={{ opacity: complete ? 1 : current ? 0.9 : 0.28 }}
            >
              <span
                className={`mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                  complete
                    ? after
                      ? "bg-peach text-ink"
                      : "bg-white/70 text-ink"
                    : current
                      ? "border border-white/50 text-white"
                      : "border border-white/20 text-transparent"
                } ${current ? "animate-pulse" : ""}`}
              >
                {complete ? "✓" : current ? "•" : ""}
              </span>
              <span className="text-[13.5px] leading-[1.5] text-white">
                {item}
                {current && (
                  <span className="ml-2 text-[11.5px] uppercase tracking-[0.1em] text-muted-on-violet">
                    {pending}
                  </span>
                )}
                {waits && (
                  <span className="ml-2 rounded-full bg-white/15 px-2 py-[2px] text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white">
                    person approves
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <p
        className={`mt-4 text-[12.5px] font-semibold ${after ? "text-peach" : "text-muted-on-violet"}`}
      >
        {meter}
      </p>

      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

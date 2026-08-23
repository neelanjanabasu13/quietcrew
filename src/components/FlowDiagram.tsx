/**
 * Hero flow diagram only. Soft rounded nodes, violet and peach,
 * drawn on the deep violet hero background. Inline SVG, no libraries.
 */

const PEACH = "var(--peach)";
const WHITE = "#ffffff";
const SOFT = "rgba(255,255,255,0.55)";

const FONT = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';

function Dot({ path, dur = "9s" }: { path: string; dur?: string }) {
  return (
    <circle r="5" fill={PEACH} className="flow-dot">
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
  );
}

export function HeroFlow() {
  const label =
    "Diagram: your systems feed into Quietcrew, which connects, automates and adds practical AI, so the work happens on its own.";

  return (
    <div role="img" aria-label={label}>
      {/* Horizontal on desktop */}
      <svg viewBox="0 0 1000 190" className="hidden w-full md:block" focusable="false" aria-hidden="true">
        <line x1="300" y1="95" x2="360" y2="95" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="640" y1="95" x2="700" y2="95" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" />
        <Dot path="M300 95 H700" />

        <g>
          <rect x="30" y="50" width="270" height="90" rx="20" fill="rgba(255,255,255,0.08)" />
          <text x="165" y="88" textAnchor="middle" fill={WHITE} fontFamily={FONT} fontSize="17" fontWeight="700">
            Your systems
          </text>
          <text x="165" y="112" textAnchor="middle" fill="var(--muted-on-violet)" fontFamily={FONT} fontSize="13">
            CRM, finance, spreadsheets
          </text>
        </g>

        <g>
          <rect x="360" y="38" width="280" height="114" rx="22" fill={PEACH} />
          <text x="500" y="88" textAnchor="middle" fill="var(--ink)" fontFamily={FONT} fontSize="19" fontWeight="800">
            Quietcrew
          </text>
          <text x="500" y="114" textAnchor="middle" fill="var(--ink)" fontFamily={FONT} fontSize="13">
            Connect, automate, practical AI
          </text>
        </g>

        <g>
          <rect x="700" y="50" width="270" height="90" rx="20" fill="rgba(255,255,255,0.08)" />
          <text x="835" y="88" textAnchor="middle" fill={WHITE} fontFamily={FONT} fontSize="17" fontWeight="700">
            Work happens
          </text>
          <text x="835" y="112" textAnchor="middle" fill="var(--muted-on-violet)" fontFamily={FONT} fontSize="13">
            on its own
          </text>
        </g>
      </svg>

      {/* Stacked on mobile */}
      <svg
        viewBox="0 0 320 420"
        className="mx-auto block w-full max-w-[320px] md:hidden"
        focusable="false"
        aria-hidden="true"
      >
        <line x1="160" y1="100" x2="160" y2="140" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="160" y1="270" x2="160" y2="310" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" />
        <Dot path="M160 100 V310" />

        <g>
          <rect x="8" y="10" width="304" height="90" rx="20" fill="rgba(255,255,255,0.08)" />
          <text x="160" y="50" textAnchor="middle" fill={WHITE} fontFamily={FONT} fontSize="16" fontWeight="700">
            Your systems
          </text>
          <text x="160" y="74" textAnchor="middle" fill="var(--muted-on-violet)" fontFamily={FONT} fontSize="12">
            CRM, finance, spreadsheets
          </text>
        </g>

        <g>
          <rect x="8" y="140" width="304" height="130" rx="22" fill={PEACH} />
          <text x="160" y="198" textAnchor="middle" fill="var(--ink)" fontFamily={FONT} fontSize="18" fontWeight="800">
            Quietcrew
          </text>
          <text x="160" y="224" textAnchor="middle" fill="var(--ink)" fontFamily={FONT} fontSize="12">
            Connect, automate, practical AI
          </text>
        </g>

        <g>
          <rect x="8" y="310" width="304" height="90" rx="20" fill="rgba(255,255,255,0.08)" />
          <text x="160" y="350" textAnchor="middle" fill={WHITE} fontFamily={FONT} fontSize="16" fontWeight="700">
            Work happens
          </text>
          <text x="160" y="374" textAnchor="middle" fill="var(--muted-on-violet)" fontFamily={FONT} fontSize="12">
            on its own
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Soft step sequence used inside the workflow examples. Rounded pills of text, no hard edges. */
export function StepSequence({ steps, approvalIndex }: { steps: string[]; approvalIndex?: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={
              "inline-flex flex-col items-start rounded-[999px] px-4 py-2 text-[14px] font-semibold " +
              (approvalIndex === i
                ? "bg-peach text-ink"
                : "bg-white/10 text-white")
            }
          >
            {step}
          </span>
          {approvalIndex === i && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
              Human approval
            </span>
          )}
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="text-muted-on-violet">
              &rarr;
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

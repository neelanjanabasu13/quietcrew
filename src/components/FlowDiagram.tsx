/**
 * Inline SVG flow diagrams. No libraries, no images.
 * One ambient motion only: a dot travelling along the hero connector.
 */

const INK = "var(--ink)";
const ACCENT = "var(--accent)";
const LINE = "var(--line)";
const MUTED = "var(--muted)";
const SURFACE = "var(--surface)";

function Dot({ path, dur = "7s" }: { path: string; dur?: string }) {
  return (
    <circle r="4.5" fill={ACCENT} className="flow-dot">
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
  );
}

export function HeroFlow() {
  return (
    <div aria-hidden="false" role="img" aria-label="Diagram: your systems connect to Quietcrew, which connects, automates and adds practical AI, so the work happens on its own.">
      {/* Horizontal on desktop */}
      <svg
        viewBox="0 0 960 190"
        className="hidden w-full md:block"
        focusable="false"
        aria-hidden="true"
      >
        <line x1="270" y1="95" x2="360" y2="95" stroke={LINE} strokeWidth="1.5" />
        <line x1="600" y1="95" x2="690" y2="95" stroke={LINE} strokeWidth="1.5" />
        <Dot path="M270 95 H690" />
        <g>
          <rect x="20" y="50" width="250" height="90" rx="8" fill={SURFACE} stroke={LINE} />
          <text x="145" y="90" textAnchor="middle" fill={INK} fontSize="18" fontWeight="600">
            Your systems
          </text>
          <text x="145" y="114" textAnchor="middle" fill={MUTED} fontSize="14">
            CRM, finance, spreadsheets
          </text>
        </g>
        <g>
          <rect x="360" y="42" width="240" height="106" rx="8" fill="var(--accent-soft)" stroke={ACCENT} />
          <text x="480" y="84" textAnchor="middle" fill={ACCENT} fontSize="19" fontWeight="700">
            Quietcrew
          </text>
          <text x="480" y="110" textAnchor="middle" fill={ACCENT} fontSize="14">
            connect, automate,
          </text>
          <text x="480" y="128" textAnchor="middle" fill={ACCENT} fontSize="14">
            practical AI
          </text>
        </g>
        <g>
          <rect x="690" y="50" width="250" height="90" rx="8" fill={SURFACE} stroke={LINE} />
          <text x="815" y="90" textAnchor="middle" fill={INK} fontSize="18" fontWeight="600">
            Work happens
          </text>
          <text x="815" y="114" textAnchor="middle" fill={MUTED} fontSize="14">
            on its own
          </text>
        </g>
      </svg>

      {/* Stacked on mobile */}
      <svg
        viewBox="0 0 320 430"
        className="mx-auto block w-full max-w-[320px] md:hidden"
        focusable="false"
        aria-hidden="true"
      >
        <line x1="160" y1="100" x2="160" y2="150" stroke={LINE} strokeWidth="1.5" />
        <line x1="160" y1="280" x2="160" y2="330" stroke={LINE} strokeWidth="1.5" />
        <Dot path="M160 100 V330" />
        <g>
          <rect x="10" y="10" width="300" height="90" rx="8" fill={SURFACE} stroke={LINE} />
          <text x="160" y="50" textAnchor="middle" fill={INK} fontSize="18" fontWeight="600">
            Your systems
          </text>
          <text x="160" y="74" textAnchor="middle" fill={MUTED} fontSize="14">
            CRM, finance, spreadsheets
          </text>
        </g>
        <g>
          <rect x="10" y="150" width="300" height="130" rx="8" fill="var(--accent-soft)" stroke={ACCENT} />
          <text x="160" y="196" textAnchor="middle" fill={ACCENT} fontSize="19" fontWeight="700">
            Quietcrew
          </text>
          <text x="160" y="224" textAnchor="middle" fill={ACCENT} fontSize="14">
            connect, automate,
          </text>
          <text x="160" y="244" textAnchor="middle" fill={ACCENT} fontSize="14">
            practical AI
          </text>
        </g>
        <g>
          <rect x="10" y="330" width="300" height="90" rx="8" fill={SURFACE} stroke={LINE} />
          <text x="160" y="370" textAnchor="middle" fill={INK} fontSize="18" fontWeight="600">
            Work happens
          </text>
          <text x="160" y="394" textAnchor="middle" fill={MUTED} fontSize="14">
            on its own
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Small horizontal step diagram, same visual language as the hero. */
export function StepFlow({ steps, label }: { steps: string[]; label: string }) {
  const boxW = 168;
  const gap = 34;
  const height = 84;
  const width = steps.length * boxW + (steps.length - 1) * gap;

  return (
    <div className="-mx-1 overflow-x-auto px-1 py-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={label}
        className="h-auto max-w-none md:w-full"
        style={{ minWidth: width * 0.62 }}
      >
        {steps.map((step, i) => {
          const x = i * (boxW + gap);
          const mid = height / 2;
          return (
            <g key={step}>
              {i > 0 && (
                <line
                  x1={x - gap}
                  y1={mid}
                  x2={x}
                  y2={mid}
                  stroke={LINE}
                  strokeWidth="1.5"
                />
              )}
              {i > 0 && <circle cx={x - gap / 2} cy={mid} r="2.5" fill={ACCENT} />}
              <rect
                x={x}
                y={mid - 27}
                width={boxW}
                height="54"
                rx="7"
                fill={SURFACE}
                stroke={LINE}
              />
              <foreignObject x={x} y={mid - 27} width={boxW} height="54">
                <div
                  // eslint-disable-next-line react/no-unknown-property
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  className="flex h-full w-full items-center justify-center px-3 text-center text-[13px] leading-tight text-ink"
                >
                  {step}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

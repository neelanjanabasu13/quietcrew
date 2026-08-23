/**
 * Technical schematics. Inline SVG only, no libraries, no images.
 * Squares and rectangles, 1px strokes, square terminals instead of arrowheads,
 * mono annotations in the style of an engineering drawing.
 * One ambient motion only: a solid yellow dot travelling slowly left to right.
 */

const INK = "var(--ink)";
const PAPER = "var(--paper)";
const HIVIS = "var(--hivis)";
const MUTED_INK = "var(--muted-ink)";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

function Terminal({ x, y, stroke }: { x: number; y: number; stroke: string }) {
  return <rect x={x - 3} y={y - 3} width="6" height="6" fill={stroke} />;
}

function Dot({ path, dur = "9s" }: { path: string; dur?: string }) {
  return (
    <rect x="-4" y="-4" width="8" height="8" fill={HIVIS} className="flow-dot">
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </rect>
  );
}

/** Hero schematic. Ink section: yellow strokes, white mono labels. */
export function HeroFlow() {
  const label =
    "Schematic: your systems feed into Quietcrew, which connects, automates and adds practical AI, so the work happens on its own.";

  return (
    <div role="img" aria-label={label}>
      {/* Horizontal on desktop */}
      <svg viewBox="0 0 1000 220" className="hidden w-full md:block" focusable="false" aria-hidden="true">
        {/* registration marks */}
        <path d="M0 8 V0 H8" stroke={HIVIS} strokeWidth="1" fill="none" />
        <path d="M1000 8 V0 H992" stroke={HIVIS} strokeWidth="1" fill="none" />
        <path d="M0 212 V220 H8" stroke={HIVIS} strokeWidth="1" fill="none" />
        <path d="M1000 212 V220 H992" stroke={HIVIS} strokeWidth="1" fill="none" />

        <line x1="290" y1="110" x2="370" y2="110" stroke={HIVIS} strokeWidth="1" />
        <line x1="630" y1="110" x2="710" y2="110" stroke={HIVIS} strokeWidth="1" />
        <Terminal x={290} y={110} stroke={HIVIS} />
        <Terminal x={370} y={110} stroke={HIVIS} />
        <Terminal x={630} y={110} stroke={HIVIS} />
        <Terminal x={710} y={110} stroke={HIVIS} />
        <Dot path="M290 110 H710" />

        <g>
          <rect x="30" y="62" width="260" height="96" fill="none" stroke={HIVIS} strokeWidth="1" />
          <text x="42" y="54" fill={MUTED_INK} fontFamily={MONO} fontSize="11" letterSpacing="1.1">
            01 / INPUT
          </text>
          <text x="160" y="105" textAnchor="middle" fill={PAPER} fontFamily={MONO} fontSize="15" letterSpacing="1.2">
            YOUR SYSTEMS
          </text>
          <text x="160" y="130" textAnchor="middle" fill={MUTED_INK} fontFamily={MONO} fontSize="11" letterSpacing="1">
            CRM / FINANCE / SPREADSHEETS
          </text>
        </g>

        <g>
          <rect x="370" y="48" width="260" height="124" fill={HIVIS} stroke={HIVIS} strokeWidth="1" />
          <text x="382" y="40" fill={MUTED_INK} fontFamily={MONO} fontSize="11" letterSpacing="1.1">
            02 / QUIETCREW
          </text>
          <text x="500" y="100" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="17" letterSpacing="1.6">
            QUIETCREW
          </text>
          <text x="500" y="126" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="11" letterSpacing="1">
            CONNECT / AUTOMATE
          </text>
          <text x="500" y="144" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="11" letterSpacing="1">
            PRACTICAL AI
          </text>
        </g>

        <g>
          <rect x="710" y="62" width="260" height="96" fill="none" stroke={HIVIS} strokeWidth="1" />
          <text x="722" y="54" fill={MUTED_INK} fontFamily={MONO} fontSize="11" letterSpacing="1.1">
            03 / OUTPUT
          </text>
          <text x="840" y="105" textAnchor="middle" fill={PAPER} fontFamily={MONO} fontSize="15" letterSpacing="1.2">
            WORK HAPPENS
          </text>
          <text x="840" y="130" textAnchor="middle" fill={MUTED_INK} fontFamily={MONO} fontSize="11" letterSpacing="1">
            ON ITS OWN
          </text>
        </g>

        <text x="30" y="204" fill={MUTED_INK} fontFamily={MONO} fontSize="10" letterSpacing="1.2">
          QC-000 / BACKGROUND PROCESS / SCALE 1:1
        </text>
      </svg>

      {/* Stacked on mobile */}
      <svg viewBox="0 0 320 470" className="mx-auto block w-full max-w-[320px] md:hidden" focusable="false" aria-hidden="true">
        <line x1="160" y1="110" x2="160" y2="160" stroke={HIVIS} strokeWidth="1" />
        <line x1="160" y1="300" x2="160" y2="350" stroke={HIVIS} strokeWidth="1" />
        <Terminal x={160} y={110} stroke={HIVIS} />
        <Terminal x={160} y={160} stroke={HIVIS} />
        <Terminal x={160} y={300} stroke={HIVIS} />
        <Terminal x={160} y={350} stroke={HIVIS} />
        <Dot path="M160 110 V350" />

        <g>
          <rect x="8" y="20" width="304" height="90" fill="none" stroke={HIVIS} strokeWidth="1" />
          <text x="8" y="14" fill={MUTED_INK} fontFamily={MONO} fontSize="10" letterSpacing="1">
            01 / INPUT
          </text>
          <text x="160" y="60" textAnchor="middle" fill={PAPER} fontFamily={MONO} fontSize="14" letterSpacing="1.2">
            YOUR SYSTEMS
          </text>
          <text x="160" y="84" textAnchor="middle" fill={MUTED_INK} fontFamily={MONO} fontSize="10" letterSpacing="1">
            CRM / FINANCE / SPREADSHEETS
          </text>
        </g>

        <g>
          <rect x="8" y="160" width="304" height="140" fill={HIVIS} stroke={HIVIS} strokeWidth="1" />
          <text x="160" y="216" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="16" letterSpacing="1.6">
            QUIETCREW
          </text>
          <text x="160" y="242" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="10" letterSpacing="1">
            CONNECT / AUTOMATE
          </text>
          <text x="160" y="260" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="10" letterSpacing="1">
            PRACTICAL AI
          </text>
        </g>

        <g>
          <rect x="8" y="350" width="304" height="90" fill="none" stroke={HIVIS} strokeWidth="1" />
          <text x="160" y="390" textAnchor="middle" fill={PAPER} fontFamily={MONO} fontSize="14" letterSpacing="1.2">
            WORK HAPPENS
          </text>
          <text x="160" y="414" textAnchor="middle" fill={MUTED_INK} fontFamily={MONO} fontSize="10" letterSpacing="1">
            ON ITS OWN
          </text>
        </g>

        <text x="8" y="462" fill={MUTED_INK} fontFamily={MONO} fontSize="9" letterSpacing="1.2">
          QC-000 / BACKGROUND PROCESS
        </text>
      </svg>
    </div>
  );
}

/**
 * Step schematic for the workflow examples. Rendered on ink by default.
 * `annotate` marks one step index with a HUMAN APPROVAL tag.
 * `ref` is the small drawing reference printed under the schematic.
 */
export function StepFlow({
  steps,
  label,
  annotate,
  reference,
  variant = "ink",
}: {
  steps: string[];
  label: string;
  annotate?: { index: number; text: string };
  reference?: string;
  variant?: "ink" | "paper";
}) {
  const boxW = 176;
  const gap = 44;
  const top = 34;
  const boxH = 62;
  const height = 148;
  const width = steps.length * boxW + (steps.length - 1) * gap;
  const mid = top + boxH / 2;

  const stroke = variant === "ink" ? HIVIS : INK;
  const textColour = variant === "ink" ? PAPER : INK;
  const noteColour = variant === "ink" ? MUTED_INK : "var(--muted-paper)";
  const activeFill = HIVIS;
  const activeText = INK;

  return (
    <div className="-mx-1 overflow-x-auto px-1 py-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={label}
        className="h-auto max-w-none md:w-full"
        style={{ minWidth: width * 0.66 }}
      >
        {steps.map((step, i) => {
          const x = i * (boxW + gap);
          const isActive = annotate?.index === i;
          return (
            <g key={step}>
              {i > 0 && (
                <>
                  <line x1={x - gap} y1={mid} x2={x} y2={mid} stroke={stroke} strokeWidth="1" />
                  <Terminal x={x - gap} y={mid} stroke={stroke} />
                  <Terminal x={x} y={mid} stroke={stroke} />
                </>
              )}
              <rect
                x={x}
                y={top}
                width={boxW}
                height={boxH}
                fill={isActive ? activeFill : "none"}
                stroke={isActive ? activeFill : stroke}
                strokeWidth="1"
              />
              <text
                x={x + 2}
                y={top - 12}
                fill={noteColour}
                fontFamily={MONO}
                fontSize="10"
                letterSpacing="1.1"
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <foreignObject x={x} y={top} width={boxW} height={boxH}>
                <div
                  // eslint-disable-next-line react/no-unknown-property
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  style={{
                    fontFamily: MONO,
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.35,
                    color: isActive ? activeText : textColour,
                  }}
                  className="flex h-full w-full items-center justify-center px-3 text-center"
                >
                  {step}
                </div>
              </foreignObject>
              {isActive && (
                <>
                  <line x1={x + boxW / 2} y1={top + boxH} x2={x + boxW / 2} y2={top + boxH + 20} stroke={stroke} strokeWidth="1" />
                  <text
                    x={x + boxW / 2}
                    y={top + boxH + 34}
                    textAnchor="middle"
                    fill={stroke}
                    fontFamily={MONO}
                    fontSize="10"
                    letterSpacing="1.2"
                  >
                    {annotate.text}
                  </text>
                </>
              )}
            </g>
          );
        })}
        {reference && (
          <text x="0" y={height - 4} fill={noteColour} fontFamily={MONO} fontSize="9" letterSpacing="1.2">
            {reference}
          </text>
        )}
      </svg>
    </div>
  );
}

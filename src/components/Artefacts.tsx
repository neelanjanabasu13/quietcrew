/**
 * Mocked output artefacts. Illustrative examples of what a deliverable looks like,
 * built in HTML and CSS only. Every tile carries an EXAMPLE OUTPUT corner label.
 */

import type { ReactNode } from "react";

export function ArtefactTile({
  children,
  tone = "violet",
  className = "",
}: {
  children: ReactNode;
  tone?: "violet" | "peach";
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] p-4 sm:p-5 ${
        tone === "violet" ? "tile-violet" : "tile-peach"
      } ${className}`}
    >
      <p
        className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${
          tone === "violet" ? "text-white/70" : "text-muted-paper"
        }`}
      >
        Example output
      </p>
      {children}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-[14px] bg-white p-4 text-left soft-shadow">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-1.5 last:border-b-0">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-paper">{label}</span>
      <span className="text-right text-[13px] text-ink">{value}</span>
    </div>
  );
}

export function CandidateSummary() {
  return (
    <Card>
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet text-[12px] font-bold text-white">
          Q
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-ink">Quietcrew</p>
          <p className="truncate text-[13px] text-muted-paper">New candidate: Hannah Wright, Senior Analyst</p>
        </div>
      </div>
      <div className="mt-3">
        <Row label="Current role" value="Senior Analyst, financial services" />
        <Row label="Notice period" value="One month" />
        <Row label="Salary expectation" value="£58,000 to £62,000" />
        <Row label="Location" value="Manchester, hybrid" />
        <Row label="Right to work" value="UK, no sponsorship needed" />
        <Row label="Key skills" value="SQL, forecasting, Power BI" />
      </div>
      <p className="mt-3 text-[13px] leading-[1.5] text-ink">
        Seven years in analytics, currently leading a small reporting team, looking for a step into
        management.
      </p>
      <p className="mt-3 text-[13px] font-semibold text-violet underline underline-offset-4">
        candidate-summary.pdf
      </p>
    </Card>
  );
}

export function AccountBrief() {
  const chips = ["Companies House", "Website", "LinkedIn"];
  return (
    <Card>
      <p className="text-[13px] font-bold text-ink">Brief: Northgate Property Ltd, call at 10:00</p>
      <ul className="mt-3 space-y-2">
        {[
          "Manages around 400 rented units across the north west.",
          "Recent signal: posted two property manager roles this month.",
          "Suggested opening: ask how tenancy paperwork is handled as they grow.",
        ].map((line) => (
          <li key={line} className="flex gap-2 text-[13px] leading-[1.5] text-ink">
            <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full bg-violet-tint px-3 py-1 text-[11px] font-semibold text-violet"
          >
            {c}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function LeaseAnswer() {
  return (
    <Card>
      <p className="text-[13px] font-semibold text-muted-paper">
        What does the lease for 23 High Street say about repairs?
      </p>
      <p className="mt-3 text-[13px] leading-[1.55] text-ink">
        The tenant is responsible for keeping the interior in good repair, including all fixtures and
        internal decoration. The landlord retains responsibility for the structure, roof and external
        walls, with costs recovered through the service charge.
      </p>
      <p className="mt-3 rounded-[10px] bg-violet-tint px-3 py-2 text-[12px] font-semibold text-violet">
        Source: Lease, 23 High Street, clause 4.2, page 11
      </p>
    </Card>
  );
}

export function WeeklyReport() {
  const bars = [
    { label: "Mon", v: 38 },
    { label: "Tue", v: 54 },
    { label: "Wed", v: 46 },
    { label: "Thu", v: 72 },
    { label: "Fri", v: 61 },
  ];
  return (
    <Card>
      <p className="text-[13px] font-bold text-ink">Weekly pipeline summary</p>
      <svg viewBox="0 0 260 90" className="mt-3 w-full" role="img" aria-label="Illustrative bar chart of weekly activity">
        {bars.map((b, i) => {
          const h = (b.v / 80) * 64;
          const x = 10 + i * 50;
          return (
            <g key={b.label}>
              <rect x={x} y={72 - h} width="28" height={h} rx="6" fill="var(--violet)" opacity={0.85} />
              <text
                x={x + 14}
                y="86"
                textAnchor="middle"
                fontSize="9"
                fill="var(--muted-paper)"
                fontFamily='"Plus Jakarta Sans", sans-serif'
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2">
        <Row label="New enquiries" value="34" />
        <Row label="Briefs prepared" value="27" />
        <Row label="Hours of admin removed" value="19" />
      </div>
    </Card>
  );
}

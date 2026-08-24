/**
 * Sector tabs for the workflow examples section. A visitor picks the sector
 * that looks like their business instead of reading all four in order.
 */

import { useState, type ReactNode } from "react";
import { StepSequence } from "@/components/FlowDiagram";
import { ArtefactTile } from "@/components/Artefacts";

export type WorkflowExample = {
  title: string;
  label: string;
  steps: string[];
  before: string;
  approvalIndex: number;
  artefact: ReactNode;
};

export function ExampleTabs({ examples }: { examples: WorkflowExample[] }) {
  const [i, setI] = useState(0);
  const ex = examples[i]!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Workflow examples by sector"
        className="flex flex-wrap justify-center gap-2"
      >
        {examples.map((e, idx) => (
          <button
            key={e.title}
            type="button"
            role="tab"
            id={`example-tab-${idx}`}
            aria-selected={idx === i}
            aria-controls="example-panel"
            onClick={() => setI(idx)}
            className={`rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-colors ${
              idx === i ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div
        id="example-panel"
        role="tabpanel"
        aria-labelledby={`example-tab-${i}`}
        className="mt-10 rounded-[20px] bg-white/[0.07] p-6 md:p-9"
      >
        <h3 className="text-[1.6rem] md:text-[2rem]">{ex.title}</h3>

        <div className="mt-6 grid items-start gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="rounded-[14px] bg-white/[0.06] p-5">
              <Ribbon tone="before">Before</Ribbon>
              <p className="mt-3 max-w-[520px] text-[15px] leading-[1.6] text-muted-on-violet">
                {ex.before}
              </p>
            </div>

            <div className="mt-4 rounded-[14px] bg-white/[0.06] p-5">
              <Ribbon tone="after">After</Ribbon>
              <div className="mt-4">
                <StepSequence steps={ex.steps} approvalIndex={ex.approvalIndex} />
              </div>
            </div>
          </div>
          <ArtefactTile tone="violet" className="bg-white/10">
            <Ribbon tone="after">After: what you receive</Ribbon>
            <div className="mt-4">{ex.artefact}</div>
          </ArtefactTile>
        </div>
      </div>

    </div>
  );
}

function Ribbon({ tone, children }: { tone: "before" | "after"; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        tone === "before" ? "bg-white/15 text-white" : "bg-peach text-ink"
      }`}
    >
      {children}
    </span>
  );
}


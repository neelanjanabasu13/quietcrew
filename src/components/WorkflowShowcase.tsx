/**
 * Interactive card grid of workflows. Each card is a button; the selected
 * card plays the animated before and after race underneath. Products carry
 * their price, custom workflows say "Price on request", and the one-time
 * Workflow Audit has a fixed price.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { WorkflowRace } from "@/components/WorkflowRace";
import { LivePanel, PRODUCT_RUNS } from "@/components/LiveWorkflow";

type Item = {
  key: string;
  kind: "Product" | "Custom workflow";
  title: string;
  who: string;
  price: string;
  before: string;
  manual: string[];
  steps: string[];
  approvalIndex: number;
  minutesPerManualStep: number;
  href?: "/goldmine" | "/outshine";
};

const items: Item[] = [
  {
    key: "goldmine",
    kind: "Product",
    title: "Goldmine",
    who: "For marketing and SEO agencies",
    price: "£49 per scan",
    before:
      "Before: someone on the team searches Maps street by street, checks each business in ChatGPT by hand and writes every cold email from scratch.",
    manual: [
      "Search Maps for one category",
      "Copy names into a spreadsheet",
      "Ask each AI assistant about them",
      "Note who gets recommended",
      "Write an outreach email for each",
    ],
    steps: [
      "Pick a locality and category",
      "Find well-reviewed local businesses",
      "Check AI assistant visibility",
      "Rank the strongest prospects",
      "Draft outreach for you to send",
    ],
    approvalIndex: 4,
    minutesPerManualStep: 25,
    href: "/goldmine",
  },
  {
    key: "outshine",
    kind: "Product",
    title: "Outshine",
    who: "For trades and local services",
    price: "Free scan, fix list £9.99",
    before:
      "Before: an owner guesses why the plumber down the road gets the calls, scrolls through rivals on Google and never finds the time to compare properly.",
    manual: [
      "Look up your own Google listing",
      "Search for nearby rivals",
      "Compare ratings and photos",
      "Check hours and website links",
      "Guess what to fix first",
    ],
    steps: [
      "Search your business name",
      "Pull your listing and rivals",
      "Grade every visible signal",
      "Show what needs attention",
      "Hand you the fix list to approve",
    ],
    approvalIndex: 4,
    minutesPerManualStep: 15,
    href: "/outshine",
  },
  {
    key: "reporting",
    kind: "Custom workflow",
    title: "Monthly client reports",
    who: "Agencies",
    price: "Price on request",
    before:
      "Before: an account manager exports figures from four dashboards, pastes them into slides and rewrites the same summary every month.",
    manual: [
      "Export Analytics and ads data",
      "Paste figures into a template",
      "Rebuild the charts",
      "Write the monthly summary",
      "Email it to the client",
    ],
    steps: [
      "Pull figures on the first of the month",
      "Fill the report template",
      "Draft the summary paragraph",
      "Account manager approves it",
      "Send it to the client",
    ],
    approvalIndex: 3,
    minutesPerManualStep: 20,
  },
  {
    key: "quotes",
    kind: "Custom workflow",
    title: "Quote follow-ups",
    who: "Trades and services",
    price: "Price on request",
    before:
      "Before: quotes go out from the van, nobody remembers which ones were chased and work quietly goes to whoever rang back first.",
    manual: [
      "Find the quote in your sent items",
      "Check whether they replied",
      "Write a chase message",
      "Update the job sheet",
      "Remember to try again next week",
    ],
    steps: [
      "Spot quotes with no reply",
      "Draft a friendly chase",
      "You approve it with one tap",
      "Send it and log the date",
      "Flag anyone ready to book",
    ],
    approvalIndex: 2,
    minutesPerManualStep: 10,
  },
];

export function WorkflowShowcase() {
  const [active, setActive] = useState(items[0]!.key);
  const ex = items.find((i) => i.key === active)!;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((it) => {
          const on = it.key === active;
          return (
            <button
              key={it.key}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(it.key)}
              className={`flex flex-col rounded-[20px] p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach ${
                on
                  ? "-translate-y-1 bg-white text-ink soft-shadow"
                  : "bg-white/[0.08] text-white hover:bg-white/[0.14]"
              }`}
            >
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  on ? "text-violet" : "text-peach"
                }`}
              >
                {it.kind}
              </span>
              <span className="mt-2 text-[1.2rem] font-extrabold leading-tight">{it.title}</span>
              <span className={`mt-1 text-[14px] ${on ? "text-muted-paper" : "text-muted-on-violet"}`}>
                {it.who}
              </span>
              <span className={`mt-auto pt-4 text-[14px] font-semibold ${on ? "text-violet" : "text-white"}`}>
                {it.price}
              </span>
            </button>
          );
        })}

        <div className="flex flex-col rounded-[20px] bg-gradient-to-b from-white to-violet-tint p-5 text-ink ring-1 ring-white/50 soft-shadow-lg sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet">
            One-time
          </span>
          <span className="mt-2 text-[1.2rem] font-extrabold leading-tight text-ink">Workflow Audit</span>
          <span className="mt-1 text-[14px] text-muted-paper">
            One process mapped in detail, with the hours it costs and a fixed quote to fix it.
          </span>
          <span className="mt-auto pt-4 text-[1.1rem] font-extrabold text-violet-deep">£99</span>
          <a
            href="#book"
            className="pill-btn mt-3 bg-violet-deep px-4 py-2.5 text-[14px] text-paper transition-colors hover:bg-violet"
          >
            Ask for an audit
          </a>
        </div>
      </div>

      {ex.href ? (
        <div className="mt-8">
          {(() => {
            const k = active === "outshine" ? "outshine" : "goldmine";
            return (
              <div key={k} className="mx-auto flex max-w-[720px] flex-col gap-3">
                <LivePanel run={PRODUCT_RUNS[k]} highlighted />
                <Link
                  to={k === "goldmine" ? "/goldmine" : "/outshine"}
                  className="pill-btn btn-white self-start px-6 py-3 text-[15px]"
                >
                  {k === "goldmine" ? "See Goldmine" : "See Outshine"}
                </Link>
              </div>
            );
          })()}
          <p className="mx-auto mt-4 max-w-[720px] text-[12.5px] text-muted-on-violet">
            This runs the same steps as the live product. The business and figures shown are made-up examples.
          </p>
        </div>
      ) : (
      <div key={ex.key} className="mt-8 rounded-[20px] bg-white/[0.07] p-6 md:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-[1.6rem] md:text-[2rem]">{ex.title}</h3>
              <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-muted-on-violet">{ex.before}</p>
            </div>
            {ex.href ? (
              <Link to={ex.href} className="pill-btn btn-white px-6 py-3 text-[15px]">
                Try {ex.title}
              </Link>
            ) : (
              <a href="#book" className="pill-btn btn-white px-6 py-3 text-[15px]">
                Ask about this
              </a>
            )}
          </div>
          <div className="mt-6">
            <WorkflowRace
              manual={ex.manual}
              steps={ex.steps}
              approvalIndex={ex.approvalIndex}
              minutesPerManualStep={ex.minutesPerManualStep}
            />
          </div>
          <p className="mt-4 text-[12.5px] text-muted-on-violet">
            Timings are illustrative examples, not measured results.
          </p>
        </div>
      )}
    </div>
  );
}

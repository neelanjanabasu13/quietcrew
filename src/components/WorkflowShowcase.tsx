/**
 * Product picker for the homepage. Two cards (Goldmine and Outshine); the
 * selected card plays its live product simulation underneath.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LivePanel, PRODUCT_RUNS } from "@/components/LiveWorkflow";

type Item = {
  key: "goldmine" | "outshine";
  title: string;
  who: string;
  price: string;
};

const items: Item[] = [
  { key: "goldmine", title: "Goldmine", who: "For marketing and SEO agencies", price: "£49 per scan" },
  { key: "outshine", title: "Outshine", who: "For trades and local services", price: "Free scan, Fix Pack £9.99" },
];

export function WorkflowShowcase() {
  const [active, setActive] = useState<Item["key"]>("goldmine");

  return (
    <div>
      <div className="mx-auto grid max-w-[720px] gap-4 sm:grid-cols-2">
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
                Ready-made tool
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
      </div>

      <div className="mt-8">
        <div key={active} className="mx-auto flex max-w-[720px] flex-col gap-3">
          <LivePanel run={PRODUCT_RUNS[active]} highlighted />
          <Link
            to={active === "goldmine" ? "/goldmine" : "/outshine"}
            className="pill-btn btn-white self-start px-6 py-3 text-[15px]"
          >
            {active === "goldmine" ? "See Goldmine" : "See Outshine"}
          </Link>
        </div>
        <p className="mx-auto mt-4 max-w-[720px] text-[12.5px] text-muted-on-violet">
          This runs the same steps as the live product. The business and figures shown are made-up examples.
        </p>
      </div>
    </div>
  );
}

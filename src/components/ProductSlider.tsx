import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  key: "goldmine" | "outshine";
  chapter: string;
  mark: string;
  eyebrow: string;
  name: string;
  line: string;
  body: string;
  price: string;
  cta: string;
  to: "/goldmine" | "/outshine";
  tilt: string;
  artefact: { title: string; rows: [string, string][]; foot: string };
};

const products: Product[] = [
  {
    key: "goldmine",
    chapter: "If you are the agency",
    mark: "◆",
    eyebrow: "For marketing and SEO agencies",
    name: "Goldmine",
    line: "Find the gold before your rivals do.",
    body: "Pick a London area and a category, and Goldmine finds well reviewed businesses that AI assistants rarely recommend, then drafts your first outreach to each one.",
    price: "£49 per scan",
    cta: "See Goldmine",
    to: "/goldmine",
    tilt: "md:-rotate-[2deg] md:hover:rotate-0",
    artefact: {
      title: "Prospect: a Camden bakery",
      rows: [["Google rating", "4.8"], ["Named by assistants", "0 of 3"], ["Gold score", "86"]],
      foot: "Outreach draft ready to copy",
    },
  },
  {
    key: "outshine",
    chapter: "If you are the business",
    mark: "✦",
    eyebrow: "For UK trades and local services",
    name: "Outshine",
    line: "Then make sure you are the one that shines.",
    body: "A free check of your public business profile against nearby rivals in your trade, with a practical report you can act on yourself, no agency needed.",
    price: "Free scan, fix list £9.99",
    cta: "Scan your business free",
    to: "/outshine",
    tilt: "md:rotate-[2deg] md:hover:rotate-0",
    artefact: {
      title: "Report: a Leeds plumber",
      rows: [["Reputation", "B"], ["Photos", "D"], ["Website", "F"]],
      foot: "Fix Pack: a one-page website",
    },
  },
];

export function ProductSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const el = ref.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement)?.offsetWidth || 1;
    setActive(Math.min(products.length - 1, Math.round(el.scrollLeft / w)));
  };

  return (
    <div className="mt-14" aria-roledescription="carousel" aria-label="Quietcrew products">
      <div className="mx-auto max-w-[720px] text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted-on-violet">
          Two products, one local search
        </p>
        <h2 className="mt-3 text-[1.7rem] text-white md:text-[2.4rem]">
          Every local business is either found or overlooked.{" "}
          <span className="text-peach">One tool digs, the other polishes.</span>
        </h2>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        className="product-slider -mx-1 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-6 pt-4 md:gap-10 md:overflow-visible"
      >
        {products.map((p, i) => (
          <article
            key={p.key}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${products.length}: ${p.name}`}
            className={`brand-${p.key} relative flex w-[86%] shrink-0 snap-start flex-col rounded-[28px] p-6 shadow-[0_40px_80px_-40px_var(--ink)] transition-transform duration-500 md:w-[calc(50%-20px)] md:p-8 ${p.tilt}`}
          >
            <p className="brand-accent text-[13px] font-semibold uppercase tracking-[0.14em]">
              Chapter {i + 1} · {p.chapter}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="brand-pill rounded-full px-3 py-1 text-[13px] font-semibold">{p.eyebrow}</span>
              <span aria-hidden className="brand-accent text-[1.8rem] leading-none">{p.mark}</span>
            </div>
            <h3 className="mt-5 text-[2rem] md:text-[2.4rem]">
              {p.name} <span className="brand-accent">by Quietcrew</span>
            </h3>
            <p className="mt-2 text-[1.1rem] font-semibold text-ink">{p.line}</p>
            <p className="mt-3 text-[16px] text-ink/80">{p.body}</p>

            <div className="relative mt-6 rounded-[20px] bg-white/85 p-5 shadow-[0_20px_40px_-28px_var(--ink)]">
              <span className="absolute right-3 top-3 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink/60">
                EXAMPLE OUTPUT
              </span>
              <p className="pr-24 font-semibold text-ink">{p.artefact.title}</p>
              <ul className="mt-3 divide-y divide-ink/10">
                {p.artefact.rows.map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between py-2 text-[14px] text-ink">
                    <span>{k}</span>
                    <span className="brand-accent font-extrabold">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-dashed border-ink/15 pt-2 text-[13px] font-semibold text-ink/60">
                Next step <span aria-hidden>→</span> {p.artefact.foot}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="brand-accent text-[15px] font-semibold">{p.price}</p>
              <Link to={p.to} className="pill-btn brand-btn px-6 py-3.5 text-[0.95rem]">
                {p.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
        <button type="button" aria-label="Previous product" onClick={() => go(Math.max(0, active - 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {products.map((p, i) => (
          <button key={p.key} type="button" aria-label={`Show ${p.name}`} aria-current={active === i}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-white" : "w-2.5 bg-white/40"}`} />
        ))}
        <button type="button" aria-label="Next product" onClick={() => go(Math.min(products.length - 1, active + 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

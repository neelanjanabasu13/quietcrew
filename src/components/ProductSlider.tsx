import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    key: "goldmine",
    mark: "◆",
    eyebrow: "For marketing and SEO agencies",
    name: "Goldmine",
    body: "Pick a London area and a business category, and Goldmine finds the local businesses there, checks what Gemini, OpenAI and Claude say about them, and drafts your first outreach to the ones worth approaching.",
    price: "£49 per scan",
    cta: "See Goldmine",
    to: "/goldmine" as const,
  },
  {
    key: "outshine",
    mark: "✦",
    eyebrow: "For UK trades and local services",
    name: "Outshine",
    body: "A free check of your public business profile against nearby businesses in your trade, with a practical report you can act on yourself.",
    price: "Free scan, fix list £9.99",
    cta: "Scan your business free",
    to: "/outshine" as const,
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
    <div className="mt-10" aria-roledescription="carousel" aria-label="Quietcrew products">
      <div
        ref={ref}
        onScroll={onScroll}
        className="product-slider -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2"
      >
        {products.map((p, i) => (
          <article
            key={p.key}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${products.length}: ${p.name}`}
            className={`brand-${p.key} flex w-[86%] shrink-0 snap-start flex-col rounded-[24px] p-6 soft-shadow-lg md:w-[calc(50%-10px)] md:p-8`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="brand-pill rounded-full px-3 py-1 text-[13px] font-semibold">{p.eyebrow}</span>
              <span aria-hidden className="brand-accent text-[1.6rem] leading-none">{p.mark}</span>
            </div>
            <h2 className="mt-5 text-[1.8rem] md:text-[2.2rem]">
              {p.name} <span className="brand-accent">by Quietcrew</span>
            </h2>
            <p className="mt-3 text-[16px] text-ink/80">{p.body}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="brand-accent text-[15px] font-semibold">{p.price}</p>
              <Link to={p.to} className="pill-btn brand-btn px-6 py-3.5 text-[0.95rem]">
                {p.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
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

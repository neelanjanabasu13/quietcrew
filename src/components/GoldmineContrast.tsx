import { PROVIDERS, type ScanBusiness } from "@/lib/goldmine/types";

/**
 * The two halves that make a Goldmine prospect legible at a glance: what
 * customers think on one side, whether the assistants name the business on the
 * other. Failed or pending checks are never counted as misses.
 */
export function aiVisibility(b: ScanBusiness) {
  const answered = PROVIDERS.filter((p) => b.providers[p].status === "complete");
  const named = answered.filter((p) => {
    const c = b.providers[p];
    return c.status === "complete" && c.mentions > 0;
  });
  const pending = PROVIDERS.filter((p) => b.providers[p].status === "pending").length;
  return { answered: answered.length, named: named.length, pending };
}

export function GoldmineContrast({ business, size = "md" }: { business: ScanBusiness; size?: "md" | "lg" }) {
  const { answered, named, pending } = aiVisibility(business);
  const big = size === "lg" ? "text-[3rem] md:text-[3.6rem]" : "text-[2.2rem]";
  const pad = size === "lg" ? "p-6 md:p-7" : "p-4";

  return (
    <div className="grid overflow-hidden rounded-[18px] sm:grid-cols-2">
      <div className={`bg-cream ${pad}`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-paper">
          What customers think
        </p>
        <p className={`mt-1 font-extrabold leading-none text-ink ${big}`}>
          {business.reputation.rating.toFixed(1)}
          <span aria-hidden="true" className="ml-1 align-top text-[0.5em] text-violet">★</span>
        </p>
        <p className="mt-2 text-[13px] text-muted-paper">
          from {business.reputation.reviews.toLocaleString("en-GB")} Google reviews
        </p>
      </div>
      <div className={`bg-violet-deep ${pad}`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-on-violet">
          Named by AI assistants
        </p>
        <p className={`mt-1 font-extrabold leading-none text-peach ${big}`}>
          {answered === 0 ? "…" : `${named} of ${answered}`}
        </p>
        <p className="mt-2 text-[13px] text-muted-on-violet">
          {answered === 0
            ? "The assistant checks are still running."
            : pending > 0
              ? `${pending} more ${pending === 1 ? "check is" : "checks are"} still running, so this may change.`
              : answered < PROVIDERS.length
                ? "Only counting assistants that answered, failed checks are left out."
                : "Assistants asked the questions a customer would ask."}
        </p>
      </div>
    </div>
  );
}

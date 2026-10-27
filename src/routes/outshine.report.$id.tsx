import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { gradeColor, Header } from "@/components/outshine/Brand";
import { assessedAreaScores, cappedGrade, evaluate, gradeOf, PRICE_BUNDLE, PRICE_DIY, WAS_BUNDLE, WAS_DIY, projectFindings, scoreOf, topProblems, TRADES, type Area, type Finding } from "@/lib/outshine/audit";
import { GOOGLE_PROFILE_URL, reviewLink } from "@/lib/outshine/agent";
import { downloadReviewFlyer } from "@/lib/outshine/review-flyer";
import type { Sop } from "@/lib/outshine/diy";
import { readDiyPurchase, type PaidPack } from "@/lib/outshine/payments.functions";
import { DiyCheckout } from "@/components/outshine/DiyCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { SCREEN_NOTE, TOOLS_DISCLAIMER, type UiScreen } from "@/lib/outshine/sop-visuals";

function ScreenDiagram({ s }: { s: UiScreen }) {
  return <figure className="overflow-hidden rounded-lg border border-border bg-background">
    <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /><span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
      <span className="ml-2 truncate rounded bg-background px-2 py-0.5 text-[11px] text-muted-foreground">{s.url}</span>
    </div>
    <div className="space-y-2 p-3">
      <p className="text-xs font-semibold">{s.title}</p>
      {s.rows.map((r) => <div key={r.text} className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-xs ${r.kind === "button" ? "border border-border" : r.kind === "field" ? "border border-dashed border-border bg-secondary" : "text-muted-foreground"} ${r.mark ? "ring-2 ring-fix" : ""}`}>
        {r.mark && <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-fix text-[10px] font-bold text-fix-foreground">{r.mark}</span>}
        <span className="truncate">{r.text}</span>
      </div>)}
    </div>
    <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{s.caption}</figcaption>
  </figure>;
}
import { getBusiness } from "@/lib/outshine/places.functions";
import { photoOf, TRADE_PHOTOS, type Business } from "@/lib/outshine/sample";

export const Route = createFileRoute("/outshine/report/$id")({
  loader: async ({ params }) => {
    const b = await getBusiness({ data: { id: params.id } });
    if (!b) throw notFound();
    return { b };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.b.name} report · Outshine by Quietcrew` : "Report · Outshine by Quietcrew" },
      { name: "description", content: loaderData ? `Online presence report for ${loaderData.b.name}, a ${TRADES[loaderData.b.trade].label.toLowerCase()} business in ${loaderData.b.area}, with an evidence-based letter grade and a comparison against nearby rivals.` : "An evidence-based online presence report with a letter grade and nearby rivals." },
      { property: "og:title", content: loaderData ? `${loaderData.b.name} online presence report · Outshine` : "Outshine report" },
      { property: "og:description", content: loaderData ? `See how ${loaderData.b.name} in ${loaderData.b.area} grades against local ${TRADES[loaderData.b.trade].label.toLowerCase()} rivals, and where it can stand out online.` : "See how this business grades against local rivals." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Report,
});

function Report() {
  const { b: loadedBusiness } = Route.useLoaderData();
  const [pack, setPack] = useState<PaidPack | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const readPurchase = useServerFn(readDiyPurchase);
  const b = pack?.business ?? loadedBusiness;
  const diy = pack !== null;
  const showcase = false;
  const findings = evaluate(b.trade, b.signals, b.name, b.live);
  const score = scoreOf(findings);
  const grade = cappedGrade(findings);
  const areas = assessedAreaScores(findings);
  const areaList: Area[] = b.live ? ["Reputation", "Visuals", "Profile", "Credentials"] : ["Reputation", "Response", "Visuals", "Profile", "Credentials"];
  const reference = b.reference;
  const referenceBusiness = reference?.business;
  const referenceFindings = referenceBusiness ? evaluate(b.trade, referenceBusiness.signals, referenceBusiness.name, true) : [];
  const benchmark = referenceBusiness ? assessedAreaScores(referenceFindings) : null;
  const comps = b.competitors.map((c) => {
    const f = evaluate(b.trade, c.signals, c.name, b.live);
    return { ...c, score: scoreOf(f), grade: cappedGrade(f), areas: assessedAreaScores(f) };
  }).sort((a, c) => c.score - a.score);
  // The seeded showcase lists every problem so judges see the website build and Gmail actions too.
  const problems = topProblems(b.live ? findings.filter((f) => f.id !== "replies") : findings, b.seeded ? 8 : 5);
  const [selected, setSelected] = useState<string[]>([]);
  const projected = projectFindings(findings, selected);
  const projectedScore = scoreOf(projected);
  const projectedGrade = cappedGrade(projected);
  const allClear = problems.length === 0;
  const projectedAreas = assessedAreaScores(projected);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) { setPack(null); return; }
      try {
        const result = await readPurchase({ data: { businessId: loadedBusiness.id, environment: getStripeEnvironment() } });
        if (!active) return;
        if ("error" in result) { setPaymentMessage(result.error); return; }
        setPack(result.pack);
        const params = new URLSearchParams(window.location.search);
        if (result.pack) { setCheckoutOpen(false); setPaymentMessage("Your payment is confirmed and your detailed DIY pack is ready."); }
        else if (params.get("buy") === "diy") setCheckoutOpen(true);
        else if (params.has("session_id")) setPaymentMessage("Your payment is not confirmed yet. Refresh this report shortly; the pack stays locked until payment is confirmed.");
      } catch (e) { if (active) setPaymentMessage(e instanceof Error ? e.message : "Could not check your purchase."); }
    };
    void refresh();
    const { data } = supabase.auth.onAuthStateChange(event => { if (event === "SIGNED_IN" || event === "SIGNED_OUT") void refresh(); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [loadedBusiness.id, readPurchase]);

  const [pdfBusy, setPdfBusy] = useState(false);
  const downloadDIY = async () => {
    if (!pack) return;
    setPdfBusy(true);
    try {
      const { buildReportPdf } = await import("@/lib/outshine/report-pdf");
      const blob = await buildReportPdf({
        name: b.name, address: b.address, tradeLabel: TRADES[b.trade].label, trade: b.trade, grade,
        areas: areaList.filter((a) => areas[a] !== undefined).map((a) => ({ area: a, grade: gradeOf(areas[a] ?? 0) })),
        rivals: comps.map((c) => ({ name: c.name, grade: c.grade })),
        findings: problems, sops: problems.flatMap((f) => pack.sops[f.id] ? [pack.sops[f.id]] : []),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${b.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-outshine-pack.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } finally { setPdfBusy(false); }
  };

  const downloadReport = async () => {
    const { buildFreeReportPdf } = await import("@/lib/outshine/report-pdf");
    const blob = await buildFreeReportPdf({
      name: b.name, address: b.address, tradeLabel: TRADES[b.trade].label, grade,
      areas: areaList.filter((a) => areas[a] !== undefined).map((a) => ({ area: a, grade: gradeOf(areas[a] ?? 0) })),
      rivals: comps.map((c) => ({ name: c.name, grade: c.grade })),
      findings: problems.map((f) => ({ title: f.title, evidence: f.evidence, impact: f.impact })),
      tips: problems.length ? [] : extraTips(b.trade),
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${b.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-outshine-free-report.pdf`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <PaymentTestModeBanner />
      <Header />
      <DiyCheckout businessId={b.id} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      <main className="mx-auto max-w-6xl px-6 pb-40">
        <Button asChild variant="link" className="h-auto px-0 py-2"><Link to="/outshine"><ArrowLeft />Try another business</Link></Button>
        <section className="animate-rise pt-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{TRADES[b.trade].label} · {b.area}</p>
          {b.address && <p className="mt-1 text-sm text-muted-foreground">{b.address}{b.phone ? ` · ${b.phone}` : ""}</p>}
          <h1 className="mt-2 break-words text-4xl font-semibold md:text-6xl">{b.name}<span className="mt-2 block text-lg font-medium text-muted-foreground md:text-2xl">Online presence report and local rival comparison</span></h1>
          <div className="mt-8 grid items-center gap-8 border-y border-border py-8 sm:grid-cols-[auto_1fr]">
            <Gauge score={score} grade={grade} />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Your overall grade</p>
              <h2 className="mt-3 text-3xl font-semibold">{allClear ? "Nothing to fix in the public profile we can see." : grade === "A" ? "A strong profile, with room to stay ahead." : "A clearer path to a stronger profile."}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">Your grade is {grade}, based on {b.live ? "customer rating, review volume, how recent the newest review is, photos you upload yourself, website, opening hours and the credentials named on your own website" : "reputation, response, visuals, profile and credentials"}, weighted for {TRADES[b.trade].label.toLowerCase()}.</p>
              {b.live && <p className="mt-3 max-w-xl text-xs text-muted-foreground">Public-profile grade, not a rating of service quality or a Google ranking. Every point comes from Google or your own website. Owner replies to reviews are not graded because Google does not publish them. We only show areas we can actually grade from this evidence.</p>}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {areaList.filter((area) => areas[area] !== undefined).map((area) => { const value = areas[area]; return <div key={area} className="border-b border-border pb-4"><p className="text-sm text-muted-foreground">{area}</p>{value === undefined ? <p className="mt-2 text-sm text-muted-foreground">Not assessed</p> : <p className={`mt-2 font-display text-4xl font-semibold ${gradeColor(gradeOf(value))}`}>{gradeOf(value)}</p>}</div>; })}
          </div>
        </section>

        {allClear ? <section className="mt-12 border-y border-border py-8"><p className="flex items-center gap-2 text-grade-a"><Check className="h-5 w-5" />All clear</p><h2 className="mt-2 text-2xl font-semibold">Every public signal we can check already meets the standard</h2><p className="mt-2 max-w-2xl text-muted-foreground">There is nothing for a DIY pack to fix, so we will not ask you to pay for anything. There is always room to grow, though, and these habits are what keep the strongest {TRADES[b.trade].label.toLowerCase()} businesses ahead in areas Google does not show us.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">{extraTips(b.trade).map((t) => <li key={t.title} className="border-l-2 border-fix pl-4"><p className="font-medium">{t.title}</p><p className="mt-1 text-sm text-muted-foreground">{t.body}</p></li>)}</ul>
          {reference?.entry && <div className="mt-6 rounded-lg border border-border bg-card p-5"><p className="text-xs text-muted-foreground">A strong {reference.entry.city} profile we keep for comparison</p><p className="mt-1 text-lg font-semibold">{reference.entry.name}</p><p className="mt-1 text-sm text-muted-foreground">A real local business we picked as a reference. It is worth looking at how they present their services, photos and replies to reviews.</p><Button asChild variant="link" className="h-auto px-0"><a href={reference.entry.website} target="_blank" rel="noopener noreferrer">See their profile<ArrowUpRight /></a></Button></div>}</section> : <section className="mt-12 border-y border-border py-8" id="pricing">
          <h2 className="text-2xl font-semibold">From your free audit to practical fixes</h2>
          <p className="mt-2 text-muted-foreground">Your audit and report stay free. The £7.99 detailed DIY pack adds the instructions and wording for the findings in this report, with no subscription.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="font-medium">Free scan</p><p className="font-display text-3xl font-semibold">Free</p>
              <p className="flex-1 text-sm text-muted-foreground">Your grade, nearby rivals and where you can stand out.</p>
              <p className="flex items-center gap-2 text-sm text-grade-a"><Check className="h-4 w-4" />Your report is ready</p>
              <Button onClick={downloadReport} className="h-auto min-h-10 w-full whitespace-normal py-3"><Download />Download free report</Button>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium">Detailed DIY pack</p><p className="font-display text-3xl font-semibold">£{PRICE_DIY.toFixed(2)}</p>
              <p className="flex-1 text-sm text-muted-foreground">Detailed guides for your findings, ready-to-paste wording, annotated steps and a PDF to keep. Review-request guides include a QR review card where a review link is available. You review and apply the changes yourself.</p>
              {diy ? <Button onClick={downloadDIY} disabled={pdfBusy} className="h-auto min-h-10 w-full whitespace-normal py-3"><Download />{pdfBusy ? "Preparing PDF..." : "Download full PDF report"}</Button> : <PayButton b={b} item="diy" label="DIY pack" onBuy={() => setCheckoutOpen(true)}>Get my DIY pack · £{PRICE_DIY.toFixed(2)}</PayButton>}
            </div>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">One-off payment, no subscription.</p>
          {paymentMessage && <p role="status" className="mt-3 text-sm">{paymentMessage}</p>}
        </section>}

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">You, your nearby rivals, and a real reference</h2>
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2">
            {[{ name: b.name, score, grade, category: "You", photo: photoOf(b) }, ...comps.map((c) => ({ name: c.name, score: c.score, grade: c.grade, category: "Nearby rival", photo: c.photo ?? TRADE_PHOTOS[b.trade] })), ...(referenceBusiness ? [{ name: referenceBusiness.name, score: scoreOf(referenceFindings), grade: cappedGrade(referenceFindings), category: `${reference?.entry?.city} reference`, photo: photoOf(referenceBusiness) }] : [])].map((c) => {
              const g = c.grade;
              return <div key={c.name} className={`w-56 shrink-0 snap-start overflow-hidden rounded-lg border bg-card ${c.category === "You" ? "border-ink" : "border-border"}`}>
                <img src={c.photo} alt="" loading="lazy" width={400} height={200} className="h-32 w-full object-cover" />
                <div className="p-4"><p className="text-xs text-muted-foreground">{c.category}</p><div className="mt-2 flex items-start justify-between gap-3"><p className="break-words font-medium leading-tight">{c.name}</p><p className={`shrink-0 font-display text-4xl font-bold ${gradeColor(g)}`}>{g}</p></div></div>
              </div>;
            })}
          </div>
          {reference?.entry && !referenceBusiness && <article className="mt-4 rounded-lg border border-border bg-card p-5"><p className="text-xs text-muted-foreground">{reference.entry.city} · Real reference business</p><h3 className="mt-2 text-xl font-semibold">{reference.entry.name}</h3><p className="mt-2 text-sm text-muted-foreground">Grade not verified</p><Button asChild variant="link" className="h-auto px-0"><a href={reference.entry.source} target="_blank" rel="noopener noreferrer">View selection source<ArrowUpRight /></a></Button></article>}
          {reference?.entry && <div className="mt-4 border-l-2 border-border pl-4"><p className="font-medium">{reference.entry.name} · {reference.entry.city} reference</p><p className="mt-1 text-sm text-muted-foreground">Selected once as a real {TRADES[b.trade].label.toLowerCase()} example, not an official city ranking. {referenceBusiness ? "Its grade uses the same public evidence as yours." : "Its public-profile grade has not been verified, so no A grade or best-in-class claim is made."}</p><Button asChild variant="link" className="h-auto px-0"><a href={reference.entry.website} target="_blank" rel="noopener noreferrer">Visit this business<ArrowUpRight /></a></Button>{referenceBusiness && <Button asChild variant="link"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(referenceBusiness.name)}&query_place_id=${encodeURIComponent(referenceBusiness.id.split(".").slice(2).join("."))}`} target="_blank" rel="noopener noreferrer">View on Google Maps<ArrowUpRight /></a></Button>}</div>}
          <p className="mt-3 text-xs text-muted-foreground">{b.live ? "Business information from Google Maps. " : "Nearby profiles are demo data. "}{reference?.checkedAt ? `Reference evidence retrieved ${new Date(reference.checkedAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}. ` : ""}{!reference && "No curated reference is available for this location yet; no fictional business is substituted."}</p>
        </section>

        {benchmark && <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <Radar you={selected.length ? projectedAreas : areas} them={benchmark} />
          <div>
            <h2 className="text-2xl font-semibold">How you compare with {referenceBusiness?.name}</h2>
            <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-3 text-sm">
              <span /><span className="text-muted-foreground">You</span><span className="text-muted-foreground">Reference</span>
              {(Object.keys(areas) as Area[]).filter((a) => areas[a] !== undefined && benchmark[a] !== undefined).map((a) => { const you = areas[a]; const target = benchmark[a]; return <div key={a} className="contents"><span>{a}</span><span className="font-semibold">{you === undefined ? "Not assessed" : gradeOf(you)}</span><span className="font-semibold">{target === undefined ? "Not assessed" : gradeOf(target)}</span></div>; })}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">These grades compare public profiles, not workmanship or credentials. Unavailable fields are excluded for both businesses.</p>
          </div>
        </section>}

        {!allClear && <section className="mt-16 border-y border-border py-8">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-semibold">See what could change</h2>
              <p className="mt-3 text-sm text-muted-foreground">Projected grade if each selected improvement meets its benchmark, not a live update or a promise of more customers.</p>
              <div className="mt-6 space-y-4">
                {findings.filter((f) => f.score < 1 && (!b.live || f.id !== "replies")).map((f) => <label key={f.id} className="flex cursor-pointer items-start gap-3 text-sm"><Checkbox aria-label={f.title} checked={selected.includes(f.id)} onCheckedChange={(checked) => setSelected((ids) => checked === true ? [...ids, f.id] : ids.filter((id) => id !== f.id))} /><span>{f.after}</span></label>)}
              </div>
              <Button variant="ghost" className="mt-4" disabled={!selected.length} onClick={() => setSelected([])}><RotateCcw />Reset improvements</Button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-3 text-sm text-muted-foreground">Projected overall grade</p>
              <Gauge score={projectedScore} grade={projectedGrade} />
              <p role="status" className="mt-3 text-sm">{selected.length ? `${grade} → ${projectedGrade}` : `Current grade: ${grade}`}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">{(Object.keys(projectedAreas) as Area[]).map((a) => { const value = projectedAreas[a]; return value === undefined ? null : <span key={a}>{a} <b className={gradeColor(gradeOf(value))}>{gradeOf(value)}</b></span>; })}</div>
            </div>
          </div>
        </section>}

                {!allClear && <section className="mt-16">
          <h2 className="text-3xl font-semibold md:text-4xl">{`The ${problems.length} things costing you the most`}</h2>
          <div className="mt-8 space-y-6">{problems.map((f, i) => <ProblemCard key={f.id} f={f} n={i + 1} b={b} autoRun={false} />)}</div>
        </section>}

        {!allClear && <section className="mt-16 border-t border-border pt-12" id="diy">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl">How to fix it yourself, step by step</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{"A standard operating procedure for every finding above: exactly where to click, what to type, word-for-word scripts, and the links you need. Written for someone who has never done this before."}</p>
            </div>
          </div>
          {diy ? (
            <>
            <div className="sticky top-2 z-30 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fix bg-card p-4 shadow-lg">
              <p className="text-sm"><span className="font-semibold">Your DIY pack is unlocked.</span> <span className="text-muted-foreground">Download the full report and every guide as one searchable PDF with clickable contents.</span></p>
              <Button onClick={downloadDIY} disabled={pdfBusy}><Download />{pdfBusy ? "Preparing PDF..." : "Download full PDF report"}</Button>
            </div>
            <div className="mt-8 space-y-10">{problems.map((f, i) => <div key={f.id} className="space-y-4">{!showcase && <DiyActions f={f} b={b} output={pack.actions[f.id] ?? ""} />}{pack.sops[f.id] && <SopCard f={f} n={i + 1} sop={pack.sops[f.id]} />}</div>)}</div>
            </>
          ) : (
            <div className="relative mt-8">
              <div className="pointer-events-none select-none space-y-6 blur-md" aria-hidden="true">
                {problems.slice(0, 2).map(f => <div key={f.id} className="rounded-lg bg-card p-8"><p className="text-2xl font-semibold">{f.title}</p><p className="mt-5">Step-by-step guide, annotated screens and ready-to-paste wording</p><div className="mt-5 h-24 rounded-lg bg-secondary" /></div>)}
              </div>
              <div className="absolute inset-0 grid place-items-center rounded-lg bg-background/40">
                <div className="mx-4 max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-lg">
                  <Lock className="mx-auto h-8 w-8 text-fix" />
                  <p className="mt-4 text-xl font-semibold">Unlock the full DIY pack</p>
                  <p className="mt-2 text-sm text-muted-foreground">{problems.length} detailed SOP{problems.length === 1 ? "" : "s"} for your report, with exact clicks, scripts and links. One-off payment, no subscription.</p>
                  <div className="mt-5"><PayButton b={b} item="diy" label="DIY pack" onBuy={() => setCheckoutOpen(true)}>Get my detailed DIY pack · £{PRICE_DIY.toFixed(2)}</PayButton></div>
                </div>
              </div>
            </div>
          )}
        </section>}
      </main>
      {!diy && !allClear && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3"><p className="text-sm text-muted-foreground">Free audit · Detailed DIY pack £{PRICE_DIY.toFixed(2)}</p><PayButton b={b} item="diy" label="DIY pack" onBuy={() => setCheckoutOpen(true)}>Get my DIY pack · £{PRICE_DIY.toFixed(2)}</PayButton></div></div>}
    </div>
  );
}

function PayButton({ children, onBuy, variant = "default" }: { b: Business; item: "diy" | "all"; label: string; children: React.ReactNode; onBuy: () => void; variant?: "default" | "outline" }) {
  return <Button onClick={onBuy} variant={variant} className="h-auto min-h-10 w-full whitespace-normal py-3">{children}</Button>;
}

function ProblemCard({ f, n, b, autoRun, showcase = false }: { f: Finding; n: number; b: Business; autoRun: boolean; showcase?: boolean }) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [copied, setCopied] = useState(false);
  const steps: string[] = [];
  useEffect(() => { if (autoRun && state === "idle") setState("running"); }, [autoRun, state]);
  useEffect(() => {
    if (state !== "running") return;
    if (step >= steps.length) { setState("done"); setShowAfter(true); return; }
    const to = setTimeout(() => setStep((s) => s + 1), showcase ? 1100 : 900);
    return () => clearTimeout(to);
  }, [state, step, steps.length, showcase]);
  return <article className="animate-rise grid gap-8 rounded-lg border border-border bg-card p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
    <div>
      <p className="text-xs text-muted-foreground">0{n} · {f.area}</p>
      <h3 className="mt-3 text-2xl font-semibold">{f.title}</h3>
      <p className="mt-3"><span className="text-muted-foreground">Evidence: </span>{f.evidence}</p>
      <p className="mt-2 text-muted-foreground">{f.impact}</p>
      <p className="mt-5 text-sm"><a href="#diy" className="font-semibold text-fix underline underline-offset-4">Fix it yourself with the DIY pack</a><span className="text-muted-foreground">: the finished wording, one-click buttons and a step-by-step guide.</span></p>
    </div>
    <div className="flex flex-col">
      <div className="inline-flex self-start gap-1 text-xs">{(["Before", "After"] as const).map((l) => <Button key={l} size="sm" variant={showAfter === (l === "After") ? "secondary" : "ghost"} onClick={() => setShowAfter(l === "After")}>{l}</Button>)}</div>
      <div className={`mt-3 flex-1 rounded-lg p-5 text-sm ${showAfter ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
        <p>{showAfter ? f.after : f.before}</p>
      </div>
    </div>
  </article>;
}

/** DIY pack: the finished, ready-to-use fix with one-click actions, shown above the step-by-step guide. */
function DiyActions({ f, b, output }: { f: Finding; b: Business; output: string }) {
  const [copied, setCopied] = useState(false);
  const link = reviewLink(b);
  const copyAndOpen = async (text: string) => {
    const tab = window.open(GOOGLE_PROFILE_URL, "_blank"); if (tab) tab.opener = null;
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
    if (!tab) window.location.assign(GOOGLE_PROFILE_URL);
  };
  return <div className="rounded-lg border border-fix bg-accent/50 p-6 text-accent-foreground md:p-8">
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-fix">Ready to use · {f.title}</p>
    {false
      ? <div className="mt-3"><p className="font-medium">Your one-page website is ready, built from your business details.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            
            <Button variant="outline" onClick={() => copyAndOpen(`${window.location.origin}/site/${b.id}`)}>{copied ? "Link copied ✓ Paste it on Google" : "Copy link and open Google"}<ArrowUpRight /></Button>
          </div></div>
      : <div className="mt-3"><pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-card p-4 font-sans text-sm text-card-foreground">{output}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => copyAndOpen(output)}>{copied ? "Copied ✓ Paste it on Google" : "Copy and open Google"}<ArrowUpRight /></Button>
            {f.fix === "review-request" && link && <Button variant="outline" onClick={() => downloadReviewFlyer({ name: b.name, phone: b.phone, link })}><Download />Download QR review card</Button>}
          </div></div>}
    <p className="mt-3 text-xs text-muted-foreground">Copy, paste on Google, save. The full guide below explains each click if you need it.</p>
  </div>;
}

function SopCard({ f, n, sop }: { f: Finding; n: number; sop: Sop }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (label: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(label); } catch { setCopied(null); }
  };
  return <article className="rounded-lg border border-border bg-card p-6 md:p-8">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs text-muted-foreground">SOP {n} · {f.area}</p>
        <h3 className="mt-2 text-2xl font-semibold">{f.title}</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">{sop.goal}</p>
      </div>
      <p className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{sop.time}</p>
    </div>
    {sop.youNeed.length > 0 && <div className="mt-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Before you start</p>
      <ul className="mt-2 space-y-1 text-sm">{sop.youNeed.map((y) => <li key={y} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-grade-a" />{y}</li>)}</ul>
    </div>}
    {sop.rootCauses && <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Fix the cause first</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{sop.rootCauses.map((c) => <div key={c.theme} className="rounded-lg bg-secondary p-3 text-sm"><p className="font-medium">{c.theme}</p><p className="mt-1 text-muted-foreground">{c.fix}</p></div>)}</div>
    </div>}
    <ol className="mt-6 space-y-3">
      {sop.steps.map((s, i) => <li key={i} className="flex gap-3 text-sm"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fix text-xs font-bold text-fix-foreground">{i + 1}</span><span className="pt-0.5">{s}</span></li>)}
    </ol>
    {sop.screens && <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">What you will see</p>
      <div className="mt-2 grid gap-4 md:grid-cols-2">{sop.screens.map((sc) => <ScreenDiagram key={sc.title} s={sc} />)}</div>
      <p className="mt-2 text-xs text-muted-foreground">{SCREEN_NOTE}</p>
    </div>}
    {sop.tools && <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Popular no-code tools</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{sop.tools.map((t) => <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 rounded-lg border border-border p-3 text-sm hover:border-fix"><span><span className="font-medium">{t.name}</span><span className="block text-muted-foreground">{t.bestFor}</span></span><ArrowUpRight className="h-4 w-4 shrink-0" /></a>)}</div>
      <p className="mt-2 text-xs italic text-muted-foreground">{TOOLS_DISCLAIMER}</p>
    </div>}
    {sop.prompts?.map((pr) => <div key={pr.label} className="mt-6 rounded-lg border border-fix/40 bg-secondary p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{pr.label}</p>
        <Button size="sm" variant="ghost" onClick={() => copy(pr.label, pr.text)}><Copy className="h-3.5 w-3.5" />{copied === pr.label ? "Copied ✓" : "Copy prompt"}</Button>
      </div>
      <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-muted-foreground">{pr.text}</pre>
      <p className="mt-3 text-xs text-muted-foreground">Fill in the [square brackets], then paste it into: {pr.openIn.map((t, i) => <span key={t.name}>{i > 0 && ", "}<a href={t.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fix underline">{t.name}</a></span>)}. {sop.tools ? "" : TOOLS_DISCLAIMER}</p>
    </div>)}
    {sop.shotList && <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Your five-shot photo set</p>
      <ul className="mt-2 space-y-2 text-sm">{sop.shotList.map((c) => <li key={c.shot}><span className="font-medium">{c.shot}:</span> <span className="text-muted-foreground">{c.how}</span></li>)}</ul>
    </div>}
    {sop.scripts.length > 0 && <div className="mt-6 space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Word-for-word scripts</p>
      {sop.scripts.map((sc) => <div key={sc.label} className="rounded-lg bg-secondary p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{sc.label}</p>
          <Button size="sm" variant="ghost" onClick={() => copy(sc.label, sc.text)}><Copy className="h-3.5 w-3.5" />{copied === sc.label ? "Copied ✓" : "Copy"}</Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{sc.text}</p>
      </div>)}
    </div>}
    {sop.proTips.length > 0 && <div className="mt-6 border-l-2 border-fix pl-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-fix">Pro tips</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{sop.proTips.map((p) => <li key={p}>{p}</li>)}</ul>
    </div>}
    {sop.guardrails && <div className="mt-6 border-l-2 border-destructive pl-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-destructive">Do not</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{sop.guardrails.map((g) => <li key={g}>{g}</li>)}</ul>
    </div>}
  </article>;
}

function Gauge({ score, grade }: { score: number; grade: ReturnType<typeof gradeOf> }) {
  const [v, setV] = useState(0);
  useEffect(() => { const to = setTimeout(() => setV(score), 150); return () => clearTimeout(to); }, [score]);
  const r = 88, c = 2 * Math.PI * r;
  return <div className="relative h-48 w-48 shrink-0">
    <svg viewBox="0 0 200 200" aria-hidden="true" className="h-full w-full -rotate-90"><circle cx="100" cy="100" r={r} fill="none" stroke="var(--secondary)" strokeWidth="14" /><circle cx="100" cy="100" r={r} fill="none" stroke={`var(--grade-${grade.toLowerCase()})`} strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} className="transition-all duration-700 motion-reduce:transition-none" /></svg>
    <div className="absolute inset-0 grid place-items-center"><p className={`font-display text-7xl font-bold leading-none ${gradeColor(grade)}`}>{grade}</p></div>
  </div>;
}

function Radar({ you, them }: { you: Partial<Record<Area, number>>; them: Partial<Record<Area, number>> }) {
  const keys = Object.keys(you) as Area[];
  const pt = (i: number, v: number) => { const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2; return [150 + Math.cos(a) * v * 1.1, 150 + Math.sin(a) * v * 1.1]; };
  const poly = (d: Partial<Record<Area, number>>) => keys.map((k, i) => pt(i, d[k] ?? 0).join(",")).join(" ");
  return <div><svg viewBox="-50 -10 400 320" role="img" aria-label="Your profile compared with a real reference business" className="mx-auto w-full max-w-sm">{[25, 50, 75, 100].map((r) => <polygon key={r} points={keys.map((_, i) => pt(i, r).join(",")).join(" ")} fill="none" stroke="var(--border)" />)}<polygon points={poly(them)} fill="var(--grade-a)" fillOpacity="0.12" stroke="var(--grade-a)" strokeDasharray="4 4" /><polygon points={poly(you)} fill="var(--fix)" fillOpacity="0.25" stroke="var(--fix)" strokeWidth="2" />{keys.map((k, i) => { const [x, y] = pt(i, 125); return <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="var(--foreground)">{k}</text>; })}</svg><p className="text-center text-xs"><span className="text-fix">Your profile / projection</span> · <span className="text-grade-a">Real reference profile</span></p></div>;
}

function extraTips(trade: keyof typeof TRADES) {
  const t = TRADES[trade];
  return [
    { title: "Reply to every review", body: "A short, personal owner reply within a day shows new customers you care, and praise answered is free marketing." },
    { title: "Show your credentials", body: `Mention ${t.credential} on your profile and website if you hold it. ${t.credentialPlain}` },
    { title: "Keep photos current", body: `Add fresh photos of ${t.expectedPhotos} every month or so, so the profile looks active.` },
    { title: "Post regular updates", body: "A weekly Google update about a recent job or an open slot signals you are busy and available." },
  ];
}

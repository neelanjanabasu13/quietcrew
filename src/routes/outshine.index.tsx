import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/outshine/Brand";
import { Shine } from "@/components/outshine/Shine";
import { TRADES, type Trade } from "@/lib/outshine/audit";
import { TRADE_PHOTOS } from "@/lib/outshine/sample";
import { discoverBusinesses, liveId, searchBusinesses } from "@/lib/outshine/places.functions";
import { Button } from "@/components/ui/button";
import { ReportStack } from "@/components/outshine/ReportStack";
import { TradeDeck } from "@/components/outshine/TradeDeck";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Route = createFileRoute("/outshine/")({
  head: () => ({
    meta: [
      { title: "Outshine by Quietcrew · Free online presence audit for UK trades" },
      { name: "description", content: "Compare your UK trade business with nearby rivals in a free online presence audit, then get a detailed DIY fix list for £9.99 (was £14.99)." },
      { property: "og:title", content: "Outshine by Quietcrew · Free online presence audit for UK trades" },
      { property: "og:description", content: "Compare your public business profile with nearby businesses and download a practical report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Hit = { placeId: string; name: string; address: string; rating: number; reviewCount: number; trade: Trade | null; photo: string | null };

function Home() {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState<Trade | null>("cleaning");
  const [city, setCity] = useState("London");
  const [picked, setPicked] = useState<Hit | null>(null);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const search = useServerFn(searchBusinesses);
  const discover = useServerFn(discoverBusinesses);

  useEffect(() => {
    const s = q.trim();
    const browsing = s.length < 3 && trade !== null;
    if (s.length < 3 && !browsing) { setHits([]); setLoading(false); setErr(null); return; }
    let live = true;
    setLoading(true);
    setHits([]);
    setErr(null);
    const to = setTimeout(async () => {
      try {
        const r = await (browsing && trade ? discover({ data: { trade, city } }) : search({ data: { q: trade ? `${s} ${TRADES[trade].label}` : s } }));
        if (live) { setHits(r.results); setErr(r.error); }
      } catch { if (live) setErr("Search is having a moment. Please try again."); }
      if (live) setLoading(false);
    }, browsing ? 0 : 400);
    return () => { live = false; clearTimeout(to); };
  }, [q, trade, city, search, discover]);

  const pickedTrade = picked ? (picked.trade ?? trade) : null;
  const browsing = trade !== null && q.trim().length < 3;

  const pick = (b: Hit) => { setPicked(b); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-8 md:pt-14 lg:grid-cols-[1.15fr_1fr] [&>*]:min-w-0">
        <div className="min-w-0">
          <h1 className="animate-rise font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl md:text-6xl">
            Make your business{" "}
            <Shine halo>outshine</Shine>{" "}
            every rival down the road.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg text-muted-foreground">
            Type your business name and we will grade your public profile against the three closest rivals in your trade.
          </p>

          {!picked ? (
            <div className="relative mt-8 max-w-xl">
              <div className="flex items-stretch rounded-full bg-card shadow-[0_20px_50px_-30px_var(--ink)] ring-2 ring-transparent focus-within:ring-violet">
                <input aria-label="Business name and town" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Mops Stars Cleaning, London"
                  className="min-w-0 flex-1 rounded-l-full bg-transparent px-6 py-4 text-lg outline-none" />
                <span className="m-1.5 hidden items-center rounded-full bg-fix px-6 font-semibold text-fix-foreground sm:flex">Scan free</span>
              </div>
              <p className="mt-3 px-2 text-sm text-muted-foreground">Free, takes under a minute, no card details, and nothing on your profile is changed.</p>
              {q.trim().length >= 3 && <ul aria-label="Business results" aria-busy={loading} className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_-30px_var(--ink)] focus-within:border-ink">
                {hits.map((b) => (
                  <li key={b.placeId}>
                    <Button variant="ghost" onClick={() => pick(b)} className="flex h-auto w-full justify-start gap-4 rounded-none px-5 py-3 text-left whitespace-normal">
                      {b.photo ? <img src={b.photo} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" width={40} height={40} /> : <span className="h-10 w-10 rounded-lg bg-secondary" />}
                      <span className="min-w-0 flex-1"><span className="block font-medium">{b.name}</span><span className="text-sm text-muted-foreground">{b.address}</span></span>
                      <span className="shrink-0 text-right text-xs text-muted-foreground">{b.rating > 0 && <span className="block">{b.rating.toFixed(1)} ★</span>}<span>{b.reviewCount.toLocaleString("en-GB")} reviews</span></span>
                    </Button>
                  </li>
                ))}
                {loading && !hits.length && <li className="px-5 py-4 text-sm text-muted-foreground">Searching…</li>}
                {!loading && !hits.length && <li className="px-5 py-4 text-sm text-muted-foreground">{err ?? "No match found. Try adding your town or postcode."}</li>}
              </ul>}
              <a href="#browse" className="mt-4 inline-block px-2 text-sm font-semibold text-violet underline-offset-4 hover:underline">Not sure what to type? Browse local businesses by trade ↓</a>
            </div>
          ) : (
            <div className="animate-pop mt-8 flex max-w-xl flex-col gap-5 rounded-2xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-center">
              <img src={picked.photo ?? TRADE_PHOTOS[pickedTrade ?? "cleaning"]} alt={picked.name} className="h-32 w-full rounded-xl object-cover sm:w-40" width={160} height={128} />
              <div className="flex-1">
                <p className="font-display text-2xl font-extrabold">{picked.name}</p>
                <p className="text-sm text-muted-foreground">{picked.address}</p>
                <p className="mt-1 text-sm">{picked.rating.toFixed(1)} ★ · {picked.reviewCount} reviews</p>
                {!pickedTrade && <p className="mt-2 text-sm font-semibold text-fix">Pick your trade below so we compare you with the right rivals.</p>}
                <div className="mt-4 flex items-center gap-4">
                  <button disabled={!pickedTrade} onClick={() => pickedTrade && navigate({ to: "/outshine/scan/$id", params: { id: picked.placeId.startsWith("seed:") ? picked.placeId.slice(5) : liveId(pickedTrade, picked.placeId) } })}
                    className="rounded-full bg-fix px-6 py-3 font-semibold text-fix-foreground transition hover:-translate-y-0.5 disabled:opacity-40">Grade my business →</button>
                  <button onClick={() => setPicked(null)} className="text-sm text-muted-foreground underline-offset-4 hover:underline">Not this one</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-clip pb-10 pt-8 lg:overflow-visible"><ReportStack /></div>
        </section>

        <section aria-labelledby="familiar-title" className="bg-card py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <p className="inline-block rounded-full bg-violet-tint px-4 py-1.5 text-sm font-semibold text-ink">Sound familiar?</p>
            <h2 id="familiar-title" className="mt-4 font-display text-3xl font-extrabold md:text-5xl">You do good work, and the phone <span className="text-violet">still goes quiet</span>.</h2>
            <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2">
              {[
                { t: "Plumbing", q: "My reviews are better than theirs, so why do they get the calls?" },
                { t: "Roofing", q: "I set up my Google profile years ago and have not looked at it since." },
                { t: "Cleaning", q: "I never know what to say when someone leaves a bad review." },
                { t: "Electrical", q: "I keep meaning to add photos of our work but never get round to it." },
              ].map((c, i) => (
                <li key={c.q} className={`animate-rise rounded-[20px] p-6 soft-shadow transition hover:-translate-y-1 ${i % 3 === 0 ? "bg-violet-deep text-card" : "bg-cream text-ink"}`} style={{ animationDelay: `${i * 80}ms` }}>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${i % 3 === 0 ? "bg-card/15 text-peach" : "bg-violet-tint text-violet"}`}>{c.t}</span>
                  <p className="mt-4 font-display text-lg font-bold leading-snug">“{c.q}”</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="how-title" className="bg-violet-deep py-16 text-card md:py-24">
          <div className="mx-auto max-w-3xl px-5">
            <p className="inline-block rounded-full bg-card/10 px-4 py-1.5 text-sm font-semibold text-muted-on-violet">What the audit does</p>
            <h2 id="how-title" className="mt-4 font-display text-3xl font-extrabold md:text-5xl">Two steps: <span className="text-peach">a free scan, then your exact fix list</span>.</h2>
            <p className="mt-5 text-lg text-muted-on-violet">The scan is always free. The detailed report on exactly what to fix, and how, is £9.99 for a limited time instead of £14.99.</p>
            <ol className="mt-12">
              {[
                { n: "01 · Always free", k: "Scan your business", d: "In under a minute you get your grade, the gaps on your public profile, and how you stack up against the nearby businesses in your trade.", bg: "bg-card",
                  art: <ul className="space-y-2 text-sm">
                    {[["You", "C", "bg-grade-c", "55%"], ["Rival 1", "A", "bg-grade-a", "92%"], ["Rival 2", "B", "bg-grade-b", "78%"], ["Rival 3", "B", "bg-grade-b", "71%"]].map(([a, g, c, w]) => (
                      <li key={a} className="flex items-center gap-3"><span className="w-16 shrink-0 font-semibold">{a}</span><span className="h-3 flex-1 overflow-hidden rounded-full bg-secondary"><span className={`block h-full rounded-full ${c}`} style={{ width: w }} /></span><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-card ${c}`}>{g}</span></li>
                    ))}
                  </ul> },
                { n: "02 · £9.99, was £14.99", k: "Get your exact fix list", d: "A detailed report written for your business: what to fix first, step-by-step guides, ready-to-paste wording and a PDF you keep. It is the list a consultant would charge you for, at a fraction of the price.", bg: "bg-violet-tint",
                  art: <div className="rounded-xl bg-card p-4 text-sm">
                    <p className="text-xs font-semibold text-violet">Review reply, ready to paste</p>
                    <p className="mt-2 text-muted-foreground">“Thank you for taking the time to write this. We are sorry the visit ran late, and we would like to put it right…”</p>
                    <p className="mt-3 inline-block rounded-full bg-violet-tint px-3 py-1 text-xs font-semibold text-violet">About 2 minutes</p>
                  </div> },
              ].map((c, i) => (
                <li key={c.k} className={`sticky mb-8 grid gap-6 rounded-[20px] p-8 text-ink shadow-[0_-20px_50px_-30px_var(--ink)] md:grid-cols-[1.1fr_1fr] md:items-center md:p-10 ${c.bg}`} style={{ top: `${96 + i * 24}px` }}>
                  <div>
                    <p className="font-display text-sm font-bold text-violet">{c.n}</p>
                    <p className="mt-2 font-display text-3xl font-extrabold md:text-4xl">{c.k}</p>
                    <p className="mt-4 text-lg text-muted-foreground">{c.d}</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-3 right-2 z-10 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold text-card">EXAMPLE OUTPUT</span>
                    {c.art}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="browse" aria-labelledby="browse-title" className="bg-card py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-fix">Try it on a neighbour</p>
            <h2 id="browse-title" className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Pick a trade and a city to see a real local audit.</h2>
            <div className="mt-6"><TradeDeck selected={trade} onPick={(t) => { setTrade(t); setQ(""); }} /></div>
            {browsing && <Carousel key={`${trade}-${city}`} opts={{ align: "start", slidesToScroll: 1 }} aria-label="Local businesses to try" className="animate-rise mt-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                    <span className="shrink-0">Try one in</span>
                    <select aria-label="Browse city" value={city} onChange={(e) => setCity(e.target.value)} className="cursor-pointer bg-transparent font-semibold text-foreground underline decoration-dotted underline-offset-4 outline-none">
                      {["London", "Manchester", "Birmingham", "Leeds", "Edinburgh"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <CarouselPrevious className="static h-7 w-7 translate-y-0" title="Previous businesses" />
                    <CarouselNext className="static h-7 w-7 translate-y-0" title="Next businesses" />
                  </div>
                </div>
                <div aria-busy={loading} className="h-24">
                  {hits.length > 0 ? <CarouselContent aria-label="Business results" className="-ml-3">
                    {hits.map((b) => <CarouselItem key={b.placeId} className="basis-[85%] pl-3 sm:basis-1/2">
                      <Button variant="outline" onClick={() => pick(b)} className="flex h-24 w-full justify-start gap-3 rounded-xl bg-card px-3 text-left whitespace-normal hover:-translate-y-0.5">
                        {b.photo ? <img src={b.photo} alt="" className="h-16 w-14 shrink-0 rounded-md object-cover" loading="lazy" width={56} height={64} /> : <span className="h-16 w-14 shrink-0 rounded-md bg-secondary" />}
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 text-sm font-semibold leading-5">{b.name}</span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">{b.address}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">{b.rating > 0 && `${b.rating.toFixed(1)} ★ · `}{b.reviewCount.toLocaleString("en-GB")} reviews</span>
                        </span>
                      </Button>
                    </CarouselItem>)}
                  </CarouselContent> : <div className="flex h-full items-center rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground" role="status">
                    {loading ? "Finding local businesses…" : err ?? "No 4 to 4.5 star examples here. Try another city."}
                  </div>}
                </div>
              </Carousel>}
          </div>
        </section>


        <div className="mx-auto max-w-6xl px-5 pb-24">

        <section className="mt-14 grid gap-8 rounded-[20px] soft-shadow bg-card p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-fix">From findings to fixes</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Your exact fix list for <span className="mr-2 text-2xl text-muted-foreground line-through md:text-3xl">£14.99</span><span className="text-violet">£9.99</span>.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Your free scan shows where you fall behind. The detailed DIY pack tells you exactly what to fix for your business, in what order, with the wording ready to paste, so an afternoon is all it takes. One payment, no subscription.
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-3">
            {[
              <>Your scan is always free</>,
              <>Detailed DIY pack · <s className="text-muted-foreground">£14.99</s> £9.99 one-off</>,
              <>Step-by-step guides and copyable wording</>,
              <>Downloadable PDF to keep</>,
            ].map((t, i) => (
              <li key={i} className={`rounded-2xl bg-violet-tint px-5 py-4 font-semibold text-ink`}>{t}</li>
            ))}
          </ul>
        </section>
        </div>
      </main>
    </div>
  );
}

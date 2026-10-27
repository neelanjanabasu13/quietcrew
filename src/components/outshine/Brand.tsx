import type React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Shine } from "./Shine";

/** Outshine sits inside Quietcrew as a product. The header always offers a way back to Quietcrew. */
export function Header() {
  return (
    <header className="pt-5">
      <div className="container-page">
        <nav
          aria-label="Outshine"
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[999px] bg-white px-4 py-2.5 soft-shadow sm:px-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-violet-tint px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-violet hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Quietcrew</span>
            </Link>
            <Link to="/outshine" className="flex min-w-0 flex-col leading-tight" aria-label="Outshine home">
              <span className="text-xl font-extrabold tracking-[-0.02em]"><Shine>Outshine</Shine></span>
              <span className="text-xs text-muted-foreground">by <span className="font-extrabold text-violet">Quiet</span><span className="font-extrabold text-ink">crew</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/goldmine" className="hidden font-semibold text-muted-paper transition-colors hover:text-violet sm:inline">Goldmine</Link>
            <Link to="/outshine" className="pill-btn btn-primary-dark">Scan free</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const gradeClass = { A: "text-grade-a", B: "text-grade-b", C: "text-grade-c", D: "text-grade-d", F: "text-grade-f" } as const;
export const gradeColor = (g: keyof typeof gradeClass) => gradeClass[g];

export function OutshineShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream">{children}</div>;
}

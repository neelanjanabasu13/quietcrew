import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#who-we-help", label: "Who We Help" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="on-ink sticky top-0 z-50 border-b border-rule-dark bg-ink text-paper">
      <nav aria-label="Primary" className="container-page flex h-[68px] items-center justify-between">
        <Link to="/" className="font-display text-[1.15rem] font-bold uppercase tracking-[0.02em] text-paper">
          Quietcrew
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono-label text-muted-ink transition-colors hover:text-hivis"
            >
              {l.label}
            </a>
          ))}
          <a href="/#book" className="btn-hivis">
            Book a Workflow Review
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-rule-dark text-paper md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="menu-sheet fixed inset-0 top-[68px] z-50 flex flex-col px-5 py-6 md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-rule-dark py-5 font-display text-2xl font-bold uppercase text-paper"
            >
              {l.label}
            </a>
          ))}
          <a href="/#book" onClick={() => setOpen(false)} className="btn-hivis mt-8 w-full">
            Book a Workflow Review
          </a>
        </div>
      )}
    </header>
  );
}

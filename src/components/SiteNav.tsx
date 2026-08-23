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
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg font-700 tracking-tight text-ink"
          style={{ fontWeight: 700 }}
        >
          Quietcrew
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href="/#book" className="btn-accent text-[15px]">
            Book a Workflow Review
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
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
          className="menu-sheet fixed inset-0 top-16 z-50 flex flex-col gap-2 px-5 py-8 md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-2xl text-ink"
            >
              {l.label}
            </a>
          ))}
          <a href="/#book" onClick={() => setOpen(false)} className="btn-accent mt-6 w-full">
            Book a Workflow Review
          </a>
        </div>
      )}
    </header>
  );
}

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
    <header className="absolute inset-x-0 top-0 z-50 pt-5">
      <div className="container-page">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-6 rounded-[999px] bg-white px-5 py-3 soft-shadow"
        >
          <Link
            to="/"
            aria-label="Quietcrew home"
            className="text-[1.25rem] font-extrabold leading-none tracking-[-0.03em] text-ink"
          >
            <span className="text-violet">Quiet</span>
            <span className="text-ink">crew</span>
          </Link>


          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] font-semibold text-muted-paper transition-colors hover:text-violet"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a href="mailto:hello@quietcrew.ai" className="pill-btn btn-ghost-light">
              Email us
            </a>
            <a href="/#book" className="pill-btn btn-primary-dark">
              Book a Workflow Review
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-tint text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </nav>
      </div>

      {open && (
        <div id="mobile-menu" className="container-page md:hidden">
          <div className="menu-sheet mt-3 rounded-[20px] p-4 soft-shadow-lg">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-4 text-[18px] font-bold text-ink last:border-b-0"
              >
                {l.label}
              </a>
            ))}
            <a href="/#book" onClick={() => setOpen(false)} className="pill-btn btn-primary-dark mt-4 w-full">
              Book a Workflow Review
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

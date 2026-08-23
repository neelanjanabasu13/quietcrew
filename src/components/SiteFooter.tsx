import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="on-ink border-t border-rule-dark bg-ink text-paper">
      <div className="container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold uppercase tracking-[0.02em]">Quietcrew</p>
          <p className="mt-3 mono-label text-muted-ink">The work gets done in the background.</p>
          <a
            href="mailto:hello@quietcrew.co.uk"
            className="mt-5 inline-block mono-label text-hivis underline underline-offset-4"
          >
            hello@quietcrew.co.uk
          </a>
        </div>

        <div>
          <p className="mono-label text-muted-ink">Site</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a href="/#services" className="mono-label text-paper hover:text-hivis">
                Services
              </a>
            </li>
            <li>
              <a href="/#book" className="mono-label text-paper hover:text-hivis">
                Book a Workflow Review
              </a>
            </li>
            <li>
              <Link to="/privacy" className="mono-label text-paper hover:text-hivis">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="mono-label text-paper hover:text-hivis">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div className="mono-label text-muted-ink">
          <p>Company</p>
          <p className="mt-4 normal-case tracking-normal">Quietcrew Ltd (placeholder)</p>
          <p className="normal-case tracking-normal">
            Registered in England and Wales, company number 00000000 (placeholder)
          </p>
          <p className="normal-case tracking-normal">
            Registered address: Address line 1, Town, Postcode (placeholder)
          </p>
          <p className="mt-5">© {new Date().getFullYear()} Quietcrew. All rights reserved.</p>
        </div>
      </div>

      {/*
        Analytics placeholder: no analytics and no cookie banner at launch.
        Add the analytics snippet here, and mount the consent banner component
        alongside it, once a lawful basis and consent flow are agreed.
      */}
    </footer>
  );
}

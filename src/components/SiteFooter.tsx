import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg" style={{ fontWeight: 700 }}>
            Quietcrew
          </p>
          <p className="mt-2 text-[15px] text-muted">The work gets done in the background.</p>
          <a
            href="mailto:hello@quietcrew.co.uk"
            className="mt-4 inline-block text-[15px] text-accent underline underline-offset-4"
          >
            hello@quietcrew.co.uk
          </a>
        </div>

        <div>
          <p className="eyebrow">Site</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>
              <a href="/#services" className="text-muted hover:text-ink">
                Services
              </a>
            </li>
            <li>
              <a href="/#book" className="text-muted hover:text-ink">
                Book a Workflow Review
              </a>
            </li>
            <li>
              <Link to="/privacy" className="text-muted hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-muted hover:text-ink">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-[14px] text-muted">
          <p className="eyebrow">Company</p>
          <p className="mt-3">Quietcrew Ltd (placeholder)</p>
          <p>Registered in England and Wales, company number 00000000 (placeholder)</p>
          <p>Registered address: Address line 1, Town, Postcode (placeholder)</p>
          <p className="mt-4">© {new Date().getFullYear()} Quietcrew. All rights reserved.</p>
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

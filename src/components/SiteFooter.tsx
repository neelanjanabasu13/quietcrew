import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="on-violet bg-violet-deeper text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold tracking-[-0.02em]">Quietcrew</p>
          <p className="mt-3 text-[15px] text-muted-on-violet">The work gets done in the background.</p>
          <a
            href="mailto:hello@quietcrew.co.uk"
            className="mt-5 inline-block text-[15px] font-semibold text-peach underline underline-offset-4"
          >
            hello@quietcrew.co.uk
          </a>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-on-violet">Site</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a href="/#services" className="text-[15px] font-semibold text-white hover:text-peach">
                Services
              </a>
            </li>
            <li>
              <a href="/#book" className="text-[15px] font-semibold text-white hover:text-peach">
                Book a Workflow Review
              </a>
            </li>
            <li>
              <Link to="/privacy" className="text-[15px] font-semibold text-white hover:text-peach">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-[15px] font-semibold text-white hover:text-peach">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-[14px] text-muted-on-violet">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-on-violet">Company</p>
          <p className="mt-4">Quietcrew, United Kingdom</p>
          <p>
            <a href="mailto:hello@quietcrew.co.uk" className="underline underline-offset-4">
              hello@quietcrew.co.uk
            </a>
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

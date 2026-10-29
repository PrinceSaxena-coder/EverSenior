import { Instagram, Linkedin, Facebook } from "lucide-react";
import { navLinks } from "../data/nav";
export function Footer() {
  const social = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Linkedin, label: "LinkedIn" },
    { Icon: Facebook, label: "Facebook" },
  ];
  return (
    <footer className="bg-sand px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl">EverSenior</p>
          <p className="mt-3 max-w-xs text-bark">
            Spirited, empathetic youth companions for the elderly.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-3 text-bark">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <address className="space-y-2 not-italic text-bark">
          <p>
            <a href="tel:+918779524307" className="hover:text-ink">
              +91 70551 44837
            </a>
          </p>
          <p>
            <a
              href="mailto:contact@thegoodfellows.in"
              className="hover:text-ink"
            >
              contact@EverSenior.in
            </a>
          </p>
          <p>
            Careers:{" "}
            <a
              href="mailto:careers@thegoodfellows.in"
              className="hover:text-ink"
            >
              careers@EverSenior.in
            </a>
          </p>
          <div className="flex gap-3 pt-3">
            {social.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-cream"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </address>
      </div>
      <p className="mx-auto mt-14 max-w-7xl border-t border-ink/15 pt-6 text-sm text-bark">
        © {new Date().getFullYear()} The EverSenior. All rights reserved.
      </p>
    </footer>
  );
}

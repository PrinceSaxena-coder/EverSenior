import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

const navigation = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Events", path: "/events" },
  { label: "Press", path: "/press" },
  { label: "FAQs", path: "/faqs" },
  { label: "Careers", path: "/careers" },
  { label: "Contact Us", path: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/10 bg-cream/95 backdrop-blur-sm">

      <nav
        aria-label="Main"
        className="flex h-[82px] w-full items-center justify-between px-6 md:px-8 lg:px-10"
      >

        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 font-serif text-3xl tracking-tight text-ink"
        >
          EverSenior
        </Link>


        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-7 text-[16px] text-bark xl:flex">

          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="whitespace-nowrap transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}

        </ul>


        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Join The Trial */}
          <Button href="/signup">
            Join The Trial
          </Button>


          {/* Mobile Menu */}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md transition-colors hover:bg-ink/5 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </nav>


      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-500 xl:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >

        <ul className="overflow-hidden bg-cream px-6">

          {navigation.map((item) => (
            <li key={item.label}>

              <Link
                to={item.path}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="block border-t border-ink/10 py-4 font-serif text-2xl text-ink"
              >
                {item.label}
              </Link>

            </li>
          ))}


          {/* Mobile Join The Trial */}
          <li>

            <Link
              to="/signup"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="block border-t border-ink/10 py-4 font-serif text-2xl text-ink"
            >
              Join The Trial
            </Link>

          </li>

        </ul>

      </div>

    </header>
  );
}
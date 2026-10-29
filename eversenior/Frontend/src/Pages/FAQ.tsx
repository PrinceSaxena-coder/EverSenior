import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface FaqItem {
  q: string;
  a: string;
}

// Sample answers: edit to match your real policies.
const faqs: FaqItem[] = [
  {
    q: "How do I get started?",
    a: "Tell us about yourself or your family member through the trial form. We call back within two days to understand your needs.",
  },
  {
    q: "How are companions and seniors matched?",
    a: "We look at interests, language, routines and personality, then introduce you before the first visit.",
  },
  {
    q: "Is this a paid service?",
    a: "The trial is free. We will share the details of future plans openly before anything changes.",
  },
  {
    q: "How is safety ensured?",
    a: "Every companion is verified, trained and supported by our team, and visits are checked in on regularly.",
  },
  {
    q: "How are companions selected?",
    a: "Through interviews that look for patience, warmth and respect for elders, followed by training.",
  },
  {
    q: "Are companions paid employees?",
    a: "Companions are young graduates who receive a stipend for their time.",
  },
  {
    q: "How frequently do visits happen?",
    a: "Most seniors choose one or two visits a week. We adjust as the friendship grows.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">
            FAQs
          </p>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Questions,
            <span className="block">answered.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            Everything you may want to know about companionship, safety and
            getting started with EverSenior.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-ink/15">
            {faqs.map((item, index) => {
              const isOpen = open === index;

              return (
                <div key={item.q} className="border-t border-ink/15">
                  <h3>
                    <button
                      id={`faq-button-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl md:text-2xl"
                    >
                      {item.q}
                      {isOpen ? (
                        <Minus className="shrink-0" />
                      ) : (
                        <Plus className="shrink-0" />
                      )}
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    className={`grid transition-[grid-template-rows] duration-500 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-10 leading-7 text-bark">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Still curious?
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              We are happy to talk it through.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-bark">
            <p>
              If your question is not answered here, get in touch and a member
              of our team will get back to you.
            </p>

            <a
              href="mailto:contact@thegoodfellows.in"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-[15px] font-medium text-cream transition-colors hover:bg-bark"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Start something meaningful
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            There is always room for one more good conversation.
          </h2>

          <a
            href="/signup"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-medium text-[#211E1A] transition hover:bg-[#EDE7DB]"
          >
            Join The Trial
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
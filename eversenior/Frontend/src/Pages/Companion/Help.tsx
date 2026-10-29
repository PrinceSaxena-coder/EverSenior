
import { useState } from "react";
import { Link } from "react-router-dom";


const faqs = [
  {
    category: "Getting Started",
    question: "How do I become an EverSenior companion?",
    answer:
      "Create your companion account, complete your profile, and follow the onboarding steps shown on your dashboard. Your profile becomes available to seniors only after the required verification stages and final approval are completed.",
  },
  {
    category: "Getting Started",
    question: "How can I update my companion profile?",
    answer:
      "Open your Companion Dashboard and navigate to your profile or profile settings. Update the permitted details and save your changes. If profile editing is unavailable during a verification stage, follow the instructions displayed on your dashboard.",
  },
  {
    category: "Verification",
    question: "What are the onboarding steps?",
    answer:
      "The expected process is: 1. Psychometric test, 2. Personal interview, 3. Background verification, 4. Police verification, and finally administrator approval. Complete each stage in order and check your dashboard for the current status.",
  },
  {
    category: "Verification",
    question: "Why is my profile not visible to seniors?",
    answer:
      "Your profile may still be under review, awaiting documents, or awaiting final approval. Check your onboarding status and any action requests on your dashboard. Only eligible, approved companions should appear in senior discovery.",
  },
  {
    category: "Verification",
    question: "How can I check my verification status?",
    answer:
      "Open the onboarding or verification section of your Companion Dashboard. Review each stage and follow any instructions for pending information, scheduling, or resubmission.",
  },
  {
    category: "Bookings",
    question: "Where can I view my bookings?",
    answer:
      "Open the Bookings section of your Companion Dashboard. Available booking information and status updates should appear there once they have been saved by the platform.",
  },
  {
    category: "Bookings",
    question: "What should I do if a booking looks incorrect?",
    answer:
      "Check the booking details and current status first. If the information is still incorrect, contact EverSenior support with the booking reference and a short description. Do not share passwords or authentication codes.",
  },
  {
    category: "Account & Safety",
    question: "How do I change my account details?",
    answer:
      "Use the profile or account settings available in your dashboard. Some identity or verification details may require review before they can be changed.",
  },
  {
    category: "Account & Safety",
    question: "How do I delete my account?",
    answer:
      "If account deletion is enabled, open your account settings or dashboard and select Delete Account. Review the warning carefully before confirming. Some booking or legal records may need to be retained as explained in the Privacy Policy.",
  },
  {
    category: "Account & Safety",
    question: "What if I encounter a safety concern?",
    answer:
      "Prioritize your immediate safety and contact local emergency services if there is immediate danger. Report the incident through EverSenior's official support channel and share only the information needed to investigate it.",
  },
];

const categories = [
  "All Topics",
  "Getting Started",
  "Verification",
  "Bookings",
  "Account & Safety",
];

const Help = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All Topics" ||
      faq.category === activeCategory;

    const searchText =
      `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();

    return matchesCategory && searchText.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/companion/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#795548] hover:underline"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        <section className="rounded-3xl bg-[#795548] px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F1D9C2]">
            EVERSENIOR SUPPORT
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            How can we help you?
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#F8EDE3] sm:text-base">
            Find answers about your companion account, onboarding,
            verification, and bookings.
          </p>

          <div className="mt-7 max-w-2xl">
            <label htmlFor="help-search" className="sr-only">
              Search help topics
            </label>

            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-[#795548]"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                id="help-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search onboarding, bookings, account..."
                className="w-full bg-transparent text-sm text-[#4E342E] outline-none placeholder:text-[#A1887F]"
              />
            </div>
          </div>
        </section>

        <section className="py-8">
          <h2 className="mb-4 text-lg font-bold text-[#4E342E]">
            Browse help topics
          </h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(null);
                }}
                aria-pressed={activeCategory === category}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "border-[#795548] bg-[#795548] text-white"
                    : "border-[#E4D5C7] bg-white text-[#795548] hover:bg-[#F1E7DC]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="pb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#4E342E]">
              Frequently asked questions
            </h2>

            <span className="text-sm text-[#8D776A]">
              {filteredFaqs.length} topics
            </span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span>
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#A07856]">
                        {faq.category}
                      </span>

                      <span className="font-semibold text-[#4E342E]">
                        {faq.question}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl text-[#795548]"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#F0E7DE] px-5 py-5 text-sm leading-7 text-[#6D5D53] sm:px-6">
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="rounded-2xl border border-[#E9DED2] bg-white px-6 py-10 text-center">
                <h3 className="font-semibold text-[#4E342E]">
                  No matching topics found
                </h3>
                <p className="mt-2 text-sm text-[#8D776A]">
                  Try another search term or select All Topics.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All Topics");
                    setOpenIndex(0);
                  }}
                  className="mt-4 rounded-lg bg-[#795548] px-4 py-2 text-sm font-semibold text-white hover:bg-[#634439]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E9DED2] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#4E342E]">
                Still need help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7D6E65]">
                Contact the EverSenior support team if your question
                is not answered here.
              </p>
            </div>

            <a
              href="mailto:REPLACE_WITH_OFFICIAL_SUPPORT_EMAIL"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#795548] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#634439]"
            >
              Contact Support
            </a>
          </div>

          <p className="mt-4 text-xs leading-5 text-[#8D776A]">
            Before launch, replace the placeholder support email with your
            real, monitored EverSenior support address.
          </p>
        </section>

        <footer className="flex flex-wrap justify-center gap-x-6 gap-y-3 py-8 text-sm text-[#795548]">
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>

          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>

          <Link to="/companion/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Help;

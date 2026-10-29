import { useMemo, useState, type ReactNode } from "react";
import {
  Search,
  CalendarDays,
  Users,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  Bell,
  UserRound,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Ticket,
  BookOpen,
  HeartHandshake,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
};

const categories = [
  {
    id: "bookings",
    title: "Bookings",
    description: "Manage sessions and schedules",
    icon: CalendarDays,
  },
  {
    id: "seniors",
    title: "My Seniors",
    description: "Manage your family members",
    icon: Users,
  },
  {
    id: "payments",
    title: "Payments",
    description: "Payments and transactions",
    icon: CreditCard,
  },
  {
    id: "safety",
    title: "Safety",
    description: "Safety and wellbeing",
    icon: ShieldCheck,
  },
  {
    id: "messages",
    title: "Messages",
    description: "Communication and updates",
    icon: MessageCircle,
  },
  {
    id: "account",
    title: "Account",
    description: "Profile and preferences",
    icon: UserRound,
  },
];

const faqs: FAQ[] = [
  {
    id: 1,
    category: "bookings",
    question: "How do I book a companion for my senior?",
    answer:
      "Open Find Companion from the navigation menu, choose the senior you want to arrange companionship for, review available companions and select Request Session. You can then choose the service, date, time and location before reviewing the booking.",
  },
  {
    id: 2,
    category: "bookings",
    question: "Can I cancel a booking?",
    answer:
      "Yes. Open your Bookings page, select the relevant booking and choose the cancellation option. Cancellation and refund eligibility may depend on the booking status and applicable EverSenior policy.",
  },
  {
    id: 3,
    category: "bookings",
    question: "Where can I see upcoming sessions?",
    answer:
      "You can see upcoming sessions from the Family Dashboard or the Bookings page. Your senior's profile also shows their upcoming companionship sessions.",
  },
  {
    id: 4,
    category: "bookings",
    question: "Can I book different services for the same senior?",
    answer:
      "Yes. Depending on availability, a senior can have different companionship services such as Social Companionship, Outing Companionship, Hobbies & Interests, Tech Companionship and other supported services.",
  },
  {
    id: 5,
    category: "seniors",
    question: "How do I add another senior to my family account?",
    answer:
      "Use the My Seniors section to manage the seniors connected to your account. In this prototype, adding a senior is represented as a planned account feature and may require support assistance.",
  },
  {
    id: 6,
    category: "seniors",
    question: "Can I see my senior's companion and upcoming sessions?",
    answer:
      "Yes. Open the senior's profile from My Seniors. You can view their current companion, upcoming sessions, recent activity, safety information and other relevant details.",
  },
  {
    id: 7,
    category: "seniors",
    question: "Can I communicate with my senior's companion?",
    answer:
      "Yes. Family members can use Messages to communicate with companions involved with their connected seniors.",
  },
  {
    id: 8,
    category: "payments",
    question: "Where can I view my payment history?",
    answer:
      "Open Payments from your profile menu. You can view transactions, payment methods, amounts and payment status there.",
  },
  {
    id: 9,
    category: "payments",
    question: "How do refunds work?",
    answer:
      "Refund eligibility depends on the booking and cancellation circumstances. When a refund is issued, it will appear in your payment history with the relevant transaction status.",
  },
  {
    id: 10,
    category: "payments",
    question: "Can I add a payment method?",
    answer:
      "Yes. Open Payments and use the payment-method section to add a supported payment option. The current prototype stores demonstration payment information locally and does not process real payments.",
  },
  {
    id: 11,
    category: "safety",
    question: "How does EverSenior help keep seniors safe?",
    answer:
      "EverSenior is designed around verified companions, safety monitoring, family visibility, communication tools and dedicated safety support. The Safety Center provides the main safety resources available to families.",
  },
  {
    id: 12,
    category: "safety",
    question: "What should I do if I have a safety concern?",
    answer:
      "Open the Safety Center for immediate guidance and available safety actions. For an urgent situation involving immediate danger, contact local emergency services first.",
  },
  {
    id: 13,
    category: "messages",
    question: "How do I message a companion?",
    answer:
      "Open Messages from the Family navigation or use the Message action from a companion or senior profile. Select the conversation and send your message.",
  },
  {
    id: 14,
    category: "messages",
    question: "Will I receive notifications about bookings?",
    answer:
      "Yes. Booking and session notifications can be managed from Settings. Important account and safety notifications may still be shown when required.",
  },
  {
    id: 15,
    category: "account",
    question: "How do I update my family profile?",
    answer:
      "Open your profile from the account menu and choose My Profile. You can update your personal information, contact details and emergency contact information.",
  },
  {
    id: 16,
    category: "account",
    question: "How do I change my notification preferences?",
    answer:
      "Open Settings and use the Notifications section to enable or disable supported email, SMS, booking, session and companion updates.",
  },
];

const popularQuestions = [
  faqs[0],
  faqs[1],
  faqs[8],
  faqs[10],
  faqs[12],
  faqs[14],
];

export default function HelpCentre() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFAQs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" ||
        faq.category === selectedCategory;

      if (!query) {
        return matchesCategory;
      }

      const searchableText =
        `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(query)
      );
    });
  }, [search, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setOpenFaq(null);

    window.setTimeout(() => {
      document
        .getElementById("faq-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const toggleFaq = (id: number) => {
    setOpenFaq((current) =>
      current === id ? null : id
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      {/* Hero */}
      <section className="border-b border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6F5139] text-white shadow-sm">
              <BookOpen className="h-7 w-7" />
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#6F5139]">
              EverSenior Support
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#30271F] sm:text-5xl">
              How can we help?
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#76695D] sm:text-base">
              Find answers about bookings, seniors, companions,
              payments, safety and your family account.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A7765]" />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedCategory("all");
                }}
                placeholder="Search for answers..."
                className="w-full rounded-2xl border border-[#D8CFC4] bg-white py-4 pl-12 pr-5 text-sm text-[#30271F] shadow-sm outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6F5139] hover:text-[#5F4633]"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="mt-4 text-xs text-[#8A7765]">
              Try searching for "booking", "refund", "safety" or
              "companion".
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Categories */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F5139]">
                Browse by topic
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#30271F] sm:text-2xl">
                What do you need help with?
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const active =
                selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(category.id)
                  }
                  className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                    active
                      ? "border-[#6F5139] bg-[#F3ECE3] shadow-sm"
                      : "border-[#E2DBD0] bg-white hover:-translate-y-0.5 hover:border-[#CFC1B2] hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-[#6F5139] text-white"
                        : "bg-[#EFE6DA] text-[#6F5139]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#30271F]">
                      {category.title}
                    </p>

                    <p className="mt-1 text-xs text-[#76695D]">
                      {category.description}
                    </p>
                  </div>

                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[#A09283] transition group-hover:translate-x-0.5 group-hover:text-[#6F5139]" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Popular Questions */}
        {!search && selectedCategory === "all" && (
          <section className="mt-12">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F5139]">
                Popular questions
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#30271F] sm:text-2xl">
                Quick answers
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {popularQuestions.map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => {
                    setOpenFaq(faq.id);

                    window.setTimeout(() => {
                      document
                        .getElementById("faq-section")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 50);
                  }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#E2DBD0] bg-white p-4 text-left transition hover:border-[#CFC1B2] hover:shadow-sm"
                >
                  <span className="text-sm font-medium leading-6 text-[#4C4035] group-hover:text-[#6F5139]">
                    {faq.question}
                  </span>

                  <ChevronRight className="h-4 w-4 shrink-0 text-[#A09283] group-hover:text-[#6F5139]" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          id="faq-section"
          className="mt-12 scroll-mt-24"
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F5139]">
                Frequently asked questions
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#30271F] sm:text-2xl">
                {selectedCategory === "all"
                  ? "Answers to common questions"
                  : `${getCategoryTitle(selectedCategory)} questions`}
              </h2>
            </div>

            {(search || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setOpenFaq(null);
                }}
                className="text-left text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
              >
                View all questions
              </button>
            )}
          </div>

          {filteredFAQs.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white">
              {filteredFAQs.map((faq) => {
                const isOpen = openFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="border-b border-[#E7DED3] last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#FCFAF7] sm:px-6"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F5139]" />

                        <span className="text-sm font-semibold leading-6 text-[#30271F] sm:text-[15px]">
                          {faq.question}
                        </span>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#8A7765] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pl-10 sm:px-6 sm:pb-6 sm:pl-14">
                        <p className="max-w-3xl text-sm leading-7 text-[#76695D]">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E2DBD0] bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#30271F]">
                We couldn't find an answer
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76695D]">
                Try a different search term or contact our support
                team for help with your question.
              </p>

              <Link
                to="/family/customer-care"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                Contact Customer Care
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Support Options */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F5139]">
              Still need help?
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#30271F] sm:text-2xl">
              Talk to our support team
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <SupportCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Customer Care"
              description="Get help with bookings, companions, payments or your account."
              action="Contact Customer Care"
              to="/family/customer-care"
            />

            <SupportCard
              icon={<Ticket className="h-5 w-5" />}
              title="My Tickets"
              description="Create and track support requests from your family account."
              action="View My Tickets"
              to="/family/tickets"
            />

            <SupportCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Safety Center"
              description="Find safety resources and guidance for your connected seniors."
              action="Open Safety Center"
              to="/family/safety"
            />

          </div>
        </section>

        {/* Safety Banner */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#E5D3C9] bg-[#FBF2EC]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0DDD3] text-[#8A5145]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#5E3B34]">
                Need urgent help?
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#80645C]">
                If a senior is in immediate danger or needs urgent
                medical assistance, contact local emergency services
                first. EverSenior support should not replace
                emergency services.
              </p>
            </div>

            <Link
              to="/family/safety"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D7BDB4] bg-white px-4 py-3 text-sm font-semibold text-[#8A5145] transition hover:bg-[#FFF8F5]"
            >
              Safety Center
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="mt-8 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5139]">
                Family support
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#30271F]">
                We're here when you need us.
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#76695D]">
                Reach out to the EverSenior team for assistance with
                your family account.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/family/customer-care"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                <MessageCircle className="h-4 w-4" />
                Customer Care
              </Link>

              <a
                href="mailto:support@eversenior.in"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFC3B5] bg-white px-4 py-3 text-sm font-semibold text-[#6F5139] transition hover:bg-[#FAF7F2]"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
            </div>

          </div>
        </section>

        {/* Small Help Links */}
        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <MiniLink
            icon={<Bell className="h-4 w-4" />}
            title="Notifications"
            to="/family/notifications"
          />

          <MiniLink
            icon={<CreditCard className="h-4 w-4" />}
            title="Payments"
            to="/family/payments"
          />

          <MiniLink
            icon={<UserRound className="h-4 w-4" />}
            title="My Profile"
            to="/family/profile"
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-[#76695D] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} EverSenior. Built around
            trust, companionship and care.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/family/safety"
              className="hover:text-[#6F5139]"
            >
              Safety
            </Link>

            <Link
              to="/family/customer-care"
              className="hover:text-[#6F5139]"
            >
              Customer Care
            </Link>

            <Link
              to="/family/tickets"
              className="hover:text-[#6F5139]"
            >
              My Tickets
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SupportCard({
  icon,
  title,
  description,
  action,
  to,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CFC1B2] hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
        {icon}
      </div>

      <h3 className="mt-4 text-base font-semibold text-[#30271F]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#76695D]">
        {description}
      </p>

      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139]">
        {action}

        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function MiniLink({
  icon,
  title,
  to,
}: {
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-[#E2DBD0] bg-white p-4 text-sm font-medium text-[#4C4035] transition hover:border-[#CFC1B2] hover:text-[#6F5139]"
    >
      <span className="text-[#6F5139]">{icon}</span>

      <span>{title}</span>

      <ChevronRight className="ml-auto h-4 w-4 text-[#A09283]" />
    </Link>
  );
}

function getCategoryTitle(category: string) {
  const found = categories.find(
    (item) => item.id === category
  );

  return found?.title ?? "Help";
}
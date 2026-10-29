import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type SupportTopic =
  | "Booking"
  | "Companion"
  | "Payment"
  | "Safety"
  | "Account"
  | "Other";

const topics: {
  value: SupportTopic;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "Booking",
    label: "Booking help",
    description: "Sessions, schedules and cancellations",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    value: "Companion",
    label: "Companion support",
    description: "Companion communication or concerns",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    value: "Payment",
    label: "Payment help",
    description: "Transactions, refunds and payments",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    value: "Safety",
    label: "Safety concern",
    description: "Safety or wellbeing assistance",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    value: "Account",
    label: "Account help",
    description: "Profile, login and settings",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    value: "Other",
    label: "Something else",
    description: "Any other EverSenior question",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export default function CustomerCare() {
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] =
    useState<SupportTopic>("Booking");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const [showCallbackForm, setShowCallbackForm] =
    useState(false);

  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackTime, setCallbackTime] = useState(
    "10:00 AM – 1:00 PM"
  );
  const [callbackSubmitted, setCallbackSubmitted] =
    useState(false);

  const userName =
    localStorage.getItem("userName") || "Family Member";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subject.trim() || !message.trim()) {
      alert("Please enter a subject and describe your issue.");
      return;
    }

    const generatedTicket = `ES-${Date.now()
      .toString()
      .slice(-6)}`;

    const existingTickets = JSON.parse(
      localStorage.getItem("familyTickets") || "[]"
    );

    const newTicket = {
      id: generatedTicket,
      subject: subject.trim(),
      message: message.trim(),
      category: selectedTopic,
      status: "Open",
      priority:
        selectedTopic === "Safety" ? "High" : "Normal",
      createdAt: new Date().toISOString(),
      userName,
      userEmail,
    };

    localStorage.setItem(
      "familyTickets",
      JSON.stringify([newTicket, ...existingTickets])
    );

    setTicketId(generatedTicket);
    setSubmitted(true);

    setSubject("");
    setMessage("");
  };

  const handleCallbackSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!callbackName.trim() || !callbackPhone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    localStorage.setItem(
      "familyCallbackRequest",
      JSON.stringify({
        name: callbackName.trim(),
        phone: callbackPhone.trim(),
        preferredTime: callbackTime,
        createdAt: new Date().toISOString(),
      })
    );

    setCallbackSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      {/* Hero */}
      <section className="border-b border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F5139]">
                EverSenior Customer Care
              </p>

              <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#30271F] sm:text-5xl">
                We're here to help your family.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#76695D] sm:text-base">
                Whether you need help with a booking, companion,
                payment or senior's wellbeing, our support team is
                here to guide you.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/family/help"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <HelpCircle className="h-4 w-4" />
                  Visit Help Centre
                </Link>

                <Link
                  to="/family/tickets"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#CFC3B5] bg-white px-5 py-3 text-sm font-semibold text-[#6F5139] transition hover:bg-[#FAF7F2]"
                >
                  <Ticket className="h-4 w-4" />
                  My Tickets
                </Link>
              </div>
            </div>

            {/* Support Status */}
            <div className="rounded-2xl border border-[#DDD3C8] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#30271F]">
                    Customer Care
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#66805F]" />

                    <span className="text-xs font-medium text-[#5F7657]">
                      Support available
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#E7DED3] pt-5">
                <SupportStatus
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Typical response"
                  value="Within 24 hours"
                />

                <SupportStatus
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value="support@eversenior.in"
                />

                <SupportStatus
                  icon={<Phone className="h-4 w-4" />}
                  label="Callback support"
                  value="Available"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Contact Options */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F5139]">
              Contact options
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#30271F]">
              Choose how you'd like help
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <ContactCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Send a message"
              description="Tell us what happened and our team will review your request."
              action="Create Support Ticket"
              onClick={() => {
                document
                  .getElementById("support-form")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            />

            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Request a callback"
              description="Share your phone number and preferred time for a support call."
              action="Request Callback"
              onClick={() => {
                setShowCallbackForm(true);

                window.setTimeout(() => {
                  document
                    .getElementById("callback-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 50);
              }}
            />

            <ContactCard
              icon={<HelpCircle className="h-5 w-5" />}
              title="Find an answer"
              description="Browse common questions before contacting customer care."
              action="Open Help Centre"
              link="/family/help"
            />

          </div>
        </section>

        {/* Main Support Area */}
        <section
          id="support-form"
          className="mt-12 scroll-mt-24"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* Ticket Form */}
            <div className="rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">

              <div className="border-b border-[#E7DED3] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                    <Send className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#30271F]">
                      Send us a message
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#76695D]">
                      Describe your issue and we'll create a
                      support ticket for you.
                    </p>
                  </div>
                </div>
              </div>

              {submitted ? (
                <SuccessState
                  ticketId={ticketId}
                  onViewTickets={() =>
                    navigate("/family/tickets")
                  }
                  onCreateAnother={() => {
                    setSubmitted(false);
                    setTicketId("");
                  }}
                />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 p-5 sm:p-6"
                >

                  {/* Topic */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-[#30271F]">
                      What can we help with?
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {topics.map((topic) => {
                        const active =
                          selectedTopic === topic.value;

                        return (
                          <button
                            key={topic.value}
                            type="button"
                            onClick={() =>
                              setSelectedTopic(topic.value)
                            }
                            className={`rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-[#6F5139] bg-[#F3ECE3]"
                                : "border-[#DDD3C8] bg-white hover:bg-[#FAF7F2]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  active
                                    ? "bg-[#6F5139] text-white"
                                    : "bg-[#F3ECE3] text-[#6F5139]"
                                }`}
                              >
                                {topic.icon}
                              </span>

                              <span className="text-xs font-semibold text-[#30271F]">
                                {topic.label}
                              </span>
                            </div>

                            <p className="mt-2 text-[11px] leading-5 text-[#76695D]">
                              {topic.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-semibold text-[#30271F]"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(event) =>
                        setSubject(event.target.value)
                      }
                      placeholder="Briefly describe what you need help with"
                      className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#30271F] outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-[#30271F]"
                      >
                        Tell us more
                      </label>

                      <span className="text-[11px] text-[#A09283]">
                        {message.length}/1000
                      </span>
                    </div>

                    <textarea
                      id="message"
                      value={message}
                      onChange={(event) => {
                        if (event.target.value.length <= 1000) {
                          setMessage(event.target.value);
                        }
                      }}
                      rows={6}
                      placeholder="Please include any details that can help us understand the issue..."
                      className="w-full resize-none rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm leading-6 text-[#30271F] outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
                    />
                  </div>

                  {/* Account */}
                  <div className="rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-4">
                    <div className="flex items-start gap-3">
                      <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#6F5139]" />

                      <div>
                        <p className="text-xs font-semibold text-[#30271F]">
                          Support request from
                        </p>

                        <p className="mt-1 text-xs text-[#76695D]">
                          {userName}
                          {userEmail
                            ? ` • ${userEmail}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Safety Notice */}
                  {selectedTopic === "Safety" && (
                    <div className="rounded-xl border border-[#E5D3C9] bg-[#FBF2EC] p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8A5145]" />

                        <div>
                          <p className="text-sm font-semibold text-[#5E3B34]">
                            Safety concern
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#80645C]">
                            If someone is in immediate danger or
                            needs urgent medical assistance,
                            contact local emergency services
                            first.
                          </p>

                          <Link
                            to="/family/safety"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8A5145]"
                          >
                            Open Safety Center
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Submit Support Request
                  </button>

                </form>
              )}
            </div>

            {/* Side Help */}
            <aside className="space-y-5">

              {/* Response */}
              <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                  <Clock3 className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#30271F]">
                  What happens next?
                </h3>

                <div className="mt-4 space-y-4">
                  <Step
                    number="1"
                    title="We receive your request"
                    description="Your message is converted into a support ticket."
                  />

                  <Step
                    number="2"
                    title="Our team reviews it"
                    description="A support team member checks the details and priority."
                  />

                  <Step
                    number="3"
                    title="We get back to you"
                    description="You'll receive an update through your support channel."
                  />
                </div>
              </div>

              {/* Quick Contact */}
              <div className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5139]">
                  Quick contact
                </p>

                <h3 className="mt-2 text-lg font-semibold text-[#30271F]">
                  Prefer another way?
                </h3>

                <div className="mt-4 space-y-3">

                  <a
                    href="mailto:support@eversenior.in"
                    className="flex items-center gap-3 rounded-xl bg-white p-3 transition hover:bg-[#FAF7F2]"
                  >
                    <Mail className="h-4 w-4 text-[#6F5139]" />

                    <div>
                      <p className="text-xs font-semibold text-[#30271F]">
                        Email
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#76695D]">
                        support@eversenior.in
                      </p>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCallbackForm(true);

                      window.setTimeout(() => {
                        document
                          .getElementById("callback-form")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }, 50);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left transition hover:bg-[#FAF7F2]"
                  >
                    <Phone className="h-4 w-4 text-[#6F5139]" />

                    <div>
                      <p className="text-xs font-semibold text-[#30271F]">
                        Request a callback
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#76695D]">
                        We'll contact you
                      </p>
                    </div>

                    <ChevronRight className="ml-auto h-4 w-4 text-[#A09283]" />
                  </button>

                </div>
              </div>

              {/* Help Centre */}
              <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
                <div className="flex items-start gap-3">
                  <Search className="mt-0.5 h-5 w-5 text-[#6F5139]" />

                  <div>
                    <h3 className="text-sm font-semibold text-[#30271F]">
                      Looking for a quick answer?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#76695D]">
                      Our Help Centre contains answers to common
                      family account questions.
                    </p>

                    <Link
                      to="/family/help"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]"
                    >
                      Browse Help Centre
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </section>

        {/* Callback */}
        {showCallbackForm && (
          <section
            id="callback-form"
            className="mt-8 scroll-mt-24"
          >
            <div className="rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">

              <div className="border-b border-[#E7DED3] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#30271F]">
                      Request a callback
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#76695D]">
                      Tell us when you'd prefer to hear from our
                      support team.
                    </p>
                  </div>
                </div>
              </div>

              {callbackSubmitted ? (
                <div className="p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0E5] text-[#5F7657]">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#30271F]">
                    Callback request received
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76695D]">
                    We've saved your callback preference. A
                    customer care representative will contact you
                    during your selected time window.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setCallbackSubmitted(false);
                      setCallbackName("");
                      setCallbackPhone("");
                    }}
                    className="mt-5 rounded-xl border border-[#CFC3B5] bg-white px-5 py-3 text-sm font-semibold text-[#6F5139] hover:bg-[#FAF7F2]"
                  >
                    Request Another Callback
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleCallbackSubmit}
                  className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6"
                >
                  <div>
                    <label
                      htmlFor="callback-name"
                      className="mb-2 block text-sm font-semibold text-[#30271F]"
                    >
                      Your name
                    </label>

                    <input
                      id="callback-name"
                      type="text"
                      value={callbackName}
                      onChange={(event) =>
                        setCallbackName(event.target.value)
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="callback-phone"
                      className="mb-2 block text-sm font-semibold text-[#30271F]"
                    >
                      Phone number
                    </label>

                    <input
                      id="callback-phone"
                      type="tel"
                      value={callbackPhone}
                      onChange={(event) =>
                        setCallbackPhone(event.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="callback-time"
                      className="mb-2 block text-sm font-semibold text-[#30271F]"
                    >
                      Preferred time
                    </label>

                    <select
                      id="callback-time"
                      value={callbackTime}
                      onChange={(event) =>
                        setCallbackTime(event.target.value)
                      }
                      className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
                    >
                      <option>
                        10:00 AM – 1:00 PM
                      </option>
                      <option>
                        1:00 PM – 4:00 PM
                      </option>
                      <option>
                        4:00 PM – 7:00 PM
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-[#8A7765]">
                      This is a prototype callback request. No
                      actual phone call will be placed.
                    </p>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                    >
                      <Phone className="h-4 w-4" />
                      Request Callback
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* Trust */}
        <section className="mt-8 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8DCCF] text-[#6F5139]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30271F]">
                Your family's information matters.
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#76695D]">
                Only share information that is relevant to your
                support request. Never share passwords, OTPs or
                sensitive payment credentials with anyone.
              </p>
            </div>
          </div>
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
              to="/family/help"
              className="hover:text-[#6F5139]"
            >
              Help Centre
            </Link>

            <Link
              to="/family/safety"
              className="hover:text-[#6F5139]"
            >
              Safety
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

function ContactCard({
  icon,
  title,
  description,
  action,
  onClick,
  link,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  onClick?: () => void;
  link?: string;
}) {
  const content = (
    <>
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
        <ChevronRight className="h-4 w-4" />
      </div>
    </>
  );

  if (link) {
    return (
      <Link
        to={link}
        className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CFC1B2] hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#CFC1B2] hover:shadow-md"
    >
      {content}
    </button>
  );
}

function SupportStatus({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#6F5139]">{icon}</span>

      <div className="min-w-0">
        <p className="text-[11px] text-[#8A7765]">
          {label}
        </p>

        <p className="truncate text-xs font-semibold text-[#30271F]">
          {value}
        </p>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6F5139] text-xs font-semibold text-white">
        {number}
      </div>

      <div>
        <p className="text-xs font-semibold text-[#30271F]">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#76695D]">
          {description}
        </p>
      </div>
    </div>
  );
}

function SuccessState({
  ticketId,
  onViewTickets,
  onCreateAnother,
}: {
  ticketId: string;
  onViewTickets: () => void;
  onCreateAnother: () => void;
}) {
  return (
    <div className="p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0E5] text-[#5F7657]">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5139]">
        Request submitted
      </p>

      <h3 className="mt-2 text-2xl font-semibold text-[#30271F]">
        We've received your message.
      </h3>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#76695D]">
        Your support request has been created. Keep your ticket
        number handy if you need to refer to this request later.
      </p>

      <div className="mx-auto mt-5 max-w-xs rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#8A7765]">
          Ticket number
        </p>

        <p className="mt-1 text-lg font-semibold tracking-wide text-[#6F5139]">
          {ticketId}
        </p>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onViewTickets}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
        >
          <Ticket className="h-4 w-4" />
          View My Tickets
        </button>

        <button
          type="button"
          onClick={onCreateAnother}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFC3B5] bg-white px-5 py-3 text-sm font-semibold text-[#6F5139] transition hover:bg-[#FAF7F2]"
        >
          Create Another Request
        </button>
      </div>
    </div>
  );
}
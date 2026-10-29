
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_USER"
  | "RESOLVED"
  | "CLOSED";

type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Ticket = {
  _id: string;
  ticketNumber?: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;
  adminReply?: string;
};

const API_URL = "/v1/support/tickets";

const categories = [
  "Account & Profile",
  "Onboarding & Verification",
  "Bookings",
  "Payment",
  "Technical Issue",
  "Safety Concern",
  "Other",
];

const statusStyles: Record<TicketStatus, string> = {
  OPEN: "bg-[#FDF0D5] text-[#895D18]",
  IN_PROGRESS: "bg-[#E8EDFA] text-[#3E5892]",
  WAITING_FOR_USER: "bg-[#FCE8D8] text-[#95542B]",
  RESOLVED: "bg-[#E6F2E8] text-[#356A40]",
  CLOSED: "bg-[#F0E9E4] text-[#76665B]",
};

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_USER: "Your Response Needed",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const priorityStyles: Record<TicketPriority, string> = {
  LOW: "text-[#6F6259]",
  MEDIUM: "text-[#8A651F]",
  HIGH: "text-[#B45B2A]",
  URGENT: "text-[#B42318]",
};

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [description, setDescription] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Update this token key if your existing auth system uses another key.
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please sign in again to view your tickets."
            : "Could not load your tickets. Please try again."
        );
      }

      const data = await response.json();
      const records: Ticket[] = Array.isArray(data)
        ? data
        : Array.isArray(data.tickets)
          ? data.tickets
          : Array.isArray(data.data)
            ? data.data
            : [];

      setTickets(records);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading tickets."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const createTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (subject.trim().length < 5) {
      setError("Please enter a subject with at least 5 characters.");
      return;
    }

    if (description.trim().length < 20) {
      setError("Please describe your issue in at least 20 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message ||
            "Your ticket could not be submitted. Please try again."
        );
      }

      const result = await response.json();
      const newTicket: Ticket = result.ticket ?? result.data ?? result;

      setSuccess(
        `Your ticket has been submitted${newTicket.ticketNumber ? ` (${newTicket.ticketNumber})` : ""}.`
      );
      setSubject("");
      setCategory(categories[0]);
      setPriority("MEDIUM");
      setDescription("");
      setShowForm(false);

      await loadTickets();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your ticket."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCount = tickets.filter(
    (ticket) => !["RESOLVED", "CLOSED"].includes(ticket.status)
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/companion/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#795548] hover:underline"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        <section className="rounded-3xl bg-[#795548] p-6 text-white sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F1D9C2]">
                COMPANION SUPPORT
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                My Tickets
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#F8EDE3] sm:text-base">
                Having trouble? Raise a ticket and track your support requests
                in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setSuccess("");
                setError("");
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#795548] transition hover:bg-[#F8EDE3]"
            >
              <span className="text-xl" aria-hidden="true">
                +
              </span>
              Raise a Ticket
            </button>
          </div>
        </section>

        <section className="my-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
            <p className="text-sm text-[#8D776A]">Total Tickets</p>
            <p className="mt-2 text-3xl font-bold text-[#4E342E]">
              {tickets.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
            <p className="text-sm text-[#8D776A]">Awaiting Resolution</p>
            <p className="mt-2 text-3xl font-bold text-[#A16A2D]">
              {openCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
            <p className="text-sm text-[#8D776A]">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-[#47734B]">
              {resolvedCount}
            </p>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-[#E8B8B0] bg-[#FFF0EE] p-4 text-sm text-[#9F2920]"
          >
            {error}
            {error.toLowerCase().includes("load your tickets") && (
              <button
                type="button"
                onClick={() => void loadTickets()}
                className="ml-2 font-semibold underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-[#C8DDC8] bg-[#EFF7EF] p-4 text-sm text-[#356A40]"
          >
            {success}
          </div>
        )}

        {showForm && (
          <section className="mb-8 rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#4E342E]">
                  Raise a Support Ticket
                </h2>
                <p className="mt-2 text-sm text-[#8D776A]">
                  Describe the issue clearly so our support team can help.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close ticket form"
                className="rounded-lg px-3 py-1 text-xl text-[#795548] hover:bg-[#F5EEE7]"
              >
                ×
              </button>
            </div>

            <form onSubmit={createTicket} className="space-y-5">
              <div>
                <label
                  htmlFor="ticket-subject"
                  className="mb-2 block text-sm font-semibold text-[#4E342E]"
                >
                  Issue Title *
                </label>
                <input
                  id="ticket-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={120}
                  minLength={5}
                  required
                  placeholder="e.g. Unable to complete my verification"
                  className="w-full rounded-xl border border-[#E4D5C7] bg-[#FFFCF9] px-4 py-3 text-sm text-[#4E342E] outline-none focus:border-[#795548] focus:ring-2 focus:ring-[#795548]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ticket-category"
                    className="mb-2 block text-sm font-semibold text-[#4E342E]"
                  >
                    Issue Category *
                  </label>
                  <select
                    id="ticket-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E4D5C7] bg-[#FFFCF9] px-4 py-3 text-sm text-[#4E342E] outline-none focus:border-[#795548]"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ticket-priority"
                    className="mb-2 block text-sm font-semibold text-[#4E342E]"
                  >
                    Priority *
                  </label>
                  <select
                    id="ticket-priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as TicketPriority)
                    }
                    required
                    className="w-full rounded-xl border border-[#E4D5C7] bg-[#FFFCF9] px-4 py-3 text-sm text-[#4E342E] outline-none focus:border-[#795548]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="ticket-description"
                  className="mb-2 block text-sm font-semibold text-[#4E342E]"
                >
                  Describe Your Issue *
                </label>
                <textarea
                  id="ticket-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  minLength={20}
                  maxLength={3000}
                  rows={5}
                  placeholder="Tell us what happened, what you expected, and any steps you already tried..."
                  className="w-full resize-y rounded-xl border border-[#E4D5C7] bg-[#FFFCF9] px-4 py-3 text-sm text-[#4E342E] outline-none focus:border-[#795548] focus:ring-2 focus:ring-[#795548]/10"
                />
                <p className="mt-1 text-right text-xs text-[#8D776A]">
                  {description.length}/3000
                </p>
              </div>

              <div className="rounded-xl bg-[#FAF6F0] p-4 text-xs leading-5 text-[#7D6E65]">
                Do not include your password, login codes, or unnecessary
                sensitive identity information in your ticket.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-[#E4D5C7] px-5 py-3 text-sm font-semibold text-[#795548] hover:bg-[#FAF6F0]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#795548] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#634439] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#4E342E]">
                Your Support History
              </h2>
              <p className="mt-1 text-sm text-[#8D776A]">
                Select a ticket to view its details and latest response.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadTickets()}
              disabled={loading}
              className="self-start rounded-lg border border-[#E4D5C7] bg-white px-4 py-2 text-sm font-semibold text-[#795548] hover:bg-[#FAF6F0] disabled:opacity-60 sm:self-auto"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#E9DED2] bg-white p-10 text-center text-sm text-[#8D776A]">
              Loading your tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCC9B8] bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5EADF] text-2xl text-[#795548]">
                ?
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#4E342E]">
                No tickets yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8D776A]">
                If you face an issue with your account, onboarding, bookings,
                or the platform, raise a ticket and track it here.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-xl bg-[#795548] px-5 py-3 text-sm font-semibold text-white hover:bg-[#634439]"
              >
                Raise Your First Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <button
                  type="button"
                  key={ticket._id}
                  onClick={() =>
                    setSelectedTicket(
                      selectedTicket?._id === ticket._id ? null : ticket
                    )
                  }
                  aria-expanded={selectedTicket?._id === ticket._id}
                  className="w-full rounded-2xl border border-[#E9DED2] bg-white p-5 text-left transition hover:border-[#C8AE98] sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#A07856]">
                        {ticket.ticketNumber ||
                          `Ticket ${ticket._id.slice(-6).toUpperCase()}`}
                      </p>
                      <h3 className="mt-2 break-words font-bold text-[#4E342E]">
                        {ticket.subject}
                      </h3>
                      <p className="mt-2 text-sm text-[#8D776A]">
                        {ticket.category} ·{" "}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-bold ${priorityStyles[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[ticket.status]}`}
                      >
                        {statusLabels[ticket.status]}
                      </span>
                    </div>
                  </div>

                  {selectedTicket?._id === ticket._id && (
                    <div className="mt-5 space-y-4 border-t border-[#F0E7DE] pt-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#A07856]">
                          Issue Description
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6D5D53]">
                          {ticket.description}
                        </p>
                      </div>

                      {ticket.adminReply && (
                        <div className="rounded-xl border border-[#E9DED2] bg-[#FAF6F0] p-4">
                          <p className="text-sm font-bold text-[#4E342E]">
                            Support Team Response
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6D5D53]">
                            {ticket.adminReply}
                          </p>
                        </div>
                      )}

                      {ticket.status === "WAITING_FOR_USER" && (
                        <p className="text-sm font-medium text-[#95542B]">
                          The support team needs more information from you.
                          Follow the instructions provided by the team.
                        </p>
                      )}

                      <p className="text-xs text-[#8D776A]">
                        Last updated:{" "}
                        {new Date(
                          ticket.updatedAt || ticket.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="flex flex-wrap justify-center gap-6 py-8 text-sm text-[#795548]">
          <Link to="/companion/help" className="hover:underline">
            Help & Support
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default MyTickets;

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  HelpCircle,
  Mail,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Ticket as TicketIcon,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

type TicketPriority = "Low" | "Normal" | "High";

type TicketCategory =
  | "Booking"
  | "Companion"
  | "Payment"
  | "Safety"
  | "Account"
  | "Other";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  userName: string;
  userEmail: string;
};

const mockTickets: Ticket[] = [
  {
    id: "ES-284621",
    subject: "Need to change upcoming session time",
    message:
      "I need help changing the timing of my mother's upcoming companionship session.",
    category: "Booking",
    status: "In Progress",
    priority: "Normal",
    createdAt: "2026-10-03T09:30:00",
    userName: "Prince",
    userEmail: "prince@example.com",
  },
  {
    id: "ES-281904",
    subject: "Question about companion availability",
    message:
      "I would like to understand the companion availability for weekend sessions.",
    category: "Companion",
    status: "Open",
    priority: "Normal",
    createdAt: "2026-10-02T14:15:00",
    userName: "Prince",
    userEmail: "prince@example.com",
  },
  {
    id: "ES-276532",
    subject: "Payment transaction clarification",
    message:
      "I have a question regarding a recent payment shown in my transaction history.",
    category: "Payment",
    status: "Resolved",
    priority: "Low",
    createdAt: "2026-09-28T11:45:00",
    userName: "Prince",
    userEmail: "prince@example.com",
  },
  {
    id: "ES-271885",
    subject: "Profile information update",
    message:
      "I needed help updating some family account information.",
    category: "Account",
    status: "Closed",
    priority: "Low",
    createdAt: "2026-09-22T16:20:00",
    userName: "Prince",
    userEmail: "prince@example.com",
  },
];

const statusOptions = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
] as const;

const categoryOptions = [
  "All",
  "Booking",
  "Companion",
  "Payment",
  "Safety",
  "Account",
  "Other",
] as const;

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const stored = localStorage.getItem("familyTickets");

    if (!stored) {
      return mockTickets;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return mockTickets;
    } catch {
      return mockTickets;
    }
  });

  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("All");

  const [categoryFilter, setCategoryFilter] =
    useState<(typeof categoryOptions)[number]>("All");

  const [search, setSearch] = useState("");

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [showFilters, setShowFilters] = useState(false);

  const [expandedTicket, setExpandedTicket] =
    useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        ticket.category === categoryFilter;

      if (!query) {
        return matchesStatus && matchesCategory;
      }

      const searchable =
        `${ticket.id} ${ticket.subject} ${ticket.message} ${ticket.category} ${ticket.status}`.toLowerCase();

      return (
        matchesStatus &&
        matchesCategory &&
        searchable.includes(query)
      );
    });
  }, [
    tickets,
    statusFilter,
    categoryFilter,
    search,
  ]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  const highPriorityCount = tickets.filter(
    (ticket) => ticket.priority === "High"
  ).length;

  const handleCloseTicket = (ticketId: string) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            status: "Closed" as TicketStatus,
          }
        : ticket
    );

    setTickets(updatedTickets);

    localStorage.setItem(
      "familyTickets",
      JSON.stringify(updatedTickets)
    );

    setSelectedTicket((current) =>
      current?.id === ticketId
        ? {
            ...current,
            status: "Closed",
          }
        : current
    );
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setCategoryFilter("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      {/* Header */}
      <section className="border-b border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F5139]">
                Support
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                My Tickets
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695D] sm:text-base">
                Track your support requests, view updates and
                manage conversations with EverSenior Customer Care.
              </p>
            </div>

            <Link
              to="/family/customer-care"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              <Plus className="h-4 w-4" />
              Create New Ticket
            </Link>

          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<TicketIcon className="h-5 w-5" />}
            label="Total Tickets"
            value={tickets.length}
            description="All support requests"
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Open"
            value={openCount}
            description="Awaiting support"
          />

          <StatCard
            icon={<MessageCircle className="h-5 w-5" />}
            label="In Progress"
            value={progressCount}
            description="Being reviewed"
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Resolved"
            value={resolvedCount}
            description={
              highPriorityCount > 0
                ? `${highPriorityCount} high priority`
                : "Successfully completed"
            }
          />

        </section>

        {/* Search + Filters */}
        <section className="mt-8 rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7765]" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tickets by ID, subject or category..."
                className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] py-3 pl-10 pr-4 text-sm text-[#30271F] outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                showFilters
                  ? "border-[#6F5139] bg-[#F3ECE3] text-[#6F5139]"
                  : "border-[#D5CABD] bg-white text-[#6F5139] hover:bg-[#FAF7F2]"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-[#E7DED3] pt-4 sm:grid-cols-2">

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(value) =>
                  setStatusFilter(
                    value as (typeof statusOptions)[number]
                  )
                }
              />

              <FilterSelect
                label="Category"
                value={categoryFilter}
                options={categoryOptions}
                onChange={(value) =>
                  setCategoryFilter(
                    value as (typeof categoryOptions)[number]
                  )
                }
              />

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#6F5139] hover:text-[#5F4633]"
                >
                  Clear all filters
                </button>
              </div>

            </div>
          )}
        </section>

        {/* Ticket List */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5139]">
                Support requests
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#30271F]">
                {filteredTickets.length}{" "}
                {filteredTickets.length === 1
                  ? "ticket"
                  : "tickets"}
              </h2>
            </div>

            {(search ||
              statusFilter !== "All" ||
              categoryFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#6F5139]"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const expanded =
                  expandedTicket === ticket.id;

                return (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    expanded={expanded}
                    onToggle={() =>
                      setExpandedTicket(
                        expanded ? null : ticket.id
                      )
                    }
                    onView={() =>
                      setSelectedTicket(ticket)
                    }
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              hasFilters={
                Boolean(search) ||
                statusFilter !== "All" ||
                categoryFilter !== "All"
              }
              onClear={clearFilters}
            />
          )}
        </section>

        {/* Support Banner */}
        <section className="mt-10 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8DCCF] text-[#6F5139]">
                <HelpCircle className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#30271F]">
                  Can't find what you're looking for?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#76695D]">
                  Browse the Help Centre for common questions or
                  contact Customer Care for personalized assistance.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/family/help"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFC3B5] bg-white px-4 py-3 text-sm font-semibold text-[#6F5139] transition hover:bg-[#FAF7F2]"
              >
                Help Centre
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/family/customer-care"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                Customer Care
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* Safety */}
        <section className="mt-5 rounded-2xl border border-[#E5D3C9] bg-[#FBF2EC] p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8A5145]" />

            <div>
              <p className="text-sm font-semibold text-[#5E3B34]">
                Safety concerns need immediate attention
              </p>

              <p className="mt-1 text-xs leading-5 text-[#80645C]">
                If a senior is in immediate danger or needs urgent
                medical assistance, contact local emergency services
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
        </section>

      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onCloseTicket={() =>
            handleCloseTicket(selectedTicket.id)
          }
        />
      )}

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
              to="/family/customer-care"
              className="hover:text-[#6F5139]"
            >
              Customer Care
            </Link>

            <Link
              to="/family/safety"
              className="hover:text-[#6F5139]"
            >
              Safety
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ticket Card                                                                */
/* -------------------------------------------------------------------------- */

function TicketCard({
  ticket,
  expanded,
  onToggle,
  onView,
}: {
  ticket: Ticket;
  expanded: boolean;
  onToggle: () => void;
  onView: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-sm transition hover:shadow-md">

      <div className="p-5 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex min-w-0 gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
              <TicketIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-[#8A7765]">
                  #{ticket.id}
                </span>

                <StatusBadge status={ticket.status} />

                <PriorityBadge priority={ticket.priority} />
              </div>

              <h3 className="mt-2 text-base font-semibold text-[#30271F] sm:text-lg">
                {ticket.subject}
              </h3>

              <p className="mt-1 text-xs text-[#8A7765]">
                {ticket.category} •{" "}
                {formatDate(ticket.createdAt)}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onView}
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#CFC3B5] bg-white px-4 py-2.5 text-xs font-semibold text-[#6F5139] transition hover:bg-[#FAF7F2]"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>

        <div className="mt-5 grid gap-3 border-t border-[#E7DED3] pt-4 sm:grid-cols-3">

          <InfoItem
            label="Category"
            value={ticket.category}
          />

          <InfoItem
            label="Created"
            value={formatDate(ticket.createdAt)}
          />

          <InfoItem
            label="Status"
            value={ticket.status}
          />

        </div>

        <button
          type="button"
          onClick={onToggle}
          className="mt-4 flex w-full items-center justify-between border-t border-[#E7DED3] pt-4 text-left"
        >
          <span className="text-xs font-semibold text-[#6F5139]">
            {expanded
              ? "Hide request details"
              : "View request details"}
          </span>

          <ChevronDown
            className={`h-4 w-4 text-[#8A7765] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="mt-4 rounded-xl bg-[#FAF7F2] p-4">
            <p className="text-xs font-semibold text-[#30271F]">
              Your message
            </p>

            <p className="mt-2 text-sm leading-6 text-[#76695D]">
              {ticket.message}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#8A7765]">
              <UserRound className="h-4 w-4" />
              Submitted by {ticket.userName}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

function TicketModal({
  ticket,
  onClose,
  onCloseTicket,
}: {
  ticket: Ticket;
  onClose: () => void;
  onCloseTicket: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#30271F]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E2DBD0] bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E7DED3] bg-white p-5 sm:p-6">

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-[#8A7765]">
                #{ticket.id}
              </span>

              <StatusBadge status={ticket.status} />
            </div>

            <h2 className="mt-2 text-xl font-semibold text-[#30271F]">
              {ticket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#8A7765] transition hover:bg-[#F3ECE3] hover:text-[#6F5139]"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Modal Body */}
        <div className="space-y-6 p-5 sm:p-6">

          {/* Status */}
          <div className="grid gap-3 sm:grid-cols-3">

            <ModalInfo
              label="Category"
              value={ticket.category}
            />

            <ModalInfo
              label="Priority"
              value={ticket.priority}
            />

            <ModalInfo
              label="Created"
              value={formatDate(ticket.createdAt)}
            />

          </div>

          {/* Request */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A7765]">
              Your request
            </p>

            <div className="mt-2 rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-4">
              <p className="text-sm leading-7 text-[#4C4035]">
                {ticket.message}
              </p>
            </div>
          </div>

          {/* Current status */}
          <div className="rounded-xl border border-[#E2DBD0] bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFE6DA] text-[#6F5139]">
                <Clock3 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#30271F]">
                  Current status
                </p>

                <p className="mt-1 text-xs leading-5 text-[#76695D]">
                  {getStatusDescription(ticket.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="rounded-xl border border-[#E2DBD0] bg-[#F3ECE3] p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

              <div>
                <p className="text-sm font-semibold text-[#30271F]">
                  Need to add more information?
                </p>

                <p className="mt-1 text-xs leading-5 text-[#76695D]">
                  Contact Customer Care if you need to provide
                  additional details about this request.
                </p>

                <Link
                  to="/family/customer-care"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]"
                >
                  Contact Customer Care
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex flex-col gap-3 border-t border-[#E7DED3] bg-[#FAF7F2] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div className="flex items-center gap-2 text-xs text-[#8A7765]">
            <Mail className="h-4 w-4" />
            support@eversenior.in
          </div>

          {ticket.status !== "Closed" &&
          ticket.status !== "Resolved" ? (
            <button
              type="button"
              onClick={onCloseTicket}
              className="rounded-xl border border-[#CFC3B5] bg-white px-4 py-2.5 text-xs font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
            >
              Mark as Closed
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F7657]">
              <CheckCircle2 className="h-4 w-4" />
              Ticket completed
            </span>
          )}

        </div>

      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-[#30271F]">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-[#30271F]">
        {label}
      </p>

      <p className="mt-1 text-xs text-[#8A7765]">
        {description}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#4C4035]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#30271F] outline-none transition focus:border-[#6F5139] focus:ring-4 focus:ring-[#6F5139]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.08em] text-[#A09283]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#4C4035]">
        {value}
      </p>
    </div>
  );
}

function ModalInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-3">
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#A09283]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#4C4035]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TicketStatus;
}) {
  const styles: Record<TicketStatus, string> = {
    Open: "bg-[#F3ECE3] text-[#7B624B]",
    "In Progress": "bg-[#EEE8F4] text-[#6B547C]",
    Resolved: "bg-[#E8F0E5] text-[#5F7657]",
    Closed: "bg-[#ECE9E5] text-[#756C63]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: TicketPriority;
}) {
  const styles: Record<TicketPriority, string> = {
    Low: "bg-[#F4F0EA] text-[#887968]",
    Normal: "bg-[#F0ECE6] text-[#786858]",
    High: "bg-[#FBEBE6] text-[#9A5F51]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
        <TicketIcon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#30271F]">
        {hasFilters
          ? "No tickets found"
          : "You don't have any tickets yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76695D]">
        {hasFilters
          ? "Try changing your search or filters to find the support request you're looking for."
          : "If you need help with a booking, companion, payment or account, our Customer Care team is here for you."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl border border-[#CFC3B5] bg-white px-5 py-3 text-sm font-semibold text-[#6F5139] hover:bg-[#FAF7F2]"
        >
          Clear Filters
        </button>
      ) : (
        <Link
          to="/family/customer-care"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
        >
          <Plus className="h-4 w-4" />
          Create Support Ticket
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusDescription(status: TicketStatus) {
  switch (status) {
    case "Open":
      return "Your request has been received and is waiting for review by Customer Care.";

    case "In Progress":
      return "A Customer Care representative is currently reviewing your request.";

    case "Resolved":
      return "Your request has been addressed. Contact Customer Care again if you need further assistance.";

    case "Closed":
      return "This support request has been closed.";

    default:
      return "Your support request is being handled by Customer Care.";
  }
}
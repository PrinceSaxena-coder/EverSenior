import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity as ActivityIcon,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Heart,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import FamilyNavbar from "./FamilyNavbar";

type ActivityType =
  | "session"
  | "companion"
  | "payment"
  | "message"
  | "safety"
  | "booking"
  | "account";

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  person?: string;
  senior?: string;
  date: string;
  time: string;
  status?: string;
  amount?: number;
};

const activities: ActivityItem[] = [
  {
    id: "activity-1",
    type: "session",
    title: "Session completed",
    description:
      "Social Companionship session was completed successfully.",
    person: "Ananya",
    senior: "Mrs. Sharma",
    date: "04 Oct 2026",
    time: "7:02 PM",
    status: "Completed",
  },
  {
    id: "activity-2",
    type: "payment",
    title: "Payment completed",
    description:
      "Payment for Social Companionship was successfully processed.",
    person: "Ananya",
    senior: "Mrs. Sharma",
    date: "04 Oct 2026",
    time: "4:12 PM",
    status: "Paid",
    amount: 600,
  },
  {
    id: "activity-3",
    type: "companion",
    title: "Companion checked in",
    description:
      "Ananya checked in for the scheduled companionship session.",
    person: "Ananya",
    senior: "Mrs. Sharma",
    date: "04 Oct 2026",
    time: "5:01 PM",
    status: "Checked in",
  },
  {
    id: "activity-4",
    type: "message",
    title: "New message received",
    description:
      "Ananya sent an update regarding Mrs. Sharma's session.",
    person: "Ananya",
    senior: "Mrs. Sharma",
    date: "04 Oct 2026",
    time: "4:48 PM",
    status: "Unread",
  },
  {
    id: "activity-5",
    type: "safety",
    title: "Safety check completed",
    description:
      "Routine wellbeing check completed for Mr. Saxena.",
    senior: "Mr. Saxena",
    date: "03 Oct 2026",
    time: "8:30 PM",
    status: "All clear",
  },
  {
    id: "activity-6",
    type: "booking",
    title: "Session booked",
    description:
      "Outing Companionship session has been scheduled.",
    person: "Rajiv Mehta",
    senior: "Mr. Saxena",
    date: "03 Oct 2026",
    time: "2:15 PM",
    status: "Confirmed",
    amount: 900,
  },
  {
    id: "activity-7",
    type: "session",
    title: "Upcoming session confirmed",
    description:
      "Your upcoming Hobbies & Interests session is confirmed.",
    person: "Ananya",
    senior: "Mrs. Sharma",
    date: "02 Oct 2026",
    time: "6:40 PM",
    status: "Confirmed",
  },
  {
    id: "activity-8",
    type: "companion",
    title: "Companion verification completed",
    description:
      "Ananya's profile verification was successfully completed.",
    person: "Ananya",
    date: "01 Oct 2026",
    time: "11:20 AM",
    status: "Verified",
  },
  {
    id: "activity-9",
    type: "message",
    title: "Message sent",
    description:
      "You sent a message to Rajiv Mehta regarding an upcoming session.",
    person: "Rajiv Mehta",
    senior: "Mr. Saxena",
    date: "30 Sep 2026",
    time: "5:32 PM",
    status: "Sent",
  },
  {
    id: "activity-10",
    type: "payment",
    title: "Payment refunded",
    description:
      "The payment for the cancelled session was refunded.",
    person: "Rajiv Mehta",
    senior: "Mr. Saxena",
    date: "25 Sep 2026",
    time: "3:45 PM",
    status: "Refunded",
    amount: 600,
  },
];

const filterOptions = [
  "All Activity",
  "Sessions",
  "Companions",
  "Payments",
  "Messages",
  "Safety",
  "Bookings",
];

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "session":
      return CalendarDays;
    case "companion":
      return UserCheck;
    case "payment":
      return CreditCard;
    case "message":
      return MessageCircle;
    case "safety":
      return ShieldCheck;
    case "booking":
      return CheckCircle2;
    case "account":
      return Users;
    default:
      return ActivityIcon;
  }
}

function getIconWrapper(type: ActivityType) {
  switch (type) {
    case "safety":
      return "bg-[#E8F1E9] text-[#52705A]";
    case "payment":
      return "bg-[#F3EBDD] text-[#7A5C3D]";
    case "message":
      return "bg-[#EEE7DD] text-[#6F5139]";
    case "companion":
      return "bg-[#E9EFE9] text-[#5D705F]";
    case "booking":
    case "session":
      return "bg-[#F1E7DB] text-[#6F5139]";
    default:
      return "bg-[#F3ECE3] text-[#6F5139]";
  }
}

function getStatusStyle(status?: string) {
  switch (status) {
    case "Completed":
    case "Paid":
    case "Verified":
    case "All clear":
    case "Confirmed":
    case "Checked in":
      return "bg-[#E9F1EA] text-[#55705B]";

    case "Refunded":
      return "bg-[#F2EAE2] text-[#765A43]";

    case "Unread":
      return "bg-[#F5E6D8] text-[#8A5A36]";

    default:
      return "bg-[#F3ECE3] text-[#6F5139]";
  }
}

function getFilterType(filter: string): ActivityType | null {
  switch (filter) {
    case "Sessions":
      return "session";
    case "Companions":
      return "companion";
    case "Payments":
      return "payment";
    case "Messages":
      return "message";
    case "Safety":
      return "safety";
    case "Bookings":
      return "booking";
    default:
      return null;
  }
}

export default function Activity() {
  const [selectedFilter, setSelectedFilter] = useState("All Activity");
  const [search, setSearch] = useState("");

  const filteredActivities = useMemo(() => {
    const filterType = getFilterType(selectedFilter);

    return activities.filter((activity) => {
      const matchesFilter =
        !filterType || activity.type === filterType;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.person?.toLowerCase().includes(query) ||
        activity.senior?.toLowerCase().includes(query) ||
        activity.status?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, search]);

  const todayCount = activities.filter(
    (activity) => activity.date === "04 Oct 2026"
  ).length;

  const sessionCount = activities.filter(
    (activity) => activity.type === "session"
  ).length;

  const paymentCount = activities.filter(
    (activity) => activity.type === "payment"
  ).length;

  const safetyCount = activities.filter(
    (activity) => activity.type === "safety"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main>
        {/* Hero */}
        <section className="border-b border-[#E4DDD2] bg-[#F7F3EC]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6F5139]">
                  <ActivityIcon className="h-4 w-4" />
                  Family Activity
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl lg:text-5xl">
                  Stay connected with everything happening.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#75685B] sm:text-lg">
                  See sessions, companion updates, payments, messages and
                  safety activity across your family account.
                </p>
              </div>

              <Link
                to="/family/notifications"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#DCCFC0] bg-white px-4 py-3 text-sm font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
              >
                <Bell className="h-4 w-4" />
                View notifications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<ActivityIcon className="h-5 w-5" />}
              label="Today's activity"
              value={todayCount.toString()}
            />

            <SummaryCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Session activity"
              value={sessionCount.toString()}
            />

            <SummaryCard
              icon={<CreditCard className="h-5 w-5" />}
              label="Payment activity"
              value={paymentCount.toString()}
            />

            <SummaryCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Safety checks"
              value={safetyCount.toString()}
            />
          </div>
        </section>

        {/* Activity */}
        <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white shadow-[0_8px_30px_rgba(76,57,39,0.05)]">
            {/* Header */}
            <div className="border-b border-[#E8E1D8] p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#30271F]">
                    Activity timeline
                  </h2>
                  <p className="mt-1 text-sm text-[#817468]">
                    A complete view of recent activity on your account.
                  </p>
                </div>

                <div className="w-full lg:max-w-xs">
                  <label htmlFor="activity-search" className="sr-only">
                    Search activity
                  </label>

                  <input
                    id="activity-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search activity..."
                    className="w-full rounded-xl border border-[#DDD4C8] bg-[#FBF9F5] px-4 py-3 text-sm text-[#30271F] outline-none transition placeholder:text-[#A1968A] focus:border-[#8A6A4D] focus:ring-2 focus:ring-[#8A6A4D]/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {filterOptions.map((filter) => {
                  const active = selectedFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#6F5139] text-white"
                          : "border border-[#DDD4C8] bg-[#FBF9F5] text-[#6F6256] hover:bg-[#F3ECE3]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5 sm:p-6">
              {filteredActivities.length > 0 ? (
                <div className="relative">
                  <div className="absolute bottom-5 left-[22px] top-5 hidden w-px bg-[#E7DFD5] sm:block" />

                  <div className="space-y-7">
                    {filteredActivities.map((activity) => {
                      const Icon = getActivityIcon(activity.type);

                      return (
                        <div
                          key={activity.id}
                          className="relative flex gap-4"
                        >
                          {/* Icon */}
                          <div
                            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getIconWrapper(
                              activity.type
                            )}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1 rounded-2xl border border-[#E9E2D9] bg-[#FCFAF7] p-4 sm:p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-[#30271F]">
                                    {activity.title}
                                  </h3>

                                  {activity.status && (
                                    <span
                                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                        activity.status
                                      )}`}
                                    >
                                      {activity.status}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-2 text-sm leading-6 text-[#75685B]">
                                  {activity.description}
                                </p>

                                {(activity.person || activity.senior) && (
                                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6F6256]">
                                    {activity.person && (
                                      <span>
                                        Companion:{" "}
                                        <strong className="font-medium text-[#4F4033]">
                                          {activity.person}
                                        </strong>
                                      </span>
                                    )}

                                    {activity.senior && (
                                      <span>
                                        Senior:{" "}
                                        <strong className="font-medium text-[#4F4033]">
                                          {activity.senior}
                                        </strong>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 text-left sm:text-right">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A7D70] sm:justify-end">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {activity.time}
                                </div>

                                <p className="mt-1 text-xs text-[#A09487]">
                                  {activity.date}
                                </p>

                                {activity.amount !== undefined && (
                                  <p className="mt-2 text-sm font-semibold text-[#6F5139]">
                                    ₹{activity.amount.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                    <ActivityIcon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-[#30271F]">
                    No activity found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817468]">
                    Try changing your filters or search for something else.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedFilter("All Activity");
                    }}
                    className="mt-5 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5F4633]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Helpful Links */}
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <QuickLink
              icon={<CalendarDays className="h-5 w-5" />}
              title="View bookings"
              description="Manage upcoming and past sessions."
              href="/family/bookings"
            />

            <QuickLink
              icon={<MessageCircle className="h-5 w-5" />}
              title="Open messages"
              description="Stay connected with companions."
              href="/family/messages"
            />

            <QuickLink
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Safety Center"
              description="Review your senior's safety information."
              href="/family/safety"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-[#796D60] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#6F5139]" />
            <span>Built around trust, companionship and peace of mind.</span>
          </div>

          <Link
            to="/family/customer-care"
            className="font-medium text-[#6F5139] hover:underline"
          >
            Need help?
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(76,57,39,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>

        <ArrowRight className="h-4 w-4 text-[#B0A398]" />
      </div>

      <p className="mt-5 text-2xl font-semibold text-[#30271F]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#817468]">{label}</p>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#CDBEAE] hover:shadow-[0_8px_25px_rgba(76,57,39,0.06)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>

        <ArrowRight className="h-4 w-4 text-[#B0A398] transition group-hover:translate-x-1 group-hover:text-[#6F5139]" />
      </div>

      <h3 className="mt-5 font-semibold text-[#30271F]">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-[#817468]">
        {description}
      </p>
    </Link>
  );
}
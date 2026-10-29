import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  CalendarDays,
  Heart,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  UserRound,
  Clock3,
  AlertTriangle,
  Settings,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type NotificationType =
  | "booking"
  | "session"
  | "safety"
  | "message"
  | "payment"
  | "companion"
  | "system";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  important?: boolean;
  link?: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "session",
    title: "Session starting soon",
    message:
      "Ananya's Social Companionship session with Mrs. Sharma starts today at 5:00 PM.",
    time: "10 min ago",
    date: "Today",
    read: false,
    link: "/family/bookings",
  },
  {
    id: 2,
    type: "companion",
    title: "Companion arrived",
    message:
      "Ananya has checked in for Mrs. Sharma's scheduled companionship session.",
    time: "35 min ago",
    date: "Today",
    read: false,
    link: "/family/seniors/1",
  },
  {
    id: 3,
    type: "message",
    title: "New message from Ananya",
    message:
      "Ananya sent you an update about Mrs. Sharma's afternoon activities.",
    time: "1 hr ago",
    date: "Today",
    read: false,
    link: "/family/messages",
  },
  {
    id: 4,
    type: "booking",
    title: "Booking confirmed",
    message:
      "Your Outing Companionship session with Rajiv Mehta for Mr. Saxena has been confirmed.",
    time: "3 hrs ago",
    date: "Today",
    read: true,
    link: "/family/bookings",
  },
  {
    id: 5,
    type: "safety",
    title: "Safety check completed",
    message:
      "Mrs. Sharma's latest companion session completed successfully with no safety concerns reported.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
    link: "/family/safety",
  },
  {
    id: 6,
    type: "payment",
    title: "Payment successful",
    message:
      "₹600 payment for Social Companionship with Mrs. Sharma was processed successfully.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
    link: "/family/payments",
  },
  {
    id: 7,
    type: "companion",
    title: "Companion availability updated",
    message:
      "Rajiv Mehta is now available for additional sessions this weekend.",
    time: "2 days ago",
    date: "2 days ago",
    read: true,
    link: "/family/companions",
  },
  {
    id: 8,
    type: "booking",
    title: "Upcoming session reminder",
    message:
      "Mr. Saxena has an Outing Companionship session tomorrow from 10:00 AM to 1:00 PM.",
    time: "2 days ago",
    date: "2 days ago",
    read: true,
    link: "/family/bookings",
  },
  {
    id: 9,
    type: "system",
    title: "Profile information updated",
    message:
      "Your family account information was updated successfully.",
    time: "4 days ago",
    date: "4 days ago",
    read: true,
    link: "/family/profile",
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "booking":
      return CalendarDays;

    case "session":
      return Clock3;

    case "safety":
      return ShieldCheck;

    case "message":
      return MessageCircle;

    case "payment":
      return CreditCard;

    case "companion":
      return UserRound;

    default:
      return Bell;
  }
}

function getIconWrapper(type: NotificationType) {
  switch (type) {
    case "safety":
      return "bg-[#E8F0E9] text-[#58705A]";

    case "payment":
      return "bg-[#F2E9DD] text-[#8A6546]";

    case "message":
      return "bg-[#ECE5DC] text-[#6F5139]";

    case "session":
      return "bg-[#F0E8DE] text-[#76563C]";

    case "companion":
      return "bg-[#E9E4DC] text-[#66513F]";

    case "booking":
      return "bg-[#F3ECE3] text-[#6F5139]";

    default:
      return "bg-[#EEE9E1] text-[#6B6258]";
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications;
  }, [filter, notifications]);

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const removeNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F5139] text-white">
                  <Bell size={19} />
                </div>

                <span className="text-sm font-medium text-[#76563C]">
                  Family Updates
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756A60] sm:text-base">
                Stay updated about your seniors, companions, bookings,
                payments, and important safety activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2DBD0] bg-white px-4 py-2.5 text-sm font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
              >
                <CheckCheck size={17} />
                Mark all as read
              </button>
            )}
          </div>
        </section>

        {/* Summary */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Total notifications</p>
                <p className="mt-1 text-2xl font-semibold">
                  {notifications.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Bell size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Unread</p>
                <p className="mt-1 text-2xl font-semibold">{unreadCount}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E9DD] text-[#8A6546]">
                <AlertTriangle size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Safety updates</p>
                <p className="mt-1 text-2xl font-semibold">
                  {notifications.filter((item) => item.type === "safety").length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#58705A]">
                <ShieldCheck size={19} />
              </div>
            </div>
          </div>
        </section>

        {/* Notification Workspace */}
        <section className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
          {/* Filters */}
          <div className="flex flex-col gap-4 border-b border-[#E8E1D7] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-[#6F5139] text-white"
                    : "text-[#6B6258] hover:bg-[#F3ECE3]"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === "unread"
                    ? "bg-[#6F5139] text-white"
                    : "text-[#6B6258] hover:bg-[#F3ECE3]"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${
                      filter === "unread"
                        ? "bg-white/20 text-white"
                        : "bg-[#F2E9DD] text-[#76563C]"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <Link
              to="/family/settings"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#6F5139] hover:text-[#5F4633]"
            >
              <Settings size={16} />
              Notification settings
            </Link>
          </div>

          {/* Notifications */}
          <div>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <Bell size={27} />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  You're all caught up
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#756A60]">
                  There are no unread notifications right now. We'll let you
                  know when something needs your attention.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`group relative border-b border-[#EEE8DF] p-4 transition last:border-b-0 sm:p-5 ${
                      notification.read
                        ? "bg-white hover:bg-[#FCFAF7]"
                        : "bg-[#FBF7F1] hover:bg-[#F8F1E8]"
                    }`}
                  >
                    {!notification.read && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-[#6F5139]" />
                    )}

                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconWrapper(
                          notification.type
                        )}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-[#30271F]">
                                {notification.title}
                              </h3>

                              {!notification.read && (
                                <span className="rounded-full bg-[#6F5139] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  New
                                </span>
                              )}

                              {notification.important && (
                                <span className="rounded-full bg-[#F3E2D8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8A513B]">
                                  Important
                                </span>
                              )}
                            </div>

                            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#756A60]">
                              {notification.message}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-[#94887B]">
                            {notification.time}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {notification.link && (
                            <Link
                              to={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3ECE3] px-3 py-2 text-xs font-semibold text-[#6F5139] transition hover:bg-[#EDE2D5]"
                            >
                              View details
                              <ChevronRight size={14} />
                            </Link>
                          )}

                          {!notification.read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(notification.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#6B6258] transition hover:bg-[#F3ECE3]"
                            >
                              <CheckCheck size={14} />
                              Mark as read
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeNotification(notification.id)
                            }
                            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#9A8E82] opacity-100 transition hover:bg-[#F7EDEA] hover:text-[#8A513B] sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label={`Delete ${notification.title}`}
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Safety reminder */}
        <section className="mt-8 rounded-2xl border border-[#DCD7CE] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#30271F]">
                  Your senior's safety comes first
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#756A60]">
                  Review companion activity, session updates, and safety
                  information from your Family dashboard.
                </p>
              </div>
            </div>

            <Link
              to="/family/safety"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Safety Center
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#E2DBD0] pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#6F5139]">
            <Heart size={15} />
            <span>Built around care, trust and connection.</span>
          </div>

          <p className="mt-2 text-xs text-[#94887B]">
            EverSenior helps families stay connected with the people they care
            about.
          </p>
        </footer>
      </main>
    </div>
  );
}
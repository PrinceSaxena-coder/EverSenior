import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Info,
  MessageCircle,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type NotificationType =
  | "session"
  | "message"
  | "earning"
  | "reminder"
  | "account"
  | "system";

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  actionLabel?: string;
  actionPath?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "session",
    title: "New session request",
    description:
      "Prince Saxena has requested a Coffee & Conversation session for 12 October at 4:00 PM.",
    time: "10 min ago",
    date: "Today",
    read: false,
    actionLabel: "View Session",
    actionPath: "/companion/sessions",
  },
  {
    id: 2,
    type: "reminder",
    title: "Upcoming session tomorrow",
    description:
      "Your session with Rajiv Mehta is tomorrow at 5:30 PM in Noida Sector 62.",
    time: "1 hour ago",
    date: "Today",
    read: false,
    actionLabel: "View Session",
    actionPath: "/companion/sessions",
  },
  {
    id: 3,
    type: "message",
    title: "New message from Meera Kapoor",
    description:
      "Meera Kapoor sent you a new message about your upcoming session.",
    time: "2 hours ago",
    date: "Today",
    read: false,
    actionLabel: "Open Message",
    actionPath: "/companion/messages",
  },
  {
    id: 4,
    type: "earning",
    title: "₹600 added to your Pocket",
    description:
      "Your earning from the completed Coffee & Conversation session has been credited.",
    time: "Yesterday",
    date: "11 Oct 2026",
    read: true,
    actionLabel: "View Pocket",
    actionPath: "/companion/pocket",
  },
  {
    id: 5,
    type: "session",
    title: "Session confirmed",
    description:
      "Your session with Meera Kapoor has been confirmed for 28 September at 3:00 PM.",
    time: "2 days ago",
    date: "09 Oct 2026",
    read: true,
    actionLabel: "View Session",
    actionPath: "/companion/sessions",
  },
  {
    id: 6,
    type: "account",
    title: "Identity verification completed",
    description:
      "Your companion identity verification was successfully completed.",
    time: "4 days ago",
    date: "07 Oct 2026",
    read: true,
    actionLabel: "View Profile",
    actionPath: "/companion/profile",
  },
  {
    id: 7,
    type: "earning",
    title: "₹2,000 payout completed",
    description:
      "Your payout has been successfully transferred to your verified bank account.",
    time: "5 days ago",
    date: "06 Oct 2026",
    read: true,
    actionLabel: "View Payout",
    actionPath: "/companion/pocket",
  },
  {
    id: 8,
    type: "system",
    title: "Complete your availability",
    description:
      "Set your preferred days and time slots so we can show you sessions that fit your schedule.",
    time: "1 week ago",
    date: "29 Sep 2026",
    read: true,
    actionLabel: "Set Availability",
    actionPath: "/companion/sessions",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      initialNotifications
    );

  const [activeFilter, setActiveFilter] =
    useState<"all" | "unread">("all");

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const filteredNotifications =
    notifications.filter(
      (notification) => {
        if (activeFilter === "unread") {
          return !notification.read;
        }

        return true;
      }
    );

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
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

  const removeNotification = (
    id: number
  ) => {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <CompanionNavbar />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="mb-2 text-sm font-semibold text-[#7A624C]">
                Stay updated
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716458] sm:text-base">
                Important updates about your
                sessions, messages, earnings and
                companion account.
              </p>
            </div>

            {unreadCount > 0 && (
              <div className="flex items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm ring-1 ring-[#E4DDD3] md:self-auto">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#6F5139] px-1.5 text-xs font-semibold text-white">
                  {unreadCount}
                </span>

                <span className="text-[#65594E]">
                  unread notifications
                </span>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex w-fit items-center gap-1 rounded-xl border border-[#E1D8CE] bg-white p-1">

            <button
              onClick={() =>
                setActiveFilter("all")
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeFilter === "all"
                  ? "bg-[#6F5139] text-white"
                  : "text-[#65594E] hover:bg-[#F3ECE3]"
              }`}
            >
              All
            </button>

            <button
              onClick={() =>
                setActiveFilter("unread")
              }
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeFilter === "unread"
                  ? "bg-[#6F5139] text-white"
                  : "text-[#65594E] hover:bg-[#F3ECE3]"
              }`}
            >
              Unread

              {unreadCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                    activeFilter ===
                    "unread"
                      ? "bg-white/20 text-white"
                      : "bg-[#F3ECE3] text-[#6F5139]"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

          </div>

          <div className="flex items-center gap-3">

            {unreadCount > 0 && (
              <button
                onClick={
                  markAllAsRead
                }
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={
                  clearAllNotifications
                }
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#8B5A4A] transition hover:bg-[#F8EFEB]"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        <div className="mt-5">

          {filteredNotifications.length >
          0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#E3DBD1] bg-white">

              {filteredNotifications.map(
                (
                  notification,
                  index
                ) => (
                  <NotificationCard
                    key={
                      notification.id
                    }
                    notification={
                      notification
                    }
                    isLast={
                      index ===
                      filteredNotifications.length -
                        1
                    }
                    onRead={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    onRemove={() =>
                      removeNotification(
                        notification.id
                      )
                    }
                  />
                )
              )}

            </div>
          ) : (
            <EmptyNotifications
              unreadOnly={
                activeFilter ===
                "unread"
              }
            />
          )}

        </div>

        {/* =================================================
            NOTIFICATION INFO
        ================================================= */}

        <div className="mt-5 rounded-2xl border border-[#E5DDD3] bg-[#F3ECE3] p-4 sm:p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
              <Bell size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#4B4036]">
                You'll always be notified about
                important updates
              </p>

              <p className="mt-1 text-xs leading-5 text-[#76695C]">
                Session requests, confirmations,
                cancellations, messages, earnings
                and account-related updates will
                appear here.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   NOTIFICATION CARD
========================================================= */

function NotificationCard({
  notification,
  isLast,
  onRead,
  onRemove,
}: {
  notification: NotificationItem;
  isLast: boolean;
  onRead: () => void;
  onRemove: () => void;
}) {
  const iconData =
    getNotificationIcon(
      notification.type
    );

  return (
    <div
      className={`group relative px-4 py-5 transition sm:px-6 ${
        !isLast
          ? "border-b border-[#EEE7DF]"
          : ""
      } ${
        notification.read
          ? "bg-white hover:bg-[#FCFAF7]"
          : "bg-[#FBF7F1] hover:bg-[#F8F2E9]"
      }`}
    >
      <div className="flex gap-4">

        {/* Icon */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconData.background} ${iconData.color}`}
        >
          {iconData.icon}
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h3
                  className={`text-sm ${
                    notification.read
                      ? "font-medium text-[#40362E]"
                      : "font-semibold text-[#30271F]"
                  }`}
                >
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F5139]" />
                )}

              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#74675B]">
                {notification.description}
              </p>

            </div>

            <span className="shrink-0 text-[11px] text-[#9A8B7C]">
              {notification.time}
            </span>

          </div>

          {/* Actions */}

          <div className="mt-4 flex flex-wrap items-center gap-2">

            {notification.actionLabel &&
              notification.actionPath && (
                <a
                  href={
                    notification.actionPath
                  }
                  onClick={onRead}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#6F5139] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  {notification.actionLabel}
                  <ChevronRight
                    size={13}
                  />
                </a>
              )}

            {!notification.read && (
              <button
                onClick={onRead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED4C9] bg-white px-3 py-2 text-xs font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
              >
                <Check size={13} />
                Mark as read
              </button>
            )}

          </div>

        </div>

        {/* Remove */}

        <button
          onClick={onRemove}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#A09284] opacity-0 transition hover:bg-[#F8EFEB] hover:text-[#8B5A4A] group-hover:opacity-100 sm:right-4"
          title="Remove notification"
        >
          <X size={15} />
        </button>

      </div>
    </div>
  );
}

/* =========================================================
   ICON CONFIG
========================================================= */

function getNotificationIcon(
  type: NotificationType
) {
  switch (type) {
    case "session":
      return {
        icon: (
          <CalendarDays size={19} />
        ),
        background: "bg-[#F3ECE3]",
        color: "text-[#6F5139]",
      };

    case "message":
      return {
        icon: (
          <MessageCircle size={19} />
        ),
        background: "bg-[#F0EAF4]",
        color: "text-[#715B7D]",
      };

    case "earning":
      return {
        icon: (
          <CircleDollarSign size={19} />
        ),
        background: "bg-[#EDF5EE]",
        color: "text-[#47714E]",
      };

    case "reminder":
      return {
        icon: <Clock3 size={19} />,
        background: "bg-[#F8F0E2]",
        color: "text-[#9A7443]",
      };

    case "account":
      return {
        icon: (
          <ShieldCheck size={19} />
        ),
        background: "bg-[#EAF2F5]",
        color: "text-[#50707D]",
      };

    case "system":
    default:
      return {
        icon: <Info size={19} />,
        background: "bg-[#F3ECE3]",
        color: "text-[#6F5139]",
      };
  }
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyNotifications({
  unreadOnly,
}: {
  unreadOnly: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E3DBD1] bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3ECE3] text-[#6F5139]">
        <Bell size={24} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-[#30271F]">
        {unreadOnly
          ? "You're all caught up"
          : "No notifications"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A6D60]">
        {unreadOnly
          ? "You don't have any unread notifications right now."
          : "Important updates about your sessions and companion account will appear here."}
      </p>

    </div>
  );
}
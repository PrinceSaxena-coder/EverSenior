import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import SeniorNavbar from "./SeniorNavbar";

type Notification = {
  id: number;
  type: "booking" | "message" | "reminder" | "companion" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      description:
        "Your companionship session with Ananya Sharma has been confirmed for 12 October 2026 at 04:00 PM.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      description:
        "Ananya Sharma sent you a new message. Tap to continue your conversation.",
      time: "35 minutes ago",
      read: false,
    },
    {
      id: 3,
      type: "reminder",
      title: "Upcoming Session",
      description:
        "You have a companionship session scheduled with Ananya Sharma tomorrow at 04:00 PM.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 4,
      type: "companion",
      title: "New Companion Available",
      description:
        "Meera Verma is now available for companionship sessions in Greater Noida.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 5,
      type: "system",
      title: "Welcome to EverSenior",
      description:
        "Your profile is ready. Find a companion and start your first companionship experience.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

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

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return <CalendarDays className="h-5 w-5" />;

      case "message":
        return <MessageCircle className="h-5 w-5" />;

      case "reminder":
        return <Clock className="h-5 w-5" />;

      case "companion":
        return <User className="h-5 w-5" />;

      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#6F5139]">
                Notifications
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                Stay up to date
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76685D] sm:text-base">
                Keep track of your bookings, messages, reminders, and
                companionship updates.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2DBD0] bg-white px-4 py-2.5 text-sm font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification Summary */}
          <div className="mb-6 rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-[#76685D]">
                  Notification Center
                </p>

                <p className="mt-0.5 text-xl font-semibold text-[#30271F]">
                  {unreadCount}{" "}
                  {unreadCount === 1
                    ? "unread notification"
                    : "unread notifications"}
                </p>
              </div>
            </div>
          </div>

          {/* Notification List */}
          {notifications.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white">

              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`relative ${
                    index !== notifications.length - 1
                      ? "border-b border-[#E2DBD0]"
                      : ""
                  } ${
                    !notification.read ? "bg-[#FCFAF7]" : "bg-white"
                  }`}
                >

                  {/* Unread left indicator */}
                  {!notification.read && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#6F5139]" />
                  )}

                  <div className="flex gap-4 p-5 sm:p-6">

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        notification.read
                          ? "bg-[#F3ECE3] text-[#76685D]"
                          : "bg-[#EDE3D7] text-[#6F5139]"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    {/* Main Content */}
                    <div className="min-w-0 flex-1">

                      {/* Top row */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        {/* Title */}
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h2
                              className={`text-sm font-semibold ${
                                notification.read
                                  ? "text-[#4B4037]"
                                  : "text-[#30271F]"
                              }`}
                            >
                              {notification.title}
                            </h2>

                            {!notification.read && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-[#6F5139]" />
                            )}
                          </div>
                        </div>

                        {/* Time */}
                        <span className="shrink-0 text-xs text-[#9A8D82] sm:pr-10">
                          {notification.time}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76685D]">
                        {notification.description}
                      </p>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2DBD0] bg-white px-3 py-1.5 text-xs font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Mark as read
                          </button>
                        )}

                        {notification.type === "booking" && (
                          <Link
                            to="/senior/bookings"
                            className="inline-flex items-center rounded-lg bg-[#6F5139] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#5D432F]"
                          >
                            View booking
                          </Link>
                        )}

                        {notification.type === "message" && (
                          <Link
                            to="/senior/messages"
                            className="inline-flex items-center rounded-lg bg-[#6F5139] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#5D432F]"
                          >
                            Open messages
                          </Link>
                        )}

                        {notification.type === "companion" && (
                          <Link
                            to="/senior/companions"
                            className="inline-flex items-center rounded-lg bg-[#6F5139] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#5D432F]"
                          >
                            Find companion
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Remove Notification */}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      aria-label="Remove notification"
                      className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-[#9A8D82] transition hover:bg-[#F3ECE3] hover:text-[#5D432F]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-[#E2DBD0] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                <Bell className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#30271F]">
                You're all caught up
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76685D]">
                There are no notifications to show right now. We'll let you
                know when something important happens.
              </p>

              <Link
                to="/senior/dashboard"
                className="mt-6 inline-flex items-center rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5D432F]"
              >
                Back to Dashboard
              </Link>
            </div>
          )}

          {/* Notification Preferences */}
          <div className="mt-8 rounded-2xl border border-[#E2DBD0] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#30271F]">
                  Notification preferences
                </h2>

                <p className="mt-1 text-sm text-[#76685D]">
                  Manage how you receive notifications.
                </p>
              </div>

              <Link
                to="/senior/settings"
                className="inline-flex w-fit items-center rounded-xl border border-[#E2DBD0] px-4 py-2.5 text-sm font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
              >
                Notification settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
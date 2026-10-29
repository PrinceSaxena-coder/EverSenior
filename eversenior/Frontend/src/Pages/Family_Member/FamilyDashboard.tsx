import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type Senior = {
  id: string;
  name: string;
  age: number;
  location: string;
  relationship: string;
  companion: string;
  companionStatus: "Active" | "Pending" | "Not Assigned";
  image?: string;
};

type UpcomingSession = {
  id: string;
  seniorName: string;
  companionName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Upcoming" | "Pending";
  amount: number;
};

type ActivityItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "success" | "info" | "warning";
};

export default function FamilyDashboard() {
  const [userName, setUserName] = useState(() => {
  try {
    const savedUser = localStorage.getItem("backendUser");
    if (!savedUser) return "";

    const user = JSON.parse(savedUser);

    return (
      user.name ||
      user.fullName ||
      user.firstName ||
      ""
    );
  } catch {
    return "";
  }
});

  const [seniors] = useState<Senior[]>([
    {
      id: "senior-1",
      name: "Mrs. Sharma",
      age: 72,
      location: "Noida",
      relationship: "Mother",
      companion: "Ananya",
      companionStatus: "Active",
    },
    {
      id: "senior-2",
      name: "Mr. Saxena",
      age: 76,
      location: "Delhi",
      relationship: "Father",
      companion: "Rajiv Mehta",
      companionStatus: "Active",
    },
  ]);

  const [upcomingSessions] = useState<UpcomingSession[]>([
    {
      id: "session-1",
      seniorName: "Mrs. Sharma",
      companionName: "Ananya",
      service: "Social Companionship",
      date: "Today",
      time: "5:00 PM – 7:00 PM",
      location: "Noida",
      status: "Confirmed",
      amount: 600,
    },
    {
      id: "session-2",
      seniorName: "Mr. Saxena",
      companionName: "Rajiv Mehta",
      service: "Outing Companionship",
      date: "Tomorrow",
      time: "10:00 AM – 1:00 PM",
      location: "Delhi",
      status: "Confirmed",
      amount: 900,
    },
    {
      id: "session-3",
      seniorName: "Mrs. Sharma",
      companionName: "Ananya",
      service: "Hobbies & Interests",
      date: "12 October",
      time: "4:00 PM – 6:00 PM",
      location: "Noida",
      status: "Upcoming",
      amount: 600,
    },
  ]);

  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: 1,
      title: "Session completed",
      description:
        "Ananya completed the companionship session with Mrs. Sharma.",
      time: "Yesterday",
      type: "success",
    },
    {
      id: 2,
      title: "Booking confirmed",
      description:
        "Your session with Rajiv Mehta has been confirmed.",
      time: "2 days ago",
      type: "success",
    },
    {
      id: 3,
      title: "Payment successful",
      description:
        "₹600 payment for Social Companionship was completed.",
      time: "2 days ago",
      type: "info",
    },
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const totalUpcoming = upcomingSessions.length;

  const monthlySpend = upcomingSessions.reduce(
    (total, session) => total + session.amount,
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar userName={userName} />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">

        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A715D]">
                Family Dashboard
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#30271F] sm:text-4xl">
                Good afternoon, {userName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756658] sm:text-base">
                Stay connected with your loved ones, manage their
                companionship and keep track of everything that matters.
              </p>
            </div>

            <Link
              to="/family/companions"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5F4633]"
            >
              Find a Companion
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#857668]">
                  My Seniors
                </p>

                <p className="mt-2 text-3xl font-bold text-[#30271F]">
                  {seniors.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Users size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-[#6F5139]">
              All seniors are connected
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#857668]">
                  Upcoming Sessions
                </p>

                <p className="mt-2 text-3xl font-bold text-[#30271F]">
                  {totalUpcoming}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <CalendarDays size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-[#6F5139]">
              Sessions scheduled
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#857668]">
                  This Month
                </p>

                <p className="mt-2 text-3xl font-bold text-[#30271F]">
                  ₹{monthlySpend.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Wallet size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-[#6F5139]">
              Companion spending
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#857668]">
                  Active Companions
                </p>

                <p className="mt-2 text-3xl font-bold text-[#30271F]">
                  {
                    seniors.filter(
                      (senior) => senior.companionStatus === "Active"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Heart size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-[#6F5139]">
              Currently supporting seniors
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">

          {/* Left Column */}
          <div className="space-y-6">

            {/* My Seniors */}
            <div className="rounded-2xl border border-[#E2DBD0] bg-white">

              <div className="flex flex-col gap-3 border-b border-[#E7DFD6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#30271F]">
                    My Seniors
                  </h2>

                  <p className="mt-1 text-sm text-[#857668]">
                    Manage the people you care about.
                  </p>
                </div>

                <Link
                  to="/family/seniors"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F5139] hover:underline"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-[#E7DFD6]">
                {seniors.map((senior) => (
                  <div
                    key={senior.id}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE4D9] text-lg font-bold text-[#6F5139]">
                        {senior.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[#30271F]">
                            {senior.name}
                          </h3>

                          <span className="rounded-full bg-[#F3ECE3] px-2.5 py-1 text-[11px] font-semibold text-[#6F5139]">
                            {senior.relationship}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#857668]">
                          <span>{senior.age} years</span>

                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {senior.location}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-[#857668]">
                            Companion:
                          </span>

                          <span className="font-semibold text-[#5F4633]">
                            {senior.companion}
                          </span>

                          <span className="inline-flex items-center gap-1 font-medium text-[#58735B]">
                            <CheckCircle2 size={13} />
                            {senior.companionStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/family/seniors/${senior.id}`}
                      className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D9CFC2] px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
                    >
                      View Profile
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="rounded-2xl border border-[#E2DBD0] bg-white">

              <div className="flex flex-col gap-3 border-b border-[#E7DFD6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#30271F]">
                    Upcoming Sessions
                  </h2>

                  <p className="mt-1 text-sm text-[#857668]">
                    Keep track of your seniors' upcoming companionship.
                  </p>
                </div>

                <Link
                  to="/family/bookings"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F5139] hover:underline"
                >
                  View bookings
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-[#E7DFD6]">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="px-5 py-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                          <CalendarDays size={20} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-[#30271F]">
                              {session.service}
                            </h3>

                            <span className="rounded-full bg-[#EEF4EE] px-2.5 py-1 text-[11px] font-semibold text-[#58735B]">
                              {session.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[#756658]">
                            For{" "}
                            <span className="font-semibold text-[#5F4633]">
                              {session.seniorName}
                            </span>
                          </p>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#857668]">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={13} />
                              {session.date}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock3 size={13} />
                              {session.time}
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin size={13} />
                              {session.location}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-[#857668]">
                            Companion:{" "}
                            <span className="font-semibold text-[#5F4633]">
                              {session.companionName}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                        <p className="text-lg font-bold text-[#30271F]">
                          ₹{session.amount.toLocaleString("en-IN")}
                        </p>

                        <Link
                          to={`/family/bookings/${session.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F5139] hover:underline"
                        >
                          View details
                          <ArrowRight size={15} />
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Safety Card */}
            <div className="overflow-hidden rounded-2xl border border-[#DCD4C9] bg-[#FBF9F6]">

              <div className="border-b border-[#E7DFD6] px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9E1D7] text-[#6F5139]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#30271F]">
                      Senior Safety
                    </h2>

                    <p className="mt-1 text-sm text-[#857668]">
                      Your seniors are being looked after.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5">

                {seniors.map((senior) => (
                  <div
                    key={senior.id}
                    className="flex items-center justify-between rounded-xl border border-[#E4DDD2] bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#30271F]">
                        {senior.name}
                      </p>

                      <p className="mt-1 text-xs text-[#857668]">
                        Last session completed recently
                      </p>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-semibold text-[#58735B]">
                      <CheckCircle2 size={14} />
                      Safe
                    </span>
                  </div>
                ))}

                <Link
                  to="/family/safety"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  Open Safety Center
                  <ShieldCheck size={16} />
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">

              <h2 className="text-lg font-bold text-[#30271F]">
                Quick Actions
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <Link
                  to="/family/seniors"
                  className="group rounded-xl border border-[#E4DDD2] p-4 transition hover:border-[#CFC1B1] hover:bg-[#FBF9F6]"
                >
                  <Users
                    size={20}
                    className="text-[#6F5139]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#30271F]">
                    My Seniors
                  </p>

                  <p className="mt-1 text-xs text-[#857668]">
                    Manage seniors
                  </p>
                </Link>

                <Link
                  to="/family/companions"
                  className="group rounded-xl border border-[#E4DDD2] p-4 transition hover:border-[#CFC1B1] hover:bg-[#FBF9F6]"
                >
                  <Heart
                    size={20}
                    className="text-[#6F5139]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#30271F]">
                    Find Companion
                  </p>

                  <p className="mt-1 text-xs text-[#857668]">
                    Explore companions
                  </p>
                </Link>

                <Link
                  to="/family/messages"
                  className="group rounded-xl border border-[#E4DDD2] p-4 transition hover:border-[#CFC1B1] hover:bg-[#FBF9F6]"
                >
                  <MessageCircle
                    size={20}
                    className="text-[#6F5139]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#30271F]">
                    Messages
                  </p>

                  <p className="mt-1 text-xs text-[#857668]">
                    Stay connected
                  </p>
                </Link>

                <Link
                  to="/family/payments"
                  className="group rounded-xl border border-[#E4DDD2] p-4 transition hover:border-[#CFC1B1] hover:bg-[#FBF9F6]"
                >
                  <Wallet
                    size={20}
                    className="text-[#6F5139]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#30271F]">
                    Payments
                  </p>

                  <p className="mt-1 text-xs text-[#857668]">
                    View transactions
                  </p>
                </Link>

              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-[#E2DBD0] bg-white">

              <div className="flex items-center justify-between border-b border-[#E7DFD6] px-5 py-5">
                <div>
                  <h2 className="text-lg font-bold text-[#30271F]">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-sm text-[#857668]">
                    Latest updates
                  </p>
                </div>

                <Link
                  to="/family/activity"
                  className="text-sm font-semibold text-[#6F5139] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-[#E7DFD6]">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 px-5 py-4"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        item.type === "success"
                          ? "bg-[#EEF4EE] text-[#58735B]"
                          : item.type === "warning"
                          ? "bg-[#F8EFE5] text-[#9A6A3A]"
                          : "bg-[#F3ECE3] text-[#6F5139]"
                      }`}
                    >
                      {item.type === "success" ? (
                        <CheckCircle2 size={17} />
                      ) : item.type === "warning" ? (
                        <Bell size={17} />
                      ) : (
                        <Activity size={17} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#30271F]">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#857668]">
                        {item.description}
                      </p>

                      <p className="mt-1 text-[11px] text-[#A08F7F]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Trust Banner */}
        <section className="mt-8 rounded-2xl border border-[#DED5CA] bg-[#EFE7DD] px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6F5139] text-white">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3 className="font-bold text-[#30271F]">
                  Your family's care, connected.
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#756658]">
                  EverSenior helps families stay connected with trusted
                  companions while keeping every booking, session and
                  safety update in one place.
                </p>
              </div>
            </div>

            <Link
              to="/family/help"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#BFAF9E] bg-white px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#F7F3EC]"
            >
              Need help?
              <ArrowRight size={15} />
            </Link>

          </div>
        </section>

      </main>
    </div>
  );
}
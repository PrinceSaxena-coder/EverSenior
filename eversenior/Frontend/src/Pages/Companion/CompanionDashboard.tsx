import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  MessageCircle,
  BriefcaseBusiness,
  Wallet,
  Star,
  UserCheck,
  CircleAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type Session = {
  id: number;
  senior: string;
  activity: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: string;
};

type Request = {
  id: number;
  senior: string;
  activity: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  amount: number;
};

export default function CompanionDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(() => {
    const savedUser = localStorage.getItem("backendUser");

    if (!savedUser) return "";

    try {
      const user = JSON.parse(savedUser);
      return user.name || user.fullName || user.firstName || "";
    } catch {
      return "";
    }
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");

    if (storedName) {
      setUserName(storedName.split(" ")[0]);
    }

    setIsOnline(localStorage.getItem("companionOnline") === "true");

    const handleStorageChange = () => {
      setIsOnline(localStorage.getItem("companionOnline") === "true");

      const updatedName = localStorage.getItem("userName");

      if (updatedName) {
        setUserName(updatedName.split(" ")[0]);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /*
   * These are currently prototype values.
   * Later these will come from your backend/database.
   */
  const stats = {
    todayEarnings: 850,
    monthlyEarnings: 12450,
    upcomingJobs: 4,
    completedJobs: 18,
    hours: 32,
    rating: 4.9,
    reviews: 28,
  };

  const upcomingSessions: Session[] = [
    {
      id: 1,
      senior: "Prince Saxena",
      activity: "Coffee & Conversation",
      date: "Today",
      time: "04:00 PM",
      duration: "2 hours",
      location: "Greater Noida",
      status: "Confirmed",
    },
    {
      id: 2,
      senior: "Rajiv Mehta",
      activity: "Evening Walk",
      date: "Tomorrow",
      time: "06:00 PM",
      duration: "1 hour",
      location: "Noida",
      status: "Confirmed",
    },
  ];

  const pendingRequests: Request[] = [
    {
      id: 3,
      senior: "Meera Kapoor",
      activity: "Visit to a Café",
      date: "14 October 2026",
      time: "03:00 PM",
      duration: "2 hours",
      location: "Noida",
      amount: 900,
    },
    {
      id: 4,
      senior: "Arun Sharma",
      activity: "Reading Together",
      date: "16 October 2026",
      time: "05:00 PM",
      duration: "1 hour",
      location: "Delhi",
      amount: 450,
    },
  ];

  const handleOnlineClick = () => {
    if (!isOnline) {
      navigate("/companion/verification");
      return;
    }

    localStorage.setItem("companionOnline", "false");
    setIsOnline(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <CompanionNavbar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">
          {/* =================================================
              WELCOME + ONLINE STATUS
          ================================================= */}
          <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6F5139]">
                Companion Portal
              </p>

              <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#30271F] md:text-5xl">
                Good afternoon, {userName}
              </h1>

              <p className="mt-3 max-w-2xl text-[#75685D]">
                Manage your companion work, upcoming sessions, new
                opportunities, and earnings from one place.
              </p>
            </div>

            {/* Online Status */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#E2DBD0] bg-[#FBF8F2] p-3 shadow-sm">
              <div
                className={`grid size-11 place-items-center rounded-xl ${
                  isOnline
                    ? "bg-[#E8F1E7] text-[#4D7047]"
                    : "bg-[#F1E8DE] text-[#6F5139]"
                }`}
              >
                <div
                  className={`size-3 rounded-full ${
                    isOnline ? "bg-[#5D8A55]" : "bg-[#9B8A7B]"
                  }`}
                />
              </div>

              <div className="mr-2">
                <p className="text-sm font-medium text-[#30271F]">
                  {isOnline ? "You're Online" : "You're Offline"}
                </p>

                <p className="text-xs text-[#8A7A6D]">
                  {isOnline
                    ? "You can receive new gigs"
                    : "Go online to receive gigs"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOnlineClick}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isOnline
                    ? "border border-[#D8CDC0] bg-[#F7F3EC] text-[#6F5139] hover:bg-[#EFE7DC]"
                    : "bg-[#6F5139] text-white hover:bg-[#5F4633]"
                }`}
              >
                {isOnline ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </section>

          {/* =================================================
              VERIFICATION NOTICE
          ================================================= */}
          {!isOnline && (
            <section className="mt-6 rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h3 className="font-medium text-[#30271F]">
                      Complete verification to go online
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#75685D]">
                      Verify your identity before becoming available for new
                      companion opportunities.
                    </p>
                  </div>
                </div>

                <Link
                  to="/companion/psychometric-test"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#6F5139] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5F4633]"
                >
                  Verify & Go Online
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          )}

          {/* =================================================
              ONLINE SUCCESS
          ================================================= */}
          {isOnline && (
            <section className="mt-6 rounded-3xl border border-[#D7E4D4] bg-[#F5F9F3] p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#E3EFE0] text-[#52764C]">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <h3 className="font-medium text-[#3E5D39]">
                    You're ready to receive gigs
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#63745F]">
                    Your profile is active. New companion requests can now
                    appear in your Gigs section.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              STATS
          ================================================= */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Today's Earnings */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#75685D]">Today's Earnings</p>

                  <p className="mt-2 font-serif text-3xl text-[#30271F]">
                    ₹{stats.todayEarnings.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <IndianRupee size={20} />
                </div>
              </div>

              <Link
                to="/companion/pocket"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#6F5139] hover:underline"
              >
                View Pocket
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Upcoming Jobs */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#75685D]">Upcoming Jobs</p>

                  <p className="mt-2 font-serif text-3xl text-[#30271F]">
                    {stats.upcomingJobs}
                  </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <CalendarDays size={20} />
                </div>
              </div>

              <Link
                to="/companion/jobs"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#6F5139] hover:underline"
              >
                View Jobs
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Completed Jobs */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#75685D]">Completed Jobs</p>

                  <p className="mt-2 font-serif text-3xl text-[#30271F]">
                    {stats.completedJobs}
                  </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#8A7A6D]">This month</p>
            </div>

            {/* Hours */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#75685D]">Hours</p>

                  <p className="mt-2 font-serif text-3xl text-[#30271F]">
                    {stats.hours}
                  </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <Clock size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#8A7A6D]">This month</p>
            </div>
          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="font-serif text-2xl text-[#30271F]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-[#75685D]">
                Everything you need to manage your companion work.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/companion/gigs"
                className="group rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-5 transition hover:-translate-y-0.5 hover:border-[#CDBEAE] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                    <Zap size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#9B8D80] transition group-hover:translate-x-1 group-hover:text-[#6F5139]"
                  />
                </div>

                <h3 className="mt-4 font-medium text-[#30271F]">Find Gigs</h3>

                <p className="mt-1 text-sm text-[#75685D]">
                  Explore new companion opportunities.
                </p>
              </Link>

              <Link
                to="/companion/jobs"
                className="group rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-5 transition hover:-translate-y-0.5 hover:border-[#CDBEAE] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#9B8D80] transition group-hover:translate-x-1 group-hover:text-[#6F5139]"
                  />
                </div>

                <h3 className="mt-4 font-medium text-[#30271F]">My Jobs</h3>

                <p className="mt-1 text-sm text-[#75685D]">
                  Manage your accepted sessions.
                </p>
              </Link>

              <Link
                to="/companion/pocket"
                className="group rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-5 transition hover:-translate-y-0.5 hover:border-[#CDBEAE] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                    <Wallet size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#9B8D80] transition group-hover:translate-x-1 group-hover:text-[#6F5139]"
                  />
                </div>

                <h3 className="mt-4 font-medium text-[#30271F]">My Pocket</h3>

                <p className="mt-1 text-sm text-[#75685D]">
                  Track earnings and payouts.
                </p>
              </Link>

              <Link
                to="/companion/messages"
                className="group rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-5 transition hover:-translate-y-0.5 hover:border-[#CDBEAE] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                    <MessageCircle size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#9B8D80] transition group-hover:translate-x-1 group-hover:text-[#6F5139]"
                  />
                </div>

                <h3 className="mt-4 font-medium text-[#30271F]">Messages</h3>

                <p className="mt-1 text-sm text-[#75685D]">
                  Stay connected with seniors.
                </p>
              </Link>
            </div>
          </section>

          {/* =================================================
              UPCOMING + REQUESTS
          ================================================= */}
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Upcoming Sessions */}
            <div className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2]">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] px-6 py-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#30271F]">
                    Upcoming Sessions
                  </h2>

                  <p className="mt-1 text-sm text-[#75685D]">
                    Your confirmed companion sessions.
                  </p>
                </div>

                <Link
                  to="/companion/jobs"
                  className="hidden items-center gap-2 text-sm font-medium text-[#6F5139] hover:underline sm:flex"
                >
                  View all
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="divide-y divide-[#E2DBD0]">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-6 transition hover:bg-[#F7F3EC]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                      <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                        <CalendarDays size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-serif text-xl text-[#30271F]">
                            {session.senior}
                          </h3>

                          <span className="rounded-full bg-[#E9DED1] px-3 py-1 text-xs font-medium text-[#6F5139]">
                            {session.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[#75685D]">
                          {session.activity}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#75685D]">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {session.date}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {session.time}
                          </span>

                          <span>{session.duration}</span>

                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {session.location}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/companion/jobs/${session.id}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#D3C6B8] px-4 py-2.5 text-sm font-medium text-[#5F4633] transition hover:bg-[#F1E8DE]"
                      >
                        View Job
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Requests */}
            <div className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2]">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] px-6 py-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#30271F]">
                    New Requests
                  </h2>

                  <p className="mt-1 text-sm text-[#75685D]">
                    Requests waiting for your response.
                  </p>
                </div>

                <span className="grid size-9 place-items-center rounded-full bg-[#F1E8DE] text-sm font-medium text-[#6F5139]">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="divide-y divide-[#E2DBD0]">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F1E8DE] text-[#6F5139]">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-medium text-[#30271F]">
                              {request.senior}
                            </h3>

                            <p className="mt-1 text-sm text-[#75685D]">
                              {request.activity}
                            </p>
                          </div>

                          <p className="shrink-0 font-medium text-[#6F5139]">
                            ₹{request.amount}
                          </p>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-[#75685D]">
                          <p>
                            {request.date} · {request.time}
                          </p>

                          <p className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {request.duration}
                          </p>

                          <p className="flex items-center gap-1.5">
                            <MapPin size={13} />
                            {request.location}
                          </p>
                        </div>

                        <Link
                          to={`/companion/jobs/${request.id}`}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6F5139] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#5F4633]"
                        >
                          Review Request
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2DBD0] p-5">
                <Link
                  to="/companion/gigs"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-[#6F5139] hover:underline"
                >
                  View all gigs
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* =================================================
              RATING + PROFILE
          ================================================= */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Rating */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6 md:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#75685D]">Your Rating</p>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-serif text-4xl text-[#30271F]">
                      {stats.rating}
                    </span>

                    <span className="mb-1 text-sm text-[#75685D]">/ 5.0</span>
                  </div>
                </div>

                <div className="text-right">
                  <Star
                    size={30}
                    fill="currentColor"
                    className="ml-auto text-[#A0784F]"
                  />

                  <p className="mt-1 text-xs text-[#75685D]">
                    {stats.reviews} reviews
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E2DBD0]">
                <div className="h-full w-[98%] rounded-full bg-[#A0784F]" />
              </div>

              <p className="mt-3 text-xs leading-5 text-[#75685D]">
                Your excellent ratings help seniors find and trust you.
              </p>
            </div>

            {/* Profile Strength */}
            <div className="rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#75685D]">Profile Strength</p>

                  <p className="mt-2 font-serif text-3xl text-[#30271F]">90%</p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E2DBD0]">
                <div className="h-full w-[90%] rounded-full bg-[#A0784F]" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs leading-5 text-[#75685D]">
                  Add your remaining details to improve your visibility.
                </p>

                <Link
                  to="/companion/profile"
                  className="shrink-0 rounded-full border border-[#D3C6B8] px-4 py-2 text-sm font-medium text-[#5F4633] transition hover:bg-[#F1E8DE]"
                >
                  Profile
                </Link>
              </div>
            </div>
          </section>

          {/* =================================================
              SAFETY / PLATFORM INFO
          ================================================= */}
          <section className="mt-6 rounded-3xl border border-[#E2DBD0] bg-[#FBF8F2] p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#F1E8DE] text-[#6F5139]">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className="font-medium text-[#30271F]">
                    Your safety matters
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#75685D]">
                    Keep your profile information updated, follow EverSenior
                    safety guidelines, and use the platform messaging system for
                    communication.
                  </p>
                </div>
              </div>

              <Link
                to="/companion/help"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#6F5139] hover:underline"
              >
                Visit Help Centre
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Prototype Notice */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-4">
            <CircleAlert size={18} className="mt-0.5 shrink-0 text-[#8A6A4B]" />

            <p className="text-xs leading-5 text-[#75685D]">
              <span className="font-medium text-[#5F4633]">
                Prototype data:
              </span>{" "}
              Earnings, jobs, requests, ratings, and sessions shown on this
              dashboard are currently mock data. These will later be connected
              to the EverSenior backend and booking system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

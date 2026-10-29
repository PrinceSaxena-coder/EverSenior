import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Phone,
  MapPin,
  Clock3,
  UserRoundCheck,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  FileText,
  Eye,
  LockKeyhole,
  Siren,
  CalendarDays,
  Activity,
  CircleHelp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type SafetyStatus = "Good" | "Attention" | "Review";

type Senior = {
  id: string;
  name: string;
  age: number;
  relationship: string;
  location: string;
  companion: string;
  lastCheckIn: string;
  status: SafetyStatus;
  wellbeing: string;
  nextSession: string;
};

type SafetyActivity = {
  id: number;
  type: "checkin" | "session" | "verification" | "alert";
  title: string;
  description: string;
  time: string;
  status: "completed" | "active" | "attention";
};

const seniors: Senior[] = [
  {
    id: "1",
    name: "Mrs. Sharma",
    age: 72,
    relationship: "Mother",
    location: "Noida",
    companion: "Ananya",
    lastCheckIn: "Today, 10:15 AM",
    status: "Good",
    wellbeing: "Doing well",
    nextSession: "Today, 5:00 PM – 7:00 PM",
  },
  {
    id: "2",
    name: "Mr. Saxena",
    age: 76,
    relationship: "Father",
    location: "Delhi",
    companion: "Rajiv Mehta",
    lastCheckIn: "Today, 8:45 AM",
    status: "Good",
    wellbeing: "Doing well",
    nextSession: "Tomorrow, 10:00 AM – 1:00 PM",
  },
];

const initialActivities: SafetyActivity[] = [
  {
    id: 1,
    type: "checkin",
    title: "Senior check-in completed",
    description:
      "Mrs. Sharma's wellbeing check-in was completed successfully.",
    time: "Today, 10:15 AM",
    status: "completed",
  },
  {
    id: 2,
    type: "verification",
    title: "Companion verification confirmed",
    description:
      "Ananya's identity verification is active and up to date.",
    time: "Today, 9:50 AM",
    status: "completed",
  },
  {
    id: 3,
    type: "session",
    title: "Upcoming session monitored",
    description:
      "Mrs. Sharma's scheduled companionship session is confirmed.",
    time: "Today, 9:20 AM",
    status: "active",
  },
  {
    id: 4,
    type: "checkin",
    title: "Senior wellbeing check-in completed",
    description:
      "Mr. Saxena's morning check-in was completed without concerns.",
    time: "Today, 8:45 AM",
    status: "completed",
  },
];

function getActivityIcon(type: SafetyActivity["type"]) {
  switch (type) {
    case "checkin":
      return HeartPulse;

    case "session":
      return CalendarDays;

    case "verification":
      return UserRoundCheck;

    default:
      return ShieldAlert;
  }
}

export default function SafetyCenter() {
  const [selectedSenior, setSelectedSenior] = useState("1");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const activeSenior = useMemo(
    () =>
      seniors.find((senior) => senior.id === selectedSenior) ?? seniors[0],
    [selectedSenior]
  );

  const goodCount = seniors.filter(
    (senior) => senior.status === "Good"
  ).length;

  const verifiedCompanions = seniors.filter(
    (senior) => senior.companion
  ).length;

  const submitReport = () => {
    if (!reportText.trim()) return;

    setReportSubmitted(true);
    setReportText("");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F5139] text-white">
                  <ShieldCheck size={20} />
                </div>

                <span className="text-sm font-medium text-[#76563C]">
                  Family Protection
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Safety Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756A60] sm:text-base">
                Monitor your senior's wellbeing, companion activity, session
                safety, and important updates from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowEmergencyModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8A513B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754331] sm:w-fit"
            >
              <Siren size={18} />
              Emergency Help
            </button>
          </div>
        </section>

        {/* Safety overview */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#DDE4DC] bg-[#F3F7F2] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#657267]">Overall Safety</p>
                <p className="mt-1 text-xl font-semibold text-[#4F6753]">
                  All Good
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#58705A]">
                <ShieldCheck size={19} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#657267]">
              <CheckCircle2 size={14} className="text-[#58705A]" />
              No active safety concerns
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Seniors Monitored</p>
                <p className="mt-1 text-2xl font-semibold">
                  {seniors.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <HeartPulse size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#756A60]">
              {goodCount} currently in good standing
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Verified Companions</p>
                <p className="mt-1 text-2xl font-semibold">
                  {verifiedCompanions}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <UserRoundCheck size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#756A60]">
              Identity checks are active
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#756A60]">Active Concerns</p>
                <p className="mt-1 text-2xl font-semibold">0</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#58705A]">
                <ShieldAlert size={19} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#58705A]">
              Everything looks normal
            </p>
          </div>
        </section>

        {/* Senior selector */}
        <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#76563C]">
                Senior Safety Profile
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Monitor wellbeing and activity
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {seniors.map((senior) => (
                <button
                  key={senior.id}
                  type="button"
                  onClick={() => setSelectedSenior(senior.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    selectedSenior === senior.id
                      ? "bg-[#6F5139] text-white"
                      : "border border-[#E2DBD0] bg-white text-[#6B6258] hover:bg-[#F3ECE3]"
                  }`}
                >
                  {senior.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Profile */}
            <div className="rounded-2xl bg-[#FBF8F3] p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#6F5139] text-xl font-semibold text-white">
                  {activeSenior.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">
                      {activeSenior.name}
                    </h3>

                    <span className="rounded-full bg-[#E8F0E9] px-2.5 py-1 text-xs font-medium text-[#58705A]">
                      {activeSenior.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#756A60]">
                    {activeSenior.relationship} · {activeSenior.age} years ·{" "}
                    {activeSenior.location}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#E5DED4] bg-white p-3">
                      <div className="flex items-center gap-2 text-xs text-[#8A8075]">
                        <Activity size={14} />
                        Wellbeing
                      </div>

                      <p className="mt-1 text-sm font-semibold text-[#58705A]">
                        {activeSenior.wellbeing}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E5DED4] bg-white p-3">
                      <div className="flex items-center gap-2 text-xs text-[#8A8075]">
                        <Clock3 size={14} />
                        Last check-in
                      </div>

                      <p className="mt-1 text-sm font-semibold">
                        {activeSenior.lastCheckIn}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E5DED4] bg-white p-3">
                      <div className="flex items-center gap-2 text-xs text-[#8A8075]">
                        <UserRoundCheck size={14} />
                        Companion
                      </div>

                      <p className="mt-1 text-sm font-semibold">
                        {activeSenior.companion}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E5DED4] bg-white p-3">
                      <div className="flex items-center gap-2 text-xs text-[#8A8075]">
                        <CalendarDays size={14} />
                        Next session
                      </div>

                      <p className="mt-1 text-sm font-semibold">
                        {activeSenior.nextSession}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={`/family/seniors/${activeSenior.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  View Senior Profile
                  <ChevronRight size={16} />
                </Link>

                <Link
                  to="/family/messages"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2DBD0] px-4 py-2.5 text-sm font-medium text-[#6B6258] transition hover:bg-[#F3ECE3]"
                >
                  <MessageCircle size={16} />
                  Contact Companion
                </Link>
              </div>
            </div>

            {/* Safety checklist */}
            <div className="rounded-2xl border border-[#E2DBD0] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#58705A]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3 className="font-semibold">Safety checklist</h3>
                  <p className="text-xs text-[#8A8075]">
                    Current status for {activeSenior.name}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  "Companion identity verified",
                  "Emergency contact available",
                  "Upcoming session confirmed",
                  "Recent wellbeing check completed",
                  "Family communication enabled",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-[#FBF8F3] px-3.5 py-3"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-[#58705A]"
                    />

                    <span className="text-sm text-[#5F574F]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active companion & session */}
        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                  Companion
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Current Companion
                </h2>
              </div>

              <UserRoundCheck
                size={20}
                className="text-[#6F5139]"
              />
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#FBF8F3] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6F5139] font-semibold text-white">
                {activeSenior.companion
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {activeSenior.companion}
                  </h3>

                  <span className="rounded-full bg-[#E8F0E9] px-2 py-0.5 text-[10px] font-semibold text-[#58705A]">
                    VERIFIED
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#756A60]">
                  Identity verified · Background checks completed
                </p>
              </div>

              <ShieldCheck
                size={21}
                className="text-[#58705A]"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E7E0D7] p-3">
                <p className="text-xs text-[#8A8075]">Verification</p>
                <p className="mt-1 text-sm font-semibold text-[#58705A]">
                  Active
                </p>
              </div>

              <div className="rounded-xl border border-[#E7E0D7] p-3">
                <p className="text-xs text-[#8A8075]">Safety Rating</p>
                <p className="mt-1 text-sm font-semibold">4.9 / 5.0</p>
              </div>
            </div>

            <Link
              to="/family/companions/1"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
            >
              View companion details
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                  Live Session Status
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Session Monitoring
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#58705A]">
                <MapPin size={19} />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F3F7F2] p-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58705A] opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#58705A]" />
                </span>

                <span className="text-sm font-semibold text-[#4F6753]">
                  Safety monitoring active
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#657267]">
                {activeSenior.name}'s next session is scheduled for{" "}
                <strong>{activeSenior.nextSession}</strong>.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#E7E0D7] p-3">
                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-[#6F5139]" />
                  <span className="text-sm text-[#5F574F]">
                    Session location
                  </span>
                </div>

                <span className="text-sm font-semibold">
                  {activeSenior.location}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E7E0D7] p-3">
                <div className="flex items-center gap-3">
                  <Clock3 size={17} className="text-[#6F5139]" />
                  <span className="text-sm text-[#5F574F]">
                    Last check-in
                  </span>
                </div>

                <span className="text-sm font-semibold">
                  {activeSenior.lastCheckIn}
                </span>
              </div>
            </div>

            <Link
              to="/family/bookings"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
            >
              View session details
              <ChevronRight size={15} />
            </Link>
          </div>
        </section>

        {/* Safety activity */}
        <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E8E1D7] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                Recent Activity
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Safety & wellbeing activity
              </h2>
            </div>

            <Link
              to="/family/notifications"
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#6F5139]"
            >
              View all updates
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="divide-y divide-[#EEE8DF]">
            {initialActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id}
                  className="flex gap-4 p-5 sm:p-6"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      activity.status === "attention"
                        ? "bg-[#F7EDEA] text-[#8A513B]"
                        : "bg-[#F3ECE3] text-[#6F5139]"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold">{activity.title}</h3>

                      <span className="text-xs text-[#94887B]">
                        {activity.time}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-6 text-[#756A60]">
                      {activity.description}
                    </p>
                  </div>

                  <CheckCircle2
                    size={18}
                    className="hidden shrink-0 text-[#58705A] sm:block"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Safety resources */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
              Safety Resources
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Help when you need it
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/family/messages"
              className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <MessageCircle
                size={21}
                className="text-[#6F5139]"
              />

              <h3 className="mt-4 font-semibold">Contact Companion</h3>

              <p className="mt-1 text-sm leading-5 text-[#756A60]">
                Quickly communicate with the companion assigned to your senior.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                Open Messages
                <ChevronRight size={14} />
              </span>
            </Link>

            <Link
              to="/family/bookings"
              className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CalendarDays
                size={21}
                className="text-[#6F5139]"
              />

              <h3 className="mt-4 font-semibold">Session History</h3>

              <p className="mt-1 text-sm leading-5 text-[#756A60]">
                Review upcoming and completed companionship sessions.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                View Bookings
                <ChevronRight size={14} />
              </span>
            </Link>

            <Link
              to="/family/seniors/1"
              className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <HeartPulse
                size={21}
                className="text-[#6F5139]"
              />

              <h3 className="mt-4 font-semibold">Senior Wellbeing</h3>

              <p className="mt-1 text-sm leading-5 text-[#756A60]">
                Review your senior's profile, preferences, and recent activity.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                View Profile
                <ChevronRight size={14} />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-left group rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <FileText
                size={21}
                className="text-[#6F5139]"
              />

              <h3 className="mt-4 font-semibold">Report a Concern</h3>

              <p className="mt-1 text-sm leading-5 text-[#756A60]">
                Tell our support team about a safety or service concern.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                Submit Report
                <ChevronRight size={14} />
              </span>
            </button>
          </div>
        </section>

        {/* Trust information */}
        <section className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Your family's information is protected
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#756A60]">
                  EverSenior uses account controls, companion verification,
                  session monitoring, and safety reporting to support a
                  trusted experience for seniors and their families.
                </p>
              </div>
            </div>

            <Link
              to="/family/help"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8CEC1] bg-white px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#FBF8F3]"
            >
              <CircleHelp size={16} />
              Safety Help
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#E2DBD0] pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#6F5139]">
            <ShieldCheck size={16} />
            <span>Care, trust and safety at every step.</span>
          </div>

          <p className="mt-2 text-xs text-[#94887B]">
            For immediate emergencies, contact your local emergency services.
          </p>
        </footer>
      </main>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D7] p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EDEA] text-[#8A513B]">
                  <Siren size={19} />
                </div>

                <div>
                  <h2 className="font-semibold">Emergency Help</h2>
                  <p className="mt-1 text-xs text-[#756A60]">
                    Choose the safest next step.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="rounded-lg p-2 text-[#8A8075] hover:bg-[#F3ECE3]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <a
                href="tel:112"
                className="flex items-center gap-4 rounded-xl border border-[#E8D8D2] bg-[#FBF3F0] p-4 transition hover:bg-[#F7EDEA]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8A513B] text-white">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="font-semibold text-[#6E4435]">
                    Call Emergency Services
                  </p>
                  <p className="text-xs text-[#8A7166]">
                    Call 112 for immediate emergency assistance.
                  </p>
                </div>
              </a>

              <Link
                to="/family/customer-care"
                onClick={() => setShowEmergencyModal(false)}
                className="flex items-center gap-4 rounded-xl border border-[#E2DBD0] p-4 transition hover:bg-[#F3ECE3]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <p className="font-semibold">Contact EverSenior</p>
                  <p className="text-xs text-[#756A60]">
                    Contact customer care for platform-related concerns.
                  </p>
                </div>
              </Link>

              <Link
                to="/family/messages"
                onClick={() => setShowEmergencyModal(false)}
                className="flex items-center gap-4 rounded-xl border border-[#E2DBD0] p-4 transition hover:bg-[#F3ECE3]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <UserRoundCheck size={18} />
                </div>

                <div>
                  <p className="font-semibold">Contact Companion</p>
                  <p className="text-xs text-[#756A60]">
                    Send a message to the assigned companion.
                  </p>
                </div>
              </Link>
            </div>

            <div className="border-t border-[#E8E1D7] bg-[#FBF8F3] p-4 text-center text-xs text-[#8A8075]">
              If there is immediate danger, contact local emergency services
              first.
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E8E1D7] p-5">
              <div>
                <h2 className="font-semibold">Report a Safety Concern</h2>
                <p className="mt-1 text-xs text-[#756A60]">
                  Tell us what happened and our team can review it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportSubmitted(false);
                }}
                className="rounded-lg p-2 text-[#8A8075] hover:bg-[#F3ECE3]"
              >
                <X size={18} />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0E9] text-[#58705A]">
                  <CheckCircle2 size={27} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Concern submitted
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#756A60]">
                  Your report has been recorded. The EverSenior support team
                  can review it and follow up with you.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSubmitted(false);
                  }}
                  className="mt-6 rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5F4633]"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="p-5">
                  <label
                    htmlFor="safety-report"
                    className="mb-2 block text-sm font-medium text-[#5F574F]"
                  >
                    What would you like us to know?
                  </label>

                  <textarea
                    id="safety-report"
                    value={reportText}
                    onChange={(event) => setReportText(event.target.value)}
                    rows={6}
                    placeholder="Describe the safety or service concern..."
                    className="w-full resize-none rounded-xl border border-[#DED6CB] bg-[#FBF8F3] px-4 py-3 text-sm text-[#30271F] outline-none transition placeholder:text-[#A49A8E] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                  />

                  <p className="mt-2 text-xs text-[#94887B]">
                    For an immediate emergency, call local emergency services
                    instead of submitting this form.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-[#E8E1D7] p-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#6B6258] hover:bg-[#F3ECE3]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={submitReport}
                    disabled={!reportText.trim()}
                    className="rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit Concern
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
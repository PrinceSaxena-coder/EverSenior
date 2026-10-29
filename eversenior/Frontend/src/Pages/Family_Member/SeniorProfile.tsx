import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  User,
  Users,
  Activity,
  FileText,
  Edit3,
  AlertCircle,
  CircleCheck,
} from "lucide-react";

import FamilyNavbar from "./FamilyNavbar";

type Senior = {
  id: string;
  name: string;
  age: number;
  relationship: string;
  location: string;
  initials: string;
  status: "Active" | "Needs Attention";
  companion: string;
  companionInitials: string;
  companionRating: number;
  nextSession: string;
  nextSessionTime: string;
  totalSessions: number;
  monthlySessions: number;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  interests: string[];
  preferences: string[];
  notes: string;
};

type Session = {
  id: number;
  title: string;
  companion: string;
  date: string;
  time: string;
  location: string;
  status: "Upcoming" | "Completed";
  amount: number;
};

const seniors: Senior[] = [
  {
    id: "mrs-sharma",
    name: "Mrs. Sharma",
    age: 72,
    relationship: "Mother",
    location: "Noida, Uttar Pradesh",
    initials: "MS",
    status: "Active",
    companion: "Ananya",
    companionInitials: "AN",
    companionRating: 4.9,
    nextSession: "Today",
    nextSessionTime: "5:00 PM – 7:00 PM",
    totalSessions: 24,
    monthlySessions: 6,
    phone: "+91 98XXXXXX42",
    email: "mrs.sharma@example.com",
    emergencyContact: "Prince Saxena",
    emergencyPhone: "+91 98XXXXXX21",
    interests: [
      "Reading",
      "Gardening",
      "Morning Walks",
      "Music",
      "Talking",
    ],
    preferences: [
      "Prefers afternoon and evening sessions",
      "Enjoys calm conversations",
      "Likes short walks nearby",
      "Prefers familiar companions",
    ],
    notes:
      "Mrs. Sharma enjoys meaningful conversations, gardening and spending time outdoors. She prefers a calm environment and appreciates companions who are patient and good listeners.",
  },
  {
    id: "mr-saxena",
    name: "Mr. Saxena",
    age: 76,
    relationship: "Father",
    location: "Delhi, India",
    initials: "MS",
    status: "Active",
    companion: "Rajiv Mehta",
    companionInitials: "RM",
    companionRating: 4.8,
    nextSession: "Tomorrow",
    nextSessionTime: "10:00 AM – 1:00 PM",
    totalSessions: 18,
    monthlySessions: 4,
    phone: "+91 97XXXXXX64",
    email: "mr.saxena@example.com",
    emergencyContact: "Prince Saxena",
    emergencyPhone: "+91 98XXXXXX21",
    interests: [
      "News",
      "Cricket",
      "Walking",
      "Travel Stories",
      "Chess",
    ],
    preferences: [
      "Prefers morning sessions",
      "Enjoys outdoor activities",
      "Likes discussing current affairs",
      "Prefers structured activities",
    ],
    notes:
      "Mr. Saxena enjoys morning walks, cricket and conversations about current affairs. He likes companions who can keep conversations engaging and participate in outdoor activities.",
  },
];

const sessions: Session[] = [
  {
    id: 1,
    title: "Social Companionship",
    companion: "Ananya",
    date: "Today",
    time: "5:00 PM – 7:00 PM",
    location: "Noida",
    status: "Upcoming",
    amount: 600,
  },
  {
    id: 2,
    title: "Hobbies & Interests",
    companion: "Ananya",
    date: "12 October",
    time: "4:00 PM – 6:00 PM",
    location: "Noida",
    status: "Upcoming",
    amount: 600,
  },
  {
    id: 3,
    title: "Social Companionship",
    companion: "Ananya",
    date: "28 September",
    time: "5:00 PM – 7:00 PM",
    location: "Noida",
    status: "Completed",
    amount: 600,
  },
  {
    id: 4,
    title: "Outing Companionship",
    companion: "Rajiv Mehta",
    date: "20 September",
    time: "10:00 AM – 1:00 PM",
    location: "Delhi",
    status: "Completed",
    amount: 900,
  },
];

export default function SeniorProfile() {
  const { id } = useParams<{ id: string }>();

  const senior = useMemo(() => {
    return seniors.find((item) => item.id === id) || seniors[0];
  }, [id]);

  const seniorSessions = useMemo(() => {
    if (senior.id === "mr-saxena") {
      return sessions.filter(
        (session) => session.companion === "Rajiv Mehta"
      );
    }

    return sessions.filter((session) => session.companion === "Ananya");
  }, [senior.id]);

  const upcomingSessions = seniorSessions.filter(
    (session) => session.status === "Upcoming"
  );

  const completedSessions = seniorSessions.filter(
    (session) => session.status === "Completed"
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link
            to="/family/seniors"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6F5139] transition hover:text-[#5F4633]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Seniors
          </Link>
        </div>

        {/* Profile Header */}
        <section className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="h-28 bg-[#6F5139] sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-[#E8DED1] text-2xl font-bold text-[#6F5139] shadow-md sm:h-28 sm:w-28 sm:text-3xl">
                  {senior.initials}
                </div>

                <div className="pb-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[#30271F] sm:text-3xl">
                      {senior.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF4EA] px-3 py-1 text-xs font-semibold text-[#526B4D]">
                      <CircleCheck className="h-3.5 w-3.5" />
                      {senior.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#75685B]">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {senior.age} years old
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {senior.relationship}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {senior.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/family/messages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CEC1] bg-white px-4 py-2.5 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Link>

                <Link
                  to="/family/book"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Monthly Sessions"
            value={senior.monthlySessions}
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Total Sessions"
            value={senior.totalSessions}
          />

          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="Companion"
            value={senior.companion}
          />

          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Safety Status"
            value="Protected"
          />
        </section>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<User className="h-5 w-5" />}
                title="Personal Information"
                action={
                  <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                }
              />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label="Full Name"
                  value={senior.name}
                />

                <InfoItem
                  icon={<Heart className="h-4 w-4" />}
                  label="Relationship"
                  value={senior.relationship}
                />

                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Age"
                  value={`${senior.age} years`}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={senior.location}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={senior.phone}
                />

                <InfoItem
                  icon={<FileText className="h-4 w-4" />}
                  label="Email"
                  value={senior.email}
                />
              </div>
            </section>

            {/* Current Companion */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Heart className="h-5 w-5" />}
                title="Current Companion"
              />

              <div className="mt-5 rounded-2xl border border-[#E4DDD2] bg-[#F8F5F0] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DED1] font-bold text-[#6F5139]">
                      {senior.companionInitials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#30271F]">
                          {senior.companion}
                        </h3>

                        <span className="rounded-full bg-[#EAF3E8] px-2 py-0.5 text-[11px] font-semibold text-[#526B4D]">
                          Verified
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-sm text-[#75685B]">
                        <Star className="h-4 w-4 fill-current text-[#A77B45]" />
                        <span className="font-medium text-[#4F4338]">
                          {senior.companionRating}
                        </span>
                        <span>rating</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/family/messages"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CEC1] bg-white px-4 py-2 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact
                  </Link>
                </div>
              </div>
            </section>

            {/* Upcoming Sessions */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<CalendarDays className="h-5 w-5" />}
                title="Upcoming Sessions"
                action={
                  <Link
                    to="/family/bookings"
                    className="text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
                  >
                    View All
                  </Link>
                }
              />

              <div className="mt-5 space-y-3">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <SessionRow key={session.id} session={session} />
                  ))
                ) : (
                  <EmptyState message="No upcoming sessions scheduled." />
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Activity className="h-5 w-5" />}
                title="Recent Activity"
              />

              <div className="mt-5 space-y-4">
                <ActivityItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Session completed"
                  description={`Session with ${senior.companion} was completed successfully.`}
                  time="2 days ago"
                />

                <ActivityItem
                  icon={<MessageCircle className="h-4 w-4" />}
                  title="Companion update"
                  description={`${senior.companion} shared a positive session update.`}
                  time="4 days ago"
                />

                <ActivityItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  title="New session booked"
                  description="A new companionship session was added to the schedule."
                  time="1 week ago"
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Next Session */}
            <section className="rounded-3xl bg-[#6F5139] p-5 text-white shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9DED2]">Next Session</p>
                  <h2 className="mt-1 text-xl font-bold">
                    {senior.nextSession}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-[#E8D8C7]" />

                  <div>
                    <p className="text-sm font-semibold">
                      {senior.nextSessionTime}
                    </p>
                    <p className="mt-0.5 text-xs text-[#E5D7C8]">
                      Social companionship
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                  <MapPin className="h-5 w-5 text-[#E8D8C7]" />

                  <p className="text-sm">{senior.location}</p>
                </div>
              </div>

              <Link
                to="/family/bookings"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#F7F3EC]"
              >
                View Booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Safety & Wellbeing */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Safety & Wellbeing"
                action={
                  <Link
                    to="/family/safety"
                    className="text-sm font-semibold text-[#6F5139]"
                  >
                    View
                  </Link>
                }
              />

              <div className="mt-5 space-y-3">
                <SafetyItem
                  title="Companion Verified"
                  description="Identity verification completed"
                  status="Verified"
                />

                <SafetyItem
                  title="Recent Check-in"
                  description="Last session check-in recorded"
                  status="Healthy"
                />

                <SafetyItem
                  title="Emergency Contact"
                  description={senior.emergencyContact}
                  status="Available"
                />
              </div>

              <Link
                to="/family/safety"
                className="mt-5 flex items-center justify-between rounded-xl bg-[#F7F3EC] px-4 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#EFE7DD]"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Open Safety Center
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Interests */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Heart className="h-5 w-5" />}
                title="Interests"
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {senior.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-[#E2DBD0] bg-[#F8F5F0] px-3 py-1.5 text-sm font-medium text-[#5F4633]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Heart className="h-5 w-5" />}
                title="Care Preferences"
              />

              <div className="mt-5 space-y-3">
                {senior.preferences.map((preference) => (
                  <div
                    key={preference}
                    className="flex items-start gap-3 text-sm text-[#5F5348]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7C684F]" />
                    <span>{preference}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Family Notes */}
        <section className="mt-6 rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<FileText className="h-5 w-5" />}
            title="Family Notes"
            action={
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]">
                <Edit3 className="h-4 w-4" />
                Edit Notes
              </button>
            }
          />

          <div className="mt-5 flex gap-3 rounded-2xl border border-[#E6DDD2] bg-[#F8F5F0] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8DED1] text-[#6F5139]">
              <FileText className="h-4 w-4" />
            </div>

            <p className="text-sm leading-6 text-[#5F5348]">
              {senior.notes}
            </p>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="mt-6 rounded-3xl border border-[#E7D9CA] bg-[#FBF5ED] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8D8C7] text-[#6F5139]">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-[#30271F]">
                  Emergency Contact
                </h3>
                <p className="mt-1 text-sm text-[#75685B]">
                  {senior.emergencyContact} · {senior.emergencyPhone}
                </p>
              </div>
            </div>

            <a
              href={`tel:${senior.emergencyPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              <Phone className="h-4 w-4" />
              Call Emergency Contact
            </a>
          </div>
        </section>

        {/* Footer Trust */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 pb-4 text-center text-xs text-[#897B6D] sm:flex-row">
          <ShieldCheck className="h-4 w-4 text-[#6F5139]" />
          <span>
            EverSenior keeps families connected, informed and reassured.
          </span>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#897B6D]">{label}</p>
          <p className="mt-2 truncate text-lg font-bold text-[#30271F] sm:text-xl">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>

        <h2 className="text-lg font-bold text-[#30271F]">{title}</h2>
      </div>

      {action}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#897B6D]">
        {icon}
        {label}
      </p>

      <p className="text-sm font-semibold text-[#4B4036]">{value}</p>
    </div>
  );
}

function SessionRow({ session }: { session: Session }) {
  return (
    <div className="rounded-2xl border border-[#E4DDD2] bg-[#F8F5F0] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8DED1] text-[#6F5139]">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#30271F]">
              {session.title}
            </h3>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#75685B]">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {session.date}, {session.time}
              </span>

              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {session.location}
              </span>
            </div>

            <p className="mt-2 text-xs text-[#75685B]">
              Companion:{" "}
              <span className="font-semibold text-[#5F4633]">
                {session.companion}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
          <span className="rounded-full bg-[#EAF3E8] px-2.5 py-1 text-[11px] font-semibold text-[#526B4D]">
            {session.status}
          </span>

          <p className="mt-2 text-sm font-bold text-[#5F4633]">
            ₹{session.amount}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-sm font-semibold text-[#40362D]">{title}</p>
          <span className="text-xs text-[#968879]">{time}</span>
        </div>

        <p className="mt-1 text-sm leading-5 text-[#75685B]">
          {description}
        </p>
      </div>
    </div>
  );
}

function SafetyItem({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#E5DED4] p-3.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF4EA] text-[#526B4D]">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#40362D]">{title}</p>

          <span className="shrink-0 text-[11px] font-semibold text-[#526B4D]">
            {status}
          </span>
        </div>

        <p className="mt-1 text-xs text-[#817366]">{description}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D9D0C5] bg-[#FAF8F5] p-6 text-center">
      <CalendarDays className="mx-auto h-6 w-6 text-[#9A8C7D]" />
      <p className="mt-2 text-sm text-[#75685B]">{message}</p>
    </div>
  );
}
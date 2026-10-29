import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  User,
  Users,
  Award,
  BriefcaseBusiness,
  Activity,
  FileCheck2,
  BadgeCheck,
} from "lucide-react";

import FamilyNavbar from "./FamilyNavbar";

type Companion = {
  id: string;
  name: string;
  initials: string;
  age: number;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  sessionsCompleted: number;
  hourlyRate: number;
  availability: string;
  verified: boolean;
  languages: string[];
  services: string[];
  about: string;
  preferredActivities: string[];
  joined: string;
};

type Review = {
  id: number;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
};

const companions: Companion[] = [
  {
    id: "ananya",
    name: "Ananya",
    initials: "AN",
    age: 22,
    location: "Noida",
    rating: 4.9,
    reviews: 42,
    experience: "2+ years",
    sessionsCompleted: 86,
    hourlyRate: 300,
    availability: "Available today",
    verified: true,
    languages: ["English", "Hindi"],
    services: [
      "Social Companionship",
      "Hobbies & Interests",
      "Tech Companionship",
    ],
    about:
      "Ananya enjoys meaningful conversations, reading and spending time with seniors. She is patient, warm and comfortable with both indoor and outdoor activities.",
    preferredActivities: [
      "Reading",
      "Walking",
      "Music",
      "Conversation",
      "Gardening",
    ],
    joined: "January 2025",
  },
  {
    id: "rajiv-mehta",
    name: "Rajiv Mehta",
    initials: "RM",
    age: 28,
    location: "Delhi",
    rating: 4.8,
    reviews: 38,
    experience: "3+ years",
    sessionsCompleted: 72,
    hourlyRate: 350,
    availability: "Available tomorrow",
    verified: true,
    languages: ["English", "Hindi", "Punjabi"],
    services: [
      "Outing Companionship",
      "Social Companionship",
      "Travel Companionship",
    ],
    about:
      "Rajiv is an outgoing companion who enjoys helping seniors stay active and socially connected. He especially enjoys walks, cricket conversations and local outings.",
    preferredActivities: [
      "Walking",
      "Cricket",
      "Outings",
      "Travel Stories",
      "Sports",
    ],
    joined: "August 2024",
  },
  {
    id: "megha-sharma",
    name: "Megha Sharma",
    initials: "MS",
    age: 24,
    location: "Noida",
    rating: 4.7,
    reviews: 29,
    experience: "1.5+ years",
    sessionsCompleted: 51,
    hourlyRate: 275,
    availability: "Available this evening",
    verified: true,
    languages: ["English", "Hindi"],
    services: [
      "Social Companionship",
      "Non-Medical Support",
      "Hobbies & Interests",
    ],
    about:
      "Megha is a calm and empathetic companion who enjoys creative activities, conversations and helping seniors feel comfortable and engaged.",
    preferredActivities: [
      "Art",
      "Music",
      "Reading",
      "Gardening",
      "Conversation",
    ],
    joined: "March 2025",
  },
  {
    id: "arjun-verma",
    name: "Arjun Verma",
    initials: "AV",
    age: 26,
    location: "Greater Noida",
    rating: 4.6,
    reviews: 21,
    experience: "1+ year",
    sessionsCompleted: 34,
    hourlyRate: 250,
    availability: "Available weekends",
    verified: true,
    languages: ["English", "Hindi"],
    services: [
      "Tech Companionship",
      "Social Companionship",
      "Non-Medical Support",
    ],
    about:
      "Arjun enjoys helping seniors with technology and everyday digital tasks. He is patient, approachable and enjoys learning about people's experiences.",
    preferredActivities: [
      "Technology",
      "Chess",
      "News",
      "Conversation",
      "Games",
    ],
    joined: "June 2025",
  },
  {
    id: "riya-kapoor",
    name: "Riya Kapoor",
    initials: "RK",
    age: 23,
    location: "Delhi",
    rating: 4.9,
    reviews: 34,
    experience: "2+ years",
    sessionsCompleted: 67,
    hourlyRate: 325,
    availability: "Available today",
    verified: true,
    languages: ["English", "Hindi"],
    services: [
      "Social Companionship",
      "Outing Companionship",
      "Hobbies & Interests",
    ],
    about:
      "Riya loves spending time with seniors through conversations, hobbies and relaxed outings. She is known for being attentive and dependable.",
    preferredActivities: [
      "Movies",
      "Shopping",
      "Walking",
      "Music",
      "Outings",
    ],
    joined: "November 2024",
  },
  {
    id: "kabir-singh",
    name: "Kabir Singh",
    initials: "KS",
    age: 27,
    location: "Noida",
    rating: 4.5,
    reviews: 18,
    experience: "1+ year",
    sessionsCompleted: 28,
    hourlyRate: 250,
    availability: "Available tomorrow",
    verified: true,
    languages: ["English", "Hindi"],
    services: [
      "Travel Companionship",
      "Outing Companionship",
      "Social Companionship",
    ],
    about:
      "Kabir enjoys outdoor activities and helping seniors stay socially active. He is flexible with schedules and comfortable accompanying seniors on local outings.",
    preferredActivities: [
      "Travel",
      "Walking",
      "Sports",
      "Outings",
      "Photography",
    ],
    joined: "July 2025",
  },
];

const reviews: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    rating: 5,
    date: "2 weeks ago",
    text: "Ananya was extremely patient and warm with my mother. They spent the evening talking and reading together. My mother was very happy after the session.",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    initials: "RM",
    rating: 5,
    date: "1 month ago",
    text: "Very reliable and thoughtful companion. Communication was excellent and we always received a clear update after the session.",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    initials: "NK",
    rating: 4,
    date: "2 months ago",
    text: "A genuinely caring companion. She understands that companionship is about listening and spending meaningful time together.",
  },
];

export default function CompanionProfile() {
  const { id } = useParams<{ id: string }>();

  const companion = useMemo(() => {
    return companions.find((item) => item.id === id) || companions[0];
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Back */}
        <div className="mb-6">
          <Link
            to="/family/companions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6F5139] transition hover:text-[#5F4633]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Find Companion
          </Link>
        </div>

        {/* Profile Hero */}
        <section className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="h-28 bg-[#6F5139] sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-[#E8DED1] text-2xl font-bold text-[#6F5139] shadow-md sm:h-28 sm:w-28 sm:text-3xl">
                  {companion.initials}

                  <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-[#75916B]" />
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[#30271F] sm:text-3xl">
                      {companion.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF4EA] px-3 py-1 text-xs font-semibold text-[#526B4D]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#75685B]">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {companion.age} years old
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {companion.location}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-4 w-4" />
                      {companion.experience} experience
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
                  state={{
                    companionId: companion.id,
                    companionName: companion.name,
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Request Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Star className="h-5 w-5" />}
            label="Rating"
            value={companion.rating}
            suffix={`(${companion.reviews} reviews)`}
          />

          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            label="Sessions Completed"
            value={companion.sessionsCompleted}
          />

          <StatCard
            icon={<Award className="h-5 w-5" />}
            label="Experience"
            value={companion.experience}
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Starting From"
            value={`₹${companion.hourlyRate}`}
            suffix="/hour"
          />
        </section>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            {/* About */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<User className="h-5 w-5" />}
                title="About {companion.name}"
              />

              <p className="mt-5 text-sm leading-7 text-[#665A4E]">
                {companion.about}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Joined EverSenior"
                  value={companion.joined}
                />

                <InfoBox
                  icon={<Languages className="h-4 w-4" />}
                  label="Languages"
                  value={companion.languages.join(" · ")}
                />

                <InfoBox
                  icon={<MapPin className="h-4 w-4" />}
                  label="Primary Location"
                  value={companion.location}
                />

                <InfoBox
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Availability"
                  value={companion.availability}
                />
              </div>
            </section>

            {/* Services */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Heart className="h-5 w-5" />}
                title="Services Offered"
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {companion.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-2xl border border-[#E4DDD2] bg-[#F8F5F0] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8DED1] text-[#6F5139]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-semibold text-[#4D4238]">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Preferred Activities */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Activity className="h-5 w-5" />}
                title="Activities & Interests"
              />

              <p className="mt-4 text-sm text-[#75685B]">
                Activities {companion.name} enjoys doing with seniors:
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {companion.preferredActivities.map((activity) => (
                  <span
                    key={activity}
                    className="rounded-full border border-[#E1D8CE] bg-[#F8F5F0] px-3 py-1.5 text-sm font-medium text-[#5F4633]"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Star className="h-5 w-5" />}
                title="Family Reviews"
                action={
                  <span className="text-sm font-semibold text-[#6F5139]">
                    {companion.rating} / 5
                  </span>
                }
              />

              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Booking Card */}
            <section className="rounded-3xl bg-[#6F5139] p-5 text-white shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#E8DCCE]">
                    Session starting from
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    ₹{companion.hourlyRate}
                    <span className="text-sm font-medium text-[#E1D2C2]">
                      /hour
                    </span>
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-[#E7D9CA]" />

                  <div>
                    <p className="text-sm font-semibold">
                      {companion.availability}
                    </p>

                    <p className="mt-0.5 text-xs text-[#E2D3C3]">
                      Subject to final confirmation
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/family/book"
                state={{
                  companionId: companion.id,
                  companionName: companion.name,
                }}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#6F5139] transition hover:bg-[#F7F3EC]"
              >
                Request a Session
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-3 text-center text-[11px] text-[#E1D2C2]">
                You can review the final session details before confirming.
              </p>
            </section>

            {/* Verification */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Trust & Verification"
              />

              <div className="mt-5 space-y-3">
                <VerificationItem
                  title="Identity Verified"
                  description="Identity documents verified"
                />

                <VerificationItem
                  title="Profile Verified"
                  description="EverSenior profile reviewed"
                />

                <VerificationItem
                  title="Background Information"
                  description="Verification process completed"
                />

                <VerificationItem
                  title="Community Rated"
                  description={`${companion.reviews} family reviews`}
                />
              </div>

              <Link
                to="/family/safety"
                className="mt-5 flex items-center justify-between rounded-xl bg-[#F7F3EC] px-4 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#EFE7DD]"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Learn about safety
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Languages */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<Languages className="h-5 w-5" />}
                title="Languages"
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {companion.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-[#E1D8CE] bg-[#F8F5F0] px-3 py-1.5 text-sm font-medium text-[#5F4633]"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </section>

            {/* Quick Contact */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={<MessageCircle className="h-5 w-5" />}
                title="Have Questions?"
              />

              <p className="mt-4 text-sm leading-6 text-[#75685B]">
                Want to know more before requesting a session? You can connect
                with the companion or contact EverSenior support.
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  to="/family/messages"
                  className="flex items-center justify-between rounded-xl border border-[#E0D7CC] px-4 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message Companion
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/family/customer-care"
                  className="flex items-center justify-between rounded-xl border border-[#E0D7CC] px-4 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact EverSenior
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#E4D9CB] bg-[#FBF6EF] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8DCCE] text-[#6F5139]">
                <Heart className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-[#30271F]">
                  Think {companion.name} could be a good fit?
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#75685B]">
                  Request a session and choose the date, time and service that
                  works best for your senior.
                </p>
              </div>
            </div>

            <Link
              to="/family/book"
              state={{
                companionId: companion.id,
                companionName: companion.name,
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Request Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Trust Footer */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 pb-4 text-center text-xs text-[#897B6D] sm:flex-row">
          <ShieldCheck className="h-4 w-4 text-[#6F5139]" />
          <span>
            EverSenior helps families make informed companionship decisions.
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
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#897B6D]">{label}</p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <p className="truncate text-xl font-bold text-[#30271F]">
              {value}
            </p>

            {suffix && (
              <span className="truncate text-[11px] font-medium text-[#897B6D]">
                {suffix}
              </span>
            )}
          </div>
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

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5DED4] bg-[#F8F5F0] p-4">
      <div className="flex items-center gap-2 text-[#6F5139]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-[#897B6D]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-[#4B4036]">{value}</p>
    </div>
  );
}

function VerificationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#E5DED4] p-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF4EA] text-[#526B4D]">
        <FileCheck2 className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#40362D]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#817366]">
          {description}
        </p>
      </div>

      <CheckCircle2 className="ml-auto mt-1 h-4 w-4 shrink-0 text-[#60785A]" />
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-[#E5DED4] bg-[#F8F5F0] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8DED1] text-xs font-bold text-[#6F5139]">
          {review.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-[#40362D]">
              {review.name}
            </p>

            <span className="text-xs text-[#968879]">{review.date}</span>
          </div>

          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${
                  index < review.rating
                    ? "fill-current text-[#A77B45]"
                    : "text-[#CFC4B7]"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-sm leading-6 text-[#6F6256]">
            {review.text}
          </p>
        </div>
      </div>
    </div>
  );
}
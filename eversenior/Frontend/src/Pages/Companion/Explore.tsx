import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  ArrowRight,
  Heart,
  Sparkles,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type Session = {
  id: number;
  seniorName: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  earning: number;
  rating: number;
  activities: string[];
  preferredCompanion: string;
  verified: boolean;
};

const sessions: Session[] = [
  {
    id: 1,
    seniorName: "Prince Saxena",
    age: 68,
    location: "Greater Noida",
    distance: "3.2 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Coffee & Conversation",
    category: "Social Companionship",
    description:
      "Looking for a friendly companion for relaxed conversations over coffee and a short walk.",
    date: "12 October 2026",
    time: "04:00 PM",
    duration: "2 hours",
    earning: 600,
    rating: 4.9,
    activities: ["Coffee", "Conversation", "Short Walk"],
    preferredCompanion: "Someone warm and conversational",
    verified: true,
  },
  {
    id: 2,
    seniorName: "Rajiv Mehta",
    age: 72,
    location: "Noida Sector 62",
    distance: "5.8 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Evening Walk & Conversation",
    category: "Outing Companionship",
    description:
      "An evening companion is needed for a peaceful walk around the neighbourhood and some conversation.",
    date: "13 October 2026",
    time: "05:30 PM",
    duration: "1.5 hours",
    earning: 450,
    rating: 4.8,
    activities: ["Walking", "Conversation", "Outdoor Time"],
    preferredCompanion: "Someone who enjoys calm evening walks",
    verified: true,
  },
  {
    id: 3,
    seniorName: "Meera Kapoor",
    age: 65,
    location: "Indirapuram",
    distance: "8.1 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Art & Hobby Session",
    category: "Hobbies & Interests",
    description:
      "Spend an afternoon discussing art, exploring creative hobbies and sharing stories.",
    date: "15 October 2026",
    time: "03:00 PM",
    duration: "2 hours",
    earning: 650,
    rating: 5.0,
    activities: ["Art", "Painting", "Conversation"],
    preferredCompanion: "Someone interested in creative activities",
    verified: true,
  },
  {
    id: 4,
    seniorName: "Anita Sharma",
    age: 70,
    location: "Noida Sector 18",
    distance: "7.4 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Technology Help & Tea",
    category: "Tech Companionship",
    description:
      "Help with everyday smartphone tasks followed by a relaxed tea and conversation session.",
    date: "16 October 2026",
    time: "11:00 AM",
    duration: "2 hours",
    earning: 700,
    rating: 4.9,
    activities: ["Smartphone", "Technology", "Tea"],
    preferredCompanion: "Someone comfortable helping with technology",
    verified: true,
  },
  {
    id: 5,
    seniorName: "Arun Sharma",
    age: 74,
    location: "Delhi",
    distance: "12.5 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Book Club Conversation",
    category: "Social Companionship",
    description:
      "Join a relaxed book discussion followed by conversation about favourite authors and stories.",
    date: "17 October 2026",
    time: "05:00 PM",
    duration: "2 hours",
    earning: 600,
    rating: 4.7,
    activities: ["Books", "Discussion", "Coffee"],
    preferredCompanion: "Someone who enjoys reading",
    verified: false,
  },
  {
    id: 6,
    seniorName: "Sunita Verma",
    age: 69,
    location: "Greater Noida",
    distance: "4.6 km away",
    image: "/images/eversenior-seniors.jpg",
    title: "Garden Visit",
    category: "Outing Companionship",
    description:
      "A peaceful morning visit to a nearby garden with conversation and light outdoor activity.",
    date: "18 October 2026",
    time: "08:00 AM",
    duration: "2 hours",
    earning: 550,
    rating: 4.9,
    activities: ["Garden", "Walking", "Conversation"],
    preferredCompanion: "Someone who enjoys peaceful mornings",
    verified: true,
  },
];

const categories = [
  "All",
  "Social Companionship",
  "Outing Companionship",
  "Hobbies & Interests",
  "Tech Companionship",
  "Non-Medical Support",
  "Travel Companionship",
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState("Any distance");
  const [minEarning, setMinEarning] = useState("Any earning");
  const [savedSessions, setSavedSessions] = useState<number[]>([]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        session.seniorName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        session.location
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        session.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        session.category === selectedCategory;

      const distanceNumber = parseFloat(session.distance);

      const matchesDistance =
        maxDistance === "Any distance" ||
        (maxDistance === "5 km" && distanceNumber <= 5) ||
        (maxDistance === "10 km" && distanceNumber <= 10) ||
        (maxDistance === "15 km" && distanceNumber <= 15);

      const matchesEarning =
        minEarning === "Any earning" ||
        (minEarning === "₹500+" && session.earning >= 500) ||
        (minEarning === "₹600+" && session.earning >= 600) ||
        (minEarning === "₹700+" && session.earning >= 700);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDistance &&
        matchesEarning
      );
    });
  }, [search, selectedCategory, maxDistance, minEarning]);

  const toggleSaved = (id: number) => {
    setSavedSessions((current) =>
      current.includes(id)
        ? current.filter((sessionId) => sessionId !== id)
        : [...current, id]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setMaxDistance("Any distance");
    setMinEarning("Any earning");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <CompanionNavbar />

      {/* Hero */}
      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2DBD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#6F5139]">
              <Sparkles size={14} />
              Choose what fits your time
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl lg:text-5xl">
              Explore meaningful
              <span className="text-[#6F5139]"> sessions</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6E6257]">
              Discover companionship sessions that match your
              availability, interests and preferred location. You choose
              what feels right for you.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8A79]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sessions, activities or locations..."
                className="h-12 w-full rounded-xl border border-[#E2DBD0] bg-white pl-11 pr-4 text-sm text-[#30271F] outline-none transition placeholder:text-[#A79A8B] focus:border-[#B69C82] focus:ring-2 focus:ring-[#EDE3D7]"
              />
            </div>

            <button
              onClick={() => setShowFilters((current) => !current)}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                showFilters
                  ? "border-[#6F5139] bg-[#6F5139] text-white"
                  : "border-[#E2DBD0] bg-white text-[#5F4633] hover:bg-[#F3ECE3]"
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 rounded-2xl border border-[#E2DBD0] bg-white p-5">
              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8A735D]">
                    Distance
                  </label>

                  <select
                    value={maxDistance}
                    onChange={(event) =>
                      setMaxDistance(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#E2DBD0] bg-[#F7F3EC] px-3 text-sm text-[#4A4037] outline-none"
                  >
                    <option>Any distance</option>
                    <option>5 km</option>
                    <option>10 km</option>
                    <option>15 km</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8A735D]">
                    Minimum earning
                  </label>

                  <select
                    value={minEarning}
                    onChange={(event) =>
                      setMinEarning(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#E2DBD0] bg-[#F7F3EC] px-3 text-sm text-[#4A4037] outline-none"
                  >
                    <option>Any earning</option>
                    <option>₹500+</option>
                    <option>₹600+</option>
                    <option>₹700+</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="h-11 w-full rounded-xl border border-[#E2DBD0] bg-white text-sm font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[#E2DBD0] bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max gap-2 py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#6F5139] text-white"
                    : "bg-[#F3ECE3] text-[#6F5139] hover:bg-[#EDE3D7]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#6F5139]">
              Available now
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#30271F]">
              Sessions that may interest you
            </h2>
          </div>

          <p className="text-sm text-[#8A735D]">
            {filteredSessions.length}{" "}
            {filteredSessions.length === 1
              ? "session"
              : "sessions"}{" "}
            found
          </p>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8CEC1] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
              <Search size={24} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#30271F]">
              No sessions found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A6D60]">
              Try changing your search or filters to discover more
              sessions.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                saved={savedSessions.includes(session.id)}
                onToggleSaved={() => toggleSaved(session.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom note */}
      <section className="border-t border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#30271F]">
                  You are always in control
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#716458]">
                  Explore only the sessions that fit your schedule.
                  You can choose what to accept and when you want to
                  be available.
                </p>
              </div>
            </div>

            <Link
              to="/companion/availability"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Set My Availability
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   SESSION CARD
========================================================= */

function SessionCard({
  session,
  saved,
  onToggleSaved,
}: {
  session: Session;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[#E9DED1]">
        <img
          src={session.image}
          alt={session.seniorName}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#6F5139]">
            {session.category}
          </span>
        </div>

        <button
          onClick={onToggleSaved}
          aria-label={
            saved
              ? "Remove saved session"
              : "Save session"
          }
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#6F5139] shadow-sm transition hover:bg-white"
        >
          <Heart
            size={17}
            className={saved ? "fill-[#6F5139]" : ""}
          />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                {session.seniorName}
              </p>

              <p className="text-xs text-white/85">
                {session.age} years old
              </p>
            </div>

            {session.verified && (
              <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#4E7055]">
                <CheckCircle2 size={13} />
                Verified
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-lg font-semibold text-[#30271F]">
          {session.title}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#74675B]">
          {session.description}
        </p>

        {/* Date / time */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoItem
            icon={<CalendarDays size={16} />}
            label={session.date}
          />

          <InfoItem
            icon={<Clock size={16} />}
            label={`${session.time} · ${session.duration}`}
          />
        </div>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-[#65594E]">
          <MapPin size={16} className="text-[#7A624C]" />
          <span>{session.location}</span>
          <span className="text-[#A49789]">
            · {session.distance}
          </span>
        </div>

        {/* Activities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {session.activities.map((activity) => (
            <span
              key={activity}
              className="rounded-full bg-[#F3ECE3] px-2.5 py-1 text-xs font-medium text-[#6F5139]"
            >
              {activity}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-[#E9E1D8] pt-4">
          <div className="flex items-end justify-between gap-4">

            <div>
              <p className="text-xs text-[#8A7A6A]">
                You could earn
              </p>

              <div className="mt-1 flex items-center gap-1">
                <IndianRupee
                  size={17}
                  className="text-[#6F5139]"
                />

                <span className="text-lg font-bold text-[#30271F]">
                  {session.earning}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-[#6D6054]">
              <Star
                size={15}
                className="fill-[#8A735D] text-[#8A735D]"
              />
              {session.rating}
            </div>
          </div>

          <Link
            to={`/companion/explore/${session.id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
          >
            View Session
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-[#7A624C]">
        {icon}
      </span>

      <span className="text-xs leading-5 text-[#65594E]">
        {label}
      </span>
    </div>
  );
}
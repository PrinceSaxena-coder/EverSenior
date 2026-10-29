import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Heart,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";

type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
  featured?: boolean;
};

const events: EventItem[] = [
  {
    id: 1,
    title: "Morning Walk & Conversation",
    description:
      "Start your morning with a relaxed walk, friendly conversations and good company.",
    date: "12 October 2026",
    day: "12",
    month: "OCT",
    time: "08:00 AM",
    location: "Central Park, Noida",
    category: "Wellness",
    attendees: 18,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Coffee & Conversations",
    description:
      "Meet other members over coffee and share stories, experiences and memories.",
    date: "15 October 2026",
    day: "15",
    month: "OCT",
    time: "04:00 PM",
    location: "The Coffee Bean, Noida",
    category: "Social",
    attendees: 24,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Art & Creativity Afternoon",
    description:
      "Spend a peaceful afternoon exploring creativity through painting and simple art activities.",
    date: "18 October 2026",
    day: "18",
    month: "OCT",
    time: "03:00 PM",
    location: "Art House, Greater Noida",
    category: "Arts",
    attendees: 15,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "Music & Memories",
    description:
      "Enjoy familiar melodies and share the songs and memories that shaped your life.",
    date: "22 October 2026",
    day: "22",
    month: "OCT",
    time: "05:00 PM",
    location: "EverSenior Community Hall",
    category: "Music",
    attendees: 30,
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    title: "Gardening Together",
    description:
      "Connect with fellow members while spending a peaceful afternoon around plants and nature.",
    date: "25 October 2026",
    day: "25",
    month: "OCT",
    time: "09:00 AM",
    location: "Community Garden, Noida",
    category: "Nature",
    attendees: 12,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    title: "Stories Over Tea",
    description:
      "A warm evening of stories, memories and meaningful conversations over tea.",
    date: "29 October 2026",
    day: "29",
    month: "OCT",
    time: "05:30 PM",
    location: "Chai & Co., Delhi",
    category: "Social",
    attendees: 20,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
  },
];

const categories = [
  "All",
  "Social",
  "Wellness",
  "Arts",
  "Music",
  "Nature",
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  const toggleRegistration = (eventId: number) => {
    setRegisteredEvents((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId]
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const featuredEvent = events.find((event) => event.featured);

  const upcomingEvents = filteredEvents.filter(
    (event) => event.id !== featuredEvent?.id
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      {/* Shared Senior Navbar */}
      <SeniorNavbar />

      <main className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 md:py-16">
        {/* Hero */}
        <section className="mb-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F0E7DC] px-4 py-2 text-xs font-medium text-[#6F5139]">
              <Heart size={14} />
              Community & connection
            </div>

            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#30271F] md:text-5xl">
              Moments worth sharing.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#74665B] md:text-lg">
              Discover events, activities and gatherings where you can meet
              people, explore new interests and create meaningful memories.
            </p>
          </div>
        </section>

        {/* Featured Event */}
        {featuredEvent && (
          <section className="mb-12 overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              {/* Image */}
              <div className="relative min-h-[300px] overflow-hidden lg:min-h-[410px]">
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#6F5139]">
                  Featured event
                </div>

                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-sm">
                  <Users size={14} />
                  {featuredEvent.attendees} people joining
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#98775D]">
                  {featuredEvent.category}
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#30271F] md:text-4xl">
                  {featuredEvent.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#74665B] md:text-base">
                  {featuredEvent.description}
                </p>

                <div className="mt-7 space-y-4">
                  {/* Date */}
                  <div className="flex items-center gap-3 text-sm text-[#5F5147]">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-[#9A8879]">Date</p>
                      <p className="font-medium">
                        {featuredEvent.date}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3 text-sm text-[#5F5147]">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                      <Clock size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-[#9A8879]">Time</p>
                      <p className="font-medium">
                        {featuredEvent.time}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm text-[#5F5147]">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-[#9A8879]">Location</p>
                      <p className="font-medium">
                        {featuredEvent.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => toggleRegistration(featuredEvent.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition ${
                      registeredEvents.includes(featuredEvent.id)
                        ? "bg-[#EFE8DE] text-[#6F5139]"
                        : "bg-[#6F5139] text-white hover:bg-[#5C422F]"
                    }`}
                  >
                    {registeredEvents.includes(featuredEvent.id) ? (
                      <>
                        <Check size={17} />
                        Registered
                      </>
                    ) : (
                      <>
                        Join this event
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border border-[#DED6CB] bg-white px-6 py-3 text-sm font-medium text-[#6F5139] transition hover:bg-[#F8F4EE]"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search + Filters */}
        <section className="mb-10 rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8879]"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search events, activities or locations..."
                className="w-full rounded-xl border border-[#DED6CB] bg-[#FCFAF7] py-3.5 pl-11 pr-4 text-sm text-[#30271F] outline-none transition placeholder:text-[#A29488] focus:border-[#8B6A50] focus:ring-2 focus:ring-[#6F5139]/10"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#6F5139] text-white"
                        : "border border-[#DED6CB] bg-white text-[#6B5B4E] hover:bg-[#F7F2EB]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Events Heading */}
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#98775D]">
                Upcoming gatherings
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#30271F]">
                Explore events
              </h2>

              <p className="mt-2 text-sm text-[#796B60]">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"} available
                for you.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-sm text-[#8A796B] sm:flex">
              <CalendarDays size={17} />
              October 2026
            </div>
          </div>

          {/* Event Grid */}
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingEvents.map((event) => {
                const registered = registeredEvents.includes(event.id);

                return (
                  <article
                    key={event.id}
                    className="group overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                      {/* Date */}
                      <div className="absolute left-4 top-4 flex h-16 w-14 flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
                        <span className="text-xl font-semibold text-[#6F5139]">
                          {event.day}
                        </span>

                        <span className="text-[9px] font-semibold tracking-[0.15em] text-[#8F7C6D]">
                          {event.month}
                        </span>
                      </div>

                      {/* Category */}
                      <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[#6F5139]">
                        {event.category}
                      </span>

                      {/* Favorite */}
                      <button
                        type="button"
                        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[#6F5139] shadow-sm transition hover:bg-[#F7F1E9]"
                        aria-label={`Save ${event.title}`}
                      >
                        <Heart size={18} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold leading-tight text-[#30271F]">
                        {event.title}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#796B60]">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-[#65574C]">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-[#8A6B52]"
                          />
                          <span>{event.date}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#65574C]">
                          <Clock
                            size={16}
                            className="shrink-0 text-[#8A6B52]"
                          />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#65574C]">
                          <MapPin
                            size={16}
                            className="shrink-0 text-[#8A6B52]"
                          />
                          <span className="truncate">
                            {event.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#65574C]">
                          <Users
                            size={16}
                            className="shrink-0 text-[#8A6B52]"
                          />
                          <span>
                            {event.attendees} people attending
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-[#EEE8DE] pt-5">
                        <button
                          type="button"
                          onClick={() => toggleRegistration(event.id)}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            registered
                              ? "bg-[#F0E8DE] text-[#6F5139]"
                              : "bg-[#6F5139] text-white hover:bg-[#5C422F]"
                          }`}
                        >
                          {registered ? (
                            <>
                              <Check size={17} />
                              You're registered
                            </>
                          ) : (
                            <>
                              Join Event
                              <ArrowRight size={17} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E2DBD0] bg-white px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                <CalendarDays size={24} />
              </div>

              <h3 className="mt-5 font-serif text-2xl font-semibold">
                No events found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#796B60]">
                We couldn't find any events matching your search. Try another
                category or search term.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-medium text-white hover:bg-[#5C422F]"
              >
                View all events
              </button>
            </div>
          )}
        </section>

        {/* Community CTA */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-[#6F5139] px-6 py-10 text-white md:px-10 md:py-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                More than an event
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
                Find your people.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
                Every gathering is an opportunity to meet someone new,
                discover a shared interest and build a meaningful connection.
              </p>
            </div>

            <Link
              to="/senior/companions"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-medium text-[#6F5139] transition hover:bg-[#F8F3EC]"
            >
              Find a Companion
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
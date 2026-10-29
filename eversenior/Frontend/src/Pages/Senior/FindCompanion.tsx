
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Clock3,
  ShieldCheck,
  RefreshCw,
  Languages,
  Sparkles,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";

type CompanionMatch = {
  companionId: string;
  age: number;
  gender: string;
  city: string;
  languages: string[];
  interests: string[];
  hobbies: string[];
  personalityTraits: string[];
  availability: string[];
  bio: string;
  experience: string[];
  isVerified: boolean;
  score: number;
  matchReasons: string[];
};

type MatchingResponse = {
  seniorId: string;
  totalMatches: number;
  matches: CompanionMatch[];
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

const interestOptions = [
  "Books",
  "Reading",
  "Walking",
  "Music",
  "Nature",
  "Travel",
  "Art",
  "Cooking",
  "Movies",
  "Gardening",
  "Sports",
  "Technology",
  "Games",
];

function getAuthToken(): string | null {
  // Check common token storage keys used by frontend login flows.
  // If your login code uses a different key, add that key here.
  const possibleKeys = [
    "accessToken",
    "access_token",
    "token",
    "authToken",
    "jwt",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value.replace(/^Bearer\s+/i, "").trim();
    }
  }

  return null;
}

function getCompanionInterests(companion: CompanionMatch): string[] {
  return Array.from(
    new Set([...(companion.interests ?? []), ...(companion.hobbies ?? [])])
  );
}

export default function FindCompanion() {
  const [companions, setCompanions] = useState<CompanionMatch[]>([]);
  const [search, setSearch] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalMatches, setTotalMatches] = useState(0);

  const loadCompanions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "You are not signed in, or your login token was not found. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/matching/companions`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.error?.message ||
          data?.message ||
          `Unable to load companions (HTTP ${response.status}).`;

        if (response.status === 401) {
          throw new Error("Your session may have expired. Please sign in again.");
        }

        throw new Error(message);
      }

      const result = data as MatchingResponse;

      setCompanions(Array.isArray(result.matches) ? result.matches : []);
      setTotalMatches(
        typeof result.totalMatches === "number"
          ? result.totalMatches
          : Array.isArray(result.matches)
            ? result.matches.length
            : 0
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading companions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanions();
  }, [loadCompanions]);

  const filteredCompanions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return companions.filter((companion) => {
      const interests = getCompanionInterests(companion);

      const searchableValues = [
        companion.city,
        companion.gender,
        companion.bio,
        ...(companion.languages ?? []),
        ...(companion.personalityTraits ?? []),
        ...(companion.matchReasons ?? []),
        ...interests,
      ];

      const matchesSearch =
        !searchValue ||
        searchableValues.some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesInterest =
        !selectedInterest ||
        interests.some(
          (interest) =>
            interest.toLowerCase() === selectedInterest.toLowerCase()
        );

      return matchesSearch && matchesInterest;
    });
  }, [companions, search, selectedInterest]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F3ECE3] px-3.5 py-1.5 text-xs font-semibold text-[#6F5139]">
            <Heart size={14} />
            Discover companionship
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Find someone who fits your world.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#766A5E] sm:text-base">
            Discover verified companions based on your interests, location,
            availability and the kind of connection you are looking for.
          </p>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-[0_5px_20px_rgba(70,55,40,0.05)] sm:p-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8D7E]"
                  size={19}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by city, interest, language or trait..."
                  className="w-full rounded-xl border border-[#DED7CC] bg-[#FCFBF8] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A39A90] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-medium transition ${
                  showFilters
                    ? "border-[#6F5139] bg-[#F3ECE3] text-[#6F5139]"
                    : "border-[#DED7CC] bg-[#FCFBF8] text-[#5C5044] hover:bg-[#F5F0E8]"
                }`}
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              <button
                type="button"
                onClick={() => void loadCompanions()}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DED7CC] px-5 py-3.5 text-sm font-medium text-[#5C5044] transition hover:bg-[#F5F0E8] disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 border-t border-[#EEE8E0] pt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold">
                      What are you interested in?
                    </h2>
                    <p className="mt-1 text-xs text-[#8C8073]">
                      Choose an interest to narrow your matches.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInterest("");
                      setShowFilters(false);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-[#8C8073] hover:text-[#30271F]"
                  >
                    Clear
                    <X size={14} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const active = selectedInterest === interest;

                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() =>
                          setSelectedInterest(active ? "" : interest)
                        }
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                          active
                            ? "border-[#6F5139] bg-[#6F5139] text-white"
                            : "border-[#DED7CC] bg-[#FCFBF8] text-[#6B5D50] hover:border-[#6F5139] hover:text-[#6F5139]"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {(selectedInterest || search) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#8C8073]">
              Active filters:
            </span>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="flex items-center gap-1.5 rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs font-medium text-[#6F5139]"
              >
                Search: {search}
                <X size={13} />
              </button>
            )}

            {selectedInterest && (
              <button
                type="button"
                onClick={() => setSelectedInterest("")}
                className="flex items-center gap-1.5 rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs font-medium text-[#6F5139]"
              >
                {selectedInterest}
                <X size={13} />
              </button>
            )}
          </div>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Recommended companions
              </h2>

              <p className="mt-1 text-sm text-[#766A5E]">
                {loading
                  ? "Finding companions for you..."
                  : `${filteredCompanions.length} of ${totalMatches} matches shown`}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8C8073]">
              <Sparkles size={15} />
              Ranked by compatibility
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-[#E2DBD0] bg-white px-6 py-16 text-center">
              <RefreshCw className="mx-auto animate-spin text-[#6F5139]" size={28} />
              <p className="mt-4 text-sm text-[#766A5E]">
                Finding companions who fit your preferences...
              </p>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-[#30271F]">
                We could not load your matches
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadCompanions()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : filteredCompanions.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCompanions.map((companion) => {
                const isFavorite = favorites.includes(companion.companionId);
                const interests = getCompanionInterests(companion);

                return (
                  <article
                    key={companion.companionId}
                    className="group overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-[0_5px_20px_rgba(70,55,40,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(70,55,40,0.09)]"
                  >
                    <div className="relative flex min-h-32 items-center justify-center bg-gradient-to-br from-[#F3ECE3] to-[#E2D2BF]">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#6F5139] text-2xl font-bold text-white shadow-sm">
                        {companion.gender?.trim().charAt(0).toUpperCase() || "C"}
                      </div>

                      <button
                        type="button"
                        aria-label={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        onClick={() => toggleFavorite(companion.companionId)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#6F5139] shadow-sm transition hover:bg-white"
                      >
                        <Heart
                          size={18}
                          className={isFavorite ? "fill-[#6F5139]" : ""}
                        />
                      </button>

                      {companion.isVerified && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#476448]">
                          <ShieldCheck size={14} />
                          Verified companion
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#6F5139]">
                        {companion.score}/100 match
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-[#30271F]">
                            Companion
                          </h3>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8C8073]">
                            <MapPin size={13} />
                            <span>
                              {companion.age} years · {companion.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#766A5E]">
                        {companion.bio || "This companion is ready to connect and share meaningful experiences."}
                      </p>

                      {companion.languages?.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5044]">
                            <Languages size={14} />
                            Languages
                          </div>
                          <p className="mt-1 text-xs text-[#766A5E]">
                            {companion.languages.join(", ")}
                          </p>
                        </div>
                      )}

                      {interests.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {interests.slice(0, 6).map((interest) => (
                            <span
                              key={interest}
                              className="rounded-full bg-[#F7F3EC] px-2.5 py-1 text-[11px] font-medium text-[#6B5D50]"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}

                      {companion.availability?.length > 0 && (
                        <div className="mt-4 flex items-start gap-1.5 text-xs text-[#8C8073]">
                          <Clock3 size={14} className="mt-0.5 shrink-0" />
                          <span>
                            Available: {companion.availability.join(", ")}
                          </span>
                        </div>
                      )}

                      {companion.matchReasons?.length > 0 && (
                        <div className="mt-5 rounded-xl bg-[#F7F3EC] p-3.5">
                          <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#6F5139]">
                            <Sparkles size={14} />
                            Why this may be a good fit
                          </h4>

                          <ul className="mt-2 space-y-1.5">
                            {companion.matchReasons.map((reason) => (
                              <li
                                key={reason}
                                className="text-xs leading-5 text-[#766A5E]"
                              >
                                • {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {companion.personalityTraits?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-[#5C5044]">
                            Personality
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#766A5E]">
                            {companion.personalityTraits.join(", ")}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 border-t border-[#EEE8E0] pt-4">
                        <Link
                          to={`/senior/companions/${companion.companionId}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
                        >
                          View Profile
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#D6CFC4] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                <Search size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No companions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766A5E]">
                {companions.length === 0
                  ? "There are currently no verified companion matches. Please check again later."
                  : "Try changing your search or removing a filter."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedInterest("");
                }}
                className="mt-5 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
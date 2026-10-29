import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock3,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  MessageCircle,
  ArrowRight,
  Users,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

import FamilyNavbar from "./FamilyNavbar";
import { apiRequest } from "../../api/client";

type FamilyAccessRecord = {
  access: {
    id: string;
    seniorId: string;
    relationship: string;
    permissions: string[];
    status: "pending" | "active" | "revoked";
  };
};

type FamilyAccessResponse = {
  accesses?: FamilyAccessRecord[];
};

type SeniorProfileResponse = {
  senior: { id: string; name: string };
  profile: {
    age?: number;
    city?: string;
    interests?: string[];
    hobbies?: string[];
    companionshipNeeds?: string[];
    availability?: string[];
  };
};

type Senior = {
  id: string;
  name: string;
  relationship: string;
  age: number | null;
  location: string;
};

type CompanionMatch = {
  companionId: string;
  name: string;
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

const EMPTY_SENIOR: Senior = {
  id: "",
  name: "",
  relationship: "",
  age: null,
  location: "",
};

export default function FindCompanion() {
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [selectedSeniorId, setSelectedSeniorId] = useState("");
  const [companions, setCompanions] = useState<CompanionMatch[]>([]);
  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("All Interests");
  const [availability, setAvailability] = useState("Any Availability");
  const [location, setLocation] = useState("All Locations");
  const [minScore, setMinScore] = useState("Any Match Score");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingSeniors, setLoadingSeniors] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState("");
  const [seniorError, setSeniorError] = useState("");

  const selectedSenior =
    seniors.find((senior) => senior.id === selectedSeniorId) ?? EMPTY_SENIOR;

  useEffect(() => {
    let cancelled = false;

    async function loadAuthorizedSeniors() {
      setLoadingSeniors(true);
      setSeniorError("");
      try {
        const response = await apiRequest<FamilyAccessResponse>("/family/access");
        const activeAccesses = (response.accesses ?? []).filter(
          (record) =>
            record.access?.status === "active" &&
            record.access.permissions?.includes("view_profile") &&
            Boolean(record.access.seniorId),
        );

        const results = await Promise.all(
          activeAccesses.map(async (record): Promise<Senior | null> => {
            const access = record.access;
            try {
              const data = await apiRequest<SeniorProfileResponse>(
                `/family/seniors/${encodeURIComponent(access.seniorId)}/profile`,
              );
              return {
                id: data.senior.id,
                name: data.senior.name || "Senior",
                relationship: access.relationship || "Family member",
                age: typeof data.profile.age === "number" ? data.profile.age : null,
                location: data.profile.city || "Location not provided",
              };
            } catch {
              // Do not show a senior if their profile cannot be accessed.
              return null;
            }
          }),
        );

        if (cancelled) return;
        const loaded = results.filter((senior): senior is Senior => senior !== null);
        setSeniors(loaded);
        setSelectedSeniorId((current) =>
          loaded.some((senior) => senior.id === current)
            ? current
            : loaded[0]?.id ?? "",
        );
        if (loaded.length === 0) {
          setSeniorError(
            "No seniors with active profile access were found. Ask the senior to authorize your account first.",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setSeniorError(
            err instanceof Error ? err.message : "Unable to load your linked seniors.",
          );
        }
      } finally {
        if (!cancelled) setLoadingSeniors(false);
      }
    }

    void loadAuthorizedSeniors();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMatches = useCallback(async () => {
    if (!selectedSeniorId) {
      setCompanions([]);
      return;
    }

    setLoadingMatches(true);
    setError("");
    try {
      const response = await apiRequest<MatchingResponse>(
        `/matching/family/${encodeURIComponent(selectedSeniorId)}/companions`,
      );
      setCompanions(Array.isArray(response.matches) ? response.matches : []);
    } catch (err) {
      setCompanions([]);
      setError(
        err instanceof Error ? err.message : "Unable to load companion matches.",
      );
    } finally {
      setLoadingMatches(false);
    }
  }, [selectedSeniorId]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  const interests = useMemo(
    () =>
      Array.from(
        new Set(
          companions.flatMap((companion) => [
            ...(companion.interests ?? []),
            ...(companion.hobbies ?? []),
          ]),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [companions],
  );

  const locations = useMemo(
    () => Array.from(new Set(companions.map((item) => item.city).filter(Boolean))).sort(),
    [companions],
  );

  const availabilities = useMemo(
    () =>
      Array.from(
        new Set(companions.flatMap((item) => item.availability ?? []).filter(Boolean)),
      ).sort(),
    [companions],
  );

  const filteredCompanions = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return companions.filter((companion) => {
      const companionInterests = [
        ...(companion.interests ?? []),
        ...(companion.hobbies ?? []),
        ...(companion.personalityTraits ?? []),
      ];
      const searchable = [
        companion.name,
        companion.city,
        companion.bio,
        ...(companion.languages ?? []),
        ...companionInterests,
        ...(companion.matchReasons ?? []),
      ];
      const matchesSearch =
        !searchText || searchable.some((value) => String(value).toLowerCase().includes(searchText));
      const matchesInterest =
        interest === "All Interests" ||
        companionInterests.some((value) => value.toLowerCase() === interest.toLowerCase());
      const matchesAvailability =
        availability === "Any Availability" || companion.availability.includes(availability);
      const matchesLocation = location === "All Locations" || companion.city === location;
      const matchesScore =
        minScore === "Any Match Score" || companion.score >= Number(minScore);
      return matchesSearch && matchesInterest && matchesAvailability && matchesLocation && matchesScore;
    });
  }, [companions, search, interest, availability, location, minScore]);

  const clearFilters = () => {
    setSearch("");
    setInterest("All Interests");
    setAvailability("Any Availability");
    setLocation("All Locations");
    setMinScore("Any Match Score");
  };

  const hasActiveFilters =
    search !== "" ||
    interest !== "All Interests" ||
    availability !== "Any Availability" ||
    location !== "All Locations" ||
    minScore !== "Any Match Score";

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A725A]">
                Find the right companion
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[#30271F] sm:text-4xl">
                Find a Companion
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75685B] sm:text-base">
                Discover verified companions matched to your senior's interests, language, location and availability.
              </p>
            </div>
            <Link to="/family/seniors" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]">
              <Users className="h-4 w-4" /> Manage My Seniors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#897B6D]">Looking for a companion for</p>
              <h2 className="mt-1 text-lg font-bold text-[#30271F]">Select a Senior</h2>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <select value={selectedSeniorId} onChange={(event) => setSelectedSeniorId(event.target.value)} disabled={loadingSeniors || seniors.length === 0} className="w-full appearance-none rounded-xl border border-[#DCD3C8] bg-[#F8F5F0] px-4 py-3 pr-10 text-sm font-semibold text-[#4B4036] outline-none focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10 disabled:opacity-60">
                {seniors.length === 0 && <option value="">No linked seniors</option>}
                {seniors.map((senior) => <option key={senior.id} value={senior.id}>{senior.name} · {senior.relationship}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75685B]" />
            </div>
          </div>
          {selectedSenior.id && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#E4DDD2] bg-[#F8F5F0] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DED1] font-bold text-[#6F5139]">{selectedSenior.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div>
                <div>
                  <p className="font-semibold text-[#30271F]">{selectedSenior.name}</p>
                  <p className="mt-0.5 text-xs text-[#75685B]">{selectedSenior.relationship}{selectedSenior.age ? ` · ${selectedSenior.age} years` : ""} · {selectedSenior.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#6A5C4E]"><Heart className="h-4 w-4 text-[#7A5B43]" /> Matching companions to their needs</div>
            </div>
          )}
          {seniorError && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{seniorError}</p>}
        </section>

        <section className="mt-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#897B6D]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by companion, interest, language or location..." className="w-full rounded-2xl border border-[#DDD4C9] bg-white py-3.5 pl-12 pr-4 text-sm text-[#30271F] shadow-sm outline-none placeholder:text-[#9B8E80] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10" />
          </div>
          <button type="button" onClick={() => setShowFilters((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCD3C8] bg-white px-5 py-3.5 text-sm font-semibold text-[#5F4633] shadow-sm hover:bg-[#F8F5F0] lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
          <button type="button" onClick={() => void loadMatches()} disabled={loadingMatches || !selectedSeniorId} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCD3C8] bg-white px-5 py-3.5 text-sm font-semibold text-[#5F4633] shadow-sm hover:bg-[#F8F5F0] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loadingMatches ? "animate-spin" : ""}`} /> Refresh</button>
        </section>

        <section className={`mt-4 rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Interest" value={interest} options={["All Interests", ...interests]} onChange={setInterest} />
            <FilterSelect label="Availability" value={availability} options={["Any Availability", ...availabilities]} onChange={setAvailability} />
            <FilterSelect label="Location" value={location} options={["All Locations", ...locations]} onChange={setLocation} />
            <FilterSelect label="Minimum Match Score" value={minScore} options={["Any Match Score", "50", "70", "85"]} onChange={setMinScore} />
          </div>
          {hasActiveFilters && <button type="button" onClick={clearFilters} className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#7A6047] hover:bg-[#F7F3EC]"><X className="h-4 w-4" /> Clear filters</button>}
        </section>

        <section className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#30271F]">Recommended Companions</h2>
            <p className="mt-1 text-sm text-[#817366]">{loadingMatches ? "Loading matches…" : `${filteredCompanions.length} companion${filteredCompanions.length !== 1 ? "s" : ""} found`}{selectedSenior.location ? ` near ${selectedSenior.location}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#75685B]"><ShieldCheck className="h-4 w-4" /> Verified profiles only</div>
        </section>

        {error && <section role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">Could not load matches</p><p className="mt-1">{error}</p><button type="button" onClick={() => void loadMatches()} className="mt-3 font-semibold underline">Try again</button></section>}

        {loadingMatches ? (
          <div className="mt-5 rounded-3xl border border-[#E2DBD0] bg-white p-10 text-center text-sm text-[#75685B]">Finding companions for {selectedSenior.name || "your senior"}…</div>
        ) : filteredCompanions.length > 0 ? (
          <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanions.map((companion) => <CompanionCard key={companion.companionId} companion={companion} selectedSenior={selectedSenior} />)}
          </section>
        ) : !error ? (
          <section className="mt-5 rounded-3xl border border-dashed border-[#D8CEC2] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3ECE3] text-[#6F5139]"><Search className="h-6 w-6" /></div>
            <h3 className="mt-4 text-lg font-bold text-[#30271F]">{seniors.length === 0 ? "Connect a senior first" : "No companions found"}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75685B]">{seniors.length === 0 ? "This page shows seniors who have granted your account active profile access. Ask your senior to authorize you in their account." : "No verified companion profiles match this senior yet. Try clearing filters or check back after companion profiles are completed."}</p>
            {hasActiveFilters && <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5F4633]">Clear Filters</button>}
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-[#E4D9CB] bg-[#FBF6EF] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9DED0] text-[#6F5139]"><ShieldCheck className="h-5 w-5" /></div>
            <div className="flex-1"><h3 className="font-semibold text-[#30271F]">Your senior's safety comes first</h3><p className="mt-1 text-sm leading-6 text-[#75685B]">Match scores reflect profile similarities. They are not ratings or a guarantee of suitability; review the profile and discuss needs before requesting a session.</p></div>
            <Link to="/family/safety" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D8CEC1] bg-white px-4 py-2.5 text-sm font-semibold text-[#5F4633] hover:bg-[#F7F3EC]">Safety Center <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
        <div className="mt-8 flex items-center justify-center gap-2 pb-4 text-center text-xs text-[#897B6D]"><ShieldCheck className="h-4 w-4 text-[#6F5139]" /><span>EverSenior helps families find trusted companionship for their loved ones.</span></div>
      </main>
    </div>
  );
}

function CompanionCard({ companion, selectedSenior }: { companion: CompanionMatch; selectedSenior: Senior }) {
  const companionInterests = Array.from(new Set([...(companion.interests ?? []), ...(companion.hobbies ?? [])]));
  const experience = companion.experience?.length ? companion.experience.join(" · ") : "Experience not provided";
  const availability = companion.availability?.length ? companion.availability.join(" · ") : "Availability not provided";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8DED1] text-lg font-bold text-[#6F5139]">{companion.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</div><div><div className="flex items-center gap-1.5"><h3 className="font-bold text-[#30271F]">{companion.name}</h3>{companion.isVerified && <ShieldCheck className="h-4 w-4 text-[#60785A]" />}</div><p className="mt-1 text-xs text-[#817366]">{companion.age} years · {experience}</p></div></div>
          <span className="rounded-full bg-[#EEF4EA] px-2.5 py-1 text-[11px] font-semibold text-[#526B4D]">{companion.isVerified ? "Verified" : "Unverified"}</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"><span className="inline-flex items-center gap-1.5 font-semibold text-[#4D4238]"><Sparkles className="h-4 w-4 text-[#A77B45]" /> {companion.score}% match</span><span className="inline-flex items-center gap-1.5 text-[#75685B]"><MapPin className="h-4 w-4" /> {companion.city || "Location not provided"}</span></div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8F5F0] px-3 py-2.5"><Clock3 className="h-4 w-4 text-[#6F5139]" /><span className="text-xs font-semibold text-[#5F4633]">{availability}</span></div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#75685B]">{companion.bio || "This companion has not added a biography yet."}</p>
        <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#897B6D]">Interests & hobbies</p><div className="flex flex-wrap gap-1.5">{companionInterests.length ? companionInterests.slice(0, 4).map((item) => <span key={item} className="rounded-full border border-[#E3DAD0] bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#67594C]">{item}</span>) : <span className="text-xs text-[#897B6D]">Not provided</span>}</div></div>
        <div className="mt-4 border-t border-[#EEE8E0] pt-4"><p className="text-[11px] font-medium text-[#958779]">Languages</p><p className="mt-1 text-xs font-semibold text-[#5F5348]">{companion.languages?.length ? companion.languages.join(" · ") : "Not provided"}</p></div>
        {companion.matchReasons?.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#897B6D]">Why this match</p><ul className="space-y-1">{companion.matchReasons.slice(0, 3).map((reason) => <li key={reason} className="text-xs leading-5 text-[#75685B]">• {reason}</li>)}</ul></div>}
      </div>
      <div className="mt-auto border-t border-[#EEE8E0] bg-[#FCFAF7] p-4"><div className="grid grid-cols-2 gap-2"><Link to={`/family/companions/${companion.companionId}`} className="inline-flex items-center justify-center rounded-xl border border-[#D9D0C5] bg-white px-3 py-2.5 text-sm font-semibold text-[#5F4633] hover:bg-[#F7F3EC]">View Profile</Link><Link to="/family/book" state={{ companionId: companion.companionId, companionName: companion.name, seniorId: selectedSenior.id, seniorName: selectedSenior.name }} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6F5139] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#5F4633]">Request Session <ArrowRight className="h-3.5 w-3.5" /></Link></div><Link to="/family/messages" className="mt-2 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#75685B] hover:bg-[#F3ECE3] hover:text-[#5F4633]"><MessageCircle className="h-3.5 w-3.5" /> Message Companion</Link></div>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#897B6D]">{label}</span><div className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-[#DCD3C8] bg-[#F8F5F0] px-3 py-2.5 pr-9 text-sm text-[#4B4036] outline-none focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75685B]" /></div></label>;
}

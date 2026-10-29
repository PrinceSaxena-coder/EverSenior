import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Search,
  Users,
  UserRound,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";
import { apiRequest } from "../../api/client";

type CompanionProfileData = {
  userId: string;
  name?: string;
  age?: number;
  gender?: string;
  city?: string;
  bio?: string;
  interests?: string[];
  hobbies?: string[];
  languages?: string[];
  availability?: string[];
  experience?: string[];
  personalityTraits?: string[];
  isVerified?: boolean;
};

type CompanionApiResponse = {
  type: "companion";
  profile: CompanionProfileData | null;
};

export default function CompanionProfile() {
  const { id } = useParams<{ id: string }>();

  const [companion, setCompanion] =
    useState<CompanionProfileData | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCompanion() {
      if (!id) {
        setLoadError("The companion ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");
      setCompanion(null);

      try {
        const result = await apiRequest<CompanionApiResponse>(
          `/profiles/companion/${encodeURIComponent(id)}`,
        );

        if (!result.profile) {
          throw new Error("The companion profile was not found.");
        }

        if (cancelled) return;

        setCompanion(result.profile);
      } catch (error: unknown) {
        if (cancelled) return;

        setCompanion(null);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load the companion profile.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCompanion();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const displayName =
    companion?.name?.trim() || "EverSenior Companion";

  const availability = companion?.availability ?? [];
  const interests = companion?.interests ?? [];
  const hobbies = companion?.hobbies ?? [];
  const languages = companion?.languages ?? [];
  const experience = companion?.experience ?? [];
  const traits = companion?.personalityTraits ?? [];

  const activities = [...new Set([...hobbies, ...interests])];

  const services = experience.length
    ? experience
    : ["Social Companionship"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />

        <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E2DBD0] border-t-[#6F5139]" />

            <p className="mt-5 text-sm text-[#76685D]">
              Loading companion profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />

        <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
              <Search className="h-7 w-7" />
            </div>

            <h1 className="mt-6 font-serif text-3xl font-semibold">
              Companion not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#76685D]">
              {loadError ||
                "We couldn't find the companion you're looking for."}
            </p>

            <Link
              to="/senior/companions"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5D432F]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companions
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="mx-auto max-w-[1280px] px-5 py-8 md:px-8 md:py-10">
        <Link
          to="/senior/companions"
          className="mb-7 inline-flex items-center gap-2 text-sm text-[#76685D] transition hover:text-[#6F5139]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companions
        </Link>

        {/* Profile header */}

        <section className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-[0_8px_30px_rgba(48,39,31,0.04)]">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <div className="flex min-h-[280px] flex-col items-center justify-center bg-[#F3ECE3] p-8 lg:min-h-[420px]">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-white text-[#6F5139] shadow-sm">
                <UserRound className="h-16 w-16" />
              </div>

              <p className="mt-5 text-sm text-[#76685D]">
                EverSenior Companion
              </p>

              {availability.length > 0 && (
                <div className="mt-4 rounded-full bg-white px-4 py-2 text-sm text-[#6F5139]">
                  {availability.join(" · ")}
                </div>
              )}
            </div>

            <div className="p-7 md:p-10 lg:p-12">
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#9A7357]">
                    EverSenior Companion
                  </p>

                  <h1 className="mt-2 break-words font-serif text-3xl font-semibold leading-tight tracking-tight text-[#30271F] md:text-5xl">
                    {displayName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#76685D]">
                    {typeof companion.age === "number" && (
                      <span>{companion.age} years old</span>
                    )}

                    {companion.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {companion.city}
                      </span>
                    )}

                    {companion.gender && (
                      <span>{companion.gender}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFavorite((previous) => !previous)}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                    isFavorite
                      ? "border-[#6F5139] bg-[#F3ECE3] text-[#6F5139]"
                      : "border-[#DCD5CC] bg-white text-[#8B7E73] hover:border-[#6F5139] hover:text-[#6F5139]"
                  }`}
                  aria-label={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  title={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-[#76685D]">
                {companion.bio ||
                  "This companion has not added a biography yet."}
              </p>

              {/* Availability */}

              <div className="mt-7 rounded-xl bg-[#FBF8F3] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#30271F]">
                  <Clock3 className="h-5 w-5 text-[#6F5139]" />
                  Availability
                </div>

                <p className="mt-2 text-sm text-[#76685D]">
                  {availability.length
                    ? availability.join(", ")
                    : "Availability not provided"}
                </p>
              </div>

              {/* Actions */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/senior/companions/${encodeURIComponent(
                    companion.userId,
                  )}/book`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Request a Booking
                </Link>

                <Link
                  to="/senior/messages"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCD5CC] bg-white px-6 py-3.5 text-sm font-medium text-[#6F5139] transition hover:bg-[#F7F3EC]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Link>
              </div>

              <p className="mt-3 text-xs text-[#8B7B6B]">
                Booking and messaging availability depends on the features
                enabled in your account.
              </p>
            </div>
          </div>
        </section>

        {/* Details */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* About */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-7 shadow-[0_8px_30px_rgba(48,39,31,0.03)] md:p-9">
              <h2 className="font-serif text-3xl font-semibold text-[#30271F]">
                About {displayName}
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#76685D]">
                {companion.bio ||
                  "This companion has not added a biography yet."}
              </p>

              {traits.length > 0 && (
                <>
                  <h3 className="mt-7 text-sm font-semibold text-[#30271F]">
                    Personality traits
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-[#F3ECE3] px-4 py-2 text-sm text-[#6F5139]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Services / experience */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-7 shadow-[0_8px_30px_rgba(48,39,31,0.03)] md:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-[#30271F]">
                    Experience and support
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#76685D]">
                    Explore the companionship experience described in this
                    profile.
                  </p>
                </div>

                <div className="hidden rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs font-medium text-[#6F5139] sm:block">
                  {services.length} items
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-xl border border-[#EDE7DE] bg-[#FBF8F3] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                      <Check className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-medium text-[#5F5145]">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activities */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-7 shadow-[0_8px_30px_rgba(48,39,31,0.03)] md:p-9">
              <h2 className="font-serif text-3xl font-semibold text-[#30271F]">
                Interests and activities
              </h2>

              {activities.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {activities.map((activity) => (
                    <div
                      key={activity}
                      className="flex items-center gap-3 rounded-xl bg-[#FBF8F3] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <span className="text-sm text-[#76685D]">
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#76685D]">
                  No interests or activities have been added yet.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}

          <aside className="space-y-8">
            {/* Languages */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-7 shadow-[0_8px_30px_rgba(48,39,31,0.03)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <Languages className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#30271F]">
                    Languages
                  </h2>

                  <p className="mt-1 text-sm text-[#76685D]">
                    Languages listed in the profile.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {languages.length > 0 ? (
                  languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full border border-[#DCD5CC] px-4 py-2 text-sm text-[#76685D]"
                    >
                      {language}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[#76685D]">
                    No languages provided.
                  </p>
                )}
              </div>
            </section>

            {/* Interests */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-7 shadow-[0_8px_30px_rgba(48,39,31,0.03)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#30271F]">
                    Profile summary
                  </h2>

                  <p className="mt-1 text-sm text-[#76685D]">
                    Information shared by this companion.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-[#30271F]">
                    City
                  </p>
                  <p className="mt-1 text-[#76685D]">
                    {companion.city || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[#30271F]">
                    Interests
                  </p>
                  <p className="mt-1 text-[#76685D]">
                    {interests.length
                      ? interests.join(", ")
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[#30271F]">
                    Availability
                  </p>
                  <p className="mt-1 text-[#76685D]">
                    {availability.length
                      ? availability.join(", ")
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            {/* Booking reminder */}

            <section className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-7">
              <h2 className="font-serif text-2xl font-semibold text-[#30271F]">
                Ready to connect?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#76685D]">
                You can continue to the booking page to explore the next
                steps for requesting companionship.
              </p>

              <Link
                to={`/senior/companions/${encodeURIComponent(
                  companion.userId,
                )}/book`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
              >
                <CalendarDays className="h-4 w-4" />
                Continue to booking
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Languages,
  Sparkles,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";
import { apiRequest } from "../../api/client";

type CompanionProfile = {
  id?: string;
  name?: string;
  fullName?: string;
  age?: number | null;
  gender?: string | null;
  city?: string | null;
  languages?: string[];
  interests?: string[];
  hobbies?: string[];
  personalityTraits?: string[];
  availability?: string[];
  bio?: string;
  experience?: string[];
  isVerified?: boolean;
  photoUrl?: string | null;
};

type Booking = {
  id?: string;
  _id?: string;
  bookingId?: string;
  companionId?: string | { _id?: string; name?: string; fullName?: string };
  companion?: string | CompanionProfile;
  date?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  durationMinutes?: number;
  duration?: string | number;
  serviceType?: string;
  activity?: string;
  location?: string;
  price?: number;
  amount?: number;
  status?: string;
  notes?: string;
};

function getBookingList(response: unknown): Booking[] {
  if (Array.isArray(response)) return response as Booking[];

  if (response && typeof response === "object") {
    const data = response as Record<string, unknown>;

    if (Array.isArray(data.bookings)) return data.bookings as Booking[];
    if (Array.isArray(data.data)) return data.data as Booking[];
    if (Array.isArray(data.items)) return data.items as Booking[];
  }

  return [];
}

function getCompanion(booking: Booking): CompanionProfile | null {
  if (
    booking.companion &&
    typeof booking.companion === "object"
  ) {
    return booking.companion;
  }

  if (
    booking.companionId &&
    typeof booking.companionId === "object"
  ) {
    return booking.companionId;
  }

  return null;
}

function getCompanionName(booking: Booking): string {
  const companion = getCompanion(booking);

  if (companion) {
    return companion.name || companion.fullName || "Companion";
  }

  if (typeof booking.companion === "string" && booking.companion) {
    return booking.companion;
  }

  if (typeof booking.companionId === "string" && booking.companionId) {
    return "Your companion";
  }

  return "Companion";
}

function getId(booking: Booking, index: number): string {
  return String(booking.id ?? booking._id ?? booking.bookingId ?? index);
}

function formatDate(value?: string): string {
  if (!value) return "Date not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value?: string): string {
  if (!value) return "";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function normalizedStatus(status?: string): string {
  return (status || "requested").toLowerCase();
}

function statusText(status?: string): string {
  const value = normalizedStatus(status);

  if (value === "confirmed" || value === "accepted") return "Confirmed";
  if (value === "completed") return "Completed";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  if (value === "rejected") return "Rejected";
  if (value === "pending" || value === "requested") {
    return "Awaiting confirmation";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isUpcoming(booking: Booking): boolean {
  return [
    "requested",
    "pending",
    "confirmed",
    "accepted",
  ].includes(normalizedStatus(booking.status));
}

function isPast(booking: Booking): boolean {
  return [
    "completed",
    "cancelled",
    "canceled",
    "rejected",
  ].includes(normalizedStatus(booking.status));
}

function getDuration(booking: Booking): string {
  if (typeof booking.durationMinutes === "number") {
    const hours = Math.floor(booking.durationMinutes / 60);
    const minutes = booking.durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }

    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;

    return `${minutes} minutes`;
  }

  if (booking.duration !== undefined) {
    return typeof booking.duration === "number"
      ? `${booking.duration} hours`
      : booking.duration;
  }

  return "Duration not provided";
}

function getActivity(booking: Booking): string {
  const type = booking.serviceType || booking.activity;

  if (!type) return "Companionship session";

  const labels: Record<string, string> = {
    social: "Social Companionship",
    conversation: "Conversation & Companionship",
    walking: "Walking Companion",
    hobbies: "Shared Hobbies",
  };

  return labels[type.toLowerCase()] ||
    type.charAt(0).toUpperCase() + type.slice(1);
}

function getLocation(notes?: string): string | null {
  if (!notes) return null;

  const match = notes.match(/Meeting address:\s*([^\n]+)/i);
  return match?.[1]?.trim() || null;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<unknown>("/bookings");
      setBookings(getBookingList(response));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load bookings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  const upcoming = bookings.filter(isUpcoming);
  const past = bookings.filter(isPast);

  const completedHours = bookings
    .filter((booking) => normalizedStatus(booking.status) === "completed")
    .reduce((total, booking) => {
      if (typeof booking.durationMinutes === "number") {
        return total + booking.durationMinutes / 60;
      }

      if (typeof booking.duration === "number") {
        return total + booking.duration;
      }

      return total;
    }, 0);

  const companionCount = new Set(
    bookings.map((booking) => {
      const profile = getCompanion(booking);
      return profile?.id ||
        (typeof booking.companionId === "string"
          ? booking.companionId
          : getCompanionName(booking));
    }),
  ).size;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="mx-auto max-w-[1250px] px-5 py-10 md:px-8 md:py-16">
        <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8D6D54]">
              Your companionship
            </p>

            <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
              My Bookings
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#75695E]">
              View your upcoming companionship sessions, get to know your
              companions, and revisit your past experiences.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadBookings()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[#D8C9B8] px-5 py-3 text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              to="/senior/companions"
              className="inline-flex items-center gap-3 rounded-full bg-[#6F5139] px-7 py-3 text-sm font-medium text-white hover:bg-[#5B402D]"
            >
              Find a Companion →
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Upcoming sessions"
            value={upcoming.length}
            icon={<CalendarDays size={22} />}
          />
          <StatCard
            label="Completed hours"
            value={Number(completedHours.toFixed(1))}
            icon={<Clock size={22} />}
          />
          <StatCard
            label="Companions"
            value={companionCount}
            icon={<Heart size={22} />}
          />
        </section>

        {error && (
          <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              We couldn't load your bookings
            </h2>
            <p className="mt-2 break-words text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-700">
              Check that your backend is running and you are signed in.
            </p>
            <button
              type="button"
              onClick={() => void loadBookings()}
              className="mt-4 rounded-full bg-red-800 px-5 py-2 text-sm text-white"
            >
              Try again
            </button>
          </section>
        )}

        {loading ? (
          <div className="mt-12 rounded-3xl border border-[#E2DBD0] bg-white p-10 text-center">
            Loading your bookings…
          </div>
        ) : (
          <>
            <BookingSection
              title="Upcoming sessions"
              subtitle="Requested and confirmed sessions."
              bookings={upcoming}
              emptyMessage="You don't have any upcoming sessions yet."
            />

            <BookingSection
              title="Past sessions"
              subtitle="Completed, cancelled, or rejected bookings."
              bookings={past}
              emptyMessage="Your past sessions will appear here."
            />

            {!error && bookings.length === 0 && (
              <p className="mt-5 text-center text-xs text-[#81756A]">
                No bookings were returned by the API.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#81756A]">{label}</p>
          <p className="mt-3 font-serif text-4xl">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function BookingSection({
  title,
  subtitle,
  bookings,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  bookings: Booking[];
  emptyMessage: string;
}) {
  return (
    <section className="mt-14">
      <div className="mb-7">
        <h2 className="font-serif text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-[#81756A]">{subtitle}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-[#E2DBD0] bg-white px-6 py-12 text-center">
          <CalendarDays className="mx-auto text-[#6F5139]" size={30} />
          <h3 className="mt-5 font-serif text-2xl">Nothing to show yet</h3>
          <p className="mt-3 text-sm text-[#81756A]">{emptyMessage}</p>

          <Link
            to="/senior/companions"
            className="mt-6 inline-flex rounded-full bg-[#6F5139] px-6 py-3 text-sm text-white hover:bg-[#5B402D]"
          >
            Find a Companion
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking, index) => {
            const status = normalizedStatus(booking.status);
            const companion = getCompanion(booking);
            const name = getCompanionName(booking);
            const activity = getActivity(booking);
            const location = booking.location || getLocation(booking.notes);

            const time = [
              formatTime(booking.startTime),
              formatTime(booking.endTime),
            ].filter(Boolean).join(" – ");

            return (
              <article
                key={getId(booking, index)}
                className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white"
              >
                <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-start md:p-8">
                  <div className="flex min-w-0 items-start gap-4">
                    <CompanionAvatar
                      name={name}
                      photoUrl={companion?.photoUrl}
                    />

                    <div className="min-w-0">
                      <h3 className="font-serif text-2xl">{activity}</h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{name}</span>

                        {companion?.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            <ShieldCheck size={13} />
                            Verified
                          </span>
                        )}
                      </div>

                      {companion && (
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#81756A]">
                          {companion.age != null && (
                            <span>{companion.age} years old</span>
                          )}
                          {companion.gender && <span>{companion.gender}</span>}
                          {companion.city && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={13} />
                              {companion.city}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={status} />
                </div>

                {companion?.bio && (
                  <div className="mx-6 rounded-2xl bg-[#FCFAF7] p-5 md:mx-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8D6D54]">
                      Meet your companion
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#75695E]">
                      {companion.bio}
                    </p>
                  </div>
                )}

                {((companion?.interests?.length ?? 0) > 0 ||
                  (companion?.hobbies?.length ?? 0) > 0 ||
                  (companion?.languages?.length ?? 0) > 0) && (
                  <div className="flex flex-wrap gap-2 px-6 pt-4 md:px-8">
                    {companion?.interests?.map((interest) => (
                      <span
                        key={`interest-${interest}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs text-[#79583F]"
                      >
                        <Sparkles size={12} />
                        {interest}
                      </span>
                    ))}

                    {companion?.hobbies?.map((hobby) => (
                      <span
                        key={`hobby-${hobby}`}
                        className="rounded-full border border-[#E2DBD0] px-3 py-1.5 text-xs text-[#75695E]"
                      >
                        {hobby}
                      </span>
                    ))}

                    {companion?.languages && companion.languages.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#E2DBD0] px-3 py-1.5 text-xs text-[#75695E]">
                        <Languages size={12} />
                        {companion.languages.join(", ")}
                      </span>
                    )}
                  </div>
                )}

                <div className="mx-6 mt-6 border-t border-[#E8E1D7] md:mx-8" />

                <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
                  <Detail
                    icon={<CalendarDays size={20} />}
                    label="Date"
                    value={formatDate(booking.date)}
                  />

                  <Detail
                    icon={<Clock size={20} />}
                    label="Time"
                    value={time || "Time not provided"}
                    extra={getDuration(booking)}
                  />

                  <Detail
                    icon={<Heart size={20} />}
                    label="Price"
                    value={
                      typeof booking.price === "number"
                        ? `₹${booking.price}`
                        : typeof booking.amount === "number"
                          ? `₹${booking.amount}`
                          : "Not provided"
                    }
                  />
                </div>

                {location && (
                  <div className="flex items-start gap-3 border-t border-[#E8E1D7] px-6 py-4 text-sm text-[#75695E] md:px-8">
                    <MapPin size={17} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-[#30271F]">Meeting location</p>
                      <p className="mt-1 break-words">{location}</p>
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <details className="border-t border-[#E8E1D7] bg-[#FCFAF7] px-6 py-4 md:px-8">
                    <summary className="cursor-pointer text-sm font-medium text-[#79583F]">
                      View booking notes
                    </summary>
                    <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[#75695E]">
                      {booking.notes}
                    </p>
                  </details>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function CompanionAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] text-[#6F5139]">
      {photoUrl && !imageFailed ? (
        <img
          src={photoUrl}
          alt={`${name}'s profile`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <UserRound size={29} aria-hidden="true" />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "confirmed" || status === "accepted"
      ? "bg-emerald-50 text-emerald-800"
      : status === "completed"
        ? "bg-blue-50 text-blue-800"
        : status === "cancelled" || status === "canceled" || status === "rejected"
          ? "bg-red-50 text-red-800"
          : "bg-[#F3ECE3] text-[#79583F]";

  return (
    <span className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-4 py-2 text-xs font-medium ${style}`}>
      <CheckCircle2 size={15} />
      {statusText(status)}
    </span>
  );
}

function Detail({
  icon,
  label,
  value,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#9A8574]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
        {extra && (
          <p className="mt-1 text-xs text-[#81756A]">{extra}</p>
        )}
      </div>
    </div>
  );
}

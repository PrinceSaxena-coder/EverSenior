
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  IndianRupee,
  MapPin,
  Plus,
  Settings2,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";
import { apiRequest } from "../../api/client";

type ApiBooking = {
  id: string;
  seniorId: string;
  companionId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  serviceType: string;
  price: number;
  status: string;
  notes?: string;
  senior?: {
    id?: string;
    name?: string;
    age?: number | null;
  };
};

type SessionStatus = "Requested" | "Upcoming" | "Completed" | "Cancelled";

type Session = {
  id: string;
  seniorName: string;
  seniorId: string;
  age?: number;
  title: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  earning: number;
  status: SessionStatus;
  rating?: number;
  image: string;
};

type ApiAvailabilitySlot = {
  id?: string;
  _id?: string;
  companionId?: string;
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type AvailabilitySlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_API_VALUES: Record<string, string> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

const TIME_SLOTS = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const IMAGE_FALLBACK = "/images/eversenior-seniors.jpg";

function formatDate(value: string): string {
  if (!value) return "Date not provided";

  const parts = value.slice(0, 10).split("-");
  if (parts.length !== 3) return value;

  const [year, month, day] = parts.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(value: string): string {
  if (!value) return "Time not provided";

  const [hoursString, minutesString] = value.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "Duration unavailable";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} minutes`;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getServiceLabel(serviceType: string): string {
  const labels: Record<string, string> = {
    social: "Social Companionship",
    outing: "Outing Companionship",
    hobbies: "Hobbies & Interests",
    health: "Wellness Companionship",
    technology: "Technology Assistance",
  };

  return labels[serviceType?.toLowerCase()] ??
    (serviceType || "Companionship");
}

function getSessionTitle(serviceType: string): string {
  const titles: Record<string, string> = {
    social: "Social Companionship Session",
    outing: "Outing & Conversation",
    hobbies: "Hobbies & Interests Session",
    health: "Wellness Companion Session",
    technology: "Technology Assistance",
  };

  return titles[serviceType?.toLowerCase()] ?? "Companionship Session";
}

function mapBooking(booking: ApiBooking): Session {
  const normalizedStatus = booking.status?.toLowerCase();

  let status: SessionStatus = "Requested";

  if (normalizedStatus === "confirmed") status = "Upcoming";
  else if (normalizedStatus === "completed") status = "Completed";
  else if (normalizedStatus === "cancelled") status = "Cancelled";

  const addressMatch = booking.notes?.match(
    /(?:Meeting address|Address):\s*([^\n]+)/i,
  );

  return {
    id: booking.id,
    seniorId: booking.seniorId,
    seniorName:
      booking.senior?.name ||
      `Senior · ${booking.seniorId?.slice(-4) || "Unknown"}`,
    age: booking.senior?.age == null ? undefined : booking.senior.age,
    title: getSessionTitle(booking.serviceType),
    category: getServiceLabel(booking.serviceType),
    date: formatDate(booking.date),
    time: `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`,
    duration: getDuration(booking.durationMinutes),
    location: addressMatch?.[1]?.trim() || "Location not provided",
    earning: Number(booking.price) || 0,
    status,
    image: IMAGE_FALLBACK,
  };
}

function toApiTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) throw new Error(`Invalid time: ${time}`);

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time: ${time}`);
  }

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function fromApiTime(time: string): string {
  const match = time.match(/^(\d{2}):(\d{2})$/);

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function mapAvailability(slot: ApiAvailabilitySlot): AvailabilitySlot {
  const normalizedDay = slot.day.toLowerCase();

  const displayDay =
    DAYS.find((day) => DAY_API_VALUES[day] === normalizedDay) ?? slot.day;

  return {
    id: String(slot.id ?? slot._id ?? ""),
    day: displayDay,
    startTime: fromApiTime(slot.startTime),
    endTime: fromApiTime(slot.endTime),
    isActive: slot.isActive !== false,
  };
}

export default function MySessions() {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "history" | "availability"
  >("upcoming");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [removingAvailabilityId, setRemovingAvailabilityId] = useState<
    string | null
  >(null);
  const [availabilityError, setAvailabilityError] = useState("");

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("12:00 PM");
  const [saveMessage, setSaveMessage] = useState("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await apiRequest<{ bookings?: ApiBooking[] }>("bookings");
      const bookings = Array.isArray(response?.bookings)
        ? response.bookings
        : [];

      setSessions(bookings.map(mapBooking));
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load bookings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    setAvailabilityError("");

    try {
      const response = await apiRequest<{
        availability?: ApiAvailabilitySlot[];
      }>("availability/me");

      const slots = Array.isArray(response?.availability)
        ? response.availability
        : [];

      setAvailability(
        slots.map(mapAvailability).filter((slot) => slot.isActive && slot.id),
      );
    } catch (error) {
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Unable to load your availability.",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
    void loadAvailability();
  }, [loadBookings, loadAvailability]);

  const upcomingSessions = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.status === "Requested" || session.status === "Upcoming",
      ),
    [sessions],
  );

  const historySessions = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.status === "Completed" || session.status === "Cancelled",
      ),
    [sessions],
  );

  const completedSessions = useMemo(
    () => sessions.filter((session) => session.status === "Completed"),
    [sessions],
  );

  const totalEarnings = useMemo(
    () =>
      completedSessions.reduce((total, session) => total + session.earning, 0),
    [completedSessions],
  );

  const performBookingAction = async (
    session: Session,
    action: "confirm" | "complete" | "cancel",
  ) => {
    setActionLoadingId(session.id);
    setActionMessage("");
    setActionError("");

    try {
      await apiRequest(
        `bookings/${encodeURIComponent(session.id)}/${action}`,
        { method: "POST" },
      );

      const messages = {
        confirm: "Session confirmed successfully.",
        complete: "Session marked as completed.",
        cancel: "Session cancelled successfully.",
      };

      setActionMessage(messages[action]);
      await loadBookings();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The action failed. Please try again.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const addAvailability = async () => {
    setSaveMessage("");
    setAvailabilityError("");

    let apiStartTime: string;
    let apiEndTime: string;

    try {
      apiStartTime = toApiTime(startTime);
      apiEndTime = toApiTime(endTime);
    } catch (error) {
      setAvailabilityError(
        error instanceof Error ? error.message : "Invalid time selected.",
      );
      return;
    }

    if (timeToMinutes(apiEndTime) <= timeToMinutes(apiStartTime)) {
      setAvailabilityError("End time must be later than start time.");
      return;
    }

    const alreadyExists = availability.some(
      (slot) =>
        slot.day === selectedDay &&
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );

    if (alreadyExists) {
      setAvailabilityError("This time slot has already been added.");
      return;
    }

    setAvailabilitySaving(true);

    try {
      await apiRequest("availability", {
        method: "POST",
        body: JSON.stringify({
          day: DAY_API_VALUES[selectedDay],
          startTime: apiStartTime,
          endTime: apiEndTime,
        }),
      });

      await loadAvailability();
      setSaveMessage("Your availability has been saved to the database.");
    } catch (error) {
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Unable to save availability. Please try again.",
      );
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const removeAvailability = async (id: string) => {
    if (!id) {
      setAvailabilityError("This availability slot has an invalid ID.");
      return;
    }

    setAvailabilityError("");
    setSaveMessage("");
    setRemovingAvailabilityId(id);

    try {
      await apiRequest(
        `availability/${encodeURIComponent(id)}/deactivate`,
        { method: "PATCH" },
      );

      await loadAvailability();
      setSaveMessage("Availability slot removed successfully.");
    } catch (error) {
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Unable to remove this slot. Please try again.",
      );
    } finally {
      setRemovingAvailabilityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <CompanionNavbar />

      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#7A624C]">
                Your schedule
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                My Sessions
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716458] sm:text-base">
                Keep track of your bookings, past experiences and the times you
                are available.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("availability")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] md:self-auto"
            >
              <Settings2 size={16} />
              Manage Availability
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<CalendarCheck size={19} />}
              label="Active bookings"
              value={upcomingSessions.length.toString()}
              description="requested and confirmed"
            />
            <StatCard
              icon={<History size={19} />}
              label="Completed"
              value={completedSessions.length.toString()}
              description="sessions completed"
            />
            <StatCard
              icon={<IndianRupee size={19} />}
              label="Earnings"
              value={`₹${totalEarnings.toLocaleString("en-IN")}`}
              description="value of completed bookings"
            />
            <StatCard
              icon={<Clock3 size={19} />}
              label="Availability"
              value={availability.length.toString()}
              description={
                availability.length === 1 ? "time slot added" : "time slots added"
              }
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2DBD0] bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
            <TabButton
              active={activeTab === "upcoming"}
              icon={<CalendarCheck size={17} />}
              label={`Bookings (${upcomingSessions.length})`}
              onClick={() => setActiveTab("upcoming")}
            />
            <TabButton
              active={activeTab === "history"}
              icon={<History size={17} />}
              label={`History (${historySessions.length})`}
              onClick={() => setActiveTab("history")}
            />
            <TabButton
              active={activeTab === "availability"}
              icon={<Clock3 size={17} />}
              label="My Availability"
              onClick={() => setActiveTab("availability")}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {actionMessage && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-[#EDF5EE] px-4 py-3 text-sm font-medium text-[#47714E]">
            <CheckCircle2 size={17} />
            {actionMessage}
          </div>
        )}

        {actionError && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-[#F7EAE6] px-4 py-3 text-sm font-medium text-[#9B5A4A]">
            <XCircle size={17} />
            {actionError}
          </div>
        )}

        {activeTab !== "availability" && isLoading && (
          <div className="rounded-2xl border border-[#E3DBD1] bg-white px-6 py-12 text-center text-sm text-[#716458]">
            Loading your bookings...
          </div>
        )}

        {activeTab !== "availability" && !isLoading && loadError && (
          <div className="rounded-2xl border border-[#E3DBD1] bg-white p-6">
            <p className="text-sm text-[#9B5A4A]">{loadError}</p>
            <button
              onClick={() => void loadBookings()}
              className="mt-4 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5F4633]"
            >
              Try again
            </button>
          </div>
        )}

        {activeTab === "upcoming" && !isLoading && !loadError && (
          <UpcomingSection
            sessions={upcomingSessions}
            actionLoadingId={actionLoadingId}
            onAction={performBookingAction}
          />
        )}

        {activeTab === "history" && !isLoading && !loadError && (
          <HistorySection sessions={historySessions} />
        )}

        {activeTab === "availability" && (
          <AvailabilitySection
            availability={availability}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            addAvailability={addAvailability}
            removeAvailability={removeAvailability}
            saveMessage={saveMessage}
            availabilityLoading={availabilityLoading}
            availabilitySaving={availabilitySaving}
            removingAvailabilityId={removingAvailabilityId}
            availabilityError={availabilityError}
            retryAvailability={() => void loadAvailability()}
          />
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[104px] items-center gap-4 rounded-2xl border border-[#E5DDD3] bg-[#FBF9F6] px-5 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DC] text-[#6F5139]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#887868]">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-[#30271F]">
          {value}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#938476]">{description}</p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#6F5139] text-white shadow-sm"
          : "text-[#65594E] hover:bg-[#F3ECE3] hover:text-[#6F5139]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function UpcomingSection({
  sessions,
  actionLoadingId,
  onAction,
}: {
  sessions: Session[];
  actionLoadingId: string | null;
  onAction: (
    session: Session,
    action: "confirm" | "complete" | "cancel",
  ) => void;
}) {
  return (
    <div>
      <SectionHeading
        eyebrow="Your schedule"
        title="Your bookings"
        description="Review requests and manage your confirmed companionship sessions."
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={24} />}
          title="No active bookings"
          description="New session requests will appear here when a senior books a session with you."
          buttonText="Explore Sessions"
          buttonLink="/companion/explore"
        />
      ) : (
        <div className="mt-6 grid gap-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              actionLoading={actionLoadingId === session.id}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistorySection({ sessions }: { sessions: Session[] }) {
  return (
    <div>
      <SectionHeading
        eyebrow="Your journey"
        title="Session history"
        description="A record of your completed and cancelled sessions."
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={<History size={24} />}
          title="No session history yet"
          description="Your completed and cancelled sessions will appear here."
          buttonText="Explore Sessions"
          buttonLink="/companion/explore"
        />
      ) : (
        <div className="mt-6 grid gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  actionLoading = false,
  onAction,
}: {
  session: Session;
  actionLoading?: boolean;
  onAction?: (
    session: Session,
    action: "confirm" | "complete" | "cancel",
  ) => void;
}) {
  return (
    <article className="rounded-2xl border border-[#E3DBD1] bg-white p-4 transition hover:border-[#D3C5B6] hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EDE3D7]">
            <img
              src={session.image}
              alt={session.seniorName}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={session.status} />
              <span className="text-xs text-[#968779]">{session.category}</span>
            </div>

            <h3 className="mt-1 text-lg font-semibold text-[#30271F]">
              {session.title}
            </h3>

            <p className="mt-0.5 text-sm text-[#716458]">
              With {session.seniorName}
              {session.age != null ? `, ${session.age}` : ""}
            </p>
          </div>
        </div>

        <div className="grid gap-3 border-t border-[#EEE7DF] pt-4 sm:grid-cols-3 lg:min-w-[430px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <DetailItem icon={<CalendarDays size={15} />} label={session.date} />
          <DetailItem
            icon={<Clock3 size={15} />}
            label={`${session.time} · ${session.duration}`}
          />
          <DetailItem icon={<MapPin size={15} />} label={session.location} />
        </div>

        <div className="flex items-center justify-between border-t border-[#EEE7DF] pt-4 sm:justify-end sm:gap-5 lg:min-w-[145px] lg:border-t-0 lg:pt-0">
          <div>
            <p className="text-[11px] text-[#938476]">Booking value</p>
            <p className="mt-0.5 flex items-center gap-0.5 text-lg font-semibold text-[#30271F]">
              <IndianRupee size={15} />
              {session.earning.toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            to={`/companion/sessions/${session.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED3C7] text-[#6F5139] transition hover:bg-[#F7F3EC]"
            title="View session details"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {session.status === "Completed" && session.rating && (
        <div className="mt-4 flex items-center gap-2 border-t border-[#EEE7DF] pt-3">
          <span className="text-xs text-[#897A6C]">Your rating</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: session.rating }).map((_, index) => (
              <Star
                key={index}
                size={13}
                className="fill-[#8A735D] text-[#8A735D]"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#6F5139]">
            {session.rating}/5
          </span>
        </div>
      )}

      {session.status === "Cancelled" && (
        <div className="mt-4 flex items-center gap-2 border-t border-[#EEE7DF] pt-3 text-xs font-medium text-[#9B5A4A]">
          <XCircle size={14} />
          This session was cancelled.
        </div>
      )}

      {onAction &&
        (session.status === "Requested" || session.status === "Upcoming") && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EEE7DF] pt-4">
            {session.status === "Requested" && (
              <button
                disabled={actionLoading}
                onClick={() => onAction(session, "confirm")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                {actionLoading ? "Processing..." : "Confirm session"}
              </button>
            )}

            {session.status === "Upcoming" && (
              <button
                disabled={actionLoading}
                onClick={() => onAction(session, "complete")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EDF5EE] px-4 py-2.5 text-sm font-semibold text-[#47714E] transition hover:bg-[#DCEBDD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                {actionLoading ? "Processing..." : "Mark completed"}
              </button>
            )}

            <button
              disabled={actionLoading}
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel this booking?",
                  )
                ) {
                  onAction(session, "cancel");
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8D3CD] px-4 py-2.5 text-sm font-semibold text-[#9B5A4A] transition hover:bg-[#F7EAE6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle size={16} />
              Cancel booking
            </button>
          </div>
        )}
    </article>
  );
}

function DetailItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-[#806B56]">{icon}</span>
      <span className="text-xs leading-5 text-[#65594E]">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: SessionStatus }) {
  if (status === "Requested") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3D9] px-2.5 py-1 text-[11px] font-semibold text-[#8A641C]">
        <Clock3 size={12} />
        Requested
      </span>
    );
  }

  if (status === "Upcoming") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF5EE] px-2.5 py-1 text-[11px] font-semibold text-[#47714E]">
        <CheckCircle2 size={12} />
        Confirmed
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3ECE3] px-2.5 py-1 text-[11px] font-semibold text-[#6F5139]">
        <CheckCircle2 size={12} />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7EAE6] px-2.5 py-1 text-[11px] font-semibold text-[#9B5A4A]">
      <XCircle size={12} />
      Cancelled
    </span>
  );
}

function AvailabilitySection({
  availability,
  selectedDay,
  setSelectedDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  addAvailability,
  removeAvailability,
  saveMessage,
  availabilityLoading,
  availabilitySaving,
  removingAvailabilityId,
  availabilityError,
  retryAvailability,
}: {
  availability: AvailabilitySlot[];
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  addAvailability: () => void;
  removeAvailability: (id: string) => void;
  saveMessage: string;
  availabilityLoading: boolean;
  availabilitySaving: boolean;
  removingAvailabilityId: string | null;
  availabilityError: string;
  retryAvailability: () => void;
}) {
  return (
    <div>
      <SectionHeading
        eyebrow="Your time"
        title="My Availability"
        description="Choose when you are comfortable receiving session opportunities. Your availability does not automatically commit you to a session."
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-[#E3DBD1] bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
              <CalendarDays size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-[#30271F]">Add a time slot</h3>
              <p className="mt-1 text-sm leading-5 text-[#786B5F]">
                Pick a day and the time range that works best for you.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-[#8B7968]">
              Day
            </label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                    selectedDay === day
                      ? "border-[#6F5139] bg-[#6F5139] text-white"
                      : "border-[#E2DBD0] bg-[#FBF9F6] text-[#5F4633] hover:bg-[#F3ECE3]"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Start time"
              value={startTime}
              options={TIME_SLOTS}
              onChange={setStartTime}
            />
            <SelectField
              label="End time"
              value={endTime}
              options={TIME_SLOTS}
              onChange={setEndTime}
            />
          </div>

          {availabilityError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F7EAE6] px-3.5 py-3 text-sm font-medium text-[#9B5A4A]">
              <XCircle size={16} />
              <span>{availabilityError}</span>
              {!availabilityLoading && (
                <button
                  onClick={retryAvailability}
                  className="ml-auto shrink-0 underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {saveMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#EDF5EE] px-3.5 py-3 text-sm font-medium text-[#47714E]">
              <CheckCircle2 size={16} />
              {saveMessage}
            </div>
          )}

          <button
            onClick={() => void addAvailability()}
            disabled={availabilitySaving || availabilityLoading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={17} />
            {availabilitySaving ? "Saving..." : "Add Time Slot"}
          </button>
        </div>

        <div className="rounded-2xl border border-[#E3DBD1] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[#30271F]">Your availability</h3>
              <p className="mt-1 text-sm text-[#786B5F]">
                {availabilityLoading
                  ? "Loading saved slots..."
                  : availability.length === 0
                    ? "No time slots added yet."
                    : `${availability.length} ${
                        availability.length === 1 ? "slot" : "slots"
                      } available`}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
              <Clock3 size={17} />
            </div>
          </div>

          {availabilityLoading ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#D8CEC1] bg-[#FBF9F6] px-5 py-10 text-center">
              <Clock3 size={22} className="mx-auto animate-pulse text-[#8A735D]" />
              <p className="mt-3 text-sm text-[#4A4037]">
                Loading your saved availability...
              </p>
            </div>
          ) : availability.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#D8CEC1] bg-[#FBF9F6] px-5 py-10 text-center">
              <Clock3 size={22} className="mx-auto text-[#8A735D]" />
              <p className="mt-3 text-sm font-semibold text-[#4A4037]">
                No availability yet
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#837568]">
                Add your preferred days and times to help EverSenior find
                suitable sessions for you.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {DAYS.map((day) => {
                const slots = availability.filter((slot) => slot.day === day);

                if (slots.length === 0) return null;

                return (
                  <div key={day}>
                    <p className="mb-2 text-xs font-semibold text-[#806B56]">
                      {day}
                    </p>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between rounded-xl border border-[#E9E1D8] bg-[#FBF9F6] px-3.5 py-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFE6DC] text-[#6F5139]">
                              <Clock3 size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#4A4037]">
                                {slot.startTime} – {slot.endTime}
                              </p>
                              <p className="text-[11px] text-[#928375]">
                                Available
                              </p>
                            </div>
                          </div>
                          <button
                            disabled={removingAvailabilityId === slot.id}
                            onClick={() => void removeAvailability(slot.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9B5A4A] transition hover:bg-[#F7EAE6] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Remove slot"
                          >
                            {removingAvailabilityId === slot.id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 rounded-xl bg-[#F3ECE3] p-3.5">
            <p className="text-xs leading-5 text-[#6D6054]">
              <span className="font-semibold text-[#5F4633]">Remember:</span>{" "}
              your active availability is stored in the EverSenior backend.
              Removing a slot deactivates it rather than deleting its record.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E3DBD1] bg-[#F3ECE3] p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
          <Settings2 size={17} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#30271F]">
            Your time, your choice
          </p>
          <p className="mt-1 text-xs leading-5 text-[#6D6054]">
            You can change your availability whenever your schedule changes.
            You still choose which sessions to accept.
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8B7968]">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#E2DBD0] bg-[#FBF9F6] px-3 text-sm text-[#4A4037] outline-none transition focus:border-[#8A735D] focus:ring-2 focus:ring-[#EDE3D7]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#30271F]">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74675B]">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-[#D8CEC1] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#30271F]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A6D60]">
        {description}
      </p>
      <Link
        to={buttonLink}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
      >
        {buttonText}
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

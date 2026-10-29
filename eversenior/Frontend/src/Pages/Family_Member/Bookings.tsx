import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  UserRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  MessageCircle,
  ChevronDown,
  Filter,
  X,
  Phone,
  Home,
} from "lucide-react";
import FamilyNavbar from "./FamilyNavbar";
import { apiRequest } from "../../api/client";

type BookingStatus =
  | "confirmed"
  | "upcoming"
  | "completed"
  | "cancelled";

type Booking = {
  id: string;
  seniorId: string;
  seniorName: string;
  companionId: string;
  companionName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  paymentMethod: string;
  subtotal: number;
  platformFee: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  familyNote?: string;
};

type FilterType = "all" | "upcoming" | "completed" | "cancelled";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null
  );
  const [seniorFilter, setSeniorFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    void loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setLoadError("");
    try {
      type ApiBooking = {
        id: string;
        seniorId: string;
        companionId: string;
        companion?: { name?: string };
        date: string;
        startTime: string;
        durationMinutes: number;
        serviceType: string;
        price: number;
        status: "requested" | "confirmed" | "cancelled" | "completed";
        notes?: string;
      };
      type ApiBookingsResponse = { bookings?: ApiBooking[] };
      type FamilyAccessItem = { access: { seniorId: string; status: string; permissions: string[] } };
      type FamilyAccessResponse = { accesses?: FamilyAccessItem[] };
      type SeniorProfileResponse = { senior: { id: string; name: string } };

      const [bookingResponse, accessResponse] = await Promise.all([
        apiRequest<ApiBookingsResponse>("/bookings"),
        apiRequest<FamilyAccessResponse>("/family/access"),
      ]);
      const seniorNamesById = new Map<string, string>();
      const allowedSeniors = (accessResponse.accesses ?? []).filter(
        (item) => item.access.status === "active" && item.access.permissions?.includes("view_profile"),
      );
      await Promise.all(allowedSeniors.map(async ({ access }) => {
        try {
          const response = await apiRequest<SeniorProfileResponse>(
            `/family/seniors/${encodeURIComponent(access.seniorId)}/profile`,
          );
          seniorNamesById.set(access.seniorId, response.senior.name || "Linked senior");
        } catch {
          seniorNamesById.set(access.seniorId, "Linked senior");
        }
      }));

      const serviceLabels: Record<string, string> = {
        social: "Social Companionship",
        outing: "Outing Companionship",
        hobbies: "Hobbies & Interests",
        support: "Non-Medical Support",
        tech: "Tech Companionship",
        travel: "Travel Companionship",
      };
      const mapped: Booking[] = (bookingResponse.bookings ?? []).map((booking) => {
        const price = Number(booking.price) || 0;
        return {
          id: booking.id,
          seniorId: booking.seniorId,
          seniorName: seniorNamesById.get(booking.seniorId) || "Linked senior",
          companionId: booking.companionId,
          companionName: booking.companion?.name || "Companion",
          service: serviceLabels[booking.serviceType] || booking.serviceType,
          date: String(booking.date).slice(0, 10),
          time: booking.startTime,
          duration: Math.round((booking.durationMinutes / 60) * 100) / 100,
          location: "Location to be confirmed",
          paymentMethod: "Payment status managed separately",
          subtotal: price,
          platformFee: 0,
          total: price,
          status: booking.status === "requested" ? "upcoming" : booking.status,
          createdAt: String(booking.date),
          familyNote: booking.notes || "",
        };
      });
      mapped.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      setBookings(mapped);
    } catch (err) {
      setBookings([]);
      setLoadError(err instanceof Error ? err.message : "Unable to load bookings from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const seniorNames = useMemo(() => {
    return Array.from(
      new Set(bookings.map((booking) => booking.seniorName))
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        activeFilter === "all" || booking.status === activeFilter;

      const matchesSenior =
        seniorFilter === "all" ||
        booking.seniorName === seniorFilter;

      return matchesStatus && matchesSenior;
    });
  }, [bookings, activeFilter, seniorFilter]);

  const upcomingCount = bookings.filter(
    (booking) =>
      booking.status === "upcoming" ||
      booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.total, 0);

  const cancelBooking = async (id: string) => {
    try {
      await apiRequest(`/bookings/${encodeURIComponent(id)}/cancel`, { method: "POST" });
      setSelectedBooking(null);
      await loadBookings();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to cancel this booking.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B6B4D]">
                Family Bookings
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Manage your family's sessions
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6257] md:text-base">
                Keep track of upcoming companionship sessions, completed
                visits and your family's booking history.
              </p>
            </div>

            <Link
              to="/family/companions"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
            >
              Book a Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Upcoming"
              value={upcomingCount.toString()}
              description="Sessions scheduled"
            />

            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Completed"
              value={completedCount.toString()}
              description="Sessions completed"
            />

            <StatCard
              icon={<XCircle className="h-5 w-5" />}
              label="Cancelled"
              value={cancelledCount.toString()}
              description="Cancelled sessions"
            />

            <StatCard
              icon={<IndianRupee className="h-5 w-5" />}
              label="Total Spent"
              value={`₹${totalSpent.toLocaleString("en-IN")}`}
              description="Across bookings"
            />
          </div>

          {/* Filters */}
          <div className="mt-8 rounded-2xl border border-[#E2DBD0] bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className="h-4 w-4 shrink-0 text-[#6F5139]" />

                {[
                  { id: "all", label: "All Bookings" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((filter) => {
                  const active = activeFilter === filter.id;

                  return (
                    <button
                      key={filter.id}
                      onClick={() =>
                        setActiveFilter(filter.id as FilterType)
                      }
                      className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                        active
                          ? "bg-[#6F5139] text-white"
                          : "text-[#6F6257] hover:bg-[#F7F3EC]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDD5CB] px-4 py-2 text-xs font-semibold text-[#5F4633] lg:hidden"
              >
                <Filter className="h-4 w-4" />
                More Filters
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block`}
              >
                <select
                  value={seniorFilter}
                  onChange={(event) =>
                    setSeniorFilter(event.target.value)
                  }
                  className="w-full rounded-lg border border-[#DDD5CB] bg-white px-3 py-2 text-xs font-medium text-[#5F4633] outline-none focus:border-[#6F5139] lg:w-48"
                >
                  <option value="all">All Seniors</option>

                  {seniorNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Booking list */}
          {loadError && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{loadError}<button type="button" onClick={() => void loadBookings()} className="ml-3 font-semibold underline">Retry</button></div>}
          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-[#E2DBD0] bg-white p-10 text-center text-sm text-[#6F6257]">Loading bookings from your account…</div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState activeFilter={activeFilter} />
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => setSelectedBooking(booking)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Trust footer */}
          <div className="mt-8 rounded-2xl border border-[#E2DBD0] bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#4F4034]">
                    Your family's bookings are protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#766B61]">
                    Booking records, companion details and payment information
                    stay connected to your family account.
                  </p>
                </div>
              </div>

              <Link
                to="/family/safety"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6F5139]"
              >
                Safety Center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Details modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={() => cancelBooking(selectedBooking.id)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking Card */
/* -------------------------------------------------------------------------- */

function BookingCard({
  booking,
  onView,
}: {
  booking: Booking;
  onView: () => void;
}) {
  const isUpcoming =
    booking.status === "upcoming" ||
    booking.status === "confirmed";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm transition hover:shadow-md">
      <div
        className={`h-1 ${
          booking.status === "completed"
            ? "bg-[#9A856F]"
            : booking.status === "cancelled"
            ? "bg-[#C5B8AA]"
            : "bg-[#6F5139]"
        }`}
      />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Main */}
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECE3] text-[#6F5139]">
              <Users className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-[#30271F]">
                  {booking.service}
                </h2>

                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#766B61]">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  {booking.seniorName}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {booking.companionName}
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="rounded-2xl bg-[#F7F3EC] px-5 py-3 lg:min-w-[190px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#968A80]">
              Session
            </p>

            <div className="mt-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#6F5139]" />

              <p className="text-sm font-semibold text-[#4F4034]">
                {formatDate(booking.date)}
              </p>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#8B6B4D]" />

              <p className="text-xs text-[#766B61]">
                {formatTime(booking.time)} · {booking.duration}{" "}
                {booking.duration === 1 ? "hour" : "hours"}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="lg:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#968A80]">
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-[#6F5139]">
              ₹{booking.total.toLocaleString("en-IN")}
            </p>

            <button
              onClick={onView}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#6F5139] hover:text-[#4F3929]"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#EAE4DB] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 text-xs text-[#766B61]">
            <MapPin className="h-4 w-4 shrink-0 text-[#8B6B4D]" />

            <span className="truncate">{booking.location}</span>
          </div>

          <div className="flex items-center gap-3">
            {isUpcoming && (
              <Link
                to="/family/messages"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCD4CA] px-3 py-2 text-xs font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Link>
            )}

            <button
              onClick={onView}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#6F5139] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5F4633]"
            >
              View Booking
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking Details Modal */
/* -------------------------------------------------------------------------- */

function BookingDetailsModal({
  booking,
  onClose,
  onCancel,
}: {
  booking: Booking;
  onClose: () => void;
  onCancel: () => void;
}) {
  const isUpcoming =
    booking.status === "upcoming" ||
    booking.status === "confirmed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#30271F]/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E7E0D7] bg-white p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B4D]">
                Booking Details
              </p>

              <StatusBadge status={booking.status} />
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#30271F]">
              {booking.service}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DDD5CB] text-[#6F6257] transition hover:bg-[#F7F3EC]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 md:p-6">
          {/* People */}
          <div className="grid gap-4 sm:grid-cols-2">
            <PersonCard
              icon={<UserRound className="h-5 w-5" />}
              label="Senior"
              name={booking.seniorName}
            />

            <PersonCard
              icon={<Users className="h-5 w-5" />}
              label="Companion"
              name={booking.companionName}
            />
          </div>

          {/* Schedule */}
          <div className="mt-5 rounded-2xl border border-[#E3DCD3] p-5">
            <SectionTitle
              icon={<CalendarDays className="h-4 w-4" />}
              title="Session Schedule"
            />

            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Date"
                value={formatDate(booking.date)}
              />

              <DetailItem
                icon={<Clock3 className="h-4 w-4" />}
                label="Time"
                value={`${formatTime(booking.time)} · ${booking.duration} ${
                  booking.duration === 1 ? "hour" : "hours"
                }`}
              />

              <DetailItem
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={booking.location}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="mt-5 rounded-2xl border border-[#E3DCD3] p-5">
            <SectionTitle
              icon={<IndianRupee className="h-4 w-4" />}
              title="Payment"
            />

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#766B61]">Session</span>
                <span>
                  ₹{booking.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#766B61]">Platform fee</span>
                <span>
                  ₹{booking.platformFee.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#E6DFD6] pt-3 font-bold">
                <span>Total</span>
                <span className="text-[#6F5139]">
                  ₹{booking.total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-2 rounded-xl bg-[#F7F3EC] p-3 text-xs text-[#766B61]">
                Paid through{" "}
                <span className="font-semibold text-[#5F4633]">
                  {booking.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Family note */}
          {booking.familyNote && (
            <div className="mt-5 rounded-2xl bg-[#F7F3EC] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8B6B4D]">
                Family Note
              </p>

              <p className="mt-2 text-sm leading-6 text-[#5F554C]">
                {booking.familyNote}
              </p>
            </div>
          )}

          {/* Safety */}
          <div className="mt-5 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

              <div>
                <p className="text-sm font-semibold text-[#5F4633]">
                  EverSenior Safety
                </p>

                <p className="mt-1 text-xs leading-5 text-[#766B61]">
                  If you need help with this session, our safety and customer
                  support channels are available from your family account.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isUpcoming && (
              <>
                <Link
                  to="/family/messages"
                  onClick={onClose}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message Companion
                </Link>

                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to cancel this booking?"
                    );

                    if (confirmed) {
                      onCancel();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9CFC4] px-5 py-3 text-sm font-semibold text-[#765C49] transition hover:bg-[#F7F3EC]"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </button>
              </>
            )}

            {!isUpcoming && (
              <button
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State */
/* -------------------------------------------------------------------------- */

function EmptyState({
  activeFilter,
}: {
  activeFilter: FilterType;
}) {
  const message =
    activeFilter === "upcoming"
      ? "You don't have any upcoming sessions."
      : activeFilter === "completed"
      ? "No completed sessions yet."
      : activeFilter === "cancelled"
      ? "No cancelled bookings."
      : "You don't have any bookings yet.";

  return (
    <div className="rounded-3xl border border-[#E2DBD0] bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
        <CalendarDays className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#30271F]">
        No bookings found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766B61]">
        {message}
      </p>

      <Link
        to="/family/companions"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
      >
        Find a Companion
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small Components */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B8177]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#30271F]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#766B61]">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    upcoming: {
      label: "Upcoming",
      icon: <Clock3 className="h-3 w-3" />,
      classes: "bg-[#F3ECE3] text-[#6F5139]",
    },
    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle2 className="h-3 w-3" />,
      classes: "bg-[#F3ECE3] text-[#6F5139]",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle2 className="h-3 w-3" />,
      classes: "bg-[#EEE9E2] text-[#6F6257]",
    },
    cancelled: {
      label: "Cancelled",
      icon: <XCircle className="h-3 w-3" />,
      classes: "bg-[#F1ECE7] text-[#806E5E]",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.classes}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

function PersonCard({
  icon,
  label,
  name,
}: {
  icon: ReactNode;
  label: string;
  name: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F7F3EC] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8B8177]">
        <span className="text-[#6F5139]">{icon}</span>
        {label}
      </div>

      <p className="mt-2 text-base font-bold text-[#30271F]">{name}</p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-[#4F4034]">
      <span className="text-[#6F5139]">{icon}</span>
      {title}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#968A80]">
        <span className="text-[#6F5139]">{icon}</span>
        {label}
      </div>

      <p className="mt-2 text-sm font-medium leading-5 text-[#4F4034]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

function formatDate(dateString: string) {
  if (!dateString) return "Date not available";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(time: string) {
  if (!time) return "Time not available";

  return new Date(`1970-01-01T${time}`).toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}
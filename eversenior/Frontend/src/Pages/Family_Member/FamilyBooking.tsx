import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  CalendarDays,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
  IndianRupee,
  Home,
} from "lucide-react";
import FamilyNavbar from "./FamilyNavbar";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type BookingState = {
  companionId?: string;
  companionName?: string;
  seniorId?: string;
  seniorName?: string;
};

type Senior = {
  id: string;
  name: string;
  age: number;
  relationship: string;
  location: string;
};

type Companion = {
  id: string;
  name: string;
  location: string;
  rating: number;
  hourlyRate: number;
  verified: boolean;
};

const seniors: Senior[] = [
  {
    id: "mrs-sharma",
    name: "Mrs. Sharma",
    age: 72,
    relationship: "Mother",
    location: "Noida",
  },
  {
    id: "mr-saxena",
    name: "Mr. Saxena",
    age: 76,
    relationship: "Father",
    location: "Delhi",
  },
];

const companions: Companion[] = [
  {
    id: "ananya",
    name: "Ananya",
    location: "Noida",
    rating: 4.9,
    hourlyRate: 300,
    verified: true,
  },
  {
    id: "rajiv-mehta",
    name: "Rajiv Mehta",
    location: "Delhi",
    rating: 4.8,
    hourlyRate: 350,
    verified: true,
  },
  {
    id: "megha-sharma",
    name: "Megha Sharma",
    location: "Noida",
    rating: 4.7,
    hourlyRate: 275,
    verified: true,
  },
  {
    id: "arjun-verma",
    name: "Arjun Verma",
    location: "Greater Noida",
    rating: 4.6,
    hourlyRate: 250,
    verified: true,
  },
  {
    id: "riya-kapoor",
    name: "Riya Kapoor",
    location: "Delhi",
    rating: 4.9,
    hourlyRate: 325,
    verified: true,
  },
];

const services = [
  {
    id: "social",
    name: "Social Companionship",
    description:
      "Conversation, company, reading together and spending quality time.",
  },
  {
    id: "outing",
    name: "Outing Companionship",
    description:
      "Companion support for walks, cafés, parks, shopping or local outings.",
  },
  {
    id: "hobbies",
    name: "Hobbies & Interests",
    description:
      "Spend meaningful time around hobbies, games, music, books and interests.",
  },
  {
    id: "support",
    name: "Non-Medical Support",
    description:
      "Everyday non-medical assistance and companionship at home.",
  },
  {
    id: "tech",
    name: "Tech Companionship",
    description:
      "Help with smartphones, video calls, apps and everyday technology.",
  },
  {
    id: "travel",
    name: "Travel Companionship",
    description:
      "Companion support for planned local or short-distance travel.",
  },
];

const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    description: "Google Pay, PhonePe, Paytm and other UPI apps",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard and other supported cards",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "Pay directly through your bank",
  },
];

export default function FamilyBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingState = (location.state || {}) as BookingState;

  const [step, setStep] = useState<Step>(1);

  const [selectedSeniorId, setSelectedSeniorId] = useState(
    bookingState.seniorId || seniors[0].id
  );

  const [selectedCompanionId, setSelectedCompanionId] = useState(
    bookingState.companionId || companions[0].id
  );

  const [selectedService, setSelectedService] = useState("social");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState(2);

  const [locationType, setLocationType] = useState<"home" | "custom">("home");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [confirmed, setConfirmed] = useState(false);

  const [familyNote, setFamilyNote] = useState("");

  const selectedSenior = useMemo(
    () =>
      seniors.find((senior) => senior.id === selectedSeniorId) || seniors[0],
    [selectedSeniorId]
  );

  const selectedCompanion = useMemo(
    () =>
      companions.find(
        (companion) => companion.id === selectedCompanionId
      ) || companions[0],
    [selectedCompanionId]
  );

  const selectedServiceData = useMemo(
    () =>
      services.find((service) => service.id === selectedService) ||
      services[0],
    [selectedService]
  );

  const hourlyRate = selectedCompanion.hourlyRate;
  const subtotal = hourlyRate * duration;
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + platformFee;

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not selected";

  const formattedTime = new Date(
    `1970-01-01T${time}`
  ).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const canContinue = () => {
    if (step === 1) {
      return Boolean(selectedSeniorId && selectedCompanionId);
    }

    if (step === 2) {
      return Boolean(selectedService);
    }

    if (step === 3) {
      return Boolean(date && time && duration);
    }

    if (step === 4) {
      if (locationType === "home") {
        return Boolean(selectedSenior.location);
      }

      return Boolean(address.trim());
    }

    if (step === 5) {
      return Boolean(paymentMethod);
    }

    return true;
  };

  const handleContinue = () => {
    if (!canContinue()) return;

    if (step < 6) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmBooking = () => {
    const booking = {
      id: `family-booking-${Date.now()}`,
      seniorId: selectedSenior.id,
      seniorName: selectedSenior.name,
      companionId: selectedCompanion.id,
      companionName: selectedCompanion.name,
      service: selectedServiceData.name,
      date,
      time,
      duration,
      location:
        locationType === "home"
          ? `${selectedSenior.name}'s home, ${selectedSenior.location}`
          : address,
      paymentMethod,
      subtotal,
      platformFee,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      familyNote,
    };

    const existingBookings = JSON.parse(
      localStorage.getItem("familyBookings") || "[]"
    );

    localStorage.setItem(
      "familyBookings",
      JSON.stringify([...existingBookings, booking])
    );

    // Also keep a shared booking record for future Senior/Companion flows.
    const sharedBookings = JSON.parse(
      localStorage.getItem("everSeniorBookings") || "[]"
    );

    localStorage.setItem(
      "everSeniorBookings",
      JSON.stringify([...sharedBookings, booking])
    );

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <FamilyNavbar />

        <main className="px-5 py-12 md:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-[#E2DBD0] bg-white p-8 text-center shadow-sm md:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F3ECE3]">
                <CheckCircle2 className="h-10 w-10 text-[#6F5139]" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8B6B4D]">
                Booking Confirmed
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {selectedSenior.name}'s session is confirmed
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6F6257] md:text-base">
                {selectedCompanion.name} has been requested for the selected
                session. The booking details have been saved successfully.
              </p>

              <div className="mt-8 rounded-2xl border border-[#E4DDD2] bg-[#F7F3EC] p-5 text-left">
                <div className="grid gap-5 sm:grid-cols-2">
                  <SummaryItem
                    icon={<UserRound className="h-4 w-4" />}
                    label="Senior"
                    value={`${selectedSenior.name} · ${selectedSenior.relationship}`}
                  />

                  <SummaryItem
                    icon={<Users className="h-4 w-4" />}
                    label="Companion"
                    value={selectedCompanion.name}
                  />

                  <SummaryItem
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Date"
                    value={formattedDate}
                  />

                  <SummaryItem
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Time"
                    value={`${formattedTime} · ${duration} ${
                      duration === 1 ? "hour" : "hours"
                    }`}
                  />

                  <SummaryItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={
                      locationType === "home"
                        ? `${selectedSenior.location} · Home`
                        : address
                    }
                  />

                  <SummaryItem
                    icon={<IndianRupee className="h-4 w-4" />}
                    label="Amount Paid"
                    value={`₹${total.toLocaleString("en-IN")}`}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/family/bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  View Bookings
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/family/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9D0C5] bg-white px-6 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                >
                  Back to Dashboard
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#817367]">
                <ShieldCheck className="h-4 w-4 text-[#6F5139]" />
                Your booking and payment information is securely stored.
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6F5139] transition hover:text-[#4F3929]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B6B4D]">
              Family Booking
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Book companionship for your loved one
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6257] md:text-base">
              Choose the senior, companion, service and schedule. You can
              review everything before confirming the booking.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex min-w-[720px] items-center">
              {[
                "Senior & Companion",
                "Service",
                "Date & Time",
                "Location",
                "Payment",
                "Review",
              ].map((label, index) => {
                const number = index + 1;
                const active = step === number;
                const completed = step > number;

                return (
                  <div
                    key={label}
                    className="flex flex-1 items-center last:flex-none"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                          completed
                            ? "border-[#6F5139] bg-[#6F5139] text-white"
                            : active
                            ? "border-[#6F5139] bg-[#F3ECE3] text-[#6F5139]"
                            : "border-[#D9D0C5] bg-white text-[#8B8177]"
                        }`}
                      >
                        {completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          number
                        )}
                      </div>

                      <span
                        className={`hidden text-xs font-semibold lg:block ${
                          active || completed
                            ? "text-[#5F4633]"
                            : "text-[#91867C]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>

                    {number !== 6 && (
                      <div
                        className={`mx-3 h-px flex-1 ${
                          completed ? "bg-[#6F5139]" : "bg-[#DDD5CB]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
            {/* Main */}
            <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm md:p-8">
              {step === 1 && (
                <StepOne
                  seniors={seniors}
                  companions={companions}
                  selectedSeniorId={selectedSeniorId}
                  selectedCompanionId={selectedCompanionId}
                  onSeniorChange={setSelectedSeniorId}
                  onCompanionChange={setSelectedCompanionId}
                />
              )}

              {step === 2 && (
                <StepTwo
                  selectedService={selectedService}
                  onServiceChange={setSelectedService}
                />
              )}

              {step === 3 && (
                <StepThree
                  date={date}
                  time={time}
                  duration={duration}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  onDurationChange={setDuration}
                />
              )}

              {step === 4 && (
                <StepFour
                  selectedSenior={selectedSenior}
                  locationType={locationType}
                  address={address}
                  onLocationTypeChange={setLocationType}
                  onAddressChange={setAddress}
                  familyNote={familyNote}
                  onFamilyNoteChange={setFamilyNote}
                />
              )}

              {step === 5 && (
                <StepFive
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />
              )}

              {step === 6 && (
                <StepSix
                  senior={selectedSenior}
                  companion={selectedCompanion}
                  service={selectedServiceData}
                  date={formattedDate}
                  time={formattedTime}
                  duration={duration}
                  location={
                    locationType === "home"
                      ? `${selectedSenior.name}'s home, ${selectedSenior.location}`
                      : address
                  }
                  paymentMethod={
                    paymentMethods.find(
                      (method) => method.id === paymentMethod
                    )?.name || "UPI"
                  }
                  subtotal={subtotal}
                  platformFee={platformFee}
                  total={total}
                  familyNote={familyNote}
                  onEdit={(targetStep) => setStep(targetStep)}
                />
              )}

              {/* Bottom controls */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EAE4DB] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9D0C5] px-5 py-3 text-sm font-semibold text-[#5F4633] transition hover:bg-[#F7F3EC]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < 6 ? (
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Booking · ₹{total.toLocaleString("en-IN")}
                  </button>
                )}
              </div>
            </section>

            {/* Summary */}
            <aside className="h-fit rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6B4D]">
                Booking Summary
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#30271F]">
                {selectedSenior.name}
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryItem
                  icon={<Users className="h-4 w-4" />}
                  label="Companion"
                  value={selectedCompanion.name}
                />

                <SummaryItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Service"
                  value={selectedServiceData.name}
                />

                <SummaryItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Schedule"
                  value={
                    date
                      ? `${formattedDate} · ${formattedTime}`
                      : "Not selected"
                  }
                />

                <SummaryItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Duration"
                  value={`${duration} ${
                    duration === 1 ? "hour" : "hours"
                  }`}
                />

                <SummaryItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={
                    locationType === "home"
                      ? `${selectedSenior.location} · Home`
                      : address || "Not selected"
                  }
                />
              </div>

              <div className="my-5 border-t border-[#E5DED5]" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#74685E]">
                    ₹{hourlyRate.toLocaleString("en-IN")} × {duration} hr
                  </span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#74685E]">Platform fee</span>
                  <span className="font-medium">
                    ₹{platformFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#E5DED5] pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-[#6F5139]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#F7F3EC] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

                  <div>
                    <p className="text-sm font-semibold text-[#5F4633]">
                      Family-first safety
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#766B61]">
                      Verified companions, booking records and safety support
                      help you stay connected with your senior's experience.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 1 */
/* -------------------------------------------------------------------------- */

function StepOne({
  seniors,
  companions,
  selectedSeniorId,
  selectedCompanionId,
  onSeniorChange,
  onCompanionChange,
}: {
  seniors: Senior[];
  companions: Companion[];
  selectedSeniorId: string;
  selectedCompanionId: string;
  onSeniorChange: (id: string) => void;
  onCompanionChange: (id: string) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 1"
        title="Choose senior and companion"
        description="Select who the session is for and which companion should provide it."
      />

      <div className="mt-8">
        <FieldLabel
          icon={<UserRound className="h-4 w-4" />}
          label="Senior"
        />

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {seniors.map((senior) => {
            const selected = selectedSeniorId === senior.id;

            return (
              <button
                key={senior.id}
                onClick={() => onSeniorChange(senior.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#6F5139] bg-[#F7F3EC] ring-1 ring-[#6F5139]"
                    : "border-[#E3DCD3] bg-white hover:border-[#B9A794]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={senior.name} />

                    <div>
                      <p className="font-semibold text-[#30271F]">
                        {senior.name}
                      </p>
                      <p className="mt-1 text-xs text-[#7B7066]">
                        {senior.relationship} · {senior.age} years
                      </p>
                    </div>
                  </div>

                  {selected && <SelectedCheck />}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#766B61]">
                  <MapPin className="h-3.5 w-3.5" />
                  {senior.location}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <FieldLabel
          icon={<Users className="h-4 w-4" />}
          label="Companion"
        />

        <div className="mt-3 space-y-3">
          {companions.map((companion) => {
            const selected = selectedCompanionId === companion.id;

            return (
              <button
                key={companion.id}
                onClick={() => onCompanionChange(companion.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#6F5139] bg-[#F7F3EC] ring-1 ring-[#6F5139]"
                    : "border-[#E3DCD3] bg-white hover:border-[#B9A794]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={companion.name} large />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#30271F]">
                        {companion.name}
                      </p>

                      {companion.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE3] px-2 py-1 text-[10px] font-bold text-[#6F5139]">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#766B61]">
                      <span>{companion.location}</span>
                      <span>★ {companion.rating}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#5F4633]">
                      ₹{companion.hourlyRate}
                    </p>
                    <p className="text-[11px] text-[#8B8177]">per hour</p>
                  </div>

                  {selected && <SelectedCheck />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 2 */
/* -------------------------------------------------------------------------- */

function StepTwo({
  selectedService,
  onServiceChange,
}: {
  selectedService: string;
  onServiceChange: (id: string) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 2"
        title="Choose a service"
        description="Select the type of companionship your senior would enjoy."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const selected = selectedService === service.id;

          return (
            <button
              key={service.id}
              onClick={() => onServiceChange(service.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-[#6F5139] bg-[#F7F3EC] ring-1 ring-[#6F5139]"
                  : "border-[#E3DCD3] bg-white hover:border-[#B9A794]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <Users className="h-5 w-5" />
                </div>

                {selected && <SelectedCheck />}
              </div>

              <h3 className="mt-4 font-semibold text-[#30271F]">
                {service.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#766B61]">
                {service.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 3 */
/* -------------------------------------------------------------------------- */

function StepThree({
  date,
  time,
  duration,
  onDateChange,
  onTimeChange,
  onDurationChange,
}: {
  date: string;
  time: string;
  duration: number;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDurationChange: (value: number) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 3"
        title="Choose date and time"
        description="Pick a convenient time for the senior and companion."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[#4F4034]">
            Date
          </label>

          <div className="relative mt-2">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B6B4D]" />

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="w-full rounded-xl border border-[#DCD4CA] bg-white px-4 py-3 pl-12 text-sm outline-none transition focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#4F4034]">
            Start time
          </label>

          <div className="relative mt-2">
            <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B6B4D]" />

            <input
              type="time"
              value={time}
              onChange={(event) => onTimeChange(event.target.value)}
              className="w-full rounded-xl border border-[#DCD4CA] bg-white px-4 py-3 pl-12 text-sm outline-none transition focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-semibold text-[#4F4034]">
          Session duration
        </label>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((hours) => {
            const selected = duration === hours;

            return (
              <button
                key={hours}
                onClick={() => onDurationChange(hours)}
                className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                  selected
                    ? "border-[#6F5139] bg-[#F3ECE3] text-[#6F5139]"
                    : "border-[#E0D8CF] bg-white text-[#6F6257] hover:border-[#B9A794]"
                }`}
              >
                {hours} {hours === 1 ? "hour" : "hours"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#F7F3EC] p-4">
        <div className="flex gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

          <div>
            <p className="text-sm font-semibold text-[#5F4633]">
              Flexible scheduling
            </p>

            <p className="mt-1 text-xs leading-5 text-[#766B61]">
              The selected companion will receive the requested session time
              before the booking is finalized in the live system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 4 */
/* -------------------------------------------------------------------------- */

function StepFour({
  selectedSenior,
  locationType,
  address,
  onLocationTypeChange,
  onAddressChange,
  familyNote,
  onFamilyNoteChange,
}: {
  selectedSenior: Senior;
  locationType: "home" | "custom";
  address: string;
  onLocationTypeChange: (value: "home" | "custom") => void;
  onAddressChange: (value: string) => void;
  familyNote: string;
  onFamilyNoteChange: (value: string) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 4"
        title="Choose the session location"
        description="Tell the companion where the session should take place."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <LocationOption
          selected={locationType === "home"}
          icon={<Home className="h-5 w-5" />}
          title="Senior's home"
          description={`${selectedSenior.location} · Saved senior location`}
          onClick={() => onLocationTypeChange("home")}
        />

        <LocationOption
          selected={locationType === "custom"}
          icon={<MapPin className="h-5 w-5" />}
          title="Another location"
          description="Enter a different session location"
          onClick={() => onLocationTypeChange("custom")}
        />
      </div>

      {locationType === "custom" && (
        <div className="mt-6">
          <label className="text-sm font-semibold text-[#4F4034]">
            Session address
          </label>

          <textarea
            rows={4}
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="Enter the complete address..."
            className="mt-2 w-full resize-none rounded-xl border border-[#DCD4CA] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A49A90] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
          />
        </div>
      )}

      <div className="mt-6">
        <label className="text-sm font-semibold text-[#4F4034]">
          Note for the companion{" "}
          <span className="font-normal text-[#968A80]">(optional)</span>
        </label>

        <textarea
          rows={4}
          value={familyNote}
          onChange={(event) => onFamilyNoteChange(event.target.value)}
          placeholder="Anything the companion should know before the session?"
          className="mt-2 w-full resize-none rounded-xl border border-[#DCD4CA] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A49A90] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[#E2DBD0] bg-[#F7F3EC] p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

          <div>
            <p className="text-sm font-semibold text-[#5F4633]">
              Safety reminder
            </p>

            <p className="mt-1 text-xs leading-5 text-[#766B61]">
              Never share sensitive financial information with a companion.
              Use EverSenior's support channels if you need help with a
              booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 5 */
/* -------------------------------------------------------------------------- */

function StepFive({
  paymentMethod,
  onPaymentMethodChange,
}: {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 5"
        title="Choose payment method"
        description="Select how you would like to pay for this session."
      />

      <div className="mt-8 space-y-3">
        {paymentMethods.map((method) => {
          const selected = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-[#6F5139] bg-[#F7F3EC] ring-1 ring-[#6F5139]"
                  : "border-[#E3DCD3] bg-white hover:border-[#B9A794]"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                {method.id === "upi" ? (
                  <WalletCards className="h-5 w-5" />
                ) : method.id === "card" ? (
                  <CreditCard className="h-5 w-5" />
                ) : (
                  <IndianRupee className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#30271F]">
                  {method.name}
                </p>

                <p className="mt-1 text-xs text-[#766B61]">
                  {method.description}
                </p>
              </div>

              {selected && <SelectedCheck />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-[#F7F3EC] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

          <div>
            <p className="text-sm font-semibold text-[#5F4633]">
              Secure payment
            </p>

            <p className="mt-1 text-xs leading-5 text-[#766B61]">
              This prototype simulates the payment flow. A production version
              can connect this step to a secure payment provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 6 */
/* -------------------------------------------------------------------------- */

function StepSix({
  senior,
  companion,
  service,
  date,
  time,
  duration,
  location,
  paymentMethod,
  subtotal,
  platformFee,
  total,
  familyNote,
  onEdit,
}: {
  senior: Senior;
  companion: Companion;
  service: {
    name: string;
    description: string;
  };
  date: string;
  time: string;
  duration: number;
  location: string;
  paymentMethod: string;
  subtotal: number;
  platformFee: number;
  total: number;
  familyNote: string;
  onEdit: (step: Step) => void;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Step 6"
        title="Review your booking"
        description="Check all details carefully before confirming the session."
      />

      <div className="mt-8 space-y-4">
        <ReviewCard
          title="Senior & Companion"
          step={1}
          onEdit={onEdit}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Avatar name={senior.name} />

              <div>
                <p className="text-sm font-semibold">{senior.name}</p>
                <p className="text-xs text-[#766B61]">
                  {senior.relationship} · {senior.age} years
                </p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-[#DDD5CB] sm:block" />

            <div className="flex items-center gap-3">
              <Avatar name={companion.name} />

              <div>
                <p className="text-sm font-semibold">{companion.name}</p>
                <p className="text-xs text-[#766B61]">
                  ★ {companion.rating} · ₹{companion.hourlyRate}/hr
                </p>
              </div>
            </div>
          </div>
        </ReviewCard>

        <ReviewCard title="Service" step={2} onEdit={onEdit}>
          <p className="text-sm font-semibold text-[#30271F]">
            {service.name}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#766B61]">
            {service.description}
          </p>
        </ReviewCard>

        <ReviewCard title="Date & Time" step={3} onEdit={onEdit}>
          <div className="grid gap-4 sm:grid-cols-3">
            <ReviewValue label="Date" value={date} />
            <ReviewValue label="Start time" value={time} />
            <ReviewValue
              label="Duration"
              value={`${duration} ${
                duration === 1 ? "hour" : "hours"
              }`}
            />
          </div>
        </ReviewCard>

        <ReviewCard title="Location" step={4} onEdit={onEdit}>
          <p className="text-sm text-[#4F4034]">{location}</p>

          {familyNote && (
            <div className="mt-3 rounded-xl bg-[#F7F3EC] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#8B6B4D]">
                Note
              </p>

              <p className="mt-1 text-xs leading-5 text-[#766B61]">
                {familyNote}
              </p>
            </div>
          )}
        </ReviewCard>

        <ReviewCard title="Payment" step={5} onEdit={onEdit}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#766B61]">
              {paymentMethod}
            </span>

            <span className="text-lg font-bold text-[#6F5139]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-4 space-y-2 border-t border-[#E6DFD6] pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-[#766B61]">Session</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#766B61]">Platform fee</span>
              <span>₹{platformFee.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </ReviewCard>
      </div>

      <div className="mt-6 rounded-2xl border border-[#DCD2C5] bg-[#F3ECE3] p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

          <div>
            <p className="text-sm font-bold text-[#5F4633]">
              Ready to confirm?
            </p>

            <p className="mt-1 text-xs leading-5 text-[#766B61]">
              By confirming, you agree to the selected booking details. The
              companion request will be recorded against this family account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components */
/* -------------------------------------------------------------------------- */

function StepHeading({
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
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B4D]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#30271F] md:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766B61]">
        {description}
      </p>
    </div>
  );
}

function FieldLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4034]">
      <span className="text-[#6F5139]">{icon}</span>
      {label}
    </div>
  );
}

function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#E9DFD4] font-bold text-[#6F5139] ${
        large ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs"
      }`}
    >
      {initials}
    </div>
  );
}

function SelectedCheck() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6F5139] text-white">
      <Check className="h-3.5 w-3.5" />
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3ECE3] text-[#6F5139]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#968A80]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#4F4034]">
          {value}
        </p>
      </div>
    </div>
  );
}

function LocationOption({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-[#6F5139] bg-[#F7F3EC] ring-1 ring-[#6F5139]"
          : "border-[#E3DCD3] bg-white hover:border-[#B9A794]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
          {icon}
        </div>

        {selected && <SelectedCheck />}
      </div>

      <p className="mt-4 font-semibold text-[#30271F]">{title}</p>

      <p className="mt-1 text-xs leading-5 text-[#766B61]">
        {description}
      </p>
    </button>
  );
}

function ReviewCard({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: Step;
  onEdit: (step: Step) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E3DCD3] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[#4F4034]">{title}</h3>

        <button
          onClick={() => onEdit(step)}
          className="text-xs font-semibold text-[#6F5139] hover:text-[#4F3929]"
        >
          Edit
        </button>
      </div>

      {children}
    </div>
  );
}

function ReviewValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#968A80]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#4F4034]">{value}</p>
    </div>
  );
}
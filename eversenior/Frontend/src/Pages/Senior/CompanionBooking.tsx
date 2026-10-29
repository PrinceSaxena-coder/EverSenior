
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  Loader2,
  Navigation,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";
import LocationPicker from "./LocationPicker";
import { apiRequest } from "../../api/client";

type PaymentMethod = "upi" | "card" | "cash";
type ServiceType =
  | "social"
  | "outing"
  | "hobbies"
  | "support"
  | "tech"
  | "travel";

type Coordinates = { lat: number; lon: number };

type CompanionApiResponse = {
  type: "companion";
  profile: {
    userId: string;
    name?: string;
    age?: number;
    city?: string;
    bio?: string;
    availability?: string[];
    isVerified?: boolean;
  };
};

type Companion = {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  availability: string[];
  isVerified: boolean;
};

type RelationshipItem = {
  id?: string;
  _id?: string;
  companionId?: string | { _id?: string; id?: string };
  status?: string;
};

type RelationshipsApiResponse = {
  relationships: RelationshipItem[];
};

type BookingApiResponse = {
  id: string;
  relationshipId: string;
  companionId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  serviceType: ServiceType;
  price: number;
  status: "requested" | "confirmed" | "cancelled" | "completed";
  notes?: string;
};

type PaymentApiResponse = {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  };
};

type VerifyPaymentResponse = {
  id: string;
  status: string;
  gatewayPaymentId?: string;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: { color: string };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: {
      error?: { description?: string; reason?: string };
    }) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const services: {
  id: ServiceType;
  name: string;
  description: string;
  price: number;
  icon: string;
}[] = [
  {
    id: "social",
    name: "Social Companionship",
    description:
      "Conversation, spending time together and enjoying a relaxed social experience.",
    price: 499,
    icon: "social",
  },
  {
    id: "outing",
    name: "Outing Companionship",
    description:
      "Go for a walk, café visit, shopping trip or another planned outing.",
    price: 599,
    icon: "outing",
  },
  {
    id: "hobbies",
    name: "Hobbies & Interests",
    description:
      "Spend time together around books, music, art, games and gardening.",
    price: 549,
    icon: "hobbies",
  },
  {
    id: "support",
    name: "Non-Medical Support",
    description:
      "Everyday companionship and non-medical assistance during your session.",
    price: 649,
    icon: "support",
  },
  {
    id: "tech",
    name: "Tech Companionship",
    description:
      "Companionship with phones, apps, video calls and everyday technology.",
    price: 599,
    icon: "tech",
  },
  {
    id: "travel",
    name: "Travel Companionship",
    description:
      "Companionship for planned local travel and journeys.",
    price: 999,
    icon: "travel",
  },
];

const timeSlots = [
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

function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getServiceIcon(icon: string) {
  switch (icon) {
    case "outing":
    case "travel":
      return Navigation;
    case "hobbies":
      return Home;
    case "support":
      return ShieldCheck;
    case "tech":
      return Smartphone;
    default:
      return CheckCircle2;
  }
}

function getId(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const objectValue = value as { _id?: unknown; id?: unknown };
    if (typeof objectValue._id === "string") return objectValue._id;
    if (typeof objectValue.id === "string") return objectValue.id;
  }
  return "";
}

function convertTo24Hour(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error("Invalid selected time.");

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid selected time.");
  }

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function addOneHour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 60;

  if (totalMinutes >= 24 * 60) {
    throw new Error("Please select an earlier start time.");
  }

  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(
    totalMinutes % 60,
  ).padStart(2, "0")}`;
}

function format24Hour(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${minuteText} ${
    hour >= 12 ? "PM" : "AM"
  }`;
}

async function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return true;

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
  );

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener("load", () => resolve(!!window.Razorpay), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(!!window.Razorpay);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CompanionBooking() {
  const { id } = useParams<{ id: string }>();

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [companionLoading, setCompanionLoading] = useState(true);
  const [companionError, setCompanionError] = useState("");

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType | "">("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "not_started" | "pending" | "paid" | "failed" | "cash"
  >("not_started");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const today = getTodayString();

  useEffect(() => {
    let cancelled = false;

    async function loadCompanion() {
      if (!id) {
        setCompanionError("The companion ID is missing from the URL.");
        setCompanionLoading(false);
        return;
      }

      try {
        setCompanionLoading(true);
        setCompanionError("");

        const result = await apiRequest<CompanionApiResponse>(
          `/profiles/companion/${encodeURIComponent(id)}`,
        );

        if (
          result.type !== "companion" ||
          !result.profile ||
          !result.profile.userId
        ) {
          throw new Error("The companion profile could not be loaded.");
        }

        const profile = result.profile;

        if (!cancelled) {
          setCompanion({
            id: profile.userId,
            name: profile.name || "EverSenior Companion",
            age: profile.age ?? 0,
            location: profile.city || "Location not provided",
            bio:
              profile.bio ||
              "Your companion is ready to share meaningful conversations and activities.",
            availability: profile.availability || [],
            isVerified: profile.isVerified ?? false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setCompanion(null);
          setCompanionError(
            error instanceof Error
              ? error.message
              : "Unable to load this companion.",
          );
        }
      } finally {
        if (!cancelled) setCompanionLoading(false);
      }
    }

    void loadCompanion();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedServiceData = useMemo(
    () => services.find((service) => service.id === selectedService),
    [selectedService],
  );

  const amount = selectedServiceData?.price || 0;

  const validateCurrentStep = () => {
    if (step === 1) return selectedService !== "";
    if (step === 2) return selectedDate !== "" && selectedTime !== "";
    if (step === 3) return address.trim().length >= 5;
    if (step === 4) {
      return (
        paymentMethod === "upi" ||
        paymentMethod === "card" ||
        paymentMethod === "cash"
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setBookingError("");
    if (step < 5) setStep((previous) => previous + 1);
  };

  const handleBack = () => {
    setBookingError("");
    if (step > 1) setStep((previous) => previous - 1);
  };

  const openRazorpayCheckout = async (
    createdBooking: BookingApiResponse,
  ) => {
    setPaymentStatus("pending");
    setPaymentMessage("Preparing secure checkout...");

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded || !window.Razorpay) {
      setPaymentMessage(
        "Checkout could not load. Your booking request was saved, but payment is incomplete. You can retry from the booking page after checkout is available.",
      );
      setPaymentStatus("failed");
      setBookingConfirmed(true);
      return;
    }

    try {
      const order = await apiRequest<PaymentApiResponse>("/payments", {
        method: "POST",
        body: JSON.stringify({
          bookingId: createdBooking.id,
        }),
      });

      if (
        !order.id ||
        !order.razorpay?.keyId ||
        !order.razorpay?.orderId
      ) {
        throw new Error("The server did not return a valid payment order.");
      }

      const razorpay = new window.Razorpay({
        key: order.razorpay.keyId,
        amount: order.razorpay.amount,
        currency: order.razorpay.currency,
        name: "EverSenior",
        description: selectedServiceData?.name || "Companion booking",
        order_id: order.razorpay.orderId,
        theme: { color: "#6F5139" },

        handler: async (response) => {
          setPaymentMessage("Verifying payment securely...");
          try {
            const verified = await apiRequest<VerifyPaymentResponse>(
              "/payments/verify",
              {
                method: "POST",
                body: JSON.stringify({
                  paymentId: order.id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              },
            );

            if (verified.status !== "paid") {
              throw new Error(
                "The server has not confirmed the payment. Please check your payment history before retrying.",
              );
            }

            setPaymentStatus("paid");
            setPaymentMessage("Payment verified successfully.");
            setBookingConfirmed(true);
          } catch (error) {
            setPaymentStatus("failed");
            setPaymentMessage(
              error instanceof Error
                ? error.message
                : "Payment verification could not be completed. Check payment status before retrying.",
            );
            setBookingConfirmed(true);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentStatus("pending");
            setPaymentMessage(
              "Checkout was closed. Your booking request is saved, but payment has not been confirmed. You may need to retry payment.",
            );
            setBookingConfirmed(true);
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setPaymentStatus("failed");
        setPaymentMessage(
          response.error?.description ||
            "Payment failed. Your booking request is saved, but payment is incomplete.",
        );
        setBookingConfirmed(true);
      });

      razorpay.open();
    } catch (error) {
      setPaymentStatus("failed");
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Could not create a payment order. Your booking request was saved.",
      );
      setBookingConfirmed(true);
    }
  };

  const handleConfirmBooking = async () => {
    if (bookingSubmitting) return;

    setBookingError("");

    if (!companion || !selectedServiceData) {
      setBookingError("Companion or service details are missing.");
      return;
    }

    if (!selectedDate || !selectedTime || address.trim().length < 5) {
      setBookingError("Please check your date, time and meeting address.");
      return;
    }

    setBookingSubmitting(true);

    try {
      const relationshipResponse =
        await apiRequest<RelationshipsApiResponse>("/relationships");

      const relationships = Array.isArray(relationshipResponse.relationships)
        ? relationshipResponse.relationships
        : [];

      const relationship = relationships.find((item) => {
        return (
          getId(item.companionId) === companion.id &&
          String(item.status ?? "").toLowerCase() === "established"
        );
      });

      const relationshipId = relationship?.id ?? relationship?._id;

      if (!relationship || !relationshipId) {
        throw new Error(
          "You need an established relationship with this companion before booking. Please complete the introduction, trial and feedback process first.",
        );
      }

      const startTime = convertTo24Hour(selectedTime);
      const endTime = addOneHour(startTime);

      const notes = [
        `Service: ${selectedServiceData.name}`,
        `Meeting address: ${address.trim()}`,
        ...(coordinates
          ? [
              `Map latitude: ${coordinates.lat}`,
              `Map longitude: ${coordinates.lon}`,
            ]
          : []),
        `Payment preference: ${paymentMethod.toUpperCase()}`,
      ].join("\n");

      if (notes.length > 1000) {
        throw new Error(
          "The booking notes are too long. Please shorten the meeting address.",
        );
      }

      const result = await apiRequest<BookingApiResponse>("/bookings", {
        method: "POST",
        body: JSON.stringify({
          relationshipId,
          serviceType: selectedServiceData.id,
          date: selectedDate,
          startTime,
          endTime,
          durationMinutes: 60,
          notes,
        }),
      });

      if (!result?.id || !result?.status) {
        throw new Error(
          "The server did not return a booking ID and status.",
        );
      }

      setBookingId(result.id);
      setBookingStatus(result.status);

      if (paymentMethod === "cash") {
        setPaymentStatus("cash");
        setPaymentMessage(
          "Cash was selected as your payment preference. No online payment was processed.",
        );
        setBookingConfirmed(true);
        return;
      }

      await openRazorpayCheckout(result);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to create the booking. Please try again.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (companionLoading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />
        <main className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#6F5139]" />
          <span className="ml-3">Loading companion...</span>
        </main>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
              <X className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-serif text-3xl font-semibold">
              Companion unavailable
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#76685D]">
              {companionError || "We couldn't find this companion."}
            </p>
            <Link
              to="/senior/companions"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companions
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />
        <main className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-3xl border border-[#E2DBD0] bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#6F5139] text-white">
              {paymentStatus === "failed" || paymentStatus === "pending" ? (
                <Wallet className="h-9 w-9" />
              ) : (
                <Check className="h-10 w-10" />
              )}
            </div>

            <h1 className="mt-6 font-serif text-3xl font-semibold">
              {paymentStatus === "paid"
                ? "Booking request submitted!"
                : paymentStatus === "cash"
                  ? "Booking request submitted!"
                  : "Booking saved — payment pending"}
            </h1>

            <p className="mt-3 text-[#76685D]">
              Your booking request has been saved. The companion must confirm
              it before it becomes confirmed.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#FBF8F3] p-5 text-left">
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Booking ID</span>
                <span className="break-all text-right font-semibold">
                  {bookingId}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Booking status</span>
                <span className="font-semibold capitalize">{bookingStatus}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Companion</span>
                <span className="text-right font-semibold">{companion.name}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Service</span>
                <span className="text-right font-semibold">
                  {selectedServiceData?.name}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Date</span>
                <span className="text-right font-semibold">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-[#76685D]">Time</span>
                <span className="font-semibold">
                  {selectedTime} – {format24Hour(addOneHour(convertTo24Hour(selectedTime)))}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[#E2DBD0] pt-4">
                <span className="font-semibold">Displayed estimate</span>
                <span className="text-xl font-semibold text-[#6F5139]">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p
              role="status"
              className={`mx-auto mt-5 max-w-md rounded-xl p-4 text-sm ${
                paymentStatus === "paid"
                  ? "bg-green-50 text-green-800"
                  : paymentStatus === "cash"
                    ? "bg-[#FBF8F3] text-[#76685D]"
                    : "bg-amber-50 text-amber-800"
              }`}
            >
              {paymentMessage}
            </p>

            <p className="mt-4 text-xs text-[#76685D]">
              Payment status is shown separately from booking status. A saved
              booking request does not mean the companion has confirmed it.
            </p>

            <Link
              to="/senior/companions"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white"
            >
              Find more companions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Link
          to={`/senior/companions/${encodeURIComponent(companion.id)}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6F5139] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companion profile
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#8A705A]">
            EverSenior
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
            Book your companion
          </h1>
          <p className="mt-2 text-[#76685D]">
            Arrange meaningful time together, one step at a time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-[#E2DBD0] bg-white p-5 shadow-sm md:p-8">
            <div className="mb-8 grid grid-cols-5 gap-2">
              {["Service", "Schedule", "Location", "Payment", "Review"].map(
                (label, index) => {
                  const number = index + 1;
                  const active = step === number;
                  const completed = step > number;
                  return (
                    <div key={label} className="text-center">
                      <div
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                          active || completed
                            ? "bg-[#6F5139] text-white"
                            : "bg-[#F3ECE3] text-[#8A705A]"
                        }`}
                      >
                        {completed ? <Check className="h-4 w-4" /> : number}
                      </div>
                      <p className="mt-2 text-xs text-[#76685D]">{label}</p>
                    </div>
                  );
                },
              )}
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold">Choose a service</h2>
                <p className="mt-1 text-sm text-[#76685D]">
                  Select the kind of companionship you need.
                </p>
                <div className="mt-5 grid gap-3">
                  {services.map((service) => {
                    const Icon = getServiceIcon(service.icon);
                    const selected = selectedService === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service.id)}
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-[#6F5139] bg-[#FBF8F3] ring-1 ring-[#6F5139]"
                            : "border-[#E2DBD0] hover:border-[#BDA58D]"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold">{service.name}</span>
                            <span className="font-semibold text-[#6F5139]">
                              ₹{service.price}
                            </span>
                          </span>
                          <span className="mt-1 block text-sm leading-5 text-[#76685D]">
                            {service.description}
                          </span>
                        </span>
                        {selected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6F5139]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold">Choose date and time</h2>
                <p className="mt-1 text-sm text-[#76685D]">
                  Select your preferred one-hour session.
                </p>
                <label className="mt-6 block text-sm font-medium">
                  <span className="mb-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#6F5139]" />
                    Preferred date
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-xl border border-[#E2DBD0] bg-white px-4 py-3 outline-none focus:border-[#6F5139]"
                  />
                </label>
                <div className="mt-6">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-[#6F5139]" />
                    Preferred start time
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl border px-3 py-3 text-sm ${
                          selectedTime === time
                            ? "border-[#6F5139] bg-[#6F5139] text-white"
                            : "border-[#E2DBD0] hover:border-[#BDA58D]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {companion.availability.length > 0 && (
                    <p className="mt-4 text-sm text-[#76685D]">
                      Companion availability: {companion.availability.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold">Where should you meet?</h2>
                <p className="mt-1 text-sm text-[#76685D]">
                  Search for an address, use your current location, or select a
                  meeting point directly on the map.
                </p>
                <div className="mt-5">
                  <LocationPicker
                    address={address}
                    setAddress={setAddress}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                  />
                </div>
                {address.trim() && (
                  <div className="mt-4 rounded-xl bg-[#FBF8F3] p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#6F5139]">
                      <Navigation className="h-4 w-4" />
                      Selected meeting location
                    </p>
                    <p className="mt-2 break-words text-sm leading-6 text-[#76685D]">
                      {address}
                    </p>
                    {coordinates && (
                      <p className="mt-2 text-xs text-[#76685D]">
                        Coordinates: {coordinates.lat.toFixed(6)},{" "}
                        {coordinates.lon.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
                <p className="mt-3 text-xs leading-5 text-[#76685D]">
                  Please verify the selected address before continuing.
                </p>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold">Choose payment method</h2>
                <p className="mt-1 text-sm text-[#76685D]">
                  UPI and Card open Razorpay Checkout. Cash is a preference
                  only and does not trigger an online payment.
                </p>
                <div className="mt-6 grid gap-3">
                  {(
                    [
                      ["upi", "UPI", Smartphone],
                      ["card", "Card", Wallet],
                      ["cash", "Cash", Home],
                    ] as const
                  ).map(([method, label, Icon]) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
                        paymentMethod === method
                          ? "border-[#6F5139] bg-[#FBF8F3]"
                          : "border-[#E2DBD0]"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-[#6F5139]" />
                      <span className="flex-1 font-medium">{label}</span>
                      {paymentMethod === method && (
                        <CheckCircle2 className="h-5 w-5 text-[#6F5139]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-5 rounded-xl bg-[#FBF8F3] p-4 text-sm leading-6 text-[#76685D]">
                  {paymentMethod === "cash"
                    ? "Cash is recorded as your preference. This page will not collect money."
                    : "Your payment will be processed by Razorpay Checkout. This page never asks for your card number, CVV, or UPI PIN."}
                </p>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold">Review your booking</h2>
                <p className="mt-1 text-sm text-[#76685D]">
                  Check the details before submitting your request.
                </p>
                <div className="mt-6 space-y-4 rounded-2xl bg-[#FBF8F3] p-5">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Companion</span>
                    <span className="text-right font-medium">{companion.name}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Service</span>
                    <span className="text-right font-medium">
                      {selectedServiceData?.name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Date</span>
                    <span className="text-right font-medium">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Time</span>
                    <span className="text-right font-medium">
                      {selectedTime} –{" "}
                      {format24Hour(addOneHour(convertTo24Hour(selectedTime)))}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Location</span>
                    <span className="max-w-[65%] break-words text-right font-medium">
                      {address}
                    </span>
                  </div>
                  {coordinates && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#76685D]">Coordinates</span>
                      <span className="max-w-[65%] break-words text-right text-sm font-medium">
                        {coordinates.lat.toFixed(6)}, {coordinates.lon.toFixed(6)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#76685D]">Payment method</span>
                    <span className="font-medium">{paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E2DBD0] pt-4">
                    <span className="font-semibold">Displayed estimate</span>
                    <span className="text-xl font-semibold text-[#6F5139]">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="mt-5 flex gap-3 rounded-xl border border-[#E2DBD0] p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#6F5139]" />
                  <p className="text-xs leading-5 text-[#76685D]">
                    The backend calculates the actual payment amount from its
                    saved booking price. The companion must confirm your
                    booking separately.
                  </p>
                </div>
              </div>
            )}

            {bookingError && (
              <p
                role="alert"
                className="mt-5 whitespace-pre-line rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {bookingError}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EDE7DE] pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1 || bookingSubmitting}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2DBD0] px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5D432F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={bookingSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5D432F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookingSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {bookingSubmitting
                    ? "Processing..."
                    : paymentMethod === "cash"
                      ? "Submit booking request"
                      : "Continue to secure payment"}
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-[#E2DBD0] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A705A]">
                Your companion
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold">
                {companion.name}
              </h2>
              <p className="mt-2 text-sm text-[#76685D]">
                {companion.age > 0 ? `${companion.age} years old · ` : ""}
                {companion.location}
              </p>
              {companion.isVerified && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F3ECE3] px-3 py-1.5 text-xs font-semibold text-[#6F5139]">
                  <ShieldCheck className="h-4 w-4" />
                  Verified companion
                </span>
              )}
              <p className="mt-4 text-sm leading-6 text-[#76685D]">
                {companion.bio}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E2DBD0] bg-white p-6 shadow-sm">
              <h2 className="font-semibold">Booking summary</h2>
              <div className="mt-5 space-y-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-[#76685D]">Service</span>
                  <span className="text-right text-sm font-medium">
                    {selectedServiceData?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-[#76685D]">Date</span>
                  <span className="text-right text-sm font-medium">
                    {selectedDate ? formatDate(selectedDate) : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-[#76685D]">Time</span>
                  <span className="text-right text-sm font-medium">
                    {selectedTime || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#EDE7DE] pt-4">
                  <span className="text-sm font-medium text-[#6F6257]">
                    Displayed estimate
                  </span>
                  <span className="text-xl font-semibold text-[#6F5139]">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

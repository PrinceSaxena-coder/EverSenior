import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  ShieldAlert,
  Siren,
  User,
  X,
} from "lucide-react";
import SeniorNavbar from "./SeniorNavbar";

export default function SOS() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const triggerSOS = () => {
    setSosTriggered(true);
  };

  const shareLocation = () => {
    setLocationShared(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location permission obtained.
          // Backend/location sharing can be connected later.
        },
        () => {
          // Location permission denied.
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">

          {/* Back */}
          <Link
            to="/senior/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6F5139] transition hover:text-[#5D432F]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-[#A33F2B]">
              <ShieldAlert size={20} />

              <span className="text-sm font-semibold uppercase tracking-[0.15em]">
                Emergency Assistance
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
              SOS Help
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76685D] sm:text-base">
              If you are in immediate danger or need urgent assistance,
              use the options below to get help quickly.
            </p>
          </div>

          {/* Emergency Alert */}
          <section className="mb-8 overflow-hidden rounded-3xl border border-[#E7C8C0] bg-[#FFF8F6]">
            <div className="p-6 sm:p-8 lg:p-10">

              <div className="mx-auto max-w-2xl text-center">

                {/* SOS Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FDE4DE] text-[#A33F2B]">
                  <Siren
                    size={38}
                    strokeWidth={1.7}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-[#30271F] sm:text-3xl">
                  Are you in an emergency?
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#76685D]">
                  Press the SOS button if you need immediate assistance.
                  Your emergency contacts can be notified and help can be
                  requested.
                </p>

                {/* SOS Button */}
                {!sosTriggered ? (
                  <button
                    type="button"
                    onClick={triggerSOS}
                    className="mx-auto mt-7 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#A33F2B] text-white shadow-[0_12px_30px_rgba(163,63,43,0.25)] transition hover:scale-105 hover:bg-[#8F3424] active:scale-95"
                  >
                    <Siren
                      size={30}
                      strokeWidth={1.8}
                    />

                    <span className="mt-1 text-lg font-bold">
                      SOS
                    </span>
                  </button>
                ) : (
                  <div className="mx-auto mt-7 max-w-md rounded-2xl border border-[#CDE2D2] bg-[#F2FAF4] p-5 text-left">
                    <div className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-[#3D7651]"
                        size={21}
                      />

                      <div>
                        <p className="font-semibold text-[#315B3F]">
                          SOS assistance initiated
                        </p>

                        <p className="mt-1 text-sm leading-5 text-[#55715D]">
                          Your emergency assistance request has been
                          registered. Stay somewhere safe while help is
                          being arranged.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-xs text-[#9A8D82]">
                  Only use SOS when you need urgent assistance.
                </p>
              </div>
            </div>
          </section>

          {/* Emergency Actions */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#30271F]">
                Get help quickly
              </h2>

              <p className="mt-1 text-sm text-[#76685D]">
                Choose the option that best fits your situation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Emergency Services */}
              <a
                href="tel:112"
                className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:border-[#D4C5B5] hover:shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDE4DE] text-[#A33F2B]">
                    <Phone size={21} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-[#30271F]">
                        Call Emergency Services
                      </h3>

                      <ChevronRight
                        size={18}
                        className="text-[#9A8D82] transition group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-1 text-sm leading-5 text-[#76685D]">
                      Call India's emergency number <strong>112</strong>
                      for immediate assistance.
                    </p>
                  </div>

                </div>
              </a>

              {/* Trusted Contact */}
              <a
                href="tel:+919876543210"
                className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:border-[#D4C5B5] hover:shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                    <User size={21} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-[#30271F]">
                        Call Trusted Contact
                      </h3>

                      <ChevronRight
                        size={18}
                        className="text-[#9A8D82] transition group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-1 text-sm leading-5 text-[#76685D]">
                      Contact your registered emergency contact,
                      <strong> +91 98765 43210</strong>.
                    </p>
                  </div>

                </div>
              </a>

            </div>
          </section>

          {/* Location */}
          <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <MapPin size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#30271F]">
                    Share my location
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-[#76685D]">
                    Share your current location with your emergency
                    contacts so they can find you more easily.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={shareLocation}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  locationShared
                    ? "bg-[#F0F6F1] text-[#3D7651]"
                    : "bg-[#6F5139] text-white hover:bg-[#5D432F]"
                }`}
              >
                {locationShared ? (
                  <>
                    <CheckCircle2 size={17} />
                    Location Shared
                  </>
                ) : (
                  <>
                    <MapPin size={17} />
                    Share Location
                  </>
                )}
              </button>

            </div>
          </section>

          {/* Current Companion */}
          <section className="mb-8 rounded-2xl border border-[#E2DBD0] bg-white p-5 sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <Heart size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#30271F]">
                  Current companionship
                </h2>

                <p className="text-sm text-[#76685D]">
                  Your latest scheduled session
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-[#F7F3EC] p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6F5139] text-sm font-semibold text-white">
                  A
                </div>

                <div>
                  <p className="font-semibold text-[#30271F]">
                    Ananya Sharma
                  </p>

                  <p className="text-sm text-[#76685D]">
                    Companion · Today · 04:00 PM
                  </p>
                </div>

              </div>

              <Link
                to="/senior/bookings"
                className="text-sm font-medium text-[#6F5139] hover:text-[#5D432F]"
              >
                View booking
              </Link>

            </div>
          </section>

          {/* Safety Information */}
          <section className="rounded-2xl border border-[#E2DBD0] bg-white p-5 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                <BellRing size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#30271F]">
                  Important safety information
                </h2>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#76685D]">
                  <li>
                    • If you are in immediate danger, call <strong>112</strong>{" "}
                    directly.
                  </li>

                  <li>
                    • Move to a safe and well-lit location whenever possible.
                  </li>

                  <li>
                    • Keep your phone with you and stay connected with someone
                    you trust.
                  </li>

                  <li>
                    • EverSenior's SOS feature is intended to help connect you
                    with assistance and does not replace emergency services.
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* Back */}
          <div className="mt-8 text-center">
            <Link
              to="/senior/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6F5139] hover:text-[#5D432F]"
            >
              <ArrowLeft size={16} />
              Return to Dashboard
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
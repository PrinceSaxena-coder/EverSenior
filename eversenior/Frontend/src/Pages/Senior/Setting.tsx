import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  User,
  Volume2,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        enabled ? "bg-[#6F5139]" : "bg-[#D5D0C8]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] =
    useState(false);
  const [soundNotifications, setSoundNotifications] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    window.location.href = "/login";
  };

  const handleSave = () => {
    setSaved(true);

    console.log("Settings updated", {
      emailNotifications,
      pushNotifications,
      bookingNotifications,
      messageNotifications,
      marketingNotifications,
      soundNotifications,
    });

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      {/* =========================================================
          SHARED SENIOR NAVBAR
      ========================================================== */}
      <SeniorNavbar />

      {/* =========================================================
          PAGE CONTENT
      ========================================================== */}
      <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 md:py-14">
        {/* Page Heading */}
        <section className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#9A7357]">
            Account preferences
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#30271F] md:text-5xl">
                Settings
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#76685D]">
                Manage your account, notifications, privacy and security
                preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Saved Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#DCCFBE] bg-[#F4EEE5] px-5 py-4 text-sm text-[#6F5139]">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#6F5139] text-white">
              <Check size={16} />
            </div>

            <div>
              <p className="font-medium">Settings saved</p>

              <p className="text-xs text-[#8A7869]">
                Your preferences have been updated successfully.
              </p>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1050px]">
          {/* =====================================================
              ACCOUNT
          ====================================================== */}
          <section className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-[0_8px_30px_rgba(48,39,31,0.04)]">
            <div className="border-b border-[#EEE8DF] p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <User size={21} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#30271F]">
                    Account
                  </h2>

                  <p className="mt-1 text-sm text-[#807269]">
                    Manage your account information and security.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#F0ECE5]">
              <Link
                to="/senior/profile"
                className="flex items-center gap-4 p-5 transition hover:bg-[#FBF8F3] md:px-7"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <User size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Personal information
                  </p>

                  <p className="mt-1 text-xs text-[#8B7E73]">
                    Update your name, phone number, email and profile.
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-[#A09287]"
                />
              </Link>

              <button
                type="button"
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#FBF8F3] md:px-7"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Lock size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Change password
                  </p>

                  <p className="mt-1 text-xs text-[#8B7E73]">
                    Keep your account secure with a strong password.
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-[#A09287]"
                />
              </button>
            </div>
          </section>

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}
          <section className="mt-6 overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-[0_8px_30px_rgba(48,39,31,0.04)]">
            <div className="border-b border-[#EEE8DF] p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <Bell size={21} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#30271F]">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-[#807269]">
                    Choose how EverSenior keeps you updated.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#F0ECE5]">
              {/* Email */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Email notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Receive important updates and account information by email.
                  </p>
                </div>

                <Toggle
                  enabled={emailNotifications}
                  onChange={() => {
                    setEmailNotifications(!emailNotifications);
                    setSaved(false);
                  }}
                />
              </div>

              {/* Push */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Smartphone size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Push notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Get notifications directly on your device.
                  </p>
                </div>

                <Toggle
                  enabled={pushNotifications}
                  onChange={() => {
                    setPushNotifications(!pushNotifications);
                    setSaved(false);
                  }}
                />
              </div>

              {/* Booking */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <CalendarDays size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Booking updates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Get updates when a booking is requested, accepted or
                    changed.
                  </p>
                </div>

                <Toggle
                  enabled={bookingNotifications}
                  onChange={() => {
                    setBookingNotifications(!bookingNotifications);
                    setSaved(false);
                  }}
                />
              </div>

              {/* Messages */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <MessageCircle size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Message notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Get notified when companions send you a message.
                  </p>
                </div>

                <Toggle
                  enabled={messageNotifications}
                  onChange={() => {
                    setMessageNotifications(!messageNotifications);
                    setSaved(false);
                  }}
                />
              </div>

              {/* Sound */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Volume2 size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Notification sounds
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Play a sound when you receive a new notification.
                  </p>
                </div>

                <Toggle
                  enabled={soundNotifications}
                  onChange={() => {
                    setSoundNotifications(!soundNotifications);
                    setSaved(false);
                  }}
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center gap-4 p-5 md:px-7">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Offers and updates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Receive occasional news, events and special updates from
                    EverSenior.
                  </p>
                </div>

                <Toggle
                  enabled={marketingNotifications}
                  onChange={() => {
                    setMarketingNotifications(!marketingNotifications);
                    setSaved(false);
                  }}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              PRIVACY & SECURITY
          ====================================================== */}
          <section className="mt-6 overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-[0_8px_30px_rgba(48,39,31,0.04)]">
            <div className="border-b border-[#EEE8DF] p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <ShieldCheck size={21} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#30271F]">
                    Privacy & Security
                  </h2>

                  <p className="mt-1 text-sm text-[#807269]">
                    Control your privacy and account security.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#F0ECE5]">
              <button
                type="button"
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#FBF8F3] md:px-7"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <ShieldCheck size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Privacy preferences
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Manage what information is visible to companions.
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-[#A09287]"
                />
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#FBF8F3] md:px-7"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F7F3EC] text-[#6F5139]">
                  <Lock size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#30271F]">
                    Login & security
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8B7E73]">
                    Manage passwords and account security options.
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-[#A09287]"
                />
              </button>
            </div>
          </section>

          {/* =====================================================
              SAVE BUTTON
          ====================================================== */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-[#6F5139] px-7 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5D432F] active:scale-[0.99]"
            >
              <Check size={17} />
              Save Preferences
            </button>
          </div>

          {/* =====================================================
              SIGN OUT
          ====================================================== */}
          <section className="mt-10 rounded-3xl border border-[#E4D3C8] bg-[#FFFDFC] p-6 md:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#7A4A35]">
                  Sign out
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#81736A]">
                  Sign out of your EverSenior account on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#D8BDAF] px-5 py-3 text-sm font-medium text-[#8A5038] transition hover:bg-[#FFF4EF]"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </section>

          <p className="py-10 text-center text-xs text-[#A09287]">
            EverSenior · Your privacy and security matter to us.
          </p>
        </div>
      </main>
    </div>
  );
}
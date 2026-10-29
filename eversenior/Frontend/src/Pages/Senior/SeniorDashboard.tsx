import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Heart,
  MessageCircle,
  Search,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";
import { apiRequest } from "../../api/client";

type SeniorProfile = {
  id?: string;
  userId?: string;
  age?: number;
  gender?: string;
  city?: string;
  languages?: string[];
  interests?: string[];
  hobbies?: string[];
  personalityTraits?: string[];
  lifestylePreferences?: string[];
  companionshipNeeds?: string[];
  preferredCompanionTraits?: string[];
  availability?: string[];
  bio?: string;
};

type ProfileResponse = {
  profile: SeniorProfile | null;
};

export default function SeniorDashboard() {
  const [profile, setProfile] = useState<SeniorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await apiRequest<ProfileResponse>("/profiles/me");

        setProfile(result.profile);

        if (result.profile) {
          localStorage.setItem("seniorProfile", JSON.stringify(result.profile));
        }
      } catch (error) {
        console.error("Failed to load senior profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);
  const [userName, setUserName] = useState(() => {
    try {
      const savedUser = localStorage.getItem("backendUser");
      if (!savedUser) return "";

      const user = JSON.parse(savedUser);

      return user.name || user.fullName || user.firstName || "";
    } catch {
      return "";
    }
  });

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      {/* =========================================================
          SHARED SENIOR NAVBAR
      ========================================================= */}

      <SeniorNavbar />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* =====================================================
            WELCOME SECTION
        ===================================================== */}

        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F1E9DF] px-3.5 py-1.5 text-xs font-semibold text-[#6F5139]">
              <Heart size={14} />
              Senior Space
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#30271F] sm:text-4xl">
              Welcome back, {loadingProfile ? "..." : userName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766A5E] sm:text-base">
              Here's a quick overview of your EverSenior companionship journey.
            </p>

            {profile?.city && (
              <p className="mt-2 text-xs text-[#9A8D7E]">
                {profile.city}
                {profile.age ? ` • ${profile.age} years` : ""}
              </p>
            )}
          </div>

          <Link
            to="/senior/companions"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D432F]"
          >
            Find a Companion
            <ChevronRight size={17} />
          </Link>
        </section>

        {/* =====================================================
            PROFILE STATUS
        ===================================================== */}

        {!loadingProfile && !profile && (
          <div className="mt-6 rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-[#30271F]">
                  Complete your profile
                </h2>

                <p className="mt-1 text-sm text-[#766A5E]">
                  Add your interests and preferences so EverSenior can recommend
                  better companions for you.
                </p>
              </div>

              <Link
                to="/senior/profile"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Complete Profile
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Upcoming Bookings */}

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1E9DF] text-[#6F5139]">
                <CalendarDays size={21} />
              </div>

              <span className="text-xs font-medium text-[#9A8D7E]">
                Upcoming
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#30271F]">0</p>

            <p className="mt-1 text-sm text-[#766A5E]">Upcoming Bookings</p>
          </div>

          {/* Saved Companions */}

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE8E0] text-[#6F5139]">
                <Users size={21} />
              </div>

              <span className="text-xs font-medium text-[#9A8D7E]">Saved</span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#30271F]">0</p>

            <p className="mt-1 text-sm text-[#766A5E]">Saved Companions</p>
          </div>

          {/* Companionship Hours */}

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#8B6849]">
                <Clock size={21} />
              </div>

              <span className="text-xs font-medium text-[#9A8D7E]">
                This month
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#30271F]">0</p>

            <p className="mt-1 text-sm text-[#766A5E]">Companionship Hours</p>
          </div>

          {/* Messages */}

          <div className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9E4EC] text-[#695979]">
                <MessageCircle size={21} />
              </div>

              <span className="text-xs font-medium text-[#9A8D7E]">Inbox</span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#30271F]">0</p>

            <p className="mt-1 text-sm text-[#766A5E]">Unread Messages</p>
          </div>
        </section>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* LEFT COLUMN */}

          <div className="space-y-6">
            {/* Upcoming Companionship */}

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#30271F]">
                    Upcoming Companionship
                  </h2>

                  <p className="mt-1 text-sm text-[#766A5E]">
                    Your next scheduled sessions.
                  </p>
                </div>

                <Link
                  to="/senior/bookings"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#6F5139] hover:underline sm:flex"
                >
                  View all
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                    <CalendarDays size={25} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#30271F]">
                    No upcoming sessions
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#766A5E]">
                    Once you book a companion, your upcoming companionship
                    sessions will appear here.
                  </p>

                  <Link
                    to="/senior/companions"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D432F]"
                  >
                    Find a Companion
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}

            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#30271F]">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-[#766A5E]">
                  Everything you need, right at your fingertips.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Link
                  to="/senior/companions"
                  className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(70,55,40,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                    <Search size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#30271F]">
                    Find Companion
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#766A5E]">
                    Discover companions who match your interests.
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                    Explore
                    <ChevronRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>

                <Link
                  to="/senior/bookings"
                  className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(70,55,40,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE8E0] text-[#8B6849]">
                    <CalendarDays size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#30271F]">
                    My Bookings
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#766A5E]">
                    Manage your upcoming and past sessions.
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                    View bookings
                    <ChevronRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>

                <Link
                  to="/senior/messages"
                  className="group rounded-2xl border border-[#E2DBD0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(70,55,40,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9E4EC] text-[#695979]">
                    <MessageCircle size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#30271F]">
                    Messages
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#766A5E]">
                    Stay connected with your companions.
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#6F5139]">
                    Open messages
                    <ChevronRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">
            {/* Recommended Companions */}

            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#30271F]">
                    Recommended Companions
                  </h2>

                  <p className="mt-1 text-sm text-[#766A5E]">
                    People you may enjoy meeting.
                  </p>
                </div>

                <Heart size={20} className="text-[#A4693F]" />
              </div>

              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <Users size={21} />
                </div>

                <p className="mt-4 text-sm font-medium text-[#30271F]">
                  Discover your first companion
                </p>

                <p className="mt-1 text-xs leading-5 text-[#766A5E]">
                  We'll recommend companions based on your interests and
                  preferences.
                </p>

                <Link
                  to="/senior/companions"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139]"
                >
                  Explore companions
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Notifications */}

            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={19} className="text-[#6F5139]" />

                  <h2 className="text-lg font-bold text-[#30271F]">
                    Notifications
                  </h2>
                </div>

                <span className="rounded-full bg-[#F3ECE3] px-2.5 py-1 text-[11px] font-semibold text-[#6F5139]">
                  0
                </span>
              </div>

              <div className="py-8 text-center">
                <CheckCircle2 size={25} className="mx-auto text-[#9A8D7E]" />

                <p className="mt-3 text-sm text-[#766A5E]">
                  You're all caught up.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RECENT ACTIVITY
        ===================================================== */}

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#30271F]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-[#766A5E]">
                Your recent EverSenior activity.
              </p>
            </div>

            <Link
              to="/senior/bookings"
              className="hidden items-center gap-1 text-sm font-semibold text-[#6F5139] hover:underline sm:flex"
            >
              Full history
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E2DBD0] bg-white px-6 py-10 text-center shadow-[0_5px_20px_rgba(70,55,40,0.05)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
              <Clock size={21} />
            </div>

            <p className="mt-4 text-sm font-medium text-[#30271F]">
              Your activity will appear here
            </p>

            <p className="mt-1 text-xs text-[#766A5E]">
              Book a companion to start your EverSenior journey.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

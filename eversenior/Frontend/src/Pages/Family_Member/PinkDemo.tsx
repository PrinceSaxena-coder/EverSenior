import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";

export default function PinkDemo() {
  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#2D2529]">

      {/* Navbar */}
      <nav className="border-b border-[#F5DDE6] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E85D8A] text-white">
              <Heart className="h-5 w-5 fill-current" />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#2D2529]">
                EverSenior
              </h1>

              <p className="text-[11px] text-[#A58F98]">
                Companionship that cares
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-[#E85D8A]"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="text-sm text-[#75676D] transition hover:text-[#E85D8A]"
            >
              My Seniors
            </a>

            <a
              href="#"
              className="text-sm text-[#75676D] transition hover:text-[#E85D8A]"
            >
              Companions
            </a>

            <a
              href="#"
              className="text-sm text-[#75676D] transition hover:text-[#E85D8A]"
            >
              Bookings
            </a>

            <a
              href="#"
              className="text-sm text-[#75676D] transition hover:text-[#E85D8A]"
            >
              Messages
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#F3DDE5] bg-white text-[#75676D] transition hover:bg-[#FFF0F5] sm:flex">
              <Bell className="h-4 w-4" />
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-[#F3DDE5] bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCE1EA] text-xs font-semibold text-[#D94E7C]">
                P
              </div>

              <span className="hidden text-sm font-medium text-[#40353A] sm:block">
                Prince
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F9D9E5] opacity-60 blur-3xl" />
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-[#FCE8EF] opacity-80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F2CBD9] bg-white px-4 py-2 text-sm font-medium text-[#D94E7C] shadow-sm">
                <Heart className="h-4 w-4 fill-current" />
                Better companionship. Better days.
              </div>

              <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#2D2529] sm:text-5xl lg:text-6xl">
                Helping families stay
                <span className="text-[#E85D8A]"> closer </span>
                to the people they love.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#75676D] sm:text-lg">
                Discover trusted companions, manage sessions, and stay
                connected with your senior — all from one simple place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85D8A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(232,93,138,0.22)] transition hover:bg-[#D94E7C]">
                  Find a Companion
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EFCBD8] bg-white px-6 py-3.5 text-sm font-semibold text-[#604F56] transition hover:bg-[#FFF0F5]">
                  Explore Services
                </button>
              </div>

              {/* Trust */}
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-[#83747B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E85D8A]" />
                  Verified companions
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E85D8A]" />
                  Safety focused
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="rounded-3xl border border-[#F0D5DF] bg-white p-5 shadow-[0_25px_70px_rgba(165,79,110,0.12)] sm:p-6">

                {/* Preview Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#B49DA5]">
                      Family Dashboard
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-[#2D2529]">
                      Good afternoon, Prince
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCE1EA] text-[#E85D8A]">
                    <UserRound className="h-5 w-5" />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <DemoStat
                    icon={<Users className="h-4 w-4" />}
                    label="My Seniors"
                    value="2"
                  />

                  <DemoStat
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Upcoming"
                    value="3"
                  />
                </div>

                {/* Senior */}
                <div className="mt-4 rounded-2xl border border-[#F2E1E7] bg-[#FFF9FB] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F9D5E1] font-semibold text-[#D94E7C]">
                      MS
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#40353A]">
                          Mrs. Sharma
                        </h4>

                        <span className="rounded-full bg-[#EAF6EE] px-2.5 py-1 text-[11px] font-medium text-[#4D8060]">
                          Active
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#93838A]">
                        72 years · Noida
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F1E1E7] pt-4">
                    <div>
                      <p className="text-[11px] text-[#A18F97]">
                        Next session
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#504149]">
                        Today · 5:00 PM
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-[#A18F97]">
                        Companion
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#E05A86]">
                        Ananya
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session */}
                <div className="mt-3 rounded-2xl border border-[#F2E1E7] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F5] text-[#E85D8A]">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#40353A]">
                        Social Companionship
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-[#95858D]">
                        <MapPin className="h-3 w-3" />
                        Noida
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-[#604F56]">
                      ₹600
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating rating */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-[#F0D5DF] bg-white px-4 py-3 shadow-lg sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F5] text-[#E85D8A]">
                    <Star className="h-4 w-4 fill-current" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#40353A]">
                      4.9 / 5
                    </p>
                    <p className="text-[11px] text-[#9A8991]">
                      Companion rating
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D8A]">
              One simple experience
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2D2529] sm:text-4xl">
              Everything your family needs
            </h2>

            <p className="mt-4 text-[#81727A]">
              Designed to make companionship easier, more transparent and
              more reassuring.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <FeatureCard
              icon={<Heart className="h-5 w-5" />}
              title="Meaningful companionship"
              description="Connect your loved ones with companions who share their interests and personality."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Built around trust"
              description="Verified companions, transparent profiles and safety-focused experiences."
            />

            <FeatureCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Stay connected"
              description="Keep up with sessions, messages and important updates from anywhere."
            />

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFF0F5] py-16">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E85D8A] text-white shadow-lg shadow-[#E85D8A]/20">
            <Heart className="h-6 w-6 fill-current" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#2D2529] sm:text-4xl">
            A little more connection can mean a lot.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[#806F77]">
            EverSenior brings companionship, trust and peace of mind together
            in one experience.
          </p>

          <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#E85D8A] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E85D8A]/20 transition hover:bg-[#D94E7C]">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F2DDE5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#8D7C84] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#E85D8A] fill-current" />
            <span>EverSenior — Companionship that cares.</span>
          </div>

          <span>
            Demo UI · Pink & White Theme
          </span>

        </div>
      </footer>
    </div>
  );
}

function DemoStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F2E1E7] bg-[#FFF9FB] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCE1EA] text-[#E85D8A]">
        {icon}
      </div>

      <p className="mt-3 text-2xl font-semibold text-[#40353A]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#998890]">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#F1DDE5] bg-[#FFF9FB] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#EAB9CA] hover:shadow-[0_15px_35px_rgba(165,79,110,0.08)]">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCE1EA] text-[#E85D8A]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#40353A]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#81727A]">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-[#E05A86]">
        Explore
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </div>
  );
}
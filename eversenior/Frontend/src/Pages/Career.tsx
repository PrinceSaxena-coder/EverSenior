import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface Role {
  title: string;
  type: string;
  location: string;
  text: string;
}

// Sample content: replace with your real openings and details.
const roles: Role[] = [
  {
    title: "Companion (Goodfellow)",
    type: "Part-time",
    location: "Mumbai",
    text: "Spend time with seniors through conversations, walks, outings and everyday help. Patience and warmth matter most.",
  },
  {
    title: "Community Events Coordinator",
    type: "Full-time",
    location: "Mumbai",
    text: "Plan and host gatherings where seniors and companions meet, celebrate and make memories together.",
  },
  {
    title: "Care Operations Associate",
    type: "Full-time",
    location: "Mumbai",
    text: "Match seniors with companions, schedule visits and stay in touch with families.",
  },
  {
    title: "Content and Storytelling Intern",
    type: "Internship",
    location: "Remote",
    text: "Capture photographs, stories and short videos that show the beauty of intergenerational friendship.",
  },
];

const values = [
  {
    title: "Meaningful work",
    text: "Your time makes someone's week better, and you see it happen.",
  },
  {
    title: "Flexible schedules",
    text: "Companion roles are built around your studies and your life.",
  },
  {
    title: "Training and support",
    text: "You are never on your own. Our team guides and supports you every step.",
  },
];

const steps = [
  {
    title: "Apply",
    text: "Send us a short introduction and tell us why you want to be part of this.",
  },
  {
    title: "Conversation",
    text: "We have a relaxed chat to get to know you, your interests and your values.",
  },
  {
    title: "Verification and training",
    text: "Companions complete background checks and training before meeting seniors.",
  },
  {
    title: "Your first match",
    text: "We introduce you to a senior whose personality fits yours.",
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">
            Careers
          </p>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Do work that
            <span className="block">feels like family.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            Join a team of young people who care about the elderly and want to
            build meaningful friendships across generations.
          </p>

          <a
            href="#openings"
            className="mt-10 inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-[15px] font-medium text-cream transition-colors hover:bg-bark"
          >
            See open roles
          </a>
        </div>
      </section>

      {/* Why join */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Why join us
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              A job where kindness is the skill.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {values.map((item, i) => (
              <div key={item.title} className="border-t border-ink/15 pt-6">
                <span className="text-sm text-bark">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>

                <p className="mt-4 leading-7 text-bark">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Open roles
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Find where you fit.
            </h2>
          </div>

          <ul className="mt-16 border-b border-ink/10">
            {roles.map((role) => (
              <li
                key={role.title}
                className="grid gap-4 border-t border-ink/10 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10"
              >
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl">
                    {role.title}
                  </h3>

                  <p className="mt-2 max-w-2xl leading-7 text-bark">
                    {role.text}
                  </p>

                  <p className="mt-2 text-sm text-bark">
                    {role.type} · {role.location}
                  </p>
                </div>

                <a
                  href={`mailto:careers@thegoodfellows.in?subject=Application: ${encodeURIComponent(
                    role.title
                  )}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-7 text-[15px] font-medium transition-colors hover:bg-ink hover:text-cream"
                >
                  Apply
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hiring process */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              How hiring works
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Simple, human and unhurried.
            </h2>
          </div>

          <ol className="space-y-10">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-6">
                <span className="font-serif text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="font-serif text-2xl">{step.title}</h3>

                  <p className="mt-3 leading-7 text-bark">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Do not see your role?
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            We would still love to hear from you.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
            Tell us about yourself and how you would like to be part of the
            team.
          </p>

          <a
            href="mailto:careers@thegoodfellows.in"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-medium text-[#211E1A] transition hover:bg-[#EDE7DB]"
          >
            Email careers@EverSenior.in
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
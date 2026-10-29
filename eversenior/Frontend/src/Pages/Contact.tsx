import { useState, type FormEvent } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const topics = [
  "Join The Trial",
  "For a family member",
  "Become a companion",
  "Events",
  "Press and media",
  "Something else",
];

const details = [
  { label: "Phone", value: "+91 70551 44837", href: "tel:+917055144837" },
  {
    label: "General enquiries",
    value: "contact@EverSenior.in",
    href: "mailto:contact@EverSenior.in",
  },
  {
    label: "Careers",
    value: "careers@EverSenior.in",
    href: "mailto:careers@EverSenior.in",
  },
];

const field =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-3.5 text-base text-ink placeholder:text-bark/60 transition-colors focus:border-ink focus:outline-none";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: topics[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10)
      next.message = "Please write a few words so we can help.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend yet: this opens the visitor's email app with the message filled in.
    // Replace with a fetch() to your API or a form service when you have one.
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:contact@thegoodfellows.in?subject=${encodeURIComponent(
      form.topic
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">
            Contact us
          </p>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Let us start
            <span className="block">a conversation.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            Whether you are looking for companionship for someone you love,
            want to join as a companion or simply have a question, we would
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Form and details */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          {/* Details */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Reach us directly
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Our team will contact you soon.
            </h2>

            <dl className="mt-12 space-y-8">
              {details.map((d) => (
                <div key={d.label} className="border-t border-ink/15 pt-6">
                  <dt className="text-sm text-bark">{d.label}</dt>
                  <dd className="mt-2">
                    <a
                      href={d.href}
                      className="font-serif text-2xl underline-offset-4 hover:underline md:text-3xl"
                    >
                      {d.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 leading-7 text-bark">
              Phone lines are open Monday to Friday during working hours.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div
                role="status"
                className="rounded-lg border border-ink/10 bg-white p-8 md:p-12"
              >
                <h2 className="font-serif text-3xl md:text-4xl">
                  Thank you, {form.name.split(" ")[0]}.
                </h2>

                <p className="mt-4 leading-7 text-bark">
                  Your email app should have opened with your message ready to
                  send. Once you press send, our team will get back to you
                  soon.
                </p>

                <button
                  onClick={() => setSent(false)}
                  className="mt-8 inline-flex min-h-12 items-center rounded-full border border-ink/25 px-7 text-[15px] font-medium transition-colors hover:bg-ink hover:text-cream"
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6 rounded-lg border border-ink/10 bg-white p-6 md:p-10"
              >
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-bark">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={field}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-clay">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-bark">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={field}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-clay">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm text-bark">
                      Phone 
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={field}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="mb-2 block text-sm text-bark">
                    What is this about?
                  </label>
                  <select
                    id="topic"
                    value={form.topic}
                    onChange={(e) => update("topic", e.target.value)}
                    className={field}
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-bark">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={field}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-sm text-clay">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-[15px] font-medium text-cream transition-colors hover:bg-bark"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Ready to begin?
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            There is always room for one more good conversation.
          </h2>

          <a
            href="/signup"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-medium text-[#211E1A] transition hover:bg-[#EDE7DB]"
          >
            Join The Trial
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
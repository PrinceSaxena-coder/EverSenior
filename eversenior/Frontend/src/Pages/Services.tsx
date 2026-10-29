export default function Services() {
  return (
    <div className="min-h-screen bg-cream text-ink">

      {/* Navbar */}
      <header className="border-b border-ink/10 bg-cream">
        <div className="mx-auto flex h-[100px] max-w-[1500px] items-center justify-between px-6 md:px-10">

          {/* Logo */}
          <a
            href="/"
            className="font-serif text-3xl tracking-tight"
          >
            EverSenior
          </a>

          {/* Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            <a
              href="/"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Home
            </a>

            <a
              href="/about"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              About Us
            </a>

            <a
              href="/services"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Services
            </a>

            <a
              href="/events"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Events
            </a>

            <a
              href="/press"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Press
            </a>

            <a
              href="/faqs"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              FAQs
            </a>

            <a
              href="/careers"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Careers
            </a>

            <a
              href="/contact"
              className="text-[17px] text-bark transition-colors hover:text-ink"
            >
              Contact Us
            </a>
          </nav>

          {/* Join The Trial */}
          <a
            href="/signup"
            className="rounded-full bg-[#211E1A] px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-[#332F29]"
          >
            Join The Trial
          </a>

        </div>
      </header>


      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bark">
            Our Services
          </p>

          <h1 className="max-w-4xl font-serif text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Companionship that makes
            <span className="block">everyday life feel fuller.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-bark">
            At EverSenior, we create meaningful experiences through
            companionship, conversation, outings and shared moments.
          </p>

        </div>
      </section>


      {/* Services */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14">
            <h2 className="font-serif text-4xl md:text-5xl">
              What we offer
            </h2>

            <p className="mt-4 max-w-2xl text-bark">
              Choose the kind of companionship that fits your lifestyle
              and interests.
            </p>
          </div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Service 1 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                ☕
              </div>

              <h3 className="font-serif text-2xl">
                Social Companionship
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Enjoy meaningful conversations, coffee and
                everyday moments with a companion.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>


            {/* Service 2 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                🌿
              </div>

              <h3 className="font-serif text-2xl">
                Outing Companion
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Have someone accompany you for walks, shopping,
                appointments or a day outside.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>


            {/* Service 3 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                🎨
              </div>

              <h3 className="font-serif text-2xl">
                Hobbies & Interests
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Spend time doing things you enjoy — reading, music,
                games, art, cooking and more.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>


            {/* Service 4 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                ✈️
              </div>

              <h3 className="font-serif text-2xl">
                Travel Companion
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Have a trusted companion for short trips, local
                exploration and special occasions.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>


            {/* Service 5 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                🏠
              </div>

              <h3 className="font-serif text-2xl">
                Non - Medical Support
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Get non-medical companionship and support with
                everyday activities and routines.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>


            {/* Service 6 */}
            <div className="rounded-3xl border border-ink/10 bg-white p-8">
              <div className="mb-8 text-4xl">
                💬
              </div>

              <h3 className="font-serif text-2xl">
                Tech Companionship
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Stay connected through real world and shared
                activities on the tech.
              </p>

              <button className="mt-8 text-sm font-medium underline underline-offset-4">
                Explore service →
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* How it works */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">

          <h2 className="font-serif text-4xl md:text-5xl">
            How it works
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">

            <div>
              <span className="text-sm text-bark">01</span>

              <h3 className="mt-3 font-serif text-2xl">
                Choose a service
              </h3>

              <p className="mt-3 leading-7 text-bark">
                Select the type of companionship that suits your
                needs.
              </p>
            </div>

            <div>
              <span className="text-sm text-bark">02</span>

              <h3 className="mt-3 font-serif text-2xl">
                Find your companion
              </h3>

              <p className="mt-3 leading-7 text-bark">
                Browse companions based on interests, availability
                and preferences.
              </p>
            </div>

            <div>
              <span className="text-sm text-bark">03</span>

              <h3 className="mt-3 font-serif text-2xl">
                Spend meaningful time
              </h3>

              <p className="mt-3 leading-7 text-bark">
                Book your experience and enjoy quality time together.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="font-serif text-4xl md:text-5xl">
            Ready to find your companion?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-bark">
            Start your EverSenior journey and discover meaningful
            companionship.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-full bg-[#211E1A] px-8 py-4 font-medium text-white transition hover:bg-[#332F29]"
          >
            Join The Trial
          </a>

        </div>
      </section>

    </div>
  );
}
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-cream text-ink">

      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">
            About EverSenior
          </p>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Growing older should
            <span className="block">never mean living alone.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            EverSenior exists to make everyday life feel more connected,
            meaningful and full — through genuine human companionship.
          </p>

        </div>
      </section>


      {/* Intro */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Why we exist
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Because companionship is a part of a fulfilling life.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-bark">
            <p>
              Life changes as we grow older. Children move to different
              cities, routines become quieter and social circles can
              gradually become smaller.
            </p>

            <p>
              But the need to talk, laugh, explore, share experiences and
              simply have someone around never disappears.
            </p>

            <p>
              EverSenior was created to bridge that gap — connecting seniors
              with thoughtful companions who can share their time, interests
              and everyday experiences.
            </p>
          </div>

        </div>
      </section>


      {/* Mission */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Our mission
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              To make meaningful companionship accessible, comfortable and
              part of everyday life.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {/* Card 1 */}
            <div className="border-t border-ink/15 pt-6">
              <span className="text-sm text-bark">
                01
              </span>

              <h3 className="mt-5 font-serif text-2xl">
                Human connection
              </h3>

              <p className="mt-4 leading-7 text-bark">
                We believe meaningful conversations and shared experiences
                can make ordinary days feel special.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border-t border-ink/15 pt-6">
              <span className="text-sm text-bark">
                02
              </span>

              <h3 className="mt-5 font-serif text-2xl">
                Trusted companionship
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Every interaction should be built around respect, comfort,
                trust and genuine care.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border-t border-ink/15 pt-6">
              <span className="text-sm text-bark">
                03
              </span>

              <h3 className="mt-5 font-serif text-2xl">
                More moments together
              </h3>

              <p className="mt-4 leading-7 text-bark">
                From a cup of coffee to a walk, hobby or outing, we make
                space for more moments that matter.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* What makes us different */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              What we believe
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              It is the little things that make life feel fuller.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-ink/10 bg-white p-8 md:p-10">
              <div className="mb-8 text-4xl">
                ☕
              </div>

              <h3 className="font-serif text-2xl">
                A conversation over coffee
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Sometimes companionship simply means having someone to talk
                to, listen to and laugh with.
              </p>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-white p-8 md:p-10">
              <div className="mb-8 text-4xl">
                🌿
              </div>

              <h3 className="font-serif text-2xl">
                A walk outside
              </h3>

              <p className="mt-4 leading-7 text-bark">
                A familiar routine can become something meaningful when
                shared with the right person.
              </p>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-white p-8 md:p-10">
              <div className="mb-8 text-4xl">
                🎨
              </div>

              <h3 className="font-serif text-2xl">
                Doing what you love
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Hobbies, music, books, games and interests become even more
                enjoyable when there is someone to share them with.
              </p>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-white p-8 md:p-10">
              <div className="mb-8 text-4xl">
                ❤️
              </div>

              <h3 className="font-serif text-2xl">
                Feeling connected
              </h3>

              <p className="mt-4 leading-7 text-bark">
                Our goal is simple: help people feel seen, heard and
                connected in their everyday lives.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* How EverSenior works */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-bark">
                The EverSenior approach
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
                Companionship designed around the individual.
              </h2>
            </div>

            <div className="space-y-10">

              <div className="flex gap-6">
                <span className="font-serif text-2xl">
                  01
                </span>

                <div>
                  <h3 className="font-serif text-2xl">
                    Understand
                  </h3>

                  <p className="mt-3 leading-7 text-bark">
                    We start by understanding interests, routines,
                    preferences and the kind of companionship someone is
                    looking for.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="font-serif text-2xl">
                  02
                </span>

                <div>
                  <h3 className="font-serif text-2xl">
                    Match
                  </h3>

                  <p className="mt-3 leading-7 text-bark">
                    We help connect seniors with companions who share
                    compatible interests and expectations.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="font-serif text-2xl">
                  03
                </span>

                <div>
                  <h3 className="font-serif text-2xl">
                    Connect
                  </h3>

                  <p className="mt-3 leading-7 text-bark">
                    From conversations to outings and hobbies, companionship
                    becomes a natural part of everyday life.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Start something meaningful
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            There is always room for one more good conversation.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
            Discover a more connected way to spend your time with
            EverSenior.
          </p>

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
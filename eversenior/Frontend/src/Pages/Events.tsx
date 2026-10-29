import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { img } from "../data/images";

interface EventItem {
  date: string;
  title: string;
  place: string;
  time: string;
  text: string;
}

interface PastMoment {
  src: string;
  alt: string;
  caption: string;
  ratio: string;
}

// Sample content: replace with your real events.
const featured = {
  eyebrow: "Featured gathering",
  title: "The Festival Afternoon",
  text: "Rangoli, old songs, board games and plenty of sweets. Seniors and their companions spend an afternoon celebrating together.",
  image: img.event,
  alt: "Seniors and young companions celebrating together",
};

const upcoming: EventItem[] = [
  { date: "12 Oct", title: "Chai & Stories Morning", place: "Community hall, Mumbai", time: "10:30 AM", text: "A relaxed morning of tea, memories and conversation." },
  { date: "26 Oct", title: "Games Afternoon", place: "Garden clubhouse", time: "4:00 PM", text: "Carrom, cards and antakshari with friendly competition." },
  { date: "09 Nov", title: "Walk in the Park", place: "City park", time: "6:00 AM", text: "A gentle group walk followed by breakfast together." },
  { date: "21 Nov", title: "Learn Something New", place: "Community hall, Mumbai", time: "11:00 AM", text: "Small-group sessions on phones, photos and video calls." },
];

const past: PastMoment[] = [
  { src: img.time, alt: "Tea together", caption: "Saturday chai", ratio: "aspect-[3/4]" },
  { src: img.gather, alt: "Group gathering", caption: "Games afternoon", ratio: "aspect-[3/2]" },
  { src: img.walk, alt: "Evening walk", caption: "The evening loop", ratio: "aspect-square" },
  { src: img.new, alt: "A new outing", caption: "Something new", ratio: "aspect-[4/5]" },
  { src: img.tech, alt: "Learning together", caption: "First video call", ratio: "aspect-[4/3]" },
];

const expect = [
  { title: "Come as you are", text: "No preparation needed. Every gathering is relaxed and unhurried." },
  { title: "Meet new friends", text: "Seniors and companions mix naturally, with hosts to help introductions." },
  { title: "Bring someone along", text: "Family and friends are welcome to join the fun." },
];

export default function Events() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">Events</p>
          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Good company,
            <span className="block">shared moments.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            Festivals, walks, games and small gatherings where seniors and
            companions come together, make friends and create memories.
          </p>
        </div>
      </section>

      {/* Featured event */}
      <section className="relative isolate flex min-h-[560px] items-end text-white md:min-h-[680px]">
        <img src={featured.image} alt={featured.alt} className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#211E1A]/85 via-[#211E1A]/30 to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-20">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">{featured.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{featured.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">{featured.text}</p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">Coming up</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Find a gathering to join.
            </h2>
          </div>

          <ul className="mt-16 border-b border-ink/10">
            {upcoming.map((e) => (
              <li
                key={e.title}
                className="grid gap-4 border-t border-ink/10 py-8 md:grid-cols-[140px_1fr_auto] md:items-center md:gap-10"
              >
                <p className="font-serif text-3xl md:text-4xl">{e.date}</p>
                <div>
                  <h3 className="font-serif text-2xl">{e.title}</h3>
                  <p className="mt-2 leading-7 text-bark">{e.text}</p>
                  <p className="mt-2 text-sm text-bark">
                    {e.time} · {e.place}
                  </p>
                </div>
                <a
                  href="/signup"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-7 text-[15px] font-medium transition-colors hover:bg-ink hover:text-cream"
                >
                  Reserve a spot
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">What to expect</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Warm, easy and never rushed.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {expect.map((item, i) => (
              <div key={item.title} className="border-t border-ink/15 pt-6">
                <span className="text-sm text-bark">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>
                <p className="mt-4 leading-7 text-bark">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past moments */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">From past gatherings</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Moments worth remembering.
            </h2>
          </div>

          <div className="mt-16 columns-2 gap-3 md:columns-3 md:gap-6">
            {past.map((p) => (
              <figure key={p.caption} className="group relative mb-3 overflow-hidden bg-[#EDE7DB] md:mb-6">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className={`${p.ratio} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#211E1A]/70 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Join us</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            There is always a seat at the table for you.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
            Come to your first gathering and see how good an afternoon of
            company can feel.
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
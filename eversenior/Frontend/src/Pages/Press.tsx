import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface PressArticle {
  date: string;
  publication: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

// Sample content: replace with your real coverage and links.
const pressArticles: PressArticle[] = [
  {
    date: "24 Sep 2026",
    publication: "The Senior Journal",
    title: "How GoodFellows are creating a new kind of companionship",
    description:
      "A closer look at how meaningful relationships between older adults and younger companions are changing the way people experience everyday life.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85",
    href: "#",
  },
  {
    date: "12 Aug 2026",
    publication: "Urban Life",
    title: "When companionship becomes more than a service",
    description:
      "GoodFellows brings GrandPals and young companions together through shared experiences, conversations and everyday moments.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85",
    href: "#",
  },
  {
    date: "05 Jul 2026",
    publication: "The Community Review",
    title: "Building bridges between generations",
    description:
      "From walks and conversations to festivals and celebrations, intergenerational companionship is creating stronger communities.",
    image:
      "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1200&q=85",
    href: "#",
  },
];

const featured = {
  eyebrow: "Featured story",
  title: "The future of companionship may be more human than ever.",
  text: "A conversation about loneliness, connection and why relationships between generations matter.",
  image:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=2000&q=85",
  alt: "GrandPals and GoodFellows together",
  href: "#",
};

export default function Press() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-bark">
            In the press
          </p>

          <h1 className="max-w-5xl font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-8xl">
            Stories worth
            <span className="block">sharing.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-bark md:text-xl">
            Discover what people are saying about GoodFellows, GrandPals and
            the growing movement towards meaningful intergenerational
            companionship.
          </p>
        </div>
      </section>

      {/* Featured story */}
      <section className="relative isolate flex min-h-[560px] items-end text-white md:min-h-[680px]">
        <img
          src={featured.image}
          alt={featured.alt}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#211E1A]/85 via-[#211E1A]/30 to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-20">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
            {featured.eyebrow}
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            {featured.title}
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
            {featured.text}
          </p>

          <a
            href={featured.href}
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-medium text-[#211E1A] transition hover:bg-[#EDE7DB]"
          >
            Read story →
          </a>
        </div>
      </section>

      {/* Latest coverage */}
      <section className="px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Latest coverage
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              What people are saying.
            </h2>
          </div>

          <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {pressArticles.map((article) => (
              <article
                key={article.title}
                className="group border-t border-ink/15 pt-6"
              >
                <div className="overflow-hidden bg-[#EDE7DB]">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="mt-6 text-sm text-bark">
                  {article.date} · {article.publication}
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                  {article.title}
                </h3>

                <p className="mt-4 leading-7 text-bark">
                  {article.description}
                </p>

                <a
                  href={article.href}
                  className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline"
                >
                  Read article →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media contact */}
      <section className="bg-[#EDE7DB] px-6 py-20 md:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-bark">
              Media and press
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Want to tell our story?
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-bark">
            <p>
              We love connecting with journalists, storytellers and creators
              who are interested in ageing, companionship, community and
              intergenerational relationships.
            </p>

            <a
              href="mailto:press@goodfellows.com"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-[15px] font-medium text-cream transition-colors hover:bg-bark"
            >
              Contact our press team
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#211E1A] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Be part of the story
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
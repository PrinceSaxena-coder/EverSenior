import { featuredEvent as e } from "../data/events";
import { Button } from "./Button";
export function EventsSection() {
  return (
    <section id="events" className="relative isolate flex min-h-[640px] items-end text-cream">
      <img src={e.image} alt={e.alt} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-14 md:px-10 md:pb-20">
        <h2 className="max-w-2xl font-serif text-5xl font-light leading-tight md:text-6xl">{e.title}</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-cream/90">{e.text}</p>
        <div className="mt-8"><Button href="#gallery" variant="light">View More Events</Button></div>
      </div>
    </section>
  );
}

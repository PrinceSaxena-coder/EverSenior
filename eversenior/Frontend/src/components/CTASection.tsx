import { img } from "../data/images";
import { Button } from "./Button";
export function CTASection() {
  return (
    <section id="contact" className="relative isolate px-5 py-28 text-center text-cream md:py-44">
      <img src={img.gather} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/65" />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">Sometimes, all we need is someone to share the day with.</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/90">Spend time with a friendly young companion who listens, helps and brings the family feeling home.</p>
        <div className="mt-10"><Button href="/signup"variant="light">Join The Trial</Button></div>
      </div>
    </section>
  );
}

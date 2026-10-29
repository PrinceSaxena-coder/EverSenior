import type { Testimonial } from "../data/testimonials";
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="grid shrink-0 basis-full items-center gap-8 md:grid-cols-[320px_1fr] md:gap-14">
      <img src={t.image} alt={`Portrait of ${t.name}`} className="aspect-square w-full max-w-xs rounded-t-full object-cover md:max-w-none" />
      <blockquote>
        <p className="font-serif text-2xl font-light leading-snug md:text-4xl md:leading-snug">“{t.quote}”</p>
        <figcaption className="mt-6 text-bark">{t.name}{t.age ? `, ${t.age}` : ""}</figcaption>
      </blockquote>
    </figure>
  );
}

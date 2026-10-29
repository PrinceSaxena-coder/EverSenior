import { steps } from "../data/story";
import { img } from "../data/images";
import { Reveal } from "../hooks/useReveal";
export function StorySection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">A glimpse into a Goodfellow–Grandpal friendship</h2>
        <img src={img.time} alt="A Goodfellow and Grandpal sharing tea" loading="lazy" className="mt-10 hidden aspect-[4/3] w-full object-cover lg:block" />
      </div>
      <ol className="space-y-10">
        {steps.map((s, k) => (
          <li key={s.title}><Reveal className="flex gap-6 border-t border-ink/15 pt-6">
            <span className="font-serif text-3xl text-clay">{k + 1}</span>
            <div><h3 className="font-serif text-2xl md:text-3xl">{s.title}</h3><p className="mt-2 max-w-md leading-relaxed text-bark">{s.text}</p></div>
          </Reveal></li>
        ))}
      </ol>
    </section>
  );
}

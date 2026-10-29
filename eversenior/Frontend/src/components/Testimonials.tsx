import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { TestimonialCard } from "./TestimonialCard";
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  useEffect(() => { if (paused) return; const id = setInterval(() => setI((v) => (v + 1) % n), 7000); return () => clearInterval(id); }, [paused, n]);
  const arrow = "grid size-12 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-cream";
  return (
    <section aria-roledescription="carousel" aria-label="Grandpal stories" className="bg-sand px-5 py-20 md:px-10 md:py-32" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl font-serif text-4xl font-light md:text-6xl">Grandpal’s stories about their experience!</h2>
        <div className="mt-12 overflow-hidden" aria-live="polite">
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
            {testimonials.map((t, k) => <div key={t.name} className="flex basis-full shrink-0" aria-hidden={k !== i}><TestimonialCard t={t} /></div>)}
          </div>
        </div>
        <div className="mt-10 flex gap-3">
          <button className={arrow} onClick={() => go(-1)} aria-label="Previous story"><ChevronLeft /></button>
          <button className={arrow} onClick={() => go(1)} aria-label="Next story"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

import type { Service } from "../data/services";
import { Reveal } from "../hooks/useReveal";
export function ExperienceBlock({ service, reversed, tone }: { service: Service; reversed: boolean; tone: string }) {
  return (
    <article className={`${tone} px-5 py-14 md:px-10 md:py-24`}>
      <Reveal className={`mx-auto grid max-w-7xl items-center gap-8 md:gap-16 lg:grid-cols-12`}>
        <div className={`overflow-hidden bg-sand lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
          <img src={service.image} alt={service.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.03]" />
        </div>
        <div className={`lg:col-span-5 ${reversed ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
          <h3 className="font-serif text-4xl font-light leading-tight md:text-5xl">{service.title}</h3>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-bark">{service.text}</p>
        </div>
      </Reveal>
    </article>
  );
}

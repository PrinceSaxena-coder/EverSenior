import { services } from "../data/services";
import { ExperienceBlock } from "./ExperienceBlock";
export function ExperienceSection() {
  return (
    <section id="services" aria-label="What a Goodfellow does">
      {services.map((s, i) => <ExperienceBlock key={s.title} service={s} reversed={i % 2 === 1} tone={i % 2 === 0 ? "bg-cream" : "bg-white"} />)}
    </section>
  );
}

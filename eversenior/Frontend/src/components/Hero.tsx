import { img } from "../data/images";
import { Button } from "./Button";
export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:pb-24 lg:pt-16"
    >
      <div className="reveal is-visible">
        <h1 className="font-serif text-6xl font-light leading-[0.98] tracking-tight sm:text-7xl xl:text-8xl">
          Everything <em className="font-light">grandkids</em> do!
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-bark">
          Spirited, empathetic youth companions for the elderly.
        </p>
        <div className="mt-9">
          <Button href="/signup">Join The Trial</Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-t-[220px] rounded-b-md bg-sand">
        <img
          src={img.hero}
          alt="A young companion sharing a laugh with an elderly woman"
          className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
        />
      </div>
    </section>
  );
}

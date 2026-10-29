import { Reveal } from "../hooks/useReveal";
export function IntroSection() {
  return (
    <section id="about" className="bg-sand px-5 py-24 md:py-36">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-3xl font-light leading-snug sm:text-4xl md:text-5xl md:leading-[1.2]">
          We are a group of young graduates who have an affection towards the elderly, and look forward to creating meaningful bonds with our <em>Grandpals</em>.
        </p>
      </Reveal>
    </section>
  );
}

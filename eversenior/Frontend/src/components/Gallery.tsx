import { gallery } from "../data/gallery";
export function Gallery() {
  return (
    <section id="gallery" className="bg-white px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl font-serif text-4xl font-light md:text-6xl">Beauty of intergenerational friendship through the lens</h2>
        <div className="mt-12 columns-2 gap-3 md:columns-3 md:gap-6">
          {gallery.map((g) => (
            <figure key={g.caption} className="group relative mb-3 overflow-hidden bg-sand md:mb-6">
              <img src={g.src} alt={g.alt} loading="lazy" className={`${g.ratio} w-full object-cover transition-transform duration-700 group-hover:scale-105`} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 text-sm text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

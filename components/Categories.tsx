import { CATEGORIES } from '@/lib/categories';

export function Categories() {
  return (
    <section id="colecao" className="grid grid-cols-1 bg-ink md:grid-cols-3">
      {CATEGORIES.map((category) => (
        <a
          key={category.slug}
          href="#produtos"
          className="group relative block aspect-[3/4] overflow-hidden"
        >
          <img
            src={category.imageUrl}
            alt={category.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <h3 className="absolute inset-0 flex items-center justify-center bg-ink/30 font-serif text-2xl uppercase tracking-[0.3em] text-bone transition-colors group-hover:bg-ink/10">
            {category.title}
          </h3>
        </a>
      ))}
    </section>
  );
}

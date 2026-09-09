import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { ImagePreloader } from '@/components/ImagePreloader';
import { getCollectionForProduct } from '@/lib/collections';
import type { Category } from '@/lib/categories';

export function CategorySection({ category }: { category: Category }) {
  const products = PRODUCTS.filter((product) => product.category === category.slug);
  const featured = products.find((product) => product.featured) ?? products[0];
  const rest = products.filter((product) => product.id !== featured.id);
  const featuredCollection = getCollectionForProduct(featured.id);

  return (
    <section className="bg-bone">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
        <img src={featured.imageUrl} alt={featured.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-8 py-10 md:px-16 md:py-12">
          <h2 className="font-serif text-3xl tracking-wide text-bone md:text-5xl">
            {category.title}
          </h2>
          <p className="mt-2 max-w-md text-bone/80">{category.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h3 className="font-sans text-sm uppercase tracking-wide text-bone">
              {featured.name}
            </h3>
            <span className="text-sm text-bone/80">{formatPrice(featured.priceCents)}</span>
            {featuredCollection && (
              <span className="inline-block rounded-full border border-bone/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-bone">
                {featuredCollection.title.replace('Coleção ', '')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((product) => {
          const collection = getCollectionForProduct(product.id);
          return (
            <article key={product.id} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
                <ImagePreloader
                  src={product.imageUrl}
                  alt={product.name}
                  imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-sans text-sm uppercase tracking-wide text-ink">
                {product.name}
              </h3>
              <p className="text-sm text-smoke">{formatPrice(product.priceCents)}</p>
              {collection && (
                <span className="mt-1 inline-block rounded-full bg-sand px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink">
                  {collection.title.replace('Coleção ', '')}
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

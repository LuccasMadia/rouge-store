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
    <section className="bg-bone px-8 py-24">
      <div className="mx-auto mb-20 grid max-w-5xl items-start gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl tracking-wide text-ink md:text-4xl">
            {category.title}
          </h2>
          <p className="mt-3 text-smoke">{category.tagline}</p>
        </div>
        <div className="md:ml-auto md:max-w-xs">
          <div className="relative aspect-[3/4] w-full">
            <img
              src={featured.imageUrl}
              alt={featured.name}
              className="absolute -top-[12%] left-1/2 h-[128%] w-[112%] -translate-x-1/2 object-cover object-top"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
              }}
            />
          </div>
          <h3 className="mt-4 font-sans text-sm uppercase tracking-wide text-ink">
            {featured.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-smoke">{formatPrice(featured.priceCents)}</p>
            {featuredCollection && (
              <span className="inline-block rounded-full bg-sand px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink">
                {featuredCollection.title.replace('Coleção ', '')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

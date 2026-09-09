import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { ImagePreloader } from '@/components/ImagePreloader';
import type { Collection } from '@/lib/collections';

export function CollectionSection({ collection }: { collection: Collection }) {
  const products = PRODUCTS.filter((product) => collection.productIds.includes(product.id));

  return (
    <section className="bg-bone px-8 py-24">
      <div className="mx-auto mb-20 grid max-w-5xl items-end gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl tracking-wide text-ink md:text-4xl">
            {collection.title}
          </h2>
          <p className="mt-3 text-smoke">{collection.tagline}</p>
        </div>
        <div className="relative aspect-[3/4] w-full max-w-xs md:ml-auto">
          <img
            src={collection.featuredImage}
            alt={collection.title}
            className="absolute -top-[12%] left-1/2 h-[128%] w-[112%] -translate-x-1/2 object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
            }}
          />
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
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
          </article>
        ))}
      </div>
    </section>
  );
}

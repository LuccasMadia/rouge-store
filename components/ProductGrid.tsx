import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { ImagePreloader } from '@/components/ImagePreloader';

export function ProductGrid() {
  return (
    <section id="produtos" className="bg-ink px-8 py-24">
      <h2 className="mb-16 text-center font-serif text-3xl tracking-wide text-bone md:text-4xl">
        Coleção
      </h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <article key={product.id} className="group">
            <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
              <ImagePreloader
                src={product.imageUrl}
                alt={product.name}
                imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-sans text-sm uppercase tracking-wide text-bone">
              {product.name}
            </h3>
            <p className="text-sm text-smoke">{formatPrice(product.priceCents)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

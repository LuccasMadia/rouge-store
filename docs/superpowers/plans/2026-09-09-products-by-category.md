# Reorganização de produtos por categoria — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Coleção-based product sections (which mix Feminino/Masculino/Acessórios inside each collection) with one section per Categoria, each with a large "destaque" product and a smaller grid for the rest, and a small Coleção badge on every card.

**Architecture:** Data-only changes to `lib/types.ts`, `lib/products.ts`, `lib/categories.ts`, `lib/collections.ts` (add `featured`/`tagline` fields, drop `featuredImage`, add a `getCollectionForProduct` lookup), then a new `CategorySection` component replacing `CollectionSection`, wired into `app/page.tsx` by iterating `CATEGORIES` instead of `COLLECTIONS`.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Vitest + Testing Library.

## Global Constraints

- No product `id`/`name`/`priceCents`/`imageUrl`/`category` values change.
- Featured product per category: `feminino` → `trench-coat-editorial`, `masculino` → `blazer-oversized`, `acessorios` → `colar-corrente-fina`.
- Category taglines (exact copy): Feminino → "Peças que equilibram estrutura e movimento.", Masculino → "Alfaiataria com atitude urbana.", Acessórios → "Os detalhes que fecham o look."
- Collection badge text is the collection title with the `"Coleção "` prefix stripped (e.g. `"Coleção Inverno"` → `"Inverno"`).
- Bleed-effect markup (mask + oversized `img`) must match the existing pattern in `components/Editorial.tsx` / `components/CollectionSection.tsx`.
- Tailwind color tokens available: `ink`, `crimson`, `crimson-light`, `bone`, `smoke`, `sand` (see `tailwind.config.ts`).
- Test command: `npm test` (runs `vitest run`); a single file: `npx vitest run <path>`.
- Full spec: `docs/superpowers/specs/2026-09-09-products-by-category-design.md`.

---

### Task 1: `Product.featured` flag

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/products.ts`
- Test: `tests/products.test.ts`

**Interfaces:**
- Produces: `Product.featured?: boolean` — read by `CategorySection` in Task 4 as `product.featured`.

- [ ] **Step 1: Write the failing test**

Append to `tests/products.test.ts`:

```ts
  it('has exactly one featured product per category', () => {
    const categories = ['feminino', 'masculino', 'acessorios'] as const;
    categories.forEach((category) => {
      const featuredInCategory = PRODUCTS.filter(
        (p) => p.category === category && p.featured,
      );
      expect(featuredInCategory).toHaveLength(1);
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/products.test.ts`
Expected: FAIL — `featuredInCategory` has length 0 for every category (`featured` doesn't exist yet, so `p.featured` is `undefined`/falsy for all).

- [ ] **Step 3: Add the `featured` field to the type**

In `lib/types.ts`, add the field to `Product`:

```ts
export type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  category: 'feminino' | 'masculino' | 'acessorios';
  featured?: boolean;
};
```

- [ ] **Step 4: Mark the three featured products**

In `lib/products.ts`, add `featured: true` to these three entries only (don't touch any other field):

- `trench-coat-editorial` (feminino)
- `blazer-oversized` (masculino)
- `colar-corrente-fina` (acessorios)

Example for one entry:

```ts
  {
    id: 'trench-coat-editorial',
    name: 'Trench Coat Editorial',
    priceCents: 129900,
    imageUrl: '/images/trench-coat-editorial.jpg',
    category: 'feminino',
    featured: true,
  },
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/products.test.ts`
Expected: PASS (2 tests: the existing "9 unique products" test and the new featured-count test)

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/products.ts tests/products.test.ts
git commit -m "feat: mark one featured product per category"
```

---

### Task 2: `Category.tagline`

**Files:**
- Modify: `lib/categories.ts`
- Test: `tests/categories.test.ts` (new)

**Interfaces:**
- Produces: `Category.tagline: string` — read by `CategorySection` in Task 4 as `category.tagline`.

- [ ] **Step 1: Write the failing test**

Create `tests/categories.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CATEGORIES } from '@/lib/categories';

describe('CATEGORIES', () => {
  it('has a non-empty tagline for every category', () => {
    expect(CATEGORIES.length).toBe(3);
    CATEGORIES.forEach((category) => {
      expect(category.tagline.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/categories.test.ts`
Expected: FAIL with a TypeScript error — `Property 'tagline' does not exist on type 'Category'`.

- [ ] **Step 3: Add `tagline` to the type and data**

Replace the full contents of `lib/categories.ts`:

```ts
export type Category = {
  slug: string;
  title: string;
  tagline: string;
  imageUrl: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'feminino',
    title: 'Feminino',
    tagline: 'Peças que equilibram estrutura e movimento.',
    imageUrl: '/images/feminino.webp',
  },
  {
    slug: 'masculino',
    title: 'Masculino',
    tagline: 'Alfaiataria com atitude urbana.',
    imageUrl: '/images/masculino.webp',
  },
  {
    slug: 'acessorios',
    title: 'Acessórios',
    tagline: 'Os detalhes que fecham o look.',
    imageUrl: '/images/acessorios.webp',
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/categories.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full suite to confirm nothing else broke**

Run: `npm test`
Expected: PASS — `components/Categories.tsx` only reads `title`/`imageUrl`, so it's unaffected by the new field.

- [ ] **Step 6: Commit**

```bash
git add lib/categories.ts tests/categories.test.ts
git commit -m "feat: add tagline copy to each category"
```

---

### Task 3: `getCollectionForProduct` lookup, drop `featuredImage`

**Files:**
- Modify: `lib/collections.ts`
- Test: `tests/collections.test.ts`

**Interfaces:**
- Consumes: `Product.id` (from `lib/types.ts`, unchanged).
- Produces: `getCollectionForProduct(productId: string): Collection | undefined` — read by `CategorySection` in Task 4.
- Produces: `Collection` type without `featuredImage` (breaking change consumed by Task 4's rewrite of `CollectionSection` → `CategorySection`; `Task 4` also deletes the last reader of `featuredImage`).

- [ ] **Step 1: Write the failing test**

Replace the `has at least two collections...` test in `tests/collections.test.ts` (keep the `only references product ids...` test as-is). Full new file contents:

```ts
import { describe, it, expect } from 'vitest';
import { COLLECTIONS, getCollectionForProduct } from '@/lib/collections';
import { PRODUCTS } from '@/lib/products';

describe('COLLECTIONS', () => {
  it('only references product ids that exist in PRODUCTS', () => {
    const productIds = new Set(PRODUCTS.map((product) => product.id));
    COLLECTIONS.forEach((collection) => {
      collection.productIds.forEach((id) => {
        expect(productIds.has(id)).toBe(true);
      });
    });
  });
});

describe('getCollectionForProduct', () => {
  it('returns the collection that lists a given product id', () => {
    const collection = getCollectionForProduct('trench-coat-editorial');
    expect(collection?.slug).toBe('inverno');
  });

  it('returns undefined for a product id that is in no collection', () => {
    expect(getCollectionForProduct('not-a-real-id')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/collections.test.ts`
Expected: FAIL — `getCollectionForProduct` is not exported yet (import error / `undefined is not a function`).

- [ ] **Step 3: Implement the lookup and drop `featuredImage`**

Replace the full contents of `lib/collections.ts`:

```ts
export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  productIds: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: 'inverno',
    title: 'Coleção Inverno',
    tagline: 'Alfaiataria e camadas para os dias mais frios.',
    productIds: [
      'trench-coat-editorial',
      'blazer-oversized',
      'calca-alfaiataria-reta',
      'cinto-couro-estruturado',
    ],
  },
  {
    slug: 'verao',
    title: 'Coleção Verão',
    tagline: 'Leveza e brilho para os dias de sol.',
    productIds: [
      'vestido-slip-cetim',
      'saia-midi-plissada',
      'camisa-seda-manga-longa',
      'oculos-escuros-metal',
      'colar-corrente-fina',
    ],
  },
];

export function getCollectionForProduct(productId: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.productIds.includes(productId));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/collections.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Confirm the type-only breakage in `CollectionSection.tsx` is expected**

Run: `npx tsc --noEmit`
Expected: FAILS with an error in `components/CollectionSection.tsx` (`collection.featuredImage` no longer exists on `Collection`). This is expected — Task 4 deletes this file. Do not fix it here.

- [ ] **Step 6: Commit**

```bash
git add lib/collections.ts tests/collections.test.ts
git commit -m "feat: add getCollectionForProduct lookup, drop unused featuredImage"
```

---

### Task 4: `CategorySection` component (replaces `CollectionSection`)

**Files:**
- Create: `components/CategorySection.tsx`
- Delete: `components/CollectionSection.tsx`
- Create: `tests/CategorySection.test.tsx`
- Delete: `tests/CollectionSection.test.tsx`

**Interfaces:**
- Consumes: `Category` (`lib/categories.ts`, Task 2), `Product.featured` (`lib/products.ts`, Task 1), `getCollectionForProduct` (`lib/collections.ts`, Task 3), `formatPrice` (`lib/format.ts`, unchanged), `ImagePreloader` (`components/ImagePreloader.tsx`, unchanged: props `src: string`, `alt: string`, `imgClassName?: string`).
- Produces: `CategorySection({ category }: { category: Category })` — a React component, consumed by `app/page.tsx` in Task 5.

- [ ] **Step 1: Write the failing test**

Create `tests/CategorySection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategorySection } from '@/components/CategorySection';
import { CATEGORIES } from '@/lib/categories';

describe('CategorySection', () => {
  it('renders the category title, tagline, only its own products, and the featured badge', () => {
    const acessorios = CATEGORIES.find((category) => category.slug === 'acessorios')!;
    render(<CategorySection category={acessorios} />);

    expect(screen.getByRole('heading', { name: acessorios.title })).toBeInTheDocument();
    expect(screen.getByText(acessorios.tagline)).toBeInTheDocument();

    // 3 products in "acessorios": 1 featured (Colar Corrente Fina) + 2 in the grid
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('Colar Corrente Fina')).toBeInTheDocument();
    expect(screen.getByText('Cinto Couro Estruturado')).toBeInTheDocument();
    expect(screen.getByText('Óculos Escuros Metal')).toBeInTheDocument();
    expect(screen.queryByText('Trench Coat Editorial')).not.toBeInTheDocument();

    // Colar Corrente Fina (featured) and Óculos Escuros Metal (grid) are both
    // in the "verao" collection → badge "Verão" appears twice; Cinto Couro
    // Estruturado is in "inverno" → badge "Inverno" appears once.
    expect(screen.getAllByText('Verão')).toHaveLength(2);
    expect(screen.getByText('Inverno')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/CategorySection.test.tsx`
Expected: FAIL — `Cannot find module '@/components/CategorySection'`.

- [ ] **Step 3: Create the component**

Create `components/CategorySection.tsx`:

```tsx
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
```

- [ ] **Step 4: Delete the old component and its test**

```bash
git rm components/CollectionSection.tsx tests/CollectionSection.test.tsx
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/CategorySection.test.tsx`
Expected: PASS

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: FAIL only in `tests/page.test.tsx` (still imports the old `COLLECTIONS`/`CollectionSection`-driven headings, and `app/page.tsx` still imports the now-deleted `CollectionSection`) — fixed in Task 5. All other files PASS.

- [ ] **Step 7: Commit**

```bash
git add components/CategorySection.tsx tests/CategorySection.test.tsx
git commit -m "feat: add CategorySection with a featured product and collection badges"
```

---

### Task 5: Wire `CategorySection` into the homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `tests/page.test.tsx`

**Interfaces:**
- Consumes: `CategorySection` (Task 4), `CATEGORIES` (Task 2).

- [ ] **Step 1: Write the failing test**

Replace the collection-heading assertions in `tests/page.test.tsx`. Full new file contents:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the store name and all main sections', () => {
    render(<Home />);
    expect(screen.getAllByText('ROUGE').length).toBeGreaterThanOrEqual(2);
    // "Feminino" appears twice: the Categories banner and the CategorySection heading.
    expect(screen.getAllByRole('heading', { name: 'Feminino' })).toHaveLength(2);
    expect(screen.getAllByRole('heading', { name: 'Masculino' })).toHaveLength(2);
    expect(screen.getAllByRole('heading', { name: 'Acessórios' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /receba as novidades/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/page.test.tsx`
Expected: FAIL — the page still renders `CollectionSection`s with "Coleção Inverno"/"Coleção Verão" headings, so "Feminino"/"Masculino"/"Acessórios" only appear once each (from the `Categories` banners).

- [ ] **Step 3: Update the page**

In `app/page.tsx`, replace the imports and the `#produtos` block:

```tsx
import { Header } from '@/components/Header';
import { Manifesto } from '@/components/Manifesto';
import { Categories } from '@/components/Categories';
import { CategorySection } from '@/components/CategorySection';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';
import { CATEGORIES } from '@/lib/categories';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Manifesto storeName={STORE_NAME} />
      <Categories />
      <div id="produtos">
        {CATEGORIES.map((category) => (
          <CategorySection key={category.slug} category={category} />
        ))}
      </div>
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx tests/page.test.tsx
git commit -m "feat: render products grouped by category instead of collection"
```

---

### Task 6: Remove orphaned images and final verification

**Files:**
- Delete: `public/images/colecao-inverno-destaque.jpg`
- Delete: `public/images/colecao-verao-destaque.jpg`

**Interfaces:** None (no code reads these files after Task 3 removed `Collection.featuredImage`).

- [ ] **Step 1: Confirm nothing references the files**

Run: `git grep -n "colecao-inverno-destaque\|colecao-verao-destaque" -- '*.ts' '*.tsx'`
Expected: no output (no matches).

- [ ] **Step 2: Delete the files**

```bash
git rm public/images/colecao-inverno-destaque.jpg public/images/colecao-verao-destaque.jpg
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: PASS — every test file (`smoke.test.tsx`, `Categories.test.tsx`, `CategorySection.test.tsx`, `categories.test.ts`, `collections.test.ts`, `products.test.ts`, `page.test.tsx`, `sections.test.tsx`, `format.test.ts`, `Header.test.tsx`, `ImagePreloader.test.tsx`, `scrollAnimation.test.ts`).

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git commit -m "chore: remove collection destaque images superseded by per-category featured products"
```

---

## Self-Review Notes

- **Spec coverage:** `Product.featured` (Task 1), `Category.tagline` (Task 2), `Collection` drops `featuredImage` + `getCollectionForProduct` (Task 3), `CategorySection` replacing `CollectionSection` with destaque + grade + badges (Task 4), `app/page.tsx` wiring (Task 5), orphaned image cleanup (Task 6) — all spec sections are covered. Filter/navigation and new photos are explicitly out of scope per the spec and untouched here.
- **Type consistency:** `Category` (`slug`, `title`, `tagline`, `imageUrl`) is used identically in Task 2's data and Task 4/5's component props. `getCollectionForProduct(productId: string): Collection | undefined` signature is identical between Task 3's implementation and Task 4's usage. `Product.featured?: boolean` is read the same way in Task 1's test and Task 4's `products.find((product) => product.featured)`.
- **Manual verification (not covered by the automated tests above):** after Task 6, run `npm run dev` and open the homepage to confirm the bleed-effect mask on each category's featured product looks right (no hard edge) — the exact mask percentages were carried over unchanged from the working `Editorial`/old `CollectionSection` values, but this is the first time they're applied to product photos with different framing (e.g. `colar-corrente-fina.jpg` is a tighter macro shot than the previous collection destaque photos), so a quick visual check is worth doing before calling this done.

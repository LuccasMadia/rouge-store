# ROUGE Collections & Real Photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single flat product grid with two named collections
("Coleção Inverno" / "Coleção Verão") built from real, freely-licensed
photos, and give the Editorial section and each collection a featured photo
with a CSS-only "breaking the frame" bleed effect.

**Architecture:** A new `lib/collections.ts` groups existing `PRODUCTS` (by
id, no data duplication) into named collections. A new `CollectionSection`
component renders one collection (title, tagline, bleed-effect featured
photo, product grid) and replaces `ProductGrid`, which is deleted.
`Editorial.tsx` gets the same bleed-effect photo treatment. All new photos
are already downloaded to `public/images/`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Vitest +
Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-08-rouge-collections-real-photos-design.md`.
- `Categories.tsx`, `Newsletter.tsx`, `Footer.tsx`, the color tokens, and the
  brand name do not change.
- `feminino.webp`, `masculino.webp`, `acessorios.webp` are still used by
  `Categories.tsx` — never delete them.
- The bleed effect is a CSS approximation (scaled/offset image + mask
  gradient), not a real background-removal cutout — this is a known,
  accepted limitation, not a bug to fix.
- Every task must end with `npx vitest run` passing before committing.
- Use Conventional Commits per the user's global convention.

---

### Task 1: Point existing products at their new real photos

**Files:**
- Modify: `lib/products.ts`

**Interfaces:**
- No new interfaces — `Product.imageUrl` values change, `id`/`name`/
  `priceCents`/`category` stay the same.

- [ ] **Step 1: Replace all 9 `imageUrl` values**

Replace the full file:

```ts
import type { Product } from '@/lib/types';

export const PRODUCTS: Product[] = [
  {
    id: 'trench-coat-editorial',
    name: 'Trench Coat Editorial',
    priceCents: 129900,
    imageUrl: '/images/trench-coat-editorial.jpg',
    category: 'feminino',
  },
  {
    id: 'vestido-slip-cetim',
    name: 'Vestido Slip Cetim',
    priceCents: 69900,
    imageUrl: '/images/vestido-slip-cetim.jpg',
    category: 'feminino',
  },
  {
    id: 'saia-midi-plissada',
    name: 'Saia Midi Plissada',
    priceCents: 39900,
    imageUrl: '/images/saia-midi-plissada.jpg',
    category: 'feminino',
  },
  {
    id: 'blazer-oversized',
    name: 'Blazer Oversized',
    priceCents: 89900,
    imageUrl: '/images/blazer-oversized.jpg',
    category: 'masculino',
  },
  {
    id: 'camisa-seda-manga-longa',
    name: 'Camisa Seda Manga Longa',
    priceCents: 49900,
    imageUrl: '/images/camisa-seda-manga-longa.jpg',
    category: 'masculino',
  },
  {
    id: 'calca-alfaiataria-reta',
    name: 'Calça Alfaiataria Reta',
    priceCents: 59900,
    imageUrl: '/images/calca-alfaiataria-reta.jpg',
    category: 'masculino',
  },
  {
    id: 'cinto-couro-estruturado',
    name: 'Cinto Couro Estruturado',
    priceCents: 19900,
    imageUrl: '/images/cinto-couro-estruturado.jpg',
    category: 'acessorios',
  },
  {
    id: 'oculos-escuros-metal',
    name: 'Óculos Escuros Metal',
    priceCents: 34900,
    imageUrl: '/images/oculos-escuros-metal.jpg',
    category: 'acessorios',
  },
  {
    id: 'colar-corrente-fina',
    name: 'Colar Corrente Fina',
    priceCents: 24900,
    imageUrl: '/images/colar-corrente-fina.jpg',
    category: 'acessorios',
  },
];
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/products.test.ts` only checks id
uniqueness and positive prices, not `imageUrl`.

- [ ] **Step 3: Commit**

```bash
git add lib/products.ts
git commit -m "feat: point products at their new real photos"
```

---

### Task 2: Add the collections data module

**Files:**
- Create: `lib/collections.ts`
- Test: `tests/collections.test.ts`

**Interfaces:**
- Produces: `type Collection = { slug: string; title: string; tagline:
  string; featuredImage: string; productIds: string[] }` and `COLLECTIONS:
  Collection[]` — consumed by Task 3's `CollectionSection` and Task 4's
  `app/page.tsx`.

- [ ] **Step 1: Write the failing test**

Create `tests/collections.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { COLLECTIONS } from '@/lib/collections';
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

  it('has at least two collections, each with a title and a featured image', () => {
    expect(COLLECTIONS.length).toBeGreaterThanOrEqual(2);
    COLLECTIONS.forEach((collection) => {
      expect(collection.title.length).toBeGreaterThan(0);
      expect(collection.featuredImage).toMatch(/^\/images\//);
      expect(collection.productIds.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/collections.test.ts`
Expected: FAIL with "Cannot find module '@/lib/collections'" (or similar).

- [ ] **Step 3: Create `lib/collections.ts`**

```ts
export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  featuredImage: string;
  productIds: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: 'inverno',
    title: 'Coleção Inverno',
    tagline: 'Alfaiataria e camadas para os dias mais frios.',
    featuredImage: '/images/colecao-inverno-destaque.jpg',
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
    featuredImage: '/images/colecao-verao-destaque.jpg',
    productIds: [
      'vestido-slip-cetim',
      'saia-midi-plissada',
      'camisa-seda-manga-longa',
      'oculos-escuros-metal',
      'colar-corrente-fina',
    ],
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/collections.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: all 26 tests pass (24 previous + 2 new).

- [ ] **Step 6: Commit**

```bash
git add lib/collections.ts tests/collections.test.ts
git commit -m "feat: add collections data grouping products by season"
```

---

### Task 3: Add the `CollectionSection` component

**Files:**
- Create: `components/CollectionSection.tsx`
- Test: `tests/CollectionSection.test.tsx`

**Interfaces:**
- Consumes: `Collection` type and `COLLECTIONS` from `@/lib/collections`
  (Task 2), `PRODUCTS` from `@/lib/products`, `formatPrice` from
  `@/lib/format`, `ImagePreloader` from `@/components/ImagePreloader`.
- Produces: `CollectionSection({ collection }: { collection: Collection })`
  — a named export, consumed by Task 4's `app/page.tsx`.

- [ ] **Step 1: Write the failing test**

Create `tests/CollectionSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CollectionSection } from '@/components/CollectionSection';
import { COLLECTIONS } from '@/lib/collections';

describe('CollectionSection', () => {
  it('renders the collection title, tagline, and only its own products', () => {
    const inverno = COLLECTIONS.find((collection) => collection.slug === 'inverno')!;
    render(<CollectionSection collection={inverno} />);

    expect(screen.getByRole('heading', { name: inverno.title })).toBeInTheDocument();
    expect(screen.getByText(inverno.tagline)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(inverno.productIds.length);
    expect(screen.getByText('Trench Coat Editorial')).toBeInTheDocument();
    expect(screen.queryByText('Vestido Slip Cetim')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/CollectionSection.test.tsx`
Expected: FAIL with "Cannot find module '@/components/CollectionSection'".

- [ ] **Step 3: Create `components/CollectionSection.tsx`**

```tsx
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/CollectionSection.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: all 27 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/CollectionSection.tsx tests/CollectionSection.test.tsx
git commit -m "feat: add CollectionSection with the bleed-effect featured photo"
```

---

### Task 4: Wire collections into the page, replacing the flat product grid

**Files:**
- Modify: `app/page.tsx`
- Modify: `tests/page.test.tsx`

**Interfaces:**
- Consumes: `COLLECTIONS` from `@/lib/collections` (Task 2),
  `CollectionSection` from `@/components/CollectionSection` (Task 3).

- [ ] **Step 1: Replace `ProductGrid` with a `COLLECTIONS` map in `app/page.tsx`**

Replace the full file:

```tsx
import { Header } from '@/components/Header';
import { Manifesto } from '@/components/Manifesto';
import { Categories } from '@/components/Categories';
import { CollectionSection } from '@/components/CollectionSection';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';
import { COLLECTIONS } from '@/lib/collections';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Manifesto storeName={STORE_NAME} />
      <Categories />
      <div id="produtos">
        {COLLECTIONS.map((collection) => (
          <CollectionSection key={collection.slug} collection={collection} />
        ))}
      </div>
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
```

(`id="produtos"` moves from the old `ProductGrid` section onto this wrapper,
preserving `Categories.tsx`'s `href="#produtos"` anchor links.)

- [ ] **Step 2: Fix the page test's now-stale "Coleção" heading assertion**

In `tests/page.test.tsx`, replace:

```tsx
    expect(screen.getByRole('heading', { name: /^coleção$/i })).toBeInTheDocument();
```

with:

```tsx
    expect(screen.getByRole('heading', { name: /coleção inverno/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /coleção verão/i })).toBeInTheDocument();
```

(The old assertion matched the single "Coleção" heading `ProductGrid`
rendered; that heading no longer exists now that there are two named
collection headings instead.)

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all 27 tests pass. `ProductGrid.tsx` and its test still exist on
disk but are no longer imported anywhere — Task 5 removes them.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx tests/page.test.tsx
git commit -m "feat: render Coleção Inverno and Coleção Verão on the homepage"
```

---

### Task 5: Remove the now-unused `ProductGrid`

**Files:**
- Delete: `components/ProductGrid.tsx`
- Delete: `tests/ProductGrid.test.tsx`

**Interfaces:** None — nothing imports `ProductGrid` after Task 4.

- [ ] **Step 1: Confirm nothing still imports it**

Run: `grep -r "ProductGrid" --include="*.tsx" --include="*.ts" .` (excluding
`node_modules`)
Expected: no matches outside `components/ProductGrid.tsx` and
`tests/ProductGrid.test.tsx` themselves.

- [ ] **Step 2: Delete both files**

```bash
git rm components/ProductGrid.tsx tests/ProductGrid.test.tsx
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all 26 tests pass (27 minus the 2 removed `ProductGrid` tests... 
Vitest reports test count, not file count — expect 25 tests: 27 from Task 4
minus the 2 tests in `tests/ProductGrid.test.tsx`).

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove ProductGrid, superseded by CollectionSection"
```

---

### Task 6: Give Editorial its new photo and the bleed effect

**Files:**
- Modify: `components/Editorial.tsx`

**Interfaces:** None — no props change.

- [ ] **Step 1: Replace the image container with the bleed-effect markup**

Replace the full file:

```tsx
export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-bone px-8 py-24 md:grid-cols-2">
      <div className="relative aspect-[4/5] w-full">
        <img
          src="/images/editorial-destaque.jpg"
          alt="Sobre a Rouge"
          className="absolute -top-[10%] left-1/2 h-[124%] w-[110%] -translate-x-1/2 object-cover object-top"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
          }}
        />
      </div>
      <div>
        <h2 className="mb-6 font-serif text-3xl tracking-wide text-ink md:text-4xl">
          Sobre a Rouge
        </h2>
        <p className="max-w-prose leading-relaxed text-smoke">
          A Rouge nasce da luz quente do fim de tarde e da certeza de um
          propósito maior. Cada peça é pensada para quem se veste com
          intenção, unindo conforto e elegância num guarda-roupa atemporal.
        </p>
      </div>
    </section>
  );
}
```

(The `overflow-hidden` from the old image container is dropped — it's what
would have clipped the bleed effect. `bg-smoke/10` is also dropped since the
container no longer needs a placeholder tint behind a normal `<img>`.)

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 25 tests pass — `tests/sections.test.tsx`'s Editorial test only
checks the "Sobre a Rouge" heading.

- [ ] **Step 3: Commit**

```bash
git add components/Editorial.tsx
git commit -m "feat: give Editorial a real photo with the bleed effect"
```

---

### Task 7: Remove orphaned placeholder images

**Files:**
- Delete: `public/images/feminino-2.webp`
- Delete: `public/images/feminino-3.webp`
- Delete: `public/images/masculino-2.webp`
- Delete: `public/images/masculino-3.webp`
- Delete: `public/images/acessorios-2.webp`
- Delete: `public/images/acessorios-3.webp`
- Delete: `public/images/editorial.webp`

**Interfaces:** None.

- [ ] **Step 1: Confirm nothing references these 7 files anymore**

Run: `grep -rE "feminino-2|feminino-3|masculino-2|masculino-3|acessorios-2|acessorios-3|editorial\.webp" --include="*.ts" --include="*.tsx" .`
Expected: no matches. (`feminino.webp`, `masculino.webp`, `acessorios.webp` —
without a `-2`/`-3` suffix — must NOT be touched; they're still used by
`lib/categories.ts`.)

- [ ] **Step 2: Delete the 7 orphaned files**

```bash
git rm public/images/feminino-2.webp public/images/feminino-3.webp public/images/masculino-2.webp public/images/masculino-3.webp public/images/acessorios-2.webp public/images/acessorios-3.webp public/images/editorial.webp
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all 25 tests pass (deleting unreferenced static assets doesn't
affect any test).

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove placeholder images superseded by real photos"
```

---

### Task 8: Final visual verification and per-photo bleed tuning

**Files:** Possibly `components/Editorial.tsx` and
`components/CollectionSection.tsx` (only if tuning is needed — see Step 3).

- [ ] **Step 1: Run the full test suite one more time**

Run: `npx vitest run`
Expected: all 25 tests pass.

- [ ] **Step 2: Start the dev server and review every photo**

Run: `npm run dev`, open `http://localhost:3000`, and check, for the
Editorial section and both collection featured photos:
- The top portion of the photo visibly overflows above its "box" without a
  hard rectangular edge showing (the mask should hide where the image ends).
- No visible gap or misalignment between the overflowing part and the rest
  of the photo.
- The photo isn't so zoomed/cropped that its subject becomes unrecognizable.

Also check every product tile in both collection grids: image loads (via the
`ImagePreloader` skeleton-then-fade), name and price are legible.

- [ ] **Step 3: Tune per-photo if needed**

If a specific photo's bleed looks off (edge visible, subject cropped badly),
adjust that photo's own `-top-[...]`, `h-[...]`, `w-[...]`, and mask
percentage in `components/Editorial.tsx` (single image) or add a
per-collection override in `components/CollectionSection.tsx` if one
collection's photo needs different values than the other (e.g. change the
inline values to read from an optional `collection.bleedOffset` field only
if genuinely needed — do not add this field speculatively if the shared
defaults already look fine for both photos).

- [ ] **Step 4: Re-run the full test suite if any file changed in Step 3**

Run: `npx vitest run`
Expected: all 25 tests pass.

- [ ] **Step 5: Commit any tuning changes, or confirm none were needed**

If Step 3 made changes:

```bash
git add components/Editorial.tsx components/CollectionSection.tsx
git commit -m "fix: tune bleed-effect crop per photo"
```

If no changes were needed, no commit — the feature is complete as of Task 7.

- [ ] **Step 6: Stop the dev server**

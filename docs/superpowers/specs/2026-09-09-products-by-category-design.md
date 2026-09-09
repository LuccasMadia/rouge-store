# ROUGE — Reorganização de produtos por categoria (Design)

Data: 2026-09-09

## Contexto

O usuário achou a organização atual dos produtos "solta e sem sentido": a
home mostra banners de Categoria (Feminino/Masculino/Acessórios) que só
levam para `#produtos`, e logo abaixo duas seções de Coleção (Inverno/Verão)
que misturam produtos dos três gêneros lado a lado, com todos os cards do
mesmo tamanho. Duas causas identificadas com o usuário:

1. **Duas lógicas de organização concorrentes** — Categoria (gênero) e
   Coleção (estação) disputam espaço como eixo principal, e nenhuma fica
   completa.
2. **Grid sem hierarquia** — dentro de cada coleção, todo produto tem o
   mesmo peso visual, sem destaque.

Decisão: **Categoria vira o único eixo de organização** da seção de
produtos (batendo com os banners que já existem). **Coleção vira metadado**
— um selo pequeno ("Inverno"/"Verão") em cada card, sem seção própria. Cada
categoria ganha um produto em **destaque** (foto grande em bleed effect,
mesmo tratamento visual já usado em `Editorial` e na antiga
`CollectionSection`) e os demais em grade menor.

## Estrutura de dados

### `lib/types.ts` — `Product` ganha `featured`

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

### `lib/products.ts` — um produto marcado `featured: true` por categoria

Escolha do produto destaque por categoria, baseada na foto (bleed effect
funciona bem em foto editorial/lifestyle; a foto de `oculos-escuros-metal`
é still-life em fundo branco de estúdio, sem profundidade suficiente pro
efeito, por isso não é escolhida):

- **Feminino** → `trench-coat-editorial` (foto de rua, editorial)
- **Masculino** → `blazer-oversized` (foto de rua, editorial)
- **Acessórios** → `colar-corrente-fina` (macro, boa pra crop vertical)

Cada um desses três produtos ganha `featured: true` no array existente; os
outros 6 não mudam. Nenhum `id`/`name`/`priceCents`/`imageUrl`/`category`
muda de valor.

### `lib/categories.ts` — `Category` ganha `tagline`

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

`Categories.tsx` (banners) não muda — continua usando só `title` e
`imageUrl`; `tagline` é consumida pela nova `CategorySection`.

### `lib/collections.ts` — perde `featuredImage`, ganha lookup por produto

Coleção deixa de ter uma seção própria, então a imagem de destaque da
coleção não é mais usada:

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
    productIds: ['trench-coat-editorial', 'blazer-oversized', 'calca-alfaiataria-reta', 'cinto-couro-estruturado'],
  },
  {
    slug: 'verao',
    title: 'Coleção Verão',
    tagline: 'Leveza e brilho para os dias de sol.',
    productIds: ['vestido-slip-cetim', 'saia-midi-plissada', 'camisa-seda-manga-longa', 'oculos-escuros-metal', 'colar-corrente-fina'],
  },
];

export function getCollectionForProduct(productId: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.productIds.includes(productId));
}
```

`tagline` de cada coleção deixa de ser exibido em qualquer lugar (não há
mais seção de coleção) — o campo é mantido no tipo porque ainda descreve a
coleção, mas fica sem uso na UI por ora. `title` continua em uso: é a fonte
do texto do selo (sem o prefixo "Coleção ", ex.: `"Coleção Inverno"` vira o
selo `"Inverno"`).

## Componente `CategorySection.tsx` (substitui `CollectionSection.tsx`)

Renderizado uma vez por item de `CATEGORIES`. Resolve os produtos daquela
categoria, separa o destaque do resto, e busca o selo de coleção de cada
produto via `getCollectionForProduct`:

```tsx
export function CategorySection({ category }: { category: Category }) {
  const products = PRODUCTS.filter((product) => product.category === category.slug);
  const featured = products.find((product) => product.featured) ?? products[0];
  const rest = products.filter((product) => product.id !== featured.id);
  // ...
}
```

- **Cabeçalho**: `category.title` + `category.tagline`, mesmo estilo de
  título/tagline que a antiga `CollectionSection` usava para
  `collection.title`/`tagline`.
- **Destaque**: foto de `featured.imageUrl` com o mesmo tratamento de bleed
  effect (máscara + overflow) já usado em `Editorial`/antiga
  `CollectionSection`, com `featured.name` + `formatPrice(featured.priceCents)`
  como legenda abaixo da foto, e o selo de coleção (se
  `getCollectionForProduct(featured.id)` existir) ao lado do preço. O
  ajuste fino de espaçamento entre a legenda e o alinhamento
  `items-end` do cabeçalho é decidido visualmente na implementação.
- **Grade**: `rest` renderizado no mesmo card já usado hoje (`ImagePreloader`
  + nome + preço via `formatPrice`), com o selo de coleção adicionado como
  uma pill pequena abaixo do preço:

  ```tsx
  {collection && (
    <span className="mt-1 inline-block rounded-full bg-sand px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink">
      {collection.title.replace('Coleção ', '')}
    </span>
  )}
  ```

- Se uma categoria não tiver nenhum produto com `featured: true` (erro de
  configuração), usa o primeiro produto da categoria como fallback — não
  deve quebrar a renderização.

## `app/page.tsx`

Troca:

```tsx
<div id="produtos">
  {COLLECTIONS.map((collection) => (
    <CollectionSection key={collection.slug} collection={collection} />
  ))}
</div>
```

por:

```tsx
<div id="produtos">
  {CATEGORIES.map((category) => (
    <CategorySection key={category.slug} category={category} />
  ))}
</div>
```

Ordem das seções na página: Feminino, Masculino, Acessórios (ordem atual de
`CATEGORIES`). Import de `COLLECTIONS` sai de `page.tsx` (só `collections.ts`
ainda usa o array, via `getCollectionForProduct`).

## Limpeza de arquivos órfãos

`public/images/colecao-inverno-destaque.jpg` e
`public/images/colecao-verao-destaque.jpg` deixam de ser referenciados
(eram só `Collection.featuredImage`) e são removidos.

## Testes afetados

- `tests/CollectionSection.test.tsx` é removido, substituído por
  `tests/CategorySection.test.tsx`: renderiza a categoria "Acessórios",
  confere que o heading da categoria e a tagline aparecem, que os 3
  produtos da categoria aparecem (e nenhum de outra categoria), e que o
  produto destaque (`Colar Corrente Fina`) aparece com o selo "Verão".
- `tests/collections.test.ts`: troca o teste `has ... featured image` por um
  cobrindo `getCollectionForProduct` (retorna a coleção certa para um id
  conhecido, `undefined` para um id inexistente); mantém o teste de que
  todo `productId` referenciado existe em `PRODUCTS`.
- `tests/products.test.ts`: adiciona uma verificação de que cada categoria
  (`feminino`, `masculino`, `acessorios`) tem exatamente um produto com
  `featured: true`.
- `tests/Categories.test.tsx`: não muda (continua testando só os headings
  dos 3 banners).
- `tests/page.test.tsx`: troca as expectativas de heading de
  `/coleção inverno/i` e `/coleção verão/i` para os headings das
  `CategorySection` (`Masculino` e `Acessórios` — `Feminino` já é
  verificado pelo banner de `Categories`). Como o título da categoria
  aparece duas vezes na página (banner de `Categories` + heading da
  `CategorySection` correspondente), o teste usa `getAllByRole('heading',
  { name: ... })` com o length esperado em vez de `getByRole`, para não
  quebrar por "elemento ambíguo".

## Fora de escopo

- Filtro/navegação interativa (clicar num banner de categoria continua só
  dando scroll até `#produtos`, sem esconder as outras categorias).
- Mudar `Editorial.tsx`, `Newsletter.tsx`, `Footer.tsx`, `Header.tsx`,
  paleta de cores ou nome da marca.
- Novas fotos — reaproveita as 9 fotos de produto já existentes.
- Página dedicada de coleção (`/colecoes/inverno`) — o selo é só exibição,
  sem link.

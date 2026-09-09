# ROUGE — Coleções com fotos reais e efeito de sangria (Design)

Data: 2026-09-08

## Contexto

Depois do repaint de paleta ([spec anterior](./2026-09-08-rouge-warm-palette-design.md)),
o usuário aprovou o resultado do hero e pediu para refazer as demais seções:
usar fotos reais (não geradas por IA — sem ferramenta de geração fotorrealista
disponível neste ambiente), apresentar mais de uma coleção de produtos, e
aplicar um efeito onde a pessoa na foto "sai" da área retangular demarcada,
inspirado numa referência visual enviada pelo usuário (mockup com modelo em
camiseta oversized sobre fundo de cetim vermelho, cortando o limite do
frame).

## Fontes de imagem

Sem gerador de imagem fotorrealista disponível, as fotos foram buscadas no
Unsplash (banco de imagens gratuito, licença livre para uso comercial sem
necessidade de atribuição — [licença Unsplash](https://unsplash.com/license)),
filtrando explicitamente por `license=free` para excluir fotos Unsplash+
(pagas). 12 fotos novas foram baixadas para `public/images/`:

| Arquivo | Uso | Origem (Unsplash photo ID) |
|---|---|---|
| `editorial-destaque.jpg` | Editorial — foto de sangria | `1659522761084-79196b64abe4` |
| `colecao-inverno-destaque.jpg` | Coleção Inverno — foto de sangria | `1573545289441-827c028f7a3b` |
| `colecao-verao-destaque.jpg` | Coleção Verão — foto de sangria | `1617019114583-affb34d1b3cd` |
| `trench-coat-editorial.jpg` | Produto: Trench Coat Editorial | `1676716105765-e19fe6a01851` |
| `blazer-oversized.jpg` | Produto: Blazer Oversized | `1646654793991-ab15f03b3faa` |
| `calca-alfaiataria-reta.jpg` | Produto: Calça Alfaiataria Reta | `1622450180332-3da1126f10a4` |
| `cinto-couro-estruturado.jpg` | Produto: Cinto Couro Estruturado | `1702374114952-22041fd8c880` |
| `vestido-slip-cetim.jpg` | Produto: Vestido Slip Cetim | `1780301662392-6fea210dcd87` |
| `saia-midi-plissada.jpg` | Produto: Saia Midi Plissada | `1600681103852-5f6df72461aa` |
| `camisa-seda-manga-longa.jpg` | Produto: Camisa Seda Manga Longa | `1761117228880-df2425bd70da` |
| `oculos-escuros-metal.jpg` | Produto: Óculos Escuros Metal | `1511499767150-a48a237f0083` |
| `colar-corrente-fina.jpg` | Produto: Colar Corrente Fina | `1616837874254-8d5aaa63e273` |

Os produtos foram fotografados de acordo com o que o **nome do produto**
descreve literalmente (trench coat, blazer, saia plissada etc.) em vez de
tentar forçar um visual "streetwear oversized" nos nomes atuais, que são de
alta-costura/editorial — isso evita a incoerência de mostrar uma camiseta ao
lado do texto "Vestido Slip Cetim". A inspiração da Áurea entra pela
**paleta, luz e composição** das fotos escolhidas (tons quentes, still-life,
retrato casual), não pela literalidade das peças.

## Escopo desta rodada

- Ambas as seções de produto ganham fotos novas e são reorganizadas em
  coleções nomeadas.
- `Editorial.tsx` ganha o efeito de sangria e uma foto nova.
- `Categories.tsx` **não muda** — continua com Feminino/Masculino/Acessórios
  como está, usando os 3 arquivos base (`feminino.webp`, `masculino.webp`,
  `acessorios.webp`), que **não são removidos**.
- `Newsletter.tsx` e `Footer.tsx` não mudam (sem foto).
- Nome da marca (`ROUGE`) e paleta de cores não mudam.

## Estrutura de dados: coleções

Novo arquivo `lib/collections.ts`:

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

`productIds` referencia os `id` já existentes em `lib/products.ts` — não há
duplicação de dados de produto. `lib/products.ts` não muda de formato, só os
9 valores de `imageUrl` são atualizados para os novos arquivos reais listados
acima (mantendo o mesmo `id`/`name`/`priceCents`/`category` de cada um).

## Efeito de sangria (a pessoa sai do frame)

Sem ferramenta de remoção de fundo automática, o efeito não é uma silhueta
recortada de verdade — é uma **aproximação com CSS puro**: a imagem é
renderizada maior que sua "moldura" visual e posicionada para ultrapassar a
borda superior, com uma máscara de gradiente que esmaece a parte que
ultrapassa, fundindo-a com o fundo `bone` da página por trás.

Marcação de referência (aplicada tanto no destaque de cada `CollectionSection`
quanto em `Editorial`):

```tsx
<div className="relative">
  {/* moldura: define o espaço "oficial" ocupado no grid/coluna */}
  <div className="relative aspect-[3/4] w-full">
    <img
      src={featuredImage}
      alt={...}
      className="absolute -top-[12%] left-1/2 h-[128%] w-[112%] -translate-x-1/2 object-cover object-top"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
      }}
    />
  </div>
</div>
```

- O container pai precisa estar num contexto onde o overflow para cima não
  seja cortado por um `overflow-hidden` de um ancestral (a seção/grid ao
  redor da moldura não pode ter `overflow-hidden`).
- Os valores exatos de escala/posição/gradiente (`-top-[12%]`, `h-[128%]`,
  `18%` no gradiente) são ajustados visualmente durante a implementação, por
  foto — cada imagem tem um enquadramento diferente. Critério de aceite: a
  parte de cima da pessoa/peça visualmente "invade" o espaço acima da
  moldura, sem uma borda reta perceptível onde a imagem termina (a máscara
  deve escondê-la).
- Isso é uma aproximação deliberada, não uma silhueta perfeita — está
  documentado como tal para não ser confundido com um requisito não
  cumprido.

## Componente `CollectionSection.tsx`

Substitui o uso atual de `ProductGrid.tsx` na página. Renderizado uma vez por
item de `COLLECTIONS`, recebendo a `Collection` e resolvendo os produtos via
`PRODUCTS.filter(p => collection.productIds.includes(p.id))`:

- Título da coleção (`collection.title`) e `tagline`.
- Foto de destaque com o efeito de sangria acima.
- Grade dos produtos daquela coleção (mesmo card usado hoje: `ImagePreloader`
  + nome + preço via `formatPrice`), reaproveitando o padrong visual do
  `ProductGrid` atual (`bg-bone`, `text-ink`, `text-smoke` no preço).

`ProductGrid.tsx` e seu teste (`tests/ProductGrid.test.tsx`) são removidos —
substituídos por `CollectionSection.tsx` e um teste equivalente
(`tests/CollectionSection.test.tsx`) que cobre: título da coleção renderiza,
e cada produto da coleção (só os dela, não os da outra) aparece.

## `app/page.tsx`

Troca a única chamada `<ProductGrid />` por um `.map` sobre `COLLECTIONS`
renderizando `<CollectionSection collection={collection} key={collection.slug} />`
para cada uma, na ordem em que aparecem no array (Inverno, depois Verão).

## `Editorial.tsx`

- Foto trocada de `/images/editorial.webp` para `/images/editorial-destaque.jpg`.
- Aplica o mesmo tratamento de sangria descrito acima na imagem (hoje é um
  `<img>` simples dentro de `aspect-[4/5] overflow-hidden` — o
  `overflow-hidden` do container precisa sair dali para a sangria funcionar,
  mantendo o `aspect-[4/5]` como o tamanho "oficial" do espaço reservado no
  grid de 2 colunas).
- Texto (`Sobre a Rouge` + parágrafo) não muda nesta rodada.

## Limpeza de arquivos órfãos

Com os 9 produtos migrando para fotos novas, estes arquivos deixam de ser
referenciados por qualquer componente e são removidos:
`feminino-2.webp`, `feminino-3.webp`, `masculino-2.webp`, `masculino-3.webp`,
`acessorios-2.webp`, `acessorios-3.webp`, `editorial.webp`. Os arquivos
`feminino.webp`, `masculino.webp`, `acessorios.webp` **permanecem** (usados
por `Categories.tsx`).

## Testes afetados

- `tests/ProductGrid.test.tsx` é removido, substituído por
  `tests/CollectionSection.test.tsx`.
- `tests/products.test.ts` não muda (continua validando 9 produtos únicos com
  preço positivo — os `id`/`name`/`priceCents` não mudam, só `imageUrl`).
- `tests/sections.test.tsx` (parte do `Editorial`) continua validando o
  heading "Sobre a Rouge" — não precisa mudar.
- Novo teste para `lib/collections.ts`/`CollectionSection` garantindo que
  todo `productId` referenciado em `COLLECTIONS` existe em `PRODUCTS` (evita
  um id digitado errado silenciosamente sumir da grade).

## Fora de escopo

- Remoção de fundo real / silhueta verdadeira (sem ferramenta disponível).
- Mudar `Categories.tsx`, `Newsletter.tsx`, `Footer.tsx`, paleta de cores ou
  nome da marca.
- Filtro/navegação por coleção (as duas coleções aparecem sempre, uma abaixo
  da outra, sem abas).
- Renomear produtos para se parecerem com o vocabulário "streetwear
  oversized" da Áurea — a inspiração fica na composição/luz das fotos.

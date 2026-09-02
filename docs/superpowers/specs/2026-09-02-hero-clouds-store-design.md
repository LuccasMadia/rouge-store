# Loja de roupas (portfólio) — Design

Data: 2026-09-02

## Contexto

Projeto fictício para portfólio (não é um cliente real). Loja de roupas em
Next.js com uma hero de destaque: imagem de fundo vermelha em degradê, nuvens
sobrepostas nos 4 cantos criando uma moldura, e o nome da loja centralizado.
Ao rolar a página, as nuvens desaparecem gradualmente (fade + leve
deslocamento para fora), revelando o restante da loja.

## Stack

- Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- Framer Motion para a animação de scroll (`useScroll` + `useTransform`)
- Dados de produto mockados em `lib/products.ts` (array TS estático, sem
  backend/Supabase nesta fase)
- Deploy-ready para Vercel

## Assets

- `public/images/hero-bg.png` — imagem 3 (gradiente vermelho/preto), fundo
  full-bleed da hero
- `public/images/hero-clouds.png` — imagem 2 (nuvens nos 4 cantos, fundo
  preto sólido no PNG original)

## Estrutura da página

1. **Header** — nome da marca (texto) + nav (Coleção, Sobre, Contato),
   transparente sobre a hero, ganha fundo sólido ao rolar
2. **Hero** — ver seção dedicada abaixo
3. **Categorias em destaque** — 3 cards grandes (Feminino / Masculino /
   Acessórios), imagem + hover
4. **Grade de produtos** — grid de 6-8 produtos mockados (imagem, nome,
   preço), estilo editorial
5. **Seção editorial/sobre** — bloco de texto + imagem, "sobre a marca"
6. **Newsletter** — input de e-mail, sem função real (só UI)
7. **Footer** — links, redes sociais, copyright

## Hero — comportamento detalhado

- Nome da loja: **"ROUGE"** (placeholder — fácil de trocar depois), tipografia
  serifada fina (Playfair Display ou Cormorant Garamond), centralizado sobre
  as nuvens
- Fundo: `hero-bg.png` como `background-image` full-bleed (`h-screen`,
  `object-cover`)
- Nuvens: `hero-clouds.png` posicionado por cima, cobrindo a hero inteira.
  O PNG original tem fundo preto sólido no centro (não transparente) — será
  tratado com `mix-blend-mode: screen` para que o preto "desapareça" e só as
  nuvens brancas fiquem visíveis sobre o fundo vermelho. Se o resultado visual
  não ficar bom, avaliar re-exportar a imagem com fundo transparente.
- Hero usa `position: sticky` durante o scroll inicial, dando tempo da
  animação acontecer antes de revelar a seção de categorias abaixo.

### Scroll trigger (Framer Motion)

Usar `useScroll({ target: heroRef, offset: ["start start", "end start"] })`:

- **Nuvens**: opacidade 1 → 0; leve `translateY`/`scale` para fora (~5-10%
  de deslocamento em direção às bordas) conforme o scroll progride
- **Nome da loja**: opacidade 1 → 0, desaparecendo um pouco mais rápido que
  as nuvens, com leve `translateY` para cima

## Estilo visual (tokens)

- **Cores**
  - Preto base: `#0a0a0a`
  - Vermelho destaque: `#7a0e14` / `#a11d1d`
  - Branco quebrado (texto sobre escuro): `#f5f2ef`
  - Cinza secundário: `#8a8a8a`
- **Tipografia**
  - Títulos/logo: serifada fina — Playfair Display ou Cormorant Garamond
  - Corpo/UI: sans-serif neutra — Inter (ou similar)
- **Espaçamento**: generoso, editorial, bastante respiro entre seções
- **Botões/CTAs**: outline (sem preenchimento sólido), reforça sensação
  "dark luxury / editorial"

## Fora de escopo (por enquanto)

- Backend/Supabase, carrinho funcional, checkout, autenticação
- CMS ou edição de produtos fora do código
- Responsividade mobile detalhada além do básico do Tailwind (revisar depois
  se necessário)

# ROUGE — Repaginação de paleta (Design)

Data: 2026-09-08

## Contexto

O projeto ROUGE (loja de roupas fictícia para portfólio, ver
`docs/superpowers/specs/2026-09-02-hero-clouds-store-design.md`) foi construído
com uma paleta "dark luxury" (preto + vermelho) e, em paralelo, ganhou um
posicionamento de marca "moda + fé/propósito" (seção Manifesto com nuvens e
pombas, copy "Moda com Propósito", "vestir sua fé"). A estética visual dark
ficou dissonante desse posicionamento.

Como referência visual para realinhar o tom, foi usado o Instagram da marca
real **Áurea** (@aaaurea_, moda cristã/streetwear com camisetas oversized):
paleta quente e clara (creme, terracota, bege), fotografia still-life/lifestyle
em luz suave, tipografia limpa sem contraste dramático. Esse é uso de
**inspiração estética apenas** — o projeto continua uma marca fictícia própria
(ROUGE), sem usar nome, logotipo ou copy da Áurea.

## Escopo desta rodada

Só a paleta de cores, o tratamento do hero e a tipografia. Fica fora desta
rodada (decidido explicitamente): trocar as fotos de produto/categoria atuais
(editorial de alta-costura, incoerentes com o novo tom, mas não substituídas
agora) e trocar o nome "ROUGE".

## Paleta

Substitui os 4 tokens atuais em `tailwind.config.ts` e adiciona 1 novo:

| token | antes | depois | uso |
|---|---|---|---|
| `ink` | `#0a0a0a` | `#2b2420` | agora é cor de **texto** escuro (antes era fundo) |
| `crimson` | `#7a0e14` | `#c1592f` | accent terracota (antes vermelho) |
| `crimson-light` | `#a11d1d` | `#d97a4f` | variante clara do accent |
| `bone` | `#f5f2ef` | `#f7f1e8` | agora é cor de **fundo** claro (antes era texto) |
| `smoke` | `#8a8a8a` | `#6b6058` | neutro, tom mais quente |
| `sand` *(novo)* | — | `#e3c9b4` | secundário suave (faixas, hover, detalhes) |

`smoke` é usado como cor de **texto** em vários lugares (preço do produto,
legenda do footer, placeholder do formulário). Um tom claro como `#9c8f83`
sobre o novo fundo `bone` (`#f7f1e8`) dá contraste ~2.8:1, abaixo do mínimo de
acessibilidade (4.5:1 para texto normal). `#6b6058` dá ~5.4:1, passando em AA,
mantendo o mesmo viés quente.

Paleta validada com o usuário via preview lado a lado de 3 opções (Creme &
Terracota / Areia & Rosa / Off-white & Azul); "Creme & Terracota" foi a
escolhida por ser a combinação predominante no feed de referência.

## Flip de tema (dark → light)

Hoje toda seção usa `bg-ink` (fundo escuro) + `text-bone` (texto claro):
`Categories`, `ProductGrid`, `Editorial`, `Newsletter`, `Footer`, `Header`.
Isso inverte para `bg-bone` (fundo claro) + `text-ink` (texto escuro), mantendo
a mesma estrutura de layout — só troca os tokens de cor usados em cada
elemento (backgrounds, texto, bordas, placeholders, estados hover).

`crimson` continua reservado para detalhes de destaque (ex.: fundo sutil da
seção Newsletter, hover de botão), não para blocos grandes.

Exceção deliberada: o overlay escuro sobre as fotos de categoria
(`components/Categories.tsx`, `bg-ink/30` + `text-bone` no título por cima da
imagem) **não** faz parte do flip — é um scrim para legibilidade de texto
sobre foto (funciona com foto clara ou escura), não o fundo da página, e
continua escuro com texto claro por cima da imagem.

## Hero (`components/Manifesto.tsx`)

Mantém o conceito de nuvens + pombas (decidido explicitamente: não descartar),
mudando só o tratamento de cor:

- **Fundo** (`hero-bg.png`, gradiente vermelho/preto) é substituído por um
  gradiente CSS (`linear-gradient` ou `radial-gradient`) nos tons
  `bone` → `sand` → `crimson-light`, sem gerar um asset novo.
- **Nuvens** (`hero-clouds.png`) continuam sendo o mesmo PNG, mas o tratamento
  muda de `mix-blend-mode: screen` (que some o preto sólido do PNG sobre um
  fundo escuro) para uma combinação de filtro CSS — `invert(1)` inverte o PNG
  (fundo preto vira branco, nuvens brancas viram escuras) seguido de
  `sepia()`/`hue-rotate()`/`saturate()` para tingir as nuvens (agora escuras)
  em tom terracota, e `mix-blend-mode: multiply` para que o branco invertido
  do fundo do PNG "suma" sobre o novo fundo claro. Os valores exatos de
  `invert/sepia/hue-rotate/saturate/brightness` são ajustados visualmente
  durante a implementação — não há um valor "correto" a priori, o critério de
  aceite é: nuvens visíveis em tom quente, sem quadrado/retângulo do PNG
  aparecendo por cima do gradiente.
- **Pombas** (SVG inline, `fill="currentColor"`): trocam as classes
  `text-bone/*` por `text-ink/*` (ou `text-crimson/*` onde fizer sentido para
  variar contraste), já que agora sobrevoam um fundo claro.
- **Overlay radial** (`rgba(0,0,0,0.22)` no centro-fora) é revisado — sobre
  fundo claro um escurecimento pode não ser o efeito desejado; avaliar trocar
  por um escurecimento mais sutil ou remover se não fizer falta visualmente.

## Header (`components/Header.tsx`)

Texto muda de `text-bone` para `text-ink`, já que o header é fixo/transparente
sobre toda a página (inclusive fora do hero) e o fundo geral deixa de ser
escuro.

## Botões e inputs com borda/texto `bone`

Vários controles usam `bone` como cor de borda/texto assumindo um fundo
escuro atrás (ex.: botão outline "Entrar na Coleção" no hero, botão e input
da Newsletter). Sobre o novo fundo claro isso ficaria invisível (texto/borda
quase branco sobre quase branco). Esses controles invertem para usar `ink`
como cor de borda/texto padrão, com o hover trocando para preenchimento
`ink` + texto `bone` (em vez de preenchimento `bone` + texto `ink`, que era o
padrão no tema escuro). Onde há um link de hover simples sem preenchimento
(ex.: link do footer), usa `crimson` como cor de hover — é o "detalhe de
destaque" que o token já reserva.

## `app/layout.tsx`

O `<body>` define o tema padrão da página (`bg-ink text-bone` hoje) — é o
primeiro lugar a inverter (`bg-bone text-ink`), antes de ajustar cada seção
que hoje sobrescreve esse fundo explicitamente com `bg-ink`.

## Tipografia

No hero, a palavra "Propósito" usa hoje `font-sans text-5xl font-black
uppercase tracking-wide md:text-8xl` (peso máximo, escala grande, bem
dramático). Reduz o peso (`font-black` → `font-semibold` ou `font-bold`) e a
escala (`md:text-8xl` → algo como `md:text-6xl`), para um contraste mais leve
entre a linha itálica serifada ("Moda com") e essa linha. Demais tipografia do
site (títulos de seção, nav, corpo) não muda de peso/escala, só de cor
(seguindo o flip de tema).

## Copy

`components/Editorial.tsx` tem o parágrafo:

> "Nascida do contraste entre o silêncio do preto e a intensidade do
> vermelho, a Rouge propõe peças atemporais..."

Essa frase referencia diretamente a paleta antiga e fica sem sentido após o
flip. Reescrever mantendo o resto da seção (título "Sobre a Rouge", imagem,
estrutura) intacto — só a frase que descreve a inspiração de cor muda, para
refletir o novo tom (calor, luz, propósito) sem inventar uma narrativa de
marca nova.

## Testes

Os testes existentes (`tests/*.test.tsx`) que fazem asserções sobre classes
Tailwind literais (`bg-ink`, `text-bone`, etc., se houver) precisam ser
atualizados para os novos tokens/valores. Não é esperado que testes de
comportamento (scroll, preloader, dados de produto) precisem mudar — só
asserções de classe de cor, se existirem.

## Fora de escopo

- Fotos de produto/categoria (ficam como estão; still de moda editorial
  destoando do tom novo é um débito conhecido, não resolvido nesta rodada).
- Nome da marca (`ROUGE` mantido).
- Qualquer referência a nome, logotipo ou copy da marca real Áurea — usada
  apenas como inspiração de paleta/fotografia/tom, nunca reproduzida.

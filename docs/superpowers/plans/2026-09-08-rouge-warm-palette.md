# ROUGE Warm Palette Repaint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repaint ROUGE from its dark red/black theme to a warm, light
cream/terracotta theme (inspired by the Áurea Instagram aesthetic), without
changing layout, content structure, or product photography.

**Architecture:** Pure styling change. Repoint the 5 Tailwind color tokens
(`ink`, `crimson`, `crimson-light`, `bone`, `smoke`) to new hex values and add
one new token (`sand`), then flip every component that hardcodes the old
dark-theme pairing (`bg-ink`/`text-bone`) to the light-theme pairing
(`bg-bone`/`text-ink`), file by file. The hero (`Manifesto.tsx`) additionally
swaps its background/cloud image treatment from screen-blend-on-dark to a CSS
gradient + invert/multiply-blend-on-light, and softens one heavy type
treatment.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer
Motion, Vitest + Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-08-rouge-warm-palette-design.md`.
- Brand name stays `ROUGE`. No reference to the real brand "Áurea" (name,
  logo, or copy) appears anywhere in code or content — it was inspiration
  only.
- Product/category photos are out of scope this round — do not touch
  `lib/products.ts`, `lib/categories.ts`, or `public/images/*`.
- `components/Categories.tsx`'s dark scrim-over-photo overlay
  (`bg-ink/30`/`text-bone` on the category title) is intentionally **not**
  part of the flip — it stays dark-on-photo regardless of page theme.
- Every task must end with `npx vitest run` passing (24 existing tests, no
  new failures) before committing.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) per the user's
  global convention.

---

### Task 1: Tailwind color tokens

**Files:**
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: `ink` (#2b2420), `crimson` (#c1592f), `crimson-light` (#d97a4f),
  `bone` (#f7f1e8), `smoke` (#6b6058), `sand` (#e3c9b4) — Tailwind color
  tokens consumed by every task below.

- [ ] **Step 1: Update the color values**

Replace the `colors` block in `tailwind.config.ts`:

```ts
      colors: {
        ink: '#2b2420',
        crimson: '#c1592f',
        'crimson-light': '#d97a4f',
        bone: '#f7f1e8',
        smoke: '#6b6058',
        sand: '#e3c9b4',
      },
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests still pass (no test asserts a literal hex value, only
class names, which are unchanged by this step).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: repaint color tokens to a warm cream/terracotta palette"
```

---

### Task 2: Flip the global body theme

**Files:**
- Modify: `app/layout.tsx:16`

**Interfaces:**
- Consumes: `bg-bone`, `text-ink` tokens from Task 1.

- [ ] **Step 1: Flip body classes**

In `app/layout.tsx`, change:

```tsx
      <body className="bg-ink text-bone font-sans">{children}</body>
```

to:

```tsx
      <body className="bg-bone text-ink font-sans">{children}</body>
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: flip default page theme to light"
```

---

### Task 3: Header text color

**Files:**
- Modify: `components/Header.tsx:13`

**Interfaces:**
- Consumes: `text-ink` token from Task 1.

- [ ] **Step 1: Flip the header text color**

Change:

```tsx
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-transparent px-8 py-6 text-bone backdrop-blur-sm"
```

to:

```tsx
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-transparent px-8 py-6 text-ink backdrop-blur-sm"
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/Header.test.tsx` only asserts
`bg-transparent`/`backdrop-blur-sm`, which are untouched.

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: flip header text color to the light theme"
```

---

### Task 4: Categories section background

**Files:**
- Modify: `components/Categories.tsx:6`

**Interfaces:**
- Consumes: `bg-bone` token from Task 1.

- [ ] **Step 1: Flip only the section wrapper background**

Change line 6:

```tsx
    <section id="colecao" className="grid grid-cols-1 bg-ink md:grid-cols-3">
```

to:

```tsx
    <section id="colecao" className="grid grid-cols-1 bg-bone md:grid-cols-3">
```

Leave line 18 (`bg-ink/30 ... text-bone ... group-hover:bg-ink/10`)
untouched — it is the scrim-over-photo overlay, excluded from the flip per
the Global Constraints.

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/Categories.test.tsx` only asserts the
three category headings render.

- [ ] **Step 3: Commit**

```bash
git add components/Categories.tsx
git commit -m "feat: flip categories section background to the light theme"
```

---

### Task 5: ProductGrid colors

**Files:**
- Modify: `components/ProductGrid.tsx:7,8,21`

**Interfaces:**
- Consumes: `bg-bone`, `text-ink` tokens from Task 1.

- [ ] **Step 1: Flip section background and headings**

Change line 7:

```tsx
    <section id="produtos" className="bg-ink px-8 py-24">
```

to:

```tsx
    <section id="produtos" className="bg-bone px-8 py-24">
```

Change line 8:

```tsx
      <h2 className="mb-16 text-center font-serif text-3xl tracking-wide text-bone md:text-4xl">
```

to:

```tsx
      <h2 className="mb-16 text-center font-serif text-3xl tracking-wide text-ink md:text-4xl">
```

Change line 21:

```tsx
            <h3 className="mt-4 font-sans text-sm uppercase tracking-wide text-bone">
```

to:

```tsx
            <h3 className="mt-4 font-sans text-sm uppercase tracking-wide text-ink">
```

Leave line 14 (`bg-smoke/10` image placeholder) and line 24 (`text-smoke`
price) untouched — only their underlying hex changes, from Task 1.

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/ProductGrid.test.tsx` doesn't assert
colors.

- [ ] **Step 3: Commit**

```bash
git add components/ProductGrid.tsx
git commit -m "feat: flip product grid colors to the light theme"
```

---

### Task 6: Editorial colors and copy

**Files:**
- Modify: `components/Editorial.tsx`

**Interfaces:**
- Consumes: `bg-bone`, `text-ink` tokens from Task 1.

- [ ] **Step 1: Flip colors and rewrite the paragraph**

Replace the full file:

```tsx
export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-bone px-8 py-24 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
        <img
          src="/images/editorial.webp"
          alt="Sobre a Rouge"
          className="h-full w-full object-cover"
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

(Only the section background, the heading color, and the paragraph text
changed — the image, alt text, and layout are untouched.)

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/sections.test.tsx`'s Editorial test only
asserts the "Sobre a Rouge" heading renders, not the paragraph body.

- [ ] **Step 3: Commit**

```bash
git add components/Editorial.tsx
git commit -m "feat: flip editorial section to the light theme and retire the black/red copy"
```

---

### Task 7: Newsletter colors

**Files:**
- Modify: `components/Newsletter.tsx`

**Interfaces:**
- Consumes: `text-ink`, `bg-ink` tokens from Task 1.

- [ ] **Step 1: Flip headings, input, and button**

Replace the full file:

```tsx
export function Newsletter() {
  return (
    <section className="bg-crimson/10 px-8 py-24 text-center">
      <h2 className="mb-4 font-serif text-2xl tracking-wide text-ink md:text-3xl">
        Receba as novidades
      </h2>
      <p className="mb-8 text-smoke">Lançamentos e edições limitadas antes de todo mundo.</p>
      <form className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          E-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="seu@email.com"
          className="flex-1 border border-smoke bg-transparent px-4 py-3 text-ink placeholder:text-smoke focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="border border-ink px-6 py-3 text-sm uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-bone"
        >
          Assinar
        </button>
      </form>
    </section>
  );
}
```

(`bg-crimson/10` is unchanged — over the new light body it now renders as a
soft terracotta wash instead of a dark red wash, matching the spec.)

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/sections.test.tsx`'s Newsletter test
only checks the input label and submit button exist.

- [ ] **Step 3: Commit**

```bash
git add components/Newsletter.tsx
git commit -m "feat: flip newsletter section to the light theme"
```

---

### Task 8: Footer colors

**Files:**
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: `bg-bone`, `text-ink`, `crimson` tokens from Task 1.

- [ ] **Step 1: Flip background, brand name, and link hover**

Replace the full file:

```tsx
const FOOTER_LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export function Footer() {
  return (
    <footer
      id="contato"
      className="flex flex-col items-center justify-between gap-6 border-t border-smoke/30 bg-bone px-8 py-12 text-sm text-smoke sm:flex-row"
    >
      <span className="font-serif uppercase tracking-widest text-ink">ROUGE</span>
      <nav className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-crimson">
            {link.label}
          </a>
        ))}
      </nav>
      <span>&copy; {new Date().getFullYear()} Rouge. Todos os direitos reservados.</span>
    </footer>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — `tests/sections.test.tsx`'s Footer test only
checks the store name and a link render.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: flip footer to the light theme"
```

---

### Task 9: Hero background gradient and dove colors

**Files:**
- Modify: `components/Manifesto.tsx`

**Interfaces:**
- Consumes: `text-ink` token from Task 1 (dove colors); no new exports.

- [ ] **Step 1: Replace the flat red background with a warm gradient**

In `components/Manifesto.tsx`, change the background div (currently around
line 114-118):

```tsx
          <div
            data-testid="manifesto-bg"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          />
```

to:

```tsx
          <div
            data-testid="manifesto-bg"
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, #f7f1e8 0%, #e3c9b4 55%, #d97a4f 100%)',
            }}
          />
```

(`data-testid="manifesto-bg"` is preserved — `tests/sections.test.tsx`
asserts it exists.)

- [ ] **Step 2: Change the dove color from bone to ink**

In the `DOVES` array (lines 42-90), change every `doveClass` from
`text-bone/<opacity>` to `text-ink/<opacity>`, keeping each opacity value
and the `blur-[...]` suffix unchanged. There are 5 occurrences:

```tsx
const DOVES: DoveConfig[] = [
  {
    wrapperClass: 'absolute left-[6%] top-[16%] h-10 w-20 md:h-14 md:w-28',
    doveClass: 'text-ink/70 blur-[0.3px]',
    baseRotate: -8,
    driftX: 26,
    driftY: -14,
    duration: 5.5,
    delay: 0,
  },
  {
    wrapperClass: 'absolute right-[8%] top-[10%] h-7 w-14 md:h-10 md:w-20',
    doveClass: 'text-ink/50 blur-[0.5px]',
    baseRotate: 6,
    driftX: -20,
    driftY: 12,
    duration: 4.5,
    delay: 0.4,
  },
  {
    wrapperClass: 'absolute left-[3%] top-[46%] h-6 w-12 md:h-8 md:w-16',
    doveClass: 'text-ink/40 blur-[0.5px]',
    flip: true,
    baseRotate: -4,
    driftX: 18,
    driftY: 10,
    duration: 6,
    delay: 0.8,
  },
  {
    wrapperClass: 'absolute bottom-[20%] left-[30%] h-5 w-10 md:h-6 md:w-12',
    doveClass: 'text-ink/30 blur-[0.6px]',
    baseRotate: 10,
    driftX: -24,
    driftY: -10,
    duration: 5,
    delay: 1.2,
  },
  {
    wrapperClass: 'absolute bottom-[14%] right-[10%] h-8 w-16 md:h-11 md:w-[5.5rem]',
    doveClass: 'text-ink/55 blur-[0.4px]',
    flip: true,
    baseRotate: -10,
    driftX: -22,
    driftY: -16,
    duration: 4.8,
    delay: 0.2,
  },
];
```

- [ ] **Step 3: Remove the dark radial vignette**

Delete this block (currently right after the mirrored clouds layer, around
line 157-161) — it was tuned for a dark gradient and reads as a dirty smudge
over the new light one:

```tsx
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.22) 100%)' }}
          />
```

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — the Manifesto test only checks
`manifesto-bg`/`manifesto-clouds` testids and text content, not their style.

- [ ] **Step 5: Commit**

```bash
git add components/Manifesto.tsx
git commit -m "feat: repaint hero background gradient and dove color"
```

---

### Task 10: Recolor the cloud PNG for the light background

**Files:**
- Modify: `components/Manifesto.tsx`

**Interfaces:**
- Consumes: gradient background from Task 9 (visual base to check contrast
  against).

**Context:** `hero-clouds.png` has a solid black background with white cloud
shapes painted on it. The old dark theme used `mixBlendMode: 'screen'` so the
black background became invisible against the dark red gradient underneath,
leaving only the white clouds visible. Over the new light gradient, `screen`
would instead wash the whole layer toward white (black stays unchanged,
white brightens further — the opposite of invisible). The fix: invert the
image first (black background → white, white clouds → dark), tint the
now-dark clouds warm with sepia/hue-rotate/saturate, then use
`mixBlendMode: 'multiply'` so the (now white) background vanishes into the
gradient and only the tinted cloud shapes show.

**Watch out:** both cloud layers already animate the `filter` CSS property
via their `animate` prop (for a subtle breathing blur). Framer Motion takes
full ownership of any property listed in `animate` — a static `filter` set
only in `style` would be replaced by the animated `'blur(0px)'`/`'blur(2px)'`
keyframes on every frame, silently discarding the tint. The tint must be
baked into every `animate.filter` keyframe string (blur included), not left
in `style`.

- [ ] **Step 1: Bake the invert+tint filter into the primary cloud layer's blur keyframes**

Change the primary clouds `motion.div` (currently around line 120-136):

```tsx
          <motion.div
            data-testid="manifesto-clouds"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-clouds.png')",
              mixBlendMode: 'screen',
              opacity: skyOpacity,
              scale: 1.15,
            }}
            animate={{
              scale: [1.15, 1.25, 1.15],
              x: ['0%', '2.5%', '-1.5%', '0%'],
              y: ['0%', '-2%', '1.5%', '0%'],
              filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          />
```

to:

```tsx
          <motion.div
            data-testid="manifesto-clouds"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-clouds.png')",
              filter: 'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(0px)',
              mixBlendMode: 'multiply',
              opacity: skyOpacity,
              scale: 1.15,
            }}
            animate={{
              scale: [1.15, 1.25, 1.15],
              x: ['0%', '2.5%', '-1.5%', '0%'],
              y: ['0%', '-2%', '1.5%', '0%'],
              filter: [
                'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(0px)',
                'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(2px)',
                'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(0px)',
              ],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          />
```

- [ ] **Step 2: Bake the same tint into the mirrored secondary cloud layer's blur keyframes**

Change the mirrored clouds `motion.div` (currently around line 138-155):

```tsx
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/hero-clouds.png')",
                mixBlendMode: 'screen',
                opacity: skySecondaryOpacity,
                scale: 1.25,
              }}
              animate={{
                scale: [1.25, 1.35, 1.25],
                x: ['0%', '-3%', '2%', '0%'],
                y: ['0%', '2%', '-1.5%', '0%'],
                filter: ['blur(1px)', 'blur(3px)', 'blur(1px)'],
              }}
              transition={{ duration: 47, repeat: Infinity, ease: 'easeInOut' }}
            />
```

to:

```tsx
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/hero-clouds.png')",
                filter: 'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(1px)',
                mixBlendMode: 'multiply',
                opacity: skySecondaryOpacity,
                scale: 1.25,
              }}
              animate={{
                scale: [1.25, 1.35, 1.25],
                x: ['0%', '-3%', '2%', '0%'],
                y: ['0%', '2%', '-1.5%', '0%'],
                filter: [
                  'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(1px)',
                  'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(3px)',
                  'invert(88%) sepia(35%) saturate(600%) hue-rotate(340deg) brightness(0.92) contrast(0.95) blur(1px)',
                ],
              }}
              transition={{ duration: 47, repeat: Infinity, ease: 'easeInOut' }}
            />
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — the Manifesto test doesn't assert on
`filter`/`mixBlendMode`, only that the `manifesto-clouds` testid exists.

- [ ] **Step 4: Visually verify in the browser and tune if needed**

Run: `npm run dev`, open `http://localhost:3000`.

Check against the spec's acceptance criteria: clouds are visible in a warm
terracotta tone, and no black or white rectangle from the source PNG is
visible over the gradient. If the clouds look too gray, too dark, or a
rectangle edge is visible, adjust the `invert()`/`sepia()`/`hue-rotate()`
values — but change them in all four places they appear (the `style.filter`
and every `animate.filter` keyframe, for both the primary and mirrored
layer), keeping each layer's own `blur(...)` suffix as-is, otherwise the
tint will flash or mismatch mid-animation. Refresh until it matches, then
proceed to commit with the final values.

- [ ] **Step 5: Commit**

```bash
git add components/Manifesto.tsx
git commit -m "feat: recolor hero clouds for the light background via CSS filter"
```

---

### Task 11: Soften the hero "Propósito" type treatment

**Files:**
- Modify: `components/Manifesto.tsx`

**Interfaces:**
- Consumes: `text-ink`, `text-bone` tokens from Task 1.

- [ ] **Step 1: Flip the manifesto content colors and reduce the heavy weight**

In the manifesto content block (currently around line 203-222), replace:

```tsx
                <span className="mb-5 text-xs uppercase tracking-[0.5em] text-bone/70">
                  Rouge Apresenta
                </span>
                <h2 className="leading-none text-bone">
                  <span className="block font-serif text-4xl italic font-light md:text-6xl">
                    Moda com
                  </span>
                  <span className="mt-2 block font-sans text-5xl font-black uppercase tracking-wide md:text-8xl">
                    Propósito
                  </span>
                </h2>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-bone/80 md:text-base">
                  Peças pensadas para quem veste sua fé com elegância, todos os dias.
                </p>
                <a
                  href="#colecao"
                  className="mt-10 rounded-full border border-bone/60 px-8 py-3 text-xs uppercase tracking-[0.3em] text-bone transition-colors hover:bg-bone hover:text-ink"
                >
                  Entrar na Coleção
                </a>
```

with:

```tsx
                <span className="mb-5 text-xs uppercase tracking-[0.5em] text-ink/70">
                  Rouge Apresenta
                </span>
                <h2 className="leading-none text-ink">
                  <span className="block font-serif text-4xl italic font-light md:text-6xl">
                    Moda com
                  </span>
                  <span className="mt-2 block font-sans text-4xl font-semibold uppercase tracking-wide md:text-6xl">
                    Propósito
                  </span>
                </h2>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-ink/80 md:text-base">
                  Peças pensadas para quem veste sua fé com elegância, todos os dias.
                </p>
                <a
                  href="#colecao"
                  className="mt-10 rounded-full border border-ink/60 px-8 py-3 text-xs uppercase tracking-[0.3em] text-ink transition-colors hover:bg-ink hover:text-bone"
                >
                  Entrar na Coleção
                </a>
```

- [ ] **Step 2: Flip the brand-name splash color**

In the same file, find the brand-name span (currently around line 184-193)
and change:

```tsx
                className="font-serif text-6xl uppercase tracking-[0.2em] text-bone md:text-8xl"
```

to:

```tsx
                className="font-serif text-6xl uppercase tracking-[0.2em] text-ink md:text-8xl"
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all 24 tests pass — the Manifesto test asserts the brand text and
the "Entrar na Coleção" link by role/name, not by color or font weight.

- [ ] **Step 4: Commit**

```bash
git add components/Manifesto.tsx
git commit -m "feat: soften hero typography weight and flip hero text to the light theme"
```

---

### Task 12: Final visual verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite one more time**

Run: `npx vitest run`
Expected: all 24 tests pass.

- [ ] **Step 2: Start the dev server and review the whole page**

Run: `npm run dev`, open `http://localhost:3000`, and scroll through every
section (header, hero, categories, product grid, editorial, newsletter,
footer). Confirm:
- No leftover dark (`#0a0a0a`-ish) or bright red backgrounds anywhere except
  the intentional category-card photo scrim.
- All text is legible (dark text on the cream background, no invisible
  bone-on-bone or bone-on-cream text).
- The hero gradient and clouds read as warm/terracotta, not muddy or gray.
- The Newsletter section shows a soft terracotta wash, not a strong red one.

- [ ] **Step 3: Fix any visual issue found**

If a section still shows a dark-theme leftover or a legibility problem, fix
it in the relevant component file (following the same `bg-ink→bg-bone` /
`text-bone→text-ink` pattern used in Tasks 3-8), re-run `npx vitest run`,
and commit that fix separately with a `fix:` Conventional Commit message.

- [ ] **Step 4: Stop the dev server**

No further action needed if step 2 found no issues — the palette repaint is
complete.

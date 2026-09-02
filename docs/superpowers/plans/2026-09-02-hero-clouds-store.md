# Loja de Roupas — Hero com Nuvens — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js clothing-store landing page whose hero shows a red gradient background with a cloud overlay framing the centered store name; scrolling fades the clouds and name away (with a slight outward translate) to reveal the rest of the store.

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSS v3, mock product/category data as static TS arrays (no backend), Framer Motion (`useScroll` + `useTransform`) drives the hero scroll animation, with the interpolation math extracted into pure, unit-tested functions (`lib/scrollAnimation.ts`) so the animation behavior itself is covered by tests, not just by manual viewing. Vitest + React Testing Library for all tests.

**Tech Stack:** Next.js 14.2, React 18.3, TypeScript 5.6, Tailwind CSS 3.4, Framer Motion 11, Vitest 2 + @testing-library/react 16 + jsdom.

## Global Constraints

- No backend/Supabase, no cart, no checkout, no auth — mock data only (per spec, "Fora de escopo").
- Store name placeholder: **"ROUGE"** (spec explicitly approved a placeholder name).
- Hero background image source: `C:\Users\lucca\.claude\image-cache\91c2dafb-1292-42f6-a438-b800822d48fc\3.png` → `public/images/hero-bg.png`.
- Hero clouds image source: `C:\Users\lucca\.claude\image-cache\91c2dafb-1292-42f6-a438-b800822d48fc\2.png` → `public/images/hero-clouds.png`.
- Clouds PNG has a solid black center (not transparent) — handled with `mix-blend-mode: screen`, per spec.
- Color tokens: `ink #0a0a0a`, `crimson #7a0e14`, `crimson-light #a11d1d`, `bone #f5f2ef`, `smoke #8a8a8a`.
- Fonts: serif (Playfair Display) for headings/logo, sans (Inter) for body/UI.
- All work happens directly in the project root: `C:\Users\lucca\Documents\Projetos\Projetos fic para portifólio\Teste loja de roupas`.

---

## Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `next-env.d.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `vitest.config.ts`
- Create: `vitest-setup.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Test: `tests/smoke.test.tsx`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a buildable Next.js app skeleton; Tailwind color tokens (`ink`, `crimson`, `crimson-light`, `bone`, `smoke`) and font families (`font-serif`, `font-sans`) available to every later component; path alias `@/*` resolving to the project root in both TypeScript and Vitest; `npm test` / `npm run build` / `npm run lint` all runnable.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "rouge-store",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.11.17"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.15",
    "vitest": "^2.1.3",
    "@vitejs/plugin-react": "^4.3.2",
    "jsdom": "^25.0.1",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.6.2",
    "@testing-library/user-event": "^14.5.2"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 5: Write `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        crimson: '#7a0e14',
        'crimson-light': '#a11d1d',
        bone: '#f5f2ef',
        smoke: '#8a8a8a',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Write `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 8: Write `.gitignore`**

```
node_modules
.next
out
.env*.local
*.log
```

- [ ] **Step 9: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 10: Write `vitest-setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
  // @ts-expect-error - jsdom lacks ResizeObserver, Framer Motion checks for it
  globalThis.ResizeObserver = ResizeObserverMock;
}
```

- [ ] **Step 11: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'ROUGE — Loja de Roupas',
  description: 'Loja de roupas conceito, projeto de portfólio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-ink text-bone font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 12: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 13: Write a placeholder `app/page.tsx`** (replaced in Task 9)

```tsx
export default function Home() {
  return <main className="min-h-screen bg-ink text-bone" />;
}
```

- [ ] **Step 14: Write the smoke test `tests/smoke.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';

describe('project setup', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 15: Install dependencies**

Run: `npm install`
Expected: install completes with no errors (warnings about peer deps are OK).

- [ ] **Step 16: Run the smoke test**

Run: `npm test`
Expected: PASS — 1 test file, 1 test passed.

- [ ] **Step 17: Verify the app builds**

Run: `npm run build`
Expected: build succeeds (`Compiled successfully`), producing a `.next` output directory.

- [ ] **Step 18: Commit**

```bash
git add package.json tsconfig.json next.config.mjs next-env.d.ts postcss.config.js tailwind.config.ts .eslintrc.json .gitignore vitest.config.ts vitest-setup.ts app tests
git commit -m "chore: scaffold Next.js + Tailwind + Vitest project"
```

---

## Task 2: Store constants, hero assets, and product mock data

**Files:**
- Create: `lib/constants.ts`
- Create: `lib/format.ts`
- Create: `lib/types.ts`
- Create: `lib/products.ts`
- Create: `public/images/hero-bg.png` (copied)
- Create: `public/images/hero-clouds.png` (copied)
- Create: `public/images/placeholder-feminino.svg`
- Create: `public/images/placeholder-masculino.svg`
- Create: `public/images/placeholder-acessorios.svg`
- Test: `tests/format.test.ts`
- Test: `tests/products.test.ts`

**Interfaces:**
- Consumes: nothing new beyond Task 1's project skeleton.
- Produces: `STORE_NAME: string` (`lib/constants.ts`); `formatPrice(priceCents: number): string` (`lib/format.ts`); `type Product = { id: string; name: string; priceCents: number; imageUrl: string; category: 'feminino' | 'masculino' | 'acessorios' }` (`lib/types.ts`); `PRODUCTS: Product[]` with 8 entries (`lib/products.ts`); three SVG placeholder images at `/images/placeholder-{feminino,masculino,acessorios}.svg` for later category/product visuals.

- [ ] **Step 1: Copy the hero assets into `public/images/`**

Run:
```bash
mkdir -p public/images
cp "C:\Users\lucca\.claude\image-cache\91c2dafb-1292-42f6-a438-b800822d48fc\3.png" public/images/hero-bg.png
cp "C:\Users\lucca\.claude\image-cache\91c2dafb-1292-42f6-a438-b800822d48fc\2.png" public/images/hero-clouds.png
```
Expected: `ls public/images` shows `hero-bg.png` and `hero-clouds.png`.

- [ ] **Step 2: Write the three category placeholder SVGs**

`public/images/placeholder-feminino.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#0a0a0a"/>
  <rect width="800" height="1000" fill="#7a0e14" opacity="0.18"/>
  <text x="400" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#f5f2ef" letter-spacing="6">FEMININO</text>
</svg>
```

`public/images/placeholder-masculino.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#0a0a0a"/>
  <rect width="800" height="1000" fill="#a11d1d" opacity="0.18"/>
  <text x="400" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#f5f2ef" letter-spacing="6">MASCULINO</text>
</svg>
```

`public/images/placeholder-acessorios.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#0a0a0a"/>
  <rect width="800" height="1000" fill="#8a8a8a" opacity="0.18"/>
  <text x="400" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#f5f2ef" letter-spacing="6">ACESSÓRIOS</text>
</svg>
```

- [ ] **Step 3: Write `lib/constants.ts`**

```ts
export const STORE_NAME = 'ROUGE';
```

- [ ] **Step 4: Write the failing test for `formatPrice`, `tests/format.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('formats cents as BRL currency', () => {
    expect(formatPrice(12990).replace(/ /g, ' ')).toBe('R$ 129,90');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0).replace(/ /g, ' ')).toBe('R$ 0,00');
  });

  it('formats thousands with a dot separator', () => {
    expect(formatPrice(100000).replace(/ /g, ' ')).toBe('R$ 1.000,00');
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test -- tests/format.test.ts`
Expected: FAIL — cannot find module `@/lib/format`.

- [ ] **Step 6: Implement `lib/format.ts`**

```ts
export function formatPrice(priceCents: number): string {
  return (priceCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm test -- tests/format.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 8: Write `lib/types.ts`**

```ts
export type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  category: 'feminino' | 'masculino' | 'acessorios';
};
```

- [ ] **Step 9: Write the failing test for the product catalog, `tests/products.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '@/lib/products';

describe('PRODUCTS', () => {
  it('has 8 unique products with positive prices', () => {
    expect(PRODUCTS).toHaveLength(8);
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(8);
    PRODUCTS.forEach((product) => {
      expect(product.priceCents).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 10: Run the test to verify it fails**

Run: `npm test -- tests/products.test.ts`
Expected: FAIL — cannot find module `@/lib/products`.

- [ ] **Step 11: Implement `lib/products.ts`**

```ts
import type { Product } from '@/lib/types';

export const PRODUCTS: Product[] = [
  {
    id: 'trench-coat-editorial',
    name: 'Trench Coat Editorial',
    priceCents: 129900,
    imageUrl: '/images/placeholder-feminino.svg',
    category: 'feminino',
  },
  {
    id: 'vestido-slip-cetim',
    name: 'Vestido Slip Cetim',
    priceCents: 69900,
    imageUrl: '/images/placeholder-feminino.svg',
    category: 'feminino',
  },
  {
    id: 'saia-midi-plissada',
    name: 'Saia Midi Plissada',
    priceCents: 39900,
    imageUrl: '/images/placeholder-feminino.svg',
    category: 'feminino',
  },
  {
    id: 'blazer-oversized',
    name: 'Blazer Oversized',
    priceCents: 89900,
    imageUrl: '/images/placeholder-masculino.svg',
    category: 'masculino',
  },
  {
    id: 'camisa-seda-manga-longa',
    name: 'Camisa Seda Manga Longa',
    priceCents: 49900,
    imageUrl: '/images/placeholder-masculino.svg',
    category: 'masculino',
  },
  {
    id: 'calca-alfaiataria-reta',
    name: 'Calça Alfaiataria Reta',
    priceCents: 59900,
    imageUrl: '/images/placeholder-masculino.svg',
    category: 'masculino',
  },
  {
    id: 'cinto-couro-estruturado',
    name: 'Cinto Couro Estruturado',
    priceCents: 19900,
    imageUrl: '/images/placeholder-acessorios.svg',
    category: 'acessorios',
  },
  {
    id: 'oculos-escuros-metal',
    name: 'Óculos Escuros Metal',
    priceCents: 34900,
    imageUrl: '/images/placeholder-acessorios.svg',
    category: 'acessorios',
  },
];
```

- [ ] **Step 12: Run the test to verify it passes**

Run: `npm test -- tests/products.test.ts`
Expected: PASS — 1 test passed.

- [ ] **Step 13: Run the full test suite**

Run: `npm test`
Expected: all test files pass (smoke, format, products).

- [ ] **Step 14: Commit**

```bash
git add lib public/images tests/format.test.ts tests/products.test.ts
git commit -m "feat: add store constants, hero assets, and product mock data"
```

---

## Task 3: Scroll animation math (pure, unit-tested)

**Files:**
- Create: `lib/scrollAnimation.ts`
- Test: `tests/scrollAnimation.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `clamp(value: number, min: number, max: number): number`; `lerp(progress: number, range: readonly [number, number]): number`; range constants `HERO_SCROLL_RANGE`, `CLOUDS_OPACITY_RANGE`, `CLOUDS_TRANSLATE_RANGE`, `CLOUDS_SCALE_RANGE`, `TITLE_OPACITY_RANGE`, `TITLE_TRANSLATE_RANGE` — all consumed directly by `Hero` in Task 5 as the `useTransform` input/output ranges.

- [ ] **Step 1: Write the failing test, `tests/scrollAnimation.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  CLOUDS_OPACITY_RANGE,
  TITLE_TRANSLATE_RANGE,
} from '@/lib/scrollAnimation';

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it('clamps below the minimum', () => {
    expect(clamp(-0.2, 0, 1)).toBe(0);
  });

  it('clamps above the maximum', () => {
    expect(clamp(1.5, 0, 1)).toBe(1);
  });
});

describe('lerp', () => {
  it('returns the start value at progress 0', () => {
    expect(lerp(0, CLOUDS_OPACITY_RANGE)).toBe(1);
  });

  it('returns the end value at progress 1', () => {
    expect(lerp(1, CLOUDS_OPACITY_RANGE)).toBe(0);
  });

  it('interpolates at the midpoint', () => {
    expect(lerp(0.5, CLOUDS_OPACITY_RANGE)).toBe(0.5);
  });

  it('interpolates negative translate ranges', () => {
    expect(lerp(0.5, TITLE_TRANSLATE_RANGE)).toBe(-20);
  });

  it('clamps progress values outside 0-1', () => {
    expect(lerp(2, CLOUDS_OPACITY_RANGE)).toBe(0);
    expect(lerp(-1, CLOUDS_OPACITY_RANGE)).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/scrollAnimation.test.ts`
Expected: FAIL — cannot find module `@/lib/scrollAnimation`.

- [ ] **Step 3: Implement `lib/scrollAnimation.ts`**

```ts
export const HERO_SCROLL_RANGE = [0, 1] as const;

export const CLOUDS_OPACITY_RANGE = [1, 0] as const;
export const CLOUDS_TRANSLATE_RANGE = [0, -80] as const;
export const CLOUDS_SCALE_RANGE = [1, 1.12] as const;

export const TITLE_OPACITY_RANGE = [1, 0] as const;
export const TITLE_TRANSLATE_RANGE = [0, -40] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(progress: number, range: readonly [number, number]): number {
  const [outMin, outMax] = range;
  const t = clamp(progress, 0, 1);
  return outMin + (outMax - outMin) * t;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/scrollAnimation.test.ts`
Expected: PASS — 8 tests passed.

- [ ] **Step 5: Commit**

```bash
git add lib/scrollAnimation.ts tests/scrollAnimation.test.ts
git commit -m "feat: add pure scroll interpolation helpers for the hero animation"
```

---

## Task 4: Header component

**Files:**
- Create: `components/Header.tsx`
- Test: `tests/Header.test.tsx`

**Interfaces:**
- Consumes: none from earlier tasks (takes `storeName` as a prop, wired to `STORE_NAME` in Task 9).
- Produces: `Header({ storeName: string })` React component, rendered by `app/page.tsx` in Task 9.

- [ ] **Step 1: Write the failing test, `tests/Header.test.tsx`**

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('renders the store name and nav links', () => {
    render(<Header storeName="ROUGE" />);
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.getByText('Coleção')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  it('adds a solid background after scrolling past 50px', () => {
    render(<Header storeName="ROUGE" />);
    const header = screen.getByTestId('site-header');
    expect(header.className).toContain('bg-transparent');

    Object.defineProperty(window, 'scrollY', { value: 80, configurable: true });
    fireEvent.scroll(window);

    expect(header.className).toContain('bg-ink');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/Header.test.tsx`
Expected: FAIL — cannot find module `@/components/Header`.

- [ ] **Step 3: Implement `components/Header.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export function Header({ storeName }: { storeName: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 text-bone transition-colors duration-300 ${
        isScrolled ? 'bg-ink' : 'bg-transparent'
      }`}
    >
      <span className="font-serif text-lg uppercase tracking-widest">{storeName}</span>
      <nav className="flex gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm uppercase tracking-wide hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/Header.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx tests/Header.test.tsx
git commit -m "feat: add sticky header that solidifies on scroll"
```

---

## Task 5: Hero component (background, clouds, title, scroll animation)

**Files:**
- Create: `components/Hero.tsx`
- Test: `tests/Hero.test.tsx`

**Interfaces:**
- Consumes: `HERO_SCROLL_RANGE`, `CLOUDS_OPACITY_RANGE`, `CLOUDS_TRANSLATE_RANGE`, `CLOUDS_SCALE_RANGE`, `TITLE_OPACITY_RANGE`, `TITLE_TRANSLATE_RANGE` from `@/lib/scrollAnimation` (Task 3); `/images/hero-bg.png` and `/images/hero-clouds.png` from `public/images` (Task 2).
- Produces: `Hero({ storeName: string })` React component, rendered by `app/page.tsx` in Task 9.

- [ ] **Step 1: Write the failing test, `tests/Hero.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

describe('Hero', () => {
  it('renders the background layer, the clouds layer, and the store name', () => {
    render(<Hero storeName="ROUGE" />);
    expect(screen.getByTestId('hero-bg')).toBeInTheDocument();
    expect(screen.getByTestId('hero-clouds')).toBeInTheDocument();
    expect(screen.getByTestId('hero-title')).toHaveTextContent('ROUGE');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/Hero.test.tsx`
Expected: FAIL — cannot find module `@/components/Hero`.

- [ ] **Step 3: Implement `components/Hero.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  HERO_SCROLL_RANGE,
  CLOUDS_OPACITY_RANGE,
  CLOUDS_TRANSLATE_RANGE,
  CLOUDS_SCALE_RANGE,
  TITLE_OPACITY_RANGE,
  TITLE_TRANSLATE_RANGE,
} from '@/lib/scrollAnimation';

export function Hero({ storeName }: { storeName: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const cloudsOpacity = useTransform(scrollYProgress, HERO_SCROLL_RANGE, CLOUDS_OPACITY_RANGE);
  const cloudsY = useTransform(scrollYProgress, HERO_SCROLL_RANGE, CLOUDS_TRANSLATE_RANGE);
  const cloudsScale = useTransform(scrollYProgress, HERO_SCROLL_RANGE, CLOUDS_SCALE_RANGE);
  const titleOpacity = useTransform(scrollYProgress, HERO_SCROLL_RANGE, TITLE_OPACITY_RANGE);
  const titleY = useTransform(scrollYProgress, HERO_SCROLL_RANGE, TITLE_TRANSLATE_RANGE);

  return (
    <section ref={heroRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          data-testid="hero-bg"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <motion.div
          data-testid="hero-clouds"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-clouds.png')",
            mixBlendMode: 'screen',
            opacity: cloudsOpacity,
            y: cloudsY,
            scale: cloudsScale,
          }}
        />
        <motion.h1
          data-testid="hero-title"
          className="absolute inset-0 flex items-center justify-center font-serif text-6xl uppercase tracking-[0.2em] text-bone md:text-8xl"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {storeName}
        </motion.h1>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/Hero.test.tsx`
Expected: PASS — 1 test passed.

Note: `useScroll`/`useTransform` need real browser layout to animate; jsdom renders the elements statically at progress 0, which is why the animation math itself is tested separately and directly in Task 3 rather than re-derived here.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx tests/Hero.test.tsx
git commit -m "feat: add hero with scroll-driven cloud and title fade"
```

---

## Task 6: Categories section

**Files:**
- Create: `lib/categories.ts`
- Create: `components/Categories.tsx`
- Test: `tests/Categories.test.tsx`

**Interfaces:**
- Consumes: `/images/placeholder-{feminino,masculino,acessorios}.svg` from Task 2.
- Produces: `type Category = { slug: string; title: string; imageUrl: string }`, `CATEGORIES: Category[]` (`lib/categories.ts`); `Categories()` React component, rendered by `app/page.tsx` in Task 9.

- [ ] **Step 1: Write the failing test, `tests/Categories.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Categories } from '@/components/Categories';

describe('Categories', () => {
  it('renders all three category cards', () => {
    render(<Categories />);
    expect(screen.getByRole('heading', { name: 'Feminino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Masculino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Acessórios' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/Categories.test.tsx`
Expected: FAIL — cannot find module `@/components/Categories`.

- [ ] **Step 3: Write `lib/categories.ts`**

```ts
export type Category = {
  slug: string;
  title: string;
  imageUrl: string;
};

export const CATEGORIES: Category[] = [
  { slug: 'feminino', title: 'Feminino', imageUrl: '/images/placeholder-feminino.svg' },
  { slug: 'masculino', title: 'Masculino', imageUrl: '/images/placeholder-masculino.svg' },
  { slug: 'acessorios', title: 'Acessórios', imageUrl: '/images/placeholder-acessorios.svg' },
];
```

- [ ] **Step 4: Implement `components/Categories.tsx`**

```tsx
import { CATEGORIES } from '@/lib/categories';

export function Categories() {
  return (
    <section id="colecao" className="grid grid-cols-1 bg-ink md:grid-cols-3">
      {CATEGORIES.map((category) => (
        <a
          key={category.slug}
          href="#produtos"
          className="group relative block aspect-[3/4] overflow-hidden"
        >
          <img
            src={category.imageUrl}
            alt={category.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <h3 className="absolute inset-0 flex items-center justify-center bg-ink/30 font-serif text-2xl uppercase tracking-[0.3em] text-bone transition-colors group-hover:bg-ink/10">
            {category.title}
          </h3>
        </a>
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- tests/Categories.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Commit**

```bash
git add lib/categories.ts components/Categories.tsx tests/Categories.test.tsx
git commit -m "feat: add featured categories section"
```

---

## Task 7: Product grid section

**Files:**
- Create: `components/ProductGrid.tsx`
- Test: `tests/ProductGrid.test.tsx`

**Interfaces:**
- Consumes: `PRODUCTS: Product[]` from `@/lib/products` (Task 2); `formatPrice` from `@/lib/format` (Task 2).
- Produces: `ProductGrid()` React component, rendered by `app/page.tsx` in Task 9.

- [ ] **Step 1: Write the failing test, `tests/ProductGrid.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/ProductGrid';
import { PRODUCTS } from '@/lib/products';

describe('ProductGrid', () => {
  it('renders one heading per product', () => {
    render(<ProductGrid />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(PRODUCTS.length);
  });

  it('shows the name and formatted price of the first product', () => {
    render(<ProductGrid />);
    expect(screen.getByText(PRODUCTS[0].name)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*1\.299,00/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/ProductGrid.test.tsx`
Expected: FAIL — cannot find module `@/components/ProductGrid`.

- [ ] **Step 3: Implement `components/ProductGrid.tsx`**

```tsx
import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/format';

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
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/ProductGrid.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/ProductGrid.tsx tests/ProductGrid.test.tsx
git commit -m "feat: add product grid section"
```

---

## Task 8: Static content sections — Editorial, Newsletter, Footer

**Files:**
- Create: `components/Editorial.tsx`
- Create: `components/Newsletter.tsx`
- Create: `components/Footer.tsx`
- Test: `tests/sections.test.tsx`

**Interfaces:**
- Consumes: `/images/placeholder-feminino.svg` from Task 2 (reused for the editorial image).
- Produces: `Editorial()`, `Newsletter()`, `Footer()` React components, all rendered by `app/page.tsx` in Task 9.

- [ ] **Step 1: Write the failing test, `tests/sections.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';

describe('Editorial', () => {
  it('renders the about heading', () => {
    render(<Editorial />);
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
  });
});

describe('Newsletter', () => {
  it('renders an email input with a label and a submit button', () => {
    render(<Newsletter />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assinar/i })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders the store name and footer links', () => {
    render(<Footer />);
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Coleção' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/sections.test.tsx`
Expected: FAIL — cannot find modules `@/components/Editorial`, `@/components/Newsletter`, `@/components/Footer`.

- [ ] **Step 3: Implement `components/Editorial.tsx`**

```tsx
export function Editorial() {
  return (
    <section id="sobre" className="grid items-center gap-12 bg-ink px-8 py-24 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden bg-smoke/10">
        <img
          src="/images/placeholder-feminino.svg"
          alt="Sobre a Rouge"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 className="mb-6 font-serif text-3xl tracking-wide text-bone md:text-4xl">
          Sobre a Rouge
        </h2>
        <p className="max-w-prose leading-relaxed text-smoke">
          Nascida do contraste entre o silêncio do preto e a intensidade do vermelho, a Rouge
          propõe peças atemporais para quem se veste com intenção. Cada coleção nasce de um
          processo editorial, pensado peça a peça.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `components/Newsletter.tsx`**

```tsx
export function Newsletter() {
  return (
    <section className="bg-crimson/10 px-8 py-24 text-center">
      <h2 className="mb-4 font-serif text-2xl tracking-wide text-bone md:text-3xl">
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
          className="flex-1 border border-smoke bg-transparent px-4 py-3 text-bone placeholder:text-smoke focus:border-bone focus:outline-none"
        />
        <button
          type="submit"
          className="border border-bone px-6 py-3 text-sm uppercase tracking-wide text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          Assinar
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 5: Implement `components/Footer.tsx`**

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
      className="flex flex-col items-center justify-between gap-6 border-t border-smoke/30 bg-ink px-8 py-12 text-sm text-smoke sm:flex-row"
    >
      <span className="font-serif uppercase tracking-widest text-bone">ROUGE</span>
      <nav className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-bone">
            {link.label}
          </a>
        ))}
      </nav>
      <span>&copy; {new Date().getFullYear()} Rouge. Todos os direitos reservados.</span>
    </footer>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tests/sections.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 7: Commit**

```bash
git add components/Editorial.tsx components/Newsletter.tsx components/Footer.tsx tests/sections.test.tsx
git commit -m "feat: add editorial, newsletter, and footer sections"
```

---

## Task 9: Assemble the page

**Files:**
- Modify: `app/page.tsx`
- Test: `tests/page.test.tsx`

**Interfaces:**
- Consumes: `STORE_NAME` (`@/lib/constants`, Task 2), `Header` (Task 4), `Hero` (Task 5), `Categories` (Task 6), `ProductGrid` (Task 7), `Editorial`, `Newsletter`, `Footer` (Task 8).
- Produces: the composed `Home` page rendered at `/`.

- [ ] **Step 1: Write the failing integration test, `tests/page.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the store name and all main sections', () => {
    render(<Home />);
    expect(screen.getAllByText('ROUGE').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('heading', { name: 'Feminino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^coleção$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /receba as novidades/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/page.test.tsx`
Expected: FAIL — the placeholder `Home` from Task 1 has no headings and only renders an empty `<main>`.

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { ProductGrid } from '@/components/ProductGrid';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Hero storeName={STORE_NAME} />
      <Categories />
      <ProductGrid />
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/page.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: all test files pass (smoke, format, products, scrollAnimation, Header, Hero, Categories, ProductGrid, sections, page).

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx tests/page.test.tsx
git commit -m "feat: assemble the full store landing page"
```

---

## Task 10: Build, lint, and manual visual verification

**Files:** none created or modified — verification only.

**Interfaces:**
- Consumes: the complete app from Tasks 1-9.
- Produces: confirmation that the project builds, lints clean, all tests pass, and the hero scroll animation looks correct in a real browser.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all test files pass, 0 failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable).

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: `Compiled successfully`, no type errors.

- [ ] **Step 4: Manually verify the hero animation in a browser**

Run: `npm run dev`, open `http://localhost:3000`. Confirm:
- The hero shows the red gradient background with the clouds framing the corners and "ROUGE" centered.
- Scrolling down fades the clouds and the store name out, with a slight outward drift, revealing the Categories section underneath.
- The header background solidifies once scrolled past the hero.

Stop the dev server (`Ctrl+C`) once confirmed. This step has no automated assertion — it validates the visual behavior the unit tests can't observe in jsdom.

No commit for this task — it only verifies work already committed in Tasks 1-9.

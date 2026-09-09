'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { HERO_SCROLL_RANGE, CLOUDS_OPACITY_RANGE, CLOUDS_SCALE_RANGE } from '@/lib/scrollAnimation';

const BRAND_DISPLAY_MS = 1800;

function Dove({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" fill="currentColor" className={className} aria-hidden="true">
      <ellipse cx="50" cy="28" rx="7" ry="3.5" />
      <circle cx="58" cy="24.5" r="2.6" />
      <motion.path
        d="M50 27 Q 20 4 1 13 Q 24 19 44 29 Z"
        style={{ transformBox: 'fill-box', transformOrigin: '100% 50%' }}
        animate={{ scaleY: [1, 0.35, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M50 27 Q 80 4 99 13 Q 76 19 56 29 Z"
        style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
        animate={{ scaleY: [1, 0.35, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M44 30 Q 36 41 27 46 Q 39 36 46 32 Z" />
    </svg>
  );
}

type DoveConfig = {
  wrapperClass: string;
  doveClass: string;
  flip?: boolean;
  baseRotate: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
};

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

export function Manifesto({ storeName }: { storeName: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const [showBrand, setShowBrand] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBrand(false), BRAND_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const skyOpacity = useTransform(scrollYProgress, [...HERO_SCROLL_RANGE], [...CLOUDS_OPACITY_RANGE]);
  const skySecondaryOpacity = useTransform(skyOpacity, (value) => value * 0.45);
  const skyScale = useTransform(scrollYProgress, [...HERO_SCROLL_RANGE], [...CLOUDS_SCALE_RANGE]);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: skyScale }}>
          <div
            data-testid="manifesto-bg"
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, #f7f1e8 0%, #e3c9b4 55%, #d97a4f 100%)',
            }}
          />

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
          <div className="absolute inset-0" style={{ transform: 'scaleX(-1)' }}>
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
          </div>

          <motion.div className="absolute inset-0" style={{ opacity: skyOpacity }}>
            {DOVES.map((dove, index) => (
              <div key={index} className={dove.wrapperClass} style={dove.flip ? { transform: 'scaleX(-1)' } : undefined}>
                <motion.div
                  animate={{
                    x: [0, dove.driftX, 0],
                    y: [0, dove.driftY, 0],
                    rotate: [dove.baseRotate - 4, dove.baseRotate + 4, dove.baseRotate - 4],
                  }}
                  transition={{ duration: dove.duration, repeat: Infinity, ease: 'easeInOut', delay: dove.delay }}
                >
                  <Dove className={`h-full w-full ${dove.doveClass}`} />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative flex flex-col items-center px-8 text-center">
          <AnimatePresence mode="wait">
            {showBrand ? (
              <motion.span
                key="brand"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="font-serif text-6xl uppercase tracking-[0.2em] text-ink md:text-8xl"
              >
                {storeName}
              </motion.span>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

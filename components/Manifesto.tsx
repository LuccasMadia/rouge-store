'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  HERO_SCROLL_RANGE,
  CLOUDS_OPACITY_RANGE,
  CLOUDS_TRANSLATE_RANGE,
  CLOUDS_SCALE_RANGE,
} from '@/lib/scrollAnimation';

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
    doveClass: 'text-bone/70 blur-[0.3px]',
    baseRotate: -8,
    driftX: 26,
    driftY: -14,
    duration: 5.5,
    delay: 0,
  },
  {
    wrapperClass: 'absolute right-[8%] top-[10%] h-7 w-14 md:h-10 md:w-20',
    doveClass: 'text-bone/50 blur-[0.5px]',
    baseRotate: 6,
    driftX: -20,
    driftY: 12,
    duration: 4.5,
    delay: 0.4,
  },
  {
    wrapperClass: 'absolute left-[3%] top-[46%] h-6 w-12 md:h-8 md:w-16',
    doveClass: 'text-bone/40 blur-[0.5px]',
    flip: true,
    baseRotate: -4,
    driftX: 18,
    driftY: 10,
    duration: 6,
    delay: 0.8,
  },
  {
    wrapperClass: 'absolute bottom-[20%] left-[30%] h-5 w-10 md:h-6 md:w-12',
    doveClass: 'text-bone/30 blur-[0.6px]',
    baseRotate: 10,
    driftX: -24,
    driftY: -10,
    duration: 5,
    delay: 1.2,
  },
  {
    wrapperClass: 'absolute bottom-[14%] right-[10%] h-8 w-16 md:h-11 md:w-[5.5rem]',
    doveClass: 'text-bone/55 blur-[0.4px]',
    flip: true,
    baseRotate: -10,
    driftX: -22,
    driftY: -16,
    duration: 4.8,
    delay: 0.2,
  },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const skyOpacity = useTransform(scrollYProgress, [...HERO_SCROLL_RANGE], [...CLOUDS_OPACITY_RANGE]);
  const skyY = useTransform(scrollYProgress, [...HERO_SCROLL_RANGE], [...CLOUDS_TRANSLATE_RANGE]);
  const skyScale = useTransform(scrollYProgress, [...HERO_SCROLL_RANGE], [...CLOUDS_SCALE_RANGE]);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          data-testid="manifesto-bg"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />

        <motion.div className="absolute inset-0" style={{ opacity: skyOpacity, y: skyY, scale: skyScale }}>
          <motion.div
            data-testid="manifesto-clouds"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-clouds.png')", mixBlendMode: 'screen', scale: 1.15 }}
            animate={{
              scale: [1.15, 1.25, 1.15],
              x: ['0%', '2.5%', '-1.5%', '0%'],
              y: ['0%', '-2%', '1.5%', '0%'],
              filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0" style={{ transform: 'scaleX(-1)' }}>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center opacity-45"
              style={{ backgroundImage: "url('/images/hero-clouds.png')", mixBlendMode: 'screen', scale: 1.25 }}
              animate={{
                scale: [1.25, 1.35, 1.25],
                x: ['0%', '-3%', '2%', '0%'],
                y: ['0%', '2%', '-1.5%', '0%'],
                filter: ['blur(1px)', 'blur(3px)', 'blur(1px)'],
              }}
              transition={{ duration: 47, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)' }}
        />

        <motion.div className="absolute inset-0" style={{ opacity: skyOpacity, y: skyY, scale: skyScale }}>
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

        <div className="relative flex flex-col items-center px-8 text-center">
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
        </div>
      </div>
    </section>
  );
}

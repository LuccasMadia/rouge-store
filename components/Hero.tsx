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

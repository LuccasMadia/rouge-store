'use client';

import { useEffect, useRef, useState } from 'react';

type ImagePreloaderProps = {
  src: string;
  alt: string;
  imgClassName?: string;
};

export function ImagePreloader({ src, alt, imgClassName }: ImagePreloaderProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative h-full w-full">
      <div
        aria-hidden="true"
        data-testid="image-preloader-skeleton"
        className={`absolute inset-0 bg-smoke/10 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'animate-pulse opacity-100'
        }`}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${imgClassName ?? ''} transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

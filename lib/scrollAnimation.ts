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

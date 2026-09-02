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

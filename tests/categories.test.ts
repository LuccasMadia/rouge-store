import { describe, it, expect } from 'vitest';
import { CATEGORIES } from '@/lib/categories';

describe('CATEGORIES', () => {
  it('has a non-empty tagline for every category', () => {
    expect(CATEGORIES.length).toBe(3);
    CATEGORIES.forEach((category) => {
      expect(category.tagline.length).toBeGreaterThan(0);
    });
  });
});

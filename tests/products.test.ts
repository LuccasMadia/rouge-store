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

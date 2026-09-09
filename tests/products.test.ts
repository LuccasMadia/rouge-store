import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '@/lib/products';

describe('PRODUCTS', () => {
  it('has 9 unique products with positive prices', () => {
    expect(PRODUCTS).toHaveLength(9);
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(9);
    PRODUCTS.forEach((product) => {
      expect(product.priceCents).toBeGreaterThan(0);
    });
  });

  it('has exactly one featured product per category', () => {
    const categories = ['feminino', 'masculino', 'acessorios'] as const;
    categories.forEach((category) => {
      const featuredInCategory = PRODUCTS.filter(
        (p) => p.category === category && p.featured,
      );
      expect(featuredInCategory).toHaveLength(1);
    });
  });
});

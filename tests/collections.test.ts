import { describe, it, expect } from 'vitest';
import { COLLECTIONS } from '@/lib/collections';
import { PRODUCTS } from '@/lib/products';

describe('COLLECTIONS', () => {
  it('only references product ids that exist in PRODUCTS', () => {
    const productIds = new Set(PRODUCTS.map((product) => product.id));
    COLLECTIONS.forEach((collection) => {
      collection.productIds.forEach((id) => {
        expect(productIds.has(id)).toBe(true);
      });
    });
  });

  it('has at least two collections, each with a title and a featured image', () => {
    expect(COLLECTIONS.length).toBeGreaterThanOrEqual(2);
    COLLECTIONS.forEach((collection) => {
      expect(collection.title.length).toBeGreaterThan(0);
      expect(collection.featuredImage).toMatch(/^\/images\//);
      expect(collection.productIds.length).toBeGreaterThan(0);
    });
  });
});

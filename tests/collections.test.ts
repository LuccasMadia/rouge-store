import { describe, it, expect } from 'vitest';
import { COLLECTIONS, getCollectionForProduct } from '@/lib/collections';
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
});

describe('getCollectionForProduct', () => {
  it('returns the collection that lists a given product id', () => {
    const collection = getCollectionForProduct('trench-coat-editorial');
    expect(collection?.slug).toBe('inverno');
  });

  it('returns undefined for a product id that is in no collection', () => {
    expect(getCollectionForProduct('not-a-real-id')).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('formats cents as BRL currency', () => {
    expect(formatPrice(12990).replace(/ /g, ' ')).toBe('R$ 129,90');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0).replace(/ /g, ' ')).toBe('R$ 0,00');
  });

  it('formats thousands with a dot separator', () => {
    expect(formatPrice(100000).replace(/ /g, ' ')).toBe('R$ 1.000,00');
  });
});

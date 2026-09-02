import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/ProductGrid';
import { PRODUCTS } from '@/lib/products';

describe('ProductGrid', () => {
  it('renders one heading per product', () => {
    render(<ProductGrid />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(PRODUCTS.length);
  });

  it('shows the name and formatted price of the first product', () => {
    render(<ProductGrid />);
    expect(screen.getByText(PRODUCTS[0].name)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*1\.299,00/)).toBeInTheDocument();
  });
});

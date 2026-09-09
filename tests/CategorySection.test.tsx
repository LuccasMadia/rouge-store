import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategorySection } from '@/components/CategorySection';
import { CATEGORIES } from '@/lib/categories';

describe('CategorySection', () => {
  it('renders the category title, tagline, only its own products, and the featured badge', () => {
    const acessorios = CATEGORIES.find((category) => category.slug === 'acessorios')!;
    render(<CategorySection category={acessorios} />);

    expect(screen.getByRole('heading', { name: acessorios.title })).toBeInTheDocument();
    expect(screen.getByText(acessorios.tagline)).toBeInTheDocument();

    // 3 products in "acessorios": 1 featured (Colar Corrente Fina) + 2 in the grid
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('Colar Corrente Fina')).toBeInTheDocument();
    expect(screen.getByText('Cinto Couro Estruturado')).toBeInTheDocument();
    expect(screen.getByText('Óculos Escuros Metal')).toBeInTheDocument();
    expect(screen.queryByText('Trench Coat Editorial')).not.toBeInTheDocument();

    // Colar Corrente Fina (featured) and Óculos Escuros Metal (grid) are both
    // in the "verao" collection → badge "Verão" appears twice; Cinto Couro
    // Estruturado is in "inverno" → badge "Inverno" appears once.
    expect(screen.getAllByText('Verão')).toHaveLength(2);
    expect(screen.getByText('Inverno')).toBeInTheDocument();
  });
});

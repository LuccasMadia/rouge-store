import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the store name and all main sections', () => {
    render(<Home />);
    expect(screen.getAllByText('ROUGE').length).toBeGreaterThanOrEqual(2);
    // "Feminino" appears twice: the Categories banner and the CategorySection heading.
    expect(screen.getAllByRole('heading', { name: 'Feminino' })).toHaveLength(2);
    expect(screen.getAllByRole('heading', { name: 'Masculino' })).toHaveLength(2);
    expect(screen.getAllByRole('heading', { name: 'Acessórios' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /receba as novidades/i })).toBeInTheDocument();
  });
});

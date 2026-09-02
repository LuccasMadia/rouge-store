import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the store name and all main sections', () => {
    render(<Home />);
    expect(screen.getAllByText('ROUGE').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('heading', { name: 'Feminino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^coleção$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /receba as novidades/i })).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Categories } from '@/components/Categories';

describe('Categories', () => {
  it('renders all three category cards', () => {
    render(<Categories />);
    expect(screen.getByRole('heading', { name: 'Feminino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Masculino' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Acessórios' })).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  it('renders the store name and nav links', () => {
    render(<Header storeName="ROUGE" />);
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.getByText('Coleção')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  it('stays transparent with a blurred backdrop', () => {
    render(<Header storeName="ROUGE" />);
    const header = screen.getByTestId('site-header');
    expect(header.className).toContain('bg-transparent');
    expect(header.className).toContain('backdrop-blur-sm');
  });
});

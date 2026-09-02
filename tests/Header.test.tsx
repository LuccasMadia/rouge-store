import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('renders the store name and nav links', () => {
    render(<Header storeName="ROUGE" />);
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.getByText('Coleção')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  it('adds a solid background after scrolling past 50px', () => {
    render(<Header storeName="ROUGE" />);
    const header = screen.getByTestId('site-header');
    expect(header.className).toContain('bg-transparent');

    Object.defineProperty(window, 'scrollY', { value: 80, configurable: true });
    fireEvent.scroll(window);

    expect(header.className).toContain('bg-ink');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

describe('Hero', () => {
  it('renders the background layer, the clouds layer, and the store name', () => {
    render(<Hero storeName="ROUGE" />);
    expect(screen.getByTestId('hero-bg')).toBeInTheDocument();
    expect(screen.getByTestId('hero-clouds')).toBeInTheDocument();
    expect(screen.getByTestId('hero-title')).toHaveTextContent('ROUGE');
  });
});

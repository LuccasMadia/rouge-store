import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Manifesto } from '@/components/Manifesto';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';

describe('Manifesto', () => {
  it('shows the brand name first, then swaps to the manifesto content', async () => {
    render(<Manifesto storeName="ROUGE" />);
    expect(screen.getByTestId('manifesto-bg')).toBeInTheDocument();
    expect(screen.getByTestId('manifesto-clouds')).toBeInTheDocument();
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /entrar na coleção/i })).not.toBeInTheDocument();

    expect(
      await screen.findByRole('link', { name: /entrar na coleção/i }, { timeout: 4000 }),
    ).toBeInTheDocument();
  });
});

describe('Editorial', () => {
  it('renders the about heading', () => {
    render(<Editorial />);
    expect(screen.getByRole('heading', { name: /sobre a rouge/i })).toBeInTheDocument();
  });
});

describe('Newsletter', () => {
  it('renders an email input with a label and a submit button', () => {
    render(<Newsletter />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assinar/i })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders the store name and footer links', () => {
    render(<Footer />);
    expect(screen.getByText('ROUGE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Coleção' })).toBeInTheDocument();
  });
});

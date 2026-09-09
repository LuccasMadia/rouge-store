import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CollectionSection } from '@/components/CollectionSection';
import { COLLECTIONS } from '@/lib/collections';

describe('CollectionSection', () => {
  it('renders the collection title, tagline, and only its own products', () => {
    const inverno = COLLECTIONS.find((collection) => collection.slug === 'inverno')!;
    render(<CollectionSection collection={inverno} />);

    expect(screen.getByRole('heading', { name: inverno.title })).toBeInTheDocument();
    expect(screen.getByText(inverno.tagline)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(inverno.productIds.length);
    expect(screen.getByText('Trench Coat Editorial')).toBeInTheDocument();
    expect(screen.queryByText('Vestido Slip Cetim')).not.toBeInTheDocument();
  });
});

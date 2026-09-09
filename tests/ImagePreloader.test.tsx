import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImagePreloader } from '@/components/ImagePreloader';

describe('ImagePreloader', () => {
  it('shows a pulsing skeleton until the image fires onLoad', () => {
    render(<ImagePreloader src="/images/feminino.webp" alt="Feminino" />);

    const skeleton = screen.getByTestId('image-preloader-skeleton');
    const img = screen.getByAltText('Feminino');

    expect(skeleton.className).toContain('animate-pulse');
    expect(img.className).toContain('opacity-0');

    fireEvent.load(img);

    expect(skeleton.className).not.toContain('animate-pulse');
    expect(img.className).toContain('opacity-100');
  });
});

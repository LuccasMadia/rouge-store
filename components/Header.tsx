'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export function Header({ storeName }: { storeName: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 text-bone transition-colors duration-300 ${
        isScrolled ? 'bg-ink' : 'bg-transparent'
      }`}
    >
      <span className="font-serif text-lg uppercase tracking-widest">{storeName}</span>
      <nav className="flex gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm uppercase tracking-wide hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

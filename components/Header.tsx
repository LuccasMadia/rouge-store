import Link from 'next/link';

const NAV_LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export function Header({ storeName }: { storeName: string }) {
  return (
    <header
      data-testid="site-header"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-transparent px-8 py-6 text-bone backdrop-blur-sm"
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

const FOOTER_LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export function Footer() {
  return (
    <footer
      id="contato"
      className="flex flex-col items-center justify-between gap-6 border-t border-smoke/30 bg-ink px-8 py-12 text-sm text-smoke sm:flex-row"
    >
      <span className="font-serif uppercase tracking-widest text-bone">ROUGE</span>
      <nav className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-bone">
            {link.label}
          </a>
        ))}
      </nav>
      <span>&copy; {new Date().getFullYear()} Rouge. Todos os direitos reservados.</span>
    </footer>
  );
}

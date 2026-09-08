export type Category = {
  slug: string;
  title: string;
  imageUrl: string;
};

export const CATEGORIES: Category[] = [
  { slug: 'feminino', title: 'Feminino', imageUrl: '/images/feminino.webp' },
  { slug: 'masculino', title: 'Masculino', imageUrl: '/images/masculino.webp' },
  { slug: 'acessorios', title: 'Acessórios', imageUrl: '/images/acessorios.webp' },
];

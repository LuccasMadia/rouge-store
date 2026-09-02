export type Category = {
  slug: string;
  title: string;
  imageUrl: string;
};

export const CATEGORIES: Category[] = [
  { slug: 'feminino', title: 'Feminino', imageUrl: '/images/placeholder-feminino.svg' },
  { slug: 'masculino', title: 'Masculino', imageUrl: '/images/placeholder-masculino.svg' },
  { slug: 'acessorios', title: 'Acessórios', imageUrl: '/images/placeholder-acessorios.svg' },
];

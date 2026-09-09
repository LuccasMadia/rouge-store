export type Category = {
  slug: string;
  title: string;
  tagline: string;
  imageUrl: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'feminino',
    title: 'Feminino',
    tagline: 'Peças que equilibram estrutura e movimento.',
    imageUrl: '/images/feminino.webp',
  },
  {
    slug: 'masculino',
    title: 'Masculino',
    tagline: 'Alfaiataria com atitude urbana.',
    imageUrl: '/images/masculino.webp',
  },
  {
    slug: 'acessorios',
    title: 'Acessórios',
    tagline: 'Os detalhes que fecham o look.',
    imageUrl: '/images/acessorios.webp',
  },
];

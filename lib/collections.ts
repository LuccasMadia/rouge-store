export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  featuredImage: string;
  productIds: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: 'inverno',
    title: 'Coleção Inverno',
    tagline: 'Alfaiataria e camadas para os dias mais frios.',
    featuredImage: '/images/colecao-inverno-destaque.jpg',
    productIds: [
      'trench-coat-editorial',
      'blazer-oversized',
      'calca-alfaiataria-reta',
      'cinto-couro-estruturado',
    ],
  },
  {
    slug: 'verao',
    title: 'Coleção Verão',
    tagline: 'Leveza e brilho para os dias de sol.',
    featuredImage: '/images/colecao-verao-destaque.jpg',
    productIds: [
      'vestido-slip-cetim',
      'saia-midi-plissada',
      'camisa-seda-manga-longa',
      'oculos-escuros-metal',
      'colar-corrente-fina',
    ],
  },
];

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'leite',
    title: 'Pudim de Leite',
    category: 'Tradicional',
    price: 35.00,
    desc: 'A receita clássica elevada à perfeição. Sem furinhos, extremamente liso e banhado em uma calda de caramelo dourada feita no ponto certo.',
    img: 'https://imgur.com/zISIQD9.jpg',
    theme: {
      background: 'bg-pudim-milk',
      textColor: 'text-gray-900',
      accentColor: 'text-amber-600',
      neonGradient: 'conic-gradient(transparent, transparent, #D4AF37, #fbbf24, transparent 40%)',
      blurColor: 'bg-amber-200/50',
      dripColor: '#F3F4F6',
      dripOverNext: true
    }
  },
  {
    id: 'morango',
    title: 'Pudim de Morango',
    category: 'Edição Frutada',
    price: 45.00,
    desc: 'Uma explosão de sabor. Feito com morangos frescos selecionados, este pudim traz a combinação perfeita entre a cremosidade e o azedinho da fruta.',
    img: 'https://imgur.com/cyzC80R.jpg',
    theme: {
      background: 'bg-red-600',
      textColor: 'text-white',
      accentColor: 'text-rose-200',
      neonGradient: 'conic-gradient(transparent, transparent, #ffe4e6, #fff, transparent 40%)',
      blurColor: 'bg-white/20',
      dripColor: '#dc2626',
      dripOverNext: true
    }
  },
  {
    id: 'chocolate',
    title: 'Pudim de Chocolate',
    category: 'Intenso',
    price: 50.00,
    desc: 'Utilizamos cacau 70% para criar uma sobremesa densa, rica e sofisticada. Não é apenas doce, é uma experiência.',
    img: 'https://imgur.com/7CdyGyd.jpg',
    theme: {
      background: 'bg-pudim-choco',
      textColor: 'text-white',
      accentColor: 'text-amber-400',
      neonGradient: 'conic-gradient(transparent, transparent, #D4AF37, #F59E0B, transparent 40%)',
      blurColor: 'bg-amber-900/50'
    }
  }
];
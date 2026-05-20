import { ref, computed } from 'vue';
import type { Produto, Promocao, RestauranteInfo } from '../types';

// ==========================================
// RESTAURANTE INFO
// ==========================================
export const restaurante = ref<RestauranteInfo>({
  nome: 'Lanchonete Teste',
  telefone1: '(79) 9-9106-6838',
  telefone2: '(79) 9-9192-2766',
  cidade: 'Aracaju',
  tempoEntrega: '30 Min',
  tempoRetirada: '15 Min',
  minimoEntrega: 'R$ 8,00',
  horario: '17:00 às 23:59',
  endereco: 'Rua do Cardápio, 123 - Aracaju',
  latitude: -10.9028,
  longitude: -37.0677,
  rating: 4.8
});

// ==========================================
// CATEGORIAS
// ==========================================
export const categoriasMenu = [
  { id: 'Todos', nome: 'Todos' },
  { id: 'Lanches', nome: 'Lanches 🍔' },
  { id: 'Bebidas', nome: 'Bebidas 🥤' },
  { id: 'Sobremesas', nome: 'Sobremesas 🍰' },
  { id: 'Combos', nome: 'Combos 🔥' }
];

// ==========================================
// PRODUTOS DO CARDÁPIO
// ==========================================
export const produtosMenu: Produto[] = [
  // LANCHES
  {
    id: 1,
    categoria: 'Lanches',
    nome: 'Duplo Smash Bacon',
    descricao: 'Pão brioche, 2 blends 90g, duplo cheddar, muito bacon artesanal croustillante.',
    preco: 28.90,
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.9,
    votos: 245,
    adicionais: [
      { id: 'a1', nome: 'Bacon Extra', preco: 4.00 },
      { id: 'a2', nome: 'Cheddar Extra', preco: 3.50 },
      { id: 'a3', nome: 'Ovo Frito', preco: 2.00 }
    ]
  },
  {
    id: 2,
    categoria: 'Lanches',
    nome: 'Classic Burger',
    descricao: 'Pão com gergelim, blend 150g, queijo prato, alface, tomate fresco.',
    preco: 22.50,
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.7,
    votos: 182,
    adicionais: [
      { id: 'a1', nome: 'Bacon Extra', preco: 4.00 },
      { id: 'a3', nome: 'Ovo Frito', preco: 2.00 },
      { id: 'a4', nome: 'Queijo Extra', preco: 2.50 }
    ]
  },
  {
    id: 5,
    categoria: 'Lanches',
    nome: 'Chicken Crispy',
    descricao: 'Pão australiano, sobrecoxa empanada, coleslaw crocante e barbecue.',
    preco: 25.00,
    img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.8,
    votos: 156,
    adicionais: [
      { id: 'a4b', nome: 'Molho Barbecue Extra', preco: 1.50 },
      { id: 'a5', nome: 'Alface Adicional', preco: 1.00 }
    ]
  },
  {
    id: 6,
    categoria: 'Lanches',
    nome: 'Mega Sandwich',
    descricao: 'Pão francês, frango desfiado, bacon, queijo, tomate e alface.',
    preco: 24.90,
    img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.6,
    votos: 98,
    adicionais: [
      { id: 'a6', nome: 'Maionese Especial', preco: 0.50 }
    ]
  },
  {
    id: 7,
    categoria: 'Lanches',
    nome: 'Hot Dog Gourmet',
    descricao: 'Hot dog premium com salsicha suíça, crocante e suculenta, com toppings variados.',
    preco: 18.00,
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561e1d?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.5,
    votos: 76,
    adicionais: [
      { id: 'a7', nome: 'Queijo Derretido', preco: 1.50 },
      { id: 'a8', nome: 'Bacon Crocante', preco: 2.00 }
    ]
  },

  // BEBIDAS
  {
    id: 3,
    categoria: 'Bebidas',
    nome: 'Coca-Cola 350ml',
    descricao: 'Lata gelada - Aquele gelo perfeito para sua sede.',
    preco: 6.00,
    img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.9,
    votos: 512
  },
  {
    id: 8,
    categoria: 'Bebidas',
    nome: 'Refrigerante Guaraná 350ml',
    descricao: 'Lata gelada - Sabor autêntico do guaraná brasileiro.',
    preco: 6.00,
    img: 'https://images.unsplash.com/photo-1554866585-c4db5bfb1024?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.7,
    votos: 234
  },
  {
    id: 9,
    categoria: 'Bebidas',
    nome: 'Suco Natural - 500ml',
    descricao: 'Suco fresco feito na hora. Escolha: laranja, abacaxi, melancia ou morango.',
    preco: 9.90,
    img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.8,
    votos: 145
  },
  {
    id: 10,
    categoria: 'Bebidas',
    nome: 'Cerveja Gelada - Lata',
    descricao: 'Bem gelada da forma que você gosta. Opções: Brahma, Skol, Itaipava.',
    preco: 8.50,
    img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.6,
    votos: 89
  },

  // SOBREMESAS
  {
    id: 11,
    categoria: 'Sobremesas',
    nome: 'Açai com Granola',
    descricao: 'Açai puro cremoso com granola crocante, mel e morangos frescos.',
    preco: 16.90,
    img: 'https://images.unsplash.com/photo-1590080876410-271fdbf9b0d1?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.9,
    votos: 203,
    adicionais: [
      { id: 's1', nome: 'Banana Extra', preco: 1.50 },
      { id: 's2', nome: 'Chocolate Derretido', preco: 2.00 }
    ]
  },
  {
    id: 12,
    categoria: 'Sobremesas',
    nome: 'Sorvete 2 Sabores',
    descricao: 'Sorvete artesanal com 2 sabores à escolha. Várias opções disponíveis.',
    preco: 14.00,
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.8,
    votos: 178,
    adicionais: [
      { id: 's3', nome: 'Cobertura de Chocolate', preco: 1.50 }
    ]
  },
  {
    id: 13,
    categoria: 'Sobremesas',
    nome: 'Pavê de Chocolate',
    descricao: 'Camadas de bolo, creme e chocolate. Um clássico irresistível.',
    preco: 11.90,
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.7,
    votos: 92
  },

  // COMBOS
  {
    id: 4,
    categoria: 'Combos',
    nome: 'Combo Casal Feliz',
    descricao: '2 Classic Burgers + Fritas Média + 2 Refrigerantes em lata. Perfeito para dois!',
    preco: 59.90,
    img: 'https://images.unsplash.com/photo-1594212691516-748bc6a98fb3?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.9,
    votos: 312,
    adicionais: [
      { id: 'c1', nome: 'Trocar bebida por suco', preco: 0.00 }
    ]
  },
  {
    id: 14,
    categoria: 'Combos',
    nome: 'Combo Family',
    descricao: '3 Lanches+ Fritas Grande + 3 Bebidas + 1 Sobremesa. Para a família inteira!',
    preco: 89.90,
    img: 'https://images.unsplash.com/photo-1559056199-6416bcfeb5c3?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.8,
    votos: 267,
    adicionais: [
      { id: 'c2', nome: 'Adicionar Sobremesa Extra', preco: 9.90 }
    ]
  },
  {
    id: 15,
    categoria: 'Combos',
    nome: 'Combo Duplo Smash',
    descricao: '2 Duplo Smash Bacon + Fritas Média + 2 Bebidas. Para os apaixonados por bacon!',
    preco: 69.90,
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    avaliacoes: 4.9,
    votos: 189
  }
];

// ==========================================
// PROMOÇÕES
// ==========================================
export const promocoes: Promocao[] = [
  {
    id: 'promo-1',
    titulo: 'Combo Família',
    descricao: '3 lanches grandes + 2 refrigerantes por apenas.',
    preco: 'R$ 74,90',
    destaque: '15% OFF',
    imagem: 'https://images.unsplash.com/photo-1559056199-6416bcfeb5c3?auto=format&fit=crop&w=600&q=80',
    badge: 'Mais pedido'
  },
  {
    id: 'promo-2',
    titulo: 'Refrigerante Grátis',
    descricao: 'Ganhe 1 refrigerante 350ml a cada 2 lanches pedidos.',
    preco: 'R$ 0,00',
    destaque: 'Oferta limitada',
    imagem: 'https://images.unsplash.com/photo-1610537367955-52c0d3eaca3b?auto=format&fit=crop&w=600&q=80',
    badge: 'Grátis'
  },
  {
    id: 'promo-3',
    titulo: 'Sexta do Combo',
    descricao: 'Combo casal + sobremesa por apenas R$ 69,90.',
    preco: 'R$ 69,90',
    destaque: 'Só sextas',
    imagem: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80',
    badge: 'Fim de semana'
  }
];

// ==========================================
// CARRINHO PERSISTENTE
// ==========================================
function carregarCarrinho() {
  const salvo = localStorage.getItem('cardapio_carrinho');
  return salvo ? JSON.parse(salvo) : [];
}

export const carrinho = ref(carregarCarrinho());

export function salvarCarrinho() {
  localStorage.setItem('cardapio_carrinho', JSON.stringify(carrinho.value));
}

// ==========================================
// FAVORITOS PERSISTENTES
// ==========================================
function carregarFavoritos() {
  const salvo = localStorage.getItem('cardapio_favoritos');
  return salvo ? JSON.parse(salvo) : [];
}

export const favoritos = ref<number[]>(carregarFavoritos());

export function salvarFavoritos() {
  localStorage.setItem('cardapio_favoritos', JSON.stringify(favoritos.value));
}

export const produtosComFavoritos = computed(() => {
  return produtosMenu.map(p => ({
    ...p,
    isFavorito: favoritos.value.includes(p.id)
  }));
});

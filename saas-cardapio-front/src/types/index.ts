export interface Adicional {
  id: string;
  nome: string;
  preco: number;
}

export interface Produto {
  id: number;
  categoria: string;
  nome: string;
  descricao: string;
  preco: number;
  img: string;
  adicionais?: Adicional[];
  avaliacoes?: number;
  votos?: number;
}

export interface CarrinhoItem {
  id: number;
  produto: Produto;
  quantidade: number;
  adicionais: Adicional[];
  observacao: string;
}

export interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  destaque: string;
  imagem: string;
  badge: string;
}

export interface RestauranteInfo {
  nome: string;
  telefone1: string;
  telefone2: string;
  cidade: string;
  tempoEntrega: string;
  tempoRetirada: string;
  minimoEntrega: string;
  horario: string;
  endereco: string;
  latitude: number;
  longitude: number;
  rating: number;
}

export interface PerfillCliente {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  observacoes: string;
}

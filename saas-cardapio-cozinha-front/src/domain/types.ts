export interface Adicional {
  id?: string;
  nome: string;
  preco: number;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imageUrl?: string;
  disponivel: boolean;
  adicionais?: Adicional[];
}

export interface ProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imageUrl?: string;
  disponivel: boolean;
  adicionais: Adicional[];
}

export interface ItemPedido {
  nome: string;
  quantidade: number;
  preco?: number;
}

export type StatusPedido = 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO';

export interface Pedido {
  id: string;
  pedidoId?: string;
  clienteNome: string;
  telefone?: string;
  status: StatusPedido;
  itens: ItemPedido[];
  valorTotal?: number;
  dataCriacao?: string;
  mensagem?: string;
}

export interface LoginResponse {
  token: string;
}

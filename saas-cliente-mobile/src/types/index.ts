// ==================== PRODUTOS ====================
export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imageUrl?: string;
  categoria: string;
  disponivel: boolean;
  ativo: boolean;
}

// ==================== ITEM DO CARRINHO ====================
export interface ItemCarrinho {
  id: string;
  produto: Produto;
  quantidade: number;
  observacoes?: string;
  subtotal: number;
}

// ==================== PEDIDO ====================
export interface Pedido {
  id?: string;
  items: ItemCarrinho[];
  total: number;
  status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue';
  dataPedido?: string;
  observacoesGerais?: string;
}

export interface PedidoRequest {
  items: Array<{
    produtoId: string;
    quantidade: number;
    observacoes?: string;
  }>;
  observacoesGerais?: string;
}

export interface PedidoResponse {
  id: string;
  items: Array<{
    produtoId: string;
    quantidade: number;
    preco: number;
    observacoes?: string;
  }>;
  total: number;
  status: string;
  dataPedido: string;
}

// ==================== FILTROS E BUSCA ====================
export interface FiltrosBusca {
  categoria?: string;
  termo?: string;
  ordenacao?: 'nome' | 'preco' | 'relevancia';
}

// ==================== NOTIFICAÇÕES ====================
export interface Notificacao {
  id: string;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  mensagem: string;
  duracao?: number;
}

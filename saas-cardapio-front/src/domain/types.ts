export interface ItemPedido {
  id: string;
  nome: string;
  quantidade: number;
}

export type StatusPedido = 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO';

export interface Pedido {
  id: string;
  clienteNome: string;
  status: StatusPedido;
  itens: ItemPedido[];
  horario: string;
}
import { Pedido, StatusPedido } from '../domain/types';
import { api } from './api';

export const PedidoService = {
  listarPedidos: async (): Promise<Pedido[]> => {
    const pedidos = await api.get<Pedido[]>('/pedidos');
    return pedidos.map((pedido) => ({
      ...pedido,
      id: pedido.id || pedido.pedidoId || '',
      clienteNome: pedido.clienteNome || 'Cliente',
      status: pedido.status as StatusPedido,
      itens: pedido.itens || [],
    }));
  },

  atualizarStatus: async (id: string, novoStatus: StatusPedido): Promise<void> => {
    await api.patch<void>(`/pedidos/${id}/status?novoStatus=${novoStatus}`);
  },
};

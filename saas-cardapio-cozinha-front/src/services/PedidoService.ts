// src/services/PedidoService.ts
import { Pedido, StatusPedido } from '../domain/types';
import { api } from './api';

const mockPedidos: Pedido[] = [
  {
    id: '1001',
    pedidoId: 'PD-1001',
    clienteNome: 'João Vitor',
    telefone: '(79) 90000-0000',
    status: 'RECEBIDO',
    valorTotal: 53.90,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    itens: [
      { nome: 'Duplo Smash Bacon', quantidade: 1, preco: 28.9 },
      { nome: 'Chicken Crispy', quantidade: 1, preco: 25.0 }
    ]
  },
  {
    id: '1002',
    pedidoId: 'PD-1002',
    clienteNome: 'Lucas Lino',
    telefone: '(79) 98888-8888',
    status: 'EM_PREPARO',
    valorTotal: 12.00,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    itens: [
      { nome: 'Batata Rústica', quantidade: 1, preco: 12.0 }
    ]
  }
];

// O interruptor que garante que não vamos travar tentando achar a API
const USE_MOCKS = true; 

export const PedidoService = {
  listarPedidos: async (): Promise<Pedido[]> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 600)); 
      return [...mockPedidos]; 
    }
    // Quando você ligar o backend real, o USE_MOCKS vai ser false e o código abaixo assume!
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
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const pedido = mockPedidos.find(p => p.id === id);
      if (pedido) pedido.status = novoStatus;
      return;
    }
    await api.patch<void>(`/pedidos/${id}/status?novoStatus=${novoStatus}`);
  }
};
import { Pedido, StatusPedido } from '../domain/types';

// MOCK: Dados falsos para você testar a UI enquanto não liga na AWS
let bancoDeDadosFalso: Pedido[] = [
  { id: '1001', clienteNome: 'João Silva', status: 'RECEBIDO', horario: '19:30', itens: [{ id: 'i1', nome: 'Duplo Smash Bacon', quantidade: 2 }, { id: 'i2', nome: 'Coca-Cola', quantidade: 1 }] },
  { id: '1002', clienteNome: 'Maria Souza', status: 'RECEBIDO', horario: '19:32', itens: [{ id: 'i3', nome: 'Combo Casal', quantidade: 1 }] },
  { id: '1003', clienteNome: 'Carlos Eduardo', status: 'EM_PREPARO', horario: '19:20', itens: [{ id: 'i4', nome: 'Chicken Crispy', quantidade: 1 }] },
];

export const PedidoService = {
  // Simula uma requisição GET para buscar os pedidos
  listarPedidos: async (): Promise<Pedido[]> => {
    // Aqui no futuro entrará o fetch('Sua-URL-AWS')
    return new Promise((resolve) => {
      setTimeout(() => resolve([...bancoDeDadosFalso]), 300); // delay fingindo internet
    });
  },

  // Simula uma requisição PATCH para mudar a coluna do pedido
  atualizarStatus: async (id: string, novoStatus: StatusPedido): Promise<void> => {
    // Aqui no futuro entrará o fetch('Sua-URL-AWS/status', { method: 'PATCH' })
    return new Promise((resolve) => {
      setTimeout(() => {
        bancoDeDadosFalso = bancoDeDadosFalso.map(p => 
          p.id === id ? { ...p, status: novoStatus } : p
        );
        resolve();
      }, 200);
    });
  }
};
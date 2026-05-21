import { api } from './api';
import { Produto, PedidoRequest, PedidoResponse } from '../types';

class PedidoServiceClass {
  async fetchProdutos(): Promise<Produto[]> {
    try {
      // Tenta buscar da API real
      const response = await api.get<Produto[]>('/produtos');
      return response;
    } catch (error) {
      console.warn('Erro ao buscar produtos da API, usando dados locais:', error);
      // Fallback com dados locais para desenvolvimento
      return this.getProdutosLocais();
    }
  }

  async criarPedido(pedido: PedidoRequest): Promise<PedidoResponse> {
    return await api.post<PedidoResponse>('/pedidos', pedido);
  }

  async buscarPedido(id: string): Promise<PedidoResponse> {
    return await api.get<PedidoResponse>(`/pedidos/${id}`);
  }

  private getProdutosLocais(): Produto[] {
    return [
      {
        id: '1',
        nome: 'Duplo Smash Bacon',
        descricao: 'Dois blends 90g, duplo cheddar cremoso, picles e muito bacon artesanal.',
        preco: 28.90,
        categoria: 'Lanches',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '2',
        nome: 'Classic Burger',
        descricao: 'Pão brioche, blend 150g, queijo prato derretido, alface crespa e tomate.',
        preco: 22.50,
        categoria: 'Lanches',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '3',
        nome: 'Coca-Cola Lata',
        descricao: '350ml - Trincando de gelada.',
        preco: 6.00,
        categoria: 'Bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '4',
        nome: 'Chicken Crispy',
        descricao: 'Sobrecoxa empanada super crocante, salada coleslaw e molho barbecue.',
        preco: 25.00,
        categoria: 'Lanches',
        imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '5',
        nome: 'Combo X-Tudo',
        descricao: 'Duplo Smash + Coca-Cola + Batata Frita Grande.',
        preco: 49.90,
        categoria: 'Combos',
        imageUrl: 'https://images.unsplash.com/photo-1585238341710-4913d3ca7229?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '6',
        nome: 'Sundae de Chocolate',
        descricao: 'Sorvete de baunilha com cobertura de chocolate quente e granulado.',
        preco: 12.50,
        categoria: 'Sobremesas',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
      {
        id: '7',
        nome: 'Suco Natural',
        descricao: 'Suco de laranja 100% natural, recém espremido.',
        preco: 8.50,
        categoria: 'Bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
      },
    ];
  }
}

export const PedidoService = new PedidoServiceClass();

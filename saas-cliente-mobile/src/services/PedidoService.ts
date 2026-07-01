import { api } from './api';
import { Produto, PedidoRequest, PedidoResponse } from '../types';

class PedidoServiceClass {
  async fetchProdutos(): Promise<Produto[]> {
    try {
      const response = await api.get<Produto[]>('/produtos');
      return response;
    } catch (error) {
      console.warn('Erro ao buscar produtos da API, usando dados locais:', error);
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
        // Adicionais focados em carne e bacon
        adicionais: [
          { id: 'add_bacon', nome: 'Bacon Artesanal', preco: 4.50 },
          { id: 'add_cheddar', nome: 'Cheddar Cremoso', preco: 3.50 },
          { id: 'add_carne', nome: 'Hambúrguer Extra', preco: 9.90 },
        ]
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
        // Adicionais focados no clássico
        adicionais: [
          { id: 'add_bacon', nome: 'Bacon Artesanal', preco: 4.50 },
          { id: 'add_cebola', nome: 'Cebola Caramelizada', preco: 2.50 },
          { id: 'add_ovo', nome: 'Ovo Frito', preco: 2.00 },
        ]
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
        // Bebida não tem bacon, tem gelo!
        adicionais: [
          { id: 'add_gelo_limao', nome: 'Gelo e Limão', preco: 0.00 },
          { id: 'add_copo', nome: 'Copo Descartável', preco: 0.50 },
        ]
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
        adicionais: [
          { id: 'add_cheddar', nome: 'Cheddar Cremoso', preco: 3.50 },
          { id: 'add_barbecue', nome: 'Molho Barbecue Extra', preco: 2.00 },
        ]
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
        adicionais: [
          { id: 'add_batata_bacon', nome: 'Bacon na Batata', preco: 5.00 },
          { id: 'add_batata_cheddar', nome: 'Cheddar na Batata', preco: 4.50 },
        ]
      },
      {
        id: '6',
        nome: 'Sorvete de Morango',
        descricao: 'Taça de sorvete de morango com calda e chantilly.',
        preco: 14.50,
        categoria: 'Gelados',
        imageUrl: 'https://images.unsplash.com/photo-1606312615522-5eeb9c2a5e78?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
        adicionais: [
          { id: 'add_morango', nome: 'Morangos Frescos', preco: 2.50 },
          { id: 'add_chantilly', nome: 'Chantilly Extra', preco: 1.50 },
        ]
      },
      {
        id: '7',
        nome: 'Brownie com Sorvete',
        descricao: 'Brownie quente servido com sorvete de baunilha e calda de chocolate.',
        preco: 19.90,
        categoria: 'Sobremesas',
        imageUrl: 'https://images.unsplash.com/photo-1603023736191-cef28f9dbb13?auto=format&fit=crop&w=500&q=80',
        disponivel: true,
        ativo: true,
        adicionais: [
          { id: 'add_calda', nome: 'Calda Extra de Chocolate', preco: 2.50 },
          { id: 'add_nozes', nome: 'Nozes Crocantes', preco: 3.00 },
        ]
      },
    ];
  }
}

export const PedidoService = new PedidoServiceClass();
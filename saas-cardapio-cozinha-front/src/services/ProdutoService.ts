import { Produto, ProdutoRequest } from '../domain/types';
import { api } from './api';

export const ProdutoService = {
  listarProdutos: () => api.get<Produto[]>('/produtos'),

  criarProduto: (produto: ProdutoRequest) =>
    api.post<Produto>('/produtos', produto),

  atualizarProduto: (id: string, produto: ProdutoRequest) =>
    api.put<Produto>(`/produtos/${id}`, produto),

  deletarProduto: (id: string) =>
    api.delete<void>(`/produtos/${id}`),
};

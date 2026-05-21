import { useState, useEffect, useCallback } from 'react';
import { Produto, FiltrosBusca } from '../types';
import { PedidoService } from '../services/PedidoService';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusca>({});

  const carregarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await PedidoService.fetchProdutos();
      setProdutos(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const produtosFiltrados = useCallback(() => {
    let resultado = [...produtos];

    // Filtro por categoria
    if (filtros.categoria && filtros.categoria !== 'Todos') {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    // Filtro por termo de busca
    if (filtros.termo) {
      const termo = filtros.termo.toLowerCase();
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    }

    // Ordenação
    if (filtros.ordenacao === 'preco') {
      resultado.sort((a, b) => a.preco - b.preco);
    } else if (filtros.ordenacao === 'nome') {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return resultado;
  }, [produtos, filtros]);

  const obterCategorias = useCallback(() => {
    const categorias = Array.from(new Set(produtos.map(p => p.categoria)));
    return ['Todos', ...categorias.sort()];
  }, [produtos]);

  return {
    produtos,
    produtosFiltrados: produtosFiltrados(),
    categorias: obterCategorias(),
    carregando,
    erro,
    filtros,
    setFiltros,
    recarregar: carregarProdutos,
  };
};

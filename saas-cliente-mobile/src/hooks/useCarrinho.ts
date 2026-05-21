import { useState, useCallback, useEffect } from 'react';
import { ItemCarrinho, Produto } from '../types';

export const useCarrinho = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarItem = useCallback((produto: Produto, quantidade: number = 1, observacoes?: string) => {
    setItens(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);

      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + quantidade,
                observacoes: observacoes || item.observacoes,
                subtotal: (item.quantidade + quantidade) * produto.preco,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: produto.id,
          produto,
          quantidade,
          observacoes,
          subtotal: quantidade * produto.preco,
        },
      ];
    });
  }, []);

  const removerItem = useCallback((produtoId: string) => {
    setItens(prev => prev.filter(item => item.id !== produtoId));
  }, []);

  const atualizarQuantidade = useCallback((produtoId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    setItens(prev =>
      prev.map(item =>
        item.id === produtoId
          ? {
              ...item,
              quantidade: novaQuantidade,
              subtotal: novaQuantidade * item.produto.preco,
            }
          : item
      )
    );
  }, [removerItem]);

  const atualizarObservacoes = useCallback((produtoId: string, observacoes: string) => {
    setItens(prev =>
      prev.map(item =>
        item.id === produtoId
          ? { ...item, observacoes }
          : item
      )
    );
  }, []);

  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  const total = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const quantidadeTotalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return {
    itens,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    atualizarObservacoes,
    limparCarrinho,
    total,
    quantidadeTotalItens,
  };
};

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
  useWindowDimensions // <-- Trocamos Dimensions por useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from './src/components/Header';
import { SearchBar } from './src/components/SearchBar';
import { CategoryFilter } from './src/components/CategoryFilter';
import { ProdutoCard } from './src/components/ProdutoCard';
import { CarrinhoModal } from './src/components/CarrinhoModal';
import { SucessoPedidoModal } from './src/components/SucessoPedidoModal';
import { LoadingModal } from './src/components/LoadingModal';

import { useCarrinho } from './src/hooks/useCarrinho';
import { useProdutos } from './src/hooks/useProdutos';
import { PedidoService } from './src/services/PedidoService';

import { COLORS, SPACING } from './src/constants/theme';
import { Produto } from './src/types';

const NUM_COLUMNS = 2;

export default function App() {
  // O SEGREDO 2: Cálculo da largura trazido para dentro do App
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - (SPACING.md * 2) - SPACING.md) / NUM_COLUMNS;

  // ==================== ESTADOS ====================
  const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [carregandoPedido, setCarregandoPedido] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string>();
  const [busca, setBusca] = useState('');

  // ==================== HOOKS ====================
  const carrinho = useCarrinho();
  const { produtosFiltrados, categorias, filtros, setFiltros, carregando, erro } = useProdutos();

  // ==================== HANDLERS ====================
  const handleAdicionarAoCarrinho = useCallback((produto: Produto) => {
    carrinho.adicionarItem(produto, 1);
    Alert.alert(
      'Sucesso!',
      `${produto.nome} adicionado ao carrinho`,
      [{ text: 'OK', style: 'default' }],
      { cancelable: false }
    );
  }, [carrinho]);

  const handleBusca = useCallback((texto: string) => {
    setBusca(texto);
    setFiltros(prev => ({ ...prev, termo: texto }));
  }, [setFiltros]);

  const handleFiltrarCategoria = useCallback((categoria: string) => {
    const novaCategoria = categoria === 'Todos' ? undefined : categoria;
    setFiltros(prev => ({ ...prev, categoria: novaCategoria }));
  }, [setFiltros]);

  const handleConfirmarPedido = useCallback(async (observacoes: string) => {
    if (carrinho.itens.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens ao carrinho antes de confirmar!');
      return;
    }

    setCarregandoPedido(true);
    try {
      const pedidoRequest = {
        items: carrinho.itens.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
          observacoes: item.observacoes,
        })),
        observacoesGerais: observacoes,
      };

      const resposta = await PedidoService.criarPedido(pedidoRequest);

      setNumeroPedido(resposta.id);
      setSucessoVisivel(true);
      carrinho.limparCarrinho();
      setCarrinhoVisivel(false);
      setBusca('');
    } catch (err) {
      console.error('Erro ao confirmar pedido:', err);
      Alert.alert(
        'Erro',
        'Não foi possível confirmar o pedido. Tente novamente!',
        [{ text: 'OK' }]
      );
    } finally {
      setCarregandoPedido(false);
    }
  }, [carrinho]);

  const handleSucessoFechar = useCallback(() => {
    setSucessoVisivel(false);
  }, []);

  // ==================== RENDERIZAÇÃO ====================
  const renderProdutoCard = useCallback(
      ({ item }: { item: Produto }) => (
        <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
          <ProdutoCard
            produto={item}
            // Arrumamos o nome da prop e passamos o produto inteiro
            onAdicionar={() => handleAdicionarAoCarrinho(item)} 
          />
        </View>
      ),
      [handleAdicionarAoCarrinho, CARD_WIDTH]
    );

  const renderListHeader = () => (
    <>
      <Header
        titulo="CHAPA QUENTE"
        quantidadeCarrinho={carrinho.quantidadeTotalItens}
        onCarrinhoPress={() => setCarrinhoVisivel(true)}
      />

      <SearchBar
        value={busca}
        onChangeText={handleBusca}
        onClear={() => handleBusca('')}
        placeholder="Buscar lanches..."
      />

      <CategoryFilter
        categorias={categorias}
        ativa={filtros.categoria || 'Todos'}
        onSelect={handleFiltrarCategoria}
      />
    </>
  );

  const renderListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
      <Text style={styles.emptySubtext}>Tente outra busca ou filtro</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      {carregando && <LoadingModal visivel mensagem="Carregando produtos..." />}

      <FlatList
        data={produtosFiltrados}
        renderItem={renderProdutoCard}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={!carregando ? renderListEmpty : null}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

      <CarrinhoModal
        visivel={carrinhoVisivel}
        itens={carrinho.itens}
        total={carrinho.total}
        onFechar={() => setCarrinhoVisivel(false)}
        onRemoverItem={carrinho.removerItem}
        onAtualizarQuantidade={carrinho.atualizarQuantidade}
        onConfirmarPedido={handleConfirmarPedido}
        carregando={carregandoPedido}
      />

      <SucessoPedidoModal
        visivel={sucessoVisivel}
        numeroPedido={numeroPedido}
        onFechar={handleSucessoFechar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatListContent: {
    paddingBottom: SPACING.lg,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  cardContainer: {
    marginBottom: SPACING.sm,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});
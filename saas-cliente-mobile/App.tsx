import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from './src/components/Header';
import { SearchBar } from './src/components/SearchBar';
import { CategoryFilter } from './src/components/CategoryFilter';
import { ProdutoCard } from './src/components/ProdutoCard';
import { CarrinhoModal } from './src/components/CarrinhoModal';
import { SucessoPedidoModal } from './src/components/SucessoPedidoModal';
import { LoadingModal } from './src/components/LoadingModal';
import { BottomNavBar } from './src/components/BottomNavBar';
import { ProdutoDetalheModal } from './src/components/ProdutoDetalheModal';
import { PerfilView } from './src/components/PerfilView';

import { useCarrinho } from './src/hooks/useCarrinho';
import { useProdutos } from './src/hooks/useProdutos';
import { PedidoService } from './src/services/PedidoService';

import { COLORS, SPACING } from './src/constants/theme';
import { Produto } from './src/types';

const NUM_COLUMNS = 2;

export default function App() {
  const { width } = useWindowDimensions();
  
  // O SEGREDO DA RESPONSIVIDADE: 
  // Se for Web, a largura útil é no máximo 480. Se for celular, é a tela toda.
  const appWidth = Platform.OS === 'web' ? Math.min(width, 480) : width;
  const CARD_WIDTH = (appWidth - (SPACING.md * 2) - SPACING.md) / NUM_COLUMNS;

  // ==================== ESTADOS ====================
  const [abaAtiva, setAbaAtiva] = useState('Cardapio');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  
  const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [carregandoPedido, setCarregandoPedido] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string>();
  const [busca, setBusca] = useState('');

  // ==================== HOOKS ====================
  const carrinho = useCarrinho();
  const { produtosFiltrados, categorias, filtros, setFiltros, carregando } = useProdutos();

  // ==================== HANDLERS ====================
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
      Alert.alert('Erro', 'Não foi possível confirmar o pedido. Tente novamente!', [{ text: 'OK' }]);
    } finally {
      setCarregandoPedido(false);
    }
  }, [carrinho]);

  // ==================== RENDERIZAÇÃO ====================
  const renderProdutoCard = useCallback(
    ({ item }: { item: Produto }) => (
      <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
        <ProdutoCard
          produto={item}
          onPress={(prod) => setProdutoSelecionado(prod)}
        />
      </View>
    ),
    [CARD_WIDTH]
  );

  const renderListHeader = () => (
    <>
      <Header
        titulo="CHAPA QUENTE"
        quantidadeCarrinho={carrinho.quantidadeTotalItens}
        onCarrinhoPress={() => setCarrinhoVisivel(true)}
      />
      <SearchBar value={busca} onChangeText={handleBusca} onClear={() => handleBusca('')} placeholder="Buscar lanches..." />
      <CategoryFilter categorias={categorias} ativa={filtros.categoria || 'Todos'} onSelect={handleFiltrarCategoria} />
    </>
  );

  const renderListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
    </View>
  );

  return (
    // CAIXA VIRTUAL PARA A WEB (Deixa o fundo do monitor preto e centraliza o app)
    <View style={styles.webWrapper}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={false} />

        {carregando && <LoadingModal visivel mensagem="Carregando produtos..." />}

        {abaAtiva === 'Cardapio' ? (
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
        ) : (
          <PerfilView />
        )}

        {/* BARRA INFERIOR FIXA */}
        <BottomNavBar 
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          quantidadeCarrinho={carrinho.quantidadeTotalItens}
          onAbrirCarrinho={() => setCarrinhoVisivel(true)}
        />

        {/* MODAL: DETALHES DO PRODUTO (INGREDIENTES) */}
        <ProdutoDetalheModal
          produto={produtoSelecionado}
          visivel={!!produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
          onAdicionarAoCarrinho={(produto, qtd, obs) => {
            carrinho.adicionarItem(produto, qtd);
            Alert.alert('Sucesso!', `${qtd}x adicionado(s) ao carrinho.`);
          }}
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

        <SucessoPedidoModal visivel={sucessoVisivel} numeroPedido={numeroPedido} onFechar={() => setSucessoVisivel(false)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // === A MÁGICA PARA A WEB FUNCIONAR AQUI ===
  webWrapper: {
    flex: 1,
    backgroundColor: '#000', // Fundo escuro fora do escopo do celular
    alignItems: 'center',    // Centraliza o app no monitor
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Largura máxima de um smartphone
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  // ==========================================
  
  flatListContent: {
    paddingBottom: 20, 
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
});
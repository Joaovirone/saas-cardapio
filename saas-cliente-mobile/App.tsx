import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  Alert,
  useWindowDimensions,
  Platform,
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
import { MeusPedidosView } from './src/components/MeusPedidosView';

import { UserProvider, useUser } from './src/context/UserContext';
import { AuthProvider } from './src/context/AuthContext';

import { useCarrinho } from './src/hooks/useCarrinho';
import { useProdutos } from './src/hooks/useProdutos';
import { PedidoService } from './src/services/PedidoService';

import { COLORS, SPACING } from './src/constants/theme';
import { Produto } from './src/types';
import CadastrarProdutosScreen from './src/components/CadastrarProdutosScreen';

const NUM_COLUMNS = 2;

function MainAppContent() {
  const { width } = useWindowDimensions();
  const appWidth = Platform.OS === 'web' ? Math.min(width, 480) : width;
  const CARD_WIDTH = (appWidth - (SPACING.md * 2) - SPACING.md) / NUM_COLUMNS;

  const { nome, telefone } = useUser();

  const [abaAtiva, setAbaAtiva] = useState('Cardapio');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [carregandoPedido, setCarregandoPedido] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<string>();
  const [busca, setBusca] = useState('');

  const carrinho = useCarrinho();
  const { produtosFiltrados, categorias, filtros, setFiltros, carregando } = useProdutos();

  const handleBusca = useCallback((texto: string) => {
    setBusca(texto);
    setFiltros((prev) => ({ ...prev, termo: texto }));
  }, [setFiltros]);

  const handleFiltrarCategoria = useCallback((categoria: string) => {
    const novaCategoria = categoria === 'Todos' ? undefined : categoria;
    setFiltros((prev) => ({ ...prev, categoria: novaCategoria }));
  }, [setFiltros]);

  const handleConfirmarPedido = useCallback(async (dadosPedido: string, enderecoFinal: string) => {
    setCarregandoPedido(true);
    try {
      const pedidoRequest = {
        nomeCliente: nome || 'Visitante',
        telefone: telefone || 'Não informado',
        itens: carrinho.itens.map((item) => ({
          nome: item.produto.nome,
          quantidade: item.quantidade,
          preco: item.produto.preco,
        })),
      };

      const resposta = await PedidoService.criarPedido(pedidoRequest);

      setNumeroPedido(resposta.pedidoId || resposta.id);
      setSucessoVisivel(true);
      carrinho.limparCarrinho();
      setCarrinhoVisivel(false);
      setBusca('');
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      Alert.alert('Erro', 'Não foi possível confirmar o pedido. Tente novamente!', [{ text: 'OK' }]);
    } finally {
      setCarregandoPedido(false);
    }
  }, [carrinho, nome, telefone]);

  const renderProdutoCard = useCallback(
    (renderInfo: { item: Produto }) => {
      const { item } = renderInfo;
      return (
        <View style={[styles.cardContainer, { width: CARD_WIDTH }]}> 
          <ProdutoCard produto={item} onPress={(prod) => setProdutoSelecionado(prod)} />
        </View>
      );
    },
    [CARD_WIDTH]
  );

  const renderListHeader = () => (
    <>
      <Header titulo="VIRONE LANCHES" quantidadeCarrinho={carrinho.quantidadeTotalItens} onCarrinhoPress={() => setCarrinhoVisivel(true)} />
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
    <View style={styles.webWrapper}>
      <View style={[styles.safeArea, styles.container]}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />

        {carregando && <LoadingModal visivel mensagem="Carregando produtos..." />}

        {abaAtiva === 'Cardapio' && (
          <FlatList
            data={produtosFiltrados}
            renderItem={renderProdutoCard}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={carregando ? null : renderListEmpty}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {abaAtiva === 'Pedidos' && <MeusPedidosView />}
        {abaAtiva === 'Perfil' && <PerfilView setAbaAtiva={setAbaAtiva} />}
        {abaAtiva === 'Admin' && <CadastrarProdutosScreen navigation={{ goBack: () => setAbaAtiva('Cardapio') }} />}

        <BottomNavBar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} quantidadeCarrinho={carrinho.quantidadeTotalItens} onAbrirCarrinho={() => setCarrinhoVisivel(true)} />

        <ProdutoDetalheModal
          produto={produtoSelecionado}
          visivel={!!produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
          onAdicionarAoCarrinho={(produto, qtd, obs) => {
            carrinho.adicionarItem(produto, qtd, obs);
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
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <MainAppContent />
      </UserProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center' },
  safeArea: { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0 },
  container: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: COLORS.background, position: 'relative' },
  flatListContent: { paddingBottom: 20 },
  columnWrapper: { paddingHorizontal: SPACING.md, justifyContent: 'space-between', gap: SPACING.sm },
  cardContainer: { marginBottom: SPACING.sm },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md },
});

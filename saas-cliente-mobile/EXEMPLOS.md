/**
 * EXEMPLOS DE USO - SAAS CARDÁPIO MOBILE
 * 
 * Este arquivo contém exemplos de como usar os principais
 * componentes e hooks da aplicação.
 */

// ==================== EXEMPLO 1: USAR O HOOK useCarrinho ====================

import { useCarrinho } from './src/hooks/useCarrinho';
import { Produto } from './src/types';

// Dentro de um componente:
export function ExemploCarrinho() {
  const carrinho = useCarrinho();

  const produto: Produto = {
    id: '1',
    nome: 'Duplo Smash',
    descricao: 'Delicioso hambúrguer',
    preco: 28.90,
    categoria: 'Lanches',
    disponivel: true,
    ativo: true,
  };

  // Adicionar item
  carrinho.adicionarItem(produto, 2);

  // Remover item
  carrinho.removerItem(produto.id);

  // Atualizar quantidade
  carrinho.atualizarQuantidade(produto.id, 5);

  // Adicionar observações
  carrinho.atualizarObservacoes(produto.id, 'Sem cebola');

  // Limpar carrinho
  carrinho.limparCarrinho();

  // Acessar dados
  console.log('Total:', carrinho.total); // Número
  console.log('Quantidade de itens:', carrinho.quantidadeTotalItens); // Número
  console.log('Itens:', carrinho.itens); // Array<ItemCarrinho>
}

// ==================== EXEMPLO 2: USAR O HOOK useProdutos ====================

import { useProdutos } from './src/hooks/useProdutos';

export function ExemploProdutos() {
  const { 
    produtosFiltrados, 
    categorias, 
    filtros, 
    setFiltros, 
    carregando,
    erro 
  } = useProdutos();

  // Filtrar por busca
  const handleBusca = (termo: string) => {
    setFiltros(prev => ({
      ...prev,
      termo // 'Duplo'
    }));
  };

  // Filtrar por categoria
  const handleFiltrar = (categoria: string) => {
    setFiltros(prev => ({
      ...prev,
      categoria: categoria === 'Todos' ? undefined : categoria
    }));
  };

  // Ordenar por preço
  const handleOrdenar = () => {
    setFiltros(prev => ({
      ...prev,
      ordenacao: 'preco'
    }));
  };

  // Dados disponíveis
  console.log('Produtos filtrados:', produtosFiltrados);
  console.log('Categorias:', categorias); // ['Todos', 'Bebidas', 'Combos', ...]
  console.log('Carregando:', carregando); // boolean
  console.log('Erro:', erro); // null | string
}

// ==================== EXEMPLO 3: USAR O SERVIÇO PedidoService ====================

import { PedidoService } from './src/services/PedidoService';

export async function ExemplosServico() {
  try {
    // Buscar produtos
    const produtos = await PedidoService.fetchProdutos();
    console.log('Produtos:', produtos);

    // Criar um pedido
    const pedido = await PedidoService.criarPedido({
      items: [
        {
          produtoId: '1',
          quantidade: 2,
          observacoes: 'Sem cebola'
        },
        {
          produtoId: '3',
          quantidade: 1
        }
      ],
      observacoesGerais: 'Entregar rápido!'
    });

    console.log('Pedido criado:', pedido);
    // Resposta:
    // {
    //   id: '12345',
    //   items: [...],
    //   total: 57.80,
    //   status: 'pendente',
    //   dataPedido: '2025-05-21T10:30:00Z'
    // }

    // Buscar pedido por ID
    const pedidoInfo = await PedidoService.buscarPedido(pedido.id);
    console.log('Status do pedido:', pedidoInfo.status);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// ==================== EXEMPLO 4: USAR COMPONENTES ====================

import { ProdutoCard } from './src/components/ProdutoCard';
import { Header } from './src/components/Header';
import { SearchBar } from './src/components/SearchBar';
import { CategoryFilter } from './src/components/CategoryFilter';
import { CarrinhoModal } from './src/components/CarrinhoModal';
import { SucessoPedidoModal } from './src/components/SucessoPedidoModal';
import { LoadingModal } from './src/components/LoadingModal';

// Header
export function ExemploHeader() {
  return (
    <Header 
      titulo="CHAPA QUENTE"
      quantidadeCarrinho={5}
      onCarrinhoPress={() => console.log('Abrir carrinho')}
    />
  );
}

// SearchBar
export function ExemploSearchBar() {
  const [busca, setBusca] = React.useState('');

  return (
    <SearchBar 
      value={busca}
      onChangeText={setBusca}
      onClear={() => setBusca('')}
      placeholder="Buscar produtos..."
    />
  );
}

// CategoryFilter
export function ExemploCategoryFilter() {
  return (
    <CategoryFilter 
      categorias={['Todos', 'Lanches', 'Bebidas', 'Sobremesas']}
      ativa="Lanches"
      onSelect={(cat) => console.log('Categoria selecionada:', cat)}
    />
  );
}

// ProdutoCard
export function ExemploProdutoCard() {
  const produto: Produto = {
    id: '1',
    nome: 'Duplo Smash',
    descricao: 'Delicioso com bacon',
    preco: 28.90,
    categoria: 'Lanches',
    imageUrl: 'https://...',
    disponivel: true,
    ativo: true,
  };

  return (
    <ProdutoCard 
      produto={produto}
      onAdicionarAoCarrinho={(p) => console.log('Adicionar:', p.nome)}
    />
  );
}

// CarrinhoModal
export function ExemploCarrinhoModal() {
  const [visivel, setVisivel] = React.useState(false);

  return (
    <CarrinhoModal 
      visivel={visivel}
      itens={[]} // Array de ItemCarrinho
      total={0}
      onFechar={() => setVisivel(false)}
      onRemoverItem={(id) => console.log('Remover:', id)}
      onAtualizarQuantidade={(id, qtd) => console.log('Atualizar:', id, qtd)}
      onConfirmarPedido={(obs) => console.log('Confirmar com obs:', obs)}
      carregando={false}
    />
  );
}

// SucessoPedidoModal
export function ExemploSucessoModal() {
  const [visivel, setVisivel] = React.useState(false);

  return (
    <SucessoPedidoModal 
      visivel={visivel}
      numeroPedido="PED-12345"
      onFechar={() => setVisivel(false)}
    />
  );
}

// LoadingModal
export function ExemploLoadingModal() {
  return (
    <LoadingModal 
      visivel={true}
      mensagem="Confirmando pedido..."
    />
  );
}

// ==================== EXEMPLO 5: USAR UTILITÁRIOS ====================

import { formatarMoeda, formatarData, truncarTexto } from './src/utils/formatting';

export function ExemploUtilitarios() {
  // Formatar moeda
  console.log(formatarMoeda(28.90)); // R$ 28,90

  // Formatar data
  console.log(formatarData(new Date())); // 21/05/2025 10:30

  // Truncar texto
  console.log(truncarTexto('Um texto muito longo', 10)); // Um texto ...
}

// ==================== EXEMPLO 6: USAR CONSTANTES DE TEMA ====================

import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from './src/constants/theme';
import { View, Text, StyleSheet } from 'react-native';

export function ExemploTema() {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.background,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
    },
    titulo: {
      color: COLORS.primary,
      fontSize: TYPOGRAPHY.lg,
      fontWeight: '700',
    },
    texto: {
      color: COLORS.textSecondary,
      fontSize: TYPOGRAPHY.sm,
      marginTop: SPACING.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Título</Text>
      <Text style={styles.texto}>Descrição</Text>
    </View>
  );
}

/**
 * FLUXO COMPLETO DO APP
 * 
 * 1. Usuário abre a aplicação
 * 2. App.tsx carrega produtos via useProdutos()
 * 3. Usuário vê grid de produtos com ProdutoCard
 * 4. Usuário busca/filtra usando SearchBar e CategoryFilter
 * 5. Usuário clica em "+" para adicionar ao carrinho (via useCarrinho)
 * 6. Usuário abre modal do carrinho (CarrinhoModal)
 * 7. Usuário ajusta quantidades e adiciona observações
 * 8. Usuário confirma pedido (chama PedidoService.criarPedido)
 * 9. Modal de sucesso aparece (SucessoPedidoModal)
 * 10. Carrinho é limpado e usuário volta à listagem
 */

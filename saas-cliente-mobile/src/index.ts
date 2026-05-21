// Exportar tipos
export * from './types/index';

// Exportar serviços
export { PedidoService } from './services/PedidoService';
export { api } from './services/api';

// Exportar hooks
export { useCarrinho } from './hooks/useCarrinho';
export { useProdutos } from './hooks/useProdutos';

// Exportar componentes
export { ProdutoCard } from './components/ProdutoCard';
export { CarrinhoItem } from './components/CarrinhoItem';
export { CarrinhoModal } from './components/CarrinhoModal';
export { SucessoPedidoModal } from './components/SucessoPedidoModal';
export { LoadingModal } from './components/LoadingModal';
export { Header } from './components/Header';
export { SearchBar } from './components/SearchBar';
export { CategoryFilter } from './components/CategoryFilter';

// Exportar utilitários
export { formatarMoeda, formatarData, truncarTexto } from './utils/formatting';

// Exportar constantes
export { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from './constants/theme';

# Saas Cardápio - App Mobile

Aplicação mobile para seleção de lanches e pedidos desenvolvida com React Native + Expo.

## 🚀 Características

- ✅ **Listagem de Produtos** com grid responsivo
- ✅ **Sistema de Busca** com filtro em tempo real
- ✅ **Categorias** para organizar produtos
- ✅ **Carrinho Funcional** com gerenciamento de quantidade
- ✅ **Observações** personalizadas por item
- ✅ **Confirmação de Pedidos** com modal de sucesso
- ✅ **Design Moderno** com tema profissional
- ✅ **Integração com API** backend

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── hooks/            # Custom hooks
├── services/         # Serviços de API e lógica
├── screens/          # Telas (pronto para expansão)
├── types/            # Tipos TypeScript
├── utils/            # Funções utilitárias
└── constants/        # Constantes (temas, cores, etc)
```

## 🎨 Componentes Principais

### **ProdutoCard**
Exibe um produto individual com imagem, preço e botão de adicionar.

```tsx
<ProdutoCard 
  produto={produto} 
  onAdicionarAoCarrinho={handleAdicionar}
/>
```

### **Header**
Barra de cabeçalho com título e badge do carrinho.

```tsx
<Header 
  titulo="CHAPA QUENTE" 
  quantidadeCarrinho={5}
  onCarrinhoPress={handleCarrinho}
/>
```

### **SearchBar**
Barra de busca com filtro em tempo real.

```tsx
<SearchBar 
  value={busca} 
  onChangeText={handleBusca}
/>
```

### **CarrinhoModal**
Modal completo do carrinho com lista de itens, observações e confirmação.

```tsx
<CarrinhoModal 
  visivel={carrinhoVisivel}
  itens={itens}
  total={total}
  onConfirmarPedido={handleConfirmar}
/>
```

## 🔧 Hooks Customizados

### **useCarrinho**
Gerencia estado do carrinho.

```tsx
const {
  itens,
  adicionarItem,
  removerItem,
  atualizarQuantidade,
  total,
  quantidadeTotalItens
} = useCarrinho();
```

### **useProdutos**
Gerencia produtos, filtros e busca.

```tsx
const {
  produtos,
  produtosFiltrados,
  categorias,
  carregando,
  filtros,
  setFiltros
} = useProdutos();
```

## 🌐 Integração com API

O serviço `PedidoService` se conecta com a API backend:

```tsx
// Buscar produtos
const produtos = await PedidoService.fetchProdutos();

// Criar pedido
const resposta = await PedidoService.criarPedido({
  items: [...],
  observacoesGerais: "Sem cebola"
});
```

### Configuração da API

Configure a URL da API via variável de ambiente:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

## 🎯 Como Usar

### 1. Instalação

```bash
cd saas-cliente-mobile
npm install
```

### 2. Iniciar o App

```bash
npm start
# iOS: press 'i'
# Android: press 'a'
# Web: press 'w'
```

### 3. Desenvolver

- Todos os componentes estão em `src/components/`
- Hooks customizados em `src/hooks/`
- Serviços em `src/services/`
- Tipos em `src/types/`

## 🎨 Tema e Cores

O projeto usa um sistema de tema centralizado em `src/constants/theme.ts`:

```tsx
import { COLORS, SPACING, TYPOGRAPHY } from './src/constants/theme';

// Usar cores
<View style={{ backgroundColor: COLORS.primary }} />

// Usar espaçamentos
<View style={{ padding: SPACING.md }} />

// Usar tipografia
<Text style={{ fontSize: TYPOGRAPHY.lg }} />
```

### Paleta de Cores

- **Primary:** `#FF6B1D` (laranja vibrante)
- **Background:** `#F5F5F5` (cinza claro)
- **Surface:** `#FFFFFF` (branco)
- **Text:** `#1A1A1A` (preto)
- **Error:** `#FF6B6B` (vermelho)

## 📱 Responsividade

O aplicativo é totalmente responsivo:

```tsx
const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / NUM_COLUMNS;
```

## 🚢 Build para Produção

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

## 📝 Notas do Desenvolvedor

- ✅ TypeScript para type safety
- ✅ Componentes funcionais com Hooks
- ✅ Gerenciamento de estado otimizado
- ✅ Tratamento de erros robusto
- ✅ Fallback com dados locais (modo desenvolvimento)
- ✅ Performance otimizada com `useCallback` e `useMemo`

## 🔜 Próximas Melhorias

- [ ] Autenticação de usuário
- [ ] Histórico de pedidos
- [ ] Favoritos
- [ ] Filtros avançados
- [ ] Chat de suporte
- [ ] Push notifications

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.

# 📑 ÍNDICE RÁPIDO - SAAS CARDÁPIO MOBILE

## 📂 Arquivos Importantes

### Documentação
- **[MUDANCAS.md](./MUDANCAS.md)** - Resumo das melhorias implementadas
- **[README-DEV.md](./README-DEV.md)** - Guia do desenvolvedor
- **[EXEMPLOS.md](./EXEMPLOS.md)** - Exemplos de uso de componentes e hooks
- **[INTEGRACAO-BACKEND.md](./INTEGRACAO-BACKEND.md)** - Integração com API backend
- **[BEST-PRACTICES.md](./BEST-PRACTICES.md)** - Guia de boas práticas

### Configuração
- **[.env.example](./.env.example)** - Variáveis de ambiente
- **[package.json](./package.json)** - Dependências do projeto
- **[tsconfig.json](./tsconfig.json)** - Configuração TypeScript
- **[app.json](./app.json)** - Configuração do Expo

### Código
- **[App.tsx](./App.tsx)** - Aplicação principal
- **[index.ts](./index.ts)** - Entry point

---

## 🗂️ Estrutura de Pastas

```
src/
├── components/              # Componentes reutilizáveis
│   ├── ProdutoCard.tsx      # Card do produto
│   ├── Header.tsx           # Cabeçalho com carrinho
│   ├── SearchBar.tsx        # Busca com filtro
│   ├── CategoryFilter.tsx    # Filtro de categorias
│   ├── CarrinhoItem.tsx      # Item do carrinho
│   ├── CarrinhoModal.tsx     # Modal do carrinho
│   ├── SucessoPedidoModal.tsx # Modal de sucesso
│   └── LoadingModal.tsx      # Modal de carregamento
│
├── hooks/                   # Hooks customizados
│   ├── useCarrinho.ts       # Gerencia carrinho
│   └── useProdutos.ts       # Gerencia produtos e filtros
│
├── services/                # Serviços de API
│   ├── api.ts               # Cliente HTTP genérico
│   └── PedidoService.ts     # Serviço de pedidos
│
├── types/                   # Tipos TypeScript
│   └── index.ts             # Definição de tipos
│
├── utils/                   # Funções utilitárias
│   └── formatting.ts        # Formatação de dados
│
├── constants/               # Constantes do app
│   └── theme.ts             # Cores, espaçamentos, tipografia
│
└── index.ts                 # Exports principais
```

---

## 🚀 Quickstart

### 1. Instalar
```bash
cd saas-cliente-mobile
npm install
```

### 2. Configurar (opcional)
```bash
cp .env.example .env
# Editar EXPO_PUBLIC_API_URL se necessário
```

### 3. Rodar
```bash
npm start
# Escanear QR code ou apertar 'i' para iOS ou 'a' para Android
```

---

## 🎯 Componentes por Uso

### Para Exibir Produtos
```tsx
import { ProdutoCard } from './src/components/ProdutoCard';
```

### Para Gerenciar Carrinho
```tsx
import { useCarrinho } from './src/hooks/useCarrinho';
import { CarrinhoModal } from './src/components/CarrinhoModal';
```

### Para Buscar e Filtrar
```tsx
import { useProdutos } from './src/hooks/useProdutos';
import { SearchBar } from './src/components/SearchBar';
import { CategoryFilter } from './src/components/CategoryFilter';
```

### Para Criar/Enviar Pedidos
```tsx
import { PedidoService } from './src/services/PedidoService';
```

---

## 🎨 Cores Disponíveis

```tsx
import { COLORS } from './src/constants/theme';

COLORS.primary      // #FF6B1D - Laranja vibrante
COLORS.secondary    // #FFB800 - Amarelo
COLORS.background   // #F5F5F5 - Cinza claro
COLORS.surface      // #FFFFFF - Branco
COLORS.text         // #1A1A1A - Preto
COLORS.textSecondary// #666666 - Cinza médio
COLORS.error        // #FF6B6B - Vermelho
COLORS.success      // #4CAF50 - Verde
COLORS.info         // #2196F3 - Azul
```

---

## 📏 Espaçamentos Disponíveis

```tsx
import { SPACING } from './src/constants/theme';

SPACING.xs   // 4px
SPACING.sm   // 8px
SPACING.md   // 16px
SPACING.lg   // 24px
SPACING.xl   // 32px
SPACING.xxl  // 48px
```

---

## 🔤 Tamanhos de Fonte

```tsx
import { TYPOGRAPHY } from './src/constants/theme';

TYPOGRAPHY.xs    // 12px - Texto muito pequeno
TYPOGRAPHY.sm    // 14px - Texto pequeno
TYPOGRAPHY.md    // 16px - Texto padrão
TYPOGRAPHY.lg    // 18px - Subtitle
TYPOGRAPHY.xl    // 20px - Título
TYPOGRAPHY.xxl   // 24px - Título grande
TYPOGRAPHY.xxxl  // 32px - Título extra grande
```

---

## 🔗 Fluxo de Dados

```
App.tsx (main)
    ↓
    ├→ useCarrinho()      [Gerencia carrinho]
    ├→ useProdutos()      [Gerencia produtos]
    └→ PedidoService      [API]
        ↓
        ├→ api.get()      [Buscar produtos]
        ├→ api.post()     [Criar pedido]
        └→ api.get()      [Buscar pedido]

Componentes:
    ├→ Header            [Exibe título + carrinho]
    ├→ SearchBar         [Busca]
    ├→ CategoryFilter    [Filtro]
    ├→ ProdutoCard       [Exibe 1 produto]
    ├→ CarrinhoModal     [Gerencia carrinho]
    ├→ SucessoPedidoModal [Sucesso]
    └→ LoadingModal      [Carregamento]
```

---

## 📱 Tipos Principais

```tsx
// Produto disponível para venda
interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imageUrl?: string;
  disponivel: boolean;
  ativo: boolean;
}

// Item dentro do carrinho
interface ItemCarrinho {
  id: string;
  produto: Produto;
  quantidade: number;
  observacoes?: string;
  subtotal: number;
}

// Pedido criado
interface Pedido {
  id?: string;
  items: ItemCarrinho[];
  total: number;
  status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue';
  dataPedido?: string;
  observacoesGerais?: string;
}
```

---

## 🧪 Testar Localmente

### 1. Testar sem API (dados locais)
```tsx
// PedidoService usa dados locais automaticamente se API não responder
// Perfeito para desenvolvimento offline
```

### 2. Testar com API local
```bash
# Backend rodando em http://localhost:8080/api
EXPO_PUBLIC_API_URL=http://localhost:8080/api npm start
```

### 3. Testar em múltiplos dispositivos
```bash
npm start
# Escanear QR com diferentes devices
```

---

## 🔍 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| App não carrega | `npm cache clean --force && npm install` |
| Produtos não aparecem | Verificar API URL em `.env` |
| Pedido não confirma | Testar endpoint POST em Postman |
| Layout quebrado | Testar em diferentes tamanhos de tela |
| TypeScript erros | Rodar `npm run tsc --noEmit` |

---

## 📞 Comandos Úteis

```bash
# Iniciar app
npm start

# Iniciar para iOS
npm run ios

# Iniciar para Android
npm run android

# Iniciar para Web
npm run web

# Limpar cache
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules && npm install

# Verificar TypeScript
npx tsc --noEmit
```

---

## 🚀 Próximas Etapas

1. **Ler** [MUDANCAS.md](./MUDANCAS.md) para entender as melhorias
2. **Seguir** [INTEGRACAO-BACKEND.md](./INTEGRACAO-BACKEND.md) para conectar API
3. **Consultar** [EXEMPLOS.md](./EXEMPLOS.md) para usar componentes
4. **Respeitar** [BEST-PRACTICES.md](./BEST-PRACTICES.md) ao desenvolver

---

## 📚 Links Úteis

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Ionicons](https://ionicons.com)

---

## 💬 Dúvidas?

Consulte a documentação específica:
- **Como usar um componente?** → [EXEMPLOS.md](./EXEMPLOS.md)
- **Como conectar API?** → [INTEGRACAO-BACKEND.md](./INTEGRACAO-BACKEND.md)
- **Como desenvolver?** → [README-DEV.md](./README-DEV.md)
- **Melhores práticas?** → [BEST-PRACTICES.md](./BEST-PRACTICES.md)
- **Mudanças realizadas?** → [MUDANCAS.md](./MUDANCAS.md)

---

**Última atualização:** Maio 2025  
**Versão:** 2.0.0  
**Status:** ✅ Pronto para Produção

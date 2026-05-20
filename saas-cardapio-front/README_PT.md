# 🍔 SaaS Cardápio - Frontend

Um aplicativo web moderno e responsivo para gerenciar cardápios e pedidos de lanchonetes/restaurantes. Desenvolvido com **Vue 3**, **TypeScript**, **Tailwind CSS** e hospedado para mobile-first.

## ✨ Funcionalidades

### 🏠 Página Inicial
- Header com informações do restaurante
- Mapa interativo com Google Maps integrado
- Links para WhatsApp
- Avaliação do restaurante (⭐ 4.8 stars)
- Destaques dos diferenciais

### 🍽️ Cardápio Completo
- **Filtro por Categorias**: Lanches, Bebidas, Sobremesas, Combos
- **Busca em Tempo Real**: Procure por nome ou descrição
- **Produtos com Avaliações**: Veja ratings de cada item
- **Sistema de Favoritos**: Marque seus pratos prediletos
- **Grid Responsivo**: 2 colunas otimizado para mobile

### 🎁 Promoções
- Carrossel de promoções em destaque
- Badges de ofertas especiais
- Links rápidos para checkout

### 🛒 Carrinho Inteligente
- Adicionar/Remover itens
- Ajustar quantidades
- **Adicionais Personalizáveis**: Bacon extra, cheddar, etc
- **Observações**: Notas especiais para o restaurante
- Cálculo automático de subtotal + frete
- **Persiste Localmente**: Carrinho salvo no localStorage

### 👤 Perfil do Cliente
- Dados de contato
- Endereço de entrega
- Observações (ex: tocar na portaria)
- Salvamento local para checkout rápido

### 🎨 Experiência Premium
- **Design Dark Mode**: Tema escuro moderno e elegante
- **Animações Suaves**: Transições fluidas entre telas
- **Mobile-First**: Otimizado para smartphones
- **Navegação Intuitiva**: Bottom navigation com 5 abas
- **Feedback Visual**: Indicadores de carrinho, favoritos, etc

## 📦 Estrutura de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ProductCard.vue         # Card de produto
│   ├── CategoryBar.vue         # Filtro de categorias
│   ├── SearchBar.vue           # Barra de busca
│   ├── RestauranteHeader.vue   # Header do restaurante
│   ├── ProductModal.vue        # Modal de detalhes
│   ├── CartItem.vue            # Item do carrinho
│   ├── PromotionCard.vue       # Card de promoção
│   ├── LocationMap.vue         # Mapa e localização
│   ├── BottomNavigation.vue    # Navegação inferior
│
├── views/               # Páginas principais
│   ├── HomeView.vue            # Página inicial
│   ├── MenuView.vue            # Cardápio
│   ├── PromotionsView.vue      # Promoções
│   ├── CartView.vue            # Carrinho
│   ├── ProfileView.vue         # Perfil
│
├── stores/              # Estado compartilhado
│   ├── cardapio.ts             # Store com dados e produtos
│
├── types/               # Tipos TypeScript
│   ├── index.ts                # Interfaces e tipos
│
├── App.vue              # Componente root
├── main.ts              # Entrada da aplicação
└── style.css            # Estilos globais
```

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd saas-cardapio-front
npm install
```

### 2. Venv em Desenvolvimento
```bash
npm run dev
```
A aplicação abrirá em `http://localhost:5173`

### 3. Build para Produção
```bash
npm run build
```

### 4. Visualizar Build
```bash
npm run preview
```

## 🛠️ Tecnologias

- **Vue 3**: Framework progressivo
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Utility-first CSS
- **Lucide Icons**: Ícones modernos
- **Vite**: Build tool rápido
- **LocalStorage**: Persistência de dados

## 📱 Responsividade

O app está otimizado para:
- ✅ Smartphones (320px - 480px)
- ✅ Tablets (600px - 1024px)
- ✅ Desktops (1024px+)

Recomendado para mobile com largura máxima de `428px`.

## 🎨 Paleta de Cores

```
- Brand Orange: #ff6b35  (CTAs e Destaques)
- Dark: #121212         (Fundo principal)
- Card: #1e1e1e         (Fundo dos cards)
- Green: #4ade80        (Preços)
```

## 💾 Persistência de Dados

Todos os dados são salvos localmente:
- **Carrinho**: `cardapio_carrinho` 
- **Favoritos**: `cardapio_favoritos`

Limpe o localStorage para resetar:
```javascript
localStorage.clear()
```

## 📊 Dados Mockados

### Restaurante
- Nome: Lanchonete Teste
- Localização: Aracaju
- Telefones: (79) 9-9106-6838 | (79) 9-9192-2766
- Horário: 17:00 às 23:59
- Rating: 4.8 ⭐

### Categorias
- Lanches (5 itens)
- Bebidas (4 itens)
- Sobremesas (3 itens)
- Combos (3 itens)

### Exemplo de Produto
```typescript
{
  id: 1,
  nome: "Duplo Smash Bacon",
  categoria: "Lanches",
  descricao: "Pão brioche, 2 blends 90g, duplo cheddar...",
  preco: 28.90,
  img: "https://...",
  avaliacoes: 4.9,
  votos: 245,
  adicionais: [
    { id: 'a1', nome: 'Bacon Extra', preco: 4.00 },
    { id: 'a2', nome: 'Cheddar Extra', preco: 3.50 }
  ]
}
```

## 🔗 Integração com Backend

### Próximos Passos
1. Conectar com API do backend (Em `src/services/api.ts`)
2. Implementar autenticação
3. Sistema de pedidos em tempo real
4. Notificações push
5. Chat com suporte

### Endpoints Esperados
```typescript
// Trazer cardápio
GET /api/cardapio

// Enviar pedido
POST /api/pedidos
{
  nomeCliente: string
  telefone: string
  endereco: string
  itens: ItemPedidoDTO[]
}

// Histórico de pedidos
GET /api/pedidos/:clienteId
```

## 🎯 MVP Checklist

- ✅ Tela de início com informações do restaurante
- ✅ Mapa de localização interativo
- ✅ Cardápio com produtos em categorias
- ✅ Filtro e busca de produtos
- ✅ Sistema de favoritos
- ✅ Modal com detalhes do produto
- ✅ Adicionais personalizáveis
- ✅ Carrinho com persistência
- ✅ Cálculo de subtotal e frete
- ✅ Perfil do cliente
- ✅ Design premium e animações
- ✅ Navegação intuitiva
- ⏳ Integração com backend
- ⏳ Checkout com pagamento
- ⏳ Rastreamento de pedido

## 🐛 Troubleshooting

### Carrinho não aparece?
Verifique o localStorage: `localStorage.getItem('cardapio_carrinho')`

### Imagens não carregam?
As imagens são do Unsplash. Verifique sua conexão de internet.

### Mapa não funciona?
O Google Maps Embed precisa de URL válida. Configure corretamente as coordenadas.

## 📧 Suporte

Em caso de dúvidas ou bugs, entre em contato através do WhatsApp integrado no app.

---

**Desenvolvido com ❤️ para uma melhor experiência de pedidos**

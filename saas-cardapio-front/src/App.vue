<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { 
  Home, 
  Utensils, 
  Star, 
  ShoppingBag, 
  User, 
  ChevronRight,
  Search,
  Plus,
  X,
  Minus
} from 'lucide-vue-next';

interface Adicional {
  id: string;
  nome: string;
  preco: number;
}

interface Produto {
  id: number;
  categoria: string;
  nome: string;
  descricao: string;
  preco: number;
  img: string;
  adicionais?: Adicional[];
}

interface CarrinhoItem {
  id: number;
  produto: Produto;
  quantidade: number;
  adicionais: Adicional[];
  observacao: string;
}

interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  destaque: string;
  imagem: string;
  badge: string;
}

// Navegação Inferior
const tabAtiva = ref('cardapio'); // Deixei padrão no cardápio para facilitar seu teste

// Dados do Restaurante
const restaurante = {
  nome: 'Chapa Quente',
  telefone1: '(79) 9-9106-6838',
  telefone2: '(79) 9-9192-2766',
  cidade: 'Aracaju',
  tempoEntrega: '30 Min',
  tempoRetirada: '15 Min',
  minimoEntrega: 'R$ 8,00',
  horario: '17:00 às 23:59'
};

// ==========================================
// CARDÁPIO E BUSCA
// ==========================================
const searchQuery = ref('');
const categoriaCardapioAtiva = ref('Todos');

const categoriasMenu = [
  { id: 'Todos', nome: 'Todos' },
  { id: 'Lanches', nome: 'Lanches🍔' },
  { id: 'Bebidas', nome: 'Bebidas🥤' },
  { id: 'Combos', nome: 'Combos🔥' }
];

const produtosMenu: Produto[] = [
  { 
    id: 1, categoria: 'Lanches', nome: 'Duplo Smash Bacon', descricao: 'Pão brioche, 2 blends 90g, duplo cheddar, muito bacon artesanal.', preco: 28.90, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    adicionais: [{ id: 'a1', nome: 'Bacon Extra', preco: 4.00 }, { id: 'a2', nome: 'Cheddar Extra', preco: 3.50 }]
  },
  { 
    id: 2, categoria: 'Lanches', nome: 'Classic Burger', descricao: 'Pão com gergelim, blend 150g, queijo prato, alface, tomate.', preco: 22.50, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
    adicionais: [{ id: 'a1', nome: 'Bacon Extra', preco: 4.00 }, { id: 'a3', nome: 'Ovo Frito', preco: 2.00 }]
  },
  { id: 3, categoria: 'Bebidas', nome: 'Coca-Cola Lata', descricao: '350ml - Trincando de gelada.', preco: 6.00, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
  { id: 4, categoria: 'Combos', nome: 'Combo Casal Feliz', descricao: '2 Classic Burgers + Fritas Média + 2 Refrigerantes em lata.', preco: 59.90, img: 'https://images.unsplash.com/photo-1594212691516-748bc6a98fb3?auto=format&fit=crop&w=300&q=80' },
  { 
    id: 5, categoria: 'Lanches', nome: 'Chicken Crispy', descricao: 'Pão australiano, sobrecoxa empanada, coleslaw e barbecue.', preco: 25.00, img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=300&q=80',
    adicionais: [{ id: 'a4', nome: 'Molho Barbecue Extra', preco: 1.50 }]
  }
];

const promocoes: Promocao[] = [
  {
    id: 'promo-1',
    titulo: 'Combo Família',
    descricao: '3 lanches grandes + 2 refrigerantes por apenas.',
    preco: 'R$ 74,90',
    destaque: '15% OFF',
    imagem: 'https://images.unsplash.com/photo-1559056199-6416bcfeb5c3?auto=format&fit=crop&w=600&q=80',
    badge: 'Mais pedido'
  },
  {
    id: 'promo-2',
    titulo: 'Refrigerante Grátis',
    descricao: 'Ganhe 1 refrigerante 350ml a cada 2 lanches.',
    preco: 'R$ 0,00',
    destaque: 'Oferta limitada',
    imagem: 'https://images.unsplash.com/photo-1610537367955-52c0d3eaca3b?auto=format&fit=crop&w=600&q=80',
    badge: 'Grátis'
  },
  {
    id: 'promo-3',
    titulo: 'Sexta do Combo',
    descricao: 'Combo casal + sobremesa por R$ 69,90.',
    preco: 'R$ 69,90',
    destaque: 'Só hoje',
    imagem: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80',
    badge: 'Temporária'
  }
];

const produtosFiltrados = computed(() => {
  let filtrados = produtosMenu;
  if (categoriaCardapioAtiva.value !== 'Todos') {
    filtrados = filtrados.filter(p => p.categoria === categoriaCardapioAtiva.value);
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtrados = filtrados.filter(p => 
      p.nome.toLowerCase().includes(query) || p.descricao.toLowerCase().includes(query)
    );
  }
  return filtrados;
});

// ==========================================
// PERFIL DO CLIENTE
// ==========================================
const perfil = reactive({
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
  observacoes: ''
});
const perfilSalvo = ref(false);
const pedidoFinalizado = ref(false);

function salvarPerfil() {
  perfilSalvo.value = true;
  setTimeout(() => perfilSalvo.value = false, 2500);
}

// ==========================================
// CARRINHO
// ==========================================
const carrinho = ref<CarrinhoItem[]>([]);
const frete = ref(7.50);

const itensNoCarrinho = computed(() => carrinho.value.reduce((soma, item) => soma + item.quantidade, 0));
const subtotalCarrinho = computed(() => carrinho.value.reduce((soma, item) => {
  const adicionais = item.adicionais.reduce((total, adicional) => total + adicional.preco, 0);
  return soma + (item.produto.preco + adicionais) * item.quantidade;
}, 0));
const totalCarrinho = computed(() => subtotalCarrinho.value + frete.value);

function adicionarAoCarrinho() {
  if (!produtoSelecionado.value) return;

  const adicionais = produtoSelecionado.value.adicionais
    ? produtoSelecionado.value.adicionais.filter((a: Adicional) => adicionaisSelecionados.value.includes(a.id))
    : [];

  carrinho.value.push({
    id: Date.now(),
    produto: produtoSelecionado.value,
    quantidade: quantidadeModal.value,
    adicionais,
    observacao: observacaoModal.value
  });

  pedidoFinalizado.value = false;
  fecharModal();
}

function atualizarQuantidadeItem(itemId: number, delta: number) {
  const item = carrinho.value.find((c) => c.id === itemId);
  if (!item) return;
  if (item.quantidade + delta < 1) return;
  item.quantidade += delta;
}

function removerItemDoCarrinho(itemId: number) {
  carrinho.value = carrinho.value.filter((item) => item.id !== itemId);
}

function finalizarPedido() {
  if (carrinho.value.length === 0) return;
  pedidoFinalizado.value = true;
  carrinho.value = [];
}

// ==========================================
// MODAL DE PRODUTO
// ==========================================
const modalAberto = ref(false);
const produtoSelecionado = ref<Produto | null>(null);
const quantidadeModal = ref(1);
const observacaoModal = ref('');
const adicionaisSelecionados = ref<string[]>([]);

function abrirModalProduto(produto: Produto) {
  produtoSelecionado.value = produto;
  quantidadeModal.value = 1;
  observacaoModal.value = '';
  adicionaisSelecionados.value = [];
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  setTimeout(() => produtoSelecionado.value = null, 300);
}

function alterarQuantidade(delta: number) {
  if (quantidadeModal.value + delta >= 1) {
    quantidadeModal.value += delta;
  }
}

function toggleAdicional(id: string) {
  const index = adicionaisSelecionados.value.indexOf(id);
  if (index === -1) adicionaisSelecionados.value.push(id);
  else adicionaisSelecionados.value.splice(index, 1);
}

const valorTotalModal = computed(() => {
  if (!produtoSelecionado.value) return 0;
  
  let somaAdicionais = 0;
  if (produtoSelecionado.value.adicionais) {
    somaAdicionais = produtoSelecionado.value.adicionais
      .filter((a: Adicional) => adicionaisSelecionados.value.includes(a.id))
      .reduce((soma: number, a: Adicional) => soma + a.preco, 0);
  }
  
  return (produtoSelecionado.value.preco + somaAdicionais) * quantidadeModal.value;
});

function confirmarAdicao() {
  adicionarAoCarrinho();
}
</script>

<template>
  <div class="h-screen w-full bg-brand-dark text-gray-100 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans shadow-2xl">
    
    <main class="flex-1 overflow-y-auto pb-20 scrollbar-hide">
      
      <template v-if="tabAtiva === 'home'">
        <div class="relative h-72 w-full">
          <img src="https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
          <div class="absolute bottom-6 left-0 right-0 flex flex-col items-center">
             <h1 class="text-4xl font-black text-white tracking-wider drop-shadow-lg italic">
               CHAPA <span class="text-brand-orange">QUENTE</span>
             </h1>
             <p class="text-gray-300 text-sm mt-2">{{ restaurante.cidade }} - Entrega em {{ restaurante.tempoEntrega }}</p>
          </div>
        </div>
        <div class="px-5 space-y-5 -mt-2 relative z-10">
          <button @click="tabAtiva = 'cardapio'" class="w-full bg-brand-orange hover:bg-orange-600 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
            FAÇA SEU PEDIDO NO {{ restaurante.nome.toUpperCase() }} <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </template>

      <template v-else-if="tabAtiva === 'cardapio'">
        <div class="flex flex-col h-full bg-brand-dark relative">
          
          <div class="sticky top-0 z-20 bg-brand-dark/95 backdrop-blur-md pt-6 pb-2 px-4 shadow-sm border-b border-gray-800">
            <h2 class="text-2xl font-black text-white mb-4 tracking-tight">O que vamos pedir?</h2>
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input v-model="searchQuery" type="text" placeholder="Busque por lanches, bebidas..." class="w-full bg-brand-card border border-gray-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-500 text-sm" />
            </div>
          </div>

          <div class="w-full overflow-x-auto scrollbar-hide">
            <div class="flex items-center gap-3 px-4 py-4 w-max">
              <button
                v-for="cat in categoriasMenu" :key="cat.id"
                @click="categoriaCardapioAtiva = cat.id"
                :class="['shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all', 
                  categoriaCardapioAtiva === cat.id 
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/40' 
                  : 'bg-brand-card text-gray-400 border border-gray-800 hover:text-gray-200']"
              >
                {{ cat.nome }}
              </button>
            </div>
          </div>

          <div class="px-4 pb-6 space-y-4">
            <div v-if="produtosFiltrados.length === 0" class="text-center text-gray-500 mt-10">Nenhum produto encontrado. 😢</div>

            <div v-for="produto in produtosFiltrados" :key="produto.id" class="bg-brand-card p-3 rounded-2xl flex gap-4 border border-gray-800/60 relative overflow-hidden group">
              <div class="w-28 h-28 shrink-0 relative">
                <img :src="produto.img" class="w-full h-full object-cover rounded-xl" />
              </div>
              <div class="flex-1 flex flex-col justify-between py-1 pr-1">
                <div>
                  <h3 class="text-white font-bold text-base leading-tight">{{ produto.nome }}</h3>
                  <p class="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{{ produto.descricao }}</p>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-green-400 font-bold text-base">R$ {{ produto.preco.toFixed(2).replace('.', ',') }}</span>
                  <button @click="abrirModalProduto(produto)" class="bg-brand-orange text-white p-2 rounded-xl transition-transform active:scale-90 shadow-sm">
                    <Plus class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="tabAtiva === 'promocoes'">
        <div class="px-4 pb-6 space-y-5">
          <div class="pt-6 pb-3">
            <h2 class="text-2xl font-black text-white tracking-tight">Promoções</h2>
            <p class="text-gray-400 text-sm mt-1">Aproveite as ofertas especiais e monte seu pedido com desconto.</p>
          </div>

          <div class="space-y-4">
            <div v-for="promo in promocoes" :key="promo.id" class="bg-brand-card overflow-hidden rounded-3xl border border-gray-800 shadow-lg shadow-black/20">
              <div class="relative h-48 w-full">
                <img :src="promo.imagem" class="w-full h-full object-cover" />
                <div class="absolute top-4 left-4 bg-brand-orange text-black px-3 py-1 rounded-full text-[11px] font-bold uppercase">{{ promo.badge }}</div>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-white text-xl font-black">{{ promo.titulo }}</h3>
                    <p class="text-gray-400 text-sm mt-2">{{ promo.descricao }}</p>
                  </div>
                  <span class="text-green-400 font-black text-lg">{{ promo.preco }}</span>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-gray-500 text-xs uppercase tracking-widest">{{ promo.destaque }}</span>
                  <button @click="tabAtiva = 'cardapio'" class="bg-brand-orange text-black px-4 py-2 rounded-2xl text-sm font-bold hover:bg-orange-500 transition">Ver cardápio</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="tabAtiva === 'carrinho'">
        <div class="px-4 pb-6 space-y-5">
          <div class="pt-6 pb-3">
            <h2 class="text-2xl font-black text-white tracking-tight">Seu Carrinho</h2>
            <p class="text-gray-400 text-sm mt-1">Revise itens, ajuste quantidades e finalize seu pedido.</p>
          </div>

          <div v-if="carrinho.length === 0" class="rounded-3xl border border-dashed border-gray-700 p-6 text-center bg-brand-dark/50">
            <p class="text-gray-400 mb-4">Seu carrinho está vazio.</p>
            <button @click="tabAtiva = 'cardapio'" class="bg-brand-orange text-black px-5 py-3 rounded-2xl font-bold">Ir para o cardápio</button>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in carrinho" :key="item.id" class="bg-brand-card rounded-3xl p-4 border border-gray-800">
              <div class="flex gap-4">
                <img :src="item.produto.img" class="w-24 h-24 rounded-3xl object-cover" />
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-white font-bold">{{ item.produto.nome }}</h3>
                      <p class="text-gray-400 text-xs mt-1">{{ item.produto.descricao }}</p>
                    </div>
                    <button @click="removerItemDoCarrinho(item.id)" class="text-red-500 text-sm font-bold">Remover</button>
                  </div>
                  <div class="flex items-center justify-between mt-4 gap-3">
                    <div class="flex items-center gap-2 bg-brand-dark border border-gray-800 rounded-full px-2 py-1">
                      <button @click="atualizarQuantidadeItem(item.id, -1)" class="text-brand-orange px-3 py-2 rounded-full">-</button>
                      <span class="text-white font-bold px-2">{{ item.quantidade }}</span>
                      <button @click="atualizarQuantidadeItem(item.id, 1)" class="text-brand-orange px-3 py-2 rounded-full">+</button>
                    </div>
                    <span class="text-green-400 font-bold">R$ {{ ((item.produto.preco + item.adicionais.reduce((s, a) => s + a.preco, 0)) * item.quantidade).toFixed(2).replace('.', ',') }}</span>
                  </div>
                  <div v-if="item.adicionais.length" class="mt-3 text-gray-400 text-xs">
                    Adicionais: {{ item.adicionais.map(a => a.nome).join(', ') }}
                  </div>
                  <div v-if="item.observacao" class="mt-2 text-gray-500 text-xs">Obs: {{ item.observacao }}</div>
                </div>
              </div>
            </div>

            <div class="bg-brand-dark rounded-3xl border border-gray-800 p-5 space-y-4">
              <div class="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>R$ {{ subtotalCarrinho.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-gray-400 text-sm">
                <span>Entrega</span>
                <span>R$ {{ frete.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>R$ {{ totalCarrinho.toFixed(2).replace('.', ',') }}</span>
              </div>
              <button @click="finalizarPedido" class="w-full bg-brand-orange text-black rounded-2xl py-3 font-bold hover:bg-orange-500 transition">Finalizar Pedido</button>
              <div v-if="pedidoFinalizado" class="rounded-2xl bg-emerald-500/10 border border-emerald-500 p-3 text-emerald-200 text-sm">Pedido finalizado com sucesso! Obrigado :)</div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="tabAtiva === 'perfil'">
        <div class="px-4 pb-6 space-y-5">
          <div class="pt-6 pb-3">
            <h2 class="text-2xl font-black text-white tracking-tight">Meu Perfil</h2>
            <p class="text-gray-400 text-sm mt-1">Dados de contato e entrega. Isso ajuda no checkout rápido.</p>
          </div>

          <form @submit.prevent="salvarPerfil" class="space-y-4">
            <div class="grid gap-4">
              <label class="block text-gray-300 text-sm font-medium">Nome</label>
              <input v-model="perfil.nome" type="text" placeholder="Seu nome" class="w-full bg-brand-card border border-gray-800 rounded-3xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange" />
            </div>
            <div class="grid gap-4">
              <label class="block text-gray-300 text-sm font-medium">E-mail</label>
              <input v-model="perfil.email" type="email" placeholder="email@exemplo.com" class="w-full bg-brand-card border border-gray-800 rounded-3xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange" />
            </div>
            <div class="grid gap-4">
              <label class="block text-gray-300 text-sm font-medium">Telefone</label>
              <input v-model="perfil.telefone" type="tel" placeholder="(99) 9 9999-9999" class="w-full bg-brand-card border border-gray-800 rounded-3xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange" />
            </div>
            <div class="grid gap-4">
              <label class="block text-gray-300 text-sm font-medium">Endereço</label>
              <input v-model="perfil.endereco" type="text" placeholder="Rua, número, bairro" class="w-full bg-brand-card border border-gray-800 rounded-3xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange" />
            </div>
            <div class="grid gap-4">
              <label class="block text-gray-300 text-sm font-medium">Observações</label>
              <textarea v-model="perfil.observacoes" rows="4" placeholder="Ex: tocar na portaria" class="w-full bg-brand-card border border-gray-800 rounded-3xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange resize-none"></textarea>
            </div>

            <button type="submit" class="w-full bg-brand-orange text-black rounded-2xl py-3 font-bold hover:bg-orange-500 transition">Salvar Perfil</button>
            <div v-if="perfilSalvo" class="rounded-2xl bg-emerald-500/10 border border-emerald-500 p-3 text-emerald-200 text-sm">Perfil salvo com sucesso!</div>
          </form>
        </div>
      </template>
    </main>

    <nav class="absolute bottom-0 w-full bg-brand-card border-t border-gray-800 pb-2 pt-2 px-6 z-40">
       <div class="flex justify-between items-center">
        <button @click="tabAtiva = 'home'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'home' ? 'text-brand-orange' : 'text-gray-500']"><Home class="w-6 h-6" /><span class="text-[10px] font-medium">Início</span></button>
        <button @click="tabAtiva = 'cardapio'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'cardapio' ? 'text-brand-orange' : 'text-gray-500']"><Utensils class="w-6 h-6" /><span class="text-[10px] font-medium">Cardápio</span></button>
        <button @click="tabAtiva = 'promocoes'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'promocoes' ? 'text-brand-orange' : 'text-gray-500']"><Star class="w-6 h-6" /><span class="text-[10px] font-medium">Promoções</span></button>
        <button @click="tabAtiva = 'carrinho'" :class="['relative flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'carrinho' ? 'text-brand-orange' : 'text-gray-500']">
          <div class="relative"><ShoppingBag class="w-6 h-6" /><span v-if="itensNoCarrinho > 0" class="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{{ itensNoCarrinho }}</span></div>
          <span class="text-[10px] font-medium">Carrinho</span>
        </button>
        <button @click="tabAtiva = 'perfil'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'perfil' ? 'text-brand-orange' : 'text-gray-500']"><User class="w-6 h-6" /><span class="text-[10px] font-medium">Perfil</span></button>
      </div>
    </nav>

    <transition name="fade">
      <div v-if="modalAberto && produtoSelecionado" class="absolute inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="fecharModal"></div>

        <div class="bg-brand-card w-full max-h-[90vh] rounded-t-3xl relative z-10 flex flex-col shadow-2xl overflow-hidden animate-slide-up border-t border-gray-700/50">
          
          <div class="relative h-56 w-full shrink-0 bg-brand-dark">
            <img :src="produtoSelecionado.img" class="w-full h-full object-cover opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent"></div>
            <button @click="fecharModal" class="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 backdrop-blur-md">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-5 overflow-y-auto scrollbar-hide flex-1 space-y-6">
            <div>
              <h2 class="text-2xl font-black text-white">{{ produtoSelecionado.nome }}</h2>
              <p class="text-gray-400 mt-2 text-sm leading-relaxed">{{ produtoSelecionado.descricao }}</p>
              <div class="text-green-400 font-black text-xl mt-3">R$ {{ produtoSelecionado.preco.toFixed(2).replace('.', ',') }}</div>
            </div>

            <div v-if="produtoSelecionado.adicionais && produtoSelecionado.adicionais.length > 0" class="pt-4 border-t border-gray-800">
              <h3 class="text-white font-bold mb-3">Turbine seu lanche</h3>
              <div class="space-y-3">
                <label v-for="adc in produtoSelecionado.adicionais" :key="adc.id" class="flex items-center justify-between bg-brand-dark p-3 rounded-xl border border-gray-800/50 cursor-pointer transition-colors hover:border-brand-orange/50">
                  <div class="flex items-center gap-3">
                    <div :class="['w-5 h-5 rounded flex items-center justify-center border', adicionaisSelecionados.includes(adc.id) ? 'bg-brand-orange border-brand-orange' : 'border-gray-600']">
                      <div v-if="adicionaisSelecionados.includes(adc.id)" class="w-2.5 h-2.5 bg-white rounded-sm"></div>
                    </div>
                    <span class="text-gray-200 text-sm">{{ adc.nome }}</span>
                  </div>
                  <span class="text-brand-orange font-bold text-sm">+ R$ {{ adc.preco.toFixed(2).replace('.', ',') }}</span>
                  <input type="checkbox" class="hidden" :checked="adicionaisSelecionados.includes(adc.id)" @change="toggleAdicional(adc.id)" />
                </label>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-800">
              <h3 class="text-white font-bold mb-3">Alguma observação?</h3>
              <textarea v-model="observacaoModal" placeholder="Ex: Tirar cebola, maionese à parte..." class="w-full bg-brand-dark border border-gray-800 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-brand-orange resize-none h-20 placeholder-gray-600"></textarea>
            </div>
          </div>

          <div class="p-5 bg-brand-dark border-t border-gray-800 flex items-center gap-4 shrink-0 pb-8">
            <div class="flex items-center justify-between bg-brand-card border border-gray-700 rounded-xl p-1 w-32 shrink-0">
              <button @click="alterarQuantidade(-1)" class="p-2 text-brand-orange hover:bg-gray-800 rounded-lg"><Minus class="w-5 h-5" /></button>
              <span class="text-white font-bold">{{ quantidadeModal }}</span>
              <button @click="alterarQuantidade(1)" class="p-2 text-brand-orange hover:bg-gray-800 rounded-lg"><Plus class="w-5 h-5" /></button>
            </div>
            
            <button @click="confirmarAdicao" class="flex-1 bg-brand-orange hover:bg-orange-600 text-white rounded-xl py-3.5 font-bold flex justify-between px-4 items-center transition-transform active:scale-95 shadow-lg shadow-brand-orange/20">
              <span>Adicionar</span>
              <span>R$ {{ valorTotalModal.toFixed(2).replace('.', ',') }}</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<style>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import HomeView from './views/HomeView.vue';
import MenuView from './views/MenuView.vue';
import PromotionsView from './views/PromotionsView.vue';
import CartView from './views/CartView.vue';
import ProfileView from './views/ProfileView.vue';
import ProductModal from './components/ProductModal.vue';
import BottomNavigation from './components/BottomNavigation.vue';
import { 
  restaurante,
  categoriasMenu,
  produtosMenu,
  promocoes,
  carrinho,
  favoritos,
  salvarCarrinho,
  salvarFavoritos
} from './stores/cardapio';
import type { Produto, Adicional, PerfillCliente, CarrinhoItem } from './types';

// ==========================================
// NAVEGAÇÃO
// ==========================================
const tabAtiva = ref('home');

// ==========================================
// MENU - BUSCA E FILTROS
// ==========================================
const searchQuery = ref('');
const categoriaCardapioAtiva = ref('Todos');

// ==========================================
// PERFIL DO CLIENTE
// ==========================================
const perfil = reactive<PerfillCliente>({
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
  observacoes: ''
});
const perfilSalvo = ref(false);

// ==========================================
// MODAL DE PRODUTO
// ==========================================
const modalAberto = ref(false);
const produtoSelecionado = ref<Produto | null>(null);
const quantidadeModal = ref(1);
const observacaoModal = ref('');
const adicionaisSelecionados = ref<string[]>([]);
const pedidoFinalizado = ref(false);
const frete = ref(7.50);

// ==========================================
// COMPUTED - CARRINHO
// ==========================================
const itensNoCarrinho = computed(() => 
  carrinho.value.reduce((soma: number, item: CarrinhoItem) => soma + item.quantidade, 0)
);

// ==========================================
// FUNÇÕES - MODAL
// ==========================================
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

// ==========================================
// FUNÇÕES - CARRINHO
// ==========================================
function adicionarAoCarrinho() {
  if (!produtoSelecionado.value) return;

  const adicionais = produtoSelecionado.value.adicionais
    ? produtoSelecionado.value.adicionais.filter((a: Adicional) => 
        adicionaisSelecionados.value.includes(a.id)
      )
    : [];

  carrinho.value.push({
    id: Date.now(),
    produto: produtoSelecionado.value,
    quantidade: quantidadeModal.value,
    adicionais,
    observacao: observacaoModal.value
  });

  salvarCarrinho();
  pedidoFinalizado.value = false;
  fecharModal();
}

function atualizarQuantidadeItem(itemId: number, delta: number) {
  const item = carrinho.value.find((c: CarrinhoItem) => c.id === itemId);
  if (!item || item.quantidade + delta < 1) return;
  item.quantidade += delta;
  salvarCarrinho();
}

function removerItemDoCarrinho(itemId: number) {
  carrinho.value = carrinho.value.filter((item: CarrinhoItem) => item.id !== itemId);
  salvarCarrinho();
}

function finalizarPedido() {
  if (carrinho.value.length === 0) return;
  pedidoFinalizado.value = true;
  carrinho.value = [];
  salvarCarrinho();
}

// ==========================================
// FUNÇÕES - FAVORITOS
// ==========================================
function toggleFavorito(produtoId: number) {
  const index = favoritos.value.indexOf(produtoId);
  if (index === -1) {
    favoritos.value.push(produtoId);
  } else {
    favoritos.value.splice(index, 1);
  }
  salvarFavoritos();
}

// ==========================================
// FUNÇÕES - PERFIL
// ==========================================
function salvarPerfil() {
  perfilSalvo.value = true;
  setTimeout(() => perfilSalvo.value = false, 2500);
}

// ==========================================
// WATCHERS
// ==========================================
watch(carrinho, salvarCarrinho, { deep: true });
watch(favoritos, salvarFavoritos, { deep: true });
</script>

<template>
  <div class="h-screen w-full bg-brand-dark text-gray-100 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans shadow-2xl">
    
    <!-- MAIN CONTENT -->
    <main class="flex-1 overflow-hidden pb-20">
      
      <!-- HOME VIEW -->
      <template v-if="tabAtiva === 'home'">
        <HomeView
          :restaurante="restaurante"
          @ir-para-cardapio="tabAtiva = 'cardapio'"
        />
      </template>

      <!-- MENU VIEW -->
      <template v-else-if="tabAtiva === 'cardapio'">
        <MenuView
          :search-query="searchQuery"
          :active-category="categoriaCardapioAtiva"
          :favoritos="favoritos"
          :produtos="produtosMenu"
          :categorias="categoriasMenu"
          @update:search-query="searchQuery = $event"
          @update:active-category="categoriaCardapioAtiva = $event"
          @abrir-produto="abrirModalProduto($event)"
          @toggle-favorito="toggleFavorito($event)"
        />
      </template>

      <!-- PROMOTIONS VIEW -->
      <template v-else-if="tabAtiva === 'promocoes'">
        <PromotionsView
          :promocoes="promocoes"
          @ver-cardapio="tabAtiva = 'cardapio'"
        />
      </template>

      <!-- CART VIEW -->
      <template v-else-if="tabAtiva === 'carrinho'">
        <CartView
          :carrinho="carrinho"
          :frete="frete"
          :pedido-finalizado="pedidoFinalizado"
          @atualizar-quantidade="atualizarQuantidadeItem"
          @remover-item="removerItemDoCarrinho"
          @finalizar-pedido="finalizarPedido"
          @ir-para-cardapio="tabAtiva = 'cardapio'"
        />
      </template>

      <!-- PROFILE VIEW -->
      <template v-else-if="tabAtiva === 'perfil'">
        <ProfileView
          :perfil-data="perfil"
          :perfil-salvo="perfilSalvo"
          @update:perfil-data="Object.assign(perfil, $event)"
          @salvar="salvarPerfil"
        />
      </template>
    </main>

    <!-- PRODUCT MODAL -->
    <ProductModal
      :produto="produtoSelecionado"
      :quantidade="quantidadeModal"
      :adicionais-selecionados="adicionaisSelecionados"
      :observacao="observacaoModal"
      @close="fecharModal"
      @alterar-quantidade="alterarQuantidade"
      @toggle-adicional="toggleAdicional"
      @update:observacao="observacaoModal = $event"
      @confirmar="adicionarAoCarrinho"
    />

    <!-- BOTTOM NAVIGATION -->
    <BottomNavigation
      :active="tabAtiva"
      :cart-count="itensNoCarrinho"
      @navigate="tabAtiva = $event"
    />
  </div>
</template>

<style scoped>
/* Smooth scroll behavior */
main {
  scroll-behavior: smooth;
}
</style>

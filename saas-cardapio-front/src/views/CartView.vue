<script setup lang="ts">
import { computed } from 'vue';
import { ShoppingBag } from 'lucide-vue-next';
import CartItem from '../components/CartItem.vue';
import type { CarrinhoItem } from '../types';

interface Props {
  carrinho: CarrinhoItem[];
  frete: number;
  pedidoFinalizado: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  atualizarQuantidade: [itemId: number, delta: number];
  removerItem: [itemId: number];
  finalizarPedido: [];
  irParaCardapio: [];
}>();

const formatarPreco = (preco: number) => `R$ ${preco.toFixed(2).replace('.', ',')}`;

const subtotal = computed(() => {
  return props.carrinho.reduce((soma: number, item) => {
    const adicionais = item.adicionais.reduce((s: number, a) => s + a.preco, 0);
    return soma + (item.produto.preco + adicionais) * item.quantidade;
  }, 0);
});

const total = computed(() => subtotal.value + props.frete);
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark pb-20">
    <!-- Header -->
    <div class="px-4 pt-6 pb-3 border-b border-gray-800">
      <h2 class="text-2xl font-black text-white tracking-tight">Seu Carrinho</h2>
      <p class="text-gray-400 text-sm mt-1">Revise itens, ajuste quantidades e finalize seu pedido.</p>
    </div>

    <!-- Conteúdo -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <div v-if="carrinho.length === 0" class="p-4 space-y-4 mt-8">
        <div class="text-center">
          <ShoppingBag class="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-30" />
          <p class="text-gray-400 text-lg font-semibold mb-2">Seu carrinho está vazio</p>
          <p class="text-gray-500 text-sm mb-6">Escolha deliciosos lanches para começar</p>
          <button
            @click="$emit('irParaCardapio')"
            class="bg-brand-orange text-black px-6 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-colors w-full"
          >
            Ir para o cardápio
          </button>
        </div>
      </div>

      <div v-else class="p-4 space-y-4">
        <CartItem
          v-for="item in carrinho"
          :key="item.id"
          :item="item"
          @remove="$emit('removerItem', item.id)"
          @update-quantidade="$emit('atualizarQuantidade', item.id, $event)"
        />
      </div>
    </div>

    <!-- Resumo e Checkout -->
    <div v-if="carrinho.length > 0" class="sticky bottom-0 bg-brand-dark border-t border-gray-800 p-4 space-y-3">
      <div class="bg-brand-dark border border-gray-800 rounded-2xl p-4 space-y-3">
        <div class="flex justify-between text-gray-400 text-sm">
          <span>Subtotal</span>
          <span>{{ formatarPreco(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-400 text-sm">
          <span>Taxa de Entrega</span>
          <span>{{ formatarPreco(frete) }}</span>
        </div>
        <div class="border-t border-gray-800 pt-3 flex justify-between text-white font-black text-lg">
          <span>Total</span>
          <span>{{ formatarPreco(total) }}</span>
        </div>
      </div>

      <button
        @click="$emit('finalizarPedido')"
        class="w-full bg-brand-orange hover:bg-orange-600 text-white rounded-2xl py-3 font-bold transition-colors active:scale-95"
      >
        Finalizar Pedido
      </button>

      <transition name="fade">
        <div v-if="pedidoFinalizado" class="rounded-2xl bg-emerald-500/10 border border-emerald-500 p-4 text-emerald-200 text-sm flex items-start gap-2">
          <span class="text-lg mt-0.5">✅</span>
          <div>
            <p class="font-bold">Pedido finalizado com sucesso!</p>
            <p class="text-xs mt-1">Obrigado pela sua compra. Acompanhe seu pedido em breve.</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

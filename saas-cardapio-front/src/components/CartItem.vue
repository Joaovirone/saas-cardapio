<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import type { CarrinhoItem } from '../types';

interface Props {
  item: CarrinhoItem;
}

defineProps<Props>();

defineEmits<{
  remove: [];
  updateQuantidade: [delta: number];
}>();

const formatarPreco = (preco: number) => `R$ ${preco.toFixed(2).replace('.', ',')}`;

const calcularTotal = (item: CarrinhoItem) => {
  const adicionais = item.adicionais.reduce((s, a) => s + a.preco, 0);
  return (item.produto.preco + adicionais) * item.quantidade;
};
</script>

<template>
  <div class="bg-brand-card rounded-3xl p-4 border border-gray-800 overflow-hidden">
    <div class="flex gap-4">
      <img :src="item.produto.img" class="w-24 h-24 rounded-2xl object-cover flex-shrink-0" :alt="item.produto.nome" />
      
      <div class="flex-1 flex flex-col justify-between">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-white font-bold text-sm">{{ item.produto.nome }}</h3>
            <p class="text-gray-400 text-xs mt-1">{{ item.produto.descricao }}</p>
          </div>
          <button @click="$emit('remove')" class="text-red-500 hover:text-red-400 flex-shrink-0">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Quantidade -->
        <div class="flex items-center justify-between mt-2 gap-3">
          <div class="inline-flex items-center gap-1 bg-brand-dark border border-gray-800 rounded-lg px-2 py-1">
            <button @click="$emit('updateQuantidade', -1)" class="text-brand-orange px-2 py-1 font-bold text-sm">
              −
            </button>
            <span class="text-white font-bold text-sm min-w-[1.5rem] text-center">{{ item.quantidade }}</span>
            <button @click="$emit('updateQuantidade', 1)" class="text-brand-orange px-2 py-1 font-bold text-sm">
              +
            </button>
          </div>
          <span class="text-green-400 font-bold">{{ formatarPreco(calcularTotal(item)) }}</span>
        </div>

        <!-- Adicionais -->
        <div v-if="item.adicionais.length" class="mt-2 text-gray-400 text-xs">
          <span class="text-brand-orange font-semibold">Adicionais:</span> {{ item.adicionais.map(a => a.nome).join(', ') }}
        </div>

        <!-- Observação -->
        <div v-if="item.observacao" class="mt-1 text-gray-500 text-xs italic">
          📝 {{ item.observacao }}
        </div>
      </div>
    </div>
  </div>
</template>

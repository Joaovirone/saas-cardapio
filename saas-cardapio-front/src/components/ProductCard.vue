<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import type { Produto } from '../types';

interface Props {
  produto: Produto;
  isFavorito?: boolean;
}

defineProps<Props>();
defineEmits<{
  click: [];
  toggleFavorito: [];
}>();

const formatarPreco = (preco: number) => `R$ ${preco.toFixed(2).replace('.', ',')}`;
</script>

<template>
  <div class="bg-brand-card p-3 rounded-2xl border border-gray-800/60 overflow-hidden hover:border-brand-orange/30 transition-all cursor-pointer group"
       @click="$emit('click')">
    <div class="relative overflow-hidden rounded-xl mb-3">
      <img :src="produto.img" 
           :alt="produto.nome" 
           class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
      <button
        @click.stop="$emit('toggleFavorito')"
        class="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors"
      >
        <Star :class="['w-5 h-5', isFavorito ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300']" />
      </button>
      <div v-if="produto.avaliacoes" class="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
        <Star class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span class="text-xs text-white font-bold">{{ produto.avaliacoes }}</span>
        <span class="text-xs text-gray-300">({{ produto.votos }})</span>
      </div>
    </div>
    
    <h3 class="text-white font-bold text-sm line-clamp-2 mb-1">{{ produto.nome }}</h3>
    <p class="text-gray-400 text-xs line-clamp-2 mb-3">{{ produto.descricao }}</p>
    
    <div class="flex justify-between items-center">
      <span class="text-green-400 font-bold">{{ formatarPreco(produto.preco) }}</span>
      <span class="text-xs text-gray-500 group-hover:text-brand-orange transition-colors">Ver →</span>
    </div>
  </div>
</template>

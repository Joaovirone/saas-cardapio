<script setup lang="ts">
import { Heart } from 'lucide-vue-next';
import type { Promocao } from '../types';

interface Props {
  promocao: Promocao;
}

defineProps<Props>();
defineEmits<{
  verCardapio: [];
}>();
</script>

<template>
  <div class="bg-brand-card overflow-hidden rounded-3xl border border-gray-800 shadow-lg shadow-black/20">
    <div class="relative h-48 w-full overflow-hidden">
      <img :src="promocao.imagem" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" :alt="promocao.titulo" />
      <div class="absolute top-4 left-4 bg-brand-orange text-black px-3 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1">
        <Heart class="w-3 h-3 fill-black" />
        {{ promocao.badge }}
      </div>
    </div>
    
    <div class="p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-white text-xl font-black">{{ promocao.titulo }}</h3>
          <p class="text-gray-400 text-sm mt-2">{{ promocao.descricao }}</p>
        </div>
        <span class="text-green-400 font-black text-lg flex-shrink-0">{{ promocao.preco }}</span>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">{{ promocao.destaque }}</span>
        <button @click="$emit('verCardapio')" class="bg-brand-orange text-black px-4 py-2 rounded-2xl text-sm font-bold hover:bg-orange-500 transition-colors active:scale-95">
          Ver cardápio
        </button>
      </div>
    </div>
  </div>
</template>

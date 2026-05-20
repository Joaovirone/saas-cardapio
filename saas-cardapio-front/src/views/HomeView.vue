<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import RestauranteHeader from '../components/RestauranteHeader.vue';
import LocationMap from '../components/LocationMap.vue';
import type { RestauranteInfo } from '../types';

interface Props {
  restaurante: RestauranteInfo;
}

defineProps<Props>();
defineEmits<{
  irParaCardapio: [];
}>();
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark overflow-y-auto scrollbar-hide pb-6">
    <RestauranteHeader :restaurante="restaurante" />

    <div class="px-5 space-y-6 mt-6 relative z-10">
      <!-- Botão Principal -->
      <button 
        @click="$emit('irParaCardapio')"
        class="w-full bg-brand-orange hover:bg-orange-600 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
      >
        FAÇA SEU PEDIDO <ChevronRight class="w-5 h-5" />
      </button>

      <!-- Mapa e Localização -->
      <div>
        <h3 class="text-white font-black text-lg mb-3">📍 Localização</h3>
        <LocationMap :restaurante="restaurante" />
      </div>

      <!-- Por que escolher a gente? -->
      <div class="space-y-3">
        <h3 class="text-white font-black text-lg">✨ Por que escolher a gente?</h3>
        <div class="grid gap-3">
          <div class="bg-brand-card/50 border border-gray-800 rounded-xl p-3 flex items-start gap-3 hover:border-brand-orange/30 transition">
            <span class="text-2xl flex-shrink-0">⚡</span>
            <div>
              <p class="text-white font-bold text-sm">Entrega Rápida</p>
              <p class="text-gray-400 text-xs mt-1">Receba em {{ restaurante.tempoEntrega }} ou menos</p>
            </div>
          </div>

          <div class="bg-brand-card/50 border border-gray-800 rounded-xl p-3 flex items-start gap-3 hover:border-brand-orange/30 transition">
            <span class="text-2xl flex-shrink-0">🎯</span>
            <div>
              <p class="text-white font-bold text-sm">Qualidade Premium</p>
              <p class="text-gray-400 text-xs mt-1">Ingredientes frescos e selecionados</p>
            </div>
          </div>

          <div class="bg-brand-card/50 border border-gray-800 rounded-xl p-3 flex items-start gap-3 hover:border-brand-orange/30 transition">
            <span class="text-2xl flex-shrink-0">💰</span>
            <div>
              <p class="text-white font-bold text-sm">Melhor Preço</p>
              <p class="text-gray-400 text-xs mt-1">Combos e promoções imperdíveis</p>
            </div>
          </div>

          <div class="bg-brand-card/50 border border-gray-800 rounded-xl p-3 flex items-start gap-3 hover:border-brand-orange/30 transition">
            <span class="text-2xl flex-shrink-0">😋</span>
            <div>
              <p class="text-white font-bold text-sm">Sabor Incomparável</p>
              <p class="text-gray-400 text-xs mt-1">Receitas especiais que você vai amar</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Avaliação -->
      <div class="bg-gradient-to-r from-brand-orange/10 to-transparent border border-brand-orange/30 rounded-2xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">⭐</span>
          <div>
            <p class="text-white font-bold">{{ restaurante.rating }} estrelas</p>
            <p class="text-gray-400 text-xs">Avaliação dos clientes</p>
          </div>
        </div>
      </div>
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
</style>

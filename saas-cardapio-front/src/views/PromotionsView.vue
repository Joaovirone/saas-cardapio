<script setup lang="ts">
import PromotionCard from '../components/PromotionCard.vue';
import type { Promocao } from '../types';

interface Props {
  promocoes: Promocao[];
}

defineProps<Props>();

defineEmits<{
  verCardapio: [];
}>();
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark overflow-y-auto scrollbar-hide pb-20">
    <div class="px-4 space-y-5 pt-6">
      <div class="pb-3">
        <h2 class="text-2xl font-black text-white tracking-tight">Promoções</h2>
        <p class="text-gray-400 text-sm mt-2">Aproveite as ofertas especiais e monte seu pedido com desconto.</p>
      </div>

      <div class="space-y-4">
        <PromotionCard
          v-for="promo in promocoes"
          :key="promo.id"
          :promocao="promo"
          @ver-cardapio="$emit('verCardapio')"
        />
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

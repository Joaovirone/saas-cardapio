<script setup lang="ts">
import { Home, Utensils, Star, ShoppingBag, User } from 'lucide-vue-next';

interface Props {
  active: string;
  cartCount: number;
}

defineProps<Props>();
defineEmits<{
  navigate: [tab: string];
}>();
</script>

<template>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-card border-t border-gray-800 z-40 flex justify-between items-center px-6 py-2 pb-4">
    <button
      @click="$emit('navigate', 'home')"
      :class="['flex flex-col items-center gap-1 p-2 transition-colors', active === 'home' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']"
    >
      <Home class="w-6 h-6" />
      <span class="text-[10px] font-medium">Início</span>
    </button>

    <button
      @click="$emit('navigate', 'cardapio')"
      :class="['flex flex-col items-center gap-1 p-2 transition-colors', active === 'cardapio' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']"
    >
      <Utensils class="w-6 h-6" />
      <span class="text-[10px] font-medium">Cardápio</span>
    </button>

    <button
      @click="$emit('navigate', 'promocoes')"
      :class="['flex flex-col items-center gap-1 p-2 transition-colors', active === 'promocoes' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']"
    >
      <Star class="w-6 h-6" />
      <span class="text-[10px] font-medium">Promoções</span>
    </button>

    <button
      @click="$emit('navigate', 'carrinho')"
      :class="['relative flex flex-col items-center gap-1 p-2 transition-colors', active === 'carrinho' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']"
    >
      <div class="relative">
        <ShoppingBag class="w-6 h-6" />
        <span v-if="cartCount > 0" class="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          {{ cartCount }}
        </span>
      </div>
      <span class="text-[10px] font-medium">Carrinho</span>
    </button>

    <button
      @click="$emit('navigate', 'perfil')"
      :class="['flex flex-col items-center gap-1 p-2 transition-colors', active === 'perfil' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']"
    >
      <User class="w-6 h-6" />
      <span class="text-[10px] font-medium">Perfil</span>
    </button>
  </nav>
</template>

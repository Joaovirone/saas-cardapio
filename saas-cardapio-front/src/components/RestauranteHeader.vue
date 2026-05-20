<script setup lang="ts">
import { MapPin, Phone, Clock, DollarSign, Star } from 'lucide-vue-next';
import type { RestauranteInfo } from '../types';

interface Props {
  restaurante: RestauranteInfo;
}

defineProps<Props>();
</script>

<template>
  <div class="relative h-72 w-full">
    <img 
      src="https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80" 
      class="w-full h-full object-cover" 
      alt="Restaurante"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
    
    <div class="absolute bottom-6 left-0 right-0 flex flex-col items-center">
      <h1 class="text-4xl font-black text-white tracking-wider drop-shadow-lg">
        {{ restaurante.nome }}
      </h1>
      <div class="flex items-center gap-2 mt-2">
        <div class="flex items-center gap-1">
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span class="text-yellow-400 font-bold text-sm">{{ restaurante.rating }}</span>
        </div>
        <span class="text-gray-300 text-sm">{{ restaurante.cidade }}</span>
      </div>
    </div>
  </div>

  <div class="px-5 -mt-8 relative z-10 space-y-3">
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-brand-card/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-3 text-center">
        <Clock class="w-5 h-5 text-brand-orange mx-auto mb-1" />
        <p class="text-xs text-gray-400">Entrega</p>
        <p class="text-sm font-bold text-white">{{ restaurante.tempoEntrega }}</p>
      </div>
      <div class="bg-brand-card/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-3 text-center">
        <DollarSign class="w-5 h-5 text-brand-orange mx-auto mb-1" />
        <p class="text-xs text-gray-400">Mínimo</p>
        <p class="text-sm font-bold text-white">{{ restaurante.minimoEntrega }}</p>
      </div>
    </div>

    <div class="bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-4 space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <MapPin class="w-4 h-4 text-brand-orange flex-shrink-0" />
        <p class="text-gray-300">{{ restaurante.endereco }}</p>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Phone class="w-4 h-4 text-brand-orange flex-shrink-0" />
        <p class="text-gray-300">{{ restaurante.telefone1 }} • {{ restaurante.telefone2 }}</p>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Clock class="w-4 h-4 text-brand-orange flex-shrink-0" />
        <p class="text-gray-300 font-semibold">Aberto: {{ restaurante.horario }}</p>
      </div>
    </div>
  </div>
</template>

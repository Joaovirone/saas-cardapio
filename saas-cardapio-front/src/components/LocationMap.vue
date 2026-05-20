<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
import type { RestauranteInfo } from '../types';

interface Props {
  restaurante: RestauranteInfo;
}

defineProps<Props>();

const openGoogleMaps = (restaurante: RestauranteInfo) => {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(restaurante.endereco)}/@${restaurante.latitude},${restaurante.longitude},15z`;
  window.open(url, '_blank');
};

const abrirWhatsApp = (telefone: string) => {
  const numeroLimpo = telefone.replace(/\D/g, '');
  const url = `https://wa.me/55${numeroLimpo}`;
  window.open(url, '_blank');
};
</script>

<template>
  <div class="space-y-4">
    <!-- Mapa -->
    <div class="rounded-2xl overflow-hidden border border-gray-700 h-48 bg-brand-card relative group">
      <iframe
        :src="`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.3524629823545!2d${restaurante.longitude}!3d${restaurante.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x${restaurante.longitude}%2C${restaurante.latitude}!2z${encodeURIComponent(restaurante.endereco)}!5e0!3m2!1spt-BR!2sbr!4v`"
        style="border: 0; width: 100%; height: 100%"
        allowfullscreen
        loading="lazy"
      />
      <button
        @click="openGoogleMaps(restaurante)"
        class="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
      >
        <div class="bg-brand-orange text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <MapPin class="w-4 h-4" />
          Ver Localização
        </div>
      </button>
    </div>

    <!-- Info de Contato -->
    <div class="bg-brand-card/50 rounded-2xl border border-gray-800 p-4 space-y-3">
      <!-- Dois botões para WhatsApp -->
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="abrirWhatsApp(restaurante.telefone1)"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1"
        >
          <span class="text-sm">💬</span>
          {{ restaurante.telefone1.split(' ').pop()}}
        </button>
        <button
          @click="abrirWhatsApp(restaurante.telefone2)"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1"
        >
          <span class="text-sm">💬</span>
          {{ restaurante.telefone2.split(' ').pop() }}
        </button>
      </div>

      <!-- Link do Mapa -->
      <button
        @click="openGoogleMaps(restaurante)"
        class="w-full bg-brand-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
      >
        <MapPin class="w-4 h-4" />
        Abrir no Google Maps
      </button>
    </div>
  </div>
</template>

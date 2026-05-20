<script setup lang="ts">
import { Search } from 'lucide-vue-next';

interface Props {
  modelValue: string;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="relative">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text" 
      placeholder="Busque por lanches, bebidas..." 
      class="w-full bg-brand-card border border-gray-700/50 rounded-xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-500 text-sm"
    />
    <button 
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
    >
      ✕
    </button>
  </div>
</template>

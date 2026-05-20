<script setup lang="ts">
import { computed } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import CategoryBar from '../components/CategoryBar.vue';
import ProductCard from '../components/ProductCard.vue';
import type { Produto } from '../types';

interface Props {
  searchQuery: string;
  activeCategory: string;
  favoritos: number[];
  produtos: Produto[];
  categorias: Array<{ id: string; nome: string }>;
}

const props = defineProps<Props>();

defineEmits<{
  'update:searchQuery': [value: string];
  'update:activeCategory': [value: string];
  abrirProduto: [produto: Produto];
  toggleFavorito: [id: number];
}>();

const produtosFiltrados = computed(() => {
  let filtrados = props.produtos;
  if (props.activeCategory !== 'Todos') {
    filtrados = filtrados.filter(p => p.categoria === props.activeCategory);
  }
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    filtrados = filtrados.filter(p =>
      p.nome.toLowerCase().includes(query) || p.descricao.toLowerCase().includes(query)
    );
  }
  return filtrados;
});
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark">
    <!-- Header Sticky -->
    <div class="sticky top-0 z-20 bg-brand-dark/95 backdrop-blur-md pt-6 pb-2 px-4 shadow-sm border-b border-gray-800">
      <h2 class="text-2xl font-black text-white mb-4 tracking-tight">O que vamos pedir?</h2>
      <SearchBar :model-value="searchQuery" @update:model-value="$emit('update:searchQuery', $event)" />
    </div>

    <!-- Categorias -->
    <CategoryBar :categories="categorias" :active-category="activeCategory" @select-category="$emit('update:activeCategory', $event)" />

    <!-- Produtos Grid -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <div class="px-4 pb-6 space-y-4">
        <div v-if="produtosFiltrados.length === 0" class="text-center text-gray-500 mt-10">
          <p class="text-lg">Nenhum produto encontrado 😢</p>
          <p class="text-sm mt-2">Tente buscar por outro termo ou categoria</p>
        </div>

        <!-- Grid de Produtos 2 colunas -->
        <div v-else class="grid grid-cols-2 gap-3">
          <ProductCard
            v-for="produto in produtosFiltrados"
            :key="produto.id"
            :produto="produto"
            :is-favorito="favoritos.includes(produto.id)"
            @click="$emit('abrirProduto', produto)"
            @toggle-favorito="$emit('toggleFavorito', produto.id)"
          />
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

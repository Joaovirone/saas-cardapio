<script setup lang="ts">
interface Props {
  categories: Array<{ id: string; nome: string }>;
  activeCategory: string;
}

defineProps<Props>();
defineEmits<{
  selectCategory: [categoryId: string];
}>();
</script>

<template>
  <div class="w-full overflow-x-auto scrollbar-hide">
    <div class="flex items-center gap-3 px-4 py-4 w-max">
      <button
        v-for="cat in categories" 
        :key="cat.id"
        @click="$emit('selectCategory', cat.id)"
        :class="[
          'shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all',
          activeCategory === cat.id
            ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/40'
            : 'bg-brand-card text-gray-400 border border-gray-800 hover:text-gray-200'
        ]"
      >
        {{ cat.nome }}
      </button>
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

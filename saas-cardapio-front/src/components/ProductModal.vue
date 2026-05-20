<script setup lang="ts">
import { X, Plus, Minus } from 'lucide-vue-next';
import type { Produto, Adicional } from '../types';

interface Props {
  produto: Produto | null;
  quantidade: number;
  adicionaisSelecionados: string[];
  observacao: string;
}

defineProps<Props>();

defineEmits<{
  close: [];
  alterarQuantidade: [delta: number];
  toggleAdicional: [id: string];
  'update:observacao': [value: string];
  confirmar: [];
}>();

const formatarPreco = (preco: number) => `R$ ${preco.toFixed(2).replace('.', ',')}`;

const valorTotal = (produto: Produto, quantidade: number, adicionaisSelecionados: string[]) => {
  if (!produto) return 0;
  let somaAdicionais = 0;
  if (produto.adicionais) {
    somaAdicionais = produto.adicionais
      .filter((a: Adicional) => adicionaisSelecionados.includes(a.id))
      .reduce((soma: number, a: Adicional) => soma + a.preco, 0);
  }
  return (produto.preco + somaAdicionais) * quantidade;
};
</script>

<template>
  <transition name="fade">
    <div v-if="produto" class="absolute inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="bg-brand-card w-full max-h-[90vh] rounded-t-3xl relative z-10 flex flex-col shadow-2xl overflow-hidden animate-slide-up border-t border-gray-700/50">
        
        <!-- Imagem do Produto -->
        <div class="relative h-56 w-full shrink-0 bg-brand-dark">
          <img :src="produto.img" class="w-full h-full object-cover opacity-90" :alt="produto.nome" />
          <div class="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent"></div>
          <button @click="$emit('close')" class="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 backdrop-blur-md hover:bg-black/80 transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="p-5 overflow-y-auto scrollbar-hide flex-1 space-y-6">
          <div>
            <h2 class="text-2xl font-black text-white">{{ produto.nome }}</h2>
            <p class="text-gray-400 mt-2 text-sm leading-relaxed">{{ produto.descricao }}</p>
            <div v-if="produto.avaliacoes" class="flex items-center gap-2 mt-3">
              <span class="text-yellow-400 font-bold">{{ produto.avaliacoes }}</span>
              <span class="text-gray-500 text-sm">({{ produto.votos }} avaliações)</span>
            </div>
            <div class="text-green-400 font-black text-xl mt-3">{{ formatarPreco(produto.preco) }}</div>
          </div>

          <!-- Adicionais -->
          <div v-if="produto.adicionais && produto.adicionais.length > 0" class="pt-4 border-t border-gray-800">
            <h3 class="text-white font-bold mb-3">Turbine seu pedido</h3>
            <div class="space-y-3">
              <label
                v-for="adc in produto.adicionais"
                :key="adc.id"
                class="flex items-center justify-between bg-brand-dark p-3 rounded-xl border border-gray-800/50 cursor-pointer transition-colors hover:border-brand-orange/50"
              >
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-5 h-5 rounded flex items-center justify-center border',
                      adicionaisSelecionados.includes(adc.id) ? 'bg-brand-orange border-brand-orange' : 'border-gray-600'
                    ]"
                  >
                    <div v-if="adicionaisSelecionados.includes(adc.id)" class="w-2.5 h-2.5 bg-white rounded-sm"></div>
                  </div>
                  <span class="text-gray-200 text-sm">{{ adc.nome }}</span>
                </div>
                <span class="text-brand-orange font-bold text-sm">+ {{ formatarPreco(adc.preco) }}</span>
                <input
                  type="checkbox"
                  class="hidden"
                  :checked="adicionaisSelecionados.includes(adc.id)"
                  @change="$emit('toggleAdicional', adc.id)"
                />
              </label>
            </div>
          </div>

          <!-- Observação -->
          <div class="pt-4 border-t border-gray-800">
            <h3 class="text-white font-bold mb-3">Observações</h3>
            <textarea
              :value="observacao"
              @input="$emit('update:observacao', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Ex: Sem cebola, maionese à parte, muito bacon..."
              class="w-full bg-brand-dark border border-gray-800 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-brand-orange resize-none h-20 placeholder-gray-600"
            />
          </div>
        </div>

        <!-- Footer com Quantidade e Total -->
        <div class="p-5 bg-brand-dark border-t border-gray-800 flex items-center gap-4 shrink-0 pb-8">
          <div class="flex items-center justify-between bg-brand-card border border-gray-700 rounded-xl p-1 w-32 shrink-0">
            <button
              @click="$emit('alterarQuantidade', -1)"
              class="p-2 text-brand-orange hover:bg-gray-800 rounded-lg transition"
            >
              <Minus class="w-5 h-5" />
            </button>
            <span class="text-white font-bold">{{ quantidade }}</span>
            <button
              @click="$emit('alterarQuantidade', 1)"
              class="p-2 text-brand-orange hover:bg-gray-800 rounded-lg transition"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>

          <button
            @click="$emit('confirmar')"
            class="flex-1 bg-brand-orange hover:bg-orange-600 text-white rounded-xl py-3.5 font-bold flex justify-between px-4 items-center transition-transform active:scale-95 shadow-lg shadow-brand-orange/20"
          >
            <span>Adicionar</span>
            <span>{{ formatarPreco(valorTotal(produto, quantidade, adicionaisSelecionados)) }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<script setup lang="ts">
import type { PerfillCliente } from '../types';

interface Props {
  perfilData: PerfillCliente;
  perfilSalvo: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:perfilData': [value: PerfillCliente];
  salvar: [];
}>();
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark overflow-y-auto scrollbar-hide pb-20">
    <div class="px-4 pt-6 pb-3 border-b border-gray-800">
      <h2 class="text-2xl font-black text-white tracking-tight">Meu Perfil</h2>
      <p class="text-gray-400 text-sm mt-1">Seus dados de contato e entrega para checkout rápido.</p>
    </div>

    <form @submit.prevent="$emit('salvar')" class="p-4 space-y-4">
      <!-- Nome -->
      <div>
        <label class="block text-gray-300 text-sm font-semibold mb-2">Nome Completo</label>
        <input
          :value="perfilData.nome"
          @input="$emit('update:perfilData', { ...perfilData, nome: ($event.target as HTMLInputElement).value })"
          type="text"
          placeholder="Seu nome"
          class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-300 text-sm font-semibold mb-2">E-mail</label>
        <input
          :value="perfilData.email"
          @input="$emit('update:perfilData', { ...perfilData, email: ($event.target as HTMLInputElement).value })"
          type="email"
          placeholder="seu.email@exemplo.com"
          class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600"
        />
      </div>

      <!-- Telefone -->
      <div>
        <label class="block text-gray-300 text-sm font-semibold mb-2">Telefone</label>
        <input
          :value="perfilData.telefone"
          @input="$emit('update:perfilData', { ...perfilData, telefone: ($event.target as HTMLInputElement).value })"
          type="tel"
          placeholder="(99) 9 9999-9999"
          class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600"
        />
      </div>

      <!-- Endereço -->
      <div>
        <label class="block text-gray-300 text-sm font-semibold mb-2">Endereço de Entrega</label>
        <input
          :value="perfilData.endereco"
          @input="$emit('update:perfilData', { ...perfilData, endereco: ($event.target as HTMLInputElement).value })"
          type="text"
          placeholder="Rua, número, bairro, cidade"
          class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600"
        />
      </div>

      <!-- Observações -->
      <div>
        <label class="block text-gray-300 text-sm font-semibold mb-2">Observações</label>
        <textarea
          :value="perfilData.observacoes"
          @input="$emit('update:perfilData', { ...perfilData, observacoes: ($event.target as HTMLTextAreaElement).value })"
          rows="4"
          placeholder="Ex: Tocar na portaria, apartamento, referências, etc."
          class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600 resize-none"
        />
      </div>

      <!-- Botão Salvar -->
      <button
        type="submit"
        class="w-full bg-brand-orange hover:bg-orange-600 text-white rounded-2xl py-3 font-bold transition-colors active:scale-95 mt-6"
      >
        Salvar Perfil
      </button>

      <!-- Mensagem de Sucesso -->
      <transition name="fade">
        <div v-if="perfilSalvo" class="rounded-2xl bg-emerald-500/10 border border-emerald-500 p-3 text-emerald-200 text-sm flex items-start gap-2">
          <span class="text-lg mt-0.5">✅</span>
          <p>Perfil salvo com sucesso!</p>
        </div>
      </transition>

      <!-- Info Extra -->
      <div class="mt-6 bg-brand-card/50 border border-gray-800 rounded-2xl p-4">
        <p class="text-gray-400 text-xs leading-relaxed">
          💡 Seus dados são salvos localmente no seu dispositivo e usados apenas para facilitar o checkout. Sua privacidade é importante para nós.
        </p>
      </div>
    </form>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

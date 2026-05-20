<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useFormValidation } from '../composables/useFormValidation';
import { useToast } from '../composables/useToast';
import { historicoPedidos } from '../stores/cardapio';
import type { PerfillCliente, Pedido } from '../types';
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  perfilData: PerfillCliente;
  perfilSalvo: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:perfilData': [value: PerfillCliente];
  salvar: [];
  'repetir-pedido': [pedido: Pedido];
}>();

const { showToast } = useToast();
const { validate, getError } = useFormValidation();

const tabAtiva = ref<'dados' | 'historico'>('dados');

const errors = reactive<Record<string, string>>({
  nome: '',
  email: '',
  telefone: '',
  endereco: ''
});

const isFormValid = computed(() => {
  return (
    validate('nome', perfilData.nome || '') &&
    validate('email', perfilData.email || '') &&
    validate('telefone', perfilData.telefone || '') &&
    validate('endereco', perfilData.endereco || '')
  );
});

function validarCampo(campo: string, valor: string) {
  errors[campo] = getError(campo, valor) || '';
}

function handleSalvar() {
  validarCampo('nome', perfilData.nome);
  validarCampo('email', perfilData.email);
  validarCampo('telefone', perfilData.telefone);
  validarCampo('endereco', perfilData.endereco);

  if (isFormValid.value) {
    $emit('salvar');
    showToast('Perfil salvo com sucesso!', 'success');
  } else {
    showToast('Por favor, preencha todos os campos corretamente', 'error');
  }
}

function repetirPedido(pedido: Pedido) {
  $emit('repetir-pedido', pedido);
}

function formatarData(dataString: string): string {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatarPedidoItens(pedido: Pedido): string {
  if (pedido.itens.length === 0) return 'Sem itens';
  const primeiros = pedido.itens.slice(0, 3).map(i => i.produto.nome).join(', ');
  const maisCount = pedido.itens.length - 3;
  return maisCount > 0 ? `${primeiros} +${maisCount}` : primeiros;
}
</script>

<template>
  <div class="flex flex-col h-full bg-brand-dark overflow-hidden">
    <!-- HEADER -->
    <div class="px-4 pt-6 pb-3 border-b border-gray-800">
      <h2 class="text-2xl font-black text-white tracking-tight">Meu Perfil</h2>
      <p class="text-gray-400 text-sm mt-1">Dados pessoais e histórico de pedidos.</p>
    </div>

    <!-- TABS -->
    <div class="flex border-b border-gray-800 sticky top-0 bg-brand-dark z-10">
      <button
        @click="tabAtiva = 'dados'"
        :class="[
          'flex-1 py-3 px-4 font-semibold border-b-2 transition-colors',
          tabAtiva === 'dados'
            ? 'text-brand-orange border-brand-orange'
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        Dados Pessoais
      </button>
      <button
        @click="tabAtiva = 'historico'"
        :class="[
          'flex-1 py-3 px-4 font-semibold border-b-2 transition-colors relative',
          tabAtiva === 'historico'
            ? 'text-brand-orange border-brand-orange'
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        Histórico
        <span v-if="historicoPedidos.length > 0" class="absolute -top-1 -right-1 bg-brand-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ historicoPedidos.length }}
        </span>
      </button>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <!-- DADOS TAB -->
      <template v-if="tabAtiva === 'dados'">
        <form @submit.prevent="handleSalvar" class="p-4 space-y-5">
          <!-- Nome -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">
              Nome Completo <span class="text-red-400">*</span>
            </label>
            <input
              :value="perfilData.nome"
              @input="(e) => {
                $emit('update:perfilData', { ...perfilData, nome: (e.target as HTMLInputElement).value });
                validarCampo('nome', (e.target as HTMLInputElement).value);
              }"
              @blur="validarCampo('nome', perfilData.nome)"
              type="text"
              placeholder="Seu nome completo"
              :class="[
                'w-full bg-brand-card border rounded-2xl px-4 py-3 text-white focus:outline-none transition-colors placeholder-gray-600',
                errors.nome ? 'border-red-500 focus:border-red-400' : 'border-gray-800 focus:border-brand-orange'
              ]"
            />
            <p v-if="errors.nome" class="text-red-400 text-xs mt-1">{{ errors.nome }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">
              E-mail <span class="text-red-400">*</span>
            </label>
            <input
              :value="perfilData.email"
              @input="(e) => {
                $emit('update:perfilData', { ...perfilData, email: (e.target as HTMLInputElement).value });
                validarCampo('email', (e.target as HTMLInputElement).value);
              }"
              @blur="validarCampo('email', perfilData.email)"
              type="email"
              placeholder="seu.email@exemplo.com"
              :class="[
                'w-full bg-brand-card border rounded-2xl px-4 py-3 text-white focus:outline-none transition-colors placeholder-gray-600',
                errors.email ? 'border-red-500 focus:border-red-400' : 'border-gray-800 focus:border-brand-orange'
              ]"
            />
            <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- Telefone -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">
              Telefone <span class="text-red-400">*</span>
            </label>
            <input
              :value="perfilData.telefone"
              @input="(e) => {
                $emit('update:perfilData', { ...perfilData, telefone: (e.target as HTMLInputElement).value });
                validarCampo('telefone', (e.target as HTMLInputElement).value);
              }"
              @blur="validarCampo('telefone', perfilData.telefone)"
              type="tel"
              placeholder="(99) 9 9999-9999"
              :class="[
                'w-full bg-brand-card border rounded-2xl px-4 py-3 text-white focus:outline-none transition-colors placeholder-gray-600',
                errors.telefone ? 'border-red-500 focus:border-red-400' : 'border-gray-800 focus:border-brand-orange'
              ]"
            />
            <p v-if="errors.telefone" class="text-red-400 text-xs mt-1">{{ errors.telefone }}</p>
          </div>

          <!-- Endereço -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">
              Endereço de Entrega <span class="text-red-400">*</span>
            </label>
            <input
              :value="perfilData.endereco"
              @input="(e) => {
                $emit('update:perfilData', { ...perfilData, endereco: (e.target as HTMLInputElement).value });
                validarCampo('endereco', (e.target as HTMLInputElement).value);
              }"
              @blur="validarCampo('endereco', perfilData.endereco)"
              type="text"
              placeholder="Rua, número, bairro, cidade"
              :class="[
                'w-full bg-brand-card border rounded-2xl px-4 py-3 text-white focus:outline-none transition-colors placeholder-gray-600',
                errors.endereco ? 'border-red-500 focus:border-red-400' : 'border-gray-800 focus:border-brand-orange'
              ]"
            />
            <p v-if="errors.endereco" class="text-red-400 text-xs mt-1">{{ errors.endereco }}</p>
          </div>

          <!-- Observações -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">Observações</label>
            <textarea
              :value="perfilData.observacoes"
              @input="$emit('update:perfilData', { ...perfilData, observacoes: ($event.target as HTMLTextAreaElement).value })"
              rows="3"
              placeholder="Ex: Tocar na portaria, apartamento, referências, etc."
              class="w-full bg-brand-card border border-gray-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-600 resize-none"
            />
          </div>

          <!-- Botão Salvar -->
          <button
            type="submit"
            :disabled="!isFormValid"
            :class="[
              'w-full text-white rounded-2xl py-3 font-bold transition-all active:scale-95 mt-6',
              isFormValid
                ? 'bg-brand-orange hover:bg-orange-600'
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            ]"
          >
            Salvar Perfil
          </button>

          <!-- Info Extra -->
          <div class="mt-4 bg-brand-card/50 border border-gray-800 rounded-2xl p-4">
            <p class="text-gray-400 text-xs leading-relaxed">
              💡 Seus dados são salvos localmente no seu dispositivo. Sua privacidade é importante para nós.
            </p>
          </div>
        </form>
      </template>

      <!-- HISTÓRICO TAB -->
      <template v-else-if="tabAtiva === 'historico'">
        <div class="p-4">
          <template v-if="historicoPedidos.length > 0">
            <div class="space-y-3">
              <div
                v-for="pedido in historicoPedidos"
                :key="pedido.id"
                class="bg-brand-card border border-gray-800 rounded-2xl p-4 hover:border-brand-orange/50 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="text-white font-semibold text-sm">Pedido {{ pedido.id }}</p>
                    <p class="text-gray-400 text-xs">{{ formatarData(pedido.data) }}</p>
                  </div>
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    pedido.status === 'entregue'
                      ? 'bg-green-900/30 text-green-300'
                      : pedido.status === 'cancelado'
                      ? 'bg-red-900/30 text-red-300'
                      : 'bg-yellow-900/30 text-yellow-300'
                  ]">
                    {{ pedido.status === 'entregue' ? '✓ Entregue' : pedido.status === 'cancelado' ? '✗ Cancelado' : '⏳ Pendente' }}
                  </span>
                </div>

                <p class="text-gray-300 text-sm mb-3 line-clamp-2">
                  {{ formatarPedidoItens(pedido) }}
                </p>

                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-gray-400 text-xs">Total</p>
                    <p class="text-green-400 font-bold">R$ {{ pedido.total.toFixed(2) }}</p>
                  </div>
                  <button
                    @click="repetirPedido(pedido)"
                    class="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                  >
                    Repetir
                  </button>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center mb-4">
                <span class="text-3xl">📋</span>
              </div>
              <p class="text-gray-300 font-semibold mb-1">Nenhum pedido ainda</p>
              <p class="text-gray-400 text-sm">Seus pedidos aparecerão aqui após sua primeira compra.</p>
            </div>
          </template>
        </div>
      </template>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Check, AlertCircle, Info, X } from 'lucide-vue-next';
import type { Toast } from '../composables/useToast';

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

defineProps<Props>();

const iconMap = {
  success: Check,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info
};

const bgColorMap = {
  success: 'bg-green-900/80',
  error: 'bg-red-900/80',
  warning: 'bg-yellow-900/80',
  info: 'bg-blue-900/80'
};

const borderColorMap = {
  success: 'border-green-500',
  error: 'border-red-500',
  warning: 'border-yellow-500',
  info: 'border-blue-500'
};

const textColorMap = {
  success: 'text-green-100',
  error: 'text-red-100',
  warning: 'text-yellow-100',
  info: 'text-blue-100'
};
</script>

<template>
  <div class="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none flex flex-col gap-2 max-w-md mx-auto">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'rounded-lg border border-l-4 p-4 flex items-start gap-3 pointer-events-auto',
          'animate-slide-down shadow-lg',
          bgColorMap[toast.type],
          borderColorMap[toast.type],
        ]"
      >
        <component :is="iconMap[toast.type]" :class="['w-5 h-5 flex-shrink-0 mt-0.5', textColorMap[toast.type]]" />
        <p :class="['flex-1 text-sm', textColorMap[toast.type]]">
          {{ toast.message }}
        </p>
        <button
          @click="onRemove(toast.id)"
          :class="['flex-shrink-0 text-gray-400 hover:text-gray-200', textColorMap[toast.type]]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Home, 
  Utensils, 
  Star, 
  ShoppingBag, 
  User, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight 
} from 'lucide-vue-next';

// Controle da Navegação Inferior
const tabAtiva = ref('home');
const itensNoCarrinho = ref(0); // No futuro, vira do seu estado global

// Dados do Restaurante (Padrão White-Label)
const restaurante = {
  nome: 'Chapa Quente',
  telefone1: '(79) 9-9106-6838',
  telefone2: '(79) 9-9192-2766',
  cidade: 'Aracaju',
  tempoEntrega: '30 Min',
  tempoRetirada: '15 Min',
  minimoEntrega: 'R$ 8,00',
  horario: '17:00 às 23:59'
};
</script>

<template>
  <div class="h-screen w-full bg-brand-dark text-gray-100 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans shadow-2xl">
    
    <main class="flex-1 overflow-y-auto pb-20">
      
      <template v-if="tabAtiva === 'home'">
        
        <div class="relative h-72 w-full">
          <img src="https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80" alt="Hambúrguer Artesanal" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
          
          <div class="absolute bottom-6 left-0 right-0 flex flex-col items-center">
             <h1 class="text-4xl font-black text-white tracking-wider drop-shadow-lg italic">
               João <span class="text-brand-orange">Lanches</span>
             </h1>
             <span class="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold mt-3 tracking-wide">
               Aberto Agora
             </span>
          </div>
        </div>

        <div class="px-5 space-y-5 -mt-2 relative z-10">
          
          <button 
            @click="tabAtiva = 'cardapio'" 
            class="w-full bg-brand-orange hover:bg-orange-600 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-transform active:scale-95">
            FAÇA SEU PEDIDO ONLINE <ChevronRight class="w-5 h-5" />
          </button>

          <div class="bg-brand-card rounded-2xl p-4 border border-gray-800/50 space-y-4">
            <div class="flex items-center gap-3 text-gray-300">
              <div class="bg-gray-800 p-2 rounded-full text-brand-orange"><Phone class="w-4 h-4" /></div>
              <div class="text-sm font-medium">{{ restaurante.telefone1 }} <br/> {{ restaurante.telefone2 }}</div>
            </div>
            <div class="h-px bg-gray-800"></div>
            <div class="flex items-center gap-3 text-gray-300">
              <div class="bg-gray-800 p-2 rounded-full text-brand-orange"><MapPin class="w-4 h-4" /></div>
              <div class="text-sm font-medium">{{ restaurante.cidade }}</div>
            </div>
          </div>

          <div class="bg-brand-card rounded-2xl p-4 border border-gray-800/50 space-y-3 text-sm text-gray-400">
            <div class="flex justify-between items-center">
               <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> Entrega:</span>
               <span class="text-gray-200 font-medium">{{ restaurante.tempoEntrega }} (Min: {{ restaurante.minimoEntrega }})</span>
            </div>
            <div class="flex justify-between items-center">
               <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Retirada:</span>
               <span class="text-gray-200 font-medium">{{ restaurante.tempoRetirada }} (Min: Grátis)</span>
            </div>
            <div class="h-px bg-gray-800 my-2"></div>
            <div class="flex items-center gap-2 text-gray-300">
              <Clock class="w-4 h-4 text-brand-orange" />
              <span>Atendimento hoje das <strong class="text-gray-100">{{ restaurante.horario }}</strong></span>
            </div>
          </div>
          
        </div>
      </template>

      <template v-else-if="tabAtiva === 'cardapio'">
        <div class="p-6 pt-12 flex flex-col items-center justify-center h-full text-gray-500">
          <Utensils class="w-12 h-12 mb-4 opacity-50" />
          <h2 class="text-xl font-bold text-gray-300">Cardápio</h2>
          <p>A lista de categorias entrará aqui.</p>
        </div>
      </template>

    </main>

    <nav class="absolute bottom-0 w-full bg-brand-card border-t border-gray-800 pb-2 pt-2 px-6 z-50">
      <div class="flex justify-between items-center">
        
        <button @click="tabAtiva = 'home'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'home' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']">
          <Home class="w-6 h-6" />
          <span class="text-[10px] font-medium">Início</span>
        </button>

        <button @click="tabAtiva = 'cardapio'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'cardapio' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']">
          <Utensils class="w-6 h-6" />
          <span class="text-[10px] font-medium">Cardápio</span>
        </button>

        <button @click="tabAtiva = 'promocoes'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'promocoes' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']">
          <Star class="w-6 h-6" />
          <span class="text-[10px] font-medium">Promoções</span>
        </button>

        <button @click="tabAtiva = 'carrinho'" :class="['relative flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'carrinho' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']">
          <div class="relative">
            <ShoppingBag class="w-6 h-6" />
            <span v-if="itensNoCarrinho > 0" class="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {{ itensNoCarrinho }}
            </span>
          </div>
          <span class="text-[10px] font-medium">Carrinho</span>
        </button>

        <button @click="tabAtiva = 'perfil'" :class="['flex flex-col items-center gap-1 p-2 transition-colors', tabAtiva === 'perfil' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-400']">
          <User class="w-6 h-6" />
          <span class="text-[10px] font-medium">Perfil</span>
        </button>

      </div>
    </nav>
  </div>
</template>
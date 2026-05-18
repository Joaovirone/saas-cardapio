<script setup lang="ts">
import { ref, computed } from 'vue';
import { cardapioApi } from './services/api';
// Importando ícones comerciais e modernos
import { 
  Utensils, 
  CupSoda, 
  IceCream, 
  ShoppingBag, 
  User, 
  Phone, 
  CheckCircle2,
  ChevronRight
} from 'lucide-vue-next';

interface ItemCarrinho {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

// 1. Estrutura de Categorias e Produtos (Fácil de virar um JSON customizável por cliente)
const categorias = ref([
  { id: 'lanches', nome: 'Burguers', icone: Utensils },
  { id: 'bebidas', nome: 'Bebidas', icone: CupSoda },
  { id: 'sobremesas', nome: 'Sobremesas', icone: IceCream }
]);

const categoriaAtiva = ref('lanches');

const produtos = ref([
  // Categoria: Lanches
  { id: 'l1', categoria: 'lanches', nome: 'Monster Cheddar Bacon', descricao: 'Dois blends de 150g, muito bacon crocante e cheddar cremoso', preco: 34.90 },
  { id: 'l2', categoria: 'lanches', nome: 'Double Smash Burguer', descricao: 'Dois hambúrgueres smash, queijo prato, maionese artesanal', preco: 26.00 },
  { id: 'l3', categoria: 'lanches', nome: 'Chicken Grill Catupiry', descricao: 'Filé de frango grelhado, catupiry original, alface e tomate', preco: 23.50 },
  
  // Categoria: Bebidas
  { id: 'b1', categoria: 'bebidas', nome: 'Coca-Cola Lata 350ml', descricao: 'Gelada trincando', preco: 6.00 },
  { id: 'b2', categoria: 'bebidas', nome: 'Suco de Laranja 500ml', descricao: 'Natural, espremido na hora', preco: 9.00 },
  { id: 'b3', categoria: 'bebidas', nome: 'Cerveja Artesanal IPA', descricao: 'Long neck local', preco: 14.00 },

  // Categoria: Sobremesas
  { id: 's1', categoria: 'sobremesas', nome: 'Taça Brownie Supremo', descricao: 'Brownie quentinho com sorvete de creme e calda de chocolate', preco: 18.90 },
  { id: 's2', categoria: 'sobremesas', nome: 'Pudim de Leite Condensado', descricao: 'Receita da vovó, super cremoso', preco: 8.00 }
]);

// Estados do Carrinho e Checkout
const carrinho = ref<ItemCarrinho[]>([]);
const nomeCliente = ref('');
const telefoneCliente = ref('');
const enviando = ref(false);
const visualizandoCarrinho = ref(false); // Controla a alternância de "telas"

// Filtro dinâmico baseado na categoria selecionada
const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => p.categoria === categoriaAtiva.value);
});

function adicionarAoCarrinho(produto: { id: string; nome: string; preco: number }) {
  const itemExistente = carrinho.value.find(item => item.id === produto.id);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.value.push({ ...produto, quantidade: 1 });
  }
}

function removerDoCarrinho(id: string) {
  const itemExistente = carrinho.value.find(item => item.id === id);
  if (itemExistente) {
    if (itemExistente.quantidade > 1) {
      itemExistente.quantidade--;
    } else {
      carrinho.value = carrinho.value.filter(item => item.id !== id);
    }
  }
}

const totalCalculado = computed(() => {
  return carrinho.value.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
});

const totalItensNoCarrinho = computed(() => {
  return carrinho.value.reduce((soma, item) => soma + item.quantidade, 0);
});

async function fecharPedido() {
  if (!nomeCliente.value.trim() || !telefoneCliente.value.trim()) {
    alert("Por favor, preencha seu nome e celular para a entrega!");
    return;
  }

  enviando.value = true;

  const payload = {
    nomeCliente: nomeCliente.value,
    telefone: telefoneCliente.value,
    itens: carrinho.value.map(item => ({
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade
    }))
  };

  try {
    const resposta = await cardapioApi.enviarPedido(payload);
    alert(`🔥 Pedido Confirmado!\nID: ${resposta.id}\nSeu pedido já caiu na chapa!`);
    
    // Reset do estado
    carrinho.value = [];
    nomeCliente.value = '';
    telefoneCliente.value = '';
    visualizandoCarrinho.value = false;
  } catch (error) {
    alert("Erro na comunicação com o servidor AWS.");
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <div class="app-mobile-container">
    
    <div v-if="!visualizandoCarrinho" class="tela-cardapio">
      <header class="hero-banner">
        <div class="overlay">
          <span class="badge-status">Aberto agora</span>
          <h1>🔥 Burger's Grill & Co</h1>
          <p>O autêntico sabor artesanal na sua mesa</p>
        </div>
      </header>

      <nav class="categorias-nav">
        <button 
          v-for="cat in categorias" 
          :key="cat.id"
          :class="['cat-btn', { active: categoriaAtiva === cat.id }]"
          @click="categoriaAtiva = cat.id"
        >
          <component :is="cat.icone" class="icon" />
          <span>{{ cat.nome }}</span>
        </button>
      </nav>

      <main class="listagem-produtos">
        <h2 class="titulo-secao">{{ categorias.find(c => c.id === categoriaAtiva)?.nome }}</h2>
        
        <div class="card-produto" v-for="prod in produtosFiltrados" :key="prod.id">
          <div class="prod-info">
            <h3>{{ prod.nome }}</h3>
            <p class="descricao">{{ prod.descricao }}</p>
            <span class="preco">R$ {{ prod.preco.toFixed(2) }}</span>
          </div>
          <button class="btn-add" @click="adicionarAoCarrinho(prod)">+</button>
        </div>
      </main>

      <div class="barra-flutuante" v-if="carrinho.length > 0" @click="visualizandoCarrinho = true">
        <div class="carrinho-resumo">
          <span class="contador">{{ totalItensNoCarrinho }}</span>
          <span class="texto-ver">Ver meu carrinho</span>
        </div>
        <div class="valor-resumo">
          <span>R$ {{ totalCalculado.toFixed(2) }}</span>
          <ChevronRight class="icon-seta" />
        </div>
      </div>
    </div>

    <div v-else class="tela-carrinho">
      <header class="carrinho-header">
        <button class="btn-voltar" @click="visualizandoCarrinho = false">← Voltar ao menu</button>
        <h2>Meu Carrinho</h2>
      </header>

      <main class="carrinho-corpo">
        <section class="itens-selecionados">
          <div class="item-linha" v-for="item in carrinho" :key="item.id">
            <div class="item-nome-preco">
              <h4>{{ item.nome }}</h4>
              <span>R$ {{ (item.preco * item.quantidade).toFixed(2) }}</span>
            </div>
            <div class="controles-quantidade">
              <button @click="removerDoCarrinho(item.id)">-</button>
              <span class="qtd">{{ item.quantidade }}</span>
              <button @click="adicionarAoCarrinho(item)">+</button>
            </div>
          </div>
          <div class="checkout-total">
            <span>Total do pedido:</span>
            <strong>R$ {{ totalCalculado.toFixed(2) }}</strong>
          </div>
        </section>

        <section class="checkout-form">
          <h3><User class="icon-form" /> Identificação</h3>
          <div class="input-group">
            <input type="text" v-model="nomeCliente" placeholder="Qual o seu nome?" required />
          </div>
          
          <h3><Phone class="icon-form" /> Contato</h3>
          <div class="input-group">
            <input type="tel" v-model="telefoneCliente" placeholder="Seu WhatsApp (Ex: 79999999999)" required />
          </div>
        </section>

        <button class="btn-finalizar-pedido" :disabled="enviando" @click="fecharPedido">
          <CheckCircle2 class="icon-submit" v-if="!enviando" />
          <span>{{ enviando ? 'Enviando para a cozinha...' : 'Confirmar e Enviar Pedido' }}</span>
        </button>
      </main>
    </div>

  </div>
</template>

<style scoped>
/* PALETA DE CORES INTENSAS (Psicologia do Apetite)
   Laranja Principal: #E65100 (Deep Orange)
   Vermelho de Destaque: #D84315
   Fundo Escuro Quente: #212121
*/

.app-mobile-container {
  max-width: 480px; /* Limita a largura para simular um celular perfeito */
  margin: 0 auto;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  padding-bottom: 90px;
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* BANNER HERO */
.hero-banner {
  background: url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80') center/cover;
  height: 160px;
  color: white;
}
.hero-banner .overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(216, 67, 21, 0.9));
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.hero-banner h1 { margin: 0; font-size: 1.5rem; font-weight: 800; }
.hero-banner p { margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9rem; }
.badge-status {
  background: #2ecc71; color: white; padding: 4px 8px; border-radius: 20px;
  font-size: 0.75rem; font-weight: bold; align-self: flex-start; margin-bottom: auto;
}

/* CATEGORIAS NAVEGÁVEIS */
.categorias-nav {
  display: flex; gap: 10px; padding: 15px; overflow-x: auto;
  background: white; border-bottom: 1px solid #eee;
  scrollbar-width: none;
}
.cat-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 85px; height: 75px; border: 2px solid #f0f0f0; background: white;
  border-radius: 12px; cursor: pointer; transition: all 0.2s ease; gap: 6px;
}
.cat-btn span { font-size: 0.8rem; font-weight: 600; color: #666; }
.cat-btn .icon { color: #888; width: 22px; }
.cat-btn.active {
  border-color: #E65100; background: #FFF3E0;
}
.cat-btn.active span { color: #E65100; font-weight: 700; }
.cat-btn.active .icon { color: #E65100; }

/* PRODUTOS */
.listagem-produtos { padding: 15px; }
.titulo-secao { font-size: 1.2rem; color: #212121; margin-bottom: 15px; font-weight: 700; }
.card-produto {
  background: white; border-radius: 12px; padding: 15px; margin-bottom: 12px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #f5f5f5;
}
.prod-info { flex: 1; padding-right: 15px; }
.prod-info h3 { margin: 0; font-size: 1.05rem; color: #212121; font-weight: 600; }
.prod-info .descricao { margin: 5px 0; color: #777; font-size: 0.8rem; line-height: 1.3; }
.prod-info .preco { color: #D84315; font-weight: 700; font-size: 1.1rem; display: block; margin-top: 5px; }
.btn-add {
  background: #E65100; color: white; border: none; width: 36px; height: 36px;
  border-radius: 10px; font-size: 1.3rem; font-weight: bold; cursor: pointer;
  box-shadow: 0 3px 6px rgba(230, 81, 0, 0.3);
}
.btn-add:hover { background: #D84315; }

/* BARRA FLUTUANTE */
.barra-flutuante {
  position: fixed; bottom: 15px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 30px); max-width: 450px; background: #D84315;
  height: 56px; border-radius: 14px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 20px; color: white;
  cursor: pointer; box-shadow: 0 4px 15px rgba(216, 67, 21, 0.4); z-index: 100;
}
.carrinho-resumo { display: flex; align-items: center; gap: 10px; }
.contador { background: white; color: #D84315; padding: 2px 8px; border-radius: 8px; font-weight: bold; font-size: 0.9rem; }
.texto-ver { font-weight: 600; font-size: 0.95rem; }
.valor-resumo { display: flex; align-items: center; gap: 5px; font-weight: bold; font-size: 1rem; }

/* TELA DE CARRINHO */
.tela-carrinho { padding: 20px; background: white; min-height: 100vh; }
.carrinho-header { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
.btn-voltar { background: none; border: none; color: #E65100; font-weight: bold; text-align: left; padding: 0; cursor: pointer; font-size: 0.9rem; }
.carrinho-header h2 { margin: 0; font-size: 1.4rem; color: #212121; font-weight: 800; }
.itens-selecionados { background: #fdfdfd; border: 1px solid #eee; border-radius: 12px; padding: 15px; margin-bottom: 25px; }
.item-linha { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #eee; }
.item-linha:last-child { border-bottom: none; }
.item-nome-preco h4 { margin: 0; font-size: 0.95rem; color: #212121; }
.item-nome-preco span { font-size: 0.85rem; color: #777; font-weight: 500; }
.controles-quantidade { display: flex; align-items: center; gap: 10px; }
.controles-quantidade button { width: 28px; height: 28px; border-radius: 6px; background: #f0f0f0; color: #333; font-weight: bold; border: none; cursor: pointer; }
.controles-quantidade .qtd { font-weight: bold; font-size: 0.9rem; min-width: 15px; text-align: center; }
.checkout-total { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee; font-size: 1.1rem; }
.checkout-total strong { color: #D84315; font-size: 1.2rem; }

/* FORMULÁRIO */
.checkout-form h3 { font-size: 1rem; color: #444; margin: 20px 0 10px 0; display: flex; align-items: center; gap: 8px; }
.icon-form { width: 18px; color: #E65100; }
.input-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
.input-group input:focus { border-color: #E65100; outline: none; box-shadow: 0 0 5px rgba(230,81,0,0.2); }

/* BOTÃO SUBMIT */
.btn-finalizar-pedido {
  width: 100%; margin-top: 30px; height: 50px; background: #2ecc71; border: none;
  border-radius: 10px; color: white; font-size: 1.05rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}
.btn-finalizar-pedido:hover { background: #27ae60; }
.btn-finalizar-pedido:disabled { background: #bdc3c7; cursor: not-allowed; }
</style>
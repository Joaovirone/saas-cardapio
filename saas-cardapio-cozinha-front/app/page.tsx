'use client';

import { useEffect, useState } from 'react';
import { ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { PedidoService } from '../src/services/PedidoService';
import { Pedido, StatusPedido } from '../src/domain/types';

export default function KanbanCozinha() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // 1. Busca os dados no Serviço isolado
  const carregarDados = async () => {
    const dados = await PedidoService.listarPedidos();
    setPedidos(dados);
  };

  useEffect(() => {
    carregarDados();
    // Um polling silencioso para fingir tempo real
    const timer = setInterval(carregarDados, 5000);
    return () => clearInterval(timer);
  }, []);

  // 2. Aciona a mudança através do Serviço
  const handleMudarStatus = async (id: string, novoStatus: StatusPedido) => {
    // Atualização Otimista (Muda na tela antes da API confirmar para parecer super rápido)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    
    // Confirma com o serviço real
    await PedidoService.atualizarStatus(id, novoStatus);
    carregarDados(); 
  };

  // 3. Divisão do Estado (Regras de UI)
  const recebidos = pedidos.filter(p => p.status === 'RECEBIDO');
  const emPreparo = pedidos.filter(p => p.status === 'EM_PREPARO');
  const prontos = pedidos.filter(p => p.status === 'PRONTO');

  // 4. Sub-Componente Visual Isoldado (Pode ir para um arquivo separado depois)
  const CardPedido = ({ pedido, proxStatus, textoBotao, cor, icone: Icon }: any) => (
    <div className="bg-[#1C2333] p-4 rounded-lg border border-gray-700 flex flex-col gap-3 shadow-lg">
      <div className="flex justify-between items-start border-b border-gray-700/50 pb-2">
        <div>
          <h3 className="text-white font-bold text-lg">{pedido.clienteNome}</h3>
          <span className="text-gray-400 text-xs">ID: {pedido.id} • {pedido.horario}</span>
        </div>
      </div>
      
      <ul className="text-gray-300 space-y-1 my-2">
        {pedido.itens.map((item: any) => (
          <li key={item.id} className="flex gap-2">
            <span className="text-orange-500 font-bold">{item.quantidade}x</span>
            <span>{item.nome}</span>
          </li>
        ))}
      </ul>

      {proxStatus && (
        <button 
          onClick={() => handleMudarStatus(pedido.id, proxStatus)}
          className={`w-full py-3 rounded text-white font-bold flex items-center justify-center gap-2 transition-colors ${cor}`}
        >
          <Icon size={18} /> {textoBotao}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ChefHat className="text-orange-500" /> João Lanches <span className="text-gray-500 font-light">| Dev Env</span>
        </h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[85vh]">
        {/* COLUNA 1 */}
        <section className="bg-[#161E2E] rounded-xl p-4 border border-gray-800 flex flex-col">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-400 w-5 h-5" /> NOVOS PEDIDOS ({recebidos.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {recebidos.length === 0 && <p className="text-gray-500 text-sm text-center mt-10">Nenhum pedido novo.</p>}
            {recebidos.map(p => <CardPedido key={p.id} pedido={p} proxStatus="EM_PREPARO" textoBotao="MANDAR PRA CHAPA" cor="bg-red-500/80 hover:bg-red-500" icone={ChefHat} />)}
          </div>
        </section>

        {/* COLUNA 2 */}
        <section className="bg-[#161E2E] rounded-xl p-4 border border-gray-800 flex flex-col">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <ChefHat className="text-yellow-400 w-5 h-5" /> NA COZINHA ({emPreparo.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {emPreparo.length === 0 && <p className="text-gray-500 text-sm text-center mt-10">Nenhum pedido em preparo.</p>}
            {emPreparo.map(p => <CardPedido key={p.id} pedido={p} proxStatus="PRONTO" textoBotao="FINALIZAR" cor="bg-yellow-600/80 hover:bg-yellow-600" icone={CheckCircle2} />)}
          </div>
        </section>

        {/* COLUNA 3 */}
        <section className="bg-[#161E2E] rounded-xl p-4 border border-gray-800 flex flex-col">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-400 w-5 h-5" /> PRONTOS PRA ENTREGA ({prontos.length})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {prontos.length === 0 && <p className="text-gray-500 text-sm text-center mt-10">Nenhum lanche aguardando.</p>}
            {prontos.map(p => <CardPedido key={p.id} pedido={p} proxStatus={null} cor="" />)}
          </div>
        </section>
      </main>
    </div>
  );
}
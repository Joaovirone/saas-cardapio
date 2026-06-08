"use client";

import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, ArrowRight, Loader2, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { Pedido, StatusPedido } from '../../../src/domain/types';
import { PedidoService } from '../../../src/services/PedidoService';
import { formatarHora } from '../../../src/services/formatters';

export default function CozinhaPainel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const data = await PedidoService.listarPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
    } finally {
      setCarregando(false);
    }
  };

  const moverPedido = async (id: string, statusAtual: StatusPedido) => {
    const proximoStatus: Record<StatusPedido, StatusPedido> = {
      'RECEBIDO': 'EM_PREPARO',
      'EM_PREPARO': 'PRONTO',
      'PRONTO': 'PRONTO'
    };

    const novoStatus = proximoStatus[statusAtual];
    if (novoStatus === statusAtual) return;

    setAtualizandoId(id);
    try {
      await PedidoService.atualizarStatus(id, novoStatus);
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    } finally {
      setAtualizandoId(null);
    }
  };

  const pedidosRecebidos = pedidos.filter(p => p.status === 'RECEBIDO');
  const pedidosEmPreparo = pedidos.filter(p => p.status === 'EM_PREPARO');
  const pedidosProntos = pedidos.filter(p => p.status === 'PRONTO');

  if (carregando) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabeçalho no padrão Premium */}
      <div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
          Operação da <span className="text-orange-600">Cozinha</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">Controle o fluxo de produção em tempo real.</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA 1: NOVOS */}
        <div className="bg-zinc-50 rounded-[32px] p-6 border border-zinc-100 shadow-sm min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-zinc-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              Novos Pedidos
            </h2>
            <span className="bg-white border border-zinc-200 text-zinc-800 font-black px-3 py-1 rounded-full text-sm shadow-sm">
              {pedidosRecebidos.length}
            </span>
          </div>
          <div className="space-y-4">
            {pedidosRecebidos.map(pedido => (
              <CardPedido key={pedido.id} pedido={pedido} onMover={moverPedido} loading={atualizandoId === pedido.id} corBotao="bg-zinc-900 hover:bg-black text-white" textoBotao="Começar Preparo" />
            ))}
            {pedidosRecebidos.length === 0 && <MensagemVazia texto="Nenhum pedido novo" />}
          </div>
        </div>

        {/* COLUNA 2: NA CHAPA */}
        <div className="bg-orange-50/50 rounded-[32px] p-6 border border-orange-100 shadow-sm min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-orange-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />
              Na Chapa (Preparo)
            </h2>
            <span className="bg-white border border-orange-200 text-orange-600 font-black px-3 py-1 rounded-full text-sm shadow-sm">
              {pedidosEmPreparo.length}
            </span>
          </div>
          <div className="space-y-4">
            {pedidosEmPreparo.map(pedido => (
              <CardPedido key={pedido.id} pedido={pedido} onMover={moverPedido} loading={atualizandoId === pedido.id} corBotao="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20" textoBotao="Marcar como Pronto" iconeBotao={<CheckCircle2 size={18} />} />
            ))}
            {pedidosEmPreparo.length === 0 && <MensagemVazia texto="Cozinha livre" />}
          </div>
        </div>

        {/* COLUNA 3: PRONTOS */}
        <div className="bg-green-50/50 rounded-[32px] p-6 border border-green-100 shadow-sm min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-green-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Prontos p/ Retirada
            </h2>
            <span className="bg-white border border-green-200 text-green-600 font-black px-3 py-1 rounded-full text-sm shadow-sm">
              {pedidosProntos.length}
            </span>
          </div>
          <div className="space-y-4">
            {pedidosProntos.map(pedido => (
              <div key={pedido.id} className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500" />
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-zinc-900 text-xl">#{pedido.pedidoId?.split('-')[1] || pedido.id}</span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">NO PAINEL</div>
                </div>
                <p className="font-medium text-zinc-500">{pedido.clienteNome}</p>
              </div>
            ))}
            {pedidosProntos.length === 0 && <MensagemVazia texto="Nenhum pedido aguardando" />}
          </div>
        </div>

      </div>
    </div>
  );
}

function CardPedido({ pedido, onMover, loading, corBotao, textoBotao, iconeBotao }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-5">
        <div>
          <span className="bg-zinc-100 text-zinc-600 text-xs font-black px-2.5 py-1 rounded-md tracking-wider">
            #{pedido.pedidoId?.split('-')[1] || pedido.id}
          </span>
          <h3 className="font-bold text-zinc-900 mt-3 text-lg leading-tight">{pedido.clienteNome}</h3>
        </div>
        {pedido.dataCriacao && (
          <div className="flex items-center text-zinc-400 text-xs font-bold bg-zinc-50 px-2 py-1 rounded-md">
            <Clock size={12} className="mr-1" />
            {formatarHora(pedido.dataCriacao)}
          </div>
        )}
      </div>

      <div className="space-y-2.5 mb-6 border-t border-dashed border-zinc-200 pt-5">
        {pedido.itens.map((item: any, index: number) => (
          <div key={index} className="flex items-start text-sm font-medium text-zinc-700">
            <span className="text-orange-600 font-black mr-3 bg-orange-50 px-2 py-0.5 rounded text-xs">{item.quantidade}x</span>
            <span className="leading-snug">{item.nome}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onMover(pedido.id, pedido.status)}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 ${corBotao}`}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : (
          <>
            {textoBotao}
            {iconeBotao || <ArrowRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
}

function MensagemVazia({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
      <ChefHat size={32} className="mb-3 opacity-20" />
      <p className="font-bold text-sm tracking-wide">{texto}</p>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { MonitorPlay, BellRing, ChefHat, CheckCircle2, Loader2 } from 'lucide-react';
import { Pedido } from '../../../src/domain/types';
import { PedidoService } from '../../../src/services/PedidoService';

export default function PainelRetirada() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const data = await PedidoService.listarPedidos();
      setPedidos(data);
      setLoading(false);
    };
    carregar();
    const interval = setInterval(carregar, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  const preparando = pedidos.filter(p => p.status === 'EM_PREPARO');
  const prontos = pedidos.filter(p => p.status === 'PRONTO');

  if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-950"><Loader2 className="animate-spin text-orange-500" size={60} /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-8 font-sans text-white animate-in fade-in duration-700">
      
      {/* Header do Painel */}
      <div className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-6">
          <div className="bg-orange-600 p-4 rounded-3xl shadow-lg shadow-orange-600/20">
            <MonitorPlay size={48} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter">PAINEL DE <span className="text-orange-500">RETIRADA</span></h1>
            <p className="text-zinc-500 text-xl font-medium uppercase tracking-widest mt-1">Acompanhe seu pedido pelo número</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black text-zinc-800">VIRONE</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 h-[70vh]">
        
        {/* Coluna Preparando */}
        <div className="bg-zinc-900/50 rounded-[40px] border border-zinc-800 p-10 flex flex-col">
          <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-6">
            <ChefHat className="text-zinc-500" size={40} />
            <h2 className="text-4xl font-bold text-zinc-400">PREPARANDO...</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 overflow-y-auto">
            {preparando.map(p => (
              <div key={p.id} className="bg-zinc-800/50 py-8 rounded-3xl text-center border border-zinc-700/50">
                <span className="text-6xl font-black text-zinc-500">#{p.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Pronto (Destaque Total) */}
        <div className="bg-orange-600 rounded-[40px] p-10 flex flex-col shadow-2xl shadow-orange-600/20 animate-pulse">
          <div className="flex items-center gap-4 mb-10 border-b border-orange-500 pb-6">
            <BellRing className="text-white" size={40} />
            <h2 className="text-4xl font-bold text-white">PRONTO!</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 overflow-y-auto">
            {prontos.map(p => (
              <div key={p.id} className="bg-white py-10 rounded-3xl text-center shadow-xl">
                <span className="text-8xl font-black text-orange-600">#{p.id}</span>
                <p className="text-zinc-900 font-black text-2xl mt-2 uppercase">{p.clienteNome.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 text-center text-zinc-600 font-bold text-xl flex items-center justify-center gap-4">
        <CheckCircle2 /> OBRIGADO PELA PREFERÊNCIA! BOM APETITE!
      </div>
    </div>
  );
}
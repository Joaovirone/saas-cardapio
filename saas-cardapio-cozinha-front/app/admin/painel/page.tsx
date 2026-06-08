// app/admin/painel/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ChefHat, ShoppingBag, MonitorPlay, ArrowRight } from 'lucide-react';

export default function PainelDashboard() {
  const modulos = [
    {
      titulo: 'Operação da Cozinha',
      descricao: 'Visualize os pedidos em tempo real, gerencie a fila de preparo e marque lanches como prontos.',
      icone: ChefHat,
      cor: 'from-orange-500 to-orange-600',
      sombra: 'shadow-orange-500/30',
      link: '/admin/cozinha'
    },
    {
      titulo: 'Painel de Retirada',
      descricao: 'Tela dedicada para clientes acompanharem os números dos pedidos que estão prontos no balcão.',
      icone: MonitorPlay,
      cor: 'from-zinc-800 to-zinc-900', 
      sombra: 'shadow-zinc-900/30',
      link: '/admin/retirada'
    },
    {
      titulo: 'Gestão de Cardápio',
      descricao: 'Cadastre novos lanches, atualize preços, adicione fotos e pause produtos esgotados.',
      icone: ShoppingBag,
      cor: 'from-amber-500 to-amber-600',
      sombra: 'shadow-amber-500/30',
      link: '/admin/produtos'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Comando</span></h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">Selecione um módulo abaixo para gerenciar a operação da lanchonete.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo, index) => (
          <Link href={modulo.link} key={index}>
            <div className={`
              group relative flex flex-col h-full bg-white rounded-3xl p-8 border border-zinc-100
              hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden
            `}>
              <div className={`absolute inset-0 bg-gradient-to-br ${modulo.cor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg
                bg-gradient-to-br ${modulo.cor} ${modulo.sombra} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
              `}>
                <modulo.icone size={32} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">{modulo.titulo}</h2>
              <p className="text-zinc-500 font-medium leading-relaxed flex-1">{modulo.descricao}</p>
              <div className="mt-8 flex items-center text-sm font-bold text-orange-600 group-hover:text-orange-700">
                Acessar Módulo
                <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
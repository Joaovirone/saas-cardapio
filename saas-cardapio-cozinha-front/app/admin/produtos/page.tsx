"use client";

import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Filter, Edit3, Trash2, Eye, LayoutGrid, List } from 'lucide-react';
import { mockProdutos } from '../../../src/services/mockData';
import { formatarMoeda } from '../../../src/services/formatters';

export default function GestaoProdutos() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header e Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900">Gestão do <span className="text-orange-600">Cardápio</span></h1>
          <p className="text-zinc-500 font-medium">Controle seus lanches, preços e disponibilidade.</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-1">
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Itens" value={mockProdutos.length} color="orange" />
        <StatCard title="Ativos agora" value={mockProdutos.filter(p => p.disponivel).length} color="green" />
        <StatCard title="Esgotados" value={mockProdutos.filter(p => !p.disponivel).length} color="red" />
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar lanche pelo nome..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 border-none focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-100 p-3 rounded-xl text-zinc-600 hover:bg-zinc-200"><Filter size={20} /></button>
          <button className="bg-zinc-900 p-3 rounded-xl text-white"><LayoutGrid size={20} /></button>
        </div>
      </div>

      {/* Tabela de Produtos Premium */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="px-8 py-5 text-zinc-500 font-bold uppercase text-xs">Produto</th>
              <th className="px-8 py-5 text-zinc-500 font-bold uppercase text-xs">Categoria</th>
              <th className="px-8 py-5 text-zinc-500 font-bold uppercase text-xs">Preço</th>
              <th className="px-8 py-5 text-zinc-500 font-bold uppercase text-xs">Status</th>
              <th className="px-8 py-5 text-zinc-500 font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {mockProdutos.map(produto => (
              <tr key={produto.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                      {/* Em produção usaríamos o imageUrl do produto */}
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                        {produto.nome[0]}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{produto.nome}</p>
                      <p className="text-xs text-zinc-400 max-w-[200px] truncate">{produto.descricao}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 font-medium text-zinc-600">{produto.categoria}</td>
                <td className="px-8 py-5 font-black text-zinc-900">{formatarMoeda(produto.preco)}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${produto.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {produto.disponivel ? 'DISPONÍVEL' : 'ESGOTADO'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2.5 rounded-xl bg-zinc-50 text-zinc-600 hover:bg-orange-100 hover:text-orange-600 transition-all"><Edit3 size={18} /></button>
                    <button className="p-2.5 rounded-xl bg-zinc-50 text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  const colors: any = {
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    red: 'text-red-600 bg-red-50 border-red-100'
  };
  return (
    <div className={`p-8 rounded-[32px] border ${colors[color]} flex flex-col justify-between`}>
      <p className="font-bold text-sm uppercase tracking-widest opacity-70">{title}</p>
      <p className="text-5xl font-black mt-4">{value}</p>
    </div>
  );
}
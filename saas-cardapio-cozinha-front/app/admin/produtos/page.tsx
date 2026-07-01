"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, LayoutGrid } from 'lucide-react';
import { Produto, ProdutoRequest } from '../../../src/domain/types';
import { ProdutoService } from '../../../src/services/ProdutoService';
import { formatarMoeda } from '../../../src/services/formatters';

const produtoInicial: ProdutoRequest = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  imageUrl: undefined,
  disponivel: true,
  adicionais: [],
};

export default function GestaoProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState<ProdutoRequest>(produtoInicial);
  const [precoTexto, setPrecoTexto] = useState('0,00');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const categoriasDisponiveis = ['Lanches', 'Bebidas', 'Porções', 'Combos', 'Gelados', 'Sobremesas'];

  const formatarPrecoTexto = (valor: string) => {
    const apenasNumeros = valor.replace(/[^0-9]/g, '');
    const numero = Number(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePrecoChange = (valor: string) => {
    const apenasNumeros = valor.replace(/[^0-9]/g, '');
    const numero = Number(apenasNumeros) / 100;
    setPrecoTexto(valor ? formatarPrecoTexto(valor) : '0,00');
    setForm(prev => ({ ...prev, preco: numero }));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setErro('');
    setLoading(true);

    try {
      const produtosApi = await ProdutoService.listarProdutos();
      setProdutos(produtosApi);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErro('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProdutoRequest, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'preco' ? Number(value) : value,
    }));
  };

  const handleSalvar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');

    if (!form.nome.trim() || !form.descricao.trim() || !form.categoria.trim() || form.preco <= 0) {
      setErro('Preencha nome, descrição, categoria e preço corretamente.');
      return;
    }

    setSalvando(true);

    try {
      const produtoCriado = await ProdutoService.criarProduto({
        ...form,
        preco: Number(form.preco),
        imageUrl: form.imageUrl?.trim() || undefined,
        adicionais: [],
      });
      setProdutos(prev => [produtoCriado, ...prev]);
      setForm(produtoInicial);
      setPrecoTexto('0,00');
      setFormAberto(false);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao cadastrar o produto.';
      console.error('Erro ao criar produto:', error);
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const totais = useMemo(
    () => ({
      total: produtos.length,
      ativos: produtos.filter(p => p.disponivel).length,
      esgotados: produtos.filter(p => !p.disponivel).length,
    }),
    [produtos]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900">Gestão do <span className="text-orange-600">Cardápio</span></h1>
          <p className="text-zinc-500 font-medium">Controle seus produtos, preços e disponibilidade.</p>
        </div>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-1"
          onClick={() => setFormAberto(prev => !prev)}
        >
          <Plus size={20} /> {formAberto ? 'Fechar' : 'Novo Produto'}
        </button>
      </div>

      {formAberto && (
        <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Cadastrar novo produto</h2>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSalvar}>
            <label className="block">
              <span className="text-zinc-900 font-semibold">Nome</span>
              <input
                className="mt-2 w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                value={form.nome}
                onChange={e => handleChange('nome', e.target.value)}
                placeholder="Ex: X-Burger Explosão"
              />
            </label>

            <label className="block">
              <span className="text-zinc-900 font-semibold">Categoria</span>
              <select
                className="mt-2 w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                value={form.categoria}
                onChange={e => handleChange('categoria', e.target.value)}
              >
                <option value="" disabled>Selecione a categoria</option>
                {categoriasDisponiveis.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-zinc-900 font-semibold">Descrição</span>
              <textarea
                className="mt-2 w-full min-h-[120px] rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                value={form.descricao}
                onChange={e => handleChange('descricao', e.target.value)}
                placeholder="Descreva o produto para facilitar a escolha do cliente"
              />
            </label>

            <label className="block">
              <span className="text-zinc-900 font-semibold">Preço</span>
              <input
                type="text"
                inputMode="decimal"
                className="mt-2 w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                value={precoTexto}
                onChange={e => handlePrecoChange(e.target.value)}
                placeholder="0,00"
              />
            </label>

            <label className="block">
              <span className="text-zinc-900 font-semibold">Imagem (URL)</span>
              <input
                className="mt-2 w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                value={form.imageUrl || ''}
                onChange={e => handleChange('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-zinc-900 font-semibold">Disponibilidade</span>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, disponivel: true }))}
                  className={`rounded-full px-6 py-3 font-semibold transition ${form.disponivel ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  Disponível
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, disponivel: false }))}
                  className={`rounded-full px-6 py-3 font-semibold transition ${!form.disponivel ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  Esgotado
                </button>
              </div>
            </label>

            <div className="md:col-span-2 flex flex-col gap-3 pt-2">
              {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
              <button
                type="submit"
                disabled={salvando}
                className="inline-flex items-center justify-center rounded-3xl bg-orange-600 px-6 py-4 text-white font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                {salvando ? 'Salvando...' : 'Salvar produto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Itens" value={totais.total} color="orange" />
        <StatCard title="Ativos agora" value={totais.ativos} color="green" />
        <StatCard title="Esgotados" value={totais.esgotados} color="red" />
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Produtos cadastrados</h2>
            <p className="text-zinc-500">{loading ? 'Carregando produtos...' : `${produtos.length} produtos disponíveis`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-zinc-100 p-3 rounded-xl text-zinc-600 hover:bg-zinc-200"><Search size={20} /></button>
            <button className="bg-zinc-900 p-3 rounded-xl text-white"><LayoutGrid size={20} /></button>
          </div>
        </div>

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
            {produtos.map(produto => (
              <tr key={produto.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                      {produto.imageUrl ? (
                        <img src={produto.imageUrl} alt={produto.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                          {produto.nome[0]}
                        </div>
                      )}
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
            {!loading && produtos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-zinc-500">Nenhum produto encontrado.</td>
              </tr>
            )}
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
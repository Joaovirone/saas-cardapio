'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { Produto, ProdutoRequest } from '../../../src/domain/types';
import { ProdutoService } from '../../../src/services/ProdutoService';
import { formatarMoeda } from '../../../src/services/formatters';

const produtoVazio: ProdutoRequest = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  imageUrl: '',
  disponivel: true,
  adicionais: [],
};

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<ProdutoRequest>(produtoVazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const dados = await ProdutoService.listarProdutos();
      setProdutos(dados);
      setErro(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    const carregarInicial = async () => {
      try {
        const dados = await ProdutoService.listarProdutos();
        if (ativo) {
          setProdutos(dados);
          setErro(null);
        }
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : 'Erro ao carregar produtos');
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    void carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((produto) =>
      [produto.nome, produto.categoria, produto.descricao].some((valor) => valor?.toLowerCase().includes(termo)),
    );
  }, [busca, produtos]);

  const categorias = useMemo(() => new Set(produtos.map((produto) => produto.categoria).filter(Boolean)).size, [produtos]);

  const resetForm = () => {
    setForm(produtoVazio);
    setEditandoId(null);
  };

  const handleEditar = (produto: Produto) => {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      imageUrl: produto.imageUrl || '',
      disponivel: produto.disponivel,
      adicionais: produto.adicionais || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setMensagem(null);

    if (!form.nome.trim() || !form.categoria.trim() || form.preco <= 0) {
      setErro('Preencha nome, categoria e preco maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      if (editandoId) {
        await ProdutoService.atualizarProduto(editandoId, form);
        setMensagem('Produto atualizado.');
      } else {
        await ProdutoService.criarProduto(form);
        setMensagem('Produto cadastrado.');
      }
      resetForm();
      await carregarProdutos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar produto');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (produto: Produto) => {
    const confirmou = window.confirm(`Excluir "${produto.nome}" do cardapio?`);
    if (!confirmou) return;

    try {
      await ProdutoService.deletarProduto(produto.id);
      setMensagem('Produto removido.');
      await carregarProdutos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao remover produto');
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#161A1D]">
      <header className="border-b border-[#DDE1E6] bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold text-[#C2410C]">ADMIN</p>
            <h1 className="text-2xl font-black">Cardapio e produtos</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link className="rounded border border-[#D1D5DB] px-3 py-2 hover:border-[#F97316]" href="/">
              Inicio
            </Link>
            <Link className="rounded border border-[#D1D5DB] px-3 py-2 hover:border-[#F97316]" href="/cozinha">
              Cozinha
            </Link>
            <Link className="rounded border border-[#D1D5DB] px-3 py-2 hover:border-[#F97316]" href="/login">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="self-start rounded-lg border border-[#DDE1E6] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">{editandoId ? 'Editar produto' : 'Novo produto'}</h2>
            {editandoId && (
              <button type="button" onClick={resetForm} className="rounded p-2 text-[#5C6670] hover:bg-[#F1F3F5]">
                <X size={18} />
              </button>
            )}
          </div>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-bold">Nome</span>
            <input
              className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
              value={form.nome}
              onChange={(event) => setForm((atual) => ({ ...atual, nome: event.target.value }))}
              placeholder="X-Bacon"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-bold">Descricao</span>
            <textarea
              className="min-h-24 w-full rounded border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#F97316]"
              value={form.descricao}
              onChange={(event) => setForm((atual) => ({ ...atual, descricao: event.target.value }))}
              placeholder="Ingredientes, tamanho e observacoes"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-bold">Preco</span>
              <input
                className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
                type="number"
                min="0"
                step="0.01"
                value={form.preco || ''}
                onChange={(event) => setForm((atual) => ({ ...atual, preco: Number(event.target.value) }))}
                placeholder="25.90"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-bold">Categoria</span>
              <input
                className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
                value={form.categoria}
                onChange={(event) => setForm((atual) => ({ ...atual, categoria: event.target.value }))}
                placeholder="Lanches"
              />
            </label>
          </div>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-bold">Imagem URL</span>
            <input
              className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
              value={form.imageUrl}
              onChange={(event) => setForm((atual) => ({ ...atual, imageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label className="mb-5 flex items-center justify-between rounded border border-[#DDE1E6] px-3 py-3">
            <span className="text-sm font-bold">Disponivel para venda</span>
            <input
              type="checkbox"
              checked={form.disponivel}
              onChange={(event) => setForm((atual) => ({ ...atual, disponivel: event.target.checked }))}
              className="h-5 w-5 accent-[#F97316]"
            />
          </label>

          {erro && <p className="mb-3 rounded bg-[#FEF2F2] px-3 py-2 text-sm font-semibold text-[#B91C1C]">{erro}</p>}
          {mensagem && <p className="mb-3 rounded bg-[#F0FDF4] px-3 py-2 text-sm font-semibold text-[#15803D]">{mensagem}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#F97316] px-4 text-sm font-bold text-white transition hover:bg-[#EA580C] disabled:opacity-60"
          >
            {salvando ? <RefreshCw className="animate-spin" size={17} /> : editandoId ? <Save size={17} /> : <Plus size={17} />}
            {editandoId ? 'Salvar alteracoes' : 'Cadastrar produto'}
          </button>
        </form>

        <section className="rounded-lg border border-[#DDE1E6] bg-white p-5 shadow-sm">
          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <input
              className="h-11 rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome, categoria ou descricao"
            />
            <span className="rounded bg-[#F1F3F5] px-3 py-2 text-sm font-bold">{produtos.length} produtos</span>
            <span className="rounded bg-[#F1F3F5] px-3 py-2 text-sm font-bold">{categorias} categorias</span>
          </div>

          {carregando ? (
            <div className="flex h-64 items-center justify-center gap-3 text-[#5C6670]">
              <RefreshCw className="animate-spin" size={18} />
              Carregando produtos...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DDE1E6] text-[#5C6670]">
                    <th className="py-3 pr-3">Produto</th>
                    <th className="py-3 pr-3">Categoria</th>
                    <th className="py-3 pr-3">Preco</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 text-right">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto) => (
                    <tr key={produto.id} className="border-b border-[#EEF0F3]">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-14 overflow-hidden rounded bg-[#F1F3F5]">
                            {produto.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={produto.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-bold">{produto.nome}</p>
                            <p className="line-clamp-1 max-w-[320px] text-xs text-[#5C6670]">{produto.descricao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">{produto.categoria}</td>
                      <td className="py-3 pr-3 font-bold">{formatarMoeda(produto.preco)}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${produto.disponivel ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                          <Check size={13} />
                          {produto.disponivel ? 'Disponivel' : 'Pausado'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => handleEditar(produto)} className="rounded border border-[#D1D5DB] p-2 hover:border-[#F97316]">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => void handleExcluir(produto)} className="rounded border border-[#D1D5DB] p-2 text-[#B91C1C] hover:border-[#B91C1C]">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {produtosFiltrados.length === 0 && (
                <p className="py-10 text-center text-sm text-[#5C6670]">Nenhum produto encontrado.</p>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

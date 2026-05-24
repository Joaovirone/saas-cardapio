'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChefHat, RefreshCw } from 'lucide-react';
import { Pedido, StatusPedido } from '../../src/domain/types';
import { PedidoService } from '../../src/services/PedidoService';
import { formatarHora, formatarMoeda } from '../../src/services/formatters';

const colunas: Array<{
  status: StatusPedido;
  titulo: string;
  Icone: typeof AlertCircle;
  cor: string;
  proximo?: StatusPedido;
  acao?: string;
}> = [
  { status: 'RECEBIDO', titulo: 'Novos pedidos', Icone: AlertCircle, cor: 'text-[#DC2626]', proximo: 'EM_PREPARO', acao: 'Mandar para preparo' },
  { status: 'EM_PREPARO', titulo: 'Na cozinha', Icone: ChefHat, cor: 'text-[#CA8A04]', proximo: 'PRONTO', acao: 'Finalizar pedido' },
  { status: 'PRONTO', titulo: 'Prontos', Icone: CheckCircle2, cor: 'text-[#16A34A]' },
];

function CardPedido({
  pedido,
  proximo,
  acao,
  aoMudarStatus,
}: {
  pedido: Pedido;
  proximo?: StatusPedido;
  acao?: string;
  aoMudarStatus: (id: string, status: StatusPedido) => void;
}) {
  return (
    <article className="rounded-lg border border-[#263244] bg-[#111827] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-[#263244] pb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{pedido.clienteNome}</h3>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            #{pedido.id.slice(0, 8)} • {formatarHora(pedido.dataCriacao)}
          </p>
        </div>
        <span className="rounded bg-[#1F2937] px-2 py-1 text-xs font-bold text-[#F97316]">
          {formatarMoeda(pedido.valorTotal)}
        </span>
      </div>

      <ul className="my-4 space-y-2 text-sm text-[#D1D5DB]">
        {pedido.itens.length === 0 && <li>Itens indisponiveis neste pedido.</li>}
        {pedido.itens.map((item, index) => (
          <li key={`${pedido.id}-${item.nome}-${index}`} className="flex gap-2">
            <span className="font-bold text-[#F97316]">{item.quantidade}x</span>
            <span>{item.nome}</span>
          </li>
        ))}
      </ul>

      {proximo && acao && (
        <button
          type="button"
          onClick={() => aoMudarStatus(pedido.id, proximo)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#F97316] px-3 text-sm font-bold text-white transition hover:bg-[#EA580C]"
        >
          {acao}
          <ArrowRight size={17} />
        </button>
      )}
    </article>
  );
}

export default function CozinhaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const dados = await PedidoService.listarPedidos();
        if (ativo) {
          setPedidos(dados);
          setErro(null);
        }
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : 'Erro ao carregar pedidos');
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    void carregar();
    const timer = window.setInterval(() => void carregar(), 5000);

    return () => {
      ativo = false;
      window.clearInterval(timer);
    };
  }, []);

  const pedidosPorStatus = useMemo(
    () => ({
      RECEBIDO: pedidos.filter((pedido) => pedido.status === 'RECEBIDO'),
      EM_PREPARO: pedidos.filter((pedido) => pedido.status === 'EM_PREPARO'),
      PRONTO: pedidos.filter((pedido) => pedido.status === 'PRONTO'),
    }),
    [pedidos],
  );

  const handleMudarStatus = async (id: string, novoStatus: StatusPedido) => {
    const estadoAnterior = pedidos;
    setPedidos((atuais) => atuais.map((pedido) => (pedido.id === id ? { ...pedido, status: novoStatus } : pedido)));

    try {
      await PedidoService.atualizarStatus(id, novoStatus);
    } catch (error) {
      setPedidos(estadoAnterior);
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar status');
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1220] p-4 text-white md:p-6">
      <header className="mb-6 flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-[#F97316]">VIRONE LANCHES</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold">
            <ChefHat className="text-[#F97316]" /> Cozinha
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link className="rounded border border-[#334155] px-3 py-2 text-[#CBD5E1] hover:border-[#F97316]" href="/">
            Inicio
          </Link>
          <Link className="rounded border border-[#334155] px-3 py-2 text-[#CBD5E1] hover:border-[#F97316]" href="/painel">
            Painel
          </Link>
          <Link className="rounded border border-[#334155] px-3 py-2 text-[#CBD5E1] hover:border-[#F97316]" href="/admin/produtos">
            Admin
          </Link>
        </nav>
      </header>

      {erro && (
        <div className="mb-4 rounded-lg border border-[#7F1D1D] bg-[#450A0A] px-4 py-3 text-sm text-[#FECACA]">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="flex h-[60vh] items-center justify-center gap-3 text-[#CBD5E1]">
          <RefreshCw className="animate-spin" size={20} />
          Carregando pedidos...
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {colunas.map(({ status, titulo, Icone, cor, proximo, acao }) => (
            <div key={status} className="flex min-h-[72vh] flex-col rounded-lg border border-[#1F2937] bg-[#0F172A] p-4">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-normal text-[#E5E7EB]">
                <Icone className={cor} size={19} />
                {titulo} ({pedidosPorStatus[status].length})
              </h2>
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {pedidosPorStatus[status].length === 0 && (
                  <p className="mt-10 text-center text-sm text-[#64748B]">Nenhum pedido nesta etapa.</p>
                )}
                {pedidosPorStatus[status].map((pedido) => (
                  <CardPedido
                    key={pedido.id}
                    pedido={pedido}
                    proximo={proximo}
                    acao={acao}
                    aoMudarStatus={handleMudarStatus}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

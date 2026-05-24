'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { MonitorUp, RefreshCw } from 'lucide-react';
import { Pedido } from '../../src/domain/types';
import { PedidoService } from '../../src/services/PedidoService';
import { formatarHora } from '../../src/services/formatters';

export default function PainelPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const dados = await PedidoService.listarPedidos();
        if (ativo) setPedidos(dados);
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

  const prontos = useMemo(
    () => pedidos.filter((pedido) => pedido.status === 'PRONTO').slice(0, 8),
    [pedidos],
  );

  const destaque = prontos[0];

  return (
    <main className="min-h-screen bg-[#101114] text-white">
      <header className="flex items-center justify-between border-b border-[#2A2D34] px-8 py-5">
        <div>
          <p className="text-sm font-bold text-[#F97316]">VIRONE LANCHES</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-black">
            <MonitorUp className="text-[#F97316]" size={32} />
            Retirada de pedidos
          </h1>
        </div>
        <Link className="rounded border border-[#3F4652] px-4 py-2 text-sm font-semibold text-[#D1D5DB]" href="/cozinha">
          Cozinha
        </Link>
      </header>

      {carregando ? (
        <div className="flex h-[70vh] items-center justify-center gap-3 text-2xl text-[#CBD5E1]">
          <RefreshCw className="animate-spin" />
          Carregando
        </div>
      ) : (
        <section className="grid min-h-[calc(100vh-93px)] grid-cols-1 gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center rounded-lg border border-[#2A2D34] bg-[#181B20] p-10">
            <p className="text-2xl font-bold uppercase text-[#F97316]">Pedido pronto</p>
            {destaque ? (
              <>
                <strong className="mt-6 block text-[clamp(4rem,12vw,10rem)] leading-none">
                  #{destaque.id.slice(0, 6).toUpperCase()}
                </strong>
                <span className="mt-6 text-[clamp(2rem,5vw,4rem)] font-black">{destaque.clienteNome}</span>
                <span className="mt-4 text-2xl text-[#A8B0BD]">Pronto desde {formatarHora(destaque.dataCriacao)}</span>
              </>
            ) : (
              <p className="mt-8 max-w-xl text-4xl font-bold leading-tight text-[#A8B0BD]">
                Nenhum pedido pronto no momento.
              </p>
            )}
          </div>

          <aside className="rounded-lg border border-[#2A2D34] bg-[#181B20] p-6">
            <h2 className="mb-5 text-2xl font-black">Proximos prontos</h2>
            <div className="space-y-3">
              {prontos.slice(1).length === 0 && (
                <p className="rounded bg-[#20242B] p-4 text-[#A8B0BD]">Aguardando novos pedidos finalizados.</p>
              )}
              {prontos.slice(1).map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between rounded bg-[#20242B] p-4">
                  <div>
                    <p className="text-2xl font-black">#{pedido.id.slice(0, 6).toUpperCase()}</p>
                    <p className="text-lg text-[#CBD5E1]">{pedido.clienteNome}</p>
                  </div>
                  <span className="text-sm text-[#A8B0BD]">{formatarHora(pedido.dataCriacao)}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

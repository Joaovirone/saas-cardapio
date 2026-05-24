import Link from 'next/link';
import { ChefHat, ClipboardList, MonitorUp, ShieldCheck } from 'lucide-react';

const atalhos = [
  {
    href: '/cozinha',
    titulo: 'Cozinha',
    descricao: 'Avance pedidos de recebidos para preparo e prontos.',
    Icone: ChefHat,
  },
  {
    href: '/painel',
    titulo: 'Painel de Retirada',
    descricao: 'Tela para TV ou monitor chamando pedidos prontos.',
    Icone: MonitorUp,
  },
  {
    href: '/admin/produtos',
    titulo: 'Produtos',
    descricao: 'Cadastre lanches, preços, imagens e disponibilidade.',
    Icone: ClipboardList,
  },
  {
    href: '/login',
    titulo: 'Login Admin',
    descricao: 'Entre como dono ou funcionário autorizado.',
    Icone: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#161A1D]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-col gap-2 border-b border-[#DDE1E6] pb-6">
          <p className="text-sm font-semibold text-[#C2410C]">VIRONE LANCHES</p>
          <h1 className="text-3xl font-bold tracking-normal">Painel do estabelecimento</h1>
          <p className="max-w-2xl text-sm leading-6 text-[#5C6670]">
            Operacao web para cozinha, chamada de pedidos e gestao do cardapio.
          </p>
        </header>

        <div className="grid flex-1 content-start gap-4 py-8 sm:grid-cols-2">
          {atalhos.map(({ href, titulo, descricao, Icone }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-[#DDE1E6] bg-white p-5 shadow-sm transition hover:border-[#F97316] hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFF3E8] text-[#C2410C]">
                <Icone size={22} />
              </div>
              <h2 className="text-lg font-bold">{titulo}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5C6670]">{descricao}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

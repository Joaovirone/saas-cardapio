'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { AuthService } from '../../src/services/AuthService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await AuthService.login(email, senha);
      window.location.href = '/admin/produtos';
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Nao foi possivel entrar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F7F8FA] px-5 text-[#161A1D]">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-[#DDE1E6] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFF3E8] text-[#C2410C]">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#C2410C]">VIRONE LANCHES</p>
            <h1 className="text-2xl font-black">Login admin</h1>
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-bold">E-mail</span>
          <input
            className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@lanchonete.com"
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1 block text-sm font-bold">Senha</span>
          <input
            className="h-11 w-full rounded border border-[#D1D5DB] px-3 outline-none focus:border-[#F97316]"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Sua senha"
          />
        </label>

        {erro && <p className="mb-4 rounded bg-[#FEF2F2] px-3 py-2 text-sm font-semibold text-[#B91C1C]">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#F97316] text-sm font-bold text-white transition hover:bg-[#EA580C] disabled:opacity-60"
        >
          <LogIn size={17} />
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-[#C2410C]">
          Voltar para inicio
        </Link>
      </form>
    </main>
  );
}

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../src/services/api';
import { ChefHat, Loader2, LockKeyhole, Terminal } from 'lucide-react';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post<{ token: string }>('/auth/login', { email, senha });
      window.localStorage.setItem('@SaaS_Token', response.token);
      router.push('/admin/painel'); 
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Credenciais inválidas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-center relative overflow-hidden">
            <ChefHat className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 transform -rotate-12" />
            <div className="mx-auto bg-white shadow-lg w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <LockKeyhole size={30} className="text-orange-600" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight relative z-10">VIRONE</h1>
            <p className="text-orange-100 font-medium tracking-widest text-sm mt-1 relative z-10 uppercase">Gestão de Lanches</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2 justify-center">
              <Terminal size={14} /> Ambiente conectado a API
            </div>

            {erro && <div className="bg-red-50/80 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 text-center animate-bounce">{erro}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Usuário</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="digite seu email" className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-500 font-medium focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Senha de Acesso</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="digite sua senha" className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-500 font-medium focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all" required />
              </div>
            </div>

            <button type="submit" disabled={carregando} className="w-full bg-zinc-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center group disabled:opacity-70 shadow-lg shadow-zinc-900/30">
              {carregando ? <Loader2 className="animate-spin" size={24} /> : <>Entrar no Sistema <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
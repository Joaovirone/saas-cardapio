"use client"; // Como usamos hooks do React (useEffect), o layout precisa ser client-side

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../src/components/Sidebar'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    // Verifica se o token existe ao carregar qualquer tela do /admin
    const token = window.localStorage.getItem('@SaaS_Token');
    
    if (!token) {
      router.push('/login'); // Expulsa para o login
    } else {
      setAutorizado(true); // Libera o acesso
    }
  }, [router]);

  // Enquanto verifica, não mostra nada (evita piscar a tela do admin)
  if (!autorizado) return null; 

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
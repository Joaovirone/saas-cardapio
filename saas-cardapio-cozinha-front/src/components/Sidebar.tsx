"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, ChefHat, ShoppingBag, MonitorPlay, 
  LogOut, Menu, X, ChevronRight 
} from 'lucide-react';

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { nome: 'Dashboard', icon: LayoutDashboard, href: '/admin/painel' },
    { nome: 'Cozinha', icon: ChefHat, href: '/admin/cozinha' },
    { nome: 'Produtos', icon: ShoppingBag, href: '/admin/produtos' },
    { nome: 'Retirada', icon: MonitorPlay, href: '/admin/retirada' },
  ];

  const handleLogout = () => {
    window.localStorage.removeItem('@SaaS_Token');
    router.push('/login');
  };

  return (
    <>
      {/* Botão Mobile Hamburger */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:text-orange-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Overlay Escuro Animado */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl md:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex
      `}>
        
        {/* LOGO */}
        <div className="flex items-center justify-between h-24 px-8 border-b border-gray-50">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              VIRONE <span className="text-orange-600">LANCHES</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Painel Ativo</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-700 transition-colors" onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* NAVEGAÇÃO ANIMADA */}
        <nav className="flex-1 px-4 py-8 space-y-2.5 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Principal</p>
          </div>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 text-white' 
                    : 'text-gray-500 hover:bg-orange-50/80 hover:text-orange-600'
                  }
                `}
              >
                {/* Efeito de brilho no hover (só para inativos) */}
                {!isActive && <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />}

                <div className="flex items-center gap-4 relative z-10">
                  {/* O ícone pula levemente (scale) e gira no hover */}
                  <item.icon 
                    size={22} 
                    className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600 group-hover:scale-110 group-hover:-rotate-3'}`} 
                  />
                  <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                    {item.nome}
                  </span>
                </div>

                {/* Setinha sutil que desliza da esquerda para a direita no hover */}
                <ChevronRight 
                  size={16} 
                  className={`transition-all duration-300 transform ${isActive ? 'text-orange-200 translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} 
                />
              </Link>
            );
          })}
        </nav>

        {/* RODAPÉ E LOGOUT */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/50">
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-transparent hover:border-red-100"
          >
            <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-semibold text-sm">Encerrar Sessão</span>
          </button>
        </div>
        
      </aside>
    </>
  );
}
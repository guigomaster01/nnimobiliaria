'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Columns3,
  Headphones,
  BarChart3,
  CheckSquare,
  Megaphone,
  Sparkles,
  Compass,
  GraduationCap,
  Building2,
  Moon,
  Sun,
  Download,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode, isSidebarCollapsed, toggleSidebar } = useCrm();
  const { user, signOut } = useAuth();

  const operacaoLinks = [
    { label: 'Início', href: '/', icon: LayoutGrid },
    { label: 'Kanban', href: '/kanban', icon: Columns3 },
    { label: 'Atendimento Ao Vivo', href: '/chat-omnichannel', icon: Headphones },
    { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { label: 'Minhas Tarefas', href: '/tarefas', icon: CheckSquare },
    { label: 'Marketing', href: '/marketing', icon: Megaphone }
  ];

  const inteligenciaLinks = [
    { label: 'IA Copilot', href: '/ia', icon: Sparkles },
    { label: 'Prospecção IA', href: '/prospeccao-ia', icon: Compass },
    { label: 'Treinamento', href: '/treinamento', icon: GraduationCap }
  ];

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        {!isSidebarCollapsed ? (
          <>
            <Link href="/" className="sidebar-brand">
              <img
                src="/logoNN.png"
                alt="Nosso Negócio"
                className="brand-logo-img"
              />
              <div className="brand-title-wrap">
                <span className="brand-name-arch">Nosso Negócio</span>
                <span className="brand-sub-arch">CRM Imobiliário</span>
              </div>
            </Link>
            <button
              className="collapse-btn"
              onClick={toggleSidebar}
              title="Recolher menu lateral"
              aria-label="Recolher menu lateral"
            >
              <PanelLeftClose size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <img
              src="/logoNN.png"
              alt="Nosso Negócio"
              className="brand-logo-img"
              style={{ cursor: 'pointer' }}
              onClick={toggleSidebar}
              title="Clique para expandir"
            />
            <button
              className="collapse-btn"
              onClick={toggleSidebar}
              title="Expandir menu lateral"
              aria-label="Expandir menu lateral"
            >
              <PanelLeftOpen size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Nav Container */}
      <div className="sidebar-nav-container">
        {/* Operação Section */}
        <div className="sidebar-nav-section">
          <div className="sidebar-section-title">OPERAÇÃO</div>
          <ul className="sidebar-menu">
            {operacaoLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Inteligência Section */}
        <div className="sidebar-nav-section">
          <div className="sidebar-section-title">INTELIGÊNCIA</div>
          <ul className="sidebar-menu">
            {inteligenciaLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer Profile & Actions */}
      <div className="sidebar-footer">
        <div className="user-card-arch" title={isSidebarCollapsed ? `${user?.displayName || 'Guilherme Martins'} (${user?.role || 'Administrador'})` : undefined}>
          <div className="user-avatar-arch">
            {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'GM'}
          </div>
          <div className="user-info-wrap" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span className="user-name-arch">{user?.displayName || 'Guilherme Martins'}</span>
            <span className="user-role-arch">{user?.role || 'Administrador'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link
            href="/configuracoes"
            className="sidebar-action-btn"
            title={isSidebarCollapsed ? 'Configurações da Empresa' : undefined}
          >
            <Building2 size={16} />
            <span>Config. Empresa</span>
          </Link>

          <button
            className="sidebar-action-btn"
            onClick={toggleDarkMode}
            title={isSidebarCollapsed ? (isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro') : undefined}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          <button
            className="sidebar-action-btn"
            onClick={() => alert('Aplicativo PWA pronto para instalação.')}
            title={isSidebarCollapsed ? 'Instalar App' : undefined}
          >
            <Download size={16} />
            <span>Instalar App</span>
          </button>

          <button
            className="sidebar-action-btn"
            onClick={() => {
              if (confirm('Deseja realmente sair da sua conta?')) {
                signOut();
              }
            }}
            title={isSidebarCollapsed ? 'Sair do Sistema' : undefined}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

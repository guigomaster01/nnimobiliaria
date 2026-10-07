'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { CrmProvider } from '../context/CrmContext';
import { Sidebar } from './Sidebar';
import { LeadModal } from './LeadModal';
import { TaskModal } from './TaskModal';
import { QuickActionFab } from './QuickActionFab';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AuthProvider>
      <CrmProvider>
        {isLoginPage ? (
          <main style={{ minHeight: '100vh', width: '100vw' }}>
            {children}
          </main>
        ) : (
          <div className="app-layout">
            <Sidebar />
            <main className="main-viewport">
              {children}
            </main>
            <LeadModal />
            <TaskModal />
            <QuickActionFab />
          </div>
        )}
      </CrmProvider>
    </AuthProvider>
  );
}

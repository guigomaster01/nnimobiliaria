'use client';

import React, { useState } from 'react';
import { Plus, UserPlus, CheckSquare, MessageSquare, Zap } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export function QuickActionFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { openNewLeadModal, openNewTaskModal, triggerMotorAcao } = useCrm();

  return (
    <div className="fab-container">
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '68px',
            right: '0',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-lg)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minWidth: '190px',
            zIndex: 110,
            animation: 'modalEnter 0.15s ease-out'
          }}
        >
          <button
            className="sidebar-action-btn"
            style={{ color: 'var(--text-main)', padding: '10px 12px' }}
            onClick={() => {
              setIsOpen(false);
              openNewLeadModal();
            }}
          >
            <UserPlus size={16} color="#2563eb" />
            <span>Novo Lead</span>
          </button>

          <button
            className="sidebar-action-btn"
            style={{ color: 'var(--text-main)', padding: '10px 12px' }}
            onClick={() => {
              setIsOpen(false);
              openNewTaskModal();
            }}
          >
            <CheckSquare size={16} color="#16a34a" />
            <span>Nova Tarefa</span>
          </button>

          <button
            className="sidebar-action-btn"
            style={{ color: 'var(--text-main)', padding: '10px 12px' }}
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/chat-omnichannel';
            }}
          >
            <MessageSquare size={16} color="#0891b2" />
            <span>Chat Ao Vivo</span>
          </button>

          <button
            className="sidebar-action-btn"
            style={{ color: 'var(--text-main)', padding: '10px 12px' }}
            onClick={() => {
              setIsOpen(false);
              triggerMotorAcao();
            }}
          >
            <Zap size={16} color="#f59e0b" />
            <span>Motor de Ação</span>
          </button>
        </div>
      )}

      <button
        className="fab-main-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Ações Rápidas"
        aria-label="Ações Rápidas"
      >
        <Plus size={24} />
        <span className="fab-badge">9+</span>
      </button>
    </div>
  );
}

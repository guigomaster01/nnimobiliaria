'use client';

import React, { useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Download,
  Plus,
  Flame,
  Star,
  Megaphone,
  User,
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { LeadStatus } from '../../types/crm';
import { SALES_REPRESENTATIVES } from '../../data/mockData';

interface ColumnDef {
  id: LeadStatus;
  title: string;
  count: number;
  totalValue: number;
  borderTopColor: string;
  badgeBg: string;
}

export default function KanbanPage() {
  const {
    leads,
    moveLeadStatus,
    openNewLeadModal,
    openLeadDetailModal,
    funnels,
    selectedFunnelId,
    setSelectedFunnelId
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRep, setSelectedRep] = useState('Todos os vendedores');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredLeads = leads.filter((lead) => {
    if (selectedFunnelId && selectedFunnelId !== 'all' && lead.funnelId !== selectedFunnelId) {
      return false;
    }
    if (selectedRep !== 'Todos os vendedores' && lead.assignedTo !== selectedRep) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchOrigin = lead.origin.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchOrigin) return false;
    }
    return true;
  });

  const columns: ColumnDef[] = [
    {
      id: 'novo_lead',
      title: 'NOVO LEAD',
      count: filteredLeads.filter((l) => l.status === 'novo_lead').length,
      totalValue: filteredLeads
        .filter((l) => l.status === 'novo_lead')
        .reduce((sum, l) => sum + (l.value || 0), 0),
      borderTopColor: '#2563eb',
      badgeBg: '#eff6ff'
    },
    {
      id: 'em_relacionamento',
      title: 'EM RELACIONAMENTO',
      count: filteredLeads.filter((l) => l.status === 'em_relacionamento').length,
      totalValue: filteredLeads
        .filter((l) => l.status === 'em_relacionamento')
        .reduce((sum, l) => sum + (l.value || 0), 0),
      borderTopColor: '#0284c7',
      badgeBg: '#e0f2fe'
    },
    {
      id: 'agendamento',
      title: 'AGENDAMENTO',
      count: filteredLeads.filter((l) => l.status === 'agendamento').length,
      totalValue: filteredLeads
        .filter((l) => l.status === 'agendamento')
        .reduce((sum, l) => sum + (l.value || 0), 0),
      borderTopColor: 'var(--brand-terracotta)',
      badgeBg: 'var(--brand-terracotta-light)'
    },
    {
      id: 'atendimento',
      title: 'ATENDIMENTO',
      count: filteredLeads.filter((l) => l.status === 'atendimento').length,
      totalValue: filteredLeads
        .filter((l) => l.status === 'atendimento')
        .reduce((sum, l) => sum + (l.value || 0), 0),
      borderTopColor: '#16a34a',
      badgeBg: '#f0fdf4'
    },
    {
      id: 'ganho',
      title: 'VENDA GANHA 🎉',
      count: filteredLeads.filter((l) => l.status === 'ganho').length,
      totalValue: filteredLeads
        .filter((l) => l.status === 'ganho')
        .reduce((sum, l) => sum + (l.value || 0), 0),
      borderTopColor: '#10b981',
      badgeBg: '#d1fae5'
    }
  ];

  const exportCsv = () => {
    const headers = ['Nome,Telefone,Email,Valor,Etapa,Corretor,Origem,Data'];
    const rows = leads.map(
      (l) =>
        `"${l.name}","${l.phone}","${l.email}",${l.value},"${l.status}","${l.assignedTo}","${l.origin}","${l.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getNextStage = (curr: LeadStatus): LeadStatus | null => {
    if (curr === 'novo_lead') return 'em_relacionamento';
    if (curr === 'em_relacionamento') return 'agendamento';
    if (curr === 'agendamento') return 'atendimento';
    if (curr === 'atendimento') return 'ganho';
    return null;
  };

  const getPrevStage = (curr: LeadStatus): LeadStatus | null => {
    if (curr === 'ganho') return 'atendimento';
    if (curr === 'atendimento') return 'agendamento';
    if (curr === 'agendamento') return 'em_relacionamento';
    if (curr === 'em_relacionamento') return 'novo_lead';
    return null;
  };

  return (
    <div className="content-container">
      {/* Page Hero Header */}
      <div className="page-hero-bar">
        <div>
          <h1 className="page-hero-title">FUNIL DE VENDAS // KANBAN</h1>
          <p className="page-hero-subtitle">
            Acompanhe em tempo real o fluxo de oportunidades, visitas e negociações da equipe.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportCsv} className="btn btn-secondary">
            <Download size={13} />
            <span>EXPORTAR CSV</span>
          </button>
          <button onClick={openNewLeadModal} className="btn btn-primary">
            <Plus size={13} />
            <span>NOVO LEAD</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          background: 'var(--bg-card)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '320px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-color)'
            }}
          >
            <select
              value={selectedFunnelId}
              onChange={(e) => setSelectedFunnelId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <option value="all">Todas as Praças / Funis</option>
              {funnels.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              flex: 1,
              maxWidth: '380px'
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou origem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '12.5px',
                color: 'var(--text-main)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {SALES_REPRESENTATIVES.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xs)',
              padding: '2px'
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                background: viewMode === 'kanban' ? '#0f172a' : 'transparent',
                color: viewMode === 'kanban' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Kanban"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#0f172a' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Lista"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Board Columns */}
      {viewMode === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(280px, 1fr))',
            gap: '16px',
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: '20px'
          }}
        >
          {columns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.id);

            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '680px'
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    borderTop: `3px solid ${col.borderTopColor}`,
                    borderBottom: '1px solid var(--border-color)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-main)'
                      }}
                    >
                      {col.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: col.badgeBg,
                        color: col.borderTopColor
                      }}
                    >
                      {col.count}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    R$ {col.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Leads List */}
                <div
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: '75vh'
                  }}
                >
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => openLeadDetailModal(lead.id)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand-terracotta)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Name & Avatar */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.3 }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-terracotta)', marginTop: '2px' }}>
                            R$ {lead.value.toLocaleString('pt-BR')}
                          </div>
                        </div>

                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '3px',
                            background: '#0f172a',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {lead.assignedTo.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {lead.isNewForYou && (
                          <span className="badge badge-new" style={{ fontSize: '10px' }}>
                            <Star size={10} /> Novo pra você
                          </span>
                        )}
                        {lead.temperature === 'quente' && (
                          <span className="badge badge-hot" style={{ fontSize: '10px' }}>
                            <Flame size={10} /> Quente
                          </span>
                        )}
                        {lead.temperature === 'morno' && (
                          <span className="badge badge-warm" style={{ fontSize: '10px' }}>
                            🟡 Morno
                          </span>
                        )}
                        {lead.temperature === 'frio' && (
                          <span className="badge badge-cold" style={{ fontSize: '10px' }}>
                            ❄️ Frio
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Megaphone size={12} color="var(--brand-terracotta)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lead.origin}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={12} color="var(--text-muted)" />
                          <span>{lead.assignedTo}</span>
                        </div>

                        {lead.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={12} color="var(--text-muted)" />
                              <span>{lead.phone}</span>
                            </div>

                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Conversar no WhatsApp"
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '3px',
                                background: '#dcfce7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#16a34a',
                                textDecoration: 'none'
                              }}
                            >
                              <MessageCircle size={13} />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-light)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {lead.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: 'var(--bg-subtle)',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                fontSize: '10.5px',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '3px' }}>
                          {getPrevStage(lead.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const prev = getPrevStage(lead.status);
                                if (prev) moveLeadStatus(lead.id, prev);
                              }}
                              title="Etapa anterior"
                              style={{
                                background: 'var(--bg-subtle)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '3px',
                                padding: '3px 5px',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <ChevronLeft size={12} />
                            </button>
                          )}
                          {getNextStage(lead.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = getNextStage(lead.status);
                                if (next) moveLeadStatus(lead.id, next);
                              }}
                              title="Avançar etapa"
                              style={{
                                background: '#0f172a',
                                border: '1px solid var(--brand-terracotta)',
                                borderRadius: '3px',
                                padding: '3px 5px',
                                cursor: 'pointer',
                                color: '#ffffff'
                              }}
                            >
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nome</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Contato</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Valor (VGV)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Etapa</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Responsável</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Origem</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openLeadDetailModal(lead.id)}
                  style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {lead.name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{lead.phone}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--brand-terracotta)' }}>
                    R$ {lead.value.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-warm">{lead.status.replace('_', ' ').toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{lead.assignedTo}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {lead.origin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

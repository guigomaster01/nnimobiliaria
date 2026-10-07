'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { SALES_REPRESENTATIVES } from '../../data/mockData';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<
    'origem' | 'motivo_etapa' | 'carteira' | 'cadastrei' | 'trafego' | 'usuarios'
  >('origem');

  const [statusFilter, setStatusFilter] = useState('Todos');
  const [funnelFilter, setFunnelFilter] = useState('Todos os funis');
  const [regionalFilter, setRegionalFilter] = useState('Todas as regionais');
  const [corretorFilter, setCorretorFilter] = useState('Todos os corretores');
  const [origemFilter, setOrigemFilter] = useState('Todas as origens');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-06');

  const originBreakdown = [
    { origin: 'LEAD FORM - CASA UBITI - SO', leads: 94, emAtendimento: 24, visitas: 8, ganhos: 1, vgv: 1450000, taxa: '1.06%' },
    { origin: 'LEAD FORM - RESERVA VILLE - SO', leads: 62, emAtendimento: 18, visitas: 5, ganhos: 0, vgv: 0, taxa: '0.00%' },
    { origin: 'LEAD FORM - GRAN CAMPOLIM', leads: 48, emAtendimento: 14, visitas: 7, ganhos: 0, vgv: 0, taxa: '0.00%' },
    { origin: 'Facebook/Instagram Ads', leads: 35, emAtendimento: 9, visitas: 3, ganhos: 0, vgv: 0, taxa: '0.00%' },
    { origin: 'Digital Corretor', leads: 22, emAtendimento: 6, visitas: 2, ganhos: 0, vgv: 0, taxa: '0.00%' },
    { origin: 'Rede de Relacionamento', leads: 16, emAtendimento: 5, visitas: 4, ganhos: 0, vgv: 0, taxa: '0.00%' },
    { origin: 'Portal Imobiliário (Zap/VivaReal)', leads: 10, emAtendimento: 2, visitas: 1, ganhos: 0, vgv: 0, taxa: '0.00%' }
  ];

  const exportExcel = () => {
    const headers = ['Canal de Origem,Total Leads,Em Atendimento,Visitas,Ganhos,VGV (R$),Taxa Conversao'];
    const rows = originBreakdown.map(
      (item) =>
        `"${item.origin}",${item.leads},${item.emAtendimento},${item.visitas},${item.ganhos},${item.vgv},"${item.taxa}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_analitico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-container">
      {/* Page Hero Header */}
      <div className="page-hero-bar">
        <div>
          <h1 className="page-hero-title">RELATÓRIOS // PERFORMANCE</h1>
          <p className="page-hero-subtitle">
            Cadastros por corretor, canal de origem e campanhas de tráfego pago da imobiliária.
          </p>
        </div>

        <button onClick={exportExcel} className="btn btn-primary">
          <FileSpreadsheet size={14} />
          <span>EXPORTAR EXCEL</span>
        </button>
      </div>

      {/* Filters Box */}
      <div className="card" style={{ marginBottom: '22px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-main)', marginBottom: '14px' }}>
          Filtros de Pesquisa
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Ativos">Ativos</option>
              <option value="Ganhos">Ganhos</option>
              <option value="Perdidos">Perdidos</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Funil</label>
            <select className="form-select" value={funnelFilter} onChange={(e) => setFunnelFilter(e.target.value)}>
              <option value="Todos os funis">Todos os funis</option>
              <option value="Funil Sorocaba">Funil Sorocaba</option>
              <option value="Funil São Paulo">Funil São Paulo</option>
              <option value="Funil Campinas">Funil Campinas</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Regional</label>
            <select className="form-select" value={regionalFilter} onChange={(e) => setRegionalFilter(e.target.value)}>
              <option value="Todas as regionais">Todas as regionais</option>
              <option value="Interior SP">Interior SP</option>
              <option value="Grande SP">Grande SP</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Corretor</label>
            <select className="form-select" value={corretorFilter} onChange={(e) => setCorretorFilter(e.target.value)}>
              {SALES_REPRESENTATIVES.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Canal de Origem</label>
            <select className="form-select" value={origemFilter} onChange={(e) => setOrigemFilter(e.target.value)}>
              <option value="Todas as origens">Todas as origens</option>
              <option value="Meta Ads">Facebook / Instagram Ads</option>
              <option value="Google Ads">Google Ads Pesquisa</option>
              <option value="Portais">Portais Imobiliários</option>
              <option value="Indicação">Rede de Indicação</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Data inicial</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data final</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'origem', label: 'Por Origem' },
          { id: 'motivo_etapa', label: 'Motivo x Etapa' },
          { id: 'carteira', label: 'Carteira atual' },
          { id: 'cadastrei', label: 'Eu cadastrei' },
          { id: 'trafego', label: 'Tráfego Pago' },
          { id: 'usuarios', label: 'Usuários' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: isActive ? 'var(--brand-terracotta)' : 'var(--border-color)',
                background: isActive ? '#0f172a' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '11.5px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Analytics Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Compass size={16} color="var(--brand-terracotta)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                Por Origem — Origem x Etapa
              </span>
              <span className="badge badge-warm" style={{ fontSize: '10.5px' }}>
                Consolidado por slug
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              30/09/2026 a 05/10/2026 · Todos os funis
            </div>
          </div>
        </div>

        {/* 4 Cards Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Total de leads
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', margin: '4px 0 2px' }}>
              287
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              11 origens
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>
              Ganhos
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', margin: '4px 0 2px' }}>
              1
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
              0.3% de conversão
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--brand-terracotta)', fontWeight: 600 }}>
              VGV
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', margin: '4px 0 2px' }}>
              R$ 205k
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Valor Geral de Vendas
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
              VGC
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', margin: '4px 0 2px' }}>
              —
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Valor Gerado de Comissão
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Canal de Origem</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Leads</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Atendimento</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Visitas</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Ganhos</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Taxa Conversão</th>
              </tr>
            </thead>
            <tbody>
              {originBreakdown.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {row.origin}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>
                    {row.leads}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#0284c7' }}>
                    {row.emAtendimento}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#16a34a' }}>
                    {row.visitas}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: row.ganhos > 0 ? '#16a34a' : 'var(--text-muted)' }}>
                    {row.ganhos}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>
                    {row.taxa}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

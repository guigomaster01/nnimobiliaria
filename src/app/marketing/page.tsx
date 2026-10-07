'use client';

import React from 'react';
import { Megaphone, Send, Target, Sparkles, TrendingUp } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="content-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Megaphone size={24} color="#2563eb" />
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Marketing & Campanhas</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Campanhas Ativas</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>8</div>
          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Meta Ads & Google Ads</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Custo por Lead (CPL Médio)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>R$ 14,80</div>
          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>-12% este mês</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Investido (Outubro)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>R$ 4.250,00</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Orçamento mensal: R$ 8.000</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Disparos de Automação & WhatsApp</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Configure gatilhos automáticos para nutrição de leads que chegam pelos formulários do Facebook, Instagram e Google.
        </p>
        <button className="btn btn-primary" onClick={() => alert('Automação pronta para integração via webhook.')}>
          <Send size={15} />
          Nova Campanha de Disparo
        </button>
      </div>
    </div>
  );
}

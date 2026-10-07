'use client';

import React from 'react';
import { Compass, Users, PhoneCall, CheckCircle, Search } from 'lucide-react';

export default function ProspeccaoIaPage() {
  return (
    <div className="content-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Compass size={24} color="#0891b2" />
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Prospecção Ativa com IA</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Encontrar Compradores Qualificados</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          O motor de inteligência artificial cruza dados demográficos e intenção de compra para sugerir novos contatos potenciais para os lançamentos da imobiliária.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Leads Pré-qualificados</div>
            <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>142</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Prontos para distribuição</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Score Médio de Afinidade</div>
            <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>88.4%</div>
            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Alta propensão à compra</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Taxa de Resposta Estimada</div>
            <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>34%</div>
            <div style={{ fontSize: '11px', color: '#0891b2', fontWeight: 600 }}>Via WhatsApp oficial</div>
          </div>
        </div>
      </div>
    </div>
  );
}
